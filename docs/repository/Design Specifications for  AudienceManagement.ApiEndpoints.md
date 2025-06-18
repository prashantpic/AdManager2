# Software Design Specification: AudienceManagement.ApiEndpoints

## 1. Introduction

### 1.1 Purpose
This document provides the detailed software design specification for the `AudienceManagement.ApiEndpoints` repository. This repository is responsible for exposing RESTful API endpoints for merchants to create, define, and manage audience segments (e.g., custom audiences from customer lists, lookalike audiences). These audiences are subsequently used for targeting in advertising campaigns across various ad networks.

This SDS will guide the development of the API layer, including controllers, Data Transfer Objects (DTOs), and their interaction with the underlying service layer.

### 1.2 Scope
The scope of this document is limited to the `AudienceManagement.ApiEndpoints` repository. This includes:
-   API endpoint definitions for audience management.
-   Request and Response DTOs for these endpoints.
-   Integration points with the `AudienceManagementService`.
-   Authentication and authorization mechanisms for the API endpoints.
-   Swagger/OpenAPI documentation setup.

The implementation of the core business logic (`AudienceManagementService`) and its interactions with external ad networks or the core `[PlatformName]` platform data services are considered external to this repository but are defined by interfaces herein.

### 1.3 Definitions, Acronyms, and Abbreviations
-   **API:** Application Programming Interface
-   **REST:** Representational State Transfer
-   **DTO:** Data Transfer Object
-   **JWT:** JSON Web Token
-   **RBAC:** Role-Based Access Control
-   **CRUD:** Create, Read, Update, Delete
-   **SDK:** Software Development Kit
-   **PII:** Personally Identifiable Information
-   **HTTP:** Hypertext Transfer Protocol
-   **JSON:** JavaScript Object Notation
-   **NestJS:** A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
-   **Swagger/OpenAPI:** Specification and toolset for designing, building, documenting, and consuming RESTful web services.
-   **Audience:** A defined group of users targeted for advertising campaigns.
    -   **Custom Audience:** An audience created from specific data sources like customer lists or platform data segments.
    -   **Lookalike Audience:** An audience created by an ad network based on the characteristics of a source custom audience.
-   **`[PlatformName]`:** Placeholder for the main e-commerce platform name.

## 2. System Overview
The `AudienceManagement.ApiEndpoints` repository is a microservice within the larger Ad Manager Platform. It acts as the primary interface for merchants (via the Merchant Ad Manager Portal) to manage their advertising audiences.

It receives HTTP requests, authenticates and authorizes them, validates incoming data, and then delegates the business logic to the `AudienceManagementService`. This service, in turn, interacts with other services (e.g., Ad Network Integration Service, Core Platform Data Service) to fulfill requests.

The API endpoints will be exposed via Amazon API Gateway, which will handle initial request routing and potentially some aspects of authentication.

## 3. API Design

### 3.1 General Principles
-   **Protocol:** All API communication will be over HTTPS.
-   **Format:** Request and response bodies will be in JSON format.
-   **Authentication:** Endpoints will be secured using JWT-based authentication. A `JwtAuthGuard` will be used to verify the token. The merchant ID will be extracted from the authenticated user's JWT payload.
-   **Authorization:** Role-Based Access Control (RBAC) will be implemented using a `RolesGuard`. Specific roles (e.g., 'MerchantAdmin', 'CampaignManager') will be required for accessing endpoints.
-   **Versioning:** API endpoints will be versioned (e.g., `/api/v1/audiences`).
-   **Error Handling:** Standard HTTP status codes will be used to indicate success or failure. Error responses will be in a consistent JSON format. A global exception filter will be implemented.
-   **Idempotency:** For `POST` operations that create resources, the system should ideally ensure that submitting the same request multiple times does not result in duplicate resources if a unique identifier or specific conditions are met. However, for this version, standard `POST` behavior is assumed unless explicitly stated. `PUT` and `DELETE` operations should be idempotent.
-   **Pagination:** List endpoints will support pagination using `page` and `limit` query parameters.

### 3.2 Endpoint Definitions

The base path for these endpoints will be `/api/v1/audiences`.

#### 3.2.1 Create Custom Audience
-   **HTTP Method:** `POST`
-   **Path:** `/custom`
-   **Description:** Creates a new custom audience for the authenticated merchant.
-   **Request DTO:** `CreateCustomAudienceRequestDto` (see section 4.1)
-   **Response DTO:** `AudienceResponseDto` (see section 4.3) - HTTP 201 Created
-   **Security:** `JwtAuthGuard`, `RolesGuard` (Roles: 'MerchantAdmin', 'CampaignManager')
-   **Swagger:**
    -   `@ApiOperation({ summary: 'Create a new custom audience' })`
    -   `@ApiResponse({ status: 201, description: 'Custom audience created successfully.', type: AudienceResponseDto })`
    -   `@ApiResponse({ status: 400, description: 'Invalid request payload.' })`
    -   `@ApiResponse({ status: 401, description: 'Unauthorized.' })`
    -   `@ApiResponse({ status: 403, description: 'Forbidden resource.' })`

#### 3.2.2 Create Lookalike Audience
-   **HTTP Method:** `POST`
-   **Path:** `/lookalike`
-   **Description:** Creates a new lookalike audience based on an existing custom audience for the authenticated merchant.
-   **Request DTO:** `CreateLookalikeAudienceRequestDto` (see section 4.2)
-   **Response DTO:** `AudienceResponseDto` (see section 4.3) - HTTP 201 Created
-   **Security:** `JwtAuthGuard`, `RolesGuard` (Roles: 'MerchantAdmin', 'CampaignManager')
-   **Swagger:**
    -   `@ApiOperation({ summary: 'Create a new lookalike audience' })`
    -   `@ApiResponse({ status: 201, description: 'Lookalike audience created successfully.', type: AudienceResponseDto })`
    -   `@ApiResponse({ status: 400, description: 'Invalid request payload or source audience not found.' })`
    -   `@ApiResponse({ status: 401, description: 'Unauthorized.' })`
    -   `@ApiResponse({ status: 403, description: 'Forbidden resource.' })`

#### 3.2.3 List Audiences
-   **HTTP Method:** `GET`
-   **Path:** `/`
-   **Description:** Retrieves a list of audiences for the authenticated merchant, with pagination and filtering.
-   **Request Query DTO:** `AudienceQueryDto` (see section 4.9)
-   **Response DTO:** `AudienceListResponseDto` (see section 4.4) - HTTP 200 OK
-   **Security:** `JwtAuthGuard`, `RolesGuard` (Roles: 'MerchantAdmin', 'CampaignManager')
-   **Swagger:**
    -   `@ApiOperation({ summary: 'List audiences for the merchant' })`
    -   `@ApiResponse({ status: 200, description: 'List of audiences retrieved successfully.', type: AudienceListResponseDto })`
    -   `@ApiResponse({ status: 401, description: 'Unauthorized.' })`
    -   `@ApiResponse({ status: 403, description: 'Forbidden resource.' })`

#### 3.2.4 Get Audience By ID
-   **HTTP Method:** `GET`
-   **Path:** `/:audienceId`
-   **Description:** Retrieves details of a specific audience by its ID for the authenticated merchant.
-   **Path Parameter:** `audienceId` (UUID string)
-   **Response DTO:** `AudienceResponseDto` (see section 4.3) - HTTP 200 OK
-   **Security:** `JwtAuthGuard`, `RolesGuard` (Roles: 'MerchantAdmin', 'CampaignManager')
-   **Swagger:**
    -   `@ApiOperation({ summary: 'Get audience details by ID' })`
    -   `@ApiResponse({ status: 200, description: 'Audience details retrieved successfully.', type: AudienceResponseDto })`
    -   `@ApiResponse({ status: 401, description: 'Unauthorized.' })`
    -   `@ApiResponse({ status: 403, description: 'Forbidden resource.' })`
    -   `@ApiResponse({ status: 404, description: 'Audience not found.' })`

#### 3.2.5 Update Audience
-   **HTTP Method:** `PUT`
-   **Path:** `/:audienceId`
-   **Description:** Updates the metadata (e.g., name, description) of an existing audience for the authenticated merchant.
-   **Path Parameter:** `audienceId` (UUID string)
-   **Request DTO:** `UpdateAudienceRequestDto` (see section 4.8)
-   **Response DTO:** `AudienceResponseDto` (see section 4.3) - HTTP 200 OK
-   **Security:** `JwtAuthGuard`, `RolesGuard` (Roles: 'MerchantAdmin', 'CampaignManager')
-   **Swagger:**
    -   `@ApiOperation({ summary: 'Update audience metadata' })`
    -   `@ApiResponse({ status: 200, description: 'Audience updated successfully.', type: AudienceResponseDto })`
    -   `@ApiResponse({ status: 400, description: 'Invalid request payload.' })`
    -   `@ApiResponse({ status: 401, description: 'Unauthorized.' })`
    -   `@ApiResponse({ status: 403, description: 'Forbidden resource.' })`
    -   `@ApiResponse({ status: 404, description: 'Audience not found.' })`

#### 3.2.6 Delete Audience
-   **HTTP Method:** `DELETE`
-   **Path:** `/:audienceId`
-   **Description:** Deletes an existing audience for the authenticated merchant. This may also trigger deletion/disassociation from ad networks.
-   **Path Parameter:** `audienceId` (UUID string)
-   **Response:** HTTP 204 No Content
-   **Security:** `JwtAuthGuard`, `RolesGuard` (Roles: 'MerchantAdmin', 'CampaignManager')
-   **Swagger:**
    -   `@ApiOperation({ summary: 'Delete an audience' })`
    -   `@ApiResponse({ status: 204, description: 'Audience deleted successfully.' })`
    -   `@ApiResponse({ status: 401, description: 'Unauthorized.' })`
    -   `@ApiResponse({ status: 403, description: 'Forbidden resource.' })`
    -   `@ApiResponse({ status: 404, description: 'Audience not found.' })`

#### 3.2.7 Synchronize Audience with Ad Networks
-   **HTTP Method:** `POST`
-   **Path:** `/:audienceId/sync`
-   **Description:** Initiates or updates the synchronization of an existing audience with one or more specified ad networks.
-   **Path Parameter:** `audienceId` (UUID string)
-   **Request DTO:** `SyncAudienceRequestDto` (see section 4.5)
-   **Response DTO:** `AudienceSyncStatusResponseDto[]` (Array, see section 4.6) - HTTP 200 OK (representing the initial status after triggering sync)
-   **Security:** `JwtAuthGuard`, `RolesGuard` (Roles: 'MerchantAdmin', 'CampaignManager')
-   **Swagger:**
    -   `@ApiOperation({ summary: 'Synchronize an audience with specified ad networks' })`
    -   `@ApiResponse({ status: 200, description: 'Audience synchronization process initiated.', type: [AudienceSyncStatusResponseDto] })`
    -   `@ApiResponse({ status: 400, description: 'Invalid request payload or audience/network not found.' })`
    -   `@ApiResponse({ status: 401, description: 'Unauthorized.' })`
    -   `@ApiResponse({ status: 403, description: 'Forbidden resource.' })`
    -   `@ApiResponse({ status: 404, description: 'Audience not found.' })`

#### 3.2.8 Get Audience Synchronization Status
-   **HTTP Method:** `GET`
-   **Path:** `/:audienceId/sync/status`
-   **Description:** Retrieves the current synchronization status of an audience with all its configured ad networks, or a specific ad network if provided.
-   **Path Parameter:** `audienceId` (UUID string)
-   **Query Parameter:** `adNetworkId` (string, optional) - to get status for a specific ad network.
-   **Response DTO:** `AudienceSyncStatusResponseDto[]` (Array, see section 4.6) - HTTP 200 OK
-   **Security:** `JwtAuthGuard`, `RolesGuard` (Roles: 'MerchantAdmin', 'CampaignManager')
-   **Swagger:**
    -   `@ApiOperation({ summary: 'Get audience synchronization status' })`
    -   `@ApiResponse({ status: 200, description: 'Synchronization status retrieved.', type: [AudienceSyncStatusResponseDto] })`
    -   `@ApiResponse({ status: 401, description: 'Unauthorized.' })`
    -   `@ApiResponse({ status: 403, description: 'Forbidden resource.' })`
    -   `@ApiResponse({ status: 404, description: 'Audience not found.' })`

## 4. Data Transfer Objects (DTOs)
All DTOs will reside in `src/modules/audience-management/api/v1/dtos/` and use `class-validator` for validation and `@nestjs/swagger` for API documentation.

### 4.1 `CreateCustomAudienceRequestDto` (`create-custom-audience.v1.dto.ts`)
typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsIn, IsArray, ArrayNotEmpty, IsObject, ValidateNested, ValidateIf } from 'class-validator';

class DataProcessingOptionsDto {
  @ApiPropertyOptional({ description: 'Fields to hash before sending to ad networks, if sourceType is CUSTOMER_LIST_UPLOAD' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  piiHashingFields?: string[];

  @ApiProperty({ description: 'Confirms necessary consents are obtained for processing this data.' })
  @IsBoolean()
  @IsNotEmpty()
  consentVerified: boolean;
}

export class CreateCustomAudienceRequestDto {
  @ApiProperty({ description: 'Name of the custom audience.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Optional description for the audience.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ['PLATFORM_DATA_SEGMENT', 'CUSTOMER_LIST_UPLOAD'], description: 'Source type for the custom audience.' })
  @IsIn(['PLATFORM_DATA_SEGMENT', 'CUSTOMER_LIST_UPLOAD'])
  @IsNotEmpty()
  sourceType: 'PLATFORM_DATA_SEGMENT' | 'CUSTOMER_LIST_UPLOAD';

  @ApiPropertyOptional({ description: 'ID of the platform data segment, required if sourceType is PLATFORM_DATA_SEGMENT.' })
  @IsString()
  @ValidateIf(o => o.sourceType === 'PLATFORM_DATA_SEGMENT')
  @IsNotEmpty()
  @IsOptional()
  platformDataSourceId?: string;

  @ApiPropertyOptional({ description: 'Key to a pre-uploaded file (e.g., S3 key) containing customer data, required if sourceType is CUSTOMER_LIST_UPLOAD.' })
  @IsString()
  @ValidateIf(o => o.sourceType === 'CUSTOMER_LIST_UPLOAD')
  @IsNotEmpty()
  @IsOptional()
  customerListFileKey?: string;

  @ApiProperty({ type: [String], description: 'Array of Ad Network IDs to target with this audience.' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  targetAdNetworkIds: string[];
  
  @ApiProperty({ type: DataProcessingOptionsDto, description: 'Options for data processing and compliance.'})
  @IsObject()
  @ValidateNested()
  @Type(() => DataProcessingOptionsDto)
  @IsNotEmpty()
  dataProcessingOptions: DataProcessingOptionsDto;
}


### 4.2 `CreateLookalikeAudienceRequestDto` (`create-lookalike-audience.v1.dto.ts`)
typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsArray, ArrayNotEmpty, ValidateNested, IsNumber, Min, Max, IsEnum } from 'class-validator';

// Assuming ISO 3166-1 alpha-2 country codes
enum SupportedCountryCode {
  US = 'US',
  CA = 'CA',
  GB = 'GB',
  SA = 'SA',
  // ... add more as needed
}

class LookalikeSpecDto {
  @ApiProperty({ description: 'Target Ad Network ID for this specific lookalike configuration.' })
  @IsString()
  @IsNotEmpty()
  adNetworkId: string;

  @ApiProperty({ enum: SupportedCountryCode, description: 'Target country code for the lookalike audience (e.g., "SA", "US").' })
  @IsEnum(SupportedCountryCode)
  @IsNotEmpty()
  countryCode: SupportedCountryCode;

  @ApiPropertyOptional({ type: Number, description: 'Desired lookalike audience size percentage (e.g., 1 for 1%). Ad network specific interpretation.' , minimum: 1, maximum: 10})
  @IsNumber()
  @Min(1)
  @Max(10) // Example range, adjust based on ad network capabilities
  @IsOptional()
  sizePercentage?: number;
}

export class CreateLookalikeAudienceRequestDto {
  @ApiProperty({ description: 'Name of the lookalike audience.' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Optional description for the audience.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID of an existing custom audience in Ad Manager to use as the source.' })
  @IsString()
  @IsNotEmpty()
  sourceAudienceId: string; // Internal Ad Manager Audience ID

  @ApiProperty({ type: [LookalikeSpecDto], description: 'Array of ad network-specific lookalike specifications. Each spec defines creation parameters for one ad network.'})
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => LookalikeSpecDto)
  lookalikeSpecifications: LookalikeSpecDto[];
}


### 4.3 `AudienceResponseDto` (`audience.v1.response.dto.ts`)
typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AudienceSyncStatusResponseDto } from './audience-sync-status.v1.response.dto';

export class AudienceResponseDto {
  @ApiProperty({ description: 'Unique identifier for the audience.' })
  id: string;

  @ApiProperty({ description: 'Merchant identifier who owns this audience.' })
  merchantId: string;

  @ApiProperty({ description: 'Name of the audience.' })
  name: string;

  @ApiPropertyOptional({ description: 'Description of the audience.' })
  description?: string | null;

  @ApiProperty({ enum: ['CUSTOM', 'LOOKALIKE'], description: 'Type of the audience.' })
  type: 'CUSTOM' | 'LOOKALIKE';

  @ApiProperty({ description: 'Source type of the audience data.' })
  sourceType: string; // e.g., 'PLATFORM_DATA_SEGMENT', 'CUSTOMER_LIST_UPLOAD', 'LOOKALIKE_SOURCE'

  @ApiPropertyOptional({ description: 'Details about the source, structure depends on sourceType.' })
  sourceDetails?: any; // e.g., { platformSegmentId: 'seg123' } or { sourceAudienceId: 'aud456', sourceAudienceName: 'High Value Customers' }

  @ApiProperty({ type: () => [AudienceSyncStatusResponseDto], description: 'Synchronization status across different ad networks.' })
  adNetworkSyncInfo: AudienceSyncStatusResponseDto[];

  @ApiProperty({ description: 'Timestamp of audience creation.' })
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp of last audience update.' })
  updatedAt: Date;
}


### 4.4 `AudienceListResponseDto` (`audience-list.v1.response.dto.ts`)
typescript
import { ApiProperty } from '@nestjs/swagger';
import { AudienceResponseDto } from './audience.v1.response.dto';

export class AudienceListResponseDto {
  @ApiProperty({ type: () => [AudienceResponseDto], description: 'Array of audience objects.' })
  data: AudienceResponseDto[];

  @ApiProperty({ description: 'Total number of audiences matching the query.' })
  total: number;

  @ApiProperty({ description: 'Current page number.' })
  page: number;

  @ApiProperty({ description: 'Number of items per page.' })
  limit: number;
}


### 4.5 `SyncAudienceRequestDto` (`sync-audience.v1.request.dto.ts`)
typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class SyncAudienceRequestDto {
  @ApiProperty({ type: [String], description: 'List of Ad Network IDs to synchronize the audience with. This can include new networks or re-sync existing ones.' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  adNetworkIds: string[];
}


### 4.6 `AudienceSyncStatusResponseDto` (`audience-sync-status.v1.response.dto.ts`)
typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AudienceSyncStatusResponseDto {
  @ApiProperty({ description: 'Identifier of the ad network.' })
  adNetworkId: string;
  
  @ApiProperty({ description: 'Name of the ad network.' })
  adNetworkName: string; // Added for better UX

  @ApiPropertyOptional({ description: 'External ID of the audience on the ad network, if synced.' })
  externalAudienceId?: string | null;

  @ApiProperty({ description: 'Current synchronization status with the ad network.' , example: 'SYNCED | PENDING_SYNC | FAILED | NOT_CONFIGURED | SYNCING'})
  status: string; // e.g., 'SYNCED', 'PENDING_SYNC', 'FAILED', 'NOT_CONFIGURED', 'SYNCING'

  @ApiPropertyOptional({ description: 'Timestamp of the last successful synchronization or attempt.' })
  lastSyncedAt?: Date | null;

  @ApiPropertyOptional({ type: Number, description: 'Current estimated size of the audience on the ad network.' })
  currentSize?: number | null;

  @ApiPropertyOptional({ description: 'Any informational or error message from the ad network regarding this audience.' })
  message?: string | null;
}


### 4.7 `UpdateAudienceRequestDto` (`update-audience.v1.request.dto.ts`)
typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNullable } from 'class-validator';

export class UpdateAudienceRequestDto {
  @ApiPropertyOptional({ description: 'New name for the audience.' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'New description for the audience. Can be set to null to clear existing description.' })
  @IsString()
  @IsOptional()
  @IsNullable()
  description?: string | null;
}


### 4.8 `AudienceQueryDto` (`audience-query.v1.dto.ts`)
typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, Max, IsOptional, IsString, IsIn } from 'class-validator';

export class AudienceQueryDto {
  @ApiPropertyOptional({ description: 'Page number for pagination.', default: 1, type: Number })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page.', default: 10, maximum: 100, type: Number })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by audience name (partial match).' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: ['CUSTOM', 'LOOKALIKE'], description: 'Filter by audience type.' })
  @IsIn(['CUSTOM', 'LOOKALIKE'])
  @IsOptional()
  type?: 'CUSTOM' | 'LOOKALIKE';

  @ApiPropertyOptional({ description: 'Filter by audiences configured or synced with a specific ad network ID.' })
  @IsString()
  @IsOptional()
  adNetworkId?: string;
}


## 5. Service Layer Interface Contract
The controller will primarily interact with an `IAudienceManagementService`.

### 5.1 `IAudienceManagementService` (`audience-management.service.interface.ts`)
Located in `src/modules/audience-management/services/audience-management.service.interface.ts`.
typescript
import { 
  CreateCustomAudienceRequestDto, 
  CreateLookalikeAudienceRequestDto, 
  AudienceResponseDto, 
  AudienceListResponseDto, 
  UpdateAudienceRequestDto, 
  SyncAudienceRequestDto, 
  AudienceSyncStatusResponseDto,
  AudienceQueryDto
} from '../api/v1/dtos'; // Adjust path as necessary

export interface IAudienceManagementService {
  createCustomAudience(
    merchantId: string, 
    createDto: CreateCustomAudienceRequestDto
  ): Promise<AudienceResponseDto>;

  createLookalikeAudience(
    merchantId: string, 
    createDto: CreateLookalikeAudienceRequestDto
  ): Promise<AudienceResponseDto>;

  getAudienceById(
    merchantId: string, 
    audienceId: string
  ): Promise<AudienceResponseDto | null>;

  listAudiences(
    merchantId: string, 
    query: AudienceQueryDto
  ): Promise<AudienceListResponseDto>;

  updateAudience(
    merchantId: string, 
    audienceId: string, 
    updateDto: UpdateAudienceRequestDto
  ): Promise<AudienceResponseDto>;

  deleteAudience(
    merchantId: string, 
    audienceId: string
  ): Promise<void>;

  synchronizeAudience(
    merchantId: string, 
    audienceId: string, 
    syncRequest: SyncAudienceRequestDto
  ): Promise<AudienceSyncStatusResponseDto[]>; // Returns status for networks requested in syncRequest

  getAudienceSynchronizationStatus(
    merchantId: string, 
    audienceId: string, 
    adNetworkId?: string // Optional: to get status for a specific network
  ): Promise<AudienceSyncStatusResponseDto[]>; // Returns status for all configured networks or the specified one
}


## 6. External Service Interface Contracts
The `AudienceManagementService` (implemented elsewhere) will depend on these interfaces.

### 6.1 `IAdNetworkService` (`ad-network.interface.ts`)
Located in `src/modules/audience-management/interfaces/ad-network.interface.ts`.
typescript
// AudienceDefinition can be complex and network-specific
interface AudienceDefinition {
  name: string;
  description?: string;
  // ... other common fields, or allow 'any' for flexibility
  [key: string]: any; 
}

interface LookalikeSpec {
  countryCode: string;
  sizePercentage?: number;
  // ... other network-specific lookalike params
  [key: string]: any;
}

export interface IAdNetworkService {
  createCustomAudienceOnNetwork(
    adNetworkId: string, // e.g., 'google', 'facebook'
    audienceDefinition: AudienceDefinition, // Contains data like hashed PII list or rules
    merchantId: string, // For context, ad network account mapping
    adManagerAudienceId: string // Ad Manager's internal ID for this audience
  ): Promise<{ externalAudienceId: string; status: string; message?: string }>;

  createLookalikeAudienceOnNetwork(
    adNetworkId: string,
    sourceExternalAudienceId: string, // The ID of the source audience on the ad network
    lookalikeSpec: LookalikeSpec,
    merchantId: string,
    adManagerAudienceId: string // Ad Manager's internal ID for this new lookalike audience
  ): Promise<{ externalAudienceId: string; status: string; message?: string }>;

  // This might be more complex, potentially involving uploading data
  synchronizeAudienceWithNetwork(
    adNetworkId: string,
    externalAudienceId: string, // The ID of the audience on the ad network
    audienceData: any, // e.g., updated list of users to add/remove
    merchantId: string
  ): Promise<{ status: string; message?: string }>;

  getAudienceSyncStatusFromNetwork(
    adNetworkId: string,
    externalAudienceId: string,
    merchantId: string
  ): Promise<{ status: string; size?: number; message?: string; lastRefreshed?: Date }>;
  
  getAdNetworkDetails(adNetworkId: string): Promise<{ id: string; name: string; supportsCustomAudiences: boolean; supportsLookalikeAudiences: boolean; }>;
}


### 6.2 `ICorePlatformDataService` (`platform-data.interface.ts`)
Located in `src/modules/audience-management/interfaces/platform-data.interface.ts`.
typescript
interface CustomerPii {
  email?: string;
  phone?: string;
  // ... other identifiable fields
  [key: string]: any;
}

export interface ICorePlatformDataService {
  // Retrieves a list of customer PII based on a segment defined in the core platform
  getCustomerPiiBySegment(
    segmentId: string, 
    merchantId: string
  ): Promise<CustomerPii[]>;

  // Hashes specified PII fields in a list of customer data
  // Returns the list with specified fields hashed
  hashCustomerPiiBatch(
    customerData: CustomerPii[], 
    fieldsToHash: Array<keyof CustomerPii>
  ): Promise<Array<{[key: string]: any}>>; // Returns data with specified fields hashed
}


## 7. Audience Entity
The conceptual structure of an Audience entity managed by the `AudienceManagementService`. The persistence of this entity is outside the scope of `AudienceManagement.ApiEndpoints` but its structure informs the DTOs.

### 7.1 `Audience` (`audience.entity.ts`)
Located in `src/modules/audience-management/entities/audience.entity.ts`.
typescript
interface AdNetworkSyncDetail {
  adNetworkId: string;
  adNetworkName: string; // For display purposes
  externalAudienceId?: string; // ID on the ad network
  status: string; // e.g., 'SYNCED', 'PENDING_CREATION', 'PENDING_SYNC', 'FAILED_CREATION', 'FAILED_SYNC', 'NOT_CONFIGURED'
  lastSyncAttempt?: Date;
  lastSuccessfulSync?: Date;
  message?: string; // Error or informational message
  currentSize?: number; // Size on the ad network
}

export class Audience {
  id: string; // UUID, primary key
  merchantId: string; // UUID, links to merchant
  name: string;
  description?: string | null;
  type: 'CUSTOM' | 'LOOKALIKE';
  sourceType: 'PLATFORM_DATA_SEGMENT' | 'CUSTOMER_LIST_UPLOAD' | 'LOOKALIKE_SOURCE'; // For CUSTOM, or identifies the source type for LOOKALIKE
  
  // Details specific to the source
  sourceDetails: {
    platformDataSourceId?: string;       // If sourceType is PLATFORM_DATA_SEGMENT
    customerListFileKey?: string;      // If sourceType is CUSTOMER_LIST_UPLOAD
    originalSourceAudienceId?: string; // If type is LOOKALIKE, this is the AdManager ID of the source custom audience
    // For LOOKALIKE, might also store the specific spec used per network if it varies beyond general creation params
  };

  // Stores synchronization information for each ad network this audience is targeted for
  adNetworkSyncInfo: AdNetworkSyncDetail[];
  
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null; // For soft deletes
}


## 8. Error Handling
A global exception filter (`AllExceptionsFilter`) will be configured in `main.ts` to catch unhandled exceptions and format them into a standardized JSON error response:
json
{
  "statusCode": 500, // or other relevant HTTP status code
  "timestamp": "2023-01-01T12:00:00.000Z",
  "path": "/requested/path",
  "method": "POST",
  "message": "Internal server error", // or more specific error message
  "details": [] // Optional: array of specific error details for bad requests (from ValidationPipe)
}

-   **400 Bad Request:** Used for validation errors from DTOs (handled by `ValidationPipe`) or other client-side errors.
-   **401 Unauthorized:** Used when JWT is missing, invalid, or expired.
-   **403 Forbidden:** Used when an authenticated user does not have the required role for an operation.
-   **404 Not Found:** Used when a requested resource (e.g., specific audience) is not found.
-   **500 Internal Server Error:** Used for unhandled server-side errors.
-   **503 Service Unavailable:** Used if a critical downstream service (e.g., Ad Network API) is temporarily unavailable and the circuit breaker is open.

## 9. Security Considerations
-   **Authentication:** All endpoints will be protected by `JwtAuthGuard` which validates JWTs passed in the `Authorization` header (Bearer token). The JWT payload will contain `merchantId` and user `roles`.
-   **Authorization:** `RolesGuard` will be used to enforce RBAC. Controller methods will be decorated with `@Roles('MerchantAdmin', 'CampaignManager')` or similar.
-   **Input Validation:** All incoming request payloads (DTOs) will be validated using `class-validator` via a global `ValidationPipe`. This helps prevent common vulnerabilities like injection attacks by ensuring data types and formats.
-   **Rate Limiting:** While not implemented in this repository directly, Amazon API Gateway should be configured with rate limiting policies to protect backend services from abuse.
-   **HTTPS:** All communication must be over HTTPS, enforced at the API Gateway level.
-   **PII Handling:** Although the API layer itself doesn't directly process raw PII lists (it expects file keys or segment IDs), it's crucial that the `AudienceManagementService` and downstream services (like `ICorePlatformDataService` and `IAdNetworkService`) handle PII securely, including hashing before transmission to ad networks, as indicated in `CreateCustomAudienceRequestDto` and related service interfaces. The `dataProcessingOptions.consentVerified` flag in DTOs acknowledges merchant responsibility.

## 10. Constants
File: `src/modules/audience-management/constants/audience.constants.ts`
typescript
export const AUDIENCE_MANAGEMENT_SERVICE_TOKEN = 'IAudienceManagementService';
export const AD_NETWORK_INTEGRATION_SERVICE_TOKEN = 'IAdNetworkService';
export const CORE_PLATFORM_DATA_SERVICE_TOKEN = 'ICorePlatformDataService';

export enum AudienceType {
  CUSTOM = 'CUSTOM',
  LOOKALIKE = 'LOOKALIKE',
}

export enum CustomAudienceSourceType {
  PLATFORM_DATA_SEGMENT = 'PLATFORM_DATA_SEGMENT',
  CUSTOMER_LIST_UPLOAD = 'CUSTOMER_LIST_UPLOAD',
}

export enum LookalikeAudienceSourceType {
  LOOKALIKE_SOURCE = 'LOOKALIKE_SOURCE', // Indicates it's derived from another audience
}

// Example Sync Statuses (can be expanded)
export enum AudienceSyncStatus {
  NOT_CONFIGURED = 'NOT_CONFIGURED',
  PENDING_CREATION = 'PENDING_CREATION',
  PENDING_SYNC = 'PENDING_SYNC',
  SYNCING = 'SYNCING',
  SYNCED = 'SYNCED',
  FAILED_CREATION = 'FAILED_CREATION',
  FAILED_SYNC = 'FAILED_SYNC',
  DELETING = 'DELETING',
  DELETED_FROM_NETWORK = 'DELETED_FROM_NETWORK',
  FAILED_DELETION = 'FAILED_DELETION',
}


## 11. Swagger/OpenAPI Documentation
-   Swagger UI will be enabled and accessible at a defined endpoint (e.g., `/api/v1/audience-management/docs`).
-   This will be configured in `main.ts` using `SwaggerModule` and `DocumentBuilder` from `@nestjs/swagger`.
-   `DocumentBuilder` will specify API title ("Audience Management API"), description, version ("1.0"), and tags.
-   Controllers and DTOs will use `@ApiProperty()`, `@ApiOperation()`, `@ApiResponse()`, etc., decorators to provide detailed metadata for the Swagger documentation.
-   JWT authentication will be configured in Swagger UI to allow testing secured endpoints.

## 12. Global Configuration (`main.ts`)
typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'; // Assuming this filter exists

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api'); // Global prefix for all routes

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert query/path params to expected types
      },
    }),
  );

  // app.useGlobalFilters(new AllExceptionsFilter()); // Enable global exception filter

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Ad Manager - Audience Management API')
    .setDescription('API endpoints for managing advertising audiences (custom, lookalike) and their synchronization with ad networks.')
    .setVersion('1.0')
    .addTag('Audiences', 'Operations related to audience management')
    .addBearerAuth( // Configuration for JWT Bearer Token in Swagger UI
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header'
      },
      'jwt', // This name is used to apply the auth scheme to endpoints
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/audience-management/docs', app, document);

  const port = process.env.PORT || 3002; // Example port, configure as needed
  await app.listen(port);
  logger.log(`Audience Management API is running on: ${await app.getUrl()}/api/v1/audience-management/docs`);
}
bootstrap();


## 13. Module Structure

### 13.1 `AudienceV1ApiModule` (`audience.v1.module.ts`)
Located in `src/modules/audience-management/api/v1/audience.v1.module.ts`.
-   **Controllers:** `AudienceV1Controller`
-   **Imports:** `AudienceManagementCoreModule` (to access the `IAudienceManagementService` provider)
-   **Purpose:** Encapsulates all V1 API related components for audience management.

typescript
import { Module } from '@nestjs/common';
import { AudienceV1Controller } from './audience.v1.controller';
import { AudienceManagementCoreModule } from '../../audience-management-core.module';
// Import guards if they are local to this module or provided by a shared auth module
// import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../../../auth/guards/roles.guard';


@Module({
  imports: [
    AudienceManagementCoreModule, 
    // AuthModule // if JwtAuthGuard and RolesGuard are provided by a central AuthModule
  ],
  controllers: [AudienceV1Controller],
  // providers: [JwtAuthGuard, RolesGuard] // If guards are not globally available or part of an AuthModule
})
export class AudienceV1ApiModule {}


### 13.2 `AudienceManagementCoreModule` (`audience-management-core.module.ts`)
Located in `src/modules/audience-management/audience-management-core.module.ts`.
-   **Imports:** `AudienceV1ApiModule`. Potentially `TypeOrmModule.forFeature([Audience])` if this module owns `Audience` entity persistence directly. If services are in other repositories, this module will define providers for the *interfaces* (`IAdNetworkService`, `ICorePlatformDataService`) potentially using client modules for those external services.
-   **Providers:**
    -   `AudienceManagementService` (implementation of `IAudienceManagementService`). This service will be injected with `IAdNetworkService` and `ICorePlatformDataService` (and `AudienceRepository` if applicable).
    -   Provider for `IAdNetworkService` (e.g., a mock or a client for the actual service).
    -   Provider for `ICorePlatformDataService` (e.g., a mock or a client for the actual service).
-   **Exports:** `IAudienceManagementService` (via its token `AUDIENCE_MANAGEMENT_SERVICE_TOKEN`) so `AudienceV1ApiModule` can import and use it.
-   **Purpose:** The central domain module for audience management.

typescript
import { Module, Logger } from '@nestjs/common';
import { AudienceV1ApiModule } from './api/v1/audience.v1.module';
import { AudienceManagementService } from './services/audience-management.service';
import { AUDIENCE_MANAGEMENT_SERVICE_TOKEN, AD_NETWORK_INTEGRATION_SERVICE_TOKEN, CORE_PLATFORM_DATA_SERVICE_TOKEN } from './constants/audience.constants';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Audience } from './entities/audience.entity';

// Mock/Placeholder implementations for external services.
// In a real scenario, these would be client modules for other microservices or actual implementations.
const mockAdNetworkService = {
  provide: AD_NETWORK_INTEGRATION_SERVICE_TOKEN,
  useValue: {
    createCustomAudienceOnNetwork: jest.fn().mockResolvedValue({ externalAudienceId: 'net-aud-123', status: 'PENDING_CREATION' }),
    createLookalikeAudienceOnNetwork: jest.fn().mockResolvedValue({ externalAudienceId: 'net-laud-456', status: 'PENDING_CREATION' }),
    synchronizeAudienceWithNetwork: jest.fn().mockResolvedValue({ status: 'SYNCING' }),
    getAudienceSyncStatusFromNetwork: jest.fn().mockResolvedValue({ status: 'SYNCED', size: 1000 }),
    getAdNetworkDetails: jest.fn().mockImplementation(id => Promise.resolve({ id, name: `${id.toUpperCase()} Network`, supportsCustomAudiences: true, supportsLookalikeAudiences: true}))
  },
};
const mockCorePlatformDataService = {
  provide: CORE_PLATFORM_DATA_SERVICE_TOKEN,
  useValue: {
    getCustomerPiiBySegment: jest.fn().mockResolvedValue([{ email: 'test@example.com' }]),
    hashCustomerPiiBatch: jest.fn().mockImplementation(data => Promise.resolve(data.map(d => ({ ...d, email_hashed: 'hashed_'+d.email }))))
  },
};

@Module({
  imports: [
    // AudienceV1ApiModule, // This creates a circular dependency if AudienceV1ApiModule imports this.
                           // AudienceV1ApiModule should import this.
    // TypeOrmModule.forFeature([Audience]), // If this module handles DB persistence for Audience
  ],
  providers: [
    {
      provide: AUDIENCE_MANAGEMENT_SERVICE_TOKEN,
      useClass: AudienceManagementService,
    },
    // Provide actual implementations or client modules for these in a real setup
    mockAdNetworkService,
    mockCorePlatformDataService,
    Logger, // AudienceManagementService might use NestJS Logger
    // Add AudienceRepository provider if TypeORM is used and Audience entity is managed here
  ],
  exports: [
    AUDIENCE_MANAGEMENT_SERVICE_TOKEN, // Export the token for injection
  ],
})
export class AudienceManagementCoreModule {}

**Correction for Module Structure:** `AudienceV1ApiModule` imports `AudienceManagementCoreModule`. `AudienceManagementCoreModule` should not import `AudienceV1ApiModule` to avoid circular dependencies. The `AudienceManagementCoreModule` provides services that the API module consumes.

### 13.3 `AppModule` (`app.module.ts`)
Located in `src/app.module.ts`.
-   **Imports:** `AudienceManagementCoreModule`. Potentially a global `ConfigModule` or `AuthModule`.
-   **Purpose:** Root module of the application.

typescript
import { Module } from '@nestjs/common';
import { AudienceManagementCoreModule } from './modules/audience-management/audience-management-core.module';
// import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module'; // If a central auth module is used

@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true }), // Example: if using @nestjs/config
    // AuthModule, // Example: if using a shared AuthModule for guards
    AudienceManagementCoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}


This SDS provides a comprehensive plan for developing the `AudienceManagement.ApiEndpoints` repository. It covers API design, DTOs, service contracts, security, and module structure, aligned with the provided requirements and technology stack.