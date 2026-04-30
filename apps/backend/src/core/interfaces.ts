import type { LoginDto } from '@/modules/auth/dto/login.dto';
import type { AuthResponseDto } from '@/modules/auth/dto/auth-response.dto';

export interface AuthTokensWithRefresh extends AuthResponseDto {
  refreshToken: string;
}

export interface IAuthService {
  login(dto: LoginDto): Promise<AuthTokensWithRefresh>;
  refresh(refreshToken: string): Promise<AuthResponseDto>;
}
