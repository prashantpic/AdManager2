import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsIn } from 'class-validator';
import { COMMISSION_TYPE_PERCENTAGE, COMMISSION_TYPE_FLAT_FEE } from '../../../constants/affiliate.constants';

export class CreateCommissionRuleDto {
  @ApiProperty({
    description: 'Type of commission.',
    enum: [COMMISSION_TYPE_PERCENTAGE, COMMISSION_TYPE_FLAT_FEE],
    example: COMMISSION_TYPE_PERCENTAGE,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn([COMMISSION_TYPE_PERCENTAGE, COMMISSION_TYPE_FLAT_FEE])
  type: string;

  @ApiProperty({
    description: 'Value of the commission (percentage or flat fee amount).',
    example: 10.5, // e.g., 10.5 for 10.5% or 10.5 for a flat fee of $10.50
  })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiPropertyOptional({
    description: 'Optional description for this commission rule.',
    example: 'Standard 10% on all sales',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Specifies what this rule applies to (e.g., "ALL_PRODUCTS", "SPECIFIC_CATEGORY_ID:electronics", "SPECIFIC_PRODUCT_ID:prod123").',
    example: 'ALL_PRODUCTS',
  })
  @IsString()
  @IsOptional()
  appliesTo?: string;

  @ApiPropertyOptional({
    description: 'Minimum order/conversion amount for this tier to apply (used for tiered commissions).',
    example: 500,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  tierMinAmount?: number;
}