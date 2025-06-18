import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdNetworkIntegrationGrpcController } from './grpc/ad-network-integration.grpc.controller';
import { AdNetworkIntegrationService } from './ad-network-integration.service';
import { CampaignSyncService } from './domain/services/campaign-sync.service';
import { CreativeSyncService } from './domain/services/creative-sync.service';
import { MetricsRetrievalService } from './domain/services/metrics-retrieval.service';
import { AudienceSyncService } from './domain/services/audience-sync.service';
import { FeedSubmissionService } from './domain/services/feed-submission.service';
import { PolicyValidatorService } from './domain/services/policy-validator.service';
import { GoogleAdsAdapter } from './adapters/google/google-ads.adapter';
import { InstagramAdsAdapter } from './adapters/instagram/instagram-ads.adapter';
import { TikTokAdsAdapter } from './adapters/tiktok/tiktok-ads.adapter';
import { SnapchatAdsAdapter } from './adapters/snapchat/snapchat-ads.adapter';
import { AdNetworkAdapterFactory } from './adapters/ad-network-adapter.factory';
import { DataMapperFactory } from './common/utils/data-mapper.factory';
import { ResilienceFactory } from './common/utils/resilience.factory';
import { BaseAdNetworkClient } from './adapters/core/base-ad-network.client';
// Import mappers if they are injectable providers, or if factory needs them.
// For now, assuming DataMapperFactory handles mapper instantiation internally or they are simple classes.

@Module({
  imports: [
    ConfigModule, // ConfigModule is already global via AppModule
  ],
  controllers: [AdNetworkIntegrationGrpcController],
  providers: [
    Logger, // Provide Logger for injection
    AdNetworkIntegrationService,
    CampaignSyncService,
    CreativeSyncService,
    MetricsRetrievalService,
    AudienceSyncService,
    FeedSubmissionService,
    PolicyValidatorService,
    GoogleAdsAdapter,
    InstagramAdsAdapter,
    TikTokAdsAdapter,
    SnapchatAdsAdapter,
    AdNetworkAdapterFactory,
    DataMapperFactory,
    ResilienceFactory,
    BaseAdNetworkClient, // Provided if it's meant to be injected into adapters.
    // Add specific data mappers here if they are @Injectable() and DataMapperFactory injects them
    // e.g. GoogleAdsDataMapper, InstagramAdsDataMapper etc.
    // If mappers are not services but simple classes instantiated by DataMapperFactory, they are not listed here.
  ],
})
export class AdNetworkIntegrationModule {}