import { CreateDiscountCodeDto } from '../dto/discount-code/create-discount-code.dto';
import { DiscountCodeResponseDto } from '../dto/discount-code/discount-code.response.dto';
import { PagedQueryDto } from '../dto/common/paged-query.dto';
import { PagedResponseDto } from '../dto/common/paged-response.dto';
import { UpdateDiscountCodeDto } from '../dto/discount-code/update-discount-code.dto';
import { BatchGenerateDiscountCodesDto } from '../dto/discount-code/batch-generate-discount-codes.dto';
import { CreateBogoPromotionDto } from '../dto/bogo-promotion/create-bogo-promotion.dto';
import { BogoPromotionResponseDto } from '../dto/bogo-promotion/bogo-promotion.response.dto';
import { UpdateBogoPromotionDto } from '../dto/bogo-promotion/update-bogo-promotion.dto';
import { CreateQuantityDiscountDto } from '../dto/quantity-discount/create-quantity-discount.dto';
import { QuantityDiscountResponseDto } from '../dto/quantity-discount/quantity-discount.response.dto';
import { UpdateQuantityDiscountDto } from '../dto/quantity-discount/update-quantity-discount.dto';
import { SetPromotionInteractionRulesDto } from '../dto/promotion-interaction/set-promotion-interaction-rules.dto';
import { PromotionInteractionRuleResponseDto } from '../dto/promotion-interaction/promotion-interaction-rule-response.dto';
import { PromotionBaseResponseDto } from '../dto/common/promotion-base-response.dto';

export interface IPromotionsOffersService {
  createDiscountCode(merchantId: string, dto: CreateDiscountCodeDto): Promise<DiscountCodeResponseDto>;
  getDiscountCodes(merchantId: string, query: PagedQueryDto): Promise<PagedResponseDto<DiscountCodeResponseDto>>;
  getDiscountCodeById(merchantId: string, id: string): Promise<DiscountCodeResponseDto>;
  updateDiscountCode(merchantId: string, id: string, dto: UpdateDiscountCodeDto): Promise<DiscountCodeResponseDto>;
  deleteDiscountCode(merchantId: string, id: string): Promise<void>;
  batchGenerateDiscountCodes(merchantId: string, dto: BatchGenerateDiscountCodesDto): Promise<DiscountCodeResponseDto[]>;

  createBogoPromotion(merchantId: string, dto: CreateBogoPromotionDto): Promise<BogoPromotionResponseDto>;
  getBogoPromotions(merchantId: string, query: PagedQueryDto): Promise<PagedResponseDto<BogoPromotionResponseDto>>;
  getBogoPromotionById(merchantId: string, id: string): Promise<BogoPromotionResponseDto>;
  updateBogoPromotion(merchantId: string, id: string, dto: UpdateBogoPromotionDto): Promise<BogoPromotionResponseDto>;
  deleteBogoPromotion(merchantId: string, id: string): Promise<void>;

  createQuantityDiscount(merchantId: string, dto: CreateQuantityDiscountDto): Promise<QuantityDiscountResponseDto>;
  getQuantityDiscounts(merchantId: string, query: PagedQueryDto): Promise<PagedResponseDto<QuantityDiscountResponseDto>>;
  getQuantityDiscountById(merchantId: string, id: string): Promise<QuantityDiscountResponseDto>;
  updateQuantityDiscount(merchantId: string, id: string, dto: UpdateQuantityDiscountDto): Promise<QuantityDiscountResponseDto>;
  deleteQuantityDiscount(merchantId: string, id: string): Promise<void>;

  setPromotionInteractionRules(merchantId: string, dto: SetPromotionInteractionRulesDto): Promise<void>;
  getPromotionInteractionRules(merchantId: string): Promise<PromotionInteractionRuleResponseDto[]>;

  activatePromotion(merchantId: string, promotionId: string, promotionType: string): Promise<PromotionBaseResponseDto>;
  deactivatePromotion(merchantId: string, promotionId: string, promotionType: string): Promise<PromotionBaseResponseDto>;
}