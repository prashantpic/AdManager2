import { Controller, Get, Query, Headers, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { AnalyticsReportingV1Service } from '../services/analytics-reporting.v1.service';
import { PerformanceReportQueryDto } from '../dto/request/performance-report-query.dto';
import { CampaignPerformanceDto } from '../dto/response/campaign-performance.dto';
import { AdSetPerformanceDto } from '../dto/response/ad-set-performance.dto';
import { AdPerformanceDto } from '../dto/response/ad-performance.dto';
import { AggregatedPerformanceDto } from '../dto/response/aggregated-performance.dto';
import { DataIngestionStatusDto } from '../dto/response/data-ingestion-status.dto';
import { JwtAuthGuard } from '../../../../../common/guards/jwt-auth.guard';
import { PaginatedResponseDto } from '../dto/response/paginated-response.dto'; // Assuming this DTO will be created as per SDS 6.3.2.9

@ApiTags('Analytics Reporting V1')
@Controller('analytics/v1/performance')
@UseGuards(JwtAuthGuard)
export class PerformanceV1Controller {
  constructor(private readonly analyticsService: AnalyticsReportingV1Service) {}

  @Get('campaigns')
  @ApiOperation({ summary: 'Get detailed campaign performance data with drill-down capabilities.' })
  @ApiOkResponse({
    description: 'Campaign performance data retrieved successfully.',
    type: PaginatedResponseDto<CampaignPerformanceDto>, // Example, actual type is a union
  })
  @ApiQuery({ name: 'startDate', type: String, required: false, description: 'YYYY-MM-DD', example: '2023-01-01' })
  @ApiQuery({ name: 'endDate', type: String, required: false, description: 'YYYY-MM-DD', example: '2023-01-31' })
  @ApiQuery({ name: 'campaignIds', type: [String], required: false, description: 'Filter by specific campaign IDs', example: ['uuid1', 'uuid2'] })
  @ApiQuery({ name: 'adNetworkIds', type: [String], required: false, description: 'Filter by specific ad network IDs', example: ['google', 'facebook'] })
  @ApiQuery({ name: 'dimensions', type: [String], required: false, description: 'Dimensions to group by', example: ['campaign', 'adNetwork'] })
  @ApiQuery({ name: 'metrics', type: [String], required: false, description: 'Specific metrics to include', example: ['ROAS', 'CTR'] })
  @ApiQuery({ name: 'granularity', enum: ['daily', 'weekly', 'monthly', 'summary'], required: false, description: 'Time granularity for the report' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number for pagination', example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Items per page for pagination', example: 10 })
  @ApiQuery({ name: 'sortBy', type: String, required: false, description: 'Field to sort by', example: 'spend' })
  @ApiQuery({ name: 'sortOrder', enum: ['ASC', 'DESC'], required: false, description: 'Sort order', example: 'DESC' })
  @ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })
  async getCampaignPerformance(
    @Query() query: PerformanceReportQueryDto,
    @Headers('x-merchant-id') merchantId: string,
  ): Promise<PaginatedResponseDto<CampaignPerformanceDto | AdSetPerformanceDto | AdPerformanceDto>> {
    const { data, totalCount } = await this.analyticsService.getPerformanceReport(merchantId, query);
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(totalCount / limit);
    return {
      data,
      totalCount,
      page,
      limit,
      totalPages,
    };
  }

  @Get('aggregated')
  @ApiOperation({ summary: 'Get aggregated performance data across networks/campaigns.' })
  @ApiOkResponse({ description: 'Aggregated performance data retrieved.', type: AggregatedPerformanceDto })
  @ApiQuery({ name: 'startDate', type: String, required: false, description: 'YYYY-MM-DD', example: '2023-01-01' })
  @ApiQuery({ name: 'endDate', type: String, required: false, description: 'YYYY-MM-DD', example: '2023-01-31' })
  @ApiQuery({ name: 'campaignIds', type: [String], required: false, description: 'Filter by specific campaign IDs' })
  @ApiQuery({ name: 'adNetworkIds', type: [String], required: false, description: 'Filter by specific ad network IDs' })
  @ApiQuery({ name: 'dimensions', type: [String], required: false, description: 'Dimensions to group by' })
  @ApiQuery({ name: 'metrics', type: [String], required: false, description: 'Specific metrics to include' })
  // Granularity for aggregated is typically 'summary'
  @ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })
  async getAggregatedPerformance(
    @Query() query: PerformanceReportQueryDto,
    @Headers('x-merchant-id') merchantId: string,
  ): Promise<AggregatedPerformanceDto> {
     // The service's getPerformanceReport should be capable of returning aggregated data
     // possibly as the primary content or within its 'data' array based on query.granularity = 'summary'.
     // This assumes that the service layer correctly uses IAnalyticsDataProvider.getAggregatedPerformanceData.
    const reportResult = await this.analyticsService.getPerformanceReport(merchantId, { ...query, granularity: 'summary' });

    // Assuming that for aggregated performance, the result.data contains the AggregatedPerformanceDto
    // or the service has a more specific method that returns AggregatedPerformanceDto directly.
    // Based on SDS, dataProvider has getAggregatedPerformanceData: Promise<AggregatedPerformanceDto>.
    // The service should ideally have a method that directly returns this.
    // If getPerformanceReport is used, its internal logic must handle this.
    if (reportResult.data && reportResult.data.length > 0 && (reportResult.data[0] as AggregatedPerformanceDto).totalSpend !== undefined) {
        return reportResult.data[0] as AggregatedPerformanceDto;
    }
    // Fallback or throw error if data is not in expected format
    // This part might need adjustment based on how AnalyticsReportingV1Service.getPerformanceReport truly handles 'summary' granularity.
    // A dedicated service method returning Promise<AggregatedPerformanceDto> would be cleaner.
    // For now, we rely on the flexibility of getPerformanceReport as suggested by SDS ("...or a dedicated aggregation method").
    const aggregatedData = await this.analyticsService.dataProvider.getAggregatedPerformanceData(merchantId, query);
    if(!aggregatedData) {
        throw new NotFoundException('Aggregated performance data not found.');
    }
    return aggregatedData;

  }

  @Get('ingestion-status')
  @ApiOperation({ summary: 'Get status of analytics data ingestion pipelines.' })
  @ApiOkResponse({ description: 'Data ingestion statuses retrieved.', type: [DataIngestionStatusDto] })
  @ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })
  async getDataIngestionStatus(
    @Headers('x-merchant-id') merchantId: string,
  ): Promise<DataIngestionStatusDto[]> {
    return this.analyticsService.getDataIngestionStatus(merchantId);
  }
}