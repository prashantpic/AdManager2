import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { COMMISSION_TYPE_PERCENTAGE, COMMISSION_TYPE_FLAT_FEE } from '../../../constants/affiliate.constants';

export class CommissionRuleResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the commission rule.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Type of commission.',
    enum: [COMMISSION_TYPE_PERCENTAGE, COMMISSION_TYPE_FLAT_FEE],
    example: COMMISSION_TYPE_PERCENTAGE,
  })
  type: string;

  @ApiProperty({
    description: 'Value of the commission (percentage or flat fee amount).',
    example: 10.5,
  })
  value: number;

  @ApiPropertyOptional({
    description: 'Description of the commission rule.',
    example: '10.5% commission on all electronics.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Condition for the rule to apply (e.g., ALL_PRODUCTS, CATEGORY_ID, PRODUCT_ID).',
    example: 'SPECIFIC_CATEGORY_ID:electronics',
  })
  appliesTo?: string;

  @ApiPropertyOptional({
    description: 'Minimum amount for this tier to apply (for tiered commissions).',
    example: 1000,
  })
  tierMinAmount?: number;

  @ApiProperty({
    description: 'Indicates if the commission rule is currently active.',
    example: true,
  })
  isActive: boolean;
}