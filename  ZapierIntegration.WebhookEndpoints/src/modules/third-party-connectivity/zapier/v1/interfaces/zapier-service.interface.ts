/**
 * @file src/modules/third-party-connectivity/zapier/v1/interfaces/zapier-service.interface.ts
 * @namespace AdManager.ThirdPartyConnectivity.Zapier.V1.Interfaces
 * @description Interface for ZapierService, specifying methods to handle Zapier interactions.
 * This facilitates dependency injection and testability.
 * Defines methods for processing incoming Google Ads data and triggering Zaps
 * for lead management and performance tracking as per REQ-TCE-006.
 */

import { ReceiveGoogleAdsLeadDto } from '../dto/receive-google-ads-lead.dto';
import { ReceiveGoogleAdsPerformanceDto } from '../dto/receive-google-ads-performance.dto';

/**
 * Injection token for the Zapier service.
 * Used to inject the ZapierService implementation where IZapierService is type-hinted.
 */
export const IZapierService = Symbol('IZapierService');

/**
 * Interface defining the contract for Zapier integration logic.
 */
export interface IZapierService {
  /**
   * Processes incoming Google Ads lead data from a Zapier webhook.
   * @param merchantId - The ID of the merchant associated with this webhook.
   * @param payload - The lead data payload conforming to ReceiveGoogleAdsLeadDto.
   * @returns A promise that resolves when processing is complete.
   */
  processIncomingGoogleAdsLead(merchantId: string, payload: ReceiveGoogleAdsLeadDto): Promise<void>;

  /**
   * Processes incoming Google Ads performance data from a Zapier webhook.
   * @param merchantId - The ID of the merchant associated with this webhook.
   * @param payload - The performance data payload conforming to ReceiveGoogleAdsPerformanceDto.
   * @returns A promise that resolves when processing is complete.
   */
  processIncomingGoogleAdsPerformance(merchantId: string, payload: ReceiveGoogleAdsPerformanceDto): Promise<void>;

  /**
   * Triggers a Zapier Zap for lead management purposes.
   * This involves making an outbound HTTP POST request to a merchant-specific Zapier webhook URL.
   * @param leadData - The data to send to the Zap. The structure of this data depends on what the target Zap expects.
   * @param merchantZapierUrl - The merchant-specific Zapier webhook URL to trigger.
   * @returns A promise that resolves when the Zap has been successfully triggered (or request sent).
   */
  triggerZapForLeadManagement(leadData: any, merchantZapierUrl: string): Promise<void>;

  /**
   * Triggers a Zapier Zap for campaign performance tracking purposes.
   * This involves making an outbound HTTP POST request to a merchant-specific Zapier webhook URL.
   * @param performanceData - The data to send to the Zap. The structure depends on the target Zap's expectations.
   * @param merchantZapierUrl - The merchant-specific Zapier webhook URL to trigger.
   * @returns A promise that resolves when the Zap has been successfully triggered (or request sent).
   */
  triggerZapForPerformanceTracking(performanceData: any, merchantZapierUrl: string): Promise<void>;
}