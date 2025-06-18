import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UserAccessReportQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by merchant ID.',
    example: 'merchant-uuid-abc',
  })
  @IsOptional()
  @IsString()
  readonly merchantId?: string;

  @ApiPropertyOptional({
    description: 'Filter by user ID.',
    example: 'user-uuid-123',
  })
  @IsOptional()
  @IsString()
  readonly userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by user role.',
    example: 'CampaignManager',
  })
  @IsOptional()
  @IsString()
  readonly role?: string;

  @ApiPropertyOptional({
    description: 'Report data from this date (ISO 8601 format).',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  readonly dateFrom?: Date;

  @ApiPropertyOptional({
    description: 'Report data up to this date (ISO 8601 format).',
    example: '2023-01-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  readonly dateTo?: Date;

  @ApiPropertyOptional({
    description: 'Include platform administrators in the report.',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly includePlatformAdmins?: boolean = false;
}