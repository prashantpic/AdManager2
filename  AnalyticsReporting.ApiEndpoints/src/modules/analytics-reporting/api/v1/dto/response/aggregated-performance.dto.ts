import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CampaignPerformanceDto } from './campaign-performance.dto';

// Placeholder for NetworkPerformanceDto or other breakdown types if needed
// export class NetworkPerformanceDto { /* ... */ }

export class AggregatedPerformanceDto {
  @ApiProperty({ example: 15000.00, type: 'number', format: 'float' })
  totalSpend: number;

  @ApiProperty({ example: 1000000 })
  totalImpressions: number;

  @ApiProperty({ example: 25000 })
  totalClicks: number;

  @ApiProperty({ example: 2000 })
  totalConversions: number;

  @ApiPropertyOptional({ example: 5.8, type: 'number', format: 'float' })
  averageRoas?: number;

  @ApiPropertyOptional({ example: 7.50, type: 'number', format: 'float' })
  averageCpa?: number;

  @ApiPropertyOptional({ example: 2.5, type: 'number', format: 'float' })
  averageCtr?: number;

  @ApiPropertyOptional({ example: 8.0, type: 'number', format: 'float', description: 'Average conversions per click (%)' })
  averageConversionRate?: number;
  
  @ApiPropertyOptional({ example: 750000 })
  totalReach?: number;

  @ApiPropertyOptional({
    description: 'Breakdown by a dimension, e.g., per ad network or per campaign. The type of items in array can vary.',
    type: () => [CampaignPerformanceDto], // Example, could be more generic or specific NetworkPerformanceDto[] etc.
    // oneOf: [ // More complex Swagger representation if needed
    //   { type: 'array', items: { $ref: getSchemaPath(CampaignPerformanceDto) } },
    //   // { type: 'array', items: { $ref: getSchemaPath(NetworkPerformanceDto) } }
    // ]
  })
  breakdown?: CampaignPerformanceDto[] | any[]; // Using any[] as per SDS, ideally more specific

  @ApiPropertyOptional({
    description: 'URL to documentation explaining standardized metrics and discrepancies.',
    example: 'https://docs.admanager.example.com/metrics-definitions',
  })
  metricsDocumentationUrl?: string;
}