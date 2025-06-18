```typescript
import {
  AdNetworkType,
  CampaignStatus,
  CreativeType,
  AudienceType,
  FeedFormat,
} from '../../common/enums';
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
  // The DTOs below are placeholders for the actual internal DTOs that will be defined elsewhere
  // For example, InternalCampaignDto might be a more generic version used in validation.
  // The current list of DTOs focuses on create/update/details/results.
  // For `validateCampaignData(merchantId: string, campaignData: any)`, `any` is used as per SDS.
  // If a more specific `InternalCampaignValidationDto` or `InternalCampaignDto` is defined later,
  // this 'any' can be replaced.
} from '../../dto/internal'; // These internal DTOs will be defined in other files.

export interface IAdNetworkAdapter {
  getNetworkType(): AdNetworkType;

  // Campaign
  createCampaign(
    merchantId: string,
    campaignData: InternalCampaignCreateDto,
  ): Promise<InternalCampaignResultDto>;
  updateCampaign(
    merchantId: string,
    campaignId: string,
    campaignUpdateData: InternalCampaignUpdateDto,
  ): Promise<InternalCampaignResultDto>;
  getCampaign(
    merchantId: string,
    campaignId: string,
  ): Promise<InternalCampaignDetailsDto>;

  // AdSet
  updateAdSet(
    merchantId: string,
    adSetId: string,
    adSetData: InternalAdSetUpdateDto,
  ): Promise<InternalAdSetResultDto>;
  getAdSet(
    merchantId: string,
    adSetId: string,
  ): Promise<InternalAdSetDetailsDto>;

  // Creative
  uploadCreative(
    merchantId: string,
    creativeData: InternalCreativeUploadDto,
  ): Promise<InternalCreativeResultDto>;
  getCreative(
    merchantId: string,
    creativeId: string,
  ): Promise<InternalCreativeDetailsDto>;

  // Metrics
  getPerformanceMetrics(
    merchantId: string,
    params: InternalMetricsRequestParamsDto,
  ): Promise<InternalPerformanceMetricsResultDto>;

  // Audience
  syncAudience(
    merchantId: string,
    audienceData: InternalAudienceSyncDto,
  ): Promise<InternalAudienceSyncStatusResultDto>;
  getAudienceSyncStatus(
    merchantId: string,
    audienceIdNetwork: string,
  ): Promise<InternalAudienceSyncStatusResultDto>;

  // Feed
  submitProductFeed(
    merchantId: string,
    feedData: InternalProductFeedSubmitDto,
  ): Promise<InternalFeedSubmissionStatusResultDto>;
  getProductFeedStatus(
    merchantId: string,
    feedIdNetwork: string,
  ): Promise<InternalFeedSubmissionStatusResultDto>;

  // Validation
  validateCampaignData(
    merchantId: string,
    campaignData: any, // As per SDS: 'any' used as campaign structure varies widely.
                       // This could be refined if a common internal campaign DTO for validation is established.
  ): Promise<ValidationResultDto[]>;
  validateCreativeData(
    merchantId: string,
    creativeData: InternalCreativeUploadDto, // Or a more generic InternalCreativeDto if exists
  ): Promise<ValidationResultDto[]>;
  validateFeedData(
    merchantId: string,
    feedData: InternalProductFeedSubmitDto, // Or a more generic InternalProductFeedDto if exists
  ): Promise<ValidationResultDto[]>;
}
```