import { Module, Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PerformanceV1Controller } from './controllers/performance.v1.controller';
import { ABTestV1Controller } from './controllers/abtest.v1.controller';
import { DashboardV1Controller } from './controllers/dashboard.v1.controller';
import { ReportExportV1Controller } from './controllers/report-export.v1.controller';
import { InsightsV1Controller } from './controllers/insights.v1.controller';

import { AnalyticsReportingV1Service } from './services/analytics-reporting.v1.service';
import { PerformanceMetricCalculatorV1Service } from './services/performance-metric-calculator.v1.service';

// Basic stubs for DI setup as per SDS instruction 5 for AnalyticsReporting.ApiEndpoints
// These would typically be in their own files but are stubbed here for module DI setup.
@Injectable()
export class AnalyticsDataProviderDynamoDBService {
  // This is a stub implementation for IAnalyticsDataProvider
  // Full implementation would interact with DynamoDB
  async getCampaignPerformanceData(merchantId: string, query: any): Promise<any> {
    console.log('AnalyticsDataProviderDynamoDBService.getCampaignPerformanceData called with:', merchantId, query);
    return { data: [], totalCount: 0 };
  }
  async getAggregatedPerformanceData(merchantId: string, query: any): Promise<any> {
    console.log('AnalyticsDataProviderDynamoDBService.getAggregatedPerformanceData called with:', merchantId, query);
    return {};
  }
  async getABTestResults(merchantId: string, query: any): Promise<any> {
    console.log('AnalyticsDataProviderDynamoDBService.getABTestResults called with:', merchantId, query);
    return {};
  }
  async getRawDataForDashboardWidget(merchantId: string, widgetConfig: any): Promise<any> {
    console.log('AnalyticsDataProviderDynamoDBService.getRawDataForDashboardWidget called with:', merchantId, widgetConfig);
    return {};
  }
  async getMerchantDashboardConfig(merchantId: string, dashboardId: string): Promise<any | null> {
    console.log('AnalyticsDataProviderDynamoDBService.getMerchantDashboardConfig called with:', merchantId, dashboardId);
    return null;
  }
  async saveMerchantDashboardConfig(merchantId: string, dashboardId: string, config: any): Promise<any> {
    console.log('AnalyticsDataProviderDynamoDBService.saveMerchantDashboardConfig called with:', merchantId, dashboardId, config);
    return config;
  }
  async listMerchantDashboards(merchantId: string): Promise<{id: string, name: string}[]> {
    console.log('AnalyticsDataProviderDynamoDBService.listMerchantDashboards called with:', merchantId);
    return [];
  }
  async getDataIngestionStatus(merchantId: string): Promise<any[]> {
    console.log('AnalyticsDataProviderDynamoDBService.getDataIngestionStatus called with:', merchantId);
    return [];
  }
}

@Injectable()
export class CorePlatformDataProviderHttpService {
  // This is a stub implementation for ICorePlatformDataProvider
  // Full implementation would use @nestjs/axios or similar to call Core Platform API
  async getAttributedOrderData(merchantId: string, dateRange: any, attributionParams?: any): Promise<any[]> {
    console.log('CorePlatformDataProviderHttpService.getAttributedOrderData called with:', merchantId, dateRange, attributionParams);
    return [];
  }
}


@Module({
  imports: [
    ConfigModule, // Assuming ConfigService is globally available or provided as needed by services
  ],
  controllers: [
    PerformanceV1Controller,
    ABTestV1Controller,
    DashboardV1Controller,
    ReportExportV1Controller,
    InsightsV1Controller,
  ],
  providers: [
    AnalyticsReportingV1Service,
    PerformanceMetricCalculatorV1Service,
    {
      provide: 'IAnalyticsDataProvider',
      useClass: AnalyticsDataProviderDynamoDBService,
    },
    {
      provide: 'ICorePlatformDataProvider',
      useClass: CorePlatformDataProviderHttpService,
    },
  ],
})
export class AnalyticsReportingV1Module {}