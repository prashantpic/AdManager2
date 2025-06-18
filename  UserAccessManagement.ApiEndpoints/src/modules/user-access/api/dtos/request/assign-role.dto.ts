import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AdManagerRoles } from '../../constants/roles.constants';

export class AssignRoleDto {
  @ApiProperty({
    description: 'The name of the role to assign to the user.',
    enum: AdManagerRoles,
    example: AdManagerRoles.CAMPAIGN_MANAGER,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(AdManagerRoles, {
    message: `Role name must be one of the following values: ${Object.values(AdManagerRoles).join(', ')}`,
  })
  roleName: string;
}