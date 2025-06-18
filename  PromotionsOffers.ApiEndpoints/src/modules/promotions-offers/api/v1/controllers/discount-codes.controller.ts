import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Put,
  Delete,
  Inject,
  UseGuards,
  Req,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { PROMOTIONS_OFFERS_SERVICE_TOKEN } from '../promotions-offers.constants';
import { IPromotionsOffersService } from '../services/i.promotions-offers.service';
import { CreateDiscountCodeDto } from '../dto/discount-code/create-discount-code.dto';
import { UpdateDiscountCodeDto } from '../dto/discount-code/update-discount-code.dto';
import { DiscountCodeResponseDto } from '../dto/discount-code/discount-code.response.dto';
import { BatchGenerateDiscountCodesDto } from '../dto/discount-code/batch-generate-discount-codes.dto';
import { PagedQueryDto } from '../dto/common/paged-query.dto';
import { PagedResponseDto } from '../dto/common/paged-response.dto';
// Assume MerchantAuthGuard is available from a shared module
// import { MerchantAuthGuard } from 'src/shared/guards/merchant-auth.guard';

// Placeholder for MerchantAuthGuard if not available
const MerchantAuthGuard = () => class {};

@ApiTags('Discount Codes')
@ApiBearerAuth() // Assuming JWT Bearer token authentication
@Controller('/api/v1/promotions-offers/discount-codes')
@UseGuards(MerchantAuthGuard()) // Apply guard at class level
export class DiscountCodesController {
  constructor(
    @Inject(PROMOTIONS_OFFERS_SERVICE_TOKEN)
    private readonly promotionsOffersService: IPromotionsOffersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new discount code or a single code from a pattern.' })
  @ApiBody({ type: CreateDiscountCodeDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Discount code created successfully.', type: DiscountCodeResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  async create(
    @Req() req: any, // Assuming req.user.merchantId is populated by MerchantAuthGuard
    @Body() createDiscountCodeDto: CreateDiscountCodeDto,
  ): Promise<DiscountCodeResponseDto> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.createDiscountCode(merchantId, createDiscountCodeDto);
  }

  @Post('batch-generate')
  @ApiOperation({ summary: 'Batch generate multiple discount codes.' })
  @ApiBody({ type: BatchGenerateDiscountCodesDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Discount codes batch generated successfully.', type: [DiscountCodeResponseDto] })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  async batchGenerate(
    @Req() req: any,
    @Body() batchDto: BatchGenerateDiscountCodesDto,
  ): Promise<DiscountCodeResponseDto[]> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.batchGenerateDiscountCodes(merchantId, batchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discount codes for the authenticated merchant, with pagination.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of discount codes retrieved.', type: PagedResponseDto<DiscountCodeResponseDto>})
  async findAll(
    @Req() req: any,
    @Query() query: PagedQueryDto,
  ): Promise<PagedResponseDto<DiscountCodeResponseDto>> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.getDiscountCodes(merchantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific discount code by its ID.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Discount code details retrieved.', type: DiscountCodeResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Discount code not found.' })
  async findOne(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DiscountCodeResponseDto> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.getDiscountCodeById(merchantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing discount code.' })
  @ApiBody({ type: UpdateDiscountCodeDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Discount code updated successfully.', type: DiscountCodeResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Discount code not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  async update(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDiscountCodeDto: UpdateDiscountCodeDto,
  ): Promise<DiscountCodeResponseDto> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.updateDiscountCode(merchantId, id, updateDiscountCodeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a discount code.' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Discount code deleted successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Discount code not found.' })
  async remove(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const merchantId = req.user.merchantId;
    await this.promotionsOffersService.deleteDiscountCode(merchantId, id);
  }
}