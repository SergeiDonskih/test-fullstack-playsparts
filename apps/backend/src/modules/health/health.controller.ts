import { Controller, Get } from '@nestjs/common';
import { Public } from '../../framework/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';

interface HealthStatusResponse {
  status: 'ok';
}

@Controller('health')
export class HealthController {
  constructor(private readonly prismaService: PrismaService) {}

  @Public()
  @Get('live')
  getLive(): HealthStatusResponse {
    return { status: 'ok' };
  }

  @Public()
  @Get('ready')
  async getReady(): Promise<HealthStatusResponse> {
    await this.prismaService.$queryRaw`SELECT 1`;
    return { status: 'ok' };
  }
}
