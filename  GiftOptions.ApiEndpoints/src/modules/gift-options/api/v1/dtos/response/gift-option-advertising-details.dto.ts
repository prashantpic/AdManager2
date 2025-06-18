import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

/**
 * @class GiftOptionAdvertisingDetailsDto
 * @namespace AdManager.GiftOptions.Api.V1.Dtos.Response
 * @description Provides gift option details relevant for advertising.
 */
export class GiftOptionAdvertisingDetailsDto {
  @ApiProperty({
    description: "The merchant's unique identifier.",
    type: String,
  })
  merchantId: string;

  @ApiProperty({
    description: 'Indicates if custom notes are available for the merchant.',
    type: Boolean,
  })
  isCustomNoteAvailable: boolean;

  @ApiProperty({
    description: 'Indicates if branded gift cards are available for the merchant.',
    type: Boolean,
  })
  isBrandedCardAvailable: boolean;

  @ApiPropertyOptional({
    description:
      'Suggested text for advertising branded card availability (e.g., "Branded Gift Card Included!").',
    type: String,
  })
  @IsOptional()
  brandedCardAvailabilityText?: string;

  @ApiPropertyOptional({
    description:
      'Suggested text for advertising custom note availability (e.g., "Add a Free Custom Gift Note!").',
    type: String,
  })
  @IsOptional()
  customNoteAvailabilityText?: string;
}