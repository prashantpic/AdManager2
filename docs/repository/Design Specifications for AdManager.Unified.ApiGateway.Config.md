# Software Design Specification: AdManager.Unified.ApiGateway.Config

## 1. Introduction

This document outlines the software design specification for the `AdManager.Unified.ApiGateway.Config` repository. This repository is responsible for defining, configuring, and managing the Unified API Gateway for the Ad Manager Platform using AWS Cloud Development Kit (CDK) in TypeScript. The API Gateway serves as the single, secure entry point for all external client requests, routing them to the appropriate backend microservices.

**Purpose of the API Gateway:**
*   Provide a unified and consistent interface to the platform's backend services.
*   Enforce security policies, including authentication and authorization.
*   Implement global rate limiting and throttling.
*   Handle SSL termination.
*   Manage API versioning.
*   Enable request/response transformations and aggregation if necessary.
*   Ensure CORS policies are correctly configured.

This SDS will detail the design of the CDK application, its components, and how it fulfills the specified requirements for the API Gateway.

## 2. Architecture Overview

The `AdManager.Unified.ApiGateway.Config` repository employs an Infrastructure as Code (IaC) approach using AWS CDK. The CDK application, written in TypeScript, programmatically defines all AWS resources required for the API Gateway, including:

*   **Amazon API Gateway (REST API):** The core service providing the API gateway functionality.
*   **Routes and Integrations:** Definitions of API paths, HTTP methods, and their integrations with backend microservices.
*   **Lambda Authorizers:** Custom AWS Lambda functions for JWT-based authentication and coarse-grained authorization.
*   **AWS WAF (Web Application Firewall):** Integration for protecting against common web exploits.
*   **Custom Domains and Stages:** Configuration for custom domain names (e.g., `api.admanager.example.com`) and deployment stages (e.g., `dev`, `prod`).
*   **OpenAPI Specifications:** Management and potential integration of OpenAPI (Swagger) definitions for API documentation and request validation.

The API Gateway will route requests to various backend microservices as defined by the overall system architecture. It acts as the gatekeeper, ensuring that only authenticated and authorized requests reach the backend.

**Diagrammatic Representation (Conceptual):**


+-----------------------+      +-------------------------+      +-------------------------+
| Merchant Portal (SPA) |----->|                         |<---->| Campaign Service        |
+-----------------------+      |                         |      +-------------------------+
                               |                         |
+-----------------------+      | Unified API Gateway     |      +-------------------------+
| Admin Portal (SPA)    |----->| (Amazon API Gateway)    |<---->| User Management Service |
+-----------------------+      | (Defined by this repo)  |      +-------------------------+
                               |                         |
+-----------------------+      |                         |      +-------------------------+
| Affiliate Portal (SPA)|----->|                         |<---->| Affiliate Service       |
+-----------------------+      |                         |      +-------------------------+
                               |                         |
+-----------------------+      |                         |      +-------------------------+
| Third-Party Apps      |----->|                         |<---->| (Scoped Backend Access) |
+-----------------------+      +-------------------------+      +-------------------------+
                                          ^
                                          |
                               +----------------------+
                               | JWT Lambda Authorizer|
                               +----------------------+
                                          ^
                                          |
                               +----------------------+
                               | AWS WAF              |
                               +----------------------+


## 3. Core Components & Modules

The AWS CDK application will be structured into several core components:

1.  **CDK Application Entry Point (`bin/api-gateway.ts`):** Initializes the CDK app and instantiates the main API Gateway stack.
2.  **Main API Gateway Stack (`lib/api-gateway-stack.ts`):** Orchestrates the creation of all API Gateway resources.
3.  **Configuration (`lib/config/`):** Defines typed configurations and default settings for the gateway.
4.  **Route Constructs (`lib/constructs/routes/`):** Modular constructs for defining API routes for different portals/clients (Merchant, Admin, Affiliate, Third-Party).
5.  **Authorizer Construct (`lib/constructs/authorizers/`):** Defines the JWT Lambda Authorizer and its integration.
6.  **WAF Integration Construct (`lib/constructs/waf-integration-construct.ts`):** Sets up AWS WAF.
7.  **OpenAPI Definitions Construct (`lib/constructs/openapi-definitions-construct.ts`):** Manages OpenAPI specification files.
8.  **Lambda Authorizer Code (`lambda-authorizers/jwt-validator/`):** The actual TypeScript code for the JWT validation Lambda function.
9.  **OpenAPI Specification Files (`openapi/`):** YAML files defining the API contracts.

## 4. Detailed Design for Repository Files

This section details the purpose, logic, and key configurations for each file defined in the repository structure.

### 4.1. Project Setup & Configuration Files

#### 4.1.1. `infrastructure/api-gateway/package.json`
*   **Purpose:** Manages Node.js project dependencies, scripts for CDK operations, and project metadata.
*   **Key Responsibilities/Logic:**
    *   Lists essential dependencies:
        *   `aws-cdk-lib`: Core AWS CDK library.
        *   `constructs`: Base class for CDK constructs.
        *   `@aws-cdk/aws-apigatewayv2-alpha` (or `aws-cdk-lib/aws-apigateway` for REST APIs): For API Gateway resources.
        *   `@aws-cdk/aws-lambda-nodejs` (or `aws-cdk-lib/aws-lambda-nodejs`): For Node.js Lambda functions.
        *   `aws-cdk-lib/aws-wafv2`: For WAFv2 resources.
        *   `jsonwebtoken`: For JWT handling in Lambda authorizer.
        *   `jwks-rsa`: For fetching JWKS keys in Lambda authorizer.
    *   Lists development dependencies:
        *   `typescript`: TypeScript compiler.
        *   `@types/node`: Type definitions for Node.js.
        *   `@types/aws-lambda`: Type definitions for AWS Lambda.
        *   `@types/jsonwebtoken`: Type definitions for `jsonwebtoken`.
        *   `aws-cdk`: CDK CLI (can be global or local).
        *   `ts-node`: For running TypeScript files directly.
        *   `jest`, `@types/jest`, `ts-jest`: For testing.
    *   Defines scripts:
        *   `build`: `tsc` (TypeScript compile).
        *   `watch`: `tsc -w`.
        *   `test`: `jest`.
        *   `cdk`: `cdk`.
        *   `synth`: `cdk synth`.
        *   `deploy`: `cdk deploy`.
        *   `diff`: `cdk diff`.
*   **Implemented Features:** CDK Project Setup, DependencyManagement.
*   **Requirement IDs:** `4.2.4` (AWS CDK usage implies this).

#### 4.1.2. `infrastructure/api-gateway/tsconfig.json`
*   **Purpose:** Configures the TypeScript compiler for the CDK application.
*   **Key Responsibilities/Logic:**
    *   Specifies compiler options:
        *   `target`: e.g., "ES2020" or later.
        *   `module`: e.g., "commonjs".
        *   `lib`: ["es2020", "dom"].
        *   `strict`: `true`.
        *   `esModuleInterop`: `true`.
        *   `experimentalDecorators`: `true` (if using NestJS-like decorators, though less common in pure CDK).
        *   `emitDecoratorMetadata`: `true` (if applicable).
        *   `skipLibCheck`: `true`.
        *   `forceConsistentCasingInFileNames`: `true`.
        *   `outDir`: e.g., "./dist" (though CDK often transpiles on the fly).
        *   `rootDir`: e.g., "./".
        *   `sourceMap`: `true` (for debugging).
*   **Implemented Features:** TypeScriptCompilation.
*   **Requirement IDs:** `4.2.4`.

#### 4.1.3. `infrastructure/api-gateway/cdk.json`
*   **Purpose:** Provides configuration for the AWS CDK command-line interface.
*   **Key Responsibilities/Logic:**
    *   Defines the `app` command to execute the CDK application: `npx ts-node --prefer-ts-exts bin/api-gateway.ts`.
    *   May include `context` variables for environment-specific configurations (e.g., account IDs, regions, domain names, backend service endpoints if not using SSM).
        json
        {
          "app": "npx ts-node --prefer-ts-exts bin/api-gateway.ts",
          "watch": {
            "include": [
              "**"
            ],
            "exclude": [
              "README.md",
              "cdk*.json",
              "**/*.d.ts",
              "**/*.js",
              "tsconfig.json",
              "package*.json",
              "yarn.lock",
              "node_modules",
              "test"
            ]
          },
          "context": {
            "@aws-cdk/aws-apigateway:usagePlanKeyOrderInsensitiveId": true,
            "@aws-cdk/core:stackRelativeExports": true,
            "@aws-cdk/aws-rds:lowercaseDbIdentifier": true,
            "@aws-cdk/aws-lambda:recognizeVersionProps": true,
            "@aws-cdk/aws-cloudfront:defaultSecurityPolicyTLSv1.2_2021": true,
            // Example context variables
            // "dev:customDomainName": "dev.api.admanager.example.com",
            // "prod:customDomainName": "api.admanager.example.com",
            // "dev:jwksUri": "https://dev-auth.example.com/.well-known/jwks.json"
          }
        }
        
*   **Implemented Features:** CDKToolkitConfiguration.
*   **Requirement IDs:** `4.2.4`.

### 4.2. CDK Application Core

#### 4.2.1. `infrastructure/api-gateway/bin/api-gateway.ts`
*   **Purpose:** Entry point for the AWS CDK application; initializes and synthesizes the API Gateway stack(s).
*   **Key Responsibilities/Logic:**
    *   Imports `aws-cdk-lib` (specifically `cdk.App`).
    *   Imports the main stack definition (`ApiGatewayStack` from `../lib/api-gateway-stack`).
    *   Creates a new `cdk.App()` instance.
    *   Instantiates `ApiGatewayStack`.
        *   Environment configurations (account, region) can be sourced from environment variables or CDK context.
        *   Passes stack-specific props, potentially including configurations loaded from `gateway-settings.ts` or environment context.
    typescript
    #!/usr/bin/env node
    import 'source-map-support/register';
    import * as cdk from 'aws-cdk-lib';
    import { ApiGatewayStack } from '../lib/api-gateway-stack';
    import { gatewayDefaultSettings } from '../lib/config/gateway-settings'; // Assuming settings are exported

    const app = new cdk.App();

    const env = {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    };

    // Example: Retrieve stage-specific config from CDK context or environment variables
    const stage = app.node.tryGetContext('stage') || process.env.STAGE || 'dev';
    const customDomainName = app.node.tryGetContext(`${stage}:customDomainName`) || process.env.CUSTOM_DOMAIN_NAME;
    const jwksUri = app.node.tryGetContext(`${stage}:jwksUri`) || process.env.JWKS_URI;
    const jwtIssuer = app.node.tryGetContext(`${stage}:jwtIssuer`) || process.env.JWT_ISSUER;
    const jwtAudience = (app.node.tryGetContext(`${stage}:jwtAudience`) || process.env.JWT_AUDIENCE || '').split(',');


    if (!jwksUri || !jwtIssuer || jwtAudience.length === 0 || jwtAudience[0] === '') {
        throw new Error(`JWKS URI, JWT Issuer, and JWT Audience must be provided for stage: ${stage}`);
    }

    new ApiGatewayStack(app, `AdManagerApiGatewayStack-${stage}`, {
      env,
      stackName: `AdManagerApiGateway-${stage}`,
      description: `API Gateway for Ad Manager Platform (${stage})`,
      stage,
      gatewayConfig: {
        ...gatewayDefaultSettings,
        customDomain: customDomainName ? {
          domainName: customDomainName,
          certificateArn: app.node.tryGetContext(`${stage}:certificateArn`) || process.env.CERTIFICATE_ARN, // Required if custom domain
          hostedZoneId: app.node.tryGetContext(`${stage}:hostedZoneId`) || process.env.HOSTED_ZONE_ID, // Required if custom domain
        } : undefined,
        // Add other stage specific overrides from gatewayDefaultSettings if needed
      },
      authorizerConfig: {
        jwksUri,
        jwtIssuer,
        jwtAudience,
        authorizerName: `JwtAuthorizer-${stage}`,
      },
      // Pass backend service URLs (from SSM, context, or direct for now)
      // Example:
      // campaignServiceUrl: app.node.tryGetContext(`${stage}:campaignServiceUrl`) || process.env.CAMPAIGN_SERVICE_URL,
    });

    app.synth();
    
*   **Implemented Features:** CDKAppInitialization.
*   **Requirement IDs:** `4.2.4`.

#### 4.2.2. `infrastructure/api-gateway/lib/config/gateway-settings.ts`
*   **Purpose:** Defines TypeScript interfaces and default constant values for API Gateway configurations.
*   **Key Responsibilities/Logic:**
    *   Exports interfaces:
        *   `CorsOptions` (can re-export from `aws-cdk-lib/aws-apigateway`).
        *   `CustomDomainConfig { domainName: string; certificateArn: string; hostedZoneId: string; basePath?: string; }`
        *   `GatewayConfig { defaultRateLimit?: number; defaultBurstLimit?: number; defaultCorsOptions?: apigateway.CorsOptions; customDomain?: CustomDomainConfig; stageName: string; }`
    *   Provides default constant values:
        typescript
        import * as apigateway from 'aws-cdk-lib/aws-apigateway';

        export interface CustomDomainConfig {
          domainName: string;
          certificateArn: string;
          hostedZoneId: string;
          basePath?: string;
          // Add securityPolicy if needed, e.g., apigateway.SecurityPolicy.TLS_1_2
        }

        export interface GatewayConfig {
          defaultRateLimit?: number;
          defaultBurstLimit?: number;
          defaultCorsOptions?: apigateway.CorsOptions;
          customDomain?: CustomDomainConfig;
          stageName: string; // e.g., 'dev', 'prod'
          // Add other global settings like API key source, etc.
        }

        export const gatewayDefaultSettings: Omit<GatewayConfig, 'stageName' | 'customDomain'> = {
          defaultRateLimit: 100, // requests per second
          defaultBurstLimit: 200, // burst capacity
          defaultCorsOptions: {
            allowOrigins: apigateway.Cors.ALL_ORIGINS, // Or specific origins
            allowMethods: apigateway.Cors.ALL_METHODS, // Or specific methods like ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
            allowHeaders: [
              'Content-Type',
              'X-Amz-Date',
              'Authorization',
              'X-Api-Key',
              'X-Amz-Security-Token',
              'X-Amz-User-Agent',
              'X-Correlation-ID', // Example custom header
            ],
            allowCredentials: true,
          },
        };
        
*   **Implemented Features:** GatewayConfigurationSchema.
*   **Requirement IDs:** `3.3.2.1`, `4.2.4`.

#### 4.2.3. `infrastructure/api-gateway/lib/interfaces/lambda-authorizer-props.ts`
*   **Purpose:** Defines the TypeScript interface for properties required by the JWT Lambda Authorizer construct.
*   **Key Responsibilities/Logic:**
    typescript
    export interface ILambdaAuthorizerProps {
      readonly jwksUri: string;
      readonly jwtIssuer: string;
      readonly jwtAudience: string[];
      readonly authorizerName: string;
      // Optional: tokenSource (e.g. 'method.request.header.Authorization')
      // Optional: resultsCacheTtl (e.g. cdk.Duration.minutes(5))
    }
    
*   **Implemented Features:** LambdaAuthorizerConfigurationSchema.
*   **Requirement IDs:** `3.2.4`, `REQ-IAM-007`.

#### 4.2.4. `infrastructure/api-gateway/lib/api-gateway-stack.ts`
*   **Purpose:** Main AWS CDK stack defining all API Gateway resources, routes, integrations, security, and operational configurations.
*   **Key Responsibilities/Logic:**
    *   **Initialization:**
        *   Accepts `stage`, `gatewayConfig`, `authorizerConfig`, and backend service URLs/ARNs as stack props.
        *   Creates `apigateway.RestApi` instance.
            *   Configure `defaultCorsPreflightOptions` using `gatewayConfig.defaultCorsOptions`.
            *   Configure `deployOptions` for the stage (e.g., `stageName`, `throttlingRateLimit`, `throttlingBurstLimit`).
            *   Enable CloudWatch logging and metrics for the API Gateway stage.
    *   **Authorizer Setup:**
        *   Instantiates `JwtLambdaAuthorizerConstruct` (see 4.3.3) using `authorizerConfig`.
    *   **Route Definitions:**
        *   Instantiates and uses route constructs:
            *   `MerchantApiRoutes`
            *   `AdminApiRoutes`
            *   `AffiliateApiRoutes`
            *   `ThirdPartyAppApiRoutes`
        *   Passes the `RestApi` instance, the authorizer instance, and relevant backend service integration details (URLs/ARNs of Lambda functions or HTTP endpoints) to these route constructs.
    *   **WAF Integration:**
        *   Instantiates `WafIntegrationConstruct` (see 4.3.4).
        *   Associates the created WebACL with the API Gateway stage.
    *   **Custom Domain & Base Path Mapping:**
        *   If `gatewayConfig.customDomain` is provided:
            *   Creates `apigateway.DomainName` and `apigateway.BasePathMapping`.
            *   Requires `certificateArn`, `hostedZoneId` from props.
    *   **OpenAPI Integration (Optional but Recommended):**
        *   Instantiates `OpenApiDefinitionsConstruct` (see 4.3.5).
        *   If using `apigateway.SpecRestApi`, provide the OpenAPI definition.
        *   Alternatively, configure models and request validators based on OpenAPI schemas for specific routes, if granular control is needed.
    *   **Outputs:**
        *   `CfnOutput` for API Gateway endpoint URL.
        *   `CfnOutput` for custom domain URL if configured.
*   **Key Methods (Conceptual):**
    *   `constructor(scope: Construct, id: string, props: ApiGatewayStackProps)`
    *   Helper methods like `private setupApiGatewayInstance()`, `private attachAuthorizer()`, `private configureRoutes()`, etc.
*   **Implemented Features:** APIGatewayResourceCreation, RouteDefinition, IntegrationSetup, AuthorizerAttachment, WAFIntegration, CustomDomainSetup, StageDeployment.
*   **Requirement IDs:** `3.3.2.1`, `4.2.4`, `3.2.4`, `3.3.2.3`, `REQ-IAM-007`, `REQ-TCE-008`, `REQ-POA-017`.
    typescript
    import * as cdk from 'aws-cdk-lib';
    import { Construct } from 'constructs';
    import * as apigateway from 'aws-cdk-lib/aws-apigateway';
    import * as lambda from 'aws-cdk-lib/aws-lambda';
    import * as acm from 'aws-cdk-lib/aws-certificatemanager';
    import * as route53 from 'aws-cdk-lib/aws-route53';
    import * as route53targets from 'aws-cdk-lib/aws-route53-targets';
    import { GatewayConfig } from './config/gateway-settings';
    import { ILambdaAuthorizerProps } from './interfaces/lambda-authorizer-props';
    import { JwtLambdaAuthorizerConstruct } from './constructs/authorizers/jwt-lambda-authorizer-construct';
    import { WafIntegrationConstruct } from './constructs/waf-integration-construct';
    import { MerchantApiRoutes } from './constructs/routes/merchant-api-routes';
    // Import other route constructs as they are defined
    // import { AdminApiRoutes } from './constructs/routes/admin-api-routes';
    // import { AffiliateApiRoutes } from './constructs/routes/affiliate-api-routes';
    // import { ThirdPartyAppApiRoutes } from './constructs/routes/third-party-app-api-routes';
    import { OpenApiDefinitionsConstruct } from './constructs/openapi-definitions-construct';


    export interface ApiGatewayStackProps extends cdk.StackProps {
      readonly stage: string;
      readonly gatewayConfig: GatewayConfig;
      readonly authorizerConfig: ILambdaAuthorizerProps;
      // Add props for backend service URLs/ARNs or SSM parameter names
      readonly campaignServiceEndpoint: string; // Example: URL of CampaignService
      readonly productCatalogServiceEndpoint: string; // Example
      readonly adminServiceEndpoint: string; // Example
      readonly affiliateServiceEndpoint: string; // Example
      readonly thirdPartyAppServiceEndpoint: string; // Example
    }

    export class ApiGatewayStack extends cdk.Stack {
      public readonly api: apigateway.RestApi;

      constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
        super(scope, id, props);

        // 1. Define OpenAPI specifications (optional, but good for request validation and docs)
        const openApiConstruct = new OpenApiDefinitionsConstruct(this, 'OpenApiDefs');

        // 2. Create the REST API instance
        this.api = new apigateway.RestApi(this, `AdManagerApi-${props.stage}`, {
          restApiName: `AdManager-API-${props.stage}`,
          description: `API Gateway for Ad Manager Platform (${props.stage})`,
          deployOptions: {
            stageName: props.stage,
            throttlingRateLimit: props.gatewayConfig.defaultRateLimit,
            throttlingBurstLimit: props.gatewayConfig.defaultBurstLimit,
            loggingLevel: apigateway.MethodLoggingLevel.INFO,
            dataTraceEnabled: true,
            metricsEnabled: true,
          },
          defaultCorsPreflightOptions: props.gatewayConfig.defaultCorsOptions,
          // For request validation using OpenAPI
          // models: { ... load models from openApiConstruct ... }
          // requestValidators: { ... define validators ... }
          // Can also use SpecRestApi if the entire API is defined in one OpenAPI file
          // apiDefinition: openApiConstruct.getCombinedApiDefinition(), // if applicable
        });

        // 3. Setup JWT Lambda Authorizer
        const jwtAuthorizerConstruct = new JwtLambdaAuthorizerConstruct(this, 'JwtAuthorizer', props.authorizerConfig);
        const authorizer = jwtAuthorizerConstruct.authorizer;


        // 4. Define Routes by instantiating route constructs
        // Example for Merchant Routes
        new MerchantApiRoutes(this, 'MerchantRoutes', {
            api: this.api,
            authorizer: authorizer,
            campaignServiceIntegration: new apigateway.HttpIntegration(props.campaignServiceEndpoint), // or LambdaIntegration
            productCatalogServiceIntegration: new apigateway.HttpIntegration(props.productCatalogServiceEndpoint), // or LambdaIntegration
            // ... other service integrations
        });

        // TODO: Instantiate AdminApiRoutes, AffiliateApiRoutes, ThirdPartyAppApiRoutes similarly
        // new AdminApiRoutes(this, 'AdminRoutes', { /* ... props ... */ });
        // new AffiliateApiRoutes(this, 'AffiliateRoutes', { /* ... props ... */ });
        // new ThirdPartyAppApiRoutes(this, 'ThirdPartyAppRoutes', { /* ... props ... */ });


        // 5. Setup AWS WAF Integration
        const wafConstruct = new WafIntegrationConstruct(this, 'WafProtection', {
          scope: 'REGIONAL', // For API Gateway
        });
        if (this.api.deploymentStage) {
            new cdk.aws_wafv2.CfnWebACLAssociation(this, 'WafAssociation', {
                resourceArn: this.api.deploymentStage.stageArn,
                webAclArn: wafConstruct.webAclArn,
            });
        }


        // 6. Setup Custom Domain (if configured)
        if (props.gatewayConfig.customDomain) {
          const domainConfig = props.gatewayConfig.customDomain;
          const certificate = acm.Certificate.fromCertificateArn(this, 'ApiCertificate', domainConfig.certificateArn);
          const customDomain = new apigateway.DomainName(this, 'ApiCustomDomain', {
            domainName: domainConfig.domainName,
            certificate: certificate,
            endpointType: apigateway.EndpointType.REGIONAL,
            // securityPolicy: apigateway.SecurityPolicy.TLS_1_2, // Recommended
          });

          new apigateway.BasePathMapping(this, 'ApiBasePathMapping', {
            domainName: customDomain,
            restApi: this.api,
            basePath: domainConfig.basePath || '', // e.g., 'v1' or empty for root
            stage: this.api.deploymentStage,
          });

          // Optional: Create Route 53 Alias record
          const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'ApiHostedZone', {
            hostedZoneId: domainConfig.hostedZoneId,
            zoneName: domainConfig.domainName.substring(domainConfig.domainName.indexOf('.') + 1), // Infer zoneName
          });

          new route53.ARecord(this, 'ApiAliasRecord', {
            zone: hostedZone,
            recordName: domainConfig.domainName.split('.')[0], // Just the subdomain part
            target: route53.RecordTarget.fromAlias(new route53targets.ApiGatewayDomain(customDomain)),
          });
            new cdk.CfnOutput(this, 'CustomApiEndpoint', {
                value: `https://${customDomain.domainName}/${domainConfig.basePath || ''}`,
                description: 'Custom API Gateway Endpoint URL',
            });
        }

        // 7. Outputs
        new cdk.CfnOutput(this, 'ApiEndpoint', {
          value: this.api.url,
          description: 'API Gateway Endpoint URL',
        });
         new cdk.CfnOutput(this, 'ApiId', {
            value: this.api.restApiId,
            description: 'API Gateway ID',
        });
      }
    }
    

### 4.3. CDK Constructs

#### 4.3.1. Route Constructs (`lib/constructs/routes/*.ts`)
This section describes the pattern for `merchant-api-routes.ts`. Other route files (`admin-api-routes.ts`, `affiliate-api-routes.ts`, `third-party-app-api-routes.ts`) will follow a similar structure, tailored to their specific endpoints and backend integrations.

**`infrastructure/api-gateway/lib/constructs/routes/merchant-api-routes.ts`**
*   **Purpose:** Encapsulates the definition of API Gateway routes and integrations for the Merchant Portal.
*   **Key Responsibilities/Logic:**
    *   Accepts `apigateway.RestApi` instance, `apigateway.IAuthorizer`, and backend service integration props (e.g., `campaignServiceIntegration: apigateway.Integration`).
    *   Defines API resources (paths) and methods on the provided `RestApi` root or sub-resources.
    *   **Example for Campaign Routes:**
        *   `const campaigns = props.api.root.addResource('campaigns');`
        *   `campaigns.addMethod('GET', props.campaignServiceIntegration, { authorizer: props.authorizer, /* requestParameters, models for validation */ });`
        *   `campaigns.addMethod('POST', props.campaignServiceIntegration, { authorizer: props.authorizer, /* ... */ });`
        *   `const campaignById = campaigns.addResource('{campaignId}');`
        *   `campaignById.addMethod('GET', props.campaignServiceIntegration, { authorizer: props.authorizer, /* ... */ });`
        *   `campaignById.addMethod('PUT', props.campaignServiceIntegration, { authorizer: props.authorizer, /* ... */ });`
    *   **Product Catalog Routes:** Similar structure for `/products`, `/product-catalogs`.
    *   **Analytics Routes:** Similar structure for `/analytics`.
    *   Configures `methodOptions` including the `authorizer`.
    *   Optionally integrates with `OpenApiDefinitionsConstruct` to set up request/response models for validation using `requestModels` and `methodResponses`.
*   **Inputs (Props):** `api: apigateway.RestApi`, `authorizer: apigateway.IAuthorizer`, backend integration objects (e.g., `apigateway.HttpIntegration` or `apigateway.LambdaIntegration`).
*   **Implemented Features:** MerchantPortalRouteDefinition, BackendServiceIntegration.
*   **Requirement IDs:** `3.3.2.1`, `4.2.4`.
    typescript
    // lib/constructs/routes/merchant-api-routes.ts
    import { Construct } from 'constructs';
    import * as apigateway from 'aws-cdk-lib/aws-apigateway';

    export interface MerchantApiRoutesProps {
      readonly api: apigateway.RestApi;
      readonly authorizer: apigateway.IAuthorizer;
      // Define integrations for each backend service the merchant API interacts with
      readonly campaignServiceIntegration: apigateway.Integration;
      readonly productCatalogServiceIntegration: apigateway.Integration;
      readonly analyticsServiceIntegration: apigateway.Integration;
      // ... add other integrations as needed (promotions, A/B tests, etc.)
    }

    export class MerchantApiRoutes extends Construct {
      constructor(scope: Construct, id: string, props: MerchantApiRoutesProps) {
        super(scope, id);

        const commonMethodOptions: apigateway.MethodOptions = {
            authorizer: props.authorizer,
            // Add API Key requirement if needed: apiKeyRequired: true
        };

        // --- Campaign Management Endpoints ---
        // Corresponds to REPO-CAMP-001 for campaign, ad set, ad, A/B test management
        const campaignsRoot = props.api.root.addResource('merchant').addResource('v1').addResource('campaigns'); // e.g. /merchant/v1/campaigns

        // GET /merchant/v1/campaigns
        campaignsRoot.addMethod('GET', props.campaignServiceIntegration, commonMethodOptions);
        // POST /merchant/v1/campaigns
        campaignsRoot.addMethod('POST', props.campaignServiceIntegration, commonMethodOptions);

        const campaignById = campaignsRoot.addResource('{campaignId}');
        // GET /merchant/v1/campaigns/{campaignId}
        campaignById.addMethod('GET', props.campaignServiceIntegration, commonMethodOptions);
        // PUT /merchant/v1/campaigns/{campaignId}
        campaignById.addMethod('PUT', props.campaignServiceIntegration, commonMethodOptions);
        // DELETE /merchant/v1/campaigns/{campaignId}
        // campaignById.addMethod('DELETE', props.campaignServiceIntegration, commonMethodOptions); // If applicable

        // TODO: Add routes for Ad Sets within a campaign
        // const adSets = campaignById.addResource('adsets');
        // adSets.addMethod('GET', props.campaignServiceIntegration, commonMethodOptions);
        // adSets.addMethod('POST', props.campaignServiceIntegration, commonMethodOptions);
        // ... and so on for /adsets/{adSetId}, /ads, /abtests

        // --- Product Catalog Management Endpoints ---
        // Corresponds to [ID_ProductCatalog_ApiEndpoints]
        const productCatalogsRoot = props.api.root.getResource('merchant')!.getResource('v1')!.addResource('product-catalogs');

        // GET /merchant/v1/product-catalogs
        productCatalogsRoot.addMethod('GET', props.productCatalogServiceIntegration, commonMethodOptions);
        // POST /merchant/v1/product-catalogs
        productCatalogsRoot.addMethod('POST', props.productCatalogServiceIntegration, commonMethodOptions);

        const catalogById = productCatalogsRoot.addResource('{catalogId}');
        // GET /merchant/v1/product-catalogs/{catalogId}
        catalogById.addMethod('GET', props.productCatalogServiceIntegration, commonMethodOptions);
        // ... other catalog methods

        // --- Analytics & Reporting Endpoints ---
        // Corresponds to [ID_Analytics_ApiEndpoints]
        const analyticsRoot = props.api.root.getResource('merchant')!.getResource('v1')!.addResource('analytics');
        // GET /merchant/v1/analytics/performance
        analyticsRoot.addResource('performance').addMethod('GET', props.analyticsServiceIntegration, commonMethodOptions);

        // --- Promotions & Offers ---
        // (Map to Promotions_ApiEndpoints)
        // const promotionsRoot = props.api.root.getResource('merchant')!.getResource('v1')!.addResource('promotions');
        // promotionsRoot.addMethod('GET', props.promotionsServiceIntegration, commonMethodOptions);

        // Add more routes for other merchant-facing features (A/B testing results, billing info view, etc.)
      }
    }
    
    *   **Note:** The other route constructs (`AdminApiRoutes`, `AffiliateApiRoutes`, `ThirdPartyAppApiRoutes`) will be structured similarly, referencing their specific backend integrations and OpenAPI definitions.

#### 4.3.2. `infrastructure/api-gateway/lib/constructs/authorizers/jwt-lambda-authorizer-construct.ts`
*   **Purpose:** Provisions the JWT Lambda Authorizer and its integration with API Gateway.
*   **Key Responsibilities/Logic:**
    *   Accepts `ILambdaAuthorizerProps`.
    *   Defines a `lambda_nodejs.NodejsFunction` resource:
        *   `entry`: Points to `lambda-authorizers/jwt-validator/index.ts`.
        *   `handler`: `handler`.
        *   `runtime`: e.g., `lambda.Runtime.NODEJS_20_X`.
        *   `bundling`: Configures esbuild options if needed.
        *   `environment`: Passes `JWKS_URI`, `JWT_ISSUER`, `JWT_AUDIENCE` from props.
    *   Creates an `apigateway.TokenAuthorizer` (or `RequestAuthorizer` if more complex input is needed):
        *   `handler`: The Lambda function created above.
        *   `identitySource`: e.g., `apigateway.IdentitySource.header('Authorization')`.
        *   `resultsCacheTtl`: Optional, e.g., `cdk.Duration.minutes(5)`.
        *   `authorizerName`: From props.
    *   Exposes the created `authorizer` instance.
*   **Inputs (Props):** `ILambdaAuthorizerProps`.
*   **Outputs:** `authorizer: apigateway.TokenAuthorizer`.
*   **Implemented Features:** JWTValidation, LambdaAuthorizerCreation, APIGatewayAuthorizerResource.
*   **Requirement IDs:** `3.2.4`, `REQ-IAM-007`, `REQ-03-004`.
    typescript
    // lib/constructs/authorizers/jwt-lambda-authorizer-construct.ts
    import * as cdk from 'aws-cdk-lib';
    import { Construct } from 'constructs';
    import * as apigateway from 'aws-cdk-lib/aws-apigateway';
    import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
    import * as lambda from 'aws-cdk-lib/aws-lambda';
    import * as path from 'path';
    import { ILambdaAuthorizerProps } from '../../interfaces/lambda-authorizer-props';

    export class JwtLambdaAuthorizerConstruct extends Construct {
      public readonly authorizer: apigateway.TokenAuthorizer; // Or RequestAuthorizer

      constructor(scope: Construct, id: string, props: ILambdaAuthorizerProps) {
        super(scope, id);

        const authorizerFn = new lambdaNodeJs.NodejsFunction(this, 'JwtValidatorLambda', {
          entry: path.join(__dirname, '../../../lambda-authorizers/jwt-validator/index.ts'),
          handler: 'handler',
          runtime: lambda.Runtime.NODEJS_20_X,
          memorySize: 256,
          timeout: cdk.Duration.seconds(10),
          environment: {
            JWKS_URI: props.jwksUri,
            JWT_ISSUER: props.jwtIssuer,
            JWT_AUDIENCE: props.jwtAudience.join(','), // Pass as comma-separated string
          },
          bundling: {
            minify: true,
            sourceMap: true,
            externalModules: ['aws-sdk'], // aws-sdk is available in Lambda runtime
          },
        });

        this.authorizer = new apigateway.TokenAuthorizer(this, props.authorizerName, {
          handler: authorizerFn,
          identitySource: apigateway.IdentitySource.header('Authorization'), // e.g., "Bearer <token>"
          resultsCacheTtl: cdk.Duration.minutes(5), // Cache policy results
          authorizerName: props.authorizerName,
        });
      }
    }
    

#### 4.3.3. `infrastructure/api-gateway/lib/constructs/waf-integration-construct.ts`
*   **Purpose:** Provisions AWS WAF protection for the API Gateway.
*   **Key Responsibilities/Logic:**
    *   Accepts optional props for custom rule configurations.
    *   Defines a `wafv2.CfnWebACL` resource.
        *   `scope`: `REGIONAL` (for API Gateway).
        *   `defaultAction`: `{ allow: {} }` or `{ block: {} }`.
        *   `visibilityConfig`: For CloudWatch metrics.
        *   `rules`: An array of WAF rules.
            *   Include AWS Managed Rule Groups (e.g., `AWSManagedRulesCommonRuleSet`, `AWSManagedRulesAmazonIpReputationList`, `AWSManagedRulesKnownBadInputsRuleSet`).
            *   Optionally, define custom rate-based rules or rules for SQL injection/XSS protection if not fully covered by managed rules.
    *   Exposes the `webAclArn`.
*   **Inputs (Props):** `WafIntegrationConstructProps` (optional, for rule customization and scope).
*   **Outputs:** `webAclArn: string`.
*   **Implemented Features:** WAFRuleDefinition, WebACLAssociation (association happens in the main stack).
*   **Requirement IDs:** `3.2.4`, `REQ-POA-017`.
    typescript
    // lib/constructs/waf-integration-construct.ts
    import * as cdk from 'aws-cdk-lib';
    import { Construct } from 'constructs';
    import * as wafv2 from 'aws-cdk-lib/aws-wafv2';

    export interface WafIntegrationConstructProps {
        // 'REGIONAL' for API Gateway, ALB. 'CLOUDFRONT' for CloudFront distributions.
        readonly scope: 'REGIONAL' | 'CLOUDFRONT';
        // Add more props if custom rules or configurations are needed
    }

    export class WafIntegrationConstruct extends Construct {
      public readonly webAclArn: string;

      constructor(scope: Construct, id: string, props: WafIntegrationConstructProps) {
        super(scope, id);

        const webAcl = new wafv2.CfnWebACL(this, 'AdManagerWebAcl', {
          name: `AdManagerWebAcl-${cdk.Stack.of(this).region}-${props.scope}`,
          scope: props.scope,
          defaultAction: { allow: {} }, // Default to allow, block with rules
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: `AdManagerWebAclMetric-${props.scope}`,
            sampledRequestsEnabled: true,
          },
          rules: [
            // AWS Managed Rule: Common Rule Set
            {
              name: 'AWS-AWSManagedRulesCommonRuleSet',
              priority: 10,
              statement: {
                managedRuleGroupStatement: {
                  vendorName: 'AWS',
                  name: 'AWSManagedRulesCommonRuleSet',
                },
              },
              overrideAction: { none: {} },
              visibilityConfig: {
                sampledRequestsEnabled: true,
                cloudWatchMetricsEnabled: true,
                metricName: 'AWSManagedRulesCommonRuleSetMetric',
              },
            },
            // AWS Managed Rule: Known Bad Inputs
            {
              name: 'AWS-AWSManagedRulesKnownBadInputsRuleSet',
              priority: 20,
              statement: {
                managedRuleGroupStatement: {
                  vendorName: 'AWS',
                  name: 'AWSManagedRulesKnownBadInputsRuleSet',
                },
              },
              overrideAction: { none: {} },
              visibilityConfig: {
                sampledRequestsEnabled: true,
                cloudWatchMetricsEnabled: true,
                metricName: 'AWSManagedRulesKnownBadInputsRuleSetMetric',
              },
            },
            // AWS Managed Rule: IP Reputation List
            {
              name: 'AWS-AWSManagedRulesAmazonIpReputationList',
              priority: 30,
              statement: {
                managedRuleGroupStatement: {
                  vendorName: 'AWS',
                  name: 'AWSManagedRulesAmazonIpReputationList',
                },
              },
              overrideAction: { none: {} },
              visibilityConfig: {
                sampledRequestsEnabled: true,
                cloudWatchMetricsEnabled: true,
                metricName: 'AWSManagedRulesAmazonIpReputationListMetric',
              },
            },
            // Example: Rate-based rule to mitigate DDoS (adjust limits as needed)
            {
                name: 'RateLimitRule',
                priority: 1,
                action: { block: {} }, // or { count: {} } to test
                statement: {
                    rateBasedStatement: {
                        limit: 2000, // Max requests per 5-minute period per IP
                        aggregateKeyType: 'IP',
                    },
                },
                visibilityConfig: {
                    sampledRequestsEnabled: true,
                    cloudWatchMetricsEnabled: true,
                    metricName: 'RateLimitRuleMetric',
                },
            },
          ],
        });
        this.webAclArn = webAcl.attrArn;
      }
    }
    

#### 4.3.4. `infrastructure/api-gateway/lib/constructs/openapi-definitions-construct.ts`
*   **Purpose:** Manages and provides access to OpenAPI definitions for the API Gateway.
*   **Key Responsibilities/Logic:**
    *   Loads OpenAPI YAML files from the `openapi/` directory using `apigateway.AssetApiDefinition` or constructs `apigateway.InlineApiDefinition`.
    *   Provides methods to retrieve these definitions (e.g., `getMerchantApiDefinition()`).
    *   These definitions can be used by `apigateway.SpecRestApi` or for configuring `apigateway.Model` and `apigateway.RequestValidator` resources if not using `SpecRestApi`.
*   **Inputs (Props):** `OpenApiDefinitionsConstructProps` (optional, e.g., path to OpenAPI files).
*   **Outputs:** Methods returning `apigateway.ApiDefinition`.
*   **Implemented Features:** OpenAPISpecificationManagement, APIDocumentationIntegration.
*   **Requirement IDs:** `REQ-SUD-015`, `3.3.2.3`, `REQ-TCE-008`.
    typescript
    // lib/constructs/openapi-definitions-construct.ts
    import { Construct } from 'constructs';
    import * as apigateway from 'aws-cdk-lib/aws-apigateway';
    import * as path from 'path';
    import * as fs from 'fs';
    import * as yaml from 'js-yaml'; // Dependency: js-yaml

    export interface OpenApiDefinitionsConstructProps {
        // Optional: base path to OpenAPI files if not default
        readonly openApiDir?: string;
    }

    export class OpenApiDefinitionsConstruct extends Construct {
      private readonly baseDir: string;

      constructor(scope: Construct, id: string, props?: OpenApiDefinitionsConstructProps) {
        super(scope, id);
        this.baseDir = props?.openApiDir || path.join(__dirname, '../../../openapi');
      }

      private loadApiDefinition(fileName: string): apigateway.InlineApiDefinition {
        const filePath = path.join(this.baseDir, fileName);
        // This is a simplified loader. For complex $ref handling across files before CDK processing,
        // a pre-processing step or a more sophisticated OpenAPI bundler might be needed.
        // CDK's SpecRestApi can handle S3 assets which might simplify cross-file $refs if bundled.
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const definition = yaml.load(fileContent);
        return apigateway.ApiDefinition.fromInline(definition);
      }

      // Example: This method would ideally merge or provide a way to combine specs if needed
      // or simply provide individual specs to be used by different RestApi constructs if APIs are split.
      // For a single unified API Gateway, you might create a combined spec or use one primary spec.

      public getMerchantApiDefinition(): apigateway.InlineApiDefinition {
        // Assuming merchant-api.yaml is the primary or includes others via $ref if SpecRestApi handles it.
        // For now, just loading it directly.
        return this.loadApiDefinition('merchant-api.yaml');
      }

      public getThirdPartyApiDefinition(): apigateway.InlineApiDefinition {
        return this.loadApiDefinition('third-party-app-api.yaml');
      }

      // Add similar methods for admin-api.yaml, affiliate-api.yaml
      // Or a method to get a combined/root definition if SpecRestApi is used with a single large spec
      public getRootApiSpecForSpecRestApi(): apigateway.AssetApiDefinition {
        // This would point to a single root OpenAPI file that $refs others,
        // and that file would be uploaded as an S3 asset.
        // Example:
        // const apiSpecAsset = new s3assets.Asset(this, 'ApiSpecAsset', {
        //   path: path.join(this.baseDir, 'unified-api-root.yaml'), // A root spec file
        // });
        // return apigateway.ApiDefinition.fromS3Bucket(apiSpecAsset.bucket, apiSpecAsset.s3ObjectKey);
        throw new Error('getRootApiSpecForSpecRestApi not fully implemented; requires S3 asset handling for SpecRestApi.');
      }
    }
    

### 4.4. Lambda Authorizer

#### 4.4.1. `infrastructure/api-gateway/lambda-authorizers/jwt-validator/index.ts`
*   **Purpose:** AWS Lambda function handler for JWT-based request authorization.
*   **Key Responsibilities/Logic:**
    1.  **Extract Token:** Retrieves the JWT from the `event.authorizationToken` (typically "Bearer <token>", so needs parsing).
    2.  **Environment Variables:** Reads `JWKS_URI`, `JWT_ISSUER`, `JWT_AUDIENCE` from `process.env`.
    3.  **JWKS Client:** Initializes `jwks-rsa` client with the `JWKS_URI`.
    4.  **Get Signing Key:** Implements `getSigningKey` callback for `jsonwebtoken.verify` to fetch the public key from JWKS based on `kid` in token header.
    5.  **Verify Token:** Uses `jsonwebtoken.verify` with the fetched signing key and options:
        *   `issuer`: `JWT_ISSUER`.
        *   `audience`: `JWT_AUDIENCE.split(',')`.
        *   `algorithms`: E.g., `['RS256']`.
    6.  **Handle Validation Errors:** Catches errors from `verify` (expired, invalid signature, wrong issuer/audience) and returns a `Deny` policy.
    7.  **Policy Generation:** If token is valid:
        *   Extracts `principalId` (e.g., `sub` claim from JWT).
        *   Extracts claims for coarse-grained authorization if needed (e.g., `roles`, `scopes`).
        *   Calls `generatePolicy` (from `auth-policy.ts`) to create an `Allow` policy for `event.methodArn`.
        *   Optionally add custom context to the policy.
*   **Implemented Features:** JWTValidation, ClaimVerification, IAMPolicyGeneration.
*   **Requirement IDs:** `3.2.4`, `REQ-IAM-007`, `REQ-03-004`.
    typescript
    // lambda-authorizers/jwt-validator/index.ts
    import {
      APIGatewayTokenAuthorizerEvent,
      APIGatewayRequestAuthorizerEvent, // If using request authorizer
      Context,
      AuthResponse,
      PolicyDocument,
    } from 'aws-lambda';
    import * as jwt from 'jsonwebtoken';
    import { JwksClient } from 'jwks-rsa';
    import { generatePolicy } from './auth-policy'; // Assuming auth-policy.ts is in the same directory

    const jwksUri = process.env.JWKS_URI!;
    const jwtIssuer = process.env.JWT_ISSUER!;
    const jwtAudience = process.env.JWT_AUDIENCE!.split(',');

    const client = new JwksClient({
      jwksUri: jwksUri,
      cache: true, // Enable caching of signing keys
      rateLimit: true, // Enable rate limiting for JWKS fetching
      jwksRequestsPerMinute: 10,
    });

    function getToken(event: APIGatewayTokenAuthorizerEvent): string | null {
      if (!event.authorizationToken) {
        console.log('No authorizationToken found in event');
        return null;
      }
      const parts = event.authorizationToken.split(' ');
      if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
        console.log('Authorization token is not a Bearer token');
        return null;
      }
      return parts[1];
    }

    // Callback for jsonwebtoken.verify to fetch signing key
    const getKey = (header: jwt.JwtHeader, callback: (err: Error | null, key?: string | Buffer) => void): void => {
      if (!header.kid) {
        callback(new Error('Token KID (Key ID) is missing'));
        return;
      }
      client.getSigningKey(header.kid, (err, key) => {
        if (err) {
          console.error('Error fetching signing key:', err);
          callback(err);
          return;
        }
        const signingKey = key?.getPublicKey(); // or key.rsaPublicKey for older jwks-rsa versions
        if (!signingKey) {
            callback(new Error('Signing key could not be retrieved.'));
            return;
        }
        callback(null, signingKey);
      });
    };

    export const handler = async (
      event: APIGatewayTokenAuthorizerEvent, // Or APIGatewayRequestAuthorizerEvent
      context: Context
    ): Promise<AuthResponse> => {
      console.log('Received event:', JSON.stringify(event, null, 2));

      const token = getToken(event);

      if (!token) {
        console.log('Unauthorized: No token provided or malformed.');
         // In a real scenario, you might return 'Unauthorized' error to API Gateway
         // which then sends a 401. For a Lambda authorizer, returning a Deny policy
         // effectively blocks access and API Gateway typically returns a 403 Forbidden.
        return generatePolicy('unauthorized_user', 'Deny', event.methodArn);
      }

      try {
        const decoded = await new Promise<jwt.JwtPayload | string>((resolve, reject) => {
          jwt.verify(token, getKey, {
            issuer: jwtIssuer,
            audience: jwtAudience,
            algorithms: ['RS256'], // Specify your algorithm
          }, (err, decodedToken) => {
            if (err) {
              console.error('JWT verification error:', err.message);
              reject(err);
            } else {
              resolve(decodedToken as jwt.JwtPayload);
            }
          });
        });

        if (typeof decoded === 'string' || !decoded.sub) {
          console.log('Unauthorized: Invalid token payload or missing sub.');
          return generatePolicy('invalid_token_user', 'Deny', event.methodArn);
        }

        const principalId = decoded.sub; // Use 'sub' claim as principalId
        console.log(`Authorized principal: ${principalId}`);

        // Optional: Perform coarse-grained role/scope checks based on token claims
        // const userRoles = decoded.roles || []; // Example claim
        // if (!userRoles.includes('merchant-api-access')) {
        //   console.log(`Principal ${principalId} does not have required role/scope.`);
        //   return generatePolicy(principalId, 'Deny', event.methodArn);
        // }

        // Add claims to context for backend services (if using request authorizer)
        const authorizerContext: { [key: string]: string | number | boolean } = {
            principalId: principalId,
            userId: decoded.sub, // often same as principalId
            // Add other claims you want to pass to backend services
            // Example: "tenantId": decoded.tenantId,
            // "roles": JSON.stringify(userRoles),
        };


        return generatePolicy(principalId, 'Allow', event.methodArn, authorizerContext);

      } catch (error: any) {
        console.error('Authorization error:', error.message);
        // For Deny, principalId can be arbitrary as it won't be used if access is denied
        return generatePolicy('error_user', 'Deny', event.methodArn);
      }
    };

    

#### 4.4.2. `infrastructure/api-gateway/lambda-authorizers/jwt-validator/package.json`
*   **Purpose:** Manages dependencies for the JWT Validator Lambda function.
*   **Key Responsibilities/Logic:**
    json
    {
      "name": "jwt-validator-lambda",
      "version": "1.0.0",
      "description": "Lambda function for JWT validation for API Gateway",
      "main": "index.js",
      "private": true,
      "dependencies": {
        "jsonwebtoken": "^9.0.2",
        "jwks-rsa": "^3.1.0"
      },
      "devDependencies": {
        "@types/aws-lambda": "^8.10.130",
        "@types/jsonwebtoken": "^9.0.5"
      }
    }
    
*   **Implemented Features:** LambdaDependencyManagement.
*   **Requirement IDs:** `3.2.4`.

#### 4.4.3. `infrastructure/api-gateway/lambda-authorizers/jwt-validator/auth-policy.ts`
*   **Purpose:** Utility module to construct IAM policy documents for API Gateway Lambda authorizers.
*   **Key Responsibilities/Logic:**
    *   Provides `generatePolicy` function.
    *   Input: `principalId`, `effect` ('Allow' or 'Deny'), `resource` (method ARN or wildcard), `context` (optional key-value pairs).
    *   Output: `AuthResponse` object with `principalId`, `policyDocument`, and `context`.
*   **Implemented Features:** IAMPolicyGenerationForAuthorizer.
*   **Requirement IDs:** `3.2.4`, `REQ-IAM-007`.
    typescript
    // lambda-authorizers/jwt-validator/auth-policy.ts
    import { AuthResponse, PolicyDocument, Statement } from 'aws-lambda';

    export const generatePolicy = (
        principalId: string,
        effect: 'Allow' | 'Deny',
        resource: string | string[],
        context?: { [key: string]: string | number | boolean }
    ): AuthResponse => {
        const policyDocument: PolicyDocument = {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        };

        const authResponse: AuthResponse = {
            principalId: principalId,
            policyDocument: policyDocument,
        };

        if (context) {
            authResponse.context = context;
        }

        console.log('Generated policy:', JSON.stringify(authResponse));
        return authResponse;
    };
    

### 4.5. OpenAPI Specifications

#### 4.5.1. `infrastructure/api-gateway/openapi/merchant-api.yaml`
*   **Purpose:** Defines the API contract for the Merchant Portal.
*   **Key Responsibilities/Logic:**
    *   `openapi: 3.1.0`
    *   `info`: title, version, description.
    *   `servers`: API Gateway stage URLs.
    *   `paths`: Definitions for all merchant-facing endpoints:
        *   `/merchant/v1/campaigns`, `/merchant/v1/campaigns/{campaignId}`
        *   `/merchant/v1/product-catalogs`, `/merchant/v1/product-catalogs/{catalogId}`
        *   `/merchant/v1/analytics/performance`
        *   etc.
    *   For each path and HTTP method: `summary`, `operationId`, `tags`, `parameters`, `requestBody`, `responses`.
    *   `security`: References JWT security scheme defined in `shared-components.yaml`.
    *   `components`: Uses `$ref: './shared-components.yaml#/components/schemas/...'` for request/response bodies and parameters.
*   **Implemented Features:** MerchantAPIDefinition.
*   **Requirement IDs:** `REQ-SUD-015`, `3.3.2.1`.

#### 4.5.2. `infrastructure/api-gateway/openapi/admin-api.yaml`
*   **Purpose:** Defines the API contract for the Platform Admin Portal.
*   **Key Responsibilities/Logic:** Similar structure to `merchant-api.yaml`, but for admin endpoints (e.g., `/admin/v1/users`, `/admin/v1/platform-settings`).
*   **Implemented Features:** AdminAPIDefinition.
*   **Requirement IDs:** `REQ-SUD-015`, `3.3.2.1`.

#### 4.5.3. `infrastructure/api-gateway/openapi/affiliate-api.yaml`
*   **Purpose:** Defines the API contract for the Affiliate Portal.
*   **Key Responsibilities/Logic:** Similar structure, for affiliate endpoints (e.g., `/affiliate/v1/dashboard`, `/affiliate/v1/payouts`).
*   **Implemented Features:** AffiliateAPIDefinition.
*   **Requirement IDs:** `REQ-SUD-015`, `3.3.2.1`.

#### 4.5.4. `infrastructure/api-gateway/openapi/third-party-app-api.yaml`
*   **Purpose:** Defines the API contract for third-party applications.
*   **Key Responsibilities/Logic:**
    *   Similar structure, for third-party app endpoints (e.g., `/external/v1/data-points`).
    *   `securitySchemes` might define OAuth 2.0 flows specific to third-party apps, in addition to or instead of JWT from `shared-components.yaml` if the auth mechanism differs.
*   **Implemented Features:** ThirdPartyAppAPIDefinition.
*   **Requirement IDs:** `REQ-SUD-015`, `3.3.2.3`, `REQ-TCE-008`.

#### 4.5.5. `infrastructure/api-gateway/openapi/shared-components.yaml`
*   **Purpose:** Contains reusable OpenAPI components.
*   **Key Responsibilities/Logic:**
    *   `components:`
        *   `schemas:` (e.g., `Campaign`, `AdSet`, `ErrorResponse`, `PaginationInfo`, common request/response payloads).
        *   `securitySchemes:` (e.g., `JWTBearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }`).
        *   `parameters:` (e.g., `merchantIdHeader`, `correlationIdHeader`).
        *   `responses:` (e.g., `UnauthorizedError`, `NotFoundError`, `GenericError`).
*   **Implemented Features:** SharedAPISchemas, SharedSecuritySchemes.
*   **Requirement IDs:** `REQ-SUD-015`.

## 5. Security Considerations

*   **Authentication:** All protected API Gateway routes will be secured using the JWT Lambda Authorizer. The authorizer validates JWTs issued by a trusted Identity Provider (e.g., Amazon Cognito or `[PlatformName]`'s core auth system).
*   **Authorization:** Coarse-grained authorization can be implemented within the Lambda authorizer by checking claims (e.g., roles, scopes) present in the JWT. Finer-grained authorization is the responsibility of the backend microservices.
*   **AWS WAF:** AWS WAF will be integrated to protect against common web exploits (OWASP Top 10), SQL injection, XSS, and to implement rate-based rules.
*   **HTTPS/TLS:** All communication with the API Gateway will be over HTTPS/TLS 1.2+.
*   **IAM Policies:** The Lambda authorizer function and other Lambda integrations will have minimal IAM permissions necessary for their operation (Principle of Least Privilege).
*   **CORS:** Cross-Origin Resource Sharing policies will be configured at the API Gateway level to allow access from authorized frontend domains.
*   **Rate Limiting & Throttling:** Global and per-route rate limiting and throttling will be configured on API Gateway to protect backend services from abuse and ensure availability.
*   **Input Validation:** Request validation based on OpenAPI schemas can be enabled at the API Gateway level to reject malformed requests early.

## 6. Deployment

*   The API Gateway infrastructure will be deployed using the AWS CDK CLI (`cdk deploy`).
*   CI/CD pipelines (e.g., AWS CodePipeline, CodeBuild, CodeDeploy as per REQ-POA-005) will automate the deployment process for different stages (dev, staging, prod).
*   Environment-specific configurations (backend URLs, JWKS URIs, domain names) will be managed using CDK context, environment variables, or AWS Systems Manager Parameter Store.

## 7. Monitoring & Logging

*   **Amazon CloudWatch Logs:** API Gateway execution logs will be enabled, providing detailed information about requests, responses, and authorizer invocations. Lambda authorizer logs will also be sent to CloudWatch Logs.
*   **Amazon CloudWatch Metrics:** API Gateway automatically publishes metrics (e.g., `Count`, `Latency`, `4XXError`, `5XXError`) to CloudWatch. Custom metrics can also be published from Lambda functions.
*   **Amazon CloudWatch Alarms:** Alarms will be configured based on key metrics (e.g., high error rates, high latency) to notify operations personnel via SNS/SES (as per REQ-POA-003).
*   **AWS X-Ray:** If deeper tracing is required, X-Ray can be enabled for API Gateway and integrated Lambda functions to trace requests across services.

## 8. Error Handling
*   The API Gateway will return standard HTTP status codes for errors.
*   The Lambda authorizer will return appropriate IAM policies (`Allow`/`Deny`). If `Deny`, API Gateway typically returns a 403 Forbidden. If the token is malformed or missing, API Gateway can be configured to return a 401 Unauthorized.
*   Backend services are responsible for their own error handling and returning appropriate error responses, which API Gateway will proxy.
*   Error responses should follow a standardized format (e.g., defined in `shared-components.yaml`).

This SDS provides a comprehensive plan for developing the `AdManager.Unified.ApiGateway.Config` repository. Subsequent development should adhere to these specifications to ensure a robust, secure, and scalable API Gateway.

json
 {
 "success":true, 
 "sds_markdown_output": "# Software Design Specification: AdManager.Unified.ApiGateway.Config\n\n## 1. Introduction\n\nThis document outlines the software design specification for the `AdManager.Unified.ApiGateway.Config` repository. This repository is responsible for defining, configuring, and managing the Unified API Gateway for the Ad Manager Platform using AWS Cloud Development Kit (CDK) in TypeScript. The API Gateway serves as the single, secure entry point for all external client requests, routing them to the appropriate backend microservices.\n\n**Purpose of the API Gateway:**\n*   Provide a unified and consistent interface to the platform's backend services.\n*   Enforce security policies, including authentication and authorization.\n*   Implement global rate limiting and throttling.\n*   Handle SSL termination.\n*   Manage API versioning.\n*   Enable request/response transformations and aggregation if necessary.\n*   Ensure CORS policies are correctly configured.\n\nThis SDS will detail the design of the CDK application, its components, and how it fulfills the specified requirements for the API Gateway.\n\n## 2. Architecture Overview\n\nThe `AdManager.Unified.ApiGateway.Config` repository employs an Infrastructure as Code (IaC) approach using AWS CDK. The CDK application, written in TypeScript, programmatically defines all AWS resources required for the API Gateway, including:\n\n*   **Amazon API Gateway (REST API):** The core service providing the API gateway functionality.\n*   **Routes and Integrations:** Definitions of API paths, HTTP methods, and their integrations with backend microservices.\n*   **Lambda Authorizers:** Custom AWS Lambda functions for JWT-based authentication and coarse-grained authorization.\n*   **AWS WAF (Web Application Firewall):** Integration for protecting against common web exploits.\n*   **Custom Domains and Stages:** Configuration for custom domain names (e.g., `api.admanager.example.com`) and deployment stages (e.g., `dev`, `prod`).\n*   **OpenAPI Specifications:** Management and potential integration of OpenAPI (Swagger) definitions for API documentation and request validation.\n\nThe API Gateway will route requests to various backend microservices as defined by the overall system architecture. It acts as the gatekeeper, ensuring that only authenticated and authorized requests reach the backend.\n\n**Diagrammatic Representation (Conceptual):**\n\n\n+-----------------------+      +-------------------------+      +-------------------------+\n| Merchant Portal (SPA) |----->|                         |<---->| Campaign Service        |\n+-----------------------+      |                         |      +-------------------------+\n                               |                         |\n+-----------------------+      | Unified API Gateway     |      +-------------------------+\n| Admin Portal (SPA)    |----->| (Amazon API Gateway)    |<---->| User Management Service |\n+-----------------------+      | (Defined by this repo)  |      +-------------------------+\n                               |                         |\n+-----------------------+      |                         |      +-------------------------+\n| Affiliate Portal (SPA)|----->|                         |<---->| Affiliate Service       |\n+-----------------------+      |                         |      +-------------------------+\n                               |                         |\n+-----------------------+      |                         |      +-------------------------+\n| Third-Party Apps      |----->|                         |<---->| (Scoped Backend Access) |\n+-----------------------+      +-------------------------+      +-------------------------+\n                                          ^\n                                          |\n                               +----------------------+\n                               | JWT Lambda Authorizer|\n                               +----------------------+\n                                          ^\n                                          |\n                               +----------------------+\n                               | AWS WAF              |\n                               +----------------------+\n\n\n## 3. Core Components & Modules\n\nThe AWS CDK application will be structured into several core components:\n\n1.  **CDK Application Entry Point (`bin/api-gateway.ts`):** Initializes the CDK app and instantiates the main API Gateway stack.\n2.  **Main API Gateway Stack (`lib/api-gateway-stack.ts`):** Orchestrates the creation of all API Gateway resources.\n3.  **Configuration (`lib/config/`):** Defines typed configurations and default settings for the gateway.\n4.  **Route Constructs (`lib/constructs/routes/`):** Modular constructs for defining API routes for different portals/clients (Merchant, Admin, Affiliate, Third-Party).\n5.  **Authorizer Construct (`lib/constructs/authorizers/`):** Defines the JWT Lambda Authorizer and its integration.\n6.  **WAF Integration Construct (`lib/constructs/waf-integration-construct.ts`):** Sets up AWS WAF.\n7.  **OpenAPI Definitions Construct (`lib/constructs/openapi-definitions-construct.ts`):** Manages OpenAPI specification files.\n8.  **Lambda Authorizer Code (`lambda-authorizers/jwt-validator/`):** The actual TypeScript code for the JWT validation Lambda function.\n9.  **OpenAPI Specification Files (`openapi/`):** YAML files defining the API contracts.\n\n## 4. Detailed Design for Repository Files\n\nThis section details the purpose, logic, and key configurations for each file defined in the repository structure.\n\n### 4.1. Project Setup & Configuration Files\n\n#### 4.1.1. `infrastructure/api-gateway/package.json`\n*   **Purpose:** Manages Node.js project dependencies, scripts for CDK operations, and project metadata.\n*   **Key Responsibilities/Logic:**\n    *   Lists essential dependencies:\n        *   `aws-cdk-lib`: Core AWS CDK library.\n        *   `constructs`: Base class for CDK constructs.\n        *   `@aws-cdk/aws-apigatewayv2-alpha` (or `aws-cdk-lib/aws-apigateway` for REST APIs): For API Gateway resources.\n        *   `@aws-cdk/aws-lambda-nodejs` (or `aws-cdk-lib/aws-lambda-nodejs`): For Node.js Lambda functions.\n        *   `aws-cdk-lib/aws-wafv2`: For WAFv2 resources.\n        *   `jsonwebtoken`: For JWT handling in Lambda authorizer.\n        *   `jwks-rsa`: For fetching JWKS keys in Lambda authorizer.\n    *   Lists development dependencies:\n        *   `typescript`: TypeScript compiler.\n        *   `@types/node`: Type definitions for Node.js.\n        *   `@types/aws-lambda`: Type definitions for AWS Lambda.\n        *   `@types/jsonwebtoken`: Type definitions for `jsonwebtoken`.\n        *   `aws-cdk`: CDK CLI (can be global or local).\n        *   `ts-node`: For running TypeScript files directly.\n        *   `jest`, `@types/jest`, `ts-jest`: For testing.\n    *   Defines scripts:\n        *   `build`: `tsc` (TypeScript compile).\n        *   `watch`: `tsc -w`.\n        *   `test`: `jest`.\n        *   `cdk`: `cdk`.\n        *   `synth`: `cdk synth`.\n        *   `deploy`: `cdk deploy`.\n        *   `diff`: `cdk diff`.\n*   **Implemented Features:** CDK Project Setup, DependencyManagement.\n*   **Requirement IDs:** `4.2.4` (AWS CDK usage implies this).\n\n#### 4.1.2. `infrastructure/api-gateway/tsconfig.json`\n*   **Purpose:** Configures the TypeScript compiler for the CDK application.\n*   **Key Responsibilities/Logic:**\n    *   Specifies compiler options:\n        *   `target`: e.g., \"ES2020\" or later.\n        *   `module`: e.g., \"commonjs\".\n        *   `lib`: [\"es2020\", \"dom\"].\n        *   `strict`: `true`.\n        *   `esModuleInterop`: `true`.\n        *   `experimentalDecorators`: `true` (if using NestJS-like decorators, though less common in pure CDK).\n        *   `emitDecoratorMetadata`: `true` (if applicable).\n        *   `skipLibCheck`: `true`.\n        *   `forceConsistentCasingInFileNames`: `true`.\n        *   `outDir`: e.g., \"./dist\" (though CDK often transpiles on the fly).\n        *   `rootDir`: e.g., \"./\".\n        *   `sourceMap`: `true` (for debugging).\n*   **Implemented Features:** TypeScriptCompilation.\n*   **Requirement IDs:** `4.2.4`.\n\n#### 4.1.3. `infrastructure/api-gateway/cdk.json`\n*   **Purpose:** Provides configuration for the AWS CDK command-line interface.\n*   **Key Responsibilities/Logic:**\n    *   Defines the `app` command to execute the CDK application: `npx ts-node --prefer-ts-exts bin/api-gateway.ts`.\n    *   May include `context` variables for environment-specific configurations (e.g., account IDs, regions, domain names, backend service endpoints if not using SSM).\n        json\n        {\n          \"app\": \"npx ts-node --prefer-ts-exts bin/api-gateway.ts\",\n          \"watch\": {\n            \"include\": [\n              \"**\"\n            ],\n            \"exclude\": [\n              \"README.md\",\n              \"cdk*.json\",\n              \"**/*.d.ts\",\n              \"**/*.js\",\n              \"tsconfig.json\",\n              \"package*.json\",\n              \"yarn.lock\",\n              \"node_modules\",\n              \"test\"\n            ]\n          },\n          \"context\": {\n            \"@aws-cdk/aws-apigateway:usagePlanKeyOrderInsensitiveId\": true,\n            \"@aws-cdk/core:stackRelativeExports\": true,\n            \"@aws-cdk/aws-rds:lowercaseDbIdentifier\": true,\n            \"@aws-cdk/aws-lambda:recognizeVersionProps\": true,\n            \"@aws-cdk/aws-cloudfront:defaultSecurityPolicyTLSv1.2_2021\": true,\n            // Example context variables\n            // \"dev:customDomainName\": \"dev.api.admanager.example.com\",\n            // \"prod:customDomainName\": \"api.admanager.example.com\",\n            // \"dev:jwksUri\": \"https://dev-auth.example.com/.well-known/jwks.json\"\n          }\n        }\n        \n*   **Implemented Features:** CDKToolkitConfiguration.\n*   **Requirement IDs:** `4.2.4`.\n\n### 4.2. CDK Application Core\n\n#### 4.2.1. `infrastructure/api-gateway/bin/api-gateway.ts`\n*   **Purpose:** Entry point for the AWS CDK application; initializes and synthesizes the API Gateway stack(s).\n*   **Key Responsibilities/Logic:**\n    *   Imports `aws-cdk-lib` (specifically `cdk.App`).\n    *   Imports the main stack definition (`ApiGatewayStack` from `../lib/api-gateway-stack`).\n    *   Creates a new `cdk.App()` instance.\n    *   Instantiates `ApiGatewayStack`.\n        *   Environment configurations (account, region) can be sourced from environment variables or CDK context.\n        *   Passes stack-specific props, potentially including configurations loaded from `gateway-settings.ts` or environment context.\n    typescript\n    #!/usr/bin/env node\n    import 'source-map-support/register';\n    import * as cdk from 'aws-cdk-lib';\n    import { ApiGatewayStack } from '../lib/api-gateway-stack';\n    import { gatewayDefaultSettings } from '../lib/config/gateway-settings'; // Assuming settings are exported\n\n    const app = new cdk.App();\n\n    const env = {\n      account: process.env.CDK_DEFAULT_ACCOUNT,\n      region: process.env.CDK_DEFAULT_REGION,\n    };\n\n    // Example: Retrieve stage-specific config from CDK context or environment variables\n    const stage = app.node.tryGetContext('stage') || process.env.STAGE || 'dev';\n    const customDomainName = app.node.tryGetContext(`${stage}:customDomainName`) || process.env.CUSTOM_DOMAIN_NAME;\n    const jwksUri = app.node.tryGetContext(`${stage}:jwksUri`) || process.env.JWKS_URI;\n    const jwtIssuer = app.node.tryGetContext(`${stage}:jwtIssuer`) || process.env.JWT_ISSUER;\n    const jwtAudience = (app.node.tryGetContext(`${stage}:jwtAudience`) || process.env.JWT_AUDIENCE || '').split(',');\n\n\n    if (!jwksUri || !jwtIssuer || jwtAudience.length === 0 || jwtAudience[0] === '') {\n        throw new Error(`JWKS URI, JWT Issuer, and JWT Audience must be provided for stage: ${stage}`);\n    }\n\n    new ApiGatewayStack(app, `AdManagerApiGatewayStack-${stage}`, {\n      env,\n      stackName: `AdManagerApiGateway-${stage}`,\n      description: `API Gateway for Ad Manager Platform (${stage})`,\n      stage,\n      gatewayConfig: {\n        ...gatewayDefaultSettings,\n        customDomain: customDomainName ? {\n          domainName: customDomainName,\n          certificateArn: app.node.tryGetContext(`${stage}:certificateArn`) || process.env.CERTIFICATE_ARN, // Required if custom domain\n          hostedZoneId: app.node.tryGetContext(`${stage}:hostedZoneId`) || process.env.HOSTED_ZONE_ID, // Required if custom domain\n        } : undefined,\n        // Add other stage specific overrides from gatewayDefaultSettings if needed\n      },\n      authorizerConfig: {\n        jwksUri,\n        jwtIssuer,\n        jwtAudience,\n        authorizerName: `JwtAuthorizer-${stage}`,\n      },\n      // Pass backend service URLs (from SSM, context, or direct for now)\n      // Example:\n      // campaignServiceUrl: app.node.tryGetContext(`${stage}:campaignServiceUrl`) || process.env.CAMPAIGN_SERVICE_URL,\n    });\n\n    app.synth();\n    \n*   **Implemented Features:** CDKAppInitialization.\n*   **Requirement IDs:** `4.2.4`.\n\n#### 4.2.2. `infrastructure/api-gateway/lib/config/gateway-settings.ts`\n*   **Purpose:** Defines TypeScript interfaces and default constant values for API Gateway configurations.\n*   **Key Responsibilities/Logic:**\n    *   Exports interfaces:\n        *   `CorsOptions` (can re-export from `aws-cdk-lib/aws-apigateway`).\n        *   `CustomDomainConfig { domainName: string; certificateArn: string; hostedZoneId: string; basePath?: string; }`\n        *   `GatewayConfig { defaultRateLimit?: number; defaultBurstLimit?: number; defaultCorsOptions?: apigateway.CorsOptions; customDomain?: CustomDomainConfig; stageName: string; }`\n    *   Provides default constant values:\n        typescript\n        import * as apigateway from 'aws-cdk-lib/aws-apigateway';\n\n        export interface CustomDomainConfig {\n          domainName: string;\n          certificateArn: string;\n          hostedZoneId: string;\n          basePath?: string;\n          // Add securityPolicy if needed, e.g., apigateway.SecurityPolicy.TLS_1_2\n        }\n\n        export interface GatewayConfig {\n          defaultRateLimit?: number;\n          defaultBurstLimit?: number;\n          defaultCorsOptions?: apigateway.CorsOptions;\n          customDomain?: CustomDomainConfig;\n          stageName: string; // e.g., 'dev', 'prod'\n          // Add other global settings like API key source, etc.\n        }\n\n        export const gatewayDefaultSettings: Omit<GatewayConfig, 'stageName' | 'customDomain'> = {\n          defaultRateLimit: 100, // requests per second\n          defaultBurstLimit: 200, // burst capacity\n          defaultCorsOptions: {\n            allowOrigins: apigateway.Cors.ALL_ORIGINS, // Or specific origins\n            allowMethods: apigateway.Cors.ALL_METHODS, // Or specific methods like ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']\n            allowHeaders: [\n              'Content-Type',\n              'X-Amz-Date',\n              'Authorization',\n              'X-Api-Key',\n              'X-Amz-Security-Token',\n              'X-Amz-User-Agent',\n              'X-Correlation-ID', // Example custom header\n            ],\n            allowCredentials: true,\n          },\n        };\n        \n*   **Implemented Features:** GatewayConfigurationSchema.\n*   **Requirement IDs:** `3.3.2.1`, `4.2.4`.\n\n#### 4.2.3. `infrastructure/api-gateway/lib/interfaces/lambda-authorizer-props.ts`\n*   **Purpose:** Defines the TypeScript interface for properties required by the JWT Lambda Authorizer construct.\n*   **Key Responsibilities/Logic:**\n    typescript\n    export interface ILambdaAuthorizerProps {\n      readonly jwksUri: string;\n      readonly jwtIssuer: string;\n      readonly jwtAudience: string[];\n      readonly authorizerName: string;\n      // Optional: tokenSource (e.g. 'method.request.header.Authorization')\n      // Optional: resultsCacheTtl (e.g. cdk.Duration.minutes(5))\n    }\n    \n*   **Implemented Features:** LambdaAuthorizerConfigurationSchema.\n*   **Requirement IDs:** `3.2.4`, `REQ-IAM-007`.\n\n#### 4.2.4. `infrastructure/api-gateway/lib/api-gateway-stack.ts`\n*   **Purpose:** Main AWS CDK stack defining all API Gateway resources, routes, integrations, security, and operational configurations.\n*   **Key Responsibilities/Logic:**\n    *   **Initialization:**\n        *   Accepts `stage`, `gatewayConfig`, `authorizerConfig`, and backend service URLs/ARNs as stack props.\n        *   Creates `apigateway.RestApi` instance.\n            *   Configure `defaultCorsPreflightOptions` using `gatewayConfig.defaultCorsOptions`.\n            *   Configure `deployOptions` for the stage (e.g., `stageName`, `throttlingRateLimit`, `throttlingBurstLimit`).\n            *   Enable CloudWatch logging and metrics for the API Gateway stage.\n    *   **Authorizer Setup:**\n        *   Instantiates `JwtLambdaAuthorizerConstruct` (see 4.3.3) using `authorizerConfig`.\n    *   **Route Definitions:**\n        *   Instantiates and uses route constructs:\n            *   `MerchantApiRoutes`\n            *   `AdminApiRoutes`\n            *   `AffiliateApiRoutes`\n            *   `ThirdPartyAppApiRoutes`\n        *   Passes the `RestApi` instance, the authorizer instance, and relevant backend service integration details (URLs/ARNs of Lambda functions or HTTP endpoints) to these route constructs.\n    *   **WAF Integration:**\n        *   Instantiates `WafIntegrationConstruct` (see 4.3.4).\n        *   Associates the created WebACL with the API Gateway stage.\n    *   **Custom Domain & Base Path Mapping:**\n        *   If `gatewayConfig.customDomain` is provided:\n            *   Creates `apigateway.DomainName` and `apigateway.BasePathMapping`.\n            *   Requires `certificateArn`, `hostedZoneId` from props.\n    *   **OpenAPI Integration (Optional but Recommended):**\n        *   Instantiates `OpenApiDefinitionsConstruct` (see 4.3.5).\n        *   If using `apigateway.SpecRestApi`, provide the OpenAPI definition.\n        *   Alternatively, configure models and request validators based on OpenAPI schemas for specific routes, if granular control is needed.\n    *   **Outputs:**\n        *   `CfnOutput` for API Gateway endpoint URL.\n        *   `CfnOutput` for custom domain URL if configured.\n*   **Key Methods (Conceptual):**\n    *   `constructor(scope: Construct, id: string, props: ApiGatewayStackProps)`\n    *   Helper methods like `private setupApiGatewayInstance()`, `private attachAuthorizer()`, `private configureRoutes()`, etc.\n*   **Implemented Features:** APIGatewayResourceCreation, RouteDefinition, IntegrationSetup, AuthorizerAttachment, WAFIntegration, CustomDomainSetup, StageDeployment.\n*   **Requirement IDs:** `3.3.2.1`, `4.2.4`, `3.2.4`, `3.3.2.3`, `REQ-IAM-007`, `REQ-TCE-008`, `REQ-POA-017`.\n    typescript\n    import * as cdk from 'aws-cdk-lib';\n    import { Construct } from 'constructs';\n    import * as apigateway from 'aws-cdk-lib/aws-apigateway';\n    import * as lambda from 'aws-cdk-lib/aws-lambda';\n    import * as acm from 'aws-cdk-lib/aws-certificatemanager';\n    import * as route53 from 'aws-cdk-lib/aws-route53';\n    import * as route53targets from 'aws-cdk-lib/aws-route53-targets';\n    import { GatewayConfig } from './config/gateway-settings';\n    import { ILambdaAuthorizerProps } from './interfaces/lambda-authorizer-props';\n    import { JwtLambdaAuthorizerConstruct } from './constructs/authorizers/jwt-lambda-authorizer-construct';\n    import { WafIntegrationConstruct } from './constructs/waf-integration-construct';\n    import { MerchantApiRoutes } from './constructs/routes/merchant-api-routes';\n    // Import other route constructs as they are defined\n    // import { AdminApiRoutes } from './constructs/routes/admin-api-routes';\n    // import { AffiliateApiRoutes } from './constructs/routes/affiliate-api-routes';\n    // import { ThirdPartyAppApiRoutes } from './constructs/routes/third-party-app-api-routes';\n    import { OpenApiDefinitionsConstruct } from './constructs/openapi-definitions-construct';\n\n\n    export interface ApiGatewayStackProps extends cdk.StackProps {\n      readonly stage: string;\n      readonly gatewayConfig: GatewayConfig;\n      readonly authorizerConfig: ILambdaAuthorizerProps;\n      // Add props for backend service URLs/ARNs or SSM parameter names\n      readonly campaignServiceEndpoint: string; // Example: URL of CampaignService\n      readonly productCatalogServiceEndpoint: string; // Example\n      readonly adminServiceEndpoint: string; // Example\n      readonly affiliateServiceEndpoint: string; // Example\n      readonly thirdPartyAppServiceEndpoint: string; // Example\n    }\n\n    export class ApiGatewayStack extends cdk.Stack {\n      public readonly api: apigateway.RestApi;\n\n      constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {\n        super(scope, id, props);\n\n        // 1. Define OpenAPI specifications (optional, but good for request validation and docs)\n        const openApiConstruct = new OpenApiDefinitionsConstruct(this, 'OpenApiDefs');\n\n        // 2. Create the REST API instance\n        this.api = new apigateway.RestApi(this, `AdManagerApi-${props.stage}`, {\n          restApiName: `AdManager-API-${props.stage}`,\n          description: `API Gateway for Ad Manager Platform (${props.stage})`,\n          deployOptions: {\n            stageName: props.stage,\n            throttlingRateLimit: props.gatewayConfig.defaultRateLimit,\n            throttlingBurstLimit: props.gatewayConfig.defaultBurstLimit,\n            loggingLevel: apigateway.MethodLoggingLevel.INFO,\n            dataTraceEnabled: true,\n            metricsEnabled: true,\n          },\n          defaultCorsPreflightOptions: props.gatewayConfig.defaultCorsOptions,\n          // For request validation using OpenAPI\n          // models: { ... load models from openApiConstruct ... }\n          // requestValidators: { ... define validators ... }\n          // Can also use SpecRestApi if the entire API is defined in one OpenAPI file\n          // apiDefinition: openApiConstruct.getCombinedApiDefinition(), // if applicable\n        });\n\n        // 3. Setup JWT Lambda Authorizer\n        const jwtAuthorizerConstruct = new JwtLambdaAuthorizerConstruct(this, 'JwtAuthorizer', props.authorizerConfig);\n        const authorizer = jwtAuthorizerConstruct.authorizer;\n\n\n        // 4. Define Routes by instantiating route constructs\n        // Example for Merchant Routes\n        new MerchantApiRoutes(this, 'MerchantRoutes', {\n            api: this.api,\n            authorizer: authorizer,\n            campaignServiceIntegration: new apigateway.HttpIntegration(props.campaignServiceEndpoint), // or LambdaIntegration\n            productCatalogServiceIntegration: new apigateway.HttpIntegration(props.productCatalogServiceEndpoint), // or LambdaIntegration\n            // ... other service integrations\n        });\n\n        // TODO: Instantiate AdminApiRoutes, AffiliateApiRoutes, ThirdPartyAppApiRoutes similarly\n        // new AdminApiRoutes(this, 'AdminRoutes', { /* ... props ... */ });\n        // new AffiliateApiRoutes(this, 'AffiliateRoutes', { /* ... props ... */ });\n        // new ThirdPartyAppApiRoutes(this, 'ThirdPartyAppRoutes', { /* ... props ... */ });\n\n\n        // 5. Setup AWS WAF Integration\n        const wafConstruct = new WafIntegrationConstruct(this, 'WafProtection', {\n          scope: 'REGIONAL', // For API Gateway\n        });\n        if (this.api.deploymentStage) {\n            new cdk.aws_wafv2.CfnWebACLAssociation(this, 'WafAssociation', {\n                resourceArn: this.api.deploymentStage.stageArn,\n                webAclArn: wafConstruct.webAclArn,\n            });\n        }\n\n\n        // 6. Setup Custom Domain (if configured)\n        if (props.gatewayConfig.customDomain) {\n          const domainConfig = props.gatewayConfig.customDomain;\n          const certificate = acm.Certificate.fromCertificateArn(this, 'ApiCertificate', domainConfig.certificateArn);\n          const customDomain = new apigateway.DomainName(this, 'ApiCustomDomain', {\n            domainName: domainConfig.domainName,\n            certificate: certificate,\n            endpointType: apigateway.EndpointType.REGIONAL,\n            // securityPolicy: apigateway.SecurityPolicy.TLS_1_2, // Recommended\n          });\n\n          new apigateway.BasePathMapping(this, 'ApiBasePathMapping', {\n            domainName: customDomain,\n            restApi: this.api,\n            basePath: domainConfig.basePath || '', // e.g., 'v1' or empty for root\n            stage: this.api.deploymentStage,\n          });\n\n          // Optional: Create Route 53 Alias record\n          const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'ApiHostedZone', {\n            hostedZoneId: domainConfig.hostedZoneId,\n            zoneName: domainConfig.domainName.substring(domainConfig.domainName.indexOf('.') + 1), // Infer zoneName\n          });\n\n          new route53.ARecord(this, 'ApiAliasRecord', {\n            zone: hostedZone,\n            recordName: domainConfig.domainName.split('.')[0], // Just the subdomain part\n            target: route53.RecordTarget.fromAlias(new route53targets.ApiGatewayDomain(customDomain)),\n          });\n            new cdk.CfnOutput(this, 'CustomApiEndpoint', {\n                value: `https://${customDomain.domainName}/${domainConfig.basePath || ''}`,\n                description: 'Custom API Gateway Endpoint URL',\n            });\n        }\n\n        // 7. Outputs\n        new cdk.CfnOutput(this, 'ApiEndpoint', {\n          value: this.api.url,\n          description: 'API Gateway Endpoint URL',\n        });\n         new cdk.CfnOutput(this, 'ApiId', {\n            value: this.api.restApiId,\n            description: 'API Gateway ID',\n        });\n      }\n    }\n    \n\n### 4.3. CDK Constructs\n\n#### 4.3.1. Route Constructs (`lib/constructs/routes/*.ts`)\nThis section describes the pattern for `merchant-api-routes.ts`. Other route files (`admin-api-routes.ts`, `affiliate-api-routes.ts`, `third-party-app-api-routes.ts`) will follow a similar structure, tailored to their specific endpoints and backend integrations.\n\n**`infrastructure/api-gateway/lib/constructs/routes/merchant-api-routes.ts`**\n*   **Purpose:** Encapsulates the definition of API Gateway routes and integrations for the Merchant Portal.\n*   **Key Responsibilities/Logic:**\n    *   Accepts `apigateway.RestApi` instance, `apigateway.IAuthorizer`, and backend service integration props (e.g., `campaignServiceIntegration: apigateway.Integration`).\n    *   Defines API resources (paths) and methods on the provided `RestApi` root or sub-resources.\n    *   **Example for Campaign Routes:**\n        *   `const campaigns = props.api.root.addResource('campaigns');`\n        *   `campaigns.addMethod('GET', props.campaignServiceIntegration, { authorizer: props.authorizer, /* requestParameters, models for validation */ });`\n        *   `campaigns.addMethod('POST', props.campaignServiceIntegration, { authorizer: props.authorizer, /* ... */ });`\n        *   `const campaignById = campaigns.addResource('{campaignId}');`\n        *   `campaignById.addMethod('GET', props.campaignServiceIntegration, { authorizer: props.authorizer, /* ... */ });`\n        *   `campaignById.addMethod('PUT', props.campaignServiceIntegration, { authorizer: props.authorizer, /* ... */ });`\n    *   **Product Catalog Routes:** Similar structure for `/products`, `/product-catalogs`.\n    *   **Analytics Routes:** Similar structure for `/analytics`.\n    *   Configures `methodOptions` including the `authorizer`.\n    *   Optionally integrates with `OpenApiDefinitionsConstruct` to set up request/response models for validation using `requestModels` and `methodResponses`.\n*   **Inputs (Props):** `api: apigateway.RestApi`, `authorizer: apigateway.IAuthorizer`, backend integration objects (e.g., `apigateway.HttpIntegration` or `apigateway.LambdaIntegration`).\n*   **Implemented Features:** MerchantPortalRouteDefinition, BackendServiceIntegration.\n*   **Requirement IDs:** `3.3.2.1`, `4.2.4`.\n    typescript\n    // lib/constructs/routes/merchant-api-routes.ts\n    import { Construct } from 'constructs';\n    import * as apigateway from 'aws-cdk-lib/aws-apigateway';\n\n    export interface MerchantApiRoutesProps {\n      readonly api: apigateway.RestApi;\n      readonly authorizer: apigateway.IAuthorizer;\n      // Define integrations for each backend service the merchant API interacts with\n      readonly campaignServiceIntegration: apigateway.Integration;\n      readonly productCatalogServiceIntegration: apigateway.Integration;\n      readonly analyticsServiceIntegration: apigateway.Integration;\n      // ... add other integrations as needed (promotions, A/B tests, etc.)\n    }\n\n    export class MerchantApiRoutes extends Construct {\n      constructor(scope: Construct, id: string, props: MerchantApiRoutesProps) {\n        super(scope, id);\n\n        const commonMethodOptions: apigateway.MethodOptions = {\n            authorizer: props.authorizer,\n            // Add API Key requirement if needed: apiKeyRequired: true\n        };\n\n        // --- Campaign Management Endpoints ---\n        // Corresponds to REPO-CAMP-001 for campaign, ad set, ad, A/B test management\n        const campaignsRoot = props.api.root.addResource('merchant').addResource('v1').addResource('campaigns'); // e.g. /merchant/v1/campaigns\n\n        // GET /merchant/v1/campaigns\n        campaignsRoot.addMethod('GET', props.campaignServiceIntegration, commonMethodOptions);\n        // POST /merchant/v1/campaigns\n        campaignsRoot.addMethod('POST', props.campaignServiceIntegration, commonMethodOptions);\n\n        const campaignById = campaignsRoot.addResource('{campaignId}');\n        // GET /merchant/v1/campaigns/{campaignId}\n        campaignById.addMethod('GET', props.campaignServiceIntegration, commonMethodOptions);\n        // PUT /merchant/v1/campaigns/{campaignId}\n        campaignById.addMethod('PUT', props.campaignServiceIntegration, commonMethodOptions);\n        // DELETE /merchant/v1/campaigns/{campaignId}\n        // campaignById.addMethod('DELETE', props.campaignServiceIntegration, commonMethodOptions); // If applicable\n\n        // TODO: Add routes for Ad Sets within a campaign\n        // const adSets = campaignById.addResource('adsets');\n        // adSets.addMethod('GET', props.campaignServiceIntegration, commonMethodOptions);\n        // adSets.addMethod('POST', props.campaignServiceIntegration, commonMethodOptions);\n        // ... and so on for /adsets/{adSetId}, /ads, /abtests\n\n        // --- Product Catalog Management Endpoints ---\n        // Corresponds to [ID_ProductCatalog_ApiEndpoints]\n        const productCatalogsRoot = props.api.root.getResource('merchant')!.getResource('v1')!.addResource('product-catalogs');\n\n        // GET /merchant/v1/product-catalogs\n        productCatalogsRoot.addMethod('GET', props.productCatalogServiceIntegration, commonMethodOptions);\n        // POST /merchant/v1/product-catalogs\n        productCatalogsRoot.addMethod('POST', props.productCatalogServiceIntegration, commonMethodOptions);\n\n        const catalogById = productCatalogsRoot.addResource('{catalogId}');\n        // GET /merchant/v1/product-catalogs/{catalogId}\n        catalogById.addMethod('GET', props.productCatalogServiceIntegration, commonMethodOptions);\n        // ... other catalog methods\n\n        // --- Analytics & Reporting Endpoints ---\n        // Corresponds to [ID_Analytics_ApiEndpoints]\n        const analyticsRoot = props.api.root.getResource('merchant')!.getResource('v1')!.addResource('analytics');\n        // GET /merchant/v1/analytics/performance\n        analyticsRoot.addResource('performance').addMethod('GET', props.analyticsServiceIntegration, commonMethodOptions);\n\n        // --- Promotions & Offers ---\n        // (Map to Promotions_ApiEndpoints)\n        // const promotionsRoot = props.api.root.getResource('merchant')!.getResource('v1')!.addResource('promotions');\n        // promotionsRoot.addMethod('GET', props.promotionsServiceIntegration, commonMethodOptions);\n\n        // Add more routes for other merchant-facing features (A/B testing results, billing info view, etc.)\n      }\n    }\n    \n    *   **Note:** The other route constructs (`AdminApiRoutes`, `AffiliateApiRoutes`, `ThirdPartyAppApiRoutes`) will be structured similarly, referencing their specific backend integrations and OpenAPI definitions.\n\n#### 4.3.2. `infrastructure/api-gateway/lib/constructs/authorizers/jwt-lambda-authorizer-construct.ts`\n*   **Purpose:** Provisions the JWT Lambda Authorizer and its integration with API Gateway.\n*   **Key Responsibilities/Logic:**\n    *   Accepts `ILambdaAuthorizerProps`.\n    *   Defines a `lambda_nodejs.NodejsFunction` resource:\n        *   `entry`: Points to `lambda-authorizers/jwt-validator/index.ts`.\n        *   `handler`: `handler`.\n        *   `runtime`: e.g., `lambda.Runtime.NODEJS_20_X`.\n        *   `bundling`: Configures esbuild options if needed.\n        *   `environment`: Passes `JWKS_URI`, `JWT_ISSUER`, `JWT_AUDIENCE` from props.\n    *   Creates an `apigateway.TokenAuthorizer` (or `RequestAuthorizer` if more complex input is needed):\n        *   `handler`: The Lambda function created above.\n        *   `identitySource`: e.g., `apigateway.IdentitySource.header('Authorization')`.\n        *   `resultsCacheTtl`: Optional, e.g., `cdk.Duration.minutes(5)`.\n        *   `authorizerName`: From props.\n    *   Exposes the created `authorizer` instance.\n*   **Inputs (Props):** `ILambdaAuthorizerProps`.\n*   **Outputs:** `authorizer: apigateway.TokenAuthorizer`.\n*   **Implemented Features:** JWTValidation, LambdaAuthorizerCreation, APIGatewayAuthorizerResource.\n*   **Requirement IDs:** `3.2.4`, `REQ-IAM-007`, `REQ-03-004`.\n    typescript\n    // lib/constructs/authorizers/jwt-lambda-authorizer-construct.ts\n    import * as cdk from 'aws-cdk-lib';\n    import { Construct } from 'constructs';\n    import * as apigateway from 'aws-cdk-lib/aws-apigateway';\n    import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';\n    import * as lambda from 'aws-cdk-lib/aws-lambda';\n    import * as path from 'path';\n    import { ILambdaAuthorizerProps } from '../../interfaces/lambda-authorizer-props';\n\n    export class JwtLambdaAuthorizerConstruct extends Construct {\n      public readonly authorizer: apigateway.TokenAuthorizer; // Or RequestAuthorizer\n\n      constructor(scope: Construct, id: string, props: ILambdaAuthorizerProps) {\n        super(scope, id);\n\n        const authorizerFn = new lambdaNodeJs.NodejsFunction(this, 'JwtValidatorLambda', {\n          entry: path.join(__dirname, '../../../lambda-authorizers/jwt-validator/index.ts'),\n          handler: 'handler',\n          runtime: lambda.Runtime.NODEJS_20_X,\n          memorySize: 256,\n          timeout: cdk.Duration.seconds(10),\n          environment: {\n            JWKS_URI: props.jwksUri,\n            JWT_ISSUER: props.jwtIssuer,\n            JWT_AUDIENCE: props.jwtAudience.join(','), // Pass as comma-separated string\n          },\n          bundling: {\n            minify: true,\n            sourceMap: true,\n            externalModules: ['aws-sdk'], // aws-sdk is available in Lambda runtime\n          },\n        });\n\n        this.authorizer = new apigateway.TokenAuthorizer(this, props.authorizerName, {\n          handler: authorizerFn,\n          identitySource: apigateway.IdentitySource.header('Authorization'), // e.g., \"Bearer <token>\"\n          resultsCacheTtl: cdk.Duration.minutes(5), // Cache policy results\n          authorizerName: props.authorizerName,\n        });\n      }\n    }\n    \n\n#### 4.3.3. `infrastructure/api-gateway/lib/constructs/waf-integration-construct.ts`\n*   **Purpose:** Provisions AWS WAF protection for the API Gateway.\n*   **Key Responsibilities/Logic:**\n    *   Accepts optional props for custom rule configurations.\n    *   Defines a `wafv2.CfnWebACL` resource.\n        *   `scope`: `REGIONAL` (for API Gateway).\n        *   `defaultAction`: `{ allow: {} }` or `{ block: {} }`.\n        *   `visibilityConfig`: For CloudWatch metrics.\n        *   `rules`: An array of WAF rules.\n            *   Include AWS Managed Rule Groups (e.g., `AWSManagedRulesCommonRuleSet`, `AWSManagedRulesAmazonIpReputationList`, `AWSManagedRulesKnownBadInputsRuleSet`).\n            *   Optionally, define custom rate-based rules or rules for SQL injection/XSS protection if not fully covered by managed rules.\n    *   Exposes the `webAclArn`.\n*   **Inputs (Props):** `WafIntegrationConstructProps` (optional, for rule customization and scope).\n*   **Outputs:** `webAclArn: string`.\n*   **Implemented Features:** WAFRuleDefinition, WebACLAssociation (association happens in the main stack).\n*   **Requirement IDs:** `3.2.4`, `REQ-POA-017`.\n    typescript\n    // lib/constructs/waf-integration-construct.ts\n    import * as cdk from 'aws-cdk-lib';\n    import { Construct } from 'constructs';\n    import * as wafv2 from 'aws-cdk-lib/aws-wafv2';\n\n    export interface WafIntegrationConstructProps {\n        // 'REGIONAL' for API Gateway, ALB. 'CLOUDFRONT' for CloudFront distributions.\n        readonly scope: 'REGIONAL' | 'CLOUDFRONT';\n        // Add more props if custom rules or configurations are needed\n    }\n\n    export class WafIntegrationConstruct extends Construct {\n      public readonly webAclArn: string;\n\n      constructor(scope: Construct, id: string, props: WafIntegrationConstructProps) {\n        super(scope, id);\n\n        const webAcl = new wafv2.CfnWebACL(this, 'AdManagerWebAcl', {\n          name: `AdManagerWebAcl-${cdk.Stack.of(this).region}-${props.scope}`,\n          scope: props.scope,\n          defaultAction: { allow: {} }, // Default to allow, block with rules\n          visibilityConfig: {\n            cloudWatchMetricsEnabled: true,\n            metricName: `AdManagerWebAclMetric-${props.scope}`,\n            sampledRequestsEnabled: true,\n          },\n          rules: [\n            // AWS Managed Rule: Common Rule Set\n            {\n              name: 'AWS-AWSManagedRulesCommonRuleSet',\n              priority: 10,\n              statement: {\n                managedRuleGroupStatement: {\n                  vendorName: 'AWS',\n                  name: 'AWSManagedRulesCommonRuleSet',\n                },\n              },\n              overrideAction: { none: {} },\n              visibilityConfig: {\n                sampledRequestsEnabled: true,\n                cloudWatchMetricsEnabled: true,\n                metricName: 'AWSManagedRulesCommonRuleSetMetric',\n              },\n            },\n            // AWS Managed Rule: Known Bad Inputs\n            {\n              name: 'AWS-AWSManagedRulesKnownBadInputsRuleSet',\n              priority: 20,\n              statement: {\n                managedRuleGroupStatement: {\n                  vendorName: 'AWS',\n                  name: 'AWSManagedRulesKnownBadInputsRuleSet',\n                },\n              },\n              overrideAction: { none: {} },\n              visibilityConfig: {\n                sampledRequestsEnabled: true,\n                cloudWatchMetricsEnabled: true,\n                metricName: 'AWSManagedRulesKnownBadInputsRuleSetMetric',\n              },\n            },\n            // AWS Managed Rule: IP Reputation List\n            {\n              name: 'AWS-AWSManagedRulesAmazonIpReputationList',\n              priority: 30,\n              statement: {\n                managedRuleGroupStatement: {\n                  vendorName: 'AWS',\n                  name: 'AWSManagedRulesAmazonIpReputationList',\n                },\n              },\n              overrideAction: { none: {} },\n              visibilityConfig: {\n                sampledRequestsEnabled: true,\n                cloudWatchMetricsEnabled: true,\n                metricName: 'AWSManagedRulesAmazonIpReputationListMetric',\n              },\n            },\n            // Example: Rate-based rule to mitigate DDoS (adjust limits as needed)\n            {\n                name: 'RateLimitRule',\n                priority: 1,\n                action: { block: {} }, // or { count: {} } to test\n                statement: {\n                    rateBasedStatement: {\n                        limit: 2000, // Max requests per 5-minute period per IP\n                        aggregateKeyType: 'IP',\n                    },\n                },\n                visibilityConfig: {\n                    sampledRequestsEnabled: true,\n                    cloudWatchMetricsEnabled: true,\n                    metricName: 'RateLimitRuleMetric',\n                },\n            },\n          ],\n        });\n        this.webAclArn = webAcl.attrArn;\n      }\n    }\n    \n\n#### 4.3.4. `infrastructure/api-gateway/lib/constructs/openapi-definitions-construct.ts`\n*   **Purpose:** Manages and provides access to OpenAPI definitions for the API Gateway.\n*   **Key Responsibilities/Logic:**\n    *   Loads OpenAPI YAML files from the `openapi/` directory using `apigateway.AssetApiDefinition` or constructs `apigateway.InlineApiDefinition`.\n    *   Provides methods to retrieve these definitions (e.g., `getMerchantApiDefinition()`).\n    *   These definitions can be used by `apigateway.SpecRestApi` or for configuring `apigateway.Model` and `apigateway.RequestValidator` resources if not using `SpecRestApi`.\n*   **Inputs (Props):** `OpenApiDefinitionsConstructProps` (optional, e.g., path to OpenAPI files).\n*   **Outputs:** Methods returning `apigateway.ApiDefinition`.\n*   **Implemented Features:** OpenAPISpecificationManagement, APIDocumentationIntegration.\n*   **Requirement IDs:** `REQ-SUD-015`, `3.3.2.3`, `REQ-TCE-008`.\n    typescript\n    // lib/constructs/openapi-definitions-construct.ts\n    import { Construct } from 'constructs';\n    import * as apigateway from 'aws-cdk-lib/aws-apigateway';\n    import * as path from 'path';\n    import * as fs from 'fs';\n    import * as yaml from 'js-yaml'; // Dependency: js-yaml\n\n    export interface OpenApiDefinitionsConstructProps {\n        // Optional: base path to OpenAPI files if not default\n        readonly openApiDir?: string;\n    }\n\n    export class OpenApiDefinitionsConstruct extends Construct {\n      private readonly baseDir: string;\n\n      constructor(scope: Construct, id: string, props?: OpenApiDefinitionsConstructProps) {\n        super(scope, id);\n        this.baseDir = props?.openApiDir || path.join(__dirname, '../../../openapi');\n      }\n\n      private loadApiDefinition(fileName: string): apigateway.InlineApiDefinition {\n        const filePath = path.join(this.baseDir, fileName);\n        // This is a simplified loader. For complex $ref handling across files before CDK processing,\n        // a pre-processing step or a more sophisticated OpenAPI bundler might be needed.\n        // CDK's SpecRestApi can handle S3 assets which might simplify cross-file $refs if bundled.\n        const fileContent = fs.readFileSync(filePath, 'utf8');\n        const definition = yaml.load(fileContent);\n        return apigateway.ApiDefinition.fromInline(definition);\n      }\n\n      // Example: This method would ideally merge or provide a way to combine specs if needed\n      // or simply provide individual specs to be used by different RestApi constructs if APIs are split.\n      // For a single unified API Gateway, you might create a combined spec or use one primary spec.\n\n      public getMerchantApiDefinition(): apigateway.InlineApiDefinition {\n        // Assuming merchant-api.yaml is the primary or includes others via $ref if SpecRestApi handles it.\n        // For now, just loading it directly.\n        return this.loadApiDefinition('merchant-api.yaml');\n      }\n\n      public getThirdPartyApiDefinition(): apigateway.InlineApiDefinition {\n        return this.loadApiDefinition('third-party-app-api.yaml');\n      }\n\n      // Add similar methods for admin-api.yaml, affiliate-api.yaml\n      // Or a method to get a combined/root definition if SpecRestApi is used with a single large spec\n      public getRootApiSpecForSpecRestApi(): apigateway.AssetApiDefinition {\n        // This would point to a single root OpenAPI file that $refs others,\n        // and that file would be uploaded as an S3 asset.\n        // Example:\n        // const apiSpecAsset = new s3assets.Asset(this, 'ApiSpecAsset', {\n        //   path: path.join(this.baseDir, 'unified-api-root.yaml'), // A root spec file\n        // });\n        // return apigateway.ApiDefinition.fromS3Bucket(apiSpecAsset.bucket, apiSpecAsset.s3ObjectKey);\n        throw new Error('getRootApiSpecForSpecRestApi not fully implemented; requires S3 asset handling for SpecRestApi.');\n      }\n    }\n    \n\n### 4.4. Lambda Authorizer\n\n#### 4.4.1. `infrastructure/api-gateway/lambda-authorizers/jwt-validator/index.ts`\n*   **Purpose:** AWS Lambda function handler for JWT-based request authorization.\n*   **Key Responsibilities/Logic:**\n    1.  **Extract Token:** Retrieves the JWT from the `event.authorizationToken` (typically \"Bearer <token>\", so needs parsing).\n    2.  **Environment Variables:** Reads `JWKS_URI`, `JWT_ISSUER`, `JWT_AUDIENCE` from `process.env`.\n    3.  **JWKS Client:** Initializes `jwks-rsa` client with the `JWKS_URI`.\n    4.  **Get Signing Key:** Implements `getSigningKey` callback for `jsonwebtoken.verify` to fetch the public key from JWKS based on `kid` in token header.\n    5.  **Verify Token:** Uses `jsonwebtoken.verify` with the fetched signing key and options:\n        *   `issuer`: `JWT_ISSUER`.\n        *   `audience`: `JWT_AUDIENCE.split(',')`.\n        *   `algorithms`: E.g., `['RS256']`.\n    6.  **Handle Validation Errors:** Catches errors from `verify` (expired, invalid signature, wrong issuer/audience) and returns a `Deny` policy.\n    7.  **Policy Generation:** If token is valid:\n        *   Extracts `principalId` (e.g., `sub` claim from JWT).\n        *   Extracts claims for coarse-grained authorization if needed (e.g., `roles`, `scopes`).\n        *   Calls `generatePolicy` (from `auth-policy.ts`) to create an `Allow` policy for `event.methodArn`.\n        *   Optionally add custom context to the policy.\n*   **Implemented Features:** JWTValidation, ClaimVerification, IAMPolicyGeneration.\n*   **Requirement IDs:** `3.2.4`, `REQ-IAM-007`, `REQ-03-004`.\n    typescript\n    // lambda-authorizers/jwt-validator/index.ts\n    import {\n      APIGatewayTokenAuthorizerEvent,\n      APIGatewayRequestAuthorizerEvent, // If using request authorizer\n      Context,\n      AuthResponse,\n      PolicyDocument,\n    } from 'aws-lambda';\n    import * as jwt from 'jsonwebtoken';\n    import { JwksClient } from 'jwks-rsa';\n    import { generatePolicy } from './auth-policy'; // Assuming auth-policy.ts is in the same directory\n\n    const jwksUri = process.env.JWKS_URI!;\n    const jwtIssuer = process.env.JWT_ISSUER!;\n    const jwtAudience = process.env.JWT_AUDIENCE!.split(',');\n\n    const client = new JwksClient({\n      jwksUri: jwksUri,\n      cache: true, // Enable caching of signing keys\n      rateLimit: true, // Enable rate limiting for JWKS fetching\n      jwksRequestsPerMinute: 10,\n    });\n\n    function getToken(event: APIGatewayTokenAuthorizerEvent): string | null {\n      if (!event.authorizationToken) {\n        console.log('No authorizationToken found in event');\n        return null;\n      }\n      const parts = event.authorizationToken.split(' ');\n      if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {\n        console.log('Authorization token is not a Bearer token');\n        return null;\n      }\n      return parts[1];\n    }\n\n    // Callback for jsonwebtoken.verify to fetch signing key\n    const getKey = (header: jwt.JwtHeader, callback: (err: Error | null, key?: string | Buffer) => void): void => {\n      if (!header.kid) {\n        callback(new Error('Token KID (Key ID) is missing'));\n        return;\n      }\n      client.getSigningKey(header.kid, (err, key) => {\n        if (err) {\n          console.error('Error fetching signing key:', err);\n          callback(err);\n          return;\n        }\n        const signingKey = key?.getPublicKey(); // or key.rsaPublicKey for older jwks-rsa versions\n        if (!signingKey) {\n            callback(new Error('Signing key could not be retrieved.'));\n            return;\n        }\n        callback(null, signingKey);\n      });\n    };\n\n    export const handler = async (\n      event: APIGatewayTokenAuthorizerEvent, // Or APIGatewayRequestAuthorizerEvent\n      context: Context\n    ): Promise<AuthResponse> => {\n      console.log('Received event:', JSON.stringify(event, null, 2));\n\n      const token = getToken(event);\n\n      if (!token) {\n        console.log('Unauthorized: No token provided or malformed.');\n         // In a real scenario, you might return 'Unauthorized' error to API Gateway\n         // which then sends a 401. For a Lambda authorizer, returning a Deny policy\n         // effectively blocks access and API Gateway typically returns a 403 Forbidden.\n        return generatePolicy('unauthorized_user', 'Deny', event.methodArn);\n      }\n\n      try {\n        const decoded = await new Promise<jwt.JwtPayload | string>((resolve, reject) => {\n          jwt.verify(token, getKey, {\n            issuer: jwtIssuer,\n            audience: jwtAudience,\n            algorithms: ['RS256'], // Specify your algorithm\n          }, (err, decodedToken) => {\n            if (err) {\n              console.error('JWT verification error:', err.message);\n              reject(err);\n            } else {\n              resolve(decodedToken as jwt.JwtPayload);\n            }\n          });\n        });\n\n        if (typeof decoded === 'string' || !decoded.sub) {\n          console.log('Unauthorized: Invalid token payload or missing sub.');\n          return generatePolicy('invalid_token_user', 'Deny', event.methodArn);\n        }\n\n        const principalId = decoded.sub; // Use 'sub' claim as principalId\n        console.log(`Authorized principal: ${principalId}`);\n\n        // Optional: Perform coarse-grained role/scope checks based on token claims\n        // const userRoles = decoded.roles || []; // Example claim\n        // if (!userRoles.includes('merchant-api-access')) {\n        //   console.log(`Principal ${principalId} does not have required role/scope.`);\n        //   return generatePolicy(principalId, 'Deny', event.methodArn);\n        // }\n\n        // Add claims to context for backend services (if using request authorizer)\n        const authorizerContext: { [key: string]: string | number | boolean } = {\n            principalId: principalId,\n            userId: decoded.sub, // often same as principalId\n            // Add other claims you want to pass to backend services\n            // Example: \"tenantId\": decoded.tenantId,\n            // \"roles\": JSON.stringify(userRoles),\n        };\n\n\n        return generatePolicy(principalId, 'Allow', event.methodArn, authorizerContext);\n\n      } catch (error: any) {\n        console.error('Authorization error:', error.message);\n        // For Deny, principalId can be arbitrary as it won't be used if access is denied\n        return generatePolicy('error_user', 'Deny', event.methodArn);\n      }\n    };\n\n    \n\n#### 4.4.2. `infrastructure/api-gateway/lambda-authorizers/jwt-validator/package.json`\n*   **Purpose:** Manages dependencies for the JWT Validator Lambda function.\n*   **Key Responsibilities/Logic:**\n    json\n    {\n      \"name\": \"jwt-validator-lambda\",\n      \"version\": \"1.0.0\",\n      \"description\": \"Lambda function for JWT validation for API Gateway\",\n      \"main\": \"index.js\",\n      \"private\": true,\n      \"dependencies\": {\n        \"jsonwebtoken\": \"^9.0.2\",\n        \"jwks-rsa\": \"^3.1.0\"\n      },\n      \"devDependencies\": {\n        \"@types/aws-lambda\": \"^8.10.130\",\n        \"@types/jsonwebtoken\": \"^9.0.5\"\n      }\n    }\n    \n*   **Implemented Features:** LambdaDependencyManagement.\n*   **Requirement IDs:** `3.2.4`.\n\n#### 4.4.3. `infrastructure/api-gateway/lambda-authorizers/jwt-validator/auth-policy.ts`\n*   **Purpose:** Utility module to construct IAM policy documents for API Gateway Lambda authorizers.\n*   **Key Responsibilities/Logic:**\n    *   Provides `generatePolicy` function.\n    *   Input: `principalId`, `effect` ('Allow' or 'Deny'), `resource` (method ARN or wildcard), `context` (optional key-value pairs).\n    *   Output: `AuthResponse` object with `principalId`, `policyDocument`, and `context`.\n*   **Implemented Features:** IAMPolicyGenerationForAuthorizer.\n*   **Requirement IDs:** `3.2.4`, `REQ-IAM-007`.\n    typescript\n    // lambda-authorizers/jwt-validator/auth-policy.ts\n    import { AuthResponse, PolicyDocument, Statement } from 'aws-lambda';\n\n    export const generatePolicy = (\n        principalId: string,\n        effect: 'Allow' | 'Deny',\n        resource: string | string[],\n        context?: { [key: string]: string | number | boolean }\n    ): AuthResponse => {\n        const policyDocument: PolicyDocument = {\n            Version: '2012-10-17',\n            Statement: [\n                {\n                    Action: 'execute-api:Invoke',\n                    Effect: effect,\n                    Resource: resource,\n                },\n            ],\n        };\n\n        const authResponse: AuthResponse = {\n            principalId: principalId,\n            policyDocument: policyDocument,\n        };\n\n        if (context) {\n            authResponse.context = context;\n        }\n\n        console.log('Generated policy:', JSON.stringify(authResponse));\n        return authResponse;\n    };\n    \n\n### 4.5. OpenAPI Specifications\n\n#### 4.5.1. `infrastructure/api-gateway/openapi/merchant-api.yaml`\n*   **Purpose:** Defines the API contract for the Merchant Portal.\n*   **Key Responsibilities/Logic:**\n    *   `openapi: 3.1.0`\n    *   `info`: title, version, description.\n    *   `servers`: API Gateway stage URLs.\n    *   `paths`: Definitions for all merchant-facing endpoints:\n        *   `/merchant/v1/campaigns`, `/merchant/v1/campaigns/{campaignId}`\n        *   `/merchant/v1/product-catalogs`, `/merchant/v1/product-catalogs/{catalogId}`\n        *   `/merchant/v1/analytics/performance`\n        *   etc.\n    *   For each path and HTTP method: `summary`, `operationId`, `tags`, `parameters`, `requestBody`, `responses`.\n    *   `security`: References JWT security scheme defined in `shared-components.yaml`.\n    *   `components`: Uses `$ref: './shared-components.yaml#/components/schemas/...'` for request/response bodies and parameters.\n*   **Implemented Features:** MerchantAPIDefinition.\n*   **Requirement IDs:** `REQ-SUD-015`, `3.3.2.1`.\n\n#### 4.5.2. `infrastructure/api-gateway/openapi/admin-api.yaml`\n*   **Purpose:** Defines the API contract for the Platform Admin Portal.\n*   **Key Responsibilities/Logic:** Similar structure to `merchant-api.yaml`, but for admin endpoints (e.g., `/admin/v1/users`, `/admin/v1/platform-settings`).\n*   **Implemented Features:** AdminAPIDefinition.\n*   **Requirement IDs:** `REQ-SUD-015`, `3.3.2.1`.\n\n#### 4.5.3. `infrastructure/api-gateway/openapi/affiliate-api.yaml`\n*   **Purpose:** Defines the API contract for the Affiliate Portal.\n*   **Key Responsibilities/Logic:** Similar structure, for affiliate endpoints (e.g., `/affiliate/v1/dashboard`, `/affiliate/v1/payouts`).\n*   **Implemented Features:** AffiliateAPIDefinition.\n*   **Requirement IDs:** `REQ-SUD-015`, `3.3.2.1`.\n\n#### 4.5.4. `infrastructure/api-gateway/openapi/third-party-app-api.yaml`\n*   **Purpose:** Defines the API contract for third-party applications.\n*   **Key Responsibilities/Logic:**\n    *   Similar structure, for third-party app endpoints (e.g., `/external/v1/data-points`).\n    *   `securitySchemes` might define OAuth 2.0 flows specific to third-party apps, in addition to or instead of JWT from `shared-components.yaml` if the auth mechanism differs.\n*   **Implemented Features:** ThirdPartyAppAPIDefinition.\n*   **Requirement IDs:** `REQ-SUD-015`, `3.3.2.3`, `REQ-TCE-008`.\n\n#### 4.5.5. `infrastructure/api-gateway/openapi/shared-components.yaml`\n*   **Purpose:** Contains reusable OpenAPI components.\n*   **Key Responsibilities/Logic:**\n    *   `components:`\n        *   `schemas:` (e.g., `Campaign`, `AdSet`, `ErrorResponse`, `PaginationInfo`, common request/response payloads).\n        *   `securitySchemes:` (e.g., `JWTBearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }`).\n        *   `parameters:` (e.g., `merchantIdHeader`, `correlationIdHeader`).\n        *   `responses:` (e.g., `UnauthorizedError`, `NotFoundError`, `GenericError`).\n*   **Implemented Features:** SharedAPISchemas, SharedSecuritySchemes.\n*   **Requirement IDs:** `REQ-SUD-015`.\n\n## 5. Security Considerations\n\n*   **Authentication:** All protected API Gateway routes will be secured using the JWT Lambda Authorizer. The authorizer validates JWTs issued by a trusted Identity Provider (e.g., Amazon Cognito or `[PlatformName]`'s core auth system).\n*   **Authorization:** Coarse-grained authorization can be implemented within the Lambda authorizer by checking claims (e.g., roles, scopes) present in the JWT. Finer-grained authorization is the responsibility of the backend microservices.\n*   **AWS WAF:** AWS WAF will be integrated to protect against common web exploits (OWASP Top 10), SQL injection, XSS, and to implement rate-based rules.\n*   **HTTPS/TLS:** All communication with the API Gateway will be over HTTPS/TLS 1.2+.\n*   **IAM Policies:** The Lambda authorizer function and other Lambda integrations will have minimal IAM permissions necessary for their operation (Principle of Least Privilege).\n*   **CORS:** Cross-Origin Resource Sharing policies will be configured at the API Gateway level to allow access from authorized frontend domains.\n*   **Rate Limiting & Throttling:** Global and per-route rate limiting and throttling will be configured on API Gateway to protect backend services from abuse and ensure availability.\n*   **Input Validation:** Request validation based on OpenAPI schemas can be enabled at the API Gateway level to reject malformed requests early.\n\n## 6. Deployment\n\n*   The API Gateway infrastructure will be deployed using the AWS CDK CLI (`cdk deploy`).\n*   CI/CD pipelines (e.g., AWS CodePipeline, CodeBuild, CodeDeploy as per REQ-POA-005) will automate the deployment process for different stages (dev, staging, prod).\n*   Environment-specific configurations (backend URLs, JWKS URIs, domain names) will be managed using CDK context, environment variables, or AWS Systems Manager Parameter Store.\n\n## 7. Monitoring & Logging\n\n*   **Amazon CloudWatch Logs:** API Gateway execution logs will be enabled, providing detailed information about requests, responses, and authorizer invocations. Lambda authorizer logs will also be sent to CloudWatch Logs.\n*   **Amazon CloudWatch Metrics:** API Gateway automatically publishes metrics (e.g., `Count`, `Latency`, `4XXError`, `5XXError`) to CloudWatch. Custom metrics can also be published from Lambda functions.\n*   **Amazon CloudWatch Alarms:** Alarms will be configured based on key metrics (e.g., high error rates, high latency) to notify operations personnel via SNS/SES (as per REQ-POA-003).\n*   **AWS X-Ray:** If deeper tracing is required, X-Ray can be enabled for API Gateway and integrated Lambda functions to trace requests across services.\n\n## 8. Error Handling\n*   The API Gateway will return standard HTTP status codes for errors.\n*   The Lambda authorizer will return appropriate IAM policies (`Allow`/`Deny`). If `Deny`, API Gateway typically returns a 403 Forbidden. If the token is malformed or missing, API Gateway can be configured to return a 401 Unauthorized.\n*   Backend services are responsible for their own error handling and returning appropriate error responses, which API Gateway will proxy.\n*   Error responses should follow a standardized format (e.g., defined in `shared-components.yaml`).\n\nThis SDS provides a comprehensive plan for developing the `AdManager.Unified.ApiGateway.Config` repository. Subsequent development should adhere to these specifications to ensure a robust, secure, and scalable API Gateway.\n"
 }