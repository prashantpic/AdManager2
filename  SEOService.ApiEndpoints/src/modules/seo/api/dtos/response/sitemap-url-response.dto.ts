/**
 * @fileoverview DTO for returning the XML sitemap URL.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Response
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

/**
 * Defines the structure of the response containing the URL
 * for the merchant's XML sitemap.
 */
export class SitemapUrlResponseDto {
  @ApiProperty({
    description: "URL of the merchant's XML sitemap.",
    example: 'https://www.mystore.com/sitemap.xml',
    format: 'url',
  })
  @IsUrl()
  sitemapUrl: string;
}