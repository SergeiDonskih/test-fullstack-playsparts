import {
  checkAccessRequest,
  loginRequest,
  logoutRequest,
  refreshRequest,
} from '~/services/auth.service';
import { getApiErrorMessage } from './useApiError';
import type { AuthUser } from '~/types/auth';

export const useAuth = () => {
  const accessToken = useState<string | null>('auth_access_token', () => null);
  const user = useState<AuthUser | null>('auth_user', () => null);
  const bootstrapped = useState<boolean>('auth_bootstrapped', () => false);
  const loading = useState<boolean>('auth_loading', () => false);
  const error = useState<string | null>('auth_error', () => null);

  const isAuthenticated = computed(() => Boolean(accessToken.value && user.value));
  const isAdmin = computed(() => user.value?.role === 'admin');

  const setSession = (nextAccessToken: string, nextUser: AuthUser): void => {
    accessToken.value = nextAccessToken;
    user.value = nextUser;
    bootstrapped.value = true;
  };

  const clearSession = (): void => {
    accessToken.value = null;
    user.value = null;
  };

  const login = async (email: string, password: string): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await loginRequest({ email, password });
      setSession(response.accessToken, response.user);
    } catch (e) {
      clearSession();
      error.value = getApiErrorMessage(e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const refresh = async (): Promise<boolean> => {
    try {
      const response = await refreshRequest();
      setSession(response.accessToken, response.user);
      return true;
    } catch {
      clearSession();
      return false;
    }
  };

  const checkAccess = async (): Promise<boolean> => {
    if (!accessToken.value) {
      return refresh();
    }
    try {
      const response = await checkAccessRequest();
      user.value = {
        id: response.user.userId,
        email: response.user.email,
        role: response.user.role,
      };
      return true;
    } catch {
      return refresh();
    }
  };

  const ensureSession = async (): Promise<boolean> => {
    if (bootstrapped.value) {
      return isAuthenticated.value;
    }

    const ok = await checkAccess();
    bootstrapped.value = true;
    return ok && isAuthenticated.value;
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutRequest();
    } finally {
      clearSession();
      bootstrapped.value = true;
      await navigateTo('/login');
    }
  };

  return {
    user,
    accessToken,
    bootstrapped,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    refresh,
    checkAccess,
    ensureSession,
    logout,
  };
};
