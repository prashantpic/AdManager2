// src/modules/product-catalogs/api/v1/dtos/catalog/update-product-catalog.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsNotEmpty } from 'class-validator';

/**
 * DTO for updating an existing product catalog.
 * Defines the data structure for updating product catalog details. All fields are optional.
 */
export class UpdateProductCatalogDto {
  /**
   * Updated name of the product catalog.
   * If provided, must be a non-empty string with a maximum length of 255 characters.
   * @example "Fall Collection 2024"
   */
  @ApiPropertyOptional({
    description: 'Updated name of the product catalog.',
    example: 'Fall Collection 2024',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty() // Ensures that if 'name' is provided, it's not an empty string.
  @MaxLength(255)
  name?: string;

  /**
   * Updated description of the product catalog.
   * If provided, maximum length of 1000 characters.
   * @example "Updated catalog for fall advertising campaigns."
   */
  @ApiPropertyOptional({
    description: 'Updated description of the product catalog.',
    example: 'Updated catalog for fall advertising campaigns.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}