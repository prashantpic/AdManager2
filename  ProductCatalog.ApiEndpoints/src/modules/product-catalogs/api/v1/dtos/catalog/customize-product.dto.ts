// src/modules/product-catalogs/api/v1/dtos/catalog/customize-product.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

/**
 * DTO for applying ad-specific customizations to a product in a catalog.
 * Defines the payload for customizing product attributes for advertising purposes within a specific catalog.
 */
export class CustomizeProductDto {
  /**
   * Ad-specific title override for the product in this catalog.
   * Maximum length of 255 characters.
   * @example "Special Offer: Premium Summer T-Shirt"
   */
  @ApiPropertyOptional({
    description: 'Ad-specific title override for the product in this catalog.',
    example: 'Special Offer: Premium Summer T-Shirt',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  adSpecificTitle?: string;

  /**
   * Ad-specific description override for the product in this catalog.
   * Maximum length of 1000 characters.
   * @example "Get this exclusive 100% organic cotton t-shirt, designed for ultimate summer comfort. Limited stock available!"
   */
  @ApiPropertyOptional({
    description: 'Ad-specific description override for the product in this catalog.',
    example: 'Get this exclusive 100% organic cotton t-shirt, designed for ultimate summer comfort. Limited stock available!',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adSpecificDescription?: string;

  /**
   * Ad-specific image URL override for the product in this catalog.
   * Must be a valid URL.
   * @example "https://cdn.example.com/ads/summer-tshirt-promo.png"
   */
  @ApiPropertyOptional({
    description: 'Ad-specific image URL override for the product in this catalog.',
    example: 'https://cdn.example.com/ads/summer-tshirt-promo.png',
    format: 'url',
  })
  @IsOptional()
  @IsUrl()
  adSpecificImageUrl?: string;

  /**
   * Custom attributes for the product specific to this catalog.
   * This can be a flexible key-value store for additional ad-specific data.
   * @example { "ad_cta_button_text": "Shop Now", "promo_code_display": "SUMMER20" }
   */
  @ApiPropertyOptional({
    description: 'Custom attributes for the product specific to this catalog.',
    example: { ad_cta_button_text: 'Shop Now', promo_code_display: 'SUMMER20' },
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  customAttributes?: Record<string, any>;
}