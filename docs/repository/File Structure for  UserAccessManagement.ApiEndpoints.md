# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project metadata, dependencies (NestJS, class-validator, class-transformer, @nestjs/swagger, passport, passport-jwt, etc.), and scripts for the UserAccessManagement API.  
**Template:** NestJS TypeScript Project  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../../package.json  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Management
    - Project Scripts
    
**Requirement Ids:**
    
    
**Purpose:** Manages Node.js project dependencies and provides scripts for development, build, and execution.  
**Logic Description:** Standard package.json structure including dependencies for NestJS core, common modules, passport, JWT, class-validator, class-transformer, and @nestjs/swagger.  
**Documentation:**
    
    - **Summary:** Contains all metadata about the Node.js project, including its dependencies, version, and scripts.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** tsconfig.json  
**Description:** TypeScript compiler options for the project, configuring how TypeScript files are transpiled to JavaScript.  
**Template:** NestJS TypeScript Project  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ../../tsconfig.json  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript Compilation Configuration
    
**Requirement Ids:**
    
    
**Purpose:** Specifies the root files and the compiler options required to compile the TypeScript project.  
**Logic Description:** Standard tsconfig.json for a NestJS project, enabling strict type checking, decorator metadata, and specifying output directories.  
**Documentation:**
    
    - **Summary:** Configuration file for the TypeScript compiler (tsc).
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** nest-cli.json  
**Description:** Configuration file for the NestJS CLI, specifying project structure and build options.  
**Template:** NestJS TypeScript Project  
**Dependancy Level:** 0  
**Name:** nest-cli  
**Type:** Configuration  
**Relative Path:** ../../nest-cli.json  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - NestJS CLI Configuration
    
**Requirement Ids:**
    
    
**Purpose:** Provides configuration for the NestJS command-line interface, affecting how the project is built and managed.  
**Logic Description:** Standard nest-cli.json defining the source root and entry file, potentially collection for swagger plugins.  
**Documentation:**
    
    - **Summary:** NestJS CLI configuration file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/main.ts  
**Description:** Main entry point for the NestJS application. Initializes and bootstraps the UserAccessManagement API module.  
**Template:** NestJS TypeScript Main  
**Dependancy Level:** 4  
**Name:** main  
**Type:** Bootstrap  
**Relative Path:** main.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** bootstrap  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** async  
    
**Implemented Features:**
    
    - Application Bootstrap
    - Swagger Setup
    
**Requirement Ids:**
    
    
**Purpose:** Initializes the NestJS application, sets up global middleware, Swagger documentation, and starts the HTTP server.  
**Logic Description:** Imports the main application module (AppModule, which imports UserAccessModule). Creates a NestJS application instance. Configures Swagger for API documentation. Sets up global pipes for validation (ValidationPipe). Listens on a configured port.  
**Documentation:**
    
    - **Summary:** The entry file of the application which uses the core function NestFactory to create a Nest application instance.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/app.module.ts  
**Description:** Root application module. Imports feature modules like UserAccessModule and configures global providers or settings.  
**Template:** NestJS TypeScript Module  
**Dependancy Level:** 5  
**Name:** app.module  
**Type:** Module  
**Relative Path:** app.module.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Root Module Configuration
    
**Requirement Ids:**
    
    
**Purpose:** Serves as the root module for the NestJS application, organizing and importing other feature modules.  
**Logic Description:** Imports ConfigModule for environment variable handling and the UserAccessModule. May include other global modules for logging or health checks if applicable to the entire API service containing this module.  
**Documentation:**
    
    - **Summary:** The root module of the NestJS application.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/user-access/api/user-access.module.ts  
**Description:** NestJS module for user access management. Encapsulates controllers, services, and providers related to users, roles, and permissions.  
**Template:** NestJS TypeScript Module  
**Dependancy Level:** 3  
**Name:** user-access.module  
**Type:** Module  
**Relative Path:** modules/user-access/api/user-access.module.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module Encapsulation for User Access
    
**Requirement Ids:**
    
    - REQ-IAM-001
    - REQ-IAM-002
    
**Purpose:** Organizes and declares all components (controllers, services, guards) related to user access management within the Ad Manager.  
**Logic Description:** Imports necessary NestJS modules (e.g., PassportModule, JwtModule). Declares controllers (UsersController, RolesController, AuthController, PlatformAdminUsersController). Provides UserAccessService and any related strategy providers (e.g., JwtStrategy). Exports UserAccessService if needed by other modules (though likely self-contained).  
**Documentation:**
    
    - **Summary:** Defines the user access management module, grouping related controllers and services.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1  
**Metadata:**
    
    - **Category:** Module
    
- **Path:** src/modules/user-access/api/constants/roles.constants.ts  
**Description:** Defines constants for user roles (Merchant Admin, Campaign Manager, Platform Administrator).  
**Template:** TypeScript Constants  
**Dependancy Level:** 0  
**Name:** roles.constants  
**Type:** Constants  
**Relative Path:** modules/user-access/api/constants/roles.constants.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** MERCHANT_ADMIN_ROLE  
**Type:** string  
**Attributes:** export const  
    - **Name:** CAMPAIGN_MANAGER_ROLE  
**Type:** string  
**Attributes:** export const  
    - **Name:** PLATFORM_ADMIN_ROLE  
**Type:** string  
**Attributes:** export const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Role Definitions
    
**Requirement Ids:**
    
    - REQ-IAM-001
    - 2.3
    
**Purpose:** Provides standardized string constants for user role names to avoid magic strings in the codebase.  
**Logic Description:** Exports string constants for MERCHANT_ADMIN_ROLE, CAMPAIGN_MANAGER_ROLE, and PLATFORM_ADMIN_ROLE.  
**Documentation:**
    
    - **Summary:** Contains constant definitions for user roles within the Ad Manager.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Constants  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/user-access/api/interfaces/user.interface.ts  
**Description:** TypeScript interface defining the structure of a user object within the Ad Manager context.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** user.interface  
**Type:** Interface  
**Relative Path:** modules/user-access/api/interfaces/user.interface.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:**   
    - **Name:** corePlatformUserId  
**Type:** string  
**Attributes:**   
    - **Name:** merchantId  
**Type:** string | null  
**Attributes:**   
    - **Name:** email  
**Type:** string  
**Attributes:**   
    - **Name:** roles  
**Type:** string[]  
**Attributes:**   
    - **Name:** isActive  
**Type:** boolean  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - User Data Structure
    
**Requirement Ids:**
    
    - REQ-IAM-001
    
**Purpose:** Defines the contract for user data used throughout the user access management module.  
**Logic Description:** Interface properties include id, corePlatformUserId (linking to `[PlatformName]` user), merchantId (if applicable), email, roles (array of role names/IDs), and status.  
**Documentation:**
    
    - **Summary:** Specifies the shape of user objects used in the API and service layer.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Interfaces  
**Metadata:**
    
    - **Category:** Model
    
- **Path:** src/modules/user-access/api/interfaces/role.interface.ts  
**Description:** TypeScript interface defining the structure of a role object.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** role.interface  
**Type:** Interface  
**Relative Path:** modules/user-access/api/interfaces/role.interface.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:**   
    - **Name:** name  
**Type:** string  
**Attributes:**   
    - **Name:** permissions  
**Type:** string[]  
**Attributes:** optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Role Data Structure
    
**Requirement Ids:**
    
    - REQ-IAM-001
    - REQ-IAM-002
    
**Purpose:** Defines the contract for role data.  
**Logic Description:** Interface properties include id, name (e.g., MERCHANT_ADMIN_ROLE), and an array of associated permission identifiers.  
**Documentation:**
    
    - **Summary:** Specifies the shape of role objects.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Interfaces  
**Metadata:**
    
    - **Category:** Model
    
- **Path:** src/modules/user-access/api/dtos/request/create-user.dto.ts  
**Description:** Data Transfer Object for creating a new user. Includes validation decorators.  
**Template:** NestJS TypeScript DTO  
**Dependancy Level:** 1  
**Name:** create-user.dto  
**Type:** DTO  
**Relative Path:** modules/user-access/api/dtos/request/create-user.dto.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** email  
**Type:** string  
**Attributes:** @IsEmail() @IsNotEmpty()  
    - **Name:** corePlatformUserId  
**Type:** string  
**Attributes:** @IsNotEmpty() @IsUUID()  
    - **Name:** merchantId  
**Type:** string  
**Attributes:** @IsOptional() @IsUUID()  
    - **Name:** roles  
**Type:** string[]  
**Attributes:** @IsArray() @IsString({ each: true }) @IsOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - User Creation Input Validation
    
**Requirement Ids:**
    
    - REQ-IAM-003
    - REQ-IAM-005
    
**Purpose:** Defines the expected structure and validation rules for data provided when creating a new user.  
**Logic Description:** Properties: email, corePlatformUserId, merchantId (optional, for merchant users), roles (optional, to assign roles upon creation). Uses class-validator decorators for validation.  
**Documentation:**
    
    - **Summary:** Request payload for creating a new user.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Dtos.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/user-access/api/dtos/request/update-user.dto.ts  
**Description:** Data Transfer Object for updating an existing user's details. Includes validation decorators.  
**Template:** NestJS TypeScript DTO  
**Dependancy Level:** 1  
**Name:** update-user.dto  
**Type:** DTO  
**Relative Path:** modules/user-access/api/dtos/request/update-user.dto.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** email  
**Type:** string  
**Attributes:** @IsEmail() @IsOptional()  
    - **Name:** isActive  
**Type:** boolean  
**Attributes:** @IsBoolean() @IsOptional()  
    - **Name:** roles  
**Type:** string[]  
**Attributes:** @IsArray() @IsString({ each: true }) @IsOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - User Update Input Validation
    
**Requirement Ids:**
    
    - REQ-IAM-003
    - REQ-IAM-005
    
**Purpose:** Defines the expected structure and validation rules for data provided when updating a user.  
**Logic Description:** Properties: email (optional), isActive (optional for status changes), roles (optional for re-assigning roles). Uses class-validator decorators.  
**Documentation:**
    
    - **Summary:** Request payload for updating user information.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Dtos.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/user-access/api/dtos/request/assign-role.dto.ts  
**Description:** Data Transfer Object for assigning a role to a user.  
**Template:** NestJS TypeScript DTO  
**Dependancy Level:** 1  
**Name:** assign-role.dto  
**Type:** DTO  
**Relative Path:** modules/user-access/api/dtos/request/assign-role.dto.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** roleName  
**Type:** string  
**Attributes:** @IsNotEmpty() @IsString()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Role Assignment Input Validation
    
**Requirement Ids:**
    
    - REQ-IAM-002
    - REQ-IAM-003
    
**Purpose:** Defines the payload for assigning a specific role to a user.  
**Logic Description:** Properties: roleName. Uses class-validator decorators.  
**Documentation:**
    
    - **Summary:** Request payload for assigning a role to a user.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Dtos.Request  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/user-access/api/dtos/response/user.response.dto.ts  
**Description:** Data Transfer Object for user responses.  
**Template:** NestJS TypeScript DTO  
**Dependancy Level:** 1  
**Name:** user.response.dto  
**Type:** DTO  
**Relative Path:** modules/user-access/api/dtos/response/user.response.dto.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** email  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** corePlatformUserId  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** merchantId  
**Type:** string | null  
**Attributes:** @ApiPropertyOptional()  
    - **Name:** roles  
**Type:** string[]  
**Attributes:** @ApiProperty()  
    - **Name:** isActive  
**Type:** boolean  
**Attributes:** @ApiProperty()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - User Data Output Formatting
    
**Requirement Ids:**
    
    - REQ-IAM-001
    
**Purpose:** Defines the structure of user data returned by API endpoints. Decorated with @ApiProperty for Swagger documentation.  
**Logic Description:** Maps to the IUSer interface, providing a clean API contract. Uses @nestjs/swagger decorators.  
**Documentation:**
    
    - **Summary:** Response payload representing a user's details.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Dtos.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/user-access/api/dtos/response/role.response.dto.ts  
**Description:** Data Transfer Object for role responses.  
**Template:** NestJS TypeScript DTO  
**Dependancy Level:** 1  
**Name:** role.response.dto  
**Type:** DTO  
**Relative Path:** modules/user-access/api/dtos/response/role.response.dto.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** name  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** permissions  
**Type:** string[]  
**Attributes:** @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Role Data Output Formatting
    
**Requirement Ids:**
    
    - REQ-IAM-001
    - REQ-IAM-002
    
**Purpose:** Defines the structure of role data returned by API endpoints.  
**Logic Description:** Maps to the IRole interface. Decorated with @ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** Response payload representing a role's details.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Dtos.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/user-access/api/dtos/response/auth-token.response.dto.ts  
**Description:** Data Transfer Object for authentication token responses.  
**Template:** NestJS TypeScript DTO  
**Dependancy Level:** 1  
**Name:** auth-token.response.dto  
**Type:** DTO  
**Relative Path:** modules/user-access/api/dtos/response/auth-token.response.dto.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** accessToken  
**Type:** string  
**Attributes:** @ApiProperty()  
    - **Name:** refreshToken  
**Type:** string  
**Attributes:** @ApiPropertyOptional()  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Authentication Token Output
    
**Requirement Ids:**
    
    - REQ-IAM-007
    
**Purpose:** Defines the structure for returning JWT access tokens and refresh tokens.  
**Logic Description:** Contains accessToken and optionally refreshToken. Decorated with @ApiProperty for Swagger.  
**Documentation:**
    
    - **Summary:** Response payload containing authentication tokens.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Dtos.Response  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/user-access/api/guards/jwt-auth.guard.ts  
**Description:** NestJS guard for protecting routes with JWT authentication. Extends AuthGuard('jwt').  
**Template:** NestJS TypeScript Guard  
**Dependancy Level:** 1  
**Name:** jwt-auth.guard  
**Type:** Guard  
**Relative Path:** modules/user-access/api/guards/jwt-auth.guard.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** canActivate  
**Parameters:**
    
    - context: ExecutionContext
    
**Return Type:** boolean | Promise<boolean> | Observable<boolean>  
**Attributes:** public  
    
**Implemented Features:**
    
    - JWT Authentication Enforcement
    
**Requirement Ids:**
    
    - REQ-IAM-007
    - REQ-IAM-006
    - REQ-CPSI-003
    
**Purpose:** Ensures that incoming requests to protected endpoints have a valid JWT.  
**Logic Description:** Extends the built-in AuthGuard('jwt'). If the JWT strategy successfully validates the token, access is granted. Otherwise, an UnauthorizedException is thrown.  
**Documentation:**
    
    - **Summary:** A guard that uses the Passport JWT strategy to protect routes.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Guards  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/user-access/api/guards/roles.guard.ts  
**Description:** NestJS guard for enforcing role-based access control (RBAC). Checks if the authenticated user has the required roles.  
**Template:** NestJS TypeScript Guard  
**Dependancy Level:** 1  
**Name:** roles.guard  
**Type:** Guard  
**Relative Path:** modules/user-access/api/guards/roles.guard.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** reflector  
**Type:** Reflector  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** canActivate  
**Parameters:**
    
    - context: ExecutionContext
    
**Return Type:** boolean  
**Attributes:** public  
    
**Implemented Features:**
    
    - Role-Based Access Control (RBAC) Enforcement
    
**Requirement Ids:**
    
    - REQ-IAM-002
    - REQ-IAM-003
    - REQ-IAM-004
    - REQ-IAM-005
    - REQ-IAM-008
    - REQ-IAM-010
    
**Purpose:** Restricts access to controller methods based on the roles assigned to the authenticated user.  
**Logic Description:** Uses Reflector to retrieve roles metadata (set by @Roles decorator) from the route handler. Compares user's roles with required roles. Throws ForbiddenException if access is denied.  
**Documentation:**
    
    - **Summary:** A guard that checks if the current user has any of the specified roles.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Guards  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/user-access/api/decorators/roles.decorator.ts  
**Description:** Custom NestJS decorator (@Roles) to associate roles metadata with route handlers for use by RolesGuard.  
**Template:** NestJS TypeScript Decorator  
**Dependancy Level:** 0  
**Name:** roles.decorator  
**Type:** Decorator  
**Relative Path:** modules/user-access/api/decorators/roles.decorator.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Role Metadata Attachment
    
**Requirement Ids:**
    
    - REQ-IAM-002
    
**Purpose:** Provides a declarative way to specify which roles are allowed to access a particular endpoint.  
**Logic Description:** Uses SetMetadata from @nestjs/common to attach an array of role names to the handler or class.  
**Documentation:**
    
    - **Summary:** Decorator to assign required roles metadata to a controller method or class.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Decorators  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** src/modules/user-access/api/decorators/current-user.decorator.ts  
**Description:** Custom NestJS decorator (@CurrentUser) to extract the authenticated user object from the request.  
**Template:** NestJS TypeScript Decorator  
**Dependancy Level:** 0  
**Name:** current-user.decorator  
**Type:** Decorator  
**Relative Path:** modules/user-access/api/decorators/current-user.decorator.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Authenticated User Extraction
    
**Requirement Ids:**
    
    - REQ-IAM-007
    
**Purpose:** Simplifies access to the authenticated user's information within controller methods.  
**Logic Description:** Uses createParamDecorator to extract request.user, which is typically populated by Passport authentication strategies.  
**Documentation:**
    
    - **Summary:** Decorator to conveniently access the authenticated user object from the request.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Decorators  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** src/modules/user-access/api/strategies/jwt.strategy.ts  
**Description:** Passport JWT strategy for validating JWTs. Used by JwtAuthGuard.  
**Template:** NestJS TypeScript Passport Strategy  
**Dependancy Level:** 1  
**Name:** jwt.strategy  
**Type:** Strategy  
**Relative Path:** modules/user-access/api/strategies/jwt.strategy.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** configService  
**Type:** ConfigService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - configService: ConfigService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** validate  
**Parameters:**
    
    - payload: any
    
**Return Type:** Promise<any>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - JWT Validation Logic
    
**Requirement Ids:**
    
    - REQ-IAM-007
    
**Purpose:** Defines how JWTs are extracted from requests and validated against a secret or public key.  
**Logic Description:** Extends PassportStrategy(Strategy). Configures JWT extraction (e.g., from Bearer token in Authorization header) and the secret key (from ConfigService). The validate method processes the decoded JWT payload and returns user information or throws an error.  
**Documentation:**
    
    - **Summary:** Implements the Passport JWT strategy for token validation.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Strategies  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/user-access/api/services/user-access.service.ts  
**Description:** Service layer for user access management. Contains business logic for users, roles, permissions, and authentication integration.  
**Template:** NestJS TypeScript Service  
**Dependancy Level:** 2  
**Name:** user-access.service  
**Type:** Service  
**Relative Path:** modules/user-access/api/services/user-access.service.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    - DDD Service
    
**Members:**
    
    - **Name:** jwtService  
**Type:** JwtService  
**Attributes:** private readonly  
    - **Name:** configService  
**Type:** ConfigService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** validateUserWithCorePlatform  
**Parameters:**
    
    - corePlatformToken: string
    
**Return Type:** Promise<IUser | null>  
**Attributes:** public async  
    - **Name:** generateAdManagerTokens  
**Parameters:**
    
    - user: IUser
    
**Return Type:** Promise<AuthTokenResponseDto>  
**Attributes:** public async  
    - **Name:** createUser  
**Parameters:**
    
    - createUserDto: CreateUserDto
    - requestingUser: IUser
    
**Return Type:** Promise<IUser>  
**Attributes:** public async  
    - **Name:** findUserById  
**Parameters:**
    
    - userId: string
    
**Return Type:** Promise<IUser | null>  
**Attributes:** public async  
    - **Name:** findUsersByMerchant  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<IUser[]>  
**Attributes:** public async  
    - **Name:** updateUser  
**Parameters:**
    
    - userId: string
    - updateUserDto: UpdateUserDto
    - requestingUser: IUser
    
**Return Type:** Promise<IUser>  
**Attributes:** public async  
    - **Name:** assignRoleToUser  
**Parameters:**
    
    - userId: string
    - roleName: string
    - requestingUser: IUser
    
**Return Type:** Promise<IUser>  
**Attributes:** public async  
    - **Name:** getRoles  
**Parameters:**
    
    
**Return Type:** Promise<IRole[]>  
**Attributes:** public async  
    - **Name:** getRoleByName  
**Parameters:**
    
    - roleName: string
    
**Return Type:** Promise<IRole | null>  
**Attributes:** public async  
    - **Name:** checkUserPermissionForMerchant  
**Parameters:**
    
    - userId: string
    - merchantId: string
    - requiredRole: string
    
**Return Type:** Promise<boolean>  
**Attributes:** public async  
    - **Name:** platformAdminGetUser  
**Parameters:**
    
    - userId: string
    
**Return Type:** Promise<IUser | null>  
**Attributes:** public async  
    - **Name:** platformAdminUpdateUser  
**Parameters:**
    
    - userId: string
    - updateDto: any
    - adminUser: IUser
    
**Return Type:** Promise<IUser>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - User CRUD
    - Role Management
    - Permission Logic
    - JWT Generation
    - Core Auth Integration
    - RBAC Logic
    
**Requirement Ids:**
    
    - REQ-IAM-001
    - REQ-IAM-002
    - REQ-IAM-003
    - REQ-IAM-004
    - REQ-IAM-005
    - REQ-IAM-006
    - REQ-CPSI-003
    - REQ-IAM-007
    - REQ-IAM-008
    - REQ-IAM-010
    - 2.3
    
**Purpose:** Implements the core business logic for managing user identities, roles, permissions, and orchestrating authentication with the `[PlatformName]` core system for Ad Manager access.  
**Logic Description:** Handles user creation, updates, role assignments. Validates users against the core `[PlatformName]` authentication system (simulated or via an integration client). Generates and validates Ad Manager specific JWTs. Enforces RBAC rules based on user roles and defined permissions. Provides methods for Platform Admin user management tasks. Ensures data access aligns with PII handling and data classification.  
**Documentation:**
    
    - **Summary:** Provides business logic for all user access management operations, including authentication and authorization.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Services  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/user-access/api/controllers/auth.controller.ts  
**Description:** Controller for authentication-related endpoints (e.g., login/token exchange, token refresh, get current user).  
**Template:** NestJS TypeScript Controller  
**Dependancy Level:** 2  
**Name:** auth.controller  
**Type:** Controller  
**Relative Path:** modules/user-access/api/controllers/auth.controller.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** userAccessService  
**Type:** UserAccessService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** login  
**Parameters:**
    
    - req: any
    
**Return Type:** Promise<AuthTokenResponseDto>  
**Attributes:** public async  
    - **Name:** refreshToken  
**Parameters:**
    
    - req: any
    
**Return Type:** Promise<AuthTokenResponseDto>  
**Attributes:** public async  
    - **Name:** getProfile  
**Parameters:**
    
    - req: any
    - @CurrentUser() user: IUser
    
**Return Type:** IUser  
**Attributes:** public  
    
**Implemented Features:**
    
    - User Login/Token Exchange
    - Token Refresh
    - Current User Profile
    
**Requirement Ids:**
    
    - REQ-IAM-006
    - REQ-CPSI-003
    - REQ-IAM-007
    
**Purpose:** Handles authentication flows, such as exchanging a core platform token for an Ad Manager JWT, refreshing tokens, and retrieving authenticated user details.  
**Logic Description:** Defines endpoints like /auth/login (could use a custom guard to interact with `[PlatformName]` auth or receive a core token), /auth/refresh. Uses UserAccessService to validate credentials/tokens and generate new JWTs. The /auth/me endpoint uses @CurrentUser decorator to return the authenticated user profile.  
**Documentation:**
    
    - **Summary:** Exposes API endpoints for user authentication and session management.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/user-access/api/controllers/users.controller.ts  
**Description:** Controller for managing merchant users. Endpoints typically accessed by Merchant Admins.  
**Template:** NestJS TypeScript Controller  
**Dependancy Level:** 2  
**Name:** users.controller  
**Type:** Controller  
**Relative Path:** modules/user-access/api/controllers/users.controller.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** userAccessService  
**Type:** UserAccessService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** createUser  
**Parameters:**
    
    - @Body() createUserDto: CreateUserDto
    - @CurrentUser() requestingUser: IUser
    
**Return Type:** Promise<UserResponseDto>  
**Attributes:** public async  
    - **Name:** getUsersForMerchant  
**Parameters:**
    
    - @CurrentUser() requestingUser: IUser
    
**Return Type:** Promise<UserResponseDto[]>  
**Attributes:** public async  
    - **Name:** getUserById  
**Parameters:**
    
    - @Param('userId') userId: string
    - @CurrentUser() requestingUser: IUser
    
**Return Type:** Promise<UserResponseDto>  
**Attributes:** public async  
    - **Name:** updateUser  
**Parameters:**
    
    - @Param('userId') userId: string
    - @Body() updateUserDto: UpdateUserDto
    - @CurrentUser() requestingUser: IUser
    
**Return Type:** Promise<UserResponseDto>  
**Attributes:** public async  
    - **Name:** assignRole  
**Parameters:**
    
    - @Param('userId') userId: string
    - @Body() assignRoleDto: AssignRoleDto
    - @CurrentUser() requestingUser: IUser
    
**Return Type:** Promise<UserResponseDto>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - Merchant User CRUD
    - Role Assignment for Merchant Users
    
**Requirement Ids:**
    
    - REQ-IAM-001
    - REQ-IAM-002
    - REQ-IAM-003
    - REQ-IAM-004
    - REQ-IAM-008
    - REQ-IAM-010
    
**Purpose:** Exposes API endpoints for Merchant Admins to manage users within their organization, including creation, updates, and role assignments.  
**Logic Description:** Endpoints like POST /users, GET /users, GET /users/:id, PUT /users/:id, POST /users/:id/roles. Uses @UseGuards(JwtAuthGuard, RolesGuard) and @Roles decorator to restrict access. Delegates business logic to UserAccessService. Validates DTOs. Ensures Merchant Admins can only manage users within their own merchant context.  
**Documentation:**
    
    - **Summary:** API endpoints for managing users within a merchant's scope.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/user-access/api/controllers/roles.controller.ts  
**Description:** Controller for managing roles. Endpoints might be for listing roles or, if role management is dynamic, for Platform Admins.  
**Template:** NestJS TypeScript Controller  
**Dependancy Level:** 2  
**Name:** roles.controller  
**Type:** Controller  
**Relative Path:** modules/user-access/api/controllers/roles.controller.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** userAccessService  
**Type:** UserAccessService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** getAllRoles  
**Parameters:**
    
    
**Return Type:** Promise<RoleResponseDto[]>  
**Attributes:** public async  
    - **Name:** getRoleByName  
**Parameters:**
    
    - @Param('name') roleName: string
    
**Return Type:** Promise<RoleResponseDto>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - List Ad Manager Roles
    - Get Role Details
    
**Requirement Ids:**
    
    - REQ-IAM-001
    - REQ-IAM-002
    
**Purpose:** Provides API endpoints to retrieve information about available roles and their permissions within the Ad Manager.  
**Logic Description:** Endpoints like GET /roles, GET /roles/:name. Protected by JwtAuthGuard. May be accessible by all authenticated users to understand role structures, or restricted further if needed. Delegates to UserAccessService.  
**Documentation:**
    
    - **Summary:** API endpoints for retrieving role information.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/user-access/api/controllers/platform-admin.users.controller.ts  
**Description:** Controller for Platform Administrator specific user management tasks across all merchants.  
**Template:** NestJS TypeScript Controller  
**Dependancy Level:** 2  
**Name:** platform-admin.users.controller  
**Type:** Controller  
**Relative Path:** modules/user-access/api/controllers/platform-admin.users.controller.ts  
**Repository Id:** REPO-USERACC-010  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** userAccessService  
**Type:** UserAccessService  
**Attributes:** private readonly  
    
**Methods:**
    
    - **Name:** getMerchantUsers  
**Parameters:**
    
    - @Param('merchantId') merchantId: string
    - @CurrentUser() adminUser: IUser
    
**Return Type:** Promise<UserResponseDto[]>  
**Attributes:** public async  
    - **Name:** getAnyUserById  
**Parameters:**
    
    - @Param('userId') userId: string
    - @CurrentUser() adminUser: IUser
    
**Return Type:** Promise<UserResponseDto>  
**Attributes:** public async  
    - **Name:** platformUpdateUser  
**Parameters:**
    
    - @Param('userId') userId: string
    - @Body() updateUserDto: UpdateUserDto
    - @CurrentUser() adminUser: IUser
    
**Return Type:** Promise<UserResponseDto>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - Platform-wide User Management
    
**Requirement Ids:**
    
    - REQ-IAM-001
    - REQ-IAM-005
    - REQ-IAM-008
    - REQ-IAM-010
    
**Purpose:** Exposes API endpoints for Platform Administrators to manage users across different merchants, for support and administrative oversight.  
**Logic Description:** Endpoints prefixed with /platform-admin, e.g., GET /platform-admin/merchants/:merchantId/users, GET /platform-admin/users/:userId, PUT /platform-admin/users/:userId. Strictly protected by @UseGuards(JwtAuthGuard, RolesGuard) and @Roles(PLATFORM_ADMIN_ROLE). Delegates to specific methods in UserAccessService designed for platform admin capabilities.  
**Documentation:**
    
    - **Summary:** API endpoints for platform administrators to manage users globally.
    
**Namespace:** AdManager.UserAccessManagement.Api.V1.Controllers  
**Metadata:**
    
    - **Category:** Presentation
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableGranularPermissionsManagementApi
  - enableUserImpersonationForAdmins
  
- **Database Configs:**
  
  


---

