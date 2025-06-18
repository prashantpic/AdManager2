import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsArray, IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePlatformAdministratorRequestDto {
  @ApiProperty({
    required: false,
    description: 'New email address for the platform administrator.',
    example: 'updatedadmin@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Updated list of roles for the platform administrator.',
    example: ['PlatformAdministrator', 'Auditor'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roles?: string[];

  @ApiProperty({
    required: false,
    description: 'Set the active status of the platform administrator account.',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}