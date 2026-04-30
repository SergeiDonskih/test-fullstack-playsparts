import { SetMetadata } from '@nestjs/common';
import { Role } from '@/core/constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]): ReturnType<typeof SetMetadata> =>
  SetMetadata(ROLES_KEY, roles);
