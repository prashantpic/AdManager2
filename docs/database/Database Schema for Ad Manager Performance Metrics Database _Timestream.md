# Specification

# 1. Database Design

## 1.1. PerformanceMetric
High-volume advertising performance data, optimized for time-series queries. Stored in Amazon Timestream.

### 1.1.3. Attributes

### 1.1.3.1. time
Timestamp of the metric data point (e.g., hourly aggregation)

#### 1.1.3.1.2. Type
TIMESTAMP

#### 1.1.3.1.3. Is Required
True

#### 1.1.3.1.4. Is Primary Key
True

### 1.1.3.2. campaignId
#### 1.1.3.2.2. Type
UUID

#### 1.1.3.2.3. Is Required
False

#### 1.1.3.2.4. Is Dimension
True

### 1.1.3.3. adSetId
#### 1.1.3.3.2. Type
UUID

#### 1.1.3.3.3. Is Required
False

#### 1.1.3.3.4. Is Dimension
True

### 1.1.3.4. adId
#### 1.1.3.4.2. Type
UUID

#### 1.1.3.4.3. Is Required
False

#### 1.1.3.4.4. Is Dimension
True

### 1.1.3.5. adNetworkId
#### 1.1.3.5.2. Type
UUID

#### 1.1.3.5.3. Is Required
True

#### 1.1.3.5.4. Is Dimension
True

### 1.1.3.6. merchantId
#### 1.1.3.6.2. Type
UUID

#### 1.1.3.6.3. Is Required
True

#### 1.1.3.6.4. Is Dimension
True

### 1.1.3.7. impressions
#### 1.1.3.7.2. Type
BIGINT

#### 1.1.3.7.3. Is Required
False

#### 1.1.3.7.4. Is Measure
True

### 1.1.3.8. clicks
#### 1.1.3.8.2. Type
BIGINT

#### 1.1.3.8.3. Is Required
False

#### 1.1.3.8.4. Is Measure
True

### 1.1.3.9. spend
#### 1.1.3.9.2. Type
DOUBLE

#### 1.1.3.9.3. Is Required
False

#### 1.1.3.9.4. Is Measure
True

### 1.1.3.10. conversions
#### 1.1.3.10.2. Type
BIGINT

#### 1.1.3.10.3. Is Required
False

#### 1.1.3.10.4. Is Measure
True

### 1.1.3.11. roas
#### 1.1.3.11.2. Type
DOUBLE

#### 1.1.3.11.3. Is Required
False

#### 1.1.3.11.4. Is Measure
True

### 1.1.3.12. cpa
#### 1.1.3.12.2. Type
DOUBLE

#### 1.1.3.12.3. Is Required
False

#### 1.1.3.12.4. Is Measure
True

### 1.1.3.13. metadata
Optional dimension for grouping/filtering (e.g., 'device_type', 'country') - stored as concatenated string or multiple dimensions

#### 1.1.3.13.2. Type
VARCHAR

#### 1.1.3.13.3. Is Required
False


### 1.1.4. Primary Keys


### 1.1.5. Unique Constraints


### 1.1.6. Indexes




---

# 2. Diagrams

- **Diagram_Title:** Core Ad Management Schema  
**Diagram_Area:** Ad Campaigns and Assets  
**Explanation:** Diagram covering the core entities for managing advertising campaigns, ad sets, creatives, products for catalogs, audiences, promotions, A/B tests, and related performance summaries. It illustrates how these components are structured and linked, primarily anchored by the Merchant entity.  
**Mermaid_Text:** erDiagram
    Merchant {
        UUID id PK
    }
    Campaign {
        UUID id PK
        UUID merchantId FK
        VARCHAR name
        DECIMAL budget
        DATETIME startDate
        DATETIME endDate
        ENUM status
    }
    AdNetwork {
        UUID id PK
        VARCHAR name UK
        VARCHAR apiEndpoint
    }
    CampaignAdNetwork {
        UUID campaignId PK, FK
        UUID adNetworkId PK, FK
        ENUM status
    }
    AdSet {
        UUID id PK
        UUID campaignId FK
        UUID adNetworkId FK
        VARCHAR name
        ENUM budgetType
        DECIMAL budgetAmount
    }
    AdCreative {
        UUID id PK
        UUID adNetworkId FK
        UUID merchantId FK
        ENUM type
        VARCHAR contentUrl
        ENUM validationStatus
    }
    Ad {
        UUID id PK
        UUID adSetId FK
        UUID adCreativeId FK
        UUID promotionId FK
        VARCHAR destinationUrl
        ENUM status
    }
    Promotion {
        UUID id PK
        UUID merchantId FK
        VARCHAR name
        ENUM type
        DATETIME startDate
        DATETIME endDate
    }
    DiscountCode {
        UUID id PK
        UUID promotionId FK
        UUID merchantId FK
        VARCHAR code UK
        ENUM discountType
        DECIMAL discountValue
    }
    ABTest {
        UUID id PK
        UUID campaignId FK
        UUID merchantId FK
        VARCHAR name
        ENUM testType
        DATETIME startDate
        DATETIME endDate
    }
    Audience {
        UUID id PK
        UUID merchantId FK
        VARCHAR name
        ENUM type
    }
    ProductCatalog {
        UUID id PK
        UUID merchantId FK
        VARCHAR name
        ENUM status
    }
    Product {
        UUID id PK
        UUID productCatalogId FK
        UUID merchantId FK
        UUID coreProductId
        VARCHAR adTitle
    }
    LandingPage {
        UUID id PK
        UUID campaignId FK
        UUID merchantId FK
        VARCHAR title
        VARCHAR urlSlug UK
    }
    DailyCampaignPerformanceSummary {
        DATE date PK
        UUID campaignId PK, FK
        UUID adNetworkId PK, FK
        UUID merchantId PK, FK
        BIGINT totalImpressions
        DECIMAL totalSpend
    }

    Merchant ||--|{ Campaign : manages
    Merchant ||--|{ AdCreative : owns
    Merchant ||--|{ Promotion : offers
    Merchant ||--|{ Audience : defines
    Merchant ||--|{ ProductCatalog : manages
    Merchant ||--|{ LandingPage : owns
    Merchant ||--|{ DailyCampaignPerformanceSummary : summarizes_for

    Campaign ||--|{ CampaignAdNetwork : uses
    AdNetwork ||--|{ CampaignAdNetwork : used_by

    Campaign ||--|{ AdSet : contains
    AdNetwork ||--|{ AdSet : scoped_to

    AdSet ||--|{ Ad : includes
    AdCreative ||--|{ Ad : uses

    Promotion }|--o{ Ad : associated_with
    Promotion ||--|{ DiscountCode : provides

    Campaign ||--|{ ABTest : tests

    LandingPage }o--|| Campaign : optional_link

    ProductCatalog ||--|{ Product : contains

    Campaign ||--|{ DailyCampaignPerformanceSummary : summarized_in
    AdNetwork ||--|{ DailyCampaignPerformanceSummary : summarized_in
  
- **Diagram_Title:** Platform & Merchant Configuration Schema  
**Diagram_Area:** Platform Administration and Billing  
**Explanation:** Diagram showing entities related to user management, roles, auditing, system configuration, third-party integrations, subscriptions, billing, affiliate programs, and merchant-specific settings like SEO and gift options. It connects these entities to the central Merchant and conceptual external systems like Core User and Core Order.  
**Mermaid_Text:** erDiagram
    Merchant {
        UUID id PK
    }
    UserRole {
        UUID id PK
        VARCHAR name UK
    }
    AdManagerUser {
        UUID id PK
        UUID coreUserId UK
        UUID roleId FK
        UUID merchantId FK
    }
    AuditLog {
        UUID id PK
        UUID userId FK
        UUID merchantId FK
        VARCHAR action
        TIMESTAMP timestamp
    }
    ConfigurationSetting {
        UUID id PK
        VARCHAR key UK
        UUID merchantId FK, UK
        TEXT value
    }
    IntegrationConfig {
        UUID id PK
        UUID merchantId FK, UK
        ENUM integrationType UK
        JSON configuration
    }
    SubscriptionPlan {
        UUID id PK
        VARCHAR name UK
        DECIMAL monthlyPrice
    }
    Subscription {
        UUID id PK
        UUID merchantId FK, UK
        UUID planId FK
        DATETIME startDate
        ENUM status
    }
    Invoice {
        UUID id PK
        UUID merchantId FK
        UUID subscriptionId FK
        DATE issueDate
        DECIMAL amount
    }
    Payment {
        UUID id PK
        UUID invoiceId FK
        UUID merchantId FK
        VARCHAR gatewayTransactionId UK
        DECIMAL amount
        ENUM status
    }
    AffiliateProgram {
        UUID id PK
        UUID merchantId FK, UK
        VARCHAR name
        ENUM status
    }
    Affiliate {
        UUID id PK
        UUID affiliateProgramId FK
        UUID coreUserId
        ENUM status
        VARCHAR trackingCode UK
    }
    AffiliateConversion {
        UUID id PK
        UUID affiliateId FK
        UUID coreOrderId UK
        DATETIMEOFFSET conversionTimestamp
        DECIMAL commissionAmount
    }
    AffiliatePayout {
        UUID id PK
        UUID affiliateId FK
        DATE periodStartDate
        DATE periodEndDate
        DECIMAL amount
        ENUM status
    }
    GiftOption {
        UUID id PK
        UUID merchantId FK
        VARCHAR name
        ENUM type
        BOOLEAN isActive
    }
    SeoSetting {
        UUID id PK
        UUID merchantId FK
        ENUM pageType UK
        UUID coreEntityId UK
    }
    CoreUser {
        UUID id PK "External User"
    }
    CoreOrder {
        UUID id PK "External Order"
    }


    Merchant ||--|{ AdManagerUser : manages
    Merchant }|--o{ AuditLog : affects
    Merchant }|--o{ ConfigurationSetting : customizes
    Merchant ||--|{ IntegrationConfig : configures
    Merchant ||--|| Subscription : subscribes
    Merchant ||--|{ Invoice : receives
    Merchant ||--|{ Payment : makes
    Merchant ||--|| AffiliateProgram : manages
    Merchant ||--|{ GiftOption : offers
    Merchant ||--|{ SeoSetting : configures

    UserRole ||--|{ AdManagerUser : assigns

    AdManagerUser }|--o{ AuditLog : performs

    SubscriptionPlan ||--|{ Subscription : defines

    Subscription ||--|{ Invoice : generates

    Invoice ||--|{ Payment : records

    AffiliateProgram ||--|{ Affiliate : has

    Affiliate ||--|{ AffiliateConversion : generates

    Affiliate ||--|{ AffiliatePayout : receives

    CoreUser }|--|{ Affiliate : corresponds_to
    CoreOrder }|--|| AffiliateConversion : corresponds_to
  


---

