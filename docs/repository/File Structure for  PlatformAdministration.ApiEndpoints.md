# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project metadata, dependencies, and scripts for the NestJS application.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../package.json  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Project setup
    - Dependency management
    
**Requirement Ids:**
    
    
**Purpose:** Manages Node.js project dependencies and scripts.  
**Logic Description:** Standard package.json file for a NestJS project. Includes dependencies like @nestjs/core, @nestjs/common, class-validator, class-transformer, @nestjs/swagger, reflect-metadata, rxjs.  
**Documentation:**
    
    - **Summary:** Node.js package manager configuration file.
    
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
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript compilation configuration
    
**Requirement Ids:**
    
    
**Purpose:** Configures the TypeScript compiler.  
**Logic Description:** Standard tsconfig.json for a NestJS project, specifying ECMAScript target, module system, output directory, strict type checking, and enabling decorators.  
**Documentation:**
    
    - **Summary:** TypeScript compiler configuration file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** nest-cli.json  
**Description:** NestJS CLI configuration file, specifying project structure and build options.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** nest-cli  
**Type:** Configuration  
**Relative Path:** ../nest-cli.json  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - NestJS CLI project settings
    
**Requirement Ids:**
    
    
**Purpose:** Configures the NestJS command-line interface.  
**Logic Description:** Standard nest-cli.json specifying the source root, entry file, and compiler options for the NestJS CLI.  
**Documentation:**
    
    - **Summary:** NestJS CLI configuration file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** src/main.ts  
**Description:** Application entry point. Initializes and bootstraps the NestJS application, sets up global configurations like Swagger, validation pipes, and listens for incoming requests.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 4  
**Name:** main  
**Type:** Bootstrap  
**Relative Path:** main.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** bootstrap  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** async  
    
**Implemented Features:**
    
    - Application startup
    - Global middleware setup
    - Swagger documentation setup
    
**Requirement Ids:**
    
    
**Purpose:** Bootstraps and starts the NestJS application.  
**Logic Description:** Creates an instance of the AppModule. Sets up Swagger using DocumentBuilder. Enables global validation pipes (ValidationPipe). Configures API prefix (e.g., /api/v1/platform-admin). Starts listening on a configured port.  
**Documentation:**
    
    - **Summary:** Main entry file for the NestJS application.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** ApplicationRoot
    
- **Path:** src/app.module.ts  
**Description:** Root module of the application. Imports feature modules, global configuration modules, and sets up any application-wide providers.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 3  
**Name:** AppModule  
**Type:** Module  
**Relative Path:** app.module.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module aggregation
    
**Requirement Ids:**
    
    
**Purpose:** Root application module that ties together all other modules.  
**Logic Description:** Imports ConfigModule for application-wide configuration. Imports PlatformAdminModule. May import a CoreModule for global guards or interceptors if designed.  
**Documentation:**
    
    - **Summary:** Root module of the NestJS application.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** ApplicationRoot
    
- **Path:** src/config/configuration.ts  
**Description:** Defines and loads application configuration from environment variables or other sources. Provides a structured way to access configuration values.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** configuration  
**Type:** Configuration  
**Relative Path:** config/configuration.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** default  
**Parameters:**
    
    
**Return Type:** Record<string, any>  
**Attributes:** export  
    
**Implemented Features:**
    
    - Configuration loading
    
**Requirement Ids:**
    
    
**Purpose:** Provides access to application configuration variables.  
**Logic Description:** Function that returns an object containing configuration settings, potentially loaded from process.env. Includes settings for port, JWT secret (if managed here, though better in Secrets Manager), API prefixes, etc.  
**Documentation:**
    
    - **Summary:** Application configuration loader.
    
**Namespace:** AdManager.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/platform-admin/platform-admin.module.ts  
**Description:** Feature module for platform administration. Encapsulates all controllers, services, DTOs, and related providers for platform administration functionalities.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 2  
**Name:** PlatformAdminModule  
**Type:** Module  
**Relative Path:** modules/platform-admin/platform-admin.module.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Platform administration feature grouping
    
**Requirement Ids:**
    
    - REQ-POA-001
    - REQ-POA-011
    - REQ-POA-015
    - REQ-POA-019
    - REQ-POA-020
    - REQ-IAM-005 (platform admin role part)
    - 5.7 (Access part)
    
**Purpose:** Encapsulates all components related to platform administration.  
**Logic Description:** Imports necessary modules (e.g., AuthModule for guards if separate). Declares controllers: SystemConfigController, HealthMonitoringController, AuditLogsController, MaintenanceController, PlatformUsersController. Provides PlatformAdministrationService (and its interface).  
**Documentation:**
    
    - **Summary:** Feature module for platform administration functionalities.
    
**Namespace:** AdManager.PlatformAdministration  
**Metadata:**
    
    - **Category:** Module
    
- **Path:** src/modules/platform-admin/application/platform-administration.service.interface.ts  
**Description:** Defines the contract (interface) for the PlatformAdministrationService. Controllers will depend on this abstraction.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 1  
**Name:** IPlatformAdministrationService  
**Type:** Interface  
**Relative Path:** modules/platform-admin/application/platform-administration.service.interface.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    - DependencyInversion
    
**Members:**
    
    
**Methods:**
    
    - **Name:** getSystemConfigurations  
**Parameters:**
    
    
**Return Type:** Promise<GetAllSettingsResponseDto>  
**Attributes:**   
    - **Name:** updateSystemConfiguration  
**Parameters:**
    
    - key: string
    - dto: UpdateSettingRequestDto
    
**Return Type:** Promise<GlobalSettingDto>  
**Attributes:**   
    - **Name:** getFeatureFlags  
**Parameters:**
    
    
**Return Type:** Promise<GetAllFeatureFlagsResponseDto>  
**Attributes:**   
    - **Name:** updateFeatureFlag  
**Parameters:**
    
    - key: string
    - dto: UpdateFeatureFlagRequestDto
    
**Return Type:** Promise<FeatureFlagDto>  
**Attributes:**   
    - **Name:** getSystemHealthDashboard  
**Parameters:**
    
    
**Return Type:** Promise<SystemHealthDashboardResponseDto>  
**Attributes:**   
    - **Name:** queryAuditLogs  
**Parameters:**
    
    - queryDto: QueryAuditLogsRequestDto
    
**Return Type:** Promise<PagedAuditLogResponseDto>  
**Attributes:**   
    - **Name:** getMaintenanceWindows  
**Parameters:**
    
    
**Return Type:** Promise<MaintenanceWindowDto[]>  
**Attributes:**   
    - **Name:** createMaintenanceWindow  
**Parameters:**
    
    - dto: CreateMaintenanceWindowRequestDto
    
**Return Type:** Promise<MaintenanceWindowDto>  
**Attributes:**   
    - **Name:** updateMaintenanceWindow  
**Parameters:**
    
    - id: string
    - dto: UpdateMaintenanceWindowRequestDto
    
**Return Type:** Promise<MaintenanceWindowDto>  
**Attributes:**   
    - **Name:** deleteMaintenanceWindow  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** triggerMaintenanceTask  
**Parameters:**
    
    - dto: TriggerMaintenanceTaskRequestDto
    
**Return Type:** Promise<MaintenanceTaskStatusResponseDto>  
**Attributes:**   
    - **Name:** getPlatformAdministrators  
**Parameters:**
    
    
**Return Type:** Promise<PlatformAdministratorDto[]>  
**Attributes:**   
    - **Name:** createPlatformAdministrator  
**Parameters:**
    
    - dto: CreatePlatformAdministratorRequestDto
    
**Return Type:** Promise<PlatformAdministratorDto>  
**Attributes:**   
    - **Name:** getPlatformAdministratorById  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<PlatformAdministratorDto>  
**Attributes:**   
    - **Name:** updatePlatformAdministrator  
**Parameters:**
    
    - id: string
    - dto: UpdatePlatformAdministratorRequestDto
    
**Return Type:** Promise<PlatformAdministratorDto>  
**Attributes:**   
    - **Name:** deletePlatformAdministrator  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    
**Implemented Features:**
    
    - Service contract definition
    
**Requirement Ids:**
    
    
**Purpose:** Interface for platform administration business logic.  
**Logic Description:** Defines methods for managing system configurations, feature flags, health monitoring, audit logs, maintenance tasks, and platform administrator accounts.  
**Documentation:**
    
    - **Summary:** Contract for PlatformAdministrationService.
    
**Namespace:** AdManager.PlatformAdministration.Application  
**Metadata:**
    
    - **Category:** ApplicationService
    
- **Path:** src/modules/platform-admin/application/platform-administration.service.ts  
**Description:** Implements the business logic for platform administration functionalities as defined by IPlatformAdministrationService. Interacts with data layers or other services if necessary.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 2  
**Name:** PlatformAdministrationService  
**Type:** Service  
**Relative Path:** modules/platform-admin/application/platform-administration.service.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** logger  
**Type:** LoggerService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** getSystemConfigurations  
**Parameters:**
    
    
**Return Type:** Promise<GetAllSettingsResponseDto>  
**Attributes:** public|async  
    - **Name:** updateSystemConfiguration  
**Parameters:**
    
    - key: string
    - dto: UpdateSettingRequestDto
    
**Return Type:** Promise<GlobalSettingDto>  
**Attributes:** public|async  
    - **Name:** getFeatureFlags  
**Parameters:**
    
    
**Return Type:** Promise<GetAllFeatureFlagsResponseDto>  
**Attributes:** public|async  
    - **Name:** updateFeatureFlag  
**Parameters:**
    
    - key: string
    - dto: UpdateFeatureFlagRequestDto
    
**Return Type:** Promise<FeatureFlagDto>  
**Attributes:** public|async  
    - **Name:** getSystemHealthDashboard  
**Parameters:**
    
    
**Return Type:** Promise<SystemHealthDashboardResponseDto>  
**Attributes:** public|async  
    - **Name:** queryAuditLogs  
**Parameters:**
    
    - queryDto: QueryAuditLogsRequestDto
    
**Return Type:** Promise<PagedAuditLogResponseDto>  
**Attributes:** public|async  
    - **Name:** getMaintenanceWindows  
**Parameters:**
    
    
**Return Type:** Promise<MaintenanceWindowDto[]>  
**Attributes:** public|async  
    - **Name:** createMaintenanceWindow  
**Parameters:**
    
    - dto: CreateMaintenanceWindowRequestDto
    
**Return Type:** Promise<MaintenanceWindowDto>  
**Attributes:** public|async  
    - **Name:** updateMaintenanceWindow  
**Parameters:**
    
    - id: string
    - dto: UpdateMaintenanceWindowRequestDto
    
**Return Type:** Promise<MaintenanceWindowDto>  
**Attributes:** public|async  
    - **Name:** deleteMaintenanceWindow  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<void>  
**Attributes:** public|async  
    - **Name:** triggerMaintenanceTask  
**Parameters:**
    
    - dto: TriggerMaintenanceTaskRequestDto
    
**Return Type:** Promise<MaintenanceTaskStatusResponseDto>  
**Attributes:** public|async  
    - **Name:** getPlatformAdministrators  
**Parameters:**
    
    
**Return Type:** Promise<PlatformAdministratorDto[]>  
**Attributes:** public|async  
    - **Name:** createPlatformAdministrator  
**Parameters:**
    
    - dto: CreatePlatformAdministratorRequestDto
    
**Return Type:** Promise<PlatformAdministratorDto>  
**Attributes:** public|async  
    - **Name:** getPlatformAdministratorById  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<PlatformAdministratorDto>  
**Attributes:** public|async  
    - **Name:** updatePlatformAdministrator  
**Parameters:**
    
    - id: string
    - dto: UpdatePlatformAdministratorRequestDto
    
**Return Type:** Promise<PlatformAdministratorDto>  
**Attributes:** public|async  
    - **Name:** deletePlatformAdministrator  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<void>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - System configuration management logic
    - Health monitoring data aggregation
    - Audit log retrieval logic
    - Maintenance task execution
    - Platform admin user management
    
**Requirement Ids:**
    
    - REQ-POA-001
    - REQ-POA-011
    - REQ-POA-015
    - REQ-POA-019
    - REQ-POA-020
    - REQ-IAM-005 (platform admin role part)
    - 5.7 (Access part)
    
**Purpose:** Provides business logic for all platform administration features.  
**Logic Description:** Contains methods to fetch and update system settings and feature flags (from a config store or database). Aggregates health data from various sources (e.g., CloudWatch, internal metrics). Fetches and filters audit logs. Manages maintenance window schedules and triggers underlying tasks. CRUD operations for platform administrator users (potentially interacting with an IAM service or database).  
**Documentation:**
    
    - **Summary:** Service implementation for platform administration tasks.
    
**Namespace:** AdManager.PlatformAdministration.Application  
**Metadata:**
    
    - **Category:** ApplicationService
    
- **Path:** src/modules/platform-admin/api/controllers/system-config.controller.ts  
**Description:** Exposes API endpoints for managing global system configurations and feature flags. Accessed by Platform Administrators.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 2  
**Name:** SystemConfigController  
**Type:** Controller  
**Relative Path:** modules/platform-admin/api/controllers/system-config.controller.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    - API Gateway
    
**Members:**
    
    - **Name:** platformAdminService  
**Type:** IPlatformAdministrationService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** getSystemConfigurations  
**Parameters:**
    
    
**Return Type:** Promise<GetAllSettingsResponseDto>  
**Attributes:** public  
    - **Name:** updateSystemConfiguration  
**Parameters:**
    
    - @Param('key') key: string
    - @Body() dto: UpdateSettingRequestDto
    
**Return Type:** Promise<GlobalSettingDto>  
**Attributes:** public  
    - **Name:** getFeatureFlags  
**Parameters:**
    
    
**Return Type:** Promise<GetAllFeatureFlagsResponseDto>  
**Attributes:** public  
    - **Name:** updateFeatureFlag  
**Parameters:**
    
    - @Param('key') key: string
    - @Body() dto: UpdateFeatureFlagRequestDto
    
**Return Type:** Promise<FeatureFlagDto>  
**Attributes:** public  
    
**Implemented Features:**
    
    - System configuration API
    - Feature flag management API
    
**Requirement Ids:**
    
    - REQ-POA-020
    - REQ-POA-001
    
**Purpose:** Handles HTTP requests for system configuration and feature flags.  
**Logic Description:** Defines GET and PUT/PATCH endpoints for system settings and feature flags. Uses PlatformAdminGuard for role-based access. Delegates calls to PlatformAdministrationService. Uses DTOs for request/response validation and shaping. Annotated with @ApiTags, @ApiOperation, @ApiResponse for Swagger.  
**Documentation:**
    
    - **Summary:** Controller for managing system-wide configurations and feature flags.
    
**Namespace:** AdManager.PlatformAdministration.Api.V1  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/platform-admin/api/controllers/health-monitoring.controller.ts  
**Description:** Exposes API endpoints for retrieving system health monitoring data. Used by Platform Administrators to view dashboards.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 2  
**Name:** HealthMonitoringController  
**Type:** Controller  
**Relative Path:** modules/platform-admin/api/controllers/health-monitoring.controller.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    - API Gateway
    
**Members:**
    
    - **Name:** platformAdminService  
**Type:** IPlatformAdministrationService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** getSystemHealthDashboard  
**Parameters:**
    
    
**Return Type:** Promise<SystemHealthDashboardResponseDto>  
**Attributes:** public  
    
**Implemented Features:**
    
    - System health dashboard API
    
**Requirement Ids:**
    
    - REQ-POA-015
    - REQ-POA-001
    
**Purpose:** Handles HTTP requests for system health data.  
**Logic Description:** Defines a GET endpoint to retrieve aggregated system health information. Uses PlatformAdminGuard. Delegates to PlatformAdministrationService. Returns SystemHealthDashboardResponseDto. Annotated for Swagger.  
**Documentation:**
    
    - **Summary:** Controller for accessing system health monitoring dashboards.
    
**Namespace:** AdManager.PlatformAdministration.Api.V1  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/platform-admin/api/controllers/audit-logs.controller.ts  
**Description:** Exposes API endpoints for accessing and querying system-wide audit logs. For Platform Administrator use.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 2  
**Name:** AuditLogsController  
**Type:** Controller  
**Relative Path:** modules/platform-admin/api/controllers/audit-logs.controller.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    - API Gateway
    
**Members:**
    
    - **Name:** platformAdminService  
**Type:** IPlatformAdministrationService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** queryAuditLogs  
**Parameters:**
    
    - @Query() queryDto: QueryAuditLogsRequestDto
    
**Return Type:** Promise<PagedAuditLogResponseDto>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Audit log access API
    
**Requirement Ids:**
    
    - 5.7 (Access part)
    - REQ-POA-001
    
**Purpose:** Handles HTTP requests for system audit logs.  
**Logic Description:** Defines a GET endpoint to query audit logs with filtering and pagination. Uses PlatformAdminGuard. Delegates to PlatformAdministrationService. Uses QueryAuditLogsRequestDto and PagedAuditLogResponseDto. Annotated for Swagger.  
**Documentation:**
    
    - **Summary:** Controller for querying and retrieving system audit logs.
    
**Namespace:** AdManager.PlatformAdministration.Api.V1  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/platform-admin/api/controllers/maintenance.controller.ts  
**Description:** Exposes API endpoints for managing scheduled maintenance windows and triggering maintenance tasks. For Platform Administrators.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 2  
**Name:** MaintenanceController  
**Type:** Controller  
**Relative Path:** modules/platform-admin/api/controllers/maintenance.controller.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    - API Gateway
    
**Members:**
    
    - **Name:** platformAdminService  
**Type:** IPlatformAdministrationService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** getMaintenanceWindows  
**Parameters:**
    
    
**Return Type:** Promise<MaintenanceWindowDto[]>  
**Attributes:** public  
    - **Name:** createMaintenanceWindow  
**Parameters:**
    
    - @Body() dto: CreateMaintenanceWindowRequestDto
    
**Return Type:** Promise<MaintenanceWindowDto>  
**Attributes:** public  
    - **Name:** updateMaintenanceWindow  
**Parameters:**
    
    - @Param('id') id: string
    - @Body() dto: UpdateMaintenanceWindowRequestDto
    
**Return Type:** Promise<MaintenanceWindowDto>  
**Attributes:** public  
    - **Name:** deleteMaintenanceWindow  
**Parameters:**
    
    - @Param('id') id: string
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** triggerMaintenanceTask  
**Parameters:**
    
    - @Body() dto: TriggerMaintenanceTaskRequestDto
    
**Return Type:** Promise<MaintenanceTaskStatusResponseDto>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Maintenance window management API
    - Maintenance task triggering API
    
**Requirement Ids:**
    
    - REQ-POA-011
    - REQ-POA-001
    
**Purpose:** Handles HTTP requests for maintenance operations.  
**Logic Description:** Defines CRUD endpoints for maintenance windows and a POST endpoint to trigger tasks like cache clearing. Uses PlatformAdminGuard. Delegates to PlatformAdministrationService. Uses relevant DTOs. Annotated for Swagger.  
**Documentation:**
    
    - **Summary:** Controller for managing maintenance windows and tasks.
    
**Namespace:** AdManager.PlatformAdministration.Api.V1  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/platform-admin/api/controllers/platform-users.controller.ts  
**Description:** Exposes API endpoints for managing Platform Administrator user accounts (e.g., creating admins, assigning roles within the platform admin scope).  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 2  
**Name:** PlatformUsersController  
**Type:** Controller  
**Relative Path:** modules/platform-admin/api/controllers/platform-users.controller.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    - API Gateway
    
**Members:**
    
    - **Name:** platformAdminService  
**Type:** IPlatformAdministrationService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** getPlatformAdministrators  
**Parameters:**
    
    
**Return Type:** Promise<PlatformAdministratorDto[]>  
**Attributes:** public  
    - **Name:** createPlatformAdministrator  
**Parameters:**
    
    - @Body() dto: CreatePlatformAdministratorRequestDto
    
**Return Type:** Promise<PlatformAdministratorDto>  
**Attributes:** public  
    - **Name:** getPlatformAdministratorById  
**Parameters:**
    
    - @Param('id') id: string
    
**Return Type:** Promise<PlatformAdministratorDto>  
**Attributes:** public  
    - **Name:** updatePlatformAdministrator  
**Parameters:**
    
    - @Param('id') id: string
    - @Body() dto: UpdatePlatformAdministratorRequestDto
    
**Return Type:** Promise<PlatformAdministratorDto>  
**Attributes:** public  
    - **Name:** deletePlatformAdministrator  
**Parameters:**
    
    - @Param('id') id: string
    
**Return Type:** Promise<void>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Platform administrator user management API
    
**Requirement Ids:**
    
    - REQ-POA-019
    - REQ-IAM-005 (platform admin role part)
    - REQ-POA-001
    
**Purpose:** Handles HTTP requests for platform administrator user management.  
**Logic Description:** Defines CRUD endpoints for platform administrator accounts. Uses PlatformAdminGuard. Delegates to PlatformAdministrationService. Uses PlatformAdministratorDto and related request DTOs. Annotated for Swagger.  
**Documentation:**
    
    - **Summary:** Controller for managing platform administrator users.
    
**Namespace:** AdManager.PlatformAdministration.Api.V1  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/platform-admin/domain/dto/common/paged-response.dto.ts  
**Description:** Generic DTO for paginated API responses.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** PagedResponseDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/common/paged-response.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** data  
**Type:** T[]  
**Attributes:** public  
    - **Name:** totalCount  
**Type:** number  
**Attributes:** public  
    - **Name:** page  
**Type:** number  
**Attributes:** public  
    - **Name:** limit  
**Type:** number  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Standard paginated response structure
    
**Requirement Ids:**
    
    
**Purpose:** Defines a standard structure for API responses that return a list of items with pagination details.  
**Logic Description:** A generic class with properties for data (array of items), totalCount, page, and limit. Uses ApiProperty decorator for Swagger.  
**Documentation:**
    
    - **Summary:** Generic DTO for paginated responses.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.Common  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/system-config/global-setting.dto.ts  
**Description:** DTO representing a single global system setting.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** GlobalSettingDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/system-config/global-setting.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** key  
**Type:** string  
**Attributes:** public  
    - **Name:** value  
**Type:** any  
**Attributes:** public  
    - **Name:** description  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** lastModifiedAt  
**Type:** Date  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - System setting data structure
    
**Requirement Ids:**
    
    - REQ-POA-020
    
**Purpose:** Defines the structure for a global system setting.  
**Logic Description:** Properties for key, value, description, and lastModifiedAt. Uses ApiProperty for Swagger documentation and class-validator decorators for validation if used in requests.  
**Documentation:**
    
    - **Summary:** DTO for a global system setting.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.SystemConfig  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/system-config/get-all-settings.response.dto.ts  
**Description:** DTO for the response when retrieving all global system settings.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 1  
**Name:** GetAllSettingsResponseDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/system-config/get-all-settings.response.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** settings  
**Type:** GlobalSettingDto[]  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - System settings list structure
    
**Requirement Ids:**
    
    - REQ-POA-020
    
**Purpose:** Defines the response structure for listing all system settings.  
**Logic Description:** Contains an array of GlobalSettingDto. Uses ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** DTO for a list of all global system settings.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.SystemConfig  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/system-config/update-setting.request.dto.ts  
**Description:** DTO for updating a global system setting.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** UpdateSettingRequestDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/system-config/update-setting.request.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** value  
**Type:** any  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - System setting update structure
    
**Requirement Ids:**
    
    - REQ-POA-020
    
**Purpose:** Defines the request payload for updating a system setting.  
**Logic Description:** Contains the new value for the setting. Uses ApiProperty and class-validator decorators.  
**Documentation:**
    
    - **Summary:** DTO for updating a global system setting.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.SystemConfig  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/system-config/feature-flag.dto.ts  
**Description:** DTO representing a single feature flag.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** FeatureFlagDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/system-config/feature-flag.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** key  
**Type:** string  
**Attributes:** public  
    - **Name:** isEnabled  
**Type:** boolean  
**Attributes:** public  
    - **Name:** description  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** lastModifiedAt  
**Type:** Date  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Feature flag data structure
    
**Requirement Ids:**
    
    - REQ-POA-020
    
**Purpose:** Defines the structure for a feature flag.  
**Logic Description:** Properties for key, isEnabled, description, and lastModifiedAt. Uses ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** DTO for a feature flag.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.SystemConfig  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/system-config/get-all-feature-flags.response.dto.ts  
**Description:** DTO for the response when retrieving all feature flags.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 1  
**Name:** GetAllFeatureFlagsResponseDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/system-config/get-all-feature-flags.response.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** featureFlags  
**Type:** FeatureFlagDto[]  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Feature flags list structure
    
**Requirement Ids:**
    
    - REQ-POA-020
    
**Purpose:** Defines the response structure for listing all feature flags.  
**Logic Description:** Contains an array of FeatureFlagDto. Uses ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** DTO for a list of all feature flags.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.SystemConfig  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/system-config/update-feature-flag.request.dto.ts  
**Description:** DTO for updating a feature flag.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** UpdateFeatureFlagRequestDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/system-config/update-feature-flag.request.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** isEnabled  
**Type:** boolean  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Feature flag update structure
    
**Requirement Ids:**
    
    - REQ-POA-020
    
**Purpose:** Defines the request payload for updating a feature flag.  
**Logic Description:** Contains the new 'isEnabled' status for the feature flag. Uses ApiProperty and class-validator decorators.  
**Documentation:**
    
    - **Summary:** DTO for updating a feature flag.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.SystemConfig  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/health-monitoring/system-component-health.dto.ts  
**Description:** DTO representing the health status of a single system component.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** SystemComponentHealthDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/health-monitoring/system-component-health.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** name  
**Type:** string  
**Attributes:** public  
    - **Name:** status  
**Type:** 'Healthy' | 'Warning' | 'Critical' | 'Unknown'  
**Attributes:** public  
    - **Name:** details  
**Type:** string  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Component health data structure
    
**Requirement Ids:**
    
    - REQ-POA-015
    
**Purpose:** Defines the structure for reporting the health of a system component.  
**Logic Description:** Properties for component name, status (enum), and optional details. Uses ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** DTO for a system component's health status.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.HealthMonitoring  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/health-monitoring/kpi-metric.dto.ts  
**Description:** DTO representing a key performance indicator (KPI).  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** KpiMetricDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/health-monitoring/kpi-metric.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** name  
**Type:** string  
**Attributes:** public  
    - **Name:** value  
**Type:** string | number  
**Attributes:** public  
    - **Name:** unit  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** thresholdStatus  
**Type:** 'Normal' | 'Warning' | 'Critical'  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - KPI data structure
    
**Requirement Ids:**
    
    - REQ-POA-015
    
**Purpose:** Defines the structure for reporting a Key Performance Indicator.  
**Logic Description:** Properties for KPI name, value, unit, and optional threshold status. Uses ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** DTO for a Key Performance Indicator.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.HealthMonitoring  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/health-monitoring/active-alert.dto.ts  
**Description:** DTO representing an active system alert.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** ActiveAlertDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/health-monitoring/active-alert.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** alertId  
**Type:** string  
**Attributes:** public  
    - **Name:** severity  
**Type:** 'P1' | 'P2' | 'P3' | 'P4'  
**Attributes:** public  
    - **Name:** message  
**Type:** string  
**Attributes:** public  
    - **Name:** timestamp  
**Type:** Date  
**Attributes:** public  
    - **Name:** source  
**Type:** string  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Active alert data structure
    
**Requirement Ids:**
    
    - REQ-POA-015
    
**Purpose:** Defines the structure for reporting an active system alert.  
**Logic Description:** Properties for alert ID, severity, message, timestamp, and source. Uses ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** DTO for an active system alert.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.HealthMonitoring  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/health-monitoring/system-health-dashboard.response.dto.ts  
**Description:** DTO for the consolidated system health dashboard response.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 1  
**Name:** SystemHealthDashboardResponseDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/health-monitoring/system-health-dashboard.response.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** overallStatus  
**Type:** 'Healthy' | 'Warning' | 'Critical'  
**Attributes:** public  
    - **Name:** components  
**Type:** SystemComponentHealthDto[]  
**Attributes:** public  
    - **Name:** keyPerformanceIndicators  
**Type:** KpiMetricDto[]  
**Attributes:** public  
    - **Name:** activeAlerts  
**Type:** ActiveAlertDto[]  
**Attributes:** public  
    - **Name:** lastUpdatedAt  
**Type:** Date  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - System health dashboard response structure
    
**Requirement Ids:**
    
    - REQ-POA-015
    
**Purpose:** Defines the response structure for the system health dashboard.  
**Logic Description:** Aggregates overall status, component health, KPIs, and active alerts. Uses ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** DTO for the system health dashboard.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.HealthMonitoring  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/audit-logs/audit-log-entry.response.dto.ts  
**Description:** DTO representing a single audit log entry.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** AuditLogEntryResponseDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/audit-logs/audit-log-entry.response.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public  
    - **Name:** timestamp  
**Type:** Date  
**Attributes:** public  
    - **Name:** userId  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** action  
**Type:** string  
**Attributes:** public  
    - **Name:** targetResource  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** targetResourceId  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** status  
**Type:** 'Success' | 'Failure'  
**Attributes:** public  
    - **Name:** details  
**Type:** Record<string, any>  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audit log entry structure
    
**Requirement Ids:**
    
    - 5.7 (Access part)
    
**Purpose:** Defines the structure for an audit log entry.  
**Logic Description:** Properties for ID, timestamp, userId, action, resource, status, and details. Uses ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** DTO for an audit log entry.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.AuditLogs  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/audit-logs/query-audit-logs.request.dto.ts  
**Description:** DTO for querying audit logs, including filters and pagination.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** QueryAuditLogsRequestDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/audit-logs/query-audit-logs.request.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** userId  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** action  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** startDate  
**Type:** Date  
**Attributes:** public|optional  
    - **Name:** endDate  
**Type:** Date  
**Attributes:** public|optional  
    - **Name:** page  
**Type:** number  
**Attributes:** public|optional  
    - **Name:** limit  
**Type:** number  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Audit log query structure
    
**Requirement Ids:**
    
    - 5.7 (Access part)
    
**Purpose:** Defines the request payload for querying audit logs.  
**Logic Description:** Optional properties for filtering by userId, action, date range, and pagination. Uses ApiProperty and class-validator decorators.  
**Documentation:**
    
    - **Summary:** DTO for querying audit logs.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.AuditLogs  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/audit-logs/paged-audit-log.response.dto.ts  
**Description:** DTO for a paginated list of audit log entries.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 1  
**Name:** PagedAuditLogResponseDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/audit-logs/paged-audit-log.response.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** data  
**Type:** AuditLogEntryResponseDto[]  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Paginated audit log response
    
**Requirement Ids:**
    
    - 5.7 (Access part)
    
**Purpose:** Defines the structure for a paginated response of audit logs.  
**Logic Description:** Extends PagedResponseDto, specializing the 'data' property to be an array of AuditLogEntryResponseDto. Uses ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** DTO for a paginated list of audit log entries.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.AuditLogs  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/maintenance/maintenance-window.dto.ts  
**Description:** DTO representing a scheduled maintenance window.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** MaintenanceWindowDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/maintenance/maintenance-window.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public  
    - **Name:** startTime  
**Type:** Date  
**Attributes:** public  
    - **Name:** endTime  
**Type:** Date  
**Attributes:** public  
    - **Name:** description  
**Type:** string  
**Attributes:** public  
    - **Name:** componentsAffected  
**Type:** string[]  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Maintenance window data structure
    
**Requirement Ids:**
    
    - REQ-POA-011
    
**Purpose:** Defines the structure for a maintenance window.  
**Logic Description:** Properties for ID, start time, end time, description, and affected components. Uses ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** DTO for a maintenance window.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.Maintenance  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/maintenance/create-maintenance-window.request.dto.ts  
**Description:** DTO for creating a new maintenance window.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** CreateMaintenanceWindowRequestDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/maintenance/create-maintenance-window.request.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** startTime  
**Type:** Date  
**Attributes:** public  
    - **Name:** endTime  
**Type:** Date  
**Attributes:** public  
    - **Name:** description  
**Type:** string  
**Attributes:** public  
    - **Name:** componentsAffected  
**Type:** string[]  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Maintenance window creation structure
    
**Requirement Ids:**
    
    - REQ-POA-011
    
**Purpose:** Defines the request payload for creating a maintenance window.  
**Logic Description:** Properties for start time, end time, description, and affected components. Uses ApiProperty and class-validator decorators.  
**Documentation:**
    
    - **Summary:** DTO for creating a maintenance window.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.Maintenance  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/maintenance/update-maintenance-window.request.dto.ts  
**Description:** DTO for updating an existing maintenance window.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** UpdateMaintenanceWindowRequestDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/maintenance/update-maintenance-window.request.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** startTime  
**Type:** Date  
**Attributes:** public|optional  
    - **Name:** endTime  
**Type:** Date  
**Attributes:** public|optional  
    - **Name:** description  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** componentsAffected  
**Type:** string[]  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Maintenance window update structure
    
**Requirement Ids:**
    
    - REQ-POA-011
    
**Purpose:** Defines the request payload for updating a maintenance window.  
**Logic Description:** Optional properties for updating start time, end time, description, and affected components. Uses ApiProperty and class-validator decorators.  
**Documentation:**
    
    - **Summary:** DTO for updating a maintenance window.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.Maintenance  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/maintenance/trigger-maintenance-task.request.dto.ts  
**Description:** DTO for triggering a specific maintenance task.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** TriggerMaintenanceTaskRequestDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/maintenance/trigger-maintenance-task.request.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** taskName  
**Type:** string  
**Attributes:** public  
    - **Name:** parameters  
**Type:** Record<string, any>  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Maintenance task trigger structure
    
**Requirement Ids:**
    
    - REQ-POA-001
    
**Purpose:** Defines the request payload for triggering a maintenance task.  
**Logic Description:** Properties for task name (e.g., 'ClearCache', 'ReindexSearchData') and optional parameters. Uses ApiProperty and class-validator decorators.  
**Documentation:**
    
    - **Summary:** DTO for triggering a maintenance task.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.Maintenance  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/maintenance/maintenance-task-status.response.dto.ts  
**Description:** DTO representing the status of a triggered maintenance task.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** MaintenanceTaskStatusResponseDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/maintenance/maintenance-task-status.response.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** taskId  
**Type:** string  
**Attributes:** public  
    - **Name:** taskName  
**Type:** string  
**Attributes:** public  
    - **Name:** status  
**Type:** 'Pending' | 'InProgress' | 'Completed' | 'Failed'  
**Attributes:** public  
    - **Name:** message  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** startTime  
**Type:** Date  
**Attributes:** public|optional  
    - **Name:** endTime  
**Type:** Date  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Maintenance task status structure
    
**Requirement Ids:**
    
    - REQ-POA-001
    
**Purpose:** Defines the response structure for the status of a maintenance task.  
**Logic Description:** Properties for task ID, name, status, message, and timing. Uses ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** DTO for maintenance task status.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.Maintenance  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/platform-users/platform-administrator.dto.ts  
**Description:** DTO representing a Platform Administrator user.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** PlatformAdministratorDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/platform-users/platform-administrator.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public  
    - **Name:** username  
**Type:** string  
**Attributes:** public  
    - **Name:** email  
**Type:** string  
**Attributes:** public  
    - **Name:** roles  
**Type:** string[]  
**Attributes:** public  
    - **Name:** isActive  
**Type:** boolean  
**Attributes:** public  
    - **Name:** lastLoginAt  
**Type:** Date  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Platform admin user data structure
    
**Requirement Ids:**
    
    - REQ-POA-019
    - REQ-IAM-005 (platform admin role part)
    
**Purpose:** Defines the structure for a Platform Administrator user.  
**Logic Description:** Properties for ID, username, email, roles, status, and last login. Uses ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** DTO for a Platform Administrator user.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.PlatformUsers  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/platform-users/create-platform-administrator.request.dto.ts  
**Description:** DTO for creating a new Platform Administrator user.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** CreatePlatformAdministratorRequestDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/platform-users/create-platform-administrator.request.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** username  
**Type:** string  
**Attributes:** public  
    - **Name:** email  
**Type:** string  
**Attributes:** public  
    - **Name:** password  
**Type:** string  
**Attributes:** public  
    - **Name:** roles  
**Type:** string[]  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Platform admin user creation structure
    
**Requirement Ids:**
    
    - REQ-POA-019
    - REQ-IAM-005 (platform admin role part)
    
**Purpose:** Defines the request payload for creating a Platform Administrator.  
**Logic Description:** Properties for username, email, initial password, and roles. Uses ApiProperty and class-validator decorators.  
**Documentation:**
    
    - **Summary:** DTO for creating a Platform Administrator user.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.PlatformUsers  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/domain/dto/platform-users/update-platform-administrator.request.dto.ts  
**Description:** DTO for updating an existing Platform Administrator user.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** UpdatePlatformAdministratorRequestDto  
**Type:** DTO  
**Relative Path:** modules/platform-admin/domain/dto/platform-users/update-platform-administrator.request.dto.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** email  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** roles  
**Type:** string[]  
**Attributes:** public|optional  
    - **Name:** isActive  
**Type:** boolean  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Platform admin user update structure
    
**Requirement Ids:**
    
    - REQ-POA-019
    - REQ-IAM-005 (platform admin role part)
    
**Purpose:** Defines the request payload for updating a Platform Administrator.  
**Logic Description:** Optional properties for updating email, roles, and active status. Uses ApiProperty and class-validator decorators.  
**Documentation:**
    
    - **Summary:** DTO for updating a Platform Administrator user.
    
**Namespace:** AdManager.PlatformAdministration.Domain.Dto.PlatformUsers  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/platform-admin/infrastructure/guards/platform-admin.guard.ts  
**Description:** A NestJS guard to protect routes, ensuring only users with the 'PlatformAdministrator' role can access them.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 1  
**Name:** PlatformAdminGuard  
**Type:** Guard  
**Relative Path:** modules/platform-admin/infrastructure/guards/platform-admin.guard.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    - RoleBasedAccessControl
    
**Members:**
    
    
**Methods:**
    
    - **Name:** canActivate  
**Parameters:**
    
    - context: ExecutionContext
    
**Return Type:** boolean | Promise<boolean> | Observable<boolean>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Role-based authorization for platform admin endpoints
    
**Requirement Ids:**
    
    - REQ-POA-001
    - REQ-POA-019
    - REQ-IAM-005 (platform admin role part)
    
**Purpose:** Ensures that only authenticated users with the Platform Administrator role can access specific endpoints.  
**Logic Description:** Implements CanActivate interface. Retrieves user and roles from the request object (e.g., from JWT payload populated by an upstream auth guard). Checks if the user has the required 'PlatformAdministrator' role. Returns true if authorized, false or throws ForbiddenException otherwise.  
**Documentation:**
    
    - **Summary:** NestJS guard for platform administrator role authorization.
    
**Namespace:** AdManager.PlatformAdministration.Infrastructure.Guards  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/platform-admin/infrastructure/decorators/roles.decorator.ts  
**Description:** Custom NestJS decorator to specify required roles for a route, used in conjunction with PlatformAdminGuard.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 0  
**Name:** Roles  
**Type:** Decorator  
**Relative Path:** modules/platform-admin/infrastructure/decorators/roles.decorator.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    - RoleBasedAccessControl
    
**Members:**
    
    
**Methods:**
    
    - **Name:** Roles  
**Parameters:**
    
    - ...roles: string[]
    
**Return Type:** CustomDecorator  
**Attributes:** export|const  
    
**Implemented Features:**
    
    - Role metadata attachment for guards
    
**Requirement Ids:**
    
    - REQ-POA-019
    - REQ-IAM-005 (platform admin role part)
    
**Purpose:** Attaches role metadata to route handlers for use by authorization guards.  
**Logic Description:** Uses SetMetadata from @nestjs/common to associate an array of role strings with a route handler. The PlatformAdminGuard would then read this metadata to check for specific roles (though for this repository, it might implicitly check for 'PlatformAdministrator').  
**Documentation:**
    
    - **Summary:** Custom decorator to specify roles required for accessing a route.
    
**Namespace:** AdManager.PlatformAdministration.Infrastructure.Decorators  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/core/filters/all-exceptions.filter.ts  
**Description:** Global exception filter to catch unhandled exceptions and format them into a standardized API error response. This could be a simplified version specific to the module or a shared core component.  
**Template:** NestJS TypeScript Template  
**Dependancy Level:** 1  
**Name:** AllExceptionsFilter  
**Type:** Filter  
**Relative Path:** core/filters/all-exceptions.filter.ts  
**Repository Id:** REPO-PLATADMIN-011  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** catch  
**Parameters:**
    
    - exception: unknown
    - host: ArgumentsHost
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Centralized error handling
    
**Requirement Ids:**
    
    
**Purpose:** Provides a consistent error response format across the API.  
**Logic Description:** Implements ExceptionFilter. Catches all exceptions, logs them, and sends a standardized JSON error response with appropriate HTTP status code. Differentiates between HttpException and other errors.  
**Documentation:**
    
    - **Summary:** Global exception filter for consistent API error responses.
    
**Namespace:** AdManager.Core.Filters  
**Metadata:**
    
    - **Category:** Infrastructure
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableDetailedHealthChecks
  - enableAdvancedAuditFiltering
  - maintenanceModeGlobal
  - platformUserSelfServicePasswordReset (hypothetical)
  
- **Database Configs:**
  
  - AUDIT_LOG_DB_CONNECTION_STRING (if separate)
  - PLATFORM_CONFIG_DB_CONNECTION_STRING (if separate)
  


---

