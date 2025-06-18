# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project dependencies, scripts, and metadata for the SEOService.ApiEndpoints NestJS application.  
**Template:** NestJS Package.json Template  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../../package.json  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Management
    - Project Scripts
    
**Requirement Ids:**
    
    
**Purpose:** Manages Node.js package dependencies and project scripts for building, running, and testing the API.  
**Logic Description:** Contains dependencies like @nestjs/core, @nestjs/common, @nestjs/platform-express, class-validator, class-transformer, @nestjs/swagger, reflect-metadata, rxjs. Includes scripts for start, build, test, lint.  
**Documentation:**
    
    - **Summary:** Standard package.json file for a NestJS application, listing all production and development dependencies required by the SEO API endpoints.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** tsconfig.json  
**Description:** TypeScript compiler options for the SEOService.ApiEndpoints project.  
**Template:** NestJS tsconfig.json Template  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ../../tsconfig.json  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript Compilation Configuration
    
**Requirement Ids:**
    
    
**Purpose:** Configures the TypeScript compiler, specifying ECMAScript target, module system, output directory, and other compiler settings.  
**Logic Description:** Standard tsconfig.json for a NestJS project, enabling decorators, emitDecoratorMetadata, experimentalDecorators, module resolution, and specifying outDir, baseUrl.  
**Documentation:**
    
    - **Summary:** TypeScript configuration file ensuring consistent compilation and type checking for the SEO API project.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** nest-cli.json  
**Description:** NestJS CLI configuration file, specifying project structure and build options.  
**Template:** NestJS CLI Configuration  
**Dependancy Level:** 0  
**Name:** nest-cli  
**Type:** Configuration  
**Relative Path:** ../../nest-cli.json  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - NestJS CLI Project Settings
    
**Requirement Ids:**
    
    
**Purpose:** Provides configuration for the NestJS CLI, including source root, entry file, and compiler options for building the application.  
**Logic Description:** Specifies collection, sourceRoot, and compilerOptions (e.g., deleteOutDir, assets for Swagger).  
**Documentation:**
    
    - **Summary:** Configuration file for the NestJS command-line interface, managing project-specific settings for the CLI.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/main.ts  
**Description:** Main application entry point. Initializes and bootstraps the NestJS application for SEO Service API Endpoints.  
**Template:** NestJS Main Bootstrap  
**Dependancy Level:** 3  
**Name:** main  
**Type:** Bootstrap  
**Relative Path:** main.ts  
**Repository Id:** REPO-SEO-008  
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
    
    
**Purpose:** Sets up the NestJS application instance, configures global pipes (e.g., ValidationPipe), enables Swagger documentation, and starts the HTTP listener.  
**Logic Description:** Imports AppModule. Creates NestJS application instance using NestFactory. Sets up global validation pipe. Configures SwaggerModule to generate OpenAPI documentation. Listens on a configured port.  
**Documentation:**
    
    - **Summary:** The entry file for the SEO API application, responsible for instantiating and configuring the NestJS application.
    
**Namespace:** AdManager.SEOService.Api  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/app.module.ts  
**Description:** Root application module for the SEO Service API. Imports feature-specific modules like SeoModule.  
**Template:** NestJS Root Module  
**Dependancy Level:** 2  
**Name:** AppModule  
**Type:** Module  
**Relative Path:** app.module.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module Aggregation
    
**Requirement Ids:**
    
    
**Purpose:** Serves as the root module, organizing and importing other feature modules, such as the SeoModule, to structure the application.  
**Logic Description:** Imports NestJS CommonModule and the SeoModule. Defines the AppModule class decorated with @Module, listing SeoModule in imports.  
**Documentation:**
    
    - **Summary:** The main application module that acts as the root of the dependency injection graph and module structure for the SEO API.
    
**Namespace:** AdManager.SEOService.Api  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/seo/api/seo.module.ts  
**Description:** NestJS module for SEO related API endpoints. Declares controllers and providers for SEO functionalities.  
**Template:** NestJS Feature Module  
**Dependancy Level:** 2  
**Name:** SeoModule  
**Type:** Module  
**Relative Path:** modules/seo/api/seo.module.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - SEO Feature Encapsulation
    
**Requirement Ids:**
    
    - REQ-7-001
    - REQ-7-002
    - REQ-7-003
    - REQ-7-004
    - REQ-7-005
    - REQ-7-006
    
**Purpose:** Encapsulates all SEO related controllers and service interface providers, organizing the SEO API features.  
**Logic Description:** Imports NestJS CommonModule. Declares SeoController. Provides the ISeoService interface (implementation to be injected from another layer/module). Exports ISeoService if needed by other modules within this repo (unlikely for pure API repo).  
**Documentation:**
    
    - **Summary:** The NestJS module responsible for grouping all controllers and service dependencies related to SEO functionality.
    
**Namespace:** AdManager.SEOService.Api.V1  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/seo/api/constants/seo.constants.ts  
**Description:** Defines constants for the SEO module, such as injection tokens for services.  
**Template:** TypeScript Constants File  
**Dependancy Level:** 0  
**Name:** seo.constants  
**Type:** Constants  
**Relative Path:** modules/seo/api/constants/seo.constants.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** SEO_SERVICE_TOKEN  
**Type:** symbol  
**Attributes:** export const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Injection Tokens
    
**Requirement Ids:**
    
    
**Purpose:** Provides strongly-typed constants, primarily for defining injection tokens for services like ISeoService.  
**Logic Description:** Exports a constant symbol SEO_SERVICE_TOKEN used for injecting the SEO service implementation.  
**Documentation:**
    
    - **Summary:** Contains constants specific to the SEO module, facilitating robust dependency injection.
    
**Namespace:** AdManager.SEOService.Api.V1.Constants  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** src/modules/seo/api/interfaces/seo-service.interface.ts  
**Description:** Interface defining the contract for the SEO service. This API's controllers will depend on this abstraction.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** ISeoService  
**Type:** Interface  
**Relative Path:** modules/seo/api/interfaces/seo-service.interface.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DependencyInversionPrinciple
    
**Members:**
    
    
**Methods:**
    
    - **Name:** getPageKeywords  
**Parameters:**
    
    - pageType: string
    - pageId: string
    - merchantId: string
    
**Return Type:** Promise<PageKeywordsResponseDto>  
**Attributes:**   
    - **Name:** setPageKeywords  
**Parameters:**
    
    - pageType: string
    - pageId: string
    - merchantId: string
    - dto: SetPageKeywordsRequestDto
    
**Return Type:** Promise<PageKeywordsResponseDto>  
**Attributes:**   
    - **Name:** getKeywordSuggestions  
**Parameters:**
    
    - merchantId: string
    - dto: KeywordSuggestionRequestDto
    
**Return Type:** Promise<KeywordSuggestionResponseDto>  
**Attributes:**   
    - **Name:** getSchemaMarkup  
**Parameters:**
    
    - pageType: string
    - pageId: string
    - merchantId: string
    
**Return Type:** Promise<SchemaMarkupResponseDto>  
**Attributes:**   
    - **Name:** updateSchemaMarkup  
**Parameters:**
    
    - pageType: string
    - pageId: string
    - merchantId: string
    - dto: UpdateSchemaMarkupRequestDto
    
**Return Type:** Promise<SchemaMarkupResponseDto>  
**Attributes:**   
    - **Name:** getPageMetaTags  
**Parameters:**
    
    - pageType: string
    - pageId: string
    - merchantId: string
    
**Return Type:** Promise<PageMetaTagsResponseDto>  
**Attributes:**   
    - **Name:** updatePageMetaTags  
**Parameters:**
    
    - pageType: string
    - pageId: string
    - merchantId: string
    - dto: UpdatePageMetaTagsRequestDto
    
**Return Type:** Promise<PageMetaTagsResponseDto>  
**Attributes:**   
    - **Name:** getImageAltText  
**Parameters:**
    
    - pageType: string
    - pageId: string
    - imageId: string
    - merchantId: string
    
**Return Type:** Promise<ImageAltTextResponseDto>  
**Attributes:**   
    - **Name:** updateImageAltText  
**Parameters:**
    
    - pageType: string
    - pageId: string
    - imageId: string
    - merchantId: string
    - dto: UpdateImageAltTextRequestDto
    
**Return Type:** Promise<ImageAltTextResponseDto>  
**Attributes:**   
    - **Name:** getSitemapUrl  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<SitemapUrlResponseDto>  
**Attributes:**   
    - **Name:** getRobotsTxt  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<RobotsTxtResponseDto>  
**Attributes:**   
    - **Name:** getRobotsTxtSuggestions  
**Parameters:**
    
    - merchantId: string
    - dto: RobotsTxtSuggestionRequestDto
    
**Return Type:** Promise<RobotsTxtSuggestionResponseDto>  
**Attributes:**   
    - **Name:** getBlogInternalLinks  
**Parameters:**
    
    - blogPostId: string
    - merchantId: string
    
**Return Type:** Promise<BlogInternalLinksResponseDto>  
**Attributes:**   
    - **Name:** updateBlogInternalLinks  
**Parameters:**
    
    - blogPostId: string
    - merchantId: string
    - dto: UpdateBlogInternalLinksRequestDto
    
**Return Type:** Promise<BlogInternalLinksResponseDto>  
**Attributes:**   
    - **Name:** getInternalLinkSuggestionsForBlog  
**Parameters:**
    
    - blogPostId: string
    - merchantId: string
    - dto: InternalLinkSuggestionRequestDto
    
**Return Type:** Promise<InternalLinkSuggestionResponseDto>  
**Attributes:**   
    
**Implemented Features:**
    
    - SEO Service Contract
    
**Requirement Ids:**
    
    - REQ-7-001
    - REQ-7-002
    - REQ-7-003
    - REQ-7-004
    - REQ-7-005
    - REQ-7-006
    
**Purpose:** Defines the contract (methods and signatures) that the underlying SEO business logic service must implement. Controllers depend on this interface.  
**Logic Description:** Declares methods for all SEO operations like managing keywords, schema markup, meta tags, sitemap URL, robots.txt, and internal links. Each method accepts parameters and returns DTOs.  
**Documentation:**
    
    - **Summary:** An interface outlining the capabilities of the SEOService, ensuring loose coupling between the API controllers and the service implementation.
    
**Namespace:** AdManager.SEOService.Api.V1.Interfaces  
**Metadata:**
    
    - **Category:** Interface
    
- **Path:** src/modules/seo/api/controllers/seo.controller.ts  
**Description:** NestJS controller for handling all SEO related API requests. Exposes endpoints for keyword optimization, schema markup, technical SEO, sitemap, robots.txt, and internal linking.  
**Template:** NestJS Controller  
**Dependancy Level:** 1  
**Name:** SeoController  
**Type:** Controller  
**Relative Path:** modules/seo/api/controllers/seo.controller.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - MVC Controller
    - DependencyInjection
    
**Members:**
    
    - **Name:** seoService  
**Type:** ISeoService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - @Inject(SEO_SERVICE_TOKEN) seoService: ISeoService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** setPageKeywords  
**Parameters:**
    
    - @Param('pageType') pageType: string
    - @Param('pageId') pageId: string
    - @Body() dto: SetPageKeywordsRequestDto
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<PageKeywordsResponseDto>  
**Attributes:** public @Post('keywords/:pageType/:pageId') @ApiOperation @ApiResponse  
    - **Name:** getPageKeywords  
**Parameters:**
    
    - @Param('pageType') pageType: string
    - @Param('pageId') pageId: string
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<PageKeywordsResponseDto>  
**Attributes:** public @Get('keywords/:pageType/:pageId') @ApiOperation @ApiResponse  
    - **Name:** getKeywordSuggestions  
**Parameters:**
    
    - @Body() dto: KeywordSuggestionRequestDto
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<KeywordSuggestionResponseDto>  
**Attributes:** public @Post('keywords/suggestions') @ApiOperation @ApiResponse  
    - **Name:** updateSchemaMarkup  
**Parameters:**
    
    - @Param('pageType') pageType: string
    - @Param('pageId') pageId: string
    - @Body() dto: UpdateSchemaMarkupRequestDto
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<SchemaMarkupResponseDto>  
**Attributes:** public @Put('schema/:pageType/:pageId') @ApiOperation @ApiResponse  
    - **Name:** getSchemaMarkup  
**Parameters:**
    
    - @Param('pageType') pageType: string
    - @Param('pageId') pageId: string
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<SchemaMarkupResponseDto>  
**Attributes:** public @Get('schema/:pageType/:pageId') @ApiOperation @ApiResponse  
    - **Name:** updatePageMetaTags  
**Parameters:**
    
    - @Param('pageType') pageType: string
    - @Param('pageId') pageId: string
    - @Body() dto: UpdatePageMetaTagsRequestDto
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<PageMetaTagsResponseDto>  
**Attributes:** public @Put('meta-tags/:pageType/:pageId') @ApiOperation @ApiResponse  
    - **Name:** getPageMetaTags  
**Parameters:**
    
    - @Param('pageType') pageType: string
    - @Param('pageId') pageId: string
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<PageMetaTagsResponseDto>  
**Attributes:** public @Get('meta-tags/:pageType/:pageId') @ApiOperation @ApiResponse  
    - **Name:** updateImageAltText  
**Parameters:**
    
    - @Param('pageType') pageType: string
    - @Param('pageId') pageId: string
    - @Param('imageId') imageId: string
    - @Body() dto: UpdateImageAltTextRequestDto
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<ImageAltTextResponseDto>  
**Attributes:** public @Put('alt-text/:pageType/:pageId/:imageId') @ApiOperation @ApiResponse  
    - **Name:** getImageAltText  
**Parameters:**
    
    - @Param('pageType') pageType: string
    - @Param('pageId') pageId: string
    - @Param('imageId') imageId: string
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<ImageAltTextResponseDto>  
**Attributes:** public @Get('alt-text/:pageType/:pageId/:imageId') @ApiOperation @ApiResponse  
    - **Name:** getSitemapUrl  
**Parameters:**
    
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<SitemapUrlResponseDto>  
**Attributes:** public @Get('sitemap-url') @ApiOperation @ApiResponse  
    - **Name:** getRobotsTxt  
**Parameters:**
    
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<RobotsTxtResponseDto>  
**Attributes:** public @Get('robots-txt') @ApiOperation @ApiResponse  
    - **Name:** getRobotsTxtSuggestions  
**Parameters:**
    
    - @Body() dto: RobotsTxtSuggestionRequestDto
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<RobotsTxtSuggestionResponseDto>  
**Attributes:** public @Post('robots-txt/suggestions') @ApiOperation @ApiResponse  
    - **Name:** updateBlogInternalLinks  
**Parameters:**
    
    - @Param('blogPostId') blogPostId: string
    - @Body() dto: UpdateBlogInternalLinksRequestDto
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<BlogInternalLinksResponseDto>  
**Attributes:** public @Put('internal-links/blog/:blogPostId') @ApiOperation @ApiResponse  
    - **Name:** getBlogInternalLinks  
**Parameters:**
    
    - @Param('blogPostId') blogPostId: string
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<BlogInternalLinksResponseDto>  
**Attributes:** public @Get('internal-links/blog/:blogPostId') @ApiOperation @ApiResponse  
    - **Name:** getInternalLinkSuggestionsForBlog  
**Parameters:**
    
    - @Param('blogPostId') blogPostId: string
    - @Body() dto: InternalLinkSuggestionRequestDto
    - /* @MerchantId() merchantId: string */
    
**Return Type:** Promise<InternalLinkSuggestionResponseDto>  
**Attributes:** public @Post('internal-links/suggestions/blog/:blogPostId') @ApiOperation @ApiResponse  
    
**Implemented Features:**
    
    - Keyword Optimization API
    - Schema Markup API
    - Technical SEO API
    - Sitemap API
    - Robots.txt API
    - Internal Linking API
    
**Requirement Ids:**
    
    - REQ-7-001
    - REQ-7-002
    - REQ-7-003
    - REQ-7-004
    - REQ-7-005
    - REQ-7-006
    
**Purpose:** Provides HTTP endpoints for merchants to manage and retrieve SEO configurations and data for their store content.  
**Logic Description:** Defines routes using NestJS decorators (@Controller, @Get, @Post, @Put). Injects ISeoService. Each method handles a specific SEO operation, validates input using DTOs, calls the corresponding seoService method, and returns the response. Uses @ApiOperation and @ApiResponse for Swagger documentation. Assumes a custom @MerchantId decorator or similar mechanism to extract merchant context.  
**Documentation:**
    
    - **Summary:** Exposes RESTful endpoints for various SEO functionalities, delegating business logic to the SEOService. It handles request validation and response formatting.
    
**Namespace:** AdManager.SEOService.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/seo/api/dtos/request/set-page-keywords.request.dto.ts  
**Description:** DTO for setting keywords for a specific page (product or blog).  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** SetPageKeywordsRequestDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/request/set-page-keywords.request.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** keywords  
**Type:** string[]  
**Attributes:** @IsArray() @IsString({ each: true }) @ArrayNotEmpty() @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Keyword Setting Input Validation
    
**Requirement Ids:**
    
    - REQ-7-001
    
**Purpose:** Defines the expected structure and validation rules for the request body when setting page keywords.  
**Logic Description:** Contains an array of strings representing keywords. Uses class-validator decorators for validation (e.g., IsArray, IsString, ArrayNotEmpty) and @ApiProperty for Swagger documentation.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for requests to set or update keywords for a page.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/response/page-keywords.response.dto.ts  
**Description:** DTO for returning keywords of a specific page.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** PageKeywordsResponseDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/response/page-keywords.response.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** pageId  
**Type:** string  
**Attributes:** @IsString() @ApiProperty  
    - **Name:** pageType  
**Type:** string  
**Attributes:** @IsString() @ApiProperty  
    - **Name:** keywords  
**Type:** string[]  
**Attributes:** @IsArray() @IsString({ each: true }) @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Keyword Data Output
    
**Requirement Ids:**
    
    - REQ-7-001
    
**Purpose:** Defines the structure of the response when fetching or confirming keywords for a page.  
**Logic Description:** Contains pageId, pageType, and an array of keywords. Uses @ApiProperty for Swagger documentation.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for responses containing page keyword information.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/request/keyword-suggestion.request.dto.ts  
**Description:** DTO for requesting keyword suggestions.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** KeywordSuggestionRequestDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/request/keyword-suggestion.request.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** topic  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @ApiProperty  
    - **Name:** currentKeywords  
**Type:** string[]  
**Attributes:** @IsArray() @IsString({ each: true }) @IsOptional() @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Keyword Suggestion Input Validation
    
**Requirement Ids:**
    
    - REQ-7-001
    
**Purpose:** Defines the expected structure for requesting keyword suggestions based on a topic and optional current keywords.  
**Logic Description:** Contains a topic string and an optional array of current keywords. Uses class-validator decorators and @ApiProperty.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for requests to get keyword suggestions.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/response/keyword-suggestion.response.dto.ts  
**Description:** DTO for returning keyword suggestions.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** KeywordSuggestionResponseDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/response/keyword-suggestion.response.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** suggestions  
**Type:** string[]  
**Attributes:** @IsArray() @IsString({ each: true }) @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Keyword Suggestion Output
    
**Requirement Ids:**
    
    - REQ-7-001
    
**Purpose:** Defines the structure of the response containing keyword suggestions.  
**Logic Description:** Contains an array of suggested keywords. Uses @ApiProperty for Swagger documentation.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for responses containing keyword suggestions.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/request/update-schema-markup.request.dto.ts  
**Description:** DTO for updating schema markup for a page.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** UpdateSchemaMarkupRequestDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/request/update-schema-markup.request.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** schemaJson  
**Type:** object  
**Attributes:** @IsObject() @IsNotEmpty() @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Schema Markup Update Input Validation
    
**Requirement Ids:**
    
    - REQ-7-002
    
**Purpose:** Defines the structure for updating schema markup with a JSON object.  
**Logic Description:** Contains a schemaJson object. Uses class-validator decorators and @ApiProperty.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for requests to update schema markup of a page.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/response/schema-markup.response.dto.ts  
**Description:** DTO for returning schema markup for a page.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** SchemaMarkupResponseDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/response/schema-markup.response.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** pageId  
**Type:** string  
**Attributes:** @IsString() @ApiProperty  
    - **Name:** pageType  
**Type:** string  
**Attributes:** @IsString() @ApiProperty  
    - **Name:** schemaType  
**Type:** string  
**Attributes:** @IsString() @ApiProperty  
    - **Name:** schemaJson  
**Type:** object  
**Attributes:** @IsObject() @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Schema Markup Data Output
    
**Requirement Ids:**
    
    - REQ-7-002
    
**Purpose:** Defines the structure of the response containing schema markup information for a page.  
**Logic Description:** Contains pageId, pageType, schemaType, and the schemaJson object. Uses @ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for responses containing schema markup details.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/request/update-page-meta-tags.request.dto.ts  
**Description:** DTO for updating meta tags (title, description, slug, canonical) for a page.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** UpdatePageMetaTagsRequestDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/request/update-page-meta-tags.request.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** metaTitle  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @MaxLength(70) @ApiProperty  
    - **Name:** metaDescription  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @MaxLength(160) @ApiProperty  
    - **Name:** urlSlug  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) @ApiProperty  
    - **Name:** canonicalUrl  
**Type:** string  
**Attributes:** @IsUrl() @IsOptional() @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Meta Tag Update Input Validation
    
**Requirement Ids:**
    
    - REQ-7-003
    
**Purpose:** Defines the structure for updating page meta tags, including validation for length and format.  
**Logic Description:** Contains optional fields for metaTitle, metaDescription, urlSlug, and canonicalUrl with appropriate class-validator decorators and @ApiProperty.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for requests to update meta tags of a page.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/response/page-meta-tags.response.dto.ts  
**Description:** DTO for returning meta tags of a page.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** PageMetaTagsResponseDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/response/page-meta-tags.response.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** pageId  
**Type:** string  
**Attributes:** @IsString() @ApiProperty  
    - **Name:** pageType  
**Type:** string  
**Attributes:** @IsString() @ApiProperty  
    - **Name:** metaTitle  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiProperty  
    - **Name:** metaDescription  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiProperty  
    - **Name:** urlSlug  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiProperty  
    - **Name:** canonicalUrl  
**Type:** string  
**Attributes:** @IsUrl() @IsOptional() @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Meta Tag Data Output
    
**Requirement Ids:**
    
    - REQ-7-003
    
**Purpose:** Defines the structure of the response containing meta tag information for a page.  
**Logic Description:** Contains pageId, pageType, and optional meta tag fields. Uses @ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for responses containing page meta tag details.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/request/update-image-alt-text.request.dto.ts  
**Description:** DTO for updating ALT text for an image.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** UpdateImageAltTextRequestDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/request/update-image-alt-text.request.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** altText  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @MaxLength(125) @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Image ALT Text Update Input Validation
    
**Requirement Ids:**
    
    - REQ-7-003
    
**Purpose:** Defines the structure for updating image ALT text.  
**Logic Description:** Contains an altText string with validation. Uses class-validator decorators and @ApiProperty.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for requests to update image ALT text.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/response/image-alt-text.response.dto.ts  
**Description:** DTO for returning ALT text of an image.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** ImageAltTextResponseDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/response/image-alt-text.response.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** imageId  
**Type:** string  
**Attributes:** @IsString() @ApiProperty  
    - **Name:** pageId  
**Type:** string  
**Attributes:** @IsString() @ApiProperty  
    - **Name:** pageType  
**Type:** string  
**Attributes:** @IsString() @ApiProperty  
    - **Name:** altText  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Image ALT Text Data Output
    
**Requirement Ids:**
    
    - REQ-7-003
    
**Purpose:** Defines the structure of the response containing image ALT text information.  
**Logic Description:** Contains imageId, pageId, pageType and optional altText. Uses @ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for responses containing image ALT text details.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/response/sitemap-url.response.dto.ts  
**Description:** DTO for returning the XML sitemap URL.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** SitemapUrlResponseDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/response/sitemap-url.response.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** sitemapUrl  
**Type:** string  
**Attributes:** @IsUrl() @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Sitemap URL Data Output
    
**Requirement Ids:**
    
    - REQ-7-004
    
**Purpose:** Defines the structure of the response containing the URL for the merchant's XML sitemap.  
**Logic Description:** Contains a sitemapUrl string. Uses @ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for responses providing the XML sitemap URL.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/response/robots-txt.response.dto.ts  
**Description:** DTO for returning the content of the robots.txt file.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** RobotsTxtResponseDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/response/robots-txt.response.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** content  
**Type:** string  
**Attributes:** @IsString() @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Robots.txt Content Output
    
**Requirement Ids:**
    
    - REQ-7-005
    
**Purpose:** Defines the structure of the response containing the current content of the merchant's robots.txt file.  
**Logic Description:** Contains a content string. Uses @ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for responses providing the content of the robots.txt file.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/request/robots-txt-suggestion.request.dto.ts  
**Description:** DTO for requesting suggestions for robots.txt content.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** RobotsTxtSuggestionRequestDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/request/robots-txt-suggestion.request.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** currentContent  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiProperty  
    - **Name:** desiredDirectives  
**Type:** object  
**Attributes:** @IsObject() @IsOptional() @ApiProperty({ description: 'Object representing desired directives, e.g., {"User-agent: *": ["Disallow: /private/"]}' })  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Robots.txt Suggestion Input Validation
    
**Requirement Ids:**
    
    - REQ-7-005
    
**Purpose:** Defines the structure for requesting suggestions to modify or generate robots.txt content.  
**Logic Description:** Contains optional currentContent and desiredDirectives. Uses class-validator and @ApiProperty.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for requests to get suggestions for robots.txt file content.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/response/robots-txt-suggestion.response.dto.ts  
**Description:** DTO for returning suggestions for robots.txt content.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** RobotsTxtSuggestionResponseDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/response/robots-txt-suggestion.response.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** suggestedContent  
**Type:** string  
**Attributes:** @IsString() @ApiProperty  
    - **Name:** warnings  
**Type:** string[]  
**Attributes:** @IsArray() @IsString({ each: true }) @IsOptional() @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Robots.txt Suggestion Output
    
**Requirement Ids:**
    
    - REQ-7-005
    
**Purpose:** Defines the structure of the response containing suggested robots.txt content and any warnings.  
**Logic Description:** Contains suggestedContent and optional warnings. Uses @ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for responses providing suggestions for robots.txt content.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/request/update-blog-internal-links.request.dto.ts  
**Description:** DTO for updating internal links within a blog post.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** UpdateBlogInternalLinksRequestDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/request/update-blog-internal-links.request.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** internalLinks  
**Type:** InternalLinkDto[]  
**Attributes:** @IsArray() @ValidateNested({ each: true }) @Type(() => InternalLinkDto) @ApiProperty({ type: () => [InternalLinkDto] })  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Blog Internal Link Update Input Validation
    
**Requirement Ids:**
    
    - REQ-7-006
    
**Purpose:** Defines the structure for updating the set of internal links for a blog post.  
**Logic Description:** Contains an array of InternalLinkDto. Uses class-validator and @ApiProperty. Depends on InternalLinkDto.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for requests to update internal links in a blog post.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/common/internal-link.dto.ts  
**Description:** Common DTO representing an internal link.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** InternalLinkDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/common/internal-link.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** anchorText  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @ApiProperty  
    - **Name:** targetUrl  
**Type:** string  
**Attributes:** @IsUrl() @ApiProperty  
    - **Name:** targetProductId  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Internal Link Data Structure
    
**Requirement Ids:**
    
    - REQ-7-006
    
**Purpose:** Represents a single internal link with its anchor text, target URL, and optional target product ID.  
**Logic Description:** Shared DTO used in request and response DTOs for internal links. Uses class-validator and @ApiProperty.  
**Documentation:**
    
    - **Summary:** A common Data Transfer Object representing an internal link's properties.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Common  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/response/blog-internal-links.response.dto.ts  
**Description:** DTO for returning internal links of a blog post.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** BlogInternalLinksResponseDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/response/blog-internal-links.response.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** blogPostId  
**Type:** string  
**Attributes:** @IsString() @ApiProperty  
    - **Name:** internalLinks  
**Type:** InternalLinkDto[]  
**Attributes:** @IsArray() @ValidateNested({ each: true }) @Type(() => InternalLinkDto) @ApiProperty({ type: () => [InternalLinkDto] })  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Blog Internal Link Data Output
    
**Requirement Ids:**
    
    - REQ-7-006
    
**Purpose:** Defines the structure of the response containing internal links for a specific blog post.  
**Logic Description:** Contains blogPostId and an array of InternalLinkDto. Uses @ApiProperty and depends on InternalLinkDto.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for responses listing internal links within a blog post.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/request/internal-link-suggestion.request.dto.ts  
**Description:** DTO for requesting internal link suggestions for blog content.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** InternalLinkSuggestionRequestDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/request/internal-link-suggestion.request.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** contentSample  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @MinLength(50) @ApiProperty({ description: 'A sample of the blog content to analyze for link suggestions.' })  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Internal Link Suggestion Input Validation
    
**Requirement Ids:**
    
    - REQ-7-006
    
**Purpose:** Defines the structure for requesting suggestions for internal links based on a sample of blog content.  
**Logic Description:** Contains contentSample string. Uses class-validator and @ApiProperty.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for requests to get internal link suggestions based on blog content.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/response/internal-link-suggestion.response.dto.ts  
**Description:** DTO for returning internal link suggestions.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** InternalLinkSuggestionResponseDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/response/internal-link-suggestion.response.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** suggestions  
**Type:** SuggestedLinkDto[]  
**Attributes:** @IsArray() @ValidateNested({ each: true }) @Type(() => SuggestedLinkDto) @ApiProperty({ type: () => [SuggestedLinkDto] })  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Internal Link Suggestion Output
    
**Requirement Ids:**
    
    - REQ-7-006
    
**Purpose:** Defines the structure of the response containing suggestions for internal links.  
**Logic Description:** Contains an array of SuggestedLinkDto. Uses @ApiProperty and depends on SuggestedLinkDto.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for responses providing internal link suggestions.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/seo/api/dtos/common/suggested-link.dto.ts  
**Description:** Common DTO representing a suggested internal link.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** SuggestedLinkDto  
**Type:** DTO  
**Relative Path:** modules/seo/api/dtos/common/suggested-link.dto.ts  
**Repository Id:** REPO-SEO-008  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** relevantText  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @ApiProperty({ description: 'The text within the content sample that is relevant for linking.' })  
    - **Name:** suggestedAnchorText  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiProperty  
    - **Name:** suggestedTargetUrl  
**Type:** string  
**Attributes:** @IsUrl() @ApiProperty  
    - **Name:** targetType  
**Type:** string  
**Attributes:** @IsString() @IsIn(['product', 'blog', 'collection', 'custom']) @ApiProperty  
    - **Name:** reason  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiProperty  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Suggested Link Data Structure
    
**Requirement Ids:**
    
    - REQ-7-006
    
**Purpose:** Represents a single suggested internal link, including the relevant text from content, suggested anchor, target URL, and type.  
**Logic Description:** Shared DTO used in response DTOs for internal link suggestions. Uses class-validator and @ApiProperty.  
**Documentation:**
    
    - **Summary:** A common Data Transfer Object representing a suggested internal link with its properties.
    
**Namespace:** AdManager.SEOService.Api.V1.Dtos.Common  
**Metadata:**
    
    - **Category:** DTO
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableAdvancedKeywordSuggestions
  - enableRobotsTxtAutoGeneration
  
- **Database Configs:**
  
  


---

