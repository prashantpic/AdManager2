import { ApiProperty } from '@nestjs/swagger';

/**
 * @class GiftOptionSettingsDto
 * @namespace AdManager.GiftOptions.Api.V1.Dtos.Response
 * @description Represents a merchant's current gift option settings.
 */
export class GiftOptionSettingsDto {
  @ApiProperty({
    description: "The merchant's unique identifier.",
    type: String,
  })
  merchantId: string;

  @ApiProperty({
    description: 'Indicates if custom notes are enabled for the merchant.',
    type: Boolean,
  })
  enableCustomNote: boolean;

  @ApiProperty({
    description: 'The character limit for custom notes.',
    type: Number,
  })
  customNoteCharacterLimit: number;

  @ApiProperty({
    description: 'Indicates if branded gift cards are enabled for the merchant.',
    type: Boolean,
  })
  enableBrandedCard: boolean;

  @ApiProperty({
    description: 'The date and time when the settings were last updated.',
    type: Date,
  })
  updatedAt: Date;
}