import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object detailing the performance metrics for an individual variant within an A/B test.
 * @summary Defines the structure for performance metrics of a specific variant in an A/B test.
 */
export class ABTestVariantPerformanceDto {
  @ApiProperty({ example: 'var-a-uuid', description: 'Unique identifier for the A/B test variant.' })
  variantId: string;

  @ApiProperty({ example: 'Creative A - Blue Button', description: 'Name of the A/B test variant.' })
  variantName: string;

  @ApiPropertyOptional({
    example: 10.5,
    type: 'number',
    format: 'float',
    description: 'Conversion rate for this variant.',
  })
  conversionRate?: number;

  @ApiPropertyOptional({
    example: 3.1,
    type: 'number',
    format: 'float',
    description: 'Click-Through Rate for this variant.',
  })
  ctr?: number;

  @ApiPropertyOptional({
    example: 12.0,
    type: 'number',
    format: 'float',
    description: 'Cost Per Acquisition for this variant.',
  })
  cpa?: number;

  @ApiPropertyOptional({
    example: 4.8,
    type: 'number',
    format: 'float',
    description: 'Return On Ad Spend for this variant.',
  })
  roas?: number;

  @ApiProperty({ example: 25000, description: 'Total impressions for this variant.' })
  impressions: number;

  @ApiProperty({ example: 775, description: 'Total clicks for this variant.' })
  clicks: number;

  @ApiProperty({ example: 81, description: 'Total conversions for this variant.' })
  conversions: number;

  @ApiProperty({
    example: 972.0,
    type: 'number',
    format: 'float',
    description: 'Total spend for this variant.',
  })
  spend: number;

  @ApiPropertyOptional({
    description: 'Indicates if this variant is the statistically significant winner.',
    example: true,
  })
  isWinner?: boolean;

  @ApiPropertyOptional({
    example: 0.95,
    description: 'Confidence level if statistical significance testing was performed and this variant is a winner.',
    type: 'number',
    format: 'float',
  })
  confidenceLevel?: number;

  @ApiPropertyOptional({
    example: 0.04,
    description: 'P-value from statistical significance test related to this variant.',
    type: 'number',
    format: 'float',
  })
  pValue?: number;
}