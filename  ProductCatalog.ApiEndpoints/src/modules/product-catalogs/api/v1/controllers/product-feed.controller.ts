import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Inject,
  Req,
  Res,
  Header,
  HttpStatus,
  NotFoundException,
  ParseUUIDPipe,
  StreamableFile,
  // Logger, // Uncomment if logging is implemented
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { IProductCatalogService } from '../interfaces/product-catalog-service.interface';
import { PRODUCT_CATALOG_SERVICE_TOKEN } from '../constants/product-catalog.constants';
import {
  GenerateFeedRequestDto,
  FeedResponseDto,
  FeedStatusResponseDto,
  ValidateFeedRequestDto,
  FeedValidationResultResponseDto,
  FeedSummaryDto,
} from '../dtos/feed'; // Adjust path if DTOs are in subfolders
import { PaginationDto } from '../dtos/common/pagination.dto';
import { PaginatedResponseDto } from '../dtos/common/api-response.dto';
import { Response } from 'express';

@ApiBearerAuth()
@ApiTags('Product Catalog Feeds')
@Controller('v1/merchant/catalogs') // Base path shared with ProductCatalogController
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductFeedController {
  // @Inject(Logger) private readonly logger: LoggerService; // Uncomment if logging is implemented

  constructor(
    @Inject(PRODUCT_CATALOG_SERVICE_TOKEN)
    private readonly productCatalogService: IProductCatalogService,
  ) {}

  @Post(':catalogId/feeds')
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Generate a product feed for an ad network' })
  @ApiResponse({ status: 202, description: 'Feed generation initiated.', type: FeedResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Catalog not found.' })
  async generateFeed(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @Body() generateFeedDto: GenerateFeedRequestDto,
  ): Promise<FeedResponseDto> {
    const merchantId = req.user.merchantId;
    return this.productCatalogService.generateFeed(merchantId, catalogId, generateFeedDto);
  }

  @Get(':catalogId/feeds/:feedId/status')
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Get the status of a generated feed' })
  @ApiResponse({ status: 200, description: 'Feed status.', type: FeedStatusResponseDto })
  @ApiResponse({ status: 404, description: 'Feed not found.' })
  async getFeedStatus(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @Param('feedId', ParseUUIDPipe) feedId: string,
  ): Promise<FeedStatusResponseDto> {
    const merchantId = req.user.merchantId;
    return this.productCatalogService.getFeedStatus(merchantId, catalogId, feedId);
  }

  @Get(':catalogId/feeds/:feedId/download')
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Download a generated feed file' })
  // @Header('Content-Type', 'application/octet-stream') // Set dynamically by the logic
  @ApiResponse({ status: 200, description: 'Feed file stream.' })
  @ApiResponse({ status: 404, description: 'Feed not found or not ready.' })
  async downloadFeed(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @Param('feedId', ParseUUIDPipe) feedId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const merchantId = req.user.merchantId;
    const feedDetails = await this.productCatalogService.downloadFeedContent(merchantId, catalogId, feedId);

    if (!feedDetails) {
      throw new NotFoundException('Feed not found or not ready for download.');
    }

    res.setHeader('Content-Type', feedDetails.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${feedDetails.fileName}"`);

    return new StreamableFile(feedDetails.stream);
  }

  @Get(':catalogId/feeds')
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'List generated feeds for a catalog' })
  @ApiResponse({ status: 200, description: 'List of feeds.', type: PaginatedResponseDto<FeedSummaryDto> })
  @ApiResponse({ status: 404, description: 'Catalog not found.' })
  async listFeeds(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<FeedSummaryDto>> {
    const merchantId = req.user.merchantId;
    return this.productCatalogService.listFeeds(merchantId, catalogId, paginationDto);
  }

  @Post(':catalogId/feeds/validate')
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Validate a product catalog feed against ad network specifications' })
  @ApiResponse({ status: 200, description: 'Feed validation result.', type: FeedValidationResultResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Catalog or ad network specification not found.' })
  async validateFeed(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @Body() validateFeedDto: ValidateFeedRequestDto,
  ): Promise<FeedValidationResultResponseDto> {
    const merchantId = req.user.merchantId;
    return this.productCatalogService.validateFeed(merchantId, catalogId, validateFeedDto);
  }
}