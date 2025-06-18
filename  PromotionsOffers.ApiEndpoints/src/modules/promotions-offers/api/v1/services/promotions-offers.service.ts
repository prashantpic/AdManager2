import { Injectable, Inject, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { IPromotionsOffersService } from './i.promotions-offers.service';
import { CORE_PLATFORM_SERVICE_TOKEN } from '../promotions-offers.constants';
import { ICorePlatformService } from '../interfaces/i.core-platform.service';
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
import { PromotionStatus, PromotionApplicationMethod } from '../constants/promotion.enums';
import { OfferEligibilityDto } from '../dto/common/offer-eligibility.dto';

// Placeholder interfaces for repositories (actual implementation is external)
interface IDiscountCodeRepository {
  create(data: any): Promise<any>;
  find(query: any): Promise<any[]>;
  findById(id: string, merchantId: string): Promise<any | null>;
  update(id: string, merchantId: string, data: any): Promise<any>;
  delete(id: string, merchantId: string): Promise<boolean>;
  count(query: any): Promise<number>;
  createMany(data: any[]): Promise<any[]>; // For batch
  // Add other necessary methods
}

interface IBogoPromotionRepository {
  create(data: any): Promise<any>;
  find(query: any): Promise<any[]>;
  findById(id: string, merchantId: string): Promise<any | null>;
  update(id: string, merchantId: string, data: any): Promise<any>;
  delete(id: string, merchantId: string): Promise<boolean>;
  count(query: any): Promise<number>;
  // Add other necessary methods
}

interface IQuantityDiscountRepository {
  create(data: any): Promise<any>;
  find(query: any): Promise<any[]>;
  findById(id: string, merchantId: string): Promise<any | null>;
  update(id: string, merchantId: string, data: any): Promise<any>;
  delete(id: string, merchantId: string): Promise<boolean>;
  count(query: any): Promise<number>;
  // Add other necessary methods
}

interface IPromotionInteractionRuleRepository {
  findByMerchantId(merchantId: string): Promise<any | null>;
  upsert(merchantId: string, data: any): Promise<any>;
  // Add other necessary methods
}


@Injectable()
export class PromotionsOffersService implements IPromotionsOffersService {
  constructor(
    @Inject(CORE_PLATFORM_SERVICE_TOKEN)
    private readonly corePlatformService: ICorePlatformService,
    @Inject('IDiscountCodeRepository') // Placeholder, actual token might differ
    private readonly discountCodeRepository: IDiscountCodeRepository,
    @Inject('IBogoPromotionRepository') // Placeholder
    private readonly bogoPromotionRepository: IBogoPromotionRepository,
    @Inject('IQuantityDiscountRepository') // Placeholder
    private readonly quantityDiscountRepository: IQuantityDiscountRepository,
    @Inject('IPromotionInteractionRuleRepository') // Placeholder
    private readonly promotionInteractionRuleRepository: IPromotionInteractionRuleRepository,
  ) {}

  // --- Discount Code Methods ---

  async createDiscountCode(merchantId: string, dto: CreateDiscountCodeDto): Promise<DiscountCodeResponseDto> {
    // Validate DTO specifics (e.g., codePattern vs codes)
    if (dto.codePattern && dto.codes && dto.codes.length > 0) {
      throw new BadRequestException('Either codePattern or codes should be provided, not both for single creation.');
    }
    if (!dto.codePattern && (!dto.codes || dto.codes.length === 0)) {
       // This validation might be too strict if codes are auto-generated based on other params not present in CreateDiscountCodeDto but in BatchGenerate
       // For single creation, if neither is provided, how is the code determined? Assume one must be.
       // For now, let's assume it's valid if codes are provided or a pattern is provided for generation.
       // If the service is expected to generate a single code without pattern/codes input, this logic needs adjustment.
    }

    // Placeholder: Code generation/validation logic if codePattern is used
    // Placeholder: Uniqueness check for codes if isUniquePerMerchant
    // Placeholder: Call to corePlatformService.verifyCustomerEligibility if needed during creation (unlikely, typically at application time)

    const promotionEntity = {
      ...dto,
      merchantId,
      id: crypto.randomUUID(), // Simulate ID generation
      timesUsed: 0, // Default
      // Assume mapping DTO to an entity structure
      code: dto.codes && dto.codes.length > 0 ? dto.codes[0] : (dto.codePattern ? `GENERATED_${dto.codePattern.substring(0,5)}` : `CODE_${crypto.randomUUID().substring(0,8)}`), // Simplified code determination
    };
    
    const created = await this.discountCodeRepository.create(promotionEntity);
    return this.mapDiscountCodeToResponseDto(created);
  }

  async getDiscountCodes(merchantId: string, query: PagedQueryDto): Promise<PagedResponseDto<DiscountCodeResponseDto>> {
    const { page = 1, limit = 10, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;
    
    // Placeholder: repository query options
    const repoQuery = { where: { merchantId }, skip, take: limit, orderBy: sortBy ? { [sortBy]: sortOrder || 'ASC' } : undefined };
    
    const [items, total] = await Promise.all([
        this.discountCodeRepository.find(repoQuery),
        this.discountCodeRepository.count({ where: { merchantId } })
    ]);

    return {
      data: items.map(item => this.mapDiscountCodeToResponseDto(item)),
      total,
      page,
      limit,
    };
  }

  async getDiscountCodeById(merchantId: string, id: string): Promise<DiscountCodeResponseDto> {
    const item = await this.discountCodeRepository.findById(id, merchantId);
    if (!item) {
      throw new NotFoundException(`Discount code with ID ${id} not found.`);
    }
    return this.mapDiscountCodeToResponseDto(item);
  }

  async updateDiscountCode(merchantId: string, id: string, dto: UpdateDiscountCodeDto): Promise<DiscountCodeResponseDto> {
    const existing = await this.discountCodeRepository.findById(id, merchantId);
    if (!existing) {
      throw new NotFoundException(`Discount code with ID ${id} not found to update.`);
    }
    // Placeholder: Merge DTO with existing entity and save
    const updatedEntity = { ...existing, ...dto };
    const updated = await this.discountCodeRepository.update(id, merchantId, updatedEntity);
    return this.mapDiscountCodeToResponseDto(updated);
  }

  async deleteDiscountCode(merchantId: string, id: string): Promise<void> {
    const deleted = await this.discountCodeRepository.delete(id, merchantId);
    if (!deleted) {
      throw new NotFoundException(`Discount code with ID ${id} not found or could not be deleted.`);
    }
  }

  async batchGenerateDiscountCodes(merchantId: string, dto: BatchGenerateDiscountCodesDto): Promise<DiscountCodeResponseDto[]> {
    const generatedCodes: any[] = [];
    for (let i = 0; i < dto.quantity; i++) {
      // Simplified code generation logic
      const codeValue = 
        (dto.codePrefix || '') + 
        this.generateRandomString(dto.codeLength || 8, dto.characterSet) + 
        (dto.codeSuffix || '');

      // Placeholder: Ensure uniqueness within batch and against existing merchant codes
      // This would require a more robust generation and checking mechanism in a real scenario

      const discountCodeEntity = {
        // Spread common properties from BatchGenerateDiscountCodesDto (which extends Omit<CreateDiscountCodeDto, ...>)
        ... (({ batchName, batchDescription, quantity, codePrefix, codeSuffix, codeLength, characterSet, ...commonProps }) => commonProps)(dto),
        merchantId,
        id: crypto.randomUUID(),
        code: codeValue,
        name: dto.batchName || `Batch Code ${i + 1}`, // Individual name could be derived or use batch name
        description: dto.batchDescription,
        status: dto.status || PromotionStatus.DRAFT, // Default status if not provided
        timesUsed: 0,
        isUniquePerMerchant: dto.isUniquePerMerchant !== undefined ? dto.isUniquePerMerchant : true,
      };
      generatedCodes.push(discountCodeEntity);
    }

    // Placeholder: Optimize with bulk insertion
    const createdCodes = await this.discountCodeRepository.createMany(generatedCodes);
    return createdCodes.map(code => this.mapDiscountCodeToResponseDto(code));
  }

  // --- BOGO Promotion Methods ---

  async createBogoPromotion(merchantId: string, dto: CreateBogoPromotionDto): Promise<BogoPromotionResponseDto> {
    const promotionEntity = { ...dto, merchantId, id: crypto.randomUUID() };
    const created = await this.bogoPromotionRepository.create(promotionEntity);
    return this.mapBogoPromotionToResponseDto(created);
  }

  async getBogoPromotions(merchantId: string, query: PagedQueryDto): Promise<PagedResponseDto<BogoPromotionResponseDto>> {
    const { page = 1, limit = 10, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;
    const repoQuery = { where: { merchantId }, skip, take: limit, orderBy: sortBy ? { [sortBy]: sortOrder || 'ASC' } : undefined };
    
    const [items, total] = await Promise.all([
        this.bogoPromotionRepository.find(repoQuery),
        this.bogoPromotionRepository.count({ where: { merchantId } })
    ]);
    
    return {
      data: items.map(item => this.mapBogoPromotionToResponseDto(item)),
      total,
      page,
      limit,
    };
  }

  async getBogoPromotionById(merchantId: string, id: string): Promise<BogoPromotionResponseDto> {
    const item = await this.bogoPromotionRepository.findById(id, merchantId);
    if (!item) {
      throw new NotFoundException(`BOGO promotion with ID ${id} not found.`);
    }
    return this.mapBogoPromotionToResponseDto(item);
  }

  async updateBogoPromotion(merchantId: string, id: string, dto: UpdateBogoPromotionDto): Promise<BogoPromotionResponseDto> {
    const existing = await this.bogoPromotionRepository.findById(id, merchantId);
    if (!existing) {
      throw new NotFoundException(`BOGO promotion with ID ${id} not found to update.`);
    }
    const updatedEntity = { ...existing, ...dto };
    const updated = await this.bogoPromotionRepository.update(id, merchantId, updatedEntity);
    return this.mapBogoPromotionToResponseDto(updated);
  }

  async deleteBogoPromotion(merchantId: string, id: string): Promise<void> {
    const deleted = await this.bogoPromotionRepository.delete(id, merchantId);
    if (!deleted) {
      throw new NotFoundException(`BOGO promotion with ID ${id} not found or could not be deleted.`);
    }
  }

  // --- Quantity Discount Methods ---

  async createQuantityDiscount(merchantId: string, dto: CreateQuantityDiscountDto): Promise<QuantityDiscountResponseDto> {
    // Validate tiers (e.g., sorted by minimumQuantity, no overlaps)
    this.validateQuantityDiscountTiers(dto.tiers);
    
    const promotionEntity = { ...dto, merchantId, id: crypto.randomUUID() };
    const created = await this.quantityDiscountRepository.create(promotionEntity);
    return this.mapQuantityDiscountToResponseDto(created);
  }

  async getQuantityDiscounts(merchantId: string, query: PagedQueryDto): Promise<PagedResponseDto<QuantityDiscountResponseDto>> {
    const { page = 1, limit = 10, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;
    const repoQuery = { where: { merchantId }, skip, take: limit, orderBy: sortBy ? { [sortBy]: sortOrder || 'ASC' } : undefined };

    const [items, total] = await Promise.all([
        this.quantityDiscountRepository.find(repoQuery),
        this.quantityDiscountRepository.count({ where: { merchantId } })
    ]);

    return {
      data: items.map(item => this.mapQuantityDiscountToResponseDto(item)),
      total,
      page,
      limit,
    };
  }

  async getQuantityDiscountById(merchantId: string, id: string): Promise<QuantityDiscountResponseDto> {
    const item = await this.quantityDiscountRepository.findById(id, merchantId);
    if (!item) {
      throw new NotFoundException(`Quantity discount with ID ${id} not found.`);
    }
    return this.mapQuantityDiscountToResponseDto(item);
  }

  async updateQuantityDiscount(merchantId: string, id: string, dto: UpdateQuantityDiscountDto): Promise<QuantityDiscountResponseDto> {
    const existing = await this.quantityDiscountRepository.findById(id, merchantId);
    if (!existing) {
      throw new NotFoundException(`Quantity discount with ID ${id} not found to update.`);
    }
    if (dto.tiers) {
        this.validateQuantityDiscountTiers(dto.tiers);
    }
    const updatedEntity = { ...existing, ...dto };
    const updated = await this.quantityDiscountRepository.update(id, merchantId, updatedEntity);
    return this.mapQuantityDiscountToResponseDto(updated);
  }

  async deleteQuantityDiscount(merchantId: string, id: string): Promise<void> {
    const deleted = await this.quantityDiscountRepository.delete(id, merchantId);
    if (!deleted) {
        throw new NotFoundException(`Quantity discount with ID ${id} not found or could not be deleted.`);
    }
  }

  // --- Promotion Interaction Rules ---

  async setPromotionInteractionRules(merchantId: string, dto: SetPromotionInteractionRulesDto): Promise<void> {
    // Validate DTO
    await this.promotionInteractionRuleRepository.upsert(merchantId, { merchantId, ...dto });
  }

  async getPromotionInteractionRules(merchantId: string): Promise<PromotionInteractionRuleResponseDto> { // SDS implies complex object, not array here for response
    const rules = await this.promotionInteractionRuleRepository.findByMerchantId(merchantId);
    if (!rules) {
      // Return default or empty structure if no rules are set
      return {
        defaultStackingBehavior: 'NONE', // Default as per DTO
        explicitlyStackableCombinations: [],
        precedenceRules: [],
      };
    }
    // Assume rules object from repo matches PromotionInteractionRuleResponseDto structure
    return rules as PromotionInteractionRuleResponseDto;
  }

  // --- Promotion Activation/Deactivation ---

  async activatePromotion(merchantId: string, promotionId: string, promotionType: string): Promise<PromotionBaseResponseDto> {
    const promotion = await this.findPromotion(merchantId, promotionId, promotionType);
    if (promotion.applicationMethod === PromotionApplicationMethod.CUSTOMER_INPUT_CODE && promotion.status === PromotionStatus.DRAFT) {
        // Allow activating DRAFT code-based promotions
    } else if (promotion.applicationMethod !== PromotionApplicationMethod.MERCHANT_ACTIVATION && promotion.applicationMethod !== PromotionApplicationMethod.CUSTOMER_INPUT_CODE) {
      throw new BadRequestException(`Promotion with ID ${promotionId} cannot be manually activated due to its application method.`);
    }
    if (promotion.status === PromotionStatus.ACTIVE) {
        return this.mapPromotionToBaseResponseDto(promotion); // Already active
    }
    if (promotion.status === PromotionStatus.EXPIRED) {
        throw new BadRequestException(`Expired promotion with ID ${promotionId} cannot be activated.`);
    }
    
    promotion.status = PromotionStatus.ACTIVE;
    const updatedPromotion = await this.updatePromotionStatus(merchantId, promotionId, promotionType, PromotionStatus.ACTIVE, promotion);
    return this.mapPromotionToBaseResponseDto(updatedPromotion);
  }

  async deactivatePromotion(merchantId: string, promotionId: string, promotionType: string): Promise<PromotionBaseResponseDto> {
    const promotion = await this.findPromotion(merchantId, promotionId, promotionType);
     if (promotion.applicationMethod !== PromotionApplicationMethod.MERCHANT_ACTIVATION && promotion.applicationMethod !== PromotionApplicationMethod.CUSTOMER_INPUT_CODE) {
      throw new BadRequestException(`Promotion with ID ${promotionId} cannot be manually deactivated due to its application method.`);
    }
    if (promotion.status === PromotionStatus.INACTIVE || promotion.status === PromotionStatus.DRAFT) {
        return this.mapPromotionToBaseResponseDto(promotion); // Already inactive or draft
    }
     if (promotion.status === PromotionStatus.EXPIRED) {
        throw new BadRequestException(`Expired promotion with ID ${promotionId} cannot be deactivated.`);
    }

    promotion.status = PromotionStatus.INACTIVE;
    const updatedPromotion = await this.updatePromotionStatus(merchantId, promotionId, promotionType, PromotionStatus.INACTIVE, promotion);
    return this.mapPromotionToBaseResponseDto(updatedPromotion);
  }


  // --- Helper Methods ---
  private async findPromotion(merchantId: string, promotionId: string, promotionType: string): Promise<any> {
    let promotion: any;
    switch (promotionType.toUpperCase()) {
      case 'DISCOUNT_CODE':
        promotion = await this.discountCodeRepository.findById(promotionId, merchantId);
        break;
      case 'BOGO':
        promotion = await this.bogoPromotionRepository.findById(promotionId, merchantId);
        break;
      case 'QUANTITY_DISCOUNT':
        promotion = await this.quantityDiscountRepository.findById(promotionId, merchantId);
        break;
      default:
        throw new BadRequestException(`Invalid promotion type: ${promotionType}`);
    }
    if (!promotion) {
      throw new NotFoundException(`${promotionType} promotion with ID ${promotionId} not found.`);
    }
    return promotion;
  }

  private async updatePromotionStatus(merchantId: string, promotionId: string, promotionType: string, status: PromotionStatus, promotionData: any): Promise<any> {
    promotionData.status = status;
    switch (promotionType.toUpperCase()) {
      case 'DISCOUNT_CODE':
        return this.discountCodeRepository.update(promotionId, merchantId, promotionData);
      case 'BOGO':
        return this.bogoPromotionRepository.update(promotionId, merchantId, promotionData);
      case 'QUANTITY_DISCOUNT':
        return this.quantityDiscountRepository.update(promotionId, merchantId, promotionData);
      default:
        throw new BadRequestException(`Invalid promotion type for status update: ${promotionType}`);
    }
  }

  private mapDiscountCodeToResponseDto(entity: any): DiscountCodeResponseDto {
    // Placeholder: Actual mapping depends on entity structure
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      validity: entity.validity,
      eligibility: entity.eligibility,
      applicationMethod: entity.applicationMethod,
      interactionRules: entity.interactionRules,
      code: entity.code,
      timesUsed: entity.timesUsed || 0,
      isUniquePerMerchant: entity.isUniquePerMerchant,
      discountType: entity.discountType,
      discountValue: entity.discountValue,
      minimumPurchaseAmount: entity.minimumPurchaseAmount,
      usageLimitType: entity.usageLimitType,
      maxUsagePerCode: entity.maxUsagePerCode,
      maxUsagePerCustomer: entity.maxUsagePerCustomer,
    };
  }
  
  private mapBogoPromotionToResponseDto(entity: any): BogoPromotionResponseDto {
     return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      validity: entity.validity,
      eligibility: entity.eligibility,
      applicationMethod: entity.applicationMethod,
      interactionRules: entity.interactionRules,
      buyCondition: entity.buyCondition,
      getReward: entity.getReward,
      applicationLogic: entity.applicationLogic,
    };
  }

  private mapQuantityDiscountToResponseDto(entity: any): QuantityDiscountResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      validity: entity.validity,
      eligibility: entity.eligibility,
      applicationMethod: entity.applicationMethod,
      interactionRules: entity.interactionRules,
      scope: entity.scope,
      tiers: entity.tiers,
      eligibleProductIds: entity.eligibleProductIds,
      eligibleCollectionIds: entity.eligibleCollectionIds,
    };
  }

  private mapPromotionToBaseResponseDto(entity: any): PromotionBaseResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      validity: entity.validity,
      eligibility: entity.eligibility,
      applicationMethod: entity.applicationMethod,
      interactionRules: entity.interactionRules,
    };
  }

  private generateRandomString(length: number, characters?: string): string {
    const charSet = characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charSetLength = charSet.length;
    for (let i = 0; i < length; i++) {
      result += charSet.charAt(Math.floor(Math.random() * charSetLength));
    }
    return result;
  }

  private validateQuantityDiscountTiers(tiers: any[]): void {
    if (!tiers || tiers.length === 0) {
      throw new BadRequestException('Quantity discount must have at least one tier.');
    }
    const sortedTiers = [...tiers].sort((a, b) => a.minimumQuantity - b.minimumQuantity);
    for (let i = 0; i < sortedTiers.length; i++) {
      if (i > 0 && sortedTiers[i].minimumQuantity <= sortedTiers[i-1].minimumQuantity) {
        throw new BadRequestException('Tier minimum quantities must be strictly increasing and unique.');
      }
      // Add more tier validation if needed (e.g., discountValue range)
    }
  }

  // REQ-PROMO-005, REQ-CPSI-004: Eligibility check.
  // This is typically called at application time by another service.
  // If it needs to be callable directly for some admin purpose, it could be exposed.
  async checkCustomerEligibility(merchantId: string, customerId: string, eligibility: OfferEligibilityDto): Promise<boolean> {
    if (!eligibility) return true; // No specific eligibility means eligible
    return this.corePlatformService.verifyCustomerEligibility(merchantId, customerId, eligibility);
  }
}