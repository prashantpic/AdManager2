import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PlanController } from './api/controllers/plan.controller';
import { SubscriptionController } from './api/controllers/subscription.controller';
import { PaymentController } from './api/controllers/payment.controller';
import { BillingReportController } from './api/controllers/billing-report.controller';

import { BillingMonetizationService } from './application/services/billing-monetization.service';
import billingConfig from './config/billing.config';

// Import infrastructure services that are provided by this module
import { PaymentGatewayFactoryService } from './infrastructure/payment-gateways/payment-gateway-factory.service';
import { StripeAdapter } from './infrastructure/payment-gateways/stripe.adapter';
// import { PayPalAdapter } from './infrastructure/payment-gateways/paypal.adapter'; // Uncomment if PayPal is used and provided directly
// import { MadaAdapter } from './infrastructure/payment-gateways/mada.adapter'; // Uncomment if Mada is used and provided directly
// import { StcPayAdapter } from './infrastructure/payment-gateways/stcpay.adapter'; // Uncomment if STCPay is used and provided directly


// Placeholder for AuthModule - This module is expected to provide JwtAuthGuard and RolesGuard.
// Adjust the path according to your project's actual structure.
// Example: import { AuthModule } from '../auth/auth.module';
// For the purpose of this generation, we'll assume AuthModule is imported if guards are applied in controllers.
// If AuthModule is not imported here, guards might need to be globally registered or imported directly by controllers (less common for module-level guards).
// As per SDS, an AuthModule providing JwtAuthGuard is expected to be imported.
// import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    ConfigModule.forFeature(billingConfig), // Register billing-specific configuration
    // AuthModule, // Import AuthModule here if it provides JwtAuthGuard and RolesGuard used by controllers in this module
  ],
  controllers: [
    PlanController,
    SubscriptionController,
    PaymentController,
    BillingReportController,
  ],
  providers: [
    BillingMonetizationService,
    PaymentGatewayFactoryService,
    StripeAdapter,
    // PayPalAdapter, // Add other adapters here if they are direct providers and injected into the factory or service
    // MadaAdapter,
    // StcPayAdapter,
  ],
  exports: [
    BillingMonetizationService, // Export service for potential use in other modules
  ],
})
export class BillingMonetizationModule {}