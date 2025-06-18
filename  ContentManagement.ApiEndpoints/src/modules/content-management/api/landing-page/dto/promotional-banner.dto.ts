import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

/**
 * @file promotional-banner.dto.ts
 * @description DTO for promotional banner configuration on landing pages.
 * @requirement REQ-6-007
 * @namespace AdManager.ContentManagement.Api.V1.LandingPage.Dto
 */

/**
 * DTO representing a configurable promotional banner for landing pages.
 */
export class PromotionalBannerDto {
  /**
   * URL of the banner image.
   * @example "https://example.com/images/summer-sale-banner.jpg"
   */
  @ApiProperty({
    description: 'URL of the banner image.',
    example: 'https://example.com/images/summer-sale-banner.jpg',
  })
  @IsNotEmpty()
  @IsUrl()
  public imageUrl: string;

  /**
   * Alt text for the image, for accessibility and SEO.
   * @example "Summer Sale Banner: Up to 50% off"
   */
  @ApiProperty({
    description: 'Alt text for the image, for accessibility and SEO.',
    example: 'Summer Sale Banner: Up to 50% off',
    required: false,
  })
  @IsOptional()
  @IsString()
  public altText?: string;

  /**
   * URL the banner links to, if it's clickable.
   * @example "https://example.com/summer-sale"
   */
  @ApiProperty({
    description: "URL the banner links to, if it's clickable.",
    example: 'https://example.com/summer-sale',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  public linkUrl?: string;
}