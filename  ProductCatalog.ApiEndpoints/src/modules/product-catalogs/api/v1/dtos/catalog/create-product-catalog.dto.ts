// src/modules/product-catalogs/api/v1/dtos/catalog/create-product-catalog.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * DTO for creating a new product catalog.
 * Defines the data structure required to create a new product catalog.
 */
export class CreateProductCatalogDto {
  /**
   * Name of the product catalog.
   * Must be a non-empty string with a maximum length of 255 characters.
   * @example "Summer Collection 2024"
   */
  @ApiProperty({
    description: 'Name of the product catalog.',
    example: 'Summer Collection 2024',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  /**
   * Optional description of the product catalog.
   * Maximum length of 1000 characters.
   * @example "Product catalog for the upcoming summer advertising campaigns."
   */
  @ApiPropertyOptional({
    description: 'Optional description of the product catalog.',
    example: 'Product catalog for the upcoming summer advertising campaigns.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}