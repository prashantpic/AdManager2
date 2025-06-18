import { Controller, Get, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserAccessService } from '../services/user-access.service';
import { RoleResponseDto } from '../dtos/response/role.response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IRole } from '../interfaces/role.interface';

@ApiTags('Roles')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly userAccessService: UserAccessService) {}

  private mapRoleToResponseDto(role: IRole): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      permissions: role.permissions,
      description: role.description, // Added description as per IRole potentially having it
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all available Ad Manager roles' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all roles.', type: [RoleResponseDto] })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getAllRoles(): Promise<RoleResponseDto[]> {
    const roles = await this.userAccessService.getRoles();
    return roles.map(role => this.mapRoleToResponseDto(role));
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get a specific role by name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role details.', type: RoleResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Role not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getRoleByName(@Param('name') roleName: string): Promise<RoleResponseDto> {
    const role = await this.userAccessService.getRoleByName(roleName);
    return this.mapRoleToResponseDto(role);
  }
}