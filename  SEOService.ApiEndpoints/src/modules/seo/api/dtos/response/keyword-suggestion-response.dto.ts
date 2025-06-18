/**
 * @fileoverview DTO for returning keyword suggestions.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Response
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

/**
 * Defines the structure of the response containing keyword suggestions.
 */
export class KeywordSuggestionResponseDto {
  @ApiProperty({
    type: [String],
    description: 'List of suggested keywords.',
    example: ['ethical fashion', 'fair trade clothing', 'recycled materials'],
  })
  @IsArray()
  @IsString({ each: true })
  suggestions: string[];
}