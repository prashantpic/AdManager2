import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid'; // For generating dashboard IDs

import { IAnalyticsDataProvider } from '../interfaces/analytics-data-provider.interface';
import { PerformanceMetricCalculatorV1Service } from './performance-metric-calculator.v1.service';
import { PerformanceReportQueryDto } from '../dto/request/performance-report-query.dto';
import { ABTestReportQueryDto } from '../dto/request/ab-test-report-query.dto';
import { CustomDashboardConfigDto } from '../dto/request/custom-dashboard-config.dto';
import { ReportExportQueryDto } from '../dto/request/report-export-query.dto';
import { ABTestResultDto } from '../dto/response/ab-test-result.dto';
import { ActionableInsightDto } from '../dto/response/actionable-insight.dto';
import { DataIngestionStatusDto } from '../dto/response/data-ingestion-status.dto';
import { CampaignPerformanceDto } from '../dto/response/campaign-performance.dto';
import { AdSetPerformanceDto } from '../dto/response/ad-set-performance.dto';
import { AdPerformanceDto } from '../dto/response/ad-performance.dto';
import { AggregatedPerformanceDto } from '../dto/response/aggregated-performance.dto';
import { WidgetConfigDto } from '../dto/request/widget-config.dto'; // Needed for getCustomDashboardData

// Placeholder for actual data type for widget data in getCustomDashboardData
// interface WidgetDataDto {
//   widgetId: string;
//   widgetType: string;
//   title?: string;
//   data: any; // This would be structured based on widget type
// }


@Injectable()
export class AnalyticsReportingV1Service {
  constructor(
    @Inject('IAnalyticsDataProvider')
    private readonly dataProvider: IAnalyticsDataProvider,
    private readonly metricCalculator: PerformanceMetricCalculatorV1Service,
    private readonly configService: ConfigService,
  ) {}

  public async getPerformanceReport(
    merchantId: string,
    query: PerformanceReportQueryDto,
  ): Promise<{
    data: (CampaignPerformanceDto | AdSetPerformanceDto | AdPerformanceDto | AggregatedPerformanceDto)[];
    totalCount: number;
    metadata?: { metricsDocumentationUrl?: string };
  }> {
    if (!merchantId) {
      throw new BadRequestException('Merchant ID is required.');
    }

    // TODO: Further validation for merchantId format if necessary

    // Fetch raw or partially aggregated data
    const { data: rawData, totalCount } = await this.dataProvider.getCampaignPerformanceData(merchantId, query);

    let enrichedData: any[] = rawData;

    // Enrich with derived metrics (ROAS, CPA, ConversionRate) if requested and applicable
    const needsEnrichment = query.metrics?.some(metric =>
      ['ROAS', 'CPA', 'CONVERSION_RATE'].includes(metric),
    );

    if (needsEnrichment && rawData.length > 0 && query.startDate && query.endDate) {
       enrichedData = await this.metricCalculator.enrichPerformanceDataWithDerivedMetrics(
        // Cast to a common shape if necessary, or handle different DTO types
        rawData as { spend: number; clicks: number; conversions: number; campaignId?: string; adSetId?: string; adId?: string }[],
        merchantId,
        { startDate: query.startDate, endDate: query.endDate },
      );
    }
    
    // Handle drill-down logic if dimensions imply it (dataProvider should handle this based on query)
    // REQ-ARP-001: The dataProvider is expected to handle drill-downs based on 'dimensions' in the query.

    let finalData: any[] = enrichedData;
    const metadata: { metricsDocumentationUrl?: string } = {};

    // Handle aggregated (cross-network) view (REQ-ARP-002)
    if (query.granularity === 'summary' || (query.dimensions && query.dimensions.includes('adNetwork'))) {
        // If query implies aggregated view, the dataProvider might return AggregatedPerformanceDto directly,
        // or this service aggregates it. For now, assume dataProvider handles aggregation based on query.
        // If dataProvider.getAggregatedPerformanceData exists and is more suitable:
        // const aggregatedResult = await this.dataProvider.getAggregatedPerformanceData(merchantId, query);
        // finalData = [aggregatedResult]; // or aggregatedResult.breakdown if that's the structure
        // metadata.metricsDocumentationUrl = this.configService.get<string>('METRICS_DOCUMENTATION_URL');


        // For now, let's assume getCampaignPerformanceData can return aggregated data if 'summary' granularity is specified.
        // If an AggregatedPerformanceDto is returned, it might already contain the breakdown.
        // The following logic is a placeholder for potential aggregation if not handled by dataProvider.
        if (query.granularity === 'summary' && finalData.length > 0 && !(finalData[0] as AggregatedPerformanceDto).totalSpend) {
            // Placeholder: aggregate finalData into an AggregatedPerformanceDto structure if needed.
            // This would involve summing up metrics from CampaignPerformanceDto[] etc.
            // For simplicity, this example assumes the dataProvider handles this for 'summary' granularity.
        }
        metadata.metricsDocumentationUrl = this.configService.get<string>('METRICS_DOCUMENTATION_URL');
    }

    // Apply pagination and sorting (conceptually, dataProvider might do this, or it's done here post-enrichment)
    // For this example, we assume dataProvider handles pagination/sorting based on query.page, query.limit, query.sortBy, query.sortOrder

    return { data: finalData, totalCount, metadata };
  }

  public async getABTestReport(
    merchantId: string,
    query: ABTestReportQueryDto,
  ): Promise<ABTestResultDto> {
    if (!merchantId) {
      throw new BadRequestException('Merchant ID is required.');
    }
    if (!query.testId) {
      throw new BadRequestException('Test ID is required.');
    }
    // TODO: Further validation for merchantId and testId format

    const abTestResult = await this.dataProvider.getABTestResults(merchantId, query);

    // REQ-ARP-004: Perform statistical significance calculation if not pre-calculated by dataProvider
    // This is a placeholder for complex statistical calculations.
    // A dedicated statistics library or helper service might be used here.
    // Example: for each variant, calculate p-value, confidence intervals against a control or other variants.
    // Update abTestResult.variants[i].isWinner, .confidenceLevel, .pValue
    // Update abTestResult.winningVariantId, .statisticalSignificanceSummary
    if (abTestResult && abTestResult.variants && abTestResult.variants.length > 1) {
        // Placeholder: Implement statistical significance logic here or call a helper.
        // For example, identify a winning variant if conditions are met.
        // This is highly dependent on the statistical methods chosen (e.g., Chi-squared for conversion rates).
        abTestResult.statisticalSignificanceSummary = abTestResult.statisticalSignificanceSummary || "Statistical significance analysis pending implementation.";
    }


    return abTestResult;
  }

  public async getCustomDashboardData(
    merchantId: string,
    dashboardId: string,
  ): Promise<any[]> { // Should be Promise<WidgetDataDto[]>
    if (!merchantId || !dashboardId) {
      throw new BadRequestException('Merchant ID and Dashboard ID are required.');
    }

    const dashboardConfig = await this.dataProvider.getMerchantDashboardConfig(merchantId, dashboardId);
    if (!dashboardConfig) {
      throw new NotFoundException(`Dashboard with ID ${dashboardId} not found for merchant ${merchantId}.`);
    }

    const widgetDataPromises = dashboardConfig.widgets.map(async (widget: WidgetConfigDto) => {
      // Construct specific queries based on widget.metrics, widget.dimensions, widget.filters
      const widgetQuery: PerformanceReportQueryDto = {
        // Map widget config to performance report query
        // This is a simplified mapping; real-world scenarios might be more complex
        metrics: widget.metrics,
        dimensions: widget.dimensions,
        ...(widget.filters as Partial<PerformanceReportQueryDto>), // Spread filters if they match PerformanceReportQueryDto structure
        // Potentially set startDate, endDate from dashboard-level or widget-level settings if available
      };

      // Fetch data for the widget
      // This could use getRawDataForDashboardWidget or a more specific performance report query
      let rawWidgetDataResult = await this.dataProvider.getRawDataForDashboardWidget(merchantId, widget);
      
      // If getRawDataForDashboardWidget doesn't return structured data, use getPerformanceReport
      if (!rawWidgetDataResult) { // Or based on some indicator that specific data is needed
          const { data } = await this.getPerformanceReport(merchantId, widgetQuery);
          rawWidgetDataResult = data;
      }


      // Enrich data with derived metrics if needed
      let enrichedWidgetData = rawWidgetDataResult;
      const needsEnrichment = widget.metrics?.some(metric =>
        ['ROAS', 'CPA', 'CONVERSION_RATE'].includes(metric),
      );
      if (needsEnrichment && Array.isArray(rawWidgetDataResult) && rawWidgetDataResult.length > 0) {
        // Assuming widget filters contain date range or dashboard has a global date range
        const dateRange = {
            startDate: (widget.filters as any)?.startDate || dashboardConfig.widgets[0]?.filters?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to last 30 days
            endDate: (widget.filters as any)?.endDate || dashboardConfig.widgets[0]?.filters?.endDate || new Date().toISOString().split('T')[0],
        };
        enrichedWidgetData = await this.metricCalculator.enrichPerformanceDataWithDerivedMetrics(
          rawWidgetDataResult as { spend: number; clicks: number; conversions: number; campaignId?: string }[],
          merchantId,
          dateRange
        );
      }
      
      // Format data for the specific widget.widgetType
      // This step might involve transforming the data into a chart-ready format
      return {
        widgetId: widget.widgetId || 'unknown-widget-id', // Ensure widgetId is present
        widgetType: widget.widgetType,
        title: widget.title,
        data: enrichedWidgetData, // This data should be formatted as per widgetType's expectation
        // Potentially add chartOptions: widget.chartOptions
      };
    });

    return Promise.all(widgetDataPromises);
  }

  public async saveCustomDashboardConfig(
    merchantId: string,
    dashboardId: string | undefined,
    config: CustomDashboardConfigDto,
  ): Promise<CustomDashboardConfigDto> {
    if (!merchantId) {
      throw new BadRequestException('Merchant ID is required.');
    }
    // TODO: Validate config structure more deeply if needed

    const effectiveDashboardId = dashboardId || uuidv4();

    // Ensure all widgets have IDs, generate if missing (optional, based on system design)
    config.widgets = config.widgets.map(widget => ({
        ...widget,
        widgetId: widget.widgetId || uuidv4(),
    }));

    return this.dataProvider.saveMerchantDashboardConfig(merchantId, effectiveDashboardId, config);
  }
  
  public async getCustomDashboardConfig( // Added based on controller's need
    merchantId: string,
    dashboardId: string,
  ): Promise<CustomDashboardConfigDto | null> {
    if (!merchantId || !dashboardId) {
        throw new BadRequestException('Merchant ID and Dashboard ID are required.');
    }
    const config = await this.dataProvider.getMerchantDashboardConfig(merchantId, dashboardId);
    if (!config) {
        throw new NotFoundException(`Dashboard configuration for ID ${dashboardId} not found.`);
    }
    return config;
  }


  public async listCustomDashboards(
    merchantId: string,
  ): Promise<{ id: string; name: string }[]> {
    if (!merchantId) {
      throw new BadRequestException('Merchant ID is required.');
    }
    return this.dataProvider.listMerchantDashboards(merchantId);
  }

  public async generateExportableReport(
    merchantId: string,
    query: ReportExportQueryDto,
  ): Promise<{ data: Buffer; fileName: string; contentType: string }> {
    if (!merchantId) {
      throw new BadRequestException('Merchant ID is required.');
    }

    // Fetch data based on query.reportType and query.filters
    // This logic would be similar to getPerformanceReport or getABTestReport
    let reportData: any[];
    let totalCount: number;

    // Simplified data fetching logic; in reality, might need to distinguish report types
    if (query.reportType === 'AB_TEST_RESULT' && query.filters.testId) {
        const abTestReport = await this.getABTestReport(merchantId, { testId: query.filters.testId, startDate: query.filters.startDate, endDate: query.filters.endDate });
        reportData = abTestReport.variants ? [abTestReport] : []; // CSV/PDF might expect array of records
        totalCount = reportData.length;
    } else {
        const performanceResult = await this.getPerformanceReport(merchantId, query.filters);
        reportData = performanceResult.data;
        totalCount = performanceResult.totalCount;
    }


    if (reportData.length === 0) {
        throw new NotFoundException('No data found for the specified report criteria.');
    }

    let fileBuffer: Buffer;
    let contentType: string;
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName = `report-${query.reportType}-${timestamp}.${query.format}`;

    if (query.format === 'csv') {
      // Convert data to CSV format (use a library like 'papaparse' or custom logic)
      // Placeholder for CSV generation:
      // const csv = papaparse.unparse(reportData);
      // fileBuffer = Buffer.from(csv);
      const header = Object.keys(reportData[0]).join(',');
      const rows = reportData.map(row => Object.values(row).map(val => typeof val === 'string' && val.includes(',') ? `"${val}"` : val).join(','));
      const csvString = [header, ...rows].join('\n');
      fileBuffer = Buffer.from(csvString, 'utf-8');
      contentType = 'text/csv';
    } else if (query.format === 'pdf') {
      // Convert data to PDF (use a library like 'pdfmake' or 'puppeteer' for rendering HTML to PDF)
      // Placeholder for PDF generation:
      // const pdfDoc = pdfMake.createPdfKitDocument({ content: JSON.stringify(reportData, null, 2) });
      // fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      //   const chunks: Buffer[] = [];
      //   pdfDoc.on('data', chunk => chunks.push(chunk));
      //   pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      //   pdfDoc.on('error', reject);
      //   pdfDoc.end();
      // });
      fileBuffer = Buffer.from(`PDF Report for: ${query.reportType}\nData:\n${JSON.stringify(reportData, null, 2)}`); // Basic text PDF
      contentType = 'application/pdf';
    } else {
      throw new BadRequestException(`Unsupported report format: ${query.format}`);
    }

    return { data: fileBuffer, fileName, contentType };
  }

  public async getActionableInsights(
    merchantId: string,
    context?: any,
  ): Promise<ActionableInsightDto[]> {
    if (!merchantId) {
      throw new BadRequestException('Merchant ID is required.');
    }

    // Fetch relevant performance data (e.g., trends, anomalies, comparisons)
    // This is a placeholder. Real implementation would involve complex data fetching and analysis.
    // For example, fetch recent campaign performance data:
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    // const performanceQuery: PerformanceReportQueryDto = { 
    //     startDate: lastWeek.toISOString().split('T')[0], 
    //     endDate: today.toISOString().split('T')[0],
    //     granularity: 'summary', // Or 'daily' for trend analysis
    //     ...(context || {}) // Apply context if it contains query params
    // };
    // const { data: performanceData } = await this.getPerformanceReport(merchantId, performanceQuery);

    const insights: ActionableInsightDto[] = [];

    // Apply business rules or (future) ML models to identify insights
    // Example: "Campaign X ROAS dropped by 30% last week"
    // Example: "Ad Creative Y has significantly higher CTR"
    // This requires historical data comparison or benchmarking.

    // Placeholder insight
    insights.push({
      insightId: uuidv4(),
      title: 'Performance Review Recommended',
      description: 'Regularly review your campaign performance to identify optimization opportunities.',
      recommendation: 'Check key metrics like ROAS, CPA, and CTR for all active campaigns.',
      severity: 'info',
      insightType: 'GeneralRecommendation',
      relatedEntityType: 'campaign', // General, or could be specific if context is provided
    });
    
    if (context?.campaignId) {
        insights.push({
            insightId: uuidv4(),
            title: `Insight for Campaign ${context.campaignId}`,
            description: `Specific analysis for campaign ${context.campaignId} shows potential for improvement.`,
            recommendation: 'Dive deeper into ad set and ad performance for this campaign.',
            severity: 'medium',
            insightType: 'SpecificCampaignFocus',
            relatedEntityType: 'campaign',
            relatedEntityId: context.campaignId,
        });
    }


    // This method is highly dependent on the complexity of the insight generation logic.
    // For now, it returns a generic placeholder.
    // The dataProvider might have a method like `getInsightTriggers(merchantId, context)`
    // which this service then processes.

    return insights;
  }

  public async getDataIngestionStatus(
    merchantId: string,
  ): Promise<DataIngestionStatusDto[]> {
    if (!merchantId) {
      throw new BadRequestException('Merchant ID is required.');
    }
    return this.dataProvider.getDataIngestionStatus(merchantId);
  }
}