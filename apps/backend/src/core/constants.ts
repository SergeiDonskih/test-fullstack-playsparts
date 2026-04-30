/**
 * Централизованные константы для масштабирования: DI, домен, API, ошибки.
 */

export enum Environment {
  Development = 'development',
  Production = 'production',
}

export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
}

export enum Table {
  AppUser = 'app_users',
}

export enum Repository {
  Database = 'database',
  AppUser = 'app_user',
}

export enum ServiceToken {
  AuthService = 'auth.service',
}

export const ApiSegment = {
  Prefix: 'api',
  Version: 'v1',
  Auth: 'auth',
  Admin: 'admin',
  Health: 'health',
} as const;

export function getAuthApiBasePath(): string {
  return `/${ApiSegment.Prefix}/${ApiSegment.Version}/${ApiSegment.Auth}`;
}

export enum CookieName {
  RefreshToken = 'refresh_token',
}

export const RefreshCookieMaxAgeMs = 7 * 24 * 60 * 60 * 1000;

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export const EnvKey = {
  DATABASE_URL: 'DATABASE_URL',
  JWT_SECRET: 'JWT_SECRET',
  JWT_EXPIRES_IN: 'JWT_EXPIRES_IN',
  JWT_REFRESH_EXPIRES_IN: 'JWT_REFRESH_EXPIRES_IN',
  FRONTEND_ORIGIN: 'FRONTEND_ORIGIN',
  BACKEND_PORT: 'BACKEND_PORT',
  NODE_ENV: 'NODE_ENV',
} as const;

export const ErrCode = {
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  REFRESH_TOKEN_MISSING: 'REFRESH_TOKEN_MISSING',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
} as const;

export type ErrCodeValue = (typeof ErrCode)[keyof typeof ErrCode];
