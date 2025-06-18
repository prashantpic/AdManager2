# Software Design Specification: CorePlatformIntegration.ServiceApi

## 1. Introduction

### 1.1 Purpose
This document provides a detailed design specification for the `CorePlatformIntegration.ServiceApi` repository. This internal service API acts as a crucial bridge, enabling other Ad Manager microservices to interact with the `[PlatformName]` core e-commerce platform. It abstracts the complexities of direct core platform integration, providing a consistent gRPC interface for functionalities such as product data synchronization, user authentication delegation, customer data access for promotions, and order data retrieval.

### 1.2 Scope
The scope of this document is limited to the `CorePlatformIntegration.ServiceApi` microservice. This includes:
-   Definition of its gRPC service interface.
-   Internal modules, controllers, services, and clients responsible for interacting with the `[PlatformName]` core platform.
-   Data Transfer Objects (DTOs) and Protocol Buffer message definitions.
-   Configuration management for core platform API connections.
-   Error handling, security considerations, and compliance aspects related to core platform integration.

This service does **not** directly interact with end-users or merchants. It is consumed by other backend Ad Manager services.

### 1.3 Definitions, Acronyms, and Abbreviations
-   **API**: Application Programming Interface
-   **DTO**: Data Transfer Object
-   **gRPC**: Google Remote Procedure Call
-   **HTTP**: Hypertext Transfer Protocol
-   **JSON**: JavaScript Object Notation
-   **JWT**: JSON Web Token
-   **PaaS**: Platform as a Service
-   **Proto**: Protocol Buffers definition file
-   **REQ**: Requirement ID
-   **REST**: Representational State Transfer
-   **SDS**: Software Design Specification
-   **SDK**: Software Development Kit
-   **[PlatformName]**: Placeholder for the actual core e-commerce platform's name.

### 1.4 References
-   User Requirements Document for Ad Manager Platform
-   Ad Manager Platform Architecture Design Document
-   `CorePlatformIntegration.ServiceApi` Repository File Structure Definition
-   Relevant `[PlatformName]` Core Platform API documentation (external)
-   Requirement IDs: REQ-CPSI-001, REQ-CPSI-002, REQ-CPSI-003, REQ-CPSI-004, REQ-CPSI-005, REQ-CPSI-006, REQ-CPSI-007, REQ-CPSI-008, 2.5, 3.1.2 (Direct Order)

### 1.5 Overview
The `CorePlatformIntegration.ServiceApi` is a NestJS-based microservice that exposes its functionalities via gRPC. It is structured into several modules, each handling a specific aspect of integration with the `[PlatformName]` core platform. These modules include product integration, authentication integration, customer data integration, order data integration, and direct order integration. The service relies on HTTP clients to communicate with the `[PlatformName]` core APIs and uses Protocol Buffers for defining its gRPC service contract.

## 2. System Overview
The `CorePlatformIntegration.ServiceApi` is an internal backend microservice within the Ad Manager platform. It acts as a facade or an anti-corruption layer between Ad Manager services and the `[PlatformName]` core e-commerce platform. Its primary responsibility is to provide a stable and well-defined gRPC interface for core platform functionalities, shielding other Ad Manager services from the specifics of the core platform's APIs.

**Key Responsibilities:**
-   Synchronize product data from `[PlatformName]` to Ad Manager.
-   Handle conflicts between `[PlatformName]` product data and Ad Manager overrides.
-   Delegate user authentication requests to the `[PlatformName]` authentication system.
-   Provide access to customer data from `[PlatformName]` for promotion eligibility checks.
-   Retrieve order and sales data from `[PlatformName]` for Ad Manager analytics.
-   Generate deep-links for the `[PlatformName]` 'Direct Order' feature.
-   Ensure all interactions comply with `[PlatformName]`'s data governance and IT security standards.

## 3. Detailed Design

This section details the design of each component within the `CorePlatformIntegration.ServiceApi` repository, based on the provided file structure.

### 3.1 `package.json`
-   **Purpose**: Manages Node.js package dependencies and project scripts.
-   **Dependencies**:
    -   `@nestjs/core`, `@nestjs/common`, `@nestjs/config`, `@nestjs/platform-express`
    -   `@nestjs/microservices` (for gRPC transport)
    -   `@grpc/grpc-js`, `google-protobuf` (for gRPC and Protocol Buffers)
    -   `@nestjs/axios`, `axios` (for HTTP client to `[PlatformName]` core APIs)
    -   `class-validator`, `class-transformer` (for DTO validation and transformation)
    -   `reflect-metadata`
    -   Dev Dependencies: `@types/node`, `typescript`, `ts-loader`, `eslint`, `prettier`, `@nestjs/testing`, `jest`, `ts-jest`, `supertest` (if any HTTP endpoints were for testing, though primarily gRPC).
-   **Scripts**:
    -   `start`: Runs the compiled application.
    -   `start:dev`: Runs the application in development mode with watch.
    -   `build`: Compiles TypeScript to JavaScript.
    -   `lint`: Lints the codebase.
    -   `test`: Runs unit tests.
    -   `test:e2e`: Runs end-to-end tests (if applicable for gRPC service testing).
    -   `format`: Formats code using Prettier.
    -   `proto:generate`: Script to generate TypeScript typings from `.proto` files using `grpc-tools` or similar.

### 3.2 `tsconfig.json`
-   **Purpose**: Configures the TypeScript compiler.
-   **Key Settings**:
    -   `module`: "commonjs"
    -   `declaration`: true
    -   `removeComments`: true
    -   `emitDecoratorMetadata`: true
    -   `experimentalDecorators`: true
    -   `allowSyntheticDefaultImports`: true
    -   `target`: "ES2021" (or newer LTS Node compatible)
    -   `sourceMap`: true
    -   `outDir`: "./dist"
    -   `baseUrl`: "./"
    -   `incremental`: true
    -   `skipLibCheck`: true
    -   `strictNullChecks`: true (recommended)
    -   `noImplicitAny`: true (recommended)
    -   `paths`: { "@app/*": ["src/*"] } (or similar for module aliases)

### 3.3 `src/main.ts`
-   **Purpose**: Bootstraps the NestJS application and starts the gRPC microservice.
-   **Logic**:
    typescript
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    import { MicroserviceOptions, Transport } from '@nestjs/microservices';
    import { join } from 'path';
    import { Logger } from '@nestjs/common'; // Use NestJS Logger

    async function bootstrap() {
      const logger = new Logger('Bootstrap');
      const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
          transport: Transport.GRPC,
          options: {
            package: 'admanager.coreplatformintegration.service.v1', // Matches package in proto
            protoPath: join(__dirname, 'modules/core-platform-integration/service/protos/core_platform_integration.proto'),
            url: process.env.GRPC_SERVER_URL || '0.0.0.0:50051', // Configurable URL
            loader: {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true,
            },
          },
        },
      );
      await app.listen();
      logger.log(`CorePlatformIntegration gRPC Service is running on ${process.env.GRPC_SERVER_URL || '0.0.0.0:50051'}`);
    }
    bootstrap();
    

### 3.4 `src/app.module.ts`
-   **Purpose**: Root module for the service.
-   **Logic**:
    typescript
    import { Module } from '@nestjs/common';
    import { CorePlatformIntegrationModule } from './modules/core-platform-integration/service/core-platform-integration.module';
    import { ConfigModule } from '@nestjs/config';
    import { CorePlatformApiConfig } from './modules/core-platform-integration/service/common/config/core-platform-api.config'; // Import if using custom config registration

    @Module({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true, // Makes ConfigService available app-wide
          envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Environment-specific .env files
          load: [CorePlatformApiConfig], // Optional: if CorePlatformApiConfig is a factory
        }),
        CorePlatformIntegrationModule,
      ],
    })
    export class AppModule {}
    

### 3.5 `src/modules/core-platform-integration/service/core-platform-integration.module.ts`
-   **Purpose**: Encapsulates all components related to core platform integration.
-   **Logic**:
    typescript
    import { Module, Logger } from '@nestjs/common';
    import { HttpModule } from '@nestjs/axios';
    import { CorePlatformIntegrationGrpcController } from './core-platform-integration.grpc.controller';
    import { ProductIntegrationService } from './product-integration/product-integration.service';
    import { AuthIntegrationService } from './auth-integration/auth-integration.service';
    import { CustomerDataIntegrationService } from './customer-data-integration/customer-data-integration.service';
    import { OrderDataIntegrationService } from './order-data-integration/order-data-integration.service';
    import { DirectOrderIntegrationService } from './direct-order-integration/direct-order-integration.service';
    import { ProductClient } from './product-integration/product.client';
    import { AuthClient } from './auth-integration/auth.client';
    import { CustomerClient } from './customer-data-integration/customer.client';
    import { OrderClient } from './order-data-integration/order.client';
    import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigService
    import { CorePlatformApiConfig } from './common/config/core-platform-api.config';

    @Module({
      imports: [
        HttpModule.registerAsync({ // Async configuration for HttpModule
          imports: [ConfigModule], // Make ConfigService available
          useFactory: async (configService: ConfigService<CorePlatformApiConfig>) => ({
            timeout: configService.get('timeout', 5000), // Use configService
            maxRedirects: 5,
          }),
          inject: [ConfigService],
        }),
        ConfigModule, // Ensure ConfigModule is imported if not global in AppModule
      ],
      controllers: [CorePlatformIntegrationGrpcController],
      providers: [
        Logger, // Provide NestJS Logger
        ProductIntegrationService,
        AuthIntegrationService,
        CustomerDataIntegrationService,
        OrderDataIntegrationService,
        DirectOrderIntegrationService,
        ProductClient,
        AuthClient,
        CustomerClient,
        OrderClient,
        // CorePlatformApiConfig // If registered as a provider
      ],
    })
    export class CorePlatformIntegrationModule {}
    

### 3.6 `src/modules/core-platform-integration/service/protos/core_platform_integration.proto`
-   **Purpose**: Defines the gRPC service contract.
-   **Content**:
    protobuf
    syntax = "proto3";

    package admanager.coreplatformintegration.service.v1;

    import "modules/core-platform-integration/service/product-integration/protos/product_integration_messages.proto";
    import "modules/core-platform-integration/service/auth-integration/protos/auth_integration_messages.proto";
    import "modules/core-platform-integration/service/customer-data-integration/protos/customer_data_integration_messages.proto";
    import "modules/core-platform-integration/service/order-data-integration/protos/order_data_integration_messages.proto";
    import "modules/core-platform-integration/service/direct-order-integration/protos/direct_order_integration_messages.proto";
    import "modules/core-platform-integration/service/common/protos/common_messages.proto";

    service CorePlatformIntegration {
      // Product Integration
      rpc SynchronizeProduct (ProductSyncRequest) returns (ProductSyncResponse);
      rpc ResolveProductConflict (ProductConflictResolutionRequest) returns (ProductConflictResolutionResponse);

      // Auth Integration
      rpc DelegateAuthentication (AuthRequest) returns (AuthResponse);

      // Customer Data Integration
      rpc GetCustomerEligibility (CustomerEligibilityRequest) returns (CustomerEligibilityResponse);

      // Order Data Integration
      rpc GetOrderData (OrderDataRequest) returns (OrderDataResponse);

      // Direct Order Integration
      rpc GenerateDirectOrderLink (DirectOrderLinkRequest) returns (DirectOrderLinkResponse);

      // Common / Health
      rpc GetCorePlatformApiStatus (EmptyRequest) returns (ApiStatusResponse); // Example
    }
    
    *Note: Specific feature proto files (e.g., `product_integration_messages.proto`) will define their respective request/response messages.*

### 3.7 `src/modules/core-platform-integration/service/core-platform-integration.grpc.controller.ts`
-   **Purpose**: Handles incoming gRPC requests and delegates to services.
-   **Implementation Details**:
    -   Inject `ProductIntegrationService`, `AuthIntegrationService`, `CustomerDataIntegrationService`, `OrderDataIntegrationService`, `DirectOrderIntegrationService`, and `Logger`.
    -   Each public method will be decorated with `@GrpcMethod('CorePlatformIntegration', '<RpcMethodName>')`.
    -   Methods will take corresponding DTOs (defined in `.proto` and mirrored as TypeScript DTOs) as input.
    -   Input DTOs will be validated using `class-validator` (implicitly if a `ValidationPipe` is globally applied or explicitly).
    -   Delegate processing to the respective injected service.
    -   Implement try-catch blocks for robust error handling. Map service layer exceptions or core platform API errors to appropriate gRPC status codes (e.g., `status.INVALID_ARGUMENT`, `status.UNAVAILABLE`, `status.INTERNAL`, `status.NOT_FOUND`).
    -   Log requests, responses, and errors.
    -   **Methods**:
        -   `synchronizeProduct(data: ProductSyncRequestDto): Promise<ProductSyncResponseDto>`
        -   `delegateAuthentication(data: AuthRequestDto): Promise<AuthResponseDto>`
        -   `getCustomerEligibility(data: CustomerEligibilityRequestDto): Promise<CustomerEligibilityResponseDto>`
        -   `getOrderData(data: OrderDataRequestDto): Promise<OrderDataResponseDto>`
        -   `generateDirectOrderLink(data: DirectOrderLinkRequestDto): Promise<DirectOrderLinkResponseDto>`
        -   `resolveProductConflict(data: ProductConflictResolutionRequestDto): Promise<ProductConflictResolutionResponseDto>`
        -   `getCorePlatformApiStatus(data: EmptyRequestDto): Promise<ApiStatusResponseDto>`
            -   This method could iterate through clients to ping their respective core platform API endpoints or check a cached status.

### 3.8 Common Components

#### 3.8.1 `src/modules/core-platform-integration/service/common/config/core-platform-api.config.ts`
-   **Purpose**: Provides type-safe configuration for `[PlatformName]` core APIs.
-   **Implementation**:
    typescript
    import { registerAs } from '@nestjs/config';

    export interface CorePlatformApiConfigInterface {
      baseUrl: string;
      timeout: number;
      retryAttempts: number;
      productApiEndpoint: string;
      authApiEndpoint: string;
      customerApiEndpoint: string;
      orderApiEndpoint: string;
      // Add API keys/secrets if absolutely necessary here,
      // but prefer fetching from a secrets manager in client initialization.
      // Example: apiKey: string;
    }

    export const CorePlatformApiConfig = registerAs('corePlatformApi', (): CorePlatformApiConfigInterface => ({
      baseUrl: process.env.CORE_PLATFORM_BASE_URL || 'http://localhost:3000/api', // Example
      timeout: parseInt(process.env.CORE_PLATFORM_API_TIMEOUT_MS, 10) || 5000,
      retryAttempts: parseInt(process.env.CORE_PLATFORM_API_RETRY_ATTEMPTS, 10) || 3,
      productApiEndpoint: process.env.CORE_PLATFORM_PRODUCT_API_ENDPOINT || '/products',
      authApiEndpoint: process.env.CORE_PLATFORM_AUTH_API_ENDPOINT || '/auth/verify',
      customerApiEndpoint: process.env.CORE_PLATFORM_CUSTOMER_API_ENDPOINT || '/customers',
      orderApiEndpoint: process.env.CORE_PLATFORM_ORDER_API_ENDPOINT || '/orders',
      // apiKey: process.env.CORE_PLATFORM_API_KEY, // Load from env
    }));
    
    *Note: API keys should ideally be fetched from a secure secrets manager (e.g., AWS Secrets Manager) at runtime rather than being directly in environment variables for production.*

#### 3.8.2 `src/modules/core-platform-integration/service/common/clients/base-core-platform.client.ts`
-   **Purpose**: Base client for common API interaction logic.
-   **Implementation**:
    -   Constructor injects `HttpService` (from `@nestjs/axios`), `ConfigService` (to access `CorePlatformApiConfig`), and `Logger`.
    -   Protected `get<T>(endpoint: string, params?: any, headers?: any): Promise<T>` method:
        -   Constructs full URL using `baseUrl` from config and provided `endpoint`.
        -   Makes HTTP GET request using `this.httpClient.get()`.
        -   Implements retry logic (e.g., using `rxjs/retry` or a custom loop) based on `retryAttempts` from config for transient errors (e.g., 5xx status codes, network errors).
        -   Uses `timeout` from config.
        -   Includes common headers (e.g., `Authorization` if an API key is used, `Content-Type`).
        -   Calls `handleError` on failure.
        -   Logs request and response/error.
    -   Protected `post<T>(endpoint: string, data: any, headers?: any): Promise<T>` method: Similar to `get` but for POST requests.
    -   Private `handleError(error: AxiosError): never`:
        -   Logs the detailed error.
        -   Maps `AxiosError` (status codes, messages from `[PlatformName]` API) to standardized internal exceptions (e.g., `CorePlatformApiUnavailableException`, `CorePlatformApiBadRequestException`, `CorePlatformApiUnauthorizedException`). These custom exceptions can then be caught by the gRPC controller and mapped to gRPC status codes.
        -   Throws the mapped internal exception.
    -   Will enforce compliance with `[PlatformName]` IT security standards (REQ-CPSI-008) such as required headers, secure connection protocols (handled by Axios over HTTPS).

#### 3.8.3 DTOs (`api-status-response.dto.ts`, `empty-request.dto.ts`) & Protos (`common_messages.proto`)
-   As defined in the file structure. DTOs will use `class-validator` decorators. Proto messages will mirror DTO structures.

### 3.9 Product Integration

#### 3.9.1 `src/modules/core-platform-integration/service/product-integration/product-integration.service.ts`
-   **Purpose**: Logic for product data synchronization and conflict resolution.
-   **Methods**:
    -   `synchronizeProducts(request: ProductSyncRequestDto): Promise<ProductSyncResponseDto>`:
        -   Logs request.
        -   If `request.forceFullSync` is true or no previous sync timestamp exists for `request.merchantId`, calls `this.productClient.fetchAllProducts()`.
        -   Otherwise, calls `this.productClient.fetchAllProducts(lastSyncTimestamp)`.
        -   For each fetched product from `[PlatformName]`:
            -   Check if a corresponding Ad Manager product override exists (this would typically involve querying another Ad Manager service or a local cache of override metadata, not directly handled in this integration service but a conceptual dependency for conflict detection).
            -   If a conflict is detected (e.g., `[PlatformName]` product updated, Ad Manager override exists):
                -   Increment `conflictsDetected`.
                -   Apply the merchant's configured conflict resolution strategy (REQ-CPSI-002) which could be:
                    -   `PRIORITIZE_AD_MANAGER`: Log and do nothing with the core data for this product.
                    -   `PRIORITIZE_CORE_PLATFORM`: Log and signal Ad Manager to update its view based on core data (override might be lost or flagged).
                    -   `MANUAL_REVIEW_NOTIFICATION`: Send an event/notification (e.g., via SQS/SNS) to another Ad Manager service to flag this for merchant review.
                    -   (Conceptual: This service might emit an event `ProductConflictDetectedEvent` rather than directly handling notifications.)
            -   If no conflict, or conflict resolved by prioritizing core platform, emit an event `CoreProductUpdatedEvent` for Ad Manager's ProductCatalogService to consume and update its local representation of the base product.
        -   Increment `productsProcessed` (or `productsSynced` based on successful processing).
        -   Update `lastSyncTimestamp` for the merchant.
        -   Return `ProductSyncResponseDto`.
    -   `resolveConflict(request: ProductConflictResolutionRequestDto): Promise<ProductConflictResolutionResponseDto>`:
        -   This method is likely called *by* another Ad Manager service after a merchant makes a decision on a conflict.
        -   Logs request.
        -   Based on `request.resolutionStrategy` (e.g., 'USE_CORE_VALUE', 'USE_AD_MANAGER_VALUE'):
            -   If 'USE_CORE_VALUE', emit `CoreProductUpdatedEvent` with core platform data for the product.
            -   If 'USE_AD_MANAGER_VALUE', signal that the Ad Manager override should be maintained (might be a no-op here if this service only syncs *from* core).
        -   Returns `ProductConflictResolutionResponseDto` indicating success.

#### 3.9.2 `src/modules/core-platform-integration/service/product-integration/product.client.ts`
-   **Purpose**: Client for `[PlatformName]` Product API.
-   **Inheritance**: Extends `BaseCorePlatformClient`.
-   **Methods**:
    -   `fetchProductById(productId: string): Promise<CoreProductDto>`:
        -   Constructs endpoint path (e.g., `${this.configService.get('productApiEndpoint')}/${productId}`).
        -   Calls `super.get<CoreProductDto>(path)`.
        -   Maps response to `CoreProductDto`.
    -   `fetchAllProducts(lastSyncTimestamp?: Date): Promise<CoreProductDto[]>`:
        -   Constructs endpoint path (e.g., `this.configService.get('productApiEndpoint')`).
        -   Adds query parameters if `lastSyncTimestamp` is provided (e.g., `?updated_since=timestamp`).
        -   Handles pagination if the `[PlatformName]` API uses it.
        -   Calls `super.get<CorePlatformProductApiResponse[]>(path, queryParams)`. (Assuming API might return a wrapped response).
        -   Maps response array to `CoreProductDto[]`.

#### 3.9.3 DTOs & Protos (Product Integration)
-   `product-sync-request.dto.ts`, `product-sync-response.dto.ts`, `core-product.dto.ts`, `product-conflict-resolution-request.dto.ts`, `product-conflict-resolution-response.dto.ts`:
    -   TypeScript classes with properties as defined in the file structure.
    -   Use `class-validator` decorators for validation (e.g., `@IsString()`, `@IsBoolean()`, `@IsOptional()`, `@IsNumber()`).
-   `product_integration_messages.proto`:
    -   Defines `message ProductSyncRequest`, `ProductSyncResponse`, `CoreProduct`, `ProductConflictResolutionRequest`, `ProductConflictResolutionResponse` mirroring the DTOs.
    -   Use appropriate Protobuf scalar types (string, bool, int32, double, etc.).
    -   For `CoreProduct.lastUpdatedAt`, use `google.protobuf.Timestamp`.
    -   For `ProductConflictResolutionRequest.corePlatformValue` and `adManagerOverrideValue`, use `google.protobuf.Any` or define specific variant messages if the types are known and limited. Given "any" in DTO, `google.protobuf.StringValue` or `bytes` representing JSON string might be safer for initial implementation if types are truly variable.

### 3.10 Auth Integration

#### 3.10.1 `src/modules/core-platform-integration/service/auth-integration/auth-integration.service.ts`
-   **Purpose**: Delegates user authentication to `[PlatformName]` core.
-   **Methods**:
    -   `delegateAuthentication(request: AuthRequestDto): Promise<AuthResponseDto>`:
        -   Logs request (masking password).
        -   Prepares `CoreAuthCredentialsDto` (internal DTO for `AuthClient`).
        -   Calls `this.authClient.verifyCredentials(coreAuthCredentials)`.
        -   Maps the `CoreAuthResponseDto` from the client to the gRPC `AuthResponseDto`.
        -   Handles errors from `AuthClient` and maps them appropriately.

#### 3.10.2 `src/modules/core-platform-integration/service/auth-integration/auth.client.ts`
-   **Purpose**: Client for `[PlatformName]` Authentication API.
-   **Inheritance**: Extends `BaseCorePlatformClient`.
-   **Methods**:
    -   `verifyCredentials(credentials: CoreAuthCredentialsDto): Promise<CoreAuthResponseDto>`:
        -   Constructs endpoint path (e.g., `this.configService.get('authApiEndpoint')`).
        -   Sends credentials (e.g., username/password or token) via `super.post<CoreAuthResponseDto>(path, credentialsPayload)`.
        -   The `credentialsPayload` should match what the `[PlatformName]` auth API expects.
        -   Maps the `[PlatformName]` API's auth response to `CoreAuthResponseDto`.

#### 3.10.3 DTOs & Protos (Auth Integration)
-   `auth-request.dto.ts`, `auth-response.dto.ts`:
    -   Implement as per file structure, with `class-validator` decorators.
    -   `AuthRequestDto` should allow for different auth mechanisms (e.g., username/password, token) possibly using optional fields and validation groups if complex.
-   Internal DTOs (not directly in gRPC proto but used between service and client):
    -   `CoreAuthCredentialsDto`: `username?: string; password?: string; token?: string;`
    -   `CoreAuthResponseDto`: `isAuthenticated: boolean; userId?: string; coreSessionToken?: string; roles?: string[]; error?: string;`
-   `auth_integration_messages.proto`:
    -   Defines `message AuthRequest` (with `oneof` for credentials vs token) and `AuthResponse` mirroring the DTOs.

### 3.11 Customer Data Integration

#### 3.11.1 `src/modules/core-platform-integration/service/customer-data-integration/customer-data-integration.service.ts`
-   **Purpose**: Fetches customer data for promotion eligibility.
-   **Methods**:
    -   `getCustomerEligibility(request: CustomerEligibilityRequestDto): Promise<CustomerEligibilityResponseDto>`:
        -   Logs request.
        -   Validates `request.eligibilityCriteria` format.
        -   Determines which customer attributes are needed from `request.eligibilityCriteria`.
        -   Calls `this.customerClient.fetchCustomerAttributes(request.customerId, requiredAttributes)`.
        -   Applies the eligibility logic based on fetched attributes and `request.eligibilityCriteria`.
        -   Ensures data handling complies with REQ-CPSI-008.
        -   Returns `CustomerEligibilityResponseDto`.

#### 3.11.2 `src/modules/core-platform-integration/service/customer-data-integration/customer.client.ts`
-   **Purpose**: Client for `[PlatformName]` Customer API.
-   **Inheritance**: Extends `BaseCorePlatformClient`.
-   **Methods**:
    -   `fetchCustomerAttributes(customerId: string, attributes: string[]): Promise<CoreCustomerAttributesDto>`:
        -   Constructs endpoint path (e.g., `${this.configService.get('customerApiEndpoint')}/${customerId}/attributes`).
        -   Passes `attributes` array as query parameters (e.g., `?fields=isNewCustomer,segment`).
        -   Calls `super.get<CoreCustomerAttributesDto>(path, queryParams)`.
        -   Maps response to `CoreCustomerAttributesDto`.

#### 3.11.3 DTOs & Protos (Customer Data Integration)
-   `customer-eligibility-request.dto.ts`, `customer-eligibility-response.dto.ts`:
    -   Implement as per file structure, with `class-validator` decorators.
    -   `CustomerEligibilityRequestDto.eligibilityCriteria` could be a JSON object like `{"isNewCustomer": true, "segment": "VIP"}`.
-   Internal DTO:
    -   `CoreCustomerAttributesDto`: A flexible DTO, perhaps `{[key: string]: any;}` or more strongly typed if attributes are known. E.g., `isNewCustomer?: boolean; segment?: string; totalSpend?: number;`
-   `customer_data_integration_messages.proto`:
    -   Defines `CustomerEligibilityRequest` (using `google.protobuf.Struct` for `eligibilityCriteria` if it's a flexible JSON object) and `CustomerEligibilityResponse`.

### 3.12 Order Data Integration

#### 3.12.1 `src/modules/core-platform-integration/service/order-data-integration/order-data-integration.service.ts`
-   **Purpose**: Retrieves order data for analytics.
-   **Methods**:
    -   `getOrderData(request: OrderDataRequestDto): Promise<OrderDataResponseDto>`:
        -   Logs request.
        -   Constructs date range if provided.
        -   If `request.campaignIds` are present, potentially loop or pass them to the client (depends on `[PlatformName]` Order API capabilities).
        -   Calls `this.orderClient.fetchOrders(params)` where `params` include `merchantId`, `campaignIds`, `dateFrom`, `dateTo`.
        -   Returns `OrderDataResponseDto` containing the list of `CoreOrderDto`.

#### 3.12.2 `src/modules/core-platform-integration/service/order-data-integration/order.client.ts`
-   **Purpose**: Client for `[PlatformName]` Order API.
-   **Inheritance**: Extends `BaseCorePlatformClient`.
-   **Methods**:
    -   `fetchOrders(params: { merchantId: string; campaignIds?: string[]; dateFrom?: string; dateTo?: string; }): Promise<CoreOrderDto[]>`:
        -   Constructs endpoint path (e.g., `this.configService.get('orderApiEndpoint')`).
        -   Constructs query parameters based on `params`. The `[PlatformName]` Order API needs to support filtering by these criteria.
        -   Handles pagination if the Order API supports it.
        -   Calls `super.get<CoreOrderPlatformApiResponse[]>(path, queryParams)`.
        -   Maps response to `CoreOrderDto[]`.
    -   `fetchOrderById(orderId: string): Promise<CoreOrderDto>`: (May not be directly used by gRPC service but good utility)
        -   Constructs endpoint path (e.g., `${this.configService.get('orderApiEndpoint')}/${orderId}`).
        -   Calls `super.get<CoreOrderDto>(path)`.

#### 3.12.3 DTOs & Protos (Order Data Integration)
-   `order-data-request.dto.ts`, `order-data-response.dto.ts`, `core-order.dto.ts` (and `core-order-item.dto.ts` if `CoreOrderDto.items` is complex):
    -   Implement as per file structure, with `class-validator` decorators.
    -   `CoreOrderItemDto`: `productId: string; quantity: number; unitPrice: number; totalPrice: number;`
-   `order_data_integration_messages.proto`:
    -   Defines `OrderDataRequest`, `OrderDataResponse`, `CoreOrder`, `CoreOrderItem`.
    -   Use `google.protobuf.Timestamp` for dates/timestamps.

### 3.13 Direct Order Integration

#### 3.13.1 `src/modules/core-platform-integration/service/direct-order-integration/direct-order-integration.service.ts`
-   **Purpose**: Generates 'Direct Order' deep-links.
-   **Methods**:
    -   `generateDirectOrderLink(request: DirectOrderLinkRequestDto): Promise<DirectOrderLinkResponseDto>`:
        -   Logs request.
        -   Retrieves the base URL for the `[PlatformName]` 'Direct Order' feature (possibly from `CorePlatformApiConfig` or a dedicated config).
        -   Constructs the deep-link URL string using the base URL and query parameters from `request.productId`, `request.quantity`, and `request.merchantId` as per `[PlatformName]` specifications for Direct Order links.
        -   Example: `https://[PlatformNameDomain]/direct-order?merchantId=${request.merchantId}&productId=${request.productId}&quantity=${request.quantity || 1}`.
        -   Returns `DirectOrderLinkResponseDto` with the `deepLinkUrl`.

#### 3.13.2 DTOs & Protos (Direct Order Integration)
-   `direct-order-link-request.dto.ts`, `direct-order-link-response.dto.ts`:
    -   Implement as per file structure, with `class-validator` decorators.
-   `direct_order_integration_messages.proto`:
    -   Defines `DirectOrderLinkRequest` and `DirectOrderLinkResponse`.

## 4. Data Design (Protocol Buffers)
The primary data design revolves around the Protocol Buffer definitions (`.proto` files) which define the gRPC service contracts and message structures.

-   **`core_platform_integration.proto`**: Master service definition, imports messages from feature-specific proto files.
-   **`product_integration_messages.proto`**: Messages for product sync and conflict resolution (e.g., `ProductSyncRequest`, `ProductSyncResponse`, `CoreProduct`).
-   **`auth_integration_messages.proto`**: Messages for authentication (e.g., `AuthRequest`, `AuthResponse`).
-   **`customer_data_integration_messages.proto`**: Messages for customer eligibility (e.g., `CustomerEligibilityRequest`, `CustomerEligibilityResponse`).
-   **`order_data_integration_messages.proto`**: Messages for order data (e.g., `OrderDataRequest`, `OrderDataResponse`, `CoreOrder`, `CoreOrderItem`).
-   **`direct_order_integration_messages.proto`**: Messages for direct order links (e.g., `DirectOrderLinkRequest`, `DirectOrderLinkResponse`).
-   **`common_messages.proto`**: Common messages like `EmptyRequest` and `ApiStatusResponse`.

Each message type in Protobuf will have a corresponding TypeScript DTO class in the respective `dtos` folder. These DTOs will be used internally within the NestJS service and for validation. The gRPC framework handles serialization/deserialization between Protobuf messages and JavaScript objects.

## 5. Interface Design

### 5.1 gRPC Service Interface
Defined in `core_platform_integration.proto`. See section 3.6.

### 5.2 Internal Client Interfaces (Conceptual)
The `*Client.ts` files (`ProductClient`, `AuthClient`, etc.) define the TypeScript interface for interacting with the `[PlatformName]` core platform's REST APIs. These are internal to this service.

## 6. Error Handling
-   **Client-Side (within `*Client.ts` and `BaseCorePlatformClient`)**:
    -   HTTP errors from `[PlatformName]` (4xx, 5xx) will be caught.
    -   The `BaseCorePlatformClient.handleError` method will map these to specific internal custom exceptions (e.g., `CorePlatformNotFoundException`, `CorePlatformBadRequestException`, `CorePlatformServiceUnavailableException`).
    -   Retry logic will be implemented in `BaseCorePlatformClient` for transient errors (e.g., 502, 503, 504, network timeouts) using exponential backoff and jitter.
-   **Service-Side (within `*IntegrationService.ts`)**:
    -   Services will catch custom exceptions thrown by clients.
    -   Business logic errors within services (e.g., invalid state for operation) will also result in custom exceptions.
-   **Controller-Side (`CorePlatformIntegrationGrpcController.ts`)**:
    -   A global gRPC exception filter (or try-catch blocks in each RPC method) will catch all exceptions.
    -   Custom exceptions will be mapped to appropriate gRPC status codes and messages.
        -   e.g., `CorePlatformNotFoundException` -> `grpc.status.NOT_FOUND`
        -   e.g., `CorePlatformBadRequestException` / DTO validation errors -> `grpc.status.INVALID_ARGUMENT`
        -   e.g., `CorePlatformServiceUnavailableException` -> `grpc.status.UNAVAILABLE`
        -   Unhandled/unexpected errors -> `grpc.status.INTERNAL`
    -   Detailed error messages (safe for internal consumption) can be logged. Client-facing gRPC error messages should be more generic if sensitive details are involved.

## 7. Security Considerations
-   **Authentication**: This service delegates authentication to `[PlatformName]` (REQ-CPSI-003). It does not manage user credentials itself.
-   **Authorization**: As an internal service, it's assumed that consuming Ad Manager services are already authenticated and authorized within the Ad Manager ecosystem. If fine-grained authorization is needed at this layer (e.g., ensuring a service call is for a merchant the caller has rights to), JWTs passed from the calling service could be validated, or an internal authorization mechanism used. This is not explicitly detailed in requirements for *this specific service* beyond delegating auth.
-   **Data In Transit**:
    -   gRPC communication with other Ad Manager services should use TLS.
    -   HTTP communication with `[PlatformName]` core APIs must use HTTPS.
-   **Data At Rest**: This service is primarily a pass-through/integration layer and does not have its own persistent storage beyond temporary caches if implemented.
-   **API Keys/Secrets**: Configuration for `[PlatformName]` APIs (e.g., API keys) must be managed securely, preferably through AWS Secrets Manager or a similar solution, and accessed via `ConfigService`. Avoid hardcoding or storing in version control.
-   **Input Validation**: All DTOs for gRPC methods must be rigorously validated using `class-validator` to prevent injection attacks or invalid data processing.
-   **Compliance**:
    -   Adherence to `[PlatformName]` core platform API specifications and versioning (REQ-CPSI-006).
    -   Compliance with `[PlatformName]`'s internal data governance policies and IT security standards when accessing and handling core platform data (REQ-CPSI-008). This includes logging access, respecting data sensitivity, and secure communication.
-   **Logging**: Sensitive information (like passwords in auth requests) must be masked in logs.

## 8. Deployment Considerations
-   The service will be containerized using Docker.
-   Deployment will be managed via CI/CD pipelines (e.g., AWS CodePipeline, CodeBuild, CodeDeploy).
-   It will run as a gRPC microservice, potentially on Amazon EKS or ECS.
-   Configuration (environment variables, `.env` files) will be managed per environment (dev, staging, prod).
-   The gRPC server URL (`GRPC_SERVER_URL`) needs to be configurable.
-   Logging should be configured to output to a centralized logging system (e.g., CloudWatch Logs).
-   Health checks for the gRPC service should be implemented for orchestrators.

## 9. Scalability and Performance
-   The service is designed to be stateless, allowing for horizontal scaling by running multiple instances.
-   Performance of interactions with `[PlatformName]` core APIs is a key dependency. Retry mechanisms and timeouts in clients help manage this.
-   Efficient use of `HttpModule` (Axios) with connection pooling.
-   Asynchronous operations (`async/await`) are used throughout to prevent blocking.
-   The choice of gRPC is optimized for inter-service communication performance.

## 10. Future Considerations / Extensibility
-   Adding new integration points with `[PlatformName]` would involve:
    1.  Defining new RPC methods in `.proto` files.
    2.  Creating new DTOs and Protobuf messages.
    3.  Adding new methods to `CorePlatformIntegrationGrpcController`.
    4.  Creating new `*IntegrationService.ts` and `*Client.ts` files or extending existing ones.
-   Versioning of the gRPC API can be managed through package names in `.proto` files (e.g., `v1`, `v2`).
-   The `BaseCorePlatformClient` provides a common pattern for adding new clients to different `[PlatformName]` APIs.