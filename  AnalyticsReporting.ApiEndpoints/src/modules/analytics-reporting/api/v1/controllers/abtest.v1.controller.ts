import { Controller, Get, Query, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { AnalyticsReportingV1Service } from '../services/analytics-reporting.v1.service';
import { ABTestReportQueryDto } from '../dto/request/ab-test-report-query.dto';
import { ABTestResultDto } from '../dto/response/ab-test-result.dto';
import { JwtAuthGuard } from '../../../../../common/guards/jwt-auth.guard';

@ApiTags('Analytics Reporting V1')
@Controller('analytics/v1/abtests')
@UseGuards(JwtAuthGuard)
export class ABTestV1Controller {
  constructor(private readonly analyticsService: AnalyticsReportingV1Service) {}

  @Get('results') // Path changed as per updated SDS
  @ApiOperation({ summary: 'Get A/B test results analysis.' })
  @ApiOkResponse({ description: 'A/B test results retrieved.', type: ABTestResultDto })
  @ApiQuery({ name: 'testId', type: String, required: true, description: 'UUID of the A/B test', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @ApiQuery({ name: 'startDate', type: String, required: false, description: 'YYYY-MM-DD', example: '2023-01-01' })
  @ApiQuery({ name: 'endDate', type: String, required: false, description: 'YYYY-MM-DD', example: '2023-01-31' })
  @ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })
  async getABTestResults(
    @Query() query: ABTestReportQueryDto,
    @Headers('x-merchant-id') merchantId: string,
  ): Promise<ABTestResultDto> {
    return this.analyticsService.getABTestReport(merchantId, query);
  }
}