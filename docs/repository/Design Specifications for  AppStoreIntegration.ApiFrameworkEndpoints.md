# Software Design Specification: AppStoreIntegration.ApiFrameworkEndpoints (REPO-APPSTORE-014)

## 1. Introduction

### 1.1 Purpose
This document outlines the software design specifications for the `AppStoreIntegration.ApiFrameworkEndpoints` repository (REPO-APPSTORE-014). This API module is responsible for defining and implementing the framework through which third-party applications can integrate with the Ad Manager platform via the `[PlatformName]` App Store. It provides the necessary API endpoints for application registration, OAuth 2.0 authentication and authorization, data exchange (RESTful and GraphQL), and webhook-based event notifications.

### 1.2 Scope
The scope of this document is limited to the design of the `AppStoreIntegration.ApiFrameworkEndpoints` module. This includes:
-   OAuth 2.0 server-side implementation for third-party app authentication and authorization.
-   API endpoints for third-party application registration and management.
-   API endpoints for managing webhook subscriptions.
-   Framework and example implementations for RESTful and GraphQL data exchange APIs.
-   Definition of common data structures (DTOs, enums, interfaces) for API interaction.
-   Configuration and bootstrapping of the NestJS application for this module.

This module defines the *interface and framework* for third-party app integration. The actual storage of app registrations, client credentials, webhook subscriptions, and the core Ad Manager business data (e.g., campaign data, product data) is assumed to be handled by other services, primarily interacted with via the `ThirdPartyConnectivityService` or other internal Ad Manager services.

### 1.3 Definitions and Acronyms
-   **API:** Application Programming Interface
-   **DTO:** Data Transfer Object
-   **GraphQL:** A query language for APIs and a server-side runtime for executing those queries.
-   **JWT:** JSON Web Token
-   **NestJS:** A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
-   **OAuth 2.0:** An open standard for access delegation, commonly used as a way for Internet users to grant websites or applications access to their information on other websites but without giving them the passwords.
-   **PKCE:** Proof Key for Code Exchange, an extension to the Authorization Code flow to prevent CSRF and authorization code injection attacks.
-   **REST:** Representational State Transfer
-   **SDK:** Software Development Kit
-   **SDS:** Software Design Specification
-   **UI:** User Interface
-   **URL:** Uniform Resource Locator
-   **App Store:** The `[PlatformName]` App Store where third-party applications are listed and can be integrated.
-   **Ad Manager:** The core Ad Manager platform.
-   **`[PlatformName]`:** The parent platform hosting the Ad Manager and App Store.
-   **`ThirdPartyConnectivityService`**: A conceptual or actual service responsible for mediating interactions between this API framework and underlying Ad Manager services or data stores for app registration, webhook persistence, etc.

### 1.4 References
-   REQ-TCE-007: Support extensibility through `[PlatformName]` App Store.
-   REQ-TCE-008: Integration framework for third-party applications (API specs, OAuth, Webhooks, SDK, versioning).
    -   REQ-TCE-008.1: API Specifications (REST/GraphQL)
    -   REQ-TCE-008.2: Secure authentication and authorization methods (e.g., OAuth 2.0)
    -   REQ-TCE-008.3: Webhook systems
    -   REQ-TCE-008.4: Clear API versioning and lifecycle management policies

## 2. System Overview

### 2.1 Architectural Context
This API module operates within a microservices architecture. It serves as a dedicated set of endpoints, likely exposed via an API Gateway (e.g., Amazon API Gateway), forming part of the application services layer. It integrates with:
1.  **Frontend Applications:** Developer portals for app registration (not part of this repo).
2.  **Third-Party Applications:** For OAuth 2.0 flows, data access, and webhook management.
3.  **Internal Ad Manager Services (via `ThirdPartyConnectivityService`):** For persisting app registrations, OAuth client details, authorization codes, tokens, webhook subscriptions, and retrieving data to be exposed to third-party apps.

### 2.2 High-Level Functionality
The `AppStoreIntegration.ApiFrameworkEndpoints` module will provide the following core functionalities:
-   **Third-Party Application Registration:** Allow developers to register their applications to get API credentials (`client_id`, `client_secret`).
-   **OAuth 2.0 Authorization Server:** Implement OAuth 2.0 (Authorization Code Grant with PKCE, Refresh Token Grant) to enable third-party apps to securely access Ad Manager data on behalf of merchants.
-   **Data Exchange APIs:** Define a framework for exposing Ad Manager data to authorized third-party apps via RESTful and GraphQL APIs. This includes example implementations for sample resources.
-   **Webhook Management:** Allow third-party apps to subscribe to specific events occurring within the Ad Manager platform and receive notifications.
-   **API Documentation:** Provide clear API specifications using Swagger/OpenAPI for REST and potentially a GraphQL schema.

## 3. Functional Design

### 3.1 OAuth 2.0 Authorization Framework (REQ-TCE-008.2)
The module will implement key components of an OAuth 2.0 Authorization Server.

#### 3.1.1 Client Application Registration & Management
-   **Endpoints:** Provided by the `AppRegistryController`.
-   **Functionality:**
    -   Developers can register their applications, providing details like app name, redirect URIs, and requested scopes (see `RegisterAppDto`).
    -   The system will generate a `client_id` and `client_secret` for each registered application.
    -   These details will be persisted via the `AppRegistryService` (delegating to `ThirdPartyConnectivityService`).
    -   Developers can view and update their registered application details.
-   **Related Files:** `register-app.dto.ts`, `app-registry.service.ts`, `app-registry.controller.ts`, `registry.module.ts`.

#### 3.1.2 Authorization Endpoint (`/v1/auth/authorize`)
-   **Controller:** `OAuthController`
-   **Functionality:**
    -   Initiates the OAuth 2.0 Authorization Code Grant.
    -   Validates `client_id`, `redirect_uri`, `response_type=code`, `scope`, `state`.
    -   Supports PKCE (`code_challenge`, `code_challenge_method`).
    -   Authenticates the merchant (resource owner). This may involve redirecting to `[PlatformName]`'s central authentication and consent UI.
    -   Obtains merchant consent for the requested scopes.
    -   If approved, generates an authorization code, associates it with the `client_id`, `redirect_uri`, user, scopes, and PKCE parameters.
    -   Redirects the user-agent back to the client's `redirect_uri` with the authorization code and state.
-   **Related Files:** `oauth.controller.ts`, `oauth2.strategy.ts` (or a dedicated service called by the strategy), `auth.module.ts`.

#### 3.1.3 Token Endpoint (`/v1/auth/token`)
-   **Controller:** `OAuthController`
-   **Functionality:**
    -   Issues access tokens and, optionally, refresh tokens.
    -   Supports `grant_type=authorization_code`:
        -   Authenticates the client (`client_id`, `client_secret` or public client).
        -   Validates the authorization `code`, `redirect_uri`.
        -   Verifies `code_verifier` against the stored `code_challenge` if PKCE was used.
        -   If valid, issues an access token (JWT) and optionally a refresh token.
    -   Supports `grant_type=refresh_token`:
        -   Authenticates the client.
        -   Validates the `refresh_token`.
        -   If valid, issues a new access token and optionally a new refresh token.
    -   Returns `TokenResponseDto`.
-   **Related Files:** `oauth.controller.ts`, `oauth2.strategy.ts`, `token-request.dto.ts`, `token-response.dto.ts`, `auth.module.ts`.

#### 3.1.4 JWT Access Tokens
-   Access tokens will be JWTs signed with a strong algorithm (e.g., RS256 or HS256, configurable).
-   JWTs will contain standard claims (`iss`, `sub`, `aud`, `exp`, `iat`) and custom claims like `scope` and `client_id`.
-   Short-lived access tokens with a refresh token strategy will be employed.
-   The `JwtAuthGuard` will be used to protect resource APIs, verifying these JWTs.
-   Related Files: `jwt-auth.guard.ts`, `auth.module.ts` (for JwtModule setup).

### 3.2 Data Exchange APIs (REQ-TCE-008.1)
The module will provide a framework for exposing Ad Manager data. This SDS outlines sample resource access. Actual resources (campaigns, products, analytics) will be defined by the broader Ad Manager platform and exposed through this framework.

#### 3.2.1 RESTful Endpoints
-   **Controllers:** Example `SampleResourceController`.
-   **Functionality:**
    -   Provide CRUD-like operations or read-only access to Ad Manager resources.
    -   Endpoints will be versioned (e.g., `/v1/data/sample-resources`).
    -   Protected by `JwtAuthGuard` and a scope-checking guard.
    -   Requests will be validated using DTOs and `class-validator`.
    -   Responses will use DTOs.
    -   Pagination, filtering, and sorting will be supported for list endpoints.
-   **Related Files:** `sample-resource.controller.ts`, `data-access.service.ts`, `data-exchange.module.ts`.
-   **API Documentation:** Generated via `swagger.setup.ts` and accessible at a defined endpoint (e.g., `/api-docs`).

#### 3.2.2 GraphQL Endpoints
-   **Resolvers:** Example `SampleResourceResolver`.
-   **Functionality:**
    -   Provide flexible data querying capabilities for Ad Manager resources.
    -   A GraphQL schema will define types, queries, mutations, and potentially subscriptions.
    -   Endpoints protected by `JwtAuthGuard` and a scope-checking guard.
    -   Input arguments validated.
-   **Related Files:** `sample-resource.resolver.ts`, `data-access.service.ts`, `data-exchange.module.ts`, `app.module.ts` (for GraphQLModule setup).

### 3.3 Webhook System (REQ-TCE-008.3)
Allows third-party apps to receive real-time notifications for events.

#### 3.3.1 Subscription Management
-   **Controller:** `WebhookSubscriptionController`.
-   **Functionality:**
    -   Third-party apps (authenticated via OAuth token) can create, list, update, and delete webhook subscriptions.
    -   Subscriptions include a `targetUrl`, a list of `WebhookEventType`s, and an optional `secret` for payload signature verification.
    -   Managed by `WebhookSubscriptionService` (delegating persistence to `ThirdPartyConnectivityService`).
-   **Related Files:** `create-webhook-subscription.dto.ts`, `webhook-event-type.enum.ts`, `webhook-subscription.service.ts`, `webhook-subscription.controller.ts`, `webhooks.module.ts`.

#### 3.3.2 Event Publishing & Delivery (Conceptual within this module)
-   This module defines the subscription mechanism. The actual event generation and dispatching logic will reside in other Ad Manager microservices that own the data/events.
-   When an event occurs (e.g., campaign created), the responsible service will:
    1.  Identify relevant webhook subscriptions (via `ThirdPartyConnectivityService` or a shared event bus).
    2.  Construct a payload for the event.
    3.  If a `secret` is configured for the subscription, sign the payload (e.g., HMAC-SHA256).
    4.  Send an HTTP POST request to the subscriber's `targetUrl` with the payload and signature.
    5.  Implement retry mechanisms and dead-lettering for failed deliveries.

### 3.4 App Store (`[PlatformName]`) Integration (REQ-TCE-007)
This module primarily focuses on the API framework enabling apps *after* they are conceptually listed or discovered via the `[PlatformName]` App Store. The registration endpoints (`AppRegistryController`) serve as the technical onboarding for an app to get credentials.
-   The App Store URL (`https://apps.[ActualPlatformDomain].sa/en`) is an external entity. This API framework enables apps found there to connect.

### 3.5 API Versioning & Lifecycle (REQ-TCE-008.4)
-   APIs will be versioned (e.g., `/v1/...`). The `app-store-integration-v1.module.ts` encapsulates V1.
-   The `ApiVersionPolicy` interface defines how versioning information (status, deprecation, sunset) could be communicated, though the actual mechanism for exposing this policy to developers (e.g., a dedicated endpoint, documentation) is not explicitly detailed in the file structure beyond the interface itself. This implies it's a documentation/communication aspect.
-   Related Files: `api-version-policy.interface.ts`, `app-store-integration-v1.module.ts`.

## 4. Detailed Design (File by File Elaboration)

This section elaborates on the `LogicDescription` provided in the `file_structure_json` for key files.

**`src/main.ts`**
-   **LogicDescription Refined:**
    -   Create a NestJS application instance using `AppModule`.
    -   Enable global `ValidationPipe` with `transform: true` and `whitelist: true` for automatic request payload validation and transformation based on DTOs.
    -   Implement a global `HttpExceptionFilter` for consistent error responses.
    -   **Swagger Setup:** If `process.env.NODE_ENV !== 'production'`, call `setupSwagger(app)` from `src/v1/documentation/swagger.setup.ts`.
    -   **GraphQL Setup:** If GraphQL is enabled (via config), the `GraphQLModule` imported in `AppModule` will handle its setup. Ensure necessary configurations like `autoSchemaFile` or `typePaths` are set in `AppModule`.
    -   Enable CORS with configurable origins, methods, and headers.
    -   Listen on `process.env.PORT` or a default port (e.g., 3000).
    -   Log application start message with port and environment.

**`src/app.module.ts`**
-   **LogicDescription Refined:**
    -   Import `ConfigModule.forRoot({ isGlobal: true, load: [configuration] })` from `@nestjs/config` and the custom `configuration` function.
    -   Import `AppStoreIntegrationV1Module` which represents the V1 API features.
    -   If GraphQL is used, import `GraphQLModule.forRootAsync<ApolloDriverConfig>({ driver: ApolloDriver, useFactory: (configService: ConfigService) => ({ autoSchemaFile: join(process.cwd(), 'src/schema.gql'), sortSchema: true, playground: configService.get('NODE_ENV') !== 'production', // or a specific config key // Add context for auth if needed, e.g., to pass request to resolvers for auth guards context: ({ req }) => ({ req }), }), inject: [ConfigService], })`.
    -   Potentially import global utility modules like `ThrottlerModule` for rate limiting, configured via `ConfigService`.

**`src/v1/config/configuration.ts`**
-   **LogicDescription Refined:**
    -   Define a schema for environment variables using Joi or `class-validator` for robust validation at startup.
    -   Load variables like:
        -   `NODE_ENV`: `development`, `production`, `test`
        -   `PORT`: Application port
        -   `API_PREFIX`: Global API prefix (e.g., `/api`)
        -   `APP_STORE_URL`: URL for `[PlatformName]` App Store.
        -   `OAUTH_ISSUER_URL`: Issuer URL for JWTs.
        -   `OAUTH_AUTHORIZATION_CODE_TTL_SECONDS`: TTL for authorization codes.
        -   `OAUTH_ACCESS_TOKEN_TTL_SECONDS`: TTL for access tokens.
        -   `OAUTH_REFRESH_TOKEN_TTL_SECONDS`: TTL for refresh tokens.
        -   `JWT_SECRET`: Secret key for signing JWTs (HS256).
        -   `JWT_PUBLIC_KEY`, `JWT_PRIVATE_KEY`: For RS256.
        -   `JWT_ALGORITHM`: e.g., `HS256`, `RS256`.
        -   `THIRDPARTY_CONNECTIVITY_SERVICE_URL`: Base URL for the service handling persistence.
        -   `WEBHOOK_RETRY_ATTEMPTS`, `WEBHOOK_RETRY_DELAY_MS`.
        -   Database connection strings if this module were to handle DB directly (but it's expected to use `ThirdPartyConnectivityService`).
    -   Return a nested configuration object for better organization.

**`src/v1/auth/strategies/oauth2.strategy.ts`**
-   **LogicDescription Refined:** This is a core component. It will be a custom strategy, likely extending `PassportStrategy(Strategy, 'oauth2-custom')` where `Strategy` is from `passport-custom` or a similar base, or heavily customizing `passport-oauth2-server` if used. It's not a direct drop-in of `passport-oauth2`. The methods described (e.g., `validateClient`, `issueAuthorizationCode`) are conceptual building blocks.
    -   **`constructor`**: Inject `OAuthClientService` (facade for app registration data from `ThirdPartyConnectivityService`), `OAuthTokenService` (facade for token/code persistence from `ThirdPartyConnectivityService`), and `ConfigService`.
    -   **Client Validation**: Implement logic to validate `client_id` and `client_secret` (for confidential clients) against stored app registrations (via `OAuthClientService`).
    -   **Authorization Code Issuance**:
        -   Generate a unique authorization code.
        -   Store the code with its TTL, `client_id`, `redirect_uri`, merchant ID (user), granted scopes, and `code_challenge` / `code_challenge_method` (via `OAuthTokenService`).
    -   **Access Token Issuance (from Auth Code)**:
        -   Verify the authorization code: existence, expiry, `client_id`, `redirect_uri`.
        -   Verify `code_verifier` against stored `code_challenge` using the `code_challenge_method`.
        -   If valid, invalidate the authorization code.
        -   Generate a JWT access token (payload: `sub`=merchantId, `aud`=client_id, `iss`=issuer_url, `exp`, `iat`, `scope`, `client_id`).
        -   Generate a refresh token (opaque string).
        -   Store the refresh token with its TTL, associated `client_id` and merchant ID (via `OAuthTokenService`).
        -   Return `TokenResponseDto`.
    -   **Access Token Issuance (from Refresh Token)**:
        -   Verify the refresh token: existence, expiry, `client_id`.
        -   If valid, (optionally invalidate old refresh token and issue a new one).
        -   Generate a new JWT access token.
        -   Return `TokenResponseDto`.
    -   **PKCE Handling**: Implement `S256` and `plain` code challenge methods.
    -   This "strategy" is more of a service orchestrating these OAuth flows, which the `OAuthController` will use. A traditional Passport strategy is typically for *validating* an incoming token/credential, not for *issuing* them as a server. For the server part, it's common to use libraries like `oauth2orize` or build custom logic. However, given "NestJS Passport Strategy" template, it might be used to protect the token endpoint itself if client authentication is done via Basic Auth or request body params, and a `LocalStrategy` or custom one is used for that. The `JwtStrategy` will be separate for resource server token validation.

    *Correction for OAuth2Strategy*: It's likely that `passport-oauth2` is for *client-side* OAuth. For building an OAuth *server*, `oauth2orize` (older) or custom logic is more common. If `passport-oauth2` is indeed for the server side in some new way or via `passport-oauth2-server`, the methods would align with that library's expectations. Assuming it provides hooks like `validateClient`, `grantCode`, `exchangeCode`. The `OAuthTokenService` would be responsible for interacting with the `ThirdPartyConnectivityService` to store/retrieve codes and tokens.

**`src/v1/auth/controllers/oauth.controller.ts`**
-   **`authorize` Method Logic:**
    1.  Validate `AuthorizeQueryDto` (client_id, redirect_uri, response_type, scope, state, code_challenge, code_challenge_method).
    2.  Call `oauthService.validateClientAndRedirectUri(clientId, redirectUri)`.
    3.  Check if user (merchant) is authenticated (e.g., via an existing session with `[PlatformName]` identity).
        -   If not, redirect to `[PlatformName]`'s login page, passing necessary return information.
    4.  Display a consent screen to the merchant showing the client app name and requested scopes. (This UI is not part of this repo, but the controller would initiate redirect to it or render data for it if it's a shared UI component).
    5.  Upon merchant consent, call `oauthService.issueAuthorizationCode(client, user, redirectUri, scopes, pkceParams)`.
    6.  Redirect to client's `redirect_uri` with `code` and `state`.
    7.  Handle errors by redirecting to `redirect_uri` with error codes (e.g., `access_denied`, `invalid_request`).
-   **`token` Method Logic:**
    1.  Validate `TokenRequestDto`.
    2.  Authenticate client (e.g., Basic Auth for `client_id:client_secret`, or `client_id` in body for public clients).
    3.  Based on `grant_type`:
        -   `authorization_code`: Call `oauthService.exchangeCodeForToken(client, code, redirectUri, codeVerifier)`.
        -   `refresh_token`: Call `oauthService.exchangeRefreshTokenForToken(client, refreshToken)`.
        -   Other grant types (e.g., `client_credentials` for M2M if needed) could be added.
    4.  Return `TokenResponseDto` or an OAuth error response.

**`src/v1/registry/services/app-registry.service.ts`**
-   **`registerNewApp` Method Logic:**
    1.  Validate `registerAppDto`.
    2.  Generate a unique `client_id`.
    3.  Generate a secure `client_secret` (e.g., cryptographically random string). Hash it before storing if direct comparison is not needed, or store as is if the `ThirdPartyConnectivityService` handles hashing.
    4.  Prepare app data including generated credentials.
    5.  Call `thirdPartyConnectivityService.createAppRegistration(appData, developerId)` to persist the app.
    6.  Return `AppResponseDto` (which should include `client_id` but **NOT** `client_secret` directly in response; `client_secret` shown once upon creation).
-   **Other methods (`getAppDetails`, `updateAppDetails`, `listDeveloperApps`):**
    -   Call corresponding methods on `thirdPartyConnectivityService` to fetch/update app registration data.
    -   Ensure developer can only access/manage their own apps.

**`src/v1/webhooks/services/webhook-subscription.service.ts`**
-   **`createSubscription` Method Logic:**
    1.  Validate `createDto` (targetUrl must be HTTPS, eventTypes must be valid).
    2.  If `secret` is provided, store it securely (e.g., encrypted via `ThirdPartyConnectivityService`).
    3.  Call `thirdPartyConnectivityService.createWebhook(appId, subscriptionData)` to persist.
    4.  Return `WebhookSubscriptionResponseDto`.
-   **Other methods:** Call `thirdPartyConnectivityService` for list, update, delete operations, ensuring app owns the subscription.

**`src/v1/data-exchange/services/data-access.service.ts`**
-   **LogicDescription Refined:**
    -   This service acts as a gateway to underlying Ad Manager data for third-party apps.
    -   Methods like `fetchSampleResources` and `fetchSampleResourceById` are illustrative. Real methods will be specific to Ad Manager resources (e.g., `fetchCampaigns`, `fetchProductDetails`).
    -   **Authorization:** Before fetching data, it must verify that the authenticated `app` (passed in) has the required OAuth scopes to access the requested resource and data. This might involve a call to a shared authorization service or checking scopes embedded in the JWT.
    -   **Data Fetching:** Call appropriate methods on `thirdPartyConnectivityService` (or other internal Ad Manager services) to retrieve the raw data.
    -   **Transformation/Filtering:** Apply any necessary data transformations, filtering based on app permissions, or projections to shape the data according to the API contract (DTOs for REST, GraphQL types for GraphQL).
    -   **Pagination:** Implement pagination logic for list-based resources.
    -   **Error Handling:** Handle errors from underlying services and map them to appropriate HTTP status codes or GraphQL errors.

**`src/v1/documentation/swagger.setup.ts`**
-   **LogicDescription Refined:**
    1.  `const builder = new DocumentBuilder()`
        -   `.setTitle('Ad Manager - App Store Integration API')`
        -   `.setDescription('API framework for third-party application integration with the Ad Manager platform.')`
        -   `.setVersion('v1')` (or read from config/package.json)
        -   `.addTag('Auth', 'OAuth 2.0 Authorization Framework')`
        -   `.addTag('AppRegistry', 'Third-Party Application Registration & Management')`
        -   `.addTag('Webhooks', 'Webhook Subscription Management')`
        -   `.addTag('DataExchangeREST', 'RESTful Data Access (Sample)')` // Add tags for actual resources
        -   `.addOAuth2({ type: 'oauth2', flows: { authorizationCode: { authorizationUrl: '/api/v1/auth/authorize', tokenUrl: '/api/v1/auth/token', scopes: { /* define available scopes like 'campaigns:read', 'products:read' */ } } } }, 'oauth2')`
        -   `.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'jwt')` // For resource server endpoints
    2.  `const document = SwaggerModule.createDocument(app, builder.build());`
    3.  `SwaggerModule.setup('/api/v1/docs', app, document);` (or use configured API prefix)

## 5. Security Design

### 5.1 Authentication
-   **Third-Party Apps:** OAuth 2.0 Authorization Code Grant with PKCE is the primary mechanism for apps to obtain access tokens to call data exchange APIs on behalf of a merchant.
-   **Client Authentication (Token Endpoint):**
    -   Confidential clients: HTTP Basic Authentication (`client_id:client_secret`) or `client_id`/`client_secret` in request body.
    -   Public clients: `client_id` in request body; PKCE is mandatory.
-   **Resource Server (Data Exchange APIs):** JWT Bearer Token authentication. The `JwtAuthGuard` validates tokens.
-   **Developer Authentication (for App Registry):** Assumed to be handled by `[PlatformName]`'s existing authentication, providing an `AuthenticatedDeveloper` context to `AppRegistryController`.

### 5.2 Authorization
-   **OAuth Scopes:** Requested scopes during the authorization flow (`/authorize`) will limit the access granted to the third-party app.
-   **Scope Enforcement:** Data exchange APIs (`SampleResourceController`, `SampleResourceResolver`, and their real counterparts) must check if the validated JWT access token contains the necessary scopes for the requested operation/resource. This can be implemented using a custom `ScopesGuard`.
-   **Developer Permissions:** For app registration APIs, authorization checks will ensure developers can only manage their own applications.

### 5.3 Input Validation
-   All DTOs used in controllers (REST and GraphQL arguments) will use `class-validator` decorators to enforce type, format, and presence of required fields.
-   Global `ValidationPipe` will be enabled in `main.ts`.

### 5.4 Secure Communication
-   All API endpoints will be served over HTTPS. SSL termination is typically handled by the API Gateway or load balancer in a production environment.

### 5.5 Secrets Management
-   `JWT_SECRET` or RS256 keys for signing JWTs must be managed securely (e.g., via AWS Secrets Manager, loaded into `ConfigService`).
-   Client secrets for registered applications, if hashed, require secure hashing. If stored directly by `ThirdPartyConnectivityService`, that service is responsible for their secure storage.

## 6. Data Design

### 6.1 Data Transfer Objects (DTOs)
The DTOs defined in the `file_structure_json` are appropriate:
-   `TokenRequestDto`, `TokenResponseDto` for OAuth.
-   `RegisterAppDto`, `AppResponseDto`, `UpdateAppDto` (implied) for app registration.
-   `CreateWebhookSubscriptionDto`, `WebhookSubscriptionResponseDto`, `UpdateWebhookSubscriptionDto` (implied) for webhooks.
-   `SampleResourceDto`, `SampleResourceQueryDto`, `PaginatedResponseDto` for REST data exchange (to be replaced/augmented with actual resource DTOs).
-   GraphQL Input Types & Object Types (e.g., `SampleResourceFilterInput`, `SampleResourceType`) for GraphQL data exchange.

### 6.2 Enums and Interfaces
-   `WebhookEventType.enum.ts`
-   `ApiVersionPolicy.interface.ts`

## 7. API Specifications

### 7.1 RESTful API Endpoints
Base Path: `/api/v1` (configurable)

#### 7.1.1 Authentication (`/auth`) - Tag: `Auth`
-   **`POST /token`**
    -   Description: Exchanges an authorization code or refresh token for an access token.
    -   Request Body: `TokenRequestDto`
    -   Response: `TokenResponseDto` (200 OK), OAuth Error Response (400, 401)
-   **`GET /authorize`**
    -   Description: Initiates the OAuth 2.0 authorization flow.
    -   Query Parameters: `response_type=code`, `client_id`, `redirect_uri`, `scope`, `state`, `code_challenge` (optional), `code_challenge_method` (optional).
    -   Response: Redirect (302) to client's `redirect_uri` with `code` and `state`, or with `error` and `error_description`. Redirect to login/consent UI.

#### 7.1.2 App Registry (`/registry/apps`) - Tag: `AppRegistry`
*(Requires Developer Authentication)*
-   **`POST /`**
    -   Description: Registers a new third-party application.
    -   Request Body: `RegisterAppDto`
    -   Response: `AppResponseDto` (201 Created) (Note: `client_secret` should be shown only once here and not stored in `AppResponseDto`).
-   **`GET /{appId}`**
    -   Description: Retrieves details of a specific registered application owned by the developer.
    -   Path Parameter: `appId`
    -   Response: `AppResponseDto` (200 OK), 404 Not Found, 403 Forbidden.
-   **`PUT /{appId}`**
    -   Description: Updates details of a specific registered application.
    -   Path Parameter: `appId`
    -   Request Body: `UpdateAppDto` (e.g., for redirect URIs, scopes)
    -   Response: `AppResponseDto` (200 OK).
-   **`GET /mine`** (Alternative to listing all apps)
    -   Description: Lists all applications registered by the authenticated developer.
    -   Response: `AppResponseDto[]` (200 OK).

#### 7.1.3 Webhook Subscriptions (`/webhooks/subscriptions`) - Tag: `Webhooks`
*(Requires App Authentication via OAuth JWT - Bearer Token)*
-   **`POST /`**
    -   Description: Creates a new webhook subscription for the authenticated app.
    -   Request Body: `CreateWebhookSubscriptionDto`
    -   Response: `WebhookSubscriptionResponseDto` (201 Created).
-   **`GET /`**
    -   Description: Lists all webhook subscriptions for the authenticated app.
    -   Response: `WebhookSubscriptionResponseDto[]` (200 OK).
-   **`PUT /{subscriptionId}`**
    -   Description: Updates an existing webhook subscription.
    -   Path Parameter: `subscriptionId`
    -   Request Body: `UpdateWebhookSubscriptionDto` (e.g., to change `targetUrl` or `eventTypes`).
    -   Response: `WebhookSubscriptionResponseDto` (200 OK).
-   **`DELETE /{subscriptionId}`**
    -   Description: Deletes a webhook subscription.
    -   Path Parameter: `subscriptionId`
    -   Response: 204 No Content.

#### 7.1.4 Data Exchange (Example: `/data/sample-resources`) - Tag: `DataExchangeREST`
*(Requires App Authentication via OAuth JWT - Bearer Token & Scope Checks)*
-   **`GET /`**
    -   Description: Retrieves a list of sample resources accessible by the app.
    -   Query Parameters: `SampleResourceQueryDto` (for pagination, filtering, sorting).
    -   Response: `PaginatedResponseDto<SampleResourceDto>` (200 OK).
-   **`GET /{resourceId}`**
    -   Description: Retrieves a specific sample resource by ID.
    -   Path Parameter: `resourceId`
    -   Response: `SampleResourceDto` (200 OK), 404 Not Found.

*(Actual data exchange endpoints for campaigns, products, etc., will follow similar patterns but with resource-specific DTOs and paths).*

### 7.2 GraphQL API
-   Endpoint: `/graphql` (configurable)
-   Schema to be defined using `autoSchemaFile` or `typePaths`.
-   Example Queries/Resolvers in `SampleResourceResolver`:
    -   `query sampleResources(filter: SampleResourceFilterInput): [SampleResourceType!]`
    -   `query sampleResource(id: ID!): SampleResourceType`
-   Authentication: Requires JWT Bearer token in Authorization header. Guards applied at resolver or field level.
-   Authorization: Scope checks applied within resolvers.

### 7.3 Webhook Payloads
-   Format: JSON
-   Common Structure:
    json
    {
      "eventId": "unique-event-id",
      "eventType": "CAMPAIGN_CREATED", // from WebhookEventType enum
      "timestamp": "iso-8601-timestamp",
      "appId": "subscriber-app-id", // The app that subscribed
      "merchantId": "affected-merchant-id",
      "payload": {
        // Event-specific data
        "campaignId": "campaign-uuid",
        "name": "New Summer Sale Campaign"
      }
    }
    
-   Signature: If a `secret` is configured for the subscription, an `X-AdManager-Signature-256` (or similar) header containing `sha256=HMAC_SHA256(secret, payload_body)` will be included.

## 8. Error Handling and Logging

### 8.1 Error Responses
-   Implement a global `HttpExceptionFilter` to standardize JSON error responses.
-   Structure:
    json
    {
      "statusCode": 400,
      "message": "Validation failed", // or specific error message
      "errors": [ // Optional: for validation errors
        { "property": "fieldName", "constraints": { "isNotEmpty": "fieldName should not be empty" } }
      ],
      "timestamp": "iso-8601-timestamp",
      "path": "/requested/path"
    }
    
-   OAuth errors will follow RFC 6749 (e.g., `{"error": "invalid_request", "error_description": "..."}`).

### 8.2 Logging
-   Use NestJS built-in `LoggerService` or a more advanced library like `Pino`.
-   Log levels: `DEBUG`, `INFO`, `WARN`, `ERROR`. Configurable per environment.
-   Log important events:
    -   Application start/stop.
    -   Incoming requests (method, path, IP if anonymized/compliant).
    -   Outgoing requests to `ThirdPartyConnectivityService` or other services.
    -   Authentication successes/failures (OAuth, JWT).
    -   Authorization failures.
    -   Unhandled exceptions.
    -   Webhook delivery attempts and outcomes.
-   Structured logging (JSON format) is preferred for easier parsing by log management systems.

## 9. Configuration Management

### 9.1 Environment Variables
-   All configurable parameters will be managed via environment variables, loaded by `src/v1/config/configuration.ts`.
-   Sensitive values (secrets, API keys) should be injected into the environment securely (e.g., via AWS Secrets Manager, Doppler, HashiCorp Vault in CI/CD or runtime).
-   Refer to Section 4 (`src/v1/config/configuration.ts` refinement) for a list of expected variables.

### 9.2 Feature Flags
-   `enableGraphQLDataExchange`: Boolean, controls if the GraphQL endpoint and resolvers are active.
-   `enableWebhookSignatureVerification`: Boolean, controls if webhook payload signature validation is enforced for incoming webhook management requests (if applicable) or for outgoing dispatch (though dispatch is external to this repo's core focus). Primarily, the *subscriber* verifies signatures from *our* dispatched webhooks. This module would generate signatures if it were dispatching. If it's consuming webhooks (e.g., from the App Store itself), then it would verify. Given the context, this is more about *providing* webhooks, so the secret is for subscribers to verify *our* payloads.

## 10. Deployment Considerations
-   The application will be containerized using Docker.
-   Deployment will be managed via CI/CD pipelines to environments like AWS EKS/ECS.
-   The API Gateway will be configured to route traffic to this service.
-   Environment-specific configurations will be applied during deployment.

## 11. Non-Functional Requirements Fulfillment

### 11.1 Security (REQ-TCE-008.2)
-   OAuth 2.0 with PKCE provides secure delegated access.
-   JWTs for stateless, secure API calls.
-   Client authentication for token endpoint.
-   Input validation prevents common injection vulnerabilities.
-   HTTPS for all communication.

### 11.2 Extensibility (REQ-TCE-007, REQ-TCE-008)
-   Modular design (Auth, Registry, Webhooks, DataExchange) allows for easier addition of new features or API versions.
-   REST and GraphQL options provide flexibility for different third-party needs.
-   Webhook system enables event-driven integrations.
-   Clear API contracts (DTOs, OpenAPI, GraphQL schema) facilitate third-party development.
-   The placeholder `DataAccessService` and sample controllers/resolvers are designed to be easily replaced or extended with actual Ad Manager resource APIs.

### 11.3 Maintainability
-   Built with NestJS, a well-structured framework.
-   TypeScript for static typing and improved code quality.
-   Separation of concerns (controllers, services, DTOs, modules).
-   Configuration centralized.
-   Automated API documentation via Swagger.

### 11.4 API Versioning (REQ-TCE-008.4)
-   The current design is namespaced under `/v1/`.
-   `AppStoreIntegrationV1Module` encapsulates this version. Future versions can be added as new modules.
-   The `ApiVersionPolicy.interface.ts` provides a structure for communicating lifecycle, but the actual implementation of exposing this policy (e.g., via a dedicated API endpoint or documentation portal) would be an additional small feature.

This SDS provides a comprehensive blueprint for developing the `AppStoreIntegration.ApiFrameworkEndpoints` module.