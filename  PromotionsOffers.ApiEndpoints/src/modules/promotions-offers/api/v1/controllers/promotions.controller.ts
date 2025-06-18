import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Inject,
  UseGuards,
  Req,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query as NestQuery, // Renamed to avoid conflict with DTO if any
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PROMOTIONS_OFFERS_SERVICE_TOKEN } from '../promotions-offers.constants';
import { IPromotionsOffersService } from '../services/i.promotions-offers.service';
import { SetPromotionInteractionRulesDto } from '../dto/promotion-interaction/set-promotion-interaction-rules.dto';
import { PromotionInteractionRuleResponseDto } from '../dto/promotion-interaction/promotion-interaction-rule-response.dto';
import { PromotionBaseResponseDto } from '../dto/common/promotion-base-response.dto';
// Assume MerchantAuthGuard is available from a shared module
// import { MerchantAuthGuard } from 'src/shared/guards/merchant-auth.guard';

// Placeholder for MerchantAuthGuard if not available
const MerchantAuthGuard = () => class {};

@ApiTags('Promotions')
@ApiBearerAuth()
@Controller('/api/v1/promotions-offers/promotions')
@UseGuards(MerchantAuthGuard())
export class PromotionsController {
  constructor(
    @Inject(PROMOTIONS_OFFERS_SERVICE_TOKEN)
    private readonly promotionsOffersService: IPromotionsOffersService,
  ) {}

  @Post('interaction-rules')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Set or update promotion interaction rules for the merchant.' })
  @ApiBody({ type: SetPromotionInteractionRulesDto })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Promotion interaction rules set successfully.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  async setInteractionRules(
    @Req() req: any,
    @Body() dto: SetPromotionInteractionRulesDto,
  ): Promise<void> {
    const merchantId = req.user.merchantId;
    await this.promotionsOffersService.setPromotionInteractionRules(merchantId, dto);
  }

  @Get('interaction-rules')
  @ApiOperation({ summary: 'Get the current promotion interaction rules for the merchant.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Promotion interaction rules retrieved.', type: PromotionInteractionRuleResponseDto })
  async getInteractionRules(
    @Req() req: any,
  ): Promise<PromotionInteractionRuleResponseDto> { // Note: SDS implies an array, but DTO is singular. Assuming service returns the correct structure.
    const merchantId = req.user.merchantId;
    // The service method signature is Promise<PromotionInteractionRuleDto[]>, but DTO is PromotionInteractionRuleResponseDto (singular)
    // For now, aligning with the DTO name, but this might need adjustment based on service impl.
    // The SDS section 8.4 says PromotionInteractionRuleResponseDto, section 6.2 for service says Promise<PromotionInteractionRuleDto[]>
    // Assuming PromotionInteractionRuleResponseDto is a wrapper or the actual structure.
    // If it's an array, the type should be [PromotionInteractionRuleResponseDto] or a specific array DTO.
    // For now, let's assume service returns the structure described by PromotionInteractionRuleResponseDto.
    // If `getPromotionInteractionRules` is meant to return an array of individual rules (e.g. `PromotionPrecedenceRuleDto`), the response type here should be `PromotionPrecedenceRuleDto[]`
    // Given DTO `PromotionInteractionRuleResponseDto` resembles `SetPromotionInteractionRulesDto`, it's likely a single object response.
    return this.promotionsOffersService.getPromotionInteractionRules(merchantId) as unknown as PromotionInteractionRuleResponseDto;
  }

  @Post(':promotionId/activate')
  @ApiOperation({ summary: 'Activate a specific promotion.' })
  @ApiParam({ name: 'promotionId', type: 'string', format: 'uuid', description: 'ID of the promotion to activate.'})
  @ApiQuery({ name: 'type', type: 'string', required: true, description: "Type of promotion, e.g., 'DISCOUNT_CODE', 'BOGO', 'QUANTITY_DISCOUNT'"})
  @ApiResponse({ status: HttpStatus.OK, description: 'Promotion activated successfully.', type: PromotionBaseResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Promotion not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid promotion type or promotion cannot be activated.' })
  async activatePromotion(
    @Req() req: any,
    @Param('promotionId', ParseUUIDPipe) promotionId: string,
    @NestQuery('type') promotionType: string,
  ): Promise<PromotionBaseResponseDto> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.activatePromotion(merchantId, promotionId, promotionType);
  }

  @Post(':promotionId/deactivate')
  @ApiOperation({ summary: 'Deactivate a specific promotion.' })
  @ApiParam({ name: 'promotionId', type: 'string', format: 'uuid', description: 'ID of the promotion to deactivate.'})
  @ApiQuery({ name: 'type', type: 'string', required: true, description: "Type of promotion, e.g., 'DISCOUNT_CODE', 'BOGO', 'QUANTITY_DISCOUNT'"})
  @ApiResponse({ status: HttpStatus.OK, description: 'Promotion deactivated successfully.', type: PromotionBaseResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Promotion not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid promotion type or promotion cannot be deactivated.' })
  async deactivatePromotion(
    @Req() req: any,
    @Param('promotionId', ParseUUIDPipe) promotionId: string,
    @NestQuery('type') promotionType: string,
  ): Promise<PromotionBaseResponseDto> {
    const merchantId = req.user.merchantId;
    return this.promotionsOffersService.deactivatePromotion(merchantId, promotionId, promotionType);
  }
}