import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
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
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PagedResponseDto } from '../common/dto/paged.response.dto';

import {
  CreateCampaignDto,
  UpdateCampaignDto,
  UpdateCampaignStatusDto,
  AssociateProductCatalogDto,
  AssociateAudienceDto,
  AssociatePromotionCampaignDto,
  CampaignResponseDto,
} from '../dto/campaign'; // Assuming campaign.response.dto is in this index

// Augment the Request type to include the user property from JwtStrategy
// This is a global augmentation and might be better placed in a central types file (e.g., types.d.ts)
declare module 'express' {
  interface Request {
    user?: { userId: string; merchantId: string; roles: string[] };
  }
}

@ApiBearerAuth()
@ApiTags('Campaigns')
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignController {
  constructor(
    @Inject(ICampaignManagementService)
    private readonly campaignManagementService: ICampaignManagementService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiBody({ type: CreateCampaignDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Campaign created successfully',
    type: CampaignResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async createCampaign(
    @Body() createCampaignDto: CreateCampaignDto,
    @Req() request: Request,
  ): Promise<CampaignResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.createCampaign(
      createCampaignDto,
      merchantId,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all campaigns for the merchant' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number (starts from 1)' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Items per page (max 100)' })
  @ApiQuery({ name: 'sortBy', type: String, required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', type: String, required: false, enum: ['ASC', 'DESC'], description: 'Sort order (ASC or DESC)'})
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of campaigns retrieved successfully',
    type: PagedResponseDto, // Swagger may need help with generic type: type: () => PagedResponseDto<CampaignResponseDto> or using ApiExtraModels
  })
  async getAllCampaigns(
    @Req() request: Request,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PagedResponseDto<CampaignResponseDto>> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.listCampaigns(
      merchantId,
      paginationQuery,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a campaign by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Campaign ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Campaign details retrieved successfully',
    type: CampaignResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Campaign not found' })
  async getCampaignById(
    @Param() params: IdParamDto,
    @Req() request: Request,
  ): Promise<CampaignResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.getCampaignById(
      params.id,
      merchantId,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a campaign' })
  @ApiParam({ name: 'id', type: String, description: 'Campaign ID (UUID)' })
  @ApiBody({ type: UpdateCampaignDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Campaign updated successfully',
    type: CampaignResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Campaign not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async updateCampaign(
    @Param() params: IdParamDto,
    @Body() updateCampaignDto: UpdateCampaignDto,
    @Req() request: Request,
  ): Promise<CampaignResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.updateCampaign(
      params.id,
      updateCampaignDto,
      merchantId,
    );
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update campaign status' })
  @ApiParam({ name: 'id', type: String, description: 'Campaign ID (UUID)' })
  @ApiBody({ type: UpdateCampaignStatusDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Campaign status updated successfully',
    type: CampaignResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Campaign not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async updateCampaignStatus(
    @Param() params: IdParamDto,
    @Body() updateStatusDto: UpdateCampaignStatusDto,
    @Req() request: Request,
  ): Promise<CampaignResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.updateCampaignStatus(
      params.id,
      updateStatusDto,
      merchantId,
    );
  }

  @Post(':id/product-catalogs')
  @HttpCode(HttpStatus.OK) // Or HttpStatus.NO_CONTENT (204) if service returns void and no body is sent
  @ApiOperation({ summary: 'Associate a product catalog with a campaign' })
  @ApiParam({ name: 'id', type: String, description: 'Campaign ID (UUID)' })
  @ApiBody({ type: AssociateProductCatalogDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Product catalog associated successfully.'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Campaign or catalog not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async associateProductCatalog(
    @Param() params: IdParamDto,
    @Body() associateCatalogDto: AssociateProductCatalogDto,
    @Req() request: Request,
  ): Promise<void> {
    const merchantId = request.user.merchantId;
    await this.campaignManagementService.associateProductCatalogToCampaign(
      params.id,
      associateCatalogDto.catalogId,
      merchantId,
    );
  }

  @Post(':id/audiences')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Associate an audience with a campaign' })
  @ApiParam({ name: 'id', type: String, description: 'Campaign ID (UUID)' })
  @ApiBody({ type: AssociateAudienceDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Audience associated successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Campaign or audience not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async associateAudience(
    @Param() params: IdParamDto,
    @Body() associateAudienceDto: AssociateAudienceDto,
    @Req() request: Request,
  ): Promise<void> {
    const merchantId = request.user.merchantId;
    await this.campaignManagementService.associateAudienceToCampaign(
      params.id,
      associateAudienceDto.audienceId,
      merchantId,
    );
  }

  @Post(':id/promotions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Associate a promotion with a campaign' })
  @ApiParam({ name: 'id', type: String, description: 'Campaign ID (UUID)' })
  @ApiBody({ type: AssociatePromotionCampaignDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Promotion associated successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Campaign or promotion not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async associatePromotion(
    @Param() params: IdParamDto,
    @Body() associatePromotionDto: AssociatePromotionCampaignDto,
    @Req() request: Request,
  ): Promise<void> {
    const merchantId = request.user.merchantId;
    await this.campaignManagementService.associatePromotionToCampaign(
      params.id,
      associatePromotionDto.promotionId,
      merchantId,
    );
  }
}