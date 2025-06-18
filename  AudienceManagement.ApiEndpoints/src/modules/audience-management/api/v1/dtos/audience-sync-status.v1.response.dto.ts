import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AudienceSyncStatusResponseDto {
  @ApiProperty({ description: 'Identifier of the ad network.' })
  adNetworkId: string;
  
  @ApiProperty({ description: 'Name of the ad network.' })
  adNetworkName: string; // Added for better UX

  @ApiPropertyOptional({ description: 'External ID of the audience on the ad network, if synced.', nullable: true })
  externalAudienceId?: string | null;

  @ApiProperty({ description: 'Current synchronization status with the ad network.' , example: 'SYNCED' }) // Example updated to match typical statuses
  status: string; // e.g., 'SYNCED', 'PENDING_SYNC', 'FAILED', 'NOT_CONFIGURED', 'SYNCING'

  @ApiPropertyOptional({ description: 'Timestamp of the last successful synchronization or attempt.', nullable: true })
  lastSyncedAt?: Date | null;

  @ApiPropertyOptional({ type: Number, description: 'Current estimated size of the audience on the ad network.', nullable: true })
  currentSize?: number | null;

  @ApiPropertyOptional({ description: 'Any informational or error message from the ad network regarding this audience.', nullable: true })
  message?: string | null;
}