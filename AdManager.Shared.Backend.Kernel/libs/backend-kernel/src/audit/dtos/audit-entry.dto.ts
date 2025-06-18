```typescript
import { IsString, IsDate, IsEnum, IsOptional, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export enum AuditActionStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export enum AuditActorType {
    USER = 'USER',
    SYSTEM = 'SYSTEM',
    API_KEY = 'API_KEY',
}

export class AuditEntryDto {
  @IsDate()
  @Type(() => Date)
  timestamp: Date = new Date();

  @IsOptional()
  @IsString()
  userId?: string;

  @IsEnum(AuditActorType)
  actorType: AuditActorType = AuditActorType.SYSTEM;

  @IsString()
  actorId: string;

  @IsString()
  action: string;

  @IsOptional()
  @IsString()
  targetResource?: string;

  @IsOptional()
  @IsString()
  targetResourceId?: string;

  @IsEnum(AuditActionStatus)
  status: AuditActionStatus;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsString()
  serviceName: string;

  @IsOptional()
  @IsString()
  correlationId?: string;
}
```