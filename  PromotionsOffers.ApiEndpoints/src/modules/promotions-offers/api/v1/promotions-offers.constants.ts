/**
 * @file promotions-offers.constants.ts
 * @description Defines constants for the Promotions & Offers module, primarily injection tokens for services and repositories.
 * @namespace AdManager.PromotionsOffers.Api.V1
 */

export const PROMOTIONS_OFFERS_SERVICE_TOKEN = Symbol('IPromotionsOffersService');
export const CORE_PLATFORM_SERVICE_TOKEN = Symbol('ICorePlatformService');

// Repository Injection Tokens (as per SDS Section 9: Service Design Dependencies)
export const DISCOUNT_CODE_REPOSITORY_TOKEN = Symbol('IDiscountCodeRepository');
export const BOGO_PROMOTION_REPOSITORY_TOKEN = Symbol('IBogoPromotionRepository');
export const QUANTITY_DISCOUNT_REPOSITORY_TOKEN = Symbol('IQuantityDiscountRepository');
export const PROMOTION_INTERACTION_RULE_REPOSITORY_TOKEN = Symbol('IPromotionInteractionRuleRepository');