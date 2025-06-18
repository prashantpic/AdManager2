// src/modules/product-catalogs/api/v1/dtos/sync/trigger-sync.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';

/**
 * DTO for triggering synchronization with the core [PlatformName] platform.
 * Defines parameters for initiating a product data synchronization task.
 */
export class TriggerSyncDto {
  /**
   * Optional array of specific catalog IDs to synchronize.
   * If not provided or empty, the synchronization may apply to all relevant catalogs for the merchant,
   * or as per default service behavior.
   * Each ID must be a valid UUID.
   * @example ["f47ac10b-58cc-4372-a567-0e02b2c3d479", "e29b1c0a-7ef8-4e5b-9c1d-03b2a1c0d8f6"]
   */
  @ApiPropertyOptional({
    description: 'Optional array of specific catalog IDs (UUIDs) to synchronize. If empty, syncs all merchant catalogs.',
    type: [String],
    format: 'uuid',
    example: ["f47ac10b-58cc-4372-a567-0e02b2c3d479", "e29b1c0a-7ef8-4e5b-9c1d-03b2a1c0d8f6"],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true, message: 'Each catalogId must be a valid UUID version 4.' }) // '4' specifies UUID version
  catalogIds?: string[];

  /**
   * Optional flag to force a full synchronization.
   * If true, the system attempts a full resync rather than an incremental one.
   * Defaults to false (incremental sync) if not specified.
   * @example true
   */
  @ApiPropertyOptional({
    description: 'If true, forces a full synchronization instead of an incremental one. Defaults to false.',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  forceFullSync?: boolean;
}