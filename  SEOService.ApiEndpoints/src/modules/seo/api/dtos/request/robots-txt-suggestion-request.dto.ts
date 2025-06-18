/**
 * @fileoverview DTO for requesting suggestions for robots.txt content.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Request
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

/**
 * Defines the structure for requesting suggestions to modify
 * or generate robots.txt content.
 */
export class RobotsTxtSuggestionRequestDto {
  @ApiProperty({
    required: false,
    description: 'Current content of the robots.txt file, if any.',
    example: 'User-agent: *\nDisallow: /admin/',
  })
  @IsString()
  @IsOptional()
  currentContent?: string;

  @ApiProperty({
    type: 'object',
    required: false,
    example: { 'User-agent: Googlebot': ['Disallow: /temp/'], 'User-agent: *': ['Allow: /'] },
    description: 'Object representing desired directives. Keys are user-agents, values are arrays of directive strings.',
  })
  @IsObject()
  @IsOptional()
  desiredDirectives?: object;
}