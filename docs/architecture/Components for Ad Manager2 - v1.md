# Architecture Design Specification

# 1. Components

- **Components:**
  
  ### .1. CampaignManagementService
  Handles creation, editing, lifecycle management of advertising campaigns, ad sets, ads, and A/B tests. Manages campaign budgets and creative associations.

  #### .1.4. Type
  Microservice

  #### .1.5. Dependencies
  
  - ad-network-integration-service-003
  - product-catalog-service-002
  - promotions-service-004
  - core-platform-integration-service-006
  - analytics-reporting-service-005
  - user-access-management-service-007
  - postgresql-admanager-db-008
  - messaging-component-010
  
  #### .1.6. Properties
  
  - **Version:** 1.0.0
  - **Language:** TypeScript
  - **Framework:** NestJS
  
  #### .1.7. Interfaces
  
  - **Name:** ICampaignAPI  
**Operations:**
    
    - createCampaign(req: REQ-CMO-001)
    - editCampaign(req: REQ-CMO-002)
    - manageCampaignStatus(req: REQ-CMO-002)
    - createAdSet(req: REQ-CMO-003)
    - manageAdCreativeAssociations(req: REQ-CMO-004)
    - specifyDestinationURLs(req: REQ-CMO-006)
    - createABTest(req: REQ-CMO-008)
    - setCampaignBudget(req: REQ-CMO-011)
    - associateProductCatalog(req: REQ-CMO-005)
    
  
  #### .1.8. Technology
  Node.js (NestJS), Docker, Amazon EKS

  #### .1.9. Resources
  
  - **Cpu:** 2 vCPU
  - **Memory:** 4GB RAM
  - **Storage:** 10GB (for logs/temp)
  
  #### .1.10. Configuration
  
  - **Default Abtest Duration:** 14d
  - **Max Creatives Per Ad:** 5
  - **Ad Network Validation Timeout:** 30s
  
  #### .1.11. Health Check
  
  - **Path:** /health
  - **Interval:** 30
  - **Timeout:** 5
  
  #### .1.12. Responsible Features
  
  - REQ-CMO-001
  - REQ-CMO-002
  - REQ-CMO-003
  - REQ-CMO-004
  - REQ-CMO-005
  - REQ-CMO-006
  - REQ-CMO-008
  - REQ-CMO-010 (delegates validation)
  - REQ-CMO-011
  - REQ-CMO-013
  
  #### .1.13. Security
  
  - **Requires Authentication:** True
  - **Requires Authorization:** True
  - **Allowed Roles:**
    
    - Merchant Admin
    - Campaign Manager
    
  
  ### .2. ProductCatalogService
  Manages advertising-specific product catalogs, including synchronization with the core platform, ad-specific customizations, bulk imports, conflict resolution, and feed generation for ad networks.

  #### .2.4. Type
  Microservice

  #### .2.5. Dependencies
  
  - core-platform-integration-service-006
  - ad-network-integration-service-003
  - postgresql-admanager-db-008
  - dynamodb-productfeed-store-009
  - messaging-component-010
  
  #### .2.6. Properties
  
  - **Version:** 1.0.0
  - **Language:** TypeScript
  - **Framework:** NestJS
  - **Max Product Listings:** [Y million] (REQ-PC-010)
  
  #### .2.7. Interfaces
  
  - **Name:** IProductCatalogAPI  
**Operations:**
    
    - createCatalog(req: REQ-PC-001)
    - updateCatalog(req: REQ-PC-001)
    - customizeProductAttribute(req: REQ-PC-003)
    - bulkImportProducts(req: REQ-PC-004)
    - resolveProductConflict(req: REQ-PC-005)
    - generateProductFeed(req: REQ-PC-006)
    - validateProductFeed(req: REQ-PC-007)
    - migrateExternalCatalogData(req: REQ-PC-011, REQ-DOMS-005)
    
  
  #### .2.8. Technology
  Node.js (NestJS), Docker, Amazon EKS

  #### .2.9. Resources
  
  - **Cpu:** 2 vCPU
  - **Memory:** 8GB RAM (due to potential large catalog processing)
  - **Storage:** 20GB (for logs/temp feeds)
  
  #### .2.10. Configuration
  
  - **Default Feed Format:** XML
  - **Max Import File Size:** 100MB
  - **Conflict Resolution Strategy:** preserveAdManagerOverrides
  
  #### .2.11. Health Check
  
  - **Path:** /health
  - **Interval:** 30
  - **Timeout:** 5
  
  #### .2.12. Responsible Features
  
  - REQ-PC-001
  - REQ-PC-002
  - REQ-PC-003
  - REQ-PC-004
  - REQ-PC-005
  - REQ-PC-006
  - REQ-PC-007
  - REQ-PC-011
  - REQ-DOMS-005
  - REQ-CPSI-001
  - REQ-CPSI-002
  - REQ-DOMS-001
  
  #### .2.13. Security
  
  - **Requires Authentication:** True
  - **Requires Authorization:** True
  - **Allowed Roles:**
    
    - Merchant Admin
    - Campaign Manager
    
  
  ### .3. AdNetworkIntegrationService
  Central service for all communications with external ad network APIs (Google, Instagram, TikTok, Snapchat). Handles API calls, authentication, error handling (retries, circuit breakers), and synchronization of campaigns, creatives, audiences, and product catalogs.

  #### .3.4. Type
  Microservice

  #### .3.5. Dependencies
  
  - postgresql-admanager-db-008 (for ad network specs, statuses)
  - secrets-manager-component
  - messaging-component-010
  
  #### .3.6. Properties
  
  - **Version:** 1.0.0
  - **Language:** TypeScript
  - **Framework:** NestJS
  
  #### .3.7. Interfaces
  
  - **Name:** IAdNetworkFacadeAPI  
**Operations:**
    
    - syncCampaignToNetwork(campaignDetails, networkId) (REQ-03-001)
    - retrievePerformanceMetrics(campaignId, networkId, dateRange) (REQ-03-002)
    - submitProductCatalogToNetwork(catalogFeed, networkId) (REQ-03-003)
    - validateCreativeForNetwork(creative, networkId) (REQ-03-005)
    - syncAudienceToNetwork(audience, networkId) (REQ-03-008)
    
  
  #### .3.8. Technology
  Node.js (NestJS), Docker, Amazon EKS, Ad Network SDKs

  #### .3.9. Resources
  
  - **Cpu:** 4 vCPU (due to concurrent API calls)
  - **Memory:** 8GB RAM
  - **Storage:** 10GB
  
  #### .3.10. Configuration
  
  - **Api Retry Attempts:** 5
  - **Circuit Breaker Timeout Ms:** 30000
  - **Rate Limit Buffer Percentage:** 20
  
  #### .3.11. Health Check
  
  - **Path:** /health
  - **Interval:** 30
  - **Timeout:** 10
  
  #### .3.12. Responsible Features
  
  - REQ-03-001
  - REQ-03-002
  - REQ-03-003
  - REQ-03-005
  - REQ-03-006
  - REQ-03-007
  - REQ-03-008
  - REQ-03-010
  - REQ-TCE-001
  - REQ-CMO-010
  - REQ-CMO-012
  
  #### .3.13. Security
  
  - **Requires Authentication:** True
  - **Requires Authorization:** True
  - **Allowed Roles:**
    
    - SystemInternal
    
  
  ### .4. AnalyticsReportingService
  Ingests, processes, stores, and serves advertising performance metrics. Handles report generation, dashboard data provisioning, and A/B test result analysis.

  #### .4.4. Type
  Microservice

  #### .4.5. Dependencies
  
  - ad-network-integration-service-003
  - core-platform-integration-service-006
  - dynamodb-performancestore-011
  - postgresql-admanager-db-008 (for aggregated/summary data)
  - messaging-component-010
  
  #### .4.6. Properties
  
  - **Version:** 1.0.0
  - **Language:** TypeScript
  - **Framework:** NestJS
  - **Impression Ingestion Target:** [N impressions/second] (REQ-ARP-005)
  - **Data Processing Latency Target:** [Y seconds/minutes] (REQ-ARP-005)
  
  #### .4.7. Interfaces
  
  - **Name:** IAnalyticsAPI  
**Operations:**
    
    - getCampaignPerformanceReport(params) (REQ-ARP-001)
    - getAggregatedPerformanceDashboard(params) (REQ-ARP-002)
    - generateCustomReport(params) (REQ-ARP-003)
    - getABTestResults(testId) (REQ-ARP-004, REQ-CMO-009)
    - provideActionableInsights(params) (REQ-ARP-008)
    
  
  #### .4.8. Technology
  Node.js (NestJS), Docker, Amazon EKS, AWS Lambda (for ingestion/processing pipelines)

  #### .4.9. Resources
  
  - **Cpu:** 4 vCPU (for data processing)
  - **Memory:** 16GB RAM
  - **Storage:** 20GB
  
  #### .4.10. Configuration
  
  - **Default Reporting Timezone:** UTC
  - **Historical Data Retention Period:** 2y (detailed), 5y (anonymized/aggregated) (REQ-ARP-006)
  - **Statistical Significance Threshold:** 0.95
  
  #### .4.11. Health Check
  
  - **Path:** /health
  - **Interval:** 30
  - **Timeout:** 5
  
  #### .4.12. Responsible Features
  
  - REQ-CMO-007
  - REQ-CMO-009
  - REQ-ARP-001
  - REQ-ARP-002
  - REQ-ARP-003
  - REQ-ARP-004
  - REQ-ARP-008
  - REQ-AMP-001 (performance tracking part)
  
  #### .4.13. Security
  
  - **Requires Authentication:** True
  - **Requires Authorization:** True
  - **Allowed Roles:**
    
    - Merchant Admin
    - Campaign Manager
    - Platform Administrator
    - Affiliate (for own data)
    
  
  ### .5. UserAccessManagementService
  Manages user roles (Merchant Admin, Campaign Manager, Platform Administrator), permissions, and Ad Manager user associations. Integrates with the core platform's authentication system and enforces RBAC.

  #### .5.4. Type
  Microservice

  #### .5.5. Dependencies
  
  - core-platform-integration-service-006
  - postgresql-admanager-db-008
  - audit-log-client-library
  
  #### .5.6. Properties
  
  - **Version:** 1.0.0
  - **Language:** TypeScript
  - **Framework:** NestJS
  
  #### .5.7. Interfaces
  
  - **Name:** IIAM_API  
**Operations:**
    
    - defineRole(roleDetails) (REQ-IAM-001)
    - assignRoleToUser(userId, roleId, merchantId)
    - checkPermission(userId, permission, resourceId)
    - getAdManagerUser(coreUserId)
    
  
  #### .5.8. Technology
  Node.js (NestJS), Docker, Amazon EKS

  #### .5.9. Resources
  
  - **Cpu:** 1 vCPU
  - **Memory:** 2GB RAM
  - **Storage:** 5GB
  
  #### .5.10. Configuration
  
  - **Default Role For New Merchant:** Merchant Admin
  - **Audit Log Retention Iam:** 7y
  
  #### .5.11. Health Check
  
  - **Path:** /health
  - **Interval:** 60
  - **Timeout:** 5
  
  #### .5.12. Responsible Features
  
  - REQ-IAM-001
  - REQ-IAM-002
  - REQ-IAM-003
  - REQ-IAM-004
  - REQ-IAM-005
  - REQ-IAM-008
  - REQ-IAM-009
  - REQ-IAM-010
  - REQ-POA-019
  
  #### .5.13. Security
  
  - **Requires Authentication:** True
  - **Requires Authorization:** True
  - **Allowed Roles:**
    
    - SystemInternal
    - Platform Administrator (for managing roles/users)
    
  
  ### .6. APIGatewayComponent
  Single entry point for all frontend and third-party requests. Handles routing, authentication (JWT validation), authorization (coarse-grained), rate limiting, and SSL termination.

  #### .6.4. Type
  APIGateway

  #### .6.5. Dependencies
  
  - campaign-management-service-001
  - product-catalog-service-002
  - ad-network-integration-service-003
  - promotions-service-004
  - analytics-reporting-service-005
  - user-access-management-service-007
  - cognito-auth-provider (or core platform auth)
  
  #### .6.6. Properties
  
  - **Provider:** Amazon API Gateway
  
  #### .6.7. Interfaces
  
  - **Name:** MerchantFacingAPI  
**Protocol:** REST/GraphQL  
**Visibility:** Public  
  - **Name:** AdminFacingAPI  
**Protocol:** REST/GraphQL  
**Visibility:** Public  
  - **Name:** AffiliateFacingAPI  
**Protocol:** REST/GraphQL  
**Visibility:** Public  
  
  #### .6.8. Technology
  Amazon API Gateway, AWS Lambda (for custom authorizers)

  #### .6.9. Resources
  
  - **Cpu:** N/A (Managed Service)
  - **Memory:** N/A (Managed Service)
  - **Network:** Scalable
  
  #### .6.10. Configuration
  
  - **Global Rate Limit:** 1000rps
  - **Jwt Issuer:** https://[PlatformName].auth.com
  - **Cors Origins:**
    
    - https://portal.admanager.com
    - https://admin.admanager.com
    
  
  #### .6.11. Health Check
  
  - **Path:** N/A (Monitored via CloudWatch)
  - **Interval:** 0
  - **Timeout:** 0
  
  #### .6.12. Responsible Features
  
  - Acts as entry for all features accessed via API.
  
  #### .6.13. Security
  
  - **Requires Authentication:** True
  - **Requires Authorization:** True
  - **Allowed Roles:**
    
    - Varies per route (Merchant Admin, Campaign Manager, Platform Administrator, Affiliate, etc.)
    
  
  ### .7. PostgreSQL_AdManagerDB
  Relational database for storing structured Ad Manager data such as campaign configurations, user roles, product catalog overrides, promotion details, billing information, etc. (REQ-PC-008)

  #### .7.4. Type
  Database

  #### .7.5. Dependencies
  
  
  #### .7.6. Properties
  
  - **Engine:** PostgreSQL
  - **Deployment:** Amazon RDS
  
  #### .7.7. Interfaces
  
  - **Name:** SQLInterface  
**Protocol:** SQL (JDBC/ODBC via ORM)  
  
  #### .7.8. Technology
  Amazon RDS for PostgreSQL

  #### .7.9. Resources
  
  - **Cpu:** 4 vCPU
  - **Memory:** 16GB RAM
  - **Storage:** 500GB (expandable, with PIOPS)
  
  #### .7.10. Configuration
  
  - **Backup Retention Period:** 35d
  - **Multi Az:** True
  - **Max Connections:** 200
  
  #### .7.11. Health Check
  
  - **Path:** N/A (Monitored via CloudWatch RDS metrics)
  - **Interval:** 0
  - **Timeout:** 0
  
  #### .7.12. Responsible Features
  
  - Data persistence for structured data across multiple features.
  
  #### .7.13. Security
  
  - **Requires Authentication:** True
  - **Requires Authorization:** True
  - **Allowed Roles:**
    
    - ApplicationServices (via IAM roles)
    
  
  ### .8. DynamoDB_PerformanceStore
  NoSQL data store for high-volume, semi-structured data like detailed campaign performance logs, A/B test event logs, and raw/processed product catalog feeds. (REQ-ARP-007, REQ-PC-008)

  #### .8.4. Type
  Database

  #### .8.5. Dependencies
  
  
  #### .8.6. Properties
  
  - **Engine:** DynamoDB
  - **Deployment:** Amazon DynamoDB
  
  #### .8.7. Interfaces
  
  - **Name:** NoSQLInterface  
**Protocol:** DynamoDB API (AWS SDK)  
  
  #### .8.8. Technology
  Amazon DynamoDB

  #### .8.9. Resources
  
  - **Cpu:** N/A (Managed Service)
  - **Memory:** N/A (Managed Service)
  - **Storage:** Scalable (TBs)
  - **Throughput:** Configurable RCU/WCU (High)
  
  #### .8.10. Configuration
  
  - **Time To Live Attribute:** ttl
  - **On Demand Capacity:** True
  - **Global Tables:** False
  
  #### .8.11. Health Check
  
  - **Path:** N/A (Monitored via CloudWatch DynamoDB metrics)
  - **Interval:** 0
  - **Timeout:** 0
  
  #### .8.12. Responsible Features
  
  - REQ-ARP-007 (Performance Logs)
  - REQ-PC-008 (Product Feeds)
  
  #### .8.13. Security
  
  - **Requires Authentication:** True
  - **Requires Authorization:** True
  - **Allowed Roles:**
    
    - ApplicationServices (via IAM roles)
    
  
  ### .9. MessagingComponent
  Facilitates asynchronous communication between microservices using message queues (SQS) and topics (SNS) for decoupling and resilience.

  #### .9.4. Type
  MessagingBus

  #### .9.5. Dependencies
  
  
  #### .9.6. Properties
  
  - **Provider:** AWS SQS & SNS
  
  #### .9.7. Interfaces
  
  - **Name:** QueueAPI  
**Protocol:** AWS SDK SQS  
  - **Name:** TopicAPI  
**Protocol:** AWS SDK SNS  
  
  #### .9.8. Technology
  Amazon SQS, Amazon SNS

  #### .9.9. Resources
  
  - **Cpu:** N/A (Managed Service)
  - **Memory:** N/A (Managed Service)
  
  #### .9.10. Configuration
  
  - **Default Visibility Timeout:** 60s
  - **Dead Letter Queue Policy:** Retry 3 times, then DLQ
  
  #### .9.11. Health Check
  
  - **Path:** N/A (Monitored via CloudWatch SQS/SNS metrics)
  - **Interval:** 0
  - **Timeout:** 0
  
  #### .9.12. Responsible Features
  
  - Supports asynchronous operations for many features (e.g., data sync, report generation).
  
  #### .9.13. Security
  
  - **Requires Authentication:** True
  - **Requires Authorization:** True
  - **Allowed Roles:**
    
    - ApplicationServices (via IAM roles)
    
  
  ### .10. MerchantAdManagerPortal
  Single Page Application (SPA) for merchants to manage their advertising campaigns, product catalogs, promotions, view analytics, and access other Ad Manager functionalities.

  #### .10.4. Type
  FrontendApplication

  #### .10.5. Dependencies
  
  - api-gateway-component-000
  
  #### .10.6. Properties
  
  - **Framework:** React
  - **Language:** TypeScript
  - **Accessibility Standard:** WCAG 2.1 AA (REQ-6-011)
  
  #### .10.7. Interfaces
  
  - **Name:** UserInterface  
**Type:** Web Browser  
  
  #### .10.8. Technology
  React, Next.js (potentially for parts), TypeScript, Webpack/Vite, Jest/React Testing Library

  #### .10.9. Resources
  
  - **Cdn:** Amazon CloudFront
  
  #### .10.10. Configuration
  
  - **Api Endpoint:** https://api.admanager.com/v1/merchant
  - **Default Language:** en
  - **Enable Rtlsupport:** True
  
  #### .10.11. Health Check
  
  - **Path:** N/A (Client-side monitoring)
  - **Interval:** 0
  - **Timeout:** 0
  
  #### .10.12. Responsible Features
  
  - UI for all merchant-facing requirements.
  
  #### .10.13. Security
  
  - **Requires Authentication:** True
  - **Requires Authorization:** True
  - **Allowed Roles:**
    
    - Merchant Admin
    - Campaign Manager
    
  - **Token Storage:** HttpOnly Cookies for refresh tokens, memory/secure storage for access tokens (REQ-IAM-007)
  
  
- **Configuration:**
  
  - **Environment:** production
  - **Logging Level:** INFO
  - **Platform Name:** [PlatformName]
  - **Default Currency:** SAR
  - **Supported Ad Networks:**
    
    - Google
    - Instagram
    - TikTok
    - Snapchat
    
  


---

# 2. Component_Relations

- **Architecture:**
  
  - **Components:**
    
    - **Id:** campaign-management-service-001  
**Name:** CampaignManagementService  
**Description:** Manages the lifecycle of advertising campaigns, ad sets, ads, and A/B tests. Coordinates with other services for creatives, product catalogs, promotions, and ad network interactions.  
**Type:** Microservice  
**Dependencies:**
    
    - ad-network-integration-service-003
    - product-catalog-service-002
    - promotions-offers-service-004
    - analytics-reporting-service-012
    - content-management-service-006
    - gift-options-service-008
    - audience-management-service-017
    - ad-manager-postgresql-db-022
    - ad-manager-dynamodb-tables-023
    - ad-events-queue-020
    - ad-events-topic-021
    - shared-logging-library-031
    - shared-error-handling-library-032
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** CampaignAPI  
**Protocol:** RESTful  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.5-2 cores
    - **Memory:** 512MB-2GB
    
**Configuration:**
    
    - **Default Abtest Duration Days:** 14
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 30
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-CMO-001
    - REQ-CMO-002
    - REQ-CMO-003
    - REQ-CMO-004
    - REQ-CMO-005
    - REQ-CMO-006
    - REQ-CMO-008
    - REQ-CMO-010
    - REQ-CMO-011
    - REQ-CMO-012
    - REQ-CMO-013
    - REQ-6-008
    - REQ-GO-004
    - REQ-CPSI-005
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** product-catalog-service-002  
**Name:** ProductCatalogService  
**Description:** Manages product catalogs for advertising, including synchronization with the core e-commerce platform, customizations, feed generation, and validation.  
**Type:** Microservice  
**Dependencies:**
    
    - core-platform-integration-service-013
    - ad-network-integration-service-003
    - data-governance-compliance-service-011
    - ad-manager-postgresql-db-022
    - ad-manager-dynamodb-tables-023
    - ad-events-queue-020
    - shared-logging-library-031
    
**Properties:**
    
    - **Version:** 1.0.0
    - **Supports Product Listings:** [Y million]
    
**Interfaces:**
    
    - **Name:** ProductCatalogAPI  
**Protocol:** RESTful  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.5-2 cores
    - **Memory:** 512MB-4GB
    
**Configuration:**
    
    - **Default Catalog Archive Period Months:** 6
    - **Max Product Overrides Per Merchant:** 100000
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 30
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-PC-001
    - REQ-PC-002
    - REQ-PC-003
    - REQ-PC-004
    - REQ-PC-005
    - REQ-PC-006
    - REQ-PC-007
    - REQ-PC-008
    - REQ-PC-009
    - REQ-PC-010
    - REQ-PC-011
    - REQ-DOMS-001
    - REQ-DOMS-005
    - REQ-CPSI-001
    - REQ-CPSI-002
    - REQ-GO-004
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** ad-network-integration-service-003  
**Name:** AdNetworkIntegrationService  
**Description:** Handles all direct integrations with external ad network APIs (Google, Instagram, TikTok, Snapchat) for campaign management, creative uploads, performance data retrieval, audience sync, and feed submissions. Implements robust error handling like circuit breakers and retries.  
**Type:** Microservice  
**Dependencies:**
    
    - security-layer-secrets-manager-client-028
    - ad-events-topic-021
    - shared-logging-library-031
    - shared-error-handling-library-032
    - ad-manager-cache-024
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** AdNetworkFacadeAPI  
**Protocol:** InternalEvents/gRPC  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 1-4 cores
    - **Memory:** 1GB-4GB
    
**Configuration:**
    
    - **Api Retry Attempts:** 5
    - **Circuit Breaker Timeout Ms:** 30000
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 30
    - **Timeout:** 10
    
**Responsible Features:**
    
    - REQ-CMO-004
    - REQ-CMO-007
    - REQ-CMO-010
    - REQ-CMO-012
    - REQ-PC-006
    - REQ-PC-007
    - REQ-03-001
    - REQ-03-002
    - REQ-03-003
    - REQ-03-004
    - REQ-03-005
    - REQ-03-006
    - REQ-03-007
    - REQ-03-008
    - REQ-03-009
    - REQ-03-010
    - REQ-TCE-001
    - REQ-TCE-002
    - REQ-TCE-003
    - REQ-TCE-006
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** promotions-offers-service-004  
**Name:** PromotionsOffersService  
**Description:** Manages the creation and lifecycle of various promotion types (discount codes, BOGO, tiered discounts), including eligibility rules and application logic.  
**Type:** Microservice  
**Dependencies:**
    
    - core-platform-integration-service-013
    - ad-manager-postgresql-db-022
    - shared-logging-library-031
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** PromotionAPI  
**Protocol:** RESTful  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.5-1 core
    - **Memory:** 512MB-1GB
    
**Configuration:**
    
    - **Max Discount Codes Per Merchant:** 1000000
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 30
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-CMO-013
    - REQ-PROMO-001
    - REQ-PROMO-002
    - REQ-PROMO-003
    - REQ-PROMO-004
    - REQ-PROMO-005
    - REQ-PROMO-006
    - REQ-PROMO-007
    - REQ-PROMO-008
    - REQ-CPSI-004
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** affiliate-marketing-service-005  
**Name:** AffiliateMarketingService  
**Description:** Manages affiliate programs, including registration, tracking links/codes, commission structures, conversion attribution, and payout calculations. Provides data for the affiliate portal.  
**Type:** Microservice  
**Dependencies:**
    
    - billing-monetization-service-015
    - ad-manager-postgresql-db-022
    - shared-logging-library-031
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** AffiliateProgramAPI  
**Protocol:** RESTful  
    - **Name:** AffiliatePortalDataAPI  
**Protocol:** RESTful  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.5-1 core
    - **Memory:** 512MB-1GB
    
**Configuration:**
    
    - **Default Cookie Window Days:** 30
    - **Default Min Payout Threshold:** 50
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 30
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-AMP-001
    - REQ-AMP-002
    - REQ-AMP-003
    - REQ-AMP-004
    - REQ-AMP-005
    - REQ-AMP-006
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** content-management-service-006  
**Name:** ContentManagementService  
**Description:** Manages blog posts and interactive landing pages, including creation tools, SEO aspects, versioning, and multi-language support. Ensures content is ready for SSR/SSG.  
**Type:** Microservice  
**Dependencies:**
    
    - seo-service-007
    - ad-manager-postgresql-db-022
    - shared-logging-library-031
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** BlogAPI  
**Protocol:** RESTful  
    - **Name:** LandingPageAPI  
**Protocol:** RESTful  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.5-1 core
    - **Memory:** 512MB-1GB
    
**Configuration:**
    
    - **Supported Languages:**
      
      - en
      - ar-SA
      
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 30
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-6-001
    - REQ-6-002
    - REQ-6-003
    - REQ-6-004
    - REQ-6-005
    - REQ-6-006
    - REQ-6-007
    - REQ-6-008
    - REQ-6-009
    - REQ-6-010
    - REQ-6-012
    - REQ-7-002
    - REQ-7-003
    - REQ-7-006
    - REQ-7-007
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** seo-service-007  
**Name:** SEOService  
**Description:** Provides SEO enhancement tools, including keyword research integration, structured data generation, on-page SEO element management, sitemap generation, and internal linking suggestions.  
**Type:** Microservice  
**Dependencies:**
    
    - content-management-service-006
    - product-catalog-service-002
    - ad-manager-postgresql-db-022
    - shared-logging-library-031
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** SEOManagementAPI  
**Protocol:** RESTful  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.25-0.5 cores
    - **Memory:** 256MB-512MB
    
**Configuration:**
    
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 60
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-6-003
    - REQ-6-004
    - REQ-6-009
    - REQ-7-001
    - REQ-7-002
    - REQ-7-003
    - REQ-7-004
    - REQ-7-005
    - REQ-7-006
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** gift-options-service-008  
**Name:** GiftOptionsService  
**Description:** Manages merchant configurations for gift options (custom notes, branded cards), stores customer gift choices, and provides data for highlighting these options in ads.  
**Type:** Microservice  
**Dependencies:**
    
    - core-platform-integration-service-013
    - ad-manager-postgresql-db-022
    - shared-logging-library-031
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** GiftOptionsConfigAPI  
**Protocol:** RESTful  
    - **Name:** GiftOrderDataAPI  
**Protocol:** InternalEvents  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.25-0.5 cores
    - **Memory:** 256MB-512MB
    
**Configuration:**
    
    - **Default Gift Note Char Limit:** 250
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 60
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-GO-001
    - REQ-GO-002
    - REQ-GO-003
    - REQ-GO-004
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** user-access-management-service-009  
**Name:** UserAccessManagementService  
**Description:** Manages user roles (Merchant Admin, Campaign Manager, Platform Admin) and granular RBAC permissions. Integrates with the core platform's authentication system and handles Ad Manager-specific authorization.  
**Type:** Microservice  
**Dependencies:**
    
    - core-platform-integration-service-013
    - platform-administration-service-010
    - data-governance-compliance-service-011
    - ad-manager-postgresql-db-022
    - shared-audit-log-client-036
    - shared-logging-library-031
    - ad-manager-cache-024
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** UserRoleManagementAPI  
**Protocol:** RESTful  
    - **Name:** AuthorizationAPI  
**Protocol:** InternalRPC/RESTful  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.5-1 core
    - **Memory:** 512MB-1GB
    
**Configuration:**
    
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 30
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-IAM-001
    - REQ-IAM-002
    - REQ-IAM-003
    - REQ-IAM-004
    - REQ-IAM-005
    - REQ-IAM-006
    - REQ-IAM-007
    - REQ-IAM-008
    - REQ-IAM-009
    - REQ-IAM-010
    - REQ-POA-019
    - REQ-CPSI-003
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** platform-administration-service-010  
**Name:** PlatformAdministrationService  
**Description:** Provides backend capabilities for the Platform Administrator portal, including system configuration management, user management (for admins), health monitoring aggregation, maintenance task initiation, audit log access, and DR/backup procedure coordination.  
**Type:** Microservice  
**Dependencies:**
    
    - user-access-management-service-009
    - data-governance-compliance-service-011
    - operations-monitoring-layer-config-030
    - security-layer-config-029
    - notification-service-016
    - shared-audit-log-client-036
    - shared-logging-library-031
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** PlatformAdminAPI  
**Protocol:** RESTful  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.5-1 core
    - **Memory:** 512MB-1GB
    
**Configuration:**
    
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 30
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-IAM-005
    - REQ-POA-001
    - REQ-POA-006
    - REQ-POA-007
    - REQ-POA-009
    - REQ-POA-010
    - REQ-POA-011
    - REQ-POA-012
    - REQ-POA-013
    - REQ-POA-014
    - REQ-POA-015
    - REQ-POA-016
    - REQ-POA-017
    - REQ-POA-018
    - REQ-POA-019
    - REQ-POA-020
    - REQ-POA-021
    - REQ-DOMS-005
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    - **Allowed Roles:**
      
      - PlatformAdministrator
      
    
    - **Id:** data-governance-compliance-service-011  
**Name:** DataGovernanceComplianceService  
**Description:** Manages data governance policies, compliance with regulations (GDPR, CCPA), DSR request processing, consent management integration, data retention/archival/purging, and audit trails for compliance.  
**Type:** Microservice  
**Dependencies:**
    
    - core-platform-integration-service-013
    - shared-audit-log-client-036
    - shared-logging-library-031
    - ad-manager-postgresql-db-022
    - ad-manager-dynamodb-tables-023
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** DataComplianceAPI  
**Protocol:** RESTful  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.5-1 core
    - **Memory:** 512MB-1GB
    
**Configuration:**
    
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 30
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-PC-009
    - REQ-03-006
    - REQ-IAM-010
    - REQ-POA-013
    - REQ-POA-018
    - REQ-POA-021
    - REQ-MDGC-001
    - REQ-MDGC-002
    - REQ-MDGC-003
    - REQ-MDGC-004
    - REQ-MDGC-005
    - REQ-MDGC-006
    - REQ-MDGC-007
    - REQ-MDGC-008
    - REQ-ARP-006
    - REQ-CPSI-008
    - REQ-TCE-003
    - REQ-TCE-009
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** analytics-reporting-service-012  
**Name:** AnalyticsReportingService  
**Description:** Ingests, processes, and stores advertising performance data. Provides APIs for detailed reports, customizable dashboards, A/B test result analysis, and actionable insights. Handles high volume data NFRs.  
**Type:** Microservice  
**Dependencies:**
    
    - ad-network-integration-service-003
    - core-platform-integration-service-013
    - data-governance-compliance-service-011
    - ad-manager-dynamodb-tables-023
    - ad-events-topic-021
    - shared-logging-library-031
    - ad-manager-cache-024
    
**Properties:**
    
    - **Version:** 1.0.0
    - **Impression Processing Rate:** [N impressions/second]
    - **Data Processing Latency:** [Y seconds/minutes batch, Z ms stream]
    
**Interfaces:**
    
    - **Name:** AnalyticsAPI  
**Protocol:** RESTful  
    - **Name:** ReportGenerationAPI  
**Protocol:** RESTful/AsyncEvents  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 1-4 cores
    - **Memory:** 2GB-8GB
    
**Configuration:**
    
    - **Performance Log Retention Years:** 2
    - **Aggregated Data Retention Years:** 5
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 30
    - **Timeout:** 10
    
**Responsible Features:**
    
    - REQ-CMO-007
    - REQ-CMO-009
    - REQ-03-002
    - REQ-ARP-001
    - REQ-ARP-002
    - REQ-ARP-003
    - REQ-ARP-004
    - REQ-ARP-005
    - REQ-ARP-006
    - REQ-ARP-007
    - REQ-ARP-008
    - REQ-CPSI-007
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** core-platform-integration-service-013  
**Name:** CorePlatformIntegrationService  
**Description:** Manages all integrations with the `[PlatformName]` core e-commerce platform, including product data synchronization, user authentication delegation, customer data access for promotions, and order/sales data retrieval for analytics.  
**Type:** Microservice  
**Dependencies:**
    
    - shared-logging-library-031
    - shared-error-handling-library-032
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** CorePlatformFacadeAPI  
**Protocol:** InternalEvents/gRPC  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.5-2 cores
    - **Memory:** 512MB-2GB
    
**Configuration:**
    
    - **Core Api Endpoint:** https://api.internal.[PlatformName].sa
    - **Core Api Retry Attempts:** 3
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 30
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-PC-002
    - REQ-PC-005
    - REQ-PROMO-005
    - REQ-IAM-006
    - REQ-MDGC-003
    - REQ-CPSI-001
    - REQ-CPSI-002
    - REQ-CPSI-003
    - REQ-CPSI-004
    - REQ-CPSI-005
    - REQ-CPSI-006
    - REQ-CPSI-007
    - REQ-CPSI-008
    - REQ-DOMS-001
    - REQ-15-005
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** third-party-connectivity-service-014  
**Name:** ThirdPartyConnectivityService  
**Description:** Manages integrations with various third-party services not covered by AdNetworkIntegrationService, such as payment gateways, shipping providers, Zapier, and the `[PlatformName]` App Store connectors.  
**Type:** Microservice  
**Dependencies:**
    
    - security-layer-secrets-manager-client-028
    - shared-logging-library-031
    - shared-error-handling-library-032
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** PaymentGatewayFacadeAPI  
**Protocol:** InternalEvents/gRPC  
    - **Name:** ShippingProviderFacadeAPI  
**Protocol:** InternalEvents/gRPC  
    - **Name:** ZapierFacadeAPI  
**Protocol:** InternalEvents/gRPC  
    - **Name:** AppStoreConnectorAPI  
**Protocol:** RESTful  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.5-1 core
    - **Memory:** 512MB-1GB
    
**Configuration:**
    
    - **Zapier Webhook Url:** https://zapier.com/apps/google-ads/integrations/[PlatformZapierAppIdentifier]
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 30
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-03-009
    - REQ-MDGC-006
    - REQ-TCE-002
    - REQ-TCE-003
    - REQ-TCE-004
    - REQ-TCE-005
    - REQ-TCE-006
    - REQ-TCE-007
    - REQ-TCE-008
    - REQ-15-006
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** billing-monetization-service-015  
**Name:** BillingMonetizationService  
**Description:** Manages Ad Manager subscription plans, processes payments (upgrades, downgrades, failed payments), handles transaction fees, and manages commissions from App Store sales. Integrates with payment gateways.  
**Type:** Microservice  
**Dependencies:**
    
    - third-party-connectivity-service-014
    - core-platform-integration-service-013
    - ad-manager-postgresql-db-022
    - shared-logging-library-031
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** SubscriptionAPI  
**Protocol:** RESTful  
    - **Name:** BillingAPI  
**Protocol:** RESTful  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.5-1 core
    - **Memory:** 512MB-1GB
    
**Configuration:**
    
    - **Payment Failure Grace Period Days:** 7
    - **App Store Commission Rate:** 0.20
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 30
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-AMP-005
    - REQ-15-001
    - REQ-15-002
    - REQ-15-003
    - REQ-15-004
    - REQ-15-005
    - REQ-15-006
    - REQ-15-007
    - REQ-TCE-004
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** notification-service-016  
**Name:** NotificationService  
**Description:** Centralized service for dispatching various types of notifications (e.g., email, platform alerts) to merchants, affiliates, or administrators. Integrates with AWS SNS/SES.  
**Type:** Microservice  
**Dependencies:**
    
    - operations-monitoring-layer-config-030
    - shared-logging-library-031
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** NotificationDispatchAPI  
**Protocol:** InternalEvents/RESTful  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.25-0.5 cores
    - **Memory:** 256MB-512MB
    
**Configuration:**
    
    - **Default Email Sender:** noreply@admanager.[PlatformName].sa
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 60
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-POA-003
    - REQ-POA-016
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** audience-management-service-017  
**Name:** AudienceManagementService  
**Description:** Manages the creation, definition, and synchronization of audience segments (custom, lookalike) for campaign targeting. Liaises with AdNetworkIntegrationService for syncing with external ad networks.  
**Type:** Microservice  
**Dependencies:**
    
    - ad-network-integration-service-003
    - core-platform-integration-service-013
    - ad-manager-postgresql-db-022
    - shared-logging-library-031
    
**Properties:**
    
    - **Version:** 1.0.0
    
**Interfaces:**
    
    - **Name:** AudienceAPI  
**Protocol:** RESTful  
    
**Technology:** Node.js (NestJS)  
**Resources:**
    
    - **Cpu:** 0.25-1 core
    - **Memory:** 256MB-1GB
    
**Configuration:**
    
    
**Health Check:**
    
    - **Path:** /health
    - **Interval:** 30
    - **Timeout:** 5
    
**Responsible Features:**
    
    - REQ-CMO-012
    - REQ-03-008
    
**Security:**
    
    - **Requires Authentication:** True
    - **Requires Authorization:** True
    
    - **Id:** merchant-ad-manager-portal-spa-018  
**Name:** MerchantAdManagerPortal  
**Description:** Single Page Application (SPA) for merchants to manage their advertising campaigns, product catalogs, promotions, analytics, and account settings.  
**Type:** FrontendApplication  
**Dependencies:**
    
    - ad-manager-api-gateway-019
    
**Properties:**
    
    - **Framework:** React
    
**Technology:** React, TypeScript, Next.js (potentially for parts)  
**Resources:**
    
    - **Cdn:** AWS CloudFront
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-CMO-001
    - REQ-CMO-002
    - REQ-CMO-003
    - REQ-CMO-004
    - REQ-CMO-005
    - REQ-CMO-006
    - REQ-CMO-007
    - REQ-CMO-008
    - REQ-CMO-009
    - REQ-CMO-010
    - REQ-CMO-011
    - REQ-CMO-012
    - REQ-CMO-013
    - REQ-PC-001
    - REQ-PC-002
    - REQ-PC-003
    - REQ-PC-004
    - REQ-PC-005
    - REQ-PC-006
    - REQ-PC-007
    - REQ-PROMO-001
    - REQ-PROMO-003
    - REQ-PROMO-005
    - REQ-PROMO-007
    - REQ-PROMO-008
    - REQ-AMP-001
    - REQ-AMP-002
    - REQ-6-011
    - REQ-GO-001
    - REQ-GO-002
    - REQ-ARP-001
    - REQ-ARP-002
    - REQ-ARP-003
    - REQ-ARP-004
    - REQ-ARP-008
    - REQ-15-001
    - REQ-15-002
    - REQ-15-003
    - REQ-SUD-001
    - REQ-SUD-008
    - REQ-SUD-011
    
**Security:**
    
    - **Requires Authentication:** True
    
    - **Id:** platform-admin-portal-spa-037  
**Name:** PlatformAdminPortal  
**Description:** Single Page Application (SPA) for Platform Administrators to manage system configurations, health, users, maintenance tasks, and view audit logs.  
**Type:** FrontendApplication  
**Dependencies:**
    
    - ad-manager-api-gateway-019
    
**Properties:**
    
    - **Framework:** React
    
**Technology:** React, TypeScript  
**Resources:**
    
    - **Cdn:** AWS CloudFront
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-IAM-005
    - REQ-POA-001
    - REQ-POA-015
    - REQ-SUD-003
    
**Security:**
    
    - **Requires Authentication:** True
    - **Allowed Roles:**
      
      - PlatformAdministrator
      
    
    - **Id:** affiliate-portal-spa-038  
**Name:** AffiliatePortal  
**Description:** Secure Single Page Application (SPA) for registered affiliates to view performance metrics, generate tracking links, access assets, and view payout reports.  
**Type:** FrontendApplication  
**Dependencies:**
    
    - ad-manager-api-gateway-019
    
**Properties:**
    
    - **Framework:** React
    
**Technology:** React, TypeScript  
**Resources:**
    
    - **Cdn:** AWS CloudFront
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-AMP-006
    
**Security:**
    
    - **Requires Authentication:** True
    - **Allowed Roles:**
      
      - Affiliate
      
    
    - **Id:** public-blog-platform-ssr-039  
**Name:** PublicFacingBlogPlatform  
**Description:** Server-Side Rendered (SSR) or Statically Generated (SSG) platform for publishing merchant blog posts, ensuring SEO-friendliness and fast load times.  
**Type:** FrontendApplication  
**Dependencies:**
    
    - ad-manager-api-gateway-019
    - content-management-service-006
    
**Properties:**
    
    - **Rendering:** SSR/SSG
    
**Technology:** Next.js, React, TypeScript  
**Resources:**
    
    - **Cdn:** AWS CloudFront
    - **Compute:** AWS Lambda@Edge/EC2 (for SSR)
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-6-001
    - REQ-6-002
    - REQ-6-003
    - REQ-6-004
    - REQ-6-012
    - REQ-7-007
    
**Security:**
    
    - **Requires Authentication:** False
    
    - **Id:** public-landing-pages-ssr-040  
**Name:** PublicFacingLandingPages  
**Description:** Server-Side Rendered (SSR) or Statically Generated (SSG) interactive landing pages for marketing campaigns, optimized for SEO and PageSpeed.  
**Type:** FrontendApplication  
**Dependencies:**
    
    - ad-manager-api-gateway-019
    - content-management-service-006
    
**Properties:**
    
    - **Rendering:** SSR/SSG
    - **Page Speed Target:** 80
    
**Technology:** Next.js, React, TypeScript  
**Resources:**
    
    - **Cdn:** AWS CloudFront
    - **Compute:** AWS Lambda@Edge/EC2 (for SSR)
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-6-006
    - REQ-6-007
    - REQ-6-008
    - REQ-6-009
    - REQ-6-012
    - REQ-7-007
    
**Security:**
    
    - **Requires Authentication:** False
    
    - **Id:** ad-manager-api-gateway-019  
**Name:** AdManagerAPIGateway  
**Description:** Single entry point for all client requests (frontend SPAs, public sites, third-party apps). Handles routing, authentication (JWT validation), authorization (basic role checks), rate limiting, and SSL termination.  
**Type:** APIGateway  
**Dependencies:**
    
    - campaign-management-service-001
    - product-catalog-service-002
    - promotions-offers-service-004
    - affiliate-marketing-service-005
    - content-management-service-006
    - analytics-reporting-service-012
    - user-access-management-service-009
    - platform-administration-service-010
    - billing-monetization-service-015
    - security-layer-authentication-delegator-026
    
**Properties:**
    
    
**Technology:** Amazon API Gateway (RESTful & WebSocket), AWS Lambda (Authorizers)  
**Resources:**
    
    
**Configuration:**
    
    - **Global Rate Limit:** 1000 requests/second
    - **Auth Method:** JWT (via Lambda Authorizer)
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-SUD-015
    
**Security:**
    
    - **Requires Authentication:** True
    - **Enforces Https:** True
    
    - **Id:** ad-events-queue-020  
**Name:** AdEventsQueue  
**Description:** Collection of Amazon SQS queues for asynchronous inter-service communication (e.g., CampaignEventsQueue, ProductSyncEventsQueue). Ensures decoupling and reliable message delivery.  
**Type:** MessagingQueue  
**Dependencies:**
    
    
**Properties:**
    
    
**Technology:** Amazon SQS  
**Resources:**
    
    
**Configuration:**
    
    - **Default Visibility Timeout Sec:** 30
    - **Dead Letter Queue Enabled:** True
    
**Health Check:** None  
**Responsible Features:**
    
    
**Security:**
    
    
    - **Id:** ad-events-topic-021  
**Name:** AdEventsTopic  
**Description:** Collection of Amazon SNS topics for pub/sub event broadcasting (e.g., PerformanceDataTopic, NotificationEventsTopic). Facilitates one-to-many communication patterns.  
**Type:** MessagingTopic  
**Dependencies:**
    
    
**Properties:**
    
    
**Technology:** Amazon SNS  
**Resources:**
    
    
**Configuration:**
    
    - **Delivery Policy:** HTTP, SQS
    
**Health Check:** None  
**Responsible Features:**
    
    
**Security:**
    
    
    - **Id:** ad-manager-postgresql-db-022  
**Name:** AdManagerPostgreSQLDB  
**Description:** Primary relational database (Amazon RDS for PostgreSQL) storing structured transactional data such as campaign configurations, user accounts, product catalog overrides, promotion details, and affiliate data.  
**Type:** Database  
**Dependencies:**
    
    
**Properties:**
    
    - **Engine:** PostgreSQL
    
**Technology:** Amazon RDS for PostgreSQL  
**Resources:**
    
    - **Storage:** Scalable (e.g., 100GB - 1TB+)
    - **Instance Type:** db.m5.large or similar
    
**Configuration:**
    
    - **Backup Retention Days:** 30
    - **Multi Az:** True
    - **Max Connections:** 200
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-PC-008
    - REQ-PROMO-002
    
**Security:**
    
    - **Encryption At Rest:** True
    
    - **Id:** ad-manager-dynamodb-tables-023  
**Name:** AdManagerDynamoDBTables  
**Description:** Collection of Amazon DynamoDB tables for storing semi-structured, high-volume, or highly scalable data such as performance metrics logs, A/B test logs, raw/processed product catalog feeds, and potentially audit logs.  
**Type:** NoSQLDatabase  
**Dependencies:**
    
    
**Properties:**
    
    
**Technology:** Amazon DynamoDB  
**Resources:**
    
    - **Throughput:** On-demand/Provisioned (Scalable)
    
**Configuration:**
    
    - **Backup Enabled:** True
    - **Point In Time Recovery:** True
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-PC-008
    - REQ-ARP-007
    
**Security:**
    
    - **Encryption At Rest:** True
    
    - **Id:** ad-manager-cache-024  
**Name:** AdManagerCache  
**Description:** In-memory caching layer (Amazon ElastiCache - Redis) used to store frequently accessed data like ad network specifications, user roles/permissions, configuration, and query results to improve performance.  
**Type:** Cache  
**Dependencies:**
    
    
**Properties:**
    
    - **Engine:** Redis
    
**Technology:** Amazon ElastiCache for Redis  
**Resources:**
    
    - **Instance Type:** cache.m5.large or similar
    
**Configuration:**
    
    - **Cluster Mode Enabled:** True
    - **Default Ttlseconds:** 3600
    
**Health Check:** None  
**Responsible Features:**
    
    
**Security:**
    
    - **Encryption In Transit:** True
    - **Encryption At Rest:** True
    
    - **Id:** security-layer-authentication-delegator-026  
**Name:** AuthenticationDelegator  
**Description:** Component responsible for integrating with `[PlatformName]` core e-commerce platform's existing user authentication system or Amazon Cognito. Handles token issuance/validation for Ad Manager access.  
**Type:** SecurityService  
**Dependencies:**
    
    - core-platform-integration-service-013
    
**Properties:**
    
    
**Technology:** AWS Lambda (if custom logic needed), Amazon Cognito  
**Resources:**
    
    
**Configuration:**
    
    - **Token Issuer:** admanager.[PlatformName].sa
    - **Token Expiry Minutes:** 60
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-IAM-006
    - REQ-IAM-007
    - REQ-CPSI-003
    
**Security:**
    
    
    - **Id:** security-layer-authorization-engine-027  
**Name:** AuthorizationEngine  
**Description:** Enforces Role-Based Access Control (RBAC) permissions. This logic is primarily within UserAccessManagementService but can be conceptualized as a distinct security capability applied across services.  
**Type:** SecurityCapability  
**Dependencies:**
    
    - user-access-management-service-009
    
**Properties:**
    
    
**Technology:** Implemented within NestJS services using Guards/Interceptors  
**Resources:**
    
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-IAM-002
    - REQ-IAM-008
    
**Security:**
    
    
    - **Id:** security-layer-secrets-manager-client-028  
**Name:** SecretsManagerClient  
**Description:** Client interface used by services to securely retrieve secrets (API keys, database credentials) from AWS Secrets Manager.  
**Type:** SecurityClientLibrary  
**Dependencies:**
    
    
**Properties:**
    
    
**Technology:** AWS SDK  
**Resources:**
    
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-03-004
    - REQ-POA-009
    
**Security:**
    
    
    - **Id:** security-layer-config-029  
**Name:** SecurityLayerConfiguration  
**Description:** Configuration and management of security infrastructure like AWS WAF, AWS KMS, AWS IAM policies specific to the Ad Manager platform.  
**Type:** SecurityConfiguration  
**Dependencies:**
    
    
**Properties:**
    
    
**Technology:** AWS WAF, AWS KMS, AWS IAM  
**Resources:**
    
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-POA-017
    
**Security:**
    
    
    - **Id:** operations-monitoring-layer-config-030  
**Name:** OperationsAndMonitoringConfiguration  
**Description:** Configuration of monitoring tools (CloudWatch Logs, Metrics, Alarms), distributed tracing (X-Ray), CI/CD pipelines (CodePipeline, CodeBuild, CodeDeploy), and IaC templates.  
**Type:** OperationsConfiguration  
**Dependencies:**
    
    
**Properties:**
    
    
**Technology:** Amazon CloudWatch, AWS X-Ray, AWS Developer Tools, AWS CDK/Terraform/CloudFormation  
**Resources:**
    
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-POA-002
    - REQ-POA-003
    - REQ-POA-004
    - REQ-POA-005
    - REQ-POA-008
    - REQ-POA-014
    
**Security:**
    
    
    - **Id:** shared-logging-library-031  
**Name:** SharedLoggingLibrary  
**Description:** A common library used by all microservices for standardized, structured logging (e.g., JSON format) to CloudWatch Logs.  
**Type:** Library  
**Dependencies:**
    
    
**Properties:**
    
    - **Language:** TypeScript
    
**Technology:** NPM Package (e.g., Winston wrapper)  
**Resources:**
    
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    
**Security:**
    
    
    - **Id:** shared-error-handling-library-032  
**Name:** SharedErrorHandlingLibrary  
**Description:** A common library providing standardized error types, error responses, and utilities for consistent error handling across microservices.  
**Type:** Library  
**Dependencies:**
    
    
**Properties:**
    
    - **Language:** TypeScript
    
**Technology:** NPM Package  
**Resources:**
    
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    
**Security:**
    
    
    - **Id:** shared-types-library-033  
**Name:** SharedTypesLibrary  
**Description:** A common library containing shared Data Transfer Objects (DTOs), enums, and type definitions used for inter-service communication and API contracts.  
**Type:** Library  
**Dependencies:**
    
    
**Properties:**
    
    - **Language:** TypeScript
    
**Technology:** NPM Package  
**Resources:**
    
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    
**Security:**
    
    
    - **Id:** shared-validation-library-034  
**Name:** SharedValidationLibrary  
**Description:** A common library providing shared validation rules and utilities (e.g., using class-validator with NestJS) for request payloads and data.  
**Type:** Library  
**Dependencies:**
    
    
**Properties:**
    
    - **Language:** TypeScript
    
**Technology:** NPM Package (e.g., class-validator)  
**Resources:**
    
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    
**Security:**
    
    
    - **Id:** shared-config-client-035  
**Name:** SharedConfigClient  
**Description:** A client library used by services to access centralized configurations, potentially from AWS Systems Manager Parameter Store or AWS AppConfig.  
**Type:** Library  
**Dependencies:**
    
    
**Properties:**
    
    - **Language:** TypeScript
    
**Technology:** NPM Package (AWS SDK wrapper)  
**Resources:**
    
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-POA-009
    
**Security:**
    
    
    - **Id:** shared-audit-log-client-036  
**Name:** SharedAuditLogClient  
**Description:** A common library for services to send audit log entries in a standardized format to a central audit log collector (e.g., a dedicated Kinesis stream or directly to a DynamoDB table/CloudWatch Logs group).  
**Type:** Library  
**Dependencies:**
    
    
**Properties:**
    
    - **Language:** TypeScript
    
**Technology:** NPM Package  
**Resources:**
    
    
**Configuration:**
    
    
**Health Check:** None  
**Responsible Features:**
    
    - REQ-IAM-009
    - REQ-MDGC-008
    
**Security:**
    
    
    
  - **Configuration:**
    
    - **Environment:** production
    - **Logging Level:** INFO
    - **Platform Domain:** [ActualPlatformDomain].sa
    - **Aws Region:** me-south-1
    - **Global Api Service Version:** v1
    
  


---

