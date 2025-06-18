import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsString } from 'class-validator';

export class ProcessingActivityLogQueryDto {
  @ApiPropertyOptional({
    description: 'Start date for the log query (ISO 8601 format).',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  readonly dateFrom?: Date;

  @ApiPropertyOptional({
    description: 'End date for the log query (ISO 8601 format).',
    example: '2023-01-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  readonly dateTo?: Date;

  @ApiPropertyOptional({
    description: 'Filter by type of processing activity (e.g., "PII_Access", "Data_Share_ThirdParty").',
    example: 'PII_Access',
  })
  @IsOptional()
  @IsString()
  readonly activityType?: string;

  @ApiPropertyOptional({
    description: 'Filter by type of data processed.',
    example: 'UserEmail',
  })
  @IsOptional()
  @IsString()
  readonly dataType?: string;
}