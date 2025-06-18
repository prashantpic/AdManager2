// src/modules/product-catalogs/api/v1/dtos/common/api-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Generic Data Transfer Object for API responses, particularly for paginated lists.
 * Provides a standardized structure for returning lists of data with pagination information.
 */
export class PaginatedResponseDto<T> {
  /**
   * Array of data items for the current page.
   */
  @ApiProperty({ isArray: true, description: 'Array of data items for the current page.' })
  @IsArray()
  @ValidateNested({ each: true })
  // Type(() => T) is tricky for generics. The @ApiProperty type hint helps Swagger.
  // The actual type of 'data' elements will be determined by the context where PaginatedResponseDto<T> is used.
  data: T[];

  /**
   * Total number of items available across all pages.
   * @example 100
   */
  @ApiProperty({ description: 'Total number of items available across all pages.', type: Number, example: 100 })
  @IsInt()
  total: number;

  /**
   * Current page number.
   * @example 1
   */
  @ApiProperty({ description: 'Current page number.', type: Number, example: 1 })
  @IsInt()
  page: number;

  /**
   * Number of items per page.
   * @example 10
   */
  @ApiProperty({ description: 'Number of items per page.', type: Number, example: 10 })
  @IsInt()
  limit: number;

  /**
   * Constructor for PaginatedResponseDto.
   * @param data Array of data items.
   * @param total Total number of items.
   * @param page Current page number.
   * @param limit Items per page.
   */
  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}