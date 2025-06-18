/**
 * @fileoverview DTO for returning suggestions for robots.txt content.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Response
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional } from 'class-validator';

/**
 * Defines the structure of the response containing suggested
 * robots.txt content and any warnings.
 */
export class RobotsTxtSuggestionResponseDto {
  @ApiProperty({
    description: 'Suggested content for the robots.txt file.',
    example: 'User-agent: Googlebot\nDisallow: /temp/\n\nUser-agent: *\nAllow: /',
  })
  @IsString()
  suggestedContent: string;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Optional list of warnings or recommendations related to the suggestions.',
    example: ['Warning: Blocking /temp/ might affect indexing of temporary assets.'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  warnings?: string[];
}