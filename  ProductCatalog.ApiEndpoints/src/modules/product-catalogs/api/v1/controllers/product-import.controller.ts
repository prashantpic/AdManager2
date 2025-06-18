import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Inject,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  BadRequestException,
  Get,
  ParseUUIDPipe,
  // Logger, // Uncomment if logging is implemented
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { IProductCatalogService } from '../interfaces/product-catalog-service.interface';
import { PRODUCT_CATALOG_SERVICE_TOKEN } from '../constants/product-catalog.constants';
import {
  BulkImportRequestDto,
  BulkImportStatusResponseDto,
  ExternalCustomizationImportDto,
} from '../dtos/import'; // Adjust path if DTOs are in subfolders
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; // For Multer.File type

@ApiBearerAuth()
@ApiTags('Product Catalog Imports')
@Controller('v1/merchant/catalogs') // Base path shared
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductImportController {
  // @Inject(Logger) private readonly logger: LoggerService; // Uncomment if logging is implemented

  constructor(
    @Inject(PRODUCT_CATALOG_SERVICE_TOKEN)
    private readonly productCatalogService: IProductCatalogService,
  ) {}

  @Post(':catalogId/products/import/bulk') // Path as per SDS 4.4.4
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Bulk import products into a catalog from CSV or XML' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'The CSV or XML file to import.' },
        fileFormat: { type: 'string', enum: ['CSV', 'XML'], description: 'Format of the uploaded file.' },
        conflictResolutionMode: {
          type: 'string',
          enum: ['Overwrite', 'Skip', 'Merge'],
          description: 'Strategy for handling conflicts with existing products.',
          required: false,
        },
      },
      required: ['file', 'fileFormat'],
    },
  })
  @ApiResponse({ status: 202, description: 'Bulk import process initiated.', type: BulkImportStatusResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input or file missing.' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity (e.g., file type or size validation failed).' })
  async bulkImportProducts(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /^(text\/csv|application\/xml|text\/xml)$/i })
        .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 /* 10MB */ })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() bulkImportDto: BulkImportRequestDto,
  ): Promise<BulkImportStatusResponseDto> {
    const merchantId = req.user.merchantId;
    if (!file) {
      throw new BadRequestException('File is required.');
    }
    return this.productCatalogService.bulkImportProducts(
      merchantId,
      catalogId,
      file.buffer,
      file.originalname,
      bulkImportDto,
    );
  }

  @Get(':catalogId/products/import/:importId/status') // Path as per SDS 4.4.4
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Get the status of a bulk import job' })
  @ApiResponse({ status: 200, description: 'Import job status.', type: BulkImportStatusResponseDto })
  @ApiResponse({ status: 404, description: 'Import job not found.' })
  async getImportStatus(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @Param('importId', ParseUUIDPipe) importId: string,
  ): Promise<BulkImportStatusResponseDto> {
    const merchantId = req.user.merchantId;
    return this.productCatalogService.getImportStatus(merchantId, catalogId, importId);
  }

  @Post(':catalogId/products/customizations/import/external') // Path as per SDS 4.4.4
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Import external product catalog customizations' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'The file containing customizations (e.g., CSV).' },
        sourceSystem: { type: 'string', description: 'Identifier for the source system of these customizations.', required: false },
        mappingConfigurationId: {
          type: 'string',
          format: 'uuid',
          description: 'ID of a pre-defined mapping configuration to use for this import.',
          required: false,
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 202, description: 'External customization import initiated.', type: BulkImportStatusResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input or file missing.' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity (e.g., file type or size validation failed).' })
  async importExternalCustomizations(
    @Req() req,
    @Param('catalogId', ParseUUIDPipe) catalogId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'text/csv' /* Or other formats as per requirements */ })
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 /* 5MB */ })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() importDto: ExternalCustomizationImportDto,
  ): Promise<BulkImportStatusResponseDto> {
    const merchantId = req.user.merchantId;
    if (!file) {
      throw new BadRequestException('File is required.');
    }
    return this.productCatalogService.importExternalCustomizations(
      merchantId,
      catalogId,
      file.buffer,
      file.originalname,
      importDto,
    );
  }
}