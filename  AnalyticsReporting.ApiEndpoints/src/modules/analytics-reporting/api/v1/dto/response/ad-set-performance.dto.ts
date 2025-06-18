import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AdPerformanceDto } from './ad-performance.dto';

/**
 * Data Transfer Object representing performance metrics for a single ad set.
 * @summary Defines the structure for returning ad set performance metrics.
 */
export class AdSetPerformanceDto {
  @ApiProperty({
    example: 'b2d5e0e7-5c2a-4e09-8b8f-1a6c3c0e7d8b',
    description: 'Unique identifier for the ad set.',
  })
  adSetId: string;

  @ApiProperty({
    example: 'Target Audience: Young Professionals',
    description: 'Name of the ad set.',
  })
  adSetName: string;

  @ApiPropertyOptional({
    example: 5.1,
    type: 'number',
    format: 'float',
    description: 'Return on Ad Spend for the ad set.',
  })
  roas?: number;

  @ApiPropertyOptional({
    example: 9.8,
    type: 'number',
    format: 'float',
    description: 'Cost Per Acquisition/Conversion for the ad set.',
  })
  cpa?: number;

  @ApiPropertyOptional({
    example: 2.3,
    type: 'number',
    format: 'float',
    description: 'Click-Through Rate for the ad set.',
  })
  ctr?: number;

  @ApiProperty({ example: 50000, description: 'Total impressions for the ad set.' })
  impressions: number;

  @ApiProperty({ example: 1150, description: 'Total clicks for the ad set.' })
  clicks: number;

  @ApiProperty({ example: 100, description: 'Total conversions for the ad set.' })
  conversions: number;

  @ApiProperty({
    example: 980.0,
    type: 'number',
    format: 'float',
    description: 'Total spend for the ad set.',
  })
  spend: number;

  @ApiPropertyOptional({ example: 40000, description: 'Total reach for the ad set.' })
  reach?: number;

  @ApiPropertyOptional({
    example: 8.7,
    type: 'number',
    format: 'float',
    description: 'Conversion Rate for the ad set.',
  })
  conversionRate?: number;

  @ApiPropertyOptional({
    type: [AdPerformanceDto],
    description: 'Optional breakdown of performance by individual ads within this ad set.',
  })
  @Type(() => AdPerformanceDto)
  ads?: AdPerformanceDto[];
}