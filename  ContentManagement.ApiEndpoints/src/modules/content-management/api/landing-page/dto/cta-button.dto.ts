import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

/**
 * @file cta-button.dto.ts
 * @description DTO for Call-to-Action button configuration on landing pages.
 * @requirement REQ-6-007, REQ-6-008
 * @namespace AdManager.ContentManagement.Api.V1.LandingPage.Dto
 */

/**
 * DTO representing a customizable Call-to-Action button for landing pages.
 */
export class CtaButtonDto {
  /**
   * Button display text.
   * @example "Shop Now"
   */
  @ApiProperty({ description: 'Button display text.', example: 'Shop Now' })
  @IsNotEmpty()
  @IsString()
  public text: string;

  /**
   * URL (external, internal page, product, or Direct Order deep-link).
   * @example "https://example.com/product/123"
   */
  @ApiProperty({
    description:
      'URL (external, internal page, product, or Direct Order deep-link).',
    example: 'https://example.com/product/123',
  })
  @IsNotEmpty()
  @IsString() // Using IsString to allow for deep-links which might not be valid IsUrl
  // If strict URL validation is needed and deep links have a specific pattern,
  // a custom validator or @Matches could be used. For now, IsString is more flexible.
  // @IsUrl() // Uncomment if all links must be standard URLs.
  public link: string;

  /**
   * Style identifier (e.g., 'primary', 'secondary').
   * This would typically map to CSS classes or styles on the frontend.
   * @example "primary"
   */
  @ApiProperty({
    description:
      "Style identifier (e.g., 'primary', 'secondary'). Maps to frontend styles.",
    example: 'primary',
    required: false,
  })
  @IsOptional()
  @IsString()
  public appearance?: string;
}