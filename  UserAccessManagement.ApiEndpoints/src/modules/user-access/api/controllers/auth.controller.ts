import { Controller, Post, Body, UseGuards, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from '../dtos/request/login.dto';
import { RefreshTokenDto } from '../dtos/request/refresh-token.dto';
import { AuthTokenResponseDto } from '../dtos/response/auth-token.response.dto';
import { UserAccessService } from '../services/user-access.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { IUser } from '../interfaces/user.interface';
import { UserResponseDto } from '../dtos/response/user.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userAccessService: UserAccessService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // SDS implies 201 for tokens, but 200 for login is also common. Let's use OK.
  @ApiOperation({ summary: 'Login user via core platform token and get Ad Manager tokens' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Ad Manager tokens generated successfully.', type: AuthTokenResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid core platform token or user inactive.' })
  async login(@Body() loginDto: LoginDto): Promise<AuthTokenResponseDto> {
    const user = await this.userAccessService.validateUserWithCorePlatform(loginDto.corePlatformToken);
    return this.userAccessService.generateAdManagerTokens(user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh Ad Manager access token using refresh token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'New Ad Manager tokens generated successfully.', type: AuthTokenResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid or expired refresh token.' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthTokenResponseDto> {
      return this.userAccessService.refreshToken(refreshTokenDto.refreshToken);
  }


  @Get('me')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated Ad Manager user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Current user profile.', type: UserResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async getProfile(@CurrentUser() user: IUser): Promise<UserResponseDto> {
    // Manually map IUser to UserResponseDto as per SDS and clean architecture
    // The `user` object comes from the JWT payload via JwtStrategy and CurrentUser decorator
    return {
        id: user.id,
        corePlatformUserId: user.corePlatformUserId,
        merchantId: user.merchantId,
        email: user.email,
        roles: user.roles,
        isActive: user.isActive,
        // createdAt and updatedAt are not typically in the JWT payload from @CurrentUser,
        // so they might be undefined here unless JwtStrategy fetches the full user.
        // For profile, this basic info from token is often sufficient.
    };
  }
}