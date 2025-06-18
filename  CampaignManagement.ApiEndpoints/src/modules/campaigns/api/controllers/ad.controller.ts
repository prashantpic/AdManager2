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
import { IdParamDto } from '../common/dto/id-param.dto'; // For Ad ID
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PagedResponseDto } from '../common/dto/paged.response.dto';

import {
  CreateAdDto,
  UpdateAdDto,
  AssociatePromotionAdDto,
  AdResponseDto,
} from '../dto/ad';

@ApiBearerAuth()
@ApiTags('Ads')
@UseGuards(JwtAuthGuard)
@Controller('ads')
export class AdController {
  constructor(
    @Inject(ICampaignManagementService)
    private readonly campaignManagementService: ICampaignManagementService,
  ) {}

  @Post('/adsets/:adSetId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new ad for an ad set' })
  @ApiParam({ name: 'adSetId', type: String, description: 'Ad Set ID (UUID) to associate the ad with' })
  @ApiBody({ type: CreateAdDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ad created successfully',
    type: AdResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ad Set not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async createAd(
    @Param('adSetId', ParseUUIDPipe) adSetId: string,
    @Body() createAdDto: CreateAdDto,
    @Req() request: Request,
  ): Promise<AdResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.createAd(
      adSetId,
      createAdDto,
      merchantId,
    );
  }

  @Get('/adsets/:adSetId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List ads for a specific ad set' })
  @ApiParam({ name: 'adSetId', type: String, description: 'Ad Set ID (UUID) to list ads for' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number (starts from 1)' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Items per page (max 100)' })
  @ApiQuery({ name: 'sortBy', type: String, required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', type: String, required: false, enum: ['ASC', 'DESC'], description: 'Sort order (ASC or DESC)'})
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of ads for the ad set retrieved successfully',
    type: PagedResponseDto, // Swagger may need help with generic type
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ad Set not found' })
  async getAdsByAdSet(
    @Param('adSetId', ParseUUIDPipe) adSetId: string,
    @Req() request: Request,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PagedResponseDto<AdResponseDto>> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.listAdsByAdSet(
      adSetId,
      merchantId,
      paginationQuery,
    );
  }

  @Get(':id') // Ad ID
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an ad by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Ad ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ad details retrieved successfully',
    type: AdResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ad not found' })
  async getAdById(
    @Param() params: IdParamDto, // Ad ID
    @Req() request: Request,
  ): Promise<AdResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.getAdById(params.id, merchantId);
  }

  @Put(':id') // Ad ID
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an ad' })
  @ApiParam({ name: 'id', type: String, description: 'Ad ID (UUID)' })
  @ApiBody({ type: UpdateAdDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ad updated successfully',
    type: AdResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ad not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async updateAd(
    @Param() params: IdParamDto, // Ad ID
    @Body() updateAdDto: UpdateAdDto,
    @Req() request: Request,
  ): Promise<AdResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.updateAd(
      params.id,
      updateAdDto,
      merchantId,
    );
  }

  @Post(':id/promotions') // Ad ID
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Associate a promotion with an ad' })
  @ApiParam({ name: 'id', type: String, description: 'Ad ID (UUID)' })
  @ApiBody({ type: AssociatePromotionAdDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Promotion associated successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ad or promotion not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async associatePromotionToAd(
    @Param() params: IdParamDto, // Ad ID
    @Body() associatePromotionAdDto: AssociatePromotionAdDto,
    @Req() request: Request,
  ): Promise<void> {
    const merchantId = request.user.merchantId;
    await this.campaignManagementService.associatePromotionToAd(
      params.id,
      associatePromotionAdDto.promotionId,
      merchantId,
    );
  }
}