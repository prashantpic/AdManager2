# Software Design Specification: CampaignManagement.ApiEndpoints

## 1. Introduction

### 1.1 Purpose
This document provides the detailed software design specification for the `CampaignManagement.ApiEndpoints` repository. This repository is responsible for exposing RESTful API endpoints for managing advertising campaigns, ad sets, ads, ad creatives, and A/B tests. It handles operations such as creation, updates, status changes, budget management, and associations with product catalogs, audiences, and promotions. These APIs are primarily consumed by the Merchant Ad Manager Portal, and potentially by other internal services or authorized third-party applications.

### 1.2 Scope
The scope of this document is limited to the design of the `CampaignManagement.ApiEndpoints` NestJS application. This includes:
-   API endpoint definitions (routes, HTTP methods, request/response DTOs).
-   Authentication and authorization mechanisms for API endpoints.
-   Global error handling and request validation.
-   Integration with the `ICampaignManagementService` for business logic execution.
-   Swagger/OpenAPI documentation setup.

The actual implementation of the business logic within the `ICampaignManagementService` is considered external to this repository but its interface contract is a key dependency.

### 1.3 Definitions and Acronyms
-   **API**: Application Programming Interface
-   **REST**: Representational State Transfer
-   **DTO**: Data Transfer Object
-   **JWT**: JSON Web Token
-   **CRUD**: Create, Read, Update, Delete
-   **SRS**: Software Requirements Specification
-   **ICampaignManagementService**: Interface for the Campaign Management Service (business logic layer)
-   **Ad Network**: Advertising platforms like Google, Instagram, TikTok, Snapchat.
-   **Campaign**: A strategic advertising initiative.
-   **Ad Set**: A group of ads within a campaign sharing budget, schedule, targeting, and bidding strategy.
-   **Ad**: An individual advertisement.
-   **Ad Creative**: The visual and textual content of an ad.
-   **A/B Test**: A controlled experiment to compare variations of campaign elements.
-   **Swagger/OpenAPI**: Specification for describing RESTful APIs.

### 1.4 Overview
The `CampaignManagement.ApiEndpoints` is a NestJS application acting as the API layer for campaign management functionalities. It will use controllers to define routes, DTOs for data validation and structuring, guards for authentication, and filters for global error handling. It will delegate business logic processing to an injected `ICampaignManagementService`.

## 2. System Architecture

### 2.1 Architectural Style
The `CampaignManagement.ApiEndpoints` repository is part of a larger system likely following a Microservices architecture. This repository itself is a dedicated microservice or API gateway component focused on campaign management.

### 2.2 High-Level Design
This API service acts as a presentation/API layer. It receives HTTP requests, validates them, authenticates the user, authorizes the request, and then calls the appropriate methods in the `ICampaignManagementService` (application service layer) to perform the business operations.

mermaid
graph TD
    Client[Merchant Portal / 3rd Party App] -- HTTPS/JSON --> APIGateway[Amazon API Gateway];
    APIGateway -- Routes Request --> CampaignManagementApi[CampaignManagement.ApiEndpoints (NestJS)];
    CampaignManagementApi -- Calls Methods --> ICampaignService[ICampaignManagementService (Application Layer)];
    ICampaignService -- Interacts --> DomainLogic[Domain Logic / Data Persistence];

    subgraph "CampaignManagement.ApiEndpoints Repository"
        CampaignManagementApi
    end


### 2.3 Technology Stack
-   **Language**: TypeScript 5.4.5
-   **Framework**: NestJS 10.3.9
-   **Node.js Version**: 20.15.0 (LTS)
-   **API Specification**: OpenAPI 3.1.0 (via `@nestjs/swagger`)
-   **Data Validation**: `class-validator`, `class-transformer`
-   **Authentication**: JWT

## 3. Application Bootstrap and Global Configuration (`main.ts`)

The `src/modules/campaigns/api/main.ts` file will be the entry point of the application.

### 3.1 Responsibilities
-   Initialize the NestJS application instance using `NestFactory`.
-   Apply global middleware:
    -   Global `ValidationPipe` for automatic request DTO validation.
    -   Global `AllExceptionsFilter` for consistent error response formatting.
-   Enable CORS (Cross-Origin Resource Sharing) if required, with appropriate configurations.
-   Set up Swagger/OpenAPI documentation using `SwaggerModule` and `DocumentBuilder`.
-   Start the HTTP server, listening on a configured port (e.g., from environment variables).

### 3.2 Implementation Details
typescript
// src/modules/campaigns/api/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CampaignsApiModule } from './campaigns.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
// import { ConfigService } from '@nestjs/config'; // If using @nestjs/config

async function bootstrap() {
  const app = await NestFactory.create(CampaignsApiModule);

  // const configService = app.get(ConfigService); // If using @nestjs/config
  // const port = configService.get<number>('PORT') || 3000;
  const port = process.env.PORT || 3000; // Simple example, prefer ConfigService

  app.setGlobalPrefix('api/v1'); // Example API prefix

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted values are provided
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allow conversion of string path/query params to numbers/booleans
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Ad Manager - Campaign Management API')
    .setDescription('API endpoints for managing advertising campaigns, ad sets, ads, creatives, and A/B tests.')
    .setVersion('1.0')
    .addBearerAuth() // For JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Swagger UI available at /api/docs

  // Enable CORS if needed
  app.enableCors({
    // origin: configService.get<string>('CORS_ORIGIN'), // Example using ConfigService
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // credentials: true,
  });

  await app.listen(port);
  console.log(`Campaign Management API is running on: ${await app.getUrl()}`);
}
bootstrap();


## 4. Core Module (`campaigns.module.ts`)

The `src/modules/campaigns/api/campaigns.module.ts` will be the root module for this API.

### 4.1 Responsibilities
-   Import and declare all controllers related to campaign management.
-   Provide and configure the `ICampaignManagementService`. Since the actual service implementation is external, this module might provide a mock or a client for it depending on the broader architecture (e.g., gRPC client, HTTP client). For this SDS, we assume an injectable service interface.
-   Import other necessary modules (e.g., `ConfigModule` if used for environment variables, `AuthModule` if JWT strategy is defined locally).

### 4.2 Implementation Details
typescript
// src/modules/campaigns/api/campaigns.module.ts
import { Module } from '@nestjs/common';
import { CampaignController } from './controllers/campaign.controller';
import { AdSetController } from './controllers/ad-set.controller';
import { AdController } from './controllers/ad.controller';
import { AdCreativeController } from './controllers/ad-creative.controller';
import { ABTestController } from './controllers/ab-test.controller';
// import { CampaignManagementServiceImpl } from './services/campaign-management.service'; // Assuming a local impl or mock for now
// import { ICampaignManagementService } from './services/interfaces/campaign-management.service.interface';
// Potentially import PassportModule for auth if not handled globally
// import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from './auth/strategies/jwt.strategy';
// import { ConfigModule } from '@nestjs/config'; // If used

@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true }), // Example: if using @nestjs/config
    // PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [
    CampaignController,
    AdSetController,
    AdController,
    AdCreativeController,
    ABTestController,
  ],
  providers: [
    // {
    //   provide: ICampaignManagementService,
    //   useClass: CampaignManagementServiceImpl, // Replace with actual service provider or client
    // },
    // JwtStrategy, // If JwtStrategy is part of this module
  ],
})
export class CampaignsApiModule {}

**Note:** The `ICampaignManagementService` provider and `JwtStrategy` would typically be managed. If `JwtStrategy` is global or part of a shared `AuthModule`, it wouldn't be re-declared here. The service implementation is assumed to be injected.

## 5. Common Utilities and Enums

### 5.1 Enums
Located in `src/modules/campaigns/api/common/enums/`.
-   **`CampaignStatus` (`campaign-status.enum.ts`)**:
    -   Members: `DRAFT`, `ACTIVE`, `PAUSED`, `ARCHIVED`, `COMPLETED`
    -   Requirement Mapping: `REQ-CMO-001`, `REQ-CMO-002`
-   **`AdNetwork` (`ad-network.enum.ts`)**:
    -   Members: `GOOGLE`, `INSTAGRAM`, `TIKTOK`, `SNAPCHAT`
    -   Requirement Mapping: `REQ-CMO-001`, `REQ-CMO-002`

### 5.2 Common DTOs
Located in `src/modules/campaigns/api/common/dto/`.
-   **`PaginationQueryDto` (`pagination-query.dto.ts`)**:
    -   Properties:
        -   `page?: number` (`@IsOptional() @IsInt() @Min(1) @Type(() => Number) @ApiPropertyOptional()`)
        -   `limit?: number` (`@IsOptional() @IsInt() @Min(1) @Max(100) @Type(() => Number) @ApiPropertyOptional()`)
        -   `sortBy?: string` (`@IsOptional() @IsString() @ApiPropertyOptional()`)
        -   `sortOrder?: 'ASC' | 'DESC'` (`@IsOptional() @IsEnum(['ASC', 'DESC']) @ApiPropertyOptional()`)
-   **`IdParamDto` (`id-param.dto.ts`)**:
    -   Properties:
        -   `id: string` (`@IsUUID('4') @ApiProperty()`)

### 5.3 Global Filters
-   **`AllExceptionsFilter` (`common/filters/all-exceptions.filter.ts`)**:
    -   Implements `ExceptionFilter`.
    -   Catches `HttpException` and other `Error` types.
    -   Logs the error details (stack trace, request info).
    -   Sends a standardized JSON error response:
        json
        {
          "statusCode": number,
          "message": string | string[],
          "error": string, // Short error description
          "timestamp": string, // ISO 8601
          "path": string
        }
        

## 6. Authentication and Authorization

### 6.1 JWT Authentication
-   **`JwtAuthGuard` (`auth/guards/jwt-auth.guard.ts`)**:
    -   Extends `AuthGuard('jwt')`.
    -   Used with `@UseGuards(JwtAuthGuard)` decorator on controllers or specific routes requiring authentication.
-   **`JwtStrategy` (`auth/strategies/jwt.strategy.ts`)**:
    -   Extends `PassportStrategy(Strategy, 'jwt')`.
    -   Constructor injects `ConfigService` to get JWT secret and expiration.
    -   `validate(payload: any)` method:
        -   Receives the decoded JWT payload.
        -   Should return an object representing the authenticated user (e.g., `{ userId: string, merchantId: string, roles: string[] }`). This object will be attached to `req.user`.
        -   This strategy needs to be registered in a module (e.g., a dedicated `AuthModule` imported into `CampaignsApiModule`, or directly in `CampaignsApiModule`).

### 6.2 Authorization
-   Authorization logic (e.g., role-based access, merchant data isolation) will primarily be handled by the `ICampaignManagementService`.
-   The API layer will extract `merchantId` from `req.user` (populated by `JwtStrategy`) and pass it to the service layer. The service layer is responsible for ensuring that a user can only access/modify resources belonging to their `merchantId`.
-   Role-based authorization can be implemented with additional guards if specific API endpoints need to be restricted to certain roles within the JWT payload.

## 7. Service Interface (`ICampaignManagementService`)
Located at `src/modules/campaigns/api/services/interfaces/campaign-management.service.interface.ts`.
This interface defines the contract between the API controllers and the business logic layer. Controllers will inject this service.

typescript
// src/modules/campaigns/api/services/interfaces/campaign-management.service.interface.ts
import { CreateCampaignDto, CampaignResponseDto, UpdateCampaignDto, UpdateCampaignStatusDto, AssociateProductCatalogDto, AssociateAudienceDto, AssociatePromotionCampaignDto } from '../../dto/campaign'; // Assuming DTOs are grouped
import { CreateAdSetDto, AdSetResponseDto, UpdateAdSetDto } from '../../dto/ad-set';
import { CreateAdDto, AdResponseDto, UpdateAdDto, AssociatePromotionAdDto } from '../../dto/ad';
import { UploadAdCreativeDto, AdCreativeResponseDto, UpdateAdCreativeDto, CreativeType } from '../../dto/ad-creative'; // Assuming CreativeType enum exists
import { CreateABTestDto, ABTestResponseDto, UpdateABTestDto, ABTestResultResponseDto } from '../../dto/ab-test';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PagedResponseDto } from '../../common/dto/paged.response.dto'; // Assuming a generic paged response DTO

export interface ICampaignManagementService {
  // Campaign Methods
  createCampaign(createCampaignDto: CreateCampaignDto, merchantId: string): Promise<CampaignResponseDto>;
  updateCampaign(campaignId: string, updateCampaignDto: UpdateCampaignDto, merchantId: string): Promise<CampaignResponseDto>;
  getCampaignById(campaignId: string, merchantId: string): Promise<CampaignResponseDto>;
  listCampaigns(merchantId: string, paginationQuery: PaginationQueryDto): Promise<PagedResponseDto<CampaignResponseDto>>;
  updateCampaignStatus(campaignId: string, statusDto: UpdateCampaignStatusDto, merchantId: string): Promise<CampaignResponseDto>;
  associateProductCatalogToCampaign(campaignId: string, catalogId: string, merchantId: string): Promise<void>; // REQ-CMO-005, 3.1.1
  associateAudienceToCampaign(campaignId: string, audienceId: string, merchantId: string): Promise<void>; // REQ-CMO-012
  associatePromotionToCampaign(campaignId: string, promotionId: string, merchantId: string): Promise<void>; // REQ-CMO-013

  // AdSet Methods
  createAdSet(campaignId: string, createAdSetDto: CreateAdSetDto, merchantId: string): Promise<AdSetResponseDto>;
  updateAdSet(adSetId: string, updateAdSetDto: UpdateAdSetDto, merchantId: string): Promise<AdSetResponseDto>;
  getAdSetById(adSetId: string, merchantId: string): Promise<AdSetResponseDto>;
  listAdSetsByCampaign(campaignId: string, merchantId: string, paginationQuery: PaginationQueryDto): Promise<PagedResponseDto<AdSetResponseDto>>;

  // Ad Methods
  createAd(adSetId: string, createAdDto: CreateAdDto, merchantId: string): Promise<AdResponseDto>;
  updateAd(adId: string, updateAdDto: UpdateAdDto, merchantId: string): Promise<AdResponseDto>;
  getAdById(adId: string, merchantId: string): Promise<AdResponseDto>;
  listAdsByAdSet(adSetId: string, merchantId: string, paginationQuery: PaginationQueryDto): Promise<PagedResponseDto<AdResponseDto>>;
  associatePromotionToAd(adId: string, promotionId: string, merchantId: string): Promise<void>; // REQ-CMO-013

  // AdCreative Methods
  uploadAdCreative(uploadAdCreativeDto: UploadAdCreativeDto, merchantId: string, file?: Express.Multer.File): Promise<AdCreativeResponseDto>; // REQ-CMO-004
  getAdCreativeById(creativeId: string, merchantId: string): Promise<AdCreativeResponseDto>;
  listAdCreatives(merchantId: string, paginationQuery: PaginationQueryDto): Promise<PagedResponseDto<AdCreativeResponseDto>>;
  updateAdCreative(creativeId: string, updateAdCreativeDto: UpdateAdCreativeDto, merchantId: string, file?: Express.Multer.File): Promise<AdCreativeResponseDto>;


  // A/B Test Methods
  createABTest(createABTestDto: CreateABTestDto, merchantId: string): Promise<ABTestResponseDto>; // REQ-CMO-008, 3.1.6
  updateABTest(abTestId: string, updateABTestDto: UpdateABTestDto, merchantId: string): Promise<ABTestResponseDto>; // REQ-CMO-008
  getABTestById(abTestId: string, merchantId: string): Promise<ABTestResponseDto>;
  getABTestResults(abTestId: string, merchantId: string): Promise<ABTestResultResponseDto>; // REQ-CMO-009, 3.1.1 (Reporting)
  listABTests(merchantId: string, campaignId: string | undefined, paginationQuery: PaginationQueryDto): Promise<PagedResponseDto<ABTestResponseDto>>;
}

// Define PagedResponseDto if not already defined
// export class PagedResponseDto<T> {
//   @ApiProperty()
//   total: number;
//   @ApiProperty()
//   page: number;
//   @ApiProperty()
//   limit: number;
//   @ApiProperty({ isArray: true }) // Type needs to be specified by consumer
//   data: T[];
// }


## 8. API Controllers and DTOs

All controllers will be decorated with `@ApiTags(...)` for Swagger grouping, `@UseGuards(JwtAuthGuard)` for authentication, and will inject `ICampaignManagementService`. They will extract `merchantId` from `req.user.merchantId`.

### 8.1 `CampaignController` (`controllers/campaign.controller.ts`)
-   Base Path: `/campaigns`
-   Requirement Mapping: `REQ-CMO-001`, `REQ-CMO-002`, `REQ-CMO-005`, `REQ-CMO-011`, `REQ-CMO-012`, `REQ-CMO-013`, `3.1.1 (Product Catalogs)`

#### Endpoints:
1.  **Create Campaign**
    -   **Method**: `POST /`
    -   **Request DTO**: `CreateCampaignDto` (`dto/campaign/create-campaign.dto.ts`)
        -   `name: string` (`@IsString() @IsNotEmpty() @MaxLength(255)`)
        -   `targetAdNetworks: AdNetwork[]` (`@IsArray() @IsEnum(AdNetwork, { each: true }) @ArrayMinSize(1)`)
        -   `budget: number` (`@IsNumber() @Min(0) @IsPositive()`)
        -   `startDate: Date` (`@IsISO8601()`)
        -   `endDate: Date` (`@IsISO8601() @IsDateGreaterThan('startDate')` - custom validator needed)
        -   `initialStatus: CampaignStatus` (`@IsEnum(CampaignStatus)`)
    -   **Response DTO**: `CampaignResponseDto` (`dto/campaign/campaign.response.dto.ts`)
        -   `id: string (UUID)`
        -   `name: string`
        -   `targetAdNetworks: AdNetwork[]`
        -   `budget: number`
        -   `startDate: Date`
        -   `endDate: Date`
        -   `status: CampaignStatus`
        -   `createdAt: Date`
        -   `updatedAt: Date`
        -   `merchantId: string (UUID)`
    -   **Logic**: Calls `campaignManagementService.createCampaign(dto, merchantId)`.
    -   **Swagger**: `@ApiOperation({ summary: 'Create a new campaign' })`, `@ApiBody({ type: CreateCampaignDto })`, `@ApiResponse({ status: 201, description: 'Campaign created successfully', type: CampaignResponseDto })`

2.  **List Campaigns**
    -   **Method**: `GET /`
    -   **Query DTO**: `PaginationQueryDto`
    -   **Response DTO**: `PagedResponseDto<CampaignResponseDto>`
    -   **Logic**: Calls `campaignManagementService.listCampaigns(merchantId, query)`.
    -   **Swagger**: `@ApiOperation({ summary: 'List all campaigns for the merchant' })`, `@ApiQuery({ name: 'page', type: Number, required: false }), ...`

3.  **Get Campaign By ID**
    -   **Method**: `GET /:id`
    -   **Path Param DTO**: `IdParamDto`
    -   **Response DTO**: `CampaignResponseDto`
    -   **Logic**: Calls `campaignManagementService.getCampaignById(id, merchantId)`.
    -   **Swagger**: `@ApiOperation({ summary: 'Get a campaign by ID' })`

4.  **Update Campaign**
    -   **Method**: `PUT /:id`
    -   **Path Param DTO**: `IdParamDto`
    -   **Request DTO**: `UpdateCampaignDto` (`dto/campaign/update-campaign.dto.ts`)
        -   `name?: string` (`@IsOptional() @IsString() @MaxLength(255)`)
        -   `targetAdNetworks?: AdNetwork[]` (`@IsOptional() @IsArray() @IsEnum(AdNetwork, { each: true }) @ArrayMinSize(1)`)
        -   `budget?: number` (`@IsOptional() @IsNumber() @Min(0) @IsPositive()`) // REQ-CMO-011
        -   `startDate?: Date` (`@IsOptional() @IsISO8601()`)
        -   `endDate?: Date` (`@IsOptional() @IsISO8601() @IsDateGreaterThan('startDate', { if: (o, v) => o.startDate !== undefined || v !== undefined })` )
    -   **Response DTO**: `CampaignResponseDto`
    -   **Logic**: Calls `campaignManagementService.updateCampaign(id, dto, merchantId)`.
    -   **Swagger**: `@ApiOperation({ summary: 'Update a campaign' })`

5.  **Update Campaign Status**
    -   **Method**: `PATCH /:id/status`
    -   **Path Param DTO**: `IdParamDto`
    -   **Request DTO**: `UpdateCampaignStatusDto` (`dto/campaign/update-campaign-status.dto.ts`)
        -   `status: CampaignStatus` (`@IsEnum(CampaignStatus) @IsNotEmpty()`)
    -   **Response DTO**: `CampaignResponseDto`
    -   **Logic**: Calls `campaignManagementService.updateCampaignStatus(id, dto, merchantId)`.
    -   **Swagger**: `@ApiOperation({ summary: 'Update campaign status' })`

6.  **Associate Product Catalog to Campaign** (REQ-CMO-005)
    -   **Method**: `POST /:id/product-catalogs`
    -   **Path Param DTO**: `IdParamDto` (for campaignId)
    -   **Request DTO**: `AssociateProductCatalogDto` (`dto/campaign/associate-product-catalog.dto.ts`)
        -   `catalogId: string` (`@IsUUID('4') @IsNotEmpty()`)
    -   **Response**: `204 No Content` or `CampaignResponseDto`
    -   **Logic**: Calls `campaignManagementService.associateProductCatalogToCampaign(campaignId, catalogId, merchantId)`.
    -   **Swagger**: `@ApiOperation({ summary: 'Associate a product catalog with a campaign' })`

7.  **Associate Audience to Campaign** (REQ-CMO-012)
    -   **Method**: `POST /:id/audiences`
    -   **Path Param DTO**: `IdParamDto` (for campaignId)
    -   **Request DTO**: `AssociateAudienceDto` (`dto/campaign/associate-audience.dto.ts`)
        -   `audienceId: string` (`@IsUUID('4') @IsNotEmpty()`)
    -   **Response**: `204 No Content` or `CampaignResponseDto`
    -   **Logic**: Calls `campaignManagementService.associateAudienceToCampaign(campaignId, audienceId, merchantId)`.
    -   **Swagger**: `@ApiOperation({ summary: 'Associate an audience with a campaign' })`

8.  **Associate Promotion to Campaign** (REQ-CMO-013)
    -   **Method**: `POST /:id/promotions`
    -   **Path Param DTO**: `IdParamDto` (for campaignId)
    -   **Request DTO**: `AssociatePromotionCampaignDto` (`dto/campaign/associate-promotion-campaign.dto.ts`)
        -   `promotionId: string` (`@IsUUID('4') @IsNotEmpty()`)
    -   **Response**: `204 No Content` or `CampaignResponseDto`
    -   **Logic**: Calls `campaignManagementService.associatePromotionToCampaign(campaignId, promotionId, merchantId)`.
    -   **Swagger**: `@ApiOperation({ summary: 'Associate a promotion with a campaign' })`

### 8.2 `AdSetController` (`controllers/ad-set.controller.ts`)
-   Base Path: `/campaigns/:campaignId/adsets` (nested) or `/adsets` (flat, with campaignId in DTO/body) - Prefer nested for clear hierarchy.
-   Requirement Mapping: `REQ-CMO-003`, `REQ-CMO-011`

#### Endpoints:
1.  **Create Ad Set**
    -   **Method**: `POST /` (relative to `/campaigns/:campaignId/adsets`)
    -   **Path Param**: `campaignId: string` (validated via `IdParamDto` if a separate DTO for campaignId in path is made)
    -   **Request DTO**: `CreateAdSetDto` (`dto/ad-set/create-ad-set.dto.ts`)
        -   `name: string` (`@IsString() @IsNotEmpty() @MaxLength(255)`)
        -   `targetingCriteria: any` (JSON object, structure depends on ad network capabilities; `@IsObject()`)
        -   `biddingStrategy: any` (JSON object; `@IsObject()`)
        -   `budgetAllocation: { type: 'DAILY' | 'LIFETIME', amount: number }` (`@ValidateNested() @Type(() => BudgetAllocationDto)`) // REQ-CMO-011
            -   `BudgetAllocationDto`: `type: string` (`@IsEnum(['DAILY', 'LIFETIME'])`), `amount: number` (`@IsNumber() @IsPositive()`)
        -   `adNetworkId: string` (`@IsUUID('4') @IsNotEmpty()`) // To specify which network this ad set targets within the campaign
    -   **Response DTO**: `AdSetResponseDto` (`dto/ad-set/ad-set.response.dto.ts`)
        -   `id: string (UUID)`
        -   `campaignId: string (UUID)`
        -   `name: string`
        -   `targetingCriteria: any`
        -   `biddingStrategy: any`
        -   `budgetAllocation: any`
        -   `adNetworkId: string (UUID)`
        -   `createdAt: Date`
        -   `updatedAt: Date`
    -   **Logic**: Calls `campaignManagementService.createAdSet(campaignId, dto, merchantId)`.
    -   **Swagger**: `@ApiOperation({ summary: 'Create a new ad set for a campaign' })`

2.  **List Ad Sets by Campaign**
    -   **Method**: `GET /` (relative to `/campaigns/:campaignId/adsets`)
    -   **Path Param**: `campaignId: string`
    -   **Query DTO**: `PaginationQueryDto`
    -   **Response DTO**: `PagedResponseDto<AdSetResponseDto>`
    -   **Logic**: Calls `campaignManagementService.listAdSetsByCampaign(campaignId, merchantId, query)`.
    -   **Swagger**: `@ApiOperation({ summary: 'List ad sets for a specific campaign' })`

3.  **Get Ad Set By ID**
    -   **Method**: `GET /:adSetId` (relative to `/campaigns/:campaignId/adsets` or make it `/adsets/:id` and get campaignId from service) - Prefer `/adsets/:id` for simplicity.
    -   **Path Param DTO**: `IdParamDto` (for `adSetId`)
    -   **Response DTO**: `AdSetResponseDto`
    -   **Logic**: Calls `campaignManagementService.getAdSetById(adSetId, merchantId)`.
    -   **Swagger**: `@ApiOperation({ summary: 'Get an ad set by ID' })` (If path is `/adsets/:id`)

4.  **Update Ad Set**
    -   **Method**: `PUT /:adSetId` (relative to `/campaigns/:campaignId/adsets` or `/adsets/:id`)
    -   **Path Param DTO**: `IdParamDto` (for `adSetId`)
    -   **Request DTO**: `UpdateAdSetDto` (`dto/ad-set/update-ad-set.dto.ts`)
        -   `name?: string` (`@IsOptional() @IsString() @MaxLength(255)`)
        -   `targetingCriteria?: any` (`@IsOptional() @IsObject()`)
        -   `biddingStrategy?: any` (`@IsOptional() @IsObject()`)
        -   `budgetAllocation?: { type: 'DAILY' | 'LIFETIME', amount: number }` (`@IsOptional() @ValidateNested() @Type(() => BudgetAllocationDto)`) // REQ-CMO-011
    -   **Response DTO**: `AdSetResponseDto`
    -   **Logic**: Calls `campaignManagementService.updateAdSet(adSetId, dto, merchantId)`.
    -   **Swagger**: `@ApiOperation({ summary: 'Update an ad set' })`

### 8.3 `AdController` (`controllers/ad.controller.ts`)
-   Base Path: `/adsets/:adSetId/ads` (nested) or `/ads` (flat) - Prefer nested.
-   Requirement Mapping: `REQ-CMO-004`, `REQ-CMO-006`, `REQ-CMO-013`

#### Endpoints:
1.  **Create Ad**
    -   **Method**: `POST /` (relative to `/adsets/:adSetId/ads`)
    -   **Path Param**: `adSetId: string`
    -   **Request DTO**: `CreateAdDto` (`dto/ad/create-ad.dto.ts`)
        -   `adCreativeId: string` (`@IsUUID('4') @IsNotEmpty()`) // REQ-CMO-004
        -   `name: string` (`@IsString() @IsNotEmpty() @MaxLength(255)`)
        -   `destinationUrl: string` (`@IsUrl() @IsNotEmpty()`) // REQ-CMO-006
        -   `promotionId?: string` (`@IsOptional() @IsUUID('4')`) // REQ-CMO-013
    -   **Response DTO**: `AdResponseDto` (`dto/ad/ad.response.dto.ts`)
        -   `id: string (UUID)`
        -   `adSetId: string (UUID)`
        -   `adCreativeId: string (UUID)`
        -   `name: string`
        -   `destinationUrl: string`
        -   `promotionId?: string (UUID)`
        -   `status: string` (e.g., from ad network)
        -   `createdAt: Date`
        -   `updatedAt: Date`
    -   **Logic**: Calls `campaignManagementService.createAd(adSetId, dto, merchantId)`.

2.  **List Ads by Ad Set**
    -   **Method**: `GET /` (relative to `/adsets/:adSetId/ads`)
    -   **Path Param**: `adSetId: string`
    -   **Query DTO**: `PaginationQueryDto`
    -   **Response DTO**: `PagedResponseDto<AdResponseDto>`
    -   **Logic**: Calls `campaignManagementService.listAdsByAdSet(adSetId, merchantId, query)`.

3.  **Get Ad By ID**
    -   **Method**: `GET /:adId` (relative to `/adsets/:adSetId/ads` or `/ads/:id`) - Prefer `/ads/:id`.
    -   **Path Param DTO**: `IdParamDto` (for `adId`)
    -   **Response DTO**: `AdResponseDto`
    -   **Logic**: Calls `campaignManagementService.getAdById(adId, merchantId)`.

4.  **Update Ad**
    -   **Method**: `PUT /:adId` (relative to `/adsets/:adSetId/ads` or `/ads/:id`)
    -   **Path Param DTO**: `IdParamDto` (for `adId`)
    -   **Request DTO**: `UpdateAdDto` (`dto/ad/update-ad.dto.ts`)
        -   `adCreativeId?: string` (`@IsOptional() @IsUUID('4')`)
        -   `name?: string` (`@IsOptional() @IsString() @MaxLength(255)`)
        -   `destinationUrl?: string` (`@IsOptional() @IsUrl()`)
        -   `promotionId?: string` (`@IsOptional() @IsUUID('4')`)
    -   **Response DTO**: `AdResponseDto`
    -   **Logic**: Calls `campaignManagementService.updateAd(adId, dto, merchantId)`.

5.  **Associate Promotion to Ad** (REQ-CMO-013)
    -   **Method**: `POST /:adId/promotions` (relative to `/ads/:adId`)
    -   **Path Param DTO**: `IdParamDto` (for `adId`)
    -   **Request DTO**: `AssociatePromotionAdDto` (`dto/ad/associate-promotion-ad.dto.ts`)
        -   `promotionId: string` (`@IsUUID('4') @IsNotEmpty()`)
    -   **Response**: `204 No Content` or `AdResponseDto`
    -   **Logic**: Calls `campaignManagementService.associatePromotionToAd(adId, promotionId, merchantId)`.

### 8.4 `AdCreativeController` (`controllers/ad-creative.controller.ts`)
-   Base Path: `/creatives`
-   Requirement Mapping: `REQ-CMO-004`

#### Endpoints:
1.  **Upload Ad Creative**
    -   **Method**: `POST /upload`
    -   **Decorator**: `@UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 /* 10MB example */ }, fileFilter: imageFileFilter /* custom filter */ }))`
    -   **File Param**: `@UploadedFile() file: Express.Multer.File`
    -   **Request DTO (Body)**: `UploadAdCreativeDto` (`dto/ad-creative/upload-ad-creative.dto.ts`)
        -   `name: string` (`@IsString() @IsNotEmpty() @MaxLength(255)`)
        -   `type: CreativeType` (enum: IMAGE, VIDEO, TEXT, HTML5; `@IsEnum(CreativeType)`)
        -   `adNetworkId: string` (`@IsUUID('4') @IsNotEmpty()`) // To hint at network-specific validation
        -   `adCopy?: string` (`@IsOptional() @IsString()`)
        -   `headline?: string` (`@IsOptional() @IsString()`)
    -   **Response DTO**: `AdCreativeResponseDto` (`dto/ad-creative/ad-creative.response.dto.ts`)
        -   `id: string (UUID)`
        -   `name: string`
        -   `type: CreativeType`
        -   `adNetworkId: string (UUID)`
        -   `contentUrl: string` (URL to the stored creative, provided by service)
        -   `adCopy?: string`
        -   `headline?: string`
        -   `validationStatus: string` (e.g., PENDING, APPROVED, REJECTED)
        -   `createdAt: Date`
        -   `updatedAt: Date`
    -   **Logic**: Calls `campaignManagementService.uploadAdCreative(dto, merchantId, file)`. The service will handle file storage (e.g., S3) and return the URL.
    -   **Swagger**: `@ApiConsumes('multipart/form-data')`, `@ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, name: {type: 'string'}, ... } } })`

2.  **Get Ad Creative By ID**
    -   **Method**: `GET /:id`
    -   **Path Param DTO**: `IdParamDto`
    -   **Response DTO**: `AdCreativeResponseDto`
    -   **Logic**: Calls `campaignManagementService.getAdCreativeById(id, merchantId)`.

3.  **List Ad Creatives**
    -   **Method**: `GET /`
    -   **Query DTO**: `PaginationQueryDto`
    -   **Response DTO**: `PagedResponseDto<AdCreativeResponseDto>`
    -   **Logic**: Calls `campaignManagementService.listAdCreatives(merchantId, query)`.

4.  **Update Ad Creative Metadata** (Note: Updating the file itself might be a new upload or a more complex operation handled by the service)
    -   **Method**: `PUT /:id`
    -   **Path Param DTO**: `IdParamDto`
    -   **Request DTO**: `UpdateAdCreativeDto` (`dto/ad-creative/update-ad-creative.dto.ts`)
        -   `name?: string` (`@IsOptional() @IsString() @MaxLength(255)`)
        -   `adCopy?: string` (`@IsOptional() @IsString()`)
        -   `headline?: string` (`@IsOptional() @IsString()`)
    -   **Response DTO**: `AdCreativeResponseDto`
    -   **Logic**: Calls `campaignManagementService.updateAdCreative(id, dto, merchantId)`.
    -   **Swagger**: `@ApiOperation({ summary: 'Update ad creative metadata' })`

### 8.5 `ABTestController` (`controllers/ab-test.controller.ts`)
-   Base Path: `/abtests`
-   Requirement Mapping: `REQ-CMO-008`, `REQ-CMO-009`, `3.1.1 (A/B test results)`, `3.1.6`

#### Endpoints:
1.  **Create A/B Test** (REQ-CMO-008, 3.1.6)
    -   **Method**: `POST /`
    -   **Request DTO**: `CreateABTestDto` (`dto/ab-test/create-ab-test.dto.ts`)
        -   `campaignId: string` (`@IsUUID('4') @IsNotEmpty()`)
        -   `name: string` (`@IsString() @IsNotEmpty() @MaxLength(255)`)
        -   `testElementType: string` (e.g., 'CREATIVE', 'HEADLINE', 'LANDING_PAGE', 'PROMOTION'; `@IsEnum(ABTestElementTypeEnum)`)
        -   `variations: ABTestVariationDto[]` (`@IsArray() @ArrayMinSize(2) @ValidateNested({ each: true }) @Type(() => ABTestVariationDto)`)
            -   `ABTestVariationDto`: `name: string`, `elementId?: string` (e.g., creativeId, promotionId), `elementValue?: any` (e.g., headline text, landing page URL)
    -   **Response DTO**: `ABTestResponseDto` (`dto/ab-test/ab-test.response.dto.ts`)
        -   `id: string (UUID)`
        -   `campaignId: string (UUID)`
        -   `name: string`
        -   `testElementType: string`
        -   `variations: any[]`
        -   `status: string` (e.g., DRAFT, RUNNING, PAUSED, COMPLETED)
        -   `startDate?: Date`
        -   `endDate?: Date`
        -   `createdAt: Date`
        -   `updatedAt: Date`
    -   **Logic**: Calls `campaignManagementService.createABTest(dto, merchantId)`.

2.  **Get A/B Test By ID**
    -   **Method**: `GET /:id`
    -   **Path Param DTO**: `IdParamDto`
    -   **Response DTO**: `ABTestResponseDto`
    -   **Logic**: Calls `campaignManagementService.getABTestById(id, merchantId)`.

3.  **Update A/B Test** (e.g., update name, schedule, status) (REQ-CMO-008)
    -   **Method**: `PUT /:id`
    -   **Path Param DTO**: `IdParamDto`
    -   **Request DTO**: `UpdateABTestDto` (`dto/ab-test/update-ab-test.dto.ts`)
        -   `name?: string` (`@IsOptional() @IsString() @MaxLength(255)`)
        -   `status?: string` (`@IsOptional() @IsEnum(ABTestStatusEnum)`)
        -   `startDate?: Date` (`@IsOptional() @IsISO8601()`)
        -   `endDate?: Date` (`@IsOptional() @IsISO8601()`)
    -   **Response DTO**: `ABTestResponseDto`
    -   **Logic**: Calls `campaignManagementService.updateABTest(id, dto, merchantId)`.

4.  **Get A/B Test Results** (REQ-CMO-009, 3.1.1 Reporting)
    -   **Method**: `GET /:id/results`
    -   **Path Param DTO**: `IdParamDto`
    -   **Response DTO**: `ABTestResultResponseDto` (`dto/ab-test/ab-test-result.response.dto.ts`)
        -   `abTestId: string (UUID)`
        -   `variantResults: VariantResultDto[]`
            -   `VariantResultDto`: `variantId: string`, `name: string`, `impressions: number`, `clicks: number`, `conversions: number`, `ctr: number`, `cvr: number`, `cpa: number`, `roas: number`, `isWinner?: boolean`, `confidenceLevel?: number`
        -   `winningVariantId?: string (UUID)`
        -   `statisticalSignificance?: any` (e.g., { pValue: number, confidenceInterval: [number, number] })
        -   `lastCalculatedAt: Date`
    -   **Logic**: Calls `campaignManagementService.getABTestResults(id, merchantId)`.

5.  **List A/B Tests**
    -   **Method**: `GET /`
    -   **Query DTO**: `ListABTestsQueryDto` (extends `PaginationQueryDto`, adds `campaignId?: string (@IsOptional() @IsUUID())`)
    -   **Response DTO**: `PagedResponseDto<ABTestResponseDto>`
    -   **Logic**: Calls `campaignManagementService.listABTests(merchantId, query.campaignId, query)`.


## 9. File Upload Handling (`AdCreativeController`)
-   Use `FileInterceptor` from `@nestjs/platform-express`.
-   Configure file size limits and file filters (e.g., only allow image/video mimetypes).
    typescript
    // Example file filter
    export const imageFileFilter = (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST), false);
      }
      callback(null, true);
    };
    
-   The `ICampaignManagementService.uploadAdCreative` method will receive the `Express.Multer.File` object and be responsible for interacting with a file storage service (e.g., Amazon S3).

## 10. Custom Validators
-   **`IsDateGreaterThan`**: A custom class-validator decorator will be needed to ensure `endDate` is after `startDate`. This involves creating a custom validation class that implements `ValidatorConstraintInterface`.

## 11. Environment Variables
The application should be configurable via environment variables, ideally managed by `@nestjs/config`.
-   `PORT`: Port for the HTTP server.
-   `JWT_SECRET`: Secret key for signing JWTs.
-   `JWT_EXPIRATION_TIME`: Expiration time for access tokens.
-   `CORS_ORIGIN`: Allowed origins for CORS.
-   `LOG_LEVEL`: Application log level.
-   (Potentially, service discovery URLs or connection details for the actual `CampaignManagementService` if it's a separate microservice).

## 12. Testing Considerations
-   Unit tests for controllers, DTOs (validation logic), guards, filters, and custom validators using Jest.
-   Mock the `ICampaignManagementService` for controller tests.
-   E2E tests using `@nestjs/testing` and `supertest` to verify API behavior, request/response cycles, and authentication.

## 13. Documentation Generation
-   `@nestjs/swagger` will be used to generate an OpenAPI (Swagger) specification.
-   All DTO properties should be decorated with `@ApiProperty()` or `@ApiPropertyOptional()`.
-   Controllers and methods should be decorated with `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()`, `@ApiBody()`, `@ApiParam()`, `@ApiQuery()`, `@ApiBearerAuth()`.
-   The Swagger UI will be available at `/api/docs`.

This SDS provides a comprehensive plan for developing the `CampaignManagement.ApiEndpoints` repository, ensuring all specified requirements and architectural considerations are met.