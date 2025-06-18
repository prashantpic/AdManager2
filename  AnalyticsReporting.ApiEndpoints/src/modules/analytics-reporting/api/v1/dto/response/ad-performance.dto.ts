import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object representing performance metrics for a single ad creative.
 * @summary Defines the structure for returning individual ad performance metrics.
 */
export class AdPerformanceDto {
  @ApiProperty({
    example: 'a3e6c1f8-6d3b-4f1a-8c9e-2a7b4d0f8e9c',
    description: 'Unique identifier for the ad.',
  })
  adId: string;

  @ApiPropertyOptional({
    example: 'Summer Sale Ad 1 - Image A',
    description: 'Name or identifier of the ad creative.',
  })
  adName?: string;

  @ApiPropertyOptional({
    example: 4.5,
    type: 'number',
    format: 'float',
    description: 'Return on Ad Spend (Revenue / Spend).',
  })
  roas?: number;

  @ApiPropertyOptional({
    example: 10.25,
    type: 'number',
    format: 'float',
    description: 'Cost Per Acquisition/Conversion (Spend / Conversions).',
  })
  cpa?: number;

  @ApiPropertyOptional({
    example: 2.1,
    type: 'number',
    format: 'float',
    description: 'Click-Through Rate ((Clicks / Impressions) * 100).',
  })
  ctr?: number;

  @ApiProperty({ example: 10000, description: 'Total number of impressions.' })
  impressions: number;

  @ApiProperty({ example: 210, description: 'Total number of clicks.' })
  clicks: number;

  @ApiProperty({ example: 20, description: 'Total number of conversions.' })
  conversions: number;

  @ApiProperty({
    example: 205.0,
    type: 'number',
    format: 'float',
    description: 'Total amount spent on the ad.',
  })
  spend: number;

  @ApiPropertyOptional({ example: 8000, description: 'Total number of unique users reached.' })
  reach?: number;

  @ApiPropertyOptional({
    example: 9.52,
    type: 'number',
    format: 'float',
    description: 'Conversion Rate ((Conversions / Clicks) * 100).',
  })
  conversionRate?: number;
}