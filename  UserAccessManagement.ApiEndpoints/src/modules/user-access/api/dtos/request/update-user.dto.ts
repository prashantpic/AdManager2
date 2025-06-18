import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsBoolean, IsArray, IsString, IsEnum } from 'class-validator';
import { AdManagerRoles } from '../../constants/roles.constants';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: "User's email address. Optional.",
    example: 'updated.user@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Activation status of the user. Optional.',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Array of role names to assign to the user. This will overwrite existing roles. Optional.',
    enum: AdManagerRoles,
    isArray: true,
    example: [AdManagerRoles.MERCHANT_ADMIN, AdManagerRoles.CAMPAIGN_MANAGER],
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