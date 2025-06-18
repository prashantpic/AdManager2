# Software Design Specification: AffiliateMarketing.ApiEndpoints

## 1. Introduction

### 1.1 Purpose
This document provides a detailed software design specification for the `AffiliateMarketing.ApiEndpoints` repository. This repository is responsible for exposing RESTful API endpoints to manage affiliate marketing programs within the Ad Manager Platform. It serves merchant users, affiliate users (via their portal), and public registration functionalities.

### 1.2 Scope
The scope of this document covers the design of all NestJS controllers, services, DTOs, guards, decorators, and modules within the `AffiliateMarketing.ApiEndpoints` repository. This includes:
-   Merchant-facing APIs for program creation, affiliate management, commission configuration, conversion tracking, and payout management.
-   Affiliate-facing APIs for accessing performance data, tracking links, and payout history.
-   Public APIs for affiliate registration.
-   Internal API for conversion tracking.

This document does not cover the design of the data persistence layer (repositories), external third-party integrations beyond the API contract, or the frontend UI implementations.

### 1.3 Definitions and Acronyms
-   **API**: Application Programming Interface
-   **REST**: Representational State Transfer
-   **JSON**: JavaScript Object Notation
-   **JWT**: JSON Web Token
-   **DTO**: Data Transfer Object
-   **CRUD**: Create, Read, Update, Delete
-   **RBAC**: Role-Based Access Control
-   **SDK**: Software Development Kit
-   **REQ-AMP-XXX**: Requirement ID for Affiliate Marketing Platform features.

### 1.4 References
-   User Requirements Document (Implicitly via `requirements_map`)
-   System Architecture Document
-   `AffiliateMarketing.ApiEndpoints` Repository Definition (`file_structure_json`)

## 2. System Overview
The `AffiliateMarketing.ApiEndpoints` module is a NestJS-based microservice responsible for handling all API requests related to affiliate marketing. It follows a standard layered architecture:
-   **Controllers**: Handle incoming HTTP requests, validate inputs using DTOs, and delegate business logic to services.
-   **Services**: Encapsulate core business logic, interact with (conceptual) data repositories, and perform data transformations.
-   **DTOs**: Define the structure and validation rules for data exchanged via APIs.
-   **Guards**: Implement authentication and authorization logic.
-   **Decorators**: Provide custom metadata or request manipulation utilities.

This module interacts with an API Gateway (e.g., Amazon API Gateway) which handles initial request routing, SSL termination, and potentially coarse-grained authentication.

## 3. API Design

### 3.1 General Principles
-   **RESTful Architecture**: APIs will adhere to REST principles, using standard HTTP methods (GET, POST, PUT, DELETE, PATCH).
-   **JSON Payload**: All request and response bodies will use JSON.
-   **Statelessness**: Each request from a client to the server must contain all the information needed to understand the request.
-   **Standard HTTP Status Codes**: Appropriate HTTP status codes will be used to indicate the outcome of API requests (e.g., 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error).

### 3.2 Authentication and Authorization
-   **Authentication**: All protected endpoints will require JWT-based authentication. A `JwtAuthGuard` will be used to validate the JWT present in the `Authorization` header (Bearer token).
-   **Authorization**: Role-Based Access Control (RBAC) will be implemented using a `RolesGuard` and a custom `@Roles()` decorator. Specific roles (e.g., `MerchantAdmin`, `CampaignManager`, `Affiliate`) will be required for accessing certain endpoints.
-   **User Context**: An `@AuthUser()` decorator will be available to extract authenticated user information (e.g., `merchantId`, `affiliateId`, roles) within controller methods.

### 3.3 Error Handling
-   NestJS built-in exception filters will be used for common HTTP errors.
-   Custom exception filters can be added for specific error handling scenarios.
-   Validation errors from DTOs (using `class-validator`) will automatically result in a 400 Bad Request response with detailed error messages.
-   Service layer errors will be translated into appropriate HTTP exceptions.

### 3.4 Versioning
The API endpoints are versioned under `/api/v1/`. Future versions will use a new path segment (e.g., `/api/v2/`).

### 3.5 API Documentation
API documentation will be automatically generated using `@nestjs/swagger` based on decorators in controllers and DTOs. The Swagger UI will be accessible at a designated endpoint (e.g., `/api-docs`).

## 4. Module Structure and Components

### 4.1 Root Application Files
-   **`src/main.ts`**:
    -   Purpose: Application entry point.
    -   Logic:
        -   Initializes `NestFactory` to create the NestJS application instance using `AppModule`.
        -   Applies global `ValidationPipe` to enable DTO validation using `class-validator`.
        -   Sets up Swagger documentation using `DocumentBuilder` and `SwaggerModule.createDocument()` & `SwaggerModule.setup()`.
        -   Starts the HTTP server, listening on a port defined by an environment variable or a default.
-   **`src/app.module.ts`**:
    -   Purpose: Root module of the application.
    -   Logic:
        -   Imports `AffiliateMarketingV1Module`.
        -   May import global configuration modules (e.g., `ConfigModule` for environment variables) or common utility modules if any.

### 4.2 Affiliate Marketing Module (`src/modules/affiliate-marketing/api/v1/`)

#### 4.2.1 `affiliate-marketing.v1.module.ts`
-   Purpose: Main module for V1 of the Affiliate Marketing API.
-   Logic:
    -   Imports all controllers:
        -   `AffiliateProgramsMerchantController`
        -   `AffiliateApplicationsMerchantController`
        -   `AffiliateManagementMerchantController`
        -   `AffiliateCommissionsMerchantController`
        -   `AffiliatePayoutsMerchantController`
        -   `AffiliateDashboardMerchantController`
        -   `AffiliatePortalController`
        -   `AffiliateRegistrationPublicController`
        -   `AffiliateConversionsController`
    -   Declares `AffiliateMarketingService` as a provider.
    -   May import `PassportModule.register({ defaultStrategy: 'jwt' })` for authentication.

#### 4.2.2 Constants (`constants/affiliate.constants.ts`)
-   Purpose: Centralized constant values.
-   Definitions:
    -   `export const DEFAULT_COOKIE_WINDOW_DAYS: number = 30;` (REQ-AMP-004)
    -   `export const COMMISSION_TYPE_PERCENTAGE: string = 'percentage';` (REQ-AMP-003)
    -   `export const COMMISSION_TYPE_FLAT_FEE: string = 'flat_fee';` (REQ-AMP-003)
    -   Other potential constants: Payout status enums, Application status enums.

#### 4.2.3 Decorators (`decorators/`)
-   **`roles.decorator.ts`**:
    -   `export const ROLES_KEY = 'roles';`
    -   `export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);`
    -   Purpose: Attaches role metadata to route handlers for `RolesGuard`.
-   **`user.decorator.ts`**:
    -   `export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => { const request = ctx.switchToHttp().getRequest(); return request.user; });`
    -   Purpose: Extracts the `user` object (populated by `JwtAuthGuard`) from the request.

#### 4.2.4 Data Transfer Objects (DTOs) (`dto/`)

This section details the DTOs. Each DTO class property will be annotated with `@ApiProperty()` or `@ApiPropertyOptional()` from `@nestjs/swagger` and appropriate validation decorators from `class-validator`.

**Common DTO Structure Example:**
typescript
// generic-example.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, Min, ValidateNested, IsArray, IsEmail, IsUrl, Length, IsDateString, IsBoolean, IsInt, IsIn } from 'class-validator';
import { Type } from 'class-transformer'; // For @ValidateNested with @Type

export class GenericExampleDto {
  @ApiProperty({ description: 'Unique identifier', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @IsUUID('4')
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ description: 'Optional name field' })
  @IsString()
  @IsOptional()
  name?: string;
}


**Merchant DTOs (`dto/merchant/`)**

-   **Programs (`programs/`)**
    -   **`create-program.dto.ts` (REQ-AMP-001, REQ-AMP-003)**
        -   `name: string` (@IsString, @IsNotEmpty)
        -   `description?: string` (@IsString, @IsOptional)
        -   `cookieWindowDays?: number` (@IsInt, @Min(1), @IsOptional, default: `DEFAULT_COOKIE_WINDOW_DAYS`)
        -   `commissionRules: CreateCommissionRuleDto[]` (@IsArray, @ValidateNested({ each: true }), @Type(() => CreateCommissionRuleDto))
    -   **`update-program.dto.ts` (REQ-AMP-001)**
        -   `name?: string` (@IsString, @IsOptional)
        -   `description?: string` (@IsString, @IsOptional)
        -   `cookieWindowDays?: number` (@IsInt, @Min(1), @IsOptional)
        -   `isActive?: boolean` (@IsBoolean, @IsOptional)
    -   **`program.response.dto.ts` (REQ-AMP-001)**
        -   `id: string`
        -   `merchantId: string`
        -   `name: string`
        -   `description?: string`
        -   `cookieWindowDays: number`
        -   `isActive: boolean`
        -   `commissionStructure: CommissionStructureResponseDto`
        -   `trackingLinkBaseUrl: string` (e.g., `https://[YourDomain]/track?pid={{programId}}&aid={{affiliateId}}&ref={{customRef}}`)
        -   `createdAt: Date`
        -   `updatedAt: Date`

-   **Applications (`applications/`)**
    -   **`approve-affiliate.dto.ts` (REQ-AMP-002)**
        -   `customTrackingCode?: string` (@IsString, @IsOptional, unique within program)
        -   `commissionRuleId?: string` (@IsUUID, @IsOptional, to assign specific rule)
    -   **`application.response.dto.ts` (REQ-AMP-002)**
        -   `applicationId: string`
        -   `affiliateName: string`
        -   `affiliateEmail: string`
        -   `programId: string`
        -   `programName: string`
        -   `status: string` (e.g., 'Pending', 'Approved', 'Rejected')
        -   `submittedAt: Date`
        -   `websiteUrl?: string`
        -   `promotionalMethods?: string`
        -   `processedAt?: Date`
        -   `processedBy?: string` (Merchant Admin User ID)

-   **Commissions (`commissions/`)**
    -   **`create-commission-rule.dto.ts` (REQ-AMP-003)**
        -   `type: string` (@IsString, @IsIn([`COMMISSION_TYPE_PERCENTAGE`, `COMMISSION_TYPE_FLAT_FEE`]))
        -   `value: number` (@IsNumber, @Min(0))
        -   `description?: string` (@IsString, @IsOptional)
        -   `appliesTo?: string` (@IsString, @IsOptional, e.g., 'ALL_PRODUCTS', 'SPECIFIC_CATEGORY_ID', 'SPECIFIC_PRODUCT_ID')
        -   `tierMinAmount?: number` (@IsNumber, @Min(0), @IsOptional, for tiered commissions)
    -   **`commission-structure.response.dto.ts` (REQ-AMP-003)**
        -   `defaultRule: CommissionRuleResponseDto`
        -   `specificRules?: CommissionRuleResponseDto[]`
    -   **`commission-rule.response.dto.ts` (REQ-AMP-003)**
        -   `id: string`
        -   `type: string`
        -   `value: number`
        -   `description?: string`
        -   `appliesTo?: string`
        -   `tierMinAmount?: number`
        -   `isActive: boolean`

-   **Payouts (`payouts/`)**
    -   **`process-payouts.dto.ts` (REQ-AMP-005)**
        -   `affiliateIds?: string[]` (@IsArray, @IsUUID('4', { each: true }), @IsOptional, if not provided, process all eligible)
        -   `paymentDate: Date` (@IsDateString)
        -   `notes?: string` (@IsString, @IsOptional)
        -   `paymentMethodDetails?: string` (@IsString, @IsOptional, e.g., 'Manual Bank Transfer Ref: XZY')
    -   **`payout.response.dto.ts` (REQ-AMP-005)**
        -   `payoutId: string`
        -   `affiliateId: string`
        -   `affiliateName: string`
        -   `amount: number`
        -   `currency: string` (e.g., 'SAR')
        -   `paymentDate: Date`
        -   `status: string` (e.g., 'Pending', 'Processing', 'Paid', 'Failed')
        -   `periodStartDate: Date`
        -   `periodEndDate: Date`
        -   `notes?: string`
        -   `paymentMethodDetails?: string`

-   **Dashboard (`dashboard/`)**
    -   **`dashboard-metrics.response.dto.ts` (REQ-AMP-001)**
        -   `totalAffiliates: number`
        -   `activeAffiliates: number`
        -   `pendingApplications: number`
        -   `totalConversionsLast30Days: number`
        -   `totalSalesVolumeLast30Days: number`
        -   `totalCommissionsPaidLast30Days: number`
        -   `totalCommissionsPending: number`
        -   `topPerformingAffiliates: TopAffiliatePerformanceDto[]` (e.g., top 5 by conversions or sales)
    -   **`top-affiliate-performance.dto.ts` (REQ-AMP-001)** (Used as nested DTO)
        -   `affiliateId: string`
        -   `affiliateName: string`
        -   `conversions: number`
        -   `salesVolume: number`
        -   `earnedCommissions: number`

**Affiliate Portal DTOs (`dto/affiliate/portal/`)** (REQ-AMP-006)

-   **`affiliate-performance.response.dto.ts`**
    -   `clicks: number`
    -   `conversions: number`
    -   `conversionRate: number` (calculated)
    -   `earnedCommissions: number` (total lifetime or selected period)
    -   `pendingCommissions: number`
    -   `paidCommissions: number`
    -   `nextPayoutDate?: Date`
    -   `currentPeriodMetrics: { clicks: number, conversions: number, earned: number }`
-   **`tracking-link.response.dto.ts` (REQ-AMP-001 for generation, REQ-AMP-006 for affiliate access)**
    -   `programId: string`
    -   `programName: string`
    -   `trackingUrl: string`
    -   `couponCode?: string` (if generated and associated)
-   **`payout-history.response.dto.ts`**
    -   `payouts: PayoutResponseDto[]` (uses the merchant payout DTO for consistency)

**Public Registration DTO (`dto/public/registration/`)**

-   **`affiliate-registration.request.dto.ts` (REQ-AMP-002)**
    -   `programId: string` (@IsUUID('4'), @IsNotEmpty)
    -   `name: string` (@IsString, @IsNotEmpty)
    -   `email: string` (@IsEmail, @IsNotEmpty)
    -   `websiteUrl?: string` (@IsUrl, @IsOptional)
    -   `promotionalMethods?: string` (@IsString, @IsOptional, @Length(10, 500))
    -   `password: string` (@IsString, @MinLength(8), @IsNotEmpty)
    -   `agreedToTerms: boolean` (@IsBoolean(), @IsIn([true]), message: 'Agreement to terms is required.')

**Conversion Tracking DTOs (`dto/conversions/`)** (REQ-AMP-004)

-   **`track-conversion.dto.ts`**
    -   `trackingCodeOrCoupon: string` (@IsString, @IsNotEmpty)
    -   `orderId: string` (@IsString, @IsNotEmpty, unique)
    -   `orderAmount: number` (@IsNumber, @Min(0))
    -   `currency: string` (@IsString, @IsNotEmpty, @Length(3, 3))
    -   `conversionTimestamp?: Date` (@IsDateString, @IsOptional, defaults to now if not provided)
    -   `customerIp?: string` (@IsIP, @IsOptional)
    -   `userAgent?: string` (@IsString, @IsOptional)
    -   `items?: { productId: string, quantity: number, unitPrice: number }[]` (@IsArray, @ValidateNested({each: true}), @Type(() => ConversionItemDto), @IsOptional)
-   **`ConversionItemDto`** (Nested within `TrackConversionDto`)
    -   `productId: string` (@IsString, @IsNotEmpty)
    -   `quantity: number` (@IsInt, @Min(1))
    -   `unitPrice: number` (@IsNumber, @Min(0))
-   **`conversion.response.dto.ts`**
    -   `conversionId: string`
    -   `affiliateId: string`
    -   `programId: string`
    -   `orderId: string`
    -   `commissionAmount: number`
    -   `commissionCurrency: string`
    -   `status: string` (e.g., 'Tracked', 'Verified', 'PendingPayout', 'Paid', 'Rejected')
    -   `conversionTimestamp: Date`
    -   `attributionType: string` (e.g., 'LastClick', 'Coupon')

**Affiliate Response DTO (General Purpose)**
-   **`affiliate.response.dto.ts`** (To be defined in `dto/common/` or a specific merchant/affiliate subfolder if context varies)
    -   `id: string`
    -   `name: string`
    -   `email: string`
    -   `status: string` (e.g., 'PendingApproval', 'Active', 'Suspended', 'Rejected')
    -   `programId: string`
    -   `trackingCode?: string`
    -   `createdAt: Date`
    -   `approvedAt?: Date`

#### 4.2.5 Guards (`guards/`)
-   **`jwt-auth.guard.ts`**:
    -   Extends `AuthGuard('jwt')` from `@nestjs/passport`.
    -   Standard implementation, relies on a configured JWT strategy (likely defined in a separate auth module or globally).
-   **`roles.guard.ts`**:
    -   Implements `CanActivate`.
    -   Constructor injects `Reflector`.
    -   `canActivate(context: ExecutionContext): boolean`:
        -   Retrieves required roles using `this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()])`.
        -   If no roles are required, access is granted.
        -   Retrieves the `user` object from `context.switchToHttp().getRequest()`.
        -   Checks if `user.roles` (assuming user object has a `roles` array) includes any of the `requiredRoles`.

#### 4.2.6 Service (`services/affiliate-marketing.service.ts`)
-   Class: `AffiliateMarketingService`
-   Purpose: Encapsulates all business logic. Injected into controllers.
-   Dependencies (Conceptual repositories, to be injected via constructor):
    -   `private readonly affiliateProgramRepository: IAffiliateProgramRepository`
    -   `private readonly affiliateRepository: IAffiliateRepository`
    -   `private readonly affiliateApplicationRepository: IAffiliateApplicationRepository`
    -   `private readonly commissionRuleRepository: ICommissionRuleRepository`
    -   `private readonly conversionRepository: IConversionRepository`
    -   `private readonly payoutRepository: IPayoutRepository`
    -   `private readonly corePlatformUserService: ICorePlatformUserService` (for fetching user details if needed)
    -   `private readonly notificationService: INotificationService` (for sending emails on application status change, payouts etc.)
-   **Methods (signatures from `file_structure_json`, with brief logic outline):**
    -   `async createProgram(merchantId: string, createProgramDto: CreateProgramDto): Promise<ProgramResponseDto>` (REQ-AMP-001, REQ-AMP-003)
        -   Logic: Validate DTO. Create program entity with associated commission rules. Persist using `affiliateProgramRepository`. Generate base tracking URL structure. Return mapped DTO.
    -   `async getProgramById(merchantId: string, programId: string): Promise<ProgramResponseDto>` (REQ-AMP-001)
        -   Logic: Fetch program by ID for the given merchant. If not found or not owned by merchant, throw `NotFoundException`. Map to DTO.
    -   `async updateProgram(merchantId: string, programId: string, updateProgramDto: UpdateProgramDto): Promise<ProgramResponseDto>` (REQ-AMP-001)
        -   Logic: Fetch program. Validate ownership. Update properties. Persist. Map to DTO.
    -   `async listProgramsForMerchant(merchantId: string): Promise<ProgramResponseDto[]>` (REQ-AMP-001)
        -   Logic: Fetch all programs for the merchant. Map to DTOs.
    -   `async deleteProgram(merchantId: string, programId: string): Promise<void>` (REQ-AMP-001)
        -   Logic: Fetch program. Validate ownership. Mark as inactive/deleted (soft delete preferred). Consider impact on active affiliates.
    -   `async registerAffiliate(registrationDto: AffiliateRegistrationRequestDto): Promise<void>` (REQ-AMP-002)
        -   Logic: Validate program exists. Check if email already registered for this program. Create an affiliate application record with 'Pending' status. Persist using `affiliateApplicationRepository`. Send notification to merchant.
    -   `async getPendingApplications(merchantId: string, programId?: string): Promise<ApplicationResponseDto[]>` (REQ-AMP-002)
        -   Logic: Fetch applications with 'Pending' status for the merchant's programs (optionally filtered by `programId`). Map to DTOs.
    -   `async approveAffiliateApplication(merchantId: string, applicationId: string, approvalDto: ApproveAffiliateDto): Promise<AffiliateResponseDto>` (REQ-AMP-002)
        -   Logic: Fetch application. Validate ownership. Update application status to 'Approved'. Create/activate affiliate record. Generate unique tracking code (if `approvalDto.customTrackingCode` not provided or invalid). Persist changes. Send notification to affiliate. Map to `AffiliateResponseDto`.
    -   `async rejectAffiliateApplication(merchantId: string, applicationId: string): Promise<void>` (REQ-AMP-002)
        -   Logic: Fetch application. Validate ownership. Update application status to 'Rejected'. Persist. Send notification to affiliate.
    -   `async listAffiliatesForMerchant(merchantId: string, programId?: string, status?: string): Promise<AffiliateResponseDto[]>` (REQ-AMP-001)
        -   Logic: Fetch affiliates for the merchant, optionally filtered by program and status. Map to DTO.
    -   `async getAffiliateDetailsForMerchant(merchantId: string, affiliateId: string): Promise<AffiliateResponseDto>` (REQ-AMP-001)
        -   Logic: Fetch specific affiliate if belongs to merchant. Map to DTO.
    -   `async configureCommissionRule(merchantId: string, programId: string, commissionRuleDto: CreateCommissionRuleDto): Promise<CommissionRuleResponseDto>` (REQ-AMP-003)
        -   Logic: Validate program ownership. Create or update commission rule for the program. Persist. Map to DTO.
    -   `async getCommissionStructure(merchantId: string, programId: string): Promise<CommissionStructureResponseDto>` (REQ-AMP-003)
        -   Logic: Fetch commission rules for the program. Map to DTO.
    -   `async trackConversion(trackConversionDto: TrackConversionDto): Promise<ConversionResponseDto>` (REQ-AMP-004)
        -   Logic:
            -   Identify affiliate and program based on `trackingCodeOrCoupon`.
            -   Validate tracking code/coupon, check cookie window (`DEFAULT_COOKIE_WINDOW_DAYS`). Implement last-click attribution logic if multiple touchpoints.
            -   Check for duplicate `orderId`.
            -   Calculate commission based on program's rules and `orderAmount`.
            -   Create conversion record. Persist. Map to DTO.
    -   `async getPendingPayoutsForMerchant(merchantId: string, programId?: string): Promise<PayoutResponseDto[]>` (REQ-AMP-005)
        -   Logic: Aggregate unpaid, verified conversions for affiliates of the merchant. Consider minimum payout thresholds. Map to DTOs.
    -   `async processAffiliatePayouts(merchantId: string, processPayoutsDto: ProcessPayoutsDto): Promise<void>` (REQ-AMP-005)
        -   Logic: Fetch pending payouts for specified affiliates (or all). Mark conversions as 'Paid' or 'Processing'. Create payout records. Persist. Send notifications.
    -   `async getMerchantDashboardMetrics(merchantId: string): Promise<DashboardMetricsResponseDto>` (REQ-AMP-001)
        -   Logic: Aggregate data from various repositories (affiliates, conversions, payouts) for the merchant. Calculate metrics. Map to DTO.
    -   `async getAffiliatePerformance(affiliateId: string): Promise<AffiliatePerformanceResponseDto>` (REQ-AMP-006)
        -   Logic: Fetch performance data (clicks, conversions, earnings) for the specific affiliate. Map to DTO.
    -   `async getAffiliateTrackingLinks(affiliateId: string): Promise<TrackingLinkResponseDto[]>` (REQ-AMP-006)
        -   Logic: Fetch programs the affiliate is part of. Generate/retrieve tracking links and associated coupons. Map to DTOs.
    -   `async getAffiliatePayoutHistory(affiliateId: string): Promise<PayoutHistoryResponseDto>` (REQ-AMP-006)
        -   Logic: Fetch payout records for the affiliate. Map to `PayoutHistoryResponseDto`.
    -   `async generateTrackingLinkForAffiliate(merchantId: string, programId: string, affiliateId: string): Promise<string>` (REQ-AMP-001)
        -   Logic: Ensure merchant owns program and affiliate is part of it. Generate a unique tracking link (e.g., `base_url?program=<program_id>&affiliate=<affiliate_id>&ref=<unique_code>`). Store if necessary. Return the link.
    -   `async generateCouponForAffiliate(merchantId: string, programId: string, affiliateId: string): Promise<string>` (REQ-AMP-001)
        -   Logic: Ensure merchant owns program and affiliate is part of it. Generate a unique, trackable coupon code. Associate with affiliate and program. Store. Return the coupon code.

#### 4.2.7 Controllers (`controllers/`)

All controllers will inject `AffiliateMarketingService`. Standard `@Controller('path')` decorator for base path. `@ApiTags(...)` for Swagger grouping.

-   **`merchant/affiliate-programs.merchant.controller.ts`**
    -   Base Path: `affiliate-marketing/merchant/programs`
    -   `@Post()` `createProgram(@AuthUser() user, @Body() createDto)` -> `service.createProgram(user.merchantId, createDto)` (Roles: MerchantAdmin) (REQ-AMP-001)
    -   `@Get()` `getPrograms(@AuthUser() user)` -> `service.listProgramsForMerchant(user.merchantId)` (Roles: MerchantAdmin, CampaignManager) (REQ-AMP-001)
    -   `@Get(':programId')` `getProgramById(@AuthUser() user, @Param('programId') programId)` -> `service.getProgramById(user.merchantId, programId)` (Roles: MerchantAdmin, CampaignManager) (REQ-AMP-001)
    -   `@Put(':programId')` `updateProgram(@AuthUser() user, @Param('programId') programId, @Body() updateDto)` -> `service.updateProgram(user.merchantId, programId, updateDto)` (Roles: MerchantAdmin) (REQ-AMP-001)
    -   `@Delete(':programId')` `deleteProgram(@AuthUser() user, @Param('programId') programId)` -> `service.deleteProgram(user.merchantId, programId)` (Roles: MerchantAdmin) (REQ-AMP-001)

-   **`merchant/affiliate-applications.merchant.controller.ts`**
    -   Base Path: `affiliate-marketing/merchant/applications`
    -   `@Get()` `getPendingApplications(@AuthUser() user, @Query('programId') programId?)` -> `service.getPendingApplications(user.merchantId, programId)` (Roles: MerchantAdmin) (REQ-AMP-002)
    -   `@Post(':applicationId/approve')` `approveApplication(@AuthUser() user, @Param('applicationId') applicationId, @Body() approvalDto)` -> `service.approveAffiliateApplication(user.merchantId, applicationId, approvalDto)` (Roles: MerchantAdmin) (REQ-AMP-002)
    -   `@Post(':applicationId/reject')` `rejectApplication(@AuthUser() user, @Param('applicationId') applicationId)` -> `service.rejectAffiliateApplication(user.merchantId, applicationId)` (Roles: MerchantAdmin) (REQ-AMP-002)

-   **`merchant/affiliate-management.merchant.controller.ts`**
    -   Base Path: `affiliate-marketing/merchant/affiliates`
    -   `@Get()` `listAffiliates(@AuthUser() user, @Query('programId') programId?, @Query('status') status?)` -> `service.listAffiliatesForMerchant(user.merchantId, programId, status)` (Roles: MerchantAdmin, CampaignManager) (REQ-AMP-001)
    -   `@Get(':affiliateId')` `getAffiliateDetails(@AuthUser() user, @Param('affiliateId') affiliateId)` -> `service.getAffiliateDetailsForMerchant(user.merchantId, affiliateId)` (Roles: MerchantAdmin, CampaignManager) (REQ-AMP-001)
    -   `@Post(':affiliateId/tracking-link')` `generateTrackingLink(@AuthUser() user, @Param('affiliateId') affiliateId, @Query('programId') programId)` -> `service.generateTrackingLinkForAffiliate(user.merchantId, programId, affiliateId)` (Roles: MerchantAdmin) (REQ-AMP-001)
    -   `@Post(':affiliateId/coupon-code')` `generateCouponCode(@AuthUser() user, @Param('affiliateId') affiliateId, @Query('programId') programId)` -> `service.generateCouponForAffiliate(user.merchantId, programId, affiliateId)` (Roles: MerchantAdmin) (REQ-AMP-001)

-   **`merchant/affiliate-commissions.merchant.controller.ts`**
    -   Base Path: `affiliate-marketing/merchant/programs/:programId/commissions`
    -   `@Post()` `setProgramCommissionRule(@AuthUser() user, @Param('programId') programId, @Body() commissionRuleDto)` -> `service.configureCommissionRule(user.merchantId, programId, commissionRuleDto)` (Roles: MerchantAdmin) (REQ-AMP-003)
    -   `@Get()` `getProgramCommissionStructure(@AuthUser() user, @Param('programId') programId)` -> `service.getCommissionStructure(user.merchantId, programId)` (Roles: MerchantAdmin, CampaignManager) (REQ-AMP-003)

-   **`merchant/affiliate-payouts.merchant.controller.ts`**
    -   Base Path: `affiliate-marketing/merchant/payouts`
    -   `@Get('pending')` `getPendingPayouts(@AuthUser() user, @Query('programId') programId?)` -> `service.getPendingPayoutsForMerchant(user.merchantId, programId)` (Roles: MerchantAdmin) (REQ-AMP-005)
    -   `@Post('process')` `processPayouts(@AuthUser() user, @Body() processPayoutsDto)` -> `service.processAffiliatePayouts(user.merchantId, processPayoutsDto)` (Roles: MerchantAdmin) (REQ-AMP-005)
    -   `@Get('history')` `getPayoutHistory(@AuthUser() user, @Query('affiliateId') affiliateId?)` -> (Service method to be added: `getPayoutHistoryForMerchant(merchantId, affiliateId?)`) (Roles: MerchantAdmin) (REQ-AMP-005)

-   **`merchant/affiliate-dashboard.merchant.controller.ts`**
    -   Base Path: `affiliate-marketing/merchant/dashboard`
    -   `@Get()` `getDashboardMetrics(@AuthUser() user)` -> `service.getMerchantDashboardMetrics(user.merchantId)` (Roles: MerchantAdmin, CampaignManager) (REQ-AMP-001)

-   **`affiliate/affiliate-portal.controller.ts`**
    -   Base Path: `affiliate-marketing/portal` (Authenticated as Affiliate)
    -   `@Get('performance')` `getMyPerformance(@AuthUser() affiliate)` -> `service.getAffiliatePerformance(affiliate.affiliateId)` (Roles: Affiliate) (REQ-AMP-006)
    -   `@Get('tracking-links')` `getMyTrackingLinks(@AuthUser() affiliate)` -> `service.getAffiliateTrackingLinks(affiliate.affiliateId)` (Roles: Affiliate) (REQ-AMP-006)
    -   `@Get('payouts')` `getMyPayoutHistory(@AuthUser() affiliate)` -> `service.getAffiliatePayoutHistory(affiliate.affiliateId)` (Roles: Affiliate) (REQ-AMP-006)

-   **`public/affiliate-registration.public.controller.ts`**
    -   Base Path: `affiliate-marketing/public`
    -   `@Post('register')` `register(@Body() registrationDto)` -> `service.registerAffiliate(registrationDto)` (No Auth Guard) (REQ-AMP-002)

-   **`affiliate-conversions.controller.ts`**
    -   Base Path: `affiliate-marketing/conversions`
    -   `@Post()` `trackConversion(@Body() trackConversionDto)` -> `service.trackConversion(trackConversionDto)` (May need an API Key guard or be trusted internal call) (REQ-AMP-004)

## 5. Data Model Considerations (for API interaction)
-   This API module does not directly manage database schemas but relies on the DTOs to define data structures for API requests and responses.
-   The `AffiliateMarketingService` will interact with conceptual data repositories (e.g., `IAffiliateProgramRepository`) whose concrete implementations are outside this API module's scope. These repositories will handle persistence to chosen databases (PostgreSQL, DynamoDB as per architecture).

## 6. Non-Functional Requirements Compliance
-   **Security**: Handled by JWT authentication (`JwtAuthGuard`), RBAC (`RolesGuard`), HTTPS (assumed at API Gateway level), and input validation via DTOs.
-   **Performance**: Service logic should be optimized. Caching strategies (if applicable for frequently accessed, non-volatile data like program details) would be implemented in the service or data layer.
-   **Scalability**: NestJS applications are generally scalable. The underlying service and data layers would need to be designed for scalability.
-   **Reliability**: Robust error handling in controllers and services. Underlying infrastructure (API Gateway, load balancers) contributes to reliability.
-   **Maintainability**: Achieved through modular design (NestJS modules, controllers, services), clear separation of concerns, use of TypeScript, and comprehensive API documentation (Swagger).
-   **Usability (API)**: Ensured by clear, consistent, and well-documented API endpoints and DTOs.

## 7. Future Considerations
-   Webhook system for notifying external systems (e.g., merchant CRM) about new affiliates or conversions.
-   More advanced commission structures (e.g., tiered based on performance, product-specific commissions).
-   Integration with fraud detection services for conversion validation.
-   Batch processing for large-scale payout calculations.

This SDS provides the blueprint for developing the `AffiliateMarketing.ApiEndpoints` module. It details the structure, behavior, and contracts necessary for its implementation.
