/**
 * @fileoverview DTO for requesting internal link suggestions for blog content.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Request
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

/**
 * Defines the structure for requesting suggestions for internal links
 * based on a sample of blog content.
 */
export class InternalLinkSuggestionRequestDto {
  @ApiProperty({
    description: 'A sample of the blog content (min 50 chars) to analyze for link suggestions.',
    example: 'Our company recently launched a new line of eco-friendly products. These items are designed with sustainability in mind...',
    minLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  contentSample: string;
}