import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AffiliateMarketingV1Module } from './modules/affiliate-marketing/api/v1/affiliate-marketing.v1.module';

/**
 * The root module of the application.
 * It imports the main feature module `AffiliateMarketingV1Module` and
 * global configuration modules like `ConfigModule`.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available throughout the application
      // envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Optional: if you have different .env files per environment
      // ignoreEnvFile: process.env.NODE_ENV === 'production', // Optional: ignore .env file in production if using other config sources
    }),
    AffiliateMarketingV1Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}