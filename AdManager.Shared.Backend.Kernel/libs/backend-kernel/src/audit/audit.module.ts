import { Module, Global } from '@nestjs/common';
import { IAuditLogService } from './interfaces/audit-log.service.interface';
import { AuditLogService } from './services/audit-log.service';
import { LoggingModule } from '../logging/logging.module';
import { ConfigModule as KernelConfigModule } from '../config/config.module';

@Global() // Audit service is often needed globally
@Module({
  imports: [LoggingModule, KernelConfigModule], // AuditLogService depends on Logger and Config
  providers: [
    {
      provide: IAuditLogService,
      useClass: AuditLogService,
    },
  ],
  exports: [IAuditLogService],
})
export class AuditModule {}