import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, IsIn, IsOptional } from 'class-validator';

export const RETENTION_ACTIONS = ['archive', 'anonymize', 'delete', 'review'] as const;
export type RetentionAction = typeof RETENTION_ACTIONS[number];

export class ConfigureRetentionPolicyDto {
  @ApiProperty({
    description: 'Type of data this policy applies to (e.g., "CampaignPerformanceLogs", "PII_ClosedAccounts").',
    example: 'CampaignPerformanceLogs',
  })
  @IsString()
  @IsNotEmpty()
  readonly dataType: string;

  @ApiProperty({
    description: 'Retention period in days. 0 might mean indefinite or controlled by other means.',
    example: 365,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  readonly retentionPeriodDays: number;

  @ApiProperty({
    description: 'Action to take after the retention period expires.',
    enum: RETENTION_ACTIONS,
    example: 'archive',
  })
  @IsString()
  @IsIn(RETENTION_ACTIONS as any)
  @IsNotEmpty()
  readonly actionAfterRetention: RetentionAction;

  @ApiPropertyOptional({
    description: 'Optional description of the retention policy.',
    example: 'Retain campaign performance logs for 1 year, then archive.',
  })
  @IsOptional()
  @IsString()
  readonly description?: string;
}