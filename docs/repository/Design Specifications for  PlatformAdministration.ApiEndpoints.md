# Software Design Specification: PlatformAdministration.ApiEndpoints

## 1. Introduction

### 1.1 Purpose
This document provides the detailed software design specification for the `PlatformAdministration.ApiEndpoints` repository. This repository is responsible for exposing RESTful API endpoints specifically for Platform Administrators within the Ad Manager system. These endpoints facilitate functionalities such as system configuration management, health monitoring data retrieval, audit log access, triggering maintenance tasks, and managing platform-level administrator user accounts.

### 1.2 Scope
The scope of this repository includes:
*   Defining and implementing API controllers for platform administration.
*   Defining Data Transfer Objects (DTOs) for request and response payloads.
*   Implementing an authorization guard to restrict access to Platform Administrators.
*   Integrating with the `PlatformAdministrationService` for business logic execution.
*   Setting up Swagger (OpenAPI) documentation for all exposed endpoints.

Business logic implementation resides in the `PlatformAdministrationService`, which is consumed by the controllers in this repository via an interface.

### 1.3 Technology Stack
*   **Language:** TypeScript 5.4.5
*   **Framework:** NestJS 10.3.9
*   **Node.js Version:** 20.15.0 (LTS)
*   **API Style:** RESTful
*   **Data Format:** JSON
*   **Authentication:** JWT (JSON Web Tokens) - Handled upstream by API Gateway and an authentication guard. This repository focuses on role-based authorization.
*   **API Documentation:** Swagger (OpenAPI 3.1.0) via `@nestjs/swagger`
*   **Key Libraries:**
    *   `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
    *   `class-validator`: For request DTO validation.
    *   `class-transformer`: For transforming plain objects to DTO instances.
    *   `@nestjs/swagger`: For API documentation generation.
    *   `reflect-metadata`
    *   `rxjs`

## 2. System Overview
The `PlatformAdministration.ApiEndpoints` repository acts as a presentation layer within the Ad Manager's microservices architecture. It receives HTTP requests, typically routed through an Amazon API Gateway, authenticates them (JWT validation assumed to be handled by an earlier layer or a global guard), authorizes them based on the Platform Administrator role, and then delegates the business logic processing to the `PlatformAdministrationService`.

mermaid
sequenceDiagram
    participant PA as Platform Administrator (Client)
    participant APIGW as Amazon API Gateway
    participant AuthGuard as Global Auth Guard (JWT)
    participant PAApi as PlatformAdministration.ApiEndpoints
    participant PAService as PlatformAdministrationService (External)

    PA->>APIGW: HTTP Request (e.g., GET /system-config)
    APIGW->>AuthGuard: Validate JWT
    AuthGuard-->>APIGW: JWT Valid
    APIGW->>PAApi: Forward Request
    PAApi->>PAApi: PlatformAdminGuard.canActivate()
    Note right of PAApi: Verify 'PlatformAdministrator' role
    PAApi-->>PAApi: Role Authorized
    PAApi->>PAService: Call service method (e.g., getSystemConfigurations())
    PAService-->>PAApi: Return data/status
    PAApi-->>APIGW: HTTP Response
    APIGW-->>PA: HTTP Response


## 3. API Design Principles

*   **RESTful Conventions:** Standard HTTP methods (GET, POST, PUT, DELETE, PATCH) will be used.
*   **Statelessness:** Each request will contain all necessary information. No server-side session state specific to this API layer will be maintained beyond request scope.
*   **JSON Payload:** Request and response bodies will primarily use JSON.
*   **Authentication & Authorization:**
    *   Authentication is assumed to be handled by JWT verification prior to reaching these controllers (e.g., by API Gateway or a global NestJS auth guard).
    *   Authorization will be enforced using the `PlatformAdminGuard` to ensure only users with the 'PlatformAdministrator' role can access these endpoints.
*   **Error Handling:**
    *   Standard HTTP status codes will be used to indicate success or failure.
    *   A global `AllExceptionsFilter` will be used to ensure consistent JSON error responses, including a message and potentially an error code.
    *   Validation errors from DTOs will result in `400 Bad Request` responses with detailed error messages.
*   **Versioning:** The API will be versioned via its base path (e.g., `/api/v1/platform-admin`).
*   **Idempotency:** PUT and DELETE operations will be idempotent where applicable.
*   **API Documentation:** Comprehensive Swagger/OpenAPI documentation will be generated automatically.

## 4. Modules

### 4.1 `PlatformAdminModule` (`src/modules/platform-admin/platform-admin.module.ts`)
*   **Purpose:** Encapsulates all controllers, services (via interface injection), DTOs, and related providers specific to platform administration functionalities.
*   **Imports:**
    *   `ConfigModule` (if service needs configuration directly)
    *   Potentially an `AuthModule` if a more granular RBAC with shared role definitions is used across the platform, or if the `PlatformAdminGuard` relies on shared auth components. For simplicity here, we assume the guard is self-contained or relies on user object properties set by a global auth guard.
*   **Controllers:**
    *   `SystemConfigController`
    *   `HealthMonitoringController`
    *   `AuditLogsController`
    *   `MaintenanceController`
    *   `PlatformUsersController`
*   **Providers:**
    *   `{ provide: 'IPlatformAdministrationService', useClass: PlatformAdministrationService }`
        *   Note: `PlatformAdministrationService` itself might be a client to another microservice if the actual business logic resides elsewhere. For this repository, we assume it's either a local implementation or a well-defined client proxy.
    *   `PlatformAdminGuard` (if not provided globally)
*   **Exports:** None typically required for an API endpoint module.

## 5. Controllers

All controllers will be decorated with `@ApiTags('Platform Administration')` and `@UseGuards(PlatformAdminGuard)`. They will inject `IPlatformAdministrationService` via constructor:
`constructor(@Inject('IPlatformAdministrationService') private readonly platformAdminService: IPlatformAdministrationService) {}`

### 5.1 `SystemConfigController` (`src/modules/platform-admin/api/controllers/system-config.controller.ts`)
*   **Purpose:** Manages global system configurations and feature flags.
*   **Base Route:** `/system-config`
*   **Endpoints:**
    *   **GET `/settings`**
        *   **Description:** Retrieves all global system settings.
        *   **`@ApiOperation({ summary: 'Get all system configurations' })`**
        *   **`@ApiResponse({ status: 200, description: 'Successfully retrieved system configurations.', type: GetAllSettingsResponseDto })`**
        *   **Request DTO:** None
        *   **Response DTO:** `GetAllSettingsResponseDto`
        *   **Logic:** Calls `platformAdminService.getSystemConfigurations()`.
    *   **PUT `/settings/:key`**
        *   **Description:** Updates a specific global system setting.
        *   **`@ApiOperation({ summary: 'Update a system configuration by key' })`**
        *   **`@ApiParam({ name: 'key', description: 'The key of the setting to update' })`**
        *   **`@ApiBody({ type: UpdateSettingRequestDto })`**
        *   **`@ApiResponse({ status: 200, description: 'Successfully updated system configuration.', type: GlobalSettingDto })`**
        *   **`@ApiResponse({ status: 400, description: 'Invalid input.' })`**
        *   **`@ApiResponse({ status: 404, description: 'Setting key not found.' })`**
        *   **Request DTO:** `UpdateSettingRequestDto` (in body), `key` (string, in path)
        *   **Response DTO:** `GlobalSettingDto`
        *   **Logic:** Calls `platformAdminService.updateSystemConfiguration(key, dto)`.
    *   **GET `/feature-flags`**
        *   **Description:** Retrieves all feature flags.
        *   **`@ApiOperation({ summary: 'Get all feature flags' })`**
        *   **`@ApiResponse({ status: 200, description: 'Successfully retrieved feature flags.', type: GetAllFeatureFlagsResponseDto })`**
        *   **Request DTO:** None
        *   **Response DTO:** `GetAllFeatureFlagsResponseDto`
        *   **Logic:** Calls `platformAdminService.getFeatureFlags()`.
    *   **PUT `/feature-flags/:key`**
        *   **Description:** Updates a specific feature flag.
        *   **`@ApiOperation({ summary: 'Update a feature flag by key' })`**
        *   **`@ApiParam({ name: 'key', description: 'The key of the feature flag to update' })`**
        *   **`@ApiBody({ type: UpdateFeatureFlagRequestDto })`**
        *   **`@ApiResponse({ status: 200, description: 'Successfully updated feature flag.', type: FeatureFlagDto })`**
        *   **`@ApiResponse({ status: 400, description: 'Invalid input.' })`**
        *   **`@ApiResponse({ status: 404, description: 'Feature flag key not found.' })`**
        *   **Request DTO:** `UpdateFeatureFlagRequestDto` (in body), `key` (string, in path)
        *   **Response DTO:** `FeatureFlagDto`
        *   **Logic:** Calls `platformAdminService.updateFeatureFlag(key, dto)`.

### 5.2 `HealthMonitoringController` (`src/modules/platform-admin/api/controllers/health-monitoring.controller.ts`)
*   **Purpose:** Provides access to system health monitoring data.
*   **Base Route:** `/health`
*   **Endpoints:**
    *   **GET `/dashboard`**
        *   **Description:** Retrieves the consolidated system health dashboard data.
        *   **`@ApiOperation({ summary: 'Get system health dashboard data' })`**
        *   **`@ApiResponse({ status: 200, description: 'Successfully retrieved system health dashboard data.', type: SystemHealthDashboardResponseDto })`**
        *   **Request DTO:** None
        *   **Response DTO:** `SystemHealthDashboardResponseDto`
        *   **Logic:** Calls `platformAdminService.getSystemHealthDashboard()`.

### 5.3 `AuditLogsController` (`src/modules/platform-admin/api/controllers/audit-logs.controller.ts`)
*   **Purpose:** Enables querying and retrieval of system-wide audit logs.
*   **Base Route:** `/audit-logs`
*   **Endpoints:**
    *   **GET `/`**
        *   **Description:** Queries audit logs based on specified filter criteria and pagination.
        *   **`@ApiOperation({ summary: 'Query audit logs' })`**
        *   **`@ApiQuery({ name: 'userId', required: false, type: String })`**
        *   **`@ApiQuery({ name: 'action', required: false, type: String })`**
        *   **`@ApiQuery({ name: 'startDate', required: false, type: Date })`**
        *   **`@ApiQuery({ name: 'endDate', required: false, type: Date })`**
        *   **`@ApiQuery({ name: 'page', required: false, type: Number, example: 1 })`**
        *   **`@ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })`**
        *   **`@ApiResponse({ status: 200, description: 'Successfully retrieved audit logs.', type: PagedAuditLogResponseDto })`**
        *   **`@ApiResponse({ status: 400, description: 'Invalid query parameters.' })`**
        *   **Request DTO:** `QueryAuditLogsRequestDto` (from query parameters)
        *   **Response DTO:** `PagedAuditLogResponseDto`
        *   **Logic:** Calls `platformAdminService.queryAuditLogs(queryDto)`.

### 5.4 `MaintenanceController` (`src/modules/platform-admin/api/controllers/maintenance.controller.ts`)
*   **Purpose:** Manages scheduled maintenance windows and triggers maintenance tasks.
*   **Base Route:** `/maintenance`
*   **Endpoints:**
    *   **GET `/windows`**
        *   **Description:** Retrieves all scheduled maintenance windows.
        *   **`@ApiOperation({ summary: 'Get all maintenance windows' })`**
        *   **`@ApiResponse({ status: 200, description: 'Successfully retrieved maintenance windows.', type: [MaintenanceWindowDto] })`**
        *   **Request DTO:** None
        *   **Response DTO:** `MaintenanceWindowDto[]`
        *   **Logic:** Calls `platformAdminService.getMaintenanceWindows()`.
    *   **POST `/windows`**
        *   **Description:** Creates a new maintenance window.
        *   **`@ApiOperation({ summary: 'Create a new maintenance window' })`**
        *   **`@ApiBody({ type: CreateMaintenanceWindowRequestDto })`**
        *   **`@ApiResponse({ status: 201, description: 'Successfully created maintenance window.', type: MaintenanceWindowDto })`**
        *   **`@ApiResponse({ status: 400, description: 'Invalid input.' })`**
        *   **Request DTO:** `CreateMaintenanceWindowRequestDto`
        *   **Response DTO:** `MaintenanceWindowDto`
        *   **Logic:** Calls `platformAdminService.createMaintenanceWindow(dto)`.
    *   **PUT `/windows/:id`**
        *   **Description:** Updates an existing maintenance window.
        *   **`@ApiOperation({ summary: 'Update an existing maintenance window' })`**
        *   **`@ApiParam({ name: 'id', description: 'ID of the maintenance window to update' })`**
        *   **`@ApiBody({ type: UpdateMaintenanceWindowRequestDto })`**
        *   **`@ApiResponse({ status: 200, description: 'Successfully updated maintenance window.', type: MaintenanceWindowDto })`**
        *   **`@ApiResponse({ status: 400, description: 'Invalid input.' })`**
        *   **`@ApiResponse({ status: 404, description: 'Maintenance window not found.' })`**
        *   **Request DTO:** `UpdateMaintenanceWindowRequestDto` (in body), `id` (string, in path)
        *   **Response DTO:** `MaintenanceWindowDto`
        *   **Logic:** Calls `platformAdminService.updateMaintenanceWindow(id, dto)`.
    *   **DELETE `/windows/:id`**
        *   **Description:** Deletes a maintenance window.
        *   **`@ApiOperation({ summary: 'Delete a maintenance window' })`**
        *   **`@ApiParam({ name: 'id', description: 'ID of the maintenance window to delete' })`**
        *   **`@ApiResponse({ status: 204, description: 'Successfully deleted maintenance window.' })`**
        *   **`@ApiResponse({ status: 404, description: 'Maintenance window not found.' })`**
        *   **Request DTO:** `id` (string, in path)
        *   **Response DTO:** None (HTTP 204)
        *   **Logic:** Calls `platformAdminService.deleteMaintenanceWindow(id)`.
    *   **POST `/tasks/trigger`**
        *   **Description:** Triggers a specific maintenance task.
        *   **`@ApiOperation({ summary: 'Trigger a maintenance task' })`**
        *   **`@ApiBody({ type: TriggerMaintenanceTaskRequestDto })`**
        *   **`@ApiResponse({ status: 202, description: 'Maintenance task successfully triggered.', type: MaintenanceTaskStatusResponseDto })`**
        *   **`@ApiResponse({ status: 400, description: 'Invalid task name or parameters.' })`**
        *   **`@ApiResponse({ status: 404, description: 'Maintenance task not found.' })`**
        *   **Request DTO:** `TriggerMaintenanceTaskRequestDto`
        *   **Response DTO:** `MaintenanceTaskStatusResponseDto` (HTTP 202 Accepted if task is asynchronous)
        *   **Logic:** Calls `platformAdminService.triggerMaintenanceTask(dto)`.

### 5.5 `PlatformUsersController` (`src/modules/platform-admin/api/controllers/platform-users.controller.ts`)
*   **Purpose:** Manages Platform Administrator user accounts.
*   **Base Route:** `/platform-users`
*   **Endpoints:**
    *   **GET `/`**
        *   **Description:** Retrieves a list of all Platform Administrator users.
        *   **`@ApiOperation({ summary: 'Get all platform administrators' })`**
        *   **`@ApiResponse({ status: 200, description: 'Successfully retrieved platform administrators.', type: [PlatformAdministratorDto] })`**
        *   **Request DTO:** None
        *   **Response DTO:** `PlatformAdministratorDto[]`
        *   **Logic:** Calls `platformAdminService.getPlatformAdministrators()`.
    *   **POST `/`**
        *   **Description:** Creates a new Platform Administrator user.
        *   **`@ApiOperation({ summary: 'Create a new platform administrator' })`**
        *   **`@ApiBody({ type: CreatePlatformAdministratorRequestDto })`**
        *   **`@ApiResponse({ status: 201, description: 'Successfully created platform administrator.', type: PlatformAdministratorDto })`**
        *   **`@ApiResponse({ status: 400, description: 'Invalid input or user already exists.' })`**
        *   **Request DTO:** `CreatePlatformAdministratorRequestDto`
        *   **Response DTO:** `PlatformAdministratorDto`
        *   **Logic:** Calls `platformAdminService.createPlatformAdministrator(dto)`.
    *   **GET `/:id`**
        *   **Description:** Retrieves a specific Platform Administrator user by ID.
        *   **`@ApiOperation({ summary: 'Get a platform administrator by ID' })`**
        *   **`@ApiParam({ name: 'id', description: 'ID of the platform administrator' })`**
        *   **`@ApiResponse({ status: 200, description: 'Successfully retrieved platform administrator.', type: PlatformAdministratorDto })`**
        *   **`@ApiResponse({ status: 404, description: 'Platform administrator not found.' })`**
        *   **Request DTO:** `id` (string, in path)
        *   **Response DTO:** `PlatformAdministratorDto`
        *   **Logic:** Calls `platformAdminService.getPlatformAdministratorById(id)`.
    *   **PUT `/:id`**
        *   **Description:** Updates an existing Platform Administrator user.
        *   **`@ApiOperation({ summary: 'Update an existing platform administrator' })`**
        *   **`@ApiParam({ name: 'id', description: 'ID of the platform administrator to update' })`**
        *   **`@ApiBody({ type: UpdatePlatformAdministratorRequestDto })`**
        *   **`@ApiResponse({ status: 200, description: 'Successfully updated platform administrator.', type: PlatformAdministratorDto })`**
        *   **`@ApiResponse({ status: 400, description: 'Invalid input.' })`**
        *   **`@ApiResponse({ status: 404, description: 'Platform administrator not found.' })`**
        *   **Request DTO:** `UpdatePlatformAdministratorRequestDto` (in body), `id` (string, in path)
        *   **Response DTO:** `PlatformAdministratorDto`
        *   **Logic:** Calls `platformAdminService.updatePlatformAdministrator(id, dto)`.
    *   **DELETE `/:id`**
        *   **Description:** Deletes a Platform Administrator user.
        *   **`@ApiOperation({ summary: 'Delete a platform administrator' })`**
        *   **`@ApiParam({ name: 'id', description: 'ID of the platform administrator to delete' })`**
        *   **`@ApiResponse({ status: 204, description: 'Successfully deleted platform administrator.' })`**
        *   **`@ApiResponse({ status: 404, description: 'Platform administrator not found.' })`**
        *   **Request DTO:** `id` (string, in path)
        *   **Response DTO:** None (HTTP 204)
        *   **Logic:** Calls `platformAdminService.deletePlatformAdministrator(id)`.

## 6. Data Transfer Objects (DTOs)
All DTOs will use `@ApiProperty()` from `@nestjs/swagger` for documentation. Request DTOs will use decorators from `class-validator` for input validation.

### 6.1 Common DTOs (`src/modules/platform-admin/domain/dto/common/`)
*   **`PagedResponseDto<T>` (`paged-response.dto.ts`)**
    *   **`@ApiProperty({ isArray: true, description: 'Array of data items for the current page.' }) data: T[];`**
    *   **`@ApiProperty({ example: 100, description: 'Total number of items available.' }) totalCount: number;`**
    *   **`@ApiProperty({ example: 1, description: 'Current page number.' }) page: number;`**
    *   **`@ApiProperty({ example: 10, description: 'Number of items per page.' }) limit: number;`**

### 6.2 System Configuration DTOs (`src/modules/platform-admin/domain/dto/system-config/`)
*   **`GlobalSettingDto` (`global-setting.dto.ts`)**
    *   **`@ApiProperty({ example: 'maintenance_mode_message', description: 'Unique key for the setting.' }) @IsString() @IsNotEmpty() key: string;`**
    *   **`@ApiProperty({ example: 'System is currently down for maintenance.', description: 'Value of the setting.' }) value: any;`**
    *   **`@ApiProperty({ example: 'Message displayed when system is in maintenance mode.', required: false }) @IsString() @IsOptional() description?: string;`**
    *   **`@ApiProperty({ example: '2023-10-27T10:00:00.000Z', required: false }) @IsDate() @IsOptional() lastModifiedAt?: Date;`**
*   **`GetAllSettingsResponseDto` (`get-all-settings.response.dto.ts`)**
    *   **`@ApiProperty({ type: () => [GlobalSettingDto] }) settings: GlobalSettingDto[];`**
*   **`UpdateSettingRequestDto` (`update-setting.request.dto.ts`)**
    *   **`@ApiProperty({ example: 'System will be back online shortly.', description: 'New value for the setting.' }) @IsDefined() value: any;`**
*   **`FeatureFlagDto` (`feature-flag.dto.ts`)**
    *   **`@ApiProperty({ example: 'new_dashboard_feature', description: 'Unique key for the feature flag.' }) @IsString() @IsNotEmpty() key: string;`**
    *   **`@ApiProperty({ example: true, description: 'Whether the feature is enabled.' }) @IsBoolean() isEnabled: boolean;`**
    *   **`@ApiProperty({ example: 'Enables the new experimental dashboard view.', required: false }) @IsString() @IsOptional() description?: string;`**
    *   **`@ApiProperty({ example: '2023-10-27T10:00:00.000Z', required: false }) @IsDate() @IsOptional() lastModifiedAt?: Date;`**
*   **`GetAllFeatureFlagsResponseDto` (`get-all-feature-flags.response.dto.ts`)**
    *   **`@ApiProperty({ type: () => [FeatureFlagDto] }) featureFlags: FeatureFlagDto[];`**
*   **`UpdateFeatureFlagRequestDto` (`update-feature-flag.request.dto.ts`)**
    *   **`@ApiProperty({ example: false, description: 'New enabled status for the feature flag.' }) @IsBoolean() isEnabled: boolean;`**

### 6.3 Health Monitoring DTOs (`src/modules/platform-admin/domain/dto/health-monitoring/`)
*   **`SystemComponentHealthDto` (`system-component-health.dto.ts`)**
    *   **`@ApiProperty({ example: 'DatabaseService', description: 'Name of the system component.' }) name: string;`**
    *   **`@ApiProperty({ enum: ['Healthy', 'Warning', 'Critical', 'Unknown'], example: 'Healthy' }) status: 'Healthy' | 'Warning' | 'Critical' | 'Unknown';`**
    *   **`@ApiProperty({ example: 'Response time > 500ms', required: false }) details?: string;`**
*   **`KpiMetricDto` (`kpi-metric.dto.ts`)**
    *   **`@ApiProperty({ example: 'API Error Rate', description: 'Name of the Key Performance Indicator.' }) name: string;`**
    *   **`@ApiProperty({ example: '0.5', description: 'Current value of the KPI.' }) value: string | number;`**
    *   **`@ApiProperty({ example: '%', required: false }) unit?: string;`**
    *   **`@ApiProperty({ enum: ['Normal', 'Warning', 'Critical'], example: 'Normal', required: false }) thresholdStatus?: 'Normal' | 'Warning' | 'Critical';`**
*   **`ActiveAlertDto` (`active-alert.dto.ts`)**
    *   **`@ApiProperty({ example: 'alert-123xyz', description: 'Unique ID of the alert.' }) alertId: string;`**
    *   **`@ApiProperty({ enum: ['P1', 'P2', 'P3', 'P4'], example: 'P1' }) severity: 'P1' | 'P2' | 'P3' | 'P4';`**
    *   **`@ApiProperty({ example: 'High CPU utilization on payment-service-node-1' }) message: string;`**
    *   **`@ApiProperty({ example: '2023-10-27T10:30:00.000Z' }) timestamp: Date;`**
    *   **`@ApiProperty({ example: 'CloudWatch', required: false }) source?: string;`**
*   **`SystemHealthDashboardResponseDto` (`system-health-dashboard.response.dto.ts`)**
    *   **`@ApiProperty({ enum: ['Healthy', 'Warning', 'Critical'], example: 'Healthy' }) overallStatus: 'Healthy' | 'Warning' | 'Critical';`**
    *   **`@ApiProperty({ type: () => [SystemComponentHealthDto] }) components: SystemComponentHealthDto[];`**
    *   **`@ApiProperty({ type: () => [KpiMetricDto] }) keyPerformanceIndicators: KpiMetricDto[];`**
    *   **`@ApiProperty({ type: () => [ActiveAlertDto] }) activeAlerts: ActiveAlertDto[];`**
    *   **`@ApiProperty() lastUpdatedAt: Date;`**

### 6.4 Audit Logs DTOs (`src/modules/platform-admin/domain/dto/audit-logs/`)
*   **`AuditLogEntryResponseDto` (`audit-log-entry.response.dto.ts`)**
    *   **`@ApiProperty() id: string;`**
    *   **`@ApiProperty() timestamp: Date;`**
    *   **`@ApiProperty({ required: false }) userId?: string;`**
    *   **`@ApiProperty() action: string;`**
    *   **`@ApiProperty({ required: false }) targetResource?: string;`**
    *   **`@ApiProperty({ required: false }) targetResourceId?: string;`**
    *   **`@ApiProperty({ enum: ['Success', 'Failure'] }) status: 'Success' | 'Failure';`**
    *   **`@ApiProperty({ type: 'object', additionalProperties: true, required: false }) details?: Record<string, any>;`**
*   **`QueryAuditLogsRequestDto` (`query-audit-logs.request.dto.ts`)**
    *   **`@ApiProperty({ required: false }) @IsString() @IsOptional() userId?: string;`**
    *   **`@ApiProperty({ required: false }) @IsString() @IsOptional() action?: string;`**
    *   **`@ApiProperty({ required: false, type: String, format: 'date-time' }) @IsDateString() @IsOptional() startDate?: Date;`**
    *   **`@ApiProperty({ required: false, type: String, format: 'date-time' }) @IsDateString() @IsOptional() endDate?: Date;`**
    *   **`@ApiProperty({ required: false, type: Number, minimum: 1, default: 1 }) @IsInt() @Min(1) @IsOptional() @Type(() => Number) page?: number = 1;`**
    *   **`@ApiProperty({ required: false, type: Number, minimum: 1, maximum: 100, default: 10 }) @IsInt() @Min(1) @Max(100) @IsOptional() @Type(() => Number) limit?: number = 10;`**
*   **`PagedAuditLogResponseDto` (`paged-audit-log.response.dto.ts`)**
    *   This class will extend `PagedResponseDto<AuditLogEntryResponseDto>`.
    *   **`@ApiProperty({ type: [AuditLogEntryResponseDto] }) data: AuditLogEntryResponseDto[];`**
    *   (Other pagination properties inherited)

### 6.5 Maintenance DTOs (`src/modules/platform-admin/domain/dto/maintenance/`)
*   **`MaintenanceWindowDto` (`maintenance-window.dto.ts`)**
    *   **`@ApiProperty() id: string;`**
    *   **`@ApiProperty() startTime: Date;`**
    *   **`@ApiProperty() endTime: Date;`**
    *   **`@ApiProperty() description: string;`**
    *   **`@ApiProperty({ type: [String], required: false }) componentsAffected?: string[];`**
*   **`CreateMaintenanceWindowRequestDto` (`create-maintenance-window.request.dto.ts`)**
    *   **`@ApiProperty() @IsDateString() startTime: Date;`**
    *   **`@ApiProperty() @IsDateString() endTime: Date;`**
    *   **`@ApiProperty() @IsString() @IsNotEmpty() description: string;`**
    *   **`@ApiProperty({ type: [String], required: false }) @IsArray() @IsString({ each: true }) @IsOptional() componentsAffected?: string[];`**
*   **`UpdateMaintenanceWindowRequestDto` (`update-maintenance-window.request.dto.ts`)**
    *   **`@ApiProperty({ required: false }) @IsDateString() @IsOptional() startTime?: Date;`**
    *   **`@ApiProperty({ required: false }) @IsDateString() @IsOptional() endTime?: Date;`**
    *   **`@ApiProperty({ required: false }) @IsString() @IsOptional() description?: string;`**
    *   **`@ApiProperty({ type: [String], required: false }) @IsArray() @IsString({ each: true }) @IsOptional() componentsAffected?: string[];`**
*   **`TriggerMaintenanceTaskRequestDto` (`trigger-maintenance-task.request.dto.ts`)**
    *   **`@ApiProperty({ example: 'ClearCache' }) @IsString() @IsNotEmpty() taskName: string;`**
    *   **`@ApiProperty({ type: 'object', additionalProperties: true, required: false }) @IsObject() @IsOptional() parameters?: Record<string, any>;`**
*   **`MaintenanceTaskStatusResponseDto` (`maintenance-task-status.response.dto.ts`)**
    *   **`@ApiProperty() taskId: string;`**
    *   **`@ApiProperty() taskName: string;`**
    *   **`@ApiProperty({ enum: ['Pending', 'InProgress', 'Completed', 'Failed'] }) status: 'Pending' | 'InProgress' | 'Completed' | 'Failed';`**
    *   **`@ApiProperty({ required: false }) message?: string;`**
    *   **`@ApiProperty({ required: false }) startTime?: Date;`**
    *   **`@ApiProperty({ required: false }) endTime?: Date;`**

### 6.6 Platform Users DTOs (`src/modules/platform-admin/domain/dto/platform-users/`)
*   **`PlatformAdministratorDto` (`platform-administrator.dto.ts`)**
    *   **`@ApiProperty() id: string;`**
    *   **`@ApiProperty() username: string;`**
    *   **`@ApiProperty() email: string;`**
    *   **`@ApiProperty({ type: [String] }) roles: string[];`**
    *   **`@ApiProperty() isActive: boolean;`**
    *   **`@ApiProperty({ required: false }) lastLoginAt?: Date;`**
*   **`CreatePlatformAdministratorRequestDto` (`create-platform-administrator.request.dto.ts`)**
    *   **`@ApiProperty() @IsString() @IsNotEmpty() @MinLength(3) username: string;`**
    *   **`@ApiProperty() @IsEmail() email: string;`**
    *   **`@ApiProperty() @IsString() @MinLength(8) @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/, { message: 'Password too weak. Must include uppercase, lowercase, number, and be at least 8 characters.'}) password: string;`**
    *   **`@ApiProperty({ type: [String], required: false, default: ['PlatformAdministrator'] }) @IsArray() @IsString({ each: true }) @IsOptional() roles?: string[] = ['PlatformAdministrator'];`**
*   **`UpdatePlatformAdministratorRequestDto` (`update-platform-administrator.request.dto.ts`)**
    *   **`@ApiProperty({ required: false }) @IsEmail() @IsOptional() email?: string;`**
    *   **`@ApiProperty({ type: [String], required: false }) @IsArray() @IsString({ each: true }) @IsOptional() roles?: string[];`**
    *   **`@ApiProperty({ required: false }) @IsBoolean() @IsOptional() isActive?: boolean;`**

## 7. Services (Interface Definition)

### 7.1 `IPlatformAdministrationService` (`src/modules/platform-admin/application/platform-administration.service.interface.ts`)
*   **Purpose:** Defines the contract for the platform administration business logic.
*   **Methods:**
    *   `getSystemConfigurations(): Promise<GetAllSettingsResponseDto>;`
    *   `updateSystemConfiguration(key: string, dto: UpdateSettingRequestDto): Promise<GlobalSettingDto>;`
    *   `getFeatureFlags(): Promise<GetAllFeatureFlagsResponseDto>;`
    *   `updateFeatureFlag(key: string, dto: UpdateFeatureFlagRequestDto): Promise<FeatureFlagDto>;`
    *   `getSystemHealthDashboard(): Promise<SystemHealthDashboardResponseDto>;`
    *   `queryAuditLogs(queryDto: QueryAuditLogsRequestDto): Promise<PagedAuditLogResponseDto>;`
    *   `getMaintenanceWindows(): Promise<MaintenanceWindowDto[]>;`
    *   `createMaintenanceWindow(dto: CreateMaintenanceWindowRequestDto): Promise<MaintenanceWindowDto>;`
    *   `updateMaintenanceWindow(id: string, dto: UpdateMaintenanceWindowRequestDto): Promise<MaintenanceWindowDto>;`
    *   `deleteMaintenanceWindow(id: string): Promise<void>;`
    *   `triggerMaintenanceTask(dto: TriggerMaintenanceTaskRequestDto): Promise<MaintenanceTaskStatusResponseDto>;`
    *   `getPlatformAdministrators(): Promise<PlatformAdministratorDto[]>;`
    *   `createPlatformAdministrator(dto: CreatePlatformAdministratorRequestDto): Promise<PlatformAdministratorDto>;`
    *   `getPlatformAdministratorById(id: string): Promise<PlatformAdministratorDto>;`
    *   `updatePlatformAdministrator(id: string, dto: UpdatePlatformAdministratorRequestDto): Promise<PlatformAdministratorDto>;`
    *   `deletePlatformAdministrator(id: string): Promise<void>;`

*   **Note:** The actual implementation (`PlatformAdministrationService`) is outside the direct scope of *this* API endpoint repository but is crucial for its operation. This repository defines how it *interacts* with that service.

## 8. Infrastructure Components

### 8.1 `PlatformAdminGuard` (`src/modules/platform-admin/infrastructure/guards/platform-admin.guard.ts`)
*   **Purpose:** Restricts access to Platform Administrator-only endpoints.
*   **Logic:**
    1.  Implements the `CanActivate` interface.
    2.  Retrieves the `request` object from the `ExecutionContext`.
    3.  Accesses the `user` object attached to the `request` (presumably by an upstream JWT authentication guard).
    4.  Checks if `request.user` exists and if `request.user.roles` (or a similar property) is an array and includes the role `'PlatformAdministrator'`.
    5.  Returns `true` if the role is present, otherwise throws a `ForbiddenException` or returns `false`.
    typescript
    import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
    import { Observable } from 'rxjs';

    @Injectable()
    export class PlatformAdminGuard implements CanActivate {
      canActivate(
        context: ExecutionContext,
      ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Assuming user object is attached by a previous auth guard

        if (user && user.roles && Array.isArray(user.roles) && user.roles.includes('PlatformAdministrator')) {
          return true;
        }
        throw new ForbiddenException('Access denied. Platform Administrator role required.');
      }
    }
    

### 8.2 `Roles` Decorator (`src/modules/platform-admin/infrastructure/decorators/roles.decorator.ts`)
*   **Purpose:** (Potentially for future use if more granular roles within platform admin are needed). Attaches role metadata to route handlers.
*   **Logic:**
    typescript
    import { SetMetadata } from '@nestjs/common';
    export const ROLES_KEY = 'roles';
    export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
    
    *   Note: For the current scope where only 'PlatformAdministrator' is relevant, this decorator might not be strictly necessary if the guard checks for this specific role directly. However, it's good practice for extensible RBAC.

### 8.3 `AllExceptionsFilter` (`src/core/filters/all-exceptions.filter.ts`)
*   **Purpose:** Provides a global, consistent error response format.
*   **Logic:**
    1.  Implements `ExceptionFilter`.
    2.  Catches all unhandled exceptions.
    3.  Logs the exception details (stack trace, etc.) for debugging.
    4.  Determines the appropriate HTTP status code (e.g., from `HttpException` or default to 500).
    5.  Formats a standardized JSON error response:
        json
        {
          "statusCode": 500,
          "timestamp": "2023-10-27T12:00:00.000Z",
          "path": "/request-path",
          "message": "Internal server error" // or specific error message
        }
        
    6.  If it's a `ValidationException` from `class-validator`, it should format the validation errors into a user-friendly message.

## 9. Configuration

### 9.1 Application Configuration (`src/config/configuration.ts`)
*   **Purpose:** Provides access to application configuration variables (e.g., from environment variables).
*   **Example Content:**
    typescript
    export default () => ({
      port: parseInt(process.env.PORT, 10) || 3001, // Specific port for this admin API service
      apiPrefix: process.env.API_PREFIX || 'api/v1/platform-admin',
      // JWT_SECRET: process.env.JWT_SECRET, // Auth guard would use this
      // Other service URLs if PlatformAdministrationService is a client
    });
    

### 9.2 Environment Variables (.env example)

PORT=3001
API_PREFIX=/api/v1/platform-admin
# JWT_SECRET=your-strong-jwt-secret # Managed by auth layer


## 10. Main Application Setup (`src/main.ts`)

*   **Purpose:** Bootstraps the NestJS application.
*   **Logic:**
    1.  Create NestJS application instance using `NestFactory.create(AppModule)`.
    2.  **Global Pipes:**
        *   Enable `ValidationPipe` globally to automatically validate incoming request DTOs.
        typescript
        app.useGlobalPipes(new ValidationPipe({
          whitelist: true, // Strip properties not defined in DTO
          forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
          transform: true, // Automatically transform payloads to DTO instances
        }));
        
    3.  **Global Filters:**
        *   Apply `AllExceptionsFilter` globally.
        typescript
        // const { httpAdapter } = app.get(HttpAdapterHost); // If needed for filter
        // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
        app.useGlobalFilters(new AllExceptionsFilter());
        
    4.  **API Prefix:**
        *   Set global API prefix (e.g., `/api/v1/platform-admin`).
        typescript
        app.setGlobalPrefix(configService.get<string>('apiPrefix')); // Assuming ConfigService is used
        
    5.  **Swagger Setup:**
        *   Configure `DocumentBuilder` with title, description, version.
        *   Create Swagger document using `SwaggerModule.createDocument()`.
        *   Setup Swagger UI endpoint using `SwaggerModule.setup()`.
        typescript
        const config = new DocumentBuilder()
          .setTitle('Ad Manager - Platform Administration API')
          .setDescription('API endpoints for managing the Ad Manager platform.')
          .setVersion('1.0')
          .addBearerAuth() // If JWT is expected for Swagger UI interaction
          .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup(`${configService.get<string>('apiPrefix')}/docs`, app, document);
        
    6.  **Port Listening:**
        *   Start the application to listen on the configured port.
        typescript
        await app.listen(configService.get<number>('port'));
        Logger.log(`Application is running on: ${await app.getUrl()}`);
        

## 11. Non-Functional Requirements Considerations

*   **Security:**
    *   Authorization is handled by `PlatformAdminGuard`.
    *   Input validation via DTOs and `class-validator`.
    *   HTTPS will be enforced by API Gateway.
    *   Sensitive configuration should be managed via secure means (e.g., AWS Secrets Manager, Parameter Store), accessed by the `PlatformAdministrationService`.
*   **Reliability & Error Handling:**
    *   Centralized error handling via `AllExceptionsFilter`.
    *   Robust validation.
    *   The underlying `PlatformAdministrationService` is responsible for its own reliability when interacting with other services or data stores.
*   **Maintainability:**
    *   Modular design using NestJS modules, controllers, and services.
    *   TypeScript for static typing.
    *   Comprehensive Swagger documentation.
    *   Clear separation of concerns.
*   **Performance:**
    *   Controller logic should be lightweight, delegating to the service.
    *   DTOs and `class-transformer` aid efficient data handling.
    *   Asynchronous operations (`async/await`) are used.
*   **Scalability:**
    *   The API endpoints are stateless, allowing horizontal scaling of the NestJS application instances.
    *   Scalability largely depends on the scalability of the `PlatformAdministrationService` and underlying data stores.

## 12. Dependencies

*   **`PlatformAdministrationService`:** This is the primary dependency for business logic. This API repository interacts with it via the `IPlatformAdministrationService` interface.
*   **Authentication Service/Guard (Implicit):** An upstream mechanism for JWT validation and populating `request.user` is assumed.
*   **Configuration Store (Implicit):** The `PlatformAdministrationService` will interact with a configuration store (e.g., AWS Parameter Store, database) for system settings and feature flags.
*   **Audit Log Store (Implicit):** The `PlatformAdministrationService` will interact with an audit logging mechanism.
*   **Health Monitoring System (Implicit):** The `PlatformAdministrationService` will gather data from relevant sources for the health dashboard.
*   **User Management System (Implicit):** For Platform Administrator accounts, the `PlatformAdministrationService` will interact with an IAM system or user database.

This SDS provides a blueprint for developing the `PlatformAdministration.ApiEndpoints` repository. The focus is on the API contract, request/response structures, and the immediate concerns of the API layer.