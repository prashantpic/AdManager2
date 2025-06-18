# Specification

# 1. Entities

## 1.1. Campaign
Represents an advertising campaign with budget, schedule and status. For high-volume systems, this table can be partitioned by `endDate` (e.g., yearly) for archival and performance.

### 1.1.3. Attributes

### 1.1.3.1. id
#### 1.1.3.1.2. Type
UUID

#### 1.1.3.1.3. Is Required
True

#### 1.1.3.1.4. Is Primary Key
True

### 1.1.3.2. name
#### 1.1.3.2.2. Type
VARCHAR

#### 1.1.3.2.3. Is Required
True

#### 1.1.3.2.4. Size
255

### 1.1.3.3. budget
#### 1.1.3.3.2. Type
DECIMAL

#### 1.1.3.3.3. Is Required
True

#### 1.1.3.3.4. Precision
15

#### 1.1.3.3.5. Scale
2

### 1.1.3.4. startDate
#### 1.1.3.4.2. Type
DATETIME

#### 1.1.3.4.3. Is Required
True

### 1.1.3.5. endDate
#### 1.1.3.5.2. Type
DATETIME

#### 1.1.3.5.3. Is Required
True

### 1.1.3.6. status
#### 1.1.3.6.2. Type
ENUM

#### 1.1.3.6.3. Is Required
True

#### 1.1.3.6.4. Constraints

- Draft
- Active
- Paused
- Archived

#### 1.1.3.6.5. Default Value
'Draft'

### 1.1.3.7. merchantId
#### 1.1.3.7.2. Type
UUID

#### 1.1.3.7.3. Is Required
True

#### 1.1.3.7.4. Is Foreign Key
True

### 1.1.3.8. createdAt
#### 1.1.3.8.2. Type
DATETIMEOFFSET

#### 1.1.3.8.3. Is Required
True

#### 1.1.3.8.4. Default Value
CURRENT_TIMESTAMP

### 1.1.3.9. updatedAt
#### 1.1.3.9.2. Type
DATETIMEOFFSET

#### 1.1.3.9.3. Is Required
True


### 1.1.4. Primary Keys

- id

### 1.1.5. Unique Constraints


### 1.1.6. Indexes

### 1.1.6.1. idx_campaign_merchant_status_start
#### 1.1.6.1.2. Columns

- merchantId
- status
- startDate

### 1.1.6.2. idx_campaign_merchant_end_status
#### 1.1.6.2.2. Columns

- merchantId
- endDate
- status


## 1.2. AdNetwork
Supported advertising networks like Google, Instagram, TikTok. Data for this entity is relatively static and suitable for caching (e.g., name, API endpoint, specifications) to reduce DB load.

### 1.2.3. Attributes

### 1.2.3.1. id
#### 1.2.3.1.2. Type
UUID

#### 1.2.3.1.3. Is Required
True

#### 1.2.3.1.4. Is Primary Key
True

### 1.2.3.2. name
#### 1.2.3.2.2. Type
VARCHAR

#### 1.2.3.2.3. Is Required
True

#### 1.2.3.2.4. Size
50

#### 1.2.3.2.5. Is Unique
True

### 1.2.3.3. apiEndpoint
#### 1.2.3.3.2. Type
VARCHAR

#### 1.2.3.3.3. Is Required
True

#### 1.2.3.3.4. Size
255

### 1.2.3.4. specifications
#### 1.2.3.4.2. Type
JSON

#### 1.2.3.4.3. Is Required
False


### 1.2.4. Primary Keys

- id

### 1.2.5. Unique Constraints

### 1.2.5.1. uq_adnetwork_name
#### 1.2.5.1.2. Columns

- name


### 1.2.6. Indexes


## 1.3. CampaignAdNetwork
Mapping between campaigns and ad networks, with status per network.

### 1.3.3. Attributes

### 1.3.3.1. campaignId
#### 1.3.3.1.2. Type
UUID

#### 1.3.3.1.3. Is Required
True

#### 1.3.3.1.4. Is Foreign Key
True

#### 1.3.3.1.5. Is Primary Key
True

### 1.3.3.2. adNetworkId
#### 1.3.3.2.2. Type
UUID

#### 1.3.3.2.3. Is Required
True

#### 1.3.3.2.4. Is Foreign Key
True

#### 1.3.3.2.5. Is Primary Key
True

### 1.3.3.3. status
#### 1.3.3.3.2. Type
ENUM

#### 1.3.3.3.3. Is Required
True

#### 1.3.3.3.4. Constraints

- Active
- Paused


### 1.3.4. Primary Keys

- campaignId
- adNetworkId

### 1.3.5. Unique Constraints


### 1.3.6. Indexes

### 1.3.6.1. idx_campaignadnetwork_reverse
#### 1.3.6.1.2. Columns

- adNetworkId
- campaignId


## 1.4. AdSet
Group of ads within a campaign with specific targeting

### 1.4.3. Attributes

### 1.4.3.1. id
#### 1.4.3.1.2. Type
UUID

#### 1.4.3.1.3. Is Required
True

#### 1.4.3.1.4. Is Primary Key
True

### 1.4.3.2. name
#### 1.4.3.2.2. Type
VARCHAR

#### 1.4.3.2.3. Is Required
True

#### 1.4.3.2.4. Size
255

### 1.4.3.3. budgetType
#### 1.4.3.3.2. Type
ENUM

#### 1.4.3.3.3. Is Required
True

#### 1.4.3.3.4. Constraints

- Daily
- Lifetime

### 1.4.3.4. budgetAmount
#### 1.4.3.4.2. Type
DECIMAL

#### 1.4.3.4.3. Is Required
True

#### 1.4.3.4.4. Precision
15

#### 1.4.3.4.5. Scale
2

### 1.4.3.5. targetingCriteria
#### 1.4.3.5.2. Type
JSON

#### 1.4.3.5.3. Is Required
True

### 1.4.3.6. biddingStrategy
#### 1.4.3.6.2. Type
VARCHAR

#### 1.4.3.6.3. Is Required
True

#### 1.4.3.6.4. Size
50

### 1.4.3.7. campaignId
#### 1.4.3.7.2. Type
UUID

#### 1.4.3.7.3. Is Required
True

#### 1.4.3.7.4. Is Foreign Key
True

### 1.4.3.8. createdAt
#### 1.4.3.8.2. Type
DATETIMEOFFSET

#### 1.4.3.8.3. Is Required
True


### 1.4.4. Primary Keys

- id

### 1.4.5. Unique Constraints


### 1.4.6. Indexes

### 1.4.6.1. idx_adset_campaignid
#### 1.4.6.1.2. Columns

- campaignId


## 1.5. AdCreative
Creative assets for advertisements

### 1.5.3. Attributes

### 1.5.3.1. id
#### 1.5.3.1.2. Type
UUID

#### 1.5.3.1.3. Is Required
True

#### 1.5.3.1.4. Is Primary Key
True

### 1.5.3.2. type
#### 1.5.3.2.2. Type
ENUM

#### 1.5.3.2.3. Is Required
True

#### 1.5.3.2.4. Constraints

- Image
- Video
- Text

### 1.5.3.3. contentUrl
#### 1.5.3.3.2. Type
VARCHAR

#### 1.5.3.3.3. Is Required
True

#### 1.5.3.3.4. Size
2048

### 1.5.3.4. adCopy
#### 1.5.3.4.2. Type
TEXT

#### 1.5.3.4.3. Is Required
False

### 1.5.3.5. headline
#### 1.5.3.5.2. Type
VARCHAR

#### 1.5.3.5.3. Is Required
False

#### 1.5.3.5.4. Size
255

### 1.5.3.6. validationStatus
#### 1.5.3.6.2. Type
ENUM

#### 1.5.3.6.3. Is Required
True

#### 1.5.3.6.4. Constraints

- Pending
- Approved
- Rejected

#### 1.5.3.6.5. Default Value
'Pending'

### 1.5.3.7. adNetworkId
#### 1.5.3.7.2. Type
UUID

#### 1.5.3.7.3. Is Required
True

#### 1.5.3.7.4. Is Foreign Key
True

### 1.5.3.8. merchantId
#### 1.5.3.8.2. Type
UUID

#### 1.5.3.8.3. Is Required
True

#### 1.5.3.8.4. Is Foreign Key
True


### 1.5.4. Primary Keys

- id

### 1.5.5. Unique Constraints


### 1.5.6. Indexes

### 1.5.6.1. idx_adcreative_merchant_network_status
#### 1.5.6.1.2. Columns

- merchantId
- adNetworkId
- validationStatus


## 1.6. Ad
Individual advertisement instance

### 1.6.3. Attributes

### 1.6.3.1. id
#### 1.6.3.1.2. Type
UUID

#### 1.6.3.1.3. Is Required
True

#### 1.6.3.1.4. Is Primary Key
True

### 1.6.3.2. destinationUrl
#### 1.6.3.2.2. Type
VARCHAR

#### 1.6.3.2.3. Is Required
True

#### 1.6.3.2.4. Size
2048

### 1.6.3.3. status
#### 1.6.3.3.2. Type
ENUM

#### 1.6.3.3.3. Is Required
True

#### 1.6.3.3.4. Constraints

- Active
- Paused

#### 1.6.3.3.5. Default Value
'Active'

### 1.6.3.4. adSetId
#### 1.6.3.4.2. Type
UUID

#### 1.6.3.4.3. Is Required
True

#### 1.6.3.4.4. Is Foreign Key
True

### 1.6.3.5. adCreativeId
#### 1.6.3.5.2. Type
UUID

#### 1.6.3.5.3. Is Required
True

#### 1.6.3.5.4. Is Foreign Key
True

### 1.6.3.6. promotionId
#### 1.6.3.6.2. Type
UUID

#### 1.6.3.6.3. Is Required
False

#### 1.6.3.6.4. Is Foreign Key
True


### 1.6.4. Primary Keys

- id

### 1.6.5. Unique Constraints


### 1.6.6. Indexes

### 1.6.6.1. idx_ad_adsetid
#### 1.6.6.1.2. Columns

- adSetId

### 1.6.6.2. idx_ad_promotionid
#### 1.6.6.2.2. Columns

- promotionId


## 1.7. ProductCatalog
Collection of products for advertising

### 1.7.3. Attributes

### 1.7.3.1. id
#### 1.7.3.1.2. Type
UUID

#### 1.7.3.1.3. Is Required
True

#### 1.7.3.1.4. Is Primary Key
True

### 1.7.3.2. name
#### 1.7.3.2.2. Type
VARCHAR

#### 1.7.3.2.3. Is Required
True

#### 1.7.3.2.4. Size
255

### 1.7.3.3. status
#### 1.7.3.3.2. Type
ENUM

#### 1.7.3.3.3. Is Required
True

#### 1.7.3.3.4. Constraints

- Active
- Archived

### 1.7.3.4. merchantId
#### 1.7.3.4.2. Type
UUID

#### 1.7.3.4.3. Is Required
True

#### 1.7.3.4.4. Is Foreign Key
True

### 1.7.3.5. coreCatalogId
#### 1.7.3.5.2. Type
UUID

#### 1.7.3.5.3. Is Required
True

### 1.7.3.6. lastSyncedAt
#### 1.7.3.6.2. Type
DATETIMEOFFSET

#### 1.7.3.6.3. Is Required
False


### 1.7.4. Primary Keys

- id

### 1.7.5. Unique Constraints


### 1.7.6. Indexes


## 1.8. Product
Products with advertising-specific customizations

### 1.8.3. Attributes

### 1.8.3.1. id
#### 1.8.3.1.2. Type
UUID

#### 1.8.3.1.3. Is Required
True

#### 1.8.3.1.4. Is Primary Key
True

### 1.8.3.2. coreProductId
#### 1.8.3.2.2. Type
UUID

#### 1.8.3.2.3. Is Required
True

### 1.8.3.3. adTitle
#### 1.8.3.3.2. Type
VARCHAR

#### 1.8.3.3.3. Is Required
False

#### 1.8.3.3.4. Size
255

### 1.8.3.4. adDescription
#### 1.8.3.4.2. Type
TEXT

#### 1.8.3.4.3. Is Required
False

### 1.8.3.5. adImageUrl
#### 1.8.3.5.2. Type
VARCHAR

#### 1.8.3.5.3. Is Required
False

#### 1.8.3.5.4. Size
2048

### 1.8.3.6. productCatalogId
#### 1.8.3.6.2. Type
UUID

#### 1.8.3.6.3. Is Required
True

#### 1.8.3.6.4. Is Foreign Key
True

### 1.8.3.7. isActive
#### 1.8.3.7.2. Type
BOOLEAN

#### 1.8.3.7.3. Is Required
True

#### 1.8.3.7.4. Default Value
True

### 1.8.3.8. merchantId
#### 1.8.3.8.2. Type
UUID

#### 1.8.3.8.3. Is Required
True

#### 1.8.3.8.4. Is Foreign Key
True


### 1.8.4. Primary Keys

- id

### 1.8.5. Unique Constraints


### 1.8.6. Indexes

### 1.8.6.1. idx_product_merchant_active_catalog
#### 1.8.6.1.2. Columns

- merchantId
- isActive
- productCatalogId


## 1.9. Promotion
Marketing promotions and discounts

### 1.9.3. Attributes

### 1.9.3.1. id
#### 1.9.3.1.2. Type
UUID

#### 1.9.3.1.3. Is Required
True

#### 1.9.3.1.4. Is Primary Key
True

### 1.9.3.2. name
#### 1.9.3.2.2. Type
VARCHAR

#### 1.9.3.2.3. Is Required
True

#### 1.9.3.2.4. Size
255

### 1.9.3.3. type
#### 1.9.3.3.2. Type
ENUM

#### 1.9.3.3.3. Is Required
True

#### 1.9.3.3.4. Constraints

- DiscountCode
- BOGO
- Tiered

### 1.9.3.4. startDate
#### 1.9.3.4.2. Type
DATETIME

#### 1.9.3.4.3. Is Required
True

### 1.9.3.5. endDate
#### 1.9.3.5.2. Type
DATETIME

#### 1.9.3.5.3. Is Required
True

### 1.9.3.6. applicationMethod
#### 1.9.3.6.2. Type
ENUM

#### 1.9.3.6.3. Is Required
True

#### 1.9.3.6.4. Constraints

- Automatic
- Manual

### 1.9.3.7. merchantId
#### 1.9.3.7.2. Type
UUID

#### 1.9.3.7.3. Is Required
True

#### 1.9.3.7.4. Is Foreign Key
True


### 1.9.4. Primary Keys

- id

### 1.9.5. Unique Constraints


### 1.9.6. Indexes


## 1.10. DiscountCode
Discount code promotions

### 1.10.3. Attributes

### 1.10.3.1. id
#### 1.10.3.1.2. Type
UUID

#### 1.10.3.1.3. Is Required
True

#### 1.10.3.1.4. Is Primary Key
True

### 1.10.3.2. codePattern
#### 1.10.3.2.2. Type
VARCHAR

#### 1.10.3.2.3. Is Required
True

#### 1.10.3.2.4. Size
50

### 1.10.3.3. discountType
#### 1.10.3.3.2. Type
ENUM

#### 1.10.3.3.3. Is Required
True

#### 1.10.3.3.4. Constraints

- Percentage
- Fixed

### 1.10.3.4. discountValue
#### 1.10.3.4.2. Type
DECIMAL

#### 1.10.3.4.3. Is Required
True

#### 1.10.3.4.4. Precision
10

#### 1.10.3.4.5. Scale
2

### 1.10.3.5. minPurchaseAmount
#### 1.10.3.5.2. Type
DECIMAL

#### 1.10.3.5.3. Is Required
False

#### 1.10.3.5.4. Precision
15

#### 1.10.3.5.5. Scale
2

### 1.10.3.6. usageLimit
#### 1.10.3.6.2. Type
ENUM

#### 1.10.3.6.3. Is Required
True

#### 1.10.3.6.4. Constraints

- SinglePerCustomer
- SingleGlobal
- Multiple

### 1.10.3.7. promotionId
#### 1.10.3.7.2. Type
UUID

#### 1.10.3.7.3. Is Required
True

#### 1.10.3.7.4. Is Foreign Key
True

### 1.10.3.8. merchantId
#### 1.10.3.8.2. Type
UUID

#### 1.10.3.8.3. Is Required
True

#### 1.10.3.8.4. Is Foreign Key
True


### 1.10.4. Primary Keys

- id

### 1.10.5. Unique Constraints

### 1.10.5.1. uq_discountcode_merchant_codepattern
#### 1.10.5.1.2. Columns

- merchantId
- codePattern


### 1.10.6. Indexes

### 1.10.6.1. idx_discountcode_merchant_promotion
#### 1.10.6.1.2. Columns

- merchantId
- promotionId


## 1.11. ABTest
A/B testing configurations and results

### 1.11.3. Attributes

### 1.11.3.1. id
#### 1.11.3.1.2. Type
UUID

#### 1.11.3.1.3. Is Required
True

#### 1.11.3.1.4. Is Primary Key
True

### 1.11.3.2. testType
#### 1.11.3.2.2. Type
ENUM

#### 1.11.3.2.3. Is Required
True

#### 1.11.3.2.4. Constraints

- Creative
- Copy
- LandingPage
- Offer

### 1.11.3.3. startDate
#### 1.11.3.3.2. Type
DATETIME

#### 1.11.3.3.3. Is Required
True

### 1.11.3.4. endDate
#### 1.11.3.4.2. Type
DATETIME

#### 1.11.3.4.3. Is Required
True

### 1.11.3.5. status
#### 1.11.3.5.2. Type
ENUM

#### 1.11.3.5.3. Is Required
True

#### 1.11.3.5.4. Constraints

- Running
- Completed

### 1.11.3.6. winningVariant
#### 1.11.3.6.2. Type
UUID

#### 1.11.3.6.3. Is Required
False

### 1.11.3.7. confidenceLevel
#### 1.11.3.7.2. Type
DECIMAL

#### 1.11.3.7.3. Is Required
False

#### 1.11.3.7.4. Precision
5

#### 1.11.3.7.5. Scale
4

### 1.11.3.8. campaignId
#### 1.11.3.8.2. Type
UUID

#### 1.11.3.8.3. Is Required
True

#### 1.11.3.8.4. Is Foreign Key
True


### 1.11.4. Primary Keys

- id

### 1.11.5. Unique Constraints


### 1.11.6. Indexes


## 1.12. Audience
Targeting audiences for campaigns

### 1.12.3. Attributes

### 1.12.3.1. id
#### 1.12.3.1.2. Type
UUID

#### 1.12.3.1.3. Is Required
True

#### 1.12.3.1.4. Is Primary Key
True

### 1.12.3.2. name
#### 1.12.3.2.2. Type
VARCHAR

#### 1.12.3.2.3. Is Required
True

#### 1.12.3.2.4. Size
255

### 1.12.3.3. type
#### 1.12.3.3.2. Type
ENUM

#### 1.12.3.3.3. Is Required
True

#### 1.12.3.3.4. Constraints

- Custom
- Lookalike

### 1.12.3.4. source
#### 1.12.3.4.2. Type
ENUM

#### 1.12.3.4.3. Is Required
True

#### 1.12.3.4.4. Constraints

- Platform
- AdNetwork

### 1.12.3.5. criteria
#### 1.12.3.5.2. Type
JSON

#### 1.12.3.5.3. Is Required
True

### 1.12.3.6. merchantId
#### 1.12.3.6.2. Type
UUID

#### 1.12.3.6.3. Is Required
True

#### 1.12.3.6.4. Is Foreign Key
True


### 1.12.4. Primary Keys

- id

### 1.12.5. Unique Constraints


### 1.12.6. Indexes


## 1.13. PerformanceMetric
Advertising performance data. This table should be partitioned by the `date` column (e.g., range partitioning by month) for improved query performance and data management.

### 1.13.3. Attributes

### 1.13.3.1. id
#### 1.13.3.1.2. Type
UUID

#### 1.13.3.1.3. Is Required
True

#### 1.13.3.1.4. Is Primary Key
True

### 1.13.3.2. impressions
#### 1.13.3.2.2. Type
INT

#### 1.13.3.2.3. Is Required
True

### 1.13.3.3. clicks
#### 1.13.3.3.2. Type
INT

#### 1.13.3.3.3. Is Required
True

### 1.13.3.4. spend
#### 1.13.3.4.2. Type
DECIMAL

#### 1.13.3.4.3. Is Required
True

#### 1.13.3.4.4. Precision
15

#### 1.13.3.4.5. Scale
2

### 1.13.3.5. conversions
#### 1.13.3.5.2. Type
INT

#### 1.13.3.5.3. Is Required
True

### 1.13.3.6. roas
#### 1.13.3.6.2. Type
DECIMAL

#### 1.13.3.6.3. Is Required
True

#### 1.13.3.6.4. Precision
10

#### 1.13.3.6.5. Scale
2

### 1.13.3.7. cpa
#### 1.13.3.7.2. Type
DECIMAL

#### 1.13.3.7.3. Is Required
True

#### 1.13.3.7.4. Precision
10

#### 1.13.3.7.5. Scale
2

### 1.13.3.8. date
#### 1.13.3.8.2. Type
DATE

#### 1.13.3.8.3. Is Required
True

### 1.13.3.9. adId
#### 1.13.3.9.2. Type
UUID

#### 1.13.3.9.3. Is Required
False

#### 1.13.3.9.4. Is Foreign Key
True

### 1.13.3.10. adSetId
#### 1.13.3.10.2. Type
UUID

#### 1.13.3.10.3. Is Required
False

#### 1.13.3.10.4. Is Foreign Key
True

### 1.13.3.11. campaignId
#### 1.13.3.11.2. Type
UUID

#### 1.13.3.11.3. Is Required
False

#### 1.13.3.11.4. Is Foreign Key
True

### 1.13.3.12. adNetworkId
#### 1.13.3.12.2. Type
UUID

#### 1.13.3.12.3. Is Required
True

#### 1.13.3.12.4. Is Foreign Key
True


### 1.13.4. Primary Keys

- id

### 1.13.5. Unique Constraints


### 1.13.6. Indexes

### 1.13.6.1. idx_pm_date_campaign_network
#### 1.13.6.1.2. Columns

- date
- campaignId
- adNetworkId

### 1.13.6.2. idx_pm_campaign_date
#### 1.13.6.2.2. Columns

- campaignId
- date

### 1.13.6.3. idx_pm_adset_date
#### 1.13.6.3.2. Columns

- adSetId
- date

### 1.13.6.4. idx_pm_ad_date
#### 1.13.6.4.2. Columns

- adId
- date

### 1.13.6.5. idx_pm_network_date_roas
#### 1.13.6.5.2. Columns

- adNetworkId
- date
- roas

### 1.13.6.6. idx_pm_date
#### 1.13.6.6.2. Columns

- date


## 1.14. DailyCampaignPerformanceSummary
Materialized view or summary table storing pre-aggregated daily metrics (SUM of impressions, clicks, spend; AVG CPA, ROAS) at campaignId, adNetworkId, and date granularity. Refreshed periodically (e.g., nightly).

### 1.14.3. Attributes

### 1.14.3.1. date
#### 1.14.3.1.2. Type
DATE

#### 1.14.3.1.3. Is Required
True

#### 1.14.3.1.4. Is Primary Key
True

### 1.14.3.2. campaignId
#### 1.14.3.2.2. Type
UUID

#### 1.14.3.2.3. Is Required
True

#### 1.14.3.2.4. Is Primary Key
True

#### 1.14.3.2.5. Is Foreign Key
True

### 1.14.3.3. adNetworkId
#### 1.14.3.3.2. Type
UUID

#### 1.14.3.3.3. Is Required
True

#### 1.14.3.3.4. Is Primary Key
True

#### 1.14.3.3.5. Is Foreign Key
True

### 1.14.3.4. merchantId
#### 1.14.3.4.2. Type
UUID

#### 1.14.3.4.3. Is Required
True

#### 1.14.3.4.4. Is Foreign Key
True

### 1.14.3.5. totalImpressions
#### 1.14.3.5.2. Type
BIGINT

#### 1.14.3.5.3. Is Required
True

#### 1.14.3.5.4. Default Value
0

### 1.14.3.6. totalClicks
#### 1.14.3.6.2. Type
BIGINT

#### 1.14.3.6.3. Is Required
True

#### 1.14.3.6.4. Default Value
0

### 1.14.3.7. totalSpend
#### 1.14.3.7.2. Type
DECIMAL

#### 1.14.3.7.3. Is Required
True

#### 1.14.3.7.4. Precision
15

#### 1.14.3.7.5. Scale
2

#### 1.14.3.7.6. Default Value
0

### 1.14.3.8. avgCpa
#### 1.14.3.8.2. Type
DECIMAL

#### 1.14.3.8.3. Is Required
False

#### 1.14.3.8.4. Precision
10

#### 1.14.3.8.5. Scale
2

### 1.14.3.9. avgRoas
#### 1.14.3.9.2. Type
DECIMAL

#### 1.14.3.9.3. Is Required
False

#### 1.14.3.9.4. Precision
10

#### 1.14.3.9.5. Scale
2

### 1.14.3.10. updatedAt
#### 1.14.3.10.2. Type
DATETIMEOFFSET

#### 1.14.3.10.3. Is Required
True

#### 1.14.3.10.4. Default Value
CURRENT_TIMESTAMP


### 1.14.4. Primary Keys

- date
- campaignId
- adNetworkId

### 1.14.5. Unique Constraints


### 1.14.6. Indexes

### 1.14.6.1. idx_dcps_merchant_date
#### 1.14.6.1.2. Columns

- merchantId
- date


## 1.15. UserRole
RBAC roles for Ad Manager users. Role definitions and permissions are suitable for caching to speed up authorization checks.

### 1.15.3. Attributes

### 1.15.3.1. id
#### 1.15.3.1.2. Type
UUID

#### 1.15.3.1.3. Is Required
True

#### 1.15.3.1.4. Is Primary Key
True

### 1.15.3.2. name
#### 1.15.3.2.2. Type
VARCHAR

#### 1.15.3.2.3. Is Required
True

#### 1.15.3.2.4. Size
50

#### 1.15.3.2.5. Is Unique
True

### 1.15.3.3. description
#### 1.15.3.3.2. Type
TEXT

#### 1.15.3.3.3. Is Required
True

### 1.15.3.4. permissions
#### 1.15.3.4.2. Type
JSON

#### 1.15.3.4.3. Is Required
True


### 1.15.4. Primary Keys

- id

### 1.15.5. Unique Constraints

### 1.15.5.1. uq_userrole_name
#### 1.15.5.1.2. Columns

- name


### 1.15.6. Indexes


## 1.16. AdManagerUser
Users with access to Ad Manager

### 1.16.3. Attributes

### 1.16.3.1. id
#### 1.16.3.1.2. Type
UUID

#### 1.16.3.1.3. Is Required
True

#### 1.16.3.1.4. Is Primary Key
True

### 1.16.3.2. coreUserId
#### 1.16.3.2.2. Type
UUID

#### 1.16.3.2.3. Is Required
True

### 1.16.3.3. roleId
#### 1.16.3.3.2. Type
UUID

#### 1.16.3.3.3. Is Required
True

#### 1.16.3.3.4. Is Foreign Key
True

### 1.16.3.4. merchantId
#### 1.16.3.4.2. Type
UUID

#### 1.16.3.4.3. Is Required
True

#### 1.16.3.4.4. Is Foreign Key
True

### 1.16.3.5. lastLogin
#### 1.16.3.5.2. Type
DATETIMEOFFSET

#### 1.16.3.5.3. Is Required
False


### 1.16.4. Primary Keys

- id

### 1.16.5. Unique Constraints


### 1.16.6. Indexes


## 1.17. LandingPage
Interactive landing pages for campaigns

### 1.17.3. Attributes

### 1.17.3.1. id
#### 1.17.3.1.2. Type
UUID

#### 1.17.3.1.3. Is Required
True

#### 1.17.3.1.4. Is Primary Key
True

### 1.17.3.2. title
#### 1.17.3.2.2. Type
VARCHAR

#### 1.17.3.2.3. Is Required
True

#### 1.17.3.2.4. Size
255

### 1.17.3.3. urlSlug
#### 1.17.3.3.2. Type
VARCHAR

#### 1.17.3.3.3. Is Required
True

#### 1.17.3.3.4. Size
255

#### 1.17.3.3.5. Is Unique
True

### 1.17.3.4. content
#### 1.17.3.4.2. Type
JSON

#### 1.17.3.4.3. Is Required
True

### 1.17.3.5. metaTitle
#### 1.17.3.5.2. Type
VARCHAR

#### 1.17.3.5.3. Is Required
True

#### 1.17.3.5.4. Size
255

### 1.17.3.6. metaDescription
#### 1.17.3.6.2. Type
TEXT

#### 1.17.3.6.3. Is Required
True

### 1.17.3.7. status
#### 1.17.3.7.2. Type
ENUM

#### 1.17.3.7.3. Is Required
True

#### 1.17.3.7.4. Constraints

- Draft
- Published

### 1.17.3.8. campaignId
#### 1.17.3.8.2. Type
UUID

#### 1.17.3.8.3. Is Required
False

#### 1.17.3.8.4. Is Foreign Key
True

### 1.17.3.9. merchantId
#### 1.17.3.9.2. Type
UUID

#### 1.17.3.9.3. Is Required
True

#### 1.17.3.9.4. Is Foreign Key
True


### 1.17.4. Primary Keys

- id

### 1.17.5. Unique Constraints

### 1.17.5.1. uq_landingpage_urlslug
#### 1.17.5.1.2. Columns

- urlSlug


### 1.17.6. Indexes




---

# 2. Relations

## 2.1. Campaign_AdNetworks
### 2.1.3. Source Entity
Campaign

### 2.1.4. Target Entity
AdNetwork

### 2.1.5. Type
ManyToMany

### 2.1.6. Source Multiplicity
*

### 2.1.7. Target Multiplicity
*

### 2.1.8. Cascade Delete
False

### 2.1.9. Is Identifying
False

### 2.1.10. Join Table
### 2.1.10. CampaignAdNetwork
#### 2.1.10.2. Columns

- **Name:** campaignId  
**Type:** UUID  
**References:** Campaign.id  
- **Name:** adNetworkId  
**Type:** UUID  
**References:** AdNetwork.id  

### 2.1.11. On Delete
Cascade

### 2.1.12. On Update
NoAction

## 2.2. Campaign_AdSets
### 2.2.3. Source Entity
Campaign

### 2.2.4. Target Entity
AdSet

### 2.2.5. Type
OneToMany

### 2.2.6. Source Multiplicity
1

### 2.2.7. Target Multiplicity
*

### 2.2.8. Cascade Delete
True

### 2.2.9. Is Identifying
False

### 2.2.10. On Delete
Cascade

### 2.2.11. On Update
NoAction

## 2.3. AdSet_Ads
### 2.3.3. Source Entity
AdSet

### 2.3.4. Target Entity
Ad

### 2.3.5. Type
OneToMany

### 2.3.6. Source Multiplicity
1

### 2.3.7. Target Multiplicity
*

### 2.3.8. Cascade Delete
True

### 2.3.9. Is Identifying
False

### 2.3.10. On Delete
Cascade

### 2.3.11. On Update
NoAction

## 2.4. AdCreative_Ads
### 2.4.3. Source Entity
AdCreative

### 2.4.4. Target Entity
Ad

### 2.4.5. Type
OneToMany

### 2.4.6. Source Multiplicity
1

### 2.4.7. Target Multiplicity
*

### 2.4.8. Cascade Delete
False

### 2.4.9. Is Identifying
False

### 2.4.10. On Delete
Restrict

### 2.4.11. On Update
NoAction

## 2.5. Promotion_Ads
### 2.5.3. Source Entity
Promotion

### 2.5.4. Target Entity
Ad

### 2.5.5. Type
OneToMany

### 2.5.6. Source Multiplicity
1

### 2.5.7. Target Multiplicity
*

### 2.5.8. Cascade Delete
False

### 2.5.9. Is Identifying
False

### 2.5.10. On Delete
SetNull

### 2.5.11. On Update
NoAction

## 2.6. Promotion_DiscountCodes
### 2.6.3. Source Entity
Promotion

### 2.6.4. Target Entity
DiscountCode

### 2.6.5. Type
OneToMany

### 2.6.6. Source Multiplicity
1

### 2.6.7. Target Multiplicity
*

### 2.6.8. Cascade Delete
True

### 2.6.9. Is Identifying
False

### 2.6.10. On Delete
Cascade

### 2.6.11. On Update
NoAction

## 2.7. Campaign_ABTests
### 2.7.3. Source Entity
Campaign

### 2.7.4. Target Entity
ABTest

### 2.7.5. Type
OneToMany

### 2.7.6. Source Multiplicity
1

### 2.7.7. Target Multiplicity
*

### 2.7.8. Cascade Delete
True

### 2.7.9. Is Identifying
False

### 2.7.10. On Delete
Cascade

### 2.7.11. On Update
NoAction

## 2.8. AdNetwork_AdCreatives
### 2.8.3. Source Entity
AdNetwork

### 2.8.4. Target Entity
AdCreative

### 2.8.5. Type
OneToMany

### 2.8.6. Source Multiplicity
1

### 2.8.7. Target Multiplicity
*

### 2.8.8. Cascade Delete
False

### 2.8.9. Is Identifying
False

### 2.8.10. On Delete
Restrict

### 2.8.11. On Update
NoAction

## 2.9. ProductCatalog_Products
### 2.9.3. Source Entity
ProductCatalog

### 2.9.4. Target Entity
Product

### 2.9.5. Type
OneToMany

### 2.9.6. Source Multiplicity
1

### 2.9.7. Target Multiplicity
*

### 2.9.8. Cascade Delete
True

### 2.9.9. Is Identifying
False

### 2.9.10. On Delete
Cascade

### 2.9.11. On Update
NoAction

## 2.10. Ad_PerformanceMetrics
### 2.10.3. Source Entity
Ad

### 2.10.4. Target Entity
PerformanceMetric

### 2.10.5. Type
OneToMany

### 2.10.6. Source Multiplicity
1

### 2.10.7. Target Multiplicity
*

### 2.10.8. Cascade Delete
False

### 2.10.9. Is Identifying
False

### 2.10.10. On Delete
SetNull

### 2.10.11. On Update
NoAction

## 2.11. AdSet_PerformanceMetrics
### 2.11.3. Source Entity
AdSet

### 2.11.4. Target Entity
PerformanceMetric

### 2.11.5. Type
OneToMany

### 2.11.6. Source Multiplicity
1

### 2.11.7. Target Multiplicity
*

### 2.11.8. Cascade Delete
False

### 2.11.9. Is Identifying
False

### 2.11.10. On Delete
SetNull

### 2.11.11. On Update
NoAction

## 2.12. Campaign_PerformanceMetrics
### 2.12.3. Source Entity
Campaign

### 2.12.4. Target Entity
PerformanceMetric

### 2.12.5. Type
OneToMany

### 2.12.6. Source Multiplicity
1

### 2.12.7. Target Multiplicity
*

### 2.12.8. Cascade Delete
False

### 2.12.9. Is Identifying
False

### 2.12.10. On Delete
SetNull

### 2.12.11. On Update
NoAction

## 2.13. AdNetwork_PerformanceMetrics
### 2.13.3. Source Entity
AdNetwork

### 2.13.4. Target Entity
PerformanceMetric

### 2.13.5. Type
OneToMany

### 2.13.6. Source Multiplicity
1

### 2.13.7. Target Multiplicity
*

### 2.13.8. Cascade Delete
False

### 2.13.9. Is Identifying
False

### 2.13.10. On Delete
Restrict

### 2.13.11. On Update
NoAction

## 2.14. UserRole_AdManagerUsers
### 2.14.3. Source Entity
UserRole

### 2.14.4. Target Entity
AdManagerUser

### 2.14.5. Type
OneToMany

### 2.14.6. Source Multiplicity
1

### 2.14.7. Target Multiplicity
*

### 2.14.8. Cascade Delete
False

### 2.14.9. Is Identifying
False

### 2.14.10. On Delete
Restrict

### 2.14.11. On Update
NoAction

## 2.15. Campaign_LandingPages
### 2.15.3. Source Entity
Campaign

### 2.15.4. Target Entity
LandingPage

### 2.15.5. Type
OneToMany

### 2.15.6. Source Multiplicity
1

### 2.15.7. Target Multiplicity
*

### 2.15.8. Cascade Delete
False

### 2.15.9. Is Identifying
False

### 2.15.10. On Delete
SetNull

### 2.15.11. On Update
NoAction

## 2.16. Campaign_DailyCampaignPerformanceSummaries
### 2.16.3. Source Entity
Campaign

### 2.16.4. Target Entity
DailyCampaignPerformanceSummary

### 2.16.5. Type
OneToMany

### 2.16.6. Source Multiplicity
1

### 2.16.7. Target Multiplicity
*

### 2.16.8. Foreign Key Column In Target
campaignId

### 2.16.9. Cascade Delete
False

### 2.16.10. Is Identifying
False

### 2.16.11. On Delete
Cascade

### 2.16.12. On Update
NoAction

## 2.17. AdNetwork_DailyCampaignPerformanceSummaries
### 2.17.3. Source Entity
AdNetwork

### 2.17.4. Target Entity
DailyCampaignPerformanceSummary

### 2.17.5. Type
OneToMany

### 2.17.6. Source Multiplicity
1

### 2.17.7. Target Multiplicity
*

### 2.17.8. Foreign Key Column In Target
adNetworkId

### 2.17.9. Cascade Delete
False

### 2.17.10. Is Identifying
False

### 2.17.11. On Delete
Restrict

### 2.17.12. On Update
NoAction



---

