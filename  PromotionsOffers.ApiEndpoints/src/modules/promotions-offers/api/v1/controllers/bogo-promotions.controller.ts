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
import { CreateBogoPromotionDto } from '../dto/bogo-promotion/create-bogo-promotion.dto';
import { UpdateBogoPromotionDto } from '../dto/bogo-promotion/update-bogo-promotion.dto';
import { BogoPromotionResponseDto } from '../dto/bogo-promotion/bogo-promotion.response.dto';
import { PagedQueryDto } from '../dto/common/paged-query.dto';
import { PagedResponseDto } from '../dto/common/paged-response.dto';
// Assume MerchantAuthGuard is available from a shared module
// import { MerchantAuthGuard } from 'src/shared/guards/merchant-auth.guard';

// Placeholder for MerchantAuthGuard if not available
const MerchantAuthGuard = () => class {};

@ApiTags('BOGO Promotions')
@ApiBearerAuth()
@Controller('/api/v1/promotions-offers/bogo-promotions')
@UseGuards(MerchantAuthGuard())
export class BogoPromotionsController {
  constructor(
    @Inject(PROMOTIONS_OFFERS_SERVICE_TOKEN)
    private readonly promotionsOffersService: IPromotionsOffersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new BOGO promotion.' })
  @ApiBody({ type: CreateBogoPromotionDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'BOGO promotion created successfully.', type: BogoPromotionResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  async create(
    @Req() req: any,
    @Body() createBogoDto: CreateBogoPromotionDto,
  ): Promise<BogoPromotionResponseDto> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.createBogoPromotion(merchantId, createBogoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all BOGO promotions for the authenticated merchant.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of BOGO promotions retrieved.', type: PagedResponseDto<BogoPromotionResponseDto>})
  async findAll(
    @Req() req: any,
    @Query() query: PagedQueryDto,
  ): Promise<PagedResponseDto<BogoPromotionResponseDto>> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.getBogoPromotions(merchantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific BOGO promotion by ID.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'BOGO promotion details retrieved.', type: BogoPromotionResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'BOGO promotion not found.' })
  async findOne(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BogoPromotionResponseDto> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.getBogoPromotionById(merchantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing BOGO promotion.' })
  @ApiBody({ type: UpdateBogoPromotionDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'BOGO promotion updated successfully.', type: BogoPromotionResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'BOGO promotion not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  async update(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBogoDto: UpdateBogoPromotionDto,
  ): Promise<BogoPromotionResponseDto> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.updateBogoPromotion(merchantId, id, updateBogoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a BOGO promotion.' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'BOGO promotion deleted successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'BOGO promotion not found.' })
  async remove(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const merchantId = req.user.merchantId;
    await this.promotionsOffersService.deleteBogoPromotion(merchantId, id);
  }
}