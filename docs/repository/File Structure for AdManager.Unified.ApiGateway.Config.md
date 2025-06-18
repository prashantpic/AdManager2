# Specification

# 1. Files

- **Path:** infrastructure/api-gateway/package.json  
**Description:** Defines project metadata, scripts (e.g., for CDK commands), and dependencies for the AWS CDK application, including CDK core libraries, assert libraries, and any specific CDK construct libraries for API Gateway, Lambda, WAF, etc.  
**Template:** TypeScript AWS CDK Project  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../package.json  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - InfrastructureAsCode
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - CDK Project Setup
    - DependencyManagement
    
**Requirement Ids:**
    
    - 4.2.4
    
**Purpose:** Manages Node.js project dependencies and scripts for building and deploying the API Gateway infrastructure.  
**Logic Description:** Contains dependencies like 'aws-cdk-lib', '@aws-cdk/aws-apigatewayv2-alpha', '@aws-cdk/aws-lambda-nodejs', 'typescript', 'aws-cdk'. Includes scripts for 'cdk synth', 'cdk deploy', 'cdk diff', 'test', 'build'.  
**Documentation:**
    
    - **Summary:** Standard NPM package file for managing the AWS CDK project that defines the API Gateway infrastructure.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** infrastructure/api-gateway/tsconfig.json  
**Description:** TypeScript compiler options for the AWS CDK project. Configures how TypeScript files are transpiled to JavaScript, including target ECMAScript version, module system, strict type checking, and source map generation.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ../tsconfig.json  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - InfrastructureAsCode
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScriptCompilation
    
**Requirement Ids:**
    
    - 4.2.4
    
**Purpose:** Configures the TypeScript compiler for the CDK application.  
**Logic Description:** Specifies compiler options such as 'target', 'module', 'strict', 'esModuleInterop', 'outDir', 'rootDir'. Ensures compatibility with AWS CDK and Node.js runtime.  
**Documentation:**
    
    - **Summary:** TypeScript configuration file for the AWS CDK project, defining how .ts files are compiled.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** infrastructure/api-gateway/cdk.json  
**Description:** Configuration file for the AWS CDK Toolkit. Specifies the entry point of the CDK application (e.g., 'bin/api-gateway.js'), context values, feature flags, and other settings used by the CDK CLI.  
**Template:** AWS CDK Configuration  
**Dependancy Level:** 0  
**Name:** cdk  
**Type:** Configuration  
**Relative Path:** ../cdk.json  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - InfrastructureAsCode
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - CDKToolkitConfiguration
    
**Requirement Ids:**
    
    - 4.2.4
    
**Purpose:** Provides configuration for the AWS CDK command-line interface.  
**Logic Description:** Defines the 'app' command (e.g., 'npx ts-node --prefer-ts-exts bin/api-gateway.ts'), context variables for environment-specific deployments, and any required CDK feature flags.  
**Documentation:**
    
    - **Summary:** AWS CDK toolkit configuration file specifying how to execute the CDK application.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** infrastructure/api-gateway/bin/api-gateway.ts  
**Description:** The entry point for the AWS CDK application. This file instantiates the main API Gateway stack, passing any necessary environment configurations or context values.  
**Template:** AWS CDK App EntryPoint  
**Dependancy Level:** 1  
**Name:** api-gateway-app  
**Type:** ApplicationEntry  
**Relative Path:** bin/api-gateway.ts  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - InfrastructureAsCode
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - CDKAppInitialization
    
**Requirement Ids:**
    
    - 4.2.4
    
**Purpose:** Initializes and synthesizes the AWS CDK application, defining the API Gateway stack(s).  
**Logic Description:** Imports 'aws-cdk-lib' and the main stack definition (e.g., 'ApiGatewayStack' from '../lib/api-gateway-stack'). Creates a new CDK App instance. Instantiates the 'ApiGatewayStack', potentially for multiple environments (dev, prod) based on context or environment variables.  
**Documentation:**
    
    - **Summary:** Main executable file for the AWS CDK application that defines the API Gateway infrastructure.
    
**Namespace:** AdManager.Platform.Gateway.App  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** infrastructure/api-gateway/lib/config/gateway-settings.ts  
**Description:** Defines interfaces and default values for API Gateway configurations such as rate limits, throttling, CORS policies, custom domain names, and stage-specific settings.  
**Template:** TypeScript Configuration Model  
**Dependancy Level:** 1  
**Name:** GatewaySettings  
**Type:** ConfigurationModel  
**Relative Path:** lib/config/gateway-settings.ts  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - InfrastructureAsCode
    
**Members:**
    
    - **Name:** defaultRateLimit  
**Type:** number  
**Attributes:** public  
    - **Name:** defaultBurstLimit  
**Type:** number  
**Attributes:** public  
    - **Name:** defaultCorsOptions  
**Type:** apigateway.CorsOptions  
**Attributes:** public  
    - **Name:** customDomainName  
**Type:** string | undefined  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - GatewayConfigurationSchema
    
**Requirement Ids:**
    
    - 3.3.2.1
    - 4.2.4
    
**Purpose:** Provides a typed structure and defaults for configuring various aspects of the API Gateway.  
**Logic Description:** Exports interfaces like 'IGatewayConfig', 'IStageConfig'. Provides default constant values for CORS (allowOrigins, allowMethods, allowHeaders), rate limits, and other global API Gateway settings that can be overridden by environment-specific configurations.  
**Documentation:**
    
    - **Summary:** Defines the data structures and default settings for API Gateway configurations.
    
**Namespace:** AdManager.Platform.Gateway.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** infrastructure/api-gateway/lib/interfaces/lambda-authorizer-props.ts  
**Description:** Defines the TypeScript interface for properties passed to the JWT Lambda Authorizer construct, including JWKS URI, issuer, and audience.  
**Template:** TypeScript Interface  
**Dependancy Level:** 1  
**Name:** ILambdaAuthorizerProps  
**Type:** Interface  
**Relative Path:** lib/interfaces/lambda-authorizer-props.ts  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** jwksUri  
**Type:** string  
**Attributes:** readonly  
    - **Name:** jwtIssuer  
**Type:** string  
**Attributes:** readonly  
    - **Name:** jwtAudience  
**Type:** string[]  
**Attributes:** readonly  
    - **Name:** authorizerName  
**Type:** string  
**Attributes:** readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - LambdaAuthorizerConfigurationSchema
    
**Requirement Ids:**
    
    - 3.2.4
    - REQ-IAM-007
    
**Purpose:** Provides a contract for configuring the JWT Lambda Authorizer CDK construct.  
**Logic Description:** Exports an interface 'ILambdaAuthorizerProps' specifying required configuration like JWKS endpoint URL, token issuer, expected audience(s) for JWT validation.  
**Documentation:**
    
    - **Summary:** Interface defining the properties required to configure the JWT Lambda Authorizer.
    
**Namespace:** AdManager.Platform.Gateway.Interfaces  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** infrastructure/api-gateway/lib/api-gateway-stack.ts  
**Description:** Main AWS CDK stack definition for the Unified API Gateway. This stack orchestrates the creation of API Gateway resources, routes, integrations, authorizers, WAF, custom domains, and stages.  
**Template:** AWS CDK Stack  
**Dependancy Level:** 3  
**Name:** ApiGatewayStack  
**Type:** InfrastructureStack  
**Relative Path:** lib/api-gateway-stack.ts  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - InfrastructureAsCode
    - APIGatewayPattern
    
**Members:**
    
    - **Name:** api  
**Type:** apigateway.RestApi  
**Attributes:** public|readonly  
    - **Name:** wafAcl  
**Type:** wafv2.CfnWebACL  
**Attributes:** private  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props?: cdk.StackProps
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** createMerchantRoutes  
**Parameters:**
    
    - api: apigateway.RestApi
    - authorizer: apigateway.IAuthorizer
    
**Return Type:** void  
**Attributes:** private  
    - **Name:** createAdminRoutes  
**Parameters:**
    
    - api: apigateway.RestApi
    - authorizer: apigateway.IAuthorizer
    
**Return Type:** void  
**Attributes:** private  
    - **Name:** createAffiliateRoutes  
**Parameters:**
    
    - api: apigateway.RestApi
    - authorizer: apigateway.IAuthorizer
    
**Return Type:** void  
**Attributes:** private  
    - **Name:** createThirdPartyAppRoutes  
**Parameters:**
    
    - api: apigateway.RestApi
    - authorizer: apigateway.IAuthorizer
    
**Return Type:** void  
**Attributes:** private  
    - **Name:** setupWaf  
**Parameters:**
    
    
**Return Type:** wafv2.CfnWebACL  
**Attributes:** private  
    - **Name:** setupCustomDomain  
**Parameters:**
    
    - api: apigateway.RestApi
    
**Return Type:** void  
**Attributes:** private  
    
**Implemented Features:**
    
    - APIGatewayResourceCreation
    - RouteDefinition
    - IntegrationSetup
    - AuthorizerAttachment
    - WAFIntegration
    - CustomDomainSetup
    - StageDeployment
    
**Requirement Ids:**
    
    - 3.3.2.1
    - 4.2.4
    - 3.2.4
    - 3.3.2.3
    - REQ-IAM-007
    - REQ-TCE-008
    - REQ-POA-017
    
**Purpose:** Defines and provisions all AWS resources required for the Unified API Gateway using AWS CDK.  
**Logic Description:** Initializes an 'apigateway.RestApi' resource. Instantiates and uses route constructs (MerchantRoutes, AdminRoutes, etc.) to define API paths, methods, and integrations with backend services (endpoints sourced from SSM or environment variables). Instantiates and configures the JWT Lambda Authorizer construct and applies it to secured routes. Sets up global settings like CORS, rate limiting, and request validation based on OpenAPI specs. Integrates AWS WAF for security. Configures custom domain names and deployment stages (dev, prod).  
**Documentation:**
    
    - **Summary:** Core AWS CDK stack defining the entire API Gateway setup including all its routes, integrations, security, and operational configurations.
    
**Namespace:** AdManager.Platform.Gateway.Stacks  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** infrastructure/api-gateway/lib/constructs/routes/merchant-api-routes.ts  
**Description:** AWS CDK Construct defining API Gateway routes specifically for the Merchant Portal. Includes paths for campaign management, product catalogs, analytics, etc., integrating with respective backend microservices.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 2  
**Name:** MerchantApiRoutes  
**Type:** InfrastructureConstruct  
**Relative Path:** lib/constructs/routes/merchant-api-routes.ts  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - InfrastructureAsCode
    
**Members:**
    
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: MerchantApiRoutesProps
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** addCampaignRoutes  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** private  
    - **Name:** addProductCatalogRoutes  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** private  
    
**Implemented Features:**
    
    - MerchantPortalRouteDefinition
    - BackendServiceIntegration
    
**Requirement Ids:**
    
    - 3.3.2.1
    - 4.2.4
    
**Purpose:** Encapsulates the definition of API Gateway routes and integrations for the Merchant Portal.  
**Logic Description:** Defines resources and methods on the passed 'apigateway.RestApi' instance for merchant-facing functionalities. For each route (e.g., /campaigns, /products), configures HTTP methods (GET, POST, PUT, DELETE), request parameters, and integrations (e.g., HTTP proxy integration to backend services like REPO-CAMP-001). Applies the provided authorizer to secure these routes. Backend service URLs are typically passed via props, sourced from environment configuration.  
**Documentation:**
    
    - **Summary:** CDK construct for creating and configuring all API Gateway routes exposed to the Merchant Portal.
    
**Namespace:** AdManager.Platform.Gateway.Constructs.Routes  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** infrastructure/api-gateway/lib/constructs/routes/admin-api-routes.ts  
**Description:** AWS CDK Construct defining API Gateway routes for the Platform Admin Portal. Includes paths for platform settings, user management, system health, etc.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 2  
**Name:** AdminApiRoutes  
**Type:** InfrastructureConstruct  
**Relative Path:** lib/constructs/routes/admin-api-routes.ts  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - InfrastructureAsCode
    
**Members:**
    
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: AdminApiRoutesProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - AdminPortalRouteDefinition
    - BackendServiceIntegration
    
**Requirement Ids:**
    
    - 3.3.2.1
    - 4.2.4
    
**Purpose:** Encapsulates the definition of API Gateway routes and integrations for the Platform Admin Portal.  
**Logic Description:** Defines resources and methods for admin-facing functionalities (e.g., /platform-settings, /users, /system-health). Configures integrations with corresponding backend admin services. Applies a specific, more privileged authorizer if needed, or the standard JWT authorizer.  
**Documentation:**
    
    - **Summary:** CDK construct for creating and configuring all API Gateway routes exposed to the Platform Admin Portal.
    
**Namespace:** AdManager.Platform.Gateway.Constructs.Routes  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** infrastructure/api-gateway/lib/constructs/routes/affiliate-api-routes.ts  
**Description:** AWS CDK Construct defining API Gateway routes for the Affiliate Portal. Includes paths for affiliate performance, link generation, payout reports, etc.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 2  
**Name:** AffiliateApiRoutes  
**Type:** InfrastructureConstruct  
**Relative Path:** lib/constructs/routes/affiliate-api-routes.ts  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - InfrastructureAsCode
    
**Members:**
    
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: AffiliateApiRoutesProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - AffiliatePortalRouteDefinition
    - BackendServiceIntegration
    
**Requirement Ids:**
    
    - 3.3.2.1
    - 4.2.4
    
**Purpose:** Encapsulates the definition of API Gateway routes and integrations for the Affiliate Portal.  
**Logic Description:** Defines resources and methods for affiliate-facing functionalities (e.g., /performance, /tracking-links, /payouts). Configures integrations with the Affiliate Marketing backend service. Applies the standard JWT authorizer.  
**Documentation:**
    
    - **Summary:** CDK construct for creating and configuring all API Gateway routes exposed to the Affiliate Portal.
    
**Namespace:** AdManager.Platform.Gateway.Constructs.Routes  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** infrastructure/api-gateway/lib/constructs/routes/third-party-app-api-routes.ts  
**Description:** AWS CDK Construct defining API Gateway routes for authorized third-party applications integrating via the App Store framework. Exposes specific, sandboxed Ad Manager functionalities.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 2  
**Name:** ThirdPartyAppApiRoutes  
**Type:** InfrastructureConstruct  
**Relative Path:** lib/constructs/routes/third-party-app-api-routes.ts  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - InfrastructureAsCode
    
**Members:**
    
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: ThirdPartyAppApiRoutesProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - ThirdPartyAppRouteDefinition
    - OAuth2ScopedAccess
    
**Requirement Ids:**
    
    - 3.3.2.3
    - REQ-TCE-008
    - 4.2.4
    
**Purpose:** Defines the secure API endpoints for third-party application integrations.  
**Logic Description:** Defines a dedicated set of resources and methods for third-party apps (e.g., /external/v1/campaigns). Integrates with backend services, ensuring data access is scoped according to OAuth 2.0 permissions granted to the third-party app. Uses the JWT authorizer, which should validate tokens issued for third-party apps (potentially different issuer/audience). Request validation against OpenAPI specs is critical here.  
**Documentation:**
    
    - **Summary:** CDK construct for API Gateway routes exposed to third-party applications, adhering to App Store integration framework.
    
**Namespace:** AdManager.Platform.Gateway.Constructs.Routes  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** infrastructure/api-gateway/lib/constructs/authorizers/jwt-lambda-authorizer-construct.ts  
**Description:** AWS CDK Construct for creating and configuring the JWT Lambda Authorizer. This construct defines the Lambda function (pointing to the authorizer code) and the API Gateway Authorizer resource.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 2  
**Name:** JwtLambdaAuthorizerConstruct  
**Type:** InfrastructureConstruct  
**Relative Path:** lib/constructs/authorizers/jwt-lambda-authorizer-construct.ts  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - InfrastructureAsCode
    - LambdaAuthorizer
    
**Members:**
    
    - **Name:** authorizer  
**Type:** apigateway.TokenAuthorizer  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: ILambdaAuthorizerProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - JWTValidation
    - LambdaAuthorizerCreation
    - APIGatewayAuthorizerResource
    
**Requirement Ids:**
    
    - 3.2.4
    - REQ-IAM-007
    - REQ-03-004
    
**Purpose:** Provisions the JWT Lambda Authorizer and its integration with API Gateway.  
**Logic Description:** Defines an 'aws_lambda_nodejs.NodejsFunction' resource, pointing to the Lambda authorizer code in 'lambda-authorizers/jwt-validator'. Passes environment variables for JWKS URI, issuer, audience from props. Creates an 'apigateway.TokenAuthorizer' or 'apigateway.RequestAuthorizer' that uses this Lambda function. Configures authorizer caching and identity sources (e.g., 'Authorization' header).  
**Documentation:**
    
    - **Summary:** CDK construct responsible for deploying the JWT validation Lambda function and configuring it as an API Gateway authorizer.
    
**Namespace:** AdManager.Platform.Gateway.Constructs.Authorizers  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** infrastructure/api-gateway/lib/constructs/waf-integration-construct.ts  
**Description:** AWS CDK Construct for creating and associating AWS WAFv2 WebACLs with the API Gateway stages to protect against common web exploits.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 2  
**Name:** WafIntegrationConstruct  
**Type:** InfrastructureConstruct  
**Relative Path:** lib/constructs/waf-integration-construct.ts  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - InfrastructureAsCode
    - WebApplicationFirewall
    
**Members:**
    
    - **Name:** webAclArn  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props?: WafIntegrationConstructProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - WAFRuleDefinition
    - WebACLAssociation
    
**Requirement Ids:**
    
    - 3.2.4
    - REQ-POA-017
    
**Purpose:** Provisions AWS WAF protection for the API Gateway.  
**Logic Description:** Defines a 'wafv2.CfnWebACL' resource with a set of managed rules (e.g., AWSManagedRulesCommonRuleSet, AWSManagedRulesAmazonIpReputationList) and custom rules if necessary (e.g., rate-based rules, SQL injection protection). Associates this WebACL with the API Gateway stage(s).  
**Documentation:**
    
    - **Summary:** CDK construct for setting up AWS WAF and associating it with the API Gateway to enhance security.
    
**Namespace:** AdManager.Platform.Gateway.Constructs.Security  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** infrastructure/api-gateway/lib/constructs/openapi-definitions-construct.ts  
**Description:** AWS CDK Construct responsible for managing OpenAPI specification files and potentially integrating them with API Gateway for documentation or request validation.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 2  
**Name:** OpenApiDefinitionsConstruct  
**Type:** InfrastructureConstruct  
**Relative Path:** lib/constructs/openapi-definitions-construct.ts  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - InfrastructureAsCode
    
**Members:**
    
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: OpenApiDefinitionsConstructProps
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** getMerchantApiDefinition  
**Parameters:**
    
    
**Return Type:** apigateway.AssetApiDefinition | apigateway.InlineApiDefinition  
**Attributes:** public  
    - **Name:** getThirdPartyApiDefinition  
**Parameters:**
    
    
**Return Type:** apigateway.AssetApiDefinition | apigateway.InlineApiDefinition  
**Attributes:** public  
    
**Implemented Features:**
    
    - OpenAPISpecificationManagement
    - APIDocumentationIntegration
    
**Requirement Ids:**
    
    - REQ-SUD-015
    - 3.3.2.3
    - REQ-TCE-008
    
**Purpose:** Manages and provides access to OpenAPI definitions for the API Gateway.  
**Logic Description:** Reads OpenAPI specification files (e.g., from the 'openapi/' directory) using CDK assets or inline definitions. Exposes methods to get these definitions for use in API Gateway resource creation, for example, attaching them to a RestApi for documentation or enabling request validation based on the schema. This could involve 'apigateway.SpecRestApi' or by manually configuring models and request validators.  
**Documentation:**
    
    - **Summary:** CDK construct to handle the OpenAPI specification files, making them available for API Gateway configuration (e.g., for documentation or request validation).
    
**Namespace:** AdManager.Platform.Gateway.Constructs.ApiDefinition  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** infrastructure/api-gateway/lambda-authorizers/jwt-validator/index.ts  
**Description:** AWS Lambda function handler for JWT-based request authorization. Validates incoming JWTs, checks claims, and returns an IAM policy to allow or deny access to API Gateway resources.  
**Template:** AWS Lambda Handler (TypeScript)  
**Dependancy Level:** 1  
**Name:** jwt-validator-handler  
**Type:** LambdaFunction  
**Relative Path:** lambda-authorizers/jwt-validator/index.ts  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - LambdaAuthorizer
    
**Members:**
    
    
**Methods:**
    
    - **Name:** handler  
**Parameters:**
    
    - event: APIGatewayTokenAuthorizerEvent | APIGatewayRequestAuthorizerEvent
    - context: Context
    
**Return Type:** Promise<AuthResponse>  
**Attributes:** export const  
    
**Implemented Features:**
    
    - JWTValidation
    - ClaimVerification
    - IAMPolicyGeneration
    
**Requirement Ids:**
    
    - 3.2.4
    - REQ-IAM-007
    - REQ-03-004
    
**Purpose:** Validates JWT tokens for API Gateway requests and generates appropriate IAM policies.  
**Logic Description:** Retrieves the token from the event (e.g., 'event.authorizationToken'). Uses a library like 'jsonwebtoken' and 'jwks-rsa' to fetch JWKS keys from the configured JWKS URI (passed as environment variable). Verifies the token signature, expiration, issuer, and audience. Extracts relevant claims (e.g., user ID, roles/scopes). Based on validation success and claims, generates an IAM policy document (Allow/Deny) for the requested API Gateway method ARN. Implements coarse-grained role checks if required based on claims.  
**Documentation:**
    
    - **Summary:** Lambda function that acts as a custom authorizer for API Gateway, validating JWTs and controlling access.
    
**Namespace:** AdManager.Platform.Gateway.Authorizers  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** infrastructure/api-gateway/lambda-authorizers/jwt-validator/package.json  
**Description:** NPM package file for the JWT Validator Lambda function, specifying its dependencies like 'jsonwebtoken', 'jwks-rsa', and AWS SDK components if needed.  
**Template:** Node.js Package  
**Dependancy Level:** 0  
**Name:** jwt-validator-lambda-package  
**Type:** Configuration  
**Relative Path:** lambda-authorizers/jwt-validator/package.json  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - LambdaDependencyManagement
    
**Requirement Ids:**
    
    - 3.2.4
    
**Purpose:** Manages dependencies for the JWT Validator Lambda function.  
**Logic Description:** Lists dependencies such as 'jsonwebtoken', 'jwks-rsa', '@types/aws-lambda'. May include devDependencies like '@types/jsonwebtoken'. This file is used by 'aws_lambda_nodejs.NodejsFunction' in CDK to bundle the Lambda.  
**Documentation:**
    
    - **Summary:** Defines dependencies for the JWT Validator Lambda function.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** infrastructure/api-gateway/lambda-authorizers/jwt-validator/auth-policy.ts  
**Description:** Helper module to generate IAM policy documents required by API Gateway Lambda authorizers. Creates Allow or Deny policies for specific resources.  
**Template:** TypeScript Utility  
**Dependancy Level:** 1  
**Name:** AuthPolicyGenerator  
**Type:** Utility  
**Relative Path:** lambda-authorizers/jwt-validator/auth-policy.ts  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** generatePolicy  
**Parameters:**
    
    - principalId: string
    - effect: string
    - resource: string | string[]
    - context?: APIGatewayAuthorizerResultContext
    
**Return Type:** AuthResponse  
**Attributes:** export function  
    
**Implemented Features:**
    
    - IAMPolicyGenerationForAuthorizer
    
**Requirement Ids:**
    
    - 3.2.4
    - REQ-IAM-007
    
**Purpose:** Constructs the IAM policy object that the Lambda authorizer returns to API Gateway.  
**Logic Description:** Provides a function that takes principalId, effect (Allow/Deny), and resource ARN(s) as input. Constructs and returns an 'AuthResponse' object conforming to the structure expected by API Gateway, including the policy document and optional context data.  
**Documentation:**
    
    - **Summary:** Utility functions for creating the authorization policy returned by the Lambda authorizer.
    
**Namespace:** AdManager.Platform.Gateway.Authorizers.Utils  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** infrastructure/api-gateway/openapi/merchant-api.yaml  
**Description:** OpenAPI 3.x specification file defining the contract for the Merchant Portal API endpoints exposed through the API Gateway.  
**Template:** OpenAPI Specification  
**Dependancy Level:** 0  
**Name:** merchant-api-spec  
**Type:** APISpecification  
**Relative Path:** openapi/merchant-api.yaml  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - OpenAPI
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - MerchantAPIDefinition
    
**Requirement Ids:**
    
    - REQ-SUD-015
    - 3.3.2.1
    
**Purpose:** Provides a machine-readable definition of the Merchant API, used for documentation, client generation, and potentially request validation.  
**Logic Description:** Defines paths, operations (GET, POST, etc.), parameters, request bodies, responses, and schemas for all merchant-facing API endpoints (e.g., /campaigns, /products, /analytics). References shared components from 'shared-components.yaml'. Includes security schemes (JWT).  
**Documentation:**
    
    - **Summary:** OpenAPI specification for the Ad Manager Merchant API.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** APIDefinition
    
- **Path:** infrastructure/api-gateway/openapi/admin-api.yaml  
**Description:** OpenAPI 3.x specification file defining the contract for the Platform Admin Portal API endpoints.  
**Template:** OpenAPI Specification  
**Dependancy Level:** 0  
**Name:** admin-api-spec  
**Type:** APISpecification  
**Relative Path:** openapi/admin-api.yaml  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - OpenAPI
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - AdminAPIDefinition
    
**Requirement Ids:**
    
    - REQ-SUD-015
    - 3.3.2.1
    
**Purpose:** Provides a machine-readable definition of the Admin API.  
**Logic Description:** Defines paths, operations, parameters, and schemas for platform administration endpoints (e.g., /users, /settings, /health-checks). Includes security schemes.  
**Documentation:**
    
    - **Summary:** OpenAPI specification for the Ad Manager Platform Admin API.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** APIDefinition
    
- **Path:** infrastructure/api-gateway/openapi/affiliate-api.yaml  
**Description:** OpenAPI 3.x specification file defining the contract for the Affiliate Portal API endpoints.  
**Template:** OpenAPI Specification  
**Dependancy Level:** 0  
**Name:** affiliate-api-spec  
**Type:** APISpecification  
**Relative Path:** openapi/affiliate-api.yaml  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - OpenAPI
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - AffiliateAPIDefinition
    
**Requirement Ids:**
    
    - REQ-SUD-015
    - 3.3.2.1
    
**Purpose:** Provides a machine-readable definition of the Affiliate API.  
**Logic Description:** Defines paths, operations, parameters, and schemas for affiliate-facing endpoints (e.g., /dashboard, /links, /payouts). Includes security schemes.  
**Documentation:**
    
    - **Summary:** OpenAPI specification for the Ad Manager Affiliate API.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** APIDefinition
    
- **Path:** infrastructure/api-gateway/openapi/third-party-app-api.yaml  
**Description:** OpenAPI 3.x specification file defining the contract for APIs exposed to third-party applications via the App Store framework.  
**Template:** OpenAPI Specification  
**Dependancy Level:** 0  
**Name:** third-party-app-api-spec  
**Type:** APISpecification  
**Relative Path:** openapi/third-party-app-api.yaml  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - OpenAPI
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - ThirdPartyAppAPIDefinition
    
**Requirement Ids:**
    
    - REQ-SUD-015
    - 3.3.2.3
    - REQ-TCE-008
    
**Purpose:** Provides a machine-readable definition of the API for third-party app developers.  
**Logic Description:** Defines paths, operations, parameters, request/response schemas, and OAuth 2.0 security schemes for APIs accessible to approved third-party applications. Focuses on data and functionalities relevant to app extensions.  
**Documentation:**
    
    - **Summary:** OpenAPI specification for the Ad Manager Third-Party Application API.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** APIDefinition
    
- **Path:** infrastructure/api-gateway/openapi/shared-components.yaml  
**Description:** OpenAPI 3.x specification file containing shared components like schemas (data models), security schemes, parameters, and responses that are referenced by other API specification files.  
**Template:** OpenAPI Specification (Components)  
**Dependancy Level:** 0  
**Name:** shared-api-components  
**Type:** APISpecification  
**Relative Path:** openapi/shared-components.yaml  
**Repository Id:** REPO-MASTER-GW-001  
**Pattern Ids:**
    
    - OpenAPI
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - SharedAPISchemas
    - SharedSecuritySchemes
    
**Requirement Ids:**
    
    - REQ-SUD-015
    
**Purpose:** Promotes reusability and consistency across multiple OpenAPI specifications by defining common elements.  
**Logic Description:** Contains definitions under the 'components' object, such as 'schemas' (e.g., Campaign, AdSet, Product, ErrorResponse), 'securitySchemes' (e.g., JWTBearerAuth), 'parameters' (e.g., common path or query parameters like 'merchantId'), and 'responses' (e.g., standard error responses like 400, 401, 403, 404, 500).  
**Documentation:**
    
    - **Summary:** Shared OpenAPI components (schemas, security schemes, etc.) for use across all Ad Manager API specifications.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** APIDefinition
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableMerchantApiV2
  - enableNewAffiliateReportingEndpoints
  - useStrictRequestValidationForAllRoutes
  
- **Database Configs:**
  
  


---

