import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Inject,
  HttpCode,
  HttpStatus,
  Req,
  ParseUUIDPipe,
  Put,
  // Logger, // Uncomment if logging is implemented as per SDS 7
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { IProductCatalogService } from '../interfaces/product-catalog-service.interface';
import { PRODUCT_CATALOG_SERVICE_TOKEN } from '../constants/product-catalog.constants';
import {
  CreateProductCatalogDto,
  UpdateProductCatalogDto,
  ProductCatalogResponseDto,
  CustomizeProductDto,
  ProductCatalogItemDto,
} from '../dtos/catalog'; // Assuming catalog DTOs are here directly, adjust path if they are in subfolder
import { ConflictResolutionStrategyDto, CatalogConflictResponseDto, ResolveConflictRequestDto } from '../dtos/sync'; // Adjust path if needed

import { PaginationDto } from '../dtos/common/pagination.dto';
import { PaginatedResponseDto } from '../dtos/common/api-response.dto';


@ApiBearerAuth()
@ApiTags('Product Catalog Management')
@Controller('v1/merchant/catalogs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductCatalogController {
  // @Inject(Logger) private readonly logger: LoggerService; // Uncomment if logging is implemented

  constructor(
    @Inject(PRODUCT_CATALOG_SERVICE_TOKEN)
    private readonly productCatalogService: IProductCatalogService,
  ) {}

  @Post()
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Create a new product catalog' })
  @ApiResponse({ status: 201, description: 'Catalog created successfully.', type: ProductCatalogResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  async create(@Req() req, @Body() createProductCatalogDto: CreateProductCatalogDto): Promise<ProductCatalogResponseDto> {
    const merchantId = req.user.merchantId;
    // this.logger.log(`User ${req.user.id} creating catalog: ${JSON.stringify(createProductCatalogDto)}`, ProductCatalogController.name);
    return this.productCatalogService.createCatalog(merchantId, createProductCatalogDto);
  }

  @Get()
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'List all product catalogs for the merchant' })
  @ApiResponse({ status: 200, description: 'List of catalogs.', type: PaginatedResponseDto<ProductCatalogResponseDto> })
  async findAll(@Req() req, @Query() paginationDto: PaginationDto): Promise<PaginatedResponseDto<ProductCatalogResponseDto>> {
    const merchantId = req.user.merchantId;
    return this.productCatalogService.findAllCatalogs(merchantId, paginationDto);
  }

  @Get(':catalogId')
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Get a specific product catalog' })
  @ApiResponse({ status: 200, description: 'Catalog details.', type: ProductCatalogResponseDto })
  @ApiResponse({ status: 404, description: 'Catalog not found.' })
  async findOne(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string): Promise<ProductCatalogResponseDto> {
    const merchantId = req.user.merchantId;
    return this.productCatalogService.findOneCatalog(merchantId, catalogId);
  }

  @Patch(':catalogId')
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Update a product catalog' })
  @ApiResponse({ status: 200, description: 'Catalog updated successfully.', type: ProductCatalogResponseDto })
  @ApiResponse({ status: 404, description: 'Catalog not found.' })
  async update(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @Body() updateProductCatalogDto: UpdateProductCatalogDto,
  ): Promise<ProductCatalogResponseDto> {
    const merchantId = req.user.merchantId;
    return this.productCatalogService.updateCatalog(merchantId, catalogId, updateProductCatalogDto);
  }

  @Delete(':catalogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Delete a product catalog' })
  @ApiResponse({ status: 204, description: 'Catalog deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Catalog not found.' })
  async remove(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string): Promise<void> {
    const merchantId = req.user.merchantId;
    await this.productCatalogService.removeCatalog(merchantId, catalogId);
  }

  @Post(':catalogId/products/:productId/customizations')
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Add or update ad-specific customization for a product in a catalog' })
  @ApiResponse({ status: 200, description: 'Product customization applied.', type: ProductCatalogItemDto })
  @ApiResponse({ status: 404, description: 'Catalog or Product not found.' })
  async addOrUpdateProductCustomization(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @Param('productId') productId: string, // Assuming productId format is not necessarily UUID, adjust if needed
    @Body() customizeProductDto: CustomizeProductDto,
  ): Promise<ProductCatalogItemDto> {
    const merchantId = req.user.merchantId;
    return this.productCatalogService.addProductCustomization(merchantId, catalogId, productId, customizeProductDto);
  }

  @Get(':catalogId/products/:productId/customizations')
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Get ad-specific customization for a product' })
  @ApiResponse({ status: 200, description: 'Product customization details.', type: ProductCatalogItemDto })
  @ApiResponse({ status: 404, description: 'Customization not found.' })
  async getProductCustomization(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @Param('productId') productId: string,
  ): Promise<ProductCatalogItemDto> {
    const merchantId = req.user.merchantId;
    return this.productCatalogService.getProductCustomization(merchantId, catalogId, productId);
  }

  @Delete(':catalogId/products/:productId/customizations')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Remove ad-specific customization for a product' })
  @ApiResponse({ status: 204, description: 'Product customization removed.' })
  @ApiResponse({ status: 404, description: 'Customization not found.' })
  async removeProductCustomization(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    const merchantId = req.user.merchantId;
    await this.productCatalogService.removeProductCustomization(merchantId, catalogId, productId);
  }

  @Put(':catalogId/conflict-resolution-strategy')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Set conflict resolution strategy for a catalog' })
  @ApiResponse({ status: 204, description: 'Strategy set successfully.' })
  @ApiResponse({ status: 404, description: 'Catalog not found.' })
  async setConflictResolutionStrategy(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @Body() strategyDto: ConflictResolutionStrategyDto,
  ): Promise<void> {
    const merchantId = req.user.merchantId;
    await this.productCatalogService.setConflictResolutionStrategy(merchantId, catalogId, strategyDto);
  }

  @Get(':catalogId/conflicts')
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'List data conflicts for a catalog' })
  @ApiResponse({ status: 200, description: 'List of conflicts.', type: PaginatedResponseDto<CatalogConflictResponseDto> })
  @ApiResponse({ status: 404, description: 'Catalog not found.' })
  async getCatalogConflicts(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<CatalogConflictResponseDto>> {
    const merchantId = req.user.merchantId;
    return this.productCatalogService.getCatalogConflicts(merchantId, catalogId, paginationDto);
  }

  @Post(':catalogId/conflicts/:conflictId/resolve')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Resolve a data conflict' })
  @ApiResponse({ status: 204, description: 'Conflict resolved.' })
  @ApiResponse({ status: 404, description: 'Catalog or Conflict not found.' })
  async resolveConflict(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @Param('conflictId', ParseUUIDPipe) conflictId: string,
    @Body() resolveConflictDto: ResolveConflictRequestDto,
  ): Promise<void> {
    const merchantId = req.user.merchantId;
    await this.productCatalogService.resolveConflict(merchantId, catalogId, conflictId, resolveConflictDto);
  }
}