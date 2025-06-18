# Software Design Specification: UserAccessManagement.ApiEndpoints

## 1. Introduction

### 1.1 Purpose
This document provides a detailed software design specification for the `UserAccessManagement.ApiEndpoints` repository. This repository is responsible for exposing RESTful API endpoints for managing users, roles, and permissions within the Ad Manager platform. It integrates with the `[PlatformName]` core authentication system and provides Ad Manager-specific authorization logic. These endpoints serve the Merchant Ad Manager Portal, Platform Administrator Portal, and potentially other internal or authorized third-party applications.

### 1.2 Scope
The scope of this document covers the design of all components within the `UserAccessManagement.ApiEndpoints` repository, including:
-   API controllers and their respective endpoints.
-   Data Transfer Objects (DTOs) for request and response validation and structuring.
-   Authentication and authorization mechanisms (Guards, Strategies, Decorators).
-   The core service layer orchestrating user access management logic.
-   Integration points with the `[PlatformName]` core authentication system.
-   Definition of user roles and their representation.

This SDS does not cover the detailed design of the underlying data persistence layer or the `[PlatformName]` core authentication system itself, but rather how this API module interacts with them conceptually.

### 1.3 Definitions, Acronyms, and Abbreviations
-   **API:** Application Programming Interface
-   **DTO:** Data Transfer Object
-   **IAM:** Identity and Access Management
-   **JWT:** JSON Web Token
-   **RBAC:** Role-Based Access Control
-   **REST:** Representational State Transfer
-   **SDS:** Software Design Specification
-   **SSO:** Single Sign-On
-   **`[PlatformName]`:** The placeholder for the actual name of the core e-commerce platform.

## 2. System Overview

The `UserAccessManagement.ApiEndpoints` is a microservice built with NestJS, providing a RESTful API for all user identity, authentication, and authorization concerns specific to the Ad Manager module. It acts as a specialized IAM layer on top of the `[PlatformName]` core authentication.

Key functionalities include:
-   User onboarding and management within the Ad Manager context.
-   Role definition (Merchant Admin, Campaign Manager, Platform Administrator) and assignment.
-   Enforcement of permissions based on roles (RBAC).
-   Generation and validation of Ad Manager-specific JWTs after successful core platform authentication.
-   Secure endpoints for platform administrators to manage users across the system.

## 3. Architectural Design

### 3.1 Module Structure
The primary module is `UserAccessModule`, which encapsulates all controllers, services, providers, guards, and DTOs related to user access management.

mermaid
graph TD
    AppModule --> UserAccessModule;
    UserAccessModule --> AuthController;
    UserAccessModule --> UsersController;
    UserAccessModule --> RolesController;
    UserAccessModule --> PlatformAdminUsersController;
    UserAccessModule --> UserAccessService;
    UserAccessModule --> JwtStrategy;
    UserAccessModule --> JwtAuthGuard;
    UserAccessModule --> RolesGuard;


### 3.2 Authentication Flow
1.  A user authenticates against the `[PlatformName]` core authentication system (external to this service).
2.  The client (e.g., Merchant Portal) receives a token or proof of authentication from the core platform.
3.  The client calls the Ad Manager `AuthController`'s login endpoint, providing the core platform's token/proof.
4.  The `UserAccessService` validates this token/proof (potentially by calling a `[PlatformName]` core API).
5.  If valid, the `UserAccessService` identifies or provisions the Ad Manager user and generates Ad Manager-specific JWTs (access token and refresh token).
6.  These Ad Manager JWTs are returned to the client.
7.  Subsequent requests to protected Ad Manager APIs must include the Ad Manager access token in the `Authorization` header (Bearer scheme).
8.  The `JwtAuthGuard` and `JwtStrategy` validate this token.

### 3.3 Authorization Flow
1.  After successful JWT authentication, the `JwtStrategy` populates `request.user` with the authenticated user's details, including their Ad Manager roles.
2.  For endpoints requiring specific roles, the `RolesGuard` is invoked.
3.  The `RolesGuard` inspects the `@Roles()` decorator metadata on the controller method.
4.  It compares the user's assigned roles with the required roles.
5.  If the user has at least one of the required roles, access is granted; otherwise, a `ForbiddenException` is thrown.
6.  Granular permission checks beyond endpoint-level role access (e.g., ensuring a Merchant Admin only manages their own merchant's users) are handled within the `UserAccessService`.

## 4. Detailed Component Design

This section details the design of each file as defined in the `file_structure_json`.

### 4.1 Configuration Files

#### 4.1.1 `package.json`
-   **Purpose:** Manages Node.js project dependencies and provides scripts for development, build, and execution.
-   **Key Dependencies:**
    -   `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`
    -   `@nestjs/config` (for environment variable management)
    -   `@nestjs/jwt` (for JWT generation and validation)
    -   `@nestjs/passport`
    -   `passport`, `passport-jwt`
    -   `class-validator`, `class-transformer` (for DTO validation and transformation)
    -   `@nestjs/swagger` (for OpenAPI documentation)
    -   `reflect-metadata`
    -   Development: `@types/*`, `typescript`, `ts-loader`, `jest`, `supertest`
-   **Scripts:** `start`, `start:dev`, `start:debug`, `build`, `test`, `lint`, etc.

#### 4.1.2 `tsconfig.json`
-   **Purpose:** Specifies the root files and the compiler options required to compile the TypeScript project.
-   **Key Compiler Options:**
    -   `module`: "commonjs"
    -   `declaration`: true
    -   `removeComments`: true
    -   `emitDecoratorMetadata`: true
    -   `experimentalDecorators`: true
    -   `allowSyntheticDefaultImports`: true
    -   `target`: "ES2021" (or newer LTS compatible)
    -   `sourceMap`: true
    -   `outDir`: "./dist"
    -   `baseUrl`: "./"
    -   `incremental`: true
    -   `strictNullChecks`: true (recommended)

#### 4.1.3 `nest-cli.json`
-   **Purpose:** Provides configuration for the NestJS command-line interface.
-   **Content:**
    json
    {
      "$schema": "https://json.schemastore.org/nest-cli",
      "collection": "@nestjs/schematics",
      "sourceRoot": "src",
      "compilerOptions": {
        "deleteOutDir": true,
        "plugins": ["@nestjs/swagger/plugin"]
      }
    }
    

### 4.2 Application Bootstrap and Modules

#### 4.2.1 `src/main.ts`
-   **Purpose:** Initializes the NestJS application, sets up global middleware, Swagger documentation, and starts the HTTP server.
-   **Logic:**
    1.  Import `NestFactory` from `@nestjs/core`.
    2.  Import `AppModule`.
    3.  Import `ValidationPipe` from `@nestjs/common`.
    4.  Import `DocumentBuilder`, `SwaggerModule` from `@nestjs/swagger`.
    5.  Import `ConfigService` from `@nestjs/config`.
    6.  `async function bootstrap()`:
        a.  Create application instance: `const app = await NestFactory.create(AppModule);`
        b.  Get `ConfigService`: `const configService = app.get(ConfigService);`
        c.  Enable CORS if needed: `app.enableCors();` (configure appropriately for production)
        d.  Global Pipes: `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));`
        e.  Swagger Setup:
            i.  Create `DocumentBuilder` instance: `new DocumentBuilder().setTitle('Ad Manager - User Access API')...build();`
            ii. Create Swagger document: `const document = SwaggerModule.createDocument(app, options);`
            iii. Setup Swagger UI endpoint: `SwaggerModule.setup('api/docs/user-access', app, document);`
        f.  Listen on port: `await app.listen(configService.get<number>('PORT') || 3001);`
    7.  Call `bootstrap()`.

#### 4.2.2 `src/app.module.ts`
-   **Purpose:** Serves as the root module for the NestJS application, organizing and importing other feature modules.
-   **Logic:**
    typescript
    import { Module } from '@nestjs/common';
    import { ConfigModule } from '@nestjs/config';
    import { UserAccessModule } from './modules/user-access/api/user-access.module';

    @Module({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true, // Makes ConfigService available globally
          // envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Optional: load .env files
        }),
        UserAccessModule,
        // Potentially other global modules like a HealthCheckModule
      ],
    })
    export class AppModule {}
    

#### 4.2.3 `src/modules/user-access/api/user-access.module.ts`
-   **Purpose:** Organizes and declares all components related to user access management.
-   **Logic:**
    typescript
    import { Module } from '@nestjs/common';
    import { PassportModule } from '@nestjs/passport';
    import { JwtModule } from '@nestjs/jwt';
    import { ConfigModule, ConfigService } from '@nestjs/config';
    import { UserAccessService } from './services/user-access.service';
    import { AuthController } from './controllers/auth.controller';
    import { UsersController } from './controllers/users.controller';
    import { RolesController } from './controllers/roles.controller';
    import { PlatformAdminUsersController } from './controllers/platform-admin.users.controller';
    import { JwtStrategy } from './strategies/jwt.strategy';
    // Potentially import a CorePlatformIntegrationModule if interaction is complex

    @Module({
      imports: [
        ConfigModule, // Ensure ConfigService is available
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN', '15m'),
            },
          }),
          inject: [ConfigService],
        }),
        // CorePlatformIntegrationModule, // If interactions are abstracted
      ],
      controllers: [
        AuthController,
        UsersController,
        RolesController,
        PlatformAdminUsersController,
      ],
      providers: [UserAccessService, JwtStrategy /*, CorePlatformAuthService (if separate) */],
      exports: [UserAccessService, PassportModule, JwtModule], // Export if other Ad Manager modules need them
    })
    export class UserAccessModule {}
    

### 4.3 Constants, Interfaces, DTOs

#### 4.3.1 `src/modules/user-access/api/constants/roles.constants.ts`
-   **Purpose:** Provides standardized string constants for user role names.
-   **Content:**
    typescript
    export const MERCHANT_ADMIN_ROLE = 'MerchantAdmin';
    export const CAMPAIGN_MANAGER_ROLE = 'CampaignManager';
    export const PLATFORM_ADMIN_ROLE = 'PlatformAdministrator';
    
    (Covers REQ-IAM-001, 2.3)

#### 4.3.2 Interfaces

##### `src/modules/user-access/api/interfaces/user.interface.ts`
-   **Purpose:** Defines the contract for user data.
-   **Content:**
    typescript
    export interface IUser {
      id: string; // Ad Manager User ID (e.g., UUID)
      corePlatformUserId: string; // ID from [PlatformName] core system
      merchantId?: string | null; // Associated merchant ID, if applicable
      email: string;
      roles: string[]; // Array of role names (e.g., [MERCHANT_ADMIN_ROLE])
      isActive: boolean;
      // Potentially other Ad Manager specific user attributes
    }
    
    (Covers REQ-IAM-001)

##### `src/modules/user-access/api/interfaces/role.interface.ts`
-   **Purpose:** Defines the contract for role data.
-   **Content:**
    typescript
    export interface IRole {
      id: string; // Role ID (e.g., UUID or predefined string)
      name: string; // Role name (e.g., MERCHANT_ADMIN_ROLE)
      permissions?: string[]; // Array of permission strings/keys associated with this role
      // Potentially description
    }
    
    (Covers REQ-IAM-001, REQ-IAM-002)

#### 4.3.3 Data Transfer Objects (DTOs)
All DTOs will use `class-validator` decorators for input validation and `@nestjs/swagger` (`@ApiProperty`, `@ApiPropertyOptional`) for OpenAPI documentation.

##### Request DTOs

-   **`src/modules/user-access/api/dtos/request/create-user.dto.ts`**
    -   `email: string` (`@IsEmail()`, `@IsNotEmpty()`)
    -   `corePlatformUserId: string` (`@IsNotEmpty()`, `@IsUUID()`)
    -   `merchantId?: string` (`@IsOptional()`, `@IsUUID()`)
    -   `roles?: string[]` (`@IsArray()`, `@IsString({ each: true })`, `@IsEnum(Object.values(RoleConstants), { each: true })`, `@IsOptional()`)
    (Covers REQ-IAM-003, REQ-IAM-005)

-   **`src/modules/user-access/api/dtos/request/update-user.dto.ts`**
    -   `email?: string` (`@IsEmail()`, `@IsOptional()`)
    -   `isActive?: boolean` (`@IsBoolean()`, `@IsOptional()`)
    -   `roles?: string[]` (`@IsArray()`, `@IsString({ each: true })`, `@IsEnum(Object.values(RoleConstants), { each: true })`, `@IsOptional()`)
    (Covers REQ-IAM-003, REQ-IAM-005)

-   **`src/modules/user-access/api/dtos/request/assign-role.dto.ts`**
    -   `roleName: string` (`@IsNotEmpty()`, `@IsString()`, `@IsEnum(Object.values(RoleConstants))`)
    (Covers REQ-IAM-002, REQ-IAM-003)

-   **`src/modules/user-access/api/dtos/request/login.dto.ts`** (For `AuthController`)
    -   `corePlatformToken: string` (`@IsNotEmpty()`, `@IsString()`) - This token is from the `[PlatformName]` core system.

-   **`src/modules/user-access/api/dtos/request/refresh-token.dto.ts`** (For `AuthController`)
    -   `refreshToken: string` (`@IsNotEmpty()`, `@IsString()`)

##### Response DTOs

-   **`src/modules/user-access/api/dtos/response/user.response.dto.ts`**
    -   `id: string`
    -   `email: string`
    -   `corePlatformUserId: string`
    -   `merchantId?: string | null`
    -   `roles: string[]`
    -   `isActive: boolean`
    (Covers REQ-IAM-001)

-   **`src/modules/user-access/api/dtos/response/role.response.dto.ts`**
    -   `id: string`
    -   `name: string`
    -   `permissions?: string[]`
    (Covers REQ-IAM-001, REQ-IAM-002)

-   **`src/modules/user-access/api/dtos/response/auth-token.response.dto.ts`**
    -   `accessToken: string`
    -   `refreshToken?: string`
    (Covers REQ-IAM-007)

### 4.4 Security Components (Guards, Decorators, Strategies)

#### 4.4.1 Guards

##### `src/modules/user-access/api/guards/jwt-auth.guard.ts`
-   **Purpose:** Enforces JWT authentication for protected routes.
-   **Logic:**
    -   Extends `AuthGuard('jwt')` from `@nestjs/passport`.
    -   If the `JwtStrategy` successfully validates the token from the request, `canActivate` returns `true`.
    -   If validation fails or no token is present, `AuthGuard` automatically throws an `UnauthorizedException`.
    (Covers REQ-IAM-007, REQ-IAM-006, REQ-CPSI-003)

##### `src/modules/user-access/api/guards/roles.guard.ts`
-   **Purpose:** Enforces RBAC by checking if the authenticated user has the required roles.
-   **Logic:**
    1.  Inject `Reflector` from `@nestjs/core`.
    2.  In `canActivate(context: ExecutionContext): boolean`:
        a.  Get required roles: `const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);`
        b.  If no roles are required, allow access: `if (!requiredRoles) { return true; }`
        c.  Get user from request: `const { user } = context.switchToHttp().getRequest<ExtendedRequest>();` (where `ExtendedRequest` is `Request & { user: IUser }`)
        d.  If no user (shouldn't happen if `JwtAuthGuard` is used first), deny access or throw error.
        e.  Check if user has any of the required roles: `return requiredRoles.some((role) => user.roles?.includes(role));`
        f.  If no matching role, throw `ForbiddenException`.
    (Covers REQ-IAM-002, REQ-IAM-003, REQ-IAM-004, REQ-IAM-005, REQ-IAM-008, REQ-IAM-010)

#### 4.4.2 Decorators

##### `src/modules/user-access/api/decorators/roles.decorator.ts`
-   **Purpose:** Custom decorator `@Roles(...roles: string[])` to attach role metadata to route handlers.
-   **Logic:**
    -   Uses `SetMetadata('roles', roles)` from `@nestjs/common`.
    (Covers REQ-IAM-002)

##### `src/modules/user-access/api/decorators/current-user.decorator.ts`
-   **Purpose:** Custom decorator `@CurrentUser()` to extract the authenticated user object.
-   **Logic:**
    -   Uses `createParamDecorator((data: unknown, ctx: ExecutionContext) => { const request = ctx.switchToHttp().getRequest(); return request.user; });`
    (Covers REQ-IAM-007)

#### 4.4.3 Strategies

##### `src/modules/user-access/api/strategies/jwt.strategy.ts`
-   **Purpose:** Passport JWT strategy for validating JWTs.
-   **Logic:**
    1.  Extends `PassportStrategy(Strategy, 'jwt')` from `passport-jwt`.
    2.  Inject `ConfigService`.
    3.  Constructor:
        a.  Call `super()` with options:
            i.  `jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()`
            ii. `ignoreExpiration: false`
            iii. `secretOrKey: configService.get<string>('JWT_SECRET')` (Ensure this env var is set)
    4.  `async validate(payload: any): Promise<IUser>`:
        a.  The `payload` is the decoded JWT.
        b.  Extract user identifiers (e.g., `userId`, `corePlatformUserId`, `roles`) from the payload.
        c.  Optionally, fetch fresh user data from `UserAccessService` based on `payload.sub` (user ID) to ensure up-to-date roles/status, though often the payload itself is trusted for its lifetime. For simplicity, returning essential parts from payload is common.
        d.  Return an object matching `IUser` (or a subset if full `IUser` isn't in JWT). Example: `{ id: payload.sub, email: payload.email, roles: payload.roles, corePlatformUserId: payload.corePlatformUserId, merchantId: payload.merchantId }`.
        e.  If validation fails (e.g., user not found if fetching fresh), throw `UnauthorizedException`.
    (Covers REQ-IAM-007)

### 4.5 Service Layer

#### 4.5.1 `src/modules/user-access/api/services/user-access.service.ts`
-   **Purpose:** Contains core business logic for user management, role management, permission enforcement, and authentication/authorization orchestration.
-   **Dependencies (Injected):**
    -   `JwtService` (from `@nestjs/jwt`)
    -   `ConfigService` (from `@nestjs/config`)
    -   (Conceptually) A data access service/repository for Ad Manager users and roles (not detailed here, assume methods like `this.userRepository.create()`, `this.roleRepository.find()`).
    -   (Conceptually) A client/service for interacting with `[PlatformName]` core authentication (`CorePlatformAuthService`).
-   **Key Methods and Logic:**

    -   **`async validateUserWithCorePlatform(corePlatformToken: string): Promise<IUser | null>`** (REQ-IAM-006, REQ-CPSI-003)
        -   Logic:
            1.  Call `[PlatformName]` core auth API/service to validate `corePlatformToken` and get core user details (e.g., core user ID, email).
            2.  If valid, search for an existing Ad Manager user by `corePlatformUserId`.
            3.  If user exists, return the `IUser` object.
            4.  If user doesn't exist, potentially create a basic Ad Manager user record (e.g., with default roles or no roles, status pending activation by admin if needed) and return the new `IUser` object. This depends on the onboarding flow. For a simple login, it might just return the core user details mapped to `IUser` structure for token generation.
            5.  If core token is invalid, return `null` or throw `UnauthorizedException`.
        -   *Note: This method's implementation details heavily depend on how the `[PlatformName]` core auth integration is designed.*

    -   **`async generateAdManagerTokens(user: Pick<IUser, 'id' | 'roles' | 'email' | 'corePlatformUserId' | 'merchantId'>): Promise<AuthTokenResponseDto>`** (REQ-IAM-007)
        -   Logic:
            1.  Create JWT payload: `{ sub: user.id, email: user.email, roles: user.roles, corePlatformUserId: user.corePlatformUserId, merchantId: user.merchantId }`.
            2.  Generate access token: `accessToken = this.jwtService.sign(payload);`
            3.  Generate refresh token (if applicable, with longer expiry and different payload/storage strategy):
                `refreshToken = this.jwtService.sign({ sub: user.id }, { secret: configService.get('JWT_REFRESH_SECRET'), expiresIn: configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN') });`
            4.  Return `{ accessToken, refreshToken }`.

    -   **`async refreshToken(refreshToken: string): Promise<AuthTokenResponseDto>`** (REQ-IAM-007)
        -   Logic:
            1.  Verify `refreshToken` using `jwtService.verifyAsync` with refresh token secret.
            2.  If valid, extract user ID (`payload.sub`).
            3.  Fetch the user from the database.
            4.  If user exists and is active, generate new access/refresh tokens using `generateAdManagerTokens`.
            5.  Invalidate the old refresh token if using a one-time use refresh token strategy.
            6.  Return new tokens.

    -   **`async createUser(createUserDto: CreateUserDto, requestingUser: IUser): Promise<IUser>`** (REQ-IAM-003, REQ-IAM-005)
        -   Logic:
            1.  Authorization: Check if `requestingUser` has permission (e.g., `PLATFORM_ADMIN_ROLE` or `MERCHANT_ADMIN_ROLE` for their own merchant).
            2.  If `MERCHANT_ADMIN_ROLE`, ensure `createUserDto.merchantId` matches `requestingUser.merchantId`.
            3.  Validate `corePlatformUserId` doesn't already exist in Ad Manager.
            4.  Validate `email` doesn't already exist for this context (if unique).
            5.  Hash password if storing locally (unlikely, as auth is federated).
            6.  Persist new user data.
            7.  Assign roles from `createUserDto.roles` if provided and valid.
            8.  Return the created `IUser`.

    -   **`async findUserById(userId: string, requestingUser: IUser): Promise<IUser | null>`** (REQ-IAM-003, REQ-IAM-004, REQ-IAM-005)
        -   Logic:
            1.  Fetch user by `userId`.
            2.  Authorization:
                -   If `requestingUser` is `PLATFORM_ADMIN_ROLE`, allow.
                -   If `requestingUser` is `MERCHANT_ADMIN_ROLE` or `CAMPAIGN_MANAGER_ROLE`, ensure fetched user's `merchantId` matches `requestingUser.merchantId`.
                -   If `requestingUser.id` is `userId` (self-lookup), allow.
            3.  If not authorized or not found, return `null` or throw `NotFoundException`/`ForbiddenException`.
            4.  Return `IUser`.

    -   **`async findUsersByMerchant(merchantId: string, requestingUser: IUser): Promise<IUser[]>`** (REQ-IAM-003, REQ-IAM-004)
        -   Logic:
            1.  Authorization: Ensure `requestingUser` is `PLATFORM_ADMIN_ROLE` or is a `MERCHANT_ADMIN_ROLE`/`CAMPAIGN_MANAGER_ROLE` for the given `merchantId`.
            2.  Fetch all users belonging to `merchantId`.
            3.  Return `IUser[]`.

    -   **`async updateUser(userId: string, updateUserDto: UpdateUserDto, requestingUser: IUser): Promise<IUser>`** (REQ-IAM-003, REQ-IAM-005)
        -   Logic:
            1.  Fetch user to update.
            2.  Authorization: Similar to `findUserById` for who can update whom. `PLATFORM_ADMIN_ROLE` can update more fields than `MERCHANT_ADMIN_ROLE`.
            3.  If `updateUserDto.roles` is present, validate and update roles (potentially separate method `assignRolesToUser`).
            4.  Update other allowed fields.
            5.  Persist changes.
            6.  Return updated `IUser`.

    -   **`async assignRoleToUser(userId: string, roleName: string, requestingUser: IUser): Promise<IUser>`** (REQ-IAM-002, REQ-IAM-003)
        -   Logic:
            1.  Fetch user.
            2.  Validate `roleName` exists and is assignable by `requestingUser`.
            3.  Authorization check.
            4.  Add `roleName` to user's roles list (ensure no duplicates).
            5.  Persist.
            6.  Return updated `IUser`.

    -   **`async getRoles(): Promise<IRole[]>`** (REQ-IAM-001, REQ-IAM-002)
        -   Logic:
            1.  Fetch all defined Ad Manager roles (e.g., from a static list, config, or database if dynamic).
            2.  Include associated permissions if defined.
            3.  Return `IRole[]`.

    -   **`async getRoleByName(roleName: string): Promise<IRole | null>`** (REQ-IAM-001, REQ-IAM-002)
        -   Logic:
            1.  Fetch specific role by its name.
            2.  Return `IRole` or `null`.

    -   **`async checkUserPermissionForMerchant(userId: string, merchantId: string, requiredRole: string): Promise<boolean>`** (REQ-IAM-008)
        -   Logic: (Used internally or by other services)
            1.  Fetch user by `userId`.
            2.  Check if user's `merchantId` matches the provided `merchantId`.
            3.  Check if user's roles include `requiredRole`.
            4.  Return `true` if all conditions met, else `false`.

    -   **Platform Admin specific methods (e.g., `platformAdminListAllUsers`, `platformAdminCreateUser`, `platformAdminUpdateUserRoles`)** (REQ-IAM-005)
        -   These methods will have similar logic to their merchant-scoped counterparts but will bypass merchant-scoping restrictions.
        -   Crucially, all actions by Platform Admins must be thoroughly audited.
        -   Access to sensitive merchant data (beyond user management identifiers) should be strictly limited and logged as per REQ-IAM-010.

### 4.6 Controller Layer
All controllers will be under the base path `/api/v1/user-access` (or similar, defined by `UserAccessModule` path or global prefix). They will use `@ApiTags` for Swagger grouping.

#### 4.6.1 `src/modules/user-access/api/controllers/auth.controller.ts`
-   **Purpose:** Handles authentication flows.
-   **Base Path:** `/auth`
-   **Endpoints:**
    -   **`POST /login`**: (`@ApiOperation({ summary: 'Login user and get Ad Manager tokens' })`, `@ApiResponse({ status: 201, type: AuthTokenResponseDto })`)
        -   Request Body: `LoginDto` (containing `corePlatformToken`)
        -   Logic:
            1.  Call `userAccessService.validateUserWithCorePlatform(loginDto.corePlatformToken)`.
            2.  If user valid, call `userAccessService.generateAdManagerTokens(user)`.
            3.  Return `AuthTokenResponseDto`.
            4.  Handles REQ-IAM-006, REQ-CPSI-003, REQ-IAM-007.
    -   **`POST /refresh`**: (`@ApiOperation({ summary: 'Refresh Ad Manager access token' })`, `@ApiResponse({ status: 201, type: AuthTokenResponseDto })`)
        -   Request Body: `RefreshTokenDto`
        -   Logic:
            1.  Call `userAccessService.refreshToken(refreshTokenDto.refreshToken)`.
            2.  Return `AuthTokenResponseDto`.
            3.  Handles REQ-IAM-007.
    -   **`GET /me`**: (`@UseGuards(JwtAuthGuard)`, `@ApiOperation({ summary: 'Get current authenticated user profile' })`, `@ApiResponse({ status: 200, type: UserResponseDto })`)
        -   Uses `@CurrentUser() user: IUser` decorator.
        -   Logic: Return `user` (transformed to `UserResponseDto`).
        -   Handles REQ-IAM-007.

#### 4.6.2 `src/modules/user-access/api/controllers/users.controller.ts`
-   **Purpose:** Manages users within a merchant's scope. Primarily for Merchant Admins.
-   **Base Path:** `/users`
-   **Common Decorators:** `@UseGuards(JwtAuthGuard, RolesGuard)`
-   **Endpoints:**
    -   **`POST /`**: (`@Roles(MERCHANT_ADMIN_ROLE)`, `@ApiOperation({ summary: 'Create a new user for the current merchant' })`, `@ApiResponse({ status: 201, type: UserResponseDto })`)
        -   Request Body: `CreateUserDto` (service will ensure `merchantId` matches current user's).
        -   Logic: Call `userAccessService.createUser(createUserDto, requestingUser)`.
        -   Handles REQ-IAM-003.
    -   **`GET /`**: (`@Roles(MERCHANT_ADMIN_ROLE, CAMPAIGN_MANAGER_ROLE)`, `@ApiOperation({ summary: 'Get all users for the current merchant' })`, `@ApiResponse({ status: 200, type: [UserResponseDto] })`)
        -   Logic: Call `userAccessService.findUsersByMerchant(requestingUser.merchantId, requestingUser)`.
        -   Handles REQ-IAM-003, REQ-IAM-004.
    -   **`GET /:userId`**: (`@Roles(MERCHANT_ADMIN_ROLE, CAMPAIGN_MANAGER_ROLE)`, `@ApiOperation({ summary: 'Get a specific user by ID within the current merchant' })`, `@ApiResponse({ status: 200, type: UserResponseDto })`)
        -   Logic: Call `userAccessService.findUserById(userId, requestingUser)` (service enforces merchant scope).
        -   Handles REQ-IAM-003, REQ-IAM-004.
    -   **`PUT /:userId`**: (`@Roles(MERCHANT_ADMIN_ROLE)`, `@ApiOperation({ summary: 'Update a user by ID within the current merchant' })`, `@ApiResponse({ status: 200, type: UserResponseDto })`)
        -   Request Body: `UpdateUserDto`.
        -   Logic: Call `userAccessService.updateUser(userId, updateUserDto, requestingUser)` (service enforces scope).
        -   Handles REQ-IAM-003.
    -   **`POST /:userId/roles`**: (`@Roles(MERCHANT_ADMIN_ROLE)`, `@ApiOperation({ summary: 'Assign a role to a user within the current merchant' })`, `@ApiResponse({ status: 200, type: UserResponseDto })`)
        -   Request Body: `AssignRoleDto`.
        -   Logic: Call `userAccessService.assignRoleToUser(userId, assignRoleDto.roleName, requestingUser)` (service enforces scope).
        -   Handles REQ-IAM-002, REQ-IAM-003.

#### 4.6.3 `src/modules/user-access/api/controllers/roles.controller.ts`
-   **Purpose:** Provides information about available roles.
-   **Base Path:** `/roles`
-   **Common Decorators:** `@UseGuards(JwtAuthGuard)` (Accessible to all authenticated users)
-   **Endpoints:**
    -   **`GET /`**: (`@ApiOperation({ summary: 'Get all available Ad Manager roles' })`, `@ApiResponse({ status: 200, type: [RoleResponseDto] })`)
        -   Logic: Call `userAccessService.getRoles()`.
        -   Handles REQ-IAM-001, REQ-IAM-002.
    -   **`GET /:name`**: (`@ApiOperation({ summary: 'Get a specific role by name' })`, `@ApiResponse({ status: 200, type: RoleResponseDto })`)
        -   Logic: Call `userAccessService.getRoleByName(roleName)`.
        -   Handles REQ-IAM-001, REQ-IAM-002.

#### 4.6.4 `src/modules/user-access/api/controllers/platform-admin.users.controller.ts`
-   **Purpose:** Platform Administrator specific user management tasks.
-   **Base Path:** `/platform-admin/users`
-   **Common Decorators:** `@UseGuards(JwtAuthGuard, RolesGuard)`, `@Roles(PLATFORM_ADMIN_ROLE)`
-   **Endpoints:**
    -   **`GET /merchant/:merchantId`**: (`@ApiOperation({ summary: 'Get all users for a specific merchant (Platform Admin only)' })`, `@ApiResponse({ status: 200, type: [UserResponseDto] })`)
        -   Logic: Call `userAccessService.findUsersByMerchant(merchantId, adminUser)`.
        -   Handles REQ-IAM-005.
    -   **`GET /:userId`**: (`@ApiOperation({ summary: 'Get any user by ID (Platform Admin only)' })`, `@ApiResponse({ status: 200, type: UserResponseDto })`)
        -   Logic: Call `userAccessService.findUserById(userId, adminUser)` (service logic for admin bypasses merchant scope if needed for this method).
        -   Handles REQ-IAM-005.
    -   **`PUT /:userId`**: (`@ApiOperation({ summary: 'Update any user by ID (Platform Admin only)' })`, `@ApiResponse({ status: 200, type: UserResponseDto })`)
        -   Request Body: `UpdateUserDto` (potentially a more extensive `PlatformAdminUpdateUserDto`).
        -   Logic: Call `userAccessService.platformAdminUpdateUser(userId, updateUserDto, adminUser)`.
        -   Handles REQ-IAM-005.
    -   **`POST /`**: (`@ApiOperation({ summary: 'Create a new user (Platform Admin only - for special cases)' })`, `@ApiResponse({ status: 201, type: UserResponseDto })`)
        -   Request Body: `CreateUserDto`.
        -   Logic: Call `userAccessService.createUser(createUserDto, adminUser)` (service logic handles admin creation context).
        -   Handles REQ-IAM-005.
    -   *Other platform admin specific endpoints as needed, e.g., list all users, manage platform admin roles.*

## 5. Error Handling
-   Standard NestJS HTTP exceptions will be used (e.g., `BadRequestException`, `UnauthorizedException`, `ForbiddenException`, `NotFoundException`, `InternalServerErrorException`).
-   `ValidationPipe` will automatically throw `BadRequestException` for DTO validation failures.
-   Service layer will throw appropriate exceptions based on business logic failures.
-   A global exception filter might be considered for consistent error response formatting if default behavior is not sufficient.

## 6. Security Considerations
-   **Authentication:** JWT-based, integrated with `[PlatformName]` core auth (REQ-IAM-006, REQ-IAM-007, REQ-CPSI-003). Access tokens are short-lived. Refresh token mechanism for renewing access tokens. Secure storage of JWT secret.
-   **Authorization:** RBAC enforced by `RolesGuard` and service-level checks (REQ-IAM-002, REQ-IAM-008). Principle of least privilege.
-   **Input Validation:** DTOs with `class-validator` to prevent common injection vulnerabilities.
-   **Data Security:** Adherence to PII handling and data classification policies (REQ-IAM-010). Sensitive data in transit (HTTPS) and at rest (database encryption - managed by persistence layer).
-   **Rate Limiting:** To be implemented at the API Gateway level.
-   **Audit Logging:** Critical actions (especially by Platform Admins) should be logged (responsibility of `UserAccessService` to emit audit events or call an audit service).
-   **Dependencies:** Secure use of third-party libraries. Regular updates.

## 7. Data Models (API Perspective)
The data models from the API perspective are defined by the Interfaces (`IUser`, `IRole`) and Response DTOs (`UserResponseDto`, `RoleResponseDto`, `AuthTokenResponseDto`). The underlying persistence model is abstracted by the `UserAccessService`.

## 8. API Endpoint Summary

| Verb  | Path                                    | Controller                     | Method                 | Roles Allowed                               | Description                                        | Requirements Covered                                                                     |
| :---- | :-------------------------------------- | :----------------------------- | :--------------------- | :------------------------------------------ | :------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| POST  | `/auth/login`                           | `AuthController`               | `login`                | Public (relies on core platform auth)       | Login/Exchange core token for Ad Manager tokens    | REQ-IAM-006, REQ-CPSI-003, REQ-IAM-007                                                   |
| POST  | `/auth/refresh`                         | `AuthController`               | `refreshToken`         | Public (requires valid refresh token)       | Refresh Ad Manager access token                    | REQ-IAM-007                                                                              |
| GET   | `/auth/me`                              | `AuthController`               | `getProfile`           | Authenticated User                          | Get current authenticated user profile             | REQ-IAM-007                                                                              |
| POST  | `/users`                                | `UsersController`              | `createUser`           | `MERCHANT_ADMIN_ROLE`                       | Create user for current merchant                   | REQ-IAM-003                                                                              |
| GET   | `/users`                                | `UsersController`              | `getUsersForMerchant`  | `MERCHANT_ADMIN_ROLE`, `CAMPAIGN_MANAGER_ROLE`| Get users for current merchant                     | REQ-IAM-003, REQ-IAM-004                                                                 |
| GET   | `/users/:userId`                        | `UsersController`              | `getUserById`          | `MERCHANT_ADMIN_ROLE`, `CAMPAIGN_MANAGER_ROLE`| Get specific user in current merchant              | REQ-IAM-003, REQ-IAM-004                                                                 |
| PUT   | `/users/:userId`                        | `UsersController`              | `updateUser`           | `MERCHANT_ADMIN_ROLE`                       | Update user in current merchant                    | REQ-IAM-003                                                                              |
| POST  | `/users/:userId/roles`                  | `UsersController`              | `assignRole`           | `MERCHANT_ADMIN_ROLE`                       | Assign role to user in current merchant            | REQ-IAM-002, REQ-IAM-003                                                                 |
| GET   | `/roles`                                | `RolesController`              | `getAllRoles`          | Authenticated User                          | Get all Ad Manager roles                           | REQ-IAM-001, REQ-IAM-002                                                                 |
| GET   | `/roles/:name`                          | `RolesController`              | `getRoleByName`        | Authenticated User                          | Get role by name                                   | REQ-IAM-001, REQ-IAM-002                                                                 |
| GET   | `/platform-admin/users/merchant/:merchantId` | `PlatformAdminUsersController` | `getMerchantUsers`     | `PLATFORM_ADMIN_ROLE`                       | Get users for a specific merchant (Admin)          | REQ-IAM-005                                                                              |
| GET   | `/platform-admin/users/:userId`         | `PlatformAdminUsersController` | `getAnyUserById`       | `PLATFORM_ADMIN_ROLE`                       | Get any user by ID (Admin)                         | REQ-IAM-005                                                                              |
| PUT   | `/platform-admin/users/:userId`         | `PlatformAdminUsersController` | `platformUpdateUser`   | `PLATFORM_ADMIN_ROLE`                       | Update any user by ID (Admin)                      | REQ-IAM-005                                                                              |
| POST  | `/platform-admin/users`                 | `PlatformAdminUsersController` | `platformCreateUser`   | `PLATFORM_ADMIN_ROLE`                       | Create user (Admin - special cases)              | REQ-IAM-005                                                                              |

*(Note: `platformCreateUser` is a simplification, actual creation might be more nuanced for platform admins)*

This SDS provides the necessary detail to proceed with the development of the `UserAccessManagement.ApiEndpoints` repository.