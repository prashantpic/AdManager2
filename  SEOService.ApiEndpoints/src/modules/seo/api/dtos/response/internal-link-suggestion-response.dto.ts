/**
 * @fileoverview DTO for returning internal link suggestions.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Response
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SuggestedLinkDto } from '../common/suggested-link.dto';

/**
 * Defines the structure of the response containing suggestions
 * for internal links.
 */
export class InternalLinkSuggestionResponseDto {
  @ApiProperty({
    type: () => [SuggestedLinkDto],
    description: 'List of suggested internal links.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SuggestedLinkDto)
  suggestions: SuggestedLinkDto[];
}