import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserAccessService } from './services/user-access.service';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { RolesController } from './controllers/roles.controller';
import { PlatformAdminUsersController } from './controllers/platform-admin.users.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
// Potentially import a CorePlatformIntegrationModule if interaction is complex

@Module({
  imports: [
    ConfigModule, // Ensure ConfigService is available
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
    // CorePlatformIntegrationModule, // If interactions are abstracted
  ],
  controllers: [
    AuthController,
    UsersController,
    RolesController,
    PlatformAdminUsersController,
  ],
  providers: [
    UserAccessService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    // CorePlatformAuthService (if separate)
  ],
  exports: [
    UserAccessService,
    PassportModule,
    JwtModule,
    JwtAuthGuard,
    RolesGuard,
  ], // Export if other Ad Manager modules need them
})
export class UserAccessModule {}