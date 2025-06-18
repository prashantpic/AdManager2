import { AuditLogEntryDto } from './dtos/audit-log.dto';

export interface IAuditClient {
  log(entry: Omit<AuditLogEntryDto, 'timestamp' | 'id' | 'serviceName'>): Promise<void>;
}