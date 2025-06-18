import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BaseCorePlatformClient } from '../common/clients/base-core-platform.client';
import { CorePlatformApiConfigInterface } from '../common/config/core-platform-api.config';
import { CoreOrderDto } from './dtos/core-order.dto'; // Assuming DTO definition

export interface FetchOrdersParams {
  merchantId: string;
  campaignIds?: string[];
  dateFrom?: string; // ISO Date string
  dateTo?: string; // ISO Date string
  // Add other potential filter parameters like page, limit for pagination
}

@Injectable()
export class OrderClient extends BaseCorePlatformClient {
  private readonly orderApiEndpoint: string;

  constructor(
    httpClient: HttpService,
    configService: ConfigService<CorePlatformApiConfigInterface>,
    logger: Logger,
  ) {
    super(httpClient, configService, logger);
    this.orderApiEndpoint = this.configService.get('orderApiEndpoint');
  }

  /**
   * Fetches orders from the [PlatformName] Order API based on provided filter parameters.
   * @param params - Parameters for filtering orders (merchantId, campaignIds, dateFrom, dateTo).
   * @returns A promise resolving to an array of CoreOrderDto.
   */
  async fetchOrders(params: FetchOrdersParams): Promise<CoreOrderDto[]> {
    const endpoint = this.orderApiEndpoint;
    const queryParams: Record<string, string | string[]> = {
      merchantId: params.merchantId,
    };

    if (params.campaignIds && params.campaignIds.length > 0) {
      // How campaignIds are passed depends on the [PlatformName] API.
      // It could be a comma-separated string or repeated query parameters.
      // Assuming comma-separated for now:
      queryParams.campaign_ids = params.campaignIds.join(',');
      // Or if API supports array format (e.g. campaignIds[]=id1&campaignIds[]=id2):
      // queryParams.campaignIds = params.campaignIds; // Axios might handle this.
    }
    if (params.dateFrom) {
      queryParams.date_from = params.dateFrom;
    }
    if (params.dateTo) {
      queryParams.date_to = params.dateTo;
    }

    this.logger.log(`Fetching orders from endpoint: ${endpoint} with params: ${JSON.stringify(queryParams)}`);

    // Placeholder for pagination handling.
    // Similar to ProductClient, this might involve fetching multiple pages.

    // Assuming the API returns an array of CoreOrderDto directly.
    // If it's a wrapped response (e.g., { data: CoreOrderDto[], total: number }), adjust accordingly.
    const orders = await super.get<CoreOrderDto[]>(endpoint, queryParams);
    this.logger.log(`Fetched ${orders?.length || 0} orders.`);
    return orders || [];
  }

  /**
   * Fetches a single order by its ID from the [PlatformName] core platform.
   * (May not be directly used by gRPC service but good utility - SDS 3.12.2)
   * @param orderId - The ID of the order to fetch.
   * @returns A promise resolving to the CoreOrderDto.
   */
  async fetchOrderById(orderId: string): Promise<CoreOrderDto> {
    const endpoint = `${this.orderApiEndpoint}/${orderId}`;
    this.logger.log(`Fetching order by ID: ${orderId} from endpoint: ${endpoint}`);
    // Assuming the API returns a CoreOrderDto structure directly for this endpoint.
    return super.get<CoreOrderDto>(endpoint);
  }

  // Method name from file structure for completeness, though SDS uses fetchOrders.
  // This could be an alias or a more specific method if [PlatformName] API distinguishes campaign-based fetching.
  // For now, it could delegate or be a distinct implementation if API differs.
  /**
   * Fetches orders by campaign ID and date range.
   * This is likely a specific variant of fetchOrders.
   * @param campaignId
   * @param dateRange
   * @returns Promise<CoreOrderDto[]>
   */
  async fetchOrdersByCampaign(merchantId: string, campaignId: string, dateRange: { from: string; to: string }): Promise<CoreOrderDto[]> {
    this.logger.log(`Fetching orders for campaign ${campaignId}, merchant ${merchantId}, date range ${dateRange.from} - ${dateRange.to}`);
    return this.fetchOrders({
        merchantId,
        campaignIds: [campaignId],
        dateFrom: dateRange.from,
        dateTo: dateRange.to,
    });
  }
}