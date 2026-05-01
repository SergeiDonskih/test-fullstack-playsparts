import type { AxiosInstance } from 'axios';
import { createHttpClient } from '~/utils/http-client';
import type { AuthUser } from '~/types/auth';

declare module '#app' {
  interface NuxtApp {
    $api: AxiosInstance;
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const accessToken = useState<string | null>('auth_access_token', () => null);
  const user = useState<AuthUser | null>('auth_user', () => null);
  const bootstrapped = useState<boolean>('auth_bootstrapped', () => false);

  const api = createHttpClient({
    baseURL: config.public.apiBaseUrl,
    getAccessToken: () => accessToken.value,
    onSessionRefreshed: (nextAccessToken, nextUser) => {
      accessToken.value = nextAccessToken;
      user.value = nextUser;
      bootstrapped.value = true;
    },
    onRefreshFailed: () => {
      accessToken.value = null;
      user.value = null;
      bootstrapped.value = true;
    },
  });

  return {
    provide: {
      api,
    },
  };
});
