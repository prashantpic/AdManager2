import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommissionStructureResponseDto } from '../commissions/commission-structure.response.dto';
import { Type } from 'class-transformer';

export class ProgramResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the affiliate program.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Identifier of the merchant who owns this program.',
    example: 'm1e2r3c4-h5a6-n7t8-9p0q-rstuvwxyz123',
  })
  merchantId: string;

  @ApiProperty({
    description: 'The name of the affiliate program.',
    example: 'Summer Sale Affiliate Program',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the affiliate program.',
    example: 'Promote our summer collection and earn high commissions!',
  })
  description?: string;

  @ApiProperty({
    description: 'Cookie window in days for tracking affiliate referrals.',
    example: 30,
  })
  cookieWindowDays: number;

  @ApiProperty({
    description: 'Indicates if the program is currently active.',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'The commission structure for this program.',
    type: () => CommissionStructureResponseDto,
  })
  @Type(() => CommissionStructureResponseDto)
  commissionStructure: CommissionStructureResponseDto;

  @ApiProperty({
    description: 'Base URL for generating affiliate tracking links.',
    example: 'https://yourdomain.com/track?pid={{programId}}&aid={{affiliateId}}&ref={{customRef}}',
  })
  trackingLinkBaseUrl: string;

  @ApiProperty({
    description: 'Timestamp of when the program was created.',
    example: '2023-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of when the program was last updated.',
    example: '2023-01-15T14:30:00.000Z',
  })
  updatedAt: Date;
}