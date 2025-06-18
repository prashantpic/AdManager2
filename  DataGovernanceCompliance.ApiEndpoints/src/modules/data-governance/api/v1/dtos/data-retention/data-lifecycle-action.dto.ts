import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn, IsOptional, IsObject } from 'class-validator';

export const LIFECYCLE_ACTIONS = ['archive_now', 'purge_now', 'anonymize_now'] as const;
export type LifecycleAction = typeof LIFECYCLE_ACTIONS[number];

export class DataLifecycleActionDto {
  @ApiProperty({
    description: 'Type of data to perform the lifecycle action on.',
    example: 'PII_ClosedAccounts',
  })
  @IsString()
  @IsNotEmpty()
  readonly dataType: string;

  @ApiProperty({
    description: 'The lifecycle action to perform immediately.',
    enum: LIFECYCLE_ACTIONS,
    example: 'purge_now',
  })
  @IsString()
  @IsIn(LIFECYCLE_ACTIONS as any)
  @IsNotEmpty()
  readonly action: LifecycleAction;

  @ApiPropertyOptional({
    description: 'Criteria for selecting specific data for the action (e.g., based on merchantId, date range).',
    example: { merchantId: 'merchant-uuid-123', olderThanDate: '2022-01-01' },
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  readonly criteria?: Record<string, any>;
}