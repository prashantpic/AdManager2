import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BaseCorePlatformClient } from '../common/clients/base-core-platform.client';
import { CorePlatformApiConfigInterface } from '../common/config/core-platform-api.config';

// Internal DTO as per SDS 3.11.3
// A flexible DTO for customer attributes.
export interface CoreCustomerAttributesDto {
  [key: string]: any; // Allows for various attributes
  // Example strongly-typed attributes (if known and consistent):
  // isNewCustomer?: boolean;
  // segment?: string;
  // totalSpend?: number;
}

@Injectable()
export class CustomerClient extends BaseCorePlatformClient {
  private readonly customerApiEndpoint: string;

  constructor(
    httpClient: HttpService,
    configService: ConfigService<CorePlatformApiConfigInterface>,
    logger: Logger,
  ) {
    super(httpClient, configService, logger);
    this.customerApiEndpoint = this.configService.get('customerApiEndpoint');
  }

  /**
   * Fetches specific attributes for a customer from the [PlatformName] Customer API.
   * @param customerId - The ID of the customer.
   * @param attributes - An array of attribute names to fetch.
   * @returns A promise resolving to CoreCustomerAttributesDto containing the fetched attributes.
   */
  async fetchCustomerAttributes(customerId: string, attributes: string[]): Promise<CoreCustomerAttributesDto> {
    const endpoint = `${this.customerApiEndpoint}/${customerId}/attributes`;
    const queryParams: Record<string, string> = {};

    if (attributes && attributes.length > 0) {
      // The [PlatformName] API might expect attributes as comma-separated string,
      // or multiple query params. Assuming 'fields=attr1,attr2' format for now.
      queryParams.fields = attributes.join(',');
      this.logger.log(`Fetching customer attributes: [${attributes.join(', ')}] for customer ID: ${customerId} from endpoint: ${endpoint}`);
    } else {
      this.logger.log(`Fetching all available customer attributes for customer ID: ${customerId} from endpoint: ${endpoint} (no specific attributes requested).`);
    }

    // Assuming the API returns a structure directly mappable to CoreCustomerAttributesDto.
    const fetchedAttributes = await super.get<CoreCustomerAttributesDto>(endpoint, queryParams);
    this.logger.log(`Fetched attributes for customer ${customerId}: ${JSON.stringify(fetchedAttributes)}`);
    return fetchedAttributes || {}; // Ensure an object is returned
  }
}