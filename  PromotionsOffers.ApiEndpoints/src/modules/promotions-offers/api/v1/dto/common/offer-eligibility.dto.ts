import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateIf,
  ArrayMinSize,
} from 'class-validator';
import { OfferEligibilityCustomerType } from '../../constants/promotion.enums';

/**
 * @namespace AdManager.PromotionsOffers.Api.V1.Dto.Common
 */

/**
 * DTO for defining eligibility criteria for an offer (e.g., new customers, specific customer segments).
 * Captures the criteria used to determine if a customer is eligible for a promotional offer.
 * @REQ_PROMO_005
 * @REQ_CPSI_004
 */
export class OfferEligibilityDto {
  @ApiProperty({
    description: 'The type of customers eligible for the offer.',
    enum: OfferEligibilityCustomerType,
    example: OfferEligibilityCustomerType.ALL_CUSTOMERS,
  })
  @IsEnum(OfferEligibilityCustomerType)
  customerType: OfferEligibilityCustomerType;

  @ApiPropertyOptional({
    description:
      'Array of customer segment UUIDs. Required if customerType is SPECIFIC_SEGMENTS.',
    type: [String],
    format: 'uuid',
    example: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
  })
  @IsOptional()
  @ValidateIf((o) => o.customerType === OfferEligibilityCustomerType.SPECIFIC_SEGMENTS)
  @IsArray()
  @IsUUID('4', {
    each: true,
    message: 'Each segmentId must be a valid UUID.',
  })
  @ArrayMinSize(1, {message: 'segmentIds must contain at least one UUID if customerType is SPECIFIC_SEGMENTS and segmentIds is provided.'})
  segmentIds?: string[];
}