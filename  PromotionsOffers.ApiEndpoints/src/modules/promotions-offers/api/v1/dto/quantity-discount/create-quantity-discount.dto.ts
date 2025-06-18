import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateIf,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PromotionBaseDto } from '../common/promotion-base.dto';
import { QuantityDiscountScope } from '../../constants/promotion.enums';
import { QuantityDiscountTierDto } from './quantity-discount-tier.dto';

export class CreateQuantityDiscountDto extends PromotionBaseDto {
  @ApiProperty({ enum: QuantityDiscountScope, description: 'Scope of the quantity discount.' })
  @IsEnum(QuantityDiscountScope)
  scope: QuantityDiscountScope;

  @ApiProperty({
    type: () => [QuantityDiscountTierDto],
    description: 'Tiers for the quantity discount. Must have at least one tier. Tiers should have increasing minimumQuantity (validated at service level).',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuantityDiscountTierDto)
  @ArrayMinSize(1)
  tiers: QuantityDiscountTierDto[];

  @ApiPropertyOptional({
    description: 'Eligible product IDs. Required if scope is PER_ITEM or PER_PRODUCT_LINE and eligibleCollectionIds is not provided.',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ArrayMinSize(1)
  @ValidateIf(o => o.scope !== QuantityDiscountScope.TOTAL_CART_ELIGIBLE_ITEMS && !o.eligibleCollectionIds)
  eligibleProductIds?: string[];

  @ApiPropertyOptional({
    description: 'Eligible collection IDs. Required if scope is PER_ITEM or PER_PRODUCT_LINE and eligibleProductIds is not provided.',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ArrayMinSize(1)
  @ValidateIf(o => o.scope !== QuantityDiscountScope.TOTAL_CART_ELIGIBLE_ITEMS && !o.eligibleProductIds)
  eligibleCollectionIds?: string[];

  // Note: Class-level validation:
  // 1. Tiers must have strictly increasing `minimumQuantity`. (Service level)
  // 2. If scope is PER_ITEM or PER_PRODUCT_LINE, either `eligibleProductIds` or `eligibleCollectionIds` must be provided. (Partially handled by @ValidateIf, "either-or" may need service level or custom validator for stricter check)
}