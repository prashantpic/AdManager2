import { Injectable, Logger } from '@nestjs/common';
import { OrderClient } from './order.client';
import { OrderDataRequestDto } from './dtos/order-data-request.dto';
import { OrderDataResponseDto } from './dtos/order-data-response.dto';
import { CoreOrderDto } from './dtos/core-order.dto';

@Injectable()
export class OrderDataIntegrationService {
  private readonly logger = new Logger(OrderDataIntegrationService.name);

  constructor(private readonly orderClient: OrderClient) {}

  async getOrderData(
    request: OrderDataRequestDto,
  ): Promise<OrderDataResponseDto> {
    this.logger.log(
      `Fetching order data for merchantId: ${request.merchantId}, campaignIds: ${request.campaignIds?.join(',')}, dateFrom: ${request.dateFrom}, dateTo: ${request.dateTo}`,
    );

    const clientParams: {
      merchantId: string;
      campaignIds?: string[];
      dateFrom?: string; // Assuming client expects ISO string date
      dateTo?: string;   // Assuming client expects ISO string date
    } = {
      merchantId: request.merchantId,
    };

    if (request.campaignIds && request.campaignIds.length > 0) {
      clientParams.campaignIds = request.campaignIds;
    }
    if (request.dateFrom) {
      // Potentially validate date format or convert if DTO uses Date objects
      clientParams.dateFrom = request.dateFrom;
    }
    if (request.dateTo) {
      clientParams.dateTo = request.dateTo;
    }

    try {
      const orders: CoreOrderDto[] = await this.orderClient.fetchOrders(
        clientParams,
      );

      this.logger.log(
        `Fetched ${orders.length} orders for merchantId: ${request.merchantId}`,
      );

      return {
        orders,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching order data for merchantId ${request.merchantId}: ${error.message}`,
        error.stack,
      );
      // Specific error handling and mapping to gRPC status would happen in controller
      throw error;
    }
  }
}