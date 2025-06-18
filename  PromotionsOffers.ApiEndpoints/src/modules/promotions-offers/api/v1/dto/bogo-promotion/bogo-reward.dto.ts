import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateIf,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BogoRewardType } from '../../constants/promotion.enums';

/**
 * @namespace AdManager.PromotionsOffers.Api.V1.Dto.BogoPromotion
 */

/**
 * DTO for defining the 'get' reward item(s) in a BOGO (Buy One, Get One Free) promotion.
 * Specifies the nature and quantity of the free item(s) in a BOGO offer.
 * @REQ_PROMO_003
 */
export class BogoRewardDto {
  @ApiProperty({
    description: 'The type of reward for the BOGO offer.',
    enum: BogoRewardType,
    example: BogoRewardType.SAME_AS_PURCHASED,
  })
  @IsEnum(BogoRewardType)
  rewardType: BogoRewardType;

  @ApiPropertyOptional({
    description:
      'The UUID of the specific item to be rewarded. Required if rewardType is SPECIFIC_DIFFERENT_ITEM.',
    type: String,
    format: 'uuid',
    example: 'c3d4e5f6-a7b8-9012-3456-7890abcdef01',
  })
  @IsOptional()
  @ValidateIf((o) => o.rewardType === BogoRewardType.SPECIFIC_DIFFERENT_ITEM)
  @IsUUID('4', { message: 'Specific item ID must be a valid UUID.' })
  specificItemId?: string;

  @ApiPropertyOptional({
    description:
      'Array of collection UUIDs from which the reward item can be chosen (e.g., equal or lesser value). Required if rewardType is ITEM_FROM_COLLECTION_EQUAL_OR_LESSER_VALUE.',
    type: [String],
    format: 'uuid',
    example: ['d4e5f6a7-b8c9-0123-4567-890abcdef012'],
  })
  @IsOptional()
  @ValidateIf((o) => o.rewardType === BogoRewardType.ITEM_FROM_COLLECTION_EQUAL_OR_LESSER_VALUE)
  @IsArray()
  @IsUUID('4', {
    each: true,
    message: 'Each reward collection ID must be a valid UUID.',
  })
  @ArrayMinSize(1, { message: 'rewardCollectionIds must contain at least one UUID if rewardType is ITEM_FROM_COLLECTION_EQUAL_OR_LESSER_VALUE and rewardCollectionIds is provided.'})
  rewardCollectionIds?: string[];

  @ApiProperty({
    description: 'The quantity of the reward item(s) to be given.',
    type: Number,
    default: 1,
    minimum: 1,
    example: 1,
  })
  @IsInt({ message: 'Reward quantity must be an integer.' })
  @Min(1, { message: 'Reward quantity must be at least 1.' })
  quantity: number = 1;
}