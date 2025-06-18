/**
 * @fileoverview DTO for returning schema markup for a page.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Response
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

/**
 * Defines the structure of the response containing schema markup
 * information for a page.
 */
export class SchemaMarkupResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the page.',
    example: 'product-123',
  })
  @IsString()
  pageId: string;

  @ApiProperty({
    description: 'Type of the page (e.g., product, blog).',
    example: 'product',
  })
  @IsString()
  pageType: string;

  @ApiProperty({
    description: 'Type of schema (e.g., "Product", "Article").',
    example: 'Product',
  })
  @IsString()
  schemaType: string;

  @ApiProperty({
    type: 'object',
    description: 'The actual schema markup JSON object.',
    example: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Awesome T-Shirt',
    },
  })
  @IsObject()
  schemaJson: object;
}