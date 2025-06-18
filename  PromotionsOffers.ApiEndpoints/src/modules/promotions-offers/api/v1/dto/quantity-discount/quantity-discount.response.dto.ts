import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsUUID, ValidateNested, ArrayMinSize } from 'class-validator';
import { PromotionBaseResponseDto } from '../common/promotion-base-response.dto';
import { QuantityDiscountScope } from '../../constants/promotion.enums';
import { QuantityDiscountTierDto } from './quantity-discount-tier.dto';

export class QuantityDiscountResponseDto extends PromotionBaseResponseDto {
  @ApiProperty({ enum: QuantityDiscountScope, description: 'Scope of the quantity discount.' })
  @IsEnum(QuantityDiscountScope)
  scope: QuantityDiscountScope;

  @ApiProperty({ type: () => [QuantityDiscountTierDto], description: 'Tiers for the quantity discount.' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuantityDiscountTierDto)
  @ArrayMinSize(1)
  tiers: QuantityDiscountTierDto[];

  @ApiPropertyOptional({ description: 'Eligible product IDs.', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ArrayMinSize(1)
  eligibleProductIds?: string[];

  @ApiPropertyOptional({ description: 'Eligible collection IDs.', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  @ArrayMinSize(1)
  eligibleCollectionIds?: string[];
}