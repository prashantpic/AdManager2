# Specification

# 1. Data Transformation Analysis

- **System Overview:**
  
  - **Analysis Date:** 2025-06-18
  - **Technology Stack:**
    
    - Node.js (NestJS Framework)
    - TypeScript
    - Amazon SQS
    - Amazon SNS
    - Amazon API Gateway
    - Amazon RDS (PostgreSQL)
    - Amazon DynamoDB
    - Amazon EKS/ECS
    - AWS Lambda
    - React
    - Next.js
    - Amazon ElastiCache
    - AWS WAF
    - AWS KMS
    - AWS Secrets Manager
    
  - **Service Interfaces:**
    
    - AdManagerMerchantAPI (RESTful/GraphQL)
    - AdManagerAdminAPI (RESTful/GraphQL)
    - InternalServiceAPI (RESTful/gRPC/Events)
    - Ad Network APIs (Google, Instagram, TikTok, Snapchat)
    - [PlatformName] Core Platform APIs (Product, Auth, Order, Customer)
    
  - **Data Models:**
    
    - Campaign
    - AdNetwork
    - AdSet
    - AdCreative
    - Ad
    - ProductCatalog
    - Product
    - Promotion
    - DiscountCode
    - ABTest
    - Audience
    - PerformanceMetric
    - UserRole
    - AdManagerUser
    - LandingPage
    - DailyCampaignPerformanceSummary
    
  
- **Data Mapping Strategy:**
  
  - **Essential Mappings:**
    
    - **Mapping Id:** EM001  
**Source:** [PlatformName] Core Product Data  
**Target:** Ad Manager ProductCatalog & Product Entities  
**Transformation:** direct  
**Configuration:**
    
    
**Mapping Technique:** Object-to-object mapping, field-level  
**Justification:** REQ-CPSI-001, REQ-PC-002: Core product data is the base for ad catalogs. Overrides are handled separately (REQ-PC-003).  
**Complexity:** medium  
    - **Mapping Id:** EM002  
**Source:** Ad Manager Campaign/AdSet/Ad/Creative Entities  
**Target:** Ad Network API Specific Payloads (e.g., Google Ads API Campaign Object)  
**Transformation:** adapter  
**Configuration:**
    
    
**Mapping Technique:** Object-to-object with adaptation to network-specific schemas.  
**Justification:** REQ-CMO-001, REQ-03-001, REQ-TCE-001: To create and manage campaigns on external ad networks.  
**Complexity:** complex  
    - **Mapping Id:** EM003  
**Source:** Ad Network API Performance Reports  
**Target:** Ad Manager PerformanceMetric Entity & DailyCampaignPerformanceSummary  
**Transformation:** aggregation  
**Configuration:**
    
    - **Aggregate Fields:**
      
      - impressions
      - clicks
      - spend
      - conversions
      
    - **Group By:**
      
      - date
      - campaignId
      - adSetId
      - adId
      - adNetworkId
      - merchantId
      
    - **Functions:**
      
      - SUM
      - SUM
      - SUM
      - SUM
      
    - **Calculated Fields:**
      
      - ROAS
      - CPA
      
    
**Mapping Technique:** Data normalization, aggregation, and calculation.  
**Justification:** REQ-03-002, REQ-CMO-007, REQ-ARP-001, REQ-ARP-007: To consolidate and report on ad performance.  
**Complexity:** complex  
    - **Mapping Id:** EM004  
**Source:** Ad Manager ProductCatalog Entity  
**Target:** Ad Network Specific Product Feed Format (e.g., XML, CSV)  
**Transformation:** formatting  
**Configuration:**
    
    - **Output Format:** network-dependent (XML, CSV, TSV)
    - **Required Fields Per Network:** dynamic based on AdNetwork.specifications
    
**Mapping Technique:** Data serialization to specific file formats and structures.  
**Justification:** REQ-PC-006, REQ-03-003, REQ-TCE-001: To submit product catalogs to ad networks.  
**Complexity:** medium  
    - **Mapping Id:** EM005  
**Source:** [PlatformName] Core Order Data  
**Target:** Ad Manager Analytics Engine Input (for ROAS/CPA)  
**Transformation:** direct  
**Configuration:**
    
    
**Mapping Technique:** Field extraction and association with ad campaign data.  
**Justification:** REQ-CPSI-007, REQ-ARP-001: To calculate sales-driven performance metrics.  
**Complexity:** medium  
    - **Mapping Id:** EM006  
**Source:** Ad Manager UI Input DTOs (e.g., CampaignCreationDTO)  
**Target:** Backend Service Entities (e.g., Campaign)  
**Transformation:** direct  
**Configuration:**
    
    
**Mapping Technique:** Object-to-object mapping.  
**Justification:** Standard API request processing for all create/update operations (e.g. REQ-CMO-001).  
**Complexity:** simple  
    - **Mapping Id:** EM007  
**Source:** Backend Service Entities (e.g., Campaign)  
**Target:** Ad Manager UI Response DTOs (e.g., CampaignViewDTO)  
**Transformation:** direct  
**Configuration:**
    
    
**Mapping Technique:** Object-to-object mapping.  
**Justification:** Standard API response formatting for all read operations.  
**Complexity:** simple  
    
  - **Object To Object Mappings:**
    
    - **Source Object:** [PlatformName]CoreProduct  
**Target Object:** AdManagerProduct (base fields)  
**Field Mappings:**
    
    - **Source Field:** coreProductId  
**Target Field:** coreProductId  
**Transformation:** direct  
**Data Type Conversion:** UUID to UUID  
    - **Source Field:** coreTitle  
**Target Field:** Product.name (if not overridden)  
**Transformation:** direct  
**Data Type Conversion:** String to String  
    - **Source Field:** coreDescription  
**Target Field:** Product.description (if not overridden)  
**Transformation:** direct  
**Data Type Conversion:** String to String  
    - **Source Field:** corePrice  
**Target Field:** Product.price (if not overridden)  
**Transformation:** direct  
**Data Type Conversion:** Decimal to Decimal  
    - **Source Field:** coreImageUrl  
**Target Field:** Product.imageUrl (if not overridden)  
**Transformation:** direct  
**Data Type Conversion:** String to String  
    
    - **Source Object:** AdNetworkPerformanceReportRow  
**Target Object:** AdManagerPerformanceMetric  
**Field Mappings:**
    
    - **Source Field:** networkImpressions  
**Target Field:** impressions  
**Transformation:** direct  
**Data Type Conversion:** Integer to Integer  
    - **Source Field:** networkClicks  
**Target Field:** clicks  
**Transformation:** direct  
**Data Type Conversion:** Integer to Integer  
    - **Source Field:** networkSpend  
**Target Field:** spend  
**Transformation:** direct  
**Data Type Conversion:** Decimal to Decimal  
    - **Source Field:** networkConversions  
**Target Field:** conversions  
**Transformation:** direct  
**Data Type Conversion:** Integer to Integer  
    - **Source Field:** reportDate  
**Target Field:** date  
**Transformation:** direct  
**Data Type Conversion:** String/Timestamp to Date  
    
    
  - **Data Type Conversions:**
    
    - **From:** String (ISO 8601 Date)  
**To:** DATETIME/DATETIMEOFFSET  
**Conversion Method:** Standard date parsing libraries  
**Validation Required:** True  
    - **From:** String (Number)  
**To:** DECIMAL/INTEGER  
**Conversion Method:** Standard numeric parsing  
**Validation Required:** True  
    - **From:** Ad Network Specific Enum (e.g., Status)  
**To:** Ad Manager Internal Enum (e.g., CampaignStatus)  
**Conversion Method:** Mapping table/logic  
**Validation Required:** True  
    
  - **Bidirectional Mappings:**
    
    - **Entity:** Campaign  
**Forward Mapping:** EM002 (AdManagerCampaignToAdNetworkCampaign)  
**Reverse Mapping:** AdNetworkCampaignToAdManagerCampaign (for fetching existing)  
**Consistency Strategy:** Ad Manager as source of truth, periodic sync from network for status.  
    - **Entity:** AdSet  
**Forward Mapping:** AdManagerAdSetToAdNetworkAdSet  
**Reverse Mapping:** AdNetworkAdSetToAdManagerAdSet  
**Consistency Strategy:** Ad Manager as source of truth, periodic sync.  
    - **Entity:** AdCreative  
**Forward Mapping:** AdManagerAdCreativeToAdNetworkCreative  
**Reverse Mapping:** AdNetworkCreativeToAdManagerCreative  
**Consistency Strategy:** Ad Manager as source of truth, periodic sync.  
    
  
- **Schema Validation Requirements:**
  
  - **Field Level Validations:**
    
    - **Field:** Campaign.name  
**Rules:**
    
    - required
    - maxLength:255
    
**Priority:** critical  
**Error Message:** Campaign name is required and must be less than 255 characters.  
    - **Field:** Campaign.budget  
**Rules:**
    
    - required
    - positiveDecimal
    
**Priority:** critical  
**Error Message:** Campaign budget is required and must be a positive value.  
    - **Field:** Campaign.startDate  
**Rules:**
    
    - required
    - validDate
    
**Priority:** critical  
**Error Message:** Campaign start date is required and must be a valid date.  
    - **Field:** Campaign.endDate  
**Rules:**
    
    - required
    - validDate
    
**Priority:** critical  
**Error Message:** Campaign end date is required and must be a valid date.  
    - **Field:** AdCreative.contentUrl  
**Rules:**
    
    - required
    - validUrl
    - maxLength:2048
    
**Priority:** critical  
**Error Message:** Ad creative content URL is required, must be a valid URL, and less than 2048 characters.  
    - **Field:** DiscountCode.codePattern  
**Rules:**
    
    - required
    - maxLength:50
    - uniquePerMerchant
    
**Priority:** critical  
**Error Message:** Discount code pattern is required, max 50 chars, and unique for the merchant.  
    - **Field:** PerformanceMetric.spend  
**Rules:**
    
    - nonNegativeDecimal
    
**Priority:** high  
**Error Message:** Spend must be a non-negative value.  
    - **Field:** Ad.destinationUrl  
**Rules:**
    
    - required
    - validUrl
    - maxLength:2048
    
**Priority:** critical  
**Error Message:** Ad destination URL is required and must be a valid URL.  
    
  - **Cross Field Validations:**
    
    - **Validation Id:** CV001  
**Fields:**
    
    - Campaign.startDate
    - Campaign.endDate
    
**Rule:** endDate > startDate  
**Condition:** always  
**Error Handling:** Reject request, return specific error message.  
    - **Validation Id:** CV002  
**Fields:**
    
    - AdSet.budgetType
    - AdSet.budgetAmount
    
**Rule:** budgetAmount > 0  
**Condition:** always  
**Error Handling:** Reject request, return specific error message.  
    
  - **Business Rule Validations:**
    
    - **Rule Id:** BRV001  
**Description:** Adherence to ad network creative specifications (e.g., image dimensions, file size, text length).  
**Fields:**
    
    - AdCreative.contentUrl
    - AdCreative.adCopy
    - AdCreative.headline
    - AdCreative.type
    
**Logic:** Fetch AdNetwork.specifications and validate creative against them.  
**Priority:** critical  
    - **Rule Id:** BRV002  
**Description:** Product catalog feed validation against target ad network specifications.  
**Fields:**
    
    - ProductCatalog content (all product attributes in feed)
    
**Logic:** Validate generated feed structure and content against AdNetwork.specifications for feeds.  
**Priority:** critical  
    - **Rule Id:** BRV003  
**Description:** Discount code expiration date must be in the future or on/after start date.  
**Fields:**
    
    - DiscountCode.promotionId (-> Promotion.startDate, Promotion.endDate)
    
**Logic:** Verify Promotion.endDate associated with DiscountCode is valid relative to Promotion.startDate and current date.  
**Priority:** high  
    - **Rule Id:** BRV004  
**Description:** BOGO - eligible products and conditions for free item must be valid.  
**Fields:**
    
    - Promotion (BOGO type) related product/collection IDs
    
**Logic:** Ensure specified products/collections for BOGO exist and rules are consistent.  
**Priority:** high  
    - **Rule Id:** BRV005  
**Description:** Affiliate conversion attribution meets criteria (last click, cookie window, non-fraudulent).  
**Fields:**
    
    - ConversionEventData
    - AffiliateTrackingCookie
    
**Logic:** Apply attribution logic based on REQ-AMP-004.  
**Priority:** high  
    
  - **Conditional Validations:**
    
    - **Condition:** Campaign.status == 'Archived'  
**Applicable Fields:**
    
    - Campaign.budget
    - Campaign.startDate
    - Campaign.endDate
    
**Validation Rules:**
    
    - noFurtherModificationAllowed
    
    
  - **Validation Groups:**
    
    - **Group Name:** CampaignCreationInput  
**Validations:**
    
    - Campaign.name validation
    - Campaign.budget validation
    - CV001 (date validation)
    
**Execution Order:** 1  
**Stop On First Failure:** True  
    - **Group Name:** AdCreativeUpload  
**Validations:**
    
    - AdCreative.contentUrl validation
    - BRV001 (network specs)
    
**Execution Order:** 1  
**Stop On First Failure:** True  
    
  
- **Transformation Pattern Evaluation:**
  
  - **Selected Patterns:**
    
    - **Pattern:** adapter  
**Use Case:** AdNetworkIntegrationService: Converting Ad Manager canonical campaign/ad/creative models to various ad network API-specific formats and vice-versa.  
**Implementation:** Strategy pattern with specific adapters for each ad network (GoogleAdapter, InstagramAdapter, etc.).  
**Justification:** REQ-03-001, REQ-TCE-001. Each network has unique API schemas.  
    - **Pattern:** converter  
**Use Case:** Converting data types between systems, e.g., string dates from APIs to DATETIME objects, numeric strings to decimals.  
**Implementation:** Shared utility functions within the Cross-Cutting Concerns Layer or specific services.  
**Justification:** Common need in integrations and API request/response handling.  
    - **Pattern:** pipeline  
**Use Case:** Product Catalog Feed Generation: Fetch base product data -> Apply Ad Manager overrides -> Transform to network-specific format -> Validate feed -> Submit.  
**Implementation:** Sequential processing steps orchestrated by ProductCatalogService, potentially involving SQS for stages.  
**Justification:** REQ-PC-006, REQ-PC-007. Multi-step process.  
    - **Pattern:** pipeline  
**Use Case:** Ad Performance Data Ingestion: Fetch from Ad Network API -> Normalize data -> Store raw metrics in DynamoDB -> Aggregate into summaries (e.g., DailyCampaignPerformanceSummary).  
**Implementation:** AdNetworkIntegrationService fetches, AnalyticsReportingService processes and aggregates (possibly via SQS/Lambda triggers from raw data storage).  
**Justification:** REQ-03-002, REQ-ARP-001, REQ-ARP-007.  
    
  - **Pipeline Processing:**
    
    - **Required:** True
    - **Stages:**
      
      - **Stage:** FetchProductData  
**Transformation:** Extract from [PlatformName] Core API (REQ-CPSI-001)  
**Dependencies:**
    
    
      - **Stage:** ApplyOverrides  
**Transformation:** Merge with Ad Manager Product Overrides (REQ-PC-003)  
**Dependencies:**
    
    - FetchProductData
    
      - **Stage:** FormatFeed  
**Transformation:** Convert to Ad Network specific XML/CSV (REQ-PC-006)  
**Dependencies:**
    
    - ApplyOverrides
    
      - **Stage:** ValidateFeed  
**Transformation:** Check against Ad Network specifications (REQ-PC-007)  
**Dependencies:**
    
    - FormatFeed
    
      - **Stage:** SubmitFeed  
**Transformation:** Send to Ad Network API (REQ-03-003)  
**Dependencies:**
    
    - ValidateFeed
    
      
    - **Parallelization:** True
    
  - **Processing Mode:**
    
    - **Real Time:**
      
      - **Required:** True
      - **Scenarios:**
        
        - Campaign status updates to ad networks (REQ-CMO-002)
        - Potentially some ad performance metrics if APIs allow near real-time fetching (REQ-ARP-005).
        
      - **Latency Requirements:** < Z ms for real-time streams (REQ-ARP-005). Specific Z to be defined.
      
    - **Batch:**
      
      - **Required:** True
      - **Batch Size:** 1000
      - **Frequency:** Hourly/Daily for performance data (REQ-ARP-005), On-demand/Scheduled for catalog sync (REQ-CPSI-001) and bulk imports (REQ-PC-004).
      - **Scenarios:**
        
        - Ad performance data ingestion
        - Product catalog synchronization
        - Bulk product import
        - Daily performance summary aggregation.
        
      
    - **Streaming:**
      
      - **Required:** True
      - **Streaming Framework:** AWS Kinesis (if N impressions/second in REQ-ARP-005 is very high) or Lambda processing SQS messages.
      - **Windowing Strategy:** Tumbling windows for near real-time aggregation if Kinesis is used.
      - **Scenarios:**
        
        - High-volume ad impression/click stream processing (REQ-ARP-005).
        
      
    
  - **Canonical Data Model:**
    
    - **Applicable:** True
    - **Scope:**
      
      - Campaign
      - AdSet
      - Ad
      - AdCreative
      - Product
      - PerformanceMetric
      - Promotion
      
    - **Benefits:**
      
      - Decouples services from specific external API formats.
      - Simplifies internal data handling and logic.
      - Provides a consistent model for analytics and reporting.
      
    
  
- **Version Handling Strategy:**
  
  - **Schema Evolution:**
    
    - **Strategy:** Additive changes for non-breaking updates. New API versions for breaking changes for internal Ad Manager APIs. Ad Network APIs are external and changes must be adapted to.
    - **Versioning Scheme:** Semantic Versioning (X.Y.Z) for internal APIs. URL path versioning (e.g., /v1/campaigns).
    - **Compatibility:**
      
      - **Backward:** True
      - **Forward:** False
      - **Reasoning:** New optional fields should not break existing clients. Breaking changes require clients to update. For Ad Network APIs, Ad Manager is the client and must adapt.
      
    
  - **Transformation Versioning:**
    
    - **Mechanism:** Version transformation logic alongside API/service versions. Use configuration for mappings where possible.
    - **Version Identification:** Internal code versioning (Git tags/branches).
    - **Migration Strategy:** Deploy new transformation logic with new service version. For ad network API changes, update adapter and deploy.
    
  - **Data Model Changes:**
    
    - **Migration Path:** Database schema migrations (e.g., using Flyway/Liquibase equivalent for PostgreSQL, scripted updates for DynamoDB). Data transformation scripts for existing data.
    - **Rollback Strategy:** Restore from backup for schema changes if catastrophic. For data, have rollback scripts or manual correction processes.
    - **Validation Strategy:** Test migrations in staging. Validate data integrity post-migration.
    
  - **Schema Registry:**
    
    - **Required:** False
    - **Technology:** Not initially required for essential config. Potentially AWS Glue Schema Registry for event schemas if EDA complexity grows.
    - **Governance:** API contracts (OpenAPI for REST) managed via NestJS Swagger. Shared TypeScript types for internal consistency.
    
  
- **Performance Optimization:**
  
  - **Critical Requirements:**
    
    - **Operation:** Ad Performance Data Ingestion & Aggregation  
**Max Latency:** Y seconds/minutes for batch, Z ms for real-time (REQ-ARP-005). Specific Y, Z TBD.  
**Throughput Target:** N impressions/second (REQ-ARP-005). Specific N TBD.  
**Justification:** Core analytics functionality.  
    - **Operation:** Product Catalog Synchronization ([PlatformName] to Ad Manager)  
**Max Latency:** To be defined based on catalog size and update frequency.  
**Throughput Target:** Handle Y million active product listings (REQ-PC-010).  
**Justification:** Ensures ad catalogs are up-to-date.  
    - **Operation:** Product Catalog Feed Generation  
**Max Latency:** To be defined based on catalog size.  
**Throughput Target:** Efficient generation for large catalogs.  
**Justification:** Timely submission to ad networks (REQ-PC-010).  
    
  - **Parallelization Opportunities:**
    
    - **Transformation:** Ad Network Performance Data Fetching  
**Parallelization Strategy:** Fetch data from multiple ad networks concurrently. Process multiple campaigns/ad sets in parallel.  
**Expected Gain:** Reduced overall data ingestion time.  
    - **Transformation:** Bulk Product Import (REQ-PC-004)  
**Parallelization Strategy:** Process chunks of the import file in parallel.  
**Expected Gain:** Faster import for large files.  
    
  - **Caching Strategies:**
    
    - **Cache Type:** In-memory (e.g., Redis via ElastiCache)  
**Cache Scope:** Frequently accessed, rarely changing configuration data.  
**Eviction Policy:** LRU (Least Recently Used) or TTL (Time To Live).  
**Applicable Transformations:**
    
    - AdNetwork.specifications (used in EM002, EM004, BRV001, BRV002)
    - UserRole.permissions (used in authorization checks)
    
    
  - **Memory Optimization:**
    
    - **Techniques:**
      
      - Streaming for large file processing (e.g., product feeds, bulk imports).
      - Efficient data structures.
      - Selective loading of data (only required fields).
      
    - **Thresholds:** To be defined based on service resource limits.
    - **Monitoring Required:** True
    
  - **Lazy Evaluation:**
    
    - **Applicable:** True
    - **Scenarios:**
      
      - Generating complex report sections only when requested by the user.
      - Loading detailed product override data only when a specific product is being edited for an ad catalog.
      
    - **Implementation:** On-demand data fetching and processing logic within services.
    
  - **Bulk Processing:**
    
    - **Required:** True
    - **Batch Sizes:**
      
      - **Optimal:** 1000
      - **Maximum:** 10000
      
    - **Parallelism:** 4
    - **Scenarios:**
      
      - Product data synchronization (REQ-CPSI-001)
      - Bulk product import (REQ-PC-004)
      - Performance data ingestion from ad networks (REQ-ARP-005)
      
    
  
- **Error Handling And Recovery:**
  
  - **Error Handling Strategies:**
    
    - **Error Type:** Ad Network API Error (e.g., authentication, rate limit, invalid parameter)  
**Strategy:** Catch specific error codes, log details, retry transient errors, surface actionable error to merchant if non-transient.  
**Fallback Action:** Mark campaign/ad sync as 'failed' with error details.  
**Escalation Path:**
    
    - Merchant notification
    - Platform Admin alert for persistent critical errors
    
    - **Error Type:** Data Validation Failure (e.g., invalid input from UI, non-compliant feed data)  
**Strategy:** Reject operation, return specific error messages to the user/system.  
**Fallback Action:** Prevent operation (e.g., campaign creation, feed submission).  
**Escalation Path:**
    
    - Merchant notification
    
    - **Error Type:** Internal Processing Error (e.g., unhandled exception in transformation logic)  
**Strategy:** Log detailed error, return generic error to client, DLQ for async processes.  
**Fallback Action:** Fail operation gracefully.  
**Escalation Path:**
    
    - Platform Admin alert
    - Developer investigation
    
    
  - **Logging Requirements:**
    
    - **Log Level:** error
    - **Included Data:**
      
      - timestamp
      - correlationId
      - serviceName
      - operationName
      - errorMessage
      - stackTrace (for errors)
      - inputPayload (anonymized if PII)
      
    - **Retention Period:** 90 days active, then archive (REQ-POA-002, REQ-POA-012)
    - **Alerting:** True
    
  - **Partial Success Handling:**
    
    - **Strategy:** For bulk operations (e.g., product import, multi-campaign update), process valid items and report errors for invalid items.
    - **Reporting Mechanism:** Summary report of successful and failed items with reasons.
    - **Recovery Actions:**
      
      - Merchant can correct and re-submit failed items.
      
    
  - **Circuit Breaking:**
    
    - **Dependency:** Ad Network APIs (each network independently)  
**Threshold:** e.g., 5 consecutive failures or 50% failure rate in 1 minute  
**Timeout:** e.g., 30 seconds cooldown  
**Fallback Strategy:** Log error, temporarily halt operations for that network, notify admin.  
    - **Dependency:** [PlatformName] Core Platform APIs  
**Threshold:** e.g., 3 consecutive failures or 60% failure rate in 1 minute  
**Timeout:** e.g., 60 seconds cooldown  
**Fallback Strategy:** Log error, degrade Ad Manager functionality gracefully if possible, notify admin.  
    
  - **Retry Strategies:**
    
    - **Operation:** Ad Network API Call  
**Max Retries:** 3  
**Backoff Strategy:** exponential  
**Retry Conditions:**
    
    - HTTP 5xx errors
    - Rate limit errors (with longer backoff)
    - Network timeouts
    
    - **Operation:** [PlatformName] Core API Call  
**Max Retries:** 3  
**Backoff Strategy:** exponential  
**Retry Conditions:**
    
    - HTTP 5xx errors
    - Network timeouts
    
    - **Operation:** Asynchronous Event Processing (SQS)  
**Max Retries:** Configured via SQS redrive policy (e.g., 3-5 attempts)  
**Backoff Strategy:** SQS configured delay/backoff  
**Retry Conditions:**
    
    - Any unhandled exception during message processing
    
    
  - **Error Notifications:**
    
    - **Condition:** Circuit breaker tripped for critical dependency (Ad Network, Core Platform).  
**Recipients:**
    
    - PlatformOperationsTeam
    
**Severity:** critical  
**Channel:** PagerDuty/Email  
    - **Condition:** DLQ message count > 0 for critical queues.  
**Recipients:**
    
    - PlatformOperationsTeam
    - RelevantDevelopmentTeam
    
**Severity:** high  
**Channel:** Email/Slack  
    - **Condition:** Persistent high rate of transformation/validation errors for a merchant.  
**Recipients:**
    
    - MerchantSupportTeam
    
**Severity:** medium  
**Channel:** InternalHelpdesk  
    
  
- **Project Specific Transformations:**
  
  ### .1. CoreProductToAdManagerProductCatalogItem
  Transforms product data from [PlatformName] core e-commerce platform into the Ad Manager's product catalog structure, applying any advertising-specific overrides defined by the merchant.

  #### .1.1. Transformation Id
  PST001

  #### .1.4. Source
  
  - **Service:** CorePlatformIntegrationService
  - **Model:** [PlatformName]ProductDTO
  - **Fields:**
    
    - coreProductId
    - coreTitle
    - coreDescription
    - corePrice
    - coreImageUrl
    - stockLevels
    - categories
    
  
  #### .1.5. Target
  
  - **Service:** ProductCatalogService
  - **Model:** AdManagerProduct (within a ProductCatalog)
  - **Fields:**
    
    - coreProductId
    - adTitle
    - adDescription
    - adImageUrl
    - price
    - stockStatus
    - targetCategories
    - isActive
    
  
  #### .1.6. Transformation
  
  - **Type:** merging
  - **Logic:** 1. Fetch base product data from [PlatformName]. 2. Fetch Ad Manager specific overrides for the product (REQ-PC-003). 3. Merge base data with overrides, with overrides taking precedence for ad-specific fields. 4. Map to AdManagerProduct entity.
  - **Configuration:**
    
    - **Override Priority:** AdManagerOverrides
    
  
  #### .1.7. Frequency
  batch

  #### .1.8. Criticality
  critical

  #### .1.9. Dependencies
  
  - REQ-CPSI-001
  - REQ-PC-003
  
  #### .1.10. Validation
  
  - **Pre Transformation:**
    
    - Ensure [PlatformName] product data is available.
    
  - **Post Transformation:**
    
    - Verify all required fields for AdManagerProduct are populated.
    
  
  #### .1.11. Performance
  
  - **Expected Volume:** Up to Y million products (REQ-PC-010)
  - **Latency Requirement:** Efficient for bulk sync and individual updates.
  - **Optimization Strategy:** Batch processing, selective updates.
  
  ### .2. AdManagerCampaignToAdNetworkCampaign
  Transforms an Ad Manager campaign entity into the specific request payload format required by a target ad network's API (e.g., Google Ads, Instagram API).

  #### .2.1. Transformation Id
  PST002

  #### .2.4. Source
  
  - **Service:** CampaignManagementService
  - **Model:** AdManagerCampaign (includes AdSets, Ads, Creatives)
  - **Fields:**
    
    - name
    - budget
    - startDate
    - endDate
    - status
    - adNetworkId
    - targetingCriteria
    - biddingStrategy
    - creativeContentUrl
    - adCopy
    - headline
    - destinationUrl
    
  
  #### .2.5. Target
  
  - **Service:** AdNetworkIntegrationService
  - **Model:** AdNetworkSpecificCampaignPayload (e.g., GoogleAdsCampaign)
  - **Fields:**
    
    - networkCampaignName
    - networkBudget
    - networkSchedule
    - networkStatus
    - networkTargeting
    - networkBids
    - networkCreativeAssets
    
  
  #### .2.6. Transformation
  
  - **Type:** adapter
  - **Logic:** 1. Map common fields (name, budget, schedule, status) directly. 2. Adapt Ad Manager targeting criteria to the network's specific targeting options. 3. Format creatives (upload if necessary via network API) and link to ads/adsets as per network structure. 4. Handle network-specific parameters from AdNetwork.specifications.
  - **Configuration:**
    
    - **Target Network:** Google|Instagram|TikTok|Snapchat
    
  
  #### .2.7. Frequency
  real-time

  #### .2.8. Criticality
  critical

  #### .2.9. Dependencies
  
  - REQ-CMO-001
  - REQ-03-001
  - REQ-TCE-001
  
  #### .2.10. Validation
  
  - **Pre Transformation:**
    
    - Validate Ad Manager campaign data against internal rules.
    
  - **Post Transformation:**
    
    - Validate payload against Ad Network API schema (REQ-CMO-010, REQ-03-006).
    
  
  #### .2.11. Performance
  
  - **Expected Volume:** Medium frequency (merchant actions).
  - **Latency Requirement:** Interactive response times.
  - **Optimization Strategy:** Efficient mapping logic, caching AdNetwork.specifications.
  
  ### .3. AdNetworkPerformanceReportToPerformanceMetric
  Normalizes and aggregates performance data fetched from various ad network APIs into the Ad Manager's canonical PerformanceMetric entity and updates DailyCampaignPerformanceSummary.

  #### .3.1. Transformation Id
  PST003

  #### .3.4. Source
  
  - **Service:** AdNetworkIntegrationService
  - **Model:** AdNetworkPerformanceReport (varies by network)
  - **Fields:**
    
    - impressions
    - clicks
    - spend
    - conversions
    - date
    - campaignId (network specific)
    - adId (network specific)
    
  
  #### .3.5. Target
  
  - **Service:** AnalyticsReportingService
  - **Model:** AdManagerPerformanceMetric / DailyCampaignPerformanceSummary
  - **Fields:**
    
    - impressions
    - clicks
    - spend
    - conversions
    - roas
    - cpa
    - date
    - adId (Ad Manager FK)
    - adSetId (Ad Manager FK)
    - campaignId (Ad Manager FK)
    - adNetworkId (Ad Manager FK)
    
  
  #### .3.6. Transformation
  
  - **Type:** aggregation
  - **Logic:** 1. Map network-specific metric names to Ad Manager standard names. 2. Convert data types (e.g., currency, date formats). 3. Link network entity IDs to Ad Manager internal FKs. 4. Calculate derived metrics like ROAS, CPA (requires order data via PST005 for sales figures). 5. Store granular data in PerformanceMetric. 6. Aggregate daily summaries into DailyCampaignPerformanceSummary.
  - **Configuration:**
    
    - **Standard Metric Definitions:** Documented mapping (REQ-ARP-002)
    - **Aggregation Window:** Daily for summary table
    
  
  #### .3.7. Frequency
  batch

  #### .3.8. Criticality
  critical

  #### .3.9. Dependencies
  
  - REQ-03-002
  - REQ-ARP-001
  - REQ-ARP-007
  
  #### .3.10. Validation
  
  - **Pre Transformation:**
    
    - Verify data integrity from ad network.
    
  - **Post Transformation:**
    
    - Ensure metrics are correctly calculated and stored.
    
  
  #### .3.11. Performance
  
  - **Expected Volume:** High volume of rows, N impressions/sec (REQ-ARP-005).
  - **Latency Requirement:** Batch: Y sec/min; Real-time: Z ms (REQ-ARP-005).
  - **Optimization Strategy:** Batch processing, parallel fetching from networks, optimized DynamoDB writes, materialized views/summary tables.
  
  ### .4. AdManagerProductCatalogToAdNetworkFeed
  Generates a product feed file (e.g., XML, CSV) compliant with a specific ad network's requirements, using data from Ad Manager product catalogs including overrides.

  #### .4.1. Transformation Id
  PST004

  #### .4.4. Source
  
  - **Service:** ProductCatalogService
  - **Model:** AdManagerProductCatalog (containing AdManagerProducts)
  - **Fields:**
    
    - All product attributes: id, adTitle, adDescription, adImageUrl, price, availability, brand, gtin, etc.
    
  
  #### .4.5. Target
  
  - **Service:** AdNetworkIntegrationService (for submission) / File Storage (S3)
  - **Model:** NetworkSpecificFeedFile (XML/CSV/TSV)
  - **Fields:**
    
    - network_product_id
    - network_title
    - network_description
    - network_image_link
    - network_price
    - network_availability
    - etc.
    
  
  #### .4.6. Transformation
  
  - **Type:** formatting
  - **Logic:** 1. Retrieve all active products within the specified AdManagerProductCatalog. 2. For each product, apply Ad Manager specific overrides to base data. 3. Map Ad Manager product attributes to the target ad network's feed field names and formats. 4. Handle any specific formatting rules (e.g., escaping characters, date formats) required by the network. 5. Serialize to the required file format (XML, CSV, etc.).
  - **Configuration:**
    
    - **Target Network:** Google|Instagram|TikTok|Snapchat
    - **Feed Format:** Determined by AdNetwork.specifications
    
  
  #### .4.7. Frequency
  batch

  #### .4.8. Criticality
  critical

  #### .4.9. Dependencies
  
  - REQ-PC-001
  - REQ-PC-003
  - REQ-PC-006
  - REQ-03-003
  
  #### .4.10. Validation
  
  - **Pre Transformation:**
    
    - Ensure product catalog data is complete and valid.
    
  - **Post Transformation:**
    
    - Validate generated feed against ad network specifications (REQ-PC-007).
    
  
  #### .4.11. Performance
  
  - **Expected Volume:** Potentially millions of products (REQ-PC-010).
  - **Latency Requirement:** Efficient for large catalogs.
  - **Optimization Strategy:** Streaming generation for large feeds, batch processing.
  
  ### .5. OrderDataToROAS_CPA_CalculationInput
  Extracts and prepares order data from [PlatformName] core platform for ROAS and CPA calculations in Ad Manager analytics.

  #### .5.1. Transformation Id
  PST005

  #### .5.4. Source
  
  - **Service:** CorePlatformIntegrationService
  - **Model:** [PlatformName]OrderDTO
  - **Fields:**
    
    - orderId
    - orderTimestamp
    - totalAmount
    - currency
    - itemsSold
    - attributionTags (e.g., campaign_id, click_id)
    
  
  #### .5.5. Target
  
  - **Service:** AnalyticsReportingService
  - **Model:** AttributedSalesData (internal structure)
  - **Fields:**
    
    - orderId
    - saleTimestamp
    - saleValue
    - currency
    - attributedCampaignId
    - attributedAdSetId
    - attributedAdId
    
  
  #### .5.6. Transformation
  
  - **Type:** direct
  - **Logic:** 1. Fetch order data from [PlatformName] using API (REQ-CPSI-007). 2. Identify orders attributed to Ad Manager campaigns using tracking parameters or other attribution logic. 3. Extract relevant fields (sale value, timestamp). 4. Link to Ad Manager campaign/adset/ad entities.
  - **Configuration:**
    
    - **Attribution Logic:** Based on UTM parameters, click IDs, or other tracking mechanisms.
    
  
  #### .5.7. Frequency
  batch

  #### .5.8. Criticality
  critical

  #### .5.9. Dependencies
  
  - REQ-CPSI-007
  - REQ-ARP-001
  
  #### .5.10. Validation
  
  - **Pre Transformation:**
    
    - Ensure order data is available and contains attribution info.
    
  - **Post Transformation:**
    
    - Verify sale value is correctly extracted and attributed.
    
  
  #### .5.11. Performance
  
  - **Expected Volume:** Scales with number of merchant orders.
  - **Latency Requirement:** Timely enough for daily/hourly reporting.
  - **Optimization Strategy:** Batch fetching, efficient lookup for attribution.
  
  
- **Implementation Priority:**
  
  - **Component:** PST001: CoreProductToAdManagerProductCatalogItem  
**Priority:** high  
**Dependencies:**
    
    - CorePlatformIntegrationService
    - ProductCatalogService
    
**Estimated Effort:** High  
**Risk Level:** medium  
  - **Component:** PST002: AdManagerCampaignToAdNetworkCampaign  
**Priority:** high  
**Dependencies:**
    
    - CampaignManagementService
    - AdNetworkIntegrationService
    
**Estimated Effort:** High  
**Risk Level:** high  
  - **Component:** PST003: AdNetworkPerformanceReportToPerformanceMetric  
**Priority:** high  
**Dependencies:**
    
    - AdNetworkIntegrationService
    - AnalyticsReportingService
    
**Estimated Effort:** High  
**Risk Level:** high  
  - **Component:** PST004: AdManagerProductCatalogToAdNetworkFeed  
**Priority:** high  
**Dependencies:**
    
    - ProductCatalogService
    - AdNetworkIntegrationService
    
**Estimated Effort:** Medium  
**Risk Level:** medium  
  - **Component:** Field-Level & Cross-Field Validations for Campaign/Ad Entities  
**Priority:** high  
**Dependencies:**
    
    - CampaignManagementService
    - AdNetworkIntegrationService
    
**Estimated Effort:** Medium  
**Risk Level:** low  
  
- **Risk Assessment:**
  
  - **Risk:** Incorrect mapping of Ad Network API fields leading to campaign creation/update failures or misreported performance.  
**Impact:** high  
**Probability:** medium  
**Mitigation:** Thorough testing against each ad network's sandbox/API. Version-controlled mapping configurations. Robust error parsing from network APIs.  
**Contingency Plan:** Manual correction via ad network UIs. Quick-fix deployment for mapping logic.  
  - **Risk:** Performance degradation during bulk data synchronization (products, performance metrics) impacting platform responsiveness.  
**Impact:** medium  
**Probability:** medium  
**Mitigation:** Optimize batch sizes, use asynchronous processing, scale resources dynamically. Implement efficient database queries and indexing.  
**Contingency Plan:** Throttle synchronization jobs. Temporarily reduce sync frequency.  
  - **Risk:** Changes in external Ad Network APIs or [PlatformName] Core APIs breaking transformations.  
**Impact:** high  
**Probability:** medium  
**Mitigation:** Monitor API changelogs. Implement API versioning where possible. Adapter pattern to isolate network-specific logic. Contract testing.  
**Contingency Plan:** Rapid development and deployment of updated adapters/connectors. Graceful degradation of affected features.  
  - **Risk:** Inconsistent data type handling leading to data corruption or validation errors.  
**Impact:** medium  
**Probability:** low  
**Mitigation:** Strict type checking. Standardized data conversion utilities. Comprehensive unit and integration tests for transformations.  
**Contingency Plan:** Data cleansing scripts. Manual data correction procedures.  
  - **Risk:** Validation rules not comprehensive enough, allowing non-compliant data to be sent to ad networks, causing rejections.  
**Impact:** medium  
**Probability:** medium  
**Mitigation:** Regularly update validation rules based on ad network feedback and policy changes (REQ-CMO-010, REQ-03-005). Provide clear error messages to merchants.  
**Contingency Plan:** Allow merchants to manually edit/correct data post-feedback from networks.  
  
- **Recommendations:**
  
  - **Category:** Data Mapping & Transformation Logic  
**Recommendation:** Implement transformation logic within dedicated adapter/mapper classes or services to keep business logic services clean. Utilize a library for object-object mapping where appropriate (e.g., class-transformer in NestJS).  
**Justification:** Improves maintainability, testability, and separation of concerns.  
**Priority:** high  
**Implementation Notes:** Define clear DTOs for service boundaries and external APIs.  
  - **Category:** Validation Strategy  
**Recommendation:** Combine declarative validation (e.g., decorators in NestJS using class-validator) for common constraints with custom validation services for complex business rules and ad network specifications.  
**Justification:** Provides a balance of ease-of-use for simple validations and flexibility for complex ones. (Ref: REQ-CMO-010, REQ-PC-007)  
**Priority:** high  
**Implementation Notes:** Ensure validation error messages are user-friendly and actionable.  
  - **Category:** Performance & Scalability  
**Recommendation:** For high-volume transformations (product sync, performance data ingestion), design for batch processing and parallelization. Leverage asynchronous patterns (SQS/Lambda) extensively.  
**Justification:** Meets NFRs like REQ-PC-010, REQ-ARP-005 and prevents system bottlenecks.  
**Priority:** high  
**Implementation Notes:** Monitor queue lengths and processing times closely. Optimize database interactions for bulk operations.  
  - **Category:** Error Handling & Resilience  
**Recommendation:** Implement comprehensive error handling, including specific parsing of ad network API error responses. Utilize circuit breakers and retry mechanisms for all external API calls as specified in REQ-03-007 and REQ-TCE-002.  
**Justification:** Enhances system stability and provides better feedback to users and administrators.  
**Priority:** high  
**Implementation Notes:** Ensure correlation IDs are logged with errors for easier debugging across services.  
  - **Category:** Testing  
**Recommendation:** Develop a robust testing suite for transformations, including: unit tests for individual mapping functions, integration tests for end-to-end transformation pipelines, and contract tests for external API integrations.  
**Justification:** Ensures accuracy and reliability of data transformations, especially critical given the dependency on external systems.  
**Priority:** high  
**Implementation Notes:** Use mock data and mock external services for isolated testing. Include tests for edge cases and error conditions.  
  - **Category:** Configuration Management  
**Recommendation:** Externalize ad network specific mapping rules and validation parameters (e.g., field names, required formats, length limits) into configuration files or a configuration service (AWS Systems Manager Parameter Store as per REQ-POA-009).  
**Justification:** Allows updates to ad network specifics without code changes, improving agility in adapting to external API changes.  
**Priority:** medium  
**Implementation Notes:** Cache configurations to avoid performance overhead.  
  


---

