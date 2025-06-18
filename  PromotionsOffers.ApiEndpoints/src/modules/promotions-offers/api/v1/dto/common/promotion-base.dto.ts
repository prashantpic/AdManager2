import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PromotionApplicationMethod,
  PromotionStatus,
} from '../../constants/promotion.enums';
import { OfferValidityDto } from './offer-validity.dto';
import { OfferEligibilityDto } from './offer-eligibility.dto';
import { PromotionInteractionConfigDto } from './promotion-interaction-config.dto';

/**
 * @namespace AdManager.PromotionsOffers.Api.V1.Dto.Common
 */

/**
 * Base DTO containing common fields for all promotion types.
 * This class provides a reusable base for promotion DTOs, ensuring common properties are consistently defined.
 * @REQ_PROMO_005
 * @REQ_PROMO_006
 * @REQ_PROMO_007
 */
export class PromotionBaseDto {
  @ApiProperty({
    description: 'The name of the promotion.',
    example: 'Summer Sale Discount',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the promotion.',
    example: 'Get 20% off on all summer collection items.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The current status of the promotion.',
    enum: PromotionStatus,
    example: PromotionStatus.DRAFT,
  })
  @IsEnum(PromotionStatus)
  status: PromotionStatus;

  @ApiProperty({
    description: 'Defines the validity period of the promotion.',
    type: () => OfferValidityDto,
  })
  @ValidateNested()
  @Type(() => OfferValidityDto)
  validity: OfferValidityDto;

  @ApiPropertyOptional({
    description: 'Defines the eligibility criteria for this promotion.',
    type: () => OfferEligibilityDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OfferEligibilityDto)
  eligibility?: OfferEligibilityDto;

  @ApiProperty({
    description: 'Method by which the promotion is applied.',
    enum: PromotionApplicationMethod,
    example: PromotionApplicationMethod.AUTOMATIC,
  })
  @IsEnum(PromotionApplicationMethod)
  applicationMethod: PromotionApplicationMethod;

  @ApiPropertyOptional({
    description:
      'Configuration for how this promotion interacts with other promotions.',
    type: () => PromotionInteractionConfigDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PromotionInteractionConfigDto)
  interactionRules?: PromotionInteractionConfigDto;
}