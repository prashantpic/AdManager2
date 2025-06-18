import { Injectable, Logger, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout } from 'rxjs';
import { IZapierService } from '../interfaces/zapier-service.interface';
import { ReceiveGoogleAdsLeadDto } from '../dto/receive-google-ads-lead.dto';
import { ReceiveGoogleAdsPerformanceDto } from '../dto/receive-google-ads-performance.dto';
import { ZAPIER_OUTBOUND_REQUEST_TIMEOUT_MS } from '../zapier.constants';
// Import other Ad Manager domain services if this service needs to interact with them
// e.g., import { LeadManagementService } from '../../../../leads/lead-management.service';
// e.g., import { AnalyticsProcessingService } from '../../../../analytics/analytics-processing.service';

@Injectable()
export class ZapierService implements IZapierService {
  private readonly logger = new Logger(ZapierService.name);

  constructor(
    private readonly httpService: HttpService,
    // @Inject(LeadManagementService) private readonly leadManagementService: LeadManagementService, // Example: uncomment and import if needed
    // @Inject(AnalyticsProcessingService) private readonly analyticsProcessingService: AnalyticsProcessingService, // Example: uncomment and import if needed
  ) {}

  async processIncomingGoogleAdsLead(merchantId: string, payload: ReceiveGoogleAdsLeadDto): Promise<void> {
    this.logger.log(`Processing incoming Google Ads lead for merchant ${merchantId}: Lead ID ${payload.leadId}`);
    // 1. Further validate payload if necessary (beyond DTO validation by class-validator).
    //    For example, cross-field validation or business rule checks.

    // 2. Transform data if needed for internal Ad Manager systems.
    //    E.g., mapping Zapier field names to internal domain model fields.

    // 3. Store the lead data or pass it to a dedicated Lead Management Service.
    //    Example:
    //    try {
    //      await this.leadManagementService.createLeadFromZapier(merchantId, payload);
    //    } catch (error) {
    //      this.logger.error(`Error passing lead to LeadManagementService for merchant ${merchantId}, Lead ID ${payload.leadId}: ${error.message}`, error.stack);
    //      // Decide on error handling: re-throw, or handle gracefully (e.g., queue for retry)
    //      throw error;
    //    }

    // 4. If payload.merchantZapierUrl is present, this might also trigger an outbound Zap.
    //    This depends on the specific workflow. If the incoming webhook's purpose is to
    //    trigger another specific merchant Zap, you might call triggerZapForLeadManagement here.
    if (payload.merchantZapierUrl) {
      this.logger.log(`Lead payload for merchant ${merchantId} contains merchantZapierUrl: ${payload.merchantZapierUrl}. Considering outbound trigger.`);
      // Potentially:
      // await this.triggerZapForLeadManagement({ /* relevant lead data for outbound zap */ }, payload.merchantZapierUrl);
    }

    this.logger.log(`Successfully processed Google Ads lead for merchant ${merchantId}: Lead ID ${payload.leadId}`);
    // Simulate processing for demonstration purposes as per SDS. Replace with actual logic.
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async processIncomingGoogleAdsPerformance(merchantId: string, payload: ReceiveGoogleAdsPerformanceDto): Promise<void> {
    this.logger.log(`Processing incoming Google Ads performance data for merchant ${merchantId}, Campaign ID ${payload.campaignId}, Date ${payload.date}`);
    // 1. Further validate payload if necessary.

    // 2. Transform data for internal analytics storage or processing.

    // 3. Pass data to an Analytics Processing Service.
    //    Example:
    //    try {
    //      await this.analyticsProcessingService.ingestGoogleAdsPerformanceFromZapier(merchantId, payload);
    //    } catch (error) {
    //      this.logger.error(`Error passing performance data to AnalyticsProcessingService for merchant ${merchantId}, Campaign ID ${payload.campaignId}: ${error.message}`, error.stack);
    //      throw error;
    //    }

    // 4. If payload.merchantZapierUrl is present, consider triggering an outbound Zap.
    if (payload.merchantZapierUrl) {
         this.logger.log(`Performance payload for merchant ${merchantId} contains merchantZapierUrl: ${payload.merchantZapierUrl}. Considering outbound trigger.`);
         // Potentially:
         // await this.triggerZapForPerformanceTracking({ /* relevant performance data */ }, payload.merchantZapierUrl);
    }

    this.logger.log(`Successfully processed Google Ads performance data for merchant ${merchantId}, Campaign ID ${payload.campaignId}`);
    // Simulate processing for demonstration purposes. Replace with actual logic.
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async triggerZapForLeadManagement(leadData: any, merchantZapierUrl: string): Promise<void> {
    this.logger.log(`Triggering Zap for lead management at URL: ${merchantZapierUrl}`);
    try {
      const response = await firstValueFrom(
        this.httpService.post(merchantZapierUrl, leadData).pipe(
            timeout(ZAPIER_OUTBOUND_REQUEST_TIMEOUT_MS)
        ),
      );
      this.logger.log(`Zap triggered successfully for lead management. Status: ${response.status}. URL: ${merchantZapierUrl}`);
      // Handle Zapier's response if necessary. Zapier usually returns a success status (e.g., 200 OK)
      // immediately if the webhook is received, indicating the Zap has started.
      // The actual execution of the Zap is asynchronous on Zapier's side.
    } catch (error) {
      this.logger.error(`Failed to trigger Zap for lead management at ${merchantZapierUrl}: ${error.message}`, error.stack);
      // Implement retry logic or dead-letter queue if this is a critical operation.
      // For now, re-throw the error to be handled by the caller or global exception filter.
      throw error;
    }
  }

  async triggerZapForPerformanceTracking(performanceData: any, merchantZapierUrl: string): Promise<void> {
    this.logger.log(`Triggering Zap for performance tracking at URL: ${merchantZapierUrl}`);
    try {
      const response = await firstValueFrom(
        this.httpService.post(merchantZapierUrl, performanceData).pipe(
            timeout(ZAPIER_OUTBOUND_REQUEST_TIMEOUT_MS)
        ),
      );
      this.logger.log(`Zap triggered successfully for performance tracking. Status: ${response.status}. URL: ${merchantZapierUrl}`);
    } catch (error) {
      this.logger.error(`Failed to trigger Zap for performance tracking at ${merchantZapierUrl}: ${error.message}`, error.stack);
      // Implement retry logic or dead-letter queue if critical.
      throw error;
    }
  }
}