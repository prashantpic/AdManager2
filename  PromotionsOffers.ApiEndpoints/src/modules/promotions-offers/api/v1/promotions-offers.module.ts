import { Module, CommonModule } from '@nestjs/common';
import { DiscountCodesController } from './controllers/discount-codes.controller';
import { BogoPromotionsController } from './controllers/bogo-promotions.controller';
import { QuantityDiscountsController } from './controllers/quantity-discounts.controller';
import { PromotionsController } from './controllers/promotions.controller';
import { PromotionsOffersService } from './services/promotions-offers.service';
// import { IPromotionsOffersService } from './services/i.promotions-offers.service'; // SDS indicates token is for this, but import is commented.
import { ICorePlatformService } from './interfaces/i.core-platform.service'; // Explicitly imported in SDS for context of CORE_PLATFORM_SERVICE_TOKEN
import { PROMOTIONS_OFFERS_SERVICE_TOKEN, CORE_PLATFORM_SERVICE_TOKEN } from './promotions-offers.constants';

// Assuming CorePlatformServiceMock or actual client module for ICorePlatformService
// import { CorePlatformClientModule } from 'shared/core-platform-client'; // Example of importing a client module
// import { CorePlatformServiceMock } from './mocks/core-platform.service.mock'; // Example path for a local mock

/**
 * @module PromotionsOffersModule
 * @description NestJS module for the Promotions & Offers API.
 * It encapsulates and organizes all related components, including controllers and services.
 */
@Module({
  imports: [
    CommonModule,
    // CorePlatformClientModule, // If ICorePlatformService is provided by another module, import it here.
  ],
  controllers: [
    DiscountCodesController,
    BogoPromotionsController,
    QuantityDiscountsController,
    PromotionsController,
  ],
  providers: [
    {
      provide: PROMOTIONS_OFFERS_SERVICE_TOKEN,
      useClass: PromotionsOffersService, // Provide the concrete implementation of IPromotionsOffersService
    },
    // Example provider for ICorePlatformService.
    // The actual provider for CORE_PLATFORM_SERVICE_TOKEN would typically be
    // in a shared client module (e.g., CorePlatformClientModule) or a local mock for testing.
    // {
    //   provide: CORE_PLATFORM_SERVICE_TOKEN,
    //   useClass: CorePlatformServiceMock, // Replace with actual client service or a proper mock implementation
    // },
  ],
})
export class PromotionsOffersModule {}