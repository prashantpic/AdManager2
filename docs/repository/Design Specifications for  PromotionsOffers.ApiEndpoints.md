# Software Design Specification: Promotions & Offers API Endpoints

## 1. Introduction

### 1.1 Purpose
This document provides a detailed software design specification for the `PromotionsOffers.ApiEndpoints` repository. This repository is responsible for exposing RESTful API endpoints for creating and managing various promotional offers within the Ad Manager Platform. These offers include discount codes, Buy One Get One Free (BOGO) deals, and quantity-based discounts. The API supports defining offer rules, validity periods, eligibility criteria, and interaction logic between different promotions.

### 1.2 Scope
The scope of this document is limited to the `PromotionsOffers.ApiEndpoints` repository. It covers the design of its API controllers, Data Transfer Objects (DTOs), service interfaces, module definition, and related constants and enumerations. It details how this repository interacts with other services, particularly for customer eligibility verification, and how it adheres to the overall system architecture.

### 1.3 Overview of the Promotions & Offers API
The Promotions & Offers API provides a set of HTTP endpoints for merchants to configure and manage various types of promotional incentives for their advertising campaigns and e-commerce operations. It allows for granular control over promotion parameters, ensuring flexibility for different marketing strategies. The API is designed to be consumed primarily by the Merchant Ad Manager Portal.

## 2. System Overview

### 2.1 Architecture
The `PromotionsOffers.ApiEndpoints` repository is a component within a larger microservices architecture. It acts as an API layer, handling incoming HTTP requests, validating them, and delegating business logic processing to an underlying application service (`PromotionsOffersService`). It leverages the NestJS framework for building efficient and scalable server-side applications.

### 2.2 Technology Stack
*   **Language:** TypeScript 5.4.5
*   **Framework:** NestJS 10.3.9
*   **Runtime:** Node.js 20.15.0 (LTS)
*   **API Style:** RESTful
*   **Data Format:** JSON
*   **Authentication:** JWT (JSON Web Tokens), handled by `MerchantAuthGuard`
*   **API Gateway:** Amazon API Gateway (as the entry point to this microservice)
*   **Third-party Libraries:**
    *   `class-validator`: For DTO validation.
    *   `class-transformer`: For transforming plain objects to class instances and vice-versa.
    *   `@nestjs/swagger`: For OpenAPI (Swagger) documentation generation.
    *   `reflect-metadata`
    *   `rxjs`

### 2.3 Key Features
*   Management of Discount Codes (CRUD, batch generation) (REQ-PROMO-001, REQ-PROMO-002)
*   Management of Buy One, Get One Free (BOGO) Promotions (CRUD, custom application logic) (REQ-PROMO-003, REQ-PROMO-004)
*   Management of Quantity-Based Discounts (CRUD, tiered structures) (REQ-PROMO-008)
*   Configuration of general promotion properties:
    *   Validity periods (start/end dates) (REQ-PROMO-005)
    *   Customer eligibility criteria (e.g., new customers, segments), with verification via Core Platform (REQ-PROMO-005, REQ-CPSI-004)
    *   Promotion application methods (automatic, code, merchant activation) (REQ-PROMO-007)
*   Management of promotion interaction rules (stacking, exclusion, precedence) (REQ-PROMO-006)
*   Activation and deactivation of promotions (REQ-PROMO-007)

## 3. API Design

### 3.1 General Principles
*   **RESTful Conventions:** The API will adhere to REST principles, using standard HTTP methods (GET, POST, PUT, DELETE) for resource manipulation.
*   **JSON Data Format:** All request and response bodies will use JSON.
*   **Versioning:** API versioning will be managed via the URL path (e.g., `/api/v1/promotions-offers/...`). The current version is V1.
*   **OpenAPI Documentation:** API endpoints, DTOs, and responses will be documented using `@nestjs/swagger` decorators to generate an OpenAPI 3.1.0 specification.

### 3.2 Authentication & Authorization
*   **Authentication:** All endpoints (unless explicitly public, though none are expected in this module) will be protected by a `MerchantAuthGuard`. This guard will be responsible for validating JWTs present in the `Authorization` header.
*   **Authorization:** The `MerchantAuthGuard` will also extract the `merchantId` from the validated JWT. All operations will be scoped to this `merchantId` to ensure data isolation and prevent unauthorized access to other merchants' data. Controller methods will receive the `merchantId` typically via `@Req() req` and then `req.user.merchantId`.

### 3.3 Error Handling
*   Standard NestJS HTTP exceptions (e.g., `HttpException`, `NotFoundException`, `BadRequestException`, `UnauthorizedException`, `ForbiddenException`) will be used to signal errors.
*   `class-validator` will automatically trigger `BadRequestException` for invalid DTOs, providing detailed error messages.
*   Custom business logic exceptions from the service layer will be mapped to appropriate HTTP status codes.

### 3.4 Pagination
List endpoints (e.g., fetching multiple discount codes) will support pagination using:
*   `PagedQueryDto`: For common query parameters like `page`, `limit`, `sortBy`, `sortOrder`.
*   `PagedResponseDto<T>`: A generic DTO for structuring paginated responses, including the data array, total count, current page, and limit.

## 4. Module Design: `PromotionsOffersModule`
*(File: `src/modules/promotions-offers/api/v1/promotions-offers.module.ts`)*

### 4.1 Purpose
The `PromotionsOffersModule` is the main NestJS module for the Promotions & Offers API. It encapsulates and organizes all related components, including controllers and services, ensuring a modular structure.

### 4.2 Definition
typescript
import { Module, CommonModule } from '@nestjs/common';
import { DiscountCodesController } from './controllers/discount-codes.controller';
import { BogoPromotionsController } from './controllers/bogo-promotions.controller';
import { QuantityDiscountsController } from './controllers/quantity-discounts.controller';
import { PromotionsController } from './controllers/promotions.controller';
import { PromotionsOffersService } from './services/promotions-offers.service'; // Assuming concrete implementation
import { IPromotionsOffersService } from './services/i.promotions-offers.service';
import { ICorePlatformService } from './interfaces/i.core-platform.service';
import { PROMOTIONS_OFFERS_SERVICE_TOKEN, CORE_PLATFORM_SERVICE_TOKEN } from './promotions-offers.constants';
// Assuming CorePlatformServiceMock or actual client module for ICorePlatformService
// import { CorePlatformClientModule } from 'shared/core-platform-client'; // Example

@Module({
  imports: [
    CommonModule,
    // CorePlatformClientModule, // If ICorePlatformService is provided by another module
  ],
  controllers: [
    DiscountCodesController,
    BogoPromotionsController,
    QuantityDiscountsController,
    PromotionsController,
  ],
  providers: [
    {
      provide: PROMOTIONS_OFFERS_SERVICE_TOKEN,
      useClass: PromotionsOffersService, // Provide the concrete implementation
    },
    // Example provider for ICorePlatformService if mocked or provided locally
    // {
    //   provide: CORE_PLATFORM_SERVICE_TOKEN,
    //   useClass: CorePlatformServiceMock, // Replace with actual client service
    // },
  ],
})
export class PromotionsOffersModule {}


*   **Imports:** `CommonModule`. May import a module providing the `ICorePlatformService` implementation (e.g., a shared gRPC client module).
*   **Controllers:** Declares `DiscountCodesController`, `BogoPromotionsController`, `QuantityDiscountsController`, and `PromotionsController`.
*   **Providers:**
    *   Provides `PromotionsOffersService` for the `IPromotionsOffersService` token (`PROMOTIONS_OFFERS_SERVICE_TOKEN`).
    *   Will need a provider for `ICorePlatformService` (via `CORE_PLATFORM_SERVICE_TOKEN`), which would typically be a client for an external gRPC service or another internal module.

## 5. Constants Design

### 5.1 Injection Tokens
*(File: `src/modules/promotions-offers/api/v1/promotions-offers.constants.ts`)*

Defines unique symbols for dependency injection of services.
typescript
export const PROMOTIONS_OFFERS_SERVICE_TOKEN = Symbol('IPromotionsOffersService');
export const CORE_PLATFORM_SERVICE_TOKEN = Symbol('ICorePlatformService');
// Add other repository/service tokens if PromotionsOffersService depends on them directly.


### 5.2 Enumerations
*(File: `src/modules/promotions-offers/api/v1/constants/promotion.enums.ts`)*

Provides strongly-typed enumerations for various promotion attributes.

typescript
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
  PER_PRODUCT_LINE = 'PER_PRODUCT_LINE', // Assuming product line implies collection
  TOTAL_CART_ELIGIBLE_ITEMS = 'TOTAL_CART_ELIGIBLE_ITEMS',
}

export enum PromotionApplicationMethod {
  AUTOMATIC = 'AUTOMATIC', // Applied automatically if conditions met
  CUSTOMER_INPUT_CODE = 'CUSTOMER_INPUT_CODE', // Requires a discount code
  MERCHANT_ACTIVATION = 'MERCHANT_ACTIVATION', // Requires explicit merchant activation to be live
}

export enum OfferEligibilityCustomerType {
  ALL_CUSTOMERS = 'ALL_CUSTOMERS',
  NEW_CUSTOMERS = 'NEW_CUSTOMERS',
  SPECIFIC_SEGMENTS = 'SPECIFIC_SEGMENTS',
}

export enum PromotionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE', // Manually deactivated by merchant
  EXPIRED = 'EXPIRED', // Past end date
  ARCHIVED = 'ARCHIVED',
}

export enum BogoApplicationLogic {
  LOWEST_PRICE_ELIGIBLE = 'LOWEST_PRICE_ELIGIBLE', // Default
  MERCHANT_OVERRIDE = 'MERCHANT_OVERRIDE', // If merchant configures alternative logic
}


## 6. Interface Design

### 6.1 `ICorePlatformService`
*(File: `src/modules/promotions-offers/api/v1/interfaces/i.core-platform.service.ts`)*

*   **Purpose:** Defines the contract for interacting with the Core Platform Service, primarily for customer eligibility verification as per REQ-CPSI-004.
*   **Methods:**
    *   `verifyCustomerEligibility(merchantId: string, customerId: string, eligibility: OfferEligibilityDto): Promise<boolean>;`
        *   **Logic:** Sends a request to the Core Platform Service to check if a given customer (`customerId`) for a specific merchant (`merchantId`) meets the defined eligibility criteria (`eligibility`, which includes customer type like NEW_CUSTOMER or segment IDs). Returns `true` if eligible, `false` otherwise.

### 6.2 `IPromotionsOffersService`
*(File: `src/modules/promotions-offers/api/v1/services/i.promotions-offers.service.ts`)*

*   **Purpose:** Defines the public contract for all promotion and offer management business logic.
*   **Methods:**
    *   `createDiscountCode(merchantId: string, dto: CreateDiscountCodeDto): Promise<DiscountCodeResponseDto>;`
    *   `getDiscountCodes(merchantId: string, query: PagedQueryDto): Promise<PagedResponseDto<DiscountCodeResponseDto>>;`
    *   `getDiscountCodeById(merchantId: string, id: string): Promise<DiscountCodeResponseDto>;`
    *   `updateDiscountCode(merchantId: string, id: string, dto: UpdateDiscountCodeDto): Promise<DiscountCodeResponseDto>;`
    *   `deleteDiscountCode(merchantId: string, id: string): Promise<void>;`
    *   `batchGenerateDiscountCodes(merchantId: string, dto: BatchGenerateDiscountCodesDto): Promise<DiscountCodeResponseDto[]>;`
    *   `createBogoPromotion(merchantId: string, dto: CreateBogoPromotionDto): Promise<BogoPromotionResponseDto>;`
    *   `getBogoPromotions(merchantId: string, query: PagedQueryDto): Promise<PagedResponseDto<BogoPromotionResponseDto>>;`
    *   `getBogoPromotionById(merchantId: string, id: string): Promise<BogoPromotionResponseDto>;`
    *   `updateBogoPromotion(merchantId: string, id: string, dto: UpdateBogoPromotionDto): Promise<BogoPromotionResponseDto>;`
    *   `deleteBogoPromotion(merchantId: string, id: string): Promise<void>;`
    *   `createQuantityDiscount(merchantId: string, dto: CreateQuantityDiscountDto): Promise<QuantityDiscountResponseDto>;`
    *   `getQuantityDiscounts(merchantId: string, query: PagedQueryDto): Promise<PagedResponseDto<QuantityDiscountResponseDto>>;`
    *   `getQuantityDiscountById(merchantId: string, id: string): Promise<QuantityDiscountResponseDto>;`
    *   `updateQuantityDiscount(merchantId: string, id: string, dto: UpdateQuantityDiscountDto): Promise<QuantityDiscountResponseDto>;`
    *   `deleteQuantityDiscount(merchantId: string, id: string): Promise<void>;`
    *   `setPromotionInteractionRules(merchantId: string, dto: SetPromotionInteractionRulesDto): Promise<void>;`
    *   `getPromotionInteractionRules(merchantId: string): Promise<PromotionInteractionRuleDto[]>;` // Assuming PromotionInteractionRuleDto is a response DTO for this
    *   `activatePromotion(merchantId: string, promotionId: string, promotionType: string /* e.g., 'DISCOUNT_CODE', 'BOGO' */): Promise<PromotionBaseResponseDto>;` // Return updated promotion
    *   `deactivatePromotion(merchantId: string, promotionId: string, promotionType: string): Promise<PromotionBaseResponseDto>;` // Return updated promotion

## 7. Data Transfer Object (DTO) Design
All DTOs will use `class-validator` decorators for validation and `@nestjs/swagger` (`@ApiProperty`, `@ApiPropertyOptional`) for API documentation. The namespace for DTOs is `AdManager.PromotionsOffers.Api.V1.Dto`.

*(Detailed DTO specifications are based on the file structure provided in the prompt. Key fields and validations are highlighted below.)*

### 7.1 Common DTOs
*(Path: `src/modules/promotions-offers/api/v1/dto/common/`)*

*   **`PromotionBaseDto.ts`**:
    *   `name: string` (@IsString, @IsNotEmpty, @ApiProperty)
    *   `description?: string` (@IsString, @IsOptional, @ApiPropertyOptional)
    *   `status: PromotionStatus` (@IsEnum(PromotionStatus), @ApiProperty)
    *   `validity: OfferValidityDto` (@ValidateNested, @Type, @ApiProperty)
    *   `eligibility?: OfferEligibilityDto` (@ValidateNested, @Type, @ApiPropertyOptional)
    *   `applicationMethod: PromotionApplicationMethod` (@IsEnum(PromotionApplicationMethod), @ApiProperty)
    *   `interactionRules?: PromotionInteractionConfigDto` (@ValidateNested, @Type, @IsOptional, @ApiPropertyOptional)

*   **`OfferValidityDto.ts`**:
    *   `startDate: Date` (@IsDate, @Type, @ApiProperty)
    *   `endDate?: Date` (@IsDate, @Type, @IsOptional, @MinDate(new Date()) /* If allowing future dates only or relative to start*/, @ApiPropertyOptional)
        *   **Note:** Validation: `endDate` must be after `startDate` if both provided. This requires class-level validation or service-level check.

*   **`OfferEligibilityDto.ts`**:
    *   `customerType: OfferEligibilityCustomerType` (@IsEnum(OfferEligibilityCustomerType), @ApiProperty)
    *   `segmentIds?: string[]` (@IsArray, @IsUUID('4', { each: true }), @IsOptional, @ValidateIf(o => o.customerType === OfferEligibilityCustomerType.SPECIFIC_SEGMENTS), @ApiPropertyOptional)

*   **`PromotionInteractionConfigDto.ts`**: (REQ-PROMO-006)
    *   `canStackWithOtherPromotions: boolean` (@IsBoolean, @ApiProperty)
    *   `excludedPromotionIds?: string[]` (@IsArray, @IsUUID('4', { each: true }), @IsOptional, @ApiPropertyOptional)
    *   `stackingPriority?: number` (@IsInt, @Min(0), @IsOptional, @ApiPropertyOptional)

*   **`PagedQueryDto.ts`**:
    *   `page?: number` (@IsInt, @Min(1), @IsOptional, @Type(() => Number), @ApiPropertyOptional({ default: 1 }))
    *   `limit?: number` (@IsInt, @Min(1), @Max(100), @IsOptional, @Type(() => Number), @ApiPropertyOptional({ default: 10 }))
    *   `sortBy?: string` (@IsString, @IsOptional, @ApiPropertyOptional)
    *   `sortOrder?: 'ASC' | 'DESC'` (@IsIn(['ASC', 'DESC']), @IsOptional, @ApiPropertyOptional({ enum: ['ASC', 'DESC']}))

*   **`PagedResponseDto.ts<T>`**:
    *   `data: T[]` (@ApiProperty({ isArray: true }))
    *   `total: number` (@ApiProperty)
    *   `page: number` (@ApiProperty)
    *   `limit: number` (@ApiProperty)

*   **`PromotionBaseResponseDto.ts`**: (New DTO for generic promotion responses)
    *   `id: string` (@IsUUID, @ApiProperty)
    *   Inherits/includes properties from `PromotionBaseDto`.

### 7.2 Discount Code DTOs
*(Path: `src/modules/promotions-offers/api/v1/dto/discount-code/`)*

*   **`CreateDiscountCodeDto.ts`**: (REQ-PROMO-001)
    *   Extends `PromotionBaseDto`.
    *   `codePattern?: string` (@IsString, @IsOptional, @ApiPropertyOptional)
    *   `codes?: string[]` (@IsArray, @IsString({each: true}), @IsOptional, @ArrayMinSize(1), @ApiPropertyOptional)
        *   **Note:** Class-level validation: either `codePattern` or `codes` must be provided, but not both, for single creation. For batch, `codePattern` may not be needed if prefix/suffix used.
    *   `isUniquePerMerchant: boolean` (@IsBoolean, @ApiProperty, default: true)
    *   `discountType: DiscountCodeType` (@IsEnum(DiscountCodeType), @ApiProperty)
    *   `discountValue: number` (@IsNumber, @Min(0), @ApiProperty)
    *   `minimumPurchaseAmount?: number` (@IsNumber, @Min(0), @IsOptional, @ApiPropertyOptional)
    *   `usageLimitType: DiscountCodeUsageLimitType` (@IsEnum(DiscountCodeUsageLimitType), @ApiProperty)
    *   `maxUsagePerCode?: number` (@IsInt, @Min(1), @IsOptional, @ValidateIf(o => o.usageLimitType === DiscountCodeUsageLimitType.MULTIPLE_USES), @ApiPropertyOptional)
    *   `maxUsagePerCustomer?: number` (@IsInt, @Min(1), @IsOptional, @ValidateIf(o => o.usageLimitType !== DiscountCodeUsageLimitType.SINGLE_USE_GLOBALLY), @ApiPropertyOptional)

*   **`UpdateDiscountCodeDto.ts`**:
    *   `export class UpdateDiscountCodeDto extends PartialType(OmitType(CreateDiscountCodeDto, ['codePattern', 'codes', 'isUniquePerMerchant'] as const)) {}`

*   **`DiscountCodeResponseDto.ts`**:
    *   Extends `PromotionBaseResponseDto` and relevant fields from `CreateDiscountCodeDto` (excluding `codePattern`, `codes`).
    *   `id: string` (@ApiProperty)
    *   `code: string` (@ApiProperty)
    *   `timesUsed: number` (@ApiProperty, default: 0)
    *   `isUniquePerMerchant: boolean`
    *   `discountType: DiscountCodeType`
    *   `discountValue: number`
    *   `minimumPurchaseAmount?: number`
    *   `usageLimitType: DiscountCodeUsageLimitType`
    *   `maxUsagePerCode?: number`
    *   `maxUsagePerCustomer?: number`

*   **`BatchGenerateDiscountCodesDto.ts`**: (REQ-PROMO-001)
    *   Extends `OmitType(CreateDiscountCodeDto, ['codePattern', 'codes', 'name', 'description'] as const)`.
        *   **Note:** `name` and `description` likely apply to the batch/campaign, not individual codes.
    *   `batchName?: string` (@IsString, @IsOptional, @ApiPropertyOptional)
    *   `batchDescription?: string` (@IsString, @IsOptional, @ApiPropertyOptional)
    *   `quantity: number` (@IsInt, @Min(1), @Max(10000) /* REQ-PROMO-001 "high volume" but practical limit for single request */, @ApiProperty)
    *   `codePrefix?: string` (@IsString, @IsOptional, @ApiPropertyOptional)
    *   `codeSuffix?: string` (@IsString, @IsOptional, @ApiPropertyOptional)
    *   `codeLength?: number` (@IsInt, @Min(4), @Max(32), @IsOptional, @ApiPropertyOptional, default: 8)
    *   `characterSet?: string` (@IsString, @IsOptional, @ApiPropertyOptional, description: "e.g., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'")

### 7.3 BOGO Promotion DTOs
*(Path: `src/modules/promotions-offers/api/v1/dto/bogo-promotion/`)*

*   **`BogoItemConditionDto.ts`**: (REQ-PROMO-003)
    *   `productIds?: string[]` (@IsArray, @IsUUID('4', { each: true }), @IsOptional, @ArrayMinSize(1), @ApiPropertyOptional)
    *   `collectionIds?: string[]` (@IsArray, @IsUUID('4', { each: true }), @IsOptional, @ArrayMinSize(1), @ApiPropertyOptional)
        *   **Note:** Class-level validation: either `productIds` or `collectionIds` should be provided.
    *   `minimumQuantity: number` (@IsInt, @Min(1), @ApiProperty, default: 1)

*   **`BogoRewardDto.ts`**: (REQ-PROMO-003)
    *   `rewardType: BogoRewardType` (@IsEnum(BogoRewardType), @ApiProperty)
    *   `specificItemId?: string` (@IsUUID('4'), @IsOptional, @ValidateIf(o => o.rewardType === BogoRewardType.SPECIFIC_DIFFERENT_ITEM), @ApiPropertyOptional)
    *   `rewardCollectionIds?: string[]` (@IsArray, @IsUUID('4', { each: true }), @IsOptional, @ArrayMinSize(1), @ValidateIf(o => o.rewardType === BogoRewardType.ITEM_FROM_COLLECTION_EQUAL_OR_LESSER_VALUE), @ApiPropertyOptional)
    *   `quantity: number` (@IsInt, @Min(1), @ApiProperty({default: 1}))

*   **`CreateBogoPromotionDto.ts`**: (REQ-PROMO-003, REQ-PROMO-004)
    *   Extends `PromotionBaseDto`.
    *   `buyCondition: BogoItemConditionDto` (@ValidateNested, @Type(() => BogoItemConditionDto), @ApiProperty)
    *   `getReward: BogoRewardDto` (@ValidateNested, @Type(() => BogoRewardDto), @ApiProperty)
    *   `applicationLogic?: BogoApplicationLogic` (@IsEnum(BogoApplicationLogic), @IsOptional, @ApiPropertyOptional({ enum: BogoApplicationLogic, default: BogoApplicationLogic.LOWEST_PRICE_ELIGIBLE }))

*   **`UpdateBogoPromotionDto.ts`**:
    *   `export class UpdateBogoPromotionDto extends PartialType(CreateBogoPromotionDto) {}`

*   **`BogoPromotionResponseDto.ts`**:
    *   Extends `PromotionBaseResponseDto` and `CreateBogoPromotionDto`. (Effectively `PromotionBaseResponseDto` with BOGO specific fields added).
    *   `id: string` (from base)
    *   `buyCondition: BogoItemConditionDto`
    *   `getReward: BogoRewardDto`
    *   `applicationLogic?: BogoApplicationLogic`

### 7.4 Quantity Discount DTOs
*(Path: `src/modules/promotions-offers/api/v1/dto/quantity-discount/`)*

*   **`QuantityDiscountTierDto.ts`**: (REQ-PROMO-008)
    *   `minimumQuantity: number` (@IsInt, @Min(1), @ApiProperty)
    *   `discountType: DiscountCodeType` (@IsEnum(DiscountCodeType), @ApiProperty)
    *   `discountValue: number` (@IsNumber, @Min(0), @ApiProperty)

*   **`CreateQuantityDiscountDto.ts`**: (REQ-PROMO-008)
    *   Extends `PromotionBaseDto`.
    *   `scope: QuantityDiscountScope` (@IsEnum(QuantityDiscountScope), @ApiProperty)
    *   `tiers: QuantityDiscountTierDto[]` (@IsArray, @ValidateNested({ each: true }), @Type(() => QuantityDiscountTierDto), @ArrayMinSize(1), @ApiProperty({ type: () => [QuantityDiscountTierDto] }))
        *   **Note:** Class-level validation: tiers must have increasing `minimumQuantity`.
    *   `eligibleProductIds?: string[]` (@IsArray, @IsUUID('4', { each: true }), @IsOptional, @ArrayMinSize(1), @ValidateIf(o => o.scope !== QuantityDiscountScope.TOTAL_CART_ELIGIBLE_ITEMS), @ApiPropertyOptional)
    *   `eligibleCollectionIds?: string[]` (@IsArray, @IsUUID('4', { each: true }), @IsOptional, @ArrayMinSize(1), @ValidateIf(o => o.scope !== QuantityDiscountScope.TOTAL_CART_ELIGIBLE_ITEMS), @ApiPropertyOptional)
        *   **Note:** If scope is PER_ITEM or PER_PRODUCT_LINE, either `eligibleProductIds` or `eligibleCollectionIds` should be provided.

*   **`UpdateQuantityDiscountDto.ts`**:
    *   `export class UpdateQuantityDiscountDto extends PartialType(CreateQuantityDiscountDto) {}`

*   **`QuantityDiscountResponseDto.ts`**:
    *   Extends `PromotionBaseResponseDto` and `CreateQuantityDiscountDto`.
    *   `id: string` (from base)
    *   `scope: QuantityDiscountScope`
    *   `tiers: QuantityDiscountTierDto[]`
    *   `eligibleProductIds?: string[]`
    *   `eligibleCollectionIds?: string[]`

### 7.5 Promotion Interaction DTOs
*(Path: `src/modules/promotions-offers/api/v1/dto/promotion-interaction/`)*

*   **`StackableCombinationDto.ts`**: (REQ-PROMO-006)
    *   `promotionIdA: string` (@IsUUID('4'), @ApiProperty)
    *   `promotionIdB: string` (@IsUUID('4'), @ApiProperty)
        *   **Note:** `promotionIdA` and `promotionIdB` should be different.

*   **`PromotionPrecedenceRuleDto.ts`**: (REQ-PROMO-006)
    *   `higherPrecedencePromotionIdOrType: string` (@IsString, @IsNotEmpty, @ApiProperty, description: "Can be a specific Promotion ID (UUID) or a PromotionType enum string")
    *   `lowerPrecedencePromotionIdOrType: string` (@IsString, @IsNotEmpty, @ApiProperty, description: "Can be a specific Promotion ID (UUID) or a PromotionType enum string")

*   **`SetPromotionInteractionRulesDto.ts`**: (REQ-PROMO-006)
    *   `defaultStackingBehavior: 'NONE' | 'ALL_ALLOWED'` (@IsIn(['NONE', 'ALL_ALLOWED']), @ApiProperty({ enum: ['NONE', 'ALL_ALLOWED'], default: 'NONE' }))
    *   `explicitlyStackableCombinations?: StackableCombinationDto[]` (@IsArray, @ValidateNested({ each: true }), @Type(() => StackableCombinationDto), @IsOptional, @ApiPropertyOptional({ type: () => [StackableCombinationDto]}))
    *   `precedenceRules?: PromotionPrecedenceRuleDto[]` (@IsArray, @ValidateNested({ each: true }), @Type(() => PromotionPrecedenceRuleDto), @IsOptional, @ApiPropertyOptional({ type: () => [PromotionPrecedenceRuleDto]}))

*   **`PromotionInteractionRuleResponseDto.ts`**: (New DTO for GET response)
    *   Similar structure to `SetPromotionInteractionRulesDto`, representing the currently configured rules for a merchant.


## 8. Controller Design
All controllers will be under the `/api/v1/promotions-offers` base path. The specific resource path will be defined in the `@Controller` decorator (e.g., `@Controller('discount-codes')`). All methods will be protected by a `MerchantAuthGuard` (implementation assumed to be in a shared module or auth module) and will extract `merchantId` from the authenticated request object (`req.user.merchantId`).

### 8.1 `DiscountCodesController`
*(File: `src/modules/promotions-offers/api/v1/controllers/discount-codes.controller.ts`)*
*   **Purpose:** Manages Discount Code promotions.
*   **Base Path:** `/api/v1/promotions-offers/discount-codes`
*   **Dependency:** `IPromotionsOffersService` (injected via `PROMOTIONS_OFFERS_SERVICE_TOKEN`)
*   **Endpoints:**
    *   **POST /**: Create Discount Code
        *   Summary: "Create a new discount code or a single code from a pattern."
        *   Request Body: `CreateDiscountCodeDto`
        *   Response: `201 Created`, `DiscountCodeResponseDto`
        *   Logic: Delegates to `promotionsOffersService.createDiscountCode(merchantId, dto)`.
    *   **POST /batch-generate**: Batch Generate Discount Codes (REQ-PROMO-001)
        *   Summary: "Batch generate multiple discount codes."
        *   Request Body: `BatchGenerateDiscountCodesDto`
        *   Response: `201 Created`, `DiscountCodeResponseDto[]`
        *   Logic: Delegates to `promotionsOffersService.batchGenerateDiscountCodes(merchantId, dto)`.
    *   **GET /**: Find All Discount Codes
        *   Summary: "Get all discount codes for the authenticated merchant, with pagination."
        *   Query Params: `PagedQueryDto`
        *   Response: `200 OK`, `PagedResponseDto<DiscountCodeResponseDto>`
        *   Logic: Delegates to `promotionsOffersService.getDiscountCodes(merchantId, query)`.
    *   **GET /:id**: Find Discount Code by ID
        *   Summary: "Get a specific discount code by its ID."
        *   Path Param: `id: string` (@Param('id', ParseUUIDPipe))
        *   Response: `200 OK`, `DiscountCodeResponseDto`
        *   Logic: Delegates to `promotionsOffersService.getDiscountCodeById(merchantId, id)`.
    *   **PUT /:id**: Update Discount Code
        *   Summary: "Update an existing discount code."
        *   Path Param: `id: string` (@Param('id', ParseUUIDPipe))
        *   Request Body: `UpdateDiscountCodeDto`
        *   Response: `200 OK`, `DiscountCodeResponseDto`
        *   Logic: Delegates to `promotionsOffersService.updateDiscountCode(merchantId, id, dto)`.
    *   **DELETE /:id**: Delete Discount Code
        *   Summary: "Delete a discount code."
        *   Path Param: `id: string` (@Param('id', ParseUUIDPipe))
        *   Response: `204 No Content`
        *   Logic: Delegates to `promotionsOffersService.deleteDiscountCode(merchantId, id)`.

### 8.2 `BogoPromotionsController`
*(File: `src/modules/promotions-offers/api/v1/controllers/bogo-promotions.controller.ts`)*
*   **Purpose:** Manages BOGO promotions.
*   **Base Path:** `/api/v1/promotions-offers/bogo-promotions`
*   **Dependency:** `IPromotionsOffersService`
*   **Endpoints:**
    *   **POST /**: Create BOGO Promotion (REQ-PROMO-003, REQ-PROMO-004)
        *   Summary: "Create a new BOGO promotion."
        *   Request Body: `CreateBogoPromotionDto`
        *   Response: `201 Created`, `BogoPromotionResponseDto`
        *   Logic: Delegates to `promotionsOffersService.createBogoPromotion(merchantId, dto)`.
    *   **GET /**: Find All BOGO Promotions
        *   Summary: "Get all BOGO promotions for the authenticated merchant."
        *   Query Params: `PagedQueryDto`
        *   Response: `200 OK`, `PagedResponseDto<BogoPromotionResponseDto>`
        *   Logic: Delegates to `promotionsOffersService.getBogoPromotions(merchantId, query)`.
    *   **GET /:id**: Find BOGO Promotion by ID
        *   Summary: "Get a specific BOGO promotion by ID."
        *   Path Param: `id: string` (@Param('id', ParseUUIDPipe))
        *   Response: `200 OK`, `BogoPromotionResponseDto`
        *   Logic: Delegates to `promotionsOffersService.getBogoPromotionById(merchantId, id)`.
    *   **PUT /:id**: Update BOGO Promotion
        *   Summary: "Update an existing BOGO promotion."
        *   Path Param: `id: string` (@Param('id', ParseUUIDPipe))
        *   Request Body: `UpdateBogoPromotionDto`
        *   Response: `200 OK`, `BogoPromotionResponseDto`
        *   Logic: Delegates to `promotionsOffersService.updateBogoPromotion(merchantId, id, dto)`.
    *   **DELETE /:id**: Delete BOGO Promotion
        *   Summary: "Delete a BOGO promotion."
        *   Path Param: `id: string` (@Param('id', ParseUUIDPipe))
        *   Response: `204 No Content`
        *   Logic: Delegates to `promotionsOffersService.deleteBogoPromotion(merchantId, id)`.

### 8.3 `QuantityDiscountsController`
*(File: `src/modules/promotions-offers/api/v1/controllers/quantity-discounts.controller.ts`)*
*   **Purpose:** Manages Quantity-Based Discount promotions.
*   **Base Path:** `/api/v1/promotions-offers/quantity-discounts`
*   **Dependency:** `IPromotionsOffersService`
*   **Endpoints:**
    *   **POST /**: Create Quantity Discount (REQ-PROMO-008)
        *   Summary: "Create a new quantity-based discount."
        *   Request Body: `CreateQuantityDiscountDto`
        *   Response: `201 Created`, `QuantityDiscountResponseDto`
        *   Logic: Delegates to `promotionsOffersService.createQuantityDiscount(merchantId, dto)`.
    *   **GET /**: Find All Quantity Discounts
        *   Summary: "Get all quantity discounts for the authenticated merchant."
        *   Query Params: `PagedQueryDto`
        *   Response: `200 OK`, `PagedResponseDto<QuantityDiscountResponseDto>`
        *   Logic: Delegates to `promotionsOffersService.getQuantityDiscounts(merchantId, query)`.
    *   **GET /:id**: Find Quantity Discount by ID
        *   Summary: "Get a specific quantity discount by ID."
        *   Path Param: `id: string` (@Param('id', ParseUUIDPipe))
        *   Response: `200 OK`, `QuantityDiscountResponseDto`
        *   Logic: Delegates to `promotionsOffersService.getQuantityDiscountById(merchantId, id)`.
    *   **PUT /:id**: Update Quantity Discount
        *   Summary: "Update an existing quantity discount."
        *   Path Param: `id: string` (@Param('id', ParseUUIDPipe))
        *   Request Body: `UpdateQuantityDiscountDto`
        *   Response: `200 OK`, `QuantityDiscountResponseDto`
        *   Logic: Delegates to `promotionsOffersService.updateQuantityDiscount(merchantId, id, dto)`.
    *   **DELETE /:id**: Delete Quantity Discount
        *   Summary: "Delete a quantity discount."
        *   Path Param: `id: string` (@Param('id', ParseUUIDPipe))
        *   Response: `204 No Content`
        *   Logic: Delegates to `promotionsOffersService.deleteQuantityDiscount(merchantId, id)`.

### 8.4 `PromotionsController`
*(File: `src/modules/promotions-offers/api/v1/controllers/promotions.controller.ts`)*
*   **Purpose:** Manages general promotion aspects like interaction rules and activation status.
*   **Base Path:** `/api/v1/promotions-offers/promotions`
*   **Dependency:** `IPromotionsOffersService`
*   **Endpoints:**
    *   **POST /interaction-rules**: Set Promotion Interaction Rules (REQ-PROMO-006)
        *   Summary: "Set or update promotion interaction rules for the merchant."
        *   Request Body: `SetPromotionInteractionRulesDto`
        *   Response: `204 No Content`
        *   Logic: Delegates to `promotionsOffersService.setPromotionInteractionRules(merchantId, dto)`.
    *   **GET /interaction-rules**: Get Promotion Interaction Rules (REQ-PROMO-006)
        *   Summary: "Get the current promotion interaction rules for the merchant."
        *   Response: `200 OK`, `PromotionInteractionRuleResponseDto` (This DTO needs to be defined, likely similar to `SetPromotionInteractionRulesDto` but for response).
        *   Logic: Delegates to `promotionsOffersService.getPromotionInteractionRules(merchantId)`.
    *   **POST /:promotionId/activate**: Activate Promotion (REQ-PROMO-007)
        *   Summary: "Activate a specific promotion."
        *   Path Param: `promotionId: string` (@Param('promotionId', ParseUUIDPipe))
        *   Query Param: `type: string` (@Query('type'), description: "Type of promotion, e.g., 'DISCOUNT_CODE', 'BOGO', 'QUANTITY_DISCOUNT'")
        *   Response: `200 OK`, `PromotionBaseResponseDto` (updated promotion)
        *   Logic: Delegates to `promotionsOffersService.activatePromotion(merchantId, promotionId, type)`.
    *   **POST /:promotionId/deactivate**: Deactivate Promotion (REQ-PROMO-007)
        *   Summary: "Deactivate a specific promotion."
        *   Path Param: `promotionId: string` (@Param('promotionId', ParseUUIDPipe))
        *   Query Param: `type: string` (@Query('type'))
        *   Response: `200 OK`, `PromotionBaseResponseDto` (updated promotion)
        *   Logic: Delegates to `promotionsOffersService.deactivatePromotion(merchantId, promotionId, type)`.

## 9. Service Design: `PromotionsOffersService`
*(File: `src/modules/promotions-offers/api/v1/services/promotions-offers.service.ts`)*

*   **Purpose:** Implements the business logic for all promotion and offer management functionalities.
*   **Dependencies:**
    *   `IDiscountCodeRepository` (assumed interface for data persistence)
    *   `IBogoPromotionRepository` (assumed interface)
    *   `IQuantityDiscountRepository` (assumed interface)
    *   `IPromotionInteractionRuleRepository` (assumed interface)
    *   `ICorePlatformService` (injected via `CORE_PLATFORM_SERVICE_TOKEN`)
*   **Implements:** `IPromotionsOffersService`

*   **Method Logic (High-Level):**
    *   **CRUD Operations (for Discount Codes, BOGO, Quantity Discounts):**
        *   **Create:**
            *   Validate DTO.
            *   For Discount Codes: if `codePattern` or `codes` are provided, generate/validate codes. Ensure uniqueness if `isUniquePerMerchant` is true (REQ-PROMO-001).
            *   If `eligibility.customerType` requires core platform check (REQ-PROMO-005, REQ-CPSI-004), call `corePlatformService.verifyCustomerEligibility` if `customerId` context is available (though typically eligibility is defined here, and checked at application time by another service). For now, assume eligibility DTO is stored.
            *   Persist to respective repository.
            *   Map entity to Response DTO.
        *   **Get (All/Paged):**
            *   Retrieve from repository, applying pagination and filtering based on `merchantId`.
            *   Map entities to Response DTOs.
        *   **Get (By ID):**
            *   Retrieve from repository by `id` and `merchantId`. Throw `NotFoundException` if not found.
            *   Map entity to Response DTO.
        *   **Update:**
            *   Retrieve existing entity by `id` and `merchantId`. Throw `NotFoundException` if not found.
            *   Apply updates from DTO. Perform necessary validations.
            *   Persist changes.
            *   Map updated entity to Response DTO.
        *   **Delete:**
            *   Delete from repository by `id` and `merchantId`. Handle cases where promotion cannot be deleted (e.g., active and used). Consider soft delete/archiving (REQ-PROMO-002).
    *   **`batchGenerateDiscountCodes` (REQ-PROMO-001):**
        *   Validate `BatchGenerateDiscountCodesDto`.
        *   Generate `quantity` unique codes based on `codePrefix`, `codeSuffix`, `codeLength`, `characterSet`. Ensure uniqueness within the batch and against existing codes for the merchant.
        *   For each generated code, create a discount code entity with common properties from the DTO.
        *   Persist all generated codes.
        *   Return array of `DiscountCodeResponseDto`.
        *   **Efficiency (REQ-PROMO-002):** Database interactions should be optimized for bulk insertion.
    *   **`setPromotionInteractionRules` (REQ-PROMO-006):**
        *   Validate `SetPromotionInteractionRulesDto`.
        *   Store/update interaction rules for the `merchantId` in `PromotionInteractionRuleRepository`.
    *   **`getPromotionInteractionRules` (REQ-PROMO-006):**
        *   Retrieve interaction rules for `merchantId` from repository.
    *   **`activatePromotion` / `deactivatePromotion` (REQ-PROMO-007):**
        *   Fetch the promotion by `promotionId` and `promotionType` for the `merchantId`.
        *   Validate if `applicationMethod` allows manual activation/deactivation.
        *   Update its status to `ACTIVE` or `INACTIVE`.
        *   Persist the change.
        *   Return the updated promotion.
    *   **`checkAndApplyEligibility` (private helper for REQ-PROMO-005, REQ-CPSI-004):**
        *   If `promotion.eligibility` is set:
            *   If `eligibility.customerType` is `NEW_CUSTOMERS` or `SPECIFIC_SEGMENTS`, call `this.corePlatformService.verifyCustomerEligibility(merchantId, customerId, promotion.eligibility)`.
            *   This method would typically be used by a separate "Promotion Application Service" at runtime, not directly during creation. For now, the eligibility DTO is stored.

    *   **BOGO Specific Logic (REQ-PROMO-004):**
        *   The `applicationLogic` field in `CreateBogoPromotionDto` determines how BOGO is applied if multiple items qualify. This logic is primarily enforced by a promotion application engine at checkout, not directly within these CRUD APIs. This service ensures the `applicationLogic` preference is stored.

    *   **Quantity Discount Tier Validation (REQ-PROMO-008):**
        *   When creating/updating quantity discounts, ensure `tiers` are sorted by `minimumQuantity` and that quantities do not overlap in a contradictory way.

## 10. Configuration

*   **Feature Toggles (from repository JSON):**
    *   `enableBogoLowestPriceOverrideConfig`: If true, the `applicationLogic` field in BOGO DTOs is relevant.
    *   `enableAdvancedPromotionInteractionRules`: If true, more complex precedence and stacking rules are supported.
*   **Database Configurations:**
    *   `PROMOTIONS_DB_CONNECTION_STRING`: Connection string for the PostgreSQL database (if this service manages its own DB or schema within a shared DB). This would typically be managed via environment variables and NestJS ConfigModule.

## 11. Security Considerations

*   **Authentication:** JWTs validated by `MerchantAuthGuard`.
*   **Authorization:** All operations strictly scoped to the `merchantId` extracted from the JWT.
*   **Input Validation:** DTOs use `class-validator` to prevent common injection attacks and ensure data integrity. `ParseUUIDPipe` for ID parameters.
*   **Rate Limiting:** Should be configured at the API Gateway level.
*   **Data Protection:** This API layer primarily handles configuration. PII (customer data for eligibility) is handled via `ICorePlatformService`, which should operate under its own security and privacy constraints.

## 12. Deployment Considerations

*   The API will be packaged as a Docker container.
*   Deployed as a microservice, potentially on Amazon EKS or ECS.
*   Exposed via Amazon API Gateway.
*   CI/CD pipelines will manage build, test, and deployment.

## 13. Testing Strategy

*   **Unit Tests:** For controllers (mocking services) and services (mocking repositories and `ICorePlatformService`). Focus on business logic, DTO validation, and method delegation.
*   **Integration Tests:** Test API endpoints against a test database instance, ensuring correct HTTP responses, data persistence, and interaction between controller and service.
*   **End-to-End Tests:** As part of the broader Ad Manager Platform testing, ensuring flows involving UI, API, and dependent services function correctly.

## 14. Future Considerations / Extensibility

*   Support for more complex promotion types.
*   Integration with an analytics service for promotion performance tracking.
*   Webhooks for notifying other systems about promotion lifecycle events (created, updated, activated).
*   More granular permissions for different types of promotion management.