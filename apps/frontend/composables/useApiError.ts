import axios from 'axios';

interface ApiErrorPayload {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    if (Array.isArray(payload?.message) && payload.message.length > 0) {
      return payload.message.join(', ');
    }
    if (typeof payload?.message === 'string' && payload.message.length > 0) {
      return payload.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Unexpected error';
}
