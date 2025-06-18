# Software Design Specification: DataGovernanceCompliance.ApiEndpoints

## 1. Introduction

### 1.1 Purpose
This document provides the detailed software design specification for the `DataGovernanceCompliance.ApiEndpoints` repository (REPO-DATAGOV-012). This repository is responsible for exposing RESTful API endpoints to manage data governance and compliance tasks within the Ad Manager Platform. These tasks include handling Data Subject Rights (DSR) requests, managing end-user consent, configuring and enforcing data retention policies, and providing data for compliance reporting.

The primary consumers of these APIs are internal administrative interfaces (Platform Administrator Portal) and potentially merchant-facing self-service components within the Merchant Ad Manager Portal.

### 1.2 Scope
The scope of this document covers the design of all API endpoints, Data Transfer Objects (DTOs), controllers, modules, guards, decorators, and configuration specific to the `DataGovernanceCompliance.ApiEndpoints` repository. It details how these components interact to fulfill the requirements mapped to this repository, specifically:
-   REQ-MDGC-001: Compliance with data protection regulations, Privacy by Design/Default.
-   REQ-MDGC-003: Consent management mechanisms.
-   REQ-MDGC-004: Data Subject Rights (DSR) management.
-   REQ-MDGC-005: Data retention policy implementation and enforcement.
-   REQ-MDGC-007: Data Processing Agreements (DPAs) and merchant compliance reporting.
-   REQ-MDGC-008: Comprehensive audit trails for data governance and compliance.
-   REQ-POA-013: Platform Administrator compliance reporting.

This SDS does *not* cover the implementation of the business logic itself, which is assumed to be handled by a separate `DataGovernanceComplianceService` (defined by `IDataGovernanceComplianceService.interface.ts` and implemented in a different layer/repository).

### 1.3 Definitions, Acronyms, and Abbreviations
-   **API**: Application Programming Interface
-   **DSR**: Data Subject Rights (e.g., access, rectification, erasure)
-   **DTO**: Data Transfer Object
-   **GDPR**: General Data Protection Regulation
-   **CCPA**: California Consumer Privacy Act
-   **PII**: Personally Identifiable Information
-   **JWT**: JSON Web Token
-   **RBAC**: Role-Based Access Control
-   **SDK**: Software Development Kit
-   **UI**: User Interface
-   **CRUD**: Create, Read, Update, Delete
-   **DPA**: Data Processing Agreement
-   **SDS**: Software Design Specification

## 2. System Overview
The `DataGovernanceCompliance.ApiEndpoints` repository provides a set of NestJS-based RESTful API endpoints. These endpoints serve as the primary interface for managing data privacy, consent, DSR requests, data retention policies, and generating compliance-related reports. The API is versioned (V1) and secured using JWT-based authentication and role-based authorization. It leverages NestJS features like modules, controllers, services (interfaces), pipes for validation, and guards for security. Swagger/OpenAPI documentation will be automatically generated.

The API layer is designed to be stateless and will delegate all business logic processing to an underlying `IDataGovernanceComplianceService`.

## 3. System Architecture
This repository implements the API Gateway Layer and interacts with the Application Services Layer (where `IDataGovernanceComplianceService` would reside) as per the overall microservices architecture.

### 3.1 Technology Stack
-   **Language**: TypeScript 5.4.5
-   **Framework**: NestJS 10.3.9
-   **Runtime**: Node.js 20.15.0 (LTS)
-   **API Specification**: OpenAPI 3.1.0 (via `@nestjs/swagger`)
-   **Authentication**: JWT
-   **Third-party Libraries**:
    -   `class-validator`: For DTO validation.
    -   `class-transformer`: For transforming plain objects to DTO instances.
    -   `@nestjs/swagger`: For API documentation generation.
    -   `@nestjs/config`: For configuration management.
    -   `@nestjs/passport`, `passport`, `passport-jwt`: For JWT authentication.

## 4. API Endpoint Design
All V1 endpoints will be prefixed with `/api/v1/data-governance`.

### 4.1. Common Components
#### 4.1.1. Authentication and Authorization
-   **`JwtAuthGuard`**: Applied to all protected endpoints. Verifies the JWT in the `Authorization` header.
-   **`RolesGuard`**: Used in conjunction with `JwtAuthGuard` and the `@Roles()` decorator to enforce RBAC.
-   **`PlatformAdminGuard`**: A specific guard ensuring the authenticated user has the `PlatformAdministrator` role.
-   **`@User()` Decorator**: Custom decorator to extract the authenticated user object from the request.
-   **`@Roles()` Decorator**: Custom decorator to specify allowed roles for an endpoint.

#### 4.1.2. DTOs (Data Transfer Objects)
-   DTOs are defined in `src/modules/data-governance/api/v1/dtos/` subdirectories.
-   They use `class-validator` for input validation and `@nestjs/swagger`'s `@ApiProperty()` for documentation.
-   **`PagedResponseDto<T>`**: Generic DTO for paginated responses.
    -   `data: T[]`
    -   `totalCount: number`
    -   `page: number`
    -   `pageSize: number`
-   **`IdParamDto`**: For validating ID path parameters.
    -   `id: string` (e.g., `@IsUUID()`)

#### 4.1.3. Service Interface
-   **`IDataGovernanceComplianceService`**: (Path: `src/modules/data-governance/api/v1/interfaces/data-governance-compliance.service.interface.ts`)
    -   This interface defines the contract that the actual service implementation (in another layer/repository) must adhere to. All controller methods will delegate to methods of this service.
    -   Methods are as defined in the `file_structure_json`.

### 4.2. Consent Management Endpoints
Controller: `ConsentController` (Path: `src/modules/data-governance/api/v1/controllers/consent.controller.ts`)
Base Path: `/api/v1/data-governance/consent`

1.  **Manage Consent Preferences (REQ-MDGC-003)**
    -   **Endpoint**: `POST /merchants/{merchantId}`
    -   **Description**: Allows a merchant (or user on their behalf) to create or update consent preferences for a specific user under their scope.
    -   **Path Parameters**:
        -   `merchantId: string` (Validated, e.g., `@IsUUID()`)
    -   **Request Body**: `ManageConsentDto`
    -   **Response**: `201 Created` with `ConsentRecordDto`
    -   **Authentication**: `JwtAuthGuard`, `RolesGuard` (e.g., `['MerchantAdmin', 'CampaignManager']` or system user if self-service)
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiBody`, `@ApiParam`
    -   **Service Method Called**: `dataGovernanceService.manageMerchantConsent(merchantId, consentData)`

2.  **Get Consent Records (REQ-MDGC-003)**
    -   **Endpoint**: `GET /merchants/{merchantId}/records`
    -   **Description**: Retrieves paginated consent records for a specific merchant, filterable by query parameters.
    -   **Path Parameters**:
        -   `merchantId: string` (Validated)
    -   **Query Parameters**: `ConsentReportQueryDto`
    -   **Response**: `200 OK` with `PagedResponseDto<ConsentRecordDto>`
    -   **Authentication**: `JwtAuthGuard`, `RolesGuard` (e.g., `['MerchantAdmin', 'PlatformAdministrator']`)
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiQuery`, `@ApiParam`
    -   **Service Method Called**: `dataGovernanceService.getMerchantConsentRecords(merchantId, query)`

3.  **Get Default Consent Settings (REQ-MDGC-001)**
    -   **Endpoint**: `GET /features/{feature}/default-settings`
    -   **Description**: Retrieves the default privacy/consent settings for a given platform feature, aligning with "Privacy by Default".
    -   **Path Parameters**:
        -   `feature: string` (Identifier for the platform feature)
    -   **Response**: `200 OK` with `any` (structure to be defined based on feature complexity, e.g., `DefaultConsentSettingDto`)
    -   **Authentication**: `JwtAuthGuard` (Potentially open or restricted to internal roles)
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiParam`
    -   **Service Method Called**: `dataGovernanceService.getDefaultPrivacySettings(feature)`

### 4.3. Data Subject Rights (DSR) Management Endpoints
Controller: `DsrController` (Path: `src/modules/data-governance/api/v1/controllers/dsr.controller.ts`)
Base Path: `/api/v1/data-governance/dsr`

1.  **Submit DSR Request (REQ-MDGC-004)**
    -   **Endpoint**: `POST /`
    -   **Description**: Allows a user (or an admin on their behalf) to submit a DSR request.
    -   **Request Body**: `SubmitDsrDto`
    -   **Response**: `201 Created` with `DsrRequestDto`
    -   **Authentication**: `JwtAuthGuard` (User submitting for themselves or admin role)
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiBody`
    -   **Service Method Called**: `dataGovernanceService.handleDsrRequest(user.id, requestData)` (user.id is from authenticated JWT)

2.  **Get DSR Request Status (REQ-MDGC-004)**
    -   **Endpoint**: `GET /{requestId}/status`
    -   **Description**: Retrieves the current status of a submitted DSR request.
    -   **Path Parameters**:
        -   `requestId: string` (Validated using `IdParamDto`)
    -   **Response**: `200 OK` with `DsrRequestDto`
    -   **Authentication**: `JwtAuthGuard` (Requester or authorized admin)
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiParam`
    -   **Service Method Called**: `dataGovernanceService.getDsrRequestStatus(requestId)`

3.  **Export DSR Data (REQ-MDGC-004)**
    -   **Endpoint**: `GET /{requestId}/export`
    -   **Description**: Provides data export for DSR access/portability requests.
    -   **Path Parameters**:
        -   `requestId: string` (Validated using `IdParamDto`)
    -   **Response**: `200 OK` with `DsrDataExportDto` (may contain a download link or the data itself if small)
    -   **Authentication**: `JwtAuthGuard` (Requester or authorized admin)
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiParam`
    -   **Service Method Called**: `dataGovernanceService.exportDsrData(requestId)`

4.  **Fulfill DSR Request Action (Admin) (REQ-MDGC-004)**
    -   **Endpoint**: `POST /admin/actions`
    -   **Description**: Allows Platform Administrators to take action on DSR requests (e.g., approve, deny, mark complete, trigger erasure).
    -   **Request Body**: `DsrActionDto`
    -   **Response**: `200 OK` with `DsrRequestDto` (updated request)
    -   **Authentication**: `JwtAuthGuard`, `PlatformAdminGuard`
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiBody`
    -   **Service Method Called**: `dataGovernanceService.fulfillDsrRequestAction(adminUser.id, actionData)`

### 4.4. Data Retention Policy Management Endpoints
Controller: `DataRetentionController` (Path: `src/modules/data-governance/api/v1/controllers/data-retention.controller.ts`)
Base Path: `/api/v1/data-governance/data-retention`

1.  **Configure Retention Policy (Admin) (REQ-MDGC-005)**
    -   **Endpoint**: `POST /policies`
    -   **Description**: Allows Platform Administrators to create or update data retention policies.
    -   **Request Body**: `ConfigureRetentionPolicyDto`
    -   **Response**: `201 Created` or `200 OK` with `RetentionPolicyDto`
    -   **Authentication**: `JwtAuthGuard`, `PlatformAdminGuard`
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiBody`
    -   **Service Method Called**: `dataGovernanceService.configureRetentionPolicy(adminUser.id, policyData)`

2.  **Get Retention Policy (REQ-MDGC-005)**
    -   **Endpoint**: `GET /policies/{policyType}`
    -   **Description**: Retrieves details of a specific data retention policy.
    -   **Path Parameters**:
        -   `policyType: string` (Identifier for the data type or policy name)
    -   **Response**: `200 OK` with `RetentionPolicyDto`
    -   **Authentication**: `JwtAuthGuard`, `RolesGuard` (e.g., `['PlatformAdministrator']`)
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiParam`
    -   **Service Method Called**: `dataGovernanceService.getRetentionPolicy(policyType)`

3.  **Trigger Data Lifecycle Action (Admin) (REQ-MDGC-005)**
    -   **Endpoint**: `POST /actions`
    -   **Description**: Allows Platform Administrators to manually trigger data lifecycle actions (e.g., archive, purge) based on defined criteria.
    -   **Request Body**: `DataLifecycleActionDto`
    -   **Response**: `202 Accepted` (for asynchronous actions) or `204 No Content`
    -   **Authentication**: `JwtAuthGuard`, `PlatformAdminGuard`
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiBody`
    -   **Service Method Called**: `dataGovernanceService.triggerDataLifecycleAction(adminUser.id, actionData)`

4.  **Get Default Retention Settings (REQ-MDGC-001)**
    -   **Endpoint**: `GET /defaults/{dataType}`
    -   **Description**: Retrieves default retention settings for a specific data type, aligning with "Privacy by Default".
    -   **Path Parameters**:
        -   `dataType: string` (e.g., 'audit_logs', 'pii_closed_accounts')
    -   **Response**: `200 OK` with `any` (structure like `RetentionPolicyDto` but marked as default)
    -   **Authentication**: `JwtAuthGuard`, `RolesGuard` (e.g., `['PlatformAdministrator']`)
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiParam`
    -   **Service Method Called**: `dataGovernanceService.getDefaultRetentionSettings(dataType)`

### 4.5. Merchant Compliance Endpoints
Controller: `ComplianceController` (Path: `src/modules/data-governance/api/v1/controllers/compliance.controller.ts`)
Base Path: `/api/v1/data-governance/compliance`

1.  **Get DPA Status (REQ-MDGC-007)**
    -   **Endpoint**: `GET /merchants/{merchantId}/dpa`
    -   **Description**: Retrieves the Data Processing Agreement status for a specific merchant.
    -   **Path Parameters**:
        -   `merchantId: string` (Validated)
    -   **Response**: `200 OK` with `DpaDto`
    -   **Authentication**: `JwtAuthGuard`, `RolesGuard` (e.g., `['MerchantAdmin']`, ensuring user is associated with `merchantId`)
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiParam`
    -   **Service Method Called**: `dataGovernanceService.getDpaStatusForMerchant(merchantId)`

2.  **Acknowledge DPA (REQ-MDGC-007)**
    -   **Endpoint**: `POST /merchants/{merchantId}/dpa/acknowledge`
    -   **Description**: Allows a merchant to acknowledge the current DPA.
    -   **Path Parameters**:
        -   `merchantId: string` (Validated)
    -   **Response**: `200 OK` with `DpaDto` (updated status)
    -   **Authentication**: `JwtAuthGuard`, `RolesGuard` (e.g., `['MerchantAdmin']`, ensuring user is associated with `merchantId`)
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiParam`
    -   **Service Method Called**: `dataGovernanceService.acknowledgeDpaForMerchant(merchantId, user.id)`

3.  **Generate Data Processing Activity Log (REQ-MDGC-007)**
    -   **Endpoint**: `GET /merchants/{merchantId}/processing-logs`
    -   **Description**: Generates a data processing activity log for a specific merchant.
    -   **Path Parameters**:
        -   `merchantId: string` (Validated)
    -   **Query Parameters**: `ProcessingActivityLogQueryDto`
    -   **Response**: `200 OK` with `ProcessingActivityLogDto`
    -   **Authentication**: `JwtAuthGuard`, `RolesGuard` (e.g., `['MerchantAdmin']`, ensuring user is associated with `merchantId`)
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiQuery`, `@ApiParam`
    -   **Service Method Called**: `dataGovernanceService.generateDataProcessingActivityLog(merchantId, query)`

4.  **Get Merchant Audit Trail (REQ-MDGC-008)**
    -   **Endpoint**: `GET /merchants/{merchantId}/audit-trail`
    -   **Description**: Retrieves paginated audit trail entries specific to a merchant.
    -   **Path Parameters**:
        -   `merchantId: string` (Validated)
    -   **Query Parameters**: `AuditTrailQueryDto`
    -   **Response**: `200 OK` with `PagedResponseDto<AuditTrailEntryDto>`
    -   **Authentication**: `JwtAuthGuard`, `RolesGuard` (e.g., `['MerchantAdmin']`, ensuring user is associated with `merchantId`)
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiQuery`, `@ApiParam`
    -   **Service Method Called**: `dataGovernanceService.getAuditTrailEntries(query)` (Service needs to scope by merchantId)

### 4.6. Platform Administrator Compliance Reporting Endpoints
Controller: `AdminComplianceController` (Path: `src/modules/data-governance/api/v1/controllers/admin/admin-compliance.controller.ts`)
Base Path: `/api/v1/data-governance/admin/compliance`

1.  **Generate User Access Report (REQ-POA-013)**
    -   **Endpoint**: `GET /reports/user-access`
    -   **Description**: Generates a user access report for platform administrators.
    -   **Query Parameters**: `UserAccessReportQueryDto`
    -   **Response**: `200 OK` with `UserAccessReportDto`
    -   **Authentication**: `JwtAuthGuard`, `PlatformAdminGuard`
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiQuery`
    -   **Service Method Called**: `dataGovernanceService.generatePlatformComplianceReport(adminUser.id, 'user-access', query)`

2.  **Generate Change Management Report (REQ-POA-013)**
    -   **Endpoint**: `GET /reports/change-management`
    -   **Description**: Generates a change management report for platform administrators.
    -   **Query Parameters**: `ChangeManagementReportQueryDto` (see section 5.3.5)
    -   **Response**: `200 OK` with `ChangeManagementReportDto` (see section 5.3.6)
    -   **Authentication**: `JwtAuthGuard`, `PlatformAdminGuard`
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiQuery`
    -   **Service Method Called**: `dataGovernanceService.generatePlatformComplianceReport(adminUser.id, 'change-management', query)`

3.  **Generate Security Incident Report (REQ-POA-013)**
    -   **Endpoint**: `GET /reports/security-incidents`
    -   **Description**: Generates a security incident report for platform administrators.
    -   **Query Parameters**: `SecurityIncidentReportQueryDto` (see section 5.3.7)
    -   **Response**: `200 OK` with `SecurityIncidentReportDto` (see section 5.3.8)
    -   **Authentication**: `JwtAuthGuard`, `PlatformAdminGuard`
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiQuery`
    -   **Service Method Called**: `dataGovernanceService.generatePlatformComplianceReport(adminUser.id, 'security-incidents', query)`

4.  **Generate GDPR/CCPA Data Extract (REQ-POA-013)**
    -   **Endpoint**: `GET /reports/data-extracts`
    -   **Description**: Generates data extracts to support GDPR/CCPA compliance for platform administrators.
    -   **Query Parameters**: `GdprCcpaExtractQueryDto` (see section 5.3.9)
    -   **Response**: `200 OK` with `GdprCcpaExtractDto` (see section 5.3.10)
    -   **Authentication**: `JwtAuthGuard`, `PlatformAdminGuard`
    -   **Swagger**: `@ApiOperation`, `@ApiResponse`, `@ApiQuery`
    -   **Service Method Called**: `dataGovernanceService.generatePlatformComplianceReport(adminUser.id, 'gdpr-ccpa-extract', query)`

## 5. Data Transfer Object (DTO) Specifications
This section details the DTOs used in the API endpoints. Validation rules using `class-validator` and Swagger documentation using `@ApiProperty()` and `@ApiPropertyOptional()` are implied for each property based on its type and requirements.

### 5.1 Common DTOs
As defined in `file_structure_json` and section 4.1.2.
-   `PagedResponseDto<T>`
-   `IdParamDto`

### 5.2 Consent DTOs
(Path: `src/modules/data-governance/api/v1/dtos/consent/`)
As defined in `file_structure_json`:
-   **`ManageConsentDto`**:
    -   `userId: string` (`@IsString()`, `@IsNotEmpty()`)
    -   `consentType: string` (`@IsString()`, `@IsNotEmpty()`, e.g., 'marketing_emails', 'third_party_data_sharing')
    -   `isGiven: boolean` (`@IsBoolean()`)
    -   `source: string` (`@IsString()`, `@IsNotEmpty()`, e.g., 'signup_form', 'preference_center')
    -   `version?: string` (`@IsOptional()`, `@IsString()`, DPA version or policy version consented to)
    -   `ipAddress?: string` (`@IsOptional()`, `@IsIP()`)
    -   `userAgent?: string` (`@IsOptional()`, `@IsString()`)
-   **`ConsentRecordDto`**:
    -   `id: string` (UUID)
    -   `userId: string`
    -   `consentType: string`
    -   `isGiven: boolean`
    -   `timestamp: Date`
    -   `source: string`
    -   `version?: string`
    -   `ipAddress?: string`
    -   `userAgent?: string`
-   **`ConsentReportQueryDto`**:
    -   `userId?: string` (`@IsOptional()`, `@IsString()`)
    -   `consentType?: string` (`@IsOptional()`, `@IsString()`)
    -   `dateFrom?: Date` (`@IsOptional()`, `@IsDateString()`)
    -   `dateTo?: Date` (`@IsOptional()`, `@IsDateString()`)
    -   `page?: number` (`@IsOptional()`, `@IsInt()`, `@Min(1)`)
    -   `pageSize?: number` (`@IsOptional()`, `@IsInt()`, `@Min(1)`, `@Max(100)`)

### 5.3 DSR DTOs
(Path: `src/modules/data-governance/api/v1/dtos/dsr/`)
As defined in `file_structure_json`:
-   **`SubmitDsrDto`**:
    -   `requestType: string` (`@IsIn(['access', 'rectification', 'erasure', 'portability', 'restriction', 'objection'])`)
    -   `requesterEmail: string` (`@IsEmail()`)
    -   `requesterIdentifier?: string` (`@IsOptional()`, `@IsString()`, e.g. user ID if known)
    -   `details?: string` (`@IsOptional()`, `@IsString()`)
    -   `targetMerchantId?: string` (`@IsOptional()`, `@IsString()`, if applicable for multi-tenant DSR submission portal)
    -   `dataForRectification?: Record<string, any>` (`@IsOptional()`, if `requestType` is 'rectification')
-   **`DsrRequestDto`**:
    -   `id: string` (UUID)
    -   `requestType: string`
    -   `status: string` (e.g., 'PendingVerification', 'PendingFulfillment', 'InProgress', 'Completed', 'Denied', 'RequiresAction')
    -   `submittedAt: Date`
    -   `lastUpdatedAt: Date`
    -   `completedAt?: Date`
    -   `requesterEmail: string`
    -   `requesterIdentifier?: string`
    -   `targetMerchantId?: string`
    -   `details?: string`
    -   `adminNotes?: string`
-   **`DsrDataExportDto`**:
    -   `requestId: string`
    -   `format: string` (e.g., 'application/json', 'text/csv')
    -   `data?: any` (The actual data or a reference to it)
    -   `downloadUrl?: string` (A pre-signed URL for secure download)
    -   `expiresAt?: Date` (If `downloadUrl` is provided)
-   **`DsrActionDto`**:
    -   `requestId: string` (`@IsUUID()`)
    -   `action: string` (`@IsIn(['verify_identity', 'approve_request', 'deny_request', 'fulfill_access', 'fulfill_portability', 'confirm_rectification', 'confirm_erasure', 'apply_restriction', 'acknowledge_objection', 'close_request'])`)
    -   `notes?: string` (`@IsOptional()`, `@IsString()`)
    -   `reasonForDenial?: string` (`@IsOptional()`, `@IsString()`, if action is 'deny_request')

### 5.4 Data Retention DTOs
(Path: `src/modules/data-governance/api/v1/dtos/data-retention/`)
As defined in `file_structure_json`:
-   **`ConfigureRetentionPolicyDto`**:
    -   `dataType: string` (`@IsString()`, `@IsNotEmpty()`, e.g., 'CampaignPerformanceLogs', 'PII_ClosedAccounts')
    -   `retentionPeriodDays: number` (`@IsInt()`, `@Min(0)`) (0 might mean indefinite or controlled by other means)
    -   `actionAfterRetention: string` (`@IsIn(['archive', 'anonymize', 'delete', 'review'])`)
    -   `description?: string` (`@IsOptional()`, `@IsString()`)
-   **`RetentionPolicyDto`**:
    -   `id: string` (UUID)
    -   `dataType: string`
    -   `retentionPeriodDays: number`
    -   `actionAfterRetention: string`
    -   `description?: string`
    -   `isDefault: boolean`
    -   `createdAt: Date`
    -   `updatedAt: Date`
-   **`DataLifecycleActionDto`**:
    -   `dataType: string` (`@IsString()`, `@IsNotEmpty()`)
    -   `action: string` (`@IsIn(['archive_now', 'purge_now', 'anonymize_now'])`)
    -   `criteria?: Record<string, any>` (`@IsOptional()`, object defining criteria for data selection, e.g., `{ "merchantId": "uuid", "olderThanDate": "YYYY-MM-DD" }`)

### 5.5 Merchant Compliance DTOs
(Path: `src/modules/data-governance/api/v1/dtos/compliance/`)
As defined in `file_structure_json`:
-   **`DpaDto`**:
    -   `version: string`
    -   `acknowledgedAt?: Date`
    -   `dpaUrl: string`
    -   `isAcknowledged: boolean`
-   **`ProcessingActivityLogQueryDto`**:
    -   `dateFrom?: Date` (`@IsOptional()`, `@IsDateString()`)
    -   `dateTo?: Date` (`@IsOptional()`, `@IsDateString()`)
    -   `activityType?: string` (`@IsOptional()`, `@IsString()`, e.g., 'PII_Access', 'Data_Share_ThirdParty')
    -   `dataType?: string` (`@IsOptional()`, `@IsString()`)
-   **`ProcessingActivityLogDto`**:
    -   `logEntries: ProcessingActivityEntryDto[]`
    -   `generatedAt: Date`
    -   `merchantId: string`
    -   `queryParameters: ProcessingActivityLogQueryDto`
-   **`ProcessingActivityEntryDto`**: (New DTO needed)
    -   `timestamp: Date`
    -   `activityType: string`
    -   `dataType: string`
    -   `purpose: string`
    -   `actor: string` (e.g., user ID, system process)
    -   `details?: Record<string, any>`
-   **`AuditTrailQueryDto`**:
    -   `userId?: string` (`@IsOptional()`, `@IsString()`)
    -   `actionType?: string` (`@IsOptional()`, `@IsString()`, e.g., 'LOGIN_SUCCESS', 'CAMPAIGN_CREATE', 'DSR_REQUEST_FULFILLED')
    -   `targetEntityType?: string` (`@IsOptional()`, `@IsString()`, e.g., 'Campaign', 'User', 'ConsentRecord')
    -   `targetEntityId?: string` (`@IsOptional()`, `@IsString()`)
    -   `dateFrom?: Date` (`@IsOptional()`, `@IsDateString()`)
    -   `dateTo?: Date` (`@IsOptional()`, `@IsDateString()`)
    -   `page?: number` (`@IsOptional()`, `@IsInt()`, `@Min(1)`)
    -   `pageSize?: number` (`@IsOptional()`, `@IsInt()`, `@Min(1)`, `@Max(100)`)
-   **`AuditTrailEntryDto`**:
    -   `id: string` (UUID)
    -   `timestamp: Date`
    -   `userId?: string` (ID of the user who performed the action)
    -   `actorType: string` (e.g., 'User', 'System', 'MerchantAdmin')
    -   `action: string` (e.g., 'ConsentUpdated', 'DsrRequestSubmitted', 'RetentionPolicyConfigured')
    -   `details?: Record<string, any>` (Contextual details of the action, e.g., changed fields)
    -   `ipAddress?: string`
    -   `targetEntityType?: string`
    -   `targetEntityId?: string`
    -   `status: string` (e.g., 'Success', 'Failure')
    -   `failureReason?: string`

### 5.6 Platform Administrator Compliance Reporting DTOs
(Path: `src/modules/data-governance/api/v1/dtos/admin/compliance/`)
-   **`UserAccessReportQueryDto`**:
    -   `merchantId?: string` (`@IsOptional()`, `@IsString()`)
    -   `userId?: string` (`@IsOptional()`, `@IsString()`)
    -   `role?: string` (`@IsOptional()`, `@IsString()`)
    -   `dateFrom?: Date` (`@IsOptional()`, `@IsDateString()`)
    -   `dateTo?: Date` (`@IsOptional()`, `@IsDateString()`)
    -   `includePlatformAdmins?: boolean` (`@IsOptional()`, `@IsBoolean()`)
-   **`UserAccessReportDto`**:
    -   `reportEntries: UserAccessEntryDto[]`
    -   `generatedAt: Date`
    -   `queryParameters: UserAccessReportQueryDto`
-   **`UserAccessEntryDto`**: (New DTO needed)
    -   `userId: string`
    -   `username: string`
    -   `roles: string[]`
    -   `lastLoginAt?: Date`
    -   `loginCountLastPeriod: number`
    -   `associatedMerchantId?: string`
-   **`ChangeManagementReportQueryDto`**: (New DTO needed)
    -   `entityType?: string` (`@IsOptional()`, `@IsString()`, e.g., 'RetentionPolicy', 'ConsentConfiguration')
    -   `changedByUserId?: string` (`@IsOptional()`, `@IsString()`)
    -   `dateFrom?: Date` (`@IsOptional()`, `@IsDateString()`)
    -   `dateTo?: Date` (`@IsOptional()`, `@IsDateString()`)
-   **`ChangeManagementReportDto`**: (New DTO needed)
    -   `reportEntries: ChangeManagementEntryDto[]`
    -   `generatedAt: Date`
    -   `queryParameters: ChangeManagementReportQueryDto`
-   **`ChangeManagementEntryDto`**: (New DTO needed)
    -   `timestamp: Date`
    -   `entityType: string`
    -   `entityId: string`
    -   `changedByUserId: string`
    -   `action: string` (e.g., 'Create', 'Update', 'Delete')
    -   `oldValue?: Record<string, any>`
    -   `newValue?: Record<string, any>`
-   **`SecurityIncidentReportQueryDto`**: (New DTO needed)
    -   `incidentType?: string` (`@IsOptional()`, `@IsString()`, e.g., 'AuthFailure', 'PotentialDataBreach')
    -   `severity?: string` (`@IsOptional()`, `@IsIn(['Critical', 'High', 'Medium', 'Low'])`)
    -   `dateFrom?: Date` (`@IsOptional()`, `@IsDateString()`)
    -   `dateTo?: Date` (`@IsOptional()`, `@IsDateString()`)
    -   `status?: string` (`@IsOptional()`, `@IsIn(['Open', 'Investigating', 'Resolved', 'Closed'])`)
-   **`SecurityIncidentReportDto`**: (New DTO needed)
    -   `reportEntries: SecurityIncidentEntryDto[]`
    -   `generatedAt: Date`
    -   `queryParameters: SecurityIncidentReportQueryDto`
-   **`SecurityIncidentEntryDto`**: (New DTO needed)
    -   `incidentId: string`
    -   `timestamp: Date`
    -   `incidentType: string`
    -   `severity: string`
    -   `description: string`
    -   `status: string`
    -   `affectedEntities?: string[]`
-   **`GdprCcpaExtractQueryDto`**: (New DTO needed)
    -   `merchantId?: string` (`@IsOptional()`, `@IsString()`)
    -   `dataSubjectIdentifier: string` (`@IsString()`, `@IsNotEmpty()`, e.g., email or user ID)
    -   `requestType: string` (`@IsIn(['access', 'portability'])`)
-   **`GdprCcpaExtractDto`**: (New DTO needed)
    -   `requestId: string`
    -   `dataSubjectIdentifier: string`
    -   `extractedData: Record<string, any>` (Structure depends on the PII stored)
    -   `generatedAt: Date`
    -   `format: string` (e.g., 'application/json')

## 6. Module Structure
-   **`AppModule`** (`src/app.module.ts`): Root module.
    -   Imports: `ConfigModule`, `DataGovernanceApiModule`.
-   **`ConfigModule`** (`src/config/config.module.ts`): Handles application configuration.
    -   Loads `.env` files and registers custom config (e.g., `appConfig`).
-   **`DataGovernanceApiModule`** (`src/modules/data-governance/api/v1/data-governance-api.module.ts`): Encapsulates all V1 data governance API features.
    -   Imports: `PassportModule.register({ defaultStrategy: 'jwt' })`
    -   Controllers: `ConsentController`, `DsrController`, `DataRetentionController`, `ComplianceController`, `AdminComplianceController`.
    -   Providers:
        -   `{ provide: 'IDataGovernanceComplianceService', useClass: DataGovernanceComplianceServicePlaceholder }`
            *(Note: `DataGovernanceComplianceServicePlaceholder` would be a mock/stub implementation within this repository for compilation and basic testing. The actual implementation comes from another layer/repo and is injected via DI principles, potentially managed by a shared module or a higher-level composition root if this API is part of a larger monolith, or through service discovery if it's a true microservice talking to another service.)*

## 7. Configuration
-   **`src/config/app.config.ts`**:
    -   `port`: Port number for the API server.
    -   `environment`: Current environment (development, staging, production).
    -   `jwtSecret`: Secret key for JWT signing (should be sourced securely, e.g., AWS Secrets Manager, not hardcoded).
    -   `apiPrefix`: Global prefix for all API routes (e.g., 'api').
    -   `apiVersion`: Current API version (e.g., 'v1').
-   Environment variables (`.env` file) will be used to supply these values.

## 8. Main Application Setup
-   **`src/main.ts`**:
    -   Bootstraps the NestJS application using `AppModule`.
    -   Sets up global validation pipes: `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));`
    -   Configures Swagger/OpenAPI documentation:
        typescript
        const config = new DocumentBuilder()
          .setTitle('Ad Manager Data Governance & Compliance API')
          .setDescription('API endpoints for managing data governance, consent, DSR, retention, and compliance.')
          .setVersion('1.0')
          .addBearerAuth() // For JWT
          .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/v1/data-governance/docs', app, document);
        
    -   Listens on the configured port.

## 9. Error Handling
-   Standard NestJS exception filters will be used.
-   `class-validator` will automatically throw `BadRequestException` for DTO validation errors.
-   Custom exceptions can be defined and thrown by the service layer, which will be caught by NestJS default exception handling or custom filters.
-   API responses for errors will follow a consistent JSON structure (e.g., `{ statusCode, message, error }`).

## 10. Security Considerations Specific to API Endpoints
-   All endpoints are protected by `JwtAuthGuard` by default, unless explicitly public.
-   Specific roles are enforced using `RolesGuard` and `PlatformAdminGuard` as detailed per endpoint.
-   Input validation is strictly enforced via DTOs and `ValidationPipe`.
-   Sensitive data in responses should be carefully considered (though this API primarily deals with metadata and status, DSR export is an exception).
-   Rate limiting and other security headers should be configured at the API Gateway level (e.g., Amazon API Gateway).
-   Logging of API requests and responses (excluding sensitive PII) for audit and debugging purposes.

## 11. Testing Strategy (Outline)
-   **Unit Tests**: For controllers, guards, and DTO validation logic (mocking the `IDataGovernanceComplianceService`).
-   **Integration Tests**: Testing the interaction between controllers and mocked services, including guard and pipe functionality within the NestJS context.
-   **E2E Tests**: (Potentially in a separate testing suite) Testing the deployed API endpoints against a real or fully mocked service layer.

This SDS provides a comprehensive plan for developing the `DataGovernanceCompliance.ApiEndpoints` repository. The focus is on clear API contracts, robust validation, security, and adherence to NestJS best practices.