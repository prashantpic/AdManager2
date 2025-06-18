export interface AttributedOrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface AttributedOrder {
  orderId: string;
  orderValue: number;
  conversionTime: string; // ISO Date string
  items: AttributedOrderItem[];
}

export interface DateRange {
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
}

export interface AttributionParams {
  campaignIds?: string[];
  adSetIds?: string[];
  adIds?: string[];
}

export const ICorePlatformDataProviderToken = 'ICorePlatformDataProvider';

export interface ICorePlatformDataProvider {
  getAttributedOrderData(
    merchantId: string,
    dateRange: DateRange,
    attributionParams?: AttributionParams,
  ): Promise<AttributedOrder[]>;
}