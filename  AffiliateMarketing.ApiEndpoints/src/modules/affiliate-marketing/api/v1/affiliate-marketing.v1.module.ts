import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AffiliateMarketingService } from './services/affiliate-marketing.service';
import { AffiliateProgramsMerchantController } from './controllers/merchant/affiliate-programs.merchant.controller';
import { AffiliateApplicationsMerchantController } from './controllers/merchant/affiliate-applications.merchant.controller';
import { AffiliateManagementMerchantController } from './controllers/merchant/affiliate-management.merchant.controller';
import { AffiliateCommissionsMerchantController } from './controllers/merchant/affiliate-commissions.merchant.controller';
import { AffiliatePayoutsMerchantController } from './controllers/merchant/affiliate-payouts.merchant.controller';
import { AffiliateDashboardMerchantController } from './controllers/merchant/affiliate-dashboard.merchant.controller';
import { AffiliatePortalController } from './controllers/affiliate/affiliate-portal.controller';
import { AffiliateRegistrationPublicController } from './controllers/public/affiliate-registration.public.controller';
import { AffiliateConversionsController } from './controllers/affiliate-conversions.controller';

/**
 * Main module for Version 1 of the Affiliate Marketing API.
 * This module encapsulates all controllers and services related to affiliate marketing.
 * It also imports `PassportModule` to support JWT authentication for its protected endpoints.
 * Note: The actual JWT strategy (e.g., JwtStrategy) is expected to be provided globally or by an auth-specific module.
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [
    AffiliateProgramsMerchantController,
    AffiliateApplicationsMerchantController,
    AffiliateManagementMerchantController,
    AffiliateCommissionsMerchantController,
    AffiliatePayoutsMerchantController,
    AffiliateDashboardMerchantController,
    AffiliatePortalController,
    AffiliateRegistrationPublicController,
    AffiliateConversionsController,
  ],
  providers: [
    AffiliateMarketingService,
    // Conceptual repository/service providers would be listed here if this module was responsible for their instantiation.
    // For this exercise, they are injected as interfaces into AffiliateMarketingService.
    // e.g.,
    // { provide: 'IAffiliateProgramRepository', useClass: MockAffiliateProgramRepository }, // Example
  ],
})
export class AffiliateMarketingV1Module {}