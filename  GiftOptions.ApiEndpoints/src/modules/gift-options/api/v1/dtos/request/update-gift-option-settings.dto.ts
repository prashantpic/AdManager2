import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

/**
 * @class UpdateGiftOptionSettingsDto
 * @namespace AdManager.GiftOptions.Api.V1.Dtos.Request
 * @description Payload for updating merchant's gift option settings.
 */
export class UpdateGiftOptionSettingsDto {
  @ApiPropertyOptional({
    description: 'Enable or disable custom notes for gifts.',
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  enableCustomNote?: boolean;

  @ApiPropertyOptional({
    description:
      'Character limit for custom notes. Must be between 50 and 1000.',
    type: Number,
    minimum: 50,
    maximum: 1000,
  })
  @IsInt()
  @Min(50)
  @Max(1000)
  @IsOptional()
  customNoteCharacterLimit?: number;

  @ApiPropertyOptional({
    description: 'Enable or disable branded gift cards.',
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  enableBrandedCard?: boolean;
}