import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AudienceSyncStatusResponseDto } from './audience-sync-status.v1.response.dto';

export class AudienceResponseDto {
  @ApiProperty({ description: 'Unique identifier for the audience.' })
  id: string;

  @ApiProperty({ description: 'Merchant identifier who owns this audience.' })
  merchantId: string;

  @ApiProperty({ description: 'Name of the audience.' })
  name: string;

  @ApiPropertyOptional({ description: 'Description of the audience.', nullable: true })
  description?: string | null;

  @ApiProperty({ enum: ['CUSTOM', 'LOOKALIKE'], description: 'Type of the audience.' })
  type: 'CUSTOM' | 'LOOKALIKE';

  @ApiProperty({ description: 'Source type of the audience data.' , example: 'PLATFORM_DATA_SEGMENT' })
  sourceType: string; // e.g., 'PLATFORM_DATA_SEGMENT', 'CUSTOMER_LIST_UPLOAD', 'LOOKALIKE_SOURCE'

  @ApiPropertyOptional({ description: 'Details about the source, structure depends on sourceType.', example: { platformSegmentId: 'seg123' } })
  sourceDetails?: any; // e.g., { platformSegmentId: 'seg123' } or { sourceAudienceId: 'aud456', sourceAudienceName: 'High Value Customers' }

  @ApiProperty({ type: () => [AudienceSyncStatusResponseDto], description: 'Synchronization status across different ad networks.' })
  adNetworkSyncInfo: AudienceSyncStatusResponseDto[];

  @ApiProperty({ description: 'Timestamp of audience creation.' })
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp of last audience update.' })
  updatedAt: Date;
}