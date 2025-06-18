import { Controller, Post, Body, UseGuards, Get, Param, Put, ForbiddenException, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserAccessService } from '../services/user-access.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { AssignRoleDto } from '../dtos/request/assign-role.dto';
import { UserResponseDto } from '../dtos/response/user.response.dto';
import { IUser } from '../interfaces/user.interface';
import { MERCHANT_ADMIN_ROLE, CAMPAIGN_MANAGER_ROLE } from '../constants/roles.constants';

@ApiTags('Users (Merchant Scope)')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userAccessService: UserAccessService) {}

  private mapUserToResponseDto(user: IUser): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      corePlatformUserId: user.corePlatformUserId,
      merchantId: user.merchantId,
      roles: user.roles,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Post()
  @Roles(MERCHANT_ADMIN_ROLE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user for the current merchant' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully.', type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input or user already exists.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden (Insufficient roles or not a Merchant Admin or trying to create for different merchant).' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async createUser(@Body() createUserDto: CreateUserDto, @CurrentUser() requestingUser: IUser): Promise<UserResponseDto> {
    if (createUserDto.merchantId && createUserDto.merchantId !== requestingUser.merchantId) {
         throw new ForbiddenException('Merchant Admins can only create users for their own merchant.');
    }
    // If merchantId is not provided by a merchant admin, default it to their own merchantId in the service
    const createdUser = await this.userAccessService.createUser(createUserDto, requestingUser);
    return this.mapUserToResponseDto(createdUser);
  }

  @Get()
  @Roles(MERCHANT_ADMIN_ROLE, CAMPAIGN_MANAGER_ROLE)
  @ApiOperation({ summary: 'Get all users for the current merchant' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of users for the current merchant.', type: [UserResponseDto] })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden (Insufficient roles or not a merchant-scoped user).' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getUsersForMerchant(@CurrentUser() requestingUser: IUser): Promise<UserResponseDto[]> {
      if (!requestingUser.merchantId) {
          throw new ForbiddenException('This endpoint is only accessible for merchant-scoped users.');
      }
      const users = await this.userAccessService.findUsersByMerchant(requestingUser.merchantId, requestingUser);
      return users.map(user => this.mapUserToResponseDto(user));
  }

  @Get(':userId')
  @Roles(MERCHANT_ADMIN_ROLE, CAMPAIGN_MANAGER_ROLE)
  @ApiOperation({ summary: 'Get a specific user by ID within the current merchant' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User details.', type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden (Insufficient roles or user is not in your merchant).' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getUserById(@Param('userId') userId: string, @CurrentUser() requestingUser: IUser): Promise<UserResponseDto> {
     const user = await this.userAccessService.findUserById(userId, requestingUser);
     return this.mapUserToResponseDto(user);
  }

  @Put(':userId')
  @Roles(MERCHANT_ADMIN_ROLE)
  @ApiOperation({ summary: 'Update a user by ID within the current merchant' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated successfully.', type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden (Insufficient roles or user is not in your merchant).' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() requestingUser: IUser): Promise<UserResponseDto> {
    const updatedUser = await this.userAccessService.updateUser(userId, updateUserDto, requestingUser);
    return this.mapUserToResponseDto(updatedUser);
  }

  @Post(':userId/roles')
  @Roles(MERCHANT_ADMIN_ROLE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a role to a user within the current merchant' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role assigned successfully, user updated.', type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input or role not assignable.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden (Insufficient roles or user is not in your merchant).' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async assignRole(@Param('userId') userId: string, @Body() assignRoleDto: AssignRoleDto, @CurrentUser() requestingUser: IUser): Promise<UserResponseDto> {
    const updatedUser = await this.userAccessService.assignRoleToUser(userId, assignRoleDto.roleName, requestingUser);
    return this.mapUserToResponseDto(updatedUser);
  }
}