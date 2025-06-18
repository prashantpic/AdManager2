/**
 * @fileoverview DTO for returning meta tags of a page.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Response
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

/**
 * Defines the structure of the response containing meta tag
 * information for a page.
 */
export class PageMetaTagsResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the page.',
    example: 'page-abc-789',
  })
  @IsString()
  pageId: string;

  @ApiProperty({
    description: 'Type of the page (e.g., product, blog, landing-page).',
    example: 'landing-page',
  })
  @IsString()
  pageType: string;

  @ApiProperty({
    required: false,
    description: 'Page meta title.',
    example: 'Effective SEO Strategies for 2024',
  })
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiProperty({
    required: false,
    description: 'Page meta description.',
    example: 'Discover the latest SEO strategies to improve your online presence in 2024.',
  })
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiProperty({
    required: false,
    description: 'SEO-friendly URL slug.',
    example: 'seo-strategies-2024',
  })
  @IsString()
  @IsOptional()
  urlSlug?: string;

  @ApiProperty({
    required: false,
    format: 'url',
    description: 'Canonical URL for the page.',
    example: 'https://www.example.com/blog/seo-strategies-2024',
  })
  @IsUrl()
  @IsOptional()
  canonicalUrl?: string;
}