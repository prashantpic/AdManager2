import { Controller, Get, Post, Put, Param, Body, Headers, UseGuards, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiParam, ApiBody, ApiHeader } from '@nestjs/swagger';
import { AnalyticsReportingV1Service } from '../services/analytics-reporting.v1.service';
import { CustomDashboardConfigDto } from '../dto/request/custom-dashboard-config.dto';
import { JwtAuthGuard } from '../../../../../common/guards/jwt-auth.guard';

// Define a simple DTO for listing dashboards if not available elsewhere
class DashboardListItemDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', description: 'Dashboard ID' })
  id: string;

  @ApiProperty({ example: 'My Q1 Performance Dashboard', description: 'Dashboard Name' })
  name: string;
}


@ApiTags('Analytics Reporting V1')
@Controller('analytics/v1/dashboards')
@UseGuards(JwtAuthGuard)
export class DashboardV1Controller {
  constructor(private readonly analyticsService: AnalyticsReportingV1Service) {}

  @Get('/')
  @ApiOperation({ summary: 'List all custom dashboards for the merchant.' })
  @ApiOkResponse({ description: 'List of dashboards retrieved.', type: [DashboardListItemDto] })
  @ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })
  async listDashboards(
    @Headers('x-merchant-id') merchantId: string,
  ): Promise<{id: string, name: string}[]> {
    return this.analyticsService.listCustomDashboards(merchantId);
  }

  @Post('/')
  @ApiOperation({ summary: 'Create a new custom dashboard configuration.' })
  @ApiCreatedResponse({ description: 'Dashboard configuration created.', type: CustomDashboardConfigDto })
  @ApiBody({ type: CustomDashboardConfigDto })
  @ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })
  async createDashboardConfig(
    @Body() configDto: CustomDashboardConfigDto,
    @Headers('x-merchant-id') merchantId: string,
  ): Promise<CustomDashboardConfigDto> {
    return this.analyticsService.saveCustomDashboardConfig(merchantId, undefined, configDto);
  }

  @Get('/:dashboardId')
  @ApiOperation({ summary: 'Get a specific custom dashboard configuration.' })
  @ApiOkResponse({ description: 'Dashboard configuration retrieved.', type: CustomDashboardConfigDto })
  @ApiParam({ name: 'dashboardId', type: String, format: 'uuid', description: 'Dashboard Identifier' })
  @ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })
  async getDashboardConfig(
    @Param('dashboardId', ParseUUIDPipe) dashboardId: string,
    @Headers('x-merchant-id') merchantId: string,
  ): Promise<CustomDashboardConfigDto> {
    const config = await this.analyticsService.getCustomDashboardConfig(merchantId, dashboardId);
    if (!config) {
      throw new NotFoundException(`Dashboard with ID ${dashboardId} not found for merchant ${merchantId}.`);
    }
    return config;
  }

  @Put('/:dashboardId')
  @ApiOperation({ summary: 'Update an existing custom dashboard configuration.' })
  @ApiOkResponse({ description: 'Dashboard configuration updated.', type: CustomDashboardConfigDto })
  @ApiParam({ name: 'dashboardId', type: String, format: 'uuid', description: 'Dashboard Identifier' })
  @ApiBody({ type: CustomDashboardConfigDto })
  @ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })
  async updateDashboardConfig(
    @Param('dashboardId', ParseUUIDPipe) dashboardId: string,
    @Body() configDto: CustomDashboardConfigDto,
    @Headers('x-merchant-id') merchantId: string,
  ): Promise<CustomDashboardConfigDto> {
    return this.analyticsService.saveCustomDashboardConfig(merchantId, dashboardId, configDto);
  }

  @Get('/:dashboardId/data')
  @ApiOperation({ summary: 'Get data for a specific custom dashboard.' })
  @ApiOkResponse({ description: 'Dashboard data retrieved.', type: [Object] }) // Define WidgetDataDto[] or similar specific type if available
  @ApiParam({ name: 'dashboardId', type: String, format: 'uuid', description: 'Dashboard Identifier' })
  @ApiHeader({ name: 'x-merchant-id', required: true, description: 'Merchant Identifier (UUID)' })
  async getDashboardData(
    @Param('dashboardId', ParseUUIDPipe) dashboardId: string,
    @Headers('x-merchant-id') merchantId: string,
  ): Promise<any[]> { // Should be more specific like WidgetDataDto[]
    return this.analyticsService.getCustomDashboardData(merchantId, dashboardId);
  }
}