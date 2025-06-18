import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SystemConfigController } from './api/controllers/system-config.controller.ts';
import { HealthMonitoringController } from './api/controllers/health-monitoring.controller.ts';
import { AuditLogsController } from './api/controllers/audit-logs.controller.ts';
import { MaintenanceController } from './api/controllers/maintenance.controller.ts';
import { PlatformUsersController } from './api/controllers/platform-users.controller.ts';
import { PlatformAdminGuard } from './infrastructure/guards/platform-admin.guard.ts';
import { PlatformAdministrationService } from './application/platform-administration.service.ts';
// IPlatformAdministrationService will be imported by the controllers and the service itself.

@Module({
  imports: [ConfigModule],
  controllers: [
    SystemConfigController,
    HealthMonitoringController,
    AuditLogsController,
    MaintenanceController,
    PlatformUsersController,
  ],
  providers: [
    PlatformAdminGuard,
    {
      provide: 'IPlatformAdministrationService',
      useClass: PlatformAdministrationService,
    },
  ],
})
export class PlatformAdminModule {}