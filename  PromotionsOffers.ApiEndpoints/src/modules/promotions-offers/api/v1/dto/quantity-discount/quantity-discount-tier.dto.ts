import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, Min } from 'class-validator';
import { DiscountCodeType } from '../../constants/promotion.enums';

/**
 * @namespace AdManager.PromotionsOffers.Api.V1.Dto.QuantityDiscount
 */

/**
 * DTO for defining a single tier in a quantity-based discount.
 * Specifies the minimum quantity and corresponding discount for a tier in a quantity discount promotion.
 * @REQ_PROMO_008
 */
export class QuantityDiscountTierDto {
  @ApiProperty({
    description: 'The minimum quantity required to qualify for this discount tier.',
    type: Number,
    minimum: 1,
    example: 5,
  })
  @IsInt({ message: 'Minimum quantity must be an integer.' })
  @Min(1, { message: 'Minimum quantity must be at least 1.' })
  minimumQuantity: number;

  @ApiProperty({
    description: 'The type of discount for this tier (PERCENTAGE or FIXED_AMOUNT).',
    enum: DiscountCodeType,
    example: DiscountCodeType.PERCENTAGE,
  })
  @IsEnum(DiscountCodeType)
  discountType: DiscountCodeType;

  @ApiProperty({
    description:
      'The value of the discount (e.g., 10 for 10% or 5 for $5 fixed amount).',
    type: Number,
    minimum: 0,
    example: 10,
  })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Discount value must be a number.' },
  )
  @Min(0, { message: 'Discount value cannot be negative.' })
  discountValue: number;
}