import { Controller, Get, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlatformAdminGuard } from '../../infrastructure/guards/platform-admin.guard.ts';
import { IPlatformAdministrationService } from '../../application/platform-administration.service.interface.ts';
import { SystemHealthDashboardResponseDto } from '../../domain/dto/health-monitoring/system-health-dashboard.response.dto.ts';

@ApiTags('Platform Administration')
@UseGuards(PlatformAdminGuard)
@Controller('health')
export class HealthMonitoringController {
  constructor(
    @Inject('IPlatformAdministrationService')
    private readonly platformAdminService: IPlatformAdministrationService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get system health dashboard data' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved system health dashboard data.',
    type: SystemHealthDashboardResponseDto,
  })
  async getSystemHealthDashboard(): Promise<SystemHealthDashboardResponseDto> {
    return this.platformAdminService.getSystemHealthDashboard();
  }
}