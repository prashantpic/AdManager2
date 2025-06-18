import { Controller, Inject, Logger, LoggerService } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { AdNetworkIntegrationService } from '../ad-network-integration.service';
import {
  CreateCampaignRequest,
  CreateCampaignResponse,
  UpdateCampaignRequest,
  UpdateCampaignResponse,
  GetCampaignRequest,
  CampaignDetailsResponse,
  UpdateAdSetRequest,
  UpdateAdSetResponse,
  GetAdSetRequest,
  AdSetDetailsResponse,
  UploadCreativeRequest,
  UploadCreativeResponse,
  GetCreativeRequest,
  CreativeDetailsResponse,
  GetPerformanceMetricsRequest,
  GetPerformanceMetricsResponse,
  SyncAudienceRequest,
  SyncAudienceResponse,
  GetAudienceSyncStatusRequest,
  AudienceSyncStatusResponse,
  SubmitProductFeedRequest,
  SubmitProductFeedResponse,
  GetProductFeedStatusRequest,
  ProductFeedStatusResponse,
  ValidateCampaignDataRequest,
  ValidateCampaignDataResponse,
  ValidateCreativeDataRequest,
  ValidateCreativeDataResponse,
  ValidateFeedDataRequest,
  ValidateFeedDataResponse,
} from './ad-network-integration.v1.pb'; // Assuming .pb.ts files are generated next to .proto
import { Status } from './common.v1.pb'; // Assuming .pb.ts files are generated

@Controller()
export class AdNetworkIntegrationGrpcController {
  constructor(
    private readonly adNetworkIntegrationService: AdNetworkIntegrationService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  private handleError(error: any, context: string): RpcException {
    this.logger.error(`Error in ${context}: ${error.message}`, error.stack);
    // Basic error mapping. More sophisticated mapping can be implemented.
    // This should map to the ErrorDetail structure defined in common.v1.proto
    return new RpcException({
      code: error.code || 500, // General internal error or specific code
      message: error.message || 'An internal error occurred',
      details: error.details || error.stack,
      ad_network_error_code: error.adNetworkErrorCode,
    });
  }

  @GrpcMethod('AdNetworkIntegration', 'CreateCampaign')
  async createCampaign(
    data: CreateCampaignRequest,
  ): Promise<CreateCampaignResponse> {
    this.logger.log(
      `GRPC: CreateCampaign called for merchant ${data.merchant_id} on network ${data.ad_network}`,
    );
    try {
      const result =
        await this.adNetworkIntegrationService.createCampaign(data);
      return {
        campaign_id: result.campaignId,
        status: Status.SUCCESS,
        error: null, // Explicitly set error to null on success
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'CreateCampaign');
      return {
        campaign_id: '',
        status: Status.FAILURE,
        error: rpcError.getError() as any, // Cast to any to fit ErrorDetail structure
      };
    }
  }

  @GrpcMethod('AdNetworkIntegration', 'UpdateCampaign')
  async updateCampaign(
    data: UpdateCampaignRequest,
  ): Promise<UpdateCampaignResponse> {
    this.logger.log(
      `GRPC: UpdateCampaign called for campaign ${data.campaign_id} on network ${data.ad_network}`,
    );
    try {
      const result =
        await this.adNetworkIntegrationService.updateCampaign(data);
      return {
        campaign_id: result.campaignId,
        status: Status.SUCCESS,
        error: null,
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'UpdateCampaign');
      return {
        campaign_id: data.campaign_id,
        status: Status.FAILURE,
        error: rpcError.getError() as any,
      };
    }
  }

  @GrpcMethod('AdNetworkIntegration', 'GetCampaign')
  async getCampaign(
    data: GetCampaignRequest,
  ): Promise<CampaignDetailsResponse> {
    this.logger.log(
      `GRPC: GetCampaign called for campaign ${data.campaign_id} on network ${data.ad_network}`,
    );
    try {
      const result = await this.adNetworkIntegrationService.getCampaign(data);
      return {
        campaign: result.campaign,
        status: Status.SUCCESS,
        error: null,
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'GetCampaign');
      return {
        campaign: null,
        status: Status.FAILURE,
        error: rpcError.getError() as any,
      };
    }
  }

  @GrpcMethod('AdNetworkIntegration', 'UpdateAdSet')
  async updateAdSet(data: UpdateAdSetRequest): Promise<UpdateAdSetResponse> {
    this.logger.log(
      `GRPC: UpdateAdSet called for ad set ${data.ad_set_id} on network ${data.ad_network}`,
    );
    try {
      const result = await this.adNetworkIntegrationService.updateAdSet(data);
      return {
        ad_set_id: result.adSetId,
        status: Status.SUCCESS,
        error: null,
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'UpdateAdSet');
      return {
        ad_set_id: data.ad_set_id,
        status: Status.FAILURE,
        error: rpcError.getError() as any,
      };
    }
  }

  @GrpcMethod('AdNetworkIntegration', 'GetAdSet')
  async getAdSet(data: GetAdSetRequest): Promise<AdSetDetailsResponse> {
    this.logger.log(
      `GRPC: GetAdSet called for ad set ${data.ad_set_id} on network ${data.ad_network}`,
    );
    try {
      const result = await this.adNetworkIntegrationService.getAdSet(data);
      return {
        ad_set: result.adSet,
        status: Status.SUCCESS,
        error: null,
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'GetAdSet');
      return {
        ad_set: null,
        status: Status.FAILURE,
        error: rpcError.getError() as any,
      };
    }
  }

  @GrpcMethod('AdNetworkIntegration', 'UploadCreative')
  async uploadCreative(
    data: UploadCreativeRequest,
  ): Promise<UploadCreativeResponse> {
    this.logger.log(
      `GRPC: UploadCreative called for merchant ${data.merchant_id} on network ${data.ad_network}`,
    );
    try {
      const result =
        await this.adNetworkIntegrationService.uploadCreative(data);
      return {
        creative_id: result.creativeId,
        status: Status.SUCCESS,
        error: null,
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'UploadCreative');
      return {
        creative_id: '',
        status: Status.FAILURE,
        error: rpcError.getError() as any,
      };
    }
  }

  @GrpcMethod('AdNetworkIntegration', 'GetCreative')
  async getCreative(
    data: GetCreativeRequest,
  ): Promise<CreativeDetailsResponse> {
    this.logger.log(
      `GRPC: GetCreative called for creative ${data.creative_id} on network ${data.ad_network}`,
    );
    try {
      const result = await this.adNetworkIntegrationService.getCreative(data);
      return {
        creative: result.creative,
        status: Status.SUCCESS,
        error: null,
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'GetCreative');
      return {
        creative: null,
        status: Status.FAILURE,
        error: rpcError.getError() as any,
      };
    }
  }

  @GrpcMethod('AdNetworkIntegration', 'GetPerformanceMetrics')
  async getPerformanceMetrics(
    data: GetPerformanceMetricsRequest,
  ): Promise<GetPerformanceMetricsResponse> {
    this.logger.log(
      `GRPC: GetPerformanceMetrics called for merchant ${data.merchant_id} on network ${data.ad_network}`,
    );
    try {
      const result =
        await this.adNetworkIntegrationService.getPerformanceMetrics(data);
      return {
        metrics: result.metrics,
        status: Status.SUCCESS,
        error: null,
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'GetPerformanceMetrics');
      return {
        metrics: [],
        status: Status.FAILURE,
        error: rpcError.getError() as any,
      };
    }
  }

  @GrpcMethod('AdNetworkIntegration', 'SyncAudience')
  async syncAudience(
    data: SyncAudienceRequest,
  ): Promise<SyncAudienceResponse> {
    this.logger.log(
      `GRPC: SyncAudience called for merchant ${data.merchant_id} on network ${data.ad_network}`,
    );
    try {
      const result = await this.adNetworkIntegrationService.syncAudience(data);
      return {
        audience_id_network: result.audienceIdNetwork,
        sync_status: result.syncStatus,
        status: Status.SUCCESS,
        error: null,
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'SyncAudience');
      return {
        audience_id_network: '',
        sync_status: 0, // UNSPECIFIED
        status: Status.FAILURE,
        error: rpcError.getError() as any,
      };
    }
  }

  @GrpcMethod('AdNetworkIntegration', 'GetAudienceSyncStatus')
  async getAudienceSyncStatus(
    data: GetAudienceSyncStatusRequest,
  ): Promise<AudienceSyncStatusResponse> {
    this.logger.log(
      `GRPC: GetAudienceSyncStatus called for audience ${data.audience_id_network} on network ${data.ad_network}`,
    );
    try {
      const result =
        await this.adNetworkIntegrationService.getAudienceSyncStatus(data);
      return {
        audience_details: result.audienceDetails,
        sync_status: result.syncStatus,
        status: Status.SUCCESS,
        error: null,
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'GetAudienceSyncStatus');
      return {
        audience_details: null,
        sync_status: 0, // UNSPECIFIED
        status: Status.FAILURE,
        error: rpcError.getError() as any,
      };
    }
  }

  @GrpcMethod('AdNetworkIntegration', 'SubmitProductFeed')
  async submitProductFeed(
    data: SubmitProductFeedRequest,
  ): Promise<SubmitProductFeedResponse> {
    this.logger.log(
      `GRPC: SubmitProductFeed called for merchant ${data.merchant_id} on network ${data.ad_network}`,
    );
    try {
      const result =
        await this.adNetworkIntegrationService.submitProductFeed(data);
      return {
        feed_id_network: result.feedIdNetwork,
        submission_status: result.submissionStatus,
        status: Status.SUCCESS,
        error: null,
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'SubmitProductFeed');
      return {
        feed_id_network: '',
        submission_status: 0, // UNSPECIFIED
        status: Status.FAILURE,
        error: rpcError.getError() as any,
      };
    }
  }

  @GrpcMethod('AdNetworkIntegration', 'GetProductFeedStatus')
  async getProductFeedStatus(
    data: GetProductFeedStatusRequest,
  ): Promise<ProductFeedStatusResponse> {
    this.logger.log(
      `GRPC: GetProductFeedStatus called for feed ${data.feed_id_network} on network ${data.ad_network}`,
    );
    try {
      const result =
        await this.adNetworkIntegrationService.getProductFeedStatus(data);
      return {
        feed_details: result.feedDetails,
        submission_status: result.submissionStatus,
        status: Status.SUCCESS,
        error: null,
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'GetProductFeedStatus');
      return {
        feed_details: null,
        submission_status: 0, // UNSPECIFIED
        status: Status.FAILURE,
        error: rpcError.getError() as any,
      };
    }
  }

  @GrpcMethod('AdNetworkIntegration', 'ValidateCampaignData')
  async validateCampaignData(
    data: ValidateCampaignDataRequest,
  ): Promise<ValidateCampaignDataResponse> {
    this.logger.log(
      `GRPC: ValidateCampaignData called for merchant ${data.merchant_id} on network ${data.ad_network}`,
    );
    try {
      const result =
        await this.adNetworkIntegrationService.validateCampaignData(data);
      return {
        results: result.results,
        status: Status.SUCCESS,
        error: null,
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'ValidateCampaignData');
      return {
        results: [],
        status: Status.FAILURE,
        error: rpcError.getError() as any,
      };
    }
  }

  @GrpcMethod('AdNetworkIntegration', 'ValidateCreativeData')
  async validateCreativeData(
    data: ValidateCreativeDataRequest,
  ): Promise<ValidateCreativeDataResponse> {
    this.logger.log(
      `GRPC: ValidateCreativeData called for merchant ${data.merchant_id} on network ${data.ad_network}`,
    );
    try {
      const result =
        await this.adNetworkIntegrationService.validateCreativeData(data);
      return {
        results: result.results,
        status: Status.SUCCESS,
        error: null,
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'ValidateCreativeData');
      return {
        results: [],
        status: Status.FAILURE,
        error: rpcError.getError() as any,
      };
    }
  }

  @GrpcMethod('AdNetworkIntegration', 'ValidateFeedData')
  async validateFeedData(
    data: ValidateFeedDataRequest,
  ): Promise<ValidateFeedDataResponse> {
    this.logger.log(
      `GRPC: ValidateFeedData called for merchant ${data.merchant_id} on network ${data.ad_network}`,
    );
    try {
      const result =
        await this.adNetworkIntegrationService.validateFeedData(data);
      return {
        results: result.results,
        status: Status.SUCCESS,
        error: null,
      };
    } catch (e) {
      const rpcError = this.handleError(e, 'ValidateFeedData');
      return {
        results: [],
        status: Status.FAILURE,
        error: rpcError.getError() as any,
      };
    }
  }
}