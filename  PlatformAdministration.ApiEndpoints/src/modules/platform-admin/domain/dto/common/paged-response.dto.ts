import { ApiProperty } from '@nestjs/swagger';

export class PagedResponseDto<T> {
  @ApiProperty({ isArray: true, description: 'Array of data items for the current page.' })
  data: T[];

  @ApiProperty({ example: 100, description: 'Total number of items available.' })
  totalCount: number;

  @ApiProperty({ example: 1, description: 'Current page number.' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page.' })
  limit: number;
}