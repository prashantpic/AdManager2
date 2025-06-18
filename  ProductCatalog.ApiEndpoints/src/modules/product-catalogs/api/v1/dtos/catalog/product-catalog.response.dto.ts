// src/modules/product-catalogs/api/v1/dtos/catalog/product-catalog.response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsString, IsUUID } from 'class-validator';

/**
 * DTO for product catalog API responses.
 * Defines the structure of a product catalog object returned by the API.
 */
export class ProductCatalogResponseDto {
  /**
   * Unique identifier of the product catalog.
   * @example "f47ac10b-58cc-4372-a567-0e02b2c3d479"
   */
  @ApiProperty({ description: 'Unique identifier of the product catalog.', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', format: 'uuid' })
  @IsUUID()
  id: string;

  /**
   * Name of the product catalog.
   * @example "Summer Collection 2024"
   */
  @ApiProperty({ description: 'Name of the product catalog.', example: 'Summer Collection 2024' })
  @IsString()
  name: string;

  /**
   * Optional description of the product catalog.
   * @example "Product catalog for the upcoming summer advertising campaigns."
   */
  @ApiPropertyOptional({ description: 'Optional description of the product catalog.', example: 'Product catalog for the upcoming summer advertising campaigns.' })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Identifier of the merchant who owns this catalog.
   * @example "a35d7c6b-91f8-4a21-87a3-5c5e1b2f4d6e"
   */
  @ApiProperty({ description: 'Identifier of the merchant who owns this catalog.', example: 'a35d7c6b-91f8-4a21-87a3-5c5e1b2f4d6e', format: 'uuid' })
  @IsUUID()
  merchantId: string;

  /**
   * Current status of the product catalog.
   * @example "Active"
   */
  @ApiProperty({ description: 'Current status of the product catalog.', example: 'Active' })
  @IsString()
  status: string; // Could be an enum if predefined statuses exist

  /**
   * Number of products included in this catalog.
   * @example 150
   */
  @ApiProperty({ description: 'Number of products included in this catalog.', example: 150, type: Number })
  @IsInt()
  productCount: number;

  /**
   * Timestamp of when the catalog was created.
   */
  @ApiProperty({ description: 'Timestamp of when the catalog was created.', type: Date })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  /**
   * Timestamp of when the catalog was last updated.
   */
  @ApiProperty({ description: 'Timestamp of when the catalog was last updated.', type: Date })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}