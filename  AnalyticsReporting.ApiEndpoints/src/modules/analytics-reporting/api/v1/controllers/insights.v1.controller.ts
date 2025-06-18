import { Controller, Get, Query, Headers, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { AnalyticsReportingV1Service } from '../services/analytics-reporting.v1.service';
import { ActionableInsightDto } from '../dto/response/actionable-insight.dto';
import { JwtAuthGuard } from '../../../../../common/guards/jwt-auth.guard';

@ApiTags('Analytics Reporting V1')
@Controller('analytics/v1/insights')
@UseGuards(JwtAuthGuard)
export class InsightsV1Controller {
  constructor(private readonly analyticsService: AnalyticsReportingV1Service) {}

  @Get('/')
  @ApiOperation({ summary: 'Get actionable insights based on performance data.' })
  @ApiOkResponse({ description: 'Actionable insights retrieved.', type: [ActionableInsightDto] })
  @ApiQuery({ name: 'context', type: String, required: false, description: 'Optional JSON string for context, e.g., {"campaignId": "uuid"}' })
  @ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })
  async getActionableInsights(
    @Query('context') context?: string,
    @Headers('x-merchant-id') merchantId: string,
  ): Promise<ActionableInsightDto[]> {
    let parsedContext: any;
    if (context) {
      try {
        parsedContext = JSON.parse(context);
      } catch (error) {
        throw new BadRequestException('Invalid context JSON format.');
      }
    }
    return this.analyticsService.getActionableInsights(merchantId, parsedContext);
  }
}