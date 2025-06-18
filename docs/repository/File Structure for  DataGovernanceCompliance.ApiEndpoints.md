# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project dependencies, scripts, and metadata for the DataGovernanceCompliance API endpoints.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../package.json  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Project setup
    - Dependency management
    
**Requirement Ids:**
    
    
**Purpose:** Manages Node.js package dependencies and project scripts.  
**Logic Description:** Contains dependencies like @nestjs/core, @nestjs/common, class-validator, class-transformer, @nestjs/swagger, @nestjs/passport, passport-jwt. Scripts for build, start, lint, test.  
**Documentation:**
    
    - **Summary:** Standard package.json file for a NestJS application.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** tsconfig.json  
**Description:** TypeScript compiler options for the project.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ../tsconfig.json  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript compilation configuration
    
**Requirement Ids:**
    
    
**Purpose:** Configures the TypeScript compiler.  
**Logic Description:** Specifies compiler options like target, module, strict mode, experimentalDecorators, emitDecoratorMetadata, paths for aliases.  
**Documentation:**
    
    - **Summary:** Main TypeScript configuration file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** src/main.ts  
**Description:** Application entry point. Initializes and bootstraps the NestJS application for Data Governance & Compliance API.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 2  
**Name:** main  
**Type:** ApplicationEntry  
**Relative Path:** main.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** bootstrap  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** async  
    
**Implemented Features:**
    
    - Application Bootstrap
    - Swagger UI Setup
    - Global Pipes Setup
    
**Requirement Ids:**
    
    
**Purpose:** Initializes the NestJS application, sets up global configurations like validation pipes, and starts the HTTP server.  
**Logic Description:** Creates a NestJS application instance using AppModule. Enables global validation pipes (ValidationPipe). Sets up Swagger documentation using DocumentBuilder and SwaggerModule. Listens on a configured port.  
**Documentation:**
    
    - **Summary:** Bootstraps the Data Governance Compliance API.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/app.module.ts  
**Description:** Root module of the NestJS application. Imports feature modules like DataGovernanceApiModule and configuration modules.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 1  
**Name:** AppModule  
**Type:** Module  
**Relative Path:** app.module.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module aggregation
    
**Requirement Ids:**
    
    
**Purpose:** Root module that orchestrates other application modules.  
**Logic Description:** Imports ConfigModule for application-wide configuration and DataGovernanceApiModule for data governance endpoints. May include global providers or interceptors if needed.  
**Documentation:**
    
    - **Summary:** The main application module.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/config/app.config.ts  
**Description:** Defines the structure and registers application-specific configuration settings, such as port, environment, and API version.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** appConfig  
**Type:** Configuration  
**Relative Path:** config/app.config.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Configuration definition
    
**Requirement Ids:**
    
    
**Purpose:** Provides strongly-typed configuration for application settings.  
**Logic Description:** Uses NestJS's `registerAs` function to define a configuration namespace (e.g., 'app'). Loads values from environment variables (process.env). Includes settings for port, environment, JWT secret (though this should be in a more secure store in production), API prefix.  
**Documentation:**
    
    - **Summary:** Application specific configuration registration.
    
**Namespace:** AppConfig  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/config/config.module.ts  
**Description:** NestJS module for loading and providing application configurations.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 1  
**Name:** ConfigModule  
**Type:** Module  
**Relative Path:** config/config.module.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Configuration loading
    
**Requirement Ids:**
    
    
**Purpose:** Centralizes configuration management for the application.  
**Logic Description:** Uses `@nestjs/config` to load configurations from .env files and environment variables. Registers configurations defined in files like app.config.ts. Exports ConfigService for use in other modules.  
**Documentation:**
    
    - **Summary:** Module for managing application configuration.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/data-governance/api/v1/interfaces/data-governance-compliance.service.interface.ts  
**Description:** Defines the contract for the DataGovernanceComplianceService, outlining methods for DSR, consent, retention, and compliance reporting.  
**Template:** TypeScript Interface Template  
**Dependancy Level:** 0  
**Name:** IDataGovernanceComplianceService  
**Type:** Interface  
**Relative Path:** modules/data-governance/api/v1/interfaces/data-governance-compliance.service.interface.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    - DependencyInversionPrinciple
    
**Members:**
    
    
**Methods:**
    
    - **Name:** manageMerchantConsent  
**Parameters:**
    
    - merchantId: string
    - consentData: ManageConsentDto
    
**Return Type:** Promise<ConsentRecordDto>  
**Attributes:**   
    - **Name:** getMerchantConsentRecords  
**Parameters:**
    
    - merchantId: string
    - query: ConsentReportQueryDto
    
**Return Type:** Promise<PagedResponseDto<ConsentRecordDto>>  
**Attributes:**   
    - **Name:** handleDsrRequest  
**Parameters:**
    
    - userId: string
    - requestData: SubmitDsrDto
    
**Return Type:** Promise<DsrRequestDto>  
**Attributes:**   
    - **Name:** getDsrRequestStatus  
**Parameters:**
    
    - requestId: string
    
**Return Type:** Promise<DsrRequestDto>  
**Attributes:**   
    - **Name:** fulfillDsrRequestAction  
**Parameters:**
    
    - adminUserId: string
    - actionData: DsrActionDto
    
**Return Type:** Promise<DsrRequestDto>  
**Attributes:**   
    - **Name:** exportDsrData  
**Parameters:**
    
    - requestId: string
    
**Return Type:** Promise<DsrDataExportDto>  
**Attributes:**   
    - **Name:** configureRetentionPolicy  
**Parameters:**
    
    - adminUserId: string
    - policyData: ConfigureRetentionPolicyDto
    
**Return Type:** Promise<RetentionPolicyDto>  
**Attributes:**   
    - **Name:** getRetentionPolicy  
**Parameters:**
    
    - policyType: string
    
**Return Type:** Promise<RetentionPolicyDto>  
**Attributes:**   
    - **Name:** getDpaStatusForMerchant  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<DpaDto>  
**Attributes:**   
    - **Name:** acknowledgeDpaForMerchant  
**Parameters:**
    
    - merchantId: string
    - userId: string
    
**Return Type:** Promise<DpaDto>  
**Attributes:**   
    - **Name:** generateDataProcessingActivityLog  
**Parameters:**
    
    - merchantId: string
    - query: ProcessingActivityLogQueryDto
    
**Return Type:** Promise<ProcessingActivityLogDto>  
**Attributes:**   
    - **Name:** getAuditTrailEntries  
**Parameters:**
    
    - query: AuditTrailQueryDto
    
**Return Type:** Promise<PagedResponseDto<AuditTrailEntryDto>>  
**Attributes:**   
    - **Name:** generatePlatformComplianceReport  
**Parameters:**
    
    - adminUserId: string
    - reportType: string
    - query: any
    
**Return Type:** Promise<any>  
**Attributes:**   
    - **Name:** getDefaultPrivacySettings  
**Parameters:**
    
    - feature: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    
**Implemented Features:**
    
    - Service contract definition
    
**Requirement Ids:**
    
    - REQ-MDGC-001
    - REQ-MDGC-003
    - REQ-MDGC-004
    - REQ-MDGC-005
    - REQ-MDGC-007
    - REQ-MDGC-008
    - REQ-POA-013
    
**Purpose:** Specifies the interface for business logic related to data governance and compliance. This API layer's controllers will depend on this abstraction.  
**Logic Description:** This interface lists all methods that the DataGovernanceComplianceService (likely in another repository/layer) must implement to serve the API endpoints.  
**Documentation:**
    
    - **Summary:** Contract for data governance and compliance functionalities.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Interfaces  
**Metadata:**
    
    - **Category:** ApplicationServices
    
- **Path:** src/modules/data-governance/api/v1/data-governance-api.module.ts  
**Description:** NestJS module for the Data Governance & Compliance API version 1. Imports controllers and providers (service interface implementations).  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 1  
**Name:** DataGovernanceApiModule  
**Type:** Module  
**Relative Path:** modules/data-governance/api/v1/data-governance-api.module.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - API module definition
    
**Requirement Ids:**
    
    - REQ-MDGC-001
    - REQ-MDGC-003
    - REQ-MDGC-004
    - REQ-MDGC-005
    - REQ-MDGC-007
    - REQ-MDGC-008
    - REQ-POA-013
    
**Purpose:** Encapsulates all V1 API controllers and related providers for data governance and compliance.  
**Logic Description:** Imports necessary modules (e.g., PassportModule for auth). Declares controllers (ConsentController, DsrController, etc.). Provides the IDataGovernanceComplianceService token with its actual implementation class (which would be imported from the application services layer/repository).  
**Documentation:**
    
    - **Summary:** Module for V1 Data Governance API endpoints.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1  
**Metadata:**
    
    - **Category:** API
    
- **Path:** src/modules/data-governance/api/v1/dtos/common/paged-response.dto.ts  
**Description:** Generic DTO for paginated API responses.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** PagedResponseDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/common/paged-response.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** data  
**Type:** T[]  
**Attributes:** public|readonly  
    - **Name:** totalCount  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** page  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** pageSize  
**Type:** number  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Paginated response structure
    
**Requirement Ids:**
    
    - REQ-MDGC-003
    - REQ-MDGC-008
    
**Purpose:** Defines a standard structure for responses that return a list of items with pagination details.  
**Logic Description:** Uses generics (T) to allow reuse for different data types. Includes properties for data array, total count, current page, and page size. Uses ApiProperty decorators for Swagger documentation.  
**Documentation:**
    
    - **Summary:** A generic DTO for paginated list responses.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Common  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/dtos/common/id-param.dto.ts  
**Description:** DTO for validating ID path parameters.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** IdParamDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/common/id-param.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - ID parameter validation
    
**Requirement Ids:**
    
    - REQ-MDGC-004
    
**Purpose:** Validates that an ID provided as a path parameter is a valid string (e.g., UUID).  
**Logic Description:** Uses `class-validator` decorators like `@IsUUID()` or `@IsString()` and `@IsNotEmpty()` for the `id` field. Uses `@ApiProperty()` for Swagger.  
**Documentation:**
    
    - **Summary:** DTO for validating resource identifiers in path parameters.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Common  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/controllers/consent.controller.ts  
**Description:** API controller for managing end-user consent related to advertising activities.  
**Template:** NestJS TypeScript Controller Template  
**Dependancy Level:** 2  
**Name:** ConsentController  
**Type:** Controller  
**Relative Path:** modules/data-governance/api/v1/controllers/consent.controller.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    - MVC Controller
    
**Members:**
    
    - **Name:** dataGovernanceService  
**Type:** IDataGovernanceComplianceService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** manageConsentPreferences  
**Parameters:**
    
    - merchantId: string
    - consentData: ManageConsentDto
    - user: AuthenticatedUser
    
**Return Type:** Promise<ConsentRecordDto>  
**Attributes:** public  
    - **Name:** getConsentRecords  
**Parameters:**
    
    - merchantId: string
    - query: ConsentReportQueryDto
    - user: AuthenticatedUser
    
**Return Type:** Promise<PagedResponseDto<ConsentRecordDto>>  
**Attributes:** public  
    - **Name:** getDefaultConsentSettings  
**Parameters:**
    
    - feature: string
    
**Return Type:** Promise<any>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Consent Management API Endpoints
    
**Requirement Ids:**
    
    - REQ-MDGC-001
    - REQ-MDGC-003
    
**Purpose:** Exposes endpoints for merchants to manage consent collection, record consent choices, and generate consent reports.  
**Logic Description:** Uses `@Controller('consent')` decorator. Endpoints are protected by `@UseGuards(JwtAuthGuard, RolesGuard)`. Methods are decorated with `@Post()`, `@Get()`, etc., and `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()` for Swagger. Injects `IDataGovernanceComplianceService` and delegates business logic. Validates DTOs using pipes.  
**Documentation:**
    
    - **Summary:** Handles HTTP requests for consent management operations.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** API
    
- **Path:** src/modules/data-governance/api/v1/dtos/consent/manage-consent.dto.ts  
**Description:** DTO for managing (creating/updating) consent preferences.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** ManageConsentDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/consent/manage-consent.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** userId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** consentType  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** isGiven  
**Type:** boolean  
**Attributes:** public|readonly  
    - **Name:** source  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Consent data structure
    
**Requirement Ids:**
    
    - REQ-MDGC-003
    
**Purpose:** Defines the payload for requests to set or update user consent.  
**Logic Description:** Includes fields for user identifier, type of consent (e.g., 'advertising_cookies', 'data_sharing_third_party'), consent status (given/withdrawn), and source of consent. Uses `class-validator` decorators for validation (e.g., `@IsString()`, `@IsBoolean()`, `@IsNotEmpty()`) and `@ApiProperty()` for Swagger.  
**Documentation:**
    
    - **Summary:** Request DTO for managing user consent.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Consent  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/dtos/consent/consent-record.dto.ts  
**Description:** DTO representing a stored consent record.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** ConsentRecordDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/consent/consent-record.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** userId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** consentType  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** isGiven  
**Type:** boolean  
**Attributes:** public|readonly  
    - **Name:** timestamp  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** source  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Consent record data structure
    
**Requirement Ids:**
    
    - REQ-MDGC-003
    
**Purpose:** Defines the structure of a consent record as returned by the API.  
**Logic Description:** Includes fields for record ID, user ID, consent type, status, timestamp of consent action, and source. Uses `@ApiProperty()` for Swagger documentation.  
**Documentation:**
    
    - **Summary:** Response DTO for a consent record.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Consent  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/dtos/consent/consent-report-query.dto.ts  
**Description:** DTO for querying consent records for reporting.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** ConsentReportQueryDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/consent/consent-report-query.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** userId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** consentType  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** dateFrom  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** dateTo  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** page  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** pageSize  
**Type:** number  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Consent report query parameters
    
**Requirement Ids:**
    
    - REQ-MDGC-003
    
**Purpose:** Defines query parameters for filtering and paginating consent records when generating reports.  
**Logic Description:** Includes optional fields for filtering by user ID, consent type, date range. Includes pagination parameters (page, pageSize). Uses `class-validator` (e.g., `@IsOptional()`, `@IsDateString()`, `@IsInt()`, `@Min()`) and `@ApiPropertyOptional()`.  
**Documentation:**
    
    - **Summary:** Query DTO for fetching consent records.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Consent  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/controllers/dsr.controller.ts  
**Description:** API controller for managing Data Subject Rights (DSR) requests.  
**Template:** NestJS TypeScript Controller Template  
**Dependancy Level:** 2  
**Name:** DsrController  
**Type:** Controller  
**Relative Path:** modules/data-governance/api/v1/controllers/dsr.controller.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    - MVC Controller
    
**Members:**
    
    - **Name:** dataGovernanceService  
**Type:** IDataGovernanceComplianceService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** submitDsrRequest  
**Parameters:**
    
    - requestData: SubmitDsrDto
    - user: AuthenticatedUser
    
**Return Type:** Promise<DsrRequestDto>  
**Attributes:** public  
    - **Name:** getDsrRequestStatus  
**Parameters:**
    
    - requestId: string
    - user: AuthenticatedUser
    
**Return Type:** Promise<DsrRequestDto>  
**Attributes:** public  
    - **Name:** exportDsrData  
**Parameters:**
    
    - requestId: string
    - user: AuthenticatedUser
    
**Return Type:** Promise<DsrDataExportDto>  
**Attributes:** public  
    - **Name:** fulfillDsrRequestAction  
**Parameters:**
    
    - actionData: DsrActionDto
    - adminUser: AuthenticatedUser
    
**Return Type:** Promise<DsrRequestDto>  
**Attributes:** public  
    
**Implemented Features:**
    
    - DSR Management API Endpoints
    
**Requirement Ids:**
    
    - REQ-MDGC-004
    
**Purpose:** Exposes endpoints for users/merchants to submit DSR requests (access, rectification, erasure, etc.) and for administrators to manage these requests.  
**Logic Description:** Uses `@Controller('dsr')`. Endpoints protected by `@UseGuards(JwtAuthGuard, RolesGuard)`. Methods for submitting, checking status, exporting data, and admin fulfillment actions. Injects `IDataGovernanceComplianceService`. Uses DTOs and validation.  
**Documentation:**
    
    - **Summary:** Handles HTTP requests for Data Subject Rights operations.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** API
    
- **Path:** src/modules/data-governance/api/v1/dtos/dsr/submit-dsr.dto.ts  
**Description:** DTO for submitting a new Data Subject Rights request.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** SubmitDsrDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/dsr/submit-dsr.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** requestType  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** requesterEmail  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** details  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** targetMerchantId  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - DSR submission data structure
    
**Requirement Ids:**
    
    - REQ-MDGC-004
    
**Purpose:** Defines the payload for creating a DSR request.  
**Logic Description:** Includes fields for request type (access, rectification, erasure, portability, restriction, objection), requester identification (e.g., email), additional details, and target merchant (if applicable). Uses `class-validator` (e.g., `@IsIn(['access', ...])`, `@IsEmail()`, `@IsOptional()`) and `@ApiProperty()`.  
**Documentation:**
    
    - **Summary:** Request DTO for submitting a DSR request.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Dsr  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/dtos/dsr/dsr-request.dto.ts  
**Description:** DTO representing a Data Subject Rights request and its status.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** DsrRequestDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/dsr/dsr-request.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** requestType  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** status  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** submittedAt  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** completedAt  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** details  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - DSR request status data structure
    
**Requirement Ids:**
    
    - REQ-MDGC-004
    
**Purpose:** Defines the structure of a DSR request as returned by the API, including its current status.  
**Logic Description:** Includes ID, type, status (e.g., pending, in_progress, completed, denied), submission/completion timestamps, and details. Uses `@ApiProperty()`.  
**Documentation:**
    
    - **Summary:** Response DTO for a DSR request.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Dsr  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/dtos/dsr/dsr-data-export.dto.ts  
**Description:** DTO for exporting data in response to a DSR access/portability request.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** DsrDataExportDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/dsr/dsr-data-export.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** requestId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** format  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** data  
**Type:** any  
**Attributes:** public|readonly  
    - **Name:** downloadUrl  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - DSR data export structure
    
**Requirement Ids:**
    
    - REQ-MDGC-004
    
**Purpose:** Defines the structure for data exported in response to a DSR access or portability request.  
**Logic Description:** Includes request ID, data format (e.g., JSON, CSV), the exported data itself, or a secure download link. Uses `@ApiProperty()`.  
**Documentation:**
    
    - **Summary:** Response DTO for DSR data export.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Dsr  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/dtos/dsr/dsr-action.dto.ts  
**Description:** DTO for administrative actions on a DSR request (e.g., approve, deny, mark complete).  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** DsrActionDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/dsr/dsr-action.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** requestId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** action  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** notes  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - DSR administrative action structure
    
**Requirement Ids:**
    
    - REQ-MDGC-004
    
**Purpose:** Defines the payload for administrators to update the status or take action on a DSR request.  
**Logic Description:** Includes DSR request ID, action to perform (e.g., 'fulfill_access', 'confirm_erasure', 'deny'), and administrative notes. Uses `class-validator` and `@ApiProperty()`.  
**Documentation:**
    
    - **Summary:** Request DTO for administrative actions on DSR requests.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Dsr  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/controllers/data-retention.controller.ts  
**Description:** API controller for managing data retention policies and related actions.  
**Template:** NestJS TypeScript Controller Template  
**Dependancy Level:** 2  
**Name:** DataRetentionController  
**Type:** Controller  
**Relative Path:** modules/data-governance/api/v1/controllers/data-retention.controller.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    - MVC Controller
    
**Members:**
    
    - **Name:** dataGovernanceService  
**Type:** IDataGovernanceComplianceService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** configureRetentionPolicy  
**Parameters:**
    
    - policyData: ConfigureRetentionPolicyDto
    - adminUser: AuthenticatedUser
    
**Return Type:** Promise<RetentionPolicyDto>  
**Attributes:** public  
    - **Name:** getRetentionPolicy  
**Parameters:**
    
    - policyType: string
    
**Return Type:** Promise<RetentionPolicyDto>  
**Attributes:** public  
    - **Name:** triggerDataLifecycleAction  
**Parameters:**
    
    - actionData: DataLifecycleActionDto
    - adminUser: AuthenticatedUser
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** getDefaultRetentionSettings  
**Parameters:**
    
    - dataType: string
    
**Return Type:** Promise<any>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Data Retention Policy API Endpoints
    
**Requirement Ids:**
    
    - REQ-MDGC-001
    - REQ-MDGC-005
    
**Purpose:** Exposes endpoints for configuring data retention policies, viewing them, and potentially triggering manual archival or purging actions.  
**Logic Description:** Uses `@Controller('data-retention')`. Admin-only endpoints protected by relevant guards. Injects `IDataGovernanceComplianceService`. Uses DTOs for request/response.  
**Documentation:**
    
    - **Summary:** Handles HTTP requests for data retention policy management.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** API
    
- **Path:** src/modules/data-governance/api/v1/dtos/data-retention/configure-retention-policy.dto.ts  
**Description:** DTO for configuring a data retention policy.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** ConfigureRetentionPolicyDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/data-retention/configure-retention-policy.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** dataType  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** retentionPeriodDays  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** actionAfterRetention  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Data retention policy configuration structure
    
**Requirement Ids:**
    
    - REQ-MDGC-005
    
**Purpose:** Defines the payload for creating or updating data retention policies.  
**Logic Description:** Includes fields for data type (e.g., 'audit_logs', 'pii_closed_accounts'), retention period in days, and action after retention (e.g., 'archive', 'anonymize', 'delete'). Uses `class-validator` and `@ApiProperty()`.  
**Documentation:**
    
    - **Summary:** Request DTO for configuring data retention policies.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.DataRetention  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/dtos/data-retention/retention-policy.dto.ts  
**Description:** DTO representing a configured data retention policy.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** RetentionPolicyDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/data-retention/retention-policy.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** dataType  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** retentionPeriodDays  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** actionAfterRetention  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** isDefault  
**Type:** boolean  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Data retention policy data structure
    
**Requirement Ids:**
    
    - REQ-MDGC-001
    - REQ-MDGC-005
    
**Purpose:** Defines the structure of a data retention policy as returned by the API.  
**Logic Description:** Includes policy ID, data type, period, action, and potentially a flag if it's a default policy. Uses `@ApiProperty()`.  
**Documentation:**
    
    - **Summary:** Response DTO for a data retention policy.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.DataRetention  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/dtos/data-retention/data-lifecycle-action.dto.ts  
**Description:** DTO for triggering manual data lifecycle actions like archival or purging.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** DataLifecycleActionDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/data-retention/data-lifecycle-action.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** dataType  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** action  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** criteria  
**Type:** Record<string, any>  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Manual data lifecycle action structure
    
**Requirement Ids:**
    
    - REQ-MDGC-005
    
**Purpose:** Defines the payload for administrators to manually trigger data archival or purging for specific data types based on criteria.  
**Logic Description:** Includes data type, action ('archive', 'purge'), and criteria for selecting data. Uses `class-validator` and `@ApiProperty()`.  
**Documentation:**
    
    - **Summary:** Request DTO for manual data lifecycle actions.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.DataRetention  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/controllers/compliance.controller.ts  
**Description:** API controller for merchant-facing compliance features like DPA management and audit trail access.  
**Template:** NestJS TypeScript Controller Template  
**Dependancy Level:** 2  
**Name:** ComplianceController  
**Type:** Controller  
**Relative Path:** modules/data-governance/api/v1/controllers/compliance.controller.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    - MVC Controller
    
**Members:**
    
    - **Name:** dataGovernanceService  
**Type:** IDataGovernanceComplianceService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** getDpaStatus  
**Parameters:**
    
    - merchantId: string
    - user: AuthenticatedUser
    
**Return Type:** Promise<DpaDto>  
**Attributes:** public  
    - **Name:** acknowledgeDpa  
**Parameters:**
    
    - merchantId: string
    - user: AuthenticatedUser
    
**Return Type:** Promise<DpaDto>  
**Attributes:** public  
    - **Name:** generateDataProcessingActivityLog  
**Parameters:**
    
    - merchantId: string
    - query: ProcessingActivityLogQueryDto
    - user: AuthenticatedUser
    
**Return Type:** Promise<ProcessingActivityLogDto>  
**Attributes:** public  
    - **Name:** getMerchantAuditTrail  
**Parameters:**
    
    - merchantId: string
    - query: AuditTrailQueryDto
    - user: AuthenticatedUser
    
**Return Type:** Promise<PagedResponseDto<AuditTrailEntryDto>>  
**Attributes:** public  
    
**Implemented Features:**
    
    - DPA Management API
    - Data Processing Logs API
    - Merchant Audit Trail API
    
**Requirement Ids:**
    
    - REQ-MDGC-007
    - REQ-MDGC-008
    
**Purpose:** Exposes endpoints for merchants to manage DPAs, generate data processing activity logs, and access their specific audit trails.  
**Logic Description:** Uses `@Controller('compliance')`. Endpoints protected by guards. Injects `IDataGovernanceComplianceService`. Uses DTOs for requests/responses.  
**Documentation:**
    
    - **Summary:** Handles HTTP requests for merchant compliance operations.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** API
    
- **Path:** src/modules/data-governance/api/v1/dtos/compliance/dpa.dto.ts  
**Description:** DTO representing Data Processing Agreement status and details.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** DpaDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/compliance/dpa.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** version  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** acknowledgedAt  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** dpaUrl  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - DPA data structure
    
**Requirement Ids:**
    
    - REQ-MDGC-007
    
**Purpose:** Defines the structure for DPA information returned by the API.  
**Logic Description:** Includes DPA version, acknowledgment timestamp, and a link to the DPA document. Uses `@ApiProperty()`.  
**Documentation:**
    
    - **Summary:** Response DTO for DPA status.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Compliance  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/dtos/compliance/processing-activity-log-query.dto.ts  
**Description:** DTO for querying data processing activity logs.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** ProcessingActivityLogQueryDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/compliance/processing-activity-log-query.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** dateFrom  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** dateTo  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** activityType  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Processing activity log query structure
    
**Requirement Ids:**
    
    - REQ-MDGC-007
    
**Purpose:** Defines query parameters for generating data processing activity logs for merchants.  
**Logic Description:** Includes date range and optional activity type filters. Uses `class-validator` and `@ApiPropertyOptional()`.  
**Documentation:**
    
    - **Summary:** Query DTO for data processing activity logs.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Compliance  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/dtos/compliance/processing-activity-log.dto.ts  
**Description:** DTO representing a data processing activity log.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** ProcessingActivityLogDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/compliance/processing-activity-log.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** logEntries  
**Type:** any[]  
**Attributes:** public|readonly  
    - **Name:** generatedAt  
**Type:** Date  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Processing activity log data structure
    
**Requirement Ids:**
    
    - REQ-MDGC-007
    
**Purpose:** Defines the structure of a data processing activity log report returned to merchants.  
**Logic Description:** Contains a list of log entries and generation timestamp. Uses `@ApiProperty()`.  
**Documentation:**
    
    - **Summary:** Response DTO for a data processing activity log.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Compliance  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/dtos/compliance/audit-trail-query.dto.ts  
**Description:** DTO for querying audit trail entries.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** AuditTrailQueryDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/compliance/audit-trail-query.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** userId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** actionType  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** dateFrom  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** dateTo  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** page  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** pageSize  
**Type:** number  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audit trail query parameters
    
**Requirement Ids:**
    
    - REQ-MDGC-008
    
**Purpose:** Defines query parameters for filtering and paginating audit trail entries.  
**Logic Description:** Includes optional filters for user ID, action type, date range. Includes pagination. Uses `class-validator` and `@ApiPropertyOptional()`.  
**Documentation:**
    
    - **Summary:** Query DTO for fetching audit trail entries.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Compliance  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/dtos/compliance/audit-trail-entry.dto.ts  
**Description:** DTO representing a single audit trail entry.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** AuditTrailEntryDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/compliance/audit-trail-entry.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** timestamp  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** userId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** action  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** details  
**Type:** Record<string, any>  
**Attributes:** public|readonly  
    - **Name:** ipAddress  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audit trail entry data structure
    
**Requirement Ids:**
    
    - REQ-MDGC-008
    
**Purpose:** Defines the structure of an audit trail entry as returned by the API.  
**Logic Description:** Includes ID, timestamp, acting user, action performed, contextual details, and source IP. Uses `@ApiProperty()`.  
**Documentation:**
    
    - **Summary:** Response DTO for an audit trail entry.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Compliance  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/controllers/admin/admin-compliance.controller.ts  
**Description:** API controller for platform administrator-specific compliance reporting.  
**Template:** NestJS TypeScript Controller Template  
**Dependancy Level:** 2  
**Name:** AdminComplianceController  
**Type:** Controller  
**Relative Path:** modules/data-governance/api/v1/controllers/admin/admin-compliance.controller.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    - MVC Controller
    
**Members:**
    
    - **Name:** dataGovernanceService  
**Type:** IDataGovernanceComplianceService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** generateUserAccessReport  
**Parameters:**
    
    - query: UserAccessReportQueryDto
    - adminUser: AuthenticatedUser
    
**Return Type:** Promise<UserAccessReportDto>  
**Attributes:** public  
    - **Name:** generateChangeManagementReport  
**Parameters:**
    
    - query: ChangeManagementReportQueryDto
    - adminUser: AuthenticatedUser
    
**Return Type:** Promise<ChangeManagementReportDto>  
**Attributes:** public  
    - **Name:** generateSecurityIncidentReport  
**Parameters:**
    
    - query: SecurityIncidentReportQueryDto
    - adminUser: AuthenticatedUser
    
**Return Type:** Promise<SecurityIncidentReportDto>  
**Attributes:** public  
    - **Name:** generateGdprCcpaDataExtract  
**Parameters:**
    
    - query: GdprCcpaExtractQueryDto
    - adminUser: AuthenticatedUser
    
**Return Type:** Promise<GdprCcpaExtractDto>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Platform Admin Compliance Reporting API
    
**Requirement Ids:**
    
    - REQ-POA-013
    - REQ-MDGC-008
    
**Purpose:** Exposes endpoints for platform administrators to generate compliance reports like user access, change management, security incidents, and GDPR/CCPA data extracts.  
**Logic Description:** Uses `@Controller('admin/compliance')`. Endpoints protected by `@UseGuards(JwtAuthGuard, PlatformAdminGuard)`. Injects `IDataGovernanceComplianceService`. Uses DTOs.  
**Documentation:**
    
    - **Summary:** Handles HTTP requests for platform admin compliance reporting.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Controllers.Admin  
**Metadata:**
    
    - **Category:** API
    
- **Path:** src/modules/data-governance/api/v1/dtos/admin/compliance/user-access-report-query.dto.ts  
**Description:** DTO for querying user access reports by platform administrators.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** UserAccessReportQueryDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/admin/compliance/user-access-report-query.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** merchantId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** userId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** dateFrom  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** dateTo  
**Type:** Date  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Admin user access report query
    
**Requirement Ids:**
    
    - REQ-POA-013
    
**Purpose:** Defines query parameters for generating user access reports.  
**Logic Description:** Includes filters for merchant, user, and date range. Uses `class-validator` and `@ApiPropertyOptional()`.  
**Documentation:**
    
    - **Summary:** Query DTO for platform admin user access reports.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Admin.Compliance  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/dtos/admin/compliance/user-access-report.dto.ts  
**Description:** DTO representing a user access report for platform administrators.  
**Template:** NestJS TypeScript DTO Template  
**Dependancy Level:** 1  
**Name:** UserAccessReportDto  
**Type:** DTO  
**Relative Path:** modules/data-governance/api/v1/dtos/admin/compliance/user-access-report.dto.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** reportEntries  
**Type:** any[]  
**Attributes:** public|readonly  
    - **Name:** generatedAt  
**Type:** Date  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Admin user access report structure
    
**Requirement Ids:**
    
    - REQ-POA-013
    
**Purpose:** Defines the structure of a user access report.  
**Logic Description:** Contains report entries and generation timestamp. Uses `@ApiProperty()`.  
**Documentation:**
    
    - **Summary:** Response DTO for platform admin user access report.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Dtos.Admin.Compliance  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/data-governance/api/v1/guards/jwt-auth.guard.ts  
**Description:** Custom JWT authentication guard for protecting API endpoints.  
**Template:** NestJS TypeScript Guard Template  
**Dependancy Level:** 1  
**Name:** JwtAuthGuard  
**Type:** Guard  
**Relative Path:** modules/data-governance/api/v1/guards/jwt-auth.guard.ts  
**Repository Id:** REPO-DATAGOV-012  
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
    
    
**Purpose:** Verifies the JWT sent in the Authorization header of requests.  
**Logic Description:** Extends `AuthGuard('jwt')` from `@nestjs/passport`. Relies on a configured JwtStrategy (likely in a shared auth module or core platform integration).  
**Documentation:**
    
    - **Summary:** Ensures requests are authenticated with a valid JWT.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Guards  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/data-governance/api/v1/guards/roles.guard.ts  
**Description:** Custom roles-based authorization guard.  
**Template:** NestJS TypeScript Guard Template  
**Dependancy Level:** 1  
**Name:** RolesGuard  
**Type:** Guard  
**Relative Path:** modules/data-governance/api/v1/guards/roles.guard.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** reflector  
**Type:** Reflector  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** canActivate  
**Parameters:**
    
    - context: ExecutionContext
    
**Return Type:** boolean  
**Attributes:** public  
    
**Implemented Features:**
    
    - Role-Based Access Control (RBAC)
    
**Requirement Ids:**
    
    
**Purpose:** Checks if the authenticated user has the required role(s) to access an endpoint.  
**Logic Description:** Uses NestJS `Reflector` to get roles metadata set by a `@Roles()` decorator on controllers/handlers. Compares user's roles (from JWT payload) with required roles.  
**Documentation:**
    
    - **Summary:** Enforces role-based access to API endpoints.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Guards  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/data-governance/api/v1/guards/platform-admin.guard.ts  
**Description:** Specific guard to protect endpoints accessible only by Platform Administrators.  
**Template:** NestJS TypeScript Guard Template  
**Dependancy Level:** 1  
**Name:** PlatformAdminGuard  
**Type:** Guard  
**Relative Path:** modules/data-governance/api/v1/guards/platform-admin.guard.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** canActivate  
**Parameters:**
    
    - context: ExecutionContext
    
**Return Type:** boolean  
**Attributes:** public  
    
**Implemented Features:**
    
    - Platform Admin Access Control
    
**Requirement Ids:**
    
    - REQ-POA-013
    
**Purpose:** Ensures that only users with the 'PlatformAdministrator' role can access certain administrative endpoints.  
**Logic Description:** Checks if the authenticated user (from JWT payload via request object) has the specific 'PlatformAdministrator' role. This guard would be used in conjunction with JwtAuthGuard.  
**Documentation:**
    
    - **Summary:** Restricts access to platform administrator-only endpoints.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Guards  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/data-governance/api/v1/decorators/roles.decorator.ts  
**Description:** Custom decorator to set roles metadata for RBAC.  
**Template:** NestJS TypeScript Decorator Template  
**Dependancy Level:** 0  
**Name:** Roles  
**Type:** Decorator  
**Relative Path:** modules/data-governance/api/v1/decorators/roles.decorator.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Roles metadata definition
    
**Requirement Ids:**
    
    
**Purpose:** Allows specifying required roles for accessing specific controllers or handlers.  
**Logic Description:** Uses NestJS `SetMetadata` function to attach an array of role strings to the target controller method or class. This metadata is then read by RolesGuard.  
**Documentation:**
    
    - **Summary:** Decorator to assign role metadata to routes.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Decorators  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** src/modules/data-governance/api/v1/decorators/user.decorator.ts  
**Description:** Custom decorator to extract authenticated user object from the request.  
**Template:** NestJS TypeScript Decorator Template  
**Dependancy Level:** 0  
**Name:** User  
**Type:** Decorator  
**Relative Path:** modules/data-governance/api/v1/decorators/user.decorator.ts  
**Repository Id:** REPO-DATAGOV-012  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - User object extraction
    
**Requirement Ids:**
    
    
**Purpose:** Provides a convenient way to access the authenticated user's information (e.g., from JWT payload) within route handlers.  
**Logic Description:** Uses NestJS `createParamDecorator` to extract the `user` property from the `request` object, which is typically populated by an authentication guard (like JwtAuthGuard).  
**Documentation:**
    
    - **Summary:** Decorator to easily access the authenticated user in route handlers.
    
**Namespace:** AdManager.DataGovernanceCompliance.Api.V1.Decorators  
**Metadata:**
    
    - **Category:** Utility
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableDpaWorkflow
  - enableAutomatedDataPurging
  - enableConsentReportingSelfService
  
- **Database Configs:**
  
  


---

