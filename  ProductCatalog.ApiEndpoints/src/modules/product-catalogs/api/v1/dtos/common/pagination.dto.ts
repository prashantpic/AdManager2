// src/modules/product-catalogs/api/v1/dtos/common/pagination.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * Data Transfer Object for pagination parameters.
 * Defines common query parameters for paginated API responses.
 */
export class PaginationDto {
  /**
   * Page number for pagination.
   * @example 1
   */
  @ApiPropertyOptional({
    description: 'Page number for pagination.',
    default: 1,
    type: Number,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /**
   * Number of items per page.
   * @example 10
   */
  @ApiPropertyOptional({
    description: 'Number of items per page.',
    default: 10,
    type: Number,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // As per SDS 4.5.1 Members description for PaginationDto.limit
  limit?: number = 10;
}