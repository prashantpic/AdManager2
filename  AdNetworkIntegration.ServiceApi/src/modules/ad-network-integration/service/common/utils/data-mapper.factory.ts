import { Injectable, LoggerService, Inject, Optional } from '@nestjs/common';
import { AdNetworkType } from '../enums';
import { IBaseDataMapper } from '../../adapters/core/base-data-mapper.interface';
// Concrete mapper imports - these would be actual implementations
// For now, they are placeholders.
// import { GoogleAdsDataMapper } from '../../adapters/google/google-ads.data-mapper';
// import { InstagramAdsDataMapper } from '../../adapters/instagram/instagram-ads.data-mapper';
// import { TikTokAdsDataMapper } from '../../adapters/tiktok/tiktok-ads.data-mapper';
// import { SnapchatAdsDataMapper } from '../../adapters/snapchat/snapchat-ads.data-mapper';

@Injectable()
export class DataMapperFactory {
  private readonly mappers: Map<AdNetworkType, IBaseDataMapper> = new Map();

  constructor(
    @Inject(LoggerService) private readonly logger: LoggerService,
    // Inject specific mappers. Use @Optional if not all mappers are always required or might be conditionally loaded.
    // Example:
    // @Optional() @Inject(GoogleAdsDataMapper) private readonly googleAdsDataMapper?: GoogleAdsDataMapper,
    // @Optional() @Inject(InstagramAdsDataMapper) private readonly instagramAdsDataMapper?: InstagramAdsDataMapper,
    // @Optional() @Inject(TikTokAdsDataMapper) private readonly tikTokAdsDataMapper?: TikTokAdsDataMapper,
    // @Optional() @Inject(SnapchatAdsDataMapper) private readonly snapchatAdsDataMapper?: SnapchatAdsDataMapper,
  ) {
    // Populate the mappers map
    // This is a placeholder section. In a real scenario, you'd inject and register actual mapper instances.
    // if (this.googleAdsDataMapper) this.mappers.set(AdNetworkType.GOOGLE_ADS, this.googleAdsDataMapper);
    // if (this.instagramAdsDataMapper) this.mappers.set(AdNetworkType.INSTAGRAM_ADS, this.instagramAdsDataMapper);
    // if (this.tikTokAdsDataMapper) this.mappers.set(AdNetworkType.TIKTOK_ADS, this.tikTokAdsDataMapper);
    // if (this.snapchatAdsDataMapper) this.mappers.set(AdNetworkType.SNAPCHAT_ADS, this.snapchatAdsDataMapper);

    // Placeholder: Log that mappers would be registered here
    this.logger.log('DataMapperFactory initialized. Specific mappers should be injected and registered here.', DataMapperFactory.name);
  }

  public getMapper(networkType: AdNetworkType): IBaseDataMapper {
    const mapper = this.mappers.get(networkType);
    if (!mapper) {
      this.logger.error(`No data mapper found for ad network type: ${AdNetworkType[networkType]}`, '', DataMapperFactory.name);
      // Fallback to a default/dummy mapper or throw an error
      // Throwing an error is generally safer to catch configuration issues early.
      throw new Error(`Data mapper for ${AdNetworkType[networkType]} is not implemented or registered.`);
    }
    this.logger.log(`Providing mapper for ad network type: ${AdNetworkType[networkType]}`, DataMapperFactory.name);
    return mapper;
  }

  // Method to manually register mappers if not using DI for all, or for dynamic registration
  public registerMapper(networkType: AdNetworkType, mapper: IBaseDataMapper): void {
    if (this.mappers.has(networkType)) {
        this.logger.warn(`Overwriting existing mapper for ad network type: ${AdNetworkType[networkType]}`, DataMapperFactory.name);
    }
    this.mappers.set(networkType, mapper);
    this.logger.log(`Registered mapper for ad network type: ${AdNetworkType[networkType]}`, DataMapperFactory.name);
  }
}