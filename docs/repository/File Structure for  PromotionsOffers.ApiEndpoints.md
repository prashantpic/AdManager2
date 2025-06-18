# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project metadata, dependencies, and scripts for the Promotions & Offers API Endpoints repository. Includes dependencies like @nestjs/core, @nestjs/common, @nestjs/platform-express, class-validator, class-transformer, @nestjs/swagger, reflect-metadata, rxjs.  
**Template:** NodeJS PackageManifest Template  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Project  
**Relative Path:**   
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Management
    - Project Build Scripts
    
**Requirement Ids:**
    
    
**Purpose:** Manages project dependencies and provides scripts for building, testing, and running the Promotions & Offers API module.  
**Logic Description:** Contains standard package.json fields: name (e.g., @admanager/promotions-offers-api), version, description (from repository details), main, scripts (build, start:dev, test, lint), dependencies (@nestjs/core, etc.), devDependencies (@nestjs/cli, typescript, etc.).  
**Documentation:**
    
    - **Summary:** Standard package.json file for a NestJS TypeScript project. Lists all necessary libraries for building the promotions and offers API endpoints.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Project
    
- **Path:** src/modules/promotions-offers/api/v1/promotions-offers.module.ts  
**Description:** NestJS module definition for the Promotions & Offers API. Imports necessary modules, declares controllers, and provides services.  
**Template:** NestJS Module Template  
**Dependancy Level:** 4  
**Name:** PromotionsOffersModule  
**Type:** Module  
**Relative Path:** modules/promotions-offers/api/v1  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    - Module
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module Encapsulation for Promotions & Offers API
    
**Requirement Ids:**
    
    - REQ-PROMO-001
    - REQ-PROMO-003
    - REQ-PROMO-005
    - REQ-PROMO-006
    - REQ-PROMO-007
    - REQ-PROMO-008
    - REQ-CPSI-004
    
**Purpose:** Organizes and encapsulates all components related to the promotions and offers API, including controllers and services.  
**Logic Description:** Uses the @Module decorator. Imports CommonModule. Declares DiscountCodesController, BogoPromotionsController, QuantityDiscountsController, PromotionsController. Provides PromotionsOffersService (with its interface IPromotionsOffersService using PROMOTIONS_OFFERS_SERVICE_TOKEN) and potentially a CorePlatformService client for eligibility checks.  
**Documentation:**
    
    - **Summary:** Defines the PromotionsOffersModule, which groups all related controllers and services for managing promotional offers.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1  
**Metadata:**
    
    - **Category:** Module
    
- **Path:** src/modules/promotions-offers/api/v1/promotions-offers.constants.ts  
**Description:** Defines constants for the Promotions & Offers module, primarily injection tokens for services.  
**Template:** TypeScript Constants Template  
**Dependancy Level:** 0  
**Name:** promotionsOffersConstants  
**Type:** Constants  
**Relative Path:** modules/promotions-offers/api/v1  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** PROMOTIONS_OFFERS_SERVICE_TOKEN  
**Type:** symbol  
**Attributes:** export const  
    - **Name:** CORE_PLATFORM_SERVICE_TOKEN  
**Type:** symbol  
**Attributes:** export const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Injection Tokens
    
**Requirement Ids:**
    
    
**Purpose:** Provides unique symbols for dependency injection of services within the Promotions & Offers module.  
**Logic Description:** Exports symbols to be used as injection tokens for services like IPromotionsOffersService and ICorePlatformService.  
**Documentation:**
    
    - **Summary:** Contains constants, primarily injection tokens, used for dependency injection within the promotions and offers module.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/promotions-offers/api/v1/constants/promotion.enums.ts  
**Description:** Defines enumerations used throughout the Promotions & Offers API, such as discount types, BOGO reward types, promotion statuses, application methods, etc.  
**Template:** TypeScript Enum Template  
**Dependancy Level:** 0  
**Name:** promotionEnums  
**Type:** Enum  
**Relative Path:** modules/promotions-offers/api/v1/constants  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** DiscountCodeType  
**Type:** enum  
**Attributes:** export enum (PERCENTAGE, FIXED_AMOUNT)  
    - **Name:** DiscountCodeUsageLimitType  
**Type:** enum  
**Attributes:** export enum (SINGLE_USE_PER_CUSTOMER, SINGLE_USE_GLOBALLY, MULTIPLE_USES)  
    - **Name:** BogoRewardType  
**Type:** enum  
**Attributes:** export enum (SAME_AS_PURCHASED, SPECIFIC_DIFFERENT_ITEM, ITEM_FROM_COLLECTION_EQUAL_OR_LESSER_VALUE)  
    - **Name:** QuantityDiscountScope  
**Type:** enum  
**Attributes:** export enum (PER_ITEM, PER_PRODUCT_LINE, TOTAL_CART_ELIGIBLE_ITEMS)  
    - **Name:** PromotionApplicationMethod  
**Type:** enum  
**Attributes:** export enum (AUTOMATIC, CUSTOMER_INPUT_CODE, MERCHANT_ACTIVATION)  
    - **Name:** OfferEligibilityCustomerType  
**Type:** enum  
**Attributes:** export enum (ALL_CUSTOMERS, NEW_CUSTOMERS, SPECIFIC_SEGMENTS)  
    - **Name:** PromotionStatus  
**Type:** enum  
**Attributes:** export enum (DRAFT, ACTIVE, INACTIVE, EXPIRED, ARCHIVED)  
    - **Name:** BogoApplicationLogic  
**Type:** enum  
**Attributes:** export enum (LOWEST_PRICE_ELIGIBLE, MERCHANT_OVERRIDE)  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Standardized Promotion Types and States
    
**Requirement Ids:**
    
    - REQ-PROMO-001
    - REQ-PROMO-003
    - REQ-PROMO-004
    - REQ-PROMO-005
    - REQ-PROMO-007
    - REQ-PROMO-008
    
**Purpose:** Provides strongly-typed enumerations for various promotion attributes, enhancing code clarity and reducing errors.  
**Logic Description:** Defines TypeScript enums for all relevant promotion characteristics and statuses as listed in members.  
**Documentation:**
    
    - **Summary:** Contains enumerations for discount types, usage limits, BOGO types, quantity discount scopes, application methods, eligibility criteria, and promotion statuses.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Constants  
**Metadata:**
    
    - **Category:** Constants
    
- **Path:** src/modules/promotions-offers/api/v1/interfaces/i.core-platform.service.ts  
**Description:** Interface defining the contract for interacting with the Core Platform Service, specifically for customer eligibility verification.  
**Template:** TypeScript Interface Template  
**Dependancy Level:** 1  
**Name:** ICorePlatformService  
**Type:** Interface  
**Relative Path:** modules/promotions-offers/api/v1/interfaces  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    - DependencyInversion
    
**Members:**
    
    
**Methods:**
    
    - **Name:** verifyCustomerEligibility  
**Parameters:**
    
    - customerId: string
    - eligibilityCriteria: OfferEligibilityDto
    
**Return Type:** Promise<boolean>  
**Attributes:** abstract  
    
**Implemented Features:**
    
    - Core Platform Customer Eligibility Check Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-004
    
**Purpose:** Defines the contract for checking customer eligibility against the core platform, abstracting the PromotionsOffersService from its concrete implementation.  
**Logic Description:** Declares the `verifyCustomerEligibility` method signature, which takes customer identification and eligibility rules, and returns a boolean indicating eligibility.  
**Documentation:**
    
    - **Summary:** Interface for the Core Platform Service, used by PromotionsOffersService to verify customer eligibility for promotions.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Interfaces  
**Metadata:**
    
    - **Category:** Interface
    
- **Path:** src/modules/promotions-offers/api/v1/services/i.promotions-offers.service.ts  
**Description:** Interface defining the contract for the PromotionsOffersService, outlining all promotion management operations.  
**Template:** TypeScript Interface Template  
**Dependancy Level:** 2  
**Name:** IPromotionsOffersService  
**Type:** Interface  
**Relative Path:** modules/promotions-offers/api/v1/services  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    - DependencyInversion
    
**Members:**
    
    
**Methods:**
    
    - **Name:** createDiscountCode  
**Parameters:**
    
    - merchantId: string
    - dto: CreateDiscountCodeDto
    
**Return Type:** Promise<DiscountCodeResponseDto>  
**Attributes:** abstract  
    - **Name:** getDiscountCodes  
**Parameters:**
    
    - merchantId: string
    - query: PagedQueryDto
    
**Return Type:** Promise<PagedResponseDto<DiscountCodeResponseDto>>  
**Attributes:** abstract  
    - **Name:** getDiscountCodeById  
**Parameters:**
    
    - merchantId: string
    - id: string
    
**Return Type:** Promise<DiscountCodeResponseDto>  
**Attributes:** abstract  
    - **Name:** updateDiscountCode  
**Parameters:**
    
    - merchantId: string
    - id: string
    - dto: UpdateDiscountCodeDto
    
**Return Type:** Promise<DiscountCodeResponseDto>  
**Attributes:** abstract  
    - **Name:** deleteDiscountCode  
**Parameters:**
    
    - merchantId: string
    - id: string
    
**Return Type:** Promise<void>  
**Attributes:** abstract  
    - **Name:** batchGenerateDiscountCodes  
**Parameters:**
    
    - merchantId: string
    - dto: BatchGenerateDiscountCodesDto
    
**Return Type:** Promise<DiscountCodeResponseDto[]>  
**Attributes:** abstract  
    - **Name:** createBogoPromotion  
**Parameters:**
    
    - merchantId: string
    - dto: CreateBogoPromotionDto
    
**Return Type:** Promise<BogoPromotionResponseDto>  
**Attributes:** abstract  
    - **Name:** getBogoPromotions  
**Parameters:**
    
    - merchantId: string
    - query: PagedQueryDto
    
**Return Type:** Promise<PagedResponseDto<BogoPromotionResponseDto>>  
**Attributes:** abstract  
    - **Name:** getBogoPromotionById  
**Parameters:**
    
    - merchantId: string
    - id: string
    
**Return Type:** Promise<BogoPromotionResponseDto>  
**Attributes:** abstract  
    - **Name:** updateBogoPromotion  
**Parameters:**
    
    - merchantId: string
    - id: string
    - dto: UpdateBogoPromotionDto
    
**Return Type:** Promise<BogoPromotionResponseDto>  
**Attributes:** abstract  
    - **Name:** deleteBogoPromotion  
**Parameters:**
    
    - merchantId: string
    - id: string
    
**Return Type:** Promise<void>  
**Attributes:** abstract  
    - **Name:** createQuantityDiscount  
**Parameters:**
    
    - merchantId: string
    - dto: CreateQuantityDiscountDto
    
**Return Type:** Promise<QuantityDiscountResponseDto>  
**Attributes:** abstract  
    - **Name:** getQuantityDiscounts  
**Parameters:**
    
    - merchantId: string
    - query: PagedQueryDto
    
**Return Type:** Promise<PagedResponseDto<QuantityDiscountResponseDto>>  
**Attributes:** abstract  
    - **Name:** getQuantityDiscountById  
**Parameters:**
    
    - merchantId: string
    - id: string
    
**Return Type:** Promise<QuantityDiscountResponseDto>  
**Attributes:** abstract  
    - **Name:** updateQuantityDiscount  
**Parameters:**
    
    - merchantId: string
    - id: string
    - dto: UpdateQuantityDiscountDto
    
**Return Type:** Promise<QuantityDiscountResponseDto>  
**Attributes:** abstract  
    - **Name:** deleteQuantityDiscount  
**Parameters:**
    
    - merchantId: string
    - id: string
    
**Return Type:** Promise<void>  
**Attributes:** abstract  
    - **Name:** setPromotionInteractionRules  
**Parameters:**
    
    - merchantId: string
    - dto: SetPromotionInteractionRulesDto
    
**Return Type:** Promise<void>  
**Attributes:** abstract  
    - **Name:** getPromotionInteractionRules  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<PromotionInteractionRuleDto[]>  
**Attributes:** abstract  
    - **Name:** activatePromotion  
**Parameters:**
    
    - merchantId: string
    - promotionId: string
    - promotionType: string
    
**Return Type:** Promise<void>  
**Attributes:** abstract  
    - **Name:** deactivatePromotion  
**Parameters:**
    
    - merchantId: string
    - promotionId: string
    - promotionType: string
    
**Return Type:** Promise<void>  
**Attributes:** abstract  
    
**Implemented Features:**
    
    - Promotion Service Contract Definition
    
**Requirement Ids:**
    
    - REQ-PROMO-001
    - REQ-PROMO-003
    - REQ-PROMO-005
    - REQ-PROMO-006
    - REQ-PROMO-007
    - REQ-PROMO-008
    - REQ-CPSI-004
    
**Purpose:** Defines the public contract for promotion and offer management services, ensuring a clear separation of concerns between API controllers and business logic implementation.  
**Logic Description:** Outlines all methods required for creating, retrieving, updating, deleting, and managing various types of promotions (discount codes, BOGO, quantity-based) and their interaction rules and statuses.  
**Documentation:**
    
    - **Summary:** Interface for the PromotionsOffersService, detailing all business operations related to managing promotions and offers.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Services  
**Metadata:**
    
    - **Category:** Interface
    
- **Path:** src/modules/promotions-offers/api/v1/dto/common/promotion-base.dto.ts  
**Description:** Base DTO containing common fields for all promotion types, such as name, description, validity period, eligibility criteria, application method, and interaction rules.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** PromotionBaseDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/common  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** name  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @ApiProperty()  
    - **Name:** description  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    - **Name:** status  
**Type:** PromotionStatus  
**Attributes:** @IsEnum(PromotionStatus) @ApiProperty({ enum: PromotionStatus })  
    - **Name:** validity  
**Type:** OfferValidityDto  
**Attributes:** @ValidateNested() @Type(() => OfferValidityDto) @ApiProperty()  
    - **Name:** eligibility  
**Type:** OfferEligibilityDto  
**Attributes:** @ValidateNested() @Type(() => OfferEligibilityDto) @ApiPropertyOptional()  
    - **Name:** applicationMethod  
**Type:** PromotionApplicationMethod  
**Attributes:** @IsEnum(PromotionApplicationMethod) @ApiProperty({ enum: PromotionApplicationMethod })  
    - **Name:** interactionRules  
**Type:** PromotionInteractionConfigDto  
**Attributes:** @ValidateNested() @Type(() => PromotionInteractionConfigDto) @IsOptional() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Common Promotion Attributes
    
**Requirement Ids:**
    
    - REQ-PROMO-005
    - REQ-PROMO-006
    - REQ-PROMO-007
    
**Purpose:** Provides a reusable base for promotion DTOs, ensuring common properties are consistently defined.  
**Logic Description:** Uses class-validator decorators for validation and @nestjs/swagger for API documentation. Includes fields for name, description, status, validity, eligibility, application method, and interaction configuration.  
**Documentation:**
    
    - **Summary:** Defines common properties applicable to all types of promotional offers.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.Common  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/common/offer-validity.dto.ts  
**Description:** DTO for defining the validity period of a promotion (start and end dates/times).  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** OfferValidityDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/common  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** startDate  
**Type:** Date  
**Attributes:** @IsDate() @Type(() => Date) @ApiProperty()  
    - **Name:** endDate  
**Type:** Date  
**Attributes:** @IsDate() @Type(() => Date) @IsOptional() @ValidateIf(o => o.endDate) @MinDate(new Date()) @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Offer Validity Period Definition
    
**Requirement Ids:**
    
    - REQ-PROMO-005
    
**Purpose:** Captures the start and end dates for a promotional offer's active period.  
**Logic Description:** Contains `startDate` and an optional `endDate`. Uses class-validator for date validation.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for specifying the start and end dates of an offer.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.Common  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/common/offer-eligibility.dto.ts  
**Description:** DTO for defining eligibility criteria for an offer (e.g., new customers, specific customer segments).  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** OfferEligibilityDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/common  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** customerType  
**Type:** OfferEligibilityCustomerType  
**Attributes:** @IsEnum(OfferEligibilityCustomerType) @ApiProperty({ enum: OfferEligibilityCustomerType })  
    - **Name:** segmentIds  
**Type:** string[]  
**Attributes:** @IsArray() @IsUUID('4', { each: true }) @IsOptional() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Offer Eligibility Criteria Definition
    
**Requirement Ids:**
    
    - REQ-PROMO-005
    - REQ-CPSI-004
    
**Purpose:** Captures the criteria used to determine if a customer is eligible for a promotional offer.  
**Logic Description:** Includes `customerType` (e.g., new, specific segments) and an optional array of `segmentIds` if applicable.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for specifying customer eligibility criteria for an offer.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.Common  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/common/promotion-interaction-config.dto.ts  
**Description:** DTO for defining how a promotion interacts with others (stacking, exclusion).  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** PromotionInteractionConfigDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/common  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** canStackWithOtherPromotions  
**Type:** boolean  
**Attributes:** @IsBoolean() @ApiProperty()  
    - **Name:** excludedPromotionIds  
**Type:** string[]  
**Attributes:** @IsArray() @IsUUID('4', { each: true }) @IsOptional() @ApiPropertyOptional()  
    - **Name:** stackingPriority  
**Type:** number  
**Attributes:** @IsInt() @Min(0) @IsOptional() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Promotion Stacking and Exclusion Rules
    
**Requirement Ids:**
    
    - REQ-PROMO-006
    
**Purpose:** Captures rules for how a specific promotion can be combined or excluded with other promotions.  
**Logic Description:** Includes boolean `canStackWithOtherPromotions`, an array of `excludedPromotionIds`, and an optional `stackingPriority` number.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for specifying interaction rules like stacking and exclusion for a promotion.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.Common  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/common/paged-query.dto.ts  
**Description:** Common DTO for pagination query parameters.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 0  
**Name:** PagedQueryDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/common  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** page  
**Type:** number  
**Attributes:** @IsInt() @Min(1) @IsOptional() @Type(() => Number) @ApiPropertyOptional({ default: 1 })  
    - **Name:** limit  
**Type:** number  
**Attributes:** @IsInt() @Min(1) @Max(100) @IsOptional() @Type(() => Number) @ApiPropertyOptional({ default: 10 })  
    - **Name:** sortBy  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    - **Name:** sortOrder  
**Type:** 'ASC' | 'DESC'  
**Attributes:** @IsIn(['ASC', 'DESC']) @IsOptional() @ApiPropertyOptional({ enum: ['ASC', 'DESC']})  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Pagination Query Parameters
    
**Requirement Ids:**
    
    
**Purpose:** Standardizes pagination inputs for list endpoints.  
**Logic Description:** Defines optional `page`, `limit`, `sortBy`, and `sortOrder` fields with validation.  
**Documentation:**
    
    - **Summary:** Defines common query parameters for paginated API responses.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.Common  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/common/paged-response.dto.ts  
**Description:** Generic DTO for paginated API responses.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 0  
**Name:** PagedResponseDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/common  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** data  
**Type:** T[]  
**Attributes:** @ApiProperty({ isArray: true })  
    - **Name:** total  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** page  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** limit  
**Type:** number  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Standardized Paginated Response Structure
    
**Requirement Ids:**
    
    
**Purpose:** Provides a consistent structure for API responses that return a list of items with pagination details.  
**Logic Description:** A generic class `PagedResponseDto<T>` that includes an array of data items, total count, current page, and limit.  
**Documentation:**
    
    - **Summary:** A generic Data Transfer Object for returning paginated lists of items.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.Common  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/discount-code/create-discount-code.dto.ts  
**Description:** DTO for creating a new discount code. Inherits from PromotionBaseDto.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** CreateDiscountCodeDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/discount-code  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** codePattern  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional({ description: 'Pattern for generating codes if not providing specific codes. e.g., SALE{L L N N}'})  
    - **Name:** codes  
**Type:** string[]  
**Attributes:** @IsArray() @IsString({each: true}) @IsOptional() @ApiPropertyOptional({ description: 'Specific codes to create. Mutually exclusive with codePattern for single creation.'})  
    - **Name:** isUniquePerMerchant  
**Type:** boolean  
**Attributes:** @IsBoolean() @ApiProperty()  
    - **Name:** discountType  
**Type:** DiscountCodeType  
**Attributes:** @IsEnum(DiscountCodeType) @ApiProperty({ enum: DiscountCodeType })  
    - **Name:** discountValue  
**Type:** number  
**Attributes:** @IsNumber() @Min(0) @ApiProperty()  
    - **Name:** minimumPurchaseAmount  
**Type:** number  
**Attributes:** @IsNumber() @Min(0) @IsOptional() @ApiPropertyOptional()  
    - **Name:** usageLimitType  
**Type:** DiscountCodeUsageLimitType  
**Attributes:** @IsEnum(DiscountCodeUsageLimitType) @ApiProperty({ enum: DiscountCodeUsageLimitType })  
    - **Name:** maxUsagePerCode  
**Type:** number  
**Attributes:** @IsInt() @Min(1) @IsOptional() @ApiPropertyOptional()  
    - **Name:** maxUsagePerCustomer  
**Type:** number  
**Attributes:** @IsInt() @Min(1) @IsOptional() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Discount Code Creation Data Structure
    
**Requirement Ids:**
    
    - REQ-PROMO-001
    
**Purpose:** Defines the data structure required to create new discount codes, including their rules and limitations.  
**Logic Description:** Extends PromotionBaseDto. Includes fields for code pattern or specific codes, uniqueness, discount type/value, minimum purchase, and usage limits. Uses class-validator and @nestjs/swagger decorators.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for creating new discount codes.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.DiscountCode  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/discount-code/update-discount-code.dto.ts  
**Description:** DTO for updating an existing discount code. Uses PartialType from @nestjs/mapped-types.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** UpdateDiscountCodeDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/discount-code  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Discount Code Update Data Structure
    
**Requirement Ids:**
    
    - REQ-PROMO-001
    
**Purpose:** Defines the data structure for partially updating existing discount code properties.  
**Logic Description:** Extends PartialType(OmitType(CreateDiscountCodeDto, ['codePattern', 'codes', 'isUniquePerMerchant'] as const)). Allows updating fields like description, validity, eligibility, discountValue, minimumPurchaseAmount, usage limits, status.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for updating existing discount codes. Allows partial updates.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.DiscountCode  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/discount-code/discount-code.response.dto.ts  
**Description:** DTO representing a discount code in API responses.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** DiscountCodeResponseDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/discount-code  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** code  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** timesUsed  
**Type:** number  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Discount Code Response Data Structure
    
**Requirement Ids:**
    
    - REQ-PROMO-001
    
**Purpose:** Defines the structure of discount code data returned by the API.  
**Logic Description:** Extends CreateDiscountCodeDto (or relevant fields from it if some are internal). Includes `id`, `code`, `timesUsed`, and inherits common promotion properties.  
**Documentation:**
    
    - **Summary:** Data Transfer Object representing a discount code as returned by the API.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.DiscountCode  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/discount-code/batch-generate-discount-codes.dto.ts  
**Description:** DTO for batch generating multiple discount codes based on a pattern and quantity.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** BatchGenerateDiscountCodesDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/discount-code  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** quantity  
**Type:** number  
**Attributes:** @IsInt() @Min(1) @Max(10000) @ApiProperty()  
    - **Name:** codePrefix  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    - **Name:** codeSuffix  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    - **Name:** codeLength  
**Type:** number  
**Attributes:** @IsInt() @Min(4) @Max(32) @IsOptional() @ApiPropertyOptional()  
    - **Name:** characterSet  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Batch Discount Code Generation Parameters
    
**Requirement Ids:**
    
    - REQ-PROMO-001
    
**Purpose:** Defines parameters for generating a large number of unique discount codes.  
**Logic Description:** Extends OmitType(CreateDiscountCodeDto, ['codePattern', 'codes'] as const). Includes `quantity` for number of codes to generate, and optional generation parameters like `codePrefix`, `codeSuffix`, `codeLength`, `characterSet`. All other properties like discount type, value, validity, etc., are inherited.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for batch generation of discount codes, specifying quantity and generation rules along with common discount properties.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.DiscountCode  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/bogo-promotion/create-bogo-promotion.dto.ts  
**Description:** DTO for creating a new Buy One, Get One Free (BOGO) promotion. Inherits from PromotionBaseDto.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** CreateBogoPromotionDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/bogo-promotion  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** buyCondition  
**Type:** BogoItemConditionDto  
**Attributes:** @ValidateNested() @Type(() => BogoItemConditionDto) @ApiProperty()  
    - **Name:** getReward  
**Type:** BogoRewardDto  
**Attributes:** @ValidateNested() @Type(() => BogoRewardDto) @ApiProperty()  
    - **Name:** applicationLogic  
**Type:** BogoApplicationLogic  
**Attributes:** @IsEnum(BogoApplicationLogic) @IsOptional() @ApiPropertyOptional({ enum: BogoApplicationLogic, default: 'LOWEST_PRICE_ELIGIBLE'})  
    
**Methods:**
    
    
**Implemented Features:**
    
    - BOGO Promotion Creation Data Structure
    
**Requirement Ids:**
    
    - REQ-PROMO-003
    - REQ-PROMO-004
    
**Purpose:** Defines the data structure for creating BOGO promotions, including conditions and rewards.  
**Logic Description:** Extends PromotionBaseDto. Includes `buyCondition` (products/collections, quantity) and `getReward` (same item, specific item, item from collection with value constraint). Contains `applicationLogic` for REQ-PROMO-004.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for creating new BOGO promotions.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.BogoPromotion  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/bogo-promotion/bogo-item-condition.dto.ts  
**Description:** DTO for defining the 'buy' condition items in a BOGO promotion.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** BogoItemConditionDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/bogo-promotion  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** productIds  
**Type:** string[]  
**Attributes:** @IsArray() @IsUUID('4', { each: true }) @IsOptional() @ApiPropertyOptional()  
    - **Name:** collectionIds  
**Type:** string[]  
**Attributes:** @IsArray() @IsUUID('4', { each: true }) @IsOptional() @ApiPropertyOptional()  
    - **Name:** minimumQuantity  
**Type:** number  
**Attributes:** @IsInt() @Min(1) @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - BOGO Buy Condition
    
**Requirement Ids:**
    
    - REQ-PROMO-003
    
**Purpose:** Specifies which products/collections and in what quantity must be purchased to trigger the BOGO offer.  
**Logic Description:** Contains optional arrays for `productIds` or `collectionIds` and a `minimumQuantity`.  
**Documentation:**
    
    - **Summary:** Defines the items and quantity required to satisfy the 'buy' part of a BOGO promotion.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.BogoPromotion  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/bogo-promotion/bogo-reward.dto.ts  
**Description:** DTO for defining the 'get' reward item(s) in a BOGO promotion.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** BogoRewardDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/bogo-promotion  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** rewardType  
**Type:** BogoRewardType  
**Attributes:** @IsEnum(BogoRewardType) @ApiProperty({ enum: BogoRewardType })  
    - **Name:** specificItemId  
**Type:** string  
**Attributes:** @IsUUID('4') @IsOptional() @ValidateIf(o => o.rewardType === 'SPECIFIC_DIFFERENT_ITEM') @ApiPropertyOptional()  
    - **Name:** rewardCollectionIds  
**Type:** string[]  
**Attributes:** @IsArray() @IsUUID('4', { each: true }) @IsOptional() @ValidateIf(o => o.rewardType === 'ITEM_FROM_COLLECTION_EQUAL_OR_LESSER_VALUE') @ApiPropertyOptional()  
    - **Name:** quantity  
**Type:** number  
**Attributes:** @IsInt() @Min(1) @ApiProperty({default: 1})  
    
**Methods:**
    
    
**Implemented Features:**
    
    - BOGO Get Reward
    
**Requirement Ids:**
    
    - REQ-PROMO-003
    
**Purpose:** Specifies the nature and quantity of the free item(s) in a BOGO offer.  
**Logic Description:** Contains `rewardType` (same, specific, from collection), `specificItemId` if applicable, `rewardCollectionIds` if applicable, and `quantity` of free items.  
**Documentation:**
    
    - **Summary:** Defines the reward (free item) configuration for a BOGO promotion.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.BogoPromotion  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/bogo-promotion/update-bogo-promotion.dto.ts  
**Description:** DTO for updating an existing BOGO promotion. Uses PartialType.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** UpdateBogoPromotionDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/bogo-promotion  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - BOGO Promotion Update Data Structure
    
**Requirement Ids:**
    
    - REQ-PROMO-003
    - REQ-PROMO-004
    
**Purpose:** Defines the data structure for partially updating BOGO promotion properties.  
**Logic Description:** Extends PartialType(CreateBogoPromotionDto). Allows updating fields from CreateBogoPromotionDto and its base class.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for updating existing BOGO promotions. Allows partial updates.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.BogoPromotion  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/bogo-promotion/bogo-promotion.response.dto.ts  
**Description:** DTO representing a BOGO promotion in API responses.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** BogoPromotionResponseDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/bogo-promotion  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - BOGO Promotion Response Data Structure
    
**Requirement Ids:**
    
    - REQ-PROMO-003
    - REQ-PROMO-004
    
**Purpose:** Defines the structure of BOGO promotion data returned by the API.  
**Logic Description:** Extends CreateBogoPromotionDto. Includes `id` and inherits common promotion properties and BOGO specific configurations.  
**Documentation:**
    
    - **Summary:** Data Transfer Object representing a BOGO promotion as returned by the API.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.BogoPromotion  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/quantity-discount/create-quantity-discount.dto.ts  
**Description:** DTO for creating a new quantity-based discount. Inherits from PromotionBaseDto.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** CreateQuantityDiscountDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/quantity-discount  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** scope  
**Type:** QuantityDiscountScope  
**Attributes:** @IsEnum(QuantityDiscountScope) @ApiProperty({ enum: QuantityDiscountScope })  
    - **Name:** tiers  
**Type:** QuantityDiscountTierDto[]  
**Attributes:** @IsArray() @ValidateNested({ each: true }) @Type(() => QuantityDiscountTierDto) @ArrayMinSize(1) @ApiProperty({ type: () => [QuantityDiscountTierDto] })  
    - **Name:** eligibleProductIds  
**Type:** string[]  
**Attributes:** @IsArray() @IsUUID('4', { each: true }) @IsOptional() @ApiPropertyOptional()  
    - **Name:** eligibleCollectionIds  
**Type:** string[]  
**Attributes:** @IsArray() @IsUUID('4', { each: true }) @IsOptional() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Quantity Discount Creation Data Structure
    
**Requirement Ids:**
    
    - REQ-PROMO-008
    
**Purpose:** Defines the data structure for creating quantity-based discounts, including scope and tiers.  
**Logic Description:** Extends PromotionBaseDto. Includes `scope` (per item, per product line, total cart), an array of `tiers`, and optional `eligibleProductIds` or `eligibleCollectionIds`.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for creating new quantity-based discounts.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.QuantityDiscount  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/quantity-discount/quantity-discount-tier.dto.ts  
**Description:** DTO for defining a single tier in a quantity-based discount.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** QuantityDiscountTierDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/quantity-discount  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** minimumQuantity  
**Type:** number  
**Attributes:** @IsInt() @Min(1) @ApiProperty()  
    - **Name:** discountType  
**Type:** DiscountCodeType  
**Attributes:** @IsEnum(DiscountCodeType) @ApiProperty({ enum: DiscountCodeType })  
    - **Name:** discountValue  
**Type:** number  
**Attributes:** @IsNumber() @Min(0) @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Quantity Discount Tier Definition
    
**Requirement Ids:**
    
    - REQ-PROMO-008
    
**Purpose:** Specifies the minimum quantity and corresponding discount for a tier in a quantity discount promotion.  
**Logic Description:** Contains `minimumQuantity`, `discountType` (percentage or fixed amount), and `discountValue`.  
**Documentation:**
    
    - **Summary:** Defines a tier for a quantity-based discount, including quantity threshold and discount details.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.QuantityDiscount  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/quantity-discount/update-quantity-discount.dto.ts  
**Description:** DTO for updating an existing quantity-based discount. Uses PartialType.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** UpdateQuantityDiscountDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/quantity-discount  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Quantity Discount Update Data Structure
    
**Requirement Ids:**
    
    - REQ-PROMO-008
    
**Purpose:** Defines the data structure for partially updating quantity discount properties.  
**Logic Description:** Extends PartialType(CreateQuantityDiscountDto). Allows updating fields from CreateQuantityDiscountDto and its base class.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for updating existing quantity-based discounts. Allows partial updates.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.QuantityDiscount  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/quantity-discount/quantity-discount.response.dto.ts  
**Description:** DTO representing a quantity-based discount in API responses.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** QuantityDiscountResponseDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/quantity-discount  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Quantity Discount Response Data Structure
    
**Requirement Ids:**
    
    - REQ-PROMO-008
    
**Purpose:** Defines the structure of quantity-based discount data returned by the API.  
**Logic Description:** Extends CreateQuantityDiscountDto. Includes `id` and inherits common promotion properties and quantity discount specific configurations.  
**Documentation:**
    
    - **Summary:** Data Transfer Object representing a quantity-based discount as returned by the API.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.QuantityDiscount  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/promotion-interaction/set-promotion-interaction-rules.dto.ts  
**Description:** DTO for defining global or merchant-level promotion interaction rules.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** SetPromotionInteractionRulesDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/promotion-interaction  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** defaultStackingBehavior  
**Type:** 'NONE' | 'ALL_ALLOWED'  
**Attributes:** @IsIn(['NONE', 'ALL_ALLOWED']) @ApiProperty({ enum: ['NONE', 'ALL_ALLOWED'] })  
    - **Name:** explicitlyStackableCombinations  
**Type:** StackableCombinationDto[]  
**Attributes:** @IsArray() @ValidateNested({ each: true }) @Type(() => StackableCombinationDto) @IsOptional() @ApiPropertyOptional({ type: () => [StackableCombinationDto]})  
    - **Name:** precedenceRules  
**Type:** PromotionPrecedenceRuleDto[]  
**Attributes:** @IsArray() @ValidateNested({ each: true }) @Type(() => PromotionPrecedenceRuleDto) @IsOptional() @ApiPropertyOptional({ type: () => [PromotionPrecedenceRuleDto]})  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Global Promotion Interaction Rule Configuration
    
**Requirement Ids:**
    
    - REQ-PROMO-006
    
**Purpose:** Allows merchants to define overarching rules for how different promotions interact, such as default stacking behavior and precedence.  
**Logic Description:** Contains `defaultStackingBehavior`, an array of `explicitlyStackableCombinations` (pairs of promotion IDs), and an array of `precedenceRules` (e.g., promotionTypeIdA takes precedence over promotionTypeIdB).  
**Documentation:**
    
    - **Summary:** Data Transfer Object for setting global or merchant-wide promotion interaction rules.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.PromotionInteraction  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/promotion-interaction/stackable-combination.dto.ts  
**Description:** DTO for defining a pair of promotions that can be stacked.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 0  
**Name:** StackableCombinationDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/promotion-interaction  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** promotionIdA  
**Type:** string  
**Attributes:** @IsUUID('4') @ApiProperty()  
    - **Name:** promotionIdB  
**Type:** string  
**Attributes:** @IsUUID('4') @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Stackable Promotion Pair
    
**Requirement Ids:**
    
    - REQ-PROMO-006
    
**Purpose:** Defines a specific pair of promotions that are allowed to be applied together.  
**Logic Description:** Contains `promotionIdA` and `promotionIdB`.  
**Documentation:**
    
    - **Summary:** Represents a pair of promotion IDs that are explicitly allowed to stack.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.PromotionInteraction  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/dto/promotion-interaction/promotion-precedence-rule.dto.ts  
**Description:** DTO for defining precedence between promotion types or specific promotions.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 0  
**Name:** PromotionPrecedenceRuleDto  
**Type:** DTO  
**Relative Path:** modules/promotions-offers/api/v1/dto/promotion-interaction  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** higherPrecedencePromotionIdOrType  
**Type:** string  
**Attributes:** @IsString() @ApiProperty()  
    - **Name:** lowerPrecedencePromotionIdOrType  
**Type:** string  
**Attributes:** @IsString() @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Promotion Precedence Rule
    
**Requirement Ids:**
    
    - REQ-PROMO-006
    
**Purpose:** Defines which promotion (or type of promotion) takes precedence if multiple conflicting promotions are applicable.  
**Logic Description:** Contains `higherPrecedencePromotionIdOrType` and `lowerPrecedencePromotionIdOrType`. The types could be enums or specific IDs.  
**Documentation:**
    
    - **Summary:** Represents a rule where one promotion (or type) takes precedence over another.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Dto.PromotionInteraction  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/promotions-offers/api/v1/controllers/discount-codes.controller.ts  
**Description:** API controller for managing discount code promotions. Handles CRUD operations and batch generation for discount codes.  
**Template:** NestJS Controller Template  
**Dependancy Level:** 3  
**Name:** DiscountCodesController  
**Type:** Controller  
**Relative Path:** modules/promotions-offers/api/v1/controllers  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    - RESTController
    
**Members:**
    
    - **Name:** promotionsOffersService  
**Type:** IPromotionsOffersService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** create  
**Parameters:**
    
    - @Req() req
    - @Body() createDiscountCodeDto: CreateDiscountCodeDto
    
**Return Type:** Promise<DiscountCodeResponseDto>  
**Attributes:** @Post() @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Create a new discount code' }) @ApiBody({ type: CreateDiscountCodeDto }) @ApiResponse({ status: 201, type: DiscountCodeResponseDto })  
    - **Name:** findAll  
**Parameters:**
    
    - @Req() req
    - @Query() query: PagedQueryDto
    
**Return Type:** Promise<PagedResponseDto<DiscountCodeResponseDto>>  
**Attributes:** @Get() @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Get all discount codes for merchant' }) @ApiResponse({ status: 200, type: PagedResponseDto<DiscountCodeResponseDto> })  
    - **Name:** findOne  
**Parameters:**
    
    - @Req() req
    - @Param('id', ParseUUIDPipe) id: string
    
**Return Type:** Promise<DiscountCodeResponseDto>  
**Attributes:** @Get(':id') @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Get a specific discount code' }) @ApiResponse({ status: 200, type: DiscountCodeResponseDto })  
    - **Name:** update  
**Parameters:**
    
    - @Req() req
    - @Param('id', ParseUUIDPipe) id: string
    - @Body() updateDiscountCodeDto: UpdateDiscountCodeDto
    
**Return Type:** Promise<DiscountCodeResponseDto>  
**Attributes:** @Put(':id') @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Update a discount code' }) @ApiBody({ type: UpdateDiscountCodeDto }) @ApiResponse({ status: 200, type: DiscountCodeResponseDto })  
    - **Name:** remove  
**Parameters:**
    
    - @Req() req
    - @Param('id', ParseUUIDPipe) id: string
    
**Return Type:** Promise<void>  
**Attributes:** @Delete(':id') @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Delete a discount code' }) @HttpCode(204)  
    - **Name:** batchGenerate  
**Parameters:**
    
    - @Req() req
    - @Body() batchDto: BatchGenerateDiscountCodesDto
    
**Return Type:** Promise<DiscountCodeResponseDto[]>  
**Attributes:** @Post('batch-generate') @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Batch generate discount codes' }) @ApiBody({ type: BatchGenerateDiscountCodesDto }) @ApiResponse({ status: 201, type: [DiscountCodeResponseDto] })  
    
**Implemented Features:**
    
    - Discount Code CRUD
    - Batch Discount Code Generation
    
**Requirement Ids:**
    
    - REQ-PROMO-001
    
**Purpose:** Exposes HTTP endpoints for merchants to create, read, update, delete, and batch generate discount codes.  
**Logic Description:** Uses @Controller('/discount-codes') decorator. Injects IPromotionsOffersService. Each method maps to an HTTP verb and route, uses DTOs for request/response, validates input using pipes (e.g., ParseUUIDPipe), and calls the corresponding service method. Merchant ID is extracted from request (e.g., JWT).  
**Documentation:**
    
    - **Summary:** Controller for managing discount code promotions. Provides endpoints for CRUD operations and batch generation.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/promotions-offers/api/v1/controllers/bogo-promotions.controller.ts  
**Description:** API controller for managing Buy One, Get One Free (BOGO) promotions. Handles CRUD operations for BOGO offers.  
**Template:** NestJS Controller Template  
**Dependancy Level:** 3  
**Name:** BogoPromotionsController  
**Type:** Controller  
**Relative Path:** modules/promotions-offers/api/v1/controllers  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    - RESTController
    
**Members:**
    
    - **Name:** promotionsOffersService  
**Type:** IPromotionsOffersService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** create  
**Parameters:**
    
    - @Req() req
    - @Body() createBogoDto: CreateBogoPromotionDto
    
**Return Type:** Promise<BogoPromotionResponseDto>  
**Attributes:** @Post() @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Create a new BOGO promotion' }) @ApiBody({ type: CreateBogoPromotionDto }) @ApiResponse({ status: 201, type: BogoPromotionResponseDto })  
    - **Name:** findAll  
**Parameters:**
    
    - @Req() req
    - @Query() query: PagedQueryDto
    
**Return Type:** Promise<PagedResponseDto<BogoPromotionResponseDto>>  
**Attributes:** @Get() @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Get all BOGO promotions for merchant' }) @ApiResponse({ status: 200, type: PagedResponseDto<BogoPromotionResponseDto> })  
    - **Name:** findOne  
**Parameters:**
    
    - @Req() req
    - @Param('id', ParseUUIDPipe) id: string
    
**Return Type:** Promise<BogoPromotionResponseDto>  
**Attributes:** @Get(':id') @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Get a specific BOGO promotion' }) @ApiResponse({ status: 200, type: BogoPromotionResponseDto })  
    - **Name:** update  
**Parameters:**
    
    - @Req() req
    - @Param('id', ParseUUIDPipe) id: string
    - @Body() updateBogoDto: UpdateBogoPromotionDto
    
**Return Type:** Promise<BogoPromotionResponseDto>  
**Attributes:** @Put(':id') @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Update a BOGO promotion' }) @ApiBody({ type: UpdateBogoPromotionDto }) @ApiResponse({ status: 200, type: BogoPromotionResponseDto })  
    - **Name:** remove  
**Parameters:**
    
    - @Req() req
    - @Param('id', ParseUUIDPipe) id: string
    
**Return Type:** Promise<void>  
**Attributes:** @Delete(':id') @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Delete a BOGO promotion' }) @HttpCode(204)  
    
**Implemented Features:**
    
    - BOGO Promotion CRUD
    
**Requirement Ids:**
    
    - REQ-PROMO-003
    - REQ-PROMO-004
    
**Purpose:** Exposes HTTP endpoints for merchants to create, read, update, and delete BOGO promotions.  
**Logic Description:** Uses @Controller('/bogo-promotions') decorator. Injects IPromotionsOffersService. Methods map to HTTP verbs, use BOGO-specific DTOs, validate input, and delegate to the service. Merchant ID is extracted from request.  
**Documentation:**
    
    - **Summary:** Controller for managing BOGO promotions. Provides endpoints for CRUD operations.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/promotions-offers/api/v1/controllers/quantity-discounts.controller.ts  
**Description:** API controller for managing quantity-based discount promotions. Handles CRUD operations for quantity discounts.  
**Template:** NestJS Controller Template  
**Dependancy Level:** 3  
**Name:** QuantityDiscountsController  
**Type:** Controller  
**Relative Path:** modules/promotions-offers/api/v1/controllers  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    - RESTController
    
**Members:**
    
    - **Name:** promotionsOffersService  
**Type:** IPromotionsOffersService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** create  
**Parameters:**
    
    - @Req() req
    - @Body() createDto: CreateQuantityDiscountDto
    
**Return Type:** Promise<QuantityDiscountResponseDto>  
**Attributes:** @Post() @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Create a new quantity discount' }) @ApiBody({ type: CreateQuantityDiscountDto }) @ApiResponse({ status: 201, type: QuantityDiscountResponseDto })  
    - **Name:** findAll  
**Parameters:**
    
    - @Req() req
    - @Query() query: PagedQueryDto
    
**Return Type:** Promise<PagedResponseDto<QuantityDiscountResponseDto>>  
**Attributes:** @Get() @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Get all quantity discounts for merchant' }) @ApiResponse({ status: 200, type: PagedResponseDto<QuantityDiscountResponseDto> })  
    - **Name:** findOne  
**Parameters:**
    
    - @Req() req
    - @Param('id', ParseUUIDPipe) id: string
    
**Return Type:** Promise<QuantityDiscountResponseDto>  
**Attributes:** @Get(':id') @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Get a specific quantity discount' }) @ApiResponse({ status: 200, type: QuantityDiscountResponseDto })  
    - **Name:** update  
**Parameters:**
    
    - @Req() req
    - @Param('id', ParseUUIDPipe) id: string
    - @Body() updateDto: UpdateQuantityDiscountDto
    
**Return Type:** Promise<QuantityDiscountResponseDto>  
**Attributes:** @Put(':id') @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Update a quantity discount' }) @ApiBody({ type: UpdateQuantityDiscountDto }) @ApiResponse({ status: 200, type: QuantityDiscountResponseDto })  
    - **Name:** remove  
**Parameters:**
    
    - @Req() req
    - @Param('id', ParseUUIDPipe) id: string
    
**Return Type:** Promise<void>  
**Attributes:** @Delete(':id') @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Delete a quantity discount' }) @HttpCode(204)  
    
**Implemented Features:**
    
    - Quantity Discount CRUD
    
**Requirement Ids:**
    
    - REQ-PROMO-008
    
**Purpose:** Exposes HTTP endpoints for merchants to create, read, update, and delete quantity-based discount promotions.  
**Logic Description:** Uses @Controller('/quantity-discounts') decorator. Injects IPromotionsOffersService. Methods map to HTTP verbs, use quantity discount-specific DTOs, validate input, and delegate to the service. Merchant ID is extracted from request.  
**Documentation:**
    
    - **Summary:** Controller for managing quantity-based discount promotions. Provides endpoints for CRUD operations.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/promotions-offers/api/v1/controllers/promotions.controller.ts  
**Description:** API controller for managing general promotion aspects like interaction rules and activation status.  
**Template:** NestJS Controller Template  
**Dependancy Level:** 3  
**Name:** PromotionsController  
**Type:** Controller  
**Relative Path:** modules/promotions-offers/api/v1/controllers  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    - RESTController
    
**Members:**
    
    - **Name:** promotionsOffersService  
**Type:** IPromotionsOffersService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** setInteractionRules  
**Parameters:**
    
    - @Req() req
    - @Body() dto: SetPromotionInteractionRulesDto
    
**Return Type:** Promise<void>  
**Attributes:** @Post('interaction-rules') @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Set promotion interaction rules for the merchant' }) @ApiBody({ type: SetPromotionInteractionRulesDto }) @HttpCode(204)  
    - **Name:** getInteractionRules  
**Parameters:**
    
    - @Req() req
    
**Return Type:** Promise<PromotionInteractionRuleDto[]>  
**Attributes:** @Get('interaction-rules') @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Get promotion interaction rules for the merchant' }) @ApiResponse({ status: 200, type: [PromotionInteractionRuleDto]})  
    - **Name:** activatePromotion  
**Parameters:**
    
    - @Req() req
    - @Param('promotionId', ParseUUIDPipe) promotionId: string
    - @Query('type') promotionType: string
    
**Return Type:** Promise<void>  
**Attributes:** @Post(':promotionId/activate') @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Activate a promotion' }) @HttpCode(204)  
    - **Name:** deactivatePromotion  
**Parameters:**
    
    - @Req() req
    - @Param('promotionId', ParseUUIDPipe) promotionId: string
    - @Query('type') promotionType: string
    
**Return Type:** Promise<void>  
**Attributes:** @Post(':promotionId/deactivate') @UseGuards(MerchantAuthGuard) @ApiOperation({ summary: 'Deactivate a promotion' }) @HttpCode(204)  
    
**Implemented Features:**
    
    - Promotion Interaction Rule Management
    - Promotion Activation/Deactivation
    
**Requirement Ids:**
    
    - REQ-PROMO-006
    - REQ-PROMO-007
    
**Purpose:** Exposes HTTP endpoints for managing global promotion settings like interaction rules and manually activating/deactivating promotions.  
**Logic Description:** Uses @Controller('/promotions') decorator. Injects IPromotionsOffersService. Methods handle setting/getting interaction rules and changing promotion statuses for those requiring merchant activation. Merchant ID extracted from request.  
**Documentation:**
    
    - **Summary:** Controller for general promotion management tasks, including interaction rules and activation status.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/promotions-offers/api/v1/services/promotions-offers.service.ts  
**Description:** Service implementation for managing promotions and offers. Contains business logic for creating, updating, retrieving promotions, and handling eligibility and interaction rules.  
**Template:** NestJS Service Template  
**Dependancy Level:** 3  
**Name:** PromotionsOffersService  
**Type:** Service  
**Relative Path:** modules/promotions-offers/api/v1/services  
**Repository Id:** REPO-PROMO-005  
**Pattern Ids:**
    
    - DomainService
    
**Members:**
    
    - **Name:** discountCodeRepository  
**Type:** IDiscountCodeRepository  
**Attributes:** private readonly  
    - **Name:** bogoPromotionRepository  
**Type:** IBogoPromotionRepository  
**Attributes:** private readonly  
    - **Name:** quantityDiscountRepository  
**Type:** IQuantityDiscountRepository  
**Attributes:** private readonly  
    - **Name:** promotionInteractionRuleRepository  
**Type:** IPromotionInteractionRuleRepository  
**Attributes:** private readonly  
    - **Name:** corePlatformService  
**Type:** ICorePlatformService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** createDiscountCode  
**Parameters:**
    
    - merchantId: string
    - dto: CreateDiscountCodeDto
    
**Return Type:** Promise<DiscountCodeResponseDto>  
**Attributes:** public async  
    - **Name:** getDiscountCodes  
**Parameters:**
    
    - merchantId: string
    - query: PagedQueryDto
    
**Return Type:** Promise<PagedResponseDto<DiscountCodeResponseDto>>  
**Attributes:** public async  
    - **Name:** getDiscountCodeById  
**Parameters:**
    
    - merchantId: string
    - id: string
    
**Return Type:** Promise<DiscountCodeResponseDto>  
**Attributes:** public async  
    - **Name:** updateDiscountCode  
**Parameters:**
    
    - merchantId: string
    - id: string
    - dto: UpdateDiscountCodeDto
    
**Return Type:** Promise<DiscountCodeResponseDto>  
**Attributes:** public async  
    - **Name:** deleteDiscountCode  
**Parameters:**
    
    - merchantId: string
    - id: string
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** batchGenerateDiscountCodes  
**Parameters:**
    
    - merchantId: string
    - dto: BatchGenerateDiscountCodesDto
    
**Return Type:** Promise<DiscountCodeResponseDto[]>  
**Attributes:** public async  
    - **Name:** createBogoPromotion  
**Parameters:**
    
    - merchantId: string
    - dto: CreateBogoPromotionDto
    
**Return Type:** Promise<BogoPromotionResponseDto>  
**Attributes:** public async  
    - **Name:** getBogoPromotions  
**Parameters:**
    
    - merchantId: string
    - query: PagedQueryDto
    
**Return Type:** Promise<PagedResponseDto<BogoPromotionResponseDto>>  
**Attributes:** public async  
    - **Name:** getBogoPromotionById  
**Parameters:**
    
    - merchantId: string
    - id: string
    
**Return Type:** Promise<BogoPromotionResponseDto>  
**Attributes:** public async  
    - **Name:** updateBogoPromotion  
**Parameters:**
    
    - merchantId: string
    - id: string
    - dto: UpdateBogoPromotionDto
    
**Return Type:** Promise<BogoPromotionResponseDto>  
**Attributes:** public async  
    - **Name:** deleteBogoPromotion  
**Parameters:**
    
    - merchantId: string
    - id: string
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** createQuantityDiscount  
**Parameters:**
    
    - merchantId: string
    - dto: CreateQuantityDiscountDto
    
**Return Type:** Promise<QuantityDiscountResponseDto>  
**Attributes:** public async  
    - **Name:** getQuantityDiscounts  
**Parameters:**
    
    - merchantId: string
    - query: PagedQueryDto
    
**Return Type:** Promise<PagedResponseDto<QuantityDiscountResponseDto>>  
**Attributes:** public async  
    - **Name:** getQuantityDiscountById  
**Parameters:**
    
    - merchantId: string
    - id: string
    
**Return Type:** Promise<QuantityDiscountResponseDto>  
**Attributes:** public async  
    - **Name:** updateQuantityDiscount  
**Parameters:**
    
    - merchantId: string
    - id: string
    - dto: UpdateQuantityDiscountDto
    
**Return Type:** Promise<QuantityDiscountResponseDto>  
**Attributes:** public async  
    - **Name:** deleteQuantityDiscount  
**Parameters:**
    
    - merchantId: string
    - id: string
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** setPromotionInteractionRules  
**Parameters:**
    
    - merchantId: string
    - dto: SetPromotionInteractionRulesDto
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** getPromotionInteractionRules  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<PromotionInteractionRuleDto[]>  
**Attributes:** public async  
    - **Name:** activatePromotion  
**Parameters:**
    
    - merchantId: string
    - promotionId: string
    - promotionType: string
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** deactivatePromotion  
**Parameters:**
    
    - merchantId: string
    - promotionId: string
    - promotionType: string
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** checkAndApplyEligibility  
**Parameters:**
    
    - merchantId: string
    - promotion: PromotionBaseDto
    - customerId: string
    
**Return Type:** Promise<boolean>  
**Attributes:** private async  
    
**Implemented Features:**
    
    - Discount Code Logic
    - BOGO Logic
    - Quantity Discount Logic
    - Promotion Interaction Logic
    - Promotion Activation Logic
    - Customer Eligibility Checks
    
**Requirement Ids:**
    
    - REQ-PROMO-001
    - REQ-PROMO-002
    - REQ-PROMO-003
    - REQ-PROMO-004
    - REQ-PROMO-005
    - REQ-PROMO-006
    - REQ-PROMO-007
    - REQ-PROMO-008
    - REQ-CPSI-004
    
**Purpose:** Implements the business logic for all promotion and offer management functionalities, interacting with data repositories and external services.  
**Logic Description:** Implements IPromotionsOffersService. Handles validation, data transformation, interaction with repositories (assumed to be injected, e.g., for PostgreSQL persistence). For REQ-CPSI-004, it calls `corePlatformService.verifyCustomerEligibility`. Manages BOGO application logic (REQ-PROMO-004). Handles code generation, uniqueness checks. For REQ-PROMO-002, ensures data access calls are efficient and considers archiving if logic is here.  
**Documentation:**
    
    - **Summary:** Core service for managing all aspects of promotions and offers, including creation, updates, retrieval, and application of business rules.
    
**Namespace:** AdManager.PromotionsOffers.Api.V1.Services  
**Metadata:**
    
    - **Category:** ApplicationService
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableBogoLowestPriceOverrideConfig
  - enableAdvancedPromotionInteractionRules
  
- **Database Configs:**
  
  - PROMOTIONS_DB_CONNECTION_STRING (if not using shared)
  


---

