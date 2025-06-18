import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BaseCorePlatformClient } from '../common/clients/base-core-platform.client';
import { CorePlatformApiConfigInterface } from '../common/config/core-platform-api.config';
import { CoreProductDto } from './dtos/core-product.dto'; // Assuming DTO definition

@Injectable()
export class ProductClient extends BaseCorePlatformClient {
  private readonly productApiEndpoint: string;

  constructor(
    httpClient: HttpService,
    configService: ConfigService<CorePlatformApiConfigInterface>,
    logger: Logger,
  ) {
    super(httpClient, configService, logger);
    this.productApiEndpoint = this.configService.get('productApiEndpoint');
  }

  /**
   * Fetches a single product by its ID from the [PlatformName] core platform.
   * @param productId - The ID of the product to fetch.
   * @returns A promise resolving to the CoreProductDto.
   */
  async fetchProductById(productId: string): Promise<CoreProductDto> {
    const endpoint = `${this.productApiEndpoint}/${productId}`;
    this.logger.log(`Fetching product by ID: ${productId} from endpoint: ${endpoint}`);
    // Assuming the API returns a CoreProductDto structure directly for this endpoint
    return super.get<CoreProductDto>(endpoint);
  }

  /**
   * Fetches all products, or products updated since a specific timestamp, from the [PlatformName] core platform.
   * @param lastSyncTimestamp - Optional. If provided, fetches products updated since this date.
   * @returns A promise resolving to an array of CoreProductDto.
   */
  async fetchAllProducts(lastSyncTimestamp?: Date): Promise<CoreProductDto[]> {
    let endpoint = this.productApiEndpoint;
    const queryParams: Record<string, string> = {};

    if (lastSyncTimestamp) {
      queryParams.updated_since = lastSyncTimestamp.toISOString();
      this.logger.log(`Fetching all products updated since: ${lastSyncTimestamp.toISOString()}`);
    } else {
      this.logger.log('Fetching all products (full sync).');
    }
    
    // Placeholder for pagination handling if the [PlatformName] API supports it.
    // This might involve fetching multiple pages and concatenating results.
    // For now, assumes a single request or that the API handles large results gracefully.
    // Example: queryParams.page = '1'; queryParams.limit = '100';

    // Assuming the API returns an array of CoreProductDto structures directly
    // If the API returns a wrapped response (e.g., { data: CoreProductDto[], total: number }),
    // then super.get<WrapperType> would be used, followed by mapping: response.data.
    const products = await super.get<CoreProductDto[]>(endpoint, queryParams);
    this.logger.log(`Fetched ${products?.length || 0} products.`);
    return products || []; // Ensure an array is returned even if API response is null/undefined
  }
}