import { Controller, Get, Param, Put, Body, UseGuards, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserAccessService } from '../services/user-access.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserResponseDto } from '../dtos/response/user.response.dto';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { IUser } from '../interfaces/user.interface';
import { PLATFORM_ADMIN_ROLE } from '../constants/roles.constants';

@ApiTags('Users (Platform Admin)')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(PLATFORM_ADMIN_ROLE)
@Controller('platform-admin/users')
export class PlatformAdminUsersController {
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

  @Get()
  @ApiOperation({ summary: 'Get all users in the system (Platform Admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all users.', type: [UserResponseDto] })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden (Insufficient roles).' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getAllUsers(@CurrentUser() adminUser: IUser): Promise<UserResponseDto[]> {
       const users = await this.userAccessService.platformAdminListAllUsers(adminUser);
       return users.map(user => this.mapUserToResponseDto(user));
  }

  @Get('merchant/:merchantId')
  @ApiOperation({ summary: 'Get all users for a specific merchant (Platform Admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of users for the specified merchant.', type: [UserResponseDto] })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden (Insufficient roles).' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getMerchantUsers(@Param('merchantId') merchantId: string, @CurrentUser() adminUser: IUser): Promise<UserResponseDto[]> {
    const users = await this.userAccessService.findUsersByMerchant(merchantId, adminUser);
    return users.map(user => this.mapUserToResponseDto(user));
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get any user by ID (Platform Admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User details.', type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden (Insufficient roles).' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getAnyUserById(@Param('userId') userId: string, @CurrentUser() adminUser: IUser): Promise<UserResponseDto> {
    const user = await this.userAccessService.platformAdminGetAnyUserById(userId, adminUser);
    return this.mapUserToResponseDto(user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user (Platform Admin only)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully.', type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input or user already exists.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden (Insufficient roles).' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async platformCreateUser(@Body() createUserDto: CreateUserDto, @CurrentUser() adminUser: IUser): Promise<UserResponseDto> {
    const createdUser = await this.userAccessService.createUser(createUserDto, adminUser);
    return this.mapUserToResponseDto(createdUser);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update any user by ID (Platform Admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated successfully.', type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden (Insufficient roles or self-update restrictions).' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async platformUpdateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() adminUser: IUser): Promise<UserResponseDto> {
     const updatedUser = await this.userAccessService.platformAdminUpdateUser(userId, updateUserDto, adminUser);
     return this.mapUserToResponseDto(updatedUser);
  }
}