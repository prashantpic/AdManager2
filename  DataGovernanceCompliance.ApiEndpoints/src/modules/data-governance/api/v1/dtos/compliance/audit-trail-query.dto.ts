import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AuditTrailQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by user ID who performed the action.',
    example: 'user-uuid-123',
  })
  @IsOptional()
  @IsString()
  readonly userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by type of action (e.g., "LOGIN_SUCCESS", "CAMPAIGN_CREATE").',
    example: 'CAMPAIGN_CREATE',
  })
  @IsOptional()
  @IsString()
  readonly actionType?: string;

  @ApiPropertyOptional({
    description: 'Filter by the type of entity targeted by the action (e.g., "Campaign", "User").',
    example: 'Campaign',
  })
  @IsOptional()
  @IsString()
  readonly targetEntityType?: string;

  @ApiPropertyOptional({
    description: 'Filter by the ID of the entity targeted by the action.',
    example: 'campaign-uuid-abc',
  })
  @IsOptional()
  @IsString()
  readonly targetEntityId?: string;

  @ApiPropertyOptional({
    description: 'Filter records from this date (ISO 8601 format).',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  readonly dateFrom?: Date;

  @ApiPropertyOptional({
    description: 'Filter records up to this date (ISO 8601 format).',
    example: '2023-01-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  readonly dateTo?: Date;

  @ApiPropertyOptional({
    description: 'Page number for pagination.',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of records per page.',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  readonly pageSize?: number = 10;
}