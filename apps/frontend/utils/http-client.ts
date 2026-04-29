import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { AuthUser, LoginResponse } from '~/types/auth';

interface CreateHttpClientParams {
  baseURL: string;
  getAccessToken: () => string | null;
  onSessionRefreshed?: (nextAccessToken: string, nextUser: AuthUser) => void;
  onRefreshFailed?: () => void;
}

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _skipAuthRefresh?: boolean;
}

export function createHttpClient(params: CreateHttpClientParams): AxiosInstance {
  const api = axios.create({
    baseURL: params.baseURL.replace(/\/$/, ''),
    withCredentials: true, // для refresh cookie
    timeout: 8000,
  });

  api.interceptors.request.use((config) => {
    const nextConfig = config as RetriableRequestConfig;
    if (nextConfig._skipAuthRefresh) {
      return nextConfig;
    }

    const accessToken = params.getAccessToken();
    if (accessToken) {
      nextConfig.headers.Authorization = `Bearer ${accessToken}`;
    }
    return nextConfig;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        throw error;
      }

      const originalRequest = error.config as RetriableRequestConfig | undefined;
      const status = error.response?.status;
      const requestUrl = originalRequest?.url ?? '';

      const isAuthRoute =
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/refresh') ||
        requestUrl.includes('/auth/logout');

      if (!originalRequest || status !== 401 || originalRequest._retry || originalRequest._skipAuthRefresh || isAuthRoute) {
        throw error;
      }

      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post<LoginResponse>(
          '/auth/refresh',
          undefined,
          { _skipAuthRefresh: true } as RetriableRequestConfig,
        );

        params.onSessionRefreshed?.(refreshResponse.data.accessToken, refreshResponse.data.user);

        const nextAccessToken = params.getAccessToken();
        if (nextAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        params.onRefreshFailed?.();
        throw refreshError;
      }
    },
  );

  return api;
}
