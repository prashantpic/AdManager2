# Specification

# 1. Files

- **Path:** src/modules/app-store-integration/api/package.json  
**Description:** Defines project dependencies, scripts, and metadata for the App Store Integration API module. Includes libraries like @nestjs/core, @nestjs/platform-express, @nestjs/config, @nestjs/jwt, @nestjs/passport, passport, passport-oauth2, @nestjs/swagger, @nestjs/graphql, graphql, apollo-server-express, class-validator, class-transformer.  
**Template:** NestJS Module Package JSON  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ./  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Management
    - Project Scripts
    
**Requirement Ids:**
    
    - REQ-TCE-008
    
**Purpose:** Manages Node.js project dependencies and scripts for the App Store Integration API.  
**Logic Description:** Standard package.json file for a NestJS project. List all necessary production and development dependencies for API functionality, authentication, GraphQL, Swagger, etc. Define scripts for build, start, lint, test.  
**Documentation:**
    
    - **Summary:** Node.js project manifest file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/app-store-integration/api/tsconfig.json  
**Description:** TypeScript compiler options for the App Store Integration API module.  
**Template:** NestJS TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ./  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript Compilation
    
**Requirement Ids:**
    
    - REQ-TCE-008
    
**Purpose:** Configures the TypeScript compiler for the project.  
**Logic Description:** Standard tsconfig.json for a NestJS project. Includes settings for target ECMAScript version, module system, decorators, source maps, output directory, and base URL.  
**Documentation:**
    
    - **Summary:** TypeScript compiler configuration file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/app-store-integration/api/nest-cli.json  
**Description:** NestJS CLI configuration file for the App Store Integration API module, specifying project structure and generation options.  
**Template:** NestJS CLI Configuration  
**Dependancy Level:** 0  
**Name:** nest-cli  
**Type:** Configuration  
**Relative Path:** ./  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - NestJS Project Configuration
    
**Requirement Ids:**
    
    - REQ-TCE-008
    
**Purpose:** Stores configuration for the NestJS command-line interface.  
**Logic Description:** Specifies collection type (e.g., @nestjs/schematics), source root, and other CLI-related project settings.  
**Documentation:**
    
    - **Summary:** NestJS CLI project configuration.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/app-store-integration/api/src/main.ts  
**Description:** Main entry point for the App Store Integration API NestJS application. Initializes and bootstraps the application.  
**Template:** NestJS Application Bootstrap  
**Dependancy Level:** 4  
**Name:** main  
**Type:** Bootstrap  
**Relative Path:** src/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** bootstrap  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** async  
    
**Implemented Features:**
    
    - Application Initialization
    - Swagger Setup
    - GraphQL Setup
    
**Requirement Ids:**
    
    - REQ-TCE-007
    - REQ-TCE-008
    
**Purpose:** Initializes and starts the NestJS application for the App Store Integration API.  
**Logic Description:** Create a NestJS application instance using AppModule. Configure global pipes (e.g., ValidationPipe), global filters (e.g., HttpExceptionFilter). Setup Swagger documentation if enabled. Setup GraphQL endpoint if enabled. Listen on a configured port.  
**Documentation:**
    
    - **Summary:** Application bootstrap file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/app-store-integration/api/src/app.module.ts  
**Description:** Root module for the App Store Integration API application. Imports feature modules, configuration modules, and global providers.  
**Template:** NestJS Root Module  
**Dependancy Level:** 3  
**Name:** AppModule  
**Type:** Module  
**Relative Path:** src/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module Aggregation
    
**Requirement Ids:**
    
    - REQ-TCE-007
    - REQ-TCE-008
    
**Purpose:** Serves as the root module, organizing and importing all other necessary modules for the API.  
**Logic Description:** Import NestJS ConfigModule for environment variable management. Import the main AppStoreIntegrationV1Module. Configure GraphQLModule if GraphQL is used. Potentially import other global modules like ThrottlerModule for rate limiting.  
**Documentation:**
    
    - **Summary:** Root NestJS module.
    
**Namespace:** AdManager.AppStoreIntegration.Api  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/app-store-integration/api/src/v1/common/enums/webhook-event-type.enum.ts  
**Description:** Defines an enumeration for various webhook event types that third-party applications can subscribe to.  
**Template:** TypeScript Enum  
**Dependancy Level:** 0  
**Name:** WebhookEventType  
**Type:** Enum  
**Relative Path:** src/v1/common/enums/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** CAMPAIGN_CREATED  
**Type:** string  
**Attributes:**   
    - **Name:** PRODUCT_UPDATED  
**Type:** string  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - Webhook Event Typing
    
**Requirement Ids:**
    
    - REQ-TCE-008.3
    
**Purpose:** Provides standardized types for webhook events.  
**Logic Description:** Define various event types as string enum members, e.g., CAMPAIGN_CREATED, CAMPAIGN_UPDATED, MERCHANT_DATA_ACCESS_GRANTED, etc. These will be used for webhook subscriptions and event payloads.  
**Documentation:**
    
    - **Summary:** Enumeration of supported webhook event types.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Common.Enums  
**Metadata:**
    
    - **Category:** Common
    
- **Path:** src/modules/app-store-integration/api/src/v1/common/interfaces/api-version-policy.interface.ts  
**Description:** Interface defining the structure for API versioning and lifecycle policy information.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** ApiVersionPolicy  
**Type:** Interface  
**Relative Path:** src/v1/common/interfaces/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** version  
**Type:** string  
**Attributes:** readonly  
    - **Name:** status  
**Type:** string  
**Attributes:** readonly  
    - **Name:** deprecationDate  
**Type:** Date | null  
**Attributes:** readonly  
    - **Name:** sunsetDate  
**Type:** Date | null  
**Attributes:** readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - API Versioning Policy Definition
    
**Requirement Ids:**
    
    - REQ-TCE-008.4
    
**Purpose:** Defines the contract for API versioning information.  
**Logic Description:** Specifies fields like current version, status (e.g., active, deprecated), planned deprecation date, and sunset date for an API version.  
**Documentation:**
    
    - **Summary:** Interface for API version and lifecycle policy details.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Common.Interfaces  
**Metadata:**
    
    - **Category:** Common
    
- **Path:** src/modules/app-store-integration/api/src/v1/config/configuration.ts  
**Description:** Loads and provides access to application configuration, typically from environment variables.  
**Template:** NestJS Config Function  
**Dependancy Level:** 1  
**Name:** configuration  
**Type:** Configuration  
**Relative Path:** src/v1/config/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** default  
**Parameters:**
    
    
**Return Type:** Record<string, any>  
**Attributes:** export  
    
**Implemented Features:**
    
    - Configuration Loading
    
**Requirement Ids:**
    
    - REQ-TCE-008
    
**Purpose:** Centralizes application configuration loading.  
**Logic Description:** Reads environment variables for database connections, API keys, OAuth settings, App Store URLs, port numbers, etc. Returns a configuration object. Use Joi or class-validator for schema validation.  
**Documentation:**
    
    - **Summary:** Configuration loader function for NestJS ConfigModule.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/app-store-integration/api/src/v1/auth/dto/token-request.dto.ts  
**Description:** Data Transfer Object for OAuth 2.0 token requests.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** TokenRequestDto  
**Type:** DTO  
**Relative Path:** src/v1/auth/dto/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** grant_type  
**Type:** string  
**Attributes:**   
    - **Name:** code  
**Type:** string  
**Attributes:** optional  
    - **Name:** redirect_uri  
**Type:** string  
**Attributes:** optional  
    - **Name:** client_id  
**Type:** string  
**Attributes:**   
    - **Name:** client_secret  
**Type:** string  
**Attributes:** optional  
    - **Name:** refresh_token  
**Type:** string  
**Attributes:** optional  
    - **Name:** code_verifier  
**Type:** string  
**Attributes:** optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - OAuth Token Request Data Contract
    
**Requirement Ids:**
    
    - REQ-TCE-008.2
    
**Purpose:** Defines the expected structure for requests to the OAuth token endpoint.  
**Logic Description:** Includes fields like grant_type, code (for authorization_code grant), redirect_uri, client_id, client_secret (for confidential clients), refresh_token, code_verifier (for PKCE). Use class-validator decorators for validation.  
**Documentation:**
    
    - **Summary:** DTO for OAuth 2.0 token requests.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Auth.Dto  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/app-store-integration/api/src/v1/auth/dto/token-response.dto.ts  
**Description:** Data Transfer Object for OAuth 2.0 token responses.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** TokenResponseDto  
**Type:** DTO  
**Relative Path:** src/v1/auth/dto/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** access_token  
**Type:** string  
**Attributes:**   
    - **Name:** token_type  
**Type:** string  
**Attributes:**   
    - **Name:** expires_in  
**Type:** number  
**Attributes:**   
    - **Name:** refresh_token  
**Type:** string  
**Attributes:** optional  
    - **Name:** scope  
**Type:** string  
**Attributes:** optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - OAuth Token Response Data Contract
    
**Requirement Ids:**
    
    - REQ-TCE-008.2
    
**Purpose:** Defines the structure of responses from the OAuth token endpoint.  
**Logic Description:** Includes fields like access_token, token_type (e.g., Bearer), expires_in, refresh_token (if applicable), and scope.  
**Documentation:**
    
    - **Summary:** DTO for OAuth 2.0 token responses.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Auth.Dto  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/app-store-integration/api/src/v1/auth/strategies/oauth2.strategy.ts  
**Description:** Implements the core OAuth 2.0 server-side strategy using Passport. Handles client authentication and authorization code/token issuance logic.  
**Template:** NestJS Passport Strategy  
**Dependancy Level:** 2  
**Name:** OAuth2Strategy  
**Type:** Strategy  
**Relative Path:** src/v1/auth/strategies/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    - StrategyPattern
    
**Members:**
    
    - **Name:** oauthClientService  
**Type:** OAuthClientService  
**Attributes:** private|readonly  
    - **Name:** oauthTokenService  
**Type:** OAuthTokenService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - oauthClientService: OAuthClientService
    - oauthTokenService: OAuthTokenService
    - configService: ConfigService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** validateClient  
**Parameters:**
    
    - clientId: string
    - clientSecret: string | undefined
    
**Return Type:** Promise<RegisteredApp | null>  
**Attributes:** protected|async  
    - **Name:** issueAuthorizationCode  
**Parameters:**
    
    - client: RegisteredApp
    - user: AuthenticatedUser
    - redirectURI: string
    - scopes: string[]
    - codeChallenge: string | undefined
    - codeChallengeMethod: string | undefined
    
**Return Type:** Promise<string>  
**Attributes:** protected|async  
    - **Name:** exchangeCodeForToken  
**Parameters:**
    
    - client: RegisteredApp
    - code: string
    - redirectURI: string
    - codeVerifier: string | undefined
    
**Return Type:** Promise<TokenResponseDto>  
**Attributes:** protected|async  
    - **Name:** exchangeRefreshTokenForToken  
**Parameters:**
    
    - client: RegisteredApp
    - refreshToken: string
    
**Return Type:** Promise<TokenResponseDto>  
**Attributes:** protected|async  
    
**Implemented Features:**
    
    - OAuth 2.0 Authorization Code Grant
    - OAuth 2.0 Refresh Token Grant
    - PKCE Support
    - Client Authentication
    
**Requirement Ids:**
    
    - REQ-TCE-008.2
    
**Purpose:** Provides the server-side logic for the OAuth 2.0 authorization framework.  
**Logic Description:** Extends a base OAuth2 server strategy (e.g., from passport-oauth2-server or a custom implementation). Implements methods for validating client credentials, issuing authorization codes, exchanging codes for tokens, handling refresh tokens, and supporting PKCE. Interacts with services to manage client details and token persistence.  
**Documentation:**
    
    - **Summary:** Core OAuth 2.0 server strategy implementation.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Auth.Strategies  
**Metadata:**
    
    - **Category:** Authentication
    
- **Path:** src/modules/app-store-integration/api/src/v1/auth/guards/jwt-auth.guard.ts  
**Description:** A NestJS guard that protects routes by verifying JWT access tokens. Uses the JwtStrategy.  
**Template:** NestJS Auth Guard  
**Dependancy Level:** 2  
**Name:** JwtAuthGuard  
**Type:** Guard  
**Relative Path:** src/v1/auth/guards/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - JWT-based Route Protection
    
**Requirement Ids:**
    
    - REQ-TCE-008.2
    
**Purpose:** Ensures that only authenticated requests with valid JWTs can access protected API resources.  
**Logic Description:** Extends NestJS AuthGuard('jwt'). Relies on a configured JwtStrategy to validate the token found in the request (typically in the Authorization header).  
**Documentation:**
    
    - **Summary:** Guard for JWT authentication on API endpoints.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Auth.Guards  
**Metadata:**
    
    - **Category:** Authentication
    
- **Path:** src/modules/app-store-integration/api/src/v1/auth/controllers/oauth.controller.ts  
**Description:** Controller for handling OAuth 2.0 authorization and token endpoints.  
**Template:** NestJS Controller  
**Dependancy Level:** 3  
**Name:** OAuthController  
**Type:** Controller  
**Relative Path:** src/v1/auth/controllers/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** oauthService  
**Type:** OAuthService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** authorize  
**Parameters:**
    
    - @Query() query: AuthorizeQueryDto
    - @Req() req
    - @Res() res
    
**Return Type:** Promise<void>  
**Attributes:** public|async  
    - **Name:** token  
**Parameters:**
    
    - @Body() body: TokenRequestDto
    - @Req() req
    
**Return Type:** Promise<TokenResponseDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - OAuth 2.0 Authorization Endpoint
    - OAuth 2.0 Token Endpoint
    
**Requirement Ids:**
    
    - REQ-TCE-008.2
    
**Purpose:** Exposes the standard OAuth 2.0 /authorize and /token endpoints.  
**Logic Description:** The /authorize endpoint handles user authentication (may redirect to a login page if user not authenticated) and consent, then issues an authorization code. The /token endpoint exchanges authorization codes or refresh tokens for access tokens. Uses the OAuthService (or OAuth2Strategy directly) for core logic.  
**Documentation:**
    
    - **Summary:** Controller for OAuth 2.0 protocol endpoints.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Auth.Controllers  
**Metadata:**
    
    - **Category:** APIEndpoints
    
- **Path:** src/modules/app-store-integration/api/src/v1/auth/auth.module.ts  
**Description:** NestJS module for authentication and authorization features, including OAuth 2.0.  
**Template:** NestJS Module  
**Dependancy Level:** 3  
**Name:** AuthModule  
**Type:** Module  
**Relative Path:** src/v1/auth/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Authentication Service Registration
    - OAuth Strategy Registration
    
**Requirement Ids:**
    
    - REQ-TCE-008.2
    
**Purpose:** Encapsulates all OAuth 2.0 and general authentication functionalities for third-party app integration.  
**Logic Description:** Imports PassportModule, JwtModule (configured with secrets and expiration). Provides OAuthController, OAuthService, OAuth2Strategy, JwtStrategy, and related services. Exports services/guards if needed by other modules.  
**Documentation:**
    
    - **Summary:** Module for handling authentication and OAuth 2.0 logic.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Auth  
**Metadata:**
    
    - **Category:** Module
    
- **Path:** src/modules/app-store-integration/api/src/v1/registry/dto/register-app.dto.ts  
**Description:** Data Transfer Object for registering a new third-party application.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** RegisterAppDto  
**Type:** DTO  
**Relative Path:** src/v1/registry/dto/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** appName  
**Type:** string  
**Attributes:**   
    - **Name:** redirectUris  
**Type:** string[]  
**Attributes:**   
    - **Name:** scopes  
**Type:** string[]  
**Attributes:**   
    - **Name:** developerEmail  
**Type:** string  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - App Registration Data Contract
    
**Requirement Ids:**
    
    - REQ-TCE-007
    - REQ-TCE-008
    
**Purpose:** Defines the payload for registering a new third-party application.  
**Logic Description:** Contains fields necessary for app registration like application name, redirect URIs for OAuth, requested scopes, developer contact information. Use class-validator for input validation.  
**Documentation:**
    
    - **Summary:** DTO for registering a new third-party application.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Registry.Dto  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/app-store-integration/api/src/v1/registry/services/app-registry.service.ts  
**Description:** Service responsible for managing the registration and lifecycle of third-party applications.  
**Template:** NestJS Service  
**Dependancy Level:** 2  
**Name:** AppRegistryService  
**Type:** Service  
**Relative Path:** src/v1/registry/services/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** thirdPartyConnectivityService  
**Type:** ThirdPartyConnectivityService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** registerNewApp  
**Parameters:**
    
    - registerAppDto: RegisterAppDto
    - developerId: string
    
**Return Type:** Promise<AppResponseDto>  
**Attributes:** public|async  
    - **Name:** getAppDetails  
**Parameters:**
    
    - appId: string
    
**Return Type:** Promise<AppResponseDto | null>  
**Attributes:** public|async  
    - **Name:** updateAppDetails  
**Parameters:**
    
    - appId: string
    - updateAppDto: UpdateAppDto
    
**Return Type:** Promise<AppResponseDto>  
**Attributes:** public|async  
    - **Name:** listDeveloperApps  
**Parameters:**
    
    - developerId: string
    
**Return Type:** Promise<AppResponseDto[]>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Third-Party App Registration
    - App Lifecycle Management
    
**Requirement Ids:**
    
    - REQ-TCE-007
    - REQ-TCE-008
    
**Purpose:** Handles the business logic for registering, retrieving, and updating third-party application details.  
**Logic Description:** Interacts with a persistence layer (via ThirdPartyConnectivityService or a dedicated repository) to store and manage app registrations. Generates client ID and client secret for new apps. Validates app details. Handles app approval workflows if applicable.  
**Documentation:**
    
    - **Summary:** Service for managing third-party application registrations.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Registry.Services  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/app-store-integration/api/src/v1/registry/controllers/app-registry.controller.ts  
**Description:** API controller for third-party application registration and management by developers.  
**Template:** NestJS Controller  
**Dependancy Level:** 3  
**Name:** AppRegistryController  
**Type:** Controller  
**Relative Path:** src/v1/registry/controllers/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** appRegistryService  
**Type:** AppRegistryService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** registerApp  
**Parameters:**
    
    - @Body() registerAppDto: RegisterAppDto
    - @User() developer: AuthenticatedDeveloper
    
**Return Type:** Promise<AppResponseDto>  
**Attributes:** public|async  
    - **Name:** getMyApp  
**Parameters:**
    
    - @Param('appId') appId: string
    - @User() developer: AuthenticatedDeveloper
    
**Return Type:** Promise<AppResponseDto>  
**Attributes:** public|async  
    - **Name:** updateMyApp  
**Parameters:**
    
    - @Param('appId') appId: string
    - @Body() updateAppDto: UpdateAppDto
    - @User() developer: AuthenticatedDeveloper
    
**Return Type:** Promise<AppResponseDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - App Registration API
    - App Management API for Developers
    
**Requirement Ids:**
    
    - REQ-TCE-007
    - REQ-TCE-008
    
**Purpose:** Exposes endpoints for developers to register their applications and manage their settings.  
**Logic Description:** Handles HTTP requests for app registration, fetching app details, and updating app configurations. Uses AppRegistryService for business logic. Requires developer authentication.  
**Documentation:**
    
    - **Summary:** Controller for third-party app registration and management.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Registry.Controllers  
**Metadata:**
    
    - **Category:** APIEndpoints
    
- **Path:** src/modules/app-store-integration/api/src/v1/registry/registry.module.ts  
**Description:** NestJS module for third-party application registration and management.  
**Template:** NestJS Module  
**Dependancy Level:** 3  
**Name:** RegistryModule  
**Type:** Module  
**Relative Path:** src/v1/registry/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - App Registry Feature Encapsulation
    
**Requirement Ids:**
    
    - REQ-TCE-007
    - REQ-TCE-008
    
**Purpose:** Groups all components related to third-party app registration.  
**Logic Description:** Imports necessary modules (e.g., AuthModule for guards). Declares AppRegistryController. Provides AppRegistryService. This module could also handle internal platform admin APIs for approving/managing apps if not separated.  
**Documentation:**
    
    - **Summary:** Module for managing the registry of third-party applications.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Registry  
**Metadata:**
    
    - **Category:** Module
    
- **Path:** src/modules/app-store-integration/api/src/v1/webhooks/dto/create-webhook-subscription.dto.ts  
**Description:** Data Transfer Object for creating a new webhook subscription.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** CreateWebhookSubscriptionDto  
**Type:** DTO  
**Relative Path:** src/v1/webhooks/dto/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** targetUrl  
**Type:** string  
**Attributes:**   
    - **Name:** eventTypes  
**Type:** WebhookEventType[]  
**Attributes:**   
    - **Name:** secret  
**Type:** string  
**Attributes:** optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Webhook Subscription Creation Data Contract
    
**Requirement Ids:**
    
    - REQ-TCE-008.3
    
**Purpose:** Defines the payload for creating a webhook subscription.  
**Logic Description:** Contains fields for the target URL where events should be sent, an array of event types to subscribe to, and an optional secret for payload signature verification. Use class-validator for validation.  
**Documentation:**
    
    - **Summary:** DTO for creating a new webhook subscription.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Webhooks.Dto  
**Metadata:**
    
    - **Category:** APIContract
    
- **Path:** src/modules/app-store-integration/api/src/v1/webhooks/services/webhook-subscription.service.ts  
**Description:** Service for managing webhook subscriptions for third-party applications.  
**Template:** NestJS Service  
**Dependancy Level:** 2  
**Name:** WebhookSubscriptionService  
**Type:** Service  
**Relative Path:** src/v1/webhooks/services/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** thirdPartyConnectivityService  
**Type:** ThirdPartyConnectivityService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** createSubscription  
**Parameters:**
    
    - appId: string
    - createDto: CreateWebhookSubscriptionDto
    
**Return Type:** Promise<WebhookSubscriptionResponseDto>  
**Attributes:** public|async  
    - **Name:** listSubscriptions  
**Parameters:**
    
    - appId: string
    
**Return Type:** Promise<WebhookSubscriptionResponseDto[]>  
**Attributes:** public|async  
    - **Name:** updateSubscription  
**Parameters:**
    
    - subscriptionId: string
    - appId: string
    - updateDto: UpdateWebhookSubscriptionDto
    
**Return Type:** Promise<WebhookSubscriptionResponseDto>  
**Attributes:** public|async  
    - **Name:** deleteSubscription  
**Parameters:**
    
    - subscriptionId: string
    - appId: string
    
**Return Type:** Promise<void>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Webhook Subscription Management
    
**Requirement Ids:**
    
    - REQ-TCE-008.3
    
**Purpose:** Handles the business logic for creating, retrieving, updating, and deleting webhook subscriptions.  
**Logic Description:** Interacts with a persistence layer (via ThirdPartyConnectivityService) to store webhook subscription details. Validates target URLs and event types. Associates subscriptions with specific third-party apps.  
**Documentation:**
    
    - **Summary:** Service for managing webhook subscriptions.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Webhooks.Services  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/app-store-integration/api/src/v1/webhooks/controllers/webhook-subscription.controller.ts  
**Description:** API controller for third-party applications to manage their webhook subscriptions.  
**Template:** NestJS Controller  
**Dependancy Level:** 3  
**Name:** WebhookSubscriptionController  
**Type:** Controller  
**Relative Path:** src/v1/webhooks/controllers/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** webhookSubscriptionService  
**Type:** WebhookSubscriptionService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** create  
**Parameters:**
    
    - @CurrentApp() app: RegisteredApp
    - @Body() createDto: CreateWebhookSubscriptionDto
    
**Return Type:** Promise<WebhookSubscriptionResponseDto>  
**Attributes:** public|async  
    - **Name:** findAll  
**Parameters:**
    
    - @CurrentApp() app: RegisteredApp
    
**Return Type:** Promise<WebhookSubscriptionResponseDto[]>  
**Attributes:** public|async  
    - **Name:** update  
**Parameters:**
    
    - @Param('id') id: string
    - @CurrentApp() app: RegisteredApp
    - @Body() updateDto: UpdateWebhookSubscriptionDto
    
**Return Type:** Promise<WebhookSubscriptionResponseDto>  
**Attributes:** public|async  
    - **Name:** remove  
**Parameters:**
    
    - @Param('id') id: string
    - @CurrentApp() app: RegisteredApp
    
**Return Type:** Promise<void>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Webhook Subscription CRUD API
    
**Requirement Ids:**
    
    - REQ-TCE-008.3
    
**Purpose:** Exposes endpoints for third-party apps to manage their webhook subscriptions.  
**Logic Description:** Handles HTTP requests for creating, listing, updating, and deleting webhook subscriptions. Uses WebhookSubscriptionService for business logic. Requires app authentication (OAuth JWT). Uses @CurrentApp decorator to get authenticated app context.  
**Documentation:**
    
    - **Summary:** Controller for managing webhook subscriptions.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Webhooks.Controllers  
**Metadata:**
    
    - **Category:** APIEndpoints
    
- **Path:** src/modules/app-store-integration/api/src/v1/webhooks/webhooks.module.ts  
**Description:** NestJS module for webhook subscription management.  
**Template:** NestJS Module  
**Dependancy Level:** 3  
**Name:** WebhooksModule  
**Type:** Module  
**Relative Path:** src/v1/webhooks/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Webhook Management Encapsulation
    
**Requirement Ids:**
    
    - REQ-TCE-008.3
    
**Purpose:** Groups all components related to webhook subscription management.  
**Logic Description:** Imports necessary modules (e.g., AuthModule for guards). Declares WebhookSubscriptionController. Provides WebhookSubscriptionService.  
**Documentation:**
    
    - **Summary:** Module for managing webhook subscriptions.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Webhooks  
**Metadata:**
    
    - **Category:** Module
    
- **Path:** src/modules/app-store-integration/api/src/v1/data-exchange/rest/controllers/sample-resource.controller.ts  
**Description:** Example REST controller for third-party applications to access platform data.  
**Template:** NestJS Controller  
**Dependancy Level:** 3  
**Name:** SampleResourceController  
**Type:** Controller  
**Relative Path:** src/v1/data-exchange/rest/controllers/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** dataAccessService  
**Type:** DataAccessService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** getResources  
**Parameters:**
    
    - @CurrentApp() app: RegisteredApp
    - @Query() query: SampleResourceQueryDto
    
**Return Type:** Promise<PaginatedResponseDto<SampleResourceDto>>  
**Attributes:** public|async  
    - **Name:** getResourceById  
**Parameters:**
    
    - @Param('id') id: string
    - @CurrentApp() app: RegisteredApp
    
**Return Type:** Promise<SampleResourceDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Sample Data Access REST API
    
**Requirement Ids:**
    
    - REQ-TCE-008.1
    
**Purpose:** Provides an example of a RESTful API endpoint for third-party apps to consume data.  
**Logic Description:** Protected by JwtAuthGuard and ScopesGuard. Uses DataAccessService to fetch data based on the authenticated app's permissions and query parameters. Maps internal domain models to DTOs for response.  
**Documentation:**
    
    - **Summary:** Example REST controller for third-party data access.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.DataExchange.Rest.Controllers  
**Metadata:**
    
    - **Category:** APIEndpoints
    
- **Path:** src/modules/app-store-integration/api/src/v1/data-exchange/graphql/resolvers/sample-resource.resolver.ts  
**Description:** Example GraphQL resolver for third-party applications to access platform data.  
**Template:** NestJS GraphQL Resolver  
**Dependancy Level:** 3  
**Name:** SampleResourceResolver  
**Type:** Resolver  
**Relative Path:** src/v1/data-exchange/graphql/resolvers/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** dataAccessService  
**Type:** DataAccessService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** sampleResources  
**Parameters:**
    
    - @Args('filter') filter: SampleResourceFilterInput
    - @CurrentApp() app: RegisteredApp
    
**Return Type:** Promise<SampleResourceType[]>  
**Attributes:** public|async  
    - **Name:** sampleResource  
**Parameters:**
    
    - @Args('id') id: string
    - @CurrentApp() app: RegisteredApp
    
**Return Type:** Promise<SampleResourceType>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Sample Data Access GraphQL API
    
**Requirement Ids:**
    
    - REQ-TCE-008.1
    
**Purpose:** Provides an example of a GraphQL API endpoint for third-party apps to consume data.  
**Logic Description:** Defines queries for fetching sample resources. Protected by JwtAuthGuard and ScopesGuard. Uses DataAccessService to retrieve data according to app permissions and GraphQL arguments. Returns GraphQL types.  
**Documentation:**
    
    - **Summary:** Example GraphQL resolver for third-party data access.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.DataExchange.GraphQL.Resolvers  
**Metadata:**
    
    - **Category:** APIEndpoints
    
- **Path:** src/modules/app-store-integration/api/src/v1/data-exchange/services/data-access.service.ts  
**Description:** Service layer for the data exchange APIs, responsible for fetching and transforming data for third-party consumption.  
**Template:** NestJS Service  
**Dependancy Level:** 2  
**Name:** DataAccessService  
**Type:** Service  
**Relative Path:** src/v1/data-exchange/services/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** thirdPartyConnectivityService  
**Type:** ThirdPartyConnectivityService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** fetchSampleResources  
**Parameters:**
    
    - app: RegisteredApp
    - queryOptions: any
    
**Return Type:** Promise<PaginatedResponseDto<SampleResourceDto>>  
**Attributes:** public|async  
    - **Name:** fetchSampleResourceById  
**Parameters:**
    
    - app: RegisteredApp
    - resourceId: string
    
**Return Type:** Promise<SampleResourceDto | null>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Data Retrieval Logic for Third-Party APIs
    
**Requirement Ids:**
    
    - REQ-TCE-008.1
    
**Purpose:** Abstracts the data fetching logic for both REST and GraphQL data exchange APIs.  
**Logic Description:** Interacts with the ThirdPartyConnectivityService (or other core application services) to retrieve Ad Manager data. Applies any necessary transformations or filtering based on the third-party app's permissions and request parameters. Maps internal models to DTOs/GraphQL types.  
**Documentation:**
    
    - **Summary:** Service for providing data to third-party applications.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.DataExchange.Services  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/app-store-integration/api/src/v1/data-exchange/data-exchange.module.ts  
**Description:** NestJS module aggregating REST and GraphQL API functionalities for third-party data exchange.  
**Template:** NestJS Module  
**Dependancy Level:** 4  
**Name:** DataExchangeModule  
**Type:** Module  
**Relative Path:** src/v1/data-exchange/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Data API Encapsulation
    
**Requirement Ids:**
    
    - REQ-TCE-008.1
    
**Purpose:** Combines all modules related to providing data access (REST and GraphQL) to third-party apps.  
**Logic Description:** Imports RestApiModule and GraphqlApiModule. Provides DataAccessService. May import AuthModule for guards if not globally applied.  
**Documentation:**
    
    - **Summary:** Module for third-party data exchange APIs.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.DataExchange  
**Metadata:**
    
    - **Category:** Module
    
- **Path:** src/modules/app-store-integration/api/src/v1/documentation/swagger.setup.ts  
**Description:** Sets up Swagger (OpenAPI) documentation for the RESTful API endpoints.  
**Template:** NestJS Swagger Setup  
**Dependancy Level:** 2  
**Name:** setupSwagger  
**Type:** Utility  
**Relative Path:** src/v1/documentation/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** default  
**Parameters:**
    
    - app: INestApplication
    
**Return Type:** void  
**Attributes:** export  
    
**Implemented Features:**
    
    - API Documentation Generation (Swagger/OpenAPI)
    
**Requirement Ids:**
    
    - REQ-TCE-008.1
    
**Purpose:** Configures and initializes Swagger for generating API documentation.  
**Logic Description:** Creates a Swagger document using DocumentBuilder, specifying title, description, version, and security definitions (e.g., OAuth2). Sets up the Swagger UI endpoint (e.g., /api-docs).  
**Documentation:**
    
    - **Summary:** Utility function to set up Swagger documentation.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1.Documentation  
**Metadata:**
    
    - **Category:** Documentation
    
- **Path:** src/modules/app-store-integration/api/src/v1/app-store-integration-v1.module.ts  
**Description:** Main NestJS module for Version 1 of the App Store Integration API. Imports all feature-specific modules for this version.  
**Template:** NestJS Module  
**Dependancy Level:** 4  
**Name:** AppStoreIntegrationV1Module  
**Type:** Module  
**Relative Path:** src/v1/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - API Version Module Aggregation
    
**Requirement Ids:**
    
    - REQ-TCE-007
    - REQ-TCE-008
    - REQ-TCE-008.4
    
**Purpose:** Aggregates all V1 API functionalities for the App Store integration framework.  
**Logic Description:** Imports AuthModule, RegistryModule, WebhooksModule, DataExchangeModule, and ConfigModule. This module represents the V1 of the App Store Integration API.  
**Documentation:**
    
    - **Summary:** Root module for V1 of the App Store Integration API.
    
**Namespace:** AdManager.AppStoreIntegration.Api.V1  
**Metadata:**
    
    - **Category:** Module
    
- **Path:** src/modules/app-store-integration/api/src/app-store-integration.module.ts  
**Description:** Top-level NestJS module for the App Store Integration feature, potentially managing different API versions.  
**Template:** NestJS Module  
**Dependancy Level:** 5  
**Name:** AppStoreIntegrationApiModule  
**Type:** Module  
**Relative Path:** src/  
**Repository Id:** REPO-APPSTORE-014  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Feature Module Aggregation
    - API Version Management (Conceptual)
    
**Requirement Ids:**
    
    - REQ-TCE-007
    - REQ-TCE-008
    
**Purpose:** The primary module for the entire App Store Integration API feature, typically importing versioned API modules.  
**Logic Description:** Imports AppStoreIntegrationV1Module. If multiple API versions were supported, this module would manage routing or selection between them.  
**Documentation:**
    
    - **Summary:** Main module for the App Store Integration API feature.
    
**Namespace:** AdManager.AppStoreIntegration.Api  
**Metadata:**
    
    - **Category:** Module
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableGraphQLDataExchange
  - enableWebhookSignatureVerification
  
- **Database Configs:**
  
  - OAUTH_CLIENT_DB_CONNECTION_STRING
  - WEBHOOK_SUBSCRIPTION_DB_CONNECTION_STRING
  


---

