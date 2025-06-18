import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, Min } from 'class-validator';

export class PagedResponseDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true, description: 'Array of data items for the current page.' })
  readonly data: T[];

  @IsInt()
  @Min(0)
  @ApiProperty({ type: Number, description: 'Total number of items available.', example: 100 })
  readonly totalCount: number;

  @IsInt()
  @Min(1)
  @ApiProperty({ type: Number, description: 'Current page number.', example: 1 })
  readonly page: number;

  @IsInt()
  @Min(1)
  @ApiProperty({ type: Number, description: 'Number of items per page.', example: 10 })
  readonly pageSize: number;

  constructor(data: T[], totalCount: number, page: number, pageSize: number) {
    this.data = data;
    this.totalCount = totalCount;
    this.page = page;
    this.pageSize = pageSize;
  }
}