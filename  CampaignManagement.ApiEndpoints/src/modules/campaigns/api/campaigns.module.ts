import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { CampaignController } from './controllers/campaign.controller';
import { AdSetController } from './controllers/ad-set.controller';
import { AdController } from './controllers/ad.controller';
import { AdCreativeController } from './controllers/ad-creative.controller';
import { ABTestController } from './controllers/ab-test.controller';

import { ICampaignManagementService } from './services/interfaces/campaign-management.service.interface';
import { MockCampaignManagementService } from './services/mock-campaign-management.service'; // Placeholder
import { JwtStrategy } from './auth/strategies/jwt.strategy'; // Assumed path for JwtStrategy

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      // envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Optional: load specific .env files
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({ // Configure JwtModule for creating JWTs if needed, or for JwtStrategy verification
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
                expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
            },
        }),
        inject: [ConfigService],
    }),
  ],
  controllers: [
    CampaignController,
    AdSetController,
    AdController,
    AdCreativeController,
    ABTestController,
  ],
  providers: [
    {
      provide: ICampaignManagementService,
      useClass: MockCampaignManagementService, // Using the mock implementation
    },
    JwtStrategy, // JwtStrategy needs to be provided for Passport to use it
    // ConfigService is automatically provided by ConfigModule.forRoot()
  ],
  exports: [ICampaignManagementService, PassportModule, JwtModule], // Export if other modules need them
})
export class CampaignsApiModule {}