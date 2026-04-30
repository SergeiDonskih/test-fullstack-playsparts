import { Role } from '@/core/constants';

export class AuthResponseDto {
  accessToken!: string;
  user!: {
    id: number;
    email: string;
    role: Role;
  };
}
