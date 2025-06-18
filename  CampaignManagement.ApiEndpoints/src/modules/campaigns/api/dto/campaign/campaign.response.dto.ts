import { ApiProperty } from '@nestjs/swagger';
import { CampaignStatus } from '../../common/enums/campaign-status.enum';
import { AdNetwork } from '../../common/enums/ad-network.enum';

/**
 * Data Transfer Object for representing a campaign in API responses.
 */
export class CampaignResponseDto {
  @ApiProperty({
    description: 'Unique identifier (UUID v4) of the campaign.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the campaign.',
    example: 'Summer Sale 2024',
  })
  name: string;

  @ApiProperty({
    description: 'List of target advertising networks for the campaign.',
    enum: AdNetwork,
    isArray: true,
    example: [AdNetwork.GOOGLE, AdNetwork.INSTAGRAM],
  })
  targetAdNetworks: AdNetwork[];

  @ApiProperty({
    description: 'Total budget allocated for the campaign.',
    example: 1000.50,
    type: Number,
  })
  budget: number;

  @ApiProperty({
    description: 'Campaign start date in ISO 8601 format.',
    example: '2024-07-01T00:00:00.000Z',
    type: String,
    format: 'date-time'
  })
  startDate: Date;

  @ApiProperty({
    description: 'Campaign end date in ISO 8601 format.',
    example: '2024-07-31T23:59:59.000Z',
    type: String,
    format: 'date-time'
  })
  endDate: Date;

  @ApiProperty({
    description: 'Current status of the campaign.',
    enum: CampaignStatus,
    example: CampaignStatus.ACTIVE,
  })
  status: CampaignStatus;

  @ApiProperty({
    description: 'Timestamp when the campaign was created (ISO 8601).',
    example: '2024-06-15T10:00:00.000Z',
    type: String,
    format: 'date-time'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the campaign was last updated (ISO 8601).',
    example: '2024-06-20T14:30:00.000Z',
    type: String,
    format: 'date-time'
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Unique identifier (UUID v4) of the merchant who owns this campaign.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  merchantId: string;
}