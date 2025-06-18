import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { AuditAction, AuditStatus } from '../enums/audit-action.enum';

export class AuditLogEntryDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  timestamp: Date;

  @IsOptional()
  @IsUUID() // Assuming userId is a UUID
  userId?: string;

  @IsNotEmpty()
  @IsString() // Can be an AuditAction enum value or a custom string for flexibility
  action: AuditAction | string;

  @IsOptional()
  @IsString()
  actorType?: string; // e.g., 'USER', 'SYSTEM', 'API_KEY'

  @IsOptional()
  @IsString()
  resourceType?: string; // e.g., 'CAMPAIGN', 'USER_PROFILE', 'AD_SET'

  @IsOptional()
  @IsString() // Could be UUID or other identifier
  resourceId?: string;

  @IsNotEmpty()
  @IsEnum(AuditStatus)
  status: AuditStatus;

  @IsOptional()
  @IsString()
  sourceIp?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  /**
   * Name of the microservice that generated this audit log.
   * This is typically auto-injected by the AuditClientService.
   */
  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>; // For additional contextual information, like changes made

  @IsOptional()
  @IsUUID()
  correlationId?: string;
}