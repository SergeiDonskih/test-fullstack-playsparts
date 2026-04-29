import type { AxiosResponse } from 'axios';

export interface AdminDataResponse {
  testAdmin: boolean;
  message: string;
}

export async function getAdminDataRequest(): Promise<AdminDataResponse> {
  const { $api } = useNuxtApp();
  const response: AxiosResponse<AdminDataResponse> = await $api.get('/admin/data');
  return response.data;
}
