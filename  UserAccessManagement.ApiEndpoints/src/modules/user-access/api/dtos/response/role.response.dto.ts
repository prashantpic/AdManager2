import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IRole } from '../../interfaces/role.interface';
import { AdManagerRoles } from '../../constants/roles.constants';

export class RoleResponseDto implements IRole {
  @ApiProperty({
    description: 'Role ID (e.g., UUID or predefined string).',
    example: 'role-uuid-merchant-admin',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the role.',
    example: AdManagerRoles.MERCHANT_ADMIN,
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Array of permission strings/keys associated with this role.',
    example: ['read:campaign', 'write:campaign', 'read:user'],
    isArray: true,
  })
  permissions?: string[];

  @ApiPropertyOptional({
    description: 'A brief description of the role.',
    example: 'Manages campaigns and users for a specific merchant.',
  })
  description?: string;
}