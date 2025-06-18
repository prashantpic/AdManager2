import { PerformanceReportQueryDto } from '../dto/request/performance-report-query.dto';
import { ABTestReportQueryDto } from '../dto/request/ab-test-report-query.dto';
import { CustomDashboardConfigDto } from '../dto/request/custom-dashboard-config.dto';
import { WidgetConfigDto } from '../dto/request/widget-config.dto';

import { CampaignPerformanceDto } from '../dto/response/campaign-performance.dto';
import { AdSetPerformanceDto } from '../dto/response/ad-set-performance.dto';
import { AdPerformanceDto } from '../dto/response/ad-performance.dto';
import { AggregatedPerformanceDto } from '../dto/response/aggregated-performance.dto';
import { ABTestResultDto } from '../dto/response/ab-test-result.dto';
import { DataIngestionStatusDto } from '../dto/response/data-ingestion-status.dto';


export const IAnalyticsDataProviderToken = 'IAnalyticsDataProvider';

export interface IAnalyticsDataProvider {
  getCampaignPerformanceData(
    merchantId: string,
    query: PerformanceReportQueryDto,
  ): Promise<{ data: (CampaignPerformanceDto | AdSetPerformanceDto | AdPerformanceDto)[]; totalCount: number }>;

  getAggregatedPerformanceData(
    merchantId: string,
    query: PerformanceReportQueryDto,
  ): Promise<AggregatedPerformanceDto>;

  getABTestResults(
    merchantId: string,
    query: ABTestReportQueryDto,
  ): Promise<ABTestResultDto>;

  getRawDataForDashboardWidget(
    merchantId: string,
    widgetConfig: WidgetConfigDto,
  ): Promise<any>;

  getMerchantDashboardConfig(
    merchantId: string,
    dashboardId: string,
  ): Promise<CustomDashboardConfigDto | null>;

  saveMerchantDashboardConfig(
    merchantId: string,
    dashboardId: string,
    config: CustomDashboardConfigDto,
  ): Promise<CustomDashboardConfigDto>;

  listMerchantDashboards(
    merchantId: string,
  ): Promise<{ id: string; name: string }[]>;

  getDataIngestionStatus(
    merchantId: string,
  ): Promise<DataIngestionStatusDto[]>;
}