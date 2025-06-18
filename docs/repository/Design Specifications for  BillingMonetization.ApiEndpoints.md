# Software Design Specification: Billing & Monetization API Endpoints

## 1. Introduction

### 1.1 Purpose
This document provides the detailed software design specification for the `BillingMonetization.ApiEndpoints` repository. This repository is responsible for exposing RESTful API endpoints to manage merchant subscriptions, payment plans, payment processing, billing cycles, and related reporting functionalities for the Ad Manager Platform. It serves as the primary interface for frontend applications and potentially other internal services interacting with the billing and monetization domain.

### 1.2 Scope
The scope of this document is limited to the API endpoints provided by the `BillingMonetization.ApiEndpoints` repository. This includes:
*   Defining API routes, request/response DTOs, and authentication mechanisms.
*   Specifying interactions with the underlying `BillingMonetizationService`.
*   Detailing validation rules for incoming data.
*   Outlining error handling and response codes.
*   Ensuring compliance with specified user requirements (REQ-15-001, REQ-15-002, REQ-15-003, REQ-15-004, REQ-15-005, REQ-15-006, REQ-TCE-004).

The actual business logic implementation resides within the `BillingMonetizationService` and related application/domain/infrastructure layers, which are outside the direct scope of this API endpoint specification but are interacted with.

### 1.3 Definitions, Acronyms, and Abbreviations
*   **API**: Application Programming Interface
*   **REST**: Representational State Transfer
*   **JSON**: JavaScript Object Notation
*   **JWT**: JSON Web Token
*   **DTO**: Data Transfer Object
*   **RO**: Response Object (a DTO used specifically for responses)
*   **HTTP**: Hypertext Transfer Protocol
*   **SDK**: Software Development Kit
*   **CRUD**: Create, Read, Update, Delete
*   **Proration**: The allocation or distribution of an amount proportionally.
*   **PCI-DSS**: Payment Card Industry Data Security Standard

### 1.4 References
*   Ad Manager Platform System Requirements Specification (SRS)
*   Ad Manager Platform Architecture Design Document
*   NestJS Documentation: [https://docs.nestjs.com/](https://docs.nestjs.com/)
*   Stripe API Documentation (and other relevant payment gateways)
*   OpenAPI Specification: [https://swagger.io/specification/](https://swagger.io/specification/)

### 1.5 Overview
This document will detail the API controllers, their respective endpoints, request and response DTOs, and other considerations necessary for the development of the Billing & Monetization API.

## 2. System Overview
The `BillingMonetization.ApiEndpoints` repository is a component within the Ad Manager Platform's microservices architecture. It acts as the API layer for the billing and monetization domain, facilitating interactions for managing merchant subscriptions, plans, and payments.

**Technology Stack:**
*   **Framework**: NestJS 10.3.9
*   **Language**: TypeScript 5.4.5
*   **API Style**: RESTful
*   **Data Format**: JSON
*   **Authentication**: JWT
*   **API Documentation**: OpenAPI 3.1.0 (via `@nestjs/swagger`)
*   **Key Libraries**:
    *   `class-validator`: For request DTO validation.
    *   `class-transformer`: For transforming plain objects to class instances.
    *   `@nestjs/swagger`: For API documentation generation.
    *   Payment Gateway SDKs (e.g., `stripe`) will be used by the underlying service layer, but the API layer will handle DTOs relevant to payment initiation and webhook consumption.

## 3. API Design

### 3.1 General Principles
*   **Statelessness**: All API endpoints will be stateless.
*   **Authentication**: All endpoints, unless explicitly public (e.g., webhook receivers if secured differently), will be protected by JWT authentication. A `JwtAuthGuard` will be used. Merchant context (e.g., `merchantId`) will be extracted from the authenticated JWT payload.
*   **Validation**: Incoming request DTOs will be validated using `class-validator` decorators and NestJS `ValidationPipe`.
*   **Error Handling**: Standardized error responses will be used. (See Section 6).
*   **API Versioning**: Endpoints will be versioned, e.g., `/v1/billing/...`. The namespace for this repository is `AdManager.BillingMonetization.Api.V1`.
*   **OpenAPI Documentation**: All controllers, DTOs, and ROs will be decorated with `@nestjs/swagger` decorators to generate comprehensive OpenAPI documentation.
*   **Idempotency**: Webhook handlers (e.g., `PaymentController.handlePaymentWebhook`) must be designed for idempotency.

### 3.2 API Endpoints
All controllers will be part of the `BillingMonetizationModule`.

#### 3.2.1 Plan Controller (`plan.controller.ts`)
*   **Base Path**: `/v1/billing/plans`
*   **Purpose**: Exposes endpoints for retrieving information about available subscription plans.
*   **Security**: `JwtAuthGuard` (Merchant access).

##### 3.2.1.1 List Available Plans
*   **Requirement(s)**: REQ-15-001
*   **Endpoint**: `GET /`
*   **Method**: `getAllPlans()`
*   **Description**: Retrieves a list of all available Ad Manager subscription plans and their details.
*   **Request**: None
*   **Response**: `200 OK`
    *   Body: `PlanRO[]` (Array of `PlanRO` objects)
*   **Service Interaction**: Calls `billingMonetizationService.getAvailablePlans()`.

##### 3.2.1.2 Get Plan Transaction Fees
*   **Requirement(s)**: REQ-15-005
*   **Endpoint**: `GET /:planId/transaction-fees`
*   **Method**: `getPlanTransactionFees(@Param('planId', ParseUUIDPipe) planId: string)`
*   **Description**: Retrieves the transaction fee configuration for a specific subscription plan.
*   **Request Parameters**:
    *   `planId` (path): string (UUID) - The ID of the plan.
*   **Response**: `200 OK`
    *   Body: `TransactionFeeConfigRO` (A DTO representing transaction fee details, e.g., `{ rate: number, type: 'percentage' | 'fixed' }`)
*   **Service Interaction**: Calls `billingMonetizationService.getPlanTransactionFeeConfig(planId)`.

#### 3.2.2 Subscription Controller (`subscription.controller.ts`)
*   **Base Path**: `/v1/billing/subscriptions`
*   **Purpose**: Manages merchant subscriptions to Ad Manager plans.
*   **Security**: `JwtAuthGuard` (Merchant access, merchant ID extracted from token).

##### 3.2.2.1 Create Subscription
*   **Requirement(s)**: REQ-15-001
*   **Endpoint**: `POST /`
*   **Method**: `createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto, @User('merchantId') merchantId: string)`
*   **Description**: Creates a new subscription for the authenticated merchant.
*   **Request Body**: `CreateSubscriptionDto`
*   **Response**: `201 Created`
    *   Body: `SubscriptionRO`
*   **Service Interaction**: Calls `billingMonetizationService.createSubscription(createSubscriptionDto, merchantId)`.

##### 3.2.2.2 Get Current Merchant Subscription
*   **Requirement(s)**: REQ-15-001
*   **Endpoint**: `GET /me`
*   **Method**: `getCurrentSubscription(@User('merchantId') merchantId: string)`
*   **Description**: Retrieves the current active subscription details for the authenticated merchant.
*   **Request**: None
*   **Response**: `200 OK`
    *   Body: `SubscriptionRO` or `null` if no active subscription.
*   **Service Interaction**: Calls `billingMonetizationService.getCurrentSubscription(merchantId)`.

##### 3.2.2.3 Update Subscription (Upgrade/Downgrade)
*   **Requirement(s)**: REQ-15-002, REQ-15-003
*   **Endpoint**: `PUT /me`
*   **Method**: `updateSubscription(@Body() updateSubscriptionDto: UpdateSubscriptionDto, @User('merchantId') merchantId: string)`
*   **Description**: Allows a merchant to upgrade or downgrade their current subscription. Upgrades are immediate and prorated (REQ-15-002). Downgrades are effective at the end of the current billing cycle (REQ-15-003).
*   **Request Body**: `UpdateSubscriptionDto`
*   **Response**: `200 OK`
    *   Body: `SubscriptionRO` (reflecting the updated or scheduled subscription change)
*   **Service Interaction**: Calls `billingMonetizationService.updateSubscription(updateSubscriptionDto, merchantId)`.

#### 3.2.3 Payment Controller (`payment.controller.ts`)
*   **Base Path**: `/v1/billing/payments`
*   **Purpose**: Handles payment processing, payment method management, invoice retrieval, and billing status.
*   **Security**: `JwtAuthGuard` for merchant-specific endpoints. Webhook endpoint requires specific security (e.g., signature verification).

##### 3.2.3.1 Initiate Payment
*   **Requirement(s)**: REQ-TCE-004
*   **Endpoint**: `POST /initiate`
*   **Method**: `initiatePayment(@Body() initiatePaymentDto: InitiatePaymentDto, @User('merchantId') merchantId: string)`
*   **Description**: Initiates a payment process for a subscription or other billable service. Returns necessary details for client-side payment completion (e.g., client secret, redirect URL).
*   **Request Body**: `InitiatePaymentDto`
*   **Response**: `200 OK`
    *   Body: `InitiatePaymentResponseRO`
*   **Service Interaction**: Calls `billingMonetizationService.initiatePayment(initiatePaymentDto, merchantId)`.

##### 3.2.3.2 Handle Payment Gateway Webhook
*   **Requirement(s)**: REQ-TCE-004
*   **Endpoint**: `POST /webhooks/:gateway`
*   **Method**: `handlePaymentWebhook(@Param('gateway') gateway: string, @Body() payload: PaymentWebhookPayloadDto, @Headers('stripe-signature') stripeSignature?: string /* add other gateway-specific signature headers */, @Req() req: RawBodyRequest<Request>)`
    *   Note: `RawBodyRequest` from `@nestjs/common` is used to access the raw request body for signature verification. `bodyParser` must be configured to preserve raw body.
*   **Description**: Receives and processes asynchronous webhook notifications from payment gateways (e.g., Stripe, PayPal). This endpoint must be publicly accessible but secured via signature verification.
*   **Request Parameters**:
    *   `gateway` (path): string (e.g., 'stripe', 'paypal')
*   **Request Body**: `PaymentWebhookPayloadDto` (or `any` / `Buffer` for raw parsing)
*   **Request Headers**: Gateway-specific signature header (e.g., `Stripe-Signature`).
*   **Response**: `200 OK` (or `204 No Content`) on successful processing. Appropriate error codes on failure (e.g., `400 Bad Request` for invalid signature).
*   **Service Interaction**: Calls `billingMonetizationService.processPaymentWebhook(gateway, payload, signature, req.rawBody)`.

##### 3.2.3.3 Get Merchant Billing Status
*   **Requirement(s)**: REQ-15-004
*   **Endpoint**: `GET /status/me`
*   **Method**: `getBillingStatus(@User('merchantId') merchantId: string)`
*   **Description**: Retrieves the current billing status for the authenticated merchant, including grace period information if applicable.
*   **Request**: None
*   **Response**: `200 OK`
    *   Body: `BillingStatusRO`
*   **Service Interaction**: Calls `billingMonetizationService.getMerchantBillingStatus(merchantId)`.

##### 3.2.3.4 Update Merchant Payment Method
*   **Requirement(s)**: REQ-TCE-004
*   **Endpoint**: `POST /methods/me`
*   **Method**: `updatePaymentMethod(@Body() paymentMethodUpdateDto: PaymentMethodUpdateDto, @User('merchantId') merchantId: string)`
*   **Description**: Allows a merchant to add or update their default payment method.
*   **Request Body**: `PaymentMethodUpdateDto`
*   **Response**: `200 OK` (or `204 No Content`)
*   **Service Interaction**: Calls `billingMonetizationService.updateMerchantPaymentMethod(paymentMethodUpdateDto, merchantId)`.

##### 3.2.3.5 List Merchant Invoices
*   **Requirement(s)**: REQ-TCE-004
*   **Endpoint**: `GET /invoices/me`
*   **Method**: `getInvoices(@User('merchantId') merchantId: string, @Query() paginationOptions: PaginationOptionsDto)`
*   **Description**: Retrieves a paginated list of invoices for the authenticated merchant.
*   **Request Query Parameters**: `PaginationOptionsDto` (e.g., `page`, `limit`, `sortBy`, `sortOrder`)
*   **Response**: `200 OK`
    *   Body: `PaginatedResponseRO<InvoiceRO>`
*   **Service Interaction**: Calls `billingMonetizationService.getMerchantInvoices(merchantId, paginationOptions)`.

##### 3.2.3.6 Get Merchant Invoice by ID
*   **Requirement(s)**: REQ-TCE-004
*   **Endpoint**: `GET /invoices/me/:invoiceId`
*   **Method**: `getInvoiceById(@User('merchantId') merchantId: string, @Param('invoiceId', ParseUUIDPipe) invoiceId: string)`
*   **Description**: Retrieves a specific invoice by ID for the authenticated merchant.
*   **Request Parameters**:
    *   `invoiceId` (path): string (UUID)
*   **Response**: `200 OK`
    *   Body: `InvoiceRO`
*   **Service Interaction**: Calls `billingMonetizationService.getMerchantInvoiceById(merchantId, invoiceId)`.

#### 3.2.4 Billing Report Controller (`billing-report.controller.ts`)
*   **Base Path**: `/v1/billing/reports`
*   **Purpose**: Provides endpoints for generating billing-related reports.
*   **Security**: `JwtAuthGuard`. Specific endpoints might require different roles (e.g., merchant vs. platform admin).

##### 3.2.4.1 Get Transaction Fee Report (Merchant)
*   **Requirement(s)**: REQ-15-005
*   **Endpoint**: `GET /transaction-fees/me`
*   **Method**: `getTransactionFeeReport(@User('merchantId') merchantId: string, @Query() queryOptions: ReportQueryDto)`
*   **Description**: Retrieves a summary of transaction fees incurred by the authenticated merchant for a specified period.
*   **Request Query Parameters**: `ReportQueryDto` (e.g., `startDate`, `endDate`)
*   **Response**: `200 OK`
    *   Body: `TransactionFeeReportRO`
*   **Service Interaction**: Calls `billingMonetizationService.generateTransactionFeeReport(merchantId, queryOptions)`.

##### 3.2.4.2 Get App Commission Report (Platform Admin)
*   **Requirement(s)**: REQ-15-006
*   **Endpoint**: `GET /app-commissions`
*   **Method**: `getAppCommissionReport(@Query() queryOptions: ReportQueryDto)`
*   **Description**: Retrieves a summary of App Store commissions earned by `[PlatformName]`. This endpoint should be restricted to Platform Administrator roles.
*   **Security**: `JwtAuthGuard`, `RolesGuard` (Platform Admin role).
*   **Request Query Parameters**: `ReportQueryDto` (e.g., `startDate`, `endDate`)
*   **Response**: `200 OK`
    *   Body: `AppCommissionReportRO`
*   **Service Interaction**: Calls `billingMonetizationService.generateAppCommissionReport(queryOptions)`.

## 4. Data Transfer Objects (DTOs) / Response Objects (ROs)
All DTOs/ROs will reside in `src/modules/billing-monetization/api/dto/`. They will use `class-validator` for input validation and `@nestjs/swagger` for API documentation.

### 4.1 Plan DTOs/ROs
*   **`PlanRO`**: (`api/dto/plan/plan.ro.ts`)
    *   `id: string` (@IsUUID, @ApiProperty)
    *   `name: string` (@IsString, @ApiProperty)
    *   `description: string` (@IsString, @ApiProperty)
    *   `monthlyPrice: number` (@IsNumber, @Min(0), @ApiProperty)
    *   `annualPrice: number` (@IsNumber, @Min(0), @ApiProperty)
    *   `features: string[]` (@IsArray, @IsString({ each: true }), @ApiProperty)
    *   `usageLimits: Record<string, any>` (@IsObject, @ApiProperty, example: `{ campaigns: 10, users: 1 }`)
    *   `transactionFeeRate?: number` (@IsNumber, @Min(0), @IsOptional, @ApiProperty)
*   **`TransactionFeeConfigRO`** (New DTO, if not covered by PlanRO directly)
    *   `planId: string` (@IsUUID)
    *   `rate: number` (@IsNumber, @Min(0))
    *   `type: 'percentage' | 'fixed'` (@IsEnum(['percentage', 'fixed']))
    *   `description?: string` (@IsString, @IsOptional)

### 4.2 Subscription DTOs/ROs
*   **`CreateSubscriptionDto`**: (`api/dto/subscription/create-subscription.dto.ts`)
    *   `planId: string` (@IsUUID, @IsNotEmpty, @ApiProperty)
    *   `billingCycle: 'monthly' | 'annual'` (@IsEnum(['monthly', 'annual']), @IsNotEmpty, @ApiProperty)
    *   `paymentMethodId?: string` (@IsString, @IsOptional, @ApiProperty, description: "ID of a pre-existing payment method from the gateway")
*   **`UpdateSubscriptionDto`**: (`api/dto/subscription/update-subscription.dto.ts`)
    *   `newPlanId: string` (@IsUUID, @IsNotEmpty, @ApiProperty)
    *   `newBillingCycle?: 'monthly' | 'annual'` (@IsEnum(['monthly', 'annual']), @IsOptional, @ApiProperty)
*   **`SubscriptionRO`**: (`api/dto/subscription/subscription.ro.ts`)
    *   `id: string` (@IsUUID, @ApiProperty)
    *   `merchantId: string` (@IsUUID, @ApiProperty)
    *   `plan: PlanRO` (@ValidateNested, @Type(() => PlanRO), @ApiProperty)
    *   `status: 'active' | 'pending_downgrade' | 'past_due' | 'canceled' | 'in_grace_period'` (@IsEnum, @ApiProperty)
    *   `billingCycle: 'monthly' | 'annual'` (@IsEnum, @ApiProperty)
    *   `startDate: Date` (@IsDate, @ApiProperty)
    *   `endDate?: Date` (@IsDate, @IsOptional, @ApiProperty)
    *   `nextBillingDate: Date` (@IsDate, @ApiProperty)
    *   `currentPeriodStart: Date` (@IsDate, @ApiProperty)
    *   `currentPeriodEnd: Date` (@IsDate, @ApiProperty)
    *   `prorationDetails?: ProrationDetailsRO` (@ValidateNested, @Type(() => ProrationDetailsRO), @IsOptional, @ApiProperty)
*   **`ProrationDetailsRO`**: (`api/dto/subscription/proration-details.ro.ts`)
    *   `proratedAmountCharged: number` (@IsNumber, @ApiProperty)
    *   `description: string` (@IsString, @ApiProperty)

### 4.3 Payment DTOs/ROs
*   **`InitiatePaymentDto`**: (`api/dto/payment/initiate-payment.dto.ts`)
    *   `amount: number` (@IsNumber, @Min(0.01), @ApiProperty)
    *   `currency: string` (@IsString, @IsNotEmpty, @Length(3,3), @ApiProperty({ example: 'SAR' }))
    *   `description: string` (@IsString, @IsNotEmpty, @ApiProperty)
    *   `paymentMethodId?: string` (@IsString, @IsOptional, @ApiProperty, description: "ID of a saved payment method")
    *   `paymentGateway?: string` (@IsString, @IsOptional, @ApiProperty, description: "e.g., 'stripe', 'paypal', 'mada', 'stcpay'. If omitted, service may use default.")
    *   `metadata?: Record<string, any>` (@IsObject, @IsOptional, @ApiProperty, description: "e.g., { subscriptionId: 'uuid', invoiceId: 'uuid' }")
*   **`InitiatePaymentResponseRO`**: (`api/dto/payment/initiate-payment-response.ro.ts`)
    *   `paymentIntentId?: string` (@IsString, @IsOptional, @ApiProperty)
    *   `clientSecret?: string` (@IsString, @IsOptional, @ApiProperty)
    *   `redirectUrl?: string` (@IsUrl, @IsOptional, @ApiProperty)
    *   `status: string` (@IsString, @ApiProperty, description: "e.g., 'requires_action', 'succeeded', 'requires_payment_method'")
*   **`PaymentWebhookPayloadDto`**: (`api/dto/payment/payment-webhook-payload.dto.ts`)
    *   `eventType: string` (@IsString, @IsNotEmpty, @ApiProperty, description: "Gateway-specific event type")
    *   `data: any` (@IsObject, @ApiProperty, description: "Gateway-specific event data object")
    *   *Note: Actual validation will depend on the gateway and will be handled in the service layer after initial parsing.*
*   **`BillingStatusRO`**: (`api/dto/payment/billing-status.ro.ts`)
    *   `status: 'active' | 'past_due' | 'in_grace_period' | 'suspended' | 'error'` (@IsEnum, @ApiProperty)
    *   `gracePeriodEndsAt?: Date` (@IsDate, @IsOptional, @ApiProperty)
    *   `lastPaymentAttemptFailed: boolean` (@IsBoolean, @ApiProperty)
    *   `nextPaymentAmount?: number` (@IsNumber, @IsOptional, @ApiProperty)
    *   `nextPaymentDate?: Date` (@IsDate, @IsOptional, @ApiProperty)
*   **`InvoiceRO`**: (`api/dto/payment/invoice.ro.ts`)
    *   `id: string` (@IsUUID, @ApiProperty)
    *   `invoiceNumber: string` (@IsString, @ApiProperty)
    *   `issueDate: Date` (@IsDate, @ApiProperty)
    *   `dueDate: Date` (@IsDate, @ApiProperty)
    *   `amountDue: number` (@IsNumber, @ApiProperty)
    *   `amountPaid: number` (@IsNumber, @ApiProperty)
    *   `status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'` (@IsEnum, @ApiProperty)
    *   `currency: string` (@IsString, @Length(3,3), @ApiProperty)
    *   `lineItems: InvoiceLineItemRO[]` (@IsArray, @ValidateNested({ each: true }), @Type(() => InvoiceLineItemRO), @ApiProperty)
    *   `downloadUrl?: string` (@IsUrl, @IsOptional, @ApiProperty)
*   **`InvoiceLineItemRO`**: (`api/dto/payment/invoice-line-item.ro.ts`)
    *   `id: string` (@IsString, @ApiProperty)
    *   `description: string` (@IsString, @ApiProperty)
    *   `quantity: number` (@IsNumber, @ApiProperty)
    *   `unitAmount: number` (@IsNumber, @ApiProperty)
    *   `totalAmount: number` (@IsNumber, @ApiProperty)
    *   `periodStartDate?: Date` (@IsDate, @IsOptional, @ApiProperty)
    *   `periodEndDate?: Date` (@IsDate, @IsOptional, @ApiProperty)
*   **`PaymentMethodUpdateDto`**: (`api/dto/payment/payment-method-update.dto.ts`)
    *   `paymentMethodToken: string` (@IsString, @IsNotEmpty, @ApiProperty, description: "Token from payment gateway client-side SDK, e.g., Stripe's pm_ or tok_")
    *   `isDefault?: boolean` (@IsBoolean, @IsOptional, @ApiProperty)

### 4.4 Report DTOs/ROs
*   **`ReportQueryDto`** (New common DTO for report queries)
    *   `startDate: Date` (@IsDateString, @ApiProperty)
    *   `endDate: Date` (@IsDateString, @ApiProperty)
    *   `filters?: Record<string, any>` (@IsObject, @IsOptional, @ApiProperty)
*   **`TransactionFeeReportRO`**: (`api/dto/report/transaction-fee-report.ro.ts`)
    *   `merchantId: string` (@IsUUID, @ApiProperty)
    *   `periodStartDate: Date` (@IsDate, @ApiProperty)
    *   `periodEndDate: Date` (@IsDate, @ApiProperty)
    *   `totalSalesAmount: number` (@IsNumber, @ApiProperty)
    *   `totalTransactionFees: number` (@IsNumber, @ApiProperty)
    *   `feeDetails: TransactionFeeDetailRO[]` (@IsArray, @ValidateNested({ each: true }), @Type(() => TransactionFeeDetailRO), @ApiProperty)
*   **`TransactionFeeDetailRO`** (New DTO for individual fee records in the report)
    *   `transactionId: string` (@IsString)
    *   `saleAmount: number` (@IsNumber)
    *   `feeAmount: number` (@IsNumber)
    *   `feeRateApplied: number` (@IsNumber)
    *   `timestamp: Date` (@IsDate)
*   **`AppCommissionReportRO`**: (`api/dto/report/app-commission-report.ro.ts`)
    *   `periodStartDate: Date` (@IsDate, @ApiProperty)
    *   `periodEndDate: Date` (@IsDate, @ApiProperty)
    *   `totalAppSales: number` (@IsNumber, @ApiProperty)
    *   `totalCommissionsEarned: number` (@IsNumber, @ApiProperty)
    *   `commissionDetailsByApp: AppCommissionDetailRO[]` (@IsArray, @ValidateNested({ each: true }), @Type(() => AppCommissionDetailRO), @ApiProperty)
*   **`AppCommissionDetailRO`** (New DTO for commission breakdown per app)
    *   `appId: string` (@IsString)
    *   `appName: string` (@IsString)
    *   `totalSalesForApp: number` (@IsNumber)
    *   `commissionEarnedFromApp: number` (@IsNumber)

### 4.5 Common DTOs/ROs
*   **`PaginatedResponseRO<T>`**: (`api/dto/common/paginated-response.ro.ts`)
    *   Generic class, properties defined in file structure.
*   **`PaginationOptionsDto`** (New DTO for pagination query params)
    *   `page?: number` (@IsInt, @Min(1), @IsOptional, @Type(() => Number))
    *   `limit?: number` (@IsInt, @Min(1), @Max(100), @IsOptional, @Type(() => Number))
    *   `sortBy?: string` (@IsString, @IsOptional)
    *   `sortOrder?: 'ASC' | 'DESC'` (@IsEnum(['ASC', 'DESC']), @IsOptional)
*   **`IdParamDto`**: (`api/dto/common/id-param.dto.ts`)
    *   `id: string` (@IsUUID, @ApiProperty)

## 5. Security Considerations
*   **Authentication**: All merchant-facing endpoints will be secured using JWT via `JwtAuthGuard`. The merchant ID will be extracted from the JWT payload.
*   **Authorization**: Role-based access control (RBAC) will be applied where necessary (e.g., `BillingReportController.getAppCommissionReport` for Platform Admins). NestJS Guards will be used.
*   **Input Validation**: All DTOs will use `class-validator` decorators to ensure data integrity and prevent common vulnerabilities (e.g., XSS, injection attacks via malformed data). The global `ValidationPipe` will be configured.
*   **Webhook Security**: The `PaymentController.handlePaymentWebhook` endpoint must verify webhook signatures provided by payment gateways (e.g., Stripe's `Stripe-Signature` header). This is critical to ensure the authenticity and integrity of incoming webhook events. Raw request body will be needed for this verification.
*   **Sensitive Data**: Payment method tokens or details should be handled with extreme care, primarily by passing them directly to the payment gateway SDKs in the service layer. The API layer should avoid logging or unnecessarily storing raw payment credentials.
*   **HTTPS**: All communication must be over HTTPS, enforced at the API Gateway or load balancer level.
*   **Rate Limiting**: API Gateway should be configured for rate limiting to prevent abuse.

## 6. Error Handling
The API will use standard HTTP status codes to indicate success or failure. A consistent error response format will be used:

json
{
  "statusCode": number, // e.g., 400, 401, 403, 404, 500
  "message": string | string[], // Human-readable error message or array of validation errors
  "error": string, // Short error description (e.g., "Bad Request", "Unauthorized")
  "timestamp": "string (ISO 8601 date)",
  "path": "string (request path)"
}


**Common Status Codes:**
*   `200 OK`: Request successful.
*   `201 Created`: Resource successfully created.
*   `204 No Content`: Request successful, no content to return.
*   `400 Bad Request`: Invalid request payload (e.g., validation errors). Response body will contain details.
*   `401 Unauthorized`: Missing or invalid authentication token.
*   `403 Forbidden`: Authenticated user does not have permission to access the resource.
*   `404 Not Found`: Resource not found.
*   `409 Conflict`: Request conflicts with the current state of the resource (e.g., trying to create an already existing unique resource).
*   `422 Unprocessable Entity`: Request was well-formed but semantically incorrect (e.g., business rule violation not caught by basic validation).
*   `500 Internal Server Error`: Unexpected server-side error.
*   `503 Service Unavailable`: Temporary server error (e.g., downstream service unavailable).

NestJS built-in exception filters will be leveraged, and custom exception filters can be created for specific error handling scenarios.

## 7. Configuration
The `BillingMonetizationModule` will utilize NestJS `ConfigModule` and the `billing.config.ts` file to manage module-specific configurations.
Key configurations potentially influencing API behavior or underlying services:
*   Payment Gateway API Keys & Secrets (managed securely, accessed by service layer)
*   Default Grace Period (`DEFAULT_GRACE_PERIOD_DAYS_CONFIG_KEY`)
*   Plan Definitions (if not fully DB-driven, `PLAN_CONFIG_SOURCE`)
*   Feature Toggles for specific billing features (e.g., `enableProrationOnUpgrade`, `enableTransactionFeesPerPlan`)

## 8. OpenAPI Documentation
All controllers, DTOs, and ROs will be decorated with `@nestjs/swagger` decorators (e.g., `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiProperty`, `@ApiBody`, `@ApiParam`). This will enable automatic generation of an OpenAPI v3.1.0 specification, typically accessible at `/api-docs`.

## 9. Raw Body for Webhooks
To enable webhook signature verification, the application needs to access the raw request body. This requires specific configuration in `main.ts`:
typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Disable NestJS default body parsing
  });

  // Use a global middleware or specific middleware for webhook routes
  // to parse JSON only if not a webhook route, or parse raw body for webhooks
  // Example:
  // app.use(json({ verify: (req: any, res, buf) => { req.rawBody = buf; } }));
  // OR, more selectively:
  // const rawBodyBuffer = (req, res, buf, encoding) => {
  //   if (buf && buf.length) {
  //     req.rawBody = buf.toString(encoding || 'utf8');
  //   }
  // };
  // app.use(bodyParser.json({ verify: rawBodyBuffer, limit: '5mb' }));
  // app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true, limit: '5mb' }));


  // It's common to use a custom Express middleware for this:
  app.use((req: Request & { rawBody?: Buffer }, res, next) => {
    if (req.url.includes('/webhooks/')) { // Or a more specific check
      const chunks: Buffer[] = [];
      req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      req.on('end', () => {
        req.rawBody = Buffer.concat(chunks);
        // For JSON payloads, also parse it after getting rawBody if NestJS default parsing is off globally
        if (req.headers['content-type']?.includes('application/json') && req.rawBody) {
            try {
                req.body = JSON.parse(req.rawBody.toString('utf8'));
            } catch (e) {
                // Handle JSON parsing error
            }
        }
        next();
      });
    } else {
      // Apply standard JSON parsing for other routes if bodyParser is false globally
      json()(req, res, next); 
    }
  });

  // ... other app configurations (ValidationPipe, Swagger)
  await app.listen(3000);
}
bootstrap();

The `PaymentController` methods handling webhooks will then need to access `req.rawBody`. NestJS offers `RawBodyRequest<Request>` type from `@nestjs/common` that can be used when `rawBody: true` is passed to the `NestFactory.create` options, or the `bodyParser: false` and manual parsing approach as outlined above is used. The `bodyParser: false` approach with manual intervention or a custom middleware is often more reliable for ensuring the raw body is available *before* NestJS tries to parse it.

Final decision for raw body handling should be made during implementation, prioritizing the method that integrates most cleanly with NestJS and the chosen payment gateway SDKs for signature verification. The key is that the raw, unparsed request body must be available to the webhook handler.

typescript
// In PaymentController for webhook handler
// Example for Stripe:
// const sig = headers['stripe-signature'];
// const endpointSecret = 'whsec_...'; // From config
// let event;
// try {
//   event = this.stripeClient.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
// } catch (err) {
//   throw new BadRequestException(`Webhook Error: ${err.message}`);
// }
// // Then pass event to service:
// await this.billingMonetizationService.processPaymentWebhook(gateway, event);

