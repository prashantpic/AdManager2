import { Module } from '@nestjs/common';
import { AppStoreIntegrationV1Module } from './v1/app-store-integration-v1.module';

/**
 * @module AppStoreIntegrationApiModule
 * @description Top-level NestJS module for the App Store Integration feature.
 * This module acts as an aggregator for different API versions or core feature modules
 * related to App Store integration. For the current implementation, it primarily imports
 * and makes available the V1 of the App Store Integration API.
 *
 * If multiple API versions were supported, this module would manage routing or selection between them.
 *
 * It fulfills requirements REQ-TCE-007 and REQ-TCE-008 by providing a structured
 * entry point for App Store integration functionalities.
 *
 * @see AppStoreIntegrationV1Module
 *
 * @implements Feature Module Aggregation
 * @implements API Version Management (Conceptual)
 *
 * @property {string} Namespace - AdManager.AppStoreIntegration.Api
 * @property {string} Metadata.Category - Module
 */
@Module({
  imports: [
    AppStoreIntegrationV1Module,
    // In the future, other versions like AppStoreIntegrationV2Module would be imported here.
    // This module could then potentially use NestJS's RouterModule to manage different
    // version paths or implement custom version selection logic if needed.
  ],
  controllers: [
    // Controllers are typically defined within specific versioned modules (e.g., AppStoreIntegrationV1Module)
    // rather than at this top-level aggregator module.
  ],
  providers: [
    // Providers are typically defined within specific versioned modules.
  ],
  exports: [
    // This module is intended to be imported by the root AppModule.
    // Exporting AppStoreIntegrationV1Module from here might be redundant if AppModule
    // directly consumes the versioned modules or if this module encapsulates versioning logic internally.
    // For now, no explicit exports are defined unless a clear use case emerges from AppModule's design.
  ],
})
export class AppStoreIntegrationApiModule {}