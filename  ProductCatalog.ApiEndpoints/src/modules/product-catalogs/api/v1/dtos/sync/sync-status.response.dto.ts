// src/modules/product-catalogs/api/v1/dtos/sync/sync-status.response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

const syncStatuses = ['Idle', 'InProgress', 'Completed', 'Failed', 'PartiallyCompleted', 'Scheduled'];

/**
 * DTO for core platform synchronization status responses.
 * Defines the structure for reporting the status of a product data synchronization job with the core platform.
 */
export class SyncStatusResponseDto {
  /**
   * Unique identifier for the synchronization job, if applicable.
   * May not be present if reporting a general or scheduled status not tied to a specific run.
   * @example "d83h2n4f-9g4k-5j1m-7h2n-9f3k2j1h4g5d"
   */
  @ApiPropertyOptional({
    description: 'Unique identifier for the synchronization job, if applicable.',
    example: 'd83h2n4f-9g4k-5j1m-7h2n-9f3k2j1h4g5d',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID() // Assuming syncJobId, if present, is a UUID
  syncJobId?: string;

  /**
   * Current status of the synchronization process.
   * @example "Completed"
   */
  @ApiProperty({
    description: 'Current status of the synchronization process.',
    enum: syncStatuses,
    example: 'Completed',
  })
  @IsString()
  @IsIn(syncStatuses)
  status: string;

  /**
   * Timestamp of the last successful synchronization.
   * Not present if no successful sync has occurred yet.
   */
  @ApiPropertyOptional({ description: 'Timestamp of the last successful synchronization.', type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastSyncAt?: Date;

  /**
   * Timestamp of the next scheduled synchronization, if applicable.
   */
  @ApiPropertyOptional({ description: 'Timestamp of the next scheduled synchronization, if applicable.', type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  nextScheduledSyncAt?: Date;

  /**
   * Additional details about the sync status.
   * This could be a string message or a structured object with more granular information,
   * e.g., number of items synced, errors encountered.
   * @example { "itemsProcessed": 1200, "itemsFailed": 5, "lastErrorMessage": "Connection timeout to core platform API." }
   */
  @ApiPropertyOptional({
    description: 'Additional details about the sync status (can be a string or an object).',
    example: { itemsProcessed: 1200, itemsFailed: 5, lastErrorMessage: 'Connection timeout.' },
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject() // Or @IsString() if it's always a simple message
  details?: Record<string, any> | string;
}