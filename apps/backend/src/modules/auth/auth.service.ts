import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import { EnvKey, Role, Table } from '@/core/constants';
import type { AuthTokensWithRefresh, IAuthService } from '@/core/interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService implements IAuthService {
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
        EnvKey.JWT_EXPIRES_IN,
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
        EnvKey.JWT_REFRESH_EXPIRES_IN,
        '7d',
      ) as StringValue,
    });
  }

  async login(dto: LoginDto): Promise<AuthTokensWithRefresh> {
    const [user] = await this.prismaService.$queryRaw<
      Array<{
        id: number;
        email: string;
        password_hash: string;
        role: Role;
      }>
    >`SELECT id, email, password_hash, role FROM ${Prisma.raw(Table.AppUser)} WHERE email = ${dto.email} LIMIT 1`;

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
      UPDATE ${Prisma.raw(Table.AppUser)}
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
      role: Role;
    }>(refreshToken, {
      secret: this.configService.get<string>(
        EnvKey.JWT_SECRET,
        'fallback_secret',
      ),
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
