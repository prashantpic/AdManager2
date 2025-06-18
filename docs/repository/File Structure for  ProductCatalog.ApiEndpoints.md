# Specification

# 1. Files

- **Path:** src/modules/product-catalogs/api/v1/product-catalog-api.module.ts  
**Description:** NestJS module definition for the V1 Product Catalog API. Imports controllers and providers for this API version.  
**Template:** NestJS Module  
**Dependancy Level:** 2  
**Name:** ProductCatalogApiModule  
**Type:** Module  
**Relative Path:** v1/product-catalog-api.module.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - Module
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - API Module Definition
    
**Requirement Ids:**
    
    - REQ-PC-001
    - REQ-PC-002
    - REQ-PC-003
    - REQ-PC-004
    - REQ-PC-005
    - REQ-PC-006
    - REQ-PC-007
    - REQ-CPSI-001
    - REQ-CPSI-002
    - REQ-DOMS-001
    - REQ-DOMS-005
    
**Purpose:** Organizes and encapsulates all V1 Product Catalog API related controllers, providers, and configurations.  
**Logic Description:** Declares controllers such as ProductCatalogController, ProductFeedController, ProductImportController, ProductSyncController. Provides the IProductCatalogService token for dependency injection, expecting the actual service implementation to be provided by a higher-level module or dynamically.  
**Documentation:**
    
    - **Summary:** Entry point for the Product Catalog API v1 module, defining its components and dependencies.
    
**Namespace:** AdManager.ProductCatalog.Api.V1  
**Metadata:**
    
    - **Category:** API
    
- **Path:** src/modules/product-catalogs/api/v1/constants/product-catalog.constants.ts  
**Description:** Defines constants for the Product Catalog API module, such as injection tokens.  
**Template:** TypeScript Constants  
**Dependancy Level:** 0  
**Name:** product-catalog.constants  
**Type:** Constants  
**Relative Path:** v1/constants/product-catalog.constants.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** PRODUCT_CATALOG_SERVICE_TOKEN  
**Type:** InjectionToken  
**Attributes:** export const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Service Injection Tokens
    
**Requirement Ids:**
    
    
**Purpose:** Provides strongly-typed tokens for dependency injection, particularly for service interfaces.  
**Logic Description:** Exports symbols (e.g., PRODUCT_CATALOG_SERVICE_TOKEN) to be used for injecting dependencies like IProductCatalogService.  
**Documentation:**
    
    - **Summary:** Contains shared constants and injection tokens for the Product Catalog API module.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Constants  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/product-catalogs/api/v1/interfaces/product-catalog-service.interface.ts  
**Description:** Interface defining the contract for the ProductCatalogService. This API layer depends on this contract for interacting with the application service layer.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** IProductCatalogService  
**Type:** Interface  
**Relative Path:** v1/interfaces/product-catalog-service.interface.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DependencyInversionPrinciple
    - InterfaceSegregationPrinciple
    
**Members:**
    
    
**Methods:**
    
    - **Name:** createCatalog  
**Parameters:**
    
    - merchantId: string
    - createDto: CreateProductCatalogDto
    
**Return Type:** Promise<ProductCatalogResponseDto>  
**Attributes:**   
    - **Name:** findAllCatalogs  
**Parameters:**
    
    - merchantId: string
    - paginationDto: PaginationDto
    
**Return Type:** Promise<PaginatedResponse<ProductCatalogResponseDto>>  
**Attributes:**   
    - **Name:** findOneCatalog  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    
**Return Type:** Promise<ProductCatalogResponseDto>  
**Attributes:**   
    - **Name:** updateCatalog  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    - updateDto: UpdateProductCatalogDto
    
**Return Type:** Promise<ProductCatalogResponseDto>  
**Attributes:**   
    - **Name:** removeCatalog  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** addProductCustomization  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    - productId: string
    - dto: CustomizeProductDto
    
**Return Type:** Promise<ProductCatalogItemDto>  
**Attributes:**   
    - **Name:** getProductCustomization  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    - productId: string
    
**Return Type:** Promise<ProductCatalogItemDto>  
**Attributes:**   
    - **Name:** removeProductCustomization  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    - productId: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** setConflictResolutionStrategy  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    - dto: ConflictResolutionStrategyDto
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** getCatalogConflicts  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    - paginationDto: PaginationDto
    
**Return Type:** Promise<PaginatedResponse<CatalogConflictResponseDto>>  
**Attributes:**   
    - **Name:** resolveConflict  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    - conflictId: string
    - dto: ResolveConflictRequestDto
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** generateFeed  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    - dto: GenerateFeedRequestDto
    
**Return Type:** Promise<FeedResponseDto>  
**Attributes:**   
    - **Name:** getFeedStatus  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    - feedId: string
    
**Return Type:** Promise<FeedStatusResponseDto>  
**Attributes:**   
    - **Name:** listFeeds  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    - paginationDto: PaginationDto
    
**Return Type:** Promise<PaginatedResponse<FeedSummaryDto>>  
**Attributes:**   
    - **Name:** validateFeed  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    - dto: ValidateFeedRequestDto
    
**Return Type:** Promise<FeedValidationResultResponseDto>  
**Attributes:**   
    - **Name:** bulkImportProducts  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    - fileBuffer: Buffer
    - dto: BulkImportRequestDto
    
**Return Type:** Promise<BulkImportStatusResponseDto>  
**Attributes:**   
    - **Name:** getImportStatus  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    - importId: string
    
**Return Type:** Promise<BulkImportStatusResponseDto>  
**Attributes:**   
    - **Name:** importExternalCustomizations  
**Parameters:**
    
    - merchantId: string
    - catalogId: string
    - fileBuffer: Buffer
    - dto: ExternalCustomizationImportDto
    
**Return Type:** Promise<BulkImportStatusResponseDto>  
**Attributes:**   
    - **Name:** triggerCorePlatformSync  
**Parameters:**
    
    - merchantId: string
    - dto: TriggerSyncDto
    
**Return Type:** Promise<SyncStatusResponseDto>  
**Attributes:**   
    - **Name:** getCorePlatformSyncStatus  
**Parameters:**
    
    - merchantId: string
    - dto: SyncStatusRequestDto
    
**Return Type:** Promise<SyncStatusResponseDto>  
**Attributes:**   
    
**Implemented Features:**
    
    - Service Contract Definition
    
**Requirement Ids:**
    
    - REQ-PC-001
    - REQ-PC-002
    - REQ-PC-003
    - REQ-PC-004
    - REQ-PC-005
    - REQ-PC-006
    - REQ-PC-007
    - REQ-CPSI-001
    - REQ-CPSI-002
    - REQ-DOMS-001
    - REQ-DOMS-005
    
**Purpose:** Defines the methods and signatures for product catalog operations, decoupling the API controllers from concrete service implementations.  
**Logic Description:** This interface outlines all business operations related to product catalogs, feeds, imports, synchronization, and conflict resolution that the underlying service layer must implement.  
**Documentation:**
    
    - **Summary:** Specifies the contract that the Product Catalog API controllers will use to interact with the application service layer for managing product catalogs and related entities.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Interfaces  
**Metadata:**
    
    - **Category:** API
    
- **Path:** src/modules/product-catalogs/api/v1/controllers/product-catalog.controller.ts  
**Description:** Handles HTTP requests related to Product Catalog CRUD, customizations, and conflict resolution.  
**Template:** NestJS Controller  
**Dependancy Level:** 1  
**Name:** ProductCatalogController  
**Type:** Controller  
**Relative Path:** v1/controllers/product-catalog.controller.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - MVC Controller
    - RESTful API
    
**Members:**
    
    - **Name:** productCatalogService  
**Type:** IProductCatalogService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** create  
**Parameters:**
    
    - @Req() req
    - @Body() createProductCatalogDto: CreateProductCatalogDto
    
**Return Type:** Promise<ProductCatalogResponseDto>  
**Attributes:** @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation @ApiResponse  
    - **Name:** findAll  
**Parameters:**
    
    - @Req() req
    - @Query() paginationDto: PaginationDto
    
**Return Type:** Promise<PaginatedResponse<ProductCatalogResponseDto>>  
**Attributes:** @Get() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation @ApiResponse  
    - **Name:** findOne  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    
**Return Type:** Promise<ProductCatalogResponseDto>  
**Attributes:** @Get(':catalogId') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation @ApiResponse  
    - **Name:** update  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @Body() updateProductCatalogDto: UpdateProductCatalogDto
    
**Return Type:** Promise<ProductCatalogResponseDto>  
**Attributes:** @Patch(':catalogId') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation @ApiResponse  
    - **Name:** remove  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    
**Return Type:** Promise<void>  
**Attributes:** @Delete(':catalogId') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation @ApiResponse  
    - **Name:** addOrUpdateProductCustomization  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @Param('productId') productId: string
    - @Body() customizeProductDto: CustomizeProductDto
    
**Return Type:** Promise<ProductCatalogItemDto>  
**Attributes:** @Post(':catalogId/products/:productId/customizations') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation @ApiResponse  
    - **Name:** getProductCustomization  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @Param('productId') productId: string
    
**Return Type:** Promise<ProductCatalogItemDto>  
**Attributes:** @Get(':catalogId/products/:productId/customizations') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation @ApiResponse  
    - **Name:** removeProductCustomization  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @Param('productId') productId: string
    
**Return Type:** Promise<void>  
**Attributes:** @Delete(':catalogId/products/:productId/customizations') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation @ApiResponse  
    - **Name:** setConflictResolutionStrategy  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @Body() strategyDto: ConflictResolutionStrategyDto
    
**Return Type:** Promise<void>  
**Attributes:** @Put(':catalogId/conflict-resolution-strategy') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation @ApiResponse  
    - **Name:** getCatalogConflicts  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @Query() paginationDto: PaginationDto
    
**Return Type:** Promise<PaginatedResponse<CatalogConflictResponseDto>>  
**Attributes:** @Get(':catalogId/conflicts') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation @ApiResponse  
    - **Name:** resolveConflict  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @Param('conflictId') conflictId: string
    - @Body() resolveConflictDto: ResolveConflictRequestDto
    
**Return Type:** Promise<void>  
**Attributes:** @Post(':catalogId/conflicts/:conflictId/resolve') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation @ApiResponse  
    
**Implemented Features:**
    
    - Product Catalog Management
    - Product Customization
    - Conflict Resolution Management
    
**Requirement Ids:**
    
    - REQ-PC-001
    - REQ-PC-003
    - REQ-PC-005
    - REQ-CPSI-002
    
**Purpose:** Exposes endpoints for merchants to manage their product catalogs, apply advertising-specific customizations, and handle data conflicts.  
**Logic Description:** Receives HTTP requests, validates DTOs, extracts merchant context (e.g., from JWT claims via @Req()), and delegates business logic to IProductCatalogService. Uses NestJS decorators for routing, validation, serialization, and Swagger documentation.  
**Documentation:**
    
    - **Summary:** Controller for managing product catalog entities, including their lifecycle, product customizations, and conflict resolution settings.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** API
    
- **Path:** src/modules/product-catalogs/api/v1/controllers/product-feed.controller.ts  
**Description:** Handles HTTP requests related to Product Feed generation and validation for ad networks.  
**Template:** NestJS Controller  
**Dependancy Level:** 1  
**Name:** ProductFeedController  
**Type:** Controller  
**Relative Path:** v1/controllers/product-feed.controller.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - MVC Controller
    - RESTful API
    
**Members:**
    
    - **Name:** productCatalogService  
**Type:** IProductCatalogService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** generateFeed  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @Body() generateFeedDto: GenerateFeedRequestDto
    
**Return Type:** Promise<FeedResponseDto>  
**Attributes:** @Post(':catalogId/feeds') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation @ApiResponse  
    - **Name:** getFeedStatus  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @Param('feedId') feedId: string
    
**Return Type:** Promise<FeedStatusResponseDto>  
**Attributes:** @Get(':catalogId/feeds/:feedId/status') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation @ApiResponse  
    - **Name:** downloadFeed  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @Param('feedId') feedId: string
    - @Res() response
    
**Return Type:** Promise<void>  
**Attributes:** @Get(':catalogId/feeds/:feedId/download') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation @ApiResponse  
    - **Name:** listFeeds  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @Query() paginationDto: PaginationDto
    
**Return Type:** Promise<PaginatedResponse<FeedSummaryDto>>  
**Attributes:** @Get(':catalogId/feeds') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation @ApiResponse  
    - **Name:** validateFeed  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @Body() validateFeedDto: ValidateFeedRequestDto
    
**Return Type:** Promise<FeedValidationResultResponseDto>  
**Attributes:** @Post(':catalogId/feeds/validate') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation @ApiResponse  
    
**Implemented Features:**
    
    - Product Feed Generation
    - Feed Validation
    - Feed Status Tracking
    
**Requirement Ids:**
    
    - REQ-PC-006
    - REQ-PC-007
    - 3.4.2 (product catalog feeds part)
    
**Purpose:** Exposes endpoints for generating and validating product catalog feeds for various ad networks.  
**Logic Description:** Receives HTTP requests for feed operations, validates inputs, calls IProductCatalogService methods for business logic, and returns appropriate responses. Handles feed downloads by streaming data.  
**Documentation:**
    
    - **Summary:** Controller for managing product catalog feeds, including generation, validation, status retrieval, and download.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** API
    
- **Path:** src/modules/product-catalogs/api/v1/controllers/product-import.controller.ts  
**Description:** Handles HTTP requests related to bulk importing product data into catalogs.  
**Template:** NestJS Controller  
**Dependancy Level:** 1  
**Name:** ProductImportController  
**Type:** Controller  
**Relative Path:** v1/controllers/product-import.controller.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - MVC Controller
    - RESTful API
    
**Members:**
    
    - **Name:** productCatalogService  
**Type:** IProductCatalogService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** bulkImportProducts  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: /^(text\/csv|application\/xml|text\/xml)$/ }).build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })) file: Express.Multer.File
    - @Body() bulkImportDto: BulkImportRequestDto
    
**Return Type:** Promise<BulkImportStatusResponseDto>  
**Attributes:** @Post(':catalogId/import') @UseInterceptors(FileInterceptor('file')) @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation @ApiConsumes('multipart/form-data') @ApiResponse  
    - **Name:** getImportStatus  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @Param('importId') importId: string
    
**Return Type:** Promise<BulkImportStatusResponseDto>  
**Attributes:** @Get(':catalogId/import/:importId/status') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation @ApiResponse  
    - **Name:** importExternalCustomizations  
**Parameters:**
    
    - @Req() req
    - @Param('catalogId') catalogId: string
    - @UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({ fileType: 'text/csv' }).build()) file: Express.Multer.File
    - @Body() importDto: ExternalCustomizationImportDto
    
**Return Type:** Promise<BulkImportStatusResponseDto>  
**Attributes:** @Post(':catalogId/external-customizations/import') @UseInterceptors(FileInterceptor('file')) @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation @ApiConsumes('multipart/form-data') @ApiResponse  
    
**Implemented Features:**
    
    - Bulk Product Data Import (CSV/XML)
    - Import Status Tracking
    - External Customization Import
    
**Requirement Ids:**
    
    - REQ-PC-004
    - REQ-DOMS-005
    
**Purpose:** Provides endpoints for merchants to upload and process bulk product data files for their catalogs.  
**Logic Description:** Handles file uploads (CSV, XML) using NestJS FileInterceptor. Validates file types and DTOs. Delegates file processing and data import logic to IProductCatalogService. Provides endpoints to check import job status.  
**Documentation:**
    
    - **Summary:** Controller for managing bulk import operations for product catalogs, including uploading data files and tracking import progress.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** API
    
- **Path:** src/modules/product-catalogs/api/v1/controllers/product-sync.controller.ts  
**Description:** Handles HTTP requests related to synchronizing product data with the core [PlatformName] platform.  
**Template:** NestJS Controller  
**Dependancy Level:** 1  
**Name:** ProductSyncController  
**Type:** Controller  
**Relative Path:** v1/controllers/product-sync.controller.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - MVC Controller
    - RESTful API
    
**Members:**
    
    - **Name:** productCatalogService  
**Type:** IProductCatalogService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** triggerCorePlatformSync  
**Parameters:**
    
    - @Req() req
    - @Body() triggerSyncDto: TriggerSyncDto
    
**Return Type:** Promise<SyncStatusResponseDto>  
**Attributes:** @Post('/trigger') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin') @ApiOperation @ApiResponse  
    - **Name:** getCorePlatformSyncStatus  
**Parameters:**
    
    - @Req() req
    - @Query() syncStatusRequestDto: SyncStatusRequestDto
    
**Return Type:** Promise<SyncStatusResponseDto>  
**Attributes:** @Get('/status') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation @ApiResponse  
    
**Implemented Features:**
    
    - Core Platform Product Data Synchronization
    
**Requirement Ids:**
    
    - REQ-PC-002
    - REQ-CPSI-001
    - REQ-DOMS-001
    
**Purpose:** Exposes endpoints to trigger and monitor the synchronization of product data from the main e-commerce platform.  
**Logic Description:** Receives requests to initiate synchronization tasks or retrieve the status of ongoing/past sync jobs. Delegates these operations to the IProductCatalogService.  
**Documentation:**
    
    - **Summary:** Controller for managing synchronization processes between Ad Manager product catalogs and the core [PlatformName] e-commerce platform.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** API
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/common/pagination.dto.ts  
**Description:** Data Transfer Object for pagination parameters.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** PaginationDto  
**Type:** DTO  
**Relative Path:** v1/dtos/common/pagination.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** page  
**Type:** number  
**Attributes:** @IsOptional() @IsInt() @Min(1) @Type(() => Number)  
    - **Name:** limit  
**Type:** number  
**Attributes:** @IsOptional() @IsInt() @Min(1) @Max(100) @Type(() => Number)  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Pagination Input
    
**Requirement Ids:**
    
    - REQ-PC-001
    
**Purpose:** Defines common query parameters for paginated API responses.  
**Logic Description:** Uses class-validator decorators for validation and class-transformer for type conversion. Provides default values if not specified.  
**Documentation:**
    
    - **Summary:** Standard DTO for handling pagination in API requests, specifying page number and items per page.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Common  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/common/api-response.dto.ts  
**Description:** Generic Data Transfer Object for API responses, particularly for paginated lists.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** PaginatedResponseDto  
**Type:** DTO  
**Relative Path:** v1/dtos/common/api-response.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** data  
**Type:** T[]  
**Attributes:** @ApiProperty()  
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
    
    - **Name:** constructor  
**Parameters:**
    
    - data: T[]
    - total: number
    - page: number
    - limit: number
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Paginated API Response Structure
    
**Requirement Ids:**
    
    - REQ-PC-001
    
**Purpose:** Provides a standardized structure for returning lists of data with pagination information.  
**Logic Description:** A generic class that wraps an array of data items along with total count, current page, and items per page. Used by controllers to format paginated responses.  
**Documentation:**
    
    - **Summary:** Defines a standard wrapper for paginated API responses, including the data array and pagination metadata.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Common  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/catalog/create-product-catalog.dto.ts  
**Description:** DTO for creating a new product catalog.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** CreateProductCatalogDto  
**Type:** DTO  
**Relative Path:** v1/dtos/catalog/create-product-catalog.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** name  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @MaxLength(255) @ApiProperty()  
    - **Name:** description  
**Type:** string  
**Attributes:** @IsOptional() @IsString() @MaxLength(1000) @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Product Catalog Creation Input
    
**Requirement Ids:**
    
    - REQ-PC-001
    
**Purpose:** Defines the data structure required to create a new product catalog.  
**Logic Description:** Includes fields like name and description, with validation rules using class-validator.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for the request payload when creating a new product catalog.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Catalog  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/catalog/update-product-catalog.dto.ts  
**Description:** DTO for updating an existing product catalog.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** UpdateProductCatalogDto  
**Type:** DTO  
**Relative Path:** v1/dtos/catalog/update-product-catalog.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** name  
**Type:** string  
**Attributes:** @IsOptional() @IsString() @IsNotEmpty() @MaxLength(255) @ApiPropertyOptional()  
    - **Name:** description  
**Type:** string  
**Attributes:** @IsOptional() @IsString() @MaxLength(1000) @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Product Catalog Update Input
    
**Requirement Ids:**
    
    - REQ-PC-001
    
**Purpose:** Defines the data structure for updating product catalog details. All fields are optional.  
**Logic Description:** Specifies optional fields for updating a catalog, such as name and description, with validation.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for the request payload when updating an existing product catalog.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Catalog  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/catalog/product-catalog.response.dto.ts  
**Description:** DTO for product catalog API responses.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** ProductCatalogResponseDto  
**Type:** DTO  
**Relative Path:** v1/dtos/catalog/product-catalog.response.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** name  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** description  
**Type:** string  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** merchantId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** status  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** productCount  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** createdAt  
**Type:** Date  
**Attributes:** @ApiProperty()  
    - **Name:** updatedAt  
**Type:** Date  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Product Catalog API Response
    
**Requirement Ids:**
    
    - REQ-PC-001
    
**Purpose:** Defines the structure of a product catalog object returned by the API.  
**Logic Description:** Includes core catalog attributes, status, counts, and timestamps for API responses.  
**Documentation:**
    
    - **Summary:** Data Transfer Object representing a product catalog in API responses.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Catalog  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/catalog/product-catalog-item.dto.ts  
**Description:** DTO representing an item within a product catalog, including customizations.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** ProductCatalogItemDto  
**Type:** DTO  
**Relative Path:** v1/dtos/catalog/product-catalog-item.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** coreProductId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** adSpecificTitle  
**Type:** string  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** adSpecificDescription  
**Type:** string  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** adSpecificImageUrl  
**Type:** string  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** customAttributes  
**Type:** Record<string, any>  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** isIncluded  
**Type:** boolean  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Customized Product Representation
    
**Requirement Ids:**
    
    - REQ-PC-003
    
**Purpose:** Defines the structure for a product item within an ad catalog, highlighting ad-specific overrides.  
**Logic Description:** Contains fields for core product ID and various ad-specific attributes that can be customized.  
**Documentation:**
    
    - **Summary:** Data Transfer Object representing a product item with its advertising-specific customizations within a catalog.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Catalog  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/catalog/customize-product.dto.ts  
**Description:** DTO for applying ad-specific customizations to a product in a catalog.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** CustomizeProductDto  
**Type:** DTO  
**Relative Path:** v1/dtos/catalog/customize-product.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** adSpecificTitle  
**Type:** string  
**Attributes:** @IsOptional() @IsString() @MaxLength(255) @ApiPropertyOptional()  
    - **Name:** adSpecificDescription  
**Type:** string  
**Attributes:** @IsOptional() @IsString() @MaxLength(1000) @ApiPropertyOptional()  
    - **Name:** adSpecificImageUrl  
**Type:** string  
**Attributes:** @IsOptional() @IsUrl() @ApiPropertyOptional()  
    - **Name:** customAttributes  
**Type:** Record<string, any>  
**Attributes:** @IsOptional() @IsObject() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Product Customization Input
    
**Requirement Ids:**
    
    - REQ-PC-003
    
**Purpose:** Defines the payload for customizing product attributes for advertising purposes within a specific catalog.  
**Logic Description:** Allows merchants to specify overrides for product title, description, image URL, and other custom fields for ads.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for providing ad-specific overrides for a product within a catalog.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Catalog  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/feed/generate-feed.request.dto.ts  
**Description:** DTO for requesting product feed generation.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** GenerateFeedRequestDto  
**Type:** DTO  
**Relative Path:** v1/dtos/feed/generate-feed.request.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** adNetwork  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @IsIn(['Google', 'Instagram', 'TikTok', 'Snapchat']) @ApiProperty({ enum: ['Google', 'Instagram', 'TikTok', 'Snapchat'] })  
    - **Name:** feedFormat  
**Type:** string  
**Attributes:** @IsOptional() @IsString() @IsIn(['CSV', 'XML', 'JSON']) @ApiPropertyOptional({ enum: ['CSV', 'XML', 'JSON'] })  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Feed Generation Request
    
**Requirement Ids:**
    
    - REQ-PC-006
    
**Purpose:** Defines parameters for requesting the generation of a product feed for a specific ad network.  
**Logic Description:** Specifies the target ad network and optionally the desired feed format.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for initiating the generation of a product catalog feed.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Feed  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/feed/feed.response.dto.ts  
**Description:** DTO representing a generated product feed or its reference.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** FeedResponseDto  
**Type:** DTO  
**Relative Path:** v1/dtos/feed/feed.response.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** feedId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** catalogId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** adNetwork  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** status  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** downloadUrl  
**Type:** string  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** createdAt  
**Type:** Date  
**Attributes:** @ApiProperty()  
    - **Name:** expiresAt  
**Type:** Date  
**Attributes:** @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Generated Feed Information
    
**Requirement Ids:**
    
    - REQ-PC-006
    
**Purpose:** Provides details about a generated product feed, including its ID, status, and download link.  
**Logic Description:** Contains identifying information for a generated feed and its current processing state.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for representing a generated product feed and its metadata.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Feed  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/feed/feed-status.response.dto.ts  
**Description:** DTO for product feed status responses.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** FeedStatusResponseDto  
**Type:** DTO  
**Relative Path:** v1/dtos/feed/feed-status.response.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** feedId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** status  
**Type:** string  
**Attributes:** @ApiProperty({ enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Validated'] })  
    - **Name:** message  
**Type:** string  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** lastCheckedAt  
**Type:** Date  
**Attributes:** @ApiProperty()  
    - **Name:** downloadUrl  
**Type:** string  
**Attributes:** @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Feed Status Reporting
    
**Requirement Ids:**
    
    - REQ-PC-006
    - REQ-PC-007
    
**Purpose:** Defines the structure for reporting the status of a product feed generation or validation process.  
**Logic Description:** Includes feed ID, current status (e.g., processing, completed, failed), and any relevant messages.  
**Documentation:**
    
    - **Summary:** Data Transfer Object used to convey the current status of a product feed processing job.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Feed  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/feed/validate-feed.request.dto.ts  
**Description:** DTO for requesting product feed validation.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** ValidateFeedRequestDto  
**Type:** DTO  
**Relative Path:** v1/dtos/feed/validate-feed.request.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** adNetwork  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @IsIn(['Google', 'Instagram', 'TikTok', 'Snapchat']) @ApiProperty({ enum: ['Google', 'Instagram', 'TikTok', 'Snapchat'] })  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Feed Validation Request
    
**Requirement Ids:**
    
    - REQ-PC-007
    
**Purpose:** Defines parameters for requesting validation of a product catalog feed against a specific ad network's specifications.  
**Logic Description:** Specifies the target ad network for validation. The actual feed data to be validated is typically implied by the catalog context.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for initiating the validation of a product catalog feed against ad network rules.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Feed  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/feed/feed-validation-result.response.dto.ts  
**Description:** DTO for product feed validation results.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** FeedValidationResultResponseDto  
**Type:** DTO  
**Relative Path:** v1/dtos/feed/feed-validation-result.response.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** isValid  
**Type:** boolean  
**Attributes:** @ApiProperty()  
    - **Name:** errors  
**Type:** string[]  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** warnings  
**Type:** string[]  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** validatedAt  
**Type:** Date  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Feed Validation Outcome
    
**Requirement Ids:**
    
    - REQ-PC-007
    - 3.4.2 (product catalog feeds part)
    
**Purpose:** Defines the structure for returning the results of a product feed validation.  
**Logic Description:** Indicates if the feed is valid and lists any errors or warnings found during the validation process.  
**Documentation:**
    
    - **Summary:** Data Transfer Object presenting the results of a product feed validation, including errors and warnings.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Feed  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/import/bulk-import.request.dto.ts  
**Description:** DTO for bulk importing product data.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** BulkImportRequestDto  
**Type:** DTO  
**Relative Path:** v1/dtos/import/bulk-import.request.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** fileFormat  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @IsIn(['CSV', 'XML']) @ApiProperty({ enum: ['CSV', 'XML'] })  
    - **Name:** conflictResolutionMode  
**Type:** string  
**Attributes:** @IsOptional() @IsString() @IsIn(['Overwrite', 'Skip', 'Merge']) @ApiPropertyOptional({ enum: ['Overwrite', 'Skip', 'Merge'] })  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Bulk Import Parameters
    
**Requirement Ids:**
    
    - REQ-PC-004
    
**Purpose:** Defines parameters accompanying a bulk product data file upload, such as file format.  
**Logic Description:** Specifies the format of the uploaded file (CSV or XML) and optional conflict resolution strategy for imported data.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for specifying details of a bulk product import operation, like format and conflict handling.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Import  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/import/bulk-import-status.response.dto.ts  
**Description:** DTO for bulk import status responses.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** BulkImportStatusResponseDto  
**Type:** DTO  
**Relative Path:** v1/dtos/import/bulk-import-status.response.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** importId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** status  
**Type:** string  
**Attributes:** @ApiProperty({ enum: ['Pending', 'Processing', 'Completed', 'Failed'] })  
    - **Name:** processedCount  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** successCount  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** errorCount  
**Type:** number  
**Attributes:** @ApiProperty()  
    - **Name:** errors  
**Type:** string[]  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** startedAt  
**Type:** Date  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** completedAt  
**Type:** Date  
**Attributes:** @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Import Job Status
    
**Requirement Ids:**
    
    - REQ-PC-004
    - REQ-DOMS-005
    
**Purpose:** Defines the structure for reporting the status of a bulk product data import job.  
**Logic Description:** Includes import job ID, status, counts of processed/successful/failed items, and error details.  
**Documentation:**
    
    - **Summary:** Data Transfer Object used to convey the progress and outcome of a bulk product import job.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Import  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/import/external-customization-import.dto.ts  
**Description:** DTO for importing external product catalog customizations.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** ExternalCustomizationImportDto  
**Type:** DTO  
**Relative Path:** v1/dtos/import/external-customization-import.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** sourceSystem  
**Type:** string  
**Attributes:** @IsOptional() @IsString() @ApiPropertyOptional()  
    - **Name:** mappingConfigurationId  
**Type:** string  
**Attributes:** @IsOptional() @IsUUID() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - External Customization Import Parameters
    
**Requirement Ids:**
    
    - REQ-DOMS-005
    
**Purpose:** Defines parameters accompanying a file upload for importing product catalog customizations from an external system.  
**Logic Description:** May specify the source system or a pre-defined mapping configuration to aid in processing the imported data.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for providing metadata related to the import of product catalog customizations from external sources.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Import  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/sync/trigger-sync.dto.ts  
**Description:** DTO for triggering synchronization with the core platform.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** TriggerSyncDto  
**Type:** DTO  
**Relative Path:** v1/dtos/sync/trigger-sync.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** catalogIds  
**Type:** string[]  
**Attributes:** @IsOptional() @IsArray() @IsUUID('4', { each: true }) @ApiPropertyOptional()  
    - **Name:** forceFullSync  
**Type:** boolean  
**Attributes:** @IsOptional() @IsBoolean() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Synchronization Trigger Parameters
    
**Requirement Ids:**
    
    - REQ-PC-002
    - REQ-CPSI-001
    - REQ-DOMS-001
    
**Purpose:** Defines parameters for initiating a product data synchronization task with the core [PlatformName] e-commerce platform.  
**Logic Description:** Allows specifying target catalog IDs for sync (optional, defaults to all merchant catalogs) and whether to force a full resynchronization.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for requesting a product data synchronization with the core platform.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Sync  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/sync/sync-status.response.dto.ts  
**Description:** DTO for core platform synchronization status responses.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** SyncStatusResponseDto  
**Type:** DTO  
**Relative Path:** v1/dtos/sync/sync-status.response.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** syncJobId  
**Type:** string  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** status  
**Type:** string  
**Attributes:** @ApiProperty({ enum: ['Idle', 'InProgress', 'Completed', 'Failed', 'PartiallyCompleted'] })  
    - **Name:** lastSyncAt  
**Type:** Date  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** nextScheduledSyncAt  
**Type:** Date  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** details  
**Type:** string  
**Attributes:** @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Sync Job Status Reporting
    
**Requirement Ids:**
    
    - REQ-PC-002
    - REQ-CPSI-001
    - REQ-DOMS-001
    
**Purpose:** Defines the structure for reporting the status of a product data synchronization job with the core platform.  
**Logic Description:** Includes job ID, current status, timestamps, and any relevant details or error messages.  
**Documentation:**
    
    - **Summary:** Data Transfer Object used to convey the current status of a product data synchronization job.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Sync  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/sync/conflict-resolution-strategy.dto.ts  
**Description:** DTO for setting or viewing conflict resolution strategy for a catalog.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** ConflictResolutionStrategyDto  
**Type:** DTO  
**Relative Path:** v1/dtos/sync/conflict-resolution-strategy.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** strategy  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @IsIn(['PrioritizePlatformName', 'PrioritizeAdManagerOverrides', 'NotifyMerchant', 'AttemptMerge']) @ApiProperty({ enum: ['PrioritizePlatformName', 'PrioritizeAdManagerOverrides', 'NotifyMerchant', 'AttemptMerge'] })  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Conflict Resolution Strategy Setting
    
**Requirement Ids:**
    
    - REQ-PC-005
    - REQ-CPSI-002
    
**Purpose:** Defines the payload for specifying the conflict resolution strategy to be used for a product catalog.  
**Logic Description:** Allows selection from predefined strategies for handling discrepancies between core platform data and Ad Manager overrides.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for configuring the conflict resolution strategy for a product catalog during data synchronization.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Sync  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/sync/catalog-conflict.response.dto.ts  
**Description:** DTO representing a data conflict identified in a catalog.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** CatalogConflictResponseDto  
**Type:** DTO  
**Relative Path:** v1/dtos/sync/catalog-conflict.response.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** conflictId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** productId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** conflictingField  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** platformNameValue  
**Type:** any  
**Attributes:** @ApiProperty()  
    - **Name:** adManagerOverrideValue  
**Type:** any  
**Attributes:** @ApiProperty()  
    - **Name:** status  
**Type:** string  
**Attributes:** @ApiProperty({ enum: ['Unresolved', 'Resolved'] })  
    - **Name:** detectedAt  
**Type:** Date  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Conflict Data Representation
    
**Requirement Ids:**
    
    - REQ-PC-005
    - REQ-CPSI-002
    
**Purpose:** Defines the structure for representing a single data conflict that needs resolution.  
**Logic Description:** Details the product, field, conflicting values, and current resolution status.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for representing an identified data conflict within a product catalog.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Sync  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/dtos/sync/resolve-conflict.request.dto.ts  
**Description:** DTO for resolving a specific data conflict.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** ResolveConflictRequestDto  
**Type:** DTO  
**Relative Path:** v1/dtos/sync/resolve-conflict.request.dto.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** resolutionChoice  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @IsIn(['KeepPlatformNameValue', 'KeepAdManagerOverride', 'ManualMerge']) @ApiProperty({ enum: ['KeepPlatformNameValue', 'KeepAdManagerOverride', 'ManualMerge'] })  
    - **Name:** mergedValue  
**Type:** any  
**Attributes:** @IsOptional() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Conflict Resolution Action
    
**Requirement Ids:**
    
    - REQ-PC-005
    - REQ-CPSI-002
    
**Purpose:** Defines the payload for a merchant to resolve an identified data conflict.  
**Logic Description:** Specifies the chosen resolution (e.g., keep platform value, keep override) and potentially a manually merged value.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for submitting a resolution for an existing data conflict.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Dtos.Sync  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/product-catalogs/api/v1/guards/jwt-auth.guard.ts  
**Description:** Custom JWT authentication guard for Product Catalog API endpoints. Extends NestJS AuthGuard('jwt').  
**Template:** NestJS Guard  
**Dependancy Level:** 1  
**Name:** JwtAuthGuard  
**Type:** Guard  
**Relative Path:** v1/guards/jwt-auth.guard.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - Guard
    
**Members:**
    
    
**Methods:**
    
    - **Name:** canActivate  
**Parameters:**
    
    - context: ExecutionContext
    
**Return Type:** boolean | Promise<boolean> | Observable<boolean>  
**Attributes:** public  
    
**Implemented Features:**
    
    - JWT Authentication
    
**Requirement Ids:**
    
    - 3.1.1 (Product Catalogs)
    
**Purpose:** Ensures that incoming requests to protected endpoints have a valid JWT, typically validated by API Gateway or locally.  
**Logic Description:** Extends the standard NestJS Passport JWT guard. It verifies the presence and validity of a JWT in the request. May be customized to handle specific error responses or claim extraction if needed locally beyond API Gateway actions.  
**Documentation:**
    
    - **Summary:** Authentication guard that protects API endpoints by verifying JWTs. Assumes JWT strategy is configured.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Guards  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/product-catalogs/api/v1/guards/roles.guard.ts  
**Description:** Custom roles-based authorization guard for Product Catalog API endpoints.  
**Template:** NestJS Guard  
**Dependancy Level:** 1  
**Name:** RolesGuard  
**Type:** Guard  
**Relative Path:** v1/guards/roles.guard.ts  
**Repository Id:** REPO-PRODCAT-002  
**Pattern Ids:**
    
    - Guard
    - RBAC
    
**Members:**
    
    - **Name:** reflector  
**Type:** Reflector  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** canActivate  
**Parameters:**
    
    - context: ExecutionContext
    
**Return Type:** boolean  
**Attributes:** public  
    
**Implemented Features:**
    
    - Role-Based Authorization
    
**Requirement Ids:**
    
    - 3.1.1 (Product Catalogs)
    
**Purpose:** Checks if the authenticated user has the required roles to access a specific endpoint, based on @Roles decorator.  
**Logic Description:** Uses NestJS Reflector to get roles defined for an endpoint. Compares these with roles present in the authenticated user's JWT claims (extracted by JwtAuthGuard or passed from API Gateway).  
**Documentation:**
    
    - **Summary:** Authorization guard that restricts endpoint access based on user roles defined via the @Roles decorator.
    
**Namespace:** AdManager.ProductCatalog.Api.V1.Guards  
**Metadata:**
    
    - **Category:** Security
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableXmlFeedGeneration
  - enableJsonFeedGeneration
  - enableAutomatedConflictResolutionMerge
  
- **Database Configs:**
  
  


---

