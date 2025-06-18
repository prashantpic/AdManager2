import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MetricName } from '../../constants/metric-names.enum';

export class PerformanceReportQueryDto {
  @IsISO8601()
  @IsOptional()
  @ApiPropertyOptional({
    example: '2023-01-01',
    description: 'Start date in YYYY-MM-DD format',
  })
  startDate?: string;

  @IsISO8601()
  @IsOptional()
  @ApiPropertyOptional({
    example: '2023-01-31',
    description: 'End date in YYYY-MM-DD format',
  })
  endDate?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'Filter by specific campaign IDs',
  })
  campaignIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by specific ad network IDs (e.g., google, facebook)',
  })
  adNetworkIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({
    example: ['campaign', 'adNetwork'],
    description: 'Dimensions to group by',
  })
  dimensions?: string[];

  @IsArray()
  @IsEnum(MetricName, { each: true })
  @IsOptional()
  @ApiPropertyOptional({
    enum: MetricName,
    isArray: true,
    description: 'Specific metrics to include',
  })
  metrics?: MetricName[];

  @IsIn(['daily', 'weekly', 'monthly', 'summary'])
  @IsOptional()
  @ApiPropertyOptional({
    enum: ['daily', 'weekly', 'monthly', 'summary'],
    description: 'Time granularity for the report',
    example: 'daily',
  })
  granularity?: 'daily' | 'weekly' | 'monthly' | 'summary';

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 1, description: 'Page number for pagination' })
  page?: number;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 10, description: 'Items per page for pagination' })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'spend', description: 'Field to sort by' })
  sortBy?: string;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], description: 'Sort order', example: 'DESC' })
  sortOrder?: 'ASC' | 'DESC';
}