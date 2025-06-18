import { Injectable, Logger } from '@nestjs/common';
import { CampaignSyncService } from './domain/services/campaign-sync.service';
import { CreativeSyncService } from './domain/services/creative-sync.service';
import { MetricsRetrievalService } from './domain/services/metrics-retrieval.service';
import { AudienceSyncService } from './domain/services/audience-sync.service';
import { FeedSubmissionService } from './domain/services/feed-submission.service';
import { PolicyValidatorService } from './domain/services/policy-validator.service';
import { DataMapperFactory } from './common/utils/data-mapper.factory';

// Import gRPC generated types (actual path will depend on generation output)
// These are illustrative and would come from generated `*.ts` files from your `.proto`
// For example: import { CreateCampaignRequest, CampaignStatus as CommonCampaignStatus, AdNetworkType as CommonAdNetworkType, ... } from '../../../grpc/generated/ad_network_integration.v1';
// For now, we'll use placeholder types matching the proto message names.
import {
  CreateCampaignRequest,
  UpdateCampaignRequest,
  GetCampaignRequest,
  UpdateAdSetRequest,
  GetAdSetRequest,
  UploadCreativeRequest,
  GetCreativeRequest,
  GetPerformanceMetricsRequest,
  SyncAudienceRequest,
  GetAudienceSyncStatusRequest,
  SubmitProductFeedRequest,
  GetProductFeedStatusRequest,
  ValidateCampaignDataRequest,
  ValidateCreativeDataRequest,
  ValidateFeedDataRequest,
  Campaign as GrpcCampaign,
  AdSet as GrpcAdSet,
  Creative as GrpcCreative,
  ProductFeed as GrpcProductFeed,
} from '../grpc/ad_network_integration_pb'; // Hypothetical path to PB-generated types

import {
  InternalCampaignCreateDto,
  InternalCampaignUpdateDto,
  InternalCampaignDetailsDto,
  InternalCampaignResultDto,
  InternalAdSetUpdateDto,
  InternalAdSetDetailsDto,
  InternalAdSetResultDto,
  InternalCreativeUploadDto,
  InternalCreativeDetailsDto,
  InternalCreativeResultDto,
  InternalMetricsRequestParamsDto,
  InternalPerformanceMetricsResultDto,
  InternalAudienceSyncDto,
  InternalAudienceSyncStatusResultDto,
  InternalProductFeedSubmitDto,
  InternalFeedSubmissionStatusResultDto,
  ValidationResultDto,
  InternalValidationResultDto,
} from './dto/internal'; // Assuming internal DTOs are defined

import { AdNetworkType, CampaignStatus, CreativeType, AudienceType, FeedFormat } from './common/enums';

@Injectable()
export class AdNetworkIntegrationService {
  private readonly logger = new Logger(AdNetworkIntegrationService.name);

  constructor(
    private readonly campaignSyncService: CampaignSyncService,
    private readonly creativeSyncService: CreativeSyncService,
    private readonly metricsRetrievalService: MetricsRetrievalService,
    private readonly audienceSyncService: AudienceSyncService,
    private readonly feedSubmissionService: FeedSubmissionService,
    private readonly policyValidatorService: PolicyValidatorService,
    private readonly dataMapperFactory: DataMapperFactory,
  ) {}

  async createCampaign(request: CreateCampaignRequest): Promise<InternalCampaignResultDto> {
    this.logger.log(`Creating campaign for merchant ${request.merchant_id} on network ${request.ad_network}`);
    const { ad_network, merchant_id, name, budget, start_date, end_date, initial_status } = request;

    // The dataMapperFactory and specific mappers would handle this transformation.
    // This is a conceptual mapping. Actual mapper methods would be more specific.
    const internalCampaignDto: InternalCampaignCreateDto = {
      name,
      budget,
      startDate: start_date,
      endDate: end_date,
      initialStatus: initial_status as CampaignStatus, // Ensure enum compatibility
      // map other fields from request if CreateCampaignRequest has more than listed in proto
    };
    return this.campaignSyncService.createCampaign(ad_network as AdNetworkType, merchant_id, internalCampaignDto);
  }

  async updateCampaign(request: UpdateCampaignRequest): Promise<InternalCampaignResultDto> {
    this.logger.log(`Updating campaign ${request.campaign_id} for merchant ${request.merchant_id}`);
    const { ad_network, campaign_id, merchant_id, name, budget, start_date, end_date, campaign_status } = request;
    const internalUpdateDto: InternalCampaignUpdateDto = {
        name: name, // optional fields need to be handled
        budget: budget,
        startDate: start_date,
        endDate: end_date,
        status: campaign_status as CampaignStatus, // optional
    };
    return this.campaignSyncService.updateCampaign(ad_network as AdNetworkType, merchant_id, campaign_id, internalUpdateDto);
  }

  async getCampaign(request: GetCampaignRequest): Promise<InternalCampaignDetailsDto> {
    this.logger.log(`Getting campaign ${request.campaign_id} for merchant ${request.merchant_id}`);
    return this.campaignSyncService.getCampaign(request.ad_network as AdNetworkType, request.merchant_id, request.campaign_id);
  }

  async updateAdSet(request: UpdateAdSetRequest): Promise<InternalAdSetResultDto> {
    this.logger.log(`Updating ad set ${request.ad_set_id} for merchant ${request.merchant_id}`);
    const { ad_network, ad_set_id, merchant_id, name, budget, ad_set_status } = request;
     const internalUpdateDto: InternalAdSetUpdateDto = {
        name: name,
        budget: budget,
        status: ad_set_status as any, // AdSetStatus enum
     };
    return this.campaignSyncService.updateAdSet(ad_network as AdNetworkType, merchant_id, ad_set_id, internalUpdateDto);
  }

  async getAdSet(request: GetAdSetRequest): Promise<InternalAdSetDetailsDto> {
    this.logger.log(`Getting ad set ${request.ad_set_id} for merchant ${request.merchant_id}`);
    return this.campaignSyncService.getAdSet(request.ad_network as AdNetworkType, request.merchant_id, request.ad_set_id);
  }

  async uploadCreative(request: UploadCreativeRequest): Promise<InternalCreativeResultDto> {
    this.logger.log(`Uploading creative for merchant ${request.merchant_id}`);
    const { ad_network, merchant_id, name, type, asset_url, asset_content, file_name, metadata } = request;
    const internalCreativeDto: InternalCreativeUploadDto = {
        name,
        type: type as CreativeType,
        assetUrl: asset_url,
        assetContent: asset_content, // Buffer/bytes
        fileName: file_name,
        metadata,
    };
    return this.creativeSyncService.uploadAndAssociateCreative(ad_network as AdNetworkType, merchant_id, internalCreativeDto);
  }

  async getCreative(request: GetCreativeRequest): Promise<InternalCreativeDetailsDto> {
    this.logger.log(`Getting creative ${request.creative_id} for merchant ${request.merchant_id}`);
    return this.creativeSyncService.getCreative(request.ad_network as AdNetworkType, request.merchant_id, request.creative_id);
  }

  async getPerformanceMetrics(request: GetPerformanceMetricsRequest): Promise<InternalPerformanceMetricsResultDto> {
    this.logger.log(`Getting performance metrics for merchant ${request.merchant_id}`);
    const { ad_network, merchant_id, campaign_ids, ad_set_ids, ad_ids, start_date, end_date, granularity } = request;
    const params: InternalMetricsRequestParamsDto = {
        campaignIds: campaign_ids,
        adSetIds: ad_set_ids,
        adIds: ad_ids,
        startDate: start_date,
        endDate: end_date,
        granularity: granularity as any, // Granularity enum
    };
    return this.metricsRetrievalService.fetchPerformanceMetrics(ad_network as AdNetworkType, merchant_id, params);
  }

  async syncAudience(request: SyncAudienceRequest): Promise<InternalAudienceSyncStatusResultDto> {
    this.logger.log(`Syncing audience ${request.audience_id_platform} for merchant ${request.merchant_id}`);
    const { ad_network, merchant_id, audience_id_platform, name, type, description, user_segment_ids } = request;
    const internalAudienceDto: InternalAudienceSyncDto = {
        platformAudienceId: audience_id_platform,
        name,
        type: type as AudienceType,
        description,
        userSegmentIds: user_segment_ids,
    };
    return this.audienceSyncService.synchronizeAudience(ad_network as AdNetworkType, merchant_id, internalAudienceDto);
  }

  async getAudienceSyncStatus(request: GetAudienceSyncStatusRequest): Promise<InternalAudienceSyncStatusResultDto> {
    this.logger.log(`Getting audience sync status for ${request.audience_id_network} for merchant ${request.merchant_id}`);
    return this.audienceSyncService.getAudienceSyncStatus(request.ad_network as AdNetworkType, request.merchant_id, request.audience_id_network);
  }

  async submitProductFeed(request: SubmitProductFeedRequest): Promise<InternalFeedSubmissionStatusResultDto> {
    this.logger.log(`Submitting product feed for merchant ${request.merchant_id}`);
    const { ad_network, merchant_id, catalog_id_platform, feed_url, feed_content, feed_format } = request;
    const internalFeedDto: InternalProductFeedSubmitDto = {
        platformCatalogId: catalog_id_platform,
        feedUrl: feed_url,
        feedContent: feed_content, // Buffer/bytes
        feedFormat: feed_format as FeedFormat,
    };
    return this.feedSubmissionService.submitProductFeed(ad_network as AdNetworkType, merchant_id, internalFeedDto);
  }

  async getProductFeedStatus(request: GetProductFeedStatusRequest): Promise<InternalFeedSubmissionStatusResultDto> {
    this.logger.log(`Getting product feed status for ${request.feed_id_network} for merchant ${request.merchant_id}`);
    return this.feedSubmissionService.getProductFeedStatus(request.ad_network as AdNetworkType, request.merchant_id, request.feed_id_network);
  }

  async validateCampaignData(request: ValidateCampaignDataRequest): Promise<InternalValidationResultDto> {
    this.logger.log(`Validating campaign data for merchant ${request.merchant_id}`);
    // The gRPC 'Campaign' message needs to be mapped to an internal campaign DTO.
    // This mapping might be more complex and handled by a specific mapper if 'Campaign' is rich.
    // For simplicity, assuming PolicyValidatorService can take the gRPC Campaign type or a simple internal one.
    // Let's assume campaign_data is of GrpcCampaign type.
    // The PolicyValidatorService is defined to take 'any' or an internal DTO.
    // We'll need a proper mapping here if `InternalCampaignDto` is distinct from `GrpcCampaign`.
    const campaignDataToValidate = request.campaign_data as any; // Cast for now, proper mapping needed
    const results = await this.policyValidatorService.validateCampaignData(request.ad_network as AdNetworkType, request.merchant_id, campaignDataToValidate);
    return { validationResults: results };
  }

  async validateCreativeData(request: ValidateCreativeDataRequest): Promise<InternalValidationResultDto> {
    this.logger.log(`Validating creative data for merchant ${request.merchant_id}`);
    // Similar to campaign, map GrpcCreative to an internal DTO for validation.
    // PolicyValidatorService takes InternalCreativeDto.
    // The gRPC Creative message is `request.creative_data`.
    // Let's assume a mapper exists or the types are compatible enough for this example.
    const creativeDataToValidate = request.creative_data as any; // Cast for now
     // Map GrpcCreative to InternalCreativeUploadDto or a generic InternalCreativeDto
    const internalCreativeDto: InternalCreativeUploadDto = { // Or a more generic InternalCreativeDto
        name: request.creative_data.name,
        type: request.creative_data.type as CreativeType,
        assetUrl: request.creative_data.asset_url,
        // assetContent and fileName are not in GrpcCreative, but in UploadCreativeRequest
        // This suggests ValidateCreativeDataRequest should maybe take UploadCreativeRequest fields
        // or a specific InternalCreativeValidationDto.
        // For now, using what's available in GrpcCreative.
        metadata: request.creative_data.metadata
    };

    const results = await this.policyValidatorService.validateCreativeData(request.ad_network as AdNetworkType, request.merchant_id, internalCreativeDto);
    return { validationResults: results };
  }

  async validateFeedData(request: ValidateFeedDataRequest): Promise<InternalValidationResultDto> {
    this.logger.log(`Validating feed data for merchant ${request.merchant_id}`);
    // Map GrpcProductFeed to an internal DTO for validation.
    // PolicyValidatorService takes InternalProductFeedDto or InternalProductFeedSubmitDto
    const feedDataToValidate = request.feed_data as any; // Cast for now
    const internalFeedDto: InternalProductFeedSubmitDto = { // Or a generic InternalProductFeedDto
        feedUrl: request.feed_data.feed_url,
        feedContent: request.feed_data.feed_content,
        feedFormat: request.feed_data.format as FeedFormat,
        // platformCatalogId is not in GrpcProductFeed but in SubmitProductFeedRequest
        // This suggests ValidateFeedDataRequest should take SubmitProductFeedRequest fields
        // or a specific InternalFeedValidationDto.
    };
    const results =  await this.policyValidatorService.validateFeedData(request.ad_network as AdNetworkType, request.merchant_id, internalFeedDto);
    return { validationResults: results };
  }
}