# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project metadata, dependencies (NestJS, @grpc/grpc-js, google-protobuf, opossum, class-validator, class-transformer), and scripts for the Ad Network Integration Service API.  
**Template:** Node.js Package Manifest  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../../../../package.json  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Management
    - Project Scripts
    
**Requirement Ids:**
    
    
**Purpose:** Manages project dependencies and provides scripts for building, running, and testing the service.  
**Logic Description:** Specifies dependencies like @nestjs/core, @nestjs/microservices, @grpc/grpc-js, google-protobuf, opossum. Includes scripts for 'start:dev', 'build', 'test', 'lint'.  
**Documentation:**
    
    - **Summary:** Standard Node.js package manifest file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** tsconfig.json  
**Description:** TypeScript compiler options for the Ad Network Integration Service API project.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ../../../../tsconfig.json  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript Compilation Rules
    
**Requirement Ids:**
    
    
**Purpose:** Configures the TypeScript compiler (e.g., target, module system, strictness, paths).  
**Logic Description:** Includes settings for 'target': 'ES2021', 'module': 'commonjs', 'experimentalDecorators': true, 'emitDecoratorMetadata': true, 'strictNullChecks': true, 'outDir': './dist', 'baseUrl': './'.  
**Documentation:**
    
    - **Summary:** Standard TypeScript configuration file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** nest-cli.json  
**Description:** NestJS CLI configuration file, specifying project structure and build options.  
**Template:** NestJS CLI Configuration  
**Dependancy Level:** 0  
**Name:** nest-cli  
**Type:** Configuration  
**Relative Path:** ../../../../nest-cli.json  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - NestJS Project Structure
    - Build Assets
    
**Requirement Ids:**
    
    
**Purpose:** Defines settings for the NestJS CLI, such as source root, monorepo settings (if applicable), and compiler options.  
**Logic Description:** Specifies 'collection': '@nestjs/schematics', 'sourceRoot': 'src/modules/ad-network-integration/service', and asset configurations for .proto files.  
**Documentation:**
    
    - **Summary:** Configuration file for the NestJS command-line interface.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** src/modules/ad-network-integration/service/main.ts  
**Description:** Main entry point for the NestJS application. Initializes and bootstraps the AdNetworkIntegrationModule.  
**Template:** NestJS Main Application File  
**Dependancy Level:** 3  
**Name:** main  
**Type:** Application  
**Relative Path:** main.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** bootstrap  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** async  
    
**Implemented Features:**
    
    - Application Bootstrap
    
**Requirement Ids:**
    
    
**Purpose:** Initializes the NestJS application, configures the gRPC microservice transport, and starts listening for requests.  
**Logic Description:** Uses NestFactory.createMicroservice to bootstrap the AppModule. Specifies gRPC transport options, including package definition, proto path, and URL. Logs application start.  
**Documentation:**
    
    - **Summary:** Bootstraps the Ad Network Integration microservice.
    
**Namespace:** AdManager.AdNetworkIntegration.Service  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/ad-network-integration/service/app.module.ts  
**Description:** Root application module. Imports the AdNetworkIntegrationModule and any other global modules like ConfigModule.  
**Template:** NestJS Module File  
**Dependancy Level:** 2  
**Name:** AppModule  
**Type:** Module  
**Relative Path:** app.module.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module Aggregation
    
**Requirement Ids:**
    
    
**Purpose:** Serves as the root module for the NestJS application, organizing and importing feature modules.  
**Logic Description:** Imports AdNetworkIntegrationModule. May also import NestJS ConfigModule for global configuration management and validation.  
**Documentation:**
    
    - **Summary:** The main application module that ties together all other modules.
    
**Namespace:** AdManager.AdNetworkIntegration.Service  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/ad-network-integration/service/ad-network-integration.module.ts  
**Description:** Core module for ad network integration functionalities. Declares controllers, providers (services, adapters, factories), and imports necessary configurations.  
**Template:** NestJS Module File  
**Dependancy Level:** 3  
**Name:** AdNetworkIntegrationModule  
**Type:** Module  
**Relative Path:** ad-network-integration.module.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Ad Network Integration Domain Encapsulation
    
**Requirement Ids:**
    
    - REQ-TCE-001
    - REQ-TCE-002
    - REQ-TCE-003
    - REQ-03-001
    - REQ-03-002
    - REQ-03-003
    - REQ-03-005
    - REQ-03-006
    - REQ-03-007
    - REQ-03-008
    - REQ-CMO-010
    - REQ-CMO-012
    
**Purpose:** Encapsulates all logic related to ad network integration, providing services and controllers for this domain.  
**Logic Description:** Imports ConfigModule for ad-network.configuration.ts. Declares AdNetworkIntegrationGrpcController. Provides AdNetworkIntegrationService, domain services (CampaignSyncService, etc.), all AdNetworkAdapter implementations, ResilienceFactory, and DataMapperFactory.  
**Documentation:**
    
    - **Summary:** The primary NestJS module responsible for all ad network integration logic.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/ad-network-integration/service/grpc/protos/ad_network_integration.v1.proto  
**Description:** Protocol Buffer definition for the Ad Network Integration gRPC service. Defines service methods, request messages, and response messages.  
**Template:** Protocol Buffer Definition  
**Dependancy Level:** 0  
**Name:** ad_network_integration.v1  
**Type:** InterfaceDefinition  
**Relative Path:** grpc/protos/ad_network_integration.v1.proto  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - gRPC Service Contract
    
**Requirement Ids:**
    
    - REQ-TCE-001
    - REQ-03-001
    - REQ-03-002
    - REQ-03-003
    - REQ-03-008
    
**Purpose:** Defines the contract for gRPC communication, specifying RPC methods and message structures for ad network operations.  
**Logic Description:** Includes service 'AdNetworkIntegration' with RPCs like 'CreateCampaign', 'UpdateAdSet', 'UploadCreative', 'GetPerformanceMetrics', 'SyncAudience', 'SubmitProductFeed', 'ValidateCampaign'. Defines corresponding request and response messages with necessary fields (e.g., AdNetworkType, campaign details, audience data, feed info, validation parameters). Uses common.v1.proto for shared types.  
**Documentation:**
    
    - **Summary:** Defines the gRPC service interface for ad network integration functionalities.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1  
**Metadata:**
    
    - **Category:** Interface
    
- **Path:** src/modules/ad-network-integration/service/grpc/protos/common.v1.proto  
**Description:** Protocol Buffer definition for common data types (enums, messages) shared across gRPC services.  
**Template:** Protocol Buffer Definition  
**Dependancy Level:** 0  
**Name:** common.v1  
**Type:** InterfaceDefinition  
**Relative Path:** grpc/protos/common.v1.proto  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Shared gRPC Data Types
    
**Requirement Ids:**
    
    
**Purpose:** Provides common enumerations and message structures like AdNetworkType, Status, ErrorDetails for use in various gRPC service definitions.  
**Logic Description:** Defines enums for AdNetwork (GOOGLE_ADS, INSTAGRAM_ADS, etc.), CampaignStatus, CreativeType. Defines messages for ErrorDetail, PagingInfo.  
**Documentation:**
    
    - **Summary:** Contains shared message types and enums for gRPC services.
    
**Namespace:** AdManager.Common.V1  
**Metadata:**
    
    - **Category:** Interface
    
- **Path:** src/modules/ad-network-integration/service/grpc/ad-network-integration.grpc.controller.ts  
**Description:** NestJS gRPC controller that implements the AdNetworkIntegration service defined in the .proto file. Delegates calls to AdNetworkIntegrationService.  
**Template:** NestJS gRPC Controller  
**Dependancy Level:** 2  
**Name:** AdNetworkIntegrationGrpcController  
**Type:** Controller  
**Relative Path:** grpc/ad-network-integration.grpc.controller.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - Controller
    
**Members:**
    
    - **Name:** adNetworkIntegrationService  
**Type:** AdNetworkIntegrationService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** createCampaign  
**Parameters:**
    
    - data: CreateCampaignRequestDto
    
**Return Type:** Promise<CreateCampaignResponseDto>  
**Attributes:** public  
    - **Name:** updateAdSet  
**Parameters:**
    
    - data: UpdateAdSetRequestDto
    
**Return Type:** Promise<UpdateAdSetResponseDto>  
**Attributes:** public  
    - **Name:** uploadCreative  
**Parameters:**
    
    - data: UploadCreativeRequestDto
    
**Return Type:** Promise<UploadCreativeResponseDto>  
**Attributes:** public  
    - **Name:** getPerformanceMetrics  
**Parameters:**
    
    - data: GetPerformanceMetricsRequestDto
    
**Return Type:** Promise<GetPerformanceMetricsResponseDto>  
**Attributes:** public  
    - **Name:** syncAudience  
**Parameters:**
    
    - data: SyncAudienceRequestDto
    
**Return Type:** Promise<SyncAudienceResponseDto>  
**Attributes:** public  
    - **Name:** submitProductFeed  
**Parameters:**
    
    - data: SubmitProductFeedRequestDto
    
**Return Type:** Promise<SubmitProductFeedResponseDto>  
**Attributes:** public  
    - **Name:** validateCampaignData  
**Parameters:**
    
    - data: ValidateCampaignDataRequestDto
    
**Return Type:** Promise<ValidateCampaignDataResponseDto>  
**Attributes:** public  
    
**Implemented Features:**
    
    - gRPC API Endpoints for Ad Network Operations
    
**Requirement Ids:**
    
    - REQ-TCE-001
    - REQ-03-001
    - REQ-03-002
    - REQ-03-003
    - REQ-03-008
    - REQ-CMO-010
    
**Purpose:** Exposes ad network integration functionalities as gRPC service methods for internal service-to-service communication.  
**Logic Description:** Uses @GrpcMethod decorators for each RPC defined in ad_network_integration.v1.proto. Each method validates input DTOs (generated or custom) and calls corresponding methods in AdNetworkIntegrationService. Handles gRPC-specific error mapping if necessary.  
**Documentation:**
    
    - **Summary:** Implements the gRPC server-side logic for handling ad network integration requests.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Grpc  
**Metadata:**
    
    - **Category:** API
    
- **Path:** src/modules/ad-network-integration/service/ad-network-integration.service.ts  
**Description:** Main application service orchestrating ad network integration tasks. Uses domain services and ad network adapters.  
**Template:** NestJS Service File  
**Dependancy Level:** 3  
**Name:** AdNetworkIntegrationService  
**Type:** Service  
**Relative Path:** ad-network-integration.service.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - ServiceLayer
    - Facade
    
**Members:**
    
    - **Name:** campaignSyncService  
**Type:** CampaignSyncService  
**Attributes:** private|readonly  
    - **Name:** creativeSyncService  
**Type:** CreativeSyncService  
**Attributes:** private|readonly  
    - **Name:** metricsRetrievalService  
**Type:** MetricsRetrievalService  
**Attributes:** private|readonly  
    - **Name:** audienceSyncService  
**Type:** AudienceSyncService  
**Attributes:** private|readonly  
    - **Name:** feedSubmissionService  
**Type:** FeedSubmissionService  
**Attributes:** private|readonly  
    - **Name:** policyValidatorService  
**Type:** PolicyValidatorService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** createCampaign  
**Parameters:**
    
    - request: CreateCampaignRequestDto
    
**Return Type:** Promise<CreateCampaignResponseDto>  
**Attributes:** public|async  
    - **Name:** updateAdSet  
**Parameters:**
    
    - request: UpdateAdSetRequestDto
    
**Return Type:** Promise<UpdateAdSetResponseDto>  
**Attributes:** public|async  
    - **Name:** uploadCreative  
**Parameters:**
    
    - request: UploadCreativeRequestDto
    
**Return Type:** Promise<UploadCreativeResponseDto>  
**Attributes:** public|async  
    - **Name:** getPerformanceMetrics  
**Parameters:**
    
    - request: GetPerformanceMetricsRequestDto
    
**Return Type:** Promise<GetPerformanceMetricsResponseDto>  
**Attributes:** public|async  
    - **Name:** syncAudience  
**Parameters:**
    
    - request: SyncAudienceRequestDto
    
**Return Type:** Promise<SyncAudienceResponseDto>  
**Attributes:** public|async  
    - **Name:** submitProductFeed  
**Parameters:**
    
    - request: SubmitProductFeedRequestDto
    
**Return Type:** Promise<SubmitProductFeedResponseDto>  
**Attributes:** public|async  
    - **Name:** validateCampaignData  
**Parameters:**
    
    - request: ValidateCampaignDataRequestDto
    
**Return Type:** Promise<ValidateCampaignDataResponseDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Orchestration of Ad Network Operations
    
**Requirement Ids:**
    
    - REQ-TCE-001
    - REQ-03-001
    - REQ-03-002
    - REQ-03-003
    - REQ-03-008
    - REQ-CMO-010
    - REQ-CMO-012
    
**Purpose:** Acts as a facade and orchestrator for all ad network integration functionalities, delegating to specialized domain services.  
**Logic Description:** Receives requests from the gRPC controller. Determines the target ad network. Calls the appropriate domain service (e.g., CampaignSyncService.createCampaign). Domain services then use the AdNetworkAdapterFactory to get the correct adapter and perform operations. Handles aggregation or high-level error management if needed.  
**Documentation:**
    
    - **Summary:** The central service responsible for coordinating ad network integration tasks. It is called by the gRPC controller and uses various domain-specific services.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/ad-network-integration/service/adapters/core/ad-network-adapter.interface.ts  
**Description:** Defines the common interface that all ad network adapters must implement. Ensures consistency across different network integrations.  
**Template:** TypeScript Interface File  
**Dependancy Level:** 0  
**Name:** IAdNetworkAdapter  
**Type:** Interface  
**Relative Path:** adapters/core/ad-network-adapter.interface.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - Adapter
    
**Members:**
    
    
**Methods:**
    
    - **Name:** getNetworkType  
**Parameters:**
    
    
**Return Type:** AdNetworkType  
**Attributes:**   
    - **Name:** createCampaign  
**Parameters:**
    
    - campaignData: InternalCampaignDto
    
**Return Type:** Promise<InternalCampaignDto>  
**Attributes:**   
    - **Name:** updateAdSet  
**Parameters:**
    
    - adSetData: InternalAdSetDto
    
**Return Type:** Promise<InternalAdSetDto>  
**Attributes:**   
    - **Name:** uploadCreative  
**Parameters:**
    
    - creativeData: InternalCreativeDto
    
**Return Type:** Promise<InternalCreativeDto>  
**Attributes:**   
    - **Name:** getPerformanceMetrics  
**Parameters:**
    
    - params: MetricsRequestParamsDto
    
**Return Type:** Promise<InternalPerformanceMetricsDto>  
**Attributes:**   
    - **Name:** syncAudience  
**Parameters:**
    
    - audienceData: InternalAudienceDto
    
**Return Type:** Promise<InternalAudienceSyncStatusDto>  
**Attributes:**   
    - **Name:** submitProductFeed  
**Parameters:**
    
    - feedData: InternalProductFeedDto
    
**Return Type:** Promise<InternalFeedSubmissionStatusDto>  
**Attributes:**   
    - **Name:** validateCampaignData  
**Parameters:**
    
    - data: any
    
**Return Type:** Promise<ValidationResultDto[]>  
**Attributes:**   
    
**Implemented Features:**
    
    - Ad Network Adapter Contract
    
**Requirement Ids:**
    
    - REQ-TCE-001
    
**Purpose:** Specifies the contract for all ad network adapters, ensuring a unified way to interact with different ad platforms.  
**Logic Description:** Defines methods for all common ad network operations like campaign creation, metric retrieval, audience sync, feed submission, and data validation. Uses internal DTOs for parameters and return types.  
**Documentation:**
    
    - **Summary:** Interface defining the standard operations supported by ad network adapters.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Adapters.Core  
**Metadata:**
    
    - **Category:** Interface
    
- **Path:** src/modules/ad-network-integration/service/adapters/core/base-ad-network.client.ts  
**Description:** Abstract base class or utility for ad network adapters. Implements common HTTP client logic, request signing, error handling, retry, and circuit breaker patterns.  
**Template:** TypeScript Class File  
**Dependancy Level:** 1  
**Name:** BaseAdNetworkClient  
**Type:** Utility  
**Relative Path:** adapters/core/base-ad-network.client.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - AbstractClass
    - RetryPattern
    - CircuitBreaker
    
**Members:**
    
    - **Name:** httpClient  
**Type:** AxiosInstance  
**Attributes:** protected|readonly  
    - **Name:** resilienceFactory  
**Type:** ResilienceFactory  
**Attributes:** protected|readonly  
    - **Name:** logger  
**Type:** LoggerService  
**Attributes:** protected|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - config: AdNetworkClientConfig
    - resilienceFactory: ResilienceFactory
    - logger: LoggerService
    
**Return Type:** void  
**Attributes:** protected  
    - **Name:** requestWithResilience  
**Parameters:**
    
    - method: string
    - url: string
    - data?: any
    - config?: AxiosRequestConfig
    - commandKey: string
    
**Return Type:** Promise<AxiosResponse>  
**Attributes:** protected|async  
    - **Name:** handleError  
**Parameters:**
    
    - error: any
    - context: string
    
**Return Type:** never  
**Attributes:** protected  
    
**Implemented Features:**
    
    - Resilient HTTP Client
    - Common Error Handling
    
**Requirement Ids:**
    
    - REQ-TCE-002
    - REQ-03-007
    
**Purpose:** Provides a foundation for ad network adapters with built-in resilience (retry, circuit breaker) and common utilities.  
**Logic Description:** Initializes an HTTP client (e.g., Axios). Implements a generic request method wrapped with circuit breaker and retry logic using 'opossum' via ResilienceFactory. Includes standardized error parsing and logging. Concrete adapters will extend or use this.  
**Documentation:**
    
    - **Summary:** A base client providing resilient HTTP communication capabilities for ad network adapters.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Adapters.Core  
**Metadata:**
    
    - **Category:** Integration
    
- **Path:** src/modules/ad-network-integration/service/adapters/google/google-ads.adapter.ts  
**Description:** Adapter for interacting with the Google Ads API. Implements IAdNetworkAdapter.  
**Template:** NestJS Service File  
**Dependancy Level:** 2  
**Name:** GoogleAdsAdapter  
**Type:** Adapter  
**Relative Path:** adapters/google/google-ads.adapter.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - Adapter
    - RetryPattern
    - CircuitBreaker
    
**Members:**
    
    - **Name:** googleAdsClient  
**Type:** any  
**Attributes:** private  
    - **Name:** config  
**Type:** GoogleAdsConfig  
**Attributes:** private|readonly  
    - **Name:** baseClient  
**Type:** BaseAdNetworkClient  
**Attributes:** private|readonly  
    - **Name:** mapper  
**Type:** GoogleCampaignMapper  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** getNetworkType  
**Parameters:**
    
    
**Return Type:** AdNetworkType  
**Attributes:** public  
    - **Name:** createCampaign  
**Parameters:**
    
    - campaignData: InternalCampaignDto
    
**Return Type:** Promise<InternalCampaignDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Google Ads API Integration
    
**Requirement Ids:**
    
    - REQ-TCE-001
    - REQ-03-001
    - REQ-03-002
    - REQ-03-003
    - REQ-03-005
    - REQ-03-008
    - REQ-CMO-010
    - REQ-CMO-012
    
**Purpose:** Handles all communication with the Google Ads API, translating internal requests to Google-specific calls and vice-versa.  
**Logic Description:** Implements IAdNetworkAdapter. Uses Google Ads client library or BaseAdNetworkClient for API calls. Maps internal DTOs to Google Ads API request formats and maps responses back. Implements methods for campaign management, ad set config, creative upload, metrics retrieval, audience sync, feed submission, and validation according to Google's API. Uses GoogleAdsConfig for credentials.  
**Documentation:**
    
    - **Summary:** Adapter responsible for all interactions with the Google Ads platform API.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Adapters.Google  
**Metadata:**
    
    - **Category:** Integration
    
- **Path:** src/modules/ad-network-integration/service/adapters/instagram/instagram-ads.adapter.ts  
**Description:** Adapter for interacting with the Instagram Ads API (Facebook Marketing API). Implements IAdNetworkAdapter.  
**Template:** NestJS Service File  
**Dependancy Level:** 2  
**Name:** InstagramAdsAdapter  
**Type:** Adapter  
**Relative Path:** adapters/instagram/instagram-ads.adapter.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - Adapter
    - RetryPattern
    - CircuitBreaker
    
**Members:**
    
    - **Name:** facebookAdsClient  
**Type:** any  
**Attributes:** private  
    
**Methods:**
    
    - **Name:** getNetworkType  
**Parameters:**
    
    
**Return Type:** AdNetworkType  
**Attributes:** public  
    
**Implemented Features:**
    
    - Instagram Ads API Integration
    
**Requirement Ids:**
    
    - REQ-TCE-001
    - REQ-03-001
    - REQ-03-002
    - REQ-03-003
    - REQ-03-005
    - REQ-03-008
    - REQ-CMO-010
    - REQ-CMO-012
    
**Purpose:** Handles all communication with the Instagram Ads API, translating internal requests and responses.  
**Logic Description:** Implements IAdNetworkAdapter. Uses Facebook Marketing API SDK or BaseAdNetworkClient. Maps internal DTOs to Facebook API formats. Implements methods for campaign management, ad set config, creative upload, metrics retrieval, audience sync, feed submission, and validation for Instagram Ads. Uses InstagramAdsConfig.  
**Documentation:**
    
    - **Summary:** Adapter responsible for all interactions with the Instagram Ads (Facebook Marketing API) platform.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Adapters.Instagram  
**Metadata:**
    
    - **Category:** Integration
    
- **Path:** src/modules/ad-network-integration/service/adapters/tiktok/tiktok-ads.adapter.ts  
**Description:** Adapter for interacting with the TikTok Ads API. Implements IAdNetworkAdapter.  
**Template:** NestJS Service File  
**Dependancy Level:** 2  
**Name:** TikTokAdsAdapter  
**Type:** Adapter  
**Relative Path:** adapters/tiktok/tiktok-ads.adapter.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - Adapter
    - RetryPattern
    - CircuitBreaker
    
**Members:**
    
    - **Name:** tiktokAdsClient  
**Type:** any  
**Attributes:** private  
    
**Methods:**
    
    - **Name:** getNetworkType  
**Parameters:**
    
    
**Return Type:** AdNetworkType  
**Attributes:** public  
    
**Implemented Features:**
    
    - TikTok Ads API Integration
    
**Requirement Ids:**
    
    - REQ-TCE-001
    - REQ-03-001
    - REQ-03-002
    - REQ-03-003
    - REQ-03-005
    - REQ-03-008
    - REQ-CMO-010
    - REQ-CMO-012
    
**Purpose:** Handles all communication with the TikTok Ads API, translating internal requests and responses.  
**Logic Description:** Implements IAdNetworkAdapter. Uses TikTok Ads API SDK or BaseAdNetworkClient. Maps internal DTOs to TikTok API formats. Implements methods for campaign management, ad set config, creative upload, metrics retrieval, audience sync, feed submission, and validation for TikTok Ads. Uses TikTokAdsConfig.  
**Documentation:**
    
    - **Summary:** Adapter responsible for all interactions with the TikTok Ads platform API.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Adapters.TikTok  
**Metadata:**
    
    - **Category:** Integration
    
- **Path:** src/modules/ad-network-integration/service/adapters/snapchat/snapchat-ads.adapter.ts  
**Description:** Adapter for interacting with the Snapchat Ads API. Implements IAdNetworkAdapter.  
**Template:** NestJS Service File  
**Dependancy Level:** 2  
**Name:** SnapchatAdsAdapter  
**Type:** Adapter  
**Relative Path:** adapters/snapchat/snapchat-ads.adapter.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - Adapter
    - RetryPattern
    - CircuitBreaker
    
**Members:**
    
    - **Name:** snapchatAdsClient  
**Type:** any  
**Attributes:** private  
    
**Methods:**
    
    - **Name:** getNetworkType  
**Parameters:**
    
    
**Return Type:** AdNetworkType  
**Attributes:** public  
    
**Implemented Features:**
    
    - Snapchat Ads API Integration
    
**Requirement Ids:**
    
    - REQ-TCE-001
    - REQ-03-001
    - REQ-03-002
    - REQ-03-003
    - REQ-03-005
    - REQ-03-008
    - REQ-CMO-010
    - REQ-CMO-012
    
**Purpose:** Handles all communication with the Snapchat Ads API, translating internal requests and responses.  
**Logic Description:** Implements IAdNetworkAdapter. Uses Snapchat Ads API SDK or BaseAdNetworkClient. Maps internal DTOs to Snapchat API formats. Implements methods for campaign management, ad set config, creative upload, metrics retrieval, audience sync, feed submission, and validation for Snapchat Ads. Uses SnapchatAdsConfig.  
**Documentation:**
    
    - **Summary:** Adapter responsible for all interactions with the Snapchat Ads platform API.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Adapters.Snapchat  
**Metadata:**
    
    - **Category:** Integration
    
- **Path:** src/modules/ad-network-integration/service/domain/services/campaign-sync.service.ts  
**Description:** Domain service responsible for campaign and ad set synchronization logic across different ad networks.  
**Template:** NestJS Service File  
**Dependancy Level:** 2  
**Name:** CampaignSyncService  
**Type:** Service  
**Relative Path:** domain/services/campaign-sync.service.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - ServiceLayer
    - DomainService
    
**Members:**
    
    - **Name:** adapterFactory  
**Type:** AdNetworkAdapterFactory  
**Attributes:** private|readonly  
    - **Name:** policyValidatorService  
**Type:** PolicyValidatorService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** createCampaign  
**Parameters:**
    
    - adNetwork: AdNetworkType
    - campaignData: InternalCampaignDto
    
**Return Type:** Promise<InternalCampaignDto>  
**Attributes:** public|async  
    - **Name:** updateAdSet  
**Parameters:**
    
    - adNetwork: AdNetworkType
    - adSetData: InternalAdSetDto
    
**Return Type:** Promise<InternalAdSetDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Campaign Creation Logic
    - Ad Set Update Logic
    - Cross-Network Campaign Management
    
**Requirement Ids:**
    
    - REQ-TCE-001
    - REQ-03-001
    - REQ-CMO-010
    
**Purpose:** Handles the business logic for creating, updating, and managing the lifecycle of campaigns and ad sets on ad networks.  
**Logic Description:** Uses AdNetworkAdapterFactory to get the specific adapter. Before sending data to an adapter for creation/update, it invokes PolicyValidatorService to ensure compliance (REQ-CMO-010, REQ-TCE-003). Manages internal state or orchestration if a campaign spans multiple networks or requires complex synchronization steps.  
**Documentation:**
    
    - **Summary:** Service for managing the synchronization of campaign and ad set data with ad networks.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Domain.Services  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/ad-network-integration/service/domain/services/creative-sync.service.ts  
**Description:** Domain service for managing ad creative synchronization with ad networks.  
**Template:** NestJS Service File  
**Dependancy Level:** 2  
**Name:** CreativeSyncService  
**Type:** Service  
**Relative Path:** domain/services/creative-sync.service.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - ServiceLayer
    - DomainService
    
**Members:**
    
    - **Name:** adapterFactory  
**Type:** AdNetworkAdapterFactory  
**Attributes:** private|readonly  
    - **Name:** policyValidatorService  
**Type:** PolicyValidatorService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** uploadAndAssociateCreative  
**Parameters:**
    
    - adNetwork: AdNetworkType
    - creativeData: InternalCreativeDto
    - adIdOrAdSetId: string
    
**Return Type:** Promise<InternalCreativeDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Ad Creative Upload
    - Creative Association
    
**Requirement Ids:**
    
    - REQ-TCE-001
    - REQ-03-001
    - REQ-CMO-010
    
**Purpose:** Manages the uploading of ad creatives and their association with ads or ad sets on various ad networks.  
**Logic Description:** Uses the appropriate ad network adapter to upload creative assets. Ensures creatives adhere to network specifications by calling PolicyValidatorService before upload. Handles association logic based on ad network APIs.  
**Documentation:**
    
    - **Summary:** Service dedicated to managing ad creatives across integrated ad networks.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Domain.Services  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/ad-network-integration/service/domain/services/metrics-retrieval.service.ts  
**Description:** Domain service for retrieving performance metrics from ad networks.  
**Template:** NestJS Service File  
**Dependancy Level:** 2  
**Name:** MetricsRetrievalService  
**Type:** Service  
**Relative Path:** domain/services/metrics-retrieval.service.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - ServiceLayer
    - DomainService
    
**Members:**
    
    - **Name:** adapterFactory  
**Type:** AdNetworkAdapterFactory  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** fetchPerformanceMetrics  
**Parameters:**
    
    - adNetwork: AdNetworkType
    - params: MetricsRequestParamsDto
    
**Return Type:** Promise<InternalPerformanceMetricsDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Performance Metrics Retrieval
    
**Requirement Ids:**
    
    - REQ-TCE-001
    - REQ-03-002
    
**Purpose:** Responsible for fetching comprehensive performance metrics (spend, impressions, clicks, etc.) from ad networks.  
**Logic Description:** Uses the specified ad network adapter to retrieve metrics based on given parameters (e.g., date range, campaign IDs). May involve logic for standardizing metrics if they differ significantly between networks.  
**Documentation:**
    
    - **Summary:** Service for fetching campaign performance metrics from ad networks.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Domain.Services  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/ad-network-integration/service/domain/services/audience-sync.service.ts  
**Description:** Domain service for synchronizing custom and lookalike audiences with ad networks.  
**Template:** NestJS Service File  
**Dependancy Level:** 2  
**Name:** AudienceSyncService  
**Type:** Service  
**Relative Path:** domain/services/audience-sync.service.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - ServiceLayer
    - DomainService
    
**Members:**
    
    - **Name:** adapterFactory  
**Type:** AdNetworkAdapterFactory  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** synchronizeAudience  
**Parameters:**
    
    - adNetwork: AdNetworkType
    - audienceData: InternalAudienceDto
    
**Return Type:** Promise<InternalAudienceSyncStatusDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Audience Synchronization
    - Lookalike Audience Creation Trigger
    
**Requirement Ids:**
    
    - REQ-TCE-001
    - REQ-03-008
    - REQ-CMO-012
    
**Purpose:** Manages the synchronization of audience segments (custom, lookalike) with ad networks that support them.  
**Logic Description:** Interfaces with ad network adapters to create, update, or share audience lists. Handles any data transformation needed for specific network requirements (e.g., PII hashing compliance).  
**Documentation:**
    
    - **Summary:** Service responsible for synchronizing audience data with ad networks.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Domain.Services  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/ad-network-integration/service/domain/services/feed-submission.service.ts  
**Description:** Domain service for submitting and synchronizing product catalog feeds to ad networks.  
**Template:** NestJS Service File  
**Dependancy Level:** 2  
**Name:** FeedSubmissionService  
**Type:** Service  
**Relative Path:** domain/services/feed-submission.service.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - ServiceLayer
    - DomainService
    
**Members:**
    
    - **Name:** adapterFactory  
**Type:** AdNetworkAdapterFactory  
**Attributes:** private|readonly  
    - **Name:** policyValidatorService  
**Type:** PolicyValidatorService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** submitProductFeed  
**Parameters:**
    
    - adNetwork: AdNetworkType
    - feedData: InternalProductFeedDto
    
**Return Type:** Promise<InternalFeedSubmissionStatusDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Product Feed Submission
    - Feed Synchronization Monitoring
    
**Requirement Ids:**
    
    - REQ-TCE-001
    - REQ-03-003
    - REQ-03-005
    
**Purpose:** Handles the submission of product catalog feeds to ad networks and monitors their synchronization status.  
**Logic Description:** Validates feed data against network specifications using PolicyValidatorService (REQ-03-005). Uses ad network adapters to submit feeds. May also handle scheduling of feed updates or polling for sync status.  
**Documentation:**
    
    - **Summary:** Service for managing product catalog feed submissions to ad networks.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Domain.Services  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/ad-network-integration/service/domain/services/policy-validator.service.ts  
**Description:** Domain service for validating campaign data, creatives, and product feeds against ad network policies and technical specifications.  
**Template:** NestJS Service File  
**Dependancy Level:** 1  
**Name:** PolicyValidatorService  
**Type:** Service  
**Relative Path:** domain/services/policy-validator.service.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - ServiceLayer
    - DomainService
    - Strategy
    
**Members:**
    
    - **Name:** adapterFactory  
**Type:** AdNetworkAdapterFactory  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** validateCampaignData  
**Parameters:**
    
    - adNetwork: AdNetworkType
    - campaignData: InternalCampaignDto
    
**Return Type:** Promise<ValidationResultDto[]>  
**Attributes:** public|async  
    - **Name:** validateCreative  
**Parameters:**
    
    - adNetwork: AdNetworkType
    - creativeData: InternalCreativeDto
    
**Return Type:** Promise<ValidationResultDto[]>  
**Attributes:** public|async  
    - **Name:** validateProductFeed  
**Parameters:**
    
    - adNetwork: AdNetworkType
    - feedData: InternalProductFeedDto
    
**Return Type:** Promise<ValidationResultDto[]>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Ad Network Policy Validation
    - Technical Specification Checks
    
**Requirement Ids:**
    
    - REQ-TCE-003
    - REQ-03-005
    - REQ-03-006
    - REQ-CMO-010
    
**Purpose:** Provides validation services to ensure compliance with ad network advertising standards, content policies, and technical specifications.  
**Logic Description:** Contains logic to check data against rules for each ad network. This might involve calling ad network validation APIs via adapters, or implementing rule engines. Returns clear error messages for non-compliance.  
**Documentation:**
    
    - **Summary:** Service responsible for validating data against ad network policies and specifications.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Domain.Services  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/ad-network-integration/service/dto/request/create-campaign.request.dto.ts  
**Description:** Data Transfer Object for create campaign requests via gRPC. Likely generated from .proto or manually created to match.  
**Template:** TypeScript Class File  
**Dependancy Level:** 0  
**Name:** CreateCampaignRequestDto  
**Type:** DTO  
**Relative Path:** dto/request/create-campaign.request.dto.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** adNetwork  
**Type:** AdNetworkType  
**Attributes:** public  
    - **Name:** name  
**Type:** string  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    
**Requirement Ids:**
    
    - REQ-TCE-001
    
**Purpose:** Defines the structure for requests to create a new advertising campaign.  
**Logic Description:** Contains fields like adNetwork, name, budget, schedule, etc., necessary for campaign creation. Includes validation decorators if not purely proto-generated.  
**Documentation:**
    
    - **Summary:** DTO for creating a new advertising campaign.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Dto.Request  
**Metadata:**
    
    - **Category:** DataContract
    
- **Path:** src/modules/ad-network-integration/service/dto/response/campaign-details.response.dto.ts  
**Description:** Data Transfer Object for campaign details responses via gRPC.  
**Template:** TypeScript Class File  
**Dependancy Level:** 0  
**Name:** CampaignDetailsResponseDto  
**Type:** DTO  
**Relative Path:** dto/response/campaign-details.response.dto.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public  
    - **Name:** name  
**Type:** string  
**Attributes:** public  
    - **Name:** status  
**Type:** string  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    
**Requirement Ids:**
    
    - REQ-TCE-001
    
**Purpose:** Defines the structure for responses containing details of an advertising campaign.  
**Logic Description:** Contains fields like id, name, status, budget, etc., representing a campaign's state.  
**Documentation:**
    
    - **Summary:** DTO for returning campaign details.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Dto.Response  
**Metadata:**
    
    - **Category:** DataContract
    
- **Path:** src/modules/ad-network-integration/service/config/ad-network.configuration.ts  
**Description:** Configuration loader for ad network integration settings using NestJS ConfigModule. Loads API keys, base URLs, etc.  
**Template:** NestJS Configuration File  
**Dependancy Level:** 0  
**Name:** adNetworkConfiguration  
**Type:** Configuration  
**Relative Path:** config/ad-network.configuration.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** default  
**Parameters:**
    
    
**Return Type:** AdNetworkConfig  
**Attributes:** export  
    
**Implemented Features:**
    
    - Ad Network Configuration Loading
    
**Requirement Ids:**
    
    - REQ-TCE-001
    
**Purpose:** Provides a typed configuration object for ad network settings, loaded from environment variables or other sources.  
**Logic Description:** Uses NestJS 'registerAs' to define a configuration namespace. Loads environment variables for Google Ads API Key, Facebook App Secret, TikTok Access Token, etc. Validates required variables using a Joi schema or class-validator on AdNetworkConfig interface.  
**Documentation:**
    
    - **Summary:** Loads and provides access to ad network API credentials and other configurations.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/ad-network-integration/service/config/ad-network.config.interface.ts  
**Description:** TypeScript interface defining the structure for ad network configurations.  
**Template:** TypeScript Interface File  
**Dependancy Level:** 0  
**Name:** AdNetworkConfig  
**Type:** Interface  
**Relative Path:** config/ad-network.config.interface.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** google  
**Type:** GoogleAdsApiConfig  
**Attributes:**   
    - **Name:** instagram  
**Type:** InstagramAdsApiConfig  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    
**Requirement Ids:**
    
    
**Purpose:** Defines the expected shape of the configuration object for all supported ad networks.  
**Logic Description:** Includes nested interfaces like GoogleAdsApiConfig (developerToken, clientId, clientSecret), InstagramAdsApiConfig (appId, appSecret, accessToken), etc.  
**Documentation:**
    
    - **Summary:** Interface for strongly-typed ad network configuration.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/ad-network-integration/service/common/enums.ts  
**Description:** Common enumerations used within the ad network integration module.  
**Template:** TypeScript Enum File  
**Dependancy Level:** 0  
**Name:** enums  
**Type:** Enum  
**Relative Path:** common/enums.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Shared Enumerations
    
**Requirement Ids:**
    
    
**Purpose:** Provides standardized enum types for concepts like AdNetworkType, CampaignStatus, CreativeType, etc.  
**Logic Description:** Exports enums: AdNetworkType { GOOGLE, INSTAGRAM, TIKTOK, SNAPCHAT }, CampaignStatus { DRAFT, ACTIVE, PAUSED, ARCHIVED }, etc.  
**Documentation:**
    
    - **Summary:** Contains common enumerations for the ad network integration module.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Common  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** src/modules/ad-network-integration/service/common/utils/data-mapper.factory.ts  
**Description:** Factory for creating data mappers to convert between internal DTOs and ad network-specific DTOs.  
**Template:** NestJS Factory Provider  
**Dependancy Level:** 1  
**Name:** DataMapperFactory  
**Type:** Factory  
**Relative Path:** common/utils/data-mapper.factory.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - Factory
    
**Members:**
    
    
**Methods:**
    
    - **Name:** getMapper  
**Parameters:**
    
    - networkType: AdNetworkType
    
**Return Type:** IBaseDataMapper  
**Attributes:** public  
    
**Implemented Features:**
    
    - Data Mapping Strategy
    
**Requirement Ids:**
    
    - REQ-TCE-001
    
**Purpose:** Provides a centralized way to obtain data mappers responsible for transforming data structures between the internal system and external ad networks.  
**Logic Description:** Contains a switch or map to return an instance of a specific network mapper (e.g., GoogleCampaignMapper, InstagramCreativeMapper) based on the AdNetworkType. Mappers implement a common IBaseDataMapper interface.  
**Documentation:**
    
    - **Summary:** Factory to create instances of data mappers for different ad networks.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Common.Utils  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** src/modules/ad-network-integration/service/common/utils/resilience.factory.ts  
**Description:** Factory for creating and configuring circuit breaker (opossum) instances for ad network API calls.  
**Template:** NestJS Factory Provider  
**Dependancy Level:** 0  
**Name:** ResilienceFactory  
**Type:** Factory  
**Relative Path:** common/utils/resilience.factory.ts  
**Repository Id:** REPO-ADNETINT-003  
**Pattern Ids:**
    
    - Factory
    - CircuitBreaker
    
**Members:**
    
    
**Methods:**
    
    - **Name:** createCircuitBreaker  
**Parameters:**
    
    - commandKey: string
    - options?: opossum.Options
    
**Return Type:** opossum  
**Attributes:** public  
    
**Implemented Features:**
    
    - Circuit Breaker Configuration
    
**Requirement Ids:**
    
    - REQ-TCE-002
    - REQ-03-007
    
**Purpose:** Centralizes the creation and configuration of circuit breaker instances using 'opossum'.  
**Logic Description:** Provides a method to create an 'opossum' CircuitBreaker instance with default or command-specific options (timeout, errorThresholdPercentage, resetTimeout). This factory would be used by BaseAdNetworkClient or individual adapters.  
**Documentation:**
    
    - **Summary:** Factory for creating configured circuit breaker instances for resilient API calls.
    
**Namespace:** AdManager.AdNetworkIntegration.Service.V1.Common.Utils  
**Metadata:**
    
    - **Category:** Utility
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableGoogleAdsIntegration
  - enableInstagramAdsIntegration
  - enableTikTokAdsIntegration
  - enableSnapchatAdsIntegration
  - enableAudienceSyncDetailedLogging
  
- **Database Configs:**
  
  


---

