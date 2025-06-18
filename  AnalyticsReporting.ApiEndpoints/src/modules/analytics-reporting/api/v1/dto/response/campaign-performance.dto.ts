import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdSetPerformanceDto } from './ad-set-performance.dto'; // Assuming ad-set-performance.dto.ts will be created

export class CampaignPerformanceDto {
  @ApiProperty({ example: 'c1c4d9d6-4b19-4c98-9a7e-09f8e7d6c5b3' })
  campaignId: string;

  @ApiProperty({ example: 'Q4 Holiday Campaign' })
  campaignName: string;

  @ApiPropertyOptional({ example: 6.2, type: 'number', format: 'float' })
  roas?: number;

  @ApiPropertyOptional({ example: 8.50, type: 'number', format: 'float' })
  cpa?: number;

  @ApiPropertyOptional({ example: 2.5, type: 'number', format: 'float' })
  ctr?: number;

  @ApiProperty({ example: 200000 })
  impressions: number;

  @ApiProperty({ example: 5000 })
  clicks: number;

  @ApiProperty({ example: 500 })
  conversions: number;

  @ApiProperty({ example: 4250.00, type: 'number', format: 'float' })
  spend: number;

  @ApiPropertyOptional({ example: 150000 })
  reach?: number;

  @ApiPropertyOptional({ example: 10.0, type: 'number', format: 'float', description: 'Conversions per click (%)' })
  conversionRate?: number;

  @ApiPropertyOptional({
    description: 'Identifier for the ad network',
    example: 'google-ads',
  })
  adNetworkId?: string;

  @ApiPropertyOptional({
    description: 'Name of the ad network',
    example: 'Google Ads',
  })
  adNetworkName?: string;

  @ApiPropertyOptional({ type: [AdSetPerformanceDto] })
  adSets?: AdSetPerformanceDto[];

  @ApiPropertyOptional({
    description: 'Current status of the campaign',
    example: 'Active',
  })
  status?: string;
}