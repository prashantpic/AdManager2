import {
  Controller,
  Post,
  Body,
  UseGuards,
  Inject,
  Req,
  Get,
  Query,
  // Logger, // Uncomment if logging is implemented
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { IProductCatalogService } from '../interfaces/product-catalog-service.interface';
import { PRODUCT_CATALOG_SERVICE_TOKEN } from '../constants/product-catalog.constants';
import {
  TriggerSyncDto,
  SyncStatusResponseDto,
  SyncStatusRequestDto,
} from '../dtos/sync'; // Adjust path if DTOs are in subfolders

@ApiBearerAuth()
@ApiTags('Product Data Synchronization')
@Controller('v1/merchant/product-sync')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductSyncController {
  // @Inject(Logger) private readonly logger: LoggerService; // Uncomment if logging is implemented

  constructor(
    @Inject(PRODUCT_CATALOG_SERVICE_TOKEN)
    private readonly productCatalogService: IProductCatalogService,
  ) {}

  @Post('/trigger')
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Trigger synchronization with core [PlatformName] product data' })
  @ApiResponse({ status: 202, description: 'Synchronization process initiated.', type: SyncStatusResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async triggerCorePlatformSync(
    @Req() req,
    @Body() triggerSyncDto: TriggerSyncDto,
  ): Promise<SyncStatusResponseDto> {
    const merchantId = req.user.merchantId;
    return this.productCatalogService.triggerCorePlatformSync(merchantId, triggerSyncDto);
  }

  @Get('/status')
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Get status of core [PlatformName] product data synchronization' })
  @ApiResponse({ status: 200, description: 'Synchronization status.', type: SyncStatusResponseDto })
  @ApiResponse({ status: 404, description: 'Sync job not found (if syncJobId provided and not found).' })
  async getCorePlatformSyncStatus(
    @Req() req,
    @Query() syncStatusRequestDto: SyncStatusRequestDto,
  ): Promise<SyncStatusResponseDto> {
    const merchantId = req.user.merchantId;
    return this.productCatalogService.getCorePlatformSyncStatus(merchantId, syncStatusRequestDto);
  }
}