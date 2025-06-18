import { ApiProperty } from '@nestjs/swagger';

export class PagedResponseDto<T> {
  @ApiProperty({ isArray: true, description: 'The list of items for the current page.' })
  readonly data: T[];

  @ApiProperty({ type: Number, description: 'Total number of items across all pages.' })
  readonly total: number;

  @ApiProperty({ type: Number, description: 'Current page number.' })
  readonly page: number;

  @ApiProperty({ type: Number, description: 'Number of items per page.' })
  readonly limit: number;

  @ApiProperty({ type: Number, description: 'Total number of pages.' })
  readonly totalPages: number;

  @ApiProperty({ type: Boolean, description: 'Indicates if there is a next page.' })
  readonly hasNextPage: boolean;

  @ApiProperty({ type: Boolean, description: 'Indicates if there is a previous page.' })
  readonly hasPreviousPage: boolean;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
    this.hasNextPage = page < this.totalPages;
    this.hasPreviousPage = page > 1 && page <= this.totalPages; // Ensure previous page is valid
  }
}