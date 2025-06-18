import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IUser } from '../../interfaces/user.interface';

export class UserResponseDto implements IUser {
  @ApiProperty({
    description: 'Ad Manager User ID (UUID).',
    example: 'c1d2e3f4-a5b6-7890-1234-567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: "User's email address.",
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'ID from [PlatformName] core system.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  corePlatformUserId: string;

  @ApiPropertyOptional({
    description: 'Associated merchant ID, if applicable. Null for platform-level users.',
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
    nullable: true,
  })
  merchantId?: string | null;

  @ApiProperty({
    description: 'Array of role names assigned to the user.',
    example: ['CampaignManager', 'MerchantAdmin'],
    isArray: true,
  })
  roles: string[];

  @ApiProperty({
    description: 'Indicates if the user account is active.',
    example: true,
  })
  isActive: boolean;

  // Optional fields as per IUser, if they are returned
  @ApiPropertyOptional({
    description: 'Timestamp of user creation.',
    example: '2023-01-15T10:30:00.000Z',
  })
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'Timestamp of last user update.',
    example: '2023-01-16T12:45:00.000Z',
  })
  updatedAt?: Date;
}