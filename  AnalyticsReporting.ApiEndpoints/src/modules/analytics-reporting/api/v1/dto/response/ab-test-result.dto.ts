import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ABTestVariantPerformanceDto } from './ab-test-variant-performance.dto'; // Assuming this DTO will be created

export class ABTestResultDto {
  @ApiProperty({ example: 'test-uuid-123' })
  testId: string;

  @ApiProperty({ example: 'Homepage CTA Button Color Test' })
  testName: string;

  @ApiProperty({ type: [ABTestVariantPerformanceDto] })
  variants: ABTestVariantPerformanceDto[];

  @ApiPropertyOptional({
    description: 'ID of the statistically significant winning variant, if any',
    example: 'var-a-uuid',
  })
  winningVariantId?: string;

  @ApiPropertyOptional({
    description: 'A summary of the statistical significance findings',
    example:
      'Variant A showed a statistically significant higher conversion rate (10.5%) compared to Variant B (8.2%) with 95% confidence.',
  })
  statisticalSignificanceSummary?: string;

  @ApiPropertyOptional({ example: '2023-02-01', description: 'Start date of the test in YYYY-MM-DD format'})
  startDate?: string;

  @ApiPropertyOptional({ example: '2023-02-15', description: 'End date of the test in YYYY-MM-DD format'})
  endDate?: string;
}