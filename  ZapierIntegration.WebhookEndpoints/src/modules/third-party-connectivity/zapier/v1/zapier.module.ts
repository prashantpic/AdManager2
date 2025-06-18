import { Module, Logger } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ZapierController } from './zapier.controller';
import { ZapierService } from './zapier.service';
import { IZapierService } from './interfaces/zapier-service.interface';
import { ZapierConfig } from './config/zapier.config';
import { ZapierWebhookGuard } from './guards/zapier-webhook.guard';
// If ZapierService interacts with other Ad Manager domain services, they might need to be imported here
// and provided if they are part of a different module.
// e.g., import { LeadManagementModule } from '../../../../leads/lead-management.module';
// e.g., import { AnalyticsModule } from '../../../../analytics/analytics.module';

/**
 * @module ZapierModuleV1
 * @description The Zapier V1 module, bundling controllers, services, and configuration for Zapier integration.
 * This module facilitates receiving webhook notifications from Zapier for Google Ads events
 * and potentially triggering outbound Zaps.
 * @requires HttpModule - For making HTTP requests to Zapier.
 * @requires ConfigModule - For managing application configurations, including Zapier secrets.
 */
@Module({
  imports: [
    HttpModule.register({
      // Default configuration for HttpService used within this module
      timeout: 5000, // Default timeout for outgoing HTTP requests
      maxRedirects: 5, // Default maximum number of redirects to follow
    }),
    ConfigModule, // Ensures ConfigService is available for ZapierConfig
    // Example: If ZapierService needs to interact with a LeadManagementService from another module
    // LeadManagementModule,
    // Example: If ZapierService needs to interact with an AnalyticsProcessingService from another module
    // AnalyticsModule,
  ],
  controllers: [ZapierController],
  providers: [
    ZapierService, // Provides the concrete implementation of ZapierService
    {
      provide: IZapierService, // Defines the injection token for IZapierService
      useClass: ZapierService,  // Specifies ZapierService as the class to use for IZapierService
    },
    ZapierConfig,    // Provides Zapier-specific configuration access
    ZapierWebhookGuard, // Provides the guard for authenticating Zapier webhooks
    Logger, // Provides the Logger service for dependency injection
  ],
  exports: [
    IZapierService, // Exports the IZapierService token for use in other modules if needed
    ZapierConfig,   // Exports ZapierConfig for use in other modules if needed
  ],
})
export class ZapierModuleV1 {}