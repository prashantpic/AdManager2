import { ApiProperty } from '@nestjs/swagger';

/**
 * @class PagedResponseDto
 * @description Generic DTO for paginated API responses.
 * @namespace AdManager.PromotionsOffers.Api.V1.Dto.Common
 * @template T The type of data items in the paged response.
 */
export class PagedResponseDto<T> {
  @ApiProperty({
    isArray: true,
    description: 'Array of data items for the current page.',
  })
  data: T[];

  @ApiProperty({
    type: Number,
    description: 'Total number of items available.',
    example: 100,
  })
  total: number;

  @ApiProperty({
    type: Number,
    description: 'Current page number.',
    example: 1,
  })
  page: number;

  @ApiProperty({
    type: Number,
    description: 'Number of items per page.',
    example: 10,
  })
  limit: number;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}