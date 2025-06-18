import { Global, Module } from '@nestjs/common';
import { LoggingModule } from './logging/logging.module';
import { ConfigModule as KernelConfigModule } from './config/config.module';
import { ErrorsModule } from './errors/errors.module';
import { ValidationModule } from './validation/validation.module';
import { CachingModule as KernelCachingModule } from './caching/caching.module';
import { AuditModule as KernelAuditModule } from './audit/audit.module';

@Global()
@Module({
  imports: [
    KernelConfigModule, // Must be available globally early
    LoggingModule,
    ErrorsModule,
    ValidationModule,
    KernelCachingModule,
    KernelAuditModule,
  ],
  exports: [
    KernelConfigModule,
    LoggingModule,
    ErrorsModule,
    ValidationModule,
    KernelCachingModule,
    KernelAuditModule,
  ],
})
export class CoreModule {}