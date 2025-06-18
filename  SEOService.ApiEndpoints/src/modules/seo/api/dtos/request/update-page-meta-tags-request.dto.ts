/**
 * @fileoverview DTO for updating meta tags (title, description, slug, canonical) for a page.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Request
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  Matches,
  IsUrl,
} from 'class-validator';

/**
 * Defines the structure for updating page meta tags, including validation
 * for length and format.
 */
export class UpdatePageMetaTagsRequestDto {
  @ApiProperty({
    required: false,
    maxLength: 70,
    description: 'Page meta title.',
    example: 'High-Quality SEO Services | MyCompany',
  })
  @IsString()
  @IsOptional()
  @MaxLength(70)
  metaTitle?: string;

  @ApiProperty({
    required: false,
    maxLength: 160,
    description: 'Page meta description.',
    example: 'Boost your website ranking with our expert SEO services. Contact us today!',
  })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  metaDescription?: string;

  @ApiProperty({
    required: false,
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
    description: 'SEO-friendly URL slug.',
    example: 'expert-seo-services',
  })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'URL slug must be lowercase alphanumeric with hyphens.',
  })
  urlSlug?: string;

  @ApiProperty({
    required: false,
    format: 'url',
    description: 'Canonical URL for the page.',
    example: 'https://www.example.com/services/seo-main',
  })
  @IsUrl()
  @IsOptional()
  canonicalUrl?: string;
}