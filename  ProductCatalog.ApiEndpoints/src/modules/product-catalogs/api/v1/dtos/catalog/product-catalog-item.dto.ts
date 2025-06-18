// src/modules/product-catalogs/api/v1/dtos/catalog/product-catalog-item.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * DTO representing an item within a product catalog, including customizations.
 * Defines the structure for a product item within an ad catalog, highlighting ad-specific overrides.
 */
export class ProductCatalogItemDto {
  /**
   * Unique identifier of the core product from the main platform.
   * @example "prod_1234567890"
   */
  @ApiProperty({ description: 'Unique identifier of the core product from the main platform.', example: 'prod_1234567890' })
  @IsString() // Assuming coreProductId is a string, could be UUID if applicable
  coreProductId: string;

  /**
   * Ad-specific title override for the product in this catalog.
   * @example "Limited Edition Summer T-Shirt"
   */
  @ApiPropertyOptional({ description: 'Ad-specific title override for the product in this catalog.', example: 'Limited Edition Summer T-Shirt' })
  @IsOptional()
  @IsString()
  adSpecificTitle?: string;

  /**
   * Ad-specific description override for the product in this catalog.
   * @example "100% cotton, breathable fabric, perfect for summer days."
   */
  @ApiPropertyOptional({ description: 'Ad-specific description override for the product in this catalog.', example: '100% cotton, breathable fabric, perfect for summer days.' })
  @IsOptional()
  @IsString()
  adSpecificDescription?: string;

  /**
   * Ad-specific image URL override for the product in this catalog.
   * @example "https://example.com/images/summer-tshirt-ad.jpg"
   */
  @ApiPropertyOptional({ description: 'Ad-specific image URL override for the product in this catalog.', example: 'https://example.com/images/summer-tshirt-ad.jpg', format: 'url' })
  @IsOptional()
  @IsString() // Add @IsUrl() if strict URL validation is required
  adSpecificImageUrl?: string;

  /**
   * Custom attributes for the product specific to this catalog.
   * This can be a flexible key-value store for additional ad-specific data.
   * @example { "campaign_theme": "Beach Vibes", "target_audience": "18-25" }
   */
  @ApiPropertyOptional({
    description: 'Custom attributes for the product specific to this catalog.',
    example: { campaign_theme: 'Beach Vibes', target_audience: '18-25' },
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  customAttributes?: Record<string, any>;

  /**
   * Indicates whether the product is currently included in this catalog.
   * This flag can be used to temporarily exclude products from feeds generated from this catalog.
   * @example true
   */
  @ApiProperty({ description: 'Indicates whether the product is currently included in this catalog.', example: true, type: Boolean })
  @IsBoolean()
  isIncluded: boolean;
}