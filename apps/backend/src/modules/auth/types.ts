import { Role } from '@/core/constants';

export type AuthUser = {
  userId: number;
  email: string;
  role: Role;
};
