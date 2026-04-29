import type { AxiosResponse } from 'axios';
import type { CheckAccessResponse, LoginResponse } from '~/types/auth';

interface LoginPayload {
  email: string;
  password: string;
}

interface LogoutResponse {
  success: true;
}

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const { $api } = useNuxtApp();
  const response: AxiosResponse<LoginResponse> = await $api.post('/auth/login', payload);
  return response.data;
}

export async function refreshRequest(): Promise<LoginResponse> {
  const { $api } = useNuxtApp();
  const response: AxiosResponse<LoginResponse> = await $api.post('/auth/refresh');
  return response.data;
}

export async function checkAccessRequest(): Promise<CheckAccessResponse> {
  const { $api } = useNuxtApp();
  const response: AxiosResponse<CheckAccessResponse> = await $api.get('/auth/check-access');
  return response.data;
}

export async function logoutRequest(): Promise<LogoutResponse> {
  const { $api } = useNuxtApp();
  const response: AxiosResponse<LogoutResponse> = await $api.post('/auth/logout');
  return response.data;
}
