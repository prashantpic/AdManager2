import { Injectable, Inject } from '@nestjs/common';
import { IAuditLogService } from '../interfaces/audit-log.service.interface';
import { AuditEntryDto } from '../dtos/audit-entry.dto';
import { ILoggerService } from '../../logging/interfaces/logger.service.interface';
import { LOGGER_SERVICE_TOKEN } from '../../logging/constants/logging.constants';
import { IConfigService } from '../../config/interfaces/config.service.interface';
import { CONFIG_SERVICE_TOKEN } from '../../config/constants/config.constants';

@Injectable()
export class AuditLogService implements IAuditLogService {
  private readonly serviceName: string;

  constructor(
    @Inject(LOGGER_SERVICE_TOKEN) private readonly logger: ILoggerService,
    @Inject(CONFIG_SERVICE_TOKEN) private readonly configService: IConfigService,
  ) {
    this.serviceName = this.configService.get('SERVICE_NAME') || 'unknown-service';
  }

  async logAction(entry: Omit<AuditEntryDto, 'serviceName' | 'timestamp'>): Promise<void> {
    const auditEntry: AuditEntryDto = {
        ...entry,
        timestamp: entry.timestamp || new Date(), // Use provided timestamp or current
        serviceName: this.serviceName,
    };
    
    // For the shared kernel, we log it using the standard logger with a specific context or level.
    // In a real system, this might push to SQS, Kinesis, or a dedicated audit database.
    this.logger.log(
        `AUDIT: [${auditEntry.actorType}:${auditEntry.actorId}] ${auditEntry.action} on ${auditEntry.targetResource || 'N/A'}${auditEntry.targetResourceId ? ':' + auditEntry.targetResourceId : ''} - ${auditEntry.status}`,
        'AuditLogService', // context for the logger
        auditEntry // Pass the full entry as metadata
    );
    // No actual async operation here for this basic kernel version
    return Promise.resolve();
  }
}