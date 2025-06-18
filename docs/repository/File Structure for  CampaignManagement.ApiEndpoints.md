# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project dependencies, scripts (start, build, lint, test), and other metadata for the Node.js/NestJS application.  
**Template:** NestJS Package.json Template  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../../..  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Project Setup
    - Dependency Management
    
**Requirement Ids:**
    
    
**Purpose:** Manages project dependencies and provides scripts for development and build processes.  
**Logic Description:** Lists dependencies like @nestjs/core, @nestjs/common, @nestjs/swagger, class-validator, class-transformer, reflect-metadata, rxjs. Includes scripts for running, building, and linting the application.  
**Documentation:**
    
    - **Summary:** Standard Node.js package manifest. Contains all project dependencies, devDependencies, and npm scripts.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** tsconfig.json  
**Description:** TypeScript compiler configuration for the project. Specifies compiler options like target ECMAScript version, module system, decorator support, and path aliases.  
**Template:** NestJS tsconfig.json Template  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ../../..  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript Compilation Setup
    
**Requirement Ids:**
    
    
**Purpose:** Configures the TypeScript compiler for the NestJS project.  
**Logic Description:** Defines compiler options such as 'module', 'declaration', 'removeComments', 'emitDecoratorMetadata', 'experimentalDecorators', 'target', 'sourceMap', 'outDir', 'baseUrl', 'incremental', 'strictNullChecks'.  
**Documentation:**
    
    - **Summary:** Configuration file for the TypeScript compiler (tsc). Dictates how TypeScript files are transpiled into JavaScript.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** nest-cli.json  
**Description:** NestJS CLI configuration file. Specifies project structure, compiler options for CLI, and assets to be included in the build.  
**Template:** NestJS nest-cli.json Template  
**Dependancy Level:** 0  
**Name:** nest-cli  
**Type:** Configuration  
**Relative Path:** ../../..  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - NestJS CLI Project Configuration
    
**Requirement Ids:**
    
    
**Purpose:** Configures the NestJS CLI for managing the project, including build processes and code generation.  
**Logic Description:** Contains settings like 'collection', 'sourceRoot', 'compilerOptions' (e.g., 'webpack', 'deleteOutDir'), and 'projects' if using a monorepo structure (though this repo is standalone).  
**Documentation:**
    
    - **Summary:** Configuration for the NestJS Command Line Interface. Used for building, serving, and generating NestJS application components.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** src/modules/campaigns/api/main.ts  
**Description:** The main entry point for the Campaign Management API application. Initializes and configures the NestJS application instance, sets up global middleware, pipes, filters, enables Swagger documentation, and starts the HTTP server.  
**Template:** NestJS main.ts Template  
**Dependancy Level:** 1  
**Name:** main  
**Type:** ApplicationBootstrap  
**Relative Path:** main.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** bootstrap  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** async  
    
**Implemented Features:**
    
    - Application Initialization
    - Swagger UI Setup
    
**Requirement Ids:**
    
    
**Purpose:** Bootstraps and starts the NestJS application for Campaign Management API endpoints.  
**Logic Description:** Imports NestFactory and CampaignsModule. Creates an application instance. Configures global pipes (e.g., ValidationPipe). Sets up Swagger document generation using SwaggerModule. Listens on a configured port.  
**Documentation:**
    
    - **Summary:** Application entry point. Responsible for creating the NestJS application instance, configuring it, and starting the server.
    
**Namespace:** AdManager.CampaignManagement.Api.V1  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/campaigns/api/campaigns.module.ts  
**Description:** The root NestJS module for the Campaign Management API. It imports necessary modules, declares controllers, and provides services (interfaces or concrete implementations if co-located).  
**Template:** NestJS Module Template  
**Dependancy Level:** 1  
**Name:** CampaignsApiModule  
**Type:** Module  
**Relative Path:** campaigns.module.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module Organization for Campaign Management API
    
**Requirement Ids:**
    
    
**Purpose:** Organizes and encapsulates all components related to campaign management API functionalities.  
**Logic Description:** Uses the @Module decorator. Imports controllers such as CampaignController, AdSetController, etc. Lists these controllers in the 'controllers' array. Lists service providers (e.g., { provide: ICampaignManagementService, useClass: CampaignManagementServiceImpl }) in the 'providers' array. May import other shared modules.  
**Documentation:**
    
    - **Summary:** Defines the Campaign Management API module, grouping related controllers and services.
    
**Namespace:** AdManager.CampaignManagement.Api.V1  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/campaigns/api/common/enums/campaign-status.enum.ts  
**Description:** Defines the enumeration for possible statuses of an advertising campaign (e.g., Draft, Active, Paused, Archived, Completed).  
**Template:** TypeScript Enum Template  
**Dependancy Level:** 1  
**Name:** CampaignStatus  
**Type:** Enum  
**Relative Path:** common/enums/campaign-status.enum.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** DRAFT  
**Type:** string  
**Attributes:**   
    - **Name:** ACTIVE  
**Type:** string  
**Attributes:**   
    - **Name:** PAUSED  
**Type:** string  
**Attributes:**   
    - **Name:** ARCHIVED  
**Type:** string  
**Attributes:**   
    - **Name:** COMPLETED  
**Type:** string  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - Campaign Status Definition
    
**Requirement Ids:**
    
    - REQ-CMO-001
    - REQ-CMO-002
    
**Purpose:** Provides a standardized set of campaign statuses for use across the API.  
**Logic Description:** A TypeScript enum with string values for each status.  
**Documentation:**
    
    - **Summary:** Enumeration defining the lifecycle statuses for advertising campaigns.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Common.Enums  
**Metadata:**
    
    - **Category:** Shared
    
- **Path:** src/modules/campaigns/api/common/enums/ad-network.enum.ts  
**Description:** Defines the enumeration for supported ad networks (e.g., Google, Instagram, TikTok, Snapchat).  
**Template:** TypeScript Enum Template  
**Dependancy Level:** 1  
**Name:** AdNetwork  
**Type:** Enum  
**Relative Path:** common/enums/ad-network.enum.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** GOOGLE  
**Type:** string  
**Attributes:**   
    - **Name:** INSTAGRAM  
**Type:** string  
**Attributes:**   
    - **Name:** TIKTOK  
**Type:** string  
**Attributes:**   
    - **Name:** SNAPCHAT  
**Type:** string  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - Ad Network Definition
    
**Requirement Ids:**
    
    - REQ-CMO-001
    - REQ-CMO-002
    
**Purpose:** Provides a standardized set of supported ad networks for use in DTOs and services.  
**Logic Description:** A TypeScript enum with string values representing each supported ad network.  
**Documentation:**
    
    - **Summary:** Enumeration defining the advertising networks supported by the platform.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Common.Enums  
**Metadata:**
    
    - **Category:** Shared
    
- **Path:** src/modules/campaigns/api/common/dto/pagination-query.dto.ts  
**Description:** Data Transfer Object for handling pagination query parameters (e.g., page, limit, sortBy, sortOrder).  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** PaginationQueryDto  
**Type:** DTO  
**Relative Path:** common/dto/pagination-query.dto.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** page  
**Type:** number  
**Attributes:** public  
    - **Name:** limit  
**Type:** number  
**Attributes:** public  
    - **Name:** sortBy  
**Type:** string  
**Attributes:** public  
    - **Name:** sortOrder  
**Type:** 'ASC' | 'DESC'  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - API List Pagination
    
**Requirement Ids:**
    
    
**Purpose:** Defines a standard structure for pagination parameters in API requests.  
**Logic Description:** Class with properties for pagination, decorated with @ApiPropertyOptional and validation decorators like @IsOptional, @IsInt, @Min, @IsString, @IsEnum.  
**Documentation:**
    
    - **Summary:** DTO representing common query parameters for paginated list endpoints.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Common.Dto  
**Metadata:**
    
    - **Category:** Shared
    
- **Path:** src/modules/campaigns/api/common/dto/id-param.dto.ts  
**Description:** Data Transfer Object for validating UUID route parameters.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** IdParamDto  
**Type:** DTO  
**Relative Path:** common/dto/id-param.dto.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Route Parameter Validation
    
**Requirement Ids:**
    
    
**Purpose:** Provides a standard way to validate UUIDs passed as route parameters.  
**Logic Description:** Class with a single 'id' property, decorated with @IsUUID() and @ApiProperty(). Used with @Param() decorator in controllers.  
**Documentation:**
    
    - **Summary:** DTO for validating UUIDs used as route parameters.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Common.Dto  
**Metadata:**
    
    - **Category:** Shared
    
- **Path:** src/modules/campaigns/api/common/filters/all-exceptions.filter.ts  
**Description:** Global exception filter to catch unhandled exceptions and format error responses consistently.  
**Template:** NestJS Exception Filter Template  
**Dependancy Level:** 1  
**Name:** AllExceptionsFilter  
**Type:** Filter  
**Relative Path:** common/filters/all-exceptions.filter.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** catch  
**Parameters:**
    
    - exception: unknown
    - host: ArgumentsHost
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Global Error Handling
    - Consistent Error Response
    
**Requirement Ids:**
    
    
**Purpose:** Ensures all API errors are handled gracefully and returned in a standardized JSON format.  
**Logic Description:** Implements ExceptionFilter. Catches HttpException and other errors. Logs the error. Formats a consistent JSON error response with status code, message, timestamp, and path. Applied globally in main.ts.  
**Documentation:**
    
    - **Summary:** Catches all unhandled exceptions and standardizes the error response format for the API.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Common.Filters  
**Metadata:**
    
    - **Category:** Shared
    
- **Path:** src/modules/campaigns/api/auth/guards/jwt-auth.guard.ts  
**Description:** A NestJS guard that protects routes by verifying a JWT token present in the request. Extends AuthGuard('jwt').  
**Template:** NestJS Guard Template  
**Dependancy Level:** 2  
**Name:** JwtAuthGuard  
**Type:** Guard  
**Relative Path:** auth/guards/jwt-auth.guard.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
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
    
    
**Purpose:** Secures API endpoints by ensuring that only authenticated users with valid JWTs can access them.  
**Logic Description:** Extends the built-in AuthGuard('jwt'). It can be used globally or on specific controllers/routes. Leverages a JwtStrategy for token validation.  
**Documentation:**
    
    - **Summary:** Implements JWT-based authentication. Protects routes requiring valid JWT tokens.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Auth.Guards  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/campaigns/api/auth/strategies/jwt.strategy.ts  
**Description:** Passport strategy for validating JWTs. Extracts user information from the token payload.  
**Template:** NestJS Passport Strategy Template  
**Dependancy Level:** 2  
**Name:** JwtStrategy  
**Type:** Strategy  
**Relative Path:** auth/strategies/jwt.strategy.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - configService: ConfigService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** validate  
**Parameters:**
    
    - payload: any
    
**Return Type:** Promise<any>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - JWT Validation Logic
    
**Requirement Ids:**
    
    
**Purpose:** Defines how JWTs are validated and how user payload is extracted from them.  
**Logic Description:** Extends PassportStrategy(Strategy). Configured with secret/key and token extraction method (e.g., from Bearer token in Authorization header). The validate method processes the token payload and returns user data.  
**Documentation:**
    
    - **Summary:** Passport strategy for JWT validation. Configures how tokens are extracted and verified.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Auth.Strategies  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/campaigns/api/services/interfaces/campaign-management.service.interface.ts  
**Description:** Interface defining the contract for the Campaign Management Service. This service handles the core business logic for campaigns, ad sets, ads, creatives, and A/B tests.  
**Template:** TypeScript Interface Template  
**Dependancy Level:** 1  
**Name:** ICampaignManagementService  
**Type:** ServiceInterface  
**Relative Path:** services/interfaces/campaign-management.service.interface.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    - InterfaceSegregationPrinciple
    
**Members:**
    
    
**Methods:**
    
    - **Name:** createCampaign  
**Parameters:**
    
    - createCampaignDto: any
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** updateCampaign  
**Parameters:**
    
    - campaignId: string
    - updateCampaignDto: any
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** getCampaignById  
**Parameters:**
    
    - campaignId: string
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** listCampaigns  
**Parameters:**
    
    - merchantId: string
    - paginationQuery: any
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** updateCampaignStatus  
**Parameters:**
    
    - campaignId: string
    - statusDto: any
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** createAdSet  
**Parameters:**
    
    - campaignId: string
    - createAdSetDto: any
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** updateAdSet  
**Parameters:**
    
    - adSetId: string
    - updateAdSetDto: any
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** getAdSetById  
**Parameters:**
    
    - adSetId: string
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** createAd  
**Parameters:**
    
    - adSetId: string
    - createAdDto: any
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** updateAd  
**Parameters:**
    
    - adId: string
    - updateAdDto: any
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** getAdById  
**Parameters:**
    
    - adId: string
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** uploadAdCreative  
**Parameters:**
    
    - uploadAdCreativeDto: any
    - merchantId: string
    - file?: any
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** getAdCreativeById  
**Parameters:**
    
    - creativeId: string
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** associateProductCatalogToCampaign  
**Parameters:**
    
    - campaignId: string
    - catalogId: string
    - merchantId: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** associateAudienceToCampaign  
**Parameters:**
    
    - campaignId: string
    - audienceId: string
    - merchantId: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** associatePromotionToCampaign  
**Parameters:**
    
    - campaignId: string
    - promotionId: string
    - merchantId: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** associatePromotionToAd  
**Parameters:**
    
    - adId: string
    - promotionId: string
    - merchantId: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** createABTest  
**Parameters:**
    
    - createABTestDto: any
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** updateABTest  
**Parameters:**
    
    - abTestId: string
    - updateABTestDto: any
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** getABTestById  
**Parameters:**
    
    - abTestId: string
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** getABTestResults  
**Parameters:**
    
    - abTestId: string
    - merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    
**Implemented Features:**
    
    - Campaign Business Logic Contract
    - Ad Set Business Logic Contract
    - Ad Business Logic Contract
    - Ad Creative Business Logic Contract
    - A/B Test Business Logic Contract
    
**Requirement Ids:**
    
    - REQ-CMO-001
    - REQ-CMO-002
    - REQ-CMO-003
    - REQ-CMO-004
    - REQ-CMO-005
    - REQ-CMO-006
    - REQ-CMO-008
    - REQ-CMO-009
    - REQ-CMO-011
    - REQ-CMO-012
    - REQ-CMO-013
    - 3.1.1 (Reporting and Analytics for A/B test result analysis part)
    - 3.1.6
    - 3.1.1 (Product Catalogs - Facilitate promotion)
    
**Purpose:** Defines the contract for services handling campaign, ad set, ad, creative, and A/B test operations.  
**Logic Description:** Contains method signatures for all business operations related to campaign lifecycle, ad set management, ad creation, creative handling, A/B testing, and associations with catalogs, audiences, and promotions. DTO types for parameters and return types will be specific.  
**Documentation:**
    
    - **Summary:** Interface outlining the methods provided by the core Campaign Management Service. Controllers will depend on this abstraction.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Services.Interfaces  
**Metadata:**
    
    - **Category:** ApplicationService
    
- **Path:** src/modules/campaigns/api/controllers/campaign.controller.ts  
**Description:** Handles HTTP requests related to advertising campaigns. Exposes endpoints for creating, reading, updating, and managing campaign statuses, budgets, and associations.  
**Template:** NestJS Controller Template  
**Dependancy Level:** 3  
**Name:** CampaignController  
**Type:** Controller  
**Relative Path:** controllers/campaign.controller.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    - DependencyInjection
    
**Members:**
    
    - **Name:** campaignManagementService  
**Type:** ICampaignManagementService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - campaignManagementService: ICampaignManagementService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** createCampaign  
**Parameters:**
    
    - createCampaignDto: CreateCampaignDto
    - req: any
    
**Return Type:** Promise<CampaignResponseDto>  
**Attributes:** public async  
    - **Name:** getAllCampaigns  
**Parameters:**
    
    - query: PaginationQueryDto
    - req: any
    
**Return Type:** Promise<PagedResponseDto<CampaignResponseDto>>  
**Attributes:** public async  
    - **Name:** getCampaignById  
**Parameters:**
    
    - params: IdParamDto
    - req: any
    
**Return Type:** Promise<CampaignResponseDto>  
**Attributes:** public async  
    - **Name:** updateCampaign  
**Parameters:**
    
    - params: IdParamDto
    - updateCampaignDto: UpdateCampaignDto
    - req: any
    
**Return Type:** Promise<CampaignResponseDto>  
**Attributes:** public async  
    - **Name:** updateCampaignStatus  
**Parameters:**
    
    - params: IdParamDto
    - updateStatusDto: UpdateCampaignStatusDto
    - req: any
    
**Return Type:** Promise<CampaignResponseDto>  
**Attributes:** public async  
    - **Name:** associateProductCatalog  
**Parameters:**
    
    - params: IdParamDto
    - associateCatalogDto: AssociateProductCatalogDto
    - req: any
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** associateAudience  
**Parameters:**
    
    - params: IdParamDto
    - associateAudienceDto: AssociateAudienceDto
    - req: any
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** associatePromotion  
**Parameters:**
    
    - params: IdParamDto
    - associatePromotionDto: AssociatePromotionCampaignDto
    - req: any
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - Campaign CRUD Operations
    - Campaign Status Management
    - Campaign Budget Management
    - Product Catalog Association
    - Audience Association
    - Promotion Association
    
**Requirement Ids:**
    
    - REQ-CMO-001
    - REQ-CMO-002
    - REQ-CMO-005
    - REQ-CMO-011
    - REQ-CMO-012
    - REQ-CMO-013
    - 3.1.1 (Product Catalogs - Facilitate promotion)
    
**Purpose:** Exposes API endpoints for managing advertising campaigns.  
**Logic Description:** Uses @Controller, @Post, @Get, @Put, @Patch, @Param, @Body, @Query, @UseGuards(JwtAuthGuard) decorators. Injects ICampaignManagementService. Methods map to service calls, handling request DTOs and returning response DTOs. Extracts merchantId from authenticated request (e.g., req.user.merchantId).  
**Documentation:**
    
    - **Summary:** Controller for managing advertising campaigns. Provides endpoints for CRUD operations, status updates, and associations.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/campaigns/api/dto/campaign/create-campaign.dto.ts  
**Description:** Data Transfer Object for creating a new advertising campaign.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** CreateCampaignDto  
**Type:** DTO  
**Relative Path:** dto/campaign/create-campaign.dto.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** name  
**Type:** string  
**Attributes:** public  
    - **Name:** targetAdNetworks  
**Type:** AdNetwork[]  
**Attributes:** public  
    - **Name:** budget  
**Type:** number  
**Attributes:** public  
    - **Name:** startDate  
**Type:** Date  
**Attributes:** public  
    - **Name:** endDate  
**Type:** Date  
**Attributes:** public  
    - **Name:** initialStatus  
**Type:** CampaignStatus  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Campaign Creation Data Contract
    
**Requirement Ids:**
    
    - REQ-CMO-001
    
**Purpose:** Defines the expected data structure for requests to create a new campaign.  
**Logic Description:** Class with properties for campaign creation. Decorated with @ApiProperty() from @nestjs/swagger and validation decorators from class-validator (e.g., @IsString(), @IsNotEmpty(), @IsArray(), @IsEnum(), @IsNumber(), @Min(), @IsDateString()).  
**Documentation:**
    
    - **Summary:** DTO containing fields required to create a new advertising campaign.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Dto.Campaign  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/campaigns/api/dto/campaign/campaign.response.dto.ts  
**Description:** Data Transfer Object for campaign API responses.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** CampaignResponseDto  
**Type:** DTO  
**Relative Path:** dto/campaign/campaign.response.dto.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public  
    - **Name:** name  
**Type:** string  
**Attributes:** public  
    - **Name:** targetAdNetworks  
**Type:** AdNetwork[]  
**Attributes:** public  
    - **Name:** budget  
**Type:** number  
**Attributes:** public  
    - **Name:** startDate  
**Type:** Date  
**Attributes:** public  
    - **Name:** endDate  
**Type:** Date  
**Attributes:** public  
    - **Name:** status  
**Type:** CampaignStatus  
**Attributes:** public  
    - **Name:** createdAt  
**Type:** Date  
**Attributes:** public  
    - **Name:** updatedAt  
**Type:** Date  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Campaign Data Representation
    
**Requirement Ids:**
    
    - REQ-CMO-001
    - REQ-CMO-002
    
**Purpose:** Defines the structure of campaign data returned by the API.  
**Logic Description:** Class with properties representing a campaign. Decorated with @ApiProperty() for Swagger documentation.  
**Documentation:**
    
    - **Summary:** DTO representing a campaign entity for API responses.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Dto.Campaign  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/campaigns/api/controllers/ad-set.controller.ts  
**Description:** Handles HTTP requests related to ad sets within campaigns. Exposes endpoints for creating, reading, updating, and managing ad set configurations.  
**Template:** NestJS Controller Template  
**Dependancy Level:** 3  
**Name:** AdSetController  
**Type:** Controller  
**Relative Path:** controllers/ad-set.controller.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    - DependencyInjection
    
**Members:**
    
    - **Name:** campaignManagementService  
**Type:** ICampaignManagementService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - campaignManagementService: ICampaignManagementService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** createAdSet  
**Parameters:**
    
    - campaignId: string
    - createAdSetDto: CreateAdSetDto
    - req: any
    
**Return Type:** Promise<AdSetResponseDto>  
**Attributes:** public async  
    - **Name:** getAdSetsByCampaign  
**Parameters:**
    
    - campaignId: string
    - query: PaginationQueryDto
    - req: any
    
**Return Type:** Promise<PagedResponseDto<AdSetResponseDto>>  
**Attributes:** public async  
    - **Name:** getAdSetById  
**Parameters:**
    
    - params: IdParamDto
    - req: any
    
**Return Type:** Promise<AdSetResponseDto>  
**Attributes:** public async  
    - **Name:** updateAdSet  
**Parameters:**
    
    - params: IdParamDto
    - updateAdSetDto: UpdateAdSetDto
    - req: any
    
**Return Type:** Promise<AdSetResponseDto>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - Ad Set CRUD Operations
    - Ad Set Budget Management
    - Ad Set Targeting
    
**Requirement Ids:**
    
    - REQ-CMO-003
    - REQ-CMO-011
    
**Purpose:** Exposes API endpoints for managing ad sets.  
**Logic Description:** Uses @Controller('/campaigns/:campaignId/adsets') or @Controller('/adsets'). Injects ICampaignManagementService. Methods for CRUD operations on ad sets, associated with a campaign. Handles merchant context via req.user.merchantId.  
**Documentation:**
    
    - **Summary:** Controller for managing ad sets within campaigns. Provides endpoints for CRUD operations.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/campaigns/api/dto/ad-set/create-ad-set.dto.ts  
**Description:** Data Transfer Object for creating a new ad set.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** CreateAdSetDto  
**Type:** DTO  
**Relative Path:** dto/ad-set/create-ad-set.dto.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** campaignId  
**Type:** string  
**Attributes:** public  
    - **Name:** name  
**Type:** string  
**Attributes:** public  
    - **Name:** targetingCriteria  
**Type:** any  
**Attributes:** public  
    - **Name:** biddingStrategy  
**Type:** any  
**Attributes:** public  
    - **Name:** budgetAllocation  
**Type:** any  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Ad Set Creation Data Contract
    
**Requirement Ids:**
    
    - REQ-CMO-003
    
**Purpose:** Defines the expected data structure for requests to create a new ad set.  
**Logic Description:** Class with properties for ad set creation. Decorated with @ApiProperty() and class-validator decorators.  
**Documentation:**
    
    - **Summary:** DTO containing fields required to create a new ad set.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Dto.AdSet  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/campaigns/api/controllers/ad.controller.ts  
**Description:** Handles HTTP requests related to individual ads within ad sets. Exposes endpoints for creating, reading, updating ads and associating creatives/promotions.  
**Template:** NestJS Controller Template  
**Dependancy Level:** 3  
**Name:** AdController  
**Type:** Controller  
**Relative Path:** controllers/ad.controller.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    - DependencyInjection
    
**Members:**
    
    - **Name:** campaignManagementService  
**Type:** ICampaignManagementService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - campaignManagementService: ICampaignManagementService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** createAd  
**Parameters:**
    
    - adSetId: string
    - createAdDto: CreateAdDto
    - req: any
    
**Return Type:** Promise<AdResponseDto>  
**Attributes:** public async  
    - **Name:** getAdsByAdSet  
**Parameters:**
    
    - adSetId: string
    - query: PaginationQueryDto
    - req: any
    
**Return Type:** Promise<PagedResponseDto<AdResponseDto>>  
**Attributes:** public async  
    - **Name:** getAdById  
**Parameters:**
    
    - params: IdParamDto
    - req: any
    
**Return Type:** Promise<AdResponseDto>  
**Attributes:** public async  
    - **Name:** updateAd  
**Parameters:**
    
    - params: IdParamDto
    - updateAdDto: UpdateAdDto
    - req: any
    
**Return Type:** Promise<AdResponseDto>  
**Attributes:** public async  
    - **Name:** associatePromotionToAd  
**Parameters:**
    
    - params: IdParamDto
    - associatePromotionAdDto: AssociatePromotionAdDto
    - req: any
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - Ad CRUD Operations
    - Ad Destination URL Management
    - Ad Promotion Association
    
**Requirement Ids:**
    
    - REQ-CMO-004
    - REQ-CMO-006
    - REQ-CMO-013
    
**Purpose:** Exposes API endpoints for managing individual ads.  
**Logic Description:** Uses @Controller('/adsets/:adSetId/ads') or @Controller('/ads'). Injects ICampaignManagementService. Methods for CRUD operations on ads. Handles merchant context.  
**Documentation:**
    
    - **Summary:** Controller for managing ads within ad sets. Provides endpoints for CRUD operations and associations.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/campaigns/api/dto/ad/create-ad.dto.ts  
**Description:** Data Transfer Object for creating a new ad.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** CreateAdDto  
**Type:** DTO  
**Relative Path:** dto/ad/create-ad.dto.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** adSetId  
**Type:** string  
**Attributes:** public  
    - **Name:** adCreativeId  
**Type:** string  
**Attributes:** public  
    - **Name:** name  
**Type:** string  
**Attributes:** public  
    - **Name:** destinationUrl  
**Type:** string  
**Attributes:** public  
    - **Name:** promotionId  
**Type:** string  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Ad Creation Data Contract
    
**Requirement Ids:**
    
    - REQ-CMO-004
    - REQ-CMO-006
    - REQ-CMO-013
    
**Purpose:** Defines the expected data structure for requests to create a new ad.  
**Logic Description:** Class with properties for ad creation. Decorated with @ApiProperty() and class-validator decorators.  
**Documentation:**
    
    - **Summary:** DTO containing fields required to create a new ad.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Dto.Ad  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/campaigns/api/controllers/ad-creative.controller.ts  
**Description:** Handles HTTP requests related to ad creatives. Exposes endpoints for uploading, managing, and associating creatives.  
**Template:** NestJS Controller Template  
**Dependancy Level:** 3  
**Name:** AdCreativeController  
**Type:** Controller  
**Relative Path:** controllers/ad-creative.controller.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    - DependencyInjection
    
**Members:**
    
    - **Name:** campaignManagementService  
**Type:** ICampaignManagementService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - campaignManagementService: ICampaignManagementService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** uploadCreative  
**Parameters:**
    
    - file: Express.Multer.File
    - uploadAdCreativeDto: UploadAdCreativeDto
    - req: any
    
**Return Type:** Promise<AdCreativeResponseDto>  
**Attributes:** public async  
    - **Name:** getCreativeById  
**Parameters:**
    
    - params: IdParamDto
    - req: any
    
**Return Type:** Promise<AdCreativeResponseDto>  
**Attributes:** public async  
    - **Name:** updateCreative  
**Parameters:**
    
    - params: IdParamDto
    - updateAdCreativeDto: UpdateAdCreativeDto
    - req: any
    
**Return Type:** Promise<AdCreativeResponseDto>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - Ad Creative Upload
    - Ad Creative Management
    
**Requirement Ids:**
    
    - REQ-CMO-004
    
**Purpose:** Exposes API endpoints for managing ad creatives.  
**Logic Description:** Uses @Controller('/creatives'). Injects ICampaignManagementService. Handles file uploads using @UseInterceptors(FileInterceptor) for creative assets. Handles merchant context.  
**Documentation:**
    
    - **Summary:** Controller for managing ad creatives. Provides endpoints for uploading and managing creative assets.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/campaigns/api/dto/ad-creative/upload-ad-creative.dto.ts  
**Description:** Data Transfer Object for uploading a new ad creative. Includes metadata for the creative.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** UploadAdCreativeDto  
**Type:** DTO  
**Relative Path:** dto/ad-creative/upload-ad-creative.dto.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** name  
**Type:** string  
**Attributes:** public  
    - **Name:** type  
**Type:** CreativeType  
**Attributes:** public  
    - **Name:** adNetworkId  
**Type:** string  
**Attributes:** public  
    - **Name:** adCopy  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** headline  
**Type:** string  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Ad Creative Upload Data Contract
    
**Requirement Ids:**
    
    - REQ-CMO-004
    
**Purpose:** Defines the expected metadata structure when uploading a new ad creative.  
**Logic Description:** Class with properties for creative metadata. Decorated with @ApiProperty() and class-validator decorators. File data itself handled via multipart/form-data.  
**Documentation:**
    
    - **Summary:** DTO containing metadata for a new ad creative being uploaded.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Dto.AdCreative  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/campaigns/api/controllers/ab-test.controller.ts  
**Description:** Handles HTTP requests related to A/B tests for campaign elements. Exposes endpoints for creating, managing, and viewing A/B test results.  
**Template:** NestJS Controller Template  
**Dependancy Level:** 3  
**Name:** ABTestController  
**Type:** Controller  
**Relative Path:** controllers/ab-test.controller.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    - DependencyInjection
    
**Members:**
    
    - **Name:** campaignManagementService  
**Type:** ICampaignManagementService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - campaignManagementService: ICampaignManagementService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** createABTest  
**Parameters:**
    
    - createABTestDto: CreateABTestDto
    - req: any
    
**Return Type:** Promise<ABTestResponseDto>  
**Attributes:** public async  
    - **Name:** getABTestById  
**Parameters:**
    
    - params: IdParamDto
    - req: any
    
**Return Type:** Promise<ABTestResponseDto>  
**Attributes:** public async  
    - **Name:** updateABTest  
**Parameters:**
    
    - params: IdParamDto
    - updateABTestDto: UpdateABTestDto
    - req: any
    
**Return Type:** Promise<ABTestResponseDto>  
**Attributes:** public async  
    - **Name:** getABTestResults  
**Parameters:**
    
    - params: IdParamDto
    - req: any
    
**Return Type:** Promise<ABTestResultResponseDto>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - A/B Test CRUD Operations
    - A/B Test Result Analysis
    
**Requirement Ids:**
    
    - REQ-CMO-008
    - REQ-CMO-009
    - 3.1.1 (Reporting and Analytics for A/B test result analysis part)
    - 3.1.6
    
**Purpose:** Exposes API endpoints for managing A/B tests and their results.  
**Logic Description:** Uses @Controller('/abtests'). Injects ICampaignManagementService. Methods for CRUD operations on A/B tests and retrieving results. Handles merchant context.  
**Documentation:**
    
    - **Summary:** Controller for managing A/B tests. Provides endpoints for CRUD operations and viewing test results.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/campaigns/api/dto/ab-test/create-ab-test.dto.ts  
**Description:** Data Transfer Object for creating a new A/B test.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** CreateABTestDto  
**Type:** DTO  
**Relative Path:** dto/ab-test/create-ab-test.dto.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** campaignId  
**Type:** string  
**Attributes:** public  
    - **Name:** name  
**Type:** string  
**Attributes:** public  
    - **Name:** testElementType  
**Type:** string  
**Attributes:** public  
    - **Name:** variations  
**Type:** any[]  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - A/B Test Creation Data Contract
    
**Requirement Ids:**
    
    - REQ-CMO-008
    - 3.1.6
    
**Purpose:** Defines the expected data structure for requests to create a new A/B test.  
**Logic Description:** Class with properties for A/B test creation. Decorated with @ApiProperty() and class-validator decorators.  
**Documentation:**
    
    - **Summary:** DTO containing fields required to create a new A/B test.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Dto.ABTest  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/campaigns/api/dto/ab-test/ab-test-result.response.dto.ts  
**Description:** Data Transfer Object for A/B test results API responses.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 2  
**Name:** ABTestResultResponseDto  
**Type:** DTO  
**Relative Path:** dto/ab-test/ab-test-result.response.dto.ts  
**Repository Id:** REPO-CAMP-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** abTestId  
**Type:** string  
**Attributes:** public  
    - **Name:** variantResults  
**Type:** any[]  
**Attributes:** public  
    - **Name:** winningVariantId  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** statisticalSignificance  
**Type:** any  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - A/B Test Result Data Representation
    
**Requirement Ids:**
    
    - REQ-CMO-009
    - 3.1.1 (Reporting and Analytics for A/B test result analysis part)
    
**Purpose:** Defines the structure of A/B test result data returned by the API.  
**Logic Description:** Class with properties representing A/B test results. Decorated with @ApiProperty() for Swagger documentation.  
**Documentation:**
    
    - **Summary:** DTO representing A/B test results for API responses.
    
**Namespace:** AdManager.CampaignManagement.Api.V1.Dto.ABTest  
**Metadata:**
    
    - **Category:** Presentation
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableAdvancedTargetingOptions
  - enableDynamicCreativeOptimization
  
- **Database Configs:**
  
  


---

