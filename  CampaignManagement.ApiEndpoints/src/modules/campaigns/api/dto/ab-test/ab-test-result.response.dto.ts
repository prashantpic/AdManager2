import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VariantResultDto } from './variant-result.dto'; // Assuming this DTO is defined and available

/**
 * Data Transfer Object for representing the results of an A/B test.
 */
export class ABTestResultResponseDto {
  @ApiProperty({
    description: 'UUID v4 of the A/B test these results pertain to.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  abTestId: string;

  @ApiProperty({
    description: 'Array of results for each variant in the A/B test.',
    type: () => [VariantResultDto],
  })
  @Type(() => VariantResultDto)
  variantResults: VariantResultDto[];

  @ApiPropertyOptional({
    description: 'UUID v4 of the winning variant, if a winner has been determined.',
    example: 'v1a2r3i4-a5n6-t7i8-d9s0-w1i2n3n4e5r6',
  })
  winningVariantId?: string;

  @ApiPropertyOptional({
    description: 'Details about the statistical significance of the results (e.g., p-value, confidence interval). Structure may vary.',
    example: { pValue: 0.04, confidenceInterval: [0.01, 0.08], confidenceLevel: 0.95 },
    type: 'object',
  })
  statisticalSignificance?: any;

  @ApiProperty({
    description: 'Timestamp when these results were last calculated or updated (ISO 8601).',
    example: '2024-07-25T10:30:00.000Z',
    type: String,
    format: 'date-time'
  })
  lastCalculatedAt: Date;
}