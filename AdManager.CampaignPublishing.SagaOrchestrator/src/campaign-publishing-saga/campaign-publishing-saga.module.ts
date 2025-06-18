import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CampaignPublishingSaga } from './sagas/campaign-publishing.saga';
import { CampaignPublishingSagaInstance } from './state/entities/campaign-publishing-saga-instance.entity';
import { CampaignPublishingSagaInstanceRepository } from './state/repositories/campaign-publishing-saga-instance.repository';
import { SqsReplyListener } from './listeners/sqs-event.listener';
import { BillingAdapter } from './services/adapters/billing.adapter';
import { ProductCatalogAdapter } from './services/adapters/product-catalog.adapter';
import { AdNetworkIntegrationAdapter } from './services/adapters/ad-network.adapter';
import { CampaignManagementAdapter } from './services/adapters/campaign-management.adapter';
import { CAMPAIGN_PUBLISHING_SAGA_CONSTANTS } from './campaign-publishing-saga.constants';

const adapters = [
  {
    provide: CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.BILLING_ADAPTER_TOKEN,
    useClass: BillingAdapter,
  },
  {
    provide: CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.PRODUCT_CATALOG_ADAPTER_TOKEN,
    useClass: ProductCatalogAdapter,
  },
  {
    provide: CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.AD_NETWORK_ADAPTER_TOKEN,
    useClass: AdNetworkIntegrationAdapter,
  },
  {
    provide: CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.CAMPAIGN_MANAGEMENT_ADAPTER_TOKEN,
    useClass: CampaignManagementAdapter,
  },
];

@Module({
  imports: [
    ConfigModule, // ConfigModule is global in AppModule, but can be imported here if needed for specific scoping
    TypeOrmModule.forFeature([CampaignPublishingSagaInstance]),
    EventEmitterModule.forRoot(), // For internal eventing or as a wrapper for SNS
  ],
  providers: [
    CampaignPublishingSaga,
    CampaignPublishingSagaInstanceRepository,
    SqsReplyListener,
    ...adapters,
  ],
  exports: [CampaignPublishingSaga], // If other modules need to interact with it directly (unlikely as per SDS)
})
export class CampaignPublishingSagaModule {}