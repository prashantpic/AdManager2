import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * @class PromotionPrecedenceRuleDto
 * @description DTO for defining precedence between promotion types or specific promotions.
 * @namespace AdManager.PromotionsOffers.Api.V1.Dto.PromotionInteraction
 */
export class PromotionPrecedenceRuleDto {
  @ApiProperty({
    description: 'The ID (UUID) of a specific promotion or a PromotionType enum string that has higher precedence.',
    example: 'DISCOUNT_CODE or a UUID',
  })
  @IsString()
  @IsNotEmpty()
  higherPrecedencePromotionIdOrType: string;

  @ApiProperty({
    description: 'The ID (UUID) of a specific promotion or a PromotionType enum string that has lower precedence.',
    example: 'BOGO or a UUID',
  })
  @IsString()
  @IsNotEmpty()
  lowerPrecedencePromotionIdOrType: string;

  // Note: Further validation might be needed at the service level to ensure:
  // 1. higherPrecedencePromotionIdOrType !== lowerPrecedencePromotionIdOrType
  // 2. The provided strings are valid PromotionType enums or valid UUIDs.
  // This DTO primarily ensures they are non-empty strings.
}