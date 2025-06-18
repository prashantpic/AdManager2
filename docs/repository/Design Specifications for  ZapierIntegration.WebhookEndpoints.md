# Software Design Specification (SDS) - ZapierIntegration.WebhookEndpoints (REPO-ZAPIER-017)

## 1. Introduction

### 1.1 Purpose
This document provides the detailed software design specification for the `ZapierIntegration.WebhookEndpoints` repository. This repository is responsible for defining webhook endpoints to receive data from Zapier, specifically for Google Ads integrations, and potentially for triggering outbound Zaps from the Ad Manager Platform. Its primary goal is to facilitate the automation of lead management and campaign performance tracking as outlined in requirement REQ-TCE-006.

This SDS will guide the development of the module, ensuring alignment with the overall Ad Manager Platform architecture, technology stack, and user requirements.

### 1.2 Scope
The scope of this SDS covers the design of the following components within the `AdManager.ThirdPartyConnectivity.Zapier.V1` namespace:
-   Webhook controllers for receiving Google Ads lead and performance data from Zapier.
-   Services to process this incoming data and to trigger outbound Zaps.
-   Data Transfer Objects (DTOs) for incoming webhook payloads.
-   Security guards for webhook authentication.
-   Configuration management for Zapier-specific settings.
-   Relevant interfaces and constants.

### 1.3 Definitions, Acronyms, and Abbreviations
-   **SDS**: Software Design Specification
-   **API**: Application Programming Interface
-   **REST**: Representational State Transfer
-   **JSON**: JavaScript Object Notation
-   **DTO**: Data Transfer Object
-   **Zapier**: An online automation tool that connects apps and services.
-   **Webhook**: An HTTP callback or HTTP POST that occurs when something happens; a simple event-notification via HTTP POST.
-   **REQ-TCE-006**: Requirement ID for Zapier Integration with Google Ads.
-   **NestJS**: A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
-   **JWT**: JSON Web Token
-   **ConfigService**: NestJS service for accessing configuration variables.
-   **HttpService**: NestJS service for making HTTP requests.
-   **PKCE**: Proof Key for Code Exchange

### 1.4 References
-   User Requirements Document (specifically REQ-TCE-006)
-   Ad Manager Platform Architecture Design Document
-   Ad Manager Platform Sequence Diagrams (if applicable to Zapier integration)
-   NestJS Documentation (https://docs.nestjs.com/)
-   Zapier Webhook Documentation (https://zapier.com/help/create/code-webhooks/trigger-zaps-from-webhooks)

### 1.5 Overview
This repository will be a NestJS module providing endpoints to integrate with Zapier. It will primarily focus on:
1.  Receiving webhook notifications from Zapier when Google Ads events occur (e.g., new lead, performance update).
2.  Validating and processing these notifications.
3.  Potentially triggering other Zaps by making outbound HTTP requests to Zapier webhook URLs provided by merchants.

Security will be handled by validating a shared secret or signature from Zapier.

## 2. System Architecture
This module operates within the Ad Manager's microservices architecture. It interfaces with the `api-gateway-layer` to expose its webhook endpoints and resides within the `application-services-layer` and `integration-layer` for its business logic and third-party communication.

The central component within this repository is the `ThirdPartyConnectivityService`, which will contain the specific logic for `ZapierService`.

## 3. Detailed Design

### 3.1 Module Structure (`AdManager.ThirdPartyConnectivity.Zapier.V1`)


src/modules/third-party-connectivity/zapier/v1/
├── config/
│   └── zapier.config.ts
├── constants/
│   └── zapier.constants.ts
├── controllers/
│   └── zapier.controller.ts
├── dto/
│   ├── receive-google-ads-lead.dto.ts
│   └── receive-google-ads-performance.dto.ts
├── guards/
│   └── zapier-webhook.guard.ts
├── interfaces/
│   └── zapier-service.interface.ts
├── services/
│   └── zapier.service.ts
└── zapier.module.ts


*(Note: The file structure provided in the prompt has `constants` and `services` directly under `v1` and controllers under `controllers`. The above structure is slightly more conventional for NestJS, placing all functional types in their respective directories. The generated code should follow the exact path from the prompt: `src/modules/third-party-connectivity/zapier/v1/zapier.constants.ts`, `src/modules/third-party-connectivity/zapier/v1/interfaces/zapier-service.interface.ts`, `src/modules/third-party-connectivity/zapier/v1/config/zapier.config.ts`, `src/modules/third-party-connectivity/zapier/v1/dto/receive-google-ads-lead.dto.ts`, `src/modules/third-party-connectivity/zapier/v1/dto/receive-google-ads-performance.dto.ts`, `src/modules/third-party-connectivity/zapier/v1/guards/zapier-webhook.guard.ts`, `src/modules/third-party-connectivity/zapier/v1/zapier.service.ts`, `src/modules/third-party-connectivity/zapier/v1/zapier.controller.ts`, `src/modules/third-party-connectivity/zapier/v1/zapier.module.ts`.)*


### 3.2 File Specifications

#### 3.2.1 `src/modules/third-party-connectivity/zapier/v1/zapier.constants.ts`
-   **Purpose**: To provide a centralized place for Zapier integration-specific constants.
-   **Namespace**: `AdManager.ThirdPartyConnectivity.Zapier.V1`
-   **Description**: Contains static constant values for the Zapier V1 module. This improves maintainability and reduces magic strings.
-   **REQ-TCE-006 Implementation**: Supports configuration and path definitions for Zapier webhooks.
-   **Logic Description**: This file will export various string constants.
    typescript
    export const ZAPIER_WEBHOOK_SECRET_CONFIG_KEY = 'ZAPIER_WEBHOOK_SECRET'; // Key to fetch actual secret from ConfigService
    export const GOOGLE_ADS_LEAD_WEBHOOK_PATH = 'google-ads/leads';
    export const GOOGLE_ADS_PERFORMANCE_WEBHOOK_PATH = 'google-ads/performance';
    export const ZAPIER_SIGNATURE_HEADER = 'X-Zapier-Signature'; // Example, actual header may vary
    export const ZAPIER_OUTBOUND_REQUEST_TIMEOUT_MS = 5000; // Timeout for outbound requests to Zapier
    

#### 3.2.2 `src/modules/third-party-connectivity/zapier/v1/interfaces/zapier-service.interface.ts`
-   **Purpose**: To establish a clear contract for Zapier integration logic.
-   **Namespace**: `AdManager.ThirdPartyConnectivity.Zapier.V1.Interfaces`
-   **Description**: Interface for `ZapierService`, specifying methods to handle Zapier interactions. This facilitates dependency injection and testability.
-   **REQ-TCE-006 Implementation**: Defines methods for processing incoming Google Ads data and triggering Zaps for lead management and performance tracking.
-   **Logic Description**: Declares methods for handling incoming data and triggering outgoing actions.
    typescript
    import { ReceiveGoogleAdsLeadDto } from '../dto/receive-google-ads-lead.dto';
    import { ReceiveGoogleAdsPerformanceDto } from '../dto/receive-google-ads-performance.dto';

    export const IZapierService = Symbol('IZapierService');

    export interface IZapierService {
      /**
       * Processes incoming Google Ads lead data from a Zapier webhook.
       * @param merchantId - The ID of the merchant associated with this webhook.
       * @param payload - The lead data payload.
       */
      processIncomingGoogleAdsLead(merchantId: string, payload: ReceiveGoogleAdsLeadDto): Promise<void>;

      /**
       * Processes incoming Google Ads performance data from a Zapier webhook.
       * @param merchantId - The ID of the merchant associated with this webhook.
       * @param payload - The performance data payload.
       */
      processIncomingGoogleAdsPerformance(merchantId: string, payload: ReceiveGoogleAdsPerformanceDto): Promise<void>;

      /**
       * Triggers a Zapier Zap for lead management purposes.
       * @param leadData - The data to send to the Zap.
       * @param merchantZapierUrl - The merchant-specific Zapier webhook URL to trigger.
       */
      triggerZapForLeadManagement(leadData: any, merchantZapierUrl: string): Promise<void>;

      /**
       * Triggers a Zapier Zap for campaign performance tracking purposes.
       * @param performanceData - The data to send to the Zap.
       * @param merchantZapierUrl - The merchant-specific Zapier webhook URL to trigger.
       */
      triggerZapForPerformanceTracking(performanceData: any, merchantZapierUrl: string): Promise<void>;
    }
    

#### 3.2.3 `src/modules/third-party-connectivity/zapier/v1/config/zapier.config.ts`
-   **Purpose**: To provide a typed and validated way to access Zapier-related configurations.
-   **Namespace**: `AdManager.ThirdPartyConnectivity.Zapier.V1.Config`
-   **Description**: Manages and provides access to Zapier integration specific configurations. Uses NestJS `ConfigService`.
-   **REQ-TCE-006 Implementation**: Manages secure retrieval of webhook secrets necessary for validating incoming Zapier requests.
-   **Logic Description**:
    typescript
    import { Injectable } from '@nestjs/common';
    import { ConfigService } from '@nestjs/config';
    import { ZAPIER_WEBHOOK_SECRET_CONFIG_KEY } from '../zapier.constants';

    @Injectable()
    export class ZapierConfig {
      constructor(private readonly configService: ConfigService) {}

      /**
       * Retrieves the Zapier webhook secret.
       * This secret is used to validate incoming webhooks from Zapier.
       * It should be configured per merchant or globally depending on security model.
       * For this example, we assume a global secret for simplicity, but per-merchant is more secure.
       *
       * @param merchantId - Optional: The ID of the merchant if secrets are per-merchant.
       * @returns The Zapier webhook secret.
       * @throws Error if the secret is not configured.
       */
      getWebhookSecret(merchantId?: string): string {
        // Example: For a global secret
        const secret = this.configService.get<string>(ZAPIER_WEBHOOK_SECRET_CONFIG_KEY);
        // Example: For per-merchant secret, the key might be ZAPIER_WEBHOOK_SECRET_${merchantId}
        // const secret = this.configService.get<string>(`ZAPIER_WEBHOOK_SECRET_${merchantId}`);

        if (!secret) {
          throw new Error(`Zapier webhook secret ('${ZAPIER_WEBHOOK_SECRET_CONFIG_KEY}') is not configured.`);
        }
        return secret;
      }

      // Add other Zapier-related configurations if needed
      // e.g., default Zapier API base URL, specific app identifiers
    }
    
    *Note: This configuration should be registered as a provider in `zapier.module.ts` and injected where needed.*

#### 3.2.4 `src/modules/third-party-connectivity/zapier/v1/dto/receive-google-ads-lead.dto.ts`
-   **Purpose**: To ensure type safety and validation for incoming Google Ads lead data from Zapier.
-   **Namespace**: `AdManager.ThirdPartyConnectivity.Zapier.V1.Dto`
-   **Description**: Defines the structure and validation rules for Google Ads lead data received from Zapier.
-   **REQ-TCE-006 Implementation**: Specifies the expected data contract for lead automation workflows.
-   **Logic Description**:
    typescript
    import { IsString, IsNotEmpty, IsObject, IsOptional, ValidateNested, IsDateString } from 'class-validator';
    import { Type } from 'class-transformer';

    // Define a more specific type for formData if possible, or use Record<string, any>
    // For example, if you expect specific fields like 'email', 'name':
    // class LeadFormDataDto {
    //   @IsEmail()
    //   @IsOptional()
    //   email?: string;
    //
    //   @IsString()
    //   @IsOptional()
    //   name?: string;
    //
    //   // Add other common lead form fields with validation
    // }

    export class ReceiveGoogleAdsLeadDto {
      @IsString()
      @IsNotEmpty()
      leadId: string; // Unique ID for the lead from Google Ads or Zapier

      @IsString()
      @IsNotEmpty()
      campaignId: string; // Google Ads Campaign ID

      @IsString()
      @IsOptional()
      adGroupId?: string; // Google Ads Ad Group ID

      @IsString()
      @IsOptional()
      adId?: string; // Google Ads Ad ID (Creative ID)

      @IsObject()
      @IsNotEmpty()
      // @ValidateNested() // Uncomment if using a nested DTO like LeadFormDataDto
      // @Type(() => LeadFormDataDto) // Uncomment if using a nested DTO
      formData: Record<string, any>; // Raw form data submitted by the user

      @IsDateString()
      @IsNotEmpty()
      timestamp: string; // ISO 8601 timestamp of when the lead was generated/received

      @IsString()
      @IsOptional()
      merchantZapierUrl?: string; // Optional: URL if this lead should trigger a specific merchant Zap

      // Add any other relevant fields passed by Zapier
    }
    

#### 3.2.5 `src/modules/third-party-connectivity/zapier/v1/dto/receive-google-ads-performance.dto.ts`
-   **Purpose**: To ensure type safety and validation for incoming Google Ads performance data from Zapier.
-   **Namespace**: `AdManager.ThirdPartyConnectivity.Zapier.V1.Dto`
-   **Description**: Defines the structure and validation rules for Google Ads performance data received from Zapier.
-   **REQ-TCE-006 Implementation**: Specifies the expected data contract for campaign performance tracking automation.
-   **Logic Description**:
    typescript
    import { IsString, IsNotEmpty, IsDateString, IsNumber, Min, IsOptional } from 'class-validator';

    export class ReceiveGoogleAdsPerformanceDto {
      @IsString()
      @IsNotEmpty()
      campaignId: string; // Google Ads Campaign ID

      @IsDateString()
      @IsNotEmpty()
      date: string; // Date for which the performance data is reported (YYYY-MM-DD)

      @IsNumber()
      @Min(0)
      impressions: number;

      @IsNumber()
      @Min(0)
      clicks: number;

      @IsNumber()
      @Min(0)
      cost: number; // In the currency of the Google Ads account

      @IsNumber()
      @Min(0)
      conversions: number;

      @IsString()
      @IsOptional()
      merchantZapierUrl?: string; // Optional: URL if this performance data should trigger a specific merchant Zap

      // Add other relevant performance metrics (e.g., adGroupId, adId, specific conversion actions)
    }
    

#### 3.2.6 `src/modules/third-party-connectivity/zapier/v1/guards/zapier-webhook.guard.ts`
-   **Purpose**: To protect Zapier webhook endpoints from unauthorized access.
-   **Namespace**: `AdManager.ThirdPartyConnectivity.Zapier.V1.Guards`
-   **Description**: Authenticates incoming requests to Zapier webhook endpoints using a shared secret or signature.
-   **REQ-TCE-006 Implementation**: Ensures that only legitimate requests from Zapier are processed.
-   **Logic Description**:
    typescript
    import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
    import { Observable } from 'rxjs';
    import { Request } from 'express';
    import { ZapierConfig } from '../config/zapier.config';
    import { ZAPIER_SIGNATURE_HEADER } from '../zapier.constants'; // Assuming a signature header
    import * as crypto from 'crypto'; // For more robust signature validation if Zapier provides it

    @Injectable()
    export class ZapierWebhookGuard implements CanActivate {
      private readonly logger = new Logger(ZapierWebhookGuard.name);

      constructor(private readonly zapierConfig: ZapierConfig) {}

      canActivate(
        context: ExecutionContext,
      ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const merchantId = request.params.merchantId; // Assuming merchantId is part of the path for per-merchant secrets

        try {
          // Option 1: Simple Shared Secret (less secure, primarily for internal/trusted Zapier setups)
          // const providedSecret = request.headers['x-zapier-secret'] as string; // Example header
          // const expectedSecret = this.zapierConfig.getWebhookSecret(merchantId);
          // if (providedSecret === expectedSecret) {
          //   return true;
          // }

          // Option 2: HMAC Signature Validation (more secure, if Zapier supports this pattern)
          // This usually involves Zapier sending a signature and the raw request body.
          // You'd then compute the HMAC of the body using your shared secret and compare.
          const zapierSignature = request.headers[ZAPIER_SIGNATURE_HEADER.toLowerCase()] as string;
          const rawBody = (request as any).rawBody; // Requires rawBodyParser middleware or similar

          if (!zapierSignature || !rawBody) {
            this.logger.warn(`Missing Zapier signature or raw body for merchant: ${merchantId}`);
            throw new UnauthorizedException('Missing Zapier signature or request body.');
          }

          const expectedSecret = this.zapierConfig.getWebhookSecret(merchantId);
          const hmac = crypto.createHmac('sha256', expectedSecret);
          const computedSignature = hmac.update(rawBody).digest('hex');

          if (crypto.timingSafeEqual(Buffer.from(zapierSignature), Buffer.from(computedSignature))) {
            this.logger.log(`Zapier webhook validated successfully for merchant: ${merchantId}`);
            return true;
          }

          this.logger.warn(`Invalid Zapier signature for merchant: ${merchantId}. Provided: ${zapierSignature}, Computed: ${computedSignature}`);
          throw new UnauthorizedException('Invalid Zapier signature.');

        } catch (error) {
          this.logger.error(`Zapier webhook authentication failed for merchant ${merchantId}: ${error.message}`);
          if (error instanceof UnauthorizedException) {
            throw error;
          }
          throw new UnauthorizedException('Zapier webhook authentication failed.');
        }
      }
    }
    
    *Note: The `rawBody` part needs careful setup with NestJS. It might require a custom body parser or middleware to preserve the raw request body for signature verification.*
    *A simpler approach if Zapier only supports a static token in the header would be to just compare that token. The HMAC approach is more robust.*
    *The guard should ideally differentiate between global secrets and per-merchant secrets if applicable.*

#### 3.2.7 `src/modules/third-party-connectivity/zapier/v1/zapier.service.ts`
-   **Purpose**: To encapsulate all Zapier integration logic.
-   **Namespace**: `AdManager.ThirdPartyConnectivity.Zapier.V1`
-   **Description**: Core service for handling all Zapier integration logic, including receiving webhooks and triggering Zaps.
-   **REQ-TCE-006 Implementation**: Implements the core logic for lead and performance data processing and Zap triggering.
-   **Dependencies**: `@nestjs/axios HttpService`, `@nestjs/common Logger`, `IZapierService` (for injection token), DTOs.
-   **Logic Description**:
    typescript
    import { Injectable, Logger, Inject } from '@nestjs/common';
    import { HttpService } from '@nestjs/axios';
    import { firstValueFrom, timeout } from 'rxjs';
    import { IZapierService } from '../interfaces/zapier-service.interface';
    import { ReceiveGoogleAdsLeadDto } from '../dto/receive-google-ads-lead.dto';
    import { ReceiveGoogleAdsPerformanceDto } from '../dto/receive-google-ads-performance.dto';
    import { ZAPIER_OUTBOUND_REQUEST_TIMEOUT_MS } from '../zapier.constants';
    // Import other Ad Manager domain services if this service needs to interact with them
    // e.g., import { LeadManagementService } from '../../../../leads/lead-management.service';
    // e.g., import { AnalyticsProcessingService } from '../../../../analytics/analytics-processing.service';

    @Injectable()
    export class ZapierService implements IZapierService {
      private readonly logger = new Logger(ZapierService.name);

      constructor(
        private readonly httpService: HttpService,
        // @Inject(LeadManagementService) private readonly leadManagementService: LeadManagementService, // Example
        // @Inject(AnalyticsProcessingService) private readonly analyticsProcessingService: AnalyticsProcessingService, // Example
      ) {}

      async processIncomingGoogleAdsLead(merchantId: string, payload: ReceiveGoogleAdsLeadDto): Promise<void> {
        this.logger.log(`Processing incoming Google Ads lead for merchant ${merchantId}: Lead ID ${payload.leadId}`);
        // 1. Further validate payload if necessary (beyond DTO validation)
        // 2. Transform data if needed for internal Ad Manager systems
        // 3. Store the lead data or pass it to a dedicated Lead Management Service
        //    Example: await this.leadManagementService.createLeadFromZapier(merchantId, payload);
        // 4. If payload.merchantZapierUrl is present, this might also trigger an outbound Zap
        if (payload.merchantZapierUrl) {
          this.logger.log(`Lead payload contains merchantZapierUrl, considering outbound trigger for merchant ${merchantId}`);
          // Potentially call triggerZapForLeadManagement if the flow dictates it.
          // This depends on whether the incoming webhook itself is the source or a trigger for another Zap.
        }
        this.logger.log(`Successfully processed Google Ads lead for merchant ${merchantId}: Lead ID ${payload.leadId}`);
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      async processIncomingGoogleAdsPerformance(merchantId: string, payload: ReceiveGoogleAdsPerformanceDto): Promise<void> {
        this.logger.log(`Processing incoming Google Ads performance data for merchant ${merchantId}, Campaign ID ${payload.campaignId}, Date ${payload.date}`);
        // 1. Further validate payload
        // 2. Transform data for internal analytics storage
        // 3. Pass data to an Analytics Processing Service
        //    Example: await this.analyticsProcessingService.ingestGoogleAdsPerformanceFromZapier(merchantId, payload);
        // 4. If payload.merchantZapierUrl is present, consider triggering an outbound Zap.
        if (payload.merchantZapierUrl) {
             this.logger.log(`Performance payload contains merchantZapierUrl, considering outbound trigger for merchant ${merchantId}`);
        }
        this.logger.log(`Successfully processed Google Ads performance data for merchant ${merchantId}, Campaign ID ${payload.campaignId}`);
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      async triggerZapForLeadManagement(leadData: any, merchantZapierUrl: string): Promise<void> {
        this.logger.log(`Triggering Zap for lead management at URL: ${merchantZapierUrl}`);
        try {
          const response = await firstValueFrom(
            this.httpService.post(merchantZapierUrl, leadData).pipe(timeout(ZAPIER_OUTBOUND_REQUEST_TIMEOUT_MS)),
          );
          this.logger.log(`Zap triggered successfully for lead management. Status: ${response.status}`);
          // Handle Zapier's response (Zapier usually returns a success status immediately if webhook is received)
        } catch (error) {
          this.logger.error(`Failed to trigger Zap for lead management at ${merchantZapierUrl}: ${error.message}`, error.stack);
          // Implement retry logic or dead-letter queue if critical
          throw error; // Re-throw or handle gracefully
        }
      }

      async triggerZapForPerformanceTracking(performanceData: any, merchantZapierUrl: string): Promise<void> {
        this.logger.log(`Triggering Zap for performance tracking at URL: ${merchantZapierUrl}`);
        try {
          const response = await firstValueFrom(
            this.httpService.post(merchantZapierUrl, performanceData).pipe(timeout(ZAPIER_OUTBOUND_REQUEST_TIMEOUT_MS)),
          );
          this.logger.log(`Zap triggered successfully for performance tracking. Status: ${response.status}`);
        } catch (error) {
          this.logger.error(`Failed to trigger Zap for performance tracking at ${merchantZapierUrl}: ${error.message}`, error.stack);
          throw error;
        }
      }
    }
    

#### 3.2.8 `src/modules/third-party-connectivity/zapier/v1/zapier.controller.ts`
-   **Purpose**: To expose secure endpoints for Zapier to send Google Ads related data.
-   **Namespace**: `AdManager.ThirdPartyConnectivity.Zapier.V1`
-   **Description**: Controller exposing webhook endpoints for receiving data from Zapier. Input data is validated via DTOs.
-   **REQ-TCE-006 Implementation**: Provides the HTTP interface for Zapier to push Google Ads lead and performance data.
-   **Dependencies**: `@nestjs/common`, `IZapierService`, DTOs, `ZapierWebhookGuard`.
-   **Logic Description**:
    typescript
    import { Controller, Post, Body, UseGuards, Inject, HttpCode, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
    import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiHeader } from '@nestjs/swagger';
    import { IZapierService } from '../interfaces/zapier-service.interface';
    import { ReceiveGoogleAdsLeadDto } from '../dto/receive-google-ads-lead.dto';
    import { ReceiveGoogleAdsPerformanceDto } from '../dto/receive-google-ads-performance.dto';
    import { ZapierWebhookGuard } from '../guards/zapier-webhook.guard';
    import { GOOGLE_ADS_LEAD_WEBHOOK_PATH, GOOGLE_ADS_PERFORMANCE_WEBHOOK_PATH, ZAPIER_SIGNATURE_HEADER } from '../zapier.constants';

    @ApiTags('Zapier Webhooks (v1)')
    @Controller('zapier/v1/webhooks/merchants/:merchantId') // Assuming merchant-specific webhook URLs
    @ApiHeader({ // For documentation purposes, the guard will actually check this
        name: ZAPIER_SIGNATURE_HEADER, // Or 'x-zapier-secret'
        description: 'Zapier Webhook Signature or Shared Secret for validation.',
        required: true,
    })
    export class ZapierController {
      constructor(
        @Inject(IZapierService) private readonly zapierService: IZapierService,
      ) {}

      @Post(GOOGLE_ADS_LEAD_WEBHOOK_PATH)
      @UseGuards(ZapierWebhookGuard)
      @HttpCode(HttpStatus.ACCEPTED) // Use 202 Accepted if processing is asynchronous
      @ApiOperation({ summary: 'Receive Google Ads lead data from Zapier' })
      @ApiParam({ name: 'merchantId', type: 'string', format: 'uuid', description: 'Merchant Identifier' })
      @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Lead data received and queued for processing.' })
      @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid payload.' })
      @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Webhook authentication failed.' })
      async handleGoogleAdsLeadWebhook(
        @Param('merchantId', ParseUUIDPipe) merchantId: string,
        @Body() payload: ReceiveGoogleAdsLeadDto,
      ): Promise<{ message: string }> {
        // The guard will run first. If it passes, this method is executed.
        await this.zapierService.processIncomingGoogleAdsLead(merchantId, payload);
        return { message: 'Google Ads lead data received successfully.' };
      }

      @Post(GOOGLE_ADS_PERFORMANCE_WEBHOOK_PATH)
      @UseGuards(ZapierWebhookGuard)
      @HttpCode(HttpStatus.ACCEPTED)
      @ApiOperation({ summary: 'Receive Google Ads performance data from Zapier' })
      @ApiParam({ name: 'merchantId', type: 'string', format: 'uuid', description: 'Merchant Identifier' })
      @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Performance data received and queued for processing.' })
      @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid payload.' })
      @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Webhook authentication failed.' })
      async handleGoogleAdsPerformanceWebhook(
        @Param('merchantId', ParseUUIDPipe) merchantId: string,
        @Body() payload: ReceiveGoogleAdsPerformanceDto,
      ): Promise<{ message: string }> {
        await this.zapierService.processIncomingGoogleAdsPerformance(merchantId, payload);
        return { message: 'Google Ads performance data received successfully.' };
      }

      // Potentially, add endpoints here if Ad Manager needs to *trigger* Zaps
      // based on internal Ad Manager events. This would involve this controller
      // calling methods on ZapierService like triggerZapForLeadManagement.
      // However, REQ-TCE-006 focuses on Zapier sending data *to* Ad Manager.
      // Outbound triggers would typically be initiated by other domain services within Ad Manager.
    }
    
    *Note: The `@ApiHeader` is for Swagger documentation. The actual check is in the `ZapierWebhookGuard`.*
    *Using `merchantId` in the path allows for per-merchant webhook URLs and potentially per-merchant secret validation in the guard.*

#### 3.2.9 `src/modules/third-party-connectivity/zapier/v1/zapier.module.ts`
-   **Purpose**: To organize and provide the Zapier integration functionality as a cohesive module.
-   **Namespace**: `AdManager.ThirdPartyConnectivity.Zapier.V1`
-   **Description**: The Zapier V1 module, bundling controllers, services, and configuration for Zapier integration.
-   **REQ-TCE-006 Implementation**: Provides the overall structure for the Zapier integration feature.
-   **Logic Description**:
    typescript
    import { Module, Logger } from '@nestjs/common';
    import { HttpModule } from '@nestjs/axios';
    import { ConfigModule } from '@nestjs/config'; // Import if ZapierConfig relies on NestJS ConfigService directly
    import { ZapierController } from './zapier.controller';
    import { ZapierService } from './zapier.service';
    import { IZapierService } from './interfaces/zapier-service.interface';
    import { ZapierConfig } from './config/zapier.config';
    import { ZapierWebhookGuard } from './guards/zapier-webhook.guard';
    // If ZapierService interacts with other Ad Manager domain services, they might need to be imported here
    // and provided if they are part of a different module.
    // e.g., import { LeadManagementModule } from '../../../../leads/lead-management.module';

    @Module({
      imports: [
        HttpModule.register({ // Configure HttpModule if needed (e.g., default timeout, headers)
          timeout: 5000,
          maxRedirects: 5,
        }),
        ConfigModule, // Make sure ConfigModule is globally available or imported if ZapierConfig uses it
        // LeadManagementModule, // Example: if ZapierService depends on LeadManagementService
        // AnalyticsModule,     // Example: if ZapierService depends on AnalyticsProcessingService
      ],
      controllers: [ZapierController],
      providers: [
        ZapierService, // Concrete implementation
        {
          provide: IZapierService, // Interface token
          useClass: ZapierService,  // Use ZapierService as the implementation
        },
        ZapierConfig,    // Configuration provider
        ZapierWebhookGuard, // Guard for webhook authentication
        Logger, // Provide Logger for injection
      ],
      exports: [IZapierService, ZapierConfig], // Export if other modules need to use ZapierService or config
    })
    export class ZapierModuleV1 {}
    

### 3.3 Data Models
-   **`ReceiveGoogleAdsLeadDto`**: See section 3.2.4
-   **`ReceiveGoogleAdsPerformanceDto`**: See section 3.2.5

### 3.4 Interfaces
-   **`IZapierService`**: See section 3.2.2

### 3.5 Security Considerations
-   **Webhook Authentication**: The `ZapierWebhookGuard` is critical. It MUST validate incoming requests from Zapier. The preferred method is HMAC signature validation if Zapier supports it for custom webhooks. A less secure fallback is a shared secret passed in a custom header. This secret must be configurable and managed securely (e.g., via AWS Secrets Manager, accessed by `ZapierConfig`).
-   **Input Validation**: All incoming payloads MUST be validated using DTOs and `class-validator`.
-   **HTTPS**: All communication with Zapier (both incoming webhooks to Ad Manager and outgoing requests from Ad Manager to Zapier) MUST use HTTPS. API Gateway will handle SSL termination for incoming webhooks.
-   **Rate Limiting**: Consider implementing rate limiting on the API Gateway for the webhook endpoints to prevent abuse.
-   **Error Handling**: Graceful error handling should be implemented. Sensitive error details should not be exposed in responses to Zapier; log them internally.
-   **Outbound Request Security**: When Ad Manager triggers a Zapier Zap (outbound call), ensure the `merchantZapierUrl` is a valid HTTPS URL and is specific to the authenticated merchant context.

### 3.6 Configuration
-   **`ZAPIER_WEBHOOK_SECRET`**: The shared secret (or key for HMAC) used to validate incoming webhooks. This should be stored securely (e.g., environment variable, AWS Secrets Manager) and accessed via `ZapierConfig`. It can be global or per-merchant.
-   Feature toggles (`enableZapierGoogleAdsLeadWebhook`, `enableZapierGoogleAdsPerformanceWebhook`, `enableAdManagerTriggeringOfZapierZaps`) can be used to enable/disable parts of this integration.

### 3.7 Error Handling and Logging
-   **Error Handling**:
    -   The `ZapierWebhookGuard` will throw an `UnauthorizedException` if authentication fails.
    -   DTO validation failures will result in a `BadRequestException` (handled by NestJS `ValidationPipe`).
    -   `ZapierService` methods should handle errors during processing or when making outbound HTTP calls (e.g., network issues, timeouts, non-2xx responses from Zapier).
    -   Use standard NestJS exception filters for consistent error responses.
-   **Logging**:
    -   Use NestJS `LoggerService` for structured logging.
    -   Log key events:
        -   Webhook received (with obfuscated sensitive data if any).
        -   Webhook validation success/failure.
        -   Start and end of data processing.
        -   Errors encountered during processing.
        -   Outbound Zap trigger attempts (success/failure).
    -   Include correlation IDs in logs for easier tracing.

## 4. Integration with Other Components/Repositories
-   **API Gateway Layer**: The `ZapierController` endpoints will be exposed via the API Gateway.
-   **Application Services Layer**: The `ZapierService` forms part of this layer.
-   **Integration Layer**: The `ZapierService` (using `HttpService`) and the overall module act as an integration point with the third-party Zapier platform.
-   **`ThirdPartyConnectivityService` (Conceptual Component)**: The `ZapierService` is a concrete implementation of the Zapier connectivity part of this conceptual component.
-   **Other Ad Manager Domain Services (Hypothetical)**: If Ad Manager has services like `LeadManagementService` or `AnalyticsProcessingService`, `ZapierService` would invoke methods on these services to persist or process the data received from Zapier. These would be injected dependencies.

## 5. Testing Considerations
-   **Unit Tests**:
    -   `ZapierConfig`: Test retrieval of configuration values.
    -   `ZapierWebhookGuard`: Mock `ZapierConfig` and `ExecutionContext` to test `canActivate` logic with valid and invalid secrets/signatures.
    -   `ZapierService`: Mock `HttpService` and other domain service dependencies. Test logic for processing leads, performance data, and triggering Zaps, including error scenarios.
    -   `ZapierController`: Mock `ZapierService`. Test endpoint routing, DTO validation (implicitly via e2e or integration tests), and guard application.
-   **Integration Tests**:
    -   Test the flow from `ZapierController` through `ZapierWebhookGuard` to `ZapierService` within the NestJS module context.
    -   Test DTO validation using `ValidationPipe`.
-   **End-to-End (E2E) Tests**:
    -   Simulate Zapier sending webhook requests to the deployed endpoints (behind API Gateway).
    -   Verify security, request validation, and expected responses.
    -   Mock actual calls to Zapier for outbound triggers to avoid external dependencies in automated tests.

## 6. Deployment Considerations
-   The module will be deployed as part of the Ad Manager backend application (likely a microservice or part of one).
-   API Gateway needs to be configured to route `zapier/v1/webhooks/merchants/:merchantId/*` paths to this service.
-   Environment variables for Zapier configuration (e.g., `ZAPIER_WEBHOOK_SECRET`) must be set in the deployment environment.
-   Ensure appropriate IAM permissions if `ZapierConfig` reads from AWS Secrets Manager.
-   If using `rawBody` for HMAC signature validation in the guard, ensure the NestJS application is configured to provide it (e.g., `NestFactory.create(AppModule, { rawBody: true })`).

This SDS provides a comprehensive design for the `ZapierIntegration.WebhookEndpoints` repository, focusing on fulfilling REQ-TCE-006 and adhering to NestJS best practices.