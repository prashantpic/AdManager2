/**
 * @fileoverview DTO for updating ALT text for an image.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Request
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

/**
 * Defines the structure for updating image ALT text.
 */
export class UpdateImageAltTextRequestDto {
  @ApiProperty({
    maxLength: 125,
    description: 'Alternative text for the image.',
    example: 'A red sports car driving on a scenic road.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(125)
  altText: string;
}