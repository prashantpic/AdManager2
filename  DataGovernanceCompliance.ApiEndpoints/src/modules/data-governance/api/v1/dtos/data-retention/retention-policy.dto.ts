import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsInt, IsBoolean, IsDate, IsNotEmpty, IsIn } from 'class-validator';
import { RETENTION_ACTIONS, RetentionAction } from './configure-retention-policy.dto';


export class RetentionPolicyDto {
  @ApiProperty({
    description: 'Unique identifier for the retention policy.',
    format: 'uuid',
    example: 'b1c2d3e4-f5g6-7890-1234-567890abcdef',
  })
  @IsUUID()
  readonly id: string;

  @ApiProperty({
    description: 'Type of data this policy applies to.',
    example: 'CampaignPerformanceLogs',
  })
  @IsString()
  @IsNotEmpty()
  readonly dataType: string;

  @ApiProperty({
    description: 'Retention period in days.',
    example: 365,
  })
  @IsInt()
  readonly retentionPeriodDays: number;

  @ApiProperty({
    description: 'Action to take after the retention period.',
    enum: RETENTION_ACTIONS,
    example: 'archive',
  })
  @IsString()
  @IsIn(RETENTION_ACTIONS as any)
  @IsNotEmpty()
  readonly actionAfterRetention: RetentionAction;

  @ApiPropertyOptional({
    description: 'Description of the retention policy.',
    example: 'Retain campaign performance logs for 1 year, then archive.',
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    description: 'Indicates if this is a default system policy.',
    example: false,
  })
  @IsBoolean()
  readonly isDefault: boolean;

  @ApiProperty({
    description: 'Timestamp when the policy was created.',
    type: Date,
    example: '2023-01-15T09:00:00.000Z',
  })
  @IsDate()
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of the last update to the policy.',
    type: Date,
    example: '2023-01-16T14:30:00.000Z',
  })
  @IsDate()
  readonly updatedAt: Date;
}