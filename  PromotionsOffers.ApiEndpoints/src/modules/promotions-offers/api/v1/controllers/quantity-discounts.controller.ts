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
import { CreateQuantityDiscountDto } from '../dto/quantity-discount/create-quantity-discount.dto';
import { UpdateQuantityDiscountDto } from '../dto/quantity-discount/update-quantity-discount.dto';
import { QuantityDiscountResponseDto } from '../dto/quantity-discount/quantity-discount.response.dto';
import { PagedQueryDto } from '../dto/common/paged-query.dto';
import { PagedResponseDto } from '../dto/common/paged-response.dto';
// Assume MerchantAuthGuard is available from a shared module
// import { MerchantAuthGuard } from 'src/shared/guards/merchant-auth.guard';

// Placeholder for MerchantAuthGuard if not available
const MerchantAuthGuard = () => class {};

@ApiTags('Quantity Discounts')
@ApiBearerAuth()
@Controller('/api/v1/promotions-offers/quantity-discounts')
@UseGuards(MerchantAuthGuard())
export class QuantityDiscountsController {
  constructor(
    @Inject(PROMOTIONS_OFFERS_SERVICE_TOKEN)
    private readonly promotionsOffersService: IPromotionsOffersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quantity-based discount.' })
  @ApiBody({ type: CreateQuantityDiscountDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Quantity discount created successfully.', type: QuantityDiscountResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  async create(
    @Req() req: any,
    @Body() createDto: CreateQuantityDiscountDto,
  ): Promise<QuantityDiscountResponseDto> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.createQuantityDiscount(merchantId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quantity discounts for the authenticated merchant.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of quantity discounts retrieved.', type: PagedResponseDto<QuantityDiscountResponseDto>})
  async findAll(
    @Req() req: any,
    @Query() query: PagedQueryDto,
  ): Promise<PagedResponseDto<QuantityDiscountResponseDto>> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.getQuantityDiscounts(merchantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific quantity discount by ID.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Quantity discount details retrieved.', type: QuantityDiscountResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Quantity discount not found.' })
  async findOne(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<QuantityDiscountResponseDto> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.getQuantityDiscountById(merchantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing quantity discount.' })
  @ApiBody({ type: UpdateQuantityDiscountDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Quantity discount updated successfully.', type: QuantityDiscountResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Quantity discount not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  async update(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateQuantityDiscountDto,
  ): Promise<QuantityDiscountResponseDto> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.updateQuantityDiscount(merchantId, id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a quantity discount.' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Quantity discount deleted successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Quantity discount not found.' })
  async remove(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const merchantId = req.user.merchantId;
    await this.promotionsOffersService.deleteQuantityDiscount(merchantId, id);
  }
}