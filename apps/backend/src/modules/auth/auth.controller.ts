import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import {
  CookieName,
  Environment,
  EnvKey,
  RefreshCookieMaxAgeMs,
  ServiceToken,
  getAuthApiBasePath,
} from '@/core/constants';
import type { IAuthService } from '@/core/interfaces';
import { Public } from '@/framework/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

interface CheckAccessResponse {
  ok: true;
  user: unknown;
}

interface LogoutResponse {
  success: true;
}

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    @Inject(ServiceToken.AuthService)
    private readonly authService: IAuthService,
    private readonly configService: ConfigService,
  ) {}

  private setRefreshCookie(res: Response, refreshToken: string): void {
    const isProduction =
      this.configService.get<Environment>(
        EnvKey.NODE_ENV,
        Environment.Development,
      ) === Environment.Production;

    res.cookie(CookieName.RefreshToken, refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: getAuthApiBasePath(),
      maxAge: RefreshCookieMaxAgeMs,
    });
  }

  private clearRefreshCookie(res: Response): void {
    const isProduction =
      this.configService.get<Environment>(
        EnvKey.NODE_ENV,
        Environment.Development,
      ) === Environment.Production;

    res.clearCookie(CookieName.RefreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: getAuthApiBasePath(),
    });
  }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Login: access token в body, refresh token в HttpOnly cookie',
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const authResult = await this.authService.login(dto);
    this.setRefreshCookie(res, authResult.refreshToken);

    return {
      accessToken: authResult.accessToken,
      user: authResult.user,
    };
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token by HttpOnly refresh cookie' })
  async refresh(@Req() req: Request): Promise<AuthResponseDto> {
    const cookieHeader = req.headers.cookie ?? '';
    const match = cookieHeader.match(
      new RegExp(`(?:^|; )${CookieName.RefreshToken}=([^;]+)`),
    );
    const refreshToken = match ? decodeURIComponent(match[1]) : '';

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    return this.authService.refresh(refreshToken);
  }

  @ApiBearerAuth()
  @Get('check-access')
  @ApiOperation({ summary: 'Check current token access' })
  checkAccess(@Req() req: Request): CheckAccessResponse {
    return { ok: true, user: req.user };
  }

  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Logout: clear refresh cookie' })
  logout(@Res({ passthrough: true }) res: Response): LogoutResponse {
    this.clearRefreshCookie(res);
    return { success: true };
  }
}
