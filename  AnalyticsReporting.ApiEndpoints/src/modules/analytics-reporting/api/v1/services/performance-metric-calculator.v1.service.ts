import { Injectable, Inject } from '@nestjs/common';
import { ICorePlatformDataProvider } from '../interfaces/core-platform-data.interface';

@Injectable()
export class PerformanceMetricCalculatorV1Service {
  constructor(
    @Inject('ICorePlatformDataProvider')
    private readonly corePlatformDataProvider: ICorePlatformDataProvider,
  ) {}

  /**
   * Calculates Return on Ad Spend (ROAS).
   * @param spend The total amount spent on advertising.
   * @param revenue The total revenue generated from advertising.
   * @returns The calculated ROAS, or 0 if spend is 0.
   */
  public calculateRoas(spend: number, revenue: number): number {
    if (spend === 0) {
      return 0;
    }
    return parseFloat((revenue / spend).toFixed(2));
  }

  /**
   * Calculates Cost Per Acquisition (CPA).
   * @param spend The total amount spent on advertising.
   * @param conversions The total number of conversions.
   * @returns The calculated CPA, or 0 if conversions are 0.
   */
  public calculateCpa(spend: number, conversions: number): number {
    if (conversions === 0) {
      return 0;
    }
    return parseFloat((spend / conversions).toFixed(2));
  }

  /**
   * Calculates Conversion Rate.
   * @param conversions The total number of conversions.
   * @param clicks The total number of clicks.
   * @returns The calculated conversion rate as a percentage, or 0 if clicks are 0.
   */
  public calculateConversionRate(conversions: number, clicks: number): number {
    if (clicks === 0) {
      return 0;
    }
    return parseFloat(((conversions / clicks) * 100).toFixed(2));
  }

  /**
   * Enriches performance data entries with derived metrics like ROAS, CPA, and Conversion Rate.
   * @param performanceEntries Array of performance data entries.
   * @param merchantId The ID of the merchant.
   * @param dateRange The date range for fetching attributed order data.
   * @returns A promise that resolves to an array of enriched performance data entries.
   */
  public async enrichPerformanceDataWithDerivedMetrics<
    T extends {
      spend: number;
      clicks: number;
      conversions: number;
      campaignId?: string;
      adSetId?: string;
      adId?: string;
    },
  >(
    performanceEntries: T[],
    merchantId: string,
    dateRange: { startDate: string; endDate: string },
  ): Promise<(T & { roas?: number; cpa?: number; conversionRate?: number })[]> {
    const enrichedEntries: (T & { roas?: number; cpa?: number; conversionRate?: number })[] = [];

    for (const entry of performanceEntries) {
      const attributionParams: { campaignIds?: string[]; adSetIds?: string[]; adIds?: string[] } = {};
      if (entry.campaignId) {
        attributionParams.campaignIds = [entry.campaignId];
      }
      if (entry.adSetId) {
        attributionParams.adSetIds = [entry.adSetId];
      }
      if (entry.adId) {
        attributionParams.adIds = [entry.adId];
      }
      
      // Fetch attributed order data for the specific entity (campaign, ad set, or ad)
      // This part assumes that getAttributedOrderData can filter by these specific IDs if provided.
      // If not, and it only returns all orders for the date range, revenue attribution logic might need to be more complex.
      // For simplicity, we'll assume the API can provide specifically attributed orders or that a post-filter step would occur.
      const orders = await this.corePlatformDataProvider.getAttributedOrderData(
        merchantId,
        dateRange,
        attributionParams,
      );

      let totalRevenue = 0;
      for (const order of orders) {
        totalRevenue += order.orderValue;
      }

      const roas = this.calculateRoas(entry.spend, totalRevenue);
      const cpa = this.calculateCpa(entry.spend, entry.conversions);
      const conversionRate = this.calculateConversionRate(entry.conversions, entry.clicks);

      enrichedEntries.push({
        ...entry,
        roas,
        cpa,
        conversionRate,
      });
    }

    return enrichedEntries;
  }
}