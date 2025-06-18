/**
 * @fileoverview DTO for setting keywords for a specific page.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Request
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

/**
 * Defines the expected structure and validation rules for the request body
 * when setting page keywords.
 */
export class SetPageKeywordsRequestDto {
  @ApiProperty({
    type: [String],
    description: 'List of keywords for the page.',
    example: ['e-commerce', 'online store', 'seo optimization'],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  keywords: string[];
}