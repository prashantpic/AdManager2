import { Injectable, Inject, LoggerService, Logger } from '@nestjs/common';
import { AdNetworkAdapterFactory } from '../../adapters/ad-network-adapter.factory';
import { PolicyValidatorService } from './policy-validator.service';
import { AdNetworkType } from '../../common/enums';
import {
  InternalCampaignCreateDto,
  InternalCampaignUpdateDto,
  InternalCampaignDetailsDto,
  InternalCampaignResultDto,
  InternalAdSetUpdateDto,
  InternalAdSetDetailsDto,
  InternalAdSetResultDto,
  ValidationResultDto,
  InternalCampaignDto,
} from '../../dto/internal';

@Injectable()
export class CampaignSyncService {
  constructor(
    private readonly adapterFactory: AdNetworkAdapterFactory,
    private readonly policyValidatorService: PolicyValidatorService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    this.logger.setContext(CampaignSyncService.name);
  }

  async createCampaign(
    adNetwork: AdNetworkType,
    merchantId: string,
    campaignData: InternalCampaignCreateDto,
  ): Promise<InternalCampaignResultDto> {
    this.logger.log(
      `Creating campaign for merchant ${merchantId} on network ${AdNetworkType[adNetwork]}`,
    );

    // Map create DTO to a general campaign DTO for validation if needed
    const campaignToValidate: InternalCampaignDto = {
        id: '', // Not yet created
        networkCampaignId: '',
        name: campaignData.name,
        status: campaignData.initialStatus,
        budget: campaignData.budget,
        startDate: campaignData.startDate,
        endDate: campaignData.endDate,
        adNetwork: adNetwork,
        merchantId: merchantId,
    };


    const validationResults: ValidationResultDto[] =
      await this.policyValidatorService.validateCampaignData(
        adNetwork,
        merchantId,
        campaignToValidate,
      );

    if (validationResults.some(r => r.severity === AdNetworkType.GOOGLE_ADS /* Map to common ValidationSeverity.ERROR */)) {
      const errors = validationResults.filter(r => r.severity === AdNetworkType.GOOGLE_ADS).map(r => `${r.fieldPath}: ${r.message}`).join(', ');
      throw new Error(`Campaign validation failed: ${errors}`);
    }

    const adapter = this.adapterFactory.getAdapter(adNetwork);
    return adapter.createCampaign(merchantId, campaignData);
  }

  async updateCampaign(
    adNetwork: AdNetworkType,
    merchantId: string,
    campaignId: string,
    campaignUpdateData: InternalCampaignUpdateDto,
  ): Promise<InternalCampaignResultDto> {
    this.logger.log(
      `Updating campaign ${campaignId} for merchant ${merchantId} on network ${AdNetworkType[adNetwork]}`,
    );
    
    // Fetch current campaign data or construct a representation for validation
    // For simplicity, we create a partial InternalCampaignDto. A real implementation might fetch existing data.
    const campaignToValidate: Partial<InternalCampaignDto> = {
        id: campaignId,
        name: campaignUpdateData.name,
        status: campaignUpdateData.campaignStatus,
        budget: campaignUpdateData.budget,
        startDate: campaignUpdateData.startDate,
        endDate: campaignUpdateData.endDate,
        adNetwork: adNetwork,
        merchantId: merchantId,
    };

    const validationResults: ValidationResultDto[] =
      await this.policyValidatorService.validateCampaignData(
        adNetwork,
        merchantId,
        campaignToValidate as InternalCampaignDto, // Cast, ensure all required fields for validation are present
      );

    if (validationResults.some(r => r.severity === AdNetworkType.GOOGLE_ADS /* ValidationSeverity.ERROR */)) {
      const errors = validationResults.filter(r => r.severity === AdNetworkType.GOOGLE_ADS).map(r => `${r.fieldPath}: ${r.message}`).join(', ');
      throw new Error(`Campaign update validation failed: ${errors}`);
    }

    const adapter = this.adapterFactory.getAdapter(adNetwork);
    return adapter.updateCampaign(merchantId, campaignId, campaignUpdateData);
  }

  async getCampaign(
    adNetwork: AdNetworkType,
    merchantId: string,
    campaignId: string,
  ): Promise<InternalCampaignDetailsDto> {
    this.logger.log(
      `Getting campaign ${campaignId} for merchant ${merchantId} on network ${AdNetworkType[adNetwork]}`,
    );
    const adapter = this.adapterFactory.getAdapter(adNetwork);
    return adapter.getCampaign(merchantId, campaignId);
  }

  async updateAdSet(
    adNetwork: AdNetworkType,
    merchantId: string,
    adSetId: string,
    adSetUpdateData: InternalAdSetUpdateDto,
  ): Promise<InternalAdSetResultDto> {
    this.logger.log(
      `Updating ad set ${adSetId} for merchant ${merchantId} on network ${AdNetworkType[adNetwork]}`,
    );
    // Potentially validate ad set data using PolicyValidatorService if it has a relevant method
    // For example:
    // const validationResults = await this.policyValidatorService.validateAdSetData(adNetwork, merchantId, adSetUpdateData);
    // if (validationResults.some(r => r.severity === ValidationSeverity.ERROR)) { ... }

    const adapter = this.adapterFactory.getAdapter(adNetwork);
    return adapter.updateAdSet(merchantId, adSetId, adSetUpdateData);
  }

  async getAdSet(
    adNetwork: AdNetworkType,
    merchantId: string,
    adSetId: string,
  ): Promise<InternalAdSetDetailsDto> {
    this.logger.log(
      `Getting ad set ${adSetId} for merchant ${merchantId} on network ${AdNetworkType[adNetwork]}`,
    );
    const adapter = this.adapterFactory.getAdapter(adNetwork);
    return adapter.getAdSet(merchantId, adSetId);
  }
}