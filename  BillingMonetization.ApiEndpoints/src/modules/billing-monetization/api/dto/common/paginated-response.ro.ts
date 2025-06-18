import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsBoolean } from 'class-validator';

export class PaginatedResponseRO<T> {
  @ApiProperty({
    isArray: true,
    description: 'Array of data items for the current page.',
  })
  @IsArray()
  data: T[];

  @ApiProperty({ description: 'Total number of items available.', example: 100 })
  @IsNumber()
  totalCount: number;

  @ApiProperty({ description: 'Current page number.', example: 1 })
  @IsNumber()
  page: number;

  @ApiProperty({ description: 'Number of items per page.', example: 10 })
  @IsNumber()
  limit: number;

  @ApiProperty({
    description: 'Indicates if there is a next page.',
    example: true,
  })
  @IsBoolean()
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Indicates if there is a previous page.',
    example: false,
  })
  @IsBoolean()
  hasPreviousPage: boolean;

  constructor(
    data: T[],
    totalCount: number,
    page: number,
    limit: number,
  ) {
    this.data = data;
    this.totalCount = totalCount;
    this.page = page;
    this.limit = limit;
    this.hasNextPage = page * limit < totalCount;
    this.hasPreviousPage = page > 1;
  }
}