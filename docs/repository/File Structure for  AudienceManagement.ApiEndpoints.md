# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project metadata, dependencies (NestJS framework, class-validator, class-transformer, @nestjs/swagger, etc.), and scripts for running, building, and testing the AudienceManagement API application.  
**Template:** NestJS  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../package.json  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Project setup
    - Dependency management
    
**Requirement Ids:**
    
    
**Purpose:** Manages project dependencies and provides scripts for development and build processes.  
**Logic Description:** Standard package.json file listing NestJS core and module-specific dependencies. Scripts include start:dev, build, test, lint.  
**Documentation:**
    
    - **Summary:** Node.js project manifest file for the AudienceManagement API.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** tsconfig.json  
**Description:** TypeScript compiler options for the project, including target ECMAScript version, module system, paths, and strict type-checking rules.  
**Template:** NestJS  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ../tsconfig.json  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript compilation configuration
    
**Requirement Ids:**
    
    
**Purpose:** Configures the TypeScript compiler for the entire project.  
**Logic Description:** Standard tsconfig.json for a NestJS project, specifying compiler options like target, module, experimentalDecorators, emitDecoratorMetadata, sourceMap, outDir, baseUrl.  
**Documentation:**
    
    - **Summary:** TypeScript configuration file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** tsconfig.build.json  
**Description:** TypeScript compiler options specifically for building the project, typically excluding test files and development-only settings.  
**Template:** NestJS  
**Dependancy Level:** 0  
**Name:** tsconfig.build  
**Type:** Configuration  
**Relative Path:** ../tsconfig.build.json  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript build configuration
    
**Requirement Ids:**
    
    
**Purpose:** Specifies TypeScript compiler options for production builds, extending the base tsconfig.json.  
**Logic Description:** Extends tsconfig.json and typically excludes 'spec.ts' files and test-related configurations.  
**Documentation:**
    
    - **Summary:** TypeScript build-specific configuration file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** .eslintrc.js  
**Description:** ESLint configuration file for maintaining code quality and consistency, defining linting rules and plugins.  
**Template:** NestJS  
**Dependancy Level:** 0  
**Name:** .eslintrc  
**Type:** Configuration  
**Relative Path:** ../.eslintrc.js  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Code linting rules
    
**Requirement Ids:**
    
    
**Purpose:** Configures ESLint to enforce coding standards and identify potential issues.  
**Logic Description:** Standard ESLint configuration for NestJS projects, often extending recommended TypeScript and Prettier rules.  
**Documentation:**
    
    - **Summary:** ESLint linter configuration file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** .prettierrc  
**Description:** Prettier configuration file for automatic code formatting, ensuring a consistent code style across the project.  
**Template:** NestJS  
**Dependancy Level:** 0  
**Name:** .prettierrc  
**Type:** Configuration  
**Relative Path:** ../.prettierrc  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Code formatting rules
    
**Requirement Ids:**
    
    
**Purpose:** Defines code formatting rules for Prettier to ensure consistent style.  
**Logic Description:** Contains Prettier options like printWidth, tabWidth, singleQuote, trailingComma.  
**Documentation:**
    
    - **Summary:** Prettier code formatter configuration file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** nest-cli.json  
**Description:** NestJS CLI configuration file, specifying project structure, compiler options, and code generation settings.  
**Template:** NestJS  
**Dependancy Level:** 0  
**Name:** nest-cli  
**Type:** Configuration  
**Relative Path:** ../nest-cli.json  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - NestJS CLI project settings
    
**Requirement Ids:**
    
    
**Purpose:** Configures the NestJS CLI, including source root and monorepo settings if applicable.  
**Logic Description:** Specifies 'collection', 'sourceRoot', and other NestJS CLI workspace configurations.  
**Documentation:**
    
    - **Summary:** NestJS Command Line Interface configuration file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** src/main.ts  
**Description:** The main entry point for the AudienceManagement API application. Initializes the NestJS application instance, configures global middleware, pipes (e.g., ValidationPipe), exception filters, and starts the HTTP listener. Also sets up Swagger documentation.  
**Template:** NestJS  
**Dependancy Level:** 6  
**Name:** main  
**Type:** Bootstrap  
**Relative Path:** main.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** bootstrap  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** async  
    
**Implemented Features:**
    
    - Application bootstrap
    - Global middleware setup
    - Swagger UI setup
    
**Requirement Ids:**
    
    
**Purpose:** Initializes and starts the NestJS application for audience management APIs.  
**Logic Description:** Creates a NestJS application instance using AppModule. Enables ValidationPipe globally. Sets up Swagger using DocumentBuilder, specifying API title, description, version, and endpoint. Starts listening on a configured port.  
**Documentation:**
    
    - **Summary:** Application entry point. Sets up and launches the NestJS application.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/app.module.ts  
**Description:** The root module of the AudienceManagement API application. Imports all feature modules, including the AudienceManagementCoreModule, and global configuration modules.  
**Template:** NestJS  
**Dependancy Level:** 5  
**Name:** AppModule  
**Type:** Module  
**Relative Path:** app.module.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Root module definition
    
**Requirement Ids:**
    
    
**Purpose:** Serves as the root module, organizing and importing other feature-specific modules.  
**Logic Description:** Decorated with @Module. Imports AudienceManagementCoreModule. May import ConfigModule for global configuration access if needed.  
**Documentation:**
    
    - **Summary:** Root application module.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/audience-management/constants/audience.constants.ts  
**Description:** Defines constants related to the audience management module, such as injection tokens for services or interfaces, event names, or specific string literals.  
**Template:** NestJS  
**Dependancy Level:** 0  
**Name:** audience.constants  
**Type:** Constants  
**Relative Path:** modules/audience-management/constants/audience.constants.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** AUDIENCE_MANAGEMENT_SERVICE_TOKEN  
**Type:** InjectionToken  
**Attributes:** export const  
    - **Name:** AD_NETWORK_INTEGRATION_SERVICE_TOKEN  
**Type:** InjectionToken  
**Attributes:** export const  
    - **Name:** CORE_PLATFORM_DATA_SERVICE_TOKEN  
**Type:** InjectionToken  
**Attributes:** export const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Constant definitions for audience management
    
**Requirement Ids:**
    
    
**Purpose:** Provides centralized constant values for the audience management module.  
**Logic Description:** Exports various string constants or Symbols to be used as injection tokens or for other consistent references within the module.  
**Documentation:**
    
    - **Summary:** Contains constants used throughout the audience management module.
    
**Namespace:** AdManager.AudienceManagement.Constants  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** src/modules/audience-management/interfaces/ad-network.interface.ts  
**Description:** Defines the contract (interface) for an Ad Network Integration Service. This service would be responsible for actual communication with ad network APIs for audience creation, synchronization, and status retrieval. The implementation of this interface is expected to be in a separate module or repository.  
**Template:** NestJS  
**Dependancy Level:** 0  
**Name:** IAdNetworkService  
**Type:** Interface  
**Relative Path:** modules/audience-management/interfaces/ad-network.interface.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    - DependencyInversion
    
**Members:**
    
    
**Methods:**
    
    - **Name:** createCustomAudienceOnNetwork  
**Parameters:**
    
    - adNetworkId: string
    - audienceDefinition: any
    - merchantId: string
    
**Return Type:** Promise<{externalAudienceId: string; status: string}>  
**Attributes:**   
    - **Name:** createLookalikeAudienceOnNetwork  
**Parameters:**
    
    - adNetworkId: string
    - sourceExternalAudienceId: string
    - lookalikeSpec: any
    - merchantId: string
    
**Return Type:** Promise<{externalAudienceId: string; status: string}>  
**Attributes:**   
    - **Name:** synchronizeAudienceWithNetwork  
**Parameters:**
    
    - adNetworkId: string
    - externalAudienceId: string
    - audienceData: any
    - merchantId: string
    
**Return Type:** Promise<{status: string}>  
**Attributes:**   
    - **Name:** getAudienceSyncStatusFromNetwork  
**Parameters:**
    
    - adNetworkId: string
    - externalAudienceId: string
    - merchantId: string
    
**Return Type:** Promise<{status: string; size?: number; message?: string}>  
**Attributes:**   
    
**Implemented Features:**
    
    - Ad network service contract
    
**Requirement Ids:**
    
    
**Purpose:** Specifies the methods AudienceManagementService will use to interact with ad network functionalities.  
**Logic Description:** Interface defining methods for creating custom audiences, lookalike audiences, synchronizing audiences, and fetching sync status from a specific ad network.  
**Documentation:**
    
    - **Summary:** Contract for services interacting with ad network APIs for audience operations.
    
**Namespace:** AdManager.AudienceManagement.Interfaces  
**Metadata:**
    
    - **Category:** Integration
    
- **Path:** src/modules/audience-management/interfaces/platform-data.interface.ts  
**Description:** Defines the contract (interface) for a service that provides access to `[PlatformName]` core customer data, used for creating custom audiences.  
**Template:** NestJS  
**Dependancy Level:** 0  
**Name:** ICorePlatformDataService  
**Type:** Interface  
**Relative Path:** modules/audience-management/interfaces/platform-data.interface.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    - DependencyInversion
    
**Members:**
    
    
**Methods:**
    
    - **Name:** getCustomerSegmentData  
**Parameters:**
    
    - segmentId: string
    - merchantId: string
    
**Return Type:** Promise<any[]>  
**Attributes:**   
    - **Name:** hashCustomerPii  
**Parameters:**
    
    - customerData: any[]
    - fieldsToHash: string[]
    
**Return Type:** Promise<any[]>  
**Attributes:**   
    
**Implemented Features:**
    
    - Platform data service contract
    
**Requirement Ids:**
    
    
**Purpose:** Specifies methods for fetching and processing customer data from the core platform for audience creation.  
**Logic Description:** Interface defining methods for retrieving customer segment data and potentially hashing PII before sending to ad networks.  
**Documentation:**
    
    - **Summary:** Contract for services accessing core platform customer data.
    
**Namespace:** AdManager.AudienceManagement.Interfaces  
**Metadata:**
    
    - **Category:** Integration
    
- **Path:** src/modules/audience-management/entities/audience.entity.ts  
**Description:** Defines the structure for an Audience entity as managed within the Ad Manager. This entity stores metadata about an audience, its type, source, and potentially its synchronization status across different ad networks. This might be a TypeORM entity if persistence is handled here, or a simple class structure.  
**Template:** NestJS  
**Dependancy Level:** 1  
**Name:** Audience  
**Type:** Entity  
**Relative Path:** modules/audience-management/entities/audience.entity.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    - Entity
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public  
    - **Name:** merchantId  
**Type:** string  
**Attributes:** public  
    - **Name:** name  
**Type:** string  
**Attributes:** public  
    - **Name:** description  
**Type:** string | null  
**Attributes:** public  
    - **Name:** type  
**Type:** 'CUSTOM' | 'LOOKALIKE'  
**Attributes:** public  
    - **Name:** sourceType  
**Type:** 'PLATFORM_DATA' | 'UPLOADED_LIST' | 'WEBSITE_TRAFFIC' | 'APP_ACTIVITY' | 'LOOKALIKE_SOURCE'  
**Attributes:** public  
    - **Name:** sourceDetails  
**Type:** any  
**Attributes:** public|comment: e.g., platformSegmentId, lookalikeSourceAudienceId, lookalikeSpec  
    - **Name:** adNetworkSyncInfo  
**Type:** Array<{ adNetworkId: string; externalAudienceId?: string; status: string; lastSyncAttempt?: Date; message?: string; currentSize?: number; }>  
**Attributes:** public  
    - **Name:** createdAt  
**Type:** Date  
**Attributes:** public  
    - **Name:** updatedAt  
**Type:** Date  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audience data structure
    
**Requirement Ids:**
    
    - REQ-CMO-012
    - REQ-03-008
    
**Purpose:** Represents an audience segment within the Ad Manager platform.  
**Logic Description:** Class defining properties for an audience, including its ID, name, type, source information, and synchronization status with various ad networks. Used by the AudienceManagementService for internal state.  
**Documentation:**
    
    - **Summary:** Data model for an audience segment managed by the Ad Manager.
    
**Namespace:** AdManager.AudienceManagement.Domain.Entities  
**Metadata:**
    
    - **Category:** Domain
    
- **Path:** src/modules/audience-management/services/audience-management.service.interface.ts  
**Description:** Defines the interface (contract) for the AudienceManagementService. This outlines the methods that the service will expose for managing audiences. Used for dependency injection and promoting loose coupling.  
**Template:** NestJS  
**Dependancy Level:** 1  
**Name:** IAudienceManagementService  
**Type:** Interface  
**Relative Path:** modules/audience-management/services/audience-management.service.interface.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    - InterfaceSegregation
    - DependencyInversion
    
**Members:**
    
    
**Methods:**
    
    - **Name:** createCustomAudience  
**Parameters:**
    
    - merchantId: string
    - createDto: CreateCustomAudienceRequestDto
    
**Return Type:** Promise<AudienceResponseDto>  
**Attributes:**   
    - **Name:** createLookalikeAudience  
**Parameters:**
    
    - merchantId: string
    - createDto: CreateLookalikeAudienceRequestDto
    
**Return Type:** Promise<AudienceResponseDto>  
**Attributes:**   
    - **Name:** getAudienceById  
**Parameters:**
    
    - merchantId: string
    - audienceId: string
    
**Return Type:** Promise<AudienceResponseDto | null>  
**Attributes:**   
    - **Name:** listAudiences  
**Parameters:**
    
    - merchantId: string
    - query: AudienceQueryDto
    
**Return Type:** Promise<AudienceListResponseDto>  
**Attributes:**   
    - **Name:** updateAudience  
**Parameters:**
    
    - merchantId: string
    - audienceId: string
    - updateDto: UpdateAudienceRequestDto
    
**Return Type:** Promise<AudienceResponseDto>  
**Attributes:**   
    - **Name:** deleteAudience  
**Parameters:**
    
    - merchantId: string
    - audienceId: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** synchronizeAudience  
**Parameters:**
    
    - merchantId: string
    - audienceId: string
    - syncRequest: SyncAudienceRequestDto
    
**Return Type:** Promise<AudienceSyncStatusResponseDto[]>  
**Attributes:**   
    - **Name:** getAudienceSynchronizationStatus  
**Parameters:**
    
    - merchantId: string
    - audienceId: string
    - adNetworkId?: string
    
**Return Type:** Promise<AudienceSyncStatusResponseDto[]>  
**Attributes:**   
    
**Implemented Features:**
    
    - Audience service contract definition
    
**Requirement Ids:**
    
    - REQ-CMO-012
    - REQ-03-008
    
**Purpose:** Defines the public contract for audience management functionalities.  
**Logic Description:** Interface specifying methods for creating, retrieving, updating, deleting, and synchronizing custom and lookalike audiences, and checking their synchronization status.  
**Documentation:**
    
    - **Summary:** Contract for the AudienceManagementService, outlining its capabilities.
    
**Namespace:** AdManager.AudienceManagement.Application.Services  
**Metadata:**
    
    - **Category:** ApplicationLogic
    
- **Path:** src/modules/audience-management/api/v1/dtos/create-custom-audience.v1.dto.ts  
**Description:** Data Transfer Object for creating a new custom audience. Includes properties like name, description, source type (e.g., platform data, uploaded list), source identifiers, and target ad networks. Uses class-validator decorators for input validation.  
**Template:** NestJS  
**Dependancy Level:** 1  
**Name:** CreateCustomAudienceRequestDto  
**Type:** DTO  
**Relative Path:** modules/audience-management/api/v1/dtos/create-custom-audience.v1.dto.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** name  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @ApiProperty()  
    - **Name:** description  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    - **Name:** sourceType  
**Type:** 'PLATFORM_DATA_SEGMENT' | 'CUSTOMER_LIST_UPLOAD'  
**Attributes:** @IsIn(['PLATFORM_DATA_SEGMENT', 'CUSTOMER_LIST_UPLOAD']) @ApiProperty()  
    - **Name:** platformDataSourceId  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ValidateIf(o => o.sourceType === 'PLATFORM_DATA_SEGMENT') @IsNotEmpty() @ApiPropertyOptional()  
    - **Name:** customerListFileKey  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ValidateIf(o => o.sourceType === 'CUSTOMER_LIST_UPLOAD') @IsNotEmpty() @ApiPropertyOptional()|comment: Key to a pre-uploaded file containing customer data  
    - **Name:** targetAdNetworkIds  
**Type:** string[]  
**Attributes:** @IsArray() @ArrayNotEmpty() @IsString({ each: true }) @ApiProperty()  
    - **Name:** dataProcessingOptions  
**Type:** { piiHashingFields?: string[]; consentVerified: boolean; }  
**Attributes:** @IsObject() @ValidateNested() @Type(() => DataProcessingOptionsDto) @ApiProperty()|comment: Inner DTO for data processing compliance  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Custom audience creation request data structure
    - Input validation
    
**Requirement Ids:**
    
    - REQ-CMO-012
    - REQ-03-008
    
**Purpose:** Defines the expected request payload for creating a custom audience.  
**Logic Description:** Class decorated with class-validator decorators to ensure incoming data for custom audience creation meets specified criteria (e.g., required fields, correct types).  
**Documentation:**
    
    - **Summary:** Request DTO for creating custom audiences. Specifies name, source, and ad networks.
    
**Namespace:** AdManager.AudienceManagement.Api.V1.Dtos  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/audience-management/api/v1/dtos/create-lookalike-audience.v1.dto.ts  
**Description:** Data Transfer Object for creating a new lookalike audience. Includes properties like name, description, source custom audience ID, target ad networks, and lookalike specifications (e.g., country, size). Uses class-validator decorators.  
**Template:** NestJS  
**Dependancy Level:** 1  
**Name:** CreateLookalikeAudienceRequestDto  
**Type:** DTO  
**Relative Path:** modules/audience-management/api/v1/dtos/create-lookalike-audience.v1.dto.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** name  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @ApiProperty()  
    - **Name:** description  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    - **Name:** sourceAudienceId  
**Type:** string  
**Attributes:** @IsString() @IsNotEmpty() @ApiProperty()|comment: ID of an existing custom audience in Ad Manager  
    - **Name:** targetAdNetworkIds  
**Type:** string[]  
**Attributes:** @IsArray() @ArrayNotEmpty() @IsString({ each: true }) @ApiProperty()  
    - **Name:** lookalikeSpecifications  
**Type:** Array<{ adNetworkId: string; countryCode: string; sizePercentage?: number; }>  
**Attributes:** @IsArray() @ArrayNotEmpty() @ValidateNested({ each: true }) @Type(() => LookalikeSpecDto) @ApiProperty()|comment: Array of network-specific lookalike specs. Inner DTO LookalikeSpecDto needs definition.  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Lookalike audience creation request data structure
    - Input validation
    
**Requirement Ids:**
    
    - REQ-CMO-012
    - REQ-03-008
    
**Purpose:** Defines the expected request payload for creating a lookalike audience.  
**Logic Description:** Class decorated with class-validator decorators for validating lookalike audience creation requests, ensuring source audience and lookalike parameters are provided.  
**Documentation:**
    
    - **Summary:** Request DTO for creating lookalike audiences. Specifies source audience, target networks, and creation parameters.
    
**Namespace:** AdManager.AudienceManagement.Api.V1.Dtos  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/audience-management/api/v1/dtos/audience.v1.response.dto.ts  
**Description:** Data Transfer Object for representing an audience in API responses. Includes audience ID, name, type, description, source details, creation/update timestamps, and detailed synchronization status per ad network.  
**Template:** NestJS  
**Dependancy Level:** 1  
**Name:** AudienceResponseDto  
**Type:** DTO  
**Relative Path:** modules/audience-management/api/v1/dtos/audience.v1.response.dto.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** merchantId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** name  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** description  
**Type:** string | null  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** type  
**Type:** 'CUSTOM' | 'LOOKALIKE'  
**Attributes:** @ApiProperty()  
    - **Name:** sourceType  
**Type:** string  
**Attributes:** @ApiProperty()|comment: e.g., 'PLATFORM_DATA_SEGMENT', 'CUSTOMER_LIST_UPLOAD', 'LOOKALIKE_SOURCE'  
    - **Name:** sourceDetails  
**Type:** any  
**Attributes:** @ApiPropertyOptional()|comment: Contains relevant source info like segment name or source audience name  
    - **Name:** adNetworkSyncInfo  
**Type:** AudienceSyncStatusResponseDto[]  
**Attributes:** @ApiProperty({ type: () => [AudienceSyncStatusResponseDto] })  
    - **Name:** createdAt  
**Type:** Date  
**Attributes:** @ApiProperty()  
    - **Name:** updatedAt  
**Type:** Date  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audience data structure for API responses
    
**Requirement Ids:**
    
    - REQ-CMO-012
    - REQ-03-008
    
**Purpose:** Defines the structure of an audience object when returned by the API.  
**Logic Description:** Class representing the detailed information of an audience, including its metadata and synchronization status with ad networks.  
**Documentation:**
    
    - **Summary:** Response DTO for audience details, including synchronization status.
    
**Namespace:** AdManager.AudienceManagement.Api.V1.Dtos  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/audience-management/api/v1/dtos/audience-list.v1.response.dto.ts  
**Description:** Data Transfer Object for returning a paginated list of audiences. Includes an array of AudienceResponseDto and pagination metadata.  
**Template:** NestJS  
**Dependancy Level:** 2  
**Name:** AudienceListResponseDto  
**Type:** DTO  
**Relative Path:** modules/audience-management/api/v1/dtos/audience-list.v1.response.dto.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** data  
**Type:** AudienceResponseDto[]  
**Attributes:** @ApiProperty({ type: () => [AudienceResponseDto] })  
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
    
    - Paginated audience list response
    
**Requirement Ids:**
    
    - REQ-CMO-012
    
**Purpose:** Defines the structure for API responses containing a list of audiences with pagination details.  
**Logic Description:** Class that wraps an array of AudienceResponseDto objects along with total count, current page, and items per page for paginated results.  
**Documentation:**
    
    - **Summary:** Response DTO for a paginated list of audiences.
    
**Namespace:** AdManager.AudienceManagement.Api.V1.Dtos  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/audience-management/api/v1/dtos/sync-audience.v1.request.dto.ts  
**Description:** Data Transfer Object for requesting synchronization of an existing audience with specified ad networks. Can also be used to add an audience to new networks.  
**Template:** NestJS  
**Dependancy Level:** 1  
**Name:** SyncAudienceRequestDto  
**Type:** DTO  
**Relative Path:** modules/audience-management/api/v1/dtos/sync-audience.v1.request.dto.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** adNetworkIds  
**Type:** string[]  
**Attributes:** @IsArray() @ArrayNotEmpty() @IsString({ each: true }) @ApiProperty()|comment: List of ad network IDs to synchronize with  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audience synchronization request data structure
    
**Requirement Ids:**
    
    - REQ-CMO-012
    - REQ-03-008
    
**Purpose:** Defines the request payload for initiating or updating audience synchronization with ad networks.  
**Logic Description:** Class specifying which ad networks an existing audience should be synchronized with. Used by the sync endpoint.  
**Documentation:**
    
    - **Summary:** Request DTO to trigger audience synchronization for specified ad networks.
    
**Namespace:** AdManager.AudienceManagement.Api.V1.Dtos  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/audience-management/api/v1/dtos/audience-sync-status.v1.response.dto.ts  
**Description:** Data Transfer Object for returning the synchronization status of an audience with a specific ad network.  
**Template:** NestJS  
**Dependancy Level:** 1  
**Name:** AudienceSyncStatusResponseDto  
**Type:** DTO  
**Relative Path:** modules/audience-management/api/v1/dtos/audience-sync-status.v1.response.dto.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** adNetworkId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** adNetworkName  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** externalAudienceId  
**Type:** string | null  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** status  
**Type:** string  
**Attributes:** @ApiProperty()|comment: e.g., 'SYNCED', 'PENDING_SYNC', 'FAILED', 'NOT_CONFIGURED'  
    - **Name:** lastSyncedAt  
**Type:** Date | null  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** currentSize  
**Type:** number | null  
**Attributes:** @ApiPropertyOptional()|comment: Audience size on the ad network  
    - **Name:** message  
**Type:** string | null  
**Attributes:** @ApiPropertyOptional()|comment: Any error or informational message from the ad network  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audience sync status response structure
    
**Requirement Ids:**
    
    - REQ-CMO-012
    - REQ-03-008
    
**Purpose:** Defines the structure for reporting an audience's synchronization status with a particular ad network.  
**Logic Description:** Class containing details about an audience's sync status on an ad network, including external ID, status, last sync time, and size.  
**Documentation:**
    
    - **Summary:** Response DTO detailing the synchronization status of an audience on an ad network.
    
**Namespace:** AdManager.AudienceManagement.Api.V1.Dtos  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/audience-management/api/v1/dtos/update-audience.v1.request.dto.ts  
**Description:** Data Transfer Object for updating an existing audience's metadata (e.g., name, description).  
**Template:** NestJS  
**Dependancy Level:** 1  
**Name:** UpdateAudienceRequestDto  
**Type:** DTO  
**Relative Path:** modules/audience-management/api/v1/dtos/update-audience.v1.request.dto.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** name  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    - **Name:** description  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @IsNullable() @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audience update request data structure
    
**Requirement Ids:**
    
    - REQ-03-008
    
**Purpose:** Defines the expected request payload for updating an audience's attributes.  
**Logic Description:** Class specifying the fields that can be updated for an existing audience, such as its name or description.  
**Documentation:**
    
    - **Summary:** Request DTO for updating audience metadata.
    
**Namespace:** AdManager.AudienceManagement.Api.V1.Dtos  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/audience-management/api/v1/dtos/audience-query.v1.dto.ts  
**Description:** Data Transfer Object for query parameters when listing audiences. Includes pagination (page, limit) and potential filtering options (name, type, adNetworkId).  
**Template:** NestJS  
**Dependancy Level:** 1  
**Name:** AudienceQueryDto  
**Type:** DTO  
**Relative Path:** modules/audience-management/api/v1/dtos/audience-query.v1.dto.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** page  
**Type:** number  
**Attributes:** @IsInt() @Min(1) @IsOptional() @Type(() => Number) @ApiPropertyOptional()  
    - **Name:** limit  
**Type:** number  
**Attributes:** @IsInt() @Min(1) @Max(100) @IsOptional() @Type(() => Number) @ApiPropertyOptional()  
    - **Name:** name  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()  
    - **Name:** type  
**Type:** 'CUSTOM' | 'LOOKALIKE'  
**Attributes:** @IsIn(['CUSTOM', 'LOOKALIKE']) @IsOptional() @ApiPropertyOptional()  
    - **Name:** adNetworkId  
**Type:** string  
**Attributes:** @IsString() @IsOptional() @ApiPropertyOptional()|comment: Filter by audiences synced/configured for a specific ad network  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audience listing query parameters
    
**Requirement Ids:**
    
    - REQ-CMO-012
    
**Purpose:** Defines acceptable query parameters for filtering and paginating the list of audiences.  
**Logic Description:** Class used to capture and validate query parameters for fetching a list of audiences, supporting pagination and filtering.  
**Documentation:**
    
    - **Summary:** DTO for query parameters used when listing audiences, supports filtering and pagination.
    
**Namespace:** AdManager.AudienceManagement.Api.V1.Dtos  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/audience-management/services/audience-management.service.ts  
**Description:** Provides the core business logic for managing audiences. Interacts with data persistence (e.g., Audience entity), platform data services (for custom audience sources), and ad network integration services (for synchronization).  
**Template:** NestJS  
**Dependancy Level:** 2  
**Name:** AudienceManagementService  
**Type:** Service  
**Relative Path:** modules/audience-management/services/audience-management.service.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    - ServiceLayer
    
**Members:**
    
    - **Name:** audienceRepository  
**Type:** Repository<Audience>  
**Attributes:** private readonly|@InjectRepository(Audience)  
    - **Name:** adNetworkIntegrationService  
**Type:** IAdNetworkService  
**Attributes:** private readonly|@Inject(AD_NETWORK_INTEGRATION_SERVICE_TOKEN)  
    - **Name:** corePlatformDataService  
**Type:** ICorePlatformDataService  
**Attributes:** private readonly|@Inject(CORE_PLATFORM_DATA_SERVICE_TOKEN)  
    - **Name:** logger  
**Type:** Logger  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** createCustomAudience  
**Parameters:**
    
    - merchantId: string
    - createDto: CreateCustomAudienceRequestDto
    
**Return Type:** Promise<AudienceResponseDto>  
**Attributes:** public async  
    - **Name:** createLookalikeAudience  
**Parameters:**
    
    - merchantId: string
    - createDto: CreateLookalikeAudienceRequestDto
    
**Return Type:** Promise<AudienceResponseDto>  
**Attributes:** public async  
    - **Name:** getAudienceById  
**Parameters:**
    
    - merchantId: string
    - audienceId: string
    
**Return Type:** Promise<AudienceResponseDto | null>  
**Attributes:** public async  
    - **Name:** listAudiences  
**Parameters:**
    
    - merchantId: string
    - query: AudienceQueryDto
    
**Return Type:** Promise<AudienceListResponseDto>  
**Attributes:** public async  
    - **Name:** updateAudience  
**Parameters:**
    
    - merchantId: string
    - audienceId: string
    - updateDto: UpdateAudienceRequestDto
    
**Return Type:** Promise<AudienceResponseDto>  
**Attributes:** public async  
    - **Name:** deleteAudience  
**Parameters:**
    
    - merchantId: string
    - audienceId: string
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** synchronizeAudience  
**Parameters:**
    
    - merchantId: string
    - audienceId: string
    - syncRequest: SyncAudienceRequestDto
    
**Return Type:** Promise<AudienceSyncStatusResponseDto[]>  
**Attributes:** public async  
    - **Name:** getAudienceSynchronizationStatus  
**Parameters:**
    
    - merchantId: string
    - audienceId: string
    - adNetworkId?: string
    
**Return Type:** Promise<AudienceSyncStatusResponseDto[]>  
**Attributes:** public async  
    - **Name:** mapToAudienceResponseDto  
**Parameters:**
    
    - audience: Audience
    
**Return Type:** AudienceResponseDto  
**Attributes:** private  
    - **Name:** handlePiiForAdNetwork  
**Parameters:**
    
    - merchantId: string
    - audienceData: any
    - dataProcessingOptions: any
    
**Return Type:** Promise<any>  
**Attributes:** private async|comment: Logic for PII hashing based on options  
    
**Implemented Features:**
    
    - Custom audience creation
    - Lookalike audience creation
    - Audience synchronization logic
    - Audience data retrieval
    - PII handling for audience data
    
**Requirement Ids:**
    
    - REQ-CMO-012
    - REQ-03-008
    
**Purpose:** Implements the business logic for all audience management operations.  
**Logic Description:** Handles requests from the controller. For creation, validates input, prepares audience data (e.g., fetching from core platform, hashing PII via ICorePlatformDataService). Interacts with IAdNetworkService to create/sync audiences on external networks. Manages Audience entity persistence. Retrieves and formats audience data for responses. Implements PII compliance measures during data preparation for ad networks.  
**Documentation:**
    
    - **Summary:** Core service for audience management, handling creation, synchronization, and data retrieval.
    
**Namespace:** AdManager.AudienceManagement.Application.Services  
**Metadata:**
    
    - **Category:** ApplicationLogic
    
- **Path:** src/modules/audience-management/api/v1/audience.v1.controller.ts  
**Description:** NestJS controller exposing RESTful API endpoints for audience management. Handles HTTP requests, validates DTOs, calls AudienceManagementService, and returns responses. Secured with JWT authentication and uses Role-Based Access Control decorators if applicable.  
**Template:** NestJS  
**Dependancy Level:** 3  
**Name:** AudienceV1Controller  
**Type:** Controller  
**Relative Path:** modules/audience-management/api/v1/audience.v1.controller.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    - Controller
    
**Members:**
    
    - **Name:** audienceService  
**Type:** IAudienceManagementService  
**Attributes:** private readonly|@Inject(AUDIENCE_MANAGEMENT_SERVICE_TOKEN)  
    
**Methods:**
    
    - **Name:** createCustomAudience  
**Parameters:**
    
    - @Req() request
    - @Body() createCustomAudienceDto: CreateCustomAudienceRequestDto
    
**Return Type:** Promise<AudienceResponseDto>  
**Attributes:** @Post('custom') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation({ summary: 'Create a new custom audience' }) @ApiResponse({ status: 201, type: AudienceResponseDto })  
    - **Name:** createLookalikeAudience  
**Parameters:**
    
    - @Req() request
    - @Body() createLookalikeAudienceDto: CreateLookalikeAudienceRequestDto
    
**Return Type:** Promise<AudienceResponseDto>  
**Attributes:** @Post('lookalike') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation({ summary: 'Create a new lookalike audience' }) @ApiResponse({ status: 201, type: AudienceResponseDto })  
    - **Name:** listAudiences  
**Parameters:**
    
    - @Req() request
    - @Query() query: AudienceQueryDto
    
**Return Type:** Promise<AudienceListResponseDto>  
**Attributes:** @Get() @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation({ summary: 'List audiences for the merchant' }) @ApiResponse({ status: 200, type: AudienceListResponseDto })  
    - **Name:** getAudienceById  
**Parameters:**
    
    - @Req() request
    - @Param('audienceId', ParseUUIDPipe) audienceId: string
    
**Return Type:** Promise<AudienceResponseDto>  
**Attributes:** @Get(':audienceId') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation({ summary: 'Get audience details by ID' }) @ApiResponse({ status: 200, type: AudienceResponseDto }) @ApiResponse({ status: 404, description: 'Audience not found' })  
    - **Name:** updateAudience  
**Parameters:**
    
    - @Req() request
    - @Param('audienceId', ParseUUIDPipe) audienceId: string
    - @Body() updateAudienceDto: UpdateAudienceRequestDto
    
**Return Type:** Promise<AudienceResponseDto>  
**Attributes:** @Put(':audienceId') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation({ summary: 'Update audience metadata' }) @ApiResponse({ status: 200, type: AudienceResponseDto })  
    - **Name:** deleteAudience  
**Parameters:**
    
    - @Req() request
    - @Param('audienceId', ParseUUIDPipe) audienceId: string
    
**Return Type:** Promise<void>  
**Attributes:** @Delete(':audienceId') @HttpCode(204) @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation({ summary: 'Delete an audience' }) @ApiResponse({ status: 204, description: 'Audience deleted successfully' })  
    - **Name:** synchronizeAudienceWithNetworks  
**Parameters:**
    
    - @Req() request
    - @Param('audienceId', ParseUUIDPipe) audienceId: string
    - @Body() syncRequestDto: SyncAudienceRequestDto
    
**Return Type:** Promise<AudienceSyncStatusResponseDto[]>  
**Attributes:** @Post(':audienceId/sync') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation({ summary: 'Synchronize an audience with specified ad networks' }) @ApiResponse({ status: 200, type: [AudienceSyncStatusResponseDto] })  
    - **Name:** getAudienceSyncStatus  
**Parameters:**
    
    - @Req() request
    - @Param('audienceId', ParseUUIDPipe) audienceId: string
    - @Query('adNetworkId') adNetworkId?: string
    
**Return Type:** Promise<AudienceSyncStatusResponseDto[]>  
**Attributes:** @Get(':audienceId/sync/status') @UseGuards(JwtAuthGuard, RolesGuard) @Roles('MerchantAdmin', 'CampaignManager') @ApiOperation({ summary: 'Get audience synchronization status' }) @ApiResponse({ status: 200, type: [AudienceSyncStatusResponseDto] })  
    
**Implemented Features:**
    
    - REST API for custom audience creation
    - REST API for lookalike audience creation
    - REST API for audience synchronization
    - REST API for audience listing and retrieval
    - Input validation via DTOs
    - Authentication and Authorization guards
    
**Requirement Ids:**
    
    - REQ-CMO-012
    - REQ-03-008
    
**Purpose:** Exposes HTTP endpoints for all audience management operations.  
**Logic Description:** Defines routes for CRUD operations on audiences, and for triggering/checking synchronization. Uses DTOs for request validation and response shaping. Delegates business logic to AudienceManagementService. Extracts merchantId from JWT/request context. Implements necessary guards for security.  
**Documentation:**
    
    - **Summary:** Controller handling HTTP requests related to audience management. Endpoints allow creation, listing, retrieval, update, deletion, and synchronization of audiences.
    
**Namespace:** AdManager.AudienceManagement.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/audience-management/api/v1/audience.v1.module.ts  
**Description:** NestJS module for the V1 audience management API. Declares the AudienceV1Controller and potentially imports modules or providers it directly depends on, or relies on AudienceManagementCoreModule for service provision.  
**Template:** NestJS  
**Dependancy Level:** 4  
**Name:** AudienceV1ApiModule  
**Type:** Module  
**Relative Path:** modules/audience-management/api/v1/audience.v1.module.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audience API V1 module definition
    
**Requirement Ids:**
    
    
**Purpose:** Encapsulates V1 API controllers and related DTOs for audience management.  
**Logic Description:** Decorated with @Module. Declares AudienceV1Controller. Imports AudienceManagementCoreModule to make AudienceManagementService available for injection into the controller.  
**Documentation:**
    
    - **Summary:** NestJS module for version 1 of the Audience Management API endpoints.
    
**Namespace:** AdManager.AudienceManagement.Api.V1  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/audience-management/audience-management-core.module.ts  
**Description:** The core NestJS module for all audience management functionalities. Provides the AudienceManagementService, imports the AudienceV1ApiModule, and handles dependencies like database entity registration (if applicable here) or configuration for the audience feature.  
**Template:** NestJS  
**Dependancy Level:** 5  
**Name:** AudienceManagementCoreModule  
**Type:** Module  
**Relative Path:** modules/audience-management/audience-management-core.module.ts  
**Repository Id:** REPO-AUDIENCE-015  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Core audience management feature module
    
**Requirement Ids:**
    
    - REQ-CMO-012
    - REQ-03-008
    
**Purpose:** Central module for the audience management domain, providing services and importing API modules.  
**Logic Description:** Decorated with @Module. Imports AudienceV1ApiModule. Provides AudienceManagementService (using a factory or class provider with injection tokens for dependencies like IAdNetworkService and ICorePlatformDataService). May import TypeOrmModule.forFeature([Audience]) if Audience entity is persisted here. Exports AudienceManagementService if other modules need it.  
**Documentation:**
    
    - **Summary:** Main NestJS module consolidating all parts of the audience management feature.
    
**Namespace:** AdManager.AudienceManagement  
**Metadata:**
    
    - **Category:** Application
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableAdvancedAudienceAnalytics
  - enableRealtimeAudienceSyncStatusPolling
  
- **Database Configs:**
  
  - AUDIENCE_DB_CONNECTION_STRING (if this repo manages its own persistence for AudienceEntity)
  - AUDIENCE_TABLE_NAME (if using DynamoDB through an abstraction)
  


---

