# Software Design Specification: AdNetworkIntegration.ServiceApi

## 1. Introduction

### 1.1 Purpose
This document provides the detailed software design specification for the `AdNetworkIntegration.ServiceApi` repository. This repository is responsible for providing an internal gRPC-based service API that enables other Ad Manager services to interact with various external ad network platforms. Its core functionalities include campaign synchronization, creative management, performance metric retrieval, audience synchronization, and product feed submissions, all while incorporating resilience patterns.

### 1.2 Scope
The scope of this document is limited to the `AdNetworkIntegration.ServiceApi` repository. It covers:
*   The gRPC service definition and its implementation.
*   The internal services orchestrating ad network operations.
*   Adapter implementations for specific ad networks (Google Ads, Instagram Ads, TikTok Ads, Snapchat Ads).
*   Resilience mechanisms (retry, circuit breaker) for external API calls.
*   Data mapping and validation logic specific to ad network interactions.
*   Configuration management for ad network credentials and settings.

This service API is internal and not directly exposed to merchants.

### 1.3 Definitions, Acronyms, and Abbreviations
*   **API**: Application Programming Interface
*   **gRPC**: Google Remote Procedure Call
*   **Proto**: Protocol Buffers
*   **DTO**: Data Transfer Object
*   **SDK**: Software Development Kit
*   **HTTP**: Hypertext Transfer Protocol
*   **JSON**: JavaScript Object Notation
*   **JWT**: JSON Web Token
*   **SQS**: Simple Queue Service (Amazon)
*   **SNS**: Simple Notification Service (Amazon)
*   **IAM**: Identity and Access Management
*   **REQ**: Requirement ID
*   **SDS**: Software Design Specification
*   **CDK**: Cloud Development Kit (AWS)
*   **IaC**: Infrastructure as Code
*   **ROAS**: Return On Ad Spend
*   **CPA**: Cost Per Acquisition
*   **PII**: Personally Identifiable Information

### 1.4 References
*   Overall System Architecture Document
*   User Requirements Document (SRS)
*   `AdNetworkIntegration.ServiceApi` Repository Definition
*   Sequence Diagrams related to Ad Network Integration
*   NestJS Documentation: [https://docs.nestjs.com/](https://docs.nestjs.com/)
*   gRPC Documentation: [https://grpc.io/docs/](https://grpc.io/docs/)
*   Protocol Buffers Documentation: [https://protobuf.dev/](https://protobuf.dev/)
*   Opossum (Circuit Breaker) Documentation: [https://github.com/nodeshift/opossum](https://github.com/nodeshift/opossum)

## 2. System Overview
The `AdNetworkIntegration.ServiceApi` is a microservice within the larger Ad Manager Platform. It acts as a centralized gateway and abstraction layer for all interactions with external ad network APIs. Other internal Ad Manager services (e.g., Campaign Management Service, Analytics Service) will communicate with this service via gRPC to perform operations on external ad networks. This service abstracts the complexities and inconsistencies of various ad network APIs, providing a unified internal interface.

Key responsibilities include:
*   Translating internal Ad Manager domain models to ad network-specific formats and vice-versa.
*   Managing secure communication and authentication with ad network APIs.
*   Implementing resilience patterns (retries, circuit breakers) for external calls.
*   Validating data against ad network policies and specifications.

## 3. Functional Design

### 3.1 gRPC Service Definition (`ad_network_integration.v1.proto`, `common.v1.proto`)

#### 3.1.1 `ad_network_integration.v1.proto`
This file defines the primary gRPC service `AdNetworkIntegration` and its associated RPC methods and messages.

protobuf
syntax = "proto3";

package AdManager.AdNetworkIntegration.Service.V1;

import "common.v1.proto"; // Import common types

option csharp_namespace = "AdManager.AdNetworkIntegration.Service.V1.Grpc";

// Main service for ad network integration
service AdNetworkIntegration {
  // Campaign Management
  rpc CreateCampaign (CreateCampaignRequest) returns (CreateCampaignResponse);
  rpc UpdateCampaign (UpdateCampaignRequest) returns (UpdateCampaignResponse); // Added
  rpc GetCampaign (GetCampaignRequest) returns (CampaignDetailsResponse); // Added
  rpc UpdateAdSet (UpdateAdSetRequest) returns (UpdateAdSetResponse);
  rpc GetAdSet (GetAdSetRequest) returns (AdSetDetailsResponse); // Added

  // Creative Management
  rpc UploadCreative (UploadCreativeRequest) returns (UploadCreativeResponse);
  rpc GetCreative (GetCreativeRequest) returns (CreativeDetailsResponse); // Added

  // Performance Metrics
  rpc GetPerformanceMetrics (GetPerformanceMetricsRequest) returns (GetPerformanceMetricsResponse);

  // Audience Synchronization
  rpc SyncAudience (SyncAudienceRequest) returns (SyncAudienceResponse);
  rpc GetAudienceSyncStatus (GetAudienceSyncStatusRequest) returns (AudienceSyncStatusResponse); // Added

  // Product Feed Submission
  rpc SubmitProductFeed (SubmitProductFeedRequest) returns (SubmitProductFeedResponse);
  rpc GetProductFeedStatus (GetProductFeedStatusRequest) returns (ProductFeedStatusResponse); // Added

  // Validation
  rpc ValidateCampaignData (ValidateCampaignDataRequest) returns (ValidateCampaignDataResponse);
  rpc ValidateCreativeData (ValidateCreativeDataRequest) returns (ValidateCreativeDataResponse); // Added
  rpc ValidateFeedData (ValidateFeedDataRequest) returns (ValidateFeedDataResponse); // Added
}

// --- Message Definitions ---

// Common Structures
message Campaign {
  string id = 1;
  string name = 2;
  AdManager.Common.V1.CampaignStatus status = 3;
  double budget = 4;
  string start_date = 5; // ISO 8601 format
  string end_date = 6;   // ISO 8601 format
  AdManager.Common.V1.AdNetworkType ad_network = 7;
  string merchant_id = 8;
  // Add other common campaign fields as needed
}

message AdSet {
  string id = 1;
  string campaign_id = 2;
  string name = 3;
  AdManager.Common.V1.AdSetStatus status = 4; // Added
  double budget = 5;
  // Add other common ad set fields
}

message Creative {
  string id = 1;
  string name = 2;
  AdManager.Common.V1.CreativeType type = 3;
  string asset_url = 4; // URL to the creative asset
  map<string, string> metadata = 5; // e.g., headline, body text
  AdManager.Common.V1.AdNetworkType ad_network = 6;
  string merchant_id = 7;
}

message PerformanceMetrics {
  string campaign_id = 1;
  string ad_set_id = 2;
  string ad_id = 3;
  int64 impressions = 4;
  int64 clicks = 5;
  int64 conversions = 6;
  double spend = 7;
  double roas = 8;
  double cpa = 9;
  // Add other relevant metrics
}

message Audience {
  string id = 1;
  string name = 2;
  AdManager.Common.V1.AudienceType type = 3;
  string description = 4;
  int64 size = 5;
  AdManager.Common.V1.AdNetworkType ad_network = 6;
  string merchant_id = 7;
  // PII data for custom audiences will not be passed directly.
  // Instead, an identifier to a pre-synced or to-be-synced audience list might be used.
  // Or, the service might receive instructions to build an audience from platform data.
}

message ProductFeed {
  string id = 1;
  string name = 2;
  string feed_url = 3; // URL if hosted, or content if submitted directly
  bytes feed_content = 4; // For direct submission
  AdManager.Common.V1.FeedFormat format = 5; // Added
  AdManager.Common.V1.AdNetworkType ad_network = 6;
  string merchant_id = 7;
}

message ValidationResultItem {
  string field_path = 1;
  string message = 2;
  AdManager.Common.V1.ValidationSeverity severity = 3;
}

// CreateCampaign
message CreateCampaignRequest {
  AdManager.Common.V1.AdNetworkType ad_network = 1;
  string merchant_id = 2;
  string name = 3;
  double budget = 4;
  string start_date = 5;
  string end_date = 6;
  AdManager.Common.V1.CampaignStatus initial_status = 7;
  // ... other campaign parameters
}
message CreateCampaignResponse {
  string campaign_id = 1;
  AdManager.Common.V1.Status status = 2;
  AdManager.Common.V1.ErrorDetail error = 3;
}

// UpdateCampaign (Added)
message UpdateCampaignRequest {
  AdManager.Common.V1.AdNetworkType ad_network = 1;
  string campaign_id = 2;
  string merchant_id = 3;
  optional string name = 4;
  optional double budget = 5;
  optional string start_date = 6;
  optional string end_date = 7;
  optional AdManager.Common.V1.CampaignStatus campaign_status = 8;
}
message UpdateCampaignResponse {
  string campaign_id = 1;
  AdManager.Common.V1.Status status = 2;
  AdManager.Common.V1.ErrorDetail error = 3;
}

// GetCampaign (Added)
message GetCampaignRequest {
  AdManager.Common.V1.AdNetworkType ad_network = 1;
  string campaign_id = 2;
  string merchant_id = 3;
}
// CampaignDetailsResponse (Reused from file structure suggestion if it aligns, or new one)
message CampaignDetailsResponse {
  Campaign campaign = 1;
  AdManager.Common.V1.Status status = 2;
  AdManager.Common.V1.ErrorDetail error = 3;
}


// UpdateAdSet
message UpdateAdSetRequest {
  AdManager.Common.V1.AdNetworkType ad_network = 1;
  string ad_set_id = 2;
  string merchant_id = 3;
  // ... ad set parameters to update
  optional string name = 4;
  optional double budget = 5;
  optional AdManager.Common.V1.AdSetStatus ad_set_status = 6;
}
message UpdateAdSetResponse {
  string ad_set_id = 1;
  AdManager.Common.V1.Status status = 2;
  AdManager.Common.V1.ErrorDetail error = 3;
}

// GetAdSet (Added)
message GetAdSetRequest {
    AdManager.Common.V1.AdNetworkType ad_network = 1;
    string ad_set_id = 2;
    string merchant_id = 3;
}
message AdSetDetailsResponse {
    AdSet ad_set = 1;
    AdManager.Common.V1.Status status = 2;
    AdManager.Common.V1.ErrorDetail error = 3;
}


// UploadCreative
message UploadCreativeRequest {
  AdManager.Common.V1.AdNetworkType ad_network = 1;
  string merchant_id = 2;
  string name = 3;
  AdManager.Common.V1.CreativeType type = 4;
  string asset_url = 5; // if pre-uploaded
  bytes asset_content = 6; // if submitting raw bytes
  string file_name = 7; // if submitting raw bytes
  map<string, string> metadata = 8;
}
message UploadCreativeResponse {
  string creative_id = 1;
  AdManager.Common.V1.Status status = 2;
  AdManager.Common.V1.ErrorDetail error = 3;
}

// GetCreative (Added)
message GetCreativeRequest {
    AdManager.Common.V1.AdNetworkType ad_network = 1;
    string creative_id = 2;
    string merchant_id = 3;
}
message CreativeDetailsResponse {
    Creative creative = 1;
    AdManager.Common.V1.Status status = 2;
    AdManager.Common.V1.ErrorDetail error = 3;
}

// GetPerformanceMetrics
message GetPerformanceMetricsRequest {
  AdManager.Common.V1.AdNetworkType ad_network = 1;
  string merchant_id = 2;
  repeated string campaign_ids = 3;
  repeated string ad_set_ids = 4;
  repeated string ad_ids = 5;
  string start_date = 6;
  string end_date = 7;
  AdManager.Common.V1.Granularity granularity = 8; // DAILY, HOURLY, etc. (from common.v1.proto)
}
message GetPerformanceMetricsResponse {
  repeated PerformanceMetrics metrics = 1;
  AdManager.Common.V1.Status status = 2;
  AdManager.Common.V1.ErrorDetail error = 3;
}

// SyncAudience
message SyncAudienceRequest {
  AdManager.Common.V1.AdNetworkType ad_network = 1;
  string merchant_id = 2;
  string audience_id_platform = 3; // Ad Manager's internal audience ID
  string name = 4;
  AdManager.Common.V1.AudienceType type = 5;
  string description = 6;
  // For custom audiences, this might trigger a lookup/sync from a shared data store,
  // or involve sending hashed PII if the network supports it and compliance is met.
  // For this internal API, we might pass an identifier to a list of user segments.
  repeated string user_segment_ids = 7;
}
message SyncAudienceResponse {
  string audience_id_network = 1; // ID on the ad network
  AdManager.Common.V1.AudienceSyncStatus sync_status = 2;
  AdManager.Common.V1.Status status = 3;
  AdManager.Common.V1.ErrorDetail error = 4;
}

// GetAudienceSyncStatus (Added)
message GetAudienceSyncStatusRequest {
    AdManager.Common.V1.AdNetworkType ad_network = 1;
    string audience_id_network = 2; // ID on the ad network
    string merchant_id = 3;
}
message AudienceSyncStatusResponse {
    Audience audience_details = 1; // Includes sync status if part of Audience message
    AdManager.Common.V1.AudienceSyncStatus sync_status = 2;
    AdManager.Common.V1.Status status = 3;
    AdManager.Common.V1.ErrorDetail error = 4;
}

// SubmitProductFeed
message SubmitProductFeedRequest {
  AdManager.Common.V1.AdNetworkType ad_network = 1;
  string merchant_id = 2;
  string catalog_id_platform = 3; // Ad Manager's internal catalog ID
  string feed_url = 4; // If feed is hosted
  bytes feed_content = 5; // If submitting raw content
  AdManager.Common.V1.FeedFormat feed_format = 6;
}
message SubmitProductFeedResponse {
  string feed_id_network = 1; // ID on the ad network
  AdManager.Common.V1.FeedSubmissionStatus submission_status = 2;
  AdManager.Common.V1.Status status = 3;
  AdManager.Common.V1.ErrorDetail error = 4;
}

// GetProductFeedStatus (Added)
message GetProductFeedStatusRequest {
    AdManager.Common.V1.AdNetworkType ad_network = 1;
    string feed_id_network = 2; // ID on the ad network
    string merchant_id = 3;
}
message ProductFeedStatusResponse {
    ProductFeed feed_details = 1;
    AdManager.Common.V1.FeedSubmissionStatus submission_status = 2;
    AdManager.Common.V1.Status status = 3;
    AdManager.Common.V1.ErrorDetail error = 4;
}

// ValidateCampaignData
message ValidateCampaignDataRequest {
  AdManager.Common.V1.AdNetworkType ad_network = 1;
  string merchant_id = 2;
  Campaign campaign_data = 3; // Full campaign data to validate
  // ... potentially specific ad set data, ad data if validating whole structure
}
message ValidateCampaignDataResponse {
  repeated ValidationResultItem results = 1;
  AdManager.Common.V1.Status status = 2;
  AdManager.Common.V1.ErrorDetail error = 3;
}

// ValidateCreativeData (Added)
message ValidateCreativeDataRequest {
  AdManager.Common.V1.AdNetworkType ad_network = 1;
  string merchant_id = 2;
  Creative creative_data = 3;
}
message ValidateCreativeDataResponse {
  repeated ValidationResultItem results = 1;
  AdManager.Common.V1.Status status = 2;
  AdManager.Common.V1.ErrorDetail error = 3;
}

// ValidateFeedData (Added)
message ValidateFeedDataRequest {
  AdManager.Common.V1.AdNetworkType ad_network = 1;
  string merchant_id = 2;
  ProductFeed feed_data = 3; // URL or content
}
message ValidateFeedDataResponse {
  repeated ValidationResultItem results = 1;
  AdManager.Common.V1.Status status = 2;
  AdManager.Common.V1.ErrorDetail error = 3;
}


#### 3.1.2 `common.v1.proto`
This file defines common enumerations and messages used by `ad_network_integration.v1.proto` and potentially other gRPC services.

protobuf
syntax = "proto3";

package AdManager.Common.V1;

option csharp_namespace = "AdManager.Common.V1.Grpc";

enum AdNetworkType {
  AD_NETWORK_TYPE_UNSPECIFIED = 0;
  GOOGLE_ADS = 1;
  INSTAGRAM_ADS = 2; // (Facebook Marketing API)
  TIKTOK_ADS = 3;
  SNAPCHAT_ADS = 4;
}

enum CampaignStatus {
  CAMPAIGN_STATUS_UNSPECIFIED = 0;
  DRAFT = 1;
  ACTIVE = 2;
  PAUSED = 3;
  ARCHIVED = 4;
  REMOVED = 5; // Or Deleted
  PENDING_REVIEW = 6;
  REJECTED = 7;
}

enum AdSetStatus {
  AD_SET_STATUS_UNSPECIFIED = 0;
  DRAFT = 1;
  ACTIVE = 2;
  PAUSED = 3;
  ARCHIVED = 4;
  REMOVED = 5;
  PENDING_REVIEW = 6;
  REJECTED = 7;
}


enum CreativeType {
  CREATIVE_TYPE_UNSPECIFIED = 0;
  IMAGE = 1;
  VIDEO = 2;
  TEXT = 3;
  CAROUSEL = 4;
  HTML5 = 5;
}

enum AudienceType {
  AUDIENCE_TYPE_UNSPECIFIED = 0;
  CUSTOM_AUDIENCE = 1;
  LOOKALIKE_AUDIENCE = 2;
  INTEREST_BASED = 3;
  DEMOGRAPHIC_BASED = 4;
}

enum AudienceSyncStatus {
  AUDIENCE_SYNC_STATUS_UNSPECIFIED = 0;
  PENDING = 1;
  IN_PROGRESS = 2;
  COMPLETED = 3;
  FAILED = 4;
  NEEDS_ATTENTION = 5;
}

enum FeedFormat {
  FEED_FORMAT_UNSPECIFIED = 0;
  CSV = 1;
  XML = 2;
  TSV = 3;
  JSON = 4; // For some networks
}

enum FeedSubmissionStatus {
  FEED_SUBMISSION_STATUS_UNSPECIFIED = 0;
  SUBMITTED = 1;
  PROCESSING = 2;
  SUCCESS = 3;
  FAILED_VALIDATION = 4;
  FAILED_PROCESSING = 5;
  PARTIAL_SUCCESS = 6;
}

enum ValidationSeverity {
  VALIDATION_SEVERITY_UNSPECIFIED = 0;
  ERROR = 1;   // Blocks submission
  WARNING = 2; // May cause issues, informational
  INFO = 3;
}

enum Status {
  STATUS_UNSPECIFIED = 0;
  SUCCESS = 1;
  FAILURE = 2;
  PARTIAL_SUCCESS = 3;
}

enum Granularity {
  GRANULARITY_UNSPECIFIED = 0;
  DAILY = 1;
  HOURLY = 2;
  TOTAL = 3; // Overall summary
}

message ErrorDetail {
  int32 code = 1;         // Internal error code or ad network error code
  string message = 2;     // Human-readable error message
  string details = 3;     // Additional details or stack trace (for internal logging)
  string ad_network_error_code = 4; // Specific error code from the ad network if available
}

message PagingInfo {
  int32 page_size = 1;
  string next_page_token = 2;
}


### 3.2 Controller (`AdNetworkIntegrationGrpcController`)
Located at `src/modules/ad-network-integration/service/grpc/ad-network-integration.grpc.controller.ts`.

*   **Purpose**: Implements the server-side logic for the `AdNetworkIntegration` gRPC service. It acts as the entry point for gRPC requests.
*   **Responsibilities**:
    *   Decorate methods with `@GrpcMethod('AdNetworkIntegration', '<RpcMethodName>')` to map them to the `.proto` service definition.
    *   Receive gRPC request DTOs (generated from `.proto` or custom mapped).
    *   Perform initial validation on request DTOs using `class-validator` if not directly using proto-generated types that gRPC handles.
    *   Delegate the core business logic to `AdNetworkIntegrationService`.
    *   Transform results from `AdNetworkIntegrationService` into gRPC response DTOs.
    *   Handle gRPC-specific errors and map them to appropriate `ErrorDetail` structures in responses.
*   **Dependencies**: `AdNetworkIntegrationService`.
*   **Key Methods** (corresponding to RPCs in `ad_network_integration.v1.proto`):
    *   `createCampaign(data: CreateCampaignRequest): Promise<CreateCampaignResponse>`
    *   `updateCampaign(data: UpdateCampaignRequest): Promise<UpdateCampaignResponse>`
    *   `getCampaign(data: GetCampaignRequest): Promise<CampaignDetailsResponse>`
    *   `updateAdSet(data: UpdateAdSetRequest): Promise<UpdateAdSetResponse>`
    *   `getAdSet(data: GetAdSetRequest): Promise<AdSetDetailsResponse>`
    *   `uploadCreative(data: UploadCreativeRequest): Promise<UploadCreativeResponse>`
    *   `getCreative(data: GetCreativeRequest): Promise<CreativeDetailsResponse>`
    *   `getPerformanceMetrics(data: GetPerformanceMetricsRequest): Promise<GetPerformanceMetricsResponse>`
    *   `syncAudience(data: SyncAudienceRequest): Promise<SyncAudienceResponse>`
    *   `getAudienceSyncStatus(data: GetAudienceSyncStatusRequest): Promise<AudienceSyncStatusResponse>`
    *   `submitProductFeed(data: SubmitProductFeedRequest): Promise<SubmitProductFeedResponse>`
    *   `getProductFeedStatus(data: GetProductFeedStatusRequest): Promise<ProductFeedStatusResponse>`
    *   `validateCampaignData(data: ValidateCampaignDataRequest): Promise<ValidateCampaignDataResponse>`
    *   `validateCreativeData(data: ValidateCreativeDataRequest): Promise<ValidateCreativeDataResponse>`
    *   `validateFeedData(data: ValidateFeedDataRequest): Promise<ValidateFeedDataResponse>`

    Each method will:
    1.  Log the incoming request (excluding sensitive data).
    2.  Call the corresponding method in `adNetworkIntegrationService`.
    3.  Construct the gRPC response message, setting `status` and `error` fields appropriately.
    4.  Catch exceptions and populate `error` field.

### 3.3 Main Application Service (`AdNetworkIntegrationService`)
Located at `src/modules/ad-network-integration/service/ad-network-integration.service.ts`.

*   **Purpose**: Orchestrates ad network integration tasks by delegating to specialized domain services. Acts as a facade to the underlying domain logic.
*   **Responsibilities**:
    *   Receive requests from `AdNetworkIntegrationGrpcController`.
    *   Determine the target ad network based on the request.
    *   Invoke the appropriate domain service (e.g., `CampaignSyncService`, `CreativeSyncService`) to handle the request.
    *   Perform any high-level orchestration or aggregation if a task involves multiple domain services or steps.
    *   Return results or errors to the controller.
*   **Dependencies**: `CampaignSyncService`, `CreativeSyncService`, `MetricsRetrievalService`, `AudienceSyncService`, `FeedSubmissionService`, `PolicyValidatorService`.
*   **Key Methods**:
    *   These methods will mirror the gRPC controller methods in terms of parameters (using internal DTOs which might be the same as gRPC DTOs for simplicity or mapped) and return types.
    *   Example: `async createCampaign(request: CreateCampaignRequestDto): Promise<InternalCreateCampaignResult>`
        *   Logic:
            1.  Log request.
            2.  `const { adNetwork, merchantId, ...campaignDetails } = request;`
            3.  `const internalCampaignDto = this.dataMapperFactory.getMapper(adNetwork).mapToInternalCampaignCreate(campaignDetails);`
            4.  `return this.campaignSyncService.createCampaign(adNetwork, merchantId, internalCampaignDto);`
    *   Similarly for `updateCampaign`, `getCampaign`, `updateAdSet`, `getAdSet`, `uploadCreative`, `getCreative`, `getPerformanceMetrics`, `syncAudience`, `getAudienceSyncStatus`, `submitProductFeed`, `getProductFeedStatus`, `validateCampaignData`, `validateCreativeData`, `validateFeedData`.

### 3.4 Domain Services
Located in `src/modules/ad-network-integration/service/domain/services/`.

#### 3.4.1 `CampaignSyncService`
*   **Purpose**: Handles business logic for creating, updating, and managing campaigns and ad sets.
*   **Responsibilities**:
    *   Uses `AdNetworkAdapterFactory` to get the specific ad network adapter.
    *   Before create/update, invokes `PolicyValidatorService.validateCampaignData()`.
    *   Calls adapter methods like `createCampaign`, `updateCampaign`, `getCampaign`, `updateAdSet`, `getAdSet`.
    *   Maps internal DTOs to adapter-specific DTOs if necessary (though adapters should primarily handle this).
*   **Methods**:
    *   `async createCampaign(adNetwork: AdNetworkType, merchantId: string, campaignData: InternalCampaignCreateDto): Promise<InternalCampaignResultDto>`
    *   `async updateCampaign(adNetwork: AdNetworkType, merchantId: string, campaignId: string, campaignUpdateData: InternalCampaignUpdateDto): Promise<InternalCampaignResultDto>`
    *   `async getCampaign(adNetwork: AdNetworkType, merchantId: string, campaignId: string): Promise<InternalCampaignDetailsDto>`
    *   `async updateAdSet(adNetwork: AdNetworkType, merchantId: string, adSetId: string, adSetUpdateData: InternalAdSetUpdateDto): Promise<InternalAdSetResultDto>`
    *   `async getAdSet(adNetwork: AdNetworkType, merchantId: string, adSetId: string): Promise<InternalAdSetDetailsDto>`

#### 3.4.2 `CreativeSyncService`
*   **Purpose**: Manages uploading and associating ad creatives.
*   **Responsibilities**:
    *   Uses `AdNetworkAdapterFactory`.
    *   Invokes `PolicyValidatorService.validateCreativeData()` before upload.
    *   Calls adapter methods like `uploadCreative`, `getCreative`.
*   **Methods**:
    *   `async uploadAndAssociateCreative(adNetwork: AdNetworkType, merchantId: string, creativeData: InternalCreativeUploadDto): Promise<InternalCreativeResultDto>`
    *   `async getCreative(adNetwork: AdNetworkType, merchantId: string, creativeId: string): Promise<InternalCreativeDetailsDto>`

#### 3.4.3 `MetricsRetrievalService`
*   **Purpose**: Fetches performance metrics.
*   **Responsibilities**:
    *   Uses `AdNetworkAdapterFactory`.
    *   Calls adapter's `getPerformanceMetrics` method.
    *   May standardize or aggregate metrics if common internal format is desired.
*   **Methods**:
    *   `async fetchPerformanceMetrics(adNetwork: AdNetworkType, merchantId: string, params: InternalMetricsRequestParamsDto): Promise<InternalPerformanceMetricsResultDto>`

#### 3.4.4 `AudienceSyncService`
*   **Purpose**: Synchronizes audiences.
*   **Responsibilities**:
    *   Uses `AdNetworkAdapterFactory`.
    *   Calls adapter's `syncAudience` and `getAudienceSyncStatus` methods.
    *   Handles PII hashing or data preparation rules if required by network and compliance.
*   **Methods**:
    *   `async synchronizeAudience(adNetwork: AdNetworkType, merchantId: string, audienceData: InternalAudienceSyncDto): Promise<InternalAudienceSyncStatusResultDto>`
    *   `async getAudienceSyncStatus(adNetwork: AdNetworkType, merchantId: string, audienceIdNetwork: string): Promise<InternalAudienceSyncStatusResultDto>`

#### 3.4.5 `FeedSubmissionService`
*   **Purpose**: Submits and synchronizes product feeds.
*   **Responsibilities**:
    *   Uses `AdNetworkAdapterFactory`.
    *   Invokes `PolicyValidatorService.validateProductFeed()` before submission.
    *   Calls adapter's `submitProductFeed` and `getProductFeedStatus` methods.
*   **Methods**:
    *   `async submitProductFeed(adNetwork: AdNetworkType, merchantId: string, feedData: InternalProductFeedSubmitDto): Promise<InternalFeedSubmissionStatusResultDto>`
    *   `async getProductFeedStatus(adNetwork: AdNetworkType, merchantId: string, feedIdNetwork: string): Promise<InternalFeedSubmissionStatusResultDto>`

#### 3.4.6 `PolicyValidatorService`
*   **Purpose**: Validates data against ad network policies and technical specs.
*   **Responsibilities**:
    *   Uses `AdNetworkAdapterFactory` to get the adapter, which might have network-specific validation methods or call network validation APIs.
    *   Implements internal rule engines or checks if network validation APIs are insufficient or for pre-validation.
    *   Returns a list of `ValidationResultDto` items (field, message, severity).
*   **Methods**:
    *   `async validateCampaignData(adNetwork: AdNetworkType, merchantId: string, data: InternalCampaignDto): Promise<ValidationResultDto[]>`
    *   `async validateCreativeData(adNetwork: AdNetworkType, merchantId: string, data: InternalCreativeDto): Promise<ValidationResultDto[]>`
    *   `async validateFeedData(adNetwork: AdNetworkType, merchantId: string, data: InternalProductFeedDto): Promise<ValidationResultDto[]>`

### 3.5 Adapters
Located in `src/modules/ad-network-integration/service/adapters/`.

#### 3.5.1 Core Adapter Interface (`IAdNetworkAdapter`)
Located at `src/modules/ad-network-integration/service/adapters/core/ad-network-adapter.interface.ts`.
Defines the contract all specific ad network adapters must implement.
typescript
import { AdNetworkType, CampaignStatus, CreativeType, AudienceType, FeedFormat } from '../../common/enums'; // Assuming enums.ts defines these
import {
  InternalCampaignCreateDto, InternalCampaignUpdateDto, InternalCampaignDetailsDto, InternalCampaignResultDto,
  InternalAdSetUpdateDto, InternalAdSetDetailsDto, InternalAdSetResultDto,
  InternalCreativeUploadDto, InternalCreativeDetailsDto, InternalCreativeResultDto,
  InternalMetricsRequestParamsDto, InternalPerformanceMetricsResultDto,
  InternalAudienceSyncDto, InternalAudienceSyncStatusResultDto,
  InternalProductFeedSubmitDto, InternalFeedSubmissionStatusResultDto,
  ValidationResultDto
} from '../../dto/internal'; // Define these internal DTOs

export interface IAdNetworkAdapter {
  getNetworkType(): AdNetworkType;

  // Campaign
  createCampaign(merchantId: string, campaignData: InternalCampaignCreateDto): Promise<InternalCampaignResultDto>;
  updateCampaign(merchantId: string, campaignId: string, campaignUpdateData: InternalCampaignUpdateDto): Promise<InternalCampaignResultDto>;
  getCampaign(merchantId: string, campaignId: string): Promise<InternalCampaignDetailsDto>;

  // AdSet
  updateAdSet(merchantId: string, adSetId: string, adSetData: InternalAdSetUpdateDto): Promise<InternalAdSetResultDto>;
  getAdSet(merchantId: string, adSetId: string): Promise<InternalAdSetDetailsDto>;

  // Creative
  uploadCreative(merchantId: string, creativeData: InternalCreativeUploadDto): Promise<InternalCreativeResultDto>;
  getCreative(merchantId: string, creativeId: string): Promise<InternalCreativeDetailsDto>;

  // Metrics
  getPerformanceMetrics(merchantId: string, params: InternalMetricsRequestParamsDto): Promise<InternalPerformanceMetricsResultDto>;

  // Audience
  syncAudience(merchantId: string, audienceData: InternalAudienceSyncDto): Promise<InternalAudienceSyncStatusResultDto>;
  getAudienceSyncStatus(merchantId: string, audienceIdNetwork: string): Promise<InternalAudienceSyncStatusResultDto>;


  // Feed
  submitProductFeed(merchantId: string, feedData: InternalProductFeedSubmitDto): Promise<InternalFeedSubmissionStatusResultDto>;
  getProductFeedStatus(merchantId: string, feedIdNetwork: string): Promise<InternalFeedSubmissionStatusResultDto>;

  // Validation
  validateCampaignData(merchantId: string, campaignData: any): Promise<ValidationResultDto[]>; // 'any' used as campaign structure varies widely
  validateCreativeData(merchantId: string, creativeData: InternalCreativeUploadDto): Promise<ValidationResultDto[]>;
  validateFeedData(merchantId: string, feedData: InternalProductFeedSubmitDto): Promise<ValidationResultDto[]>;
}


#### 3.5.2 Base Ad Network Client (`BaseAdNetworkClient`)
Located at `src/modules/ad-network-integration/service/adapters/core/base-ad-network.client.ts`.
*   **Purpose**: Provides common, resilient HTTP client functionality.
*   **Logic**:
    *   Constructor takes `AdNetworkClientConfig` (API base URL, auth details), `ResilienceFactory`, and NestJS `LoggerService`.
    *   Uses `axios` for HTTP requests.
    *   `requestWithResilience` method:
        1.  Takes HTTP method, URL, data, Axios config, and a `commandKey` (for circuit breaker).
        2.  Retrieves or creates a circuit breaker instance from `ResilienceFactory` using `commandKey`.
        3.  Executes the HTTP request using `circuitBreaker.fire(...)`.
        4.  The `fire` method itself will handle retries based on a retry-axios or similar configuration passed to axios, or custom retry logic within the fire method.
        5.  Handles successful responses and maps them.
        6.  Calls `handleError` for exceptions.
    *   `handleError` method:
        1.  Logs the error with context.
        2.  Parses Axios errors (response status, data) and other errors.
        3.  Throws a standardized internal exception (e.g., `AdNetworkApiException`) that can be caught by services/controller.
*   **Note**: Retry logic could be implemented using libraries like `axios-retry` configured within the Axios instance, or managed by the circuit breaker's `fire` method if it supports retries.

#### 3.5.3 Specific Ad Network Adapters
(e.g., `GoogleAdsAdapter`, `InstagramAdsAdapter`, `TikTokAdsAdapter`, `SnapchatAdsAdapter`)
Located in their respective subdirectories under `adapters/`.
*   **Purpose**: Implement `IAdNetworkAdapter` for a specific ad network.
*   **Structure**:
    *   Inject `ConfigService` to get network-specific API keys/config from `AdNetworkConfig`.
    *   Inject `BaseAdNetworkClient` (or create an instance of it) for making HTTP calls.
    *   Inject network-specific `DataMapper` (e.g., `GoogleAdsDataMapper`) from `DataMapperFactory`.
    *   Inject `LoggerService`.
*   **Logic per method (e.g., `createCampaign` in `GoogleAdsAdapter`):**
    1.  Log entry with parameters.
    2.  Retrieve API key and endpoint from injected config.
    3.  Use the injected `DataMapper` to transform the `InternalCampaignCreateDto` into the Google Ads API's expected request format.
    4.  Use `BaseAdNetworkClient.requestWithResilience` (or the network's SDK client if preferred and it has resilience features) to make the API call to the Google Ads `createCampaign` endpoint.
        *   Pass necessary headers, authentication tokens (e.g., OAuth Bearer token derived from config).
    5.  Receive the response from Google Ads API.
    6.  Use the `DataMapper` to transform the Google Ads API response back into `InternalCampaignResultDto`.
    7.  Handle specific Google Ads API errors and map them to standardized internal errors if not already handled by `BaseAdNetworkClient`.
    8.  Log success or failure.
    9.  Return the `InternalCampaignResultDto`.
*   **Authentication**: Each adapter will handle the specific authentication mechanism required by its ad network (e.g., OAuth 2.0 for Google/Facebook, API Key for others). Token refresh logic might be needed. Credentials will be sourced from `AdNetworkConfig`.
*   **Compliance (REQ-TCE-003, REQ-03-006)**: Adapters must respect API rate limits, format requests correctly, and handle responses according to the ad network's documentation. The `PolicyValidatorService` assists with pre-submission checks, but adapters might perform final checks or rely on network API validation responses.

### 3.6 Data Transfer Objects (DTOs)
Located in `src/modules/ad-network-integration/service/dto/`.
*   **gRPC DTOs**: Defined in `.proto` files. NestJS typically generates TypeScript interfaces/classes from these. These are used by the `AdNetworkIntegrationGrpcController`.
*   **Internal DTOs**: (e.g., `InternalCampaignCreateDto`, `InternalPerformanceMetricsResultDto` etc. under `dto/internal/`)
    *   **Purpose**: Represent data structures used *within* the `AdNetworkIntegrationService` and its domain services and adapters. They provide a consistent internal representation independent of specific ad network formats or gRPC message structures.
    *   **Design**: These should be plain TypeScript classes or interfaces. They might be very similar to or even identical to gRPC DTOs for simplicity if the internal representation aligns well with the gRPC contract. If significant transformation is needed, they will differ.
    *   Contain properties relevant to the operation.
    *   May include validation decorators (`class-validator`) if used beyond simple data holding.
*   **Key DTOs examples (request/response pairs from file structure):**
    *   `CreateCampaignRequestDto` (gRPC) -> `InternalCampaignCreateDto` -> (Adapter maps to network-specific)
    *   (Network-specific response) -> Adapter maps to `InternalCampaignResultDto` -> `CreateCampaignResponse` (gRPC)
    *   `CampaignDetailsResponseDto` (gRPC) -> contains `Campaign` message.
    *   Other DTOs for `UpdateAdSet`, `UploadCreative`, `GetPerformanceMetrics`, `SyncAudience`, `SubmitProductFeed`, `ValidateCampaignData` and their responses will follow similar patterns.

### 3.7 Configuration (`config/`)

#### 3.7.1 `ad-network.configuration.ts`
*   **Purpose**: Loads and provides typed configuration for all supported ad networks.
*   **Logic**:
    *   Uses NestJS `ConfigModule` and `registerAs` function.
    *   Loads environment variables (e.g., `GOOGLE_ADS_API_KEY`, `GOOGLE_ADS_CLIENT_ID`, `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET`, `TIKTOK_ACCESS_TOKEN`, `SNAPCHAT_CLIENT_ID`, etc.).
    *   Environment variables for secrets should ideally point to a secret management system (e.g., AWS Secrets Manager) from which the actual secrets are fetched at runtime.
    *   Validates the loaded configuration against the `AdNetworkConfig` interface/class schema using `class-validator` or a Joi schema.
    *   Provides the typed configuration object to the application.

#### 3.7.2 `ad-network.config.interface.ts`
*   **Purpose**: Defines the TypeScript interfaces for the ad network configuration structure.
*   **Structure**:
    typescript
    export interface GoogleAdsApiConfig {
      developerToken: string;
      clientId: string;
      clientSecret: string;
      loginCustomerId?: string; // MCC account ID if applicable
      // Potentially OAuth refresh token if long-lived access is needed
      refreshToken?: string;
    }

    export interface InstagramAdsApiConfig { // Facebook Marketing API
      appId: string;
      appSecret: string;
      accessToken: string; // User-specific or system user access token
      businessManagerId?: string;
    }

    export interface TikTokAdsApiConfig {
      appId: string;
      secret: string;
      accessToken: string; // Advertiser access token
      advertiserId?: string;
    }

    export interface SnapchatAdsApiConfig {
      clientId: string;
      clientSecret: string;
      refreshToken: string;
      organizationId: string;
    }

    export interface AdNetworkConfig {
      google: GoogleAdsApiConfig;
      instagram: InstagramAdsApiConfig;
      tiktok: TikTokAdsApiConfig;
      snapchat: SnapchatAdsApiConfig;
      // Global settings like default timeouts, retry attempts
      defaultRequestTimeoutMs?: number;
      defaultRetryAttempts?: number;
    }
    

### 3.8 Common Utilities (`common/`)

#### 3.8.1 `enums.ts`
*   **Purpose**: Centralized definitions for common enumerations.
*   **Content**: `AdNetworkType`, `CampaignStatus`, `CreativeType`, `AudienceType`, `FeedFormat`, `ValidationSeverity`, etc., as defined in `common.v1.proto` and potentially additional internal enums.

#### 3.8.2 `DataMapperFactory`
Located at `src/modules/ad-network-integration/service/common/utils/data-mapper.factory.ts`.
*   **Purpose**: Provides instances of network-specific data mappers.
*   **Logic**:
    *   Injectable NestJS provider.
    *   `getMapper(networkType: AdNetworkType): IBaseDataMapper`: A method that returns the correct mapper instance based on `networkType`.
    *   Mappers (e.g., `GoogleAdsDataMapper`, `InstagramAdsDataMapper`) would implement a common `IBaseDataMapper` interface. This interface would define methods like `mapToNetworkCampaign(internalDto: InternalCampaignDto): GoogleCampaignDto`, `mapToInternalCampaign(networkDto: GoogleCampaignDto): InternalCampaignDto`, etc.
    *   Each specific mapper class will contain the transformation logic between internal DTOs and the specific ad network's DTOs/API request-response structures.

#### 3.8.3 `ResilienceFactory`
Located at `src/modules/ad-network-integration/service/common/utils/resilience.factory.ts`.
*   **Purpose**: Centralizes creation and configuration of `opossum` circuit breaker instances.
*   **Logic**:
    *   Injectable NestJS provider.
    *   `createCircuitBreaker(commandKey: string, options?: opossum.Options): opossum`:
        1.  Takes a `commandKey` (unique identifier for the operation, e.g., `googleAds.createCampaign`).
        2.  Takes optional `opossum.Options` to override defaults.
        3.  Defines default options: `timeout`, `errorThresholdPercentage`, `resetTimeout`. These can be loaded from `AdNetworkConfig`.
        4.  Creates and returns an `opossum` instance.
        5.  Could manage a cache of circuit breaker instances to avoid re-creating them for the same `commandKey`.
    *   This factory is used by `BaseAdNetworkClient` or directly by adapters if they don't use the base client.

### 3.9 Module Definition (`ad-network-integration.module.ts`)
Located at `src/modules/ad-network-integration/service/ad-network-integration.module.ts`.
*   **Imports**:
    *   `ConfigModule.forRoot({ load: [adNetworkConfiguration], isGlobal: true })` or `ConfigModule.forFeature(adNetworkConfiguration)`.
    *   Other shared modules if any.
*   **Controllers**: `[AdNetworkIntegrationGrpcController]`
*   **Providers**:
    *   `AdNetworkIntegrationService`
    *   `CampaignSyncService`
    *   `CreativeSyncService`
    *   `MetricsRetrievalService`
    *   `AudienceSyncService`
    *   `FeedSubmissionService`
    *   `PolicyValidatorService`
    *   `GoogleAdsAdapter`
    *   `InstagramAdsAdapter`
    *   `TikTokAdsAdapter`
    *   `SnapchatAdsAdapter`
    *   `AdNetworkAdapterFactory` (see below)
    *   `DataMapperFactory`
    *   `ResilienceFactory`
    *   `BaseAdNetworkClient` (if it's injectable and used by adapters, or adapters create instances)
    *   NestJS `LoggerService` (if not globally provided).
*   **AdNetworkAdapterFactory**:
    *   This factory provider would be responsible for injecting all specific adapters and providing a method like `getAdapter(networkType: AdNetworkType): IAdNetworkAdapter`. This simplifies dependency injection in domain services.

## 4. Non-Functional Design

### 4.1 Resilience (REQ-TCE-002, REQ-03-007)
*   **Circuit Breakers**: Implemented using `opossum` via `ResilienceFactory` and applied in `BaseAdNetworkClient` or individual adapters for all external API calls to ad networks.
    *   Configuration: Timeout, error threshold percentage, reset timeout will be configurable, potentially per ad network or per operation type via `AdNetworkConfig`.
    *   Events: `open`, `close`, `halfOpen`, `success`, `failure` events from circuit breakers should be logged for monitoring.
*   **Retries**:
    *   Implemented for transient errors (e.g., network issues, 5xx errors from ad networks, rate limit errors if appropriate to retry after a delay).
    *   Strategy: Exponential backoff with jitter.
    *   Configuration: Max retry attempts, initial backoff delay, max backoff delay configurable via `AdNetworkConfig`.
    *   Can be implemented using `axios-retry` library within `BaseAdNetworkClient` or custom logic within the circuit breaker's execution.
*   **Timeouts**: Configurable request timeouts for all external API calls.

### 4.2 Security
*   **Credential Management**: API keys, secrets, and tokens for ad networks are loaded from `AdNetworkConfig`, which in turn should source them securely (e.g., from environment variables populated by AWS Secrets Manager or Parameter Store). These credentials are only accessed by the respective adapter and `BaseAdNetworkClient`.
*   **Communication**: All outbound calls to ad network APIs MUST use HTTPS.
*   **Data Handling**: Sensitive data passed in requests (if any) should be handled according to PII best practices, although this internal API primarily deals with campaign metadata and IDs.

### 4.3 Compliance (REQ-TCE-003, REQ-03-006, REQ-03-005, REQ-CMO-010)
*   **Ad Network Policies**:
    *   `PolicyValidatorService` is responsible for pre-submission checks of campaign data, creatives, and feeds against known ad network rules and technical specifications.
    *   Adapters are responsible for correctly formatting requests as per ad network API documentation.
    *   Error responses from ad networks indicating policy violations must be properly handled, logged, and propagated to the calling service.
*   **Terms of Service**: The design of adapters and their interaction patterns (e.g., polling frequency, data usage) must align with the Terms of Service of each ad network. This requires ongoing review as terms can change.

### 4.4 Logging
*   Comprehensive logging will be implemented using NestJS `LoggerService`.
*   Logs will include:
    *   Incoming gRPC requests (parameters, excluding highly sensitive data).
    *   Outgoing requests to ad networks (URL, method, key parameters, excluding full secrets).
    *   Responses from ad networks (status, key data, errors).
    *   Circuit breaker state changes and retry attempts.
    *   Errors and exceptions with stack traces and context.
    *   Execution of key business logic steps.
*   Log format: Structured JSON for easier parsing and analysis (e.g., in CloudWatch Logs).
*   Log levels (DEBUG, INFO, WARN, ERROR) will be used appropriately.

### 4.5 Scalability & Performance
*   The service is designed as a NestJS microservice, which can be horizontally scaled by running multiple instances.
*   Asynchronous operations with ad networks (where possible via their APIs) should be favored.
*   Efficient data mapping to minimize transformation overhead.
*   Connection pooling (handled by SDKs or HTTP client libraries like Axios) for external calls.

## 5. Data Design
*   **Primary Data Structures**: Defined by Protocol Buffer messages in `.proto` files for gRPC communication.
*   **Internal DTOs**: TypeScript classes/interfaces for internal data representation, closely mirroring gRPC messages where appropriate.
*   This service is largely stateless regarding core Ad Manager data (like full campaign details) but may cache ad network metadata or configurations for short periods if beneficial.
*   No direct database ownership for core Ad Manager entities; it acts as a proxy and processor for ad network interactions.

## 6. Interface Design

### 6.1 Internal Interfaces (gRPC)
*   Defined by `ad_network_integration.v1.proto`. Service: `AdNetworkIntegration`.
*   RPC Methods: `CreateCampaign`, `UpdateCampaign`, `GetCampaign`, `UpdateAdSet`, `GetAdSet`, `UploadCreative`, `GetCreative`, `GetPerformanceMetrics`, `SyncAudience`, `GetAudienceSyncStatus`, `SubmitProductFeed`, `GetProductFeedStatus`, `ValidateCampaignData`, `ValidateCreativeData`, `ValidateFeedData`.
*   Authentication/Authorization: As this is an internal service, authentication might rely on mTLS or JWTs issued by an internal identity provider, validated at the gRPC interceptor level or by NestJS guards. The merchant context (`merchant_id`) is passed in requests to scope operations.

### 6.2 External Interfaces (Ad Network APIs)
*   Each adapter (`GoogleAdsAdapter`, etc.) interacts with the respective ad network's public API (REST/GraphQL/SDK).
*   Authentication: Handled by each adapter using mechanisms specific to the ad network (OAuth 2.0, API Keys).
*   Data Format: JSON, XML, or as dictated by the ad network API/SDK.
*   Error Handling: Adapters must interpret ad network-specific error codes and messages and map them to standardized internal error DTOs (`ErrorDetail` in gRPC responses).

## 7. Deployment Considerations
*   **Containerization**: The application will be containerized using Docker.
*   **Orchestration**: Deployed on a container orchestration platform like Amazon EKS or ECS.
*   **Configuration**: Ad network credentials and other configurations will be injected via environment variables or a configuration service (e.g., AWS Systems Manager Parameter Store, AWS Secrets Manager).
*   **CI/CD**: Automated build, test, and deployment pipelines using AWS CodePipeline, CodeBuild, CodeDeploy.
    *   Proto files compilation and TypeScript DTO generation should be part of the build process.

## 8. Error Handling Strategy
*   **Within Adapters/`BaseAdNetworkClient`**:
    *   Catch specific ad network API errors.
    *   Map them to a standardized internal error structure (e.g., containing an internal error code, message, original network error code/message).
    *   Retry transient errors.
    *   Circuit breakers will prevent repeated calls to failing services.
*   **Within Domain Services**:
    *   Catch errors from adapters.
    *   Perform business-level error handling or enrichment.
    *   Propagate errors upwards.
*   **Within `AdNetworkIntegrationService`**:
    *   Consolidate errors from domain services.
*   **Within `AdNetworkIntegrationGrpcController`**:
    *   Catch all exceptions from `AdNetworkIntegrationService`.
    *   Map these exceptions to the `ErrorDetail` message in the gRPC response.
    *   Set the appropriate `Status` in the gRPC response.
*   Standardized error codes will be defined for common issues (e.g., `INVALID_ARGUMENT`, `UNAUTHENTICATED`, `PERMISSION_DENIED`, `AD_NETWORK_ERROR`, `INTERNAL_ERROR`).

## 9. Application Initialization (`main.ts`, `app.module.ts`)

### 9.1 `main.ts`
typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Logger } from '@nestjs/common'; // Import NestJS Logger

async function bootstrap() {
  const logger = new Logger('Bootstrap'); // Instantiate Logger

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'AdManager.AdNetworkIntegration.Service.V1', // Matches package in .proto
        protoPath: join(__dirname, '../grpc/protos/ad_network_integration.v1.proto'), // Adjust path as needed
        url: process.env.GRPC_CONNECTION_URL || '0.0.0.0:50051', // Configurable URL
        loader: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
          includeDirs: [join(__dirname, '../grpc/protos')], // Directory for common.v1.proto
        },
      },
    },
  );

  app.useLogger(app.get(Logger)); // Use NestJS built-in logger or a custom one

  await app.listen();
  logger.log(`AdNetworkIntegration gRPC Service is running on ${process.env.GRPC_CONNECTION_URL || '0.0.0.0:50051'}`);
}
bootstrap();


### 9.2 `app.module.ts`
typescript
import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdNetworkIntegrationModule } from './ad-network-integration.module';
import adNetworkConfiguration from './config/ad-network.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally
      load: [adNetworkConfiguration], // Loads custom configuration
      // Add validation schema if needed using Joi or class-validator
    }),
    AdNetworkIntegrationModule,
  ],
  providers: [Logger], // Provide Logger globally or per module as needed
})
export class AppModule {}


This SDS provides a comprehensive guide for developing the `AdNetworkIntegration.ServiceApi`. It details the structure, components, interactions, and non-functional aspects necessary for successful implementation.