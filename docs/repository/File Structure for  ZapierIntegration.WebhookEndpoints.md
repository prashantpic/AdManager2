# Specification

# 1. Files

- **Path:** src/modules/third-party-connectivity/zapier/v1/zapier.constants.ts  
**Description:** Defines constants used throughout the Zapier integration module, such as configuration keys, event names, or default values.  
**Template:** TypeScript Constants File  
**Dependancy Level:** 0  
**Name:** zapier.constants  
**Type:** Constants  
**Relative Path:** modules/third-party-connectivity/zapier/v1/zapier.constants.ts  
**Repository Id:** REPO-ZAPIER-017  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** ZAPIER_WEBHOOK_SECRET_CONFIG_KEY  
**Type:** string  
**Attributes:** public|static|readonly  
    - **Name:** GOOGLE_ADS_LEAD_WEBHOOK_PATH  
**Type:** string  
**Attributes:** public|static|readonly  
    - **Name:** GOOGLE_ADS_PERFORMANCE_WEBHOOK_PATH  
**Type:** string  
**Attributes:** public|static|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Configuration Management for Zapier Integration
    
**Requirement Ids:**
    
    - REQ-TCE-006
    
**Purpose:** To provide a centralized place for Zapier integration-specific constants, improving maintainability and reducing magic strings.  
**Logic Description:** This file will export various string constants. For example, ZAPIER_WEBHOOK_SECRET_CONFIG_KEY = 'ZAPIER_WEBHOOK_SECRET'; GOOGLE_ADS_LEAD_WEBHOOK_PATH = 'google-ads/leads'.  
**Documentation:**
    
    - **Summary:** Contains static constant values for the Zapier V1 module.
    
**Namespace:** AdManager.ThirdPartyConnectivity.Zapier.V1  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/third-party-connectivity/zapier/v1/interfaces/zapier-service.interface.ts  
**Description:** Defines the contract for the ZapierService, outlining methods for processing incoming webhooks and triggering outbound Zaps.  
**Template:** TypeScript Interface File  
**Dependancy Level:** 0  
**Name:** IZapierService  
**Type:** Interface  
**Relative Path:** modules/third-party-connectivity/zapier/v1/interfaces/zapier-service.interface.ts  
**Repository Id:** REPO-ZAPIER-017  
**Pattern Ids:**
    
    - DependencyInversionPrinciple
    
**Members:**
    
    
**Methods:**
    
    - **Name:** processIncomingGoogleAdsLead  
**Parameters:**
    
    - payload: ReceiveGoogleAdsLeadDto
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** processIncomingGoogleAdsPerformance  
**Parameters:**
    
    - payload: ReceiveGoogleAdsPerformanceDto
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** triggerZapForLeadManagement  
**Parameters:**
    
    - leadData: any
    - merchantZapierUrl: string
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** triggerZapForPerformanceTracking  
**Parameters:**
    
    - performanceData: any
    - merchantZapierUrl: string
    
**Return Type:** Promise<void>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Zapier Service Contract Definition
    
**Requirement Ids:**
    
    - REQ-TCE-006
    
**Purpose:** To establish a clear contract for Zapier integration logic, facilitating dependency injection and testability.  
**Logic Description:** This interface will declare methods like processIncomingGoogleAdsLead(payload: ReceiveGoogleAdsLeadDto): Promise<void>; and triggerZapForLeadManagement(leadData: any, merchantZapierUrl: string): Promise<void>.  
**Documentation:**
    
    - **Summary:** Interface for ZapierService, specifying methods to handle Zapier interactions.
    
**Namespace:** AdManager.ThirdPartyConnectivity.Zapier.V1.Interfaces  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/third-party-connectivity/zapier/v1/config/zapier.config.ts  
**Description:** Handles configuration loading and validation for the Zapier integration module, possibly using NestJS ConfigModule.  
**Template:** TypeScript Configuration File  
**Dependancy Level:** 1  
**Name:** zapier.config  
**Type:** Configuration  
**Relative Path:** modules/third-party-connectivity/zapier/v1/config/zapier.config.ts  
**Repository Id:** REPO-ZAPIER-017  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** webhookSecret  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - configService: ConfigService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** getWebhookSecret  
**Parameters:**
    
    
**Return Type:** string  
**Attributes:** public  
    
**Implemented Features:**
    
    - Secure Configuration Management for Zapier
    
**Requirement Ids:**
    
    - REQ-TCE-006
    
**Purpose:** To provide a typed and validated way to access Zapier-related configurations like webhook secrets.  
**Logic Description:** Uses NestJS ConfigService to retrieve environment variables or configuration files. Defines properties like 'webhookSecret'. Implements validation for required configurations.  
**Documentation:**
    
    - **Summary:** Manages and provides access to Zapier integration specific configurations.
    
**Namespace:** AdManager.ThirdPartyConnectivity.Zapier.V1.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/third-party-connectivity/zapier/v1/dto/receive-google-ads-lead.dto.ts  
**Description:** Data Transfer Object defining the expected payload structure for incoming webhooks from Zapier carrying Google Ads lead data.  
**Template:** TypeScript DTO File  
**Dependancy Level:** 1  
**Name:** ReceiveGoogleAdsLeadDto  
**Type:** DTO  
**Relative Path:** modules/third-party-connectivity/zapier/v1/dto/receive-google-ads-lead.dto.ts  
**Repository Id:** REPO-ZAPIER-017  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** leadId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** campaignId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** adGroupId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** adId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** formData  
**Type:** Record<string, any>  
**Attributes:** public|readonly  
    - **Name:** timestamp  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Google Ads Lead Data Structure Definition for Zapier Webhooks
    
**Requirement Ids:**
    
    - REQ-TCE-006
    
**Purpose:** To ensure type safety and validation for incoming Google Ads lead data from Zapier.  
**Logic Description:** Defines properties like leadId, campaignId, formData (object), timestamp. Uses class-validator decorators for validation (e.g., @IsString(), @IsNotEmpty(), @IsObject()).  
**Documentation:**
    
    - **Summary:** Defines the structure and validation rules for Google Ads lead data received from Zapier.
    
**Namespace:** AdManager.ThirdPartyConnectivity.Zapier.V1.Dto  
**Metadata:**
    
    - **Category:** DataModel
    
- **Path:** src/modules/third-party-connectivity/zapier/v1/dto/receive-google-ads-performance.dto.ts  
**Description:** Data Transfer Object defining the expected payload structure for incoming webhooks from Zapier carrying Google Ads performance data.  
**Template:** TypeScript DTO File  
**Dependancy Level:** 1  
**Name:** ReceiveGoogleAdsPerformanceDto  
**Type:** DTO  
**Relative Path:** modules/third-party-connectivity/zapier/v1/dto/receive-google-ads-performance.dto.ts  
**Repository Id:** REPO-ZAPIER-017  
**Pattern Ids:**
    
    - DataTransferObject
    
**Members:**
    
    - **Name:** campaignId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** date  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** impressions  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** clicks  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** cost  
**Type:** number  
**Attributes:** public|readonly  
    - **Name:** conversions  
**Type:** number  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Google Ads Performance Data Structure Definition for Zapier Webhooks
    
**Requirement Ids:**
    
    - REQ-TCE-006
    
**Purpose:** To ensure type safety and validation for incoming Google Ads performance data from Zapier.  
**Logic Description:** Defines properties like campaignId, date, impressions, clicks, cost, conversions. Uses class-validator decorators for validation (e.g., @IsString(), @IsDateString(), @IsNumber()).  
**Documentation:**
    
    - **Summary:** Defines the structure and validation rules for Google Ads performance data received from Zapier.
    
**Namespace:** AdManager.ThirdPartyConnectivity.Zapier.V1.Dto  
**Metadata:**
    
    - **Category:** DataModel
    
- **Path:** src/modules/third-party-connectivity/zapier/v1/guards/zapier-webhook.guard.ts  
**Description:** A NestJS guard to secure incoming webhook endpoints from Zapier, typically by validating a secret token.  
**Template:** TypeScript NestJS Guard File  
**Dependancy Level:** 2  
**Name:** ZapierWebhookGuard  
**Type:** Guard  
**Relative Path:** modules/third-party-connectivity/zapier/v1/guards/zapier-webhook.guard.ts  
**Repository Id:** REPO-ZAPIER-017  
**Pattern Ids:**
    
    - Guard
    
**Members:**
    
    - **Name:** configService  
**Type:** ConfigService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - configService: ConfigService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** canActivate  
**Parameters:**
    
    - context: ExecutionContext
    
**Return Type:** boolean | Promise<boolean> | Observable<boolean>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Zapier Webhook Authentication/Verification
    
**Requirement Ids:**
    
    - REQ-TCE-006
    
**Purpose:** To protect Zapier webhook endpoints from unauthorized access by verifying a shared secret or signature.  
**Logic Description:** Implements the CanActivate interface. Retrieves the expected secret from ZapierConfig (via ConfigService). Compares it with a secret provided in the request headers (e.g., 'X-Zapier-Signature' or a custom header). Returns true if valid, false or throws UnauthorizedException otherwise.  
**Documentation:**
    
    - **Summary:** Authenticates incoming requests to Zapier webhook endpoints using a shared secret.
    
**Namespace:** AdManager.ThirdPartyConnectivity.Zapier.V1.Guards  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/third-party-connectivity/zapier/v1/zapier.service.ts  
**Description:** Handles the business logic for Zapier integrations, including processing incoming webhooks and making outbound calls to trigger Zaps.  
**Template:** TypeScript NestJS Service File  
**Dependancy Level:** 2  
**Name:** ZapierService  
**Type:** Service  
**Relative Path:** modules/third-party-connectivity/zapier/v1/zapier.service.ts  
**Repository Id:** REPO-ZAPIER-017  
**Pattern Ids:**
    
    - ServiceLayer
    
**Members:**
    
    - **Name:** httpService  
**Type:** HttpService  
**Attributes:** private|readonly  
    - **Name:** logger  
**Type:** Logger  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - httpService: HttpService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** processIncomingGoogleAdsLead  
**Parameters:**
    
    - payload: ReceiveGoogleAdsLeadDto
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** processIncomingGoogleAdsPerformance  
**Parameters:**
    
    - payload: ReceiveGoogleAdsPerformanceDto
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** triggerZapForLeadManagement  
**Parameters:**
    
    - leadData: any
    - merchantZapierUrl: string
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** triggerZapForPerformanceTracking  
**Parameters:**
    
    - performanceData: any
    - merchantZapierUrl: string
    
**Return Type:** Promise<void>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Processing of incoming Google Ads leads from Zapier
    - Processing of incoming Google Ads performance data from Zapier
    - Triggering Zapier Zaps for lead management automation
    - Triggering Zapier Zaps for campaign performance tracking automation
    
**Requirement Ids:**
    
    - REQ-TCE-006
    
**Purpose:** To encapsulate all Zapier integration logic, serving as the core for webhook processing and outbound Zap triggering.  
**Logic Description:** Implements IZapierService. Methods for processing incoming webhooks will validate data and then potentially call other Ad Manager domain services (e.g., LeadService, AnalyticsService) to handle the data. Methods for triggering Zaps will use HttpService to make POST requests to merchant-configured Zapier Webhook URLs. Includes logging for all operations.  
**Documentation:**
    
    - **Summary:** Core service for handling all Zapier integration logic, including receiving webhooks and triggering Zaps.
    
**Namespace:** AdManager.ThirdPartyConnectivity.Zapier.V1  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/third-party-connectivity/zapier/v1/zapier.controller.ts  
**Description:** Defines RESTful API endpoints for receiving webhooks from Zapier, specifically for Google Ads data.  
**Template:** TypeScript NestJS Controller File  
**Dependancy Level:** 3  
**Name:** ZapierController  
**Type:** Controller  
**Relative Path:** modules/third-party-connectivity/zapier/v1/zapier.controller.ts  
**Repository Id:** REPO-ZAPIER-017  
**Pattern Ids:**
    
    - Controller
    
**Members:**
    
    - **Name:** zapierService  
**Type:** ZapierService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - zapierService: ZapierService
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** handleGoogleAdsLeadWebhook  
**Parameters:**
    
    - @Body() payload: ReceiveGoogleAdsLeadDto
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** handleGoogleAdsPerformanceWebhook  
**Parameters:**
    
    - @Body() payload: ReceiveGoogleAdsPerformanceDto
    
**Return Type:** Promise<void>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Webhook endpoint for Google Ads leads from Zapier
    - Webhook endpoint for Google Ads performance data from Zapier
    
**Requirement Ids:**
    
    - REQ-TCE-006
    
**Purpose:** To expose secure endpoints for Zapier to send Google Ads related data to the Ad Manager Platform.  
**Logic Description:** Uses @Controller('zapier/v1/webhooks') decorator. Defines POST endpoints like '/google-ads/leads' and '/google-ads/performance'. Applies ZapierWebhookGuard to these endpoints. Delegates processing to ZapierService. Uses DTOs for request body validation.  
**Documentation:**
    
    - **Summary:** Controller exposing webhook endpoints for receiving data from Zapier. Input data is validated via DTOs.
    
**Namespace:** AdManager.ThirdPartyConnectivity.Zapier.V1  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/third-party-connectivity/zapier/v1/zapier.module.ts  
**Description:** NestJS module that encapsulates all components related to Zapier integration, including controllers, services, and configuration.  
**Template:** TypeScript NestJS Module File  
**Dependancy Level:** 4  
**Name:** ZapierModule  
**Type:** Module  
**Relative Path:** modules/third-party-connectivity/zapier/v1/zapier.module.ts  
**Repository Id:** REPO-ZAPIER-017  
**Pattern Ids:**
    
    - Module
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Zapier Integration Module Setup
    
**Requirement Ids:**
    
    - REQ-TCE-006
    
**Purpose:** To organize and provide the Zapier integration functionality as a cohesive module within the Ad Manager application.  
**Logic Description:** Uses @Module decorator. Imports HttpModule for making outbound calls. Declares ZapierController. Provides ZapierService and ZapierConfig. May import ConfigModule if zapier.config.ts depends on it.  
**Documentation:**
    
    - **Summary:** The Zapier V1 module, bundling controllers, services, and configuration for Zapier integration.
    
**Namespace:** AdManager.ThirdPartyConnectivity.Zapier.V1  
**Metadata:**
    
    - **Category:** Application
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableZapierGoogleAdsLeadWebhook
  - enableZapierGoogleAdsPerformanceWebhook
  - enableAdManagerTriggeringOfZapierZaps
  
- **Database Configs:**
  
  


---

