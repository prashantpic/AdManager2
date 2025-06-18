import { Module } from '@nestjs/common';
import { GiftOptionsController } from './controllers/gift-options.controller';

/**
 * @namespace AdManager.GiftOptions.Api.V1
 * @class GiftOptionsModuleV1
 * @description The main NestJS module for the version 1 of the Gift Options API.
 * It groups together controllers and service providers related to gift option management.
 * Organizes and declares the components (controllers, service providers) specific to the
 * Gift Options API v1 functionality.
 */
@Module({
  imports: [
    // Potentially MulterModule.registerAsync for file uploads if specific configuration is needed here.
    // For now, no specific imports are listed as per SDS 4.5
  ],
  controllers: [GiftOptionsController],
  providers: [
    // The IGiftOptionsService is expected to be provided by an imported module
    // in AppModule or globally, or if implemented in a different repository,
    // the concrete implementation will be registered elsewhere.
    // No providers are listed here as per SDS 4.5
  ],
  exports: [
    // No exports are listed here as per SDS 4.5
  ],
})
export class GiftOptionsModuleV1 {}