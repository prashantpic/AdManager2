import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object used to convey actionable insights, trends, or recommendations to merchants based on their advertising performance data.
 * @summary Defines the structure for returning actionable insights.
 */
export class ActionableInsightDto {
  @ApiProperty({ example: 'insight-uuid-456', description: 'Unique identifier for the insight.' })
  insightId: string;

  @ApiProperty({
    example: 'Campaign "Summer Splash" ROAS declining',
    description: 'A concise title for the insight.',
  })
  title: string;

  @ApiProperty({
    example:
      'The ROAS for "Summer Splash" campaign has dropped by 20% in the last 7 days compared to the previous period.',
    description: 'A detailed description of the insight.',
  })
  description: string;

  @ApiPropertyOptional({
    example:
      'Review ad creatives and targeting for campaign "Summer Splash". Consider pausing underperforming ad sets.',
    description: 'A suggested action or recommendation based on the insight.',
  })
  recommendation?: string;

  @ApiPropertyOptional({
    example: 'campaign',
    description: 'The type of entity this insight relates to.',
    enum: ['campaign', 'adSet', 'ad', 'product', 'audienceSegment'],
  })
  relatedEntityType?: 'campaign' | 'adSet' | 'ad' | 'product' | 'audienceSegment';

  @ApiPropertyOptional({
    example: 'c1c4d9d6-4b19-4c98-9a7e-09f8e7d6c5b3',
    description: 'The unique identifier of the related entity.',
    format: 'uuid',
  })
  relatedEntityId?: string;

  @ApiPropertyOptional({
    example: 'medium',
    description: 'The severity or priority of the insight.',
    enum: ['high', 'medium', 'low', 'info'],
  })
  severity?: 'high' | 'medium' | 'low' | 'info';

  @ApiPropertyOptional({
    example: 'PerformanceTrend',
    description: 'Type of insight, e.g., Anomaly, Trend, Opportunity, BudgetPacing.',
  })
  insightType?: string;

  @ApiPropertyOptional({
    description: 'Data points or evidence supporting the insight.',
    example: { previousRoas: 5.0, currentRoas: 4.0, changePercentage: -20 },
    type: 'object',
  })
  supportingData?: any;
}