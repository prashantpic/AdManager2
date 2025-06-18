import { Injectable, LoggerService, Inject } from '@nestjs/common';
import { AdNetworkAdapterFactory } from '../../adapters/ad-network-adapter.factory';
import { AdNetworkType } from '../../common/enums';
import { ValidationResultDto } from '../../dto/internal/internal-validation-result.dto';
import { InternalCampaignDto } from '../../dto/internal/internal-campaign.dto';
import { InternalCreativeDto } from '../../dto/internal/internal-creative.dto';
import { InternalProductFeedDto } from '../../dto/internal/internal-feed.dto';
import { IAdNetworkAdapter } from '../../adapters/core/ad-network-adapter.interface';

@Injectable()
export class PolicyValidatorService {
  private readonly context = PolicyValidatorService.name;

  constructor(
    private readonly adapterFactory: AdNetworkAdapterFactory,
    @Inject(LoggerService) private readonly logger: LoggerService,
  ) {}

  async validateCampaignData(
    adNetwork: AdNetworkType,
    merchantId: string,
    data: InternalCampaignDto, // Using a more specific type than 'any'
  ): Promise<ValidationResultDto[]> {
    this.logger.log(
      `Validating campaign data for network: ${AdNetworkType[adNetwork]}, merchant: ${merchantId}`,
      this.context,
    );
    try {
      const adapter: IAdNetworkAdapter = this.adapterFactory.getAdapter(adNetwork);
      // Delegate to the specific adapter's validation logic
      // The adapter might call the ad network's validation API or have internal rules
      return await adapter.validateCampaignData(merchantId, data);
    } catch (error) {
      this.logger.error(
        `Error validating campaign data for network ${AdNetworkType[adNetwork]}: ${error.message}`,
        error.stack,
        this.context,
      );
      // Return a generic error or rethrow as a specific validation exception
      // For now, returning a generic error DTO
      return [
        {
          fieldPath: 'general',
          message: `Failed to validate campaign data due to an internal error: ${error.message}`,
          severity: 'ERROR', // From common.v1.proto ValidationSeverity
        },
      ];
    }
  }

  async validateCreativeData(
    adNetwork: AdNetworkType,
    merchantId: string,
    data: InternalCreativeDto,
  ): Promise<ValidationResultDto[]> {
    this.logger.log(
      `Validating creative data for network: ${AdNetworkType[adNetwork]}, merchant: ${merchantId}`,
      this.context,
    );
    try {
      const adapter: IAdNetworkAdapter = this.adapterFactory.getAdapter(adNetwork);
      return await adapter.validateCreativeData(merchantId, data);
    } catch (error) {
      this.logger.error(
        `Error validating creative data for network ${AdNetworkType[adNetwork]}: ${error.message}`,
        error.stack,
        this.context,
      );
      return [
        {
          fieldPath: 'general',
          message: `Failed to validate creative data due to an internal error: ${error.message}`,
          severity: 'ERROR',
        },
      ];
    }
  }

  async validateFeedData(
    adNetwork: AdNetworkType,
    merchantId: string,
    data: InternalProductFeedDto,
  ): Promise<ValidationResultDto[]> {
    this.logger.log(
      `Validating feed data for network: ${AdNetworkType[adNetwork]}, merchant: ${merchantId}`,
      this.context,
    );
    try {
      const adapter: IAdNetworkAdapter = this.adapterFactory.getAdapter(adNetwork);
      return await adapter.validateFeedData(merchantId, data);
    } catch (error) {
      this.logger.error(
        `Error validating feed data for network ${AdNetworkType[adNetwork]}: ${error.message}`,
        error.stack,
        this.context,
      );
      return [
        {
          fieldPath: 'general',
          message: `Failed to validate feed data due to an internal error: ${error.message}`,
          severity: 'ERROR',
        },
      ];
    }
  }
}