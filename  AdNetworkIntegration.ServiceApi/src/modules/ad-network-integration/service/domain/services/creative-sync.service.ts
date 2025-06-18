import { Injectable, Inject, LoggerService, Logger } from '@nestjs/common';
import { AdNetworkAdapterFactory } from '../../adapters/ad-network-adapter.factory';
import { PolicyValidatorService } from './policy-validator.service';
import { AdNetworkType } from '../../common/enums';
import {
  InternalCreativeUploadDto,
  InternalCreativeDetailsDto,
  InternalCreativeResultDto,
  ValidationResultDto,
  InternalCreativeDto,
} from '../../dto/internal';

@Injectable()
export class CreativeSyncService {
  constructor(
    private readonly adapterFactory: AdNetworkAdapterFactory,
    private readonly policyValidatorService: PolicyValidatorService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    this.logger.setContext(CreativeSyncService.name);
  }

  async uploadAndAssociateCreative( // Renamed to align with SDS description
    adNetwork: AdNetworkType,
    merchantId: string,
    creativeData: InternalCreativeUploadDto,
    // adIdOrAdSetId: string, // Association logic is usually handled by ad network when creating an Ad.
                            // Uploading creative is often a separate step to get a creative_id/asset_id.
  ): Promise<InternalCreativeResultDto> {
    this.logger.log(
      `Uploading creative for merchant ${merchantId} on network ${AdNetworkType[adNetwork]}`,
    );

    // Map upload DTO to a general creative DTO for validation if needed
    const creativeToValidate: InternalCreativeDto = { // This mapping might be more complex
        id: '', // Not yet created
        networkCreativeId: '',
        name: creativeData.name,
        type: creativeData.type,
        assetUrl: creativeData.assetUrl,
        // assetContent and fileName are part of upload DTO, not directly part of standard creative DTO.
        // The validator for creativeData might need to accept InternalCreativeUploadDto or a specific part of it.
        metadata: creativeData.metadata,
        adNetwork: adNetwork,
        merchantId: merchantId,
    };

    const validationResults: ValidationResultDto[] =
      await this.policyValidatorService.validateCreativeData(
        adNetwork,
        merchantId,
        creativeToValidate, // Or pass creativeData directly if validator expects UploadDto
      );

    if (validationResults.some(r => r.severity === AdNetworkType.GOOGLE_ADS /* ValidationSeverity.ERROR */)) {
      const errors = validationResults.filter(r => r.severity === AdNetworkType.GOOGLE_ADS).map(r => `${r.fieldPath}: ${r.message}`).join(', ');
      throw new Error(`Creative validation failed: ${errors}`);
    }

    const adapter = this.adapterFactory.getAdapter(adNetwork);
    const uploadedCreative = await adapter.uploadCreative(merchantId, creativeData);

    // Association logic would typically happen when creating/updating an Ad, using the uploadedCreative.id or networkCreativeId.
    // This service focuses on the upload part.
    // e.g., if (adIdOrAdSetId) { await adapter.associateCreative(uploadedCreative.id, adIdOrAdSetId); }

    return uploadedCreative;
  }

  async getCreative(
    adNetwork: AdNetworkType,
    merchantId: string,
    creativeId: string,
  ): Promise<InternalCreativeDetailsDto> {
    this.logger.log(
      `Getting creative ${creativeId} for merchant ${merchantId} on network ${AdNetworkType[adNetwork]}`,
    );
    const adapter = this.adapterFactory.getAdapter(adNetwork);
    return adapter.getCreative(merchantId, creativeId);
  }
}