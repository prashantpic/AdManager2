# Software Design Specification: ProductCatalog.ApiEndpoints (REPO-PRODCAT-002)

## 1. Introduction

### 1.1 Purpose
This document provides the detailed software design specification for the `ProductCatalog.ApiEndpoints` repository (REPO-PRODCAT-002). This repository is responsible for exposing RESTful API endpoints for managing product catalogs tailored for advertising purposes. It facilitates operations such as creating, updating, and deleting catalogs, managing product customizations within these catalogs, handling bulk imports of product data, resolving data conflicts arising from synchronization with the core `[PlatformName]` platform, and generating product feeds for various ad networks.

These API endpoints serve as the primary interface for merchants (via the Merchant Ad Manager Portal) and potentially other internal or authorized third-party applications to interact with the product catalog functionalities of the Ad Manager Platform.

### 1.2 Scope
The scope of this document is limited to the design of the API endpoints layer within the `ProductCatalog.ApiEndpoints` repository. This includes:
-   Definition of API controllers and their respective endpoints.
-   Data Transfer Objects (DTOs) for requests and responses.
-   Authentication and authorization mechanisms for accessing the APIs.
-   Integration with the `IProductCatalogService` for business logic execution.
-   API documentation using Swagger/OpenAPI.

The implementation of the business logic itself (within `ProductCatalogService`) is outside the scope of this API endpoint repository but is consumed via the `IProductCatalogService` interface.

### 1.3 Definitions, Acronyms, and Abbreviations
-   **API**: Application Programming Interface
-   **REST**: Representational State Transfer
-   **JSON**: JavaScript Object Notation
-   **JWT**: JSON Web Token
-   **DTO**: Data Transfer Object
-   **CRUD**: Create, Read, Update, Delete
-   **CSV**: Comma-Separated Values
-   **XML**: Extensible Markup Language
-   **HTTP**: Hypertext Transfer Protocol
-   **SDK**: Software Development Kit
-   **RBAC**: Role-Based Access Control
-   **PaaS**: Platform as a Service
-   **IaaS**: Infrastructure as a Service
-   **CI/CD**: Continuous Integration/Continuous Deployment
-   **REQ**: Requirement ID
-   **SDS**: Software Design Specification
-   **[PlatformName]**: Placeholder for the actual name of the core e-commerce platform.

### 1.4 References
-   User Requirements Document (Ad-Manager requirements)
-   System Architecture Document (Microservices, API Gateway layer, Application Services layer)
-   `file_structure_json` for REPO-PRODCAT-002
-   NestJS Documentation (nestjs.com)
-   Swagger/OpenAPI Specification (swagger.io)
-   `class-validator`, `class-transformer` library documentation
-   `@nestjs/swagger` library documentation

## 2. System Overview
The `ProductCatalog.ApiEndpoints` repository is a NestJS application module that exposes V1 of the Product Catalog API. It sits behind an Amazon API Gateway, which handles initial request routing, SSL termination, and potentially initial JWT validation. This module is responsible for request handling, input validation, authentication, authorization, and delegating business logic to the `ProductCatalogService` (part of the Application Services Layer). It adheres to the principles of a microservices architecture.

## 3. Design Considerations

### 3.1 Assumptions and Dependencies
-   The `ProductCatalogService` implementing the `IProductCatalogService` interface will be provided and injectable.
-   A JWT-based authentication mechanism is in place, with user information (including `merchantId` and roles) available in the JWT payload processed by `JwtAuthGuard` or passed by the API Gateway.
-   Standardized error handling and logging mechanisms are available (e.g., via NestJS exception filters and logger).
-   The API Gateway handles SSL termination and common security headers.

### 3.2 General Design
-   **API Versioning**: All endpoints will be versioned under `/v1/`.
-   **Authentication**: JWT-based authentication will be enforced using `JwtAuthGuard`.
-   **Authorization**: Role-based access control will be implemented using `RolesGuard` and custom `@Roles()` decorator.
-   **Input Validation**: Request DTOs will use `class-validator` and `class-transformer` for robust validation.
-   **API Documentation**: `@nestjs/swagger` will be used to generate OpenAPI (Swagger) documentation for all endpoints and DTOs.
-   **Error Handling**: Standard NestJS HTTP exceptions will be used for error responses. Custom exception filters can be added if specific error formatting is required beyond NestJS defaults.
-   **Data Transfer**: JSON will be the standard format for request and response bodies. File uploads will use `multipart/form-data`.
-   **Merchant Context**: `merchantId` will be extracted from the authenticated user's JWT payload (`req.user.merchantId`) for all operations to ensure data tenancy.

## 4. Detailed Design

### 4.1 Module Definition
#### 4.1.1 `src/modules/product-catalogs/api/v1/product-catalog-api.module.ts`
-   **Name**: `ProductCatalogApiModule`
-   **Description**: NestJS module definition for the V1 Product Catalog API.
-   **Imports**:
    -   `MulterModule.register({ dest: './uploads' })` (or a configurable temporary storage location, consider S3 integration at service level for persistent storage of uploads if needed by service) - For handling file uploads for imports.
-   **Controllers**:
    -   `ProductCatalogController`
    -   `ProductFeedController`
    -   `ProductImportController`
    -   `ProductSyncController`
-   **Providers**:
    -   No direct providers. The `IProductCatalogService` is expected to be provided by an importing module or a dynamic module setup that resolves the actual service implementation. This module will export the controllers.
-   **Exports**: None.
-   **Logic**: This module groups all related controllers for version 1 of the Product Catalog API. It ensures that all dependencies required by these controllers (like `MulterModule`) are available.

typescript
// src/modules/product-catalogs/api/v1/product-catalog-api.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductCatalogController } from './controllers/product-catalog.controller';
import { ProductFeedController } from './controllers/product-feed.controller';
import { ProductImportController } from './controllers/product-import.controller';
import { ProductSyncController } from './controllers/product-sync.controller';

@Module({
  imports: [
    MulterModule.register({
      // Configure temporary storage for uploads if necessary.
      // The service layer should handle moving these to persistent storage.
      // dest: './temp_uploads', // Example: local temporary storage
    }),
  ],
  controllers: [
    ProductCatalogController,
    ProductFeedController,
    ProductImportController,
    ProductSyncController,
  ],
  // Providers for IProductCatalogService will be handled by the application's main module
  // or a dedicated service registration module.
})
export class ProductCatalogApiModule {}


### 4.2 Constants
#### 4.2.1 `src/modules/product-catalogs/api/v1/constants/product-catalog.constants.ts`
-   **Name**: `product-catalog.constants`
-   **Description**: Defines constants for the Product Catalog API module.
-   **Content**:
    typescript
    // src/modules/product-catalogs/api/v1/constants/product-catalog.constants.ts
    export const PRODUCT_CATALOG_SERVICE_TOKEN = 'IProductCatalogService';
    

### 4.3 Service Interface
#### 4.3.1 `src/modules/product-catalogs/api/v1/interfaces/product-catalog-service.interface.ts`
-   **Name**: `IProductCatalogService`
-   **Description**: Interface defining the contract for the `ProductCatalogService`. This is crucial for decoupling the API layer from the application service layer.
-   **Methods**: (As defined in `file_structure_json`, ensures comprehensive coverage of REQ-PC-001 to REQ-PC-007, REQ-CPSI-001, REQ-CPSI-002, REQ-DOMS-001, REQ-DOMS-005)
    -   `createCatalog(merchantId: string, createDto: CreateProductCatalogDto): Promise<ProductCatalogResponseDto>;`
    -   `findAllCatalogs(merchantId: string, paginationDto: PaginationDto): Promise<PaginatedResponseDto<ProductCatalogResponseDto>>;`
    -   `findOneCatalog(merchantId: string, catalogId: string): Promise<ProductCatalogResponseDto>;`
    -   `updateCatalog(merchantId: string, catalogId: string, updateDto: UpdateProductCatalogDto): Promise<ProductCatalogResponseDto>;`
    -   `removeCatalog(merchantId: string, catalogId: string): Promise<void>;`
    -   `addProductCustomization(merchantId: string, catalogId: string, productId: string, dto: CustomizeProductDto): Promise<ProductCatalogItemDto>;`
    -   `getProductCustomization(merchantId: string, catalogId: string, productId: string): Promise<ProductCatalogItemDto>;`
    -   `removeProductCustomization(merchantId: string, catalogId: string, productId: string): Promise<void>;`
    -   `setConflictResolutionStrategy(merchantId: string, catalogId: string, dto: ConflictResolutionStrategyDto): Promise<void>;`
    -   `getCatalogConflicts(merchantId: string, catalogId: string, paginationDto: PaginationDto): Promise<PaginatedResponseDto<CatalogConflictResponseDto>>;`
    -   `resolveConflict(merchantId: string, catalogId: string, conflictId: string, dto: ResolveConflictRequestDto): Promise<void>;`
    -   `generateFeed(merchantId: string, catalogId: string, dto: GenerateFeedRequestDto): Promise<FeedResponseDto>;`
    -   `getFeedStatus(merchantId: string, catalogId: string, feedId: string): Promise<FeedStatusResponseDto>;`
    -   `downloadFeedContent(merchantId: string, catalogId: string, feedId: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string; fileName: string }>;` (New method for streaming)
    -   `listFeeds(merchantId: string, catalogId: string, paginationDto: PaginationDto): Promise<PaginatedResponseDto<FeedSummaryDto>>;` (Need `FeedSummaryDto`)
    -   `validateFeed(merchantId: string, catalogId: string, dto: ValidateFeedRequestDto): Promise<FeedValidationResultResponseDto>;`
    -   `bulkImportProducts(merchantId: string, catalogId: string, fileBuffer: Buffer, fileOriginalName: string, dto: BulkImportRequestDto): Promise<BulkImportStatusResponseDto>;` (Added `fileOriginalName`)
    -   `getImportStatus(merchantId: string, catalogId: string, importId: string): Promise<BulkImportStatusResponseDto>;`
    -   `importExternalCustomizations(merchantId: string, catalogId: string, fileBuffer: Buffer, fileOriginalName: string, dto: ExternalCustomizationImportDto): Promise<BulkImportStatusResponseDto>;` (Added `fileOriginalName`)
    -   `triggerCorePlatformSync(merchantId: string, dto: TriggerSyncDto): Promise<SyncStatusResponseDto>;`
    -   `getCorePlatformSyncStatus(merchantId: string, dto: SyncStatusRequestDto): Promise<SyncStatusResponseDto>;` (Need `SyncStatusRequestDto`)

### 4.4 Controllers

#### 4.4.1 Common Controller Logic
-   All controllers will be decorated with `@ApiTags('Product Catalogs')` (or more specific tags).
-   All controllers will inject `IProductCatalogService` using `@Inject(PRODUCT_CATALOG_SERVICE_TOKEN)`.
-   The `merchantId` will be extracted from `req.user.merchantId` (assuming JWT payload has `user: { merchantId: string, roles: string[] }`). This will be passed to service methods.
-   Appropriate `@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))` will be applied globally or per controller for DTO validation.

#### 4.4.2 `src/modules/product-catalogs/api/v1/controllers/product-catalog.controller.ts`
-   **Name**: `ProductCatalogController`
-   **Decorator**: `@Controller('v1/merchant/catalogs')`, `@ApiTags('Product Catalog Management')`
-   **Methods**:
    -   `create(@Req() req, @Body() createProductCatalogDto: CreateProductCatalogDto)`:
        -   `@Post()`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin')`
        -   `@ApiOperation({ summary: 'Create a new product catalog' })`
        -   `@ApiResponse({ status: 201, description: 'Catalog created successfully.', type: ProductCatalogResponseDto })`
        -   `@ApiResponse({ status: 400, description: 'Invalid input.' })`
        -   `@ApiResponse({ status: 401, description: 'Unauthorized.' })`
        -   `@ApiResponse({ status: 403, description: 'Forbidden resource.' })`
        -   Logic: `const merchantId = req.user.merchantId; return this.productCatalogService.createCatalog(merchantId, createProductCatalogDto);`
    -   `findAll(@Req() req, @Query() paginationDto: PaginationDto)`:
        -   `@Get()`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin', 'CampaignManager')`
        -   `@ApiOperation({ summary: 'List all product catalogs for the merchant' })`
        -   `@ApiResponse({ status: 200, description: 'List of catalogs.', type: PaginatedResponseDto<ProductCatalogResponseDto> })` // Define PaginatedResponseDto
        -   Logic: `const merchantId = req.user.merchantId; return this.productCatalogService.findAllCatalogs(merchantId, paginationDto);`
    -   `findOne(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string)`:
        -   `@Get(':catalogId')`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin', 'CampaignManager')`
        -   `@ApiOperation({ summary: 'Get a specific product catalog' })`
        -   `@ApiResponse({ status: 200, description: 'Catalog details.', type: ProductCatalogResponseDto })`
        -   `@ApiResponse({ status: 404, description: 'Catalog not found.' })`
        -   Logic: `const merchantId = req.user.merchantId; return this.productCatalogService.findOneCatalog(merchantId, catalogId);`
    -   `update(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @Body() updateProductCatalogDto: UpdateProductCatalogDto)`:
        -   `@Patch(':catalogId')`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin')`
        -   `@ApiOperation({ summary: 'Update a product catalog' })`
        -   `@ApiResponse({ status: 200, description: 'Catalog updated successfully.', type: ProductCatalogResponseDto })`
        -   Logic: `const merchantId = req.user.merchantId; return this.productCatalogService.updateCatalog(merchantId, catalogId, updateProductCatalogDto);`
    -   `remove(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string)`:
        -   `@Delete(':catalogId')`
        -   `@HttpCode(HttpStatus.NO_CONTENT)`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin')`
        -   `@ApiOperation({ summary: 'Delete a product catalog' })`
        -   `@ApiResponse({ status: 204, description: 'Catalog deleted successfully.' })`
        -   Logic: `const merchantId = req.user.merchantId; await this.productCatalogService.removeCatalog(merchantId, catalogId);`
    -   `addOrUpdateProductCustomization(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @Param('productId') productId: string, @Body() customizeProductDto: CustomizeProductDto)`:
        -   `@Post(':catalogId/products/:productId/customizations')` (or `@Put`)
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin')`
        -   `@ApiOperation({ summary: 'Add or update ad-specific customization for a product in a catalog' })`
        -   `@ApiResponse({ status: 200, description: 'Product customization applied.', type: ProductCatalogItemDto })`
        -   Logic: `const merchantId = req.user.merchantId; return this.productCatalogService.addProductCustomization(merchantId, catalogId, productId, customizeProductDto);`
    -   `getProductCustomization(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @Param('productId') productId: string)`:
        -   `@Get(':catalogId/products/:productId/customizations')`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin', 'CampaignManager')`
        -   `@ApiOperation({ summary: 'Get ad-specific customization for a product' })`
        -   `@ApiResponse({ status: 200, description: 'Product customization details.', type: ProductCatalogItemDto })`
        -   Logic: `const merchantId = req.user.merchantId; return this.productCatalogService.getProductCustomization(merchantId, catalogId, productId);`
    -   `removeProductCustomization(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @Param('productId') productId: string)`:
        -   `@Delete(':catalogId/products/:productId/customizations')`
        -   `@HttpCode(HttpStatus.NO_CONTENT)`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin')`
        -   `@ApiOperation({ summary: 'Remove ad-specific customization for a product' })`
        -   `@ApiResponse({ status: 204, description: 'Product customization removed.' })`
        -   Logic: `const merchantId = req.user.merchantId; await this.productCatalogService.removeProductCustomization(merchantId, catalogId, productId);`
    -   `setConflictResolutionStrategy(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @Body() strategyDto: ConflictResolutionStrategyDto)`:
        -   `@Put(':catalogId/conflict-resolution-strategy')`
        -   `@HttpCode(HttpStatus.NO_CONTENT)`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin')`
        -   `@ApiOperation({ summary: 'Set conflict resolution strategy for a catalog' })`
        -   `@ApiResponse({ status: 204, description: 'Strategy set successfully.' })`
        -   Logic: `const merchantId = req.user.merchantId; await this.productCatalogService.setConflictResolutionStrategy(merchantId, catalogId, strategyDto);`
    -   `getCatalogConflicts(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @Query() paginationDto: PaginationDto)`:
        -   `@Get(':catalogId/conflicts')`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin')`
        -   `@ApiOperation({ summary: 'List data conflicts for a catalog' })`
        -   `@ApiResponse({ status: 200, description: 'List of conflicts.', type: PaginatedResponseDto<CatalogConflictResponseDto> })`
        -   Logic: `const merchantId = req.user.merchantId; return this.productCatalogService.getCatalogConflicts(merchantId, catalogId, paginationDto);`
    -   `resolveConflict(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @Param('conflictId', ParseUUIDPipe) conflictId: string, @Body() resolveConflictDto: ResolveConflictRequestDto)`:
        -   `@Post(':catalogId/conflicts/:conflictId/resolve')`
        -   `@HttpCode(HttpStatus.NO_CONTENT)`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin')`
        -   `@ApiOperation({ summary: 'Resolve a data conflict' })`
        -   `@ApiResponse({ status: 204, description: 'Conflict resolved.' })`
        -   Logic: `const merchantId = req.user.merchantId; await this.productCatalogService.resolveConflict(merchantId, catalogId, conflictId, resolveConflictDto);`

#### 4.4.3 `src/modules/product-catalogs/api/v1/controllers/product-feed.controller.ts`
-   **Name**: `ProductFeedController`
-   **Decorator**: `@Controller('v1/merchant/catalogs')`, `@ApiTags('Product Catalog Feeds')`
-   **Methods**:
    -   `generateFeed(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @Body() generateFeedDto: GenerateFeedRequestDto)`:
        -   `@Post(':catalogId/feeds')`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin', 'CampaignManager')`
        -   `@ApiOperation({ summary: 'Generate a product feed for an ad network' })`
        -   `@ApiResponse({ status: 202, description: 'Feed generation initiated.', type: FeedResponseDto })` // 202 Accepted for async
        -   Logic: `const merchantId = req.user.merchantId; return this.productCatalogService.generateFeed(merchantId, catalogId, generateFeedDto);`
    -   `getFeedStatus(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @Param('feedId', ParseUUIDPipe) feedId: string)`:
        -   `@Get(':catalogId/feeds/:feedId/status')`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin', 'CampaignManager')`
        -   `@ApiOperation({ summary: 'Get the status of a generated feed' })`
        -   `@ApiResponse({ status: 200, description: 'Feed status.', type: FeedStatusResponseDto })`
        -   Logic: `const merchantId = req.user.merchantId; return this.productCatalogService.getFeedStatus(merchantId, catalogId, feedId);`
    -   `downloadFeed(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @Param('feedId', ParseUUIDPipe) feedId: string, @Res({ passthrough: true }) res: Response)`:
        -   `@Get(':catalogId/feeds/:feedId/download')`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin', 'CampaignManager')`
        -   `@ApiOperation({ summary: 'Download a generated feed file' })`
        -   `@Header('Content-Type', 'application/octet-stream')` // Will be set dynamically
        -   `@ApiResponse({ status: 200, description: 'Feed file stream.' })`
        -   `@ApiResponse({ status: 404, description: 'Feed not found or not ready.' })`
        -   Logic:
            typescript
            const merchantId = req.user.merchantId;
            const feedDetails = await this.productCatalogService.downloadFeedContent(merchantId, catalogId, feedId);
            if (!feedDetails) throw new NotFoundException('Feed not found or not ready for download.');
            res.setHeader('Content-Type', feedDetails.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${feedDetails.fileName}"`);
            return new StreamableFile(feedDetails.stream);
            
    -   `listFeeds(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @Query() paginationDto: PaginationDto)`:
        -   `@Get(':catalogId/feeds')`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin', 'CampaignManager')`
        -   `@ApiOperation({ summary: 'List generated feeds for a catalog' })`
        -   `@ApiResponse({ status: 200, description: 'List of feeds.', type: PaginatedResponseDto<FeedSummaryDto> })` // Define FeedSummaryDto
        -   Logic: `const merchantId = req.user.merchantId; return this.productCatalogService.listFeeds(merchantId, catalogId, paginationDto);`
    -   `validateFeed(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @Body() validateFeedDto: ValidateFeedRequestDto)`:
        -   `@Post(':catalogId/feeds/validate')`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin', 'CampaignManager')`
        -   `@ApiOperation({ summary: 'Validate a product catalog feed against ad network specifications' })`
        -   `@ApiResponse({ status: 200, description: 'Feed validation result.', type: FeedValidationResultResponseDto })`
        -   Logic: `const merchantId = req.user.merchantId; return this.productCatalogService.validateFeed(merchantId, catalogId, validateFeedDto);`

#### 4.4.4 `src/modules/product-catalogs/api/v1/controllers/product-import.controller.ts`
-   **Name**: `ProductImportController`
-   **Decorator**: `@Controller('v1/merchant/catalogs')`, `@ApiTags('Product Catalog Imports')`
-   **Methods**:
    -   `bulkImportProducts(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: /^(text\/csv|application\/xml|text\/xml)$/i }).addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 /* 10MB Example */}).build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, })) file: Express.Multer.File, @Body() bulkImportDto: BulkImportRequestDto)`:
        -   `@Post(':catalogId/products/import/bulk')`
        -   `@UseInterceptors(FileInterceptor('file'))`
        -   `@ApiConsumes('multipart/form-data')`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin')`
        -   `@ApiOperation({ summary: 'Bulk import products into a catalog from CSV or XML' })`
        -   `@ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, fileFormat: { type: 'string', enum: ['CSV', 'XML'] }, conflictResolutionMode: { type: 'string', enum: ['Overwrite', 'Skip', 'Merge'], optional: true } } } })`
        -   `@ApiResponse({ status: 202, description: 'Bulk import process initiated.', type: BulkImportStatusResponseDto })`
        -   Logic: `const merchantId = req.user.merchantId; if (!file) throw new BadRequestException('File is required.'); return this.productCatalogService.bulkImportProducts(merchantId, catalogId, file.buffer, file.originalname, bulkImportDto);`
    -   `getImportStatus(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @Param('importId', ParseUUIDPipe) importId: string)`:
        -   `@Get(':catalogId/products/import/:importId/status')`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin')`
        -   `@ApiOperation({ summary: 'Get the status of a bulk import job' })`
        -   `@ApiResponse({ status: 200, description: 'Import job status.', type: BulkImportStatusResponseDto })`
        -   Logic: `const merchantId = req.user.merchantId; return this.productCatalogService.getImportStatus(merchantId, catalogId, importId);`
    -   `importExternalCustomizations(@Req() req, @Param('catalogId', ParseUUIDPipe) catalogId: string, @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: 'text/csv' /* Or other formats as needed */ }).addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 /* 5MB Example */}).build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, })) file: Express.Multer.File, @Body() importDto: ExternalCustomizationImportDto)`:
        -   `@Post(':catalogId/products/customizations/import/external')`
        -   `@UseInterceptors(FileInterceptor('file'))`
        -   `@ApiConsumes('multipart/form-data')`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin')`
        -   `@ApiOperation({ summary: 'Import external product catalog customizations' })`
        -   `@ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, sourceSystem: { type: 'string', optional: true }, mappingConfigurationId: { type: 'string', format: 'uuid', optional: true } } } })`
        -   `@ApiResponse({ status: 202, description: 'External customization import initiated.', type: BulkImportStatusResponseDto })`
        -   Logic: `const merchantId = req.user.merchantId; if (!file) throw new BadRequestException('File is required.'); return this.productCatalogService.importExternalCustomizations(merchantId, catalogId, file.buffer, file.originalname, importDto);`

#### 4.4.5 `src/modules/product-catalogs/api/v1/controllers/product-sync.controller.ts`
-   **Name**: `ProductSyncController`
-   **Decorator**: `@Controller('v1/merchant/product-sync')`, `@ApiTags('Product Data Synchronization')`
-   **Methods**:
    -   `triggerCorePlatformSync(@Req() req, @Body() triggerSyncDto: TriggerSyncDto)`:
        -   `@Post('/trigger')`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin')`
        -   `@ApiOperation({ summary: 'Trigger synchronization with core [PlatformName] product data' })`
        -   `@ApiResponse({ status: 202, description: 'Synchronization process initiated.', type: SyncStatusResponseDto })`
        -   Logic: `const merchantId = req.user.merchantId; return this.productCatalogService.triggerCorePlatformSync(merchantId, triggerSyncDto);`
    -   `getCorePlatformSyncStatus(@Req() req, @Query() syncStatusRequestDto: SyncStatusRequestDto)`: // Need SyncStatusRequestDto
        -   `@Get('/status')`
        -   `@UseGuards(JwtAuthGuard, RolesGuard)`
        -   `@Roles('MerchantAdmin', 'CampaignManager')`
        -   `@ApiOperation({ summary: 'Get status of core [PlatformName] product data synchronization' })`
        -   `@ApiResponse({ status: 200, description: 'Synchronization status.', type: SyncStatusResponseDto })`
        -   Logic: `const merchantId = req.user.merchantId; return this.productCatalogService.getCorePlatformSyncStatus(merchantId, syncStatusRequestDto);`


### 4.5 Data Transfer Objects (DTOs)
All DTOs will reside in `src/modules/product-catalogs/api/v1/dtos/` under respective subdirectories (`common`, `catalog`, `feed`, `import`, `sync`). They will use `class-validator` for validation and `@nestjs/swagger` for API documentation.

#### 4.5.1 Common DTOs
-   `pagination.dto.ts`: `PaginationDto` (page: number, limit: number)
-   `api-response.dto.ts`: `PaginatedResponseDto<T>` (data: T[], total: number, page: number, limit: number) - Generic for paginated responses.

#### 4.5.2 Catalog DTOs (`dtos/catalog/`)
-   `create-product-catalog.dto.ts`: `CreateProductCatalogDto` (name: string, description?: string)
-   `update-product-catalog.dto.ts`: `UpdateProductCatalogDto` (name?: string, description?: string)
-   `product-catalog.response.dto.ts`: `ProductCatalogResponseDto` (id, name, description, merchantId, status, productCount, createdAt, updatedAt)
-   `product-catalog-item.dto.ts`: `ProductCatalogItemDto` (coreProductId, adSpecificTitle?, adSpecificDescription?, adSpecificImageUrl?, customAttributes?: Record<string, any>, isIncluded)
-   `customize-product.dto.ts`: `CustomizeProductDto` (adSpecificTitle?, adSpecificDescription?, adSpecificImageUrl?, customAttributes?: Record<string, any>)

#### 4.5.3 Feed DTOs (`dtos/feed/`)
-   `generate-feed.request.dto.ts`: `GenerateFeedRequestDto` (adNetwork: string, feedFormat?: string)
-   `feed.response.dto.ts`: `FeedResponseDto` (feedId, catalogId, adNetwork, status, downloadUrl?, createdAt, expiresAt?)
-   `feed-status.response.dto.ts`: `FeedStatusResponseDto` (feedId, status, message?, lastCheckedAt, downloadUrl?)
-   `validate-feed.request.dto.ts`: `ValidateFeedRequestDto` (adNetwork: string)
-   `feed-validation-result.response.dto.ts`: `FeedValidationResultResponseDto` (isValid: boolean, errors?: string[], warnings?: string[], validatedAt: Date)
-   `feed-summary.dto.ts`: `FeedSummaryDto` (feedId, adNetwork, status, createdAt, downloadUrl?) - *New DTO for listFeeds endpoint.*

#### 4.5.4 Import DTOs (`dtos/import/`)
-   `bulk-import.request.dto.ts`: `BulkImportRequestDto` (fileFormat: 'CSV' | 'XML', conflictResolutionMode?: 'Overwrite' | 'Skip' | 'Merge')
-   `bulk-import-status.response.dto.ts`: `BulkImportStatusResponseDto` (importId, status, processedCount, successCount, errorCount, errors?: string[], startedAt?, completedAt?)
-   `external-customization-import.dto.ts`: `ExternalCustomizationImportDto` (sourceSystem?: string, mappingConfigurationId?: string (UUID))

#### 4.5.5 Sync DTOs (`dtos/sync/`)
-   `trigger-sync.dto.ts`: `TriggerSyncDto` (catalogIds?: string[] (UUIDs), forceFullSync?: boolean)
-   `sync-status.response.dto.ts`: `SyncStatusResponseDto` (syncJobId?, status, lastSyncAt?, nextScheduledSyncAt?, details?)
-   `sync-status.request.dto.ts`: `SyncStatusRequestDto` (syncJobId?: string) - *New DTO for getCorePlatformSyncStatus query.*
-   `conflict-resolution-strategy.dto.ts`: `ConflictResolutionStrategyDto` (strategy: 'PrioritizePlatformName' | 'PrioritizeAdManagerOverrides' | 'NotifyMerchant' | 'AttemptMerge')
-   `catalog-conflict.response.dto.ts`: `CatalogConflictResponseDto` (conflictId, productId, conflictingField, platformNameValue, adManagerOverrideValue, status: 'Unresolved' | 'Resolved', detectedAt)
-   `resolve-conflict.request.dto.ts`: `ResolveConflictRequestDto` (resolutionChoice: 'KeepPlatformNameValue' | 'KeepAdManagerOverride' | 'ManualMerge', mergedValue?: any)

### 4.6 Guards
#### 4.6.1 `src/modules/product-catalogs/api/v1/guards/jwt-auth.guard.ts`
-   **Name**: `JwtAuthGuard`
-   **Extends**: `AuthGuard('jwt')` from `@nestjs/passport`.
-   **Logic**:
    -   Relies on a `JwtStrategy` (assumed to be configured globally or in a shared auth module) to validate the JWT extracted from the `Authorization` header.
    -   If validation is successful, it attaches the user payload (e.g., `req.user = payload`) to the request object.
    -   If API Gateway validates JWT and passes claims, this guard might simply check for `req.user` presence.

#### 4.6.2 `src/modules/product-catalogs/api/v1/guards/roles.guard.ts`
-   **Name**: `RolesGuard`
-   **Implements**: `CanActivate`
-   **Constructor**: `constructor(private reflector: Reflector)`
-   **Logic**:
    -   `canActivate(context: ExecutionContext): boolean`:
        1.  Get `requiredRoles` using `this.reflector.getAllAndOverride<string[]>('ROLES_KEY', [context.getHandler(), context.getClass()])`. (Define `ROLES_KEY` constant and `@Roles()` decorator).
        2.  If no roles are required, return `true`.
        3.  Get `user` from `const { user } = context.switchToHttp().getRequest();`.
        4.  If `user` or `user.roles` is not present, return `false` (or throw `ForbiddenException`).
        5.  Check if `user.roles` (array of strings) has at least one of the `requiredRoles`. Return `true` if a match is found, `false` otherwise.
-   **Supporting Decorator**:
    typescript
    // Example in a shared decorators file or within guards directory
    import { SetMetadata } from '@nestjs/common';
    export const ROLES_KEY = 'roles';
    export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
    

## 5. Data Handling and Storage
-   This API layer does not directly interact with databases. It delegates all data persistence and retrieval operations to the `IProductCatalogService`.
-   File uploads for imports are handled using `Express.Multer.File`. The file buffer is passed to the service layer.
-   Feed downloads are streamed from the service layer.

## 6. Error Handling
-   Standard NestJS exception handling will be used.
    -   `ValidationPipe` will throw `BadRequestException` for DTO validation errors.
    -   `ParseUUIDPipe` will throw `BadRequestException` for invalid UUIDs.
    -   Service layer exceptions (e.g., `NotFoundException`, custom business logic exceptions) will be propagated.
    -   Unhandled errors will result in `InternalServerErrorException`.
-   Responses will use standard HTTP status codes.

## 7. Logging
-   Inject NestJS `LoggerService` (`@Inject(Logger) private readonly logger: LoggerService;`) into controllers.
-   Log entry and exit of controller methods at `DEBUG` or `VERBOSE` level, including key parameters (excluding sensitive data).
-   Log errors at `ERROR` level with stack traces and request context.
-   Example: `this.logger.log(\`User ${req.user.id} creating catalog: ${JSON.stringify(createDto)}\`, ProductCatalogController.name);`

## 8. Third-Party Libraries
-   `class-validator`, `class-transformer`: Used extensively in DTOs for validation and transformation.
-   `@nestjs/swagger`: Used for generating OpenAPI documentation.
-   `fast-csv`, `xmlbuilder2`: These libraries are relevant to the service layer for processing imported files and generating feeds. The API layer only defines the contract for such operations and handles file transport.

## 9. Security Considerations
-   **Authentication**: All sensitive endpoints are protected by `JwtAuthGuard`.
-   **Authorization**: Role-based access control is implemented using `RolesGuard` and the `@Roles` decorator, ensuring users can only access functionalities permitted by their role (e.g., `MerchantAdmin`, `CampaignManager`).
-   **Input Validation**: All incoming data via DTOs is validated using `class-validator` to prevent common injection attacks and ensure data integrity.
-   **HTTPS**: Assumed to be enforced by the API Gateway.
-   **Rate Limiting/Throttling**: Assumed to be primarily handled by the API Gateway.
-   **Sensitive Data**: No direct handling of highly sensitive data like payment information in this API layer. `merchantId` is used for tenancy.

## 10. Future Considerations / Extensibility
-   The API is versioned (`/v1/`) to allow for future non-breaking or breaking changes.
-   New ad networks or feed formats can be added by extending enums in DTOs and updating the service layer implementation. The API contracts are generally flexible.
-   More granular roles or permissions could be introduced in the future by extending the `RolesGuard` and `IProductCatalogService` if needed.
-   Support for additional import file formats would require updates to `ParseFilePipeBuilder` in controllers and the service layer.

This SDS provides a comprehensive guide for developing the `ProductCatalog.ApiEndpoints` module. It focuses on clear contracts, robust validation, security, and adherence to the overall system architecture.