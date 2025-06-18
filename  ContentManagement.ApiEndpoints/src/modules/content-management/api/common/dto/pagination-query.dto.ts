import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

/**
 * @file pagination-query.dto.ts
 * @description Data Transfer Object for common pagination query parameters.
 * @requirement REQ-6-001, REQ-6-006
 * @namespace AdManager.ContentManagement.Api.V1.Common.Dto
 */

/**
 * DTO representing common query parameters for paginating lists of resources.
 */
export class PaginationQueryDto {
  /**
   * The page number to retrieve.
   * @example 1
   */
  @ApiProperty({
    description: 'The page number to retrieve.',
    required: false,
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  public page: number = 1;

  /**
   * The number of items per page.
   * @example 10
   */
  @ApiProperty({
    description: 'The number of items per page.',
    required: false,
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  public limit: number = 10; // Default limit can also be set in config

  /**
   * The field to sort by.
   * @example "createdAt"
   */
  @ApiProperty({
    description: 'The field to sort by.',
    required: false,
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  public sortBy?: string;

  /**
   * The sort order.
   * @example "DESC"
   */
  @ApiProperty({
    description: 'The sort order.',
    required: false,
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  public sortOrder?: 'ASC' | 'DESC' = 'ASC';
}