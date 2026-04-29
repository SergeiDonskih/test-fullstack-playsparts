import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
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
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private setRefreshCookie(res: Response, refreshToken: string): void {
    const isProduction =
      this.configService.get<string>('NODE_ENV', 'development') ===
      'production';

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/api/v1/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearRefreshCookie(res: Response): void {
    const isProduction =
      this.configService.get<string>('NODE_ENV', 'development') ===
      'production';

    res.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/api/v1/auth',
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
    const match = cookieHeader.match(/(?:^|; )refresh_token=([^;]+)/);
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
