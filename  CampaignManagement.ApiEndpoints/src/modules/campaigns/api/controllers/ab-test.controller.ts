import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Inject,
  Req,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ICampaignManagementService } from '../services/interfaces/campaign-management.service.interface';
import { IdParamDto } from '../common/dto/id-param.dto';
// PaginationQueryDto is extended by ListABTestsQueryDto
import { PagedResponseDto } from '../common/dto/paged.response.dto';

import {
  CreateABTestDto,
  UpdateABTestDto,
  ABTestResponseDto,
  ABTestResultResponseDto,
  ListABTestsQueryDto,
} from '../dto/ab-test';

@ApiBearerAuth()
@ApiTags('A/B Tests')
@UseGuards(JwtAuthGuard)
@Controller('abtests')
export class ABTestController {
  constructor(
    @Inject(ICampaignManagementService)
    private readonly campaignManagementService: ICampaignManagementService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new A/B test' })
  @ApiBody({ type: CreateABTestDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'A/B test created successfully',
    type: ABTestResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async createABTest(
    @Body() createABTestDto: CreateABTestDto,
    @Req() request: Request,
  ): Promise<ABTestResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.createABTest(
      createABTestDto,
      merchantId,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List A/B tests for the merchant' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number (starts from 1)' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Items per page (max 100)' })
  @ApiQuery({ name: 'sortBy', type: String, required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', type: String, required: false, enum: ['ASC', 'DESC'], description: 'Sort order (ASC or DESC)'})
  @ApiQuery({ name: 'campaignId', type: String, format: 'uuid', required: false, description: 'Filter by Campaign ID (UUID)'})
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of A/B tests retrieved successfully',
    type: PagedResponseDto, // Swagger may need help with generic type
  })
  async listABTests(
    @Req() request: Request,
    @Query() query: ListABTestsQueryDto,
  ): Promise<PagedResponseDto<ABTestResponseDto>> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.listABTests(
      merchantId,
      query.campaignId, // campaignId is optional in ListABTestsQueryDto
      query,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an A/B test by ID' })
  @ApiParam({ name: 'id', type: String, description: 'A/B Test ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A/B test details retrieved successfully',
    type: ABTestResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'A/B test not found' })
  async getABTestById(
    @Param() params: IdParamDto,
    @Req() request: Request,
  ): Promise<ABTestResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.getABTestById(params.id, merchantId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an A/B test (e.g., name, schedule, status)' })
  @ApiParam({ name: 'id', type: String, description: 'A/B Test ID (UUID)' })
  @ApiBody({ type: UpdateABTestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A/B test updated successfully',
    type: ABTestResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'A/B test not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async updateABTest(
    @Param() params: IdParamDto,
    @Body() updateABTestDto: UpdateABTestDto,
    @Req() request: Request,
  ): Promise<ABTestResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.updateABTest(
      params.id,
      updateABTestDto,
      merchantId,
    );
  }

  @Get(':id/results')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get A/B test results' })
  @ApiParam({ name: 'id', type: String, description: 'A/B Test ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A/B test results retrieved successfully',
    type: ABTestResultResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'A/B test not found or results not available' })
  async getABTestResults(
    @Param() params: IdParamDto,
    @Req() request: Request,
  ): Promise<ABTestResultResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.getABTestResults(params.id, merchantId);
  }
}