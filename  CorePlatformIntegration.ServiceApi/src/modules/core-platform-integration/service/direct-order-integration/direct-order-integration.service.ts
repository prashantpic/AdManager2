import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CorePlatformApiConfigInterface } from '../common/config/core-platform-api.config';
import { DirectOrderLinkRequestDto } from './dtos/direct-order-link-request.dto';
import { DirectOrderLinkResponseDto } from './dtos/direct-order-link-response.dto';

@Injectable()
export class DirectOrderIntegrationService {
  private readonly corePlatformBaseUrl: string;
  // If the direct order path is configurable, add it to CorePlatformApiConfigInterface
  // private readonly directOrderPath: string;

  constructor(
    private readonly configService: ConfigService<CorePlatformApiConfigInterface>,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(DirectOrderIntegrationService.name);
    this.corePlatformBaseUrl = this.configService.get('baseUrl');
    // this.directOrderPath = this.configService.get('directOrderPath') || '/direct-order'; // Example if configurable
  }

  /**
   * Generates a 'Direct Order' deep-link for the [PlatformName] core platform.
   * @param request - DTO containing productId, quantity, and merchantId.
   * @returns A promise resolving to DirectOrderLinkResponseDto with the deepLinkUrl.
   */
  async generateDirectOrderLink(request: DirectOrderLinkRequestDto): Promise<DirectOrderLinkResponseDto> {
    this.logger.log(`Generating Direct Order Link for request: ${JSON.stringify(request)}`);

    const { productId, quantity, merchantId } = request;

    // The base URL and path structure for direct order links are specific to [PlatformName].
    // SDS Example: `https://[PlatformNameDomain]/direct-order?merchantId=${request.merchantId}&productId=${request.productId}&quantity=${request.quantity || 1}`
    // Assuming this.corePlatformBaseUrl is like "https://[PlatformNameDomain]"
    // and the path is "/direct-order"
    
    // Ensure baseUrl doesn't end with a slash if path starts with one
    const platformBase = this.corePlatformBaseUrl.endsWith('/') 
        ? this.corePlatformBaseUrl.slice(0, -1) 
        : this.corePlatformBaseUrl;

    const directOrderPath = '/direct-order'; // As per SDS example path, or make configurable

    const deepLinkUrl = new URL(`${platformBase}${directOrderPath}`);
    deepLinkUrl.searchParams.append('merchantId', merchantId);
    deepLinkUrl.searchParams.append('productId', productId);
    deepLinkUrl.searchParams.append('quantity', (quantity || 1).toString());
    // Add any other required parameters as per [PlatformName] specifications.

    const generatedUrl = deepLinkUrl.toString();
    this.logger.log(`Generated Direct Order Link: ${generatedUrl}`);

    return { deepLinkUrl: generatedUrl };
  }
}