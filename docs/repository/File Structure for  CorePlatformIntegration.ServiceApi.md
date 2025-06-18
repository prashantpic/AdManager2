# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project dependencies, scripts, and metadata for the CorePlatformIntegration.ServiceApi.  
**Template:** Node.js Package Template  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../package.json  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Management
    - Project Scripts
    
**Requirement Ids:**
    
    
**Purpose:** Manages Node.js package dependencies and project scripts for building, running, and testing the service.  
**Logic Description:** Contains dependencies like @nestjs/core, @grpc/grpc-js, google-protobuf, @nestjs/microservices, axios. Defines scripts for start, build, lint, test.  
**Documentation:**
    
    - **Summary:** Standard package.json file for a Node.js/TypeScript project using NestJS and gRPC.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** tsconfig.json  
**Description:** TypeScript compiler configuration for the service.  
**Template:** TypeScript Configuration Template  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ../tsconfig.json  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript Compilation Settings
    
**Requirement Ids:**
    
    
**Purpose:** Configures the TypeScript compiler options, such as target ECMAScript version, module system, and strict type checking.  
**Logic Description:** Includes settings for decorators, experimentalDecorators, emitDecoratorMetadata, module resolution, outDir, baseUrl, paths for aliases.  
**Documentation:**
    
    - **Summary:** Standard tsconfig.json for a NestJS project, ensuring proper compilation of TypeScript code.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/main.ts  
**Description:** Main entry point for the NestJS application. Initializes and starts the gRPC microservice.  
**Template:** NestJS Main Application Template  
**Dependancy Level:** 2  
**Name:** main  
**Type:** ApplicationEntry  
**Relative Path:** main.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** bootstrap  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** async  
    
**Implemented Features:**
    
    - Application Initialization
    - gRPC Server Setup
    
**Requirement Ids:**
    
    
**Purpose:** Bootstraps the NestJS application, sets up the gRPC server transport layer, and listens for incoming requests.  
**Logic Description:** Imports AppModule. Creates a NestJS application instance. Configures gRPC options including package definition, proto path, and server URL. Starts the microservice listener.  
**Documentation:**
    
    - **Summary:** Initializes the CorePlatformIntegration gRPC service using NestJS microservice capabilities.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/app.module.ts  
**Description:** Root module for the CorePlatformIntegration service, importing feature-specific modules.  
**Template:** NestJS Module Template  
**Dependancy Level:** 3  
**Name:** AppModule  
**Type:** Module  
**Relative Path:** app.module.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module Aggregation
    
**Requirement Ids:**
    
    
**Purpose:** Acts as the root module, organizing and importing all other feature modules like CorePlatformIntegrationModule.  
**Logic Description:** Decorated with @Module. Imports CorePlatformIntegrationModule, ConfigModule for application-wide configuration.  
**Documentation:**
    
    - **Summary:** The main application module that ties together all parts of the CorePlatformIntegration service.
    
**Namespace:** AdManager.CorePlatformIntegration.Service  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/core-platform-integration/service/core-platform-integration.module.ts  
**Description:** NestJS module for core platform integration functionalities.  
**Template:** NestJS Module Template  
**Dependancy Level:** 2  
**Name:** CorePlatformIntegrationModule  
**Type:** Module  
**Relative Path:** modules/core-platform-integration/service/core-platform-integration.module.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Injection Setup for Integration Services
    
**Requirement Ids:**
    
    - REQ-CPSI-001
    - REQ-CPSI-002
    - REQ-CPSI-003
    - REQ-CPSI-004
    - REQ-CPSI-005
    - REQ-CPSI-006
    - REQ-CPSI-007
    - REQ-CPSI-008
    
**Purpose:** Encapsulates all services, controllers, and providers related to integrating with the [PlatformName] core platform.  
**Logic Description:** Imports necessary modules (e.g., HttpModule for REST clients). Declares controllers (CorePlatformIntegrationGrpcController). Provides services (ProductIntegrationService, AuthIntegrationService, etc.) and clients (ProductClient, AuthClient, etc.). Exports relevant services if needed by other internal Ad Manager modules (though this API is primarily consumed via gRPC).  
**Documentation:**
    
    - **Summary:** Organizes all components required for interacting with the [PlatformName] core e-commerce platform.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1  
**Metadata:**
    
    - **Category:** Module
    
- **Path:** src/modules/core-platform-integration/service/core-platform-integration.grpc.controller.ts  
**Description:** gRPC controller exposing RPC methods for core platform interactions.  
**Template:** NestJS gRPC Controller Template  
**Dependancy Level:** 1  
**Name:** CorePlatformIntegrationGrpcController  
**Type:** Controller  
**Relative Path:** modules/core-platform-integration/service/core-platform-integration.grpc.controller.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    - Facade
    
**Members:**
    
    - **Name:** productIntegrationService  
**Type:** ProductIntegrationService  
**Attributes:** private|readonly  
    - **Name:** authIntegrationService  
**Type:** AuthIntegrationService  
**Attributes:** private|readonly  
    - **Name:** customerDataIntegrationService  
**Type:** CustomerDataIntegrationService  
**Attributes:** private|readonly  
    - **Name:** orderDataIntegrationService  
**Type:** OrderDataIntegrationService  
**Attributes:** private|readonly  
    - **Name:** directOrderIntegrationService  
**Type:** DirectOrderIntegrationService  
**Attributes:** private|readonly  
    - **Name:** logger  
**Type:** LoggerService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** synchronizeProduct  
**Parameters:**
    
    - data: ProductSyncRequestDto
    
**Return Type:** Promise<ProductSyncResponseDto>  
**Attributes:** public  
    - **Name:** delegateAuthentication  
**Parameters:**
    
    - data: AuthRequestDto
    
**Return Type:** Promise<AuthResponseDto>  
**Attributes:** public  
    - **Name:** getCustomerEligibility  
**Parameters:**
    
    - data: CustomerEligibilityRequestDto
    
**Return Type:** Promise<CustomerEligibilityResponseDto>  
**Attributes:** public  
    - **Name:** getOrderData  
**Parameters:**
    
    - data: OrderDataRequestDto
    
**Return Type:** Promise<OrderDataResponseDto>  
**Attributes:** public  
    - **Name:** generateDirectOrderLink  
**Parameters:**
    
    - data: DirectOrderLinkRequestDto
    
**Return Type:** Promise<DirectOrderLinkResponseDto>  
**Attributes:** public  
    - **Name:** resolveProductConflict  
**Parameters:**
    
    - data: ProductConflictResolutionRequestDto
    
**Return Type:** Promise<ProductConflictResolutionResponseDto>  
**Attributes:** public  
    - **Name:** getCorePlatformApiStatus  
**Parameters:**
    
    - data: EmptyRequestDto
    
**Return Type:** Promise<ApiStatusResponseDto>  
**Attributes:** public  
    
**Implemented Features:**
    
    - gRPC Service Endpoints
    
**Requirement Ids:**
    
    - REQ-CPSI-001
    - REQ-CPSI-002
    - REQ-CPSI-003
    - REQ-CPSI-004
    - REQ-CPSI-005
    - REQ-CPSI-007
    - 2.5
    - 3.1.2 (Direct Order)
    
**Purpose:** Handles incoming gRPC requests and delegates them to the appropriate integration services for processing.  
**Logic Description:** Decorated with @Controller() and gRPC method decorators (@GrpcMethod). Injects specialized integration services. Each method maps to an RPC call defined in the .proto file, validates input DTOs, calls the corresponding service method, and returns the response DTO. Implements error handling, translating service exceptions into gRPC status codes.  
**Documentation:**
    
    - **Summary:** Provides the gRPC interface for other Ad Manager services to interact with the [PlatformName] core platform.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/core-platform-integration/service/protos/core_platform_integration.proto  
**Description:** Protocol Buffer definition for the CorePlatformIntegration gRPC service.  
**Template:** Protocol Buffer Definition Template  
**Dependancy Level:** 0  
**Name:** core_platform_integration  
**Type:** ProtoDefinition  
**Relative Path:** modules/core-platform-integration/service/protos/core_platform_integration.proto  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - gRPC Service Contract
    
**Requirement Ids:**
    
    
**Purpose:** Defines the gRPC service interface, including RPC methods and message types for core platform interactions.  
**Logic Description:** Defines the 'CorePlatformIntegration' service. Includes RPC methods like SynchronizeProduct, DelegateAuthentication, GetCustomerEligibility, GetOrderData, GenerateDirectOrderLink, ResolveProductConflict, GetCorePlatformApiStatus. Imports message definitions from feature-specific proto files.  
**Documentation:**
    
    - **Summary:** The master .proto file defining the contract for the CorePlatformIntegration gRPC service.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/common/config/core-platform-api.config.ts  
**Description:** Configuration for connecting to the [PlatformName] core platform APIs.  
**Template:** NestJS Config Template  
**Dependancy Level:** 0  
**Name:** CorePlatformApiConfig  
**Type:** Configuration  
**Relative Path:** modules/core-platform-integration/service/common/config/core-platform-api.config.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** baseUrl  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** timeout  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** retryAttempts  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** productApiEndpoint  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** authApiEndpoint  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** customerApiEndpoint  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** orderApiEndpoint  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - API Connection Settings
    
**Requirement Ids:**
    
    - REQ-CPSI-006
    
**Purpose:** Provides type-safe configuration for accessing [PlatformName] core APIs, loaded via NestJS ConfigModule.  
**Logic Description:** Uses @nestjs/config to define and load configuration values from environment variables or a .env file. Includes base URLs, API keys (placeholders, to be fetched from Secrets Manager in a real deployment), timeouts, and retry policies.  
**Documentation:**
    
    - **Summary:** Centralized configuration for all [PlatformName] core platform API interactions.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.Common.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/core-platform-integration/service/common/clients/base-core-platform.client.ts  
**Description:** Base client for interacting with [PlatformName] core platform APIs, handling common logic like error handling and retries.  
**Template:** TypeScript Class Template  
**Dependancy Level:** 1  
**Name:** BaseCorePlatformClient  
**Type:** Client  
**Relative Path:** modules/core-platform-integration/service/common/clients/base-core-platform.client.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    - Adapter
    
**Members:**
    
    - **Name:** httpClient  
**Type:** HttpService  
**Attributes:** protected|readonly  
    - **Name:** configService  
**Type:** ConfigService<CorePlatformApiConfig>  
**Attributes:** protected|readonly  
    - **Name:** logger  
**Type:** LoggerService  
**Attributes:** protected|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - httpClient: HttpService
    - configService: ConfigService
    - logger: LoggerService
    
**Return Type:** void  
**Attributes:** protected  
    - **Name:** get  
**Parameters:**
    
    - endpoint: string
    - params?: any
    
**Return Type:** Promise<T>  
**Attributes:** protected|async  
    - **Name:** post  
**Parameters:**
    
    - endpoint: string
    - data: any
    
**Return Type:** Promise<T>  
**Attributes:** protected|async  
    - **Name:** handleError  
**Parameters:**
    
    - error: AxiosError
    
**Return Type:** never  
**Attributes:** private  
    
**Implemented Features:**
    
    - Common API Call Logic
    - Error Handling
    - Retry Mechanism Framework
    
**Requirement Ids:**
    
    - REQ-CPSI-006
    - REQ-CPSI-008
    
**Purpose:** Provides a common foundation for specific API clients, encapsulating shared logic for HTTP requests, error mapping, and retry strategies when communicating with the [PlatformName] core APIs.  
**Logic Description:** Uses Axios (via NestJS HttpService) for making HTTP requests. Implements generic GET/POST methods. Includes logic for request/response logging, transforming [PlatformName] API errors into standardized internal errors. Implements retry logic based on configuration (e.g., exponential backoff for transient errors). Enforces compliance with [PlatformName] IT security standards for API calls.  
**Documentation:**
    
    - **Summary:** An abstract base class or utility class to standardize communication with various [PlatformName] core platform APIs.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.Common.Clients  
**Metadata:**
    
    - **Category:** Integration
    
- **Path:** src/modules/core-platform-integration/service/product-integration/product-integration.service.ts  
**Description:** Service for product data synchronization and conflict resolution logic.  
**Template:** NestJS Service Template  
**Dependancy Level:** 2  
**Name:** ProductIntegrationService  
**Type:** Service  
**Relative Path:** modules/core-platform-integration/service/product-integration/product-integration.service.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** productClient  
**Type:** ProductClient  
**Attributes:** private|readonly  
    - **Name:** logger  
**Type:** LoggerService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** synchronizeProducts  
**Parameters:**
    
    - request: ProductSyncRequestDto
    
**Return Type:** Promise<ProductSyncResponseDto>  
**Attributes:** public|async  
    - **Name:** resolveConflict  
**Parameters:**
    
    - request: ProductConflictResolutionRequestDto
    
**Return Type:** Promise<ProductConflictResolutionResponseDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Product Synchronization Logic
    - Conflict Resolution Strategy Implementation
    
**Requirement Ids:**
    
    - REQ-CPSI-001
    - REQ-CPSI-002
    
**Purpose:** Orchestrates the synchronization of product data from [PlatformName] and manages conflict resolution when overrides exist.  
**Logic Description:** Uses ProductClient to fetch product data from [PlatformName]. Implements logic for initial bulk sync and incremental updates. Implements the chosen conflict resolution strategy (e.g., prioritize Ad Manager overrides, notify merchant) when discrepancies are found between [PlatformName] data and Ad Manager overrides.  
**Documentation:**
    
    - **Summary:** Handles all business logic related to integrating product data from the core platform.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.ProductIntegration  
**Metadata:**
    
    - **Category:** ApplicationService
    
- **Path:** src/modules/core-platform-integration/service/product-integration/product.client.ts  
**Description:** Client for interacting with the [PlatformName] core platform's Product API.  
**Template:** TypeScript Class Template  
**Dependancy Level:** 1  
**Name:** ProductClient  
**Type:** Client  
**Relative Path:** modules/core-platform-integration/service/product-integration/product.client.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    - Adapter
    
**Members:**
    
    
**Methods:**
    
    - **Name:** fetchProductById  
**Parameters:**
    
    - productId: string
    
**Return Type:** Promise<CoreProductDto>  
**Attributes:** public|async  
    - **Name:** fetchAllProducts  
**Parameters:**
    
    - lastSyncTimestamp?: Date
    
**Return Type:** Promise<CoreProductDto[]>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Product API Interaction
    
**Requirement Ids:**
    
    - REQ-CPSI-001
    - REQ-CPSI-006
    
**Purpose:** Encapsulates all HTTP calls to the [PlatformName] Product API, handling request/response mapping and API-specific error handling.  
**Logic Description:** Extends BaseCorePlatformClient or uses it. Implements methods to fetch all products, fetch updated products since a timestamp, or fetch specific products by ID from [PlatformName]. Maps API responses to internal DTOs. Handles rate limits and specific errors from the Product API.  
**Documentation:**
    
    - **Summary:** Provides a dedicated interface for retrieving product data from the [PlatformName] core platform.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.ProductIntegration  
**Metadata:**
    
    - **Category:** Integration
    
- **Path:** src/modules/core-platform-integration/service/product-integration/dtos/product-sync-request.dto.ts  
**Description:** DTO for product synchronization requests to this service API.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** ProductSyncRequestDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/product-integration/dtos/product-sync-request.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** merchantId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** forceFullSync  
**Type:** boolean  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Product Sync Request Data Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-001
    
**Purpose:** Defines the structure for requests to initiate product synchronization.  
**Logic Description:** Contains properties like merchant ID, and flags for full sync vs incremental sync. Uses class-validator decorators for input validation.  
**Documentation:**
    
    - **Summary:** Input DTO for the synchronizeProduct RPC method.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.ProductIntegration.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/product-integration/dtos/product-sync-response.dto.ts  
**Description:** DTO for product synchronization responses from this service API.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** ProductSyncResponseDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/product-integration/dtos/product-sync-response.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** status  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** productsSynced  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** conflictsDetected  
**Type:** number  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Product Sync Response Data Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-001
    - REQ-CPSI-002
    
**Purpose:** Defines the structure for responses after a product synchronization attempt.  
**Logic Description:** Contains properties like synchronization status, number of products synced, and number of conflicts found.  
**Documentation:**
    
    - **Summary:** Output DTO for the synchronizeProduct RPC method.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.ProductIntegration.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/product-integration/dtos/core-product.dto.ts  
**Description:** DTO representing product data as fetched from [PlatformName] core.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** CoreProductDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/product-integration/dtos/core-product.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** name  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** description  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** price  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** imageUrl  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** stockLevel  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** lastUpdatedAt  
**Type:** Date  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Core Product Data Structure
    
**Requirement Ids:**
    
    - REQ-CPSI-001
    
**Purpose:** Represents the structure of product data received from the [PlatformName] core platform.  
**Logic Description:** Contains all relevant product attributes needed by the Ad Manager for catalog creation and synchronization.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for product information from the core platform.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.ProductIntegration.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/product-integration/dtos/product-conflict-resolution-request.dto.ts  
**Description:** DTO for product conflict resolution requests.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** ProductConflictResolutionRequestDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/product-integration/dtos/product-conflict-resolution-request.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** merchantId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** productId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** conflictingField  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** corePlatformValue  
**Type:** any  
**Attributes:** public|readonly  
    - **Name:** adManagerOverrideValue  
**Type:** any  
**Attributes:** public|readonly  
    - **Name:** resolutionStrategy  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Product Conflict Resolution Request Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-002
    
**Purpose:** Defines the structure for requests to resolve a specific product data conflict.  
**Logic Description:** Contains information about the conflict and the desired resolution strategy (e.g., 'PRIORITIZE_AD_MANAGER', 'PRIORITIZE_CORE_PLATFORM', 'MANUAL_REVIEW_NOTIFICATION').  
**Documentation:**
    
    - **Summary:** Input DTO for the resolveProductConflict RPC method.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.ProductIntegration.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/product-integration/dtos/product-conflict-resolution-response.dto.ts  
**Description:** DTO for product conflict resolution responses.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** ProductConflictResolutionResponseDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/product-integration/dtos/product-conflict-resolution-response.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** productId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** resolutionStatus  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** message  
**Type:** string  
**Attributes:** public|readonly|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Product Conflict Resolution Response Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-002
    
**Purpose:** Defines the structure for responses after attempting to resolve a product data conflict.  
**Logic Description:** Contains the status of the resolution (e.g., 'RESOLVED', 'NOTIFICATION_SENT', 'FAILED').  
**Documentation:**
    
    - **Summary:** Output DTO for the resolveProductConflict RPC method.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.ProductIntegration.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/product-integration/protos/product_integration_messages.proto  
**Description:** Protocol Buffer messages for product integration.  
**Template:** Protocol Buffer Definition Template  
**Dependancy Level:** 0  
**Name:** product_integration_messages  
**Type:** ProtoDefinition  
**Relative Path:** modules/core-platform-integration/service/product-integration/protos/product_integration_messages.proto  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Product Sync gRPC Message Types
    - Product Conflict gRPC Message Types
    
**Requirement Ids:**
    
    - REQ-CPSI-001
    - REQ-CPSI-002
    
**Purpose:** Defines gRPC message types for product synchronization requests/responses and conflict resolution.  
**Logic Description:** Contains message definitions for ProductSyncRequest, ProductSyncResponse, CoreProduct, ProductConflictResolutionRequest, ProductConflictResolutionResponse. Aligns with DTOs.  
**Documentation:**
    
    - **Summary:** Defines the data structures for gRPC communication related to product integration.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.ProductIntegration  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/auth-integration/auth-integration.service.ts  
**Description:** Service for delegating user authentication to [PlatformName] core.  
**Template:** NestJS Service Template  
**Dependancy Level:** 2  
**Name:** AuthIntegrationService  
**Type:** Service  
**Relative Path:** modules/core-platform-integration/service/auth-integration/auth-integration.service.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** authClient  
**Type:** AuthClient  
**Attributes:** private|readonly  
    - **Name:** logger  
**Type:** LoggerService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** delegateAuthentication  
**Parameters:**
    
    - request: AuthRequestDto
    
**Return Type:** Promise<AuthResponseDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - User Authentication Delegation Logic
    
**Requirement Ids:**
    
    - REQ-CPSI-003
    
**Purpose:** Handles the logic for passing authentication requests to the [PlatformName] core authentication system.  
**Logic Description:** Uses AuthClient to communicate with the [PlatformName] authentication API. Verifies credentials or tokens against the core system and returns an authentication status or session token.  
**Documentation:**
    
    - **Summary:** Manages the delegation of authentication tasks to the core platform's authentication service.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.AuthIntegration  
**Metadata:**
    
    - **Category:** ApplicationService
    
- **Path:** src/modules/core-platform-integration/service/auth-integration/auth.client.ts  
**Description:** Client for interacting with the [PlatformName] core platform's Authentication API.  
**Template:** TypeScript Class Template  
**Dependancy Level:** 1  
**Name:** AuthClient  
**Type:** Client  
**Relative Path:** modules/core-platform-integration/service/auth-integration/auth.client.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    - Adapter
    
**Members:**
    
    
**Methods:**
    
    - **Name:** verifyCredentials  
**Parameters:**
    
    - credentials: CoreAuthCredentialsDto
    
**Return Type:** Promise<CoreAuthResponseDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Authentication API Interaction
    
**Requirement Ids:**
    
    - REQ-CPSI-003
    - REQ-CPSI-006
    
**Purpose:** Encapsulates HTTP calls to the [PlatformName] Authentication API.  
**Logic Description:** Extends BaseCorePlatformClient. Implements methods to send authentication requests (e.g., username/password, token validation) to the [PlatformName] core auth service. Maps API responses.  
**Documentation:**
    
    - **Summary:** Client responsible for communicating with the core platform's authentication mechanism.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.AuthIntegration  
**Metadata:**
    
    - **Category:** Integration
    
- **Path:** src/modules/core-platform-integration/service/auth-integration/dtos/auth-request.dto.ts  
**Description:** DTO for authentication delegation requests.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** AuthRequestDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/auth-integration/dtos/auth-request.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** username  
**Type:** string  
**Attributes:** public|readonly|optional  
    - **Name:** password  
**Type:** string  
**Attributes:** public|readonly|optional  
    - **Name:** token  
**Type:** string  
**Attributes:** public|readonly|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Auth Request Data Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-003
    
**Purpose:** Defines the structure for authentication requests passed to this service API.  
**Logic Description:** Contains user credentials or tokens to be validated against the core platform.  
**Documentation:**
    
    - **Summary:** Input DTO for the delegateAuthentication RPC method.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.AuthIntegration.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/auth-integration/dtos/auth-response.dto.ts  
**Description:** DTO for authentication delegation responses.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** AuthResponseDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/auth-integration/dtos/auth-response.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** isAuthenticated  
**Type:** boolean  
**Attributes:** public|readonly  
    - **Name:** userId  
**Type:** string  
**Attributes:** public|readonly|optional  
    - **Name:** sessionToken  
**Type:** string  
**Attributes:** public|readonly|optional  
    - **Name:** errorMessage  
**Type:** string  
**Attributes:** public|readonly|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Auth Response Data Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-003
    
**Purpose:** Defines the structure for responses after an authentication attempt.  
**Logic Description:** Indicates success/failure, and may include user identifiers or session tokens.  
**Documentation:**
    
    - **Summary:** Output DTO for the delegateAuthentication RPC method.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.AuthIntegration.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/auth-integration/protos/auth_integration_messages.proto  
**Description:** Protocol Buffer messages for authentication integration.  
**Template:** Protocol Buffer Definition Template  
**Dependancy Level:** 0  
**Name:** auth_integration_messages  
**Type:** ProtoDefinition  
**Relative Path:** modules/core-platform-integration/service/auth-integration/protos/auth_integration_messages.proto  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Auth gRPC Message Types
    
**Requirement Ids:**
    
    - REQ-CPSI-003
    
**Purpose:** Defines gRPC message types for authentication requests and responses.  
**Logic Description:** Contains message definitions for AuthRequest and AuthResponse. Aligns with DTOs.  
**Documentation:**
    
    - **Summary:** Defines data structures for gRPC communication related to user authentication delegation.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.AuthIntegration  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/customer-data-integration/customer-data-integration.service.ts  
**Description:** Service for fetching customer data from [PlatformName] core for promotion eligibility.  
**Template:** NestJS Service Template  
**Dependancy Level:** 2  
**Name:** CustomerDataIntegrationService  
**Type:** Service  
**Relative Path:** modules/core-platform-integration/service/customer-data-integration/customer-data-integration.service.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** customerClient  
**Type:** CustomerClient  
**Attributes:** private|readonly  
    - **Name:** logger  
**Type:** LoggerService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** getCustomerEligibility  
**Parameters:**
    
    - request: CustomerEligibilityRequestDto
    
**Return Type:** Promise<CustomerEligibilityResponseDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Customer Data Retrieval for Promotions
    
**Requirement Ids:**
    
    - REQ-CPSI-004
    - REQ-CPSI-008
    
**Purpose:** Retrieves customer data from the core platform to check eligibility for promotions.  
**Logic Description:** Uses CustomerClient to fetch customer attributes (e.g., new customer status, segment, purchase history). Implements logic to evaluate eligibility based on promotion rules. Ensures data handling complies with [PlatformName]'s internal data governance and IT security policies (REQ-CPSI-008).  
**Documentation:**
    
    - **Summary:** Handles retrieval and processing of customer data for promotional eligibility checks.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.CustomerDataIntegration  
**Metadata:**
    
    - **Category:** ApplicationService
    
- **Path:** src/modules/core-platform-integration/service/customer-data-integration/customer.client.ts  
**Description:** Client for interacting with the [PlatformName] core platform's Customer API.  
**Template:** TypeScript Class Template  
**Dependancy Level:** 1  
**Name:** CustomerClient  
**Type:** Client  
**Relative Path:** modules/core-platform-integration/service/customer-data-integration/customer.client.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    - Adapter
    
**Members:**
    
    
**Methods:**
    
    - **Name:** fetchCustomerAttributes  
**Parameters:**
    
    - customerId: string
    - attributes: string[]
    
**Return Type:** Promise<CoreCustomerAttributesDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Customer API Interaction
    
**Requirement Ids:**
    
    - REQ-CPSI-004
    - REQ-CPSI-006
    
**Purpose:** Encapsulates HTTP calls to the [PlatformName] Customer API.  
**Logic Description:** Extends BaseCorePlatformClient. Implements methods to fetch specific customer attributes required for promotion eligibility (e.g., 'isNewCustomer', 'segment').  
**Documentation:**
    
    - **Summary:** Client for retrieving customer information from the core platform.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.CustomerDataIntegration  
**Metadata:**
    
    - **Category:** Integration
    
- **Path:** src/modules/core-platform-integration/service/customer-data-integration/dtos/customer-eligibility-request.dto.ts  
**Description:** DTO for customer eligibility check requests.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** CustomerEligibilityRequestDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/customer-data-integration/dtos/customer-eligibility-request.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** customerId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** promotionId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** eligibilityCriteria  
**Type:** object  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Customer Eligibility Request Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-004
    
**Purpose:** Defines structure for requests to check a customer's eligibility for a promotion.  
**Logic Description:** Contains customer identifier and promotion-specific eligibility criteria to check against.  
**Documentation:**
    
    - **Summary:** Input DTO for the getCustomerEligibility RPC method.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.CustomerDataIntegration.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/customer-data-integration/dtos/customer-eligibility-response.dto.ts  
**Description:** DTO for customer eligibility check responses.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** CustomerEligibilityResponseDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/customer-data-integration/dtos/customer-eligibility-response.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** customerId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** promotionId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** isEligible  
**Type:** boolean  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Customer Eligibility Response Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-004
    
**Purpose:** Defines structure for responses indicating a customer's eligibility.  
**Logic Description:** Indicates if the customer is eligible for the specified promotion.  
**Documentation:**
    
    - **Summary:** Output DTO for the getCustomerEligibility RPC method.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.CustomerDataIntegration.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/customer-data-integration/protos/customer_data_integration_messages.proto  
**Description:** Protocol Buffer messages for customer data integration.  
**Template:** Protocol Buffer Definition Template  
**Dependancy Level:** 0  
**Name:** customer_data_integration_messages  
**Type:** ProtoDefinition  
**Relative Path:** modules/core-platform-integration/service/customer-data-integration/protos/customer_data_integration_messages.proto  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Customer Eligibility gRPC Message Types
    
**Requirement Ids:**
    
    - REQ-CPSI-004
    
**Purpose:** Defines gRPC message types for customer eligibility checks.  
**Logic Description:** Contains message definitions for CustomerEligibilityRequest and CustomerEligibilityResponse. Aligns with DTOs.  
**Documentation:**
    
    - **Summary:** Defines data structures for gRPC communication related to customer data and promotion eligibility.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.CustomerDataIntegration  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/order-data-integration/order-data-integration.service.ts  
**Description:** Service for retrieving order data from [PlatformName] core for analytics.  
**Template:** NestJS Service Template  
**Dependancy Level:** 2  
**Name:** OrderDataIntegrationService  
**Type:** Service  
**Relative Path:** modules/core-platform-integration/service/order-data-integration/order-data-integration.service.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** orderClient  
**Type:** OrderClient  
**Attributes:** private|readonly  
    - **Name:** logger  
**Type:** LoggerService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** getOrderData  
**Parameters:**
    
    - request: OrderDataRequestDto
    
**Return Type:** Promise<OrderDataResponseDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Order Data Retrieval for Analytics
    
**Requirement Ids:**
    
    - REQ-CPSI-007
    
**Purpose:** Retrieves order data from the core platform, crucial for calculating ROAS, CPA, and other ad performance metrics.  
**Logic Description:** Uses OrderClient to fetch order details (ID, items, value, timestamp) that can be attributed to ad campaigns. Ensures data accuracy and timeliness for reporting.  
**Documentation:**
    
    - **Summary:** Handles retrieval of order data for advertising performance calculations.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.OrderDataIntegration  
**Metadata:**
    
    - **Category:** ApplicationService
    
- **Path:** src/modules/core-platform-integration/service/order-data-integration/order.client.ts  
**Description:** Client for interacting with the [PlatformName] core platform's Order API.  
**Template:** TypeScript Class Template  
**Dependancy Level:** 1  
**Name:** OrderClient  
**Type:** Client  
**Relative Path:** modules/core-platform-integration/service/order-data-integration/order.client.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    - Adapter
    
**Members:**
    
    
**Methods:**
    
    - **Name:** fetchOrdersByCampaign  
**Parameters:**
    
    - campaignId: string
    - dateRange: {from: Date, to: Date}
    
**Return Type:** Promise<CoreOrderDto[]>  
**Attributes:** public|async  
    - **Name:** fetchOrderById  
**Parameters:**
    
    - orderId: string
    
**Return Type:** Promise<CoreOrderDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Order API Interaction
    
**Requirement Ids:**
    
    - REQ-CPSI-007
    - REQ-CPSI-006
    
**Purpose:** Encapsulates HTTP calls to the [PlatformName] Order API.  
**Logic Description:** Extends BaseCorePlatformClient. Implements methods to fetch orders attributed to specific campaigns or by order ID. Ensures appropriate linkage between sales and ad activities.  
**Documentation:**
    
    - **Summary:** Client for retrieving order and sales data from the core platform.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.OrderDataIntegration  
**Metadata:**
    
    - **Category:** Integration
    
- **Path:** src/modules/core-platform-integration/service/order-data-integration/dtos/order-data-request.dto.ts  
**Description:** DTO for order data retrieval requests.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** OrderDataRequestDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/order-data-integration/dtos/order-data-request.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** merchantId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** campaignIds  
**Type:** string[]  
**Attributes:** public|readonly|optional  
    - **Name:** dateFrom  
**Type:** string  
**Attributes:** public|readonly|optional  
    - **Name:** dateTo  
**Type:** string  
**Attributes:** public|readonly|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Order Data Request Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-007
    
**Purpose:** Defines structure for requests to retrieve order data for analytics.  
**Logic Description:** Contains parameters to filter orders, such as campaign IDs or date ranges.  
**Documentation:**
    
    - **Summary:** Input DTO for the getOrderData RPC method.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.OrderDataIntegration.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/order-data-integration/dtos/order-data-response.dto.ts  
**Description:** DTO for order data retrieval responses.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** OrderDataResponseDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/order-data-integration/dtos/order-data-response.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** orders  
**Type:** CoreOrderDto[]  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Order Data Response Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-007
    
**Purpose:** Defines structure for responses containing retrieved order data.  
**Logic Description:** Contains a list of orders matching the request criteria.  
**Documentation:**
    
    - **Summary:** Output DTO for the getOrderData RPC method, containing a list of core order DTOs.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.OrderDataIntegration.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/order-data-integration/dtos/core-order.dto.ts  
**Description:** DTO representing order data as fetched from [PlatformName] core.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** CoreOrderDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/order-data-integration/dtos/core-order.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** orderId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** items  
**Type:** CoreOrderItemDto[]  
**Attributes:** public|readonly  
    - **Name:** totalValue  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** currency  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** timestamp  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** attributionSource  
**Type:** string  
**Attributes:** public|readonly|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Core Order Data Structure
    
**Requirement Ids:**
    
    - REQ-CPSI-007
    
**Purpose:** Represents the structure of order data received from the [PlatformName] core platform.  
**Logic Description:** Contains relevant order attributes like ID, items, total value, and timestamp.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for order information from the core platform.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.OrderDataIntegration.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/order-data-integration/protos/order_data_integration_messages.proto  
**Description:** Protocol Buffer messages for order data integration.  
**Template:** Protocol Buffer Definition Template  
**Dependancy Level:** 0  
**Name:** order_data_integration_messages  
**Type:** ProtoDefinition  
**Relative Path:** modules/core-platform-integration/service/order-data-integration/protos/order_data_integration_messages.proto  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Order Data gRPC Message Types
    
**Requirement Ids:**
    
    - REQ-CPSI-007
    
**Purpose:** Defines gRPC message types for order data retrieval.  
**Logic Description:** Contains message definitions for OrderDataRequest, OrderDataResponse, and CoreOrder. Aligns with DTOs.  
**Documentation:**
    
    - **Summary:** Defines data structures for gRPC communication related to order data retrieval.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.OrderDataIntegration  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/direct-order-integration/direct-order-integration.service.ts  
**Description:** Service for generating 'Direct Order' deep-links for [PlatformName] core.  
**Template:** NestJS Service Template  
**Dependancy Level:** 1  
**Name:** DirectOrderIntegrationService  
**Type:** Service  
**Relative Path:** modules/core-platform-integration/service/direct-order-integration/direct-order-integration.service.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** configService  
**Type:** ConfigService<CorePlatformApiConfig>  
**Attributes:** private|readonly  
    - **Name:** logger  
**Type:** LoggerService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** generateDirectOrderLink  
**Parameters:**
    
    - request: DirectOrderLinkRequestDto
    
**Return Type:** Promise<DirectOrderLinkResponseDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Direct Order Deep-Link Generation
    
**Requirement Ids:**
    
    - REQ-CPSI-005
    - 3.1.2 (Direct Order)
    
**Purpose:** Generates deep-links that direct users to the [PlatformName] core platform's streamlined 'Direct Order' checkout process.  
**Logic Description:** Constructs the deep-link URL based on [PlatformName] specifications and input parameters (e.g., product ID, quantity). Uses configuration for base URLs or path structures.  
**Documentation:**
    
    - **Summary:** Provides functionality to create deep-links for the core platform's Direct Order feature.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.DirectOrderIntegration  
**Metadata:**
    
    - **Category:** ApplicationService
    
- **Path:** src/modules/core-platform-integration/service/direct-order-integration/dtos/direct-order-link-request.dto.ts  
**Description:** DTO for 'Direct Order' deep-link generation requests.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** DirectOrderLinkRequestDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/direct-order-integration/dtos/direct-order-link-request.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** productId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** quantity  
**Type:** number  
**Attributes:** public|readonly|optional  
    - **Name:** merchantId  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Direct Order Link Request Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-005
    
**Purpose:** Defines structure for requests to generate a 'Direct Order' deep-link.  
**Logic Description:** Contains parameters like product ID and quantity needed to construct the link.  
**Documentation:**
    
    - **Summary:** Input DTO for the generateDirectOrderLink RPC method.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.DirectOrderIntegration.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/direct-order-integration/dtos/direct-order-link-response.dto.ts  
**Description:** DTO for 'Direct Order' deep-link generation responses.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** DirectOrderLinkResponseDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/direct-order-integration/dtos/direct-order-link-response.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** deepLinkUrl  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Direct Order Link Response Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-005
    
**Purpose:** Defines structure for responses containing the generated 'Direct Order' deep-link.  
**Logic Description:** Contains the fully constructed deep-link URL.  
**Documentation:**
    
    - **Summary:** Output DTO for the generateDirectOrderLink RPC method.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.DirectOrderIntegration.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/direct-order-integration/protos/direct_order_integration_messages.proto  
**Description:** Protocol Buffer messages for 'Direct Order' integration.  
**Template:** Protocol Buffer Definition Template  
**Dependancy Level:** 0  
**Name:** direct_order_integration_messages  
**Type:** ProtoDefinition  
**Relative Path:** modules/core-platform-integration/service/direct-order-integration/protos/direct_order_integration_messages.proto  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Direct Order Link gRPC Message Types
    
**Requirement Ids:**
    
    - REQ-CPSI-005
    
**Purpose:** Defines gRPC message types for 'Direct Order' deep-link generation.  
**Logic Description:** Contains message definitions for DirectOrderLinkRequest and DirectOrderLinkResponse. Aligns with DTOs.  
**Documentation:**
    
    - **Summary:** Defines data structures for gRPC communication related to 'Direct Order' deep-linking.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.DirectOrderIntegration  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/common/dtos/api-status-response.dto.ts  
**Description:** DTO for Core Platform API status check responses.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** ApiStatusResponseDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/common/dtos/api-status-response.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** status  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** message  
**Type:** string  
**Attributes:** public|readonly|optional  
    - **Name:** checkedApi  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - API Status Response Contract
    
**Requirement Ids:**
    
    - REQ-CPSI-006
    
**Purpose:** Defines the structure for responses indicating the status of a [PlatformName] core API.  
**Logic Description:** Contains status (e.g., 'OPERATIONAL', 'DEGRADED', 'DOWN') and an optional message.  
**Documentation:**
    
    - **Summary:** Output DTO for the getCorePlatformApiStatus RPC method.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.Common.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/common/dtos/empty-request.dto.ts  
**Description:** Empty DTO for requests that do not require parameters.  
**Template:** TypeScript DTO Template  
**Dependancy Level:** 0  
**Name:** EmptyRequestDto  
**Type:** DTO  
**Relative Path:** modules/core-platform-integration/service/common/dtos/empty-request.dto.ts  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Empty Request Contract
    
**Requirement Ids:**
    
    
**Purpose:** Represents an empty request body for gRPC methods that do not take parameters.  
**Logic Description:** An empty class, often used with methods like status checks.  
**Documentation:**
    
    - **Summary:** A generic empty request DTO.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.Common.Dtos  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/core-platform-integration/service/common/protos/common_messages.proto  
**Description:** Protocol Buffer common messages used across the service.  
**Template:** Protocol Buffer Definition Template  
**Dependancy Level:** 0  
**Name:** common_messages  
**Type:** ProtoDefinition  
**Relative Path:** modules/core-platform-integration/service/common/protos/common_messages.proto  
**Repository Id:** REPO-COREINT-016  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Common gRPC Message Types
    
**Requirement Ids:**
    
    
**Purpose:** Defines common gRPC message types like Empty and ApiStatusResponse.  
**Logic Description:** Contains message definitions for EmptyRequest and ApiStatusResponse. Aligns with DTOs.  
**Documentation:**
    
    - **Summary:** Defines common data structures for gRPC communication.
    
**Namespace:** AdManager.CorePlatformIntegration.Service.V1.Common  
**Metadata:**
    
    - **Category:** Contract
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableProductConflictManualReviewNotification
  - enableAuthTokenCaching
  
- **Database Configs:**
  
  


---

