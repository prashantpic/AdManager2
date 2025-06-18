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
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Express } from 'express'; // For Multer.File typing

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ICampaignManagementService } from '../services/interfaces/campaign-management.service.interface';
import { IdParamDto } from '../common/dto/id-param.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PagedResponseDto } from '../common/dto/paged.response.dto';

import {
  UploadAdCreativeDto,
  UpdateAdCreativeDto,
  AdCreativeResponseDto,
} from '../dto/ad-creative';

// Example file filter as per SDS
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|mov|avi|wmv|html|zip)$/i)) { // Expanded for common image, video, html5
    return callback(new HttpException('Only image, video or HTML5 files are allowed!', HttpStatus.BAD_REQUEST), false);
  }
  if (file.mimetype.startsWith('text/') && !file.originalname.match(/\.(txt)$/i) ) { // Allow text for adCopy/headline
     // This filter is primarily for the file itself. Text DTO fields handle text parts.
     // No, 'text' type in CreativeType is for text-based ads, not for file uploads of .txt
  }
  callback(null, true);
};


@ApiBearerAuth()
@ApiTags('AdCreatives')
@UseGuards(JwtAuthGuard)
@Controller('creatives')
export class AdCreativeController {
  constructor(
    @Inject(ICampaignManagementService)
    private readonly campaignManagementService: ICampaignManagementService,
  ) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 25 * 1024 * 1024 }, // Example: 25MB limit
    fileFilter: imageFileFilter,
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a new ad creative (image, video, etc.)' })
  @ApiBody({
    description: 'Ad creative file and its metadata. For HTML5, upload a ZIP file.',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The ad creative file (image, video, zip for HTML5).',
        },
        name: { type: 'string', description: 'Name of the ad creative.' },
        type: { type: 'string', enum: ['IMAGE', 'VIDEO', 'TEXT', 'HTML5'], description: 'Type of the ad creative.' },
        adNetworkId: { type: 'string', format: 'uuid', description: 'Associated Ad Network ID.' },
        adCopy: { type: 'string', required: false, description: 'Ad copy text.' },
        headline: { type: 'string', required: false, description: 'Ad headline text.' },
      },
      required: ['file', 'name', 'type', 'adNetworkId'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ad creative uploaded successfully',
    type: AdCreativeResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data or file type/size issue' })
  async uploadCreative(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadAdCreativeDto: UploadAdCreativeDto,
    @Req() request: Request,
  ): Promise<AdCreativeResponseDto> {
    if (!file && uploadAdCreativeDto.type !== 'TEXT') { // TEXT creatives might not have a file
        throw new HttpException('File is required for non-TEXT creative types.', HttpStatus.BAD_REQUEST);
    }
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.uploadAdCreative(
      uploadAdCreativeDto,
      merchantId,
      file,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all ad creatives for the merchant' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number (starts from 1)' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Items per page (max 100)' })
  @ApiQuery({ name: 'sortBy', type: String, required: false, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', type: String, required: false, enum: ['ASC', 'DESC'], description: 'Sort order (ASC or DESC)'})
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of ad creatives retrieved successfully',
    type: PagedResponseDto, // Swagger may need help with generic type
  })
  async listCreatives(
    @Req() request: Request,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PagedResponseDto<AdCreativeResponseDto>> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.listAdCreatives(
      merchantId,
      paginationQuery,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an ad creative by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Ad Creative ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ad creative details retrieved successfully',
    type: AdCreativeResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ad creative not found' })
  async getCreativeById(
    @Param() params: IdParamDto,
    @Req() request: Request,
  ): Promise<AdCreativeResponseDto> {
    const merchantId = request.user.merchantId;
    return this.campaignManagementService.getAdCreativeById(params.id, merchantId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', { // Allow file update if needed, though SDS focuses on metadata
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: imageFileFilter,
  }))
  @ApiConsumes('multipart/form-data') // If file can be updated
  @ApiOperation({ summary: 'Update ad creative metadata (and optionally the file)' })
  @ApiParam({ name: 'id', type: String, description: 'Ad Creative ID (UUID)' })
  @ApiBody({
      description: 'Ad creative metadata to update. Optionally, a new file can be uploaded to replace the existing one.',
      schema: { // Define schema for multipart/form-data
          type: 'object',
          properties: {
              file: { type: 'string', format: 'binary', required: false, description: 'Optional: New ad creative file.' },
              name: { type: 'string', required: false },
              adCopy: { type: 'string', required: false },
              headline: { type: 'string', required: false },
              // type and adNetworkId are generally not updatable or handled differently.
          }
      },
      type: UpdateAdCreativeDto // Fallback for pure JSON, but ApiConsumes makes multipart primary
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ad creative updated successfully',
    type: AdCreativeResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ad creative not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async updateCreative(
    @Param() params: IdParamDto,
    @Body() updateAdCreativeDto: UpdateAdCreativeDto, // This will capture form fields
    @UploadedFile() file: Express.Multer.File, // Optional file
    @Req() request: Request,
  ): Promise<AdCreativeResponseDto> {
    const merchantId = request.user.merchantId;
    // The service method should handle the optional file parameter
    return this.campaignManagementService.updateAdCreative(
      params.id,
      updateAdCreativeDto,
      merchantId,
      file, // Pass the optional file to the service
    );
  }
}