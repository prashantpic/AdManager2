/**
 * @fileoverview DTO for returning keywords of a specific page.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Response
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

/**
 * Defines the structure of the response when fetching or confirming
 * keywords for a page.
 */
export class PageKeywordsResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the page.',
    example: 'product-123',
  })
  @IsString()
  pageId: string;

  @ApiProperty({
    description: 'Type of the page (e.g., product, blog, collection).',
    example: 'product',
  })
  @IsString()
  pageType: string;

  @ApiProperty({
    type: [String],
    description: 'List of keywords associated with the page.',
    example: ['e-commerce', 'online store', 'seo optimization'],
  })
  @IsArray()
  @IsString({ each: true })
  keywords: string[];
}