# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project dependencies, scripts, and metadata for the NestJS application.  
**Template:** NestJS package.json Template  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../../../package.json  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Management
    - Project Scripts
    
**Requirement Ids:**
    
    
**Purpose:** Manages Node.js project dependencies including NestJS framework, class-validator, class-transformer, @nestjs/swagger, and development tools. Defines scripts for running, building, and testing the application.  
**Logic Description:** Contains dependencies like @nestjs/common, @nestjs/core, @nestjs/platform-express, class-validator, class-transformer, @nestjs/swagger, reflect-metadata, rxjs. Includes scripts for start:dev, build, test.  
**Documentation:**
    
    - **Summary:** Standard package.json file for a NestJS TypeScript project. Lists all production and development dependencies, and common NPM scripts.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** tsconfig.json  
**Description:** TypeScript compiler options for the project.  
**Template:** NestJS tsconfig.json Template  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ../../../tsconfig.json  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript Compilation Configuration
    
**Requirement Ids:**
    
    
**Purpose:** Configures the TypeScript compiler, specifying target ECMAScript version, module system, decorators, paths, and strict type-checking options.  
**Logic Description:** Specifies compilerOptions such as target (e.g., ES2021), module (CommonJS), experimentalDecorators, emitDecoratorMetadata, strictNullChecks, baseUrl, paths for module resolution, and outDir.  
**Documentation:**
    
    - **Summary:** TypeScript configuration file ensuring consistent compilation settings for the NestJS application, enabling modern JavaScript features and type safety.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** nest-cli.json  
**Description:** NestJS CLI configuration file.  
**Template:** NestJS nest-cli.json Template  
**Dependancy Level:** 0  
**Name:** nest-cli  
**Type:** Configuration  
**Relative Path:** ../../../nest-cli.json  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - NestJS CLI Settings
    
**Requirement Ids:**
    
    
**Purpose:** Provides configuration for the NestJS command-line interface, including collection, sourceRoot, and compilerOptions for building the application.  
**Logic Description:** Defines settings like "collection": "@nestjs/schematics", "sourceRoot": "src", and potentially monorepo project settings if applicable.  
**Documentation:**
    
    - **Summary:** Configuration file for the NestJS CLI, used to manage project structure, code generation, and build processes.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/main.ts  
**Description:** Application entry point. Initializes and bootstraps the NestJS application.  
**Template:** NestJS main.ts Template  
**Dependancy Level:** 2  
**Name:** main  
**Type:** Bootstrap  
**Relative Path:** main.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** bootstrap  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** async  
    
**Implemented Features:**
    
    - Application Initialization
    - Swagger Integration
    
**Requirement Ids:**
    
    
**Purpose:** Creates an instance of the NestJS application, sets up global middleware/pipes/filters, enables Swagger documentation, and starts the HTTP listener.  
**Logic Description:** Imports NestFactory and AppModule. Creates the app instance. Sets up global pipes (e.g., ClassValidationPipe). Initializes SwaggerModule for API documentation. Listens on a configured port.  
**Documentation:**
    
    - **Summary:** The main bootstrap file for the NestJS application. It sets up the application environment, configures global aspects like validation and Swagger, and starts the server.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/app.module.ts  
**Description:** Root module of the application.  
**Template:** NestJS Module Template  
**Dependancy Level:** 1  
**Name:** AppModule  
**Type:** Module  
**Relative Path:** app.module.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module Aggregation
    
**Requirement Ids:**
    
    
**Purpose:** Imports all major modules of the application, including configuration and feature modules like AnalyticsReportingV1Module.  
**Logic Description:** Decorated with @Module. Imports ConfigModule (for environment variables) and AnalyticsReportingV1Module. May include providers for global services or guards if necessary.  
**Documentation:**
    
    - **Summary:** The root NestJS module that ties together all other modules, forming the main application structure.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/config/config.module.ts  
**Description:** Module for application configuration management.  
**Template:** NestJS Module Template  
**Dependancy Level:** 0  
**Name:** ConfigModule  
**Type:** Module  
**Relative Path:** config/config.module.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Configuration Loading
    
**Requirement Ids:**
    
    
**Purpose:** Uses NestJS ConfigModule to load environment variables and provide them application-wide through a ConfigService.  
**Logic Description:** Imports and configures NestJS ConfigModule, potentially with schema validation for environment variables.  
**Documentation:**
    
    - **Summary:** Centralized module for handling application configuration, ensuring settings are loaded and accessible consistently.
    
**Namespace:** AdManager.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/common/guards/jwt-auth.guard.ts  
**Description:** Implements JWT authentication strategy for protecting API endpoints.  
**Template:** NestJS Guard Template  
**Dependancy Level:** 1  
**Name:** JwtAuthGuard  
**Type:** Guard  
**Relative Path:** common/guards/jwt-auth.guard.ts  
**Repository Id:** REPO-ANALYTICS-004  
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
    
    
**Purpose:** Extends AuthGuard('jwt') to protect routes. Validates JWT token from request headers and attaches user information to the request object.  
**Logic Description:** Uses Passport and @nestjs/passport. Verifies the JWT token. Throws UnauthorizedException if token is invalid or missing.  
**Documentation:**
    
    - **Summary:** A NestJS guard that uses Passport's JWT strategy to secure API endpoints, ensuring only authenticated users can access them.
    
**Namespace:** AdManager.Common.Guards  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/common/pipes/class-validation.pipe.ts  
**Description:** Global validation pipe using class-validator and class-transformer.  
**Template:** NestJS Pipe Template  
**Dependancy Level:** 1  
**Name:** ClassValidationPipe  
**Type:** Pipe  
**Relative Path:** common/pipes/class-validation.pipe.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** transform  
**Parameters:**
    
    - value: any
    - metadata: ArgumentMetadata
    
**Return Type:** Promise<any>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - Request DTO Validation
    
**Requirement Ids:**
    
    
**Purpose:** Automatically validates incoming request DTOs against their defined validation rules using class-validator. Transforms plain objects to class instances.  
**Logic Description:** Uses `validate` from class-validator and `plainToClass` from class-transformer. Throws BadRequestException if validation fails.  
**Documentation:**
    
    - **Summary:** A custom NestJS pipe that leverages class-validator and class-transformer to perform validation on request DTOs.
    
**Namespace:** AdManager.Common.Pipes  
**Metadata:**
    
    - **Category:** Validation
    
- **Path:** src/common/interceptors/response.interceptor.ts  
**Description:** Interceptor to standardize API response format.  
**Template:** NestJS Interceptor Template  
**Dependancy Level:** 1  
**Name:** ResponseInterceptor  
**Type:** Interceptor  
**Relative Path:** common/interceptors/response.interceptor.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** intercept  
**Parameters:**
    
    - context: ExecutionContext
    - next: CallHandler
    
**Return Type:** Observable<any>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Standardized API Responses
    
**Requirement Ids:**
    
    
**Purpose:** Wraps successful API responses in a consistent structure, e.g., { statusCode, message, data }.  
**Logic Description:** Uses RxJS `map` operator to transform the response stream. Extracts status code and data, and formats them into a standard JSON object.  
**Documentation:**
    
    - **Summary:** A NestJS interceptor that formats all successful API responses into a consistent structure for clients.
    
**Namespace:** AdManager.Common.Interceptors  
**Metadata:**
    
    - **Category:** API
    
- **Path:** src/common/filters/http-exception.filter.ts  
**Description:** Global filter to catch and format HTTP exceptions.  
**Template:** NestJS Exception Filter Template  
**Dependancy Level:** 1  
**Name:** HttpExceptionFilter  
**Type:** Filter  
**Relative Path:** common/filters/http-exception.filter.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** catch  
**Parameters:**
    
    - exception: HttpException
    - host: ArgumentsHost
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Global Error Handling
    
**Requirement Ids:**
    
    
**Purpose:** Catches all HttpException instances and formats them into a standardized JSON error response.  
**Logic Description:** Gets HTTP status and message from the exception. Sends a JSON response with status, timestamp, path, and error message/details.  
**Documentation:**
    
    - **Summary:** A NestJS exception filter that provides global, consistent error handling for HTTP exceptions thrown by the application.
    
**Namespace:** AdManager.Common.Filters  
**Metadata:**
    
    - **Category:** ErrorHandling
    
- **Path:** src/modules/analytics-reporting/api/v1/api-v1.module.ts  
**Description:** NestJS module for V1 of the Analytics Reporting API.  
**Template:** NestJS Module Template  
**Dependancy Level:** 4  
**Name:** AnalyticsReportingV1Module  
**Type:** Module  
**Relative Path:** modules/analytics-reporting/api/v1/api-v1.module.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module Definition for Analytics API V1
    
**Requirement Ids:**
    
    - REQ-CMO-007
    - REQ-ARP-001
    - REQ-ARP-002
    - REQ-ARP-003
    - REQ-ARP-004
    - REQ-ARP-008
    - REQ-CPSI-007
    - 3.1.1 (Reporting and Analytics - Advertising Specific)
    
**Purpose:** Aggregates all controllers, services, and providers related to the V1 Analytics Reporting API.  
**Logic Description:** Imports necessary modules. Declares controllers (PerformanceV1Controller, ABTestV1Controller, etc.) and providers (AnalyticsReportingV1Service, PerformanceMetricCalculatorV1Service).  
**Documentation:**
    
    - **Summary:** The main module for version 1 of the Analytics Reporting API, responsible for organizing its components and dependencies.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1  
**Metadata:**
    
    - **Category:** Module
    
- **Path:** src/modules/analytics-reporting/api/v1/constants/report-types.enum.ts  
**Description:** Defines an enumeration for different types of reports.  
**Template:** TypeScript Enum  
**Dependancy Level:** 0  
**Name:** ReportType  
**Type:** Enum  
**Relative Path:** modules/analytics-reporting/api/v1/constants/report-types.enum.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** CAMPAIGN_PERFORMANCE  
**Type:** string  
**Attributes:**   
    - **Name:** AD_SET_PERFORMANCE  
**Type:** string  
**Attributes:**   
    - **Name:** AD_PERFORMANCE  
**Type:** string  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - Report Type Definitions
    
**Requirement Ids:**
    
    - REQ-ARP-001
    - REQ-ARP-003
    
**Purpose:** Provides standardized names for report types used within the analytics reporting module.  
**Logic Description:** A TypeScript enum listing various report types like CAMPAIGN_PERFORMANCE, AGGREGATED_NETWORK, AB_TEST_RESULT.  
**Documentation:**
    
    - **Summary:** Enumeration of supported report types for analytics and reporting functionalities.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Constants  
**Metadata:**
    
    - **Category:** Constants
    
- **Path:** src/modules/analytics-reporting/api/v1/constants/metric-names.enum.ts  
**Description:** Defines an enumeration for standard metric names.  
**Template:** TypeScript Enum  
**Dependancy Level:** 0  
**Name:** MetricName  
**Type:** Enum  
**Relative Path:** modules/analytics-reporting/api/v1/constants/metric-names.enum.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** ROAS  
**Type:** string  
**Attributes:**   
    - **Name:** CPA  
**Type:** string  
**Attributes:**   
    - **Name:** CTR  
**Type:** string  
**Attributes:**   
    - **Name:** IMPRESSIONS  
**Type:** string  
**Attributes:**   
    - **Name:** CLICKS  
**Type:** string  
**Attributes:**   
    - **Name:** CONVERSIONS  
**Type:** string  
**Attributes:**   
    - **Name:** SPEND  
**Type:** string  
**Attributes:**   
    - **Name:** REACH  
**Type:** string  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - Metric Name Definitions
    
**Requirement Ids:**
    
    - REQ-CMO-007
    - REQ-ARP-001
    - REQ-ARP-002
    
**Purpose:** Provides standardized names for performance metrics used in reports and dashboards.  
**Logic Description:** A TypeScript enum listing metric names like ROAS, CPA, CTR, IMPRESSIONS, SPEND, CONVERSIONS.  
**Documentation:**
    
    - **Summary:** Enumeration of standard advertising performance metric names.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Constants  
**Metadata:**
    
    - **Category:** Constants
    
- **Path:** src/modules/analytics-reporting/api/v1/dto/request/performance-report-query.dto.ts  
**Description:** DTO for querying performance reports with filters.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** PerformanceReportQueryDto  
**Type:** DTO  
**Relative Path:** modules/analytics-reporting/api/v1/dto/request/performance-report-query.dto.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** startDate  
**Type:** Date  
**Attributes:** @IsDateString()|@IsOptional()  
    - **Name:** endDate  
**Type:** Date  
**Attributes:** @IsDateString()|@IsOptional()  
    - **Name:** campaignIds  
**Type:** string[]  
**Attributes:** @IsArray()|@IsUUID('all', { each: true })|@IsOptional()  
    - **Name:** adNetworkIds  
**Type:** string[]  
**Attributes:** @IsArray()|@IsString({ each: true })|@IsOptional()  
    - **Name:** dimensions  
**Type:** string[]  
**Attributes:** @IsArray()|@IsString({ each: true })|@IsOptional()  
    - **Name:** metrics  
**Type:** MetricName[]  
**Attributes:** @IsArray()|@IsEnum(MetricName, { each: true })|@IsOptional()  
    - **Name:** granularity  
**Type:** string  
**Attributes:** @IsString()|@IsOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Performance Report Query Definition
    
**Requirement Ids:**
    
    - REQ-CMO-007
    - REQ-ARP-001
    - REQ-ARP-002
    - REQ-ARP-003
    
**Purpose:** Defines the structure for request parameters when fetching performance reports, including filters for date range, campaigns, ad networks, dimensions, and metrics.  
**Logic Description:** Uses class-validator decorators for validation (e.g., IsDateString, IsOptional, IsArray, IsUUID, IsEnum). Properties for startDate, endDate, campaignIds, adNetworkIds, dimensions, metrics, granularity.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for performance report query parameters, enabling filtering and customization of report data.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Dto.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/analytics-reporting/api/v1/dto/request/ab-test-report-query.dto.ts  
**Description:** DTO for querying A/B test reports.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** ABTestReportQueryDto  
**Type:** DTO  
**Relative Path:** modules/analytics-reporting/api/v1/dto/request/ab-test-report-query.dto.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** testId  
**Type:** string  
**Attributes:** @IsUUID()  
    - **Name:** startDate  
**Type:** Date  
**Attributes:** @IsDateString()|@IsOptional()  
    - **Name:** endDate  
**Type:** Date  
**Attributes:** @IsDateString()|@IsOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - A/B Test Report Query Definition
    
**Requirement Ids:**
    
    - REQ-ARP-004
    
**Purpose:** Defines the structure for request parameters when fetching A/B test reports, including test ID and date range filters.  
**Logic Description:** Uses class-validator decorators for validation. Properties for testId, startDate, endDate.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for A/B test report query parameters.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Dto.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/analytics-reporting/api/v1/dto/request/custom-dashboard-config.dto.ts  
**Description:** DTO for creating or updating a custom dashboard configuration.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** CustomDashboardConfigDto  
**Type:** DTO  
**Relative Path:** modules/analytics-reporting/api/v1/dto/request/custom-dashboard-config.dto.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** dashboardName  
**Type:** string  
**Attributes:** @IsString()|@IsNotEmpty()  
    - **Name:** widgets  
**Type:** WidgetConfigDto[]  
**Attributes:** @IsArray()|@ValidateNested({ each: true })|@Type(() => WidgetConfigDto)  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Custom Dashboard Configuration Definition
    
**Requirement Ids:**
    
    - REQ-ARP-003
    
**Purpose:** Defines the structure for dashboard configurations, including name and an array of widget configurations.  
**Logic Description:** Includes properties for dashboardName and widgets. WidgetConfigDto would be a nested DTO defining widget type, metrics, dimensions, etc. Uses class-validator for validation.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for defining the configuration of a merchant's custom dashboard.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Dto.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/analytics-reporting/api/v1/dto/request/widget-config.dto.ts  
**Description:** Nested DTO for individual widget configurations within a custom dashboard.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 0  
**Name:** WidgetConfigDto  
**Type:** DTO  
**Relative Path:** modules/analytics-reporting/api/v1/dto/request/widget-config.dto.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** widgetId  
**Type:** string  
**Attributes:** @IsUUID()|@IsOptional()  
    - **Name:** widgetType  
**Type:** string  
**Attributes:** @IsString()|@IsNotEmpty()  
    - **Name:** title  
**Type:** string  
**Attributes:** @IsString()|@IsOptional()  
    - **Name:** metrics  
**Type:** MetricName[]  
**Attributes:** @IsArray()|@IsEnum(MetricName, { each: true })  
    - **Name:** dimensions  
**Type:** string[]  
**Attributes:** @IsArray()|@IsString({ each: true })|@IsOptional()  
    - **Name:** filters  
**Type:** any  
**Attributes:** @IsObject()|@IsOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dashboard Widget Configuration
    
**Requirement Ids:**
    
    - REQ-ARP-003
    
**Purpose:** Defines the structure for configuring individual widgets on a custom dashboard.  
**Logic Description:** Properties for widgetId, widgetType (e.g., 'line-chart', 'bar-chart', 'kpi-card'), title, metrics to display, dimensions for grouping, and any specific filters.  
**Documentation:**
    
    - **Summary:** Data Transfer Object representing the configuration for a single widget on a customizable dashboard.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Dto.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/analytics-reporting/api/v1/dto/request/report-export-query.dto.ts  
**Description:** DTO for requesting a report export.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** ReportExportQueryDto  
**Type:** DTO  
**Relative Path:** modules/analytics-reporting/api/v1/dto/request/report-export-query.dto.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** reportType  
**Type:** ReportType  
**Attributes:** @IsEnum(ReportType)  
    - **Name:** format  
**Type:** string  
**Attributes:** @IsIn(['csv', 'pdf'])  
    - **Name:** filters  
**Type:** PerformanceReportQueryDto  
**Attributes:** @ValidateNested()|@Type(() => PerformanceReportQueryDto)  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Report Export Query Definition
    
**Requirement Ids:**
    
    - REQ-ARP-003
    
**Purpose:** Defines parameters for exporting a report, including report type, desired format (CSV, PDF), and specific filters.  
**Logic Description:** Properties for reportType, format (e.g., 'csv', 'pdf'), and nested filters (reusing PerformanceReportQueryDto or a similar structure).  
**Documentation:**
    
    - **Summary:** Data Transfer Object for specifying parameters for generating and exporting reports.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Dto.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/analytics-reporting/api/v1/dto/response/campaign-performance.dto.ts  
**Description:** DTO for campaign performance metrics.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** CampaignPerformanceDto  
**Type:** DTO  
**Relative Path:** modules/analytics-reporting/api/v1/dto/response/campaign-performance.dto.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** campaignId  
**Type:** string  
**Attributes:**   
    - **Name:** campaignName  
**Type:** string  
**Attributes:**   
    - **Name:** roas  
**Type:** number  
**Attributes:**   
    - **Name:** cpa  
**Type:** number  
**Attributes:**   
    - **Name:** ctr  
**Type:** number  
**Attributes:**   
    - **Name:** impressions  
**Type:** number  
**Attributes:**   
    - **Name:** clicks  
**Type:** number  
**Attributes:**   
    - **Name:** conversions  
**Type:** number  
**Attributes:**   
    - **Name:** spend  
**Type:** number  
**Attributes:**   
    - **Name:** reach  
**Type:** number  
**Attributes:**   
    - **Name:** adNetworkId  
**Type:** string  
**Attributes:** @IsOptional()  
    - **Name:** adSets  
**Type:** AdSetPerformanceDto[]  
**Attributes:** @IsOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Campaign Performance Data Structure
    
**Requirement Ids:**
    
    - REQ-CMO-007
    - REQ-ARP-001
    
**Purpose:** Defines the structure for returning campaign performance metrics.  
**Logic Description:** Properties for campaignId, campaignName, ROAS, CPA, CTR, impressions, spend, conversions, reach. May include breakdowns by ad sets (AdSetPerformanceDto).  
**Documentation:**
    
    - **Summary:** Data Transfer Object representing performance metrics for a single advertising campaign.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Dto.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/analytics-reporting/api/v1/dto/response/ad-set-performance.dto.ts  
**Description:** DTO for ad set performance metrics.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 0  
**Name:** AdSetPerformanceDto  
**Type:** DTO  
**Relative Path:** modules/analytics-reporting/api/v1/dto/response/ad-set-performance.dto.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** adSetId  
**Type:** string  
**Attributes:**   
    - **Name:** adSetName  
**Type:** string  
**Attributes:**   
    - **Name:** roas  
**Type:** number  
**Attributes:**   
    - **Name:** cpa  
**Type:** number  
**Attributes:**   
    - **Name:** ctr  
**Type:** number  
**Attributes:**   
    - **Name:** impressions  
**Type:** number  
**Attributes:**   
    - **Name:** spend  
**Type:** number  
**Attributes:**   
    - **Name:** conversions  
**Type:** number  
**Attributes:**   
    - **Name:** ads  
**Type:** AdPerformanceDto[]  
**Attributes:** @IsOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Ad Set Performance Data Structure
    
**Requirement Ids:**
    
    - REQ-ARP-001
    
**Purpose:** Defines the structure for returning ad set performance metrics.  
**Logic Description:** Properties for adSetId, adSetName, and key performance metrics. May include breakdowns by ads (AdPerformanceDto).  
**Documentation:**
    
    - **Summary:** Data Transfer Object representing performance metrics for a single ad set.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Dto.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/analytics-reporting/api/v1/dto/response/ad-performance.dto.ts  
**Description:** DTO for individual ad performance metrics.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 0  
**Name:** AdPerformanceDto  
**Type:** DTO  
**Relative Path:** modules/analytics-reporting/api/v1/dto/response/ad-performance.dto.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** adId  
**Type:** string  
**Attributes:**   
    - **Name:** adName  
**Type:** string  
**Attributes:** @IsOptional()  
    - **Name:** roas  
**Type:** number  
**Attributes:**   
    - **Name:** cpa  
**Type:** number  
**Attributes:**   
    - **Name:** ctr  
**Type:** number  
**Attributes:**   
    - **Name:** impressions  
**Type:** number  
**Attributes:**   
    - **Name:** spend  
**Type:** number  
**Attributes:**   
    - **Name:** conversions  
**Type:** number  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - Ad Performance Data Structure
    
**Requirement Ids:**
    
    - REQ-ARP-001
    
**Purpose:** Defines the structure for returning individual ad performance metrics.  
**Logic Description:** Properties for adId, adName (or creative identifier), and key performance metrics.  
**Documentation:**
    
    - **Summary:** Data Transfer Object representing performance metrics for a single ad creative.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Dto.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/analytics-reporting/api/v1/dto/response/aggregated-performance.dto.ts  
**Description:** DTO for aggregated performance metrics across multiple networks or campaigns.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** AggregatedPerformanceDto  
**Type:** DTO  
**Relative Path:** modules/analytics-reporting/api/v1/dto/response/aggregated-performance.dto.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** totalSpend  
**Type:** number  
**Attributes:**   
    - **Name:** totalImpressions  
**Type:** number  
**Attributes:**   
    - **Name:** totalClicks  
**Type:** number  
**Attributes:**   
    - **Name:** totalConversions  
**Type:** number  
**Attributes:**   
    - **Name:** averageRoas  
**Type:** number  
**Attributes:**   
    - **Name:** averageCpa  
**Type:** number  
**Attributes:**   
    - **Name:** averageCtr  
**Type:** number  
**Attributes:**   
    - **Name:** breakdown  
**Type:** CampaignPerformanceDto[] | any[]  
**Attributes:** @IsOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Aggregated Performance Data Structure
    
**Requirement Ids:**
    
    - REQ-ARP-002
    
**Purpose:** Defines the structure for returning aggregated performance metrics, potentially with breakdowns.  
**Logic Description:** Properties for totalSpend, totalImpressions, averageRoas, etc. May include a 'breakdown' array for per-network or per-campaign summaries.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for presenting aggregated advertising performance across multiple networks or campaigns.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Dto.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/analytics-reporting/api/v1/dto/response/ab-test-result.dto.ts  
**Description:** DTO for A/B test results.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 1  
**Name:** ABTestResultDto  
**Type:** DTO  
**Relative Path:** modules/analytics-reporting/api/v1/dto/response/ab-test-result.dto.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** testId  
**Type:** string  
**Attributes:**   
    - **Name:** testName  
**Type:** string  
**Attributes:**   
    - **Name:** variants  
**Type:** ABTestVariantPerformanceDto[]  
**Attributes:**   
    - **Name:** winningVariantId  
**Type:** string  
**Attributes:** @IsOptional()  
    - **Name:** statisticalSignificance  
**Type:** any  
**Attributes:** @IsOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - A/B Test Result Data Structure
    
**Requirement Ids:**
    
    - REQ-ARP-004
    
**Purpose:** Defines the structure for returning A/B test results, including performance of each variant and statistical significance.  
**Logic Description:** Properties for testId, testName, an array of variant performances (ABTestVariantPerformanceDto), winningVariantId, and statistical significance details.  
**Documentation:**
    
    - **Summary:** Data Transfer Object representing the results of an A/B test, including variant performance and significance.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Dto.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/analytics-reporting/api/v1/dto/response/ab-test-variant-performance.dto.ts  
**Description:** DTO for performance of a single A/B test variant.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 0  
**Name:** ABTestVariantPerformanceDto  
**Type:** DTO  
**Relative Path:** modules/analytics-reporting/api/v1/dto/response/ab-test-variant-performance.dto.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** variantId  
**Type:** string  
**Attributes:**   
    - **Name:** variantName  
**Type:** string  
**Attributes:**   
    - **Name:** conversionRate  
**Type:** number  
**Attributes:** @IsOptional()  
    - **Name:** ctr  
**Type:** number  
**Attributes:** @IsOptional()  
    - **Name:** cpa  
**Type:** number  
**Attributes:** @IsOptional()  
    - **Name:** roas  
**Type:** number  
**Attributes:** @IsOptional()  
    - **Name:** impressions  
**Type:** number  
**Attributes:** @IsOptional()  
    - **Name:** conversions  
**Type:** number  
**Attributes:** @IsOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - A/B Test Variant Performance Structure
    
**Requirement Ids:**
    
    - REQ-ARP-004
    
**Purpose:** Defines the structure for performance metrics of a specific variant in an A/B test.  
**Logic Description:** Properties for variantId, variantName, and relevant performance metrics like conversionRate, CTR, CPA, ROAS.  
**Documentation:**
    
    - **Summary:** Data Transfer Object detailing the performance metrics for an individual variant within an A/B test.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Dto.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/analytics-reporting/api/v1/dto/response/actionable-insight.dto.ts  
**Description:** DTO for presenting actionable insights derived from analytics data.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 0  
**Name:** ActionableInsightDto  
**Type:** DTO  
**Relative Path:** modules/analytics-reporting/api/v1/dto/response/actionable-insight.dto.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** insightId  
**Type:** string  
**Attributes:**   
    - **Name:** title  
**Type:** string  
**Attributes:**   
    - **Name:** description  
**Type:** string  
**Attributes:**   
    - **Name:** recommendation  
**Type:** string  
**Attributes:** @IsOptional()  
    - **Name:** relatedEntityType  
**Type:** string  
**Attributes:** @IsOptional()  
    - **Name:** relatedEntityId  
**Type:** string  
**Attributes:** @IsOptional()  
    - **Name:** severity  
**Type:** string  
**Attributes:** @IsOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Actionable Insight Data Structure
    
**Requirement Ids:**
    
    - REQ-ARP-008
    
**Purpose:** Defines the structure for returning actionable insights, trends, or recommendations to merchants.  
**Logic Description:** Properties for insightId, title, description, recommendation text, related entity (e.g., campaign, product), and severity/priority.  
**Documentation:**
    
    - **Summary:** Data Transfer Object used to convey actionable insights, trends, or recommendations to merchants based on their advertising performance data.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Dto.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/analytics-reporting/api/v1/dto/response/data-ingestion-status.dto.ts  
**Description:** DTO for reporting the status of data ingestion processes.  
**Template:** NestJS DTO Template  
**Dependancy Level:** 0  
**Name:** DataIngestionStatusDto  
**Type:** DTO  
**Relative Path:** modules/analytics-reporting/api/v1/dto/response/data-ingestion-status.dto.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** dataSource  
**Type:** string  
**Attributes:**   
    - **Name:** lastSuccessfulSync  
**Type:** Date  
**Attributes:**   
    - **Name:** status  
**Type:** string  
**Attributes:**   
    - **Name:** processedRecords  
**Type:** number  
**Attributes:** @IsOptional()  
    - **Name:** latencyMs  
**Type:** number  
**Attributes:** @IsOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Data Ingestion Status Structure
    
**Requirement Ids:**
    
    - REQ-ARP-005
    
**Purpose:** Defines the structure for returning status information about data ingestion pipelines, relevant to REQ-ARP-005 NFR.  
**Logic Description:** Properties for dataSource (e.g., 'Google Ads Performance', 'Core Platform Orders'), lastSuccessfulSync timestamp, current status (e.g., 'Healthy', 'Delayed', 'Error'), and optional metrics like records processed or latency.  
**Documentation:**
    
    - **Summary:** Data Transfer Object providing status information for analytics data ingestion processes.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Dto.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/analytics-reporting/api/v1/interfaces/analytics-data-provider.interface.ts  
**Description:** Interface for services that provide analytics data from underlying storage.  
**Template:** TypeScript Interface  
**Dependancy Level:** 1  
**Name:** IAnalyticsDataProvider  
**Type:** Interface  
**Relative Path:** modules/analytics-reporting/api/v1/interfaces/analytics-data-provider.interface.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    - DependencyInversion
    
**Members:**
    
    
**Methods:**
    
    - **Name:** getCampaignPerformanceData  
**Parameters:**
    
    - query: PerformanceReportQueryDto
    
**Return Type:** Promise<CampaignPerformanceDto[]>  
**Attributes:**   
    - **Name:** getAggregatedPerformanceData  
**Parameters:**
    
    - query: PerformanceReportQueryDto
    
**Return Type:** Promise<AggregatedPerformanceDto>  
**Attributes:**   
    - **Name:** getABTestResults  
**Parameters:**
    
    - query: ABTestReportQueryDto
    
**Return Type:** Promise<ABTestResultDto>  
**Attributes:**   
    
**Implemented Features:**
    
    - Analytics Data Access Contract
    
**Requirement Ids:**
    
    - REQ-ARP-007
    
**Purpose:** Defines a contract for fetching processed campaign performance data, aggregated data, and A/B test results from data stores like DynamoDB.  
**Logic Description:** Methods for querying campaign performance (drill-down capable), aggregated cross-network data, and A/B test results. This interface would be implemented by a service that interacts with DynamoDB or other data sources for REQ-ARP-007.  
**Documentation:**
    
    - **Summary:** Interface defining the contract for components responsible for fetching analytics and reporting data from persistent storage.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Interfaces  
**Metadata:**
    
    - **Category:** Interface
    
- **Path:** src/modules/analytics-reporting/api/v1/interfaces/core-platform-data.interface.ts  
**Description:** Interface for services fetching order/sales data from the core platform.  
**Template:** TypeScript Interface  
**Dependancy Level:** 1  
**Name:** ICorePlatformDataProvider  
**Type:** Interface  
**Relative Path:** modules/analytics-reporting/api/v1/interfaces/core-platform-data.interface.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    - DependencyInversion
    
**Members:**
    
    
**Methods:**
    
    - **Name:** getAttributedOrderData  
**Parameters:**
    
    - merchantId: string
    - dateRange: { startDate: Date, endDate: Date }
    - campaignAttribution?: any
    
**Return Type:** Promise<any[]>  
**Attributes:**   
    
**Implemented Features:**
    
    - Core Platform Order Data Access Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-007
    
**Purpose:** Defines a contract for fetching attributed order and sales data from the `[PlatformName]` core e-commerce platform, necessary for ROAS/CPA calculations.  
**Logic Description:** Methods for retrieving order data linked to advertising campaigns within a specified date range for a merchant.  
**Documentation:**
    
    - **Summary:** Interface defining the contract for components responsible for fetching order and sales data from the core e-commerce platform.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Interfaces  
**Metadata:**
    
    - **Category:** Interface
    
- **Path:** src/modules/analytics-reporting/api/v1/services/performance-metric-calculator.v1.service.ts  
**Description:** Service responsible for calculating derived performance metrics like ROAS and CPA.  
**Template:** NestJS Service Template  
**Dependancy Level:** 2  
**Name:** PerformanceMetricCalculatorV1Service  
**Type:** Service  
**Relative Path:** modules/analytics-reporting/api/v1/services/performance-metric-calculator.v1.service.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    - SingleResponsibilityPrinciple
    
**Members:**
    
    - **Name:** corePlatformDataProvider  
**Type:** ICorePlatformDataProvider  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** calculateRoas  
**Parameters:**
    
    - spend: number
    - revenue: number
    
**Return Type:** number  
**Attributes:** public  
    - **Name:** calculateCpa  
**Parameters:**
    
    - spend: number
    - conversions: number
    
**Return Type:** number  
**Attributes:** public  
    - **Name:** enrichPerformanceDataWithDerivedMetrics  
**Parameters:**
    
    - performanceData: CampaignPerformanceDto[] | AdSetPerformanceDto[]
    - merchantId: string
    
**Return Type:** Promise<any[]>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - ROAS Calculation
    - CPA Calculation
    
**Requirement Ids:**
    
    - REQ-CMO-007
    - REQ-ARP-001
    - REQ-CPSI-007
    
**Purpose:** Calculates key derived metrics like ROAS and CPA by combining ad spend data with sales/order data fetched from the core platform (REQ-CPSI-007).  
**Logic Description:** Injects ICorePlatformDataProvider. Fetches relevant order data based on campaign context/attribution. Calculates ROAS (Revenue / Spend) and CPA (Spend / Conversions). Provides methods to enrich raw performance data with these calculated metrics.  
**Documentation:**
    
    - **Summary:** A service dedicated to calculating derived advertising performance metrics such as ROAS and CPA, utilizing sales data from the core platform.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Services  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/analytics-reporting/api/v1/services/analytics-reporting.v1.service.ts  
**Description:** Core service for analytics and reporting functionalities.  
**Template:** NestJS Service Template  
**Dependancy Level:** 3  
**Name:** AnalyticsReportingV1Service  
**Type:** Service  
**Relative Path:** modules/analytics-reporting/api/v1/services/analytics-reporting.v1.service.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    - FacadePattern
    - CQRS (conceptually for reads)
    
**Members:**
    
    - **Name:** dataProvider  
**Type:** IAnalyticsDataProvider  
**Attributes:** private readonly  
    - **Name:** metricCalculator  
**Type:** PerformanceMetricCalculatorV1Service  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** getPerformanceReport  
**Parameters:**
    
    - merchantId: string
    - query: PerformanceReportQueryDto
    
**Return Type:** Promise<CampaignPerformanceDto[] | AggregatedPerformanceDto>  
**Attributes:** public async  
    - **Name:** getABTestReport  
**Parameters:**
    
    - merchantId: string
    - query: ABTestReportQueryDto
    
**Return Type:** Promise<ABTestResultDto>  
**Attributes:** public async  
    - **Name:** getCustomDashboardData  
**Parameters:**
    
    - merchantId: string
    - dashboardId: string
    
**Return Type:** Promise<any>  
**Attributes:** public async  
    - **Name:** saveCustomDashboardConfig  
**Parameters:**
    
    - merchantId: string
    - config: CustomDashboardConfigDto
    
**Return Type:** Promise<any>  
**Attributes:** public async  
    - **Name:** generateExportableReport  
**Parameters:**
    
    - merchantId: string
    - query: ReportExportQueryDto
    
**Return Type:** Promise<Buffer | string>  
**Attributes:** public async  
    - **Name:** getActionableInsights  
**Parameters:**
    
    - merchantId: string
    - context?: any
    
**Return Type:** Promise<ActionableInsightDto[]>  
**Attributes:** public async  
    - **Name:** getDataIngestionStatus  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<DataIngestionStatusDto[]>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - Performance Reporting
    - A/B Test Reporting
    - Dashboard Data Provisioning
    - Report Exporting
    - Actionable Insights Generation
    
**Requirement Ids:**
    
    - REQ-CMO-007
    - REQ-ARP-001
    - REQ-ARP-002
    - REQ-ARP-003
    - REQ-ARP-004
    - REQ-ARP-008
    - REQ-ARP-005
    - REQ-ARP-007
    - REQ-CPSI-007
    - 3.1.1 (Reporting and Analytics - Advertising Specific)
    
**Purpose:** Orchestrates fetching, processing, and formatting data for all analytics reports, dashboards, and insights. Interacts with data providers and metric calculators.  
**Logic Description:** Injects IAnalyticsDataProvider and PerformanceMetricCalculatorV1Service. Implements methods to: fetch raw performance data; enrich with derived metrics (ROAS, CPA using REQ-CPSI-007); aggregate data (REQ-ARP-002); format A/B test results including significance (REQ-ARP-004); prepare data for custom dashboards (REQ-ARP-003); generate reports in CSV/PDF (REQ-ARP-003); derive and format actionable insights (REQ-ARP-008); and report data ingestion status (related to REQ-ARP-005). Data for REQ-ARP-007 (DynamoDB storage) is accessed via IAnalyticsDataProvider.  
**Documentation:**
    
    - **Summary:** The primary service for the Analytics Reporting API, handling business logic for generating various reports, dashboard data, and insights.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Services  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/analytics-reporting/api/v1/controllers/performance.v1.controller.ts  
**Description:** Controller for campaign and aggregated performance reports.  
**Template:** NestJS Controller Template  
**Dependancy Level:** 5  
**Name:** PerformanceV1Controller  
**Type:** Controller  
**Relative Path:** modules/analytics-reporting/api/v1/controllers/performance.v1.controller.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** analyticsService  
**Type:** AnalyticsReportingV1Service  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** getCampaignPerformance  
**Parameters:**
    
    - @Query() query: PerformanceReportQueryDto
    - @Headers('x-merchant-id') merchantId: string
    
**Return Type:** Promise<CampaignPerformanceDto[]>  
**Attributes:** @Get('campaigns')|@UseGuards(JwtAuthGuard)|@ApiOkResponse({ type: [CampaignPerformanceDto] })  
    - **Name:** getAggregatedPerformance  
**Parameters:**
    
    - @Query() query: PerformanceReportQueryDto
    - @Headers('x-merchant-id') merchantId: string
    
**Return Type:** Promise<AggregatedPerformanceDto>  
**Attributes:** @Get('aggregated')|@UseGuards(JwtAuthGuard)|@ApiOkResponse({ type: AggregatedPerformanceDto })  
    - **Name:** getDataIngestionStatus  
**Parameters:**
    
    - @Headers('x-merchant-id') merchantId: string
    
**Return Type:** Promise<DataIngestionStatusDto[]>  
**Attributes:** @Get('ingestion-status')|@UseGuards(JwtAuthGuard)|@ApiOkResponse({ type: [DataIngestionStatusDto] })  
    
**Implemented Features:**
    
    - Campaign Performance Endpoint
    - Aggregated Performance Endpoint
    - Data Ingestion Status Endpoint
    
**Requirement Ids:**
    
    - REQ-CMO-007
    - REQ-ARP-001
    - REQ-ARP-002
    - REQ-ARP-005
    - 3.1.1 (Reporting and Analytics - Advertising Specific)
    
**Purpose:** Exposes API endpoints for merchants to retrieve detailed campaign performance reports and aggregated cross-network performance data. Also provides data ingestion status.  
**Logic Description:** Injects AnalyticsReportingV1Service. Defines GET routes for /performance/campaigns (REQ-ARP-001, REQ-CMO-007) and /performance/aggregated (REQ-ARP-002). Uses PerformanceReportQueryDto for query parameters. Calls service methods to fetch and return data. Includes an endpoint for data ingestion status (REQ-ARP-005).  
**Documentation:**
    
    - **Summary:** Handles HTTP requests related to advertising performance reports, including campaign-level details and aggregated summaries.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/analytics-reporting/api/v1/controllers/abtest.v1.controller.ts  
**Description:** Controller for A/B test result reports.  
**Template:** NestJS Controller Template  
**Dependancy Level:** 5  
**Name:** ABTestV1Controller  
**Type:** Controller  
**Relative Path:** modules/analytics-reporting/api/v1/controllers/abtest.v1.controller.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** analyticsService  
**Type:** AnalyticsReportingV1Service  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** getABTestResults  
**Parameters:**
    
    - @Query() query: ABTestReportQueryDto
    - @Headers('x-merchant-id') merchantId: string
    
**Return Type:** Promise<ABTestResultDto>  
**Attributes:** @Get()|@UseGuards(JwtAuthGuard)|@ApiOkResponse({ type: ABTestResultDto })  
    
**Implemented Features:**
    
    - A/B Test Results Endpoint
    
**Requirement Ids:**
    
    - REQ-ARP-004
    
**Purpose:** Exposes API endpoints for merchants to retrieve A/B test result analysis.  
**Logic Description:** Injects AnalyticsReportingV1Service. Defines a GET route for /abtests. Uses ABTestReportQueryDto for query parameters. Calls service method to fetch and return A/B test results.  
**Documentation:**
    
    - **Summary:** Handles HTTP requests related to A/B test performance reports.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/analytics-reporting/api/v1/controllers/dashboard.v1.controller.ts  
**Description:** Controller for managing customizable dashboards.  
**Template:** NestJS Controller Template  
**Dependancy Level:** 5  
**Name:** DashboardV1Controller  
**Type:** Controller  
**Relative Path:** modules/analytics-reporting/api/v1/controllers/dashboard.v1.controller.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** analyticsService  
**Type:** AnalyticsReportingV1Service  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** getDashboardConfig  
**Parameters:**
    
    - @Param('dashboardId') dashboardId: string
    - @Headers('x-merchant-id') merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:** @Get(':dashboardId')|@UseGuards(JwtAuthGuard)|@ApiOkResponse()  
    - **Name:** saveDashboardConfig  
**Parameters:**
    
    - @Body() configDto: CustomDashboardConfigDto
    - @Headers('x-merchant-id') merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:** @Post()|@UseGuards(JwtAuthGuard)|@ApiCreatedResponse()  
    - **Name:** updateDashboardConfig  
**Parameters:**
    
    - @Param('dashboardId') dashboardId: string
    - @Body() configDto: CustomDashboardConfigDto
    - @Headers('x-merchant-id') merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:** @Put(':dashboardId')|@UseGuards(JwtAuthGuard)|@ApiOkResponse()  
    - **Name:** getDashboardData  
**Parameters:**
    
    - @Param('dashboardId') dashboardId: string
    - @Headers('x-merchant-id') merchantId: string
    
**Return Type:** Promise<any>  
**Attributes:** @Get(':dashboardId/data')|@UseGuards(JwtAuthGuard)|@ApiOkResponse()  
    
**Implemented Features:**
    
    - Custom Dashboard Management Endpoints
    - Dashboard Data Endpoint
    
**Requirement Ids:**
    
    - REQ-ARP-003
    
**Purpose:** Exposes API endpoints for merchants to create, retrieve, update, and get data for their customizable dashboards.  
**Logic Description:** Injects AnalyticsReportingV1Service. Defines CRUD-like routes for /dashboards (GET by ID, POST, PUT). Uses CustomDashboardConfigDto for request body. Defines route for fetching data for a specific dashboard configuration.  
**Documentation:**
    
    - **Summary:** Handles HTTP requests for managing and displaying data on customizable merchant dashboards.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/analytics-reporting/api/v1/controllers/report-export.v1.controller.ts  
**Description:** Controller for generating and exporting reports.  
**Template:** NestJS Controller Template  
**Dependancy Level:** 5  
**Name:** ReportExportV1Controller  
**Type:** Controller  
**Relative Path:** modules/analytics-reporting/api/v1/controllers/report-export.v1.controller.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** analyticsService  
**Type:** AnalyticsReportingV1Service  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** exportReport  
**Parameters:**
    
    - @Query() query: ReportExportQueryDto
    - @Res() res: Response
    - @Headers('x-merchant-id') merchantId: string
    
**Return Type:** Promise<void>  
**Attributes:** @Get()|@UseGuards(JwtAuthGuard)|@Header('Content-Type', 'application/octet-stream')  
    
**Implemented Features:**
    
    - Report Export Endpoint
    
**Requirement Ids:**
    
    - REQ-ARP-003
    
**Purpose:** Exposes API endpoints for merchants to generate and download reports in various formats (CSV, PDF).  
**Logic Description:** Injects AnalyticsReportingV1Service. Defines a GET route for /report-exports. Uses ReportExportQueryDto for query parameters. Calls service method to generate report data and streams it back to the client with appropriate content type headers for download.  
**Documentation:**
    
    - **Summary:** Handles HTTP requests for generating and exporting advertising reports in different file formats.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/analytics-reporting/api/v1/controllers/insights.v1.controller.ts  
**Description:** Controller for retrieving actionable insights.  
**Template:** NestJS Controller Template  
**Dependancy Level:** 5  
**Name:** InsightsV1Controller  
**Type:** Controller  
**Relative Path:** modules/analytics-reporting/api/v1/controllers/insights.v1.controller.ts  
**Repository Id:** REPO-ANALYTICS-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** analyticsService  
**Type:** AnalyticsReportingV1Service  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** getActionableInsights  
**Parameters:**
    
    - @Query('context') context: string
    - @Headers('x-merchant-id') merchantId: string
    
**Return Type:** Promise<ActionableInsightDto[]>  
**Attributes:** @Get()|@UseGuards(JwtAuthGuard)|@ApiOkResponse({ type: [ActionableInsightDto] })  
    
**Implemented Features:**
    
    - Actionable Insights Endpoint
    
**Requirement Ids:**
    
    - REQ-ARP-008
    
**Purpose:** Exposes API endpoints for merchants to retrieve actionable insights based on their advertising performance data.  
**Logic Description:** Injects AnalyticsReportingV1Service. Defines a GET route for /insights. May take context parameters. Calls service method to derive and return insights.  
**Documentation:**
    
    - **Summary:** Handles HTTP requests for fetching actionable insights and recommendations based on analytics data.
    
**Namespace:** AdManager.AnalyticsReporting.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableReportScheduling
  - enableAdvancedInsightGeneration
  
- **Database Configs:**
  
  - DYNAMODB_ANALYTICS_TABLE_NAME
  - DYNAMODB_ABTEST_RESULTS_TABLE_NAME
  - CORE_PLATFORM_API_URL
  - CORE_PLATFORM_API_KEY
  


---

