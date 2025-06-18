/**
 * @fileoverview DTO for returning the content of the robots.txt file.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Response
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * Defines the structure of the response containing the current content
 * of the merchant's robots.txt file.
 */
export class RobotsTxtResponseDto {
  @ApiProperty({
    description: 'Content of the robots.txt file.',
    example: 'User-agent: *\nDisallow: /private/\nAllow: /public/',
  })
  @IsString()
  content: string;
}