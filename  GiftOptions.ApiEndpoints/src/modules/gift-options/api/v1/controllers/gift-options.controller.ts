import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Inject,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Express } from 'express'; // For Express.Multer.File type
import { GIFT_OPTIONS_API_V1_PREFIX, GIFT_OPTIONS_SERVICE_TOKEN } from '../gift-options-api.constants';
import { IGiftOptionsService } from '../interfaces/gift-options-service.interface';
import { UpdateGiftOptionSettingsDto } from '../dtos/request/update-gift-option-settings.dto';
import { UploadBrandedCardDesignDto } from '../dtos/request/upload-branded-card-design.dto';
import { UpdateBrandedCardDesignDto } from '../dtos/request/update-branded-card-design.dto';
import { GiftOptionSettingsDto } from '../dtos/response/gift-option-settings.dto';
import { BrandedCardDesignDto } from '../dtos/response/branded-card-design.dto';
import { GiftOptionAdvertisingDetailsDto } from '../dtos/response/gift-option-advertising-details.dto';

// Namespace: AdManager.GiftOptions.Api.V1.Controllers
@ApiTags('Gift Options')
@Controller(GIFT_OPTIONS_API_V1_PREFIX)
export class GiftOptionsController {
  constructor(
    @Inject(GIFT_OPTIONS_SERVICE_TOKEN)
    private readonly giftOptionsService: IGiftOptionsService,
  ) {}

  @Get('merchants/:merchantId/settings')
  @ApiOperation({ summary: 'Get gift option settings for a merchant' })
  @ApiResponse({ status: 200, description: 'Gift option settings retrieved.', type: GiftOptionSettingsDto })
  @ApiResponse({ status: 404, description: 'Merchant not found or settings not initialized.' })
  async getGiftOptionSettings(
    @Param('merchantId') merchantId: string,
  ): Promise<GiftOptionSettingsDto> {
    return this.giftOptionsService.getGiftOptionSettings(merchantId);
  }

  @Put('merchants/:merchantId/settings')
  @ApiOperation({ summary: 'Update gift option settings for a merchant' })
  @ApiResponse({ status: 200, description: 'Gift option settings updated.', type: GiftOptionSettingsDto })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async updateGiftOptionSettings(
    @Param('merchantId') merchantId: string,
    @Body() settingsDto: UpdateGiftOptionSettingsDto,
  ): Promise<GiftOptionSettingsDto> {
    return this.giftOptionsService.updateGiftOptionSettings(merchantId, settingsDto);
  }

  @Post('merchants/:merchantId/branded-cards')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a new branded card design' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        designName: { type: 'string' },
        isDefault: { type: 'boolean', nullable: true },
        'specifications.recommendedDimensions': { type: 'string', nullable: true },
        'specifications.supportedFileFormats': { type: 'array', items: { type: 'string' }, nullable: true },
        'specifications.maxFileSizeMB': { type: 'number', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Branded card design uploaded successfully.', type: BrandedCardDesignDto })
  @ApiResponse({ status: 400, description: 'Invalid input data or file upload error.' })
  async uploadBrandedCardDesign(
    @Param('merchantId') merchantId: string,
    @Body() designDto: UploadBrandedCardDesignDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BrandedCardDesignDto> {
    return this.giftOptionsService.uploadBrandedCardDesign(merchantId, designDto, file);
  }

  @Get('merchants/:merchantId/branded-cards')
  @ApiOperation({ summary: 'List all branded card designs for a merchant' })
  @ApiResponse({ status: 200, description: 'List of branded card designs.', type: [BrandedCardDesignDto] })
  async listBrandedCardDesigns(
    @Param('merchantId') merchantId: string,
  ): Promise<BrandedCardDesignDto[]> {
    return this.giftOptionsService.listBrandedCardDesigns(merchantId);
  }

  @Get('merchants/:merchantId/branded-cards/:designId')
  @ApiOperation({ summary: 'Get a specific branded card design' })
  @ApiResponse({ status: 200, description: 'Branded card design details.', type: BrandedCardDesignDto })
  @ApiResponse({ status: 404, description: 'Design not found.' })
  async getBrandedCardDesign(
    @Param('merchantId') merchantId: string,
    @Param('designId') designId: string,
  ): Promise<BrandedCardDesignDto> {
    return this.giftOptionsService.getBrandedCardDesign(merchantId, designId);
  }

  @Put('merchants/:merchantId/branded-cards/:designId')
  @ApiOperation({ summary: 'Update a branded card design' })
  @ApiResponse({ status: 200, description: 'Branded card design updated.', type: BrandedCardDesignDto })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Design not found.' })
  async updateBrandedCardDesign(
    @Param('merchantId') merchantId: string,
    @Param('designId') designId: string,
    @Body() updateDto: UpdateBrandedCardDesignDto,
  ): Promise<BrandedCardDesignDto> {
    return this.giftOptionsService.updateBrandedCardDesign(merchantId, designId, updateDto);
  }

  @Delete('merchants/:merchantId/branded-cards/:designId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a branded card design' })
  @ApiResponse({ status: 204, description: 'Branded card design deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Design not found.' })
  async deleteBrandedCardDesign(
    @Param('merchantId') merchantId: string,
    @Param('designId') designId: string,
  ): Promise<void> {
    return this.giftOptionsService.deleteBrandedCardDesign(merchantId, designId);
  }

  @Get('merchants/:merchantId/advertising-details')
  @ApiOperation({ summary: 'Get gift option details for advertising purposes' })
  @ApiResponse({ status: 200, description: 'Gift option advertising details retrieved.', type: GiftOptionAdvertisingDetailsDto })
  async getGiftOptionAdvertisingDetails(
    @Param('merchantId') merchantId: string,
  ): Promise<GiftOptionAdvertisingDetailsDto> {
    return this.giftOptionsService.getGiftOptionAdvertisingDetails(merchantId);
  }
}