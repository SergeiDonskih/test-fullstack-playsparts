import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/framework/decorators/roles.decorator';
import { AdminDataResponseDto } from './dto/admin-data-response.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  @Get('data')
  @Roles('admin')
  @ApiOperation({ summary: 'Admin-only data endpoint' })
  getAdminData(): AdminDataResponseDto {
    return {
      testAdmin: true,
      message: 'Данные админа доступны',
    };
  }
}
