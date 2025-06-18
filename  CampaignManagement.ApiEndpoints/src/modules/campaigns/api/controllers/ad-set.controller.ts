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
import { IdParamDto } from '../common/dto/id-param.dto'; // For adSetId
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PagedResponseDto } from '../common/dto/paged.response.dto';

import {
  CreateAdSetDto,
  UpdateAdSetDto,
  AdSetResponseDto,
} from '../dto/ad-set';

@ApiBearerAuth()
@ApiTags('AdSets')
@UseGuards(JwtAuthGuard)
@Controller('adsets')
export class AdSetController {
  constructor(
    @Inject(ICampaignManagementService)
    private readonly campaignManagementService: ICampaignManagementService,
  ) {}

  @Post('/campaigns/:campaignId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new ad set for a campaign' })
  @ApiParam({ name: 'campaignId', type: String, description: 'Campaign ID (UUID) to associate the ad set with' })
  @ApiBody({ type: CreateAdSetDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ad set created successfully',
    type: AdSetResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Campaign not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async createAdSet(
    @Param('campaignId', ParseUUIDPipe) campaignId: string,
    @Body() createAdSetDto: CreateAdSetDto,
    @Req() request: Request,
  ): Promise<AdSetResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.createAdSet(
      campaignId,
      createAdSetDto,
      merchantId,
    );
  }

  @Get('/campaigns/:campaignId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List ad sets for a specific campaign' })
  @ApiParam({ name: 'campaignId', type: String, description: 'Campaign ID (UUID) to list ad sets for' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number (starts from 1)' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Items per page (max 100)' })
  @ApiQuery({ name: 'sortBy', type: String, required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', type: String, required: false, enum: ['ASC', 'DESC'], description: 'Sort order (ASC or DESC)'})
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of ad sets for the campaign retrieved successfully',
    type: PagedResponseDto, // Swagger may need help with generic type
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Campaign not found' })
  async getAdSetsByCampaign(
    @Param('campaignId', ParseUUIDPipe) campaignId: string,
    @Req() request: Request,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PagedResponseDto<AdSetResponseDto>> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.listAdSetsByCampaign(
      campaignId,
      merchantId,
      paginationQuery,
    );
  }

  @Get(':id') // Ad Set ID
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an ad set by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Ad Set ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ad set details retrieved successfully',
    type: AdSetResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ad set not found' })
  async getAdSetById(
    @Param() params: IdParamDto, // Ad Set ID
    @Req() request: Request,
  ): Promise<AdSetResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.getAdSetById(params.id, merchantId);
  }

  @Put(':id') // Ad Set ID
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an ad set' })
  @ApiParam({ name: 'id', type: String, description: 'Ad Set ID (UUID)' })
  @ApiBody({ type: UpdateAdSetDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ad set updated successfully',
    type: AdSetResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ad set not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async updateAdSet(
    @Param() params: IdParamDto, // Ad Set ID
    @Body() updateAdSetDto: UpdateAdSetDto,
    @Req() request: Request,
  ): Promise<AdSetResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.updateAdSet(
      params.id,
      updateAdSetDto,
      merchantId,
    );
  }
}