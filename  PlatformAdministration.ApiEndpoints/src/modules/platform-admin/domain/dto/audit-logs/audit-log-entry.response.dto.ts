import { ApiProperty } from '@nestjs/swagger';

export enum AuditLogStatus {
  Success = 'Success',
  Failure = 'Failure',
}

export class AuditLogEntryResponseDto {
  @ApiProperty({ description: 'Unique ID of the audit log entry.' })
  id: string;

  @ApiProperty({ description: 'Timestamp of when the action occurred.', type: Date })
  timestamp: Date;

  @ApiProperty({ required: false, description: 'ID of the user who performed the action.' })
  userId?: string;

  @ApiProperty({ description: 'Description of the action performed.' })
  action: string;

  @ApiProperty({ required: false, description: 'The type or name of the resource targeted by the action.' })
  targetResource?: string;

  @ApiProperty({ required: false, description: 'The ID of the specific resource instance targeted.' })
  targetResourceId?: string;

  @ApiProperty({ enum: AuditLogStatus, description: 'Status of the action (Success or Failure).' })
  status: AuditLogStatus;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    required: false,
    description: 'Additional details or context about the audit log entry.',
  })
  details?: Record<string, any>;
}