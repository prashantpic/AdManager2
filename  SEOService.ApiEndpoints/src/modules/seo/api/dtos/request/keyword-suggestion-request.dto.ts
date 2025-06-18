/**
 * @fileoverview DTO for requesting keyword suggestions.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Request
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Defines the expected structure for requesting keyword suggestions
 * based on a topic and optional current keywords.
 */
export class KeywordSuggestionRequestDto {
  @ApiProperty({
    description: 'The primary topic or seed keyword for suggestions.',
    example: 'sustainable fashion',
  })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Optional list of current keywords to refine suggestions.',
    example: ['eco-friendly clothing', 'organic cotton'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  currentKeywords?: string[];
}