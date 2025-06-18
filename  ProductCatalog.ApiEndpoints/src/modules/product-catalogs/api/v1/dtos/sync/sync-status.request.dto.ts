// src/modules/product-catalogs/api/v1/dtos/sync/sync-status.request.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

/**
 * DTO for requesting the status of a core [PlatformName] product data synchronization.
 * Allows querying for a specific sync job or the general sync status.
 */
export class SyncStatusRequestDto {
  /**
   * Optional unique identifier of a specific synchronization job.
   * If provided, the status for this particular job run will be returned.
   * If not provided, the general/latest synchronization status for the merchant might be returned.
   * @example "d83h2n4f-9g4k-5j1m-7h2n-9f3k2j1h4g5d"
   */
  @ApiPropertyOptional({
    description: 'Optional unique identifier (UUID) of a specific synchronization job to get status for.',
    example: 'd83h2n4f-9g4k-5j1m-7h2n-9f3k2j1h4g5d',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  syncJobId?: string;
}