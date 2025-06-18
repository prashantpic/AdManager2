/**
 * @fileoverview DTO for returning ALT text of an image.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Response
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

/**
 * Defines the structure of the response containing image ALT text information.
 */
export class ImageAltTextResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the image.',
    example: 'img-xyz-123',
  })
  @IsString()
  imageId: string;

  @ApiProperty({
    description: 'Unique identifier of the page containing the image.',
    example: 'product-777',
  })
  @IsString()
  pageId: string;

  @ApiProperty({
    description: 'Type of the page (e.g., product, blog).',
    example: 'blog',
  })
  @IsString()
  pageType: string;

  @ApiProperty({
    required: false,
    description: 'Alternative text for the image.',
    example: 'Close-up of a blooming rose in a garden.',
  })
  @IsString()
  @IsOptional()
  altText?: string;
}