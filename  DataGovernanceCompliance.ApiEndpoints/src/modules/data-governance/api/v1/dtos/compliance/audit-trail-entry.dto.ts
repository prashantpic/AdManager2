import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsDate, IsString, IsOptional, IsObject, IsIP, IsNotEmpty } from 'class-validator';

export class AuditTrailEntryDto {
  @ApiProperty({
    description: 'Unique identifier for the audit trail entry.',
    format: 'uuid',
    example: 'c1d2e3f4-g5h6-7890-1234-567890abcdef',
  })
  @IsUUID()
  readonly id: string;

  @ApiProperty({
    description: 'Timestamp of the audited action.',
    type: Date,
    example: '2023-10-26T12:00:00.000Z',
  })
  @IsDate()
  readonly timestamp: Date;

  @ApiPropertyOptional({
    description: 'Identifier of the user who performed the action (if applicable).',
    example: 'user-uuid-123',
  })
  @IsOptional()
  @IsString() // Could be IsUUID if user IDs are UUIDs
  readonly userId?: string;

  @ApiProperty({
    description: 'Type of actor performing the action (e.g., "User", "System", "MerchantAdmin").',
    example: 'MerchantAdmin',
  })
  @IsString()
  @IsNotEmpty()
  readonly actorType: string;

  @ApiProperty({
    description: 'Description of the action performed (e.g., "ConsentUpdated", "DsrRequestSubmitted").',
    example: 'ConsentUpdated',
  })
  @IsString()
  @IsNotEmpty()
  readonly action: string;

  @ApiPropertyOptional({
    description: 'Contextual details of the action (e.g., changed fields, parameters).',
    type: 'object',
    additionalProperties: true,
    example: { field: 'email_preference', oldValue: false, newValue: true },
  })
  @IsOptional()
  @IsObject()
  readonly details?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'IP address from which the action was performed.',
    example: '203.0.113.45',
  })
  @IsOptional()
  @IsIP()
  readonly ipAddress?: string;

  @ApiPropertyOptional({
    description: 'Type of entity targeted by the action (e.g., "Campaign", "ConsentRecord").',
    example: 'ConsentRecord',
  })
  @IsOptional()
  @IsString()
  readonly targetEntityType?: string;

  @ApiPropertyOptional({
    description: 'Identifier of the entity targeted by the action.',
    example: 'consent-record-uuid-789',
  })
  @IsOptional()
  @IsString()
  readonly targetEntityId?: string;

  @ApiProperty({
    description: 'Status of the action (e.g., "Success", "Failure").',
    example: 'Success',
  })
  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @ApiPropertyOptional({
    description: 'Reason for failure, if the action status is "Failure".',
    example: 'Invalid input parameters.',
  })
  @IsOptional()
  @IsString()
  readonly failureReason?: string;
}