import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

interface AuthTokensResponse extends AuthResponseDto {
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async signAccessToken(payload: {
    sub: number;
    email: string;
    role: 'user' | 'admin';
  }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>(
        'JWT_EXPIRES_IN',
        '15m',
      ) as StringValue,
    });
  }

  private async signRefreshToken(payload: {
    sub: number;
    email: string;
    role: 'user' | 'admin';
  }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_EXPIRES_IN',
        '7d',
      ) as StringValue,
    });
  }

  async login(dto: LoginDto): Promise<AuthTokensResponse> {
    const users = await this.prismaService.$queryRaw<
      Array<{
        id: number;
        email: string;
        password_hash: string;
        role: 'user' | 'admin';
      }>
    >`SELECT id, email, password_hash, role FROM app_users WHERE email = ${dto.email} LIMIT 1`;

    const user = users[0];
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.signAccessToken(payload);
    const refreshToken = await this.signRefreshToken(payload);

    await this.prismaService.$executeRaw`
      UPDATE app_users
      SET last_login_at = NOW()
      WHERE id = ${user.id}
    `;

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string): Promise<AuthResponseDto> {
    const payload = await this.jwtService.verifyAsync<{
      sub: number;
      email: string;
      role: 'user' | 'admin';
    }>(refreshToken, {
      secret: this.configService.get<string>('JWT_SECRET', 'fallback_secret'),
    });

    const accessToken = await this.signAccessToken({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    });

    return {
      accessToken,
      user: {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      },
    };
  }
}
