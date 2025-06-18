import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, IsArray, IsEnum } from 'class-validator';
import { AdManagerRoles } from '../../constants/roles.constants';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address of the user.',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Unique identifier for the user from the [PlatformName] core system.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsNotEmpty()
  @IsUUID() // Assuming it's a UUID, adjust if it's a generic string
  corePlatformUserId: string;

  @ApiPropertyOptional({
    description: 'Associated merchant ID for merchant-scoped users. Optional for platform-level users.',
    example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210',
  })
  @IsOptional()
  @IsUUID()
  merchantId?: string | null;

  @ApiPropertyOptional({
    description: 'Array of role names to assign to the new user.',
    enum: AdManagerRoles,
    isArray: true,
    example: [AdManagerRoles.CAMPAIGN_MANAGER],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsEnum(AdManagerRoles, {
    each: true,
    message: `Each role must be one of the following values: ${Object.values(AdManagerRoles).join(', ')}`,
  })
  roles?: string[];
}