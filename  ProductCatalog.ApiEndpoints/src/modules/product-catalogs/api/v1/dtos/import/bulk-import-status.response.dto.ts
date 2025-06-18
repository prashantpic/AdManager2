// src/modules/product-catalogs/api/v1/dtos/import/bulk-import-status.response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsInt, IsIn, IsOptional, IsString, IsUUID, Min } from 'class-validator';

const importStatuses = ['Pending', 'Processing', 'Completed', 'Failed', 'PartiallyCompleted'];

/**
 * DTO for bulk import status responses.
 * Defines the structure for reporting the status of a bulk product data import job.
 */
export class BulkImportStatusResponseDto {
  /**
   * Unique identifier for the import job.
   * @example "c92a1b3e-8f5a-4e2d-8f6b-1b2c3d4e5f6a"
   */
  @ApiProperty({ description: 'Unique identifier for the import job.', example: 'c92a1b3e-8f5a-4e2d-8f6b-1b2c3d4e5f6a', format: 'uuid' })
  @IsUUID()
  importId: string;

  /**
   * Current status of the import job.
   * @example "Processing"
   */
  @ApiProperty({
    description: 'Current status of the import job.',
    enum: importStatuses,
    example: 'Processing',
  })
  @IsString()
  @IsIn(importStatuses)
  status: string;

  /**
   * Total number of records or items processed from the import file.
   * Available once processing begins.
   * @example 1000
   */
  @ApiPropertyOptional({ description: 'Total number of records or items processed from the import file.', example: 1000, type: Number })
  @IsOptional()
  @IsInt()
  @Min(0)
  processedCount?: number;

  /**
   * Number of records or items successfully imported.
   * Available as processing progresses or upon completion.
   * @example 950
   */
  @ApiPropertyOptional({ description: 'Number of records or items successfully imported.', example: 950, type: Number })
  @IsOptional()
  @IsInt()
  @Min(0)
  successCount?: number;

  /**
   * Number of records or items that failed to import due to errors.
   * Available as processing progresses or upon completion.
   * @example 50
   */
  @ApiPropertyOptional({ description: 'Number of records or items that failed to import due to errors.', example: 50, type: Number })
  @IsOptional()
  @IsInt()
  @Min(0)
  errorCount?: number;

  /**
   * An array of error messages encountered during the import process.
   * Typically populated if `status` is 'Failed' or 'PartiallyCompleted', or if `errorCount` > 0.
   * @example ["Error on row 10: Invalid product ID format", "Error on row 25: Price cannot be negative"]
   */
  @ApiPropertyOptional({
    description: 'An array of error messages encountered during the import process.',
    type: [String],
    example: ["Error on row 10: Invalid product ID format", "Error on row 25: Price cannot be negative"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  errors?: string[];

  /**
   * Timestamp of when the import job started processing.
   */
  @ApiPropertyOptional({ description: 'Timestamp of when the import job started processing.', type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startedAt?: Date;

  /**
   * Timestamp of when the import job completed (successfully or with failures).
   */
  @ApiPropertyOptional({ description: 'Timestamp of when the import job completed.', type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completedAt?: Date;
}