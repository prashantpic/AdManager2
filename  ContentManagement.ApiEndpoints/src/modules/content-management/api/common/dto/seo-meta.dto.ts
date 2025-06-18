import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

/**
 * @file seo-meta.dto.ts
 * @description Data Transfer Object for SEO metadata common to blogs and landing pages.
 * @requirement REQ-6-003, REQ-7-007
 * @namespace AdManager.ContentManagement.Api.V1.Common.Dto
 */

/**
 * DTO representing common SEO metadata fields like meta title, description, slug, and canonical URL.
 */
export class SeoMetaDto {
  /**
   * The title tag content for SEO.
   * @example "My Awesome Blog Post Title"
   */
  @ApiProperty({
    description: 'The title tag content for SEO.',
    example: 'My Awesome Blog Post Title',
    maxLength: 70,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(70) // Common SEO recommendation
  public metaTitle: string;

  /**
   * The meta description content for SEO.
   * @example "A brief summary of my awesome blog post."
   */
  @ApiProperty({
    description: 'The meta description content for SEO.',
    example: 'A brief summary of my awesome blog post.',
    maxLength: 160,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(160) // Common SEO recommendation
  public metaDescription: string;

  /**
   * URL-friendly identifier for the content item.
   * Must be unique per language within its content type (blog/landing page) for a merchant.
   * @example "my-awesome-blog-post-title"
   */
  @ApiProperty({
    description:
      'URL-friendly identifier for the content item. Must be unique per language within its content type for a merchant.',
    example: 'my-awesome-blog-post-title',
  })
  @IsNotEmpty()
  @IsString()
  // Further validation for slug format (e.g., no spaces, lowercase) can be added via @Matches decorator if needed
  public slug: string;

  /**
   * The preferred URL for the content if duplicate content exists.
   * @example "https://example.com/blog/original-post"
   */
  @ApiProperty({
    description:
      'The preferred URL for the content if duplicate content exists.',
    example: 'https://example.com/blog/original-post',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  public canonicalUrl?: string;
}