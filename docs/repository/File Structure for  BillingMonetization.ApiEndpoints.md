# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project metadata, dependencies, and scripts for the Billing & Monetization microservice/module.  
**Template:** Node.js PackageManifest  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../../../package.json  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - DependencyManagement
    - ProjectScripts
    
**Requirement Ids:**
    
    
**Purpose:** Manages Node.js package dependencies (like NestJS, class-validator, stripe SDK) and defines scripts for build, lint, test, start.  
**Logic Description:** Lists runtime and development dependencies. Includes scripts for common development tasks such as 'npm run start:dev', 'npm run build', 'npm run test'. Specifies entry points and project details.  
**Documentation:**
    
    - **Summary:** Standard package.json file for a Node.js/NestJS application, listing all necessary libraries and project scripts.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** tsconfig.json  
**Description:** TypeScript compiler options for the Billing & Monetization microservice/module.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ../../../tsconfig.json  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScriptCompilation
    
**Requirement Ids:**
    
    
**Purpose:** Configures the TypeScript compiler (tsc) with settings like target ECMAScript version, module system, strict type checking, and decorator metadata.  
**Logic Description:** Specifies compiler options such as 'target', 'module', 'strict', 'experimentalDecorators', 'emitDecoratorMetadata', 'baseUrl', 'outDir'. Includes 'include' and 'exclude' patterns for source files.  
**Documentation:**
    
    - **Summary:** Standard tsconfig.json for a NestJS project, enabling features like decorators and defining module resolution.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** nest-cli.json  
**Description:** NestJS CLI configuration file for the Billing & Monetization microservice/module.  
**Template:** NestJS CLI Configuration  
**Dependancy Level:** 0  
**Name:** nest-cli  
**Type:** Configuration  
**Relative Path:** ../../../nest-cli.json  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - NestJSProjectStructure
    
**Requirement Ids:**
    
    
**Purpose:** Provides configuration for the NestJS command-line interface, including source root, project type (application/library), and compiler options.  
**Logic Description:** Contains settings like 'collection', 'sourceRoot', 'compilerOptions.webpack', 'compilerOptions.assets' for copying non-TS files (e.g., email templates).  
**Documentation:**
    
    - **Summary:** Configuration file for the NestJS CLI, used for scaffolding and building the application.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** src/modules/billing-monetization/billing-monetization.module.ts  
**Description:** Main NestJS module for all billing and monetization features. Imports controllers, services, and other necessary modules.  
**Template:** NestJS Module  
**Dependancy Level:** 4  
**Name:** BillingMonetizationModule  
**Type:** Module  
**Relative Path:** billing-monetization.module.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - Module
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - ModuleAggregation
    
**Requirement Ids:**
    
    - REQ-15-001
    - REQ-15-002
    - REQ-15-003
    - REQ-15-004
    - REQ-15-005
    - REQ-15-006
    - REQ-TCE-004
    
**Purpose:** Orchestrates the billing and monetization domain by declaring controllers, providing services, and managing dependencies.  
**Logic Description:** Imports ConfigModule for configuration. Declares SubscriptionController, PlanController, PaymentController, BillingReportController. Provides BillingMonetizationService, PaymentGatewayFactoryService, and specific payment gateway adapters (StripeAdapter, PayPalAdapter etc.). Exports BillingMonetizationService or its interface for potential cross-module use.  
**Documentation:**
    
    - **Summary:** The central module encapsulating all functionalities related to billing, subscriptions, payments, and monetization reporting for the Ad Manager platform.
    
**Namespace:** AdManager.BillingMonetization  
**Metadata:**
    
    - **Category:** Module
    
- **Path:** src/modules/billing-monetization/config/billing.config.ts  
**Description:** Configuration settings specific to the billing and monetization module, such as plan details (if not DB-driven), grace periods, and default fee structures.  
**Template:** NestJS ConfigModule  
**Dependancy Level:** 1  
**Name:** billingConfig  
**Type:** Configuration  
**Relative Path:** config/billing.config.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - ConfigurationProvider
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - BillingConfiguration
    
**Requirement Ids:**
    
    - REQ-15-001
    - REQ-15-004
    - REQ-15-005
    
**Purpose:** Provides type-safe access to billing-specific configuration values loaded from environment variables or configuration files.  
**Logic Description:** Uses NestJS ConfigModule's 'registerAs' function to define a configuration namespace (e.g., 'billing'). Defines properties for subscription plan details, grace period durations, transaction fee defaults, and commission rate defaults. May include validation for configuration values.  
**Documentation:**
    
    - **Summary:** Handles loading and providing access to all configuration parameters required by the billing and monetization module.
    
**Namespace:** AdManager.BillingMonetization.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/billing-monetization/api/controllers/plan.controller.ts  
**Description:** Handles HTTP requests related to subscription plans, such as listing available plans and their details.  
**Template:** NestJS Controller  
**Dependancy Level:** 3  
**Name:** PlanController  
**Type:** Controller  
**Relative Path:** api/controllers/plan.controller.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - MVC Controller
    - RESTfulAPI
    
**Members:**
    
    - **Name:** billingMonetizationService  
**Type:** IBillingMonetizationService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** getAllPlans  
**Parameters:**
    
    
**Return Type:** Promise<PlanRO[]>  
**Attributes:** public|async  
    - **Name:** getPlanTransactionFees  
**Parameters:**
    
    - planId: string
    
**Return Type:** Promise<TransactionFeeConfigRO>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - ListSubscriptionPlans
    - ViewPlanTransactionFees
    
**Requirement Ids:**
    
    - REQ-15-001
    - REQ-15-005
    
**Purpose:** Exposes API endpoints for merchants to discover available Ad Manager subscription plans and their associated transaction fee structures.  
**Logic Description:** Defines GET endpoint '/plans' to retrieve all available subscription plans by calling 'billingMonetizationService.getAvailablePlans()'. Defines GET endpoint '/plans/:planId/transaction-fees' to retrieve transaction fee details for a specific plan by calling 'billingMonetizationService.getPlanTransactionFeeConfig(planId)'. Uses DTOs for responses. Secured with appropriate guards (e.g., JwtAuthGuard).  
**Documentation:**
    
    - **Summary:** Controller for managing interactions with subscription plan data. Provides endpoints to list plans and view plan-specific configurations like transaction fees.
    
**Namespace:** AdManager.BillingMonetization.Api.V1  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/billing-monetization/api/controllers/subscription.controller.ts  
**Description:** Manages merchant subscriptions, including creation, viewing current subscription, upgrades, and downgrades.  
**Template:** NestJS Controller  
**Dependancy Level:** 3  
**Name:** SubscriptionController  
**Type:** Controller  
**Relative Path:** api/controllers/subscription.controller.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - MVC Controller
    - RESTfulAPI
    
**Members:**
    
    - **Name:** billingMonetizationService  
**Type:** IBillingMonetizationService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** createSubscription  
**Parameters:**
    
    - createSubscriptionDto: CreateSubscriptionDto
    - merchantId: string
    
**Return Type:** Promise<SubscriptionRO>  
**Attributes:** public|async  
    - **Name:** getCurrentSubscription  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<SubscriptionRO>  
**Attributes:** public|async  
    - **Name:** updateSubscription  
**Parameters:**
    
    - updateSubscriptionDto: UpdateSubscriptionDto
    - merchantId: string
    
**Return Type:** Promise<SubscriptionRO>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - CreateSubscription
    - ViewSubscription
    - UpgradeSubscription
    - DowngradeSubscription
    
**Requirement Ids:**
    
    - REQ-15-001
    - REQ-15-002
    - REQ-15-003
    
**Purpose:** Exposes API endpoints for merchants to manage their Ad Manager subscription plans.  
**Logic Description:** Defines POST endpoint '/subscriptions' to create a new subscription using 'billingMonetizationService.createSubscription(dto, merchantId)'. Defines GET endpoint '/subscriptions/me' to fetch current merchant's subscription via 'billingMonetizationService.getCurrentSubscription(merchantId)'. Defines PUT endpoint '/subscriptions/me' to handle upgrades (immediate, prorated - REQ-15-002) and downgrades (end of cycle - REQ-15-003) by calling 'billingMonetizationService.updateSubscription(dto, merchantId)'. Uses DTOs and ROs. Secured with JwtAuthGuard and potentially merchant context extraction.  
**Documentation:**
    
    - **Summary:** Controller for managing merchant subscriptions. Handles creation, retrieval, upgrades, and downgrades of Ad Manager plans.
    
**Namespace:** AdManager.BillingMonetization.Api.V1  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/billing-monetization/api/controllers/payment.controller.ts  
**Description:** Handles payment processing, payment method management, invoice retrieval, billing status, and payment gateway webhooks.  
**Template:** NestJS Controller  
**Dependancy Level:** 3  
**Name:** PaymentController  
**Type:** Controller  
**Relative Path:** api/controllers/payment.controller.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - MVC Controller
    - RESTfulAPI
    
**Members:**
    
    - **Name:** billingMonetizationService  
**Type:** IBillingMonetizationService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** initiatePayment  
**Parameters:**
    
    - initiatePaymentDto: InitiatePaymentDto
    - merchantId: string
    
**Return Type:** Promise<InitiatePaymentResponseRO>  
**Attributes:** public|async  
    - **Name:** handlePaymentWebhook  
**Parameters:**
    
    - gateway: string
    - payload: PaymentWebhookPayloadDto
    - rawBody: any
    - headers: any
    
**Return Type:** Promise<void>  
**Attributes:** public|async  
    - **Name:** getBillingStatus  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<BillingStatusRO>  
**Attributes:** public|async  
    - **Name:** updatePaymentMethod  
**Parameters:**
    
    - paymentMethodUpdateDto: PaymentMethodUpdateDto
    - merchantId: string
    
**Return Type:** Promise<void>  
**Attributes:** public|async  
    - **Name:** getInvoices  
**Parameters:**
    
    - merchantId: string
    - paginationOptions: PaginationOptionsDto
    
**Return Type:** Promise<PaginatedResponseRO<InvoiceRO>>  
**Attributes:** public|async  
    - **Name:** getInvoiceById  
**Parameters:**
    
    - merchantId: string
    - invoiceId: string
    
**Return Type:** Promise<InvoiceRO>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - InitiatePayment
    - ProcessPaymentWebhooks
    - ViewBillingStatus
    - UpdatePaymentMethod
    - ListInvoices
    - ViewInvoice
    
**Requirement Ids:**
    
    - REQ-TCE-004
    - REQ-15-004
    
**Purpose:** Exposes API endpoints for managing payments, payment methods, viewing billing status, invoices, and processing asynchronous webhook notifications from payment gateways.  
**Logic Description:** POST '/payments/initiate': Calls 'billingMonetizationService.initiatePayment(dto, merchantId)' for subscriptions/ad spend. POST '/payments/webhooks/:gateway': Calls 'billingMonetizationService.processPaymentWebhook(gateway, payload, rawBody, headers)' to handle asynchronous updates from payment providers (Stripe, PayPal etc.), ensuring idempotency. GET '/billing/status': Calls 'billingMonetizationService.getMerchantBillingStatus(merchantId)' for grace period info (REQ-15-004). POST '/payments/methods': Calls 'billingMonetizationService.updatePaymentMethod(dto, merchantId)'. GET '/billing/invoices' & '/billing/invoices/:invoiceId': Retrieve merchant invoices. Secured appropriately.  
**Documentation:**
    
    - **Summary:** Controller for payment-related operations, including initiating payments, handling gateway webhooks, managing payment methods, and viewing billing status/invoices.
    
**Namespace:** AdManager.BillingMonetization.Api.V1  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/billing-monetization/api/controllers/billing-report.controller.ts  
**Description:** Provides endpoints for merchants or platform admins to retrieve billing-related reports, such as transaction fee summaries and App Store commission reports.  
**Template:** NestJS Controller  
**Dependancy Level:** 3  
**Name:** BillingReportController  
**Type:** Controller  
**Relative Path:** api/controllers/billing-report.controller.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - MVC Controller
    - RESTfulAPI
    
**Members:**
    
    - **Name:** billingMonetizationService  
**Type:** IBillingMonetizationService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** getTransactionFeeReport  
**Parameters:**
    
    - merchantId: string
    - queryOptions: ReportQueryDto
    
**Return Type:** Promise<TransactionFeeReportRO>  
**Attributes:** public|async  
    - **Name:** getAppCommissionReport  
**Parameters:**
    
    - queryOptions: ReportQueryDto
    
**Return Type:** Promise<AppCommissionReportRO>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - TransactionFeeReporting
    - AppCommissionReporting
    
**Requirement Ids:**
    
    - REQ-15-005
    - REQ-15-006
    
**Purpose:** Exposes API endpoints for generating and retrieving reports on transaction fees and App Store commissions.  
**Logic Description:** GET '/reports/transaction-fees': Calls 'billingMonetizationService.generateTransactionFeeReport(merchantId, options)' for merchant-specific transaction fee summaries (REQ-15-005). GET '/reports/app-commissions': Calls 'billingMonetizationService.generateAppCommissionReport(options)' for platform-level App Store commission reports (REQ-15-006). Endpoint security will differ based on report type (merchant-specific vs platform admin). Uses DTOs for query options and ROs for responses.  
**Documentation:**
    
    - **Summary:** Controller responsible for providing access to various billing and monetization reports, such as transaction fees and App Store commissions.
    
**Namespace:** AdManager.BillingMonetization.Api.V1  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/billing-monetization/api/dto/plan/plan.ro.ts  
**Description:** Read-only object representing a subscription plan's details.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 1  
**Name:** PlanRO  
**Type:** DTO  
**Relative Path:** api/dto/plan/plan.ro.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** name  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** description  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** monthlyPrice  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** annualPrice  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** features  
**Type:** string[]  
**Attributes:** public|readonly  
    - **Name:** usageLimits  
**Type:** Record<string, any>  
**Attributes:** public|readonly  
    - **Name:** transactionFeeRate  
**Type:** number  
**Attributes:** public|readonly|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - PlanDataRepresentation
    
**Requirement Ids:**
    
    - REQ-15-001
    - REQ-15-005
    
**Purpose:** Defines the structure for returning subscription plan information via the API.  
**Logic Description:** Class decorated with @nestjs/swagger for API documentation. Includes properties for plan ID, name, description, pricing (monthly/annual), list of features, usage limits, and applicable transaction fee rate. Uses class-validator decorators for potential output validation if needed, though primarily for documentation.  
**Documentation:**
    
    - **Summary:** Data Transfer Object for exposing subscription plan details. Used as a response object.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Plan  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/subscription/create-subscription.dto.ts  
**Description:** Data Transfer Object for creating a new merchant subscription.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 1  
**Name:** CreateSubscriptionDto  
**Type:** DTO  
**Relative Path:** api/dto/subscription/create-subscription.dto.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** planId  
**Type:** string  
**Attributes:** public  
    - **Name:** billingCycle  
**Type:** 'monthly' | 'annual'  
**Attributes:** public  
    - **Name:** paymentMethodId  
**Type:** string  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - SubscriptionCreationInput
    
**Requirement Ids:**
    
    - REQ-15-001
    - REQ-TCE-004
    
**Purpose:** Defines the payload structure for API requests to create a new subscription.  
**Logic Description:** Class decorated with @nestjs/swagger for API documentation and class-validator decorators (e.g., @IsString(), @IsNotEmpty(), @IsEnum()) for input validation. Properties include 'planId', 'billingCycle' (monthly/annual), and optionally 'paymentMethodId' if a new payment method is being provided or selected.  
**Documentation:**
    
    - **Summary:** DTO used for the request body when a merchant subscribes to a new plan.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Subscription  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/subscription/update-subscription.dto.ts  
**Description:** Data Transfer Object for upgrading or downgrading a merchant's subscription.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 1  
**Name:** UpdateSubscriptionDto  
**Type:** DTO  
**Relative Path:** api/dto/subscription/update-subscription.dto.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** newPlanId  
**Type:** string  
**Attributes:** public  
    - **Name:** newBillingCycle  
**Type:** 'monthly' | 'annual'  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - SubscriptionUpdateInput
    
**Requirement Ids:**
    
    - REQ-15-002
    - REQ-15-003
    
**Purpose:** Defines the payload structure for API requests to change an existing subscription.  
**Logic Description:** Class decorated with @nestjs/swagger and class-validator. Properties include 'newPlanId' to specify the target plan. May include 'newBillingCycle' if changing billing frequency. Validations ensure 'newPlanId' is provided.  
**Documentation:**
    
    - **Summary:** DTO for the request body when a merchant upgrades or downgrades their current subscription plan.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Subscription  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/subscription/subscription.ro.ts  
**Description:** Read-only object representing a merchant's subscription details.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 2  
**Name:** SubscriptionRO  
**Type:** DTO  
**Relative Path:** api/dto/subscription/subscription.ro.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** merchantId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** plan  
**Type:** PlanRO  
**Attributes:** public|readonly  
    - **Name:** status  
**Type:** 'active' | 'pending_downgrade' | 'past_due' | 'canceled'  
**Attributes:** public|readonly  
    - **Name:** billingCycle  
**Type:** 'monthly' | 'annual'  
**Attributes:** public|readonly  
    - **Name:** startDate  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** endDate  
**Type:** Date  
**Attributes:** public|readonly|optional  
    - **Name:** nextBillingDate  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** prorationDetails  
**Type:** ProrationDetailsRO  
**Attributes:** public|readonly|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - SubscriptionDataRepresentation
    
**Requirement Ids:**
    
    - REQ-15-001
    - REQ-15-002
    - REQ-15-003
    
**Purpose:** Defines the structure for returning a merchant's subscription information via the API.  
**Logic Description:** Class decorated with @nestjs/swagger. Includes properties for subscription ID, merchant ID, associated plan details (using PlanRO), status, billing cycle, start/end dates, next billing date. May include 'prorationDetails' if an upgrade occurred (REQ-15-002).  
**Documentation:**
    
    - **Summary:** Data Transfer Object for exposing merchant subscription details. Used as a response object.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Subscription  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/subscription/proration-details.ro.ts  
**Description:** Read-only object for proration details on subscription upgrade.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 1  
**Name:** ProrationDetailsRO  
**Type:** DTO  
**Relative Path:** api/dto/subscription/proration-details.ro.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** proratedAmountCharged  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** description  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - ProrationDataRepresentation
    
**Requirement Ids:**
    
    - REQ-15-002
    
**Purpose:** Defines the structure for returning proration charge details when a subscription is upgraded.  
**Logic Description:** Class with properties like 'proratedAmountCharged' and a 'description' of the proration calculation. Decorated with @nestjs/swagger.  
**Documentation:**
    
    - **Summary:** DTO to convey information about prorated charges applied during a subscription upgrade.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Subscription  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/payment/initiate-payment.dto.ts  
**Description:** DTO for initiating a payment for a subscription or other billable service.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 1  
**Name:** InitiatePaymentDto  
**Type:** DTO  
**Relative Path:** api/dto/payment/initiate-payment.dto.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** amount  
**Type:** number  
**Attributes:** public  
    - **Name:** currency  
**Type:** string  
**Attributes:** public  
    - **Name:** description  
**Type:** string  
**Attributes:** public  
    - **Name:** paymentMethodId  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** paymentGateway  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** metadata  
**Type:** Record<string, any>  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - PaymentInitiationInput
    
**Requirement Ids:**
    
    - REQ-TCE-004
    
**Purpose:** Defines the payload for API requests to start a payment process.  
**Logic Description:** Class decorated with @nestjs/swagger and class-validator. Properties include 'amount', 'currency', 'description', 'paymentMethodId' (if pre-selected/saved), 'paymentGateway' (e.g. 'stripe', 'paypal', 'mada'), and 'metadata' for linking payment to specific items like subscription ID or invoice ID. Validations ensure required fields are present and correctly formatted.  
**Documentation:**
    
    - **Summary:** DTO for request body when initiating a payment through a selected payment gateway.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Payment  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/payment/initiate-payment-response.ro.ts  
**Description:** DTO for the response after initiating a payment, may contain client secret or redirect URL.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 1  
**Name:** InitiatePaymentResponseRO  
**Type:** DTO  
**Relative Path:** api/dto/payment/initiate-payment-response.ro.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** paymentIntentId  
**Type:** string  
**Attributes:** public|readonly|optional  
    - **Name:** clientSecret  
**Type:** string  
**Attributes:** public|readonly|optional  
    - **Name:** redirectUrl  
**Type:** string  
**Attributes:** public|readonly|optional  
    - **Name:** status  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - PaymentInitiationOutput
    
**Requirement Ids:**
    
    - REQ-TCE-004
    
**Purpose:** Defines the structure of the response sent back to the client after a payment initiation request.  
**Logic Description:** Class decorated with @nestjs/swagger. Properties include 'paymentIntentId', 'clientSecret' (for client-side SDKs like Stripe Elements), or 'redirectUrl' (for gateway-hosted payment pages), and current 'status' of the payment attempt.  
**Documentation:**
    
    - **Summary:** Response object after successfully initiating a payment, providing necessary details for the client to proceed with payment confirmation.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Payment  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/payment/payment-webhook-payload.dto.ts  
**Description:** Generic DTO placeholder for payment gateway webhook payloads. Actual structure varies by gateway.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 1  
**Name:** PaymentWebhookPayloadDto  
**Type:** DTO  
**Relative Path:** api/dto/payment/payment-webhook-payload.dto.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** eventType  
**Type:** string  
**Attributes:** public  
    - **Name:** data  
**Type:** any  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - WebhookPayloadHandling
    
**Requirement Ids:**
    
    - REQ-TCE-004
    
**Purpose:** Represents the incoming data structure from payment gateway webhooks. Will need specific implementations or type guards per gateway.  
**Logic Description:** Class decorated with @nestjs/swagger. It's a generic placeholder. In a real implementation, this might be an abstract class or use discriminated unions based on 'eventType' or gateway. The 'data' field will contain the gateway-specific event object.  
**Documentation:**
    
    - **Summary:** Generic DTO for handling various webhook events from payment gateways. Specific parsing logic will be in the service layer.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Payment  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/payment/billing-status.ro.ts  
**Description:** Read-only object for a merchant's current billing status, including grace period information.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 1  
**Name:** BillingStatusRO  
**Type:** DTO  
**Relative Path:** api/dto/payment/billing-status.ro.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** status  
**Type:** 'active' | 'past_due' | 'in_grace_period' | 'suspended' | 'error'  
**Attributes:** public|readonly  
    - **Name:** gracePeriodEndsAt  
**Type:** Date  
**Attributes:** public|readonly|optional  
    - **Name:** lastPaymentAttemptFailed  
**Type:** boolean  
**Attributes:** public|readonly  
    - **Name:** nextPaymentAmount  
**Type:** number  
**Attributes:** public|readonly|optional  
    - **Name:** nextPaymentDate  
**Type:** Date  
**Attributes:** public|readonly|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - BillingStatusRepresentation
    
**Requirement Ids:**
    
    - REQ-15-004
    
**Purpose:** Defines the structure for returning a merchant's billing status, crucial for handling payment failures and grace periods.  
**Logic Description:** Class decorated with @nestjs/swagger. Properties describe the current billing state, if a grace period is active and when it ends, and details about the next expected payment.  
**Documentation:**
    
    - **Summary:** DTO for exposing a merchant's current billing status, including information about active grace periods or payment issues.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Payment  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/payment/invoice.ro.ts  
**Description:** Read-only object representing a merchant's invoice.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 1  
**Name:** InvoiceRO  
**Type:** DTO  
**Relative Path:** api/dto/payment/invoice.ro.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** invoiceNumber  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** issueDate  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** dueDate  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** amountDue  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** amountPaid  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** status  
**Type:** 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'  
**Attributes:** public|readonly  
    - **Name:** currency  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** lineItems  
**Type:** InvoiceLineItemRO[]  
**Attributes:** public|readonly  
    - **Name:** downloadUrl  
**Type:** string  
**Attributes:** public|readonly|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - InvoiceDataRepresentation
    
**Requirement Ids:**
    
    - REQ-TCE-004
    
**Purpose:** Defines the structure for returning invoice details to merchants.  
**Logic Description:** Class decorated with @nestjs/swagger. Contains all relevant invoice details such as ID, number, dates, amounts, status, currency, line items, and a potential link to download a PDF version.  
**Documentation:**
    
    - **Summary:** DTO for exposing invoice details to merchants, including line items and payment status.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Payment  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/payment/invoice-line-item.ro.ts  
**Description:** Read-only object representing a single line item on an invoice.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 0  
**Name:** InvoiceLineItemRO  
**Type:** DTO  
**Relative Path:** api/dto/payment/invoice-line-item.ro.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** description  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** quantity  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** unitAmount  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** totalAmount  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** periodStartDate  
**Type:** Date  
**Attributes:** public|readonly|optional  
    - **Name:** periodEndDate  
**Type:** Date  
**Attributes:** public|readonly|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - InvoiceLineItemDataRepresentation
    
**Requirement Ids:**
    
    - REQ-TCE-004
    
**Purpose:** Defines the structure for an individual line item within an invoice.  
**Logic Description:** Class with properties for line item ID, description, quantity, unit amount, total amount, and optional service period dates.  
**Documentation:**
    
    - **Summary:** Represents a single line item on an invoice, detailing the product or service billed.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Payment  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/payment/payment-method-update.dto.ts  
**Description:** DTO for updating or adding a merchant's payment method.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 1  
**Name:** PaymentMethodUpdateDto  
**Type:** DTO  
**Relative Path:** api/dto/payment/payment-method-update.dto.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** paymentMethodToken  
**Type:** string  
**Attributes:** public  
    - **Name:** isDefault  
**Type:** boolean  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - PaymentMethodUpdateInput
    
**Requirement Ids:**
    
    - REQ-15-004
    - REQ-TCE-004
    
**Purpose:** Defines the payload for updating or adding a payment method for a merchant's subscription.  
**Logic Description:** Class decorated with @nestjs/swagger and class-validator. Contains 'paymentMethodToken' (obtained from payment gateway's client-side SDK, e.g., Stripe token) and an optional 'isDefault' flag.  
**Documentation:**
    
    - **Summary:** DTO for requests to update or add a new payment method for a merchant's billing.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Payment  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/report/transaction-fee-report.ro.ts  
**Description:** Read-only object for the transaction fee report.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 1  
**Name:** TransactionFeeReportRO  
**Type:** DTO  
**Relative Path:** api/dto/report/transaction-fee-report.ro.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** merchantId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** periodStartDate  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** periodEndDate  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** totalSalesAmount  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** totalTransactionFees  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** feeDetails  
**Type:** TransactionFeeDetailRO[]  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - TransactionFeeReportRepresentation
    
**Requirement Ids:**
    
    - REQ-15-005
    
**Purpose:** Defines the structure for returning a summary of transaction fees incurred by a merchant.  
**Logic Description:** Class decorated for API documentation. Includes merchant ID, reporting period, total sales, total fees, and an array of detailed fee records if applicable.  
**Documentation:**
    
    - **Summary:** Response object for transaction fee reports, providing an overview of fees charged on sales.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Report  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/report/app-commission-report.ro.ts  
**Description:** Read-only object for the App Store commission report (relevant to PlatformName).  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 1  
**Name:** AppCommissionReportRO  
**Type:** DTO  
**Relative Path:** api/dto/report/app-commission-report.ro.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** periodStartDate  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** periodEndDate  
**Type:** Date  
**Attributes:** public|readonly  
    - **Name:** totalAppSales  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** totalCommissionsEarned  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** commissionDetailsByApp  
**Type:** AppCommissionDetailRO[]  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - AppCommissionReportRepresentation
    
**Requirement Ids:**
    
    - REQ-15-006
    
**Purpose:** Defines the structure for returning a summary of commissions earned by PlatformName from App Store sales.  
**Logic Description:** Class decorated for API documentation. Includes reporting period, total app sales processed via the store, total commissions for PlatformName, and a breakdown by app if applicable.  
**Documentation:**
    
    - **Summary:** Response object for App Store commission reports, primarily for platform administration and financial reconciliation.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Report  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/common/paginated-response.ro.ts  
**Description:** Generic read-only object for paginated API responses.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 0  
**Name:** PaginatedResponseRO  
**Type:** DTO  
**Relative Path:** api/dto/common/paginated-response.ro.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    - Pagination
    
**Members:**
    
    - **Name:** data  
**Type:** T[]  
**Attributes:** public|readonly  
    - **Name:** totalCount  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** page  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** limit  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** hasNextPage  
**Type:** boolean  
**Attributes:** public|readonly  
    - **Name:** hasPreviousPage  
**Type:** boolean  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - PaginationDataRepresentation
    
**Requirement Ids:**
    
    
**Purpose:** Provides a standardized structure for returning lists of data in a paginated format.  
**Logic Description:** Generic class PaginatedResponseRO<T>. Properties include 'data' (array of items of type T), 'totalCount', current 'page', 'limit' per page, and boolean flags 'hasNextPage' and 'hasPreviousPage'.  
**Documentation:**
    
    - **Summary:** A generic DTO for representing paginated list responses from the API.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Common  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/api/dto/common/id-param.dto.ts  
**Description:** DTO for validating ID parameters in request paths.  
**Template:** NestJS DTO/RO  
**Dependancy Level:** 0  
**Name:** IdParamDto  
**Type:** DTO  
**Relative Path:** api/dto/common/id-param.dto.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - IdParameterValidation
    
**Requirement Ids:**
    
    
**Purpose:** Provides a validated structure for ID parameters passed in URL paths, typically UUIDs.  
**Logic Description:** Class with a single 'id' property. Uses class-validator decorators like @IsUUID() to ensure the ID is in the correct format.  
**Documentation:**
    
    - **Summary:** A common DTO for validating resource identifiers passed as URL parameters.
    
**Namespace:** AdManager.BillingMonetization.Api.V1.Dto.Common  
**Metadata:**
    
    - **Category:** DTO
    
- **Path:** src/modules/billing-monetization/application/interfaces/billing-monetization-service.interface.ts  
**Description:** Defines the contract for the BillingMonetizationService, outlining methods for managing plans, subscriptions, payments, and reporting.  
**Template:** TypeScript Interface  
**Dependancy Level:** 2  
**Name:** IBillingMonetizationService  
**Type:** Interface  
**Relative Path:** application/interfaces/billing-monetization-service.interface.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - Interface
    - DependencyInversionPrinciple
    
**Members:**
    
    
**Methods:**
    
    - **Name:** getAvailablePlans  
**Parameters:**
    
    
**Return Type:** Promise<PlanRO[]>  
**Attributes:**   
    - **Name:** createSubscription  
**Parameters:**
    
    - dto: CreateSubscriptionDto
    - merchantId: string
    
**Return Type:** Promise<SubscriptionRO>  
**Attributes:**   
    - **Name:** getCurrentSubscription  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<SubscriptionRO | null>  
**Attributes:**   
    - **Name:** updateSubscription  
**Parameters:**
    
    - dto: UpdateSubscriptionDto
    - merchantId: string
    
**Return Type:** Promise<SubscriptionRO>  
**Attributes:**   
    - **Name:** initiatePayment  
**Parameters:**
    
    - dto: InitiatePaymentDto
    - merchantId: string
    
**Return Type:** Promise<InitiatePaymentResponseRO>  
**Attributes:**   
    - **Name:** processPaymentWebhook  
**Parameters:**
    
    - gateway: string
    - payload: any
    - signature?: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** getMerchantBillingStatus  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<BillingStatusRO>  
**Attributes:**   
    - **Name:** updateMerchantPaymentMethod  
**Parameters:**
    
    - dto: PaymentMethodUpdateDto
    - merchantId: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** getMerchantInvoices  
**Parameters:**
    
    - merchantId: string
    - paginationOptions: any
    
**Return Type:** Promise<PaginatedResponseRO<InvoiceRO>>  
**Attributes:**   
    - **Name:** getMerchantInvoiceById  
**Parameters:**
    
    - merchantId: string
    - invoiceId: string
    
**Return Type:** Promise<InvoiceRO | null>  
**Attributes:**   
    - **Name:** generateTransactionFeeReport  
**Parameters:**
    
    - merchantId: string
    - options: any
    
**Return Type:** Promise<TransactionFeeReportRO>  
**Attributes:**   
    - **Name:** generateAppCommissionReport  
**Parameters:**
    
    - options: any
    
**Return Type:** Promise<AppCommissionReportRO>  
**Attributes:**   
    - **Name:** getPlanTransactionFeeConfig  
**Parameters:**
    
    - planId: string
    
**Return Type:** Promise<any>  
**Attributes:**   
    
**Implemented Features:**
    
    - ServiceContractDefinition
    
**Requirement Ids:**
    
    - REQ-15-001
    - REQ-15-002
    - REQ-15-003
    - REQ-15-004
    - REQ-15-005
    - REQ-15-006
    - REQ-TCE-004
    
**Purpose:** Specifies the public interface for the core billing and monetization logic, ensuring loose coupling between API controllers and service implementation.  
**Logic Description:** TypeScript interface listing all methods the BillingMonetizationService must implement. Uses DTOs/ROs from the API layer for method signatures. This contract is injected into controllers.  
**Documentation:**
    
    - **Summary:** Interface defining the capabilities of the BillingMonetizationService. It serves as an abstraction for API controllers.
    
**Namespace:** AdManager.BillingMonetization.Application.Interfaces  
**Metadata:**
    
    - **Category:** ApplicationService
    
- **Path:** src/modules/billing-monetization/application/services/billing-monetization.service.ts  
**Description:** Core application service containing the business logic for billing, subscriptions, payments, and monetization features.  
**Template:** NestJS Service  
**Dependancy Level:** 3  
**Name:** BillingMonetizationService  
**Type:** Service  
**Relative Path:** application/services/billing-monetization.service.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - ServiceLayer
    - DomainLogic
    
**Members:**
    
    - **Name:** paymentGatewayFactory  
**Type:** PaymentGatewayFactoryService  
**Attributes:** private|readonly  
    - **Name:** subscriptionRepository  
**Type:** ISubscriptionRepositoryPort  
**Attributes:** private|readonly  
    - **Name:** invoiceRepository  
**Type:** IInvoiceRepositoryPort  
**Attributes:** private|readonly  
    - **Name:** notificationService  
**Type:** INotificationPort  
**Attributes:** private|readonly  
    - **Name:** configService  
**Type:** ConfigService  
**Attributes:** private|readonly  
    - **Name:** appStoreCommissionService  
**Type:** IAppStoreCommissionPort  
**Attributes:** private|readonly|optional  
    
**Methods:**
    
    - **Name:** getAvailablePlans  
**Parameters:**
    
    
**Return Type:** Promise<PlanRO[]>  
**Attributes:** public|async  
    - **Name:** createSubscription  
**Parameters:**
    
    - dto: CreateSubscriptionDto
    - merchantId: string
    
**Return Type:** Promise<SubscriptionRO>  
**Attributes:** public|async  
    - **Name:** updateSubscription  
**Parameters:**
    
    - dto: UpdateSubscriptionDto
    - merchantId: string
    
**Return Type:** Promise<SubscriptionRO>  
**Attributes:** public|async  
    - **Name:** initiatePayment  
**Parameters:**
    
    - dto: InitiatePaymentDto
    - merchantId: string
    
**Return Type:** Promise<InitiatePaymentResponseRO>  
**Attributes:** public|async  
    - **Name:** processPaymentWebhook  
**Parameters:**
    
    - gateway: string
    - payload: any
    - signature?: string
    
**Return Type:** Promise<void>  
**Attributes:** public|async  
    - **Name:** handleSubscriptionPaymentSuccess  
**Parameters:**
    
    - subscriptionId: string
    - paymentDetails: any
    
**Return Type:** Promise<void>  
**Attributes:** private|async  
    - **Name:** handleSubscriptionPaymentFailure  
**Parameters:**
    
    - subscriptionId: string
    - failureDetails: any
    
**Return Type:** Promise<void>  
**Attributes:** private|async  
    - **Name:** applyGracePeriodOrSuspend  
**Parameters:**
    
    - subscriptionId: string
    
**Return Type:** Promise<void>  
**Attributes:** private|async  
    - **Name:** calculateProrationForUpgrade  
**Parameters:**
    
    - currentSubscription: SubscriptionModel
    - newPlanId: string
    
**Return Type:** Promise<ProrationDetails>  
**Attributes:** private|async  
    - **Name:** calculateTransactionFees  
**Parameters:**
    
    - merchantId: string
    - salesData: any[]
    
**Return Type:** Promise<number>  
**Attributes:** private|async  
    - **Name:** calculateAppCommissions  
**Parameters:**
    
    - appSalesData: any[]
    
**Return Type:** Promise<number>  
**Attributes:** private|async  
    
**Implemented Features:**
    
    - SubscriptionManagement
    - PaymentProcessing
    - ProrationLogic
    - DowngradeScheduling
    - GracePeriodHandling
    - SuspensionLogic
    - TransactionFeeCalculation
    - AppCommissionCalculation
    - WebhookProcessing
    - InvoiceGeneration
    
**Requirement Ids:**
    
    - REQ-15-001
    - REQ-15-002
    - REQ-15-003
    - REQ-15-004
    - REQ-15-005
    - REQ-15-006
    - REQ-TCE-004
    
**Purpose:** Implements all business rules and orchestrates interactions related to billing plans, subscriptions, payments, transaction fees, and app commissions.  
**Logic Description:** Implements IBillingMonetizationService. Interacts with payment gateway ports for payment processing. Uses repository ports for data persistence of subscriptions and invoices. Handles logic for plan upgrades (REQ-15-002 proration), downgrades (REQ-15-003 end-of-cycle), payment failures (REQ-15-004 grace period, suspension), transaction fee calculation (REQ-15-005), and App Store commission calculation (REQ-15-006). Manages billing cycles and invoice generation. Sends notifications via INotificationPort for events like payment success/failure or upcoming renewal.  
**Documentation:**
    
    - **Summary:** The core service responsible for all billing and monetization logic. It manages subscription lifecycles, payment processing, fee calculations, and reporting data generation.
    
**Namespace:** AdManager.BillingMonetization.Application.Services  
**Metadata:**
    
    - **Category:** ApplicationService
    
- **Path:** src/modules/billing-monetization/application/ports/payment-gateway.port.ts  
**Description:** Interface defining the contract for interacting with various payment gateways.  
**Template:** TypeScript Interface  
**Dependancy Level:** 1  
**Name:** IPaymentGatewayPort  
**Type:** Interface  
**Relative Path:** application/ports/payment-gateway.port.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - Port
    - Adapter
    - DependencyInversionPrinciple
    
**Members:**
    
    
**Methods:**
    
    - **Name:** initiatePayment  
**Parameters:**
    
    - details: PaymentInitiationDetails
    
**Return Type:** Promise<PaymentInitiationResult>  
**Attributes:**   
    - **Name:** chargePaymentMethod  
**Parameters:**
    
    - paymentMethodId: string
    - amount: number
    - currency: string
    - description: string
    - customerId?: string
    
**Return Type:** Promise<PaymentChargeResult>  
**Attributes:**   
    - **Name:** createCustomer  
**Parameters:**
    
    - customerDetails: CustomerDetails
    
**Return Type:** Promise<GatewayCustomer>  
**Attributes:**   
    - **Name:** attachPaymentMethodToCustomer  
**Parameters:**
    
    - customerId: string
    - paymentMethodId: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** verifyWebhookSignature  
**Parameters:**
    
    - payload: string | Buffer
    - signature: string
    - secret: string
    
**Return Type:** boolean  
**Attributes:**   
    - **Name:** parseWebhookEvent  
**Parameters:**
    
    - payload: any
    
**Return Type:** Promise<WebhookEvent>  
**Attributes:**   
    
**Implemented Features:**
    
    - PaymentGatewayAbstraction
    
**Requirement Ids:**
    
    - REQ-TCE-004
    
**Purpose:** Provides a standardized interface for payment processing operations, abstracting away the specifics of individual payment gateway SDKs.  
**Logic Description:** TypeScript interface defining methods like 'initiatePayment', 'chargePaymentMethod', 'createCustomer', 'verifyWebhookSignature', 'parseWebhookEvent'. Specific payment gateway adapters (e.g., StripeAdapter, PayPalAdapter) will implement this port.  
**Documentation:**
    
    - **Summary:** An outgoing port interface that defines the contract for interactions with payment gateway services. This allows for easy swapping or addition of payment providers.
    
**Namespace:** AdManager.BillingMonetization.Application.Ports  
**Metadata:**
    
    - **Category:** Port
    
- **Path:** src/modules/billing-monetization/application/ports/subscription-repository.port.ts  
**Description:** Interface defining the contract for subscription data persistence operations.  
**Template:** TypeScript Interface  
**Dependancy Level:** 1  
**Name:** ISubscriptionRepositoryPort  
**Type:** Interface  
**Relative Path:** application/ports/subscription-repository.port.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - Port
    - RepositoryPattern
    
**Members:**
    
    
**Methods:**
    
    - **Name:** findById  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<SubscriptionModel | null>  
**Attributes:**   
    - **Name:** findByMerchantId  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<SubscriptionModel | null>  
**Attributes:**   
    - **Name:** save  
**Parameters:**
    
    - subscription: SubscriptionModel
    
**Return Type:** Promise<SubscriptionModel>  
**Attributes:**   
    - **Name:** update  
**Parameters:**
    
    - id: string
    - subscriptionUpdate: Partial<SubscriptionModel>
    
**Return Type:** Promise<SubscriptionModel | null>  
**Attributes:**   
    
**Implemented Features:**
    
    - SubscriptionPersistenceAbstraction
    
**Requirement Ids:**
    
    - REQ-15-001
    - REQ-15-002
    - REQ-15-003
    - REQ-15-004
    
**Purpose:** Abstracts the data storage mechanism for merchant subscriptions, allowing the application service to be persistence-agnostic.  
**Logic Description:** TypeScript interface defining CRUD-like operations for Subscription entities/models, such as 'findById', 'findByMerchantId', 'save', 'update'. The actual implementation would reside in the data persistence layer.  
**Documentation:**
    
    - **Summary:** An outgoing port interface defining the contract for data access operations related to merchant subscriptions.
    
**Namespace:** AdManager.BillingMonetization.Application.Ports  
**Metadata:**
    
    - **Category:** Port
    
- **Path:** src/modules/billing-monetization/application/ports/invoice-repository.port.ts  
**Description:** Interface defining the contract for invoice data persistence operations.  
**Template:** TypeScript Interface  
**Dependancy Level:** 1  
**Name:** IInvoiceRepositoryPort  
**Type:** Interface  
**Relative Path:** application/ports/invoice-repository.port.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - Port
    - RepositoryPattern
    
**Members:**
    
    
**Methods:**
    
    - **Name:** findById  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<InvoiceModel | null>  
**Attributes:**   
    - **Name:** findByMerchantId  
**Parameters:**
    
    - merchantId: string
    - pagination: any
    
**Return Type:** Promise<PaginatedResult<InvoiceModel>>  
**Attributes:**   
    - **Name:** save  
**Parameters:**
    
    - invoice: InvoiceModel
    
**Return Type:** Promise<InvoiceModel>  
**Attributes:**   
    
**Implemented Features:**
    
    - InvoicePersistenceAbstraction
    
**Requirement Ids:**
    
    - REQ-TCE-004
    
**Purpose:** Abstracts data storage for merchant invoices.  
**Logic Description:** TypeScript interface for invoice CRUD operations, like 'findById', 'findByMerchantId' (with pagination), 'save'.  
**Documentation:**
    
    - **Summary:** Port interface for invoice data access, used by the BillingMonetizationService.
    
**Namespace:** AdManager.BillingMonetization.Application.Ports  
**Metadata:**
    
    - **Category:** Port
    
- **Path:** src/modules/billing-monetization/application/ports/notification.port.ts  
**Description:** Interface defining the contract for sending notifications (e.g., email, SMS) related to billing events.  
**Template:** TypeScript Interface  
**Dependancy Level:** 1  
**Name:** INotificationPort  
**Type:** Interface  
**Relative Path:** application/ports/notification.port.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - Port
    - Adapter
    
**Members:**
    
    
**Methods:**
    
    - **Name:** sendPaymentSuccessNotification  
**Parameters:**
    
    - merchantId: string
    - invoiceDetails: any
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** sendPaymentFailedNotification  
**Parameters:**
    
    - merchantId: string
    - reason: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** sendSubscriptionSuspendedNotification  
**Parameters:**
    
    - merchantId: string
    
**Return Type:** Promise<void>  
**Attributes:**   
    - **Name:** sendUpcomingRenewalReminder  
**Parameters:**
    
    - merchantId: string
    - renewalDate: Date
    
**Return Type:** Promise<void>  
**Attributes:**   
    
**Implemented Features:**
    
    - NotificationAbstraction
    
**Requirement Ids:**
    
    - REQ-15-004
    
**Purpose:** Abstracts the notification sending mechanism, allowing different notification services (email, SMS) to be plugged in.  
**Logic Description:** TypeScript interface defining methods for sending various billing-related notifications, e.g., 'sendPaymentSuccessNotification', 'sendPaymentFailedNotification'. Implementations would use services like AWS SES or Twilio.  
**Documentation:**
    
    - **Summary:** An outgoing port interface for sending notifications to merchants regarding billing events.
    
**Namespace:** AdManager.BillingMonetization.Application.Ports  
**Metadata:**
    
    - **Category:** Port
    
- **Path:** src/modules/billing-monetization/application/ports/app-store-commission.port.ts  
**Description:** Interface defining the contract for fetching app sales data required for App Store commission calculation.  
**Template:** TypeScript Interface  
**Dependancy Level:** 1  
**Name:** IAppStoreCommissionPort  
**Type:** Interface  
**Relative Path:** application/ports/app-store-commission.port.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - Port
    - Adapter
    
**Members:**
    
    
**Methods:**
    
    - **Name:** getAppSalesDataForPeriod  
**Parameters:**
    
    - startDate: Date
    - endDate: Date
    
**Return Type:** Promise<AppSaleData[]>  
**Attributes:**   
    
**Implemented Features:**
    
    - AppStoreSalesDataAbstraction
    
**Requirement Ids:**
    
    - REQ-15-006
    
**Purpose:** Abstracts the mechanism for retrieving app sales data from the `[PlatformName]` App Store system for commission calculation.  
**Logic Description:** TypeScript interface with methods like 'getAppSalesDataForPeriod'. The implementation would interact with the App Store's internal data source or API.  
**Documentation:**
    
    - **Summary:** An outgoing port interface for accessing app sales data from the main platform's App Store, used for calculating PlatformName's commissions.
    
**Namespace:** AdManager.BillingMonetization.Application.Ports  
**Metadata:**
    
    - **Category:** Port
    
- **Path:** src/modules/billing-monetization/application/domain/subscription.model.ts  
**Description:** Domain model representing a merchant's subscription within the billing context.  
**Template:** TypeScript Class/Interface  
**Dependancy Level:** 0  
**Name:** SubscriptionModel  
**Type:** DomainModel  
**Relative Path:** application/domain/subscription.model.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DomainModel
    - Entity
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** merchantId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** planId  
**Type:** string  
**Attributes:** public  
    - **Name:** status  
**Type:** SubscriptionStatusType  
**Attributes:** public  
    - **Name:** billingCycle  
**Type:** BillingCycleType  
**Attributes:** public  
    - **Name:** startDate  
**Type:** Date  
**Attributes:** public  
    - **Name:** endDate  
**Type:** Date  
**Attributes:** public|optional  
    - **Name:** nextBillingDate  
**Type:** Date  
**Attributes:** public  
    - **Name:** currentPeriodStart  
**Type:** Date  
**Attributes:** public  
    - **Name:** currentPeriodEnd  
**Type:** Date  
**Attributes:** public  
    - **Name:** paymentGatewayCustomerId  
**Type:** string  
**Attributes:** public|optional  
    
**Methods:**
    
    - **Name:** activate  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** cancel  
**Parameters:**
    
    - effectiveDate: Date
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** changePlan  
**Parameters:**
    
    - newPlanId: string
    - newBillingCycle: BillingCycleType
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** isInGracePeriod  
**Parameters:**
    
    - gracePeriodDays: number
    
**Return Type:** boolean  
**Attributes:** public  
    
**Implemented Features:**
    
    - SubscriptionStateManagement
    - SubscriptionBusinessLogic
    
**Requirement Ids:**
    
    - REQ-15-001
    - REQ-15-002
    - REQ-15-003
    - REQ-15-004
    
**Purpose:** Encapsulates the state and behavior of a merchant subscription, including lifecycle management and business rules.  
**Logic Description:** Represents a subscription with properties like ID, merchant ID, plan ID, status (active, canceled, past_due), billing cycle, dates. Contains methods to manage its state (e.g., 'activate', 'cancel', 'changePlan') and enforce invariants. Used by the BillingMonetizationService.  
**Documentation:**
    
    - **Summary:** Domain entity representing a merchant's subscription, encapsulating its attributes and lifecycle logic.
    
**Namespace:** AdManager.BillingMonetization.Domain  
**Metadata:**
    
    - **Category:** Domain
    
- **Path:** src/modules/billing-monetization/application/domain/payment-plan.model.ts  
**Description:** Domain model representing a subscription payment plan.  
**Template:** TypeScript Class/Interface  
**Dependancy Level:** 0  
**Name:** PaymentPlanModel  
**Type:** DomainModel  
**Relative Path:** application/domain/payment-plan.model.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - DomainModel
    - ValueObject
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** name  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** monthlyPrice  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** annualPrice  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** features  
**Type:** string[]  
**Attributes:** public|readonly  
    - **Name:** transactionFeeRate  
**Type:** number  
**Attributes:** public|readonly|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - PlanDefinition
    
**Requirement Ids:**
    
    - REQ-15-001
    - REQ-15-005
    
**Purpose:** Encapsulates the details of a payment plan offered to merchants.  
**Logic Description:** Represents a payment plan with properties for ID, name, pricing, features, and associated transaction fee rates. Primarily a value object or read-only entity.  
**Documentation:**
    
    - **Summary:** Domain model for subscription plans, containing pricing, features, and fee structures.
    
**Namespace:** AdManager.BillingMonetization.Domain  
**Metadata:**
    
    - **Category:** Domain
    
- **Path:** src/modules/billing-monetization/application/constants/billing.constants.ts  
**Description:** Defines constants used within the billing and monetization module, such as default grace periods or event names.  
**Template:** TypeScript Constants  
**Dependancy Level:** 0  
**Name:** BillingConstants  
**Type:** Constants  
**Relative Path:** application/constants/billing.constants.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** DEFAULT_GRACE_PERIOD_DAYS  
**Type:** number  
**Attributes:** public|const  
    - **Name:** SUBSCRIPTION_STATUS  
**Type:** object  
**Attributes:** public|const  
    - **Name:** PAYMENT_GATEWAY_EVENTS  
**Type:** object  
**Attributes:** public|const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - CentralizedConstants
    
**Requirement Ids:**
    
    - REQ-15-004
    
**Purpose:** Provides a single source for constants related to billing operations.  
**Logic Description:** Exports constant values for default grace period (e.g., 7 days), enums or string constants for subscription statuses (e.g., ACTIVE, PAST_DUE), payment gateway event types for webhooks.  
**Documentation:**
    
    - **Summary:** A collection of constant values used throughout the billing and monetization module to ensure consistency.
    
**Namespace:** AdManager.BillingMonetization.Application.Constants  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** src/modules/billing-monetization/infrastructure/payment-gateways/stripe.adapter.ts  
**Description:** Adapter implementing the IPaymentGatewayPort for Stripe, handling communication with the Stripe API.  
**Template:** NestJS Service/Adapter  
**Dependancy Level:** 2  
**Name:** StripeAdapter  
**Type:** Adapter  
**Relative Path:** infrastructure/payment-gateways/stripe.adapter.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - Adapter
    - Port
    
**Members:**
    
    - **Name:** stripeClient  
**Type:** Stripe  
**Attributes:** private|readonly  
    - **Name:** configService  
**Type:** ConfigService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** initiatePayment  
**Parameters:**
    
    - details: PaymentInitiationDetails
    
**Return Type:** Promise<PaymentInitiationResult>  
**Attributes:** public|async  
    - **Name:** chargePaymentMethod  
**Parameters:**
    
    - paymentMethodId: string
    - amount: number
    - currency: string
    - description: string
    - customerId?: string
    
**Return Type:** Promise<PaymentChargeResult>  
**Attributes:** public|async  
    - **Name:** createCustomer  
**Parameters:**
    
    - customerDetails: CustomerDetails
    
**Return Type:** Promise<GatewayCustomer>  
**Attributes:** public|async  
    - **Name:** verifyWebhookSignature  
**Parameters:**
    
    - payload: string | Buffer
    - signature: string
    
**Return Type:** boolean  
**Attributes:** public  
    
**Implemented Features:**
    
    - StripePaymentIntegration
    
**Requirement Ids:**
    
    - REQ-TCE-004
    
**Purpose:** Translates calls from the BillingMonetizationService (via IPaymentGatewayPort) into specific Stripe API calls.  
**Logic Description:** Implements the IPaymentGatewayPort interface. Initializes the Stripe SDK with API keys from ConfigService. Maps domain payment requests to Stripe API requests (e.g., creating PaymentIntents, Charges, Customers). Handles Stripe-specific error codes and translates them into domain-understandable errors. Verifies Stripe webhook signatures.  
**Documentation:**
    
    - **Summary:** Adapter for Stripe payment gateway. Handles all interactions with the Stripe API for payment processing and webhook verification.
    
**Namespace:** AdManager.BillingMonetization.Infrastructure.PaymentGateways  
**Metadata:**
    
    - **Category:** InfrastructureAdapter
    
- **Path:** src/modules/billing-monetization/infrastructure/payment-gateways/payment-gateway-factory.service.ts  
**Description:** Factory service to provide an instance of the appropriate payment gateway adapter based on configuration or request.  
**Template:** NestJS Service/Factory  
**Dependancy Level:** 3  
**Name:** PaymentGatewayFactoryService  
**Type:** Service  
**Relative Path:** infrastructure/payment-gateways/payment-gateway-factory.service.ts  
**Repository Id:** REPO-BILLING-013  
**Pattern Ids:**
    
    - FactoryMethod
    - Strategy
    
**Members:**
    
    - **Name:** stripeAdapter  
**Type:** StripeAdapter  
**Attributes:** private|readonly  
    - **Name:** paypalAdapter  
**Type:** PayPalAdapter  
**Attributes:** private|readonly|optional  
    - **Name:** madaAdapter  
**Type:** MadaAdapter  
**Attributes:** private|readonly|optional  
    - **Name:** stcPayAdapter  
**Type:** StcPayAdapter  
**Attributes:** private|readonly|optional  
    
**Methods:**
    
    - **Name:** getGateway  
**Parameters:**
    
    - gatewayName: string
    
**Return Type:** IPaymentGatewayPort  
**Attributes:** public  
    
**Implemented Features:**
    
    - PaymentGatewaySelection
    
**Requirement Ids:**
    
    - REQ-TCE-004
    
**Purpose:** Decouples the BillingMonetizationService from concrete payment gateway implementations by providing a way to select the correct gateway adapter at runtime.  
**Logic Description:** Injects instances of all supported payment gateway adapters (StripeAdapter, PayPalAdapter, etc.). The 'getGateway' method takes a gateway identifier (e.g., 'stripe', 'mada') and returns the corresponding IPaymentGatewayPort implementation. Throws an error if an unsupported gateway is requested.  
**Documentation:**
    
    - **Summary:** Factory service responsible for creating and providing instances of specific payment gateway adapters.
    
**Namespace:** AdManager.BillingMonetization.Infrastructure.PaymentGateways  
**Metadata:**
    
    - **Category:** InfrastructureService
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableProrationOnUpgrade
  - enableAutomatedSuspension
  - enableTransactionFeesPerPlan
  - enableAppStoreCommissionReporting
  - enableStripeGateway
  - enablePayPalGateway
  - enableMadaGateway
  - enableStcPayGateway
  
- **Database Configs:**
  
  - STRIPE_API_KEY
  - STRIPE_WEBHOOK_SECRET
  - PAYPAL_CLIENT_ID
  - PAYPAL_CLIENT_SECRET
  - PAYPAL_WEBHOOK_ID
  - MADA_MERCHANT_ID
  - MADA_API_KEY
  - STCPAY_MERCHANT_ID
  - STCPAY_API_KEY
  - DEFAULT_GRACE_PERIOD_DAYS_CONFIG_KEY
  - PLAN_CONFIG_SOURCE
  


---

