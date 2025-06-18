/**
 * @file promotion.enums.ts
 * @description Defines enumerations used throughout the Promotions & Offers API.
 * @namespace AdManager.PromotionsOffers.Api.V1.Constants
 */

export enum DiscountCodeType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export enum DiscountCodeUsageLimitType {
  SINGLE_USE_PER_CUSTOMER = 'SINGLE_USE_PER_CUSTOMER',
  SINGLE_USE_GLOBALLY = 'SINGLE_USE_GLOBALLY',
  MULTIPLE_USES = 'MULTIPLE_USES',
}

export enum BogoRewardType {
  SAME_AS_PURCHASED = 'SAME_AS_PURCHASED',
  SPECIFIC_DIFFERENT_ITEM = 'SPECIFIC_DIFFERENT_ITEM',
  ITEM_FROM_COLLECTION_EQUAL_OR_LESSER_VALUE = 'ITEM_FROM_COLLECTION_EQUAL_OR_LESSER_VALUE',
}

export enum QuantityDiscountScope {
  PER_ITEM = 'PER_ITEM',
  PER_PRODUCT_LINE = 'PER_PRODUCT_LINE',
  TOTAL_CART_ELIGIBLE_ITEMS = 'TOTAL_CART_ELIGIBLE_ITEMS',
}

export enum PromotionApplicationMethod {
  AUTOMATIC = 'AUTOMATIC',
  CUSTOMER_INPUT_CODE = 'CUSTOMER_INPUT_CODE',
  MERCHANT_ACTIVATION = 'MERCHANT_ACTIVATION',
}

export enum OfferEligibilityCustomerType {
  ALL_CUSTOMERS = 'ALL_CUSTOMERS',
  NEW_CUSTOMERS = 'NEW_CUSTOMERS',
  SPECIFIC_SEGMENTS = 'SPECIFIC_SEGMENTS',
}

export enum PromotionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED',
}

export enum BogoApplicationLogic {
  LOWEST_PRICE_ELIGIBLE = 'LOWEST_PRICE_ELIGIBLE',
  MERCHANT_OVERRIDE = 'MERCHANT_OVERRIDE',
}