import { Module } from '@nestjs/common';
import { CorePlatformIntegrationModule } from './modules/core-platform-integration/service/core-platform-integration.module';
import { ConfigModule } from '@nestjs/config';
import { CorePlatformApiConfig } from './modules/core-platform-integration/service/common/config/core-platform-api.config';

/**
 * The main application module that ties together all parts of the CorePlatformIntegration service.
 * It acts as the root module, organizing and importing all other feature modules like
 * CorePlatformIntegrationModule and ConfigModule for application-wide configuration.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available app-wide
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Environment-specific .env files
      load: [CorePlatformApiConfig], // Loads custom configuration factory
    }),
    CorePlatformIntegrationModule,
  ],
})
export class AppModule {}