import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

/**
 * @file paginated-response.dto.ts
 * @description Generic Data Transfer Object for paginated API responses.
 * @Requirement REQ-6-001, REQ-6-006
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of resource items for the current page.',
    isArray: true,
    // The items property will be dynamically set up in the controller
    // using a helper function or by passing the specific type to ApiProperty.
    // For general definition, we can use a placeholder or rely on SwaggerModule.createDocument
    // to infer it correctly when used with specific types.
    // Example: items: { $ref: getSchemaPath(ConcreteDto) }
  })
  data: T[];

  @ApiProperty({
    description: 'Total number of items available across all pages.',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number.',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page.',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages available.',
    example: 10,
  })
  totalPages: number;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}