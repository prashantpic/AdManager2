import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OAuthController } from './controllers/oauth.controller';
import { OAuthService } from './services/oauth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
// import { OAuth2Strategy } from './strategies/oauth2.strategy'; // This was for server-side logic, replaced by OAuthService for issuing
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ScopesGuard } from './guards/scopes.guard';
import { IThirdPartyConnectivityService } from '../common/interfaces/third-party-connectivity.interface';
import { ThirdPartyConnectivityServiceProvider } from '../common/providers/third-party-connectivity.provider';


/**
 * Module for authentication and authorization features, including OAuth 2.0.
 * It configures JWT handling, Passport strategies, and provides necessary services and controllers.
 */
@Global() // Making guards available globally if needed, or import AuthModule where needed.
@Module({
  imports: [
    ConfigModule, // Ensure ConfigService is available
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtAlgorithm = configService.get<string>('jwt.algorithm', 'HS256');
        const secret = configService.get<string>('jwt.secret');
        const publicKey = configService.get<string>('jwt.publicKey');
        const privateKey = configService.get<string>('jwt.privateKey');
        const accessTokenTTL = configService.get<string>('oauth.accessTokenTTL', '1h');

        if (jwtAlgorithm.startsWith('RS') || jwtAlgorithm.startsWith('ES')) {
            if(!publicKey || !privateKey) {
                throw new Error('JWT_PUBLIC_KEY and JWT_PRIVATE_KEY must be configured for RS/ES algorithms');
            }
             return {
                publicKey: publicKey.replace(/\\n/g, '\n'),
                privateKey: privateKey.replace(/\\n/g, '\n'),
                signOptions: { 
                    expiresIn: accessTokenTTL,
                    algorithm: jwtAlgorithm as any,
                },
            };
        } else { // HS256, HS384, HS512
            if(!secret) {
                throw new Error('JWT_SECRET must be configured for HS algorithms');
            }
            return {
                secret: secret,
                signOptions: { 
                    expiresIn: accessTokenTTL,
                    algorithm: jwtAlgorithm as any,
                },
            };
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [OAuthController],
  providers: [
    OAuthService,
    JwtStrategy,
    // OAuth2Strategy, // Replaced by OAuthService for issuing logic
    JwtAuthGuard,
    ScopesGuard,
    {
      provide: IThirdPartyConnectivityService,
      useClass: ThirdPartyConnectivityServiceProvider, // Provide a concrete implementation or mock
    },
  ],
  exports: [
    PassportModule,
    JwtModule,
    OAuthService,
    JwtAuthGuard,
    ScopesGuard,
  ],
})
export class AuthModule {}