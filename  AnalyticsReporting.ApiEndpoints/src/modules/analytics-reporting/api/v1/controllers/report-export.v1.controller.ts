import { Controller, Get, Query, Headers, Res, UseGuards, StreamableFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { AnalyticsReportingV1Service } from '../services/analytics-reporting.v1.service';
import { ReportExportQueryDto } from '../dto/request/report-export-query.dto';
import { ReportType } from '../constants/report-types.enum';
import { JwtAuthGuard } from '../../../../../common/guards/jwt-auth.guard';
import type { Response } from 'express';

@ApiTags('Analytics Reporting V1')
@Controller('analytics/v1/report-exports')
@UseGuards(JwtAuthGuard)
export class ReportExportV1Controller {
  constructor(private readonly analyticsService: AnalyticsReportingV1Service) {}

  @Get('/')
  @ApiOperation({ summary: 'Generate and export a report in CSV or PDF format.' })
  @ApiResponse({ status: 200, description: 'Report file stream. Content-Type will be text/csv or application/pdf.' })
  @ApiQuery({ name: 'reportType', enum: ReportType, example: ReportType.CAMPAIGN_PERFORMANCE, description: 'Type of report to export' })
  @ApiQuery({ name: 'format', enum: ['csv', 'pdf'], example: 'csv', description: 'Format of the exported report' })
  // Filters are part of ReportExportQueryDto.filters (PerformanceReportQueryDto)
  // Swagger will pick this up from the nested DTO definition.
  @ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })
  async exportReport(
    @Query() query: ReportExportQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('x-merchant-id') merchantId: string,
  ): Promise<StreamableFile> {
    const result = await this.analyticsService.generateExportableReport(merchantId, query);
    
    res.set({
      'Content-Type': result.contentType,
      'Content-Disposition': `attachment; filename="${result.fileName}"`,
    });
    
    return new StreamableFile(result.data);
  }
}