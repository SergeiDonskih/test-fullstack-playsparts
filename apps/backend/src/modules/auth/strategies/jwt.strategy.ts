import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Prisma } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvKey, Role, Table } from '@/core/constants';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUser } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(EnvKey.JWT_SECRET, ''),
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
    role: Role;
  }): Promise<AuthUser> {
    const [user] = await this.prismaService.$queryRaw<
      Array<{ id: number; email: string; role: Role }>
    >`SELECT id, email, role FROM ${Prisma.raw(Table.AppUser)} WHERE id = ${payload.sub} LIMIT 1`;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
