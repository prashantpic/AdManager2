import { Injectable, Inject, LoggerService, Logger } from '@nestjs/common';
import { AdNetworkAdapterFactory } from '../../adapters/ad-network-adapter.factory';
import { PolicyValidatorService } from './policy-validator.service';
import { AdNetworkType } from '../../common/enums';
import {
  InternalProductFeedSubmitDto,
  InternalFeedSubmissionStatusResultDto,
  ValidationResultDto,
  InternalProductFeedDto,
} from '../../dto/internal';

@Injectable()
export class FeedSubmissionService {
  constructor(
    private readonly adapterFactory: AdNetworkAdapterFactory,
    private readonly policyValidatorService: PolicyValidatorService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    this.logger.setContext(FeedSubmissionService.name);
  }

  async submitProductFeed(
    adNetwork: AdNetworkType,
    merchantId: string,
    feedData: InternalProductFeedSubmitDto,
  ): Promise<InternalFeedSubmissionStatusResultDto> {
    this.logger.log(
      `Submitting product feed for merchant ${merchantId} on network ${AdNetworkType[adNetwork]}`,
    );

    // Map submit DTO to a general feed DTO for validation
    const feedToValidate: InternalProductFeedDto = {
        id: '', // Not yet created/submitted
        networkFeedId: '',
        name: feedData.catalogIdPlatform, // Or a name derived from it
        feedUrl: feedData.feedUrl,
        feedContent: feedData.feedContent, // This could be large, validator might need a stream or path
        format: feedData.feedFormat,
        adNetwork: adNetwork,
        merchantId: merchantId,
    };


    const validationResults: ValidationResultDto[] =
      await this.policyValidatorService.validateFeedData(
        adNetwork,
        merchantId,
        feedToValidate, // Or pass feedData directly if validator expects SubmitDto
      );

    if (validationResults.some(r => r.severity === AdNetworkType.GOOGLE_ADS /* ValidationSeverity.ERROR */)) {
       const errors = validationResults.filter(r => r.severity === AdNetworkType.GOOGLE_ADS).map(r => `${r.fieldPath}: ${r.message}`).join(', ');
      throw new Error(`Product feed validation failed: ${errors}`);
    }

    const adapter = this.adapterFactory.getAdapter(adNetwork);
    return adapter.submitProductFeed(merchantId, feedData);
  }

  async getProductFeedStatus(
    adNetwork: AdNetworkType,
    merchantId: string,
    feedIdNetwork: string,
  ): Promise<InternalFeedSubmissionStatusResultDto> {
    this.logger.log(
      `Getting product feed status for network ID ${feedIdNetwork}, merchant ${merchantId} on network ${AdNetworkType[adNetwork]}`,
    );
    const adapter = this.adapterFactory.getAdapter(adNetwork);
    return adapter.getProductFeedStatus(merchantId, feedIdNetwork);
  }
}