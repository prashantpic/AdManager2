import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config'; // Renamed to avoid conflict if a custom ConfigModule is made
import { AuthModule } from './auth/auth.module';
import { RegistryModule } from './registry/registry.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { DataExchangeModule } from './data-exchange/data-exchange.module';
// The 'configuration' function for ConfigModule.forRoot is typically loaded in AppModule (root)
// and made global. If it's not global, it would need to be loaded here too.
// Assuming it's global as per SDS for app.module.ts.

/**
 * @module AppStoreIntegrationV1Module
 * @description Main NestJS module for Version 1 of the App Store Integration API.
 * This module aggregates all feature-specific modules that constitute V1 of the API framework,
 * including authentication, application registry, webhook management, and data exchange.
 * It also ensures that the NestJS ConfigModule is available to its constituent modules.
 */
@Module({
  imports: [
    /**
     * NestConfigModule is typically initialized globally in AppModule with `ConfigModule.forRoot({ isGlobal: true })`.
     * Listing it here again is for explicit dependency declaration as per this module's LogicDescription in SDS,
     * though it's not strictly necessary if already global.
     */
    NestConfigModule,
    AuthModule,
    RegistryModule,
    WebhooksModule,
    DataExchangeModule,
  ],
  controllers: [
    // This module is an aggregator, so it typically doesn't have its own controllers.
  ],
  providers: [
    // This module aggregates other modules; services are provided within those modules.
  ],
  exports: [
    // This module is not typically exported itself but is imported by the root AppModule.
  ],
})
export class AppStoreIntegrationV1Module {}