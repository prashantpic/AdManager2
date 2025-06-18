/**
 * @fileoverview Common DTO representing an internal link.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Common
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

/**
 * Represents a single internal link with its anchor text, target URL,
 * and optional target product ID.
 */
export class InternalLinkDto {
  @ApiProperty({
    description: 'The anchor text for the internal link.',
    example: 'our latest product',
  })
  @IsString()
  @IsNotEmpty()
  anchorText: string;

  @ApiProperty({
    description: 'The target URL for the internal link.',
    example: 'https://mystore.com/products/latest-product',
    format: 'url',
  })
  @IsUrl()
  targetUrl: string;

  @ApiProperty({
    required: false,
    description: 'Optional ID of the target product if the link points to a product.',
    example: 'prod_12345',
  })
  @IsString()
  @IsOptional()
  targetProductId?: string;
}