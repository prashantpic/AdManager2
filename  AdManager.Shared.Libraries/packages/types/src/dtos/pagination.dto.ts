import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString, IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Example max limit
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}

export interface IPaginatedMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export class PaginatedResponseDto<T> {
  readonly items: T[];
  readonly meta: IPaginatedMeta;

  constructor(items: T[], totalItems: number, page: number, limit: number) {
    this.items = items;
    this.meta = {
      totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    };
  }
}