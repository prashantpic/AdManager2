# Specification

# 1. Database Design

## 1.1. ProductFeedData
Stores raw and processed product feed data for submission to ad networks. Suitable for high-volume and semi-structured data.

### 1.1.3. Attributes

### 1.1.3.1. pk
Partition Key: MERCHANT#<merchantId>#CATALOG#<catalogId>

#### 1.1.3.1.2. Type
STRING

#### 1.1.3.1.3. Is Required
True

#### 1.1.3.1.4. Is Primary Key
True

### 1.1.3.2. sk
Sort Key: FEED#<adNetworkId>#<timestamp>

#### 1.1.3.2.2. Type
STRING

#### 1.1.3.2.3. Is Required
True

#### 1.1.3.2.4. Is Primary Key
True

### 1.1.3.3. merchantId
#### 1.1.3.3.2. Type
UUID

#### 1.1.3.3.3. Is Required
True

### 1.1.3.4. catalogId
#### 1.1.3.4.2. Type
UUID

#### 1.1.3.4.3. Is Required
True

### 1.1.3.5. adNetworkId
#### 1.1.3.5.2. Type
UUID

#### 1.1.3.5.3. Is Required
True

### 1.1.3.6. timestamp
#### 1.1.3.6.2. Type
DATETIMEOFFSET

#### 1.1.3.6.3. Is Required
True

### 1.1.3.7. feedData
The product feed data, likely stored as a large string (CSV, XML, JSON)

#### 1.1.3.7.2. Type
STRING

#### 1.1.3.7.3. Is Required
True

### 1.1.3.8. status
#### 1.1.3.8.2. Type
ENUM

#### 1.1.3.8.3. Is Required
True

#### 1.1.3.8.4. Constraints

- Generated
- Submitted
- Processing
- Completed
- Failed

#### 1.1.3.8.5. Default Value
'Generated'

### 1.1.3.9. syncDetails
Details about the submission and processing status on the ad network side

#### 1.1.3.9.2. Type
JSON

#### 1.1.3.9.3. Is Required
False


### 1.1.4. Primary Keys

- pk
- sk

### 1.1.5. Unique Constraints


### 1.1.6. Indexes

### 1.1.6.1. GSI1
Query feeds by merchant and time

#### 1.1.6.1.2. Type
GSI

#### 1.1.6.1.3. Partition Key
merchantId

#### 1.1.6.1.4. Sort Key
timestamp

#### 1.1.6.1.5. Projection Type
ALL

### 1.1.6.2. GSI2
Query feeds by ad network and time

#### 1.1.6.2.2. Type
GSI

#### 1.1.6.2.3. Partition Key
adNetworkId

#### 1.1.6.2.4. Sort Key
timestamp

#### 1.1.6.2.5. Projection Type
ALL


## 1.2. ABTestEventLog
Detailed event logs for A/B test interactions (views, clicks, conversions per variant). High write volume, requires efficient append patterns.

### 1.2.3. Attributes

### 1.2.3.1. pk
Partition Key: ABTEST#<abTestId>

#### 1.2.3.1.2. Type
STRING

#### 1.2.3.1.3. Is Required
True

#### 1.2.3.1.4. Is Primary Key
True

### 1.2.3.2. sk
Sort Key: EVENT#<timestamp>#<userId>

#### 1.2.3.2.2. Type
STRING

#### 1.2.3.2.3. Is Required
True

#### 1.2.3.2.4. Is Primary Key
True

### 1.2.3.3. abTestId
#### 1.2.3.3.2. Type
UUID

#### 1.2.3.3.3. Is Required
True

### 1.2.3.4. timestamp
#### 1.2.3.4.2. Type
DATETIMEOFFSET

#### 1.2.3.4.3. Is Required
True

### 1.2.3.5. userId
Core user ID, if available

#### 1.2.3.5.2. Type
UUID

#### 1.2.3.5.3. Is Required
False

### 1.2.3.6. eventType
#### 1.2.3.6.2. Type
ENUM

#### 1.2.3.6.3. Is Required
True

#### 1.2.3.6.4. Constraints

- View
- Click
- Conversion

### 1.2.3.7. variantId
The variant ID involved in the event

#### 1.2.3.7.2. Type
UUID

#### 1.2.3.7.3. Is Required
True

### 1.2.3.8. eventData
JSON document with context-specific event data (e.g., URL, IP, browser, product IDs)

#### 1.2.3.8.2. Type
JSON

#### 1.2.3.8.3. Is Required
False


### 1.2.4. Primary Keys

- pk
- sk

### 1.2.5. Unique Constraints


### 1.2.6. Indexes

### 1.2.6.1. GSI1
Query events by variant and time

#### 1.2.6.1.2. Type
GSI

#### 1.2.6.1.3. Partition Key
variantId

#### 1.2.6.1.4. Sort Key
timestamp

#### 1.2.6.1.5. Projection Type
ALL

### 1.2.6.2. GSI2
Query events by user and time

#### 1.2.6.2.2. Type
GSI

#### 1.2.6.2.3. Partition Key
userId

#### 1.2.6.2.4. Sort Key
timestamp

#### 1.2.6.2.5. Projection Type
ALL


## 1.3. UserPreference
Stores user-specific settings and preferences for the Ad Manager UI and notifications.

### 1.3.3. Attributes

### 1.3.3.1. pk
Partition Key: USER#<adManagerUserId>

#### 1.3.3.1.2. Type
STRING

#### 1.3.3.1.3. Is Required
True

#### 1.3.3.1.4. Is Primary Key
True

### 1.3.3.2. sk
Sort Key: PREF#<preferenceType> (e.g., 'UI', 'NOTIFICATIONS')

#### 1.3.3.2.2. Type
STRING

#### 1.3.3.2.3. Is Required
True

#### 1.3.3.2.4. Is Primary Key
True

### 1.3.3.3. adManagerUserId
#### 1.3.3.3.2. Type
UUID

#### 1.3.3.3.3. Is Required
True

### 1.3.3.4. preferenceType
#### 1.3.3.4.2. Type
VARCHAR

#### 1.3.3.4.3. Is Required
True

#### 1.3.3.4.4. Size
50

### 1.3.3.5. settings
JSON document containing the preference settings

#### 1.3.3.5.2. Type
JSON

#### 1.3.3.5.3. Is Required
True

### 1.3.3.6. createdAt
#### 1.3.3.6.2. Type
DATETIMEOFFSET

#### 1.3.3.6.3. Is Required
True

#### 1.3.3.6.4. Default Value
CURRENT_TIMESTAMP

### 1.3.3.7. updatedAt
#### 1.3.3.7.2. Type
DATETIMEOFFSET

#### 1.3.3.7.3. Is Required
True

#### 1.3.3.7.4. Default Value
CURRENT_TIMESTAMP


### 1.3.4. Primary Keys

- pk
- sk

### 1.3.5. Unique Constraints


### 1.3.6. Indexes

### 1.3.6.1. GSI1
Query preferences for a specific user

#### 1.3.6.1.2. Type
GSI

#### 1.3.6.1.3. Partition Key
adManagerUserId

#### 1.3.6.1.4. Sort Key
preferenceType

#### 1.3.6.1.5. Projection Type
ALL




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

