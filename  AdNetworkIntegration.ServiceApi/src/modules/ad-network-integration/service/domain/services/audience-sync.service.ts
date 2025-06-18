import { Injectable, Inject, LoggerService, Logger } from '@nestjs/common';
import { AdNetworkAdapterFactory } from '../../adapters/ad-network-adapter.factory';
import { AdNetworkType } from '../../common/enums';
import {
  InternalAudienceSyncDto,
  InternalAudienceSyncStatusResultDto,
} from '../../dto/internal';
// PII Hashing or preparation logic might be in a separate utility/service if complex
// import { PiiHandlerService } from '../../common/utils/pii-handler.service'; 

@Injectable()
export class AudienceSyncService {
  constructor(
    private readonly adapterFactory: AdNetworkAdapterFactory,
    // private readonly piiHandlerService: PiiHandlerService, // If PII handling is complex
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AudienceSyncService.name);
  }

  async synchronizeAudience(
    adNetwork: AdNetworkType,
    merchantId: string,
    audienceData: InternalAudienceSyncDto,
  ): Promise<InternalAudienceSyncStatusResultDto> {
    this.logger.log(
      `Synchronizing audience '${audienceData.name}' for merchant ${merchantId} on network ${AdNetworkType[adNetwork]}`,
    );

    // Example PII handling step (simplified)
    // if (audienceData.type === AudienceType.CUSTOM_AUDIENCE && audienceData.customerEmails) {
    //   audienceData.hashedCustomerEmails = await this.piiHandlerService.hashEmails(audienceData.customerEmails);
    //   delete audienceData.customerEmails; // Don't send raw PII
    // }

    // Add any pre-validation if needed via PolicyValidatorService for audience data
    // e.g. await this.policyValidatorService.validateAudienceData(adNetwork, merchantId, audienceData);

    const adapter = this.adapterFactory.getAdapter(adNetwork);
    return adapter.syncAudience(merchantId, audienceData);
  }

  async getAudienceSyncStatus(
    adNetwork: AdNetworkType,
    merchantId: string,
    audienceIdNetwork: string,
  ): Promise<InternalAudienceSyncStatusResultDto> {
    this.logger.log(
      `Getting audience sync status for network ID ${audienceIdNetwork}, merchant ${merchantId} on network ${AdNetworkType[adNetwork]}`,
    );
    const adapter = this.adapterFactory.getAdapter(adNetwork);
    return adapter.getAudienceSyncStatus(merchantId, audienceIdNetwork);
  }
}