import { Module } from '@nestjs/common';
import { WebhookSubscriptionController } from './controllers/webhook-subscription.controller';
import { WebhookSubscriptionService } from './services/webhook-subscription.service';
import { AuthModule } from '../auth/auth.module'; // For JwtAuthGuard and ScopesGuard
import { IThirdPartyConnectivityService } from '../common/interfaces/third-party-connectivity.interface';
import { ThirdPartyConnectivityServiceProvider } from '../common/providers/third-party-connectivity.provider';


/**
 * NestJS module for webhook subscription management.
 * It groups all components related to webhook subscriptions.
 */
@Module({
  imports: [
    AuthModule, // Provides JwtAuthGuard, ScopesGuard
  ],
  controllers: [WebhookSubscriptionController],
  providers: [
    WebhookSubscriptionService,
    {
      provide: IThirdPartyConnectivityService,
      useClass: ThirdPartyConnectivityServiceProvider, // Provide a concrete implementation or mock
    },
  ],
  exports: [WebhookSubscriptionService],
})
export class WebhooksModule {}