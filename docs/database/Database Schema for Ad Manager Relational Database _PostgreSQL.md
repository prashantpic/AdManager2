# Specification

# 1. Database Design

## 1.1. Campaign
Represents an advertising campaign with budget, schedule and status. For high-volume systems, this table can be partitioned by `endDate` (e.g., yearly) for archival and performance. Includes soft delete.

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

#### 1.1.3.9.4. Default Value
CURRENT_TIMESTAMP

### 1.1.3.10. deletedAt
#### 1.1.3.10.2. Type
DATETIMEOFFSET

#### 1.1.3.10.3. Is Required
False


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

### 1.1.6.3. idx_campaign_deletedat
#### 1.1.6.3.2. Columns

- deletedAt


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
2048

### 1.2.3.4. specifications
JSON document detailing API specs, ad format requirements, targeting options, etc.

#### 1.2.3.4.2. Type
JSON

#### 1.2.3.4.3. Is Required
False

### 1.2.3.5. status
#### 1.2.3.5.2. Type
ENUM

#### 1.2.3.5.3. Is Required
True

#### 1.2.3.5.4. Constraints

- Active
- Inactive
- Maintenance

#### 1.2.3.5.5. Default Value
'Active'

### 1.2.3.6. createdAt
#### 1.2.3.6.2. Type
DATETIMEOFFSET

#### 1.2.3.6.3. Is Required
True

#### 1.2.3.6.4. Default Value
CURRENT_TIMESTAMP

### 1.2.3.7. updatedAt
#### 1.2.3.7.2. Type
DATETIMEOFFSET

#### 1.2.3.7.3. Is Required
True

#### 1.2.3.7.4. Default Value
CURRENT_TIMESTAMP


### 1.2.4. Primary Keys

- id

### 1.2.5. Unique Constraints

### 1.2.5.1. uq_adnetwork_name
#### 1.2.5.1.2. Columns

- name


### 1.2.6. Indexes


## 1.3. CampaignAdNetwork
Mapping between campaigns and ad networks, with status per network. Includes soft delete.

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
- SyncPending
- SyncError

#### 1.3.3.3.5. Default Value
'SyncPending'

### 1.3.3.4. adNetworkCampaignId
ID assigned by the specific Ad Network for this campaign association

#### 1.3.3.4.2. Type
VARCHAR

#### 1.3.3.4.3. Is Required
False

#### 1.3.3.4.4. Size
255

### 1.3.3.5. syncStatus
Details about the last sync attempt (timestamp, status, errors)

#### 1.3.3.5.2. Type
JSON

#### 1.3.3.5.3. Is Required
False

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

### 1.3.3.8. deletedAt
#### 1.3.3.8.2. Type
DATETIMEOFFSET

#### 1.3.3.8.3. Is Required
False


### 1.3.4. Primary Keys

- campaignId
- adNetworkId

### 1.3.5. Unique Constraints


### 1.3.6. Indexes

### 1.3.6.1. idx_campaignadnetwork_reverse
#### 1.3.6.1.2. Columns

- adNetworkId
- campaignId

### 1.3.6.2. idx_campaignadnetwork_deletedat
#### 1.3.6.2.2. Columns

- deletedAt


## 1.4. AdSet
Group of ads within a campaign with specific targeting. Includes soft delete.

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
JSON document defining audience, location, demographics, etc.

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

### 1.4.3.8. adNetworkId
The ad network this ad set belongs to within the campaign context

#### 1.4.3.8.2. Type
UUID

#### 1.4.3.8.3. Is Required
True

#### 1.4.3.8.4. Is Foreign Key
True

### 1.4.3.9. adNetworkAdSetId
ID assigned by the specific Ad Network for this ad set

#### 1.4.3.9.2. Type
VARCHAR

#### 1.4.3.9.3. Is Required
False

#### 1.4.3.9.4. Size
255

### 1.4.3.10. createdAt
#### 1.4.3.10.2. Type
DATETIMEOFFSET

#### 1.4.3.10.3. Is Required
True

#### 1.4.3.10.4. Default Value
CURRENT_TIMESTAMP

### 1.4.3.11. updatedAt
#### 1.4.3.11.2. Type
DATETIMEOFFSET

#### 1.4.3.11.3. Is Required
True

#### 1.4.3.11.4. Default Value
CURRENT_TIMESTAMP

### 1.4.3.12. deletedAt
#### 1.4.3.12.2. Type
DATETIMEOFFSET

#### 1.4.3.12.3. Is Required
False


### 1.4.4. Primary Keys

- id

### 1.4.5. Unique Constraints


### 1.4.6. Indexes

### 1.4.6.1. idx_adset_campaignid
#### 1.4.6.1.2. Columns

- campaignId

### 1.4.6.2. idx_adset_adnetworkid
#### 1.4.6.2.2. Columns

- adNetworkId

### 1.4.6.3. idx_adset_deletedat
#### 1.4.6.3.2. Columns

- deletedAt


## 1.5. AdCreative
Creative assets for advertisements. Includes soft delete.

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
URL to the creative asset stored in S3 or external storage.

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

### 1.5.3.6. callToAction
#### 1.5.3.6.2. Type
VARCHAR

#### 1.5.3.6.3. Is Required
False

#### 1.5.3.6.4. Size
100

### 1.5.3.7. validationStatus
Status based on ad network validation.

#### 1.5.3.7.2. Type
ENUM

#### 1.5.3.7.3. Is Required
True

#### 1.5.3.7.4. Constraints

- Pending
- Approved
- Rejected

#### 1.5.3.7.5. Default Value
'Pending'

### 1.5.3.8. adNetworkId
#### 1.5.3.8.2. Type
UUID

#### 1.5.3.8.3. Is Required
True

#### 1.5.3.8.4. Is Foreign Key
True

### 1.5.3.9. merchantId
#### 1.5.3.9.2. Type
UUID

#### 1.5.3.9.3. Is Required
True

#### 1.5.3.9.4. Is Foreign Key
True

### 1.5.3.10. metadata
JSON document for additional creative metadata (dimensions, file size, video duration, etc.)

#### 1.5.3.10.2. Type
JSON

#### 1.5.3.10.3. Is Required
False

### 1.5.3.11. createdAt
#### 1.5.3.11.2. Type
DATETIMEOFFSET

#### 1.5.3.11.3. Is Required
True

#### 1.5.3.11.4. Default Value
CURRENT_TIMESTAMP

### 1.5.3.12. updatedAt
#### 1.5.3.12.2. Type
DATETIMEOFFSET

#### 1.5.3.12.3. Is Required
True

#### 1.5.3.12.4. Default Value
CURRENT_TIMESTAMP

### 1.5.3.13. deletedAt
#### 1.5.3.13.2. Type
DATETIMEOFFSET

#### 1.5.3.13.3. Is Required
False


### 1.5.4. Primary Keys

- id

### 1.5.5. Unique Constraints


### 1.5.6. Indexes

### 1.5.6.1. idx_adcreative_merchant_network_status
#### 1.5.6.1.2. Columns

- merchantId
- adNetworkId
- validationStatus

### 1.5.6.2. idx_adcreative_deletedat
#### 1.5.6.2.2. Columns

- deletedAt


## 1.6. Ad
Individual advertisement instance. Links AdCreative and AdSet. Includes soft delete.

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
- Draft
- Archived

#### 1.6.3.3.5. Default Value
'Draft'

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
Optional link to a specific promotion/offer associated with this ad

#### 1.6.3.6.2. Type
UUID

#### 1.6.3.6.3. Is Required
False

#### 1.6.3.6.4. Is Foreign Key
True

### 1.6.3.7. adNetworkAdId
ID assigned by the specific Ad Network for this ad

#### 1.6.3.7.2. Type
VARCHAR

#### 1.6.3.7.3. Is Required
False

#### 1.6.3.7.4. Size
255

### 1.6.3.8. createdAt
#### 1.6.3.8.2. Type
DATETIMEOFFSET

#### 1.6.3.8.3. Is Required
True

#### 1.6.3.8.4. Default Value
CURRENT_TIMESTAMP

### 1.6.3.9. updatedAt
#### 1.6.3.9.2. Type
DATETIMEOFFSET

#### 1.6.3.9.3. Is Required
True

#### 1.6.3.9.4. Default Value
CURRENT_TIMESTAMP

### 1.6.3.10. deletedAt
#### 1.6.3.10.2. Type
DATETIMEOFFSET

#### 1.6.3.10.3. Is Required
False


### 1.6.4. Primary Keys

- id

### 1.6.5. Unique Constraints


### 1.6.6. Indexes

### 1.6.6.1. idx_ad_adsetid
#### 1.6.6.1.2. Columns

- adSetId

### 1.6.6.2. idx_ad_adcreativeid
#### 1.6.6.2.2. Columns

- adCreativeId

### 1.6.6.3. idx_ad_promotionid
#### 1.6.6.3.2. Columns

- promotionId

### 1.6.6.4. idx_ad_deletedat
#### 1.6.6.4.2. Columns

- deletedAt


## 1.7. ProductCatalog
Collection of products for advertising. Represents a specific version/configuration of product data derived from the core platform or other sources, tailored for Ad Manager usage. Includes soft delete.

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

- Draft
- Active
- Archived
- SyncPending
- SyncError

#### 1.7.3.3.5. Default Value
'Draft'

### 1.7.3.4. merchantId
#### 1.7.3.4.2. Type
UUID

#### 1.7.3.4.3. Is Required
True

#### 1.7.3.4.4. Is Foreign Key
True

### 1.7.3.5. coreCatalogId
ID from the core platform's product catalog system

#### 1.7.3.5.2. Type
UUID

#### 1.7.3.5.3. Is Required
True

### 1.7.3.6. lastSyncedAt
Timestamp of the last successful synchronization with the core platform or source data

#### 1.7.3.6.2. Type
DATETIMEOFFSET

#### 1.7.3.6.3. Is Required
False

### 1.7.3.7. syncStatus
Details about the last sync attempt (status, errors, number of products synced)

#### 1.7.3.7.2. Type
JSON

#### 1.7.3.7.3. Is Required
False

### 1.7.3.8. createdAt
#### 1.7.3.8.2. Type
DATETIMEOFFSET

#### 1.7.3.8.3. Is Required
True

#### 1.7.3.8.4. Default Value
CURRENT_TIMESTAMP

### 1.7.3.9. updatedAt
#### 1.7.3.9.2. Type
DATETIMEOFFSET

#### 1.7.3.9.3. Is Required
True

#### 1.7.3.9.4. Default Value
CURRENT_TIMESTAMP

### 1.7.3.10. deletedAt
#### 1.7.3.10.2. Type
DATETIMEOFFSET

#### 1.7.3.10.3. Is Required
False


### 1.7.4. Primary Keys

- id

### 1.7.5. Unique Constraints


### 1.7.6. Indexes

### 1.7.6.1. idx_productcatalog_merchantid
#### 1.7.6.1.2. Columns

- merchantId

### 1.7.6.2. idx_productcatalog_deletedat
#### 1.7.6.2.2. Columns

- deletedAt


## 1.8. Product
Products with advertising-specific customizations within a ProductCatalog. Represents the Ad Manager's layer of product data (overrides) linked to core products. Includes soft delete.

### 1.8.3. Attributes

### 1.8.3.1. id
#### 1.8.3.1.2. Type
UUID

#### 1.8.3.1.3. Is Required
True

#### 1.8.3.1.4. Is Primary Key
True

### 1.8.3.2. coreProductId
ID from the core platform's product database

#### 1.8.3.2.2. Type
UUID

#### 1.8.3.2.3. Is Required
True

### 1.8.3.3. adTitle
Ad-specific title override

#### 1.8.3.3.2. Type
VARCHAR

#### 1.8.3.3.3. Is Required
False

#### 1.8.3.3.4. Size
255

### 1.8.3.4. adDescription
Ad-specific description override

#### 1.8.3.4.2. Type
TEXT

#### 1.8.3.4.3. Is Required
False

### 1.8.3.5. adImageUrl
Ad-specific image URL override (S3 or external)

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
Whether this product is active within the specific ProductCatalog for advertising

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

### 1.8.3.9. createdAt
#### 1.8.3.9.2. Type
DATETIMEOFFSET

#### 1.8.3.9.3. Is Required
True

#### 1.8.3.9.4. Default Value
CURRENT_TIMESTAMP

### 1.8.3.10. updatedAt
#### 1.8.3.10.2. Type
DATETIMEOFFSET

#### 1.8.3.10.3. Is Required
True

#### 1.8.3.10.4. Default Value
CURRENT_TIMESTAMP

### 1.8.3.11. deletedAt
#### 1.8.3.11.2. Type
DATETIMEOFFSET

#### 1.8.3.11.3. Is Required
False


### 1.8.4. Primary Keys

- id

### 1.8.5. Unique Constraints

### 1.8.5.1. uq_product_catalog_coreproduct
A core product can only appear once within a specific Ad Manager Product Catalog.

#### 1.8.5.1.2. Columns

- productCatalogId
- coreProductId


### 1.8.6. Indexes

### 1.8.6.1. idx_product_merchant_active_catalog
#### 1.8.6.1.2. Columns

- merchantId
- isActive
- productCatalogId

### 1.8.6.2. idx_product_deletedat
#### 1.8.6.2.2. Columns

- deletedAt


## 1.9. Promotion
Marketing promotions and offers. Includes soft delete.

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
- TieredDiscount
- FreeShipping
- GiftWithPurchase

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
- CodeRequired

#### 1.9.3.6.5. Default Value
'CodeRequired'

### 1.9.3.7. merchantId
#### 1.9.3.7.2. Type
UUID

#### 1.9.3.7.3. Is Required
True

#### 1.9.3.7.4. Is Foreign Key
True

### 1.9.3.8. rules
JSON document defining specific rules (eligible products/collections, minimum purchase, etc.) and offer details (discount %, value, BOGO mechanics)

#### 1.9.3.8.2. Type
JSON

#### 1.9.3.8.3. Is Required
True

### 1.9.3.9. constraints
JSON document defining constraints (eligibility criteria like new customers, stacking rules with other promotions)

#### 1.9.3.9.2. Type
JSON

#### 1.9.3.9.3. Is Required
False

### 1.9.3.10. createdAt
#### 1.9.3.10.2. Type
DATETIMEOFFSET

#### 1.9.3.10.3. Is Required
True

#### 1.9.3.10.4. Default Value
CURRENT_TIMESTAMP

### 1.9.3.11. updatedAt
#### 1.9.3.11.2. Type
DATETIMEOFFSET

#### 1.9.3.11.3. Is Required
True

#### 1.9.3.11.4. Default Value
CURRENT_TIMESTAMP

### 1.9.3.12. deletedAt
#### 1.9.3.12.2. Type
DATETIMEOFFSET

#### 1.9.3.12.3. Is Required
False


### 1.9.4. Primary Keys

- id

### 1.9.5. Unique Constraints


### 1.9.6. Indexes

### 1.9.6.1. idx_promotion_merchantid
#### 1.9.6.1.2. Columns

- merchantId

### 1.9.6.2. idx_promotion_dates_status
#### 1.9.6.2.2. Columns

- startDate
- endDate
- merchantId

### 1.9.6.3. idx_promotion_deletedat
#### 1.9.6.3.2. Columns

- deletedAt


## 1.10. DiscountCode
Specific discount codes for promotions of type 'DiscountCode'. Handles potentially high volume. Includes soft delete.

### 1.10.3. Attributes

### 1.10.3.1. id
#### 1.10.3.1.2. Type
UUID

#### 1.10.3.1.3. Is Required
True

#### 1.10.3.1.4. Is Primary Key
True

### 1.10.3.2. code
The actual unique discount code value

#### 1.10.3.2.2. Type
VARCHAR

#### 1.10.3.2.3. Is Required
True

#### 1.10.3.2.4. Size
50

### 1.10.3.3. codePattern
Optional pattern used to generate codes (for context)

#### 1.10.3.3.2. Type
VARCHAR

#### 1.10.3.3.3. Is Required
False

#### 1.10.3.3.4. Size
50

### 1.10.3.4. discountType
#### 1.10.3.4.2. Type
ENUM

#### 1.10.3.4.3. Is Required
True

#### 1.10.3.4.4. Constraints

- Percentage
- Fixed

### 1.10.3.5. discountValue
#### 1.10.3.5.2. Type
DECIMAL

#### 1.10.3.5.3. Is Required
True

#### 1.10.3.5.4. Precision
10

#### 1.10.3.5.5. Scale
2

### 1.10.3.6. minPurchaseAmount
#### 1.10.3.6.2. Type
DECIMAL

#### 1.10.3.6.3. Is Required
False

#### 1.10.3.6.4. Precision
15

#### 1.10.3.6.5. Scale
2

### 1.10.3.7. usageLimit
#### 1.10.3.7.2. Type
ENUM

#### 1.10.3.7.3. Is Required
True

#### 1.10.3.7.4. Constraints

- SinglePerCustomer
- SingleGlobal
- Multiple

### 1.10.3.8. usageCount
Current number of times this specific code has been used

#### 1.10.3.8.2. Type
INT

#### 1.10.3.8.3. Is Required
True

#### 1.10.3.8.4. Default Value
0

### 1.10.3.9. promotionId
#### 1.10.3.9.2. Type
UUID

#### 1.10.3.9.3. Is Required
True

#### 1.10.3.9.4. Is Foreign Key
True

### 1.10.3.10. merchantId
#### 1.10.3.10.2. Type
UUID

#### 1.10.3.10.3. Is Required
True

#### 1.10.3.10.4. Is Foreign Key
True

### 1.10.3.11. createdAt
#### 1.10.3.11.2. Type
DATETIMEOFFSET

#### 1.10.3.11.3. Is Required
True

#### 1.10.3.11.4. Default Value
CURRENT_TIMESTAMP

### 1.10.3.12. updatedAt
#### 1.10.3.12.2. Type
DATETIMEOFFSET

#### 1.10.3.12.3. Is Required
True

#### 1.10.3.12.4. Default Value
CURRENT_TIMESTAMP

### 1.10.3.13. deletedAt
#### 1.10.3.13.2. Type
DATETIMEOFFSET

#### 1.10.3.13.3. Is Required
False


### 1.10.4. Primary Keys

- id

### 1.10.5. Unique Constraints

### 1.10.5.1. uq_discountcode_merchant_code
#### 1.10.5.1.2. Columns

- merchantId
- code


### 1.10.6. Indexes

### 1.10.6.1. idx_discountcode_merchant_promotion
#### 1.10.6.1.2. Columns

- merchantId
- promotionId

### 1.10.6.2. idx_discountcode_deletedat
#### 1.10.6.2.2. Columns

- deletedAt

### 1.10.6.3. idx_discountcode_merchant_code
#### 1.10.6.3.2. Columns

- merchantId
- code


## 1.11. ABTest
A/B testing configurations and results. Includes soft delete.

### 1.11.3. Attributes

### 1.11.3.1. id
#### 1.11.3.1.2. Type
UUID

#### 1.11.3.1.3. Is Required
True

#### 1.11.3.1.4. Is Primary Key
True

### 1.11.3.2. name
#### 1.11.3.2.2. Type
VARCHAR

#### 1.11.3.2.3. Is Required
True

#### 1.11.3.2.4. Size
255

### 1.11.3.3. testType
#### 1.11.3.3.2. Type
ENUM

#### 1.11.3.3.3. Is Required
True

#### 1.11.3.3.4. Constraints

- Creative
- Copy
- LandingPage
- Offer
- Targeting

### 1.11.3.4. startDate
#### 1.11.3.4.2. Type
DATETIME

#### 1.11.3.4.3. Is Required
True

### 1.11.3.5. endDate
#### 1.11.3.5.2. Type
DATETIME

#### 1.11.3.5.3. Is Required
True

### 1.11.3.6. status
#### 1.11.3.6.2. Type
ENUM

#### 1.11.3.6.3. Is Required
True

#### 1.11.3.6.4. Constraints

- Draft
- Running
- Completed
- Archived

#### 1.11.3.6.5. Default Value
'Draft'

### 1.11.3.7. campaignId
#### 1.11.3.7.2. Type
UUID

#### 1.11.3.7.3. Is Required
True

#### 1.11.3.7.4. Is Foreign Key
True

### 1.11.3.8. merchantId
#### 1.11.3.8.2. Type
UUID

#### 1.11.3.8.3. Is Required
True

#### 1.11.3.8.4. Is Foreign Key
True

### 1.11.3.9. variants
JSON document defining the different variants being tested and their configurations/references

#### 1.11.3.9.2. Type
JSON

#### 1.11.3.9.3. Is Required
True

### 1.11.3.10. winningVariantId
ID of the winning variant (can be a reference to an Ad, Creative, Landing Page, etc.)

#### 1.11.3.10.2. Type
UUID

#### 1.11.3.10.3. Is Required
False

### 1.11.3.11. confidenceLevel
Statistical confidence level of the winning variant result

#### 1.11.3.11.2. Type
DECIMAL

#### 1.11.3.11.3. Is Required
False

#### 1.11.3.11.4. Precision
5

#### 1.11.3.11.5. Scale
4

### 1.11.3.12. resultsSummary
Summary of performance metrics per variant

#### 1.11.3.12.2. Type
JSON

#### 1.11.3.12.3. Is Required
False

### 1.11.3.13. createdAt
#### 1.11.3.13.2. Type
DATETIMEOFFSET

#### 1.11.3.13.3. Is Required
True

#### 1.11.3.13.4. Default Value
CURRENT_TIMESTAMP

### 1.11.3.14. updatedAt
#### 1.11.3.14.2. Type
DATETIMEOFFSET

#### 1.11.3.14.3. Is Required
True

#### 1.11.3.14.4. Default Value
CURRENT_TIMESTAMP

### 1.11.3.15. deletedAt
#### 1.11.3.15.2. Type
DATETIMEOFFSET

#### 1.11.3.15.3. Is Required
False


### 1.11.4. Primary Keys

- id

### 1.11.5. Unique Constraints


### 1.11.6. Indexes

### 1.11.6.1. idx_abtest_campaignid
#### 1.11.6.1.2. Columns

- campaignId

### 1.11.6.2. idx_abtest_merchantid
#### 1.11.6.2.2. Columns

- merchantId

### 1.11.6.3. idx_abtest_deletedat
#### 1.11.6.3.2. Columns

- deletedAt


## 1.12. Audience
Targeting audiences for campaigns. Can be custom or lookalike. Includes soft delete.

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
- Retargeting

### 1.12.3.4. source
#### 1.12.3.4.2. Type
ENUM

#### 1.12.3.4.3. Is Required
True

#### 1.12.3.4.4. Constraints

- PlatformData
- AdNetworkData
- Upload

### 1.12.3.5. criteria
JSON document defining the rules or source for the audience

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

### 1.12.3.7. adNetworkAudiences
JSON array mapping AdNetworkId to the audience ID created on that network, and sync status

#### 1.12.3.7.2. Type
JSON

#### 1.12.3.7.3. Is Required
False

### 1.12.3.8. size
Estimated audience size (can vary by network)

#### 1.12.3.8.2. Type
INT

#### 1.12.3.8.3. Is Required
False

### 1.12.3.9. lastSyncedAt
#### 1.12.3.9.2. Type
DATETIMEOFFSET

#### 1.12.3.9.3. Is Required
False

### 1.12.3.10. createdAt
#### 1.12.3.10.2. Type
DATETIMEOFFSET

#### 1.12.3.10.3. Is Required
True

#### 1.12.3.10.4. Default Value
CURRENT_TIMESTAMP

### 1.12.3.11. updatedAt
#### 1.12.3.11.2. Type
DATETIMEOFFSET

#### 1.12.3.11.3. Is Required
True

#### 1.12.3.11.4. Default Value
CURRENT_TIMESTAMP

### 1.12.3.12. deletedAt
#### 1.12.3.12.2. Type
DATETIMEOFFSET

#### 1.12.3.12.3. Is Required
False


### 1.12.4. Primary Keys

- id

### 1.12.5. Unique Constraints


### 1.12.6. Indexes

### 1.12.6.1. idx_audience_merchantid
#### 1.12.6.1.2. Columns

- merchantId

### 1.12.6.2. idx_audience_deletedat
#### 1.12.6.2.2. Columns

- deletedAt


## 1.13. DailyCampaignPerformanceSummary
Summary table storing pre-aggregated daily metrics at campaignId, adNetworkId, and date granularity. Populated from the high-volume performance data store (Timestream/DynamoDB).

### 1.13.3. Attributes

### 1.13.3.1. date
#### 1.13.3.1.2. Type
DATE

#### 1.13.3.1.3. Is Required
True

#### 1.13.3.1.4. Is Primary Key
True

### 1.13.3.2. campaignId
#### 1.13.3.2.2. Type
UUID

#### 1.13.3.2.3. Is Required
True

#### 1.13.3.2.4. Is Primary Key
True

#### 1.13.3.2.5. Is Foreign Key
True

### 1.13.3.3. adNetworkId
#### 1.13.3.3.2. Type
UUID

#### 1.13.3.3.3. Is Required
True

#### 1.13.3.3.4. Is Primary Key
True

#### 1.13.3.3.5. Is Foreign Key
True

### 1.13.3.4. merchantId
#### 1.13.3.4.2. Type
UUID

#### 1.13.3.4.3. Is Required
True

#### 1.13.3.4.4. Is Primary Key
True

#### 1.13.3.4.5. Is Foreign Key
True

### 1.13.3.5. totalImpressions
#### 1.13.3.5.2. Type
BIGINT

#### 1.13.3.5.3. Is Required
True

#### 1.13.3.5.4. Default Value
0

### 1.13.3.6. totalClicks
#### 1.13.3.6.2. Type
BIGINT

#### 1.13.3.6.3. Is Required
True

#### 1.13.3.6.4. Default Value
0

### 1.13.3.7. totalSpend
#### 1.13.3.7.2. Type
DECIMAL

#### 1.13.3.7.3. Is Required
True

#### 1.13.3.7.4. Precision
15

#### 1.13.3.7.5. Scale
2

#### 1.13.3.7.6. Default Value
0

### 1.13.3.8. totalConversions
#### 1.13.3.8.2. Type
BIGINT

#### 1.13.3.8.3. Is Required
True

#### 1.13.3.8.4. Default Value
0

### 1.13.3.9. avgCpa
#### 1.13.3.9.2. Type
DECIMAL

#### 1.13.3.9.3. Is Required
False

#### 1.13.3.9.4. Precision
10

#### 1.13.3.9.5. Scale
2

### 1.13.3.10. avgRoas
#### 1.13.3.10.2. Type
DECIMAL

#### 1.13.3.10.3. Is Required
False

#### 1.13.3.10.4. Precision
10

#### 1.13.3.10.5. Scale
2

### 1.13.3.11. updatedAt
#### 1.13.3.11.2. Type
DATETIMEOFFSET

#### 1.13.3.11.3. Is Required
True

#### 1.13.3.11.4. Default Value
CURRENT_TIMESTAMP

### 1.13.3.12. createdAt
#### 1.13.3.12.2. Type
DATETIMEOFFSET

#### 1.13.3.12.3. Is Required
True

#### 1.13.3.12.4. Default Value
CURRENT_TIMESTAMP


### 1.13.4. Primary Keys

- date
- campaignId
- adNetworkId
- merchantId

### 1.13.5. Unique Constraints


### 1.13.6. Indexes

### 1.13.6.1. idx_dcps_merchant_date
#### 1.13.6.1.2. Columns

- merchantId
- date

### 1.13.6.2. idx_dcps_campaign_date
#### 1.13.6.2.2. Columns

- campaignId
- date

### 1.13.6.3. idx_dcps_adnetwork_date
#### 1.13.6.3.2. Columns

- adNetworkId
- date


## 1.14. UserRole
RBAC roles for Ad Manager users. Role definitions and permissions are suitable for caching to speed up authorization checks.

### 1.14.3. Attributes

### 1.14.3.1. id
#### 1.14.3.1.2. Type
UUID

#### 1.14.3.1.3. Is Required
True

#### 1.14.3.1.4. Is Primary Key
True

### 1.14.3.2. name
#### 1.14.3.2.2. Type
VARCHAR

#### 1.14.3.2.3. Is Required
True

#### 1.14.3.2.4. Size
50

#### 1.14.3.2.5. Is Unique
True

### 1.14.3.3. description
#### 1.14.3.3.2. Type
TEXT

#### 1.14.3.3.3. Is Required
True

### 1.14.3.4. permissions
JSON document defining granular permissions for this role

#### 1.14.3.4.2. Type
JSON

#### 1.14.3.4.3. Is Required
True

### 1.14.3.5. createdAt
#### 1.14.3.5.2. Type
DATETIMEOFFSET

#### 1.14.3.5.3. Is Required
True

#### 1.14.3.5.4. Default Value
CURRENT_TIMESTAMP

### 1.14.3.6. updatedAt
#### 1.14.3.6.2. Type
DATETIMEOFFSET

#### 1.14.3.6.3. Is Required
True

#### 1.14.3.6.4. Default Value
CURRENT_TIMESTAMP


### 1.14.4. Primary Keys

- id

### 1.14.5. Unique Constraints

### 1.14.5.1. uq_userrole_name
#### 1.14.5.1.2. Columns

- name


### 1.14.6. Indexes


## 1.15. AdManagerUser
Users with access to Ad Manager. Links to the core platform user.

### 1.15.3. Attributes

### 1.15.3.1. id
#### 1.15.3.1.2. Type
UUID

#### 1.15.3.1.3. Is Required
True

#### 1.15.3.1.4. Is Primary Key
True

### 1.15.3.2. coreUserId
ID from the core platform's user database

#### 1.15.3.2.2. Type
UUID

#### 1.15.3.2.3. Is Required
True

#### 1.15.3.2.4. Is Unique
True

### 1.15.3.3. roleId
#### 1.15.3.3.2. Type
UUID

#### 1.15.3.3.3. Is Required
True

#### 1.15.3.3.4. Is Foreign Key
True

### 1.15.3.4. merchantId
The merchant account this user belongs to

#### 1.15.3.4.2. Type
UUID

#### 1.15.3.4.3. Is Required
True

#### 1.15.3.4.4. Is Foreign Key
True

### 1.15.3.5. lastLogin
#### 1.15.3.5.2. Type
DATETIMEOFFSET

#### 1.15.3.5.3. Is Required
False

### 1.15.3.6. createdAt
#### 1.15.3.6.2. Type
DATETIMEOFFSET

#### 1.15.3.6.3. Is Required
True

#### 1.15.3.6.4. Default Value
CURRENT_TIMESTAMP

### 1.15.3.7. updatedAt
#### 1.15.3.7.2. Type
DATETIMEOFFSET

#### 1.15.3.7.3. Is Required
True

#### 1.15.3.7.4. Default Value
CURRENT_TIMESTAMP


### 1.15.4. Primary Keys

- id

### 1.15.5. Unique Constraints


### 1.15.6. Indexes

### 1.15.6.1. idx_admanageruser_coreuserid
#### 1.15.6.1.2. Columns

- coreUserId

#### 1.15.6.1.3. Is Unique
True

### 1.15.6.2. idx_admanageruser_merchantid
#### 1.15.6.2.2. Columns

- merchantId

### 1.15.6.3. idx_admanageruser_roleid
#### 1.15.6.3.2. Columns

- roleId


## 1.16. LandingPage
Interactive landing pages for campaigns, managed within Ad Manager. Includes soft delete.

### 1.16.3. Attributes

### 1.16.3.1. id
#### 1.16.3.1.2. Type
UUID

#### 1.16.3.1.3. Is Required
True

#### 1.16.3.1.4. Is Primary Key
True

### 1.16.3.2. title
#### 1.16.3.2.2. Type
VARCHAR

#### 1.16.3.2.3. Is Required
True

#### 1.16.3.2.4. Size
255

### 1.16.3.3. urlSlug
#### 1.16.3.3.2. Type
VARCHAR

#### 1.16.3.3.3. Is Required
True

#### 1.16.3.3.4. Size
255

### 1.16.3.4. content
JSON document representing the structure and content of the landing page

#### 1.16.3.4.2. Type
JSON

#### 1.16.3.4.3. Is Required
True

### 1.16.3.5. metaTitle
#### 1.16.3.5.2. Type
VARCHAR

#### 1.16.3.5.3. Is Required
True

#### 1.16.3.5.4. Size
255

### 1.16.3.6. metaDescription
#### 1.16.3.6.2. Type
TEXT

#### 1.16.3.6.3. Is Required
True

### 1.16.3.7. status
#### 1.16.3.7.2. Type
ENUM

#### 1.16.3.7.3. Is Required
True

#### 1.16.3.7.4. Constraints

- Draft
- Published
- Archived

#### 1.16.3.7.5. Default Value
'Draft'

### 1.16.3.8. campaignId
Optional link to a specific campaign

#### 1.16.3.8.2. Type
UUID

#### 1.16.3.8.3. Is Required
False

#### 1.16.3.8.4. Is Foreign Key
True

### 1.16.3.9. merchantId
#### 1.16.3.9.2. Type
UUID

#### 1.16.3.9.3. Is Required
True

#### 1.16.3.9.4. Is Foreign Key
True

### 1.16.3.10. isPublic
Flag indicating if the landing page is publicly accessible

#### 1.16.3.10.2. Type
BOOLEAN

#### 1.16.3.10.3. Is Required
True

#### 1.16.3.10.4. Default Value
False

### 1.16.3.11. createdAt
#### 1.16.3.11.2. Type
DATETIMEOFFSET

#### 1.16.3.11.3. Is Required
True

#### 1.16.3.11.4. Default Value
CURRENT_TIMESTAMP

### 1.16.3.12. updatedAt
#### 1.16.3.12.2. Type
DATETIMEOFFSET

#### 1.16.3.12.3. Is Required
True

#### 1.16.3.12.4. Default Value
CURRENT_TIMESTAMP

### 1.16.3.13. deletedAt
#### 1.16.3.13.2. Type
DATETIMEOFFSET

#### 1.16.3.13.3. Is Required
False


### 1.16.4. Primary Keys

- id

### 1.16.5. Unique Constraints

### 1.16.5.1. uq_landingpage_urlslug_merchantid
URL slugs must be unique per merchant.

#### 1.16.5.1.2. Columns

- merchantId
- urlSlug


### 1.16.6. Indexes

### 1.16.6.1. idx_landingpage_campaignid
#### 1.16.6.1.2. Columns

- campaignId

### 1.16.6.2. idx_landingpage_merchantid
#### 1.16.6.2.2. Columns

- merchantId

### 1.16.6.3. idx_landingpage_urlslug_status
#### 1.16.6.3.2. Columns

- urlSlug
- status

### 1.16.6.4. idx_landingpage_deletedat
#### 1.16.6.4.2. Columns

- deletedAt


## 1.17. AuditLog
Records critical user and system actions for auditing and compliance.

### 1.17.3. Attributes

### 1.17.3.1. id
#### 1.17.3.1.2. Type
UUID

#### 1.17.3.1.3. Is Required
True

#### 1.17.3.1.4. Is Primary Key
True

### 1.17.3.2. userId
ID of the AdManagerUser who performed the action (nullable for system actions)

#### 1.17.3.2.2. Type
UUID

#### 1.17.3.2.3. Is Required
False

#### 1.17.3.2.4. Is Foreign Key
True

### 1.17.3.3. merchantId
ID of the merchant account affected by the action (nullable for platform-level actions)

#### 1.17.3.3.2. Type
UUID

#### 1.17.3.3.3. Is Required
False

#### 1.17.3.3.4. Is Foreign Key
True

### 1.17.3.4. action
Specific action performed (e.g., CAMPAIGN_CREATED, USER_ROLE_UPDATED, SETTING_CHANGED)

#### 1.17.3.4.2. Type
VARCHAR

#### 1.17.3.4.3. Is Required
True

#### 1.17.3.4.4. Size
100

### 1.17.3.5. entityType
Type of entity affected (e.g., 'Campaign', 'AdManagerUser', 'ConfigurationSetting')

#### 1.17.3.5.2. Type
VARCHAR

#### 1.17.3.5.3. Is Required
False

#### 1.17.3.5.4. Size
50

### 1.17.3.6. entityId
ID of the entity affected

#### 1.17.3.6.2. Type
UUID

#### 1.17.3.6.3. Is Required
False

### 1.17.3.7. details
JSON document containing details of the action, including old/new values for changes

#### 1.17.3.7.2. Type
JSON

#### 1.17.3.7.3. Is Required
False

### 1.17.3.8. ipAddress
IP address from which the action originated

#### 1.17.3.8.2. Type
VARCHAR

#### 1.17.3.8.3. Is Required
False

#### 1.17.3.8.4. Size
45

### 1.17.3.9. timestamp
#### 1.17.3.9.2. Type
DATETIMEOFFSET

#### 1.17.3.9.3. Is Required
True

#### 1.17.3.9.4. Default Value
CURRENT_TIMESTAMP


### 1.17.4. Primary Keys

- id

### 1.17.5. Unique Constraints


### 1.17.6. Indexes

### 1.17.6.1. idx_auditlog_merchant_timestamp
#### 1.17.6.1.2. Columns

- merchantId
- timestamp

### 1.17.6.2. idx_auditlog_user_timestamp
#### 1.17.6.2.2. Columns

- userId
- timestamp

### 1.17.6.3. idx_auditlog_entity
#### 1.17.6.3.2. Columns

- entityType
- entityId


## 1.18. ConfigurationSetting
Stores platform-level and merchant-specific configuration settings.

### 1.18.3. Attributes

### 1.18.3.1. id
#### 1.18.3.1.2. Type
UUID

#### 1.18.3.1.3. Is Required
True

#### 1.18.3.1.4. Is Primary Key
True

### 1.18.3.2. key
Unique key for the configuration setting

#### 1.18.3.2.2. Type
VARCHAR

#### 1.18.3.2.3. Is Required
True

#### 1.18.3.2.4. Size
100

### 1.18.3.3. value
The value of the setting (stored as text/JSON string)

#### 1.18.3.3.2. Type
TEXT

#### 1.18.3.3.3. Is Required
True

### 1.18.3.4. dataType
Expected data type of the value

#### 1.18.3.4.2. Type
ENUM

#### 1.18.3.4.3. Is Required
True

#### 1.18.3.4.4. Constraints

- string
- number
- boolean
- json

### 1.18.3.5. description
#### 1.18.3.5.2. Type
TEXT

#### 1.18.3.5.3. Is Required
False

### 1.18.3.6. isMerchantSpecific
True if this setting can be overridden per merchant

#### 1.18.3.6.2. Type
BOOLEAN

#### 1.18.3.6.3. Is Required
True

#### 1.18.3.6.4. Default Value
False

### 1.18.3.7. merchantId
The merchant this setting applies to (if isMerchantSpecific is true)

#### 1.18.3.7.2. Type
UUID

#### 1.18.3.7.3. Is Required
False

#### 1.18.3.7.4. Is Foreign Key
True

### 1.18.3.8. createdAt
#### 1.18.3.8.2. Type
DATETIMEOFFSET

#### 1.18.3.8.3. Is Required
True

#### 1.18.3.8.4. Default Value
CURRENT_TIMESTAMP

### 1.18.3.9. updatedAt
#### 1.18.3.9.2. Type
DATETIMEOFFSET

#### 1.18.3.9.3. Is Required
True

#### 1.18.3.9.4. Default Value
CURRENT_TIMESTAMP


### 1.18.4. Primary Keys

- id

### 1.18.5. Unique Constraints

### 1.18.5.1. uq_configsetting_key_merchantid
A configuration key is unique globally (merchantId IS NULL) or unique per merchant.

#### 1.18.5.1.2. Columns

- key
- merchantId


### 1.18.6. Indexes

### 1.18.6.1. idx_configsetting_key
#### 1.18.6.1.2. Columns

- key

### 1.18.6.2. idx_configsetting_merchantid
#### 1.18.6.2.2. Columns

- merchantId


## 1.19. IntegrationConfig
Stores configuration details for third-party integrations per merchant. Sensitive credentials should be stored in AWS Secrets Manager.

### 1.19.3. Attributes

### 1.19.3.1. id
#### 1.19.3.1.2. Type
UUID

#### 1.19.3.1.3. Is Required
True

#### 1.19.3.1.4. Is Primary Key
True

### 1.19.3.2. integrationType
#### 1.19.3.2.2. Type
ENUM

#### 1.19.3.2.3. Is Required
True

#### 1.19.3.2.4. Constraints

- AdNetwork
- PaymentGateway
- ShippingProvider
- Zapier
- CorePlatform

### 1.19.3.3. merchantId
#### 1.19.3.3.2. Type
UUID

#### 1.19.3.3.3. Is Required
True

#### 1.19.3.3.4. Is Foreign Key
True

### 1.19.3.4. configuration
JSON document containing non-sensitive configuration data for the integration (e.g., API endpoints, account IDs, feature flags)

#### 1.19.3.4.2. Type
JSON

#### 1.19.3.4.3. Is Required
True

### 1.19.3.5. status
#### 1.19.3.5.2. Type
ENUM

#### 1.19.3.5.3. Is Required
True

#### 1.19.3.5.4. Constraints

- Active
- Inactive
- ConfigurationRequired
- ConnectionError

#### 1.19.3.5.5. Default Value
'ConfigurationRequired'

### 1.19.3.6. secretsManagerArn
ARN of the AWS Secrets Manager entry storing sensitive credentials for this integration

#### 1.19.3.6.2. Type
VARCHAR

#### 1.19.3.6.3. Is Required
False

#### 1.19.3.6.4. Size
255

### 1.19.3.7. lastSyncStatus
Details about the last synchronization attempt (timestamp, status, errors) for relevant integrations (e.g., Ad Networks)

#### 1.19.3.7.2. Type
JSON

#### 1.19.3.7.3. Is Required
False

### 1.19.3.8. createdAt
#### 1.19.3.8.2. Type
DATETIMEOFFSET

#### 1.19.3.8.3. Is Required
True

#### 1.19.3.8.4. Default Value
CURRENT_TIMESTAMP

### 1.19.3.9. updatedAt
#### 1.19.3.9.2. Type
DATETIMEOFFSET

#### 1.19.3.9.3. Is Required
True

#### 1.19.3.9.4. Default Value
CURRENT_TIMESTAMP


### 1.19.4. Primary Keys

- id

### 1.19.5. Unique Constraints

### 1.19.5.1. uq_integrationconfig_merchant_type
A merchant typically has only one configuration per integration type.

#### 1.19.5.1.2. Columns

- merchantId
- integrationType


### 1.19.6. Indexes

### 1.19.6.1. idx_integrationconfig_merchantid
#### 1.19.6.1.2. Columns

- merchantId

### 1.19.6.2. idx_integrationconfig_type_status
#### 1.19.6.2.2. Columns

- integrationType
- status


## 1.20. Subscription
Stores merchant subscription details for the Ad Manager platform.

### 1.20.3. Attributes

### 1.20.3.1. id
#### 1.20.3.1.2. Type
UUID

#### 1.20.3.1.3. Is Required
True

#### 1.20.3.1.4. Is Primary Key
True

### 1.20.3.2. merchantId
One-to-one or One-to-many depending on if a merchant can have multiple simultaneous subscriptions. Assuming one active Ad Manager subscription per merchant.

#### 1.20.3.2.2. Type
UUID

#### 1.20.3.2.3. Is Required
True

#### 1.20.3.2.4. Is Foreign Key
True

#### 1.20.3.2.5. Is Unique
True

### 1.20.3.3. planId
Reference to the subscription plan (Basic, Pro, Plus)

#### 1.20.3.3.2. Type
UUID

#### 1.20.3.3.3. Is Required
True

#### 1.20.3.3.4. Is Foreign Key
True

### 1.20.3.4. startDate
#### 1.20.3.4.2. Type
DATETIME

#### 1.20.3.4.3. Is Required
True

### 1.20.3.5. endDate
End date for fixed-term plans or upon cancellation

#### 1.20.3.5.2. Type
DATETIME

#### 1.20.3.5.3. Is Required
False

### 1.20.3.6. status
#### 1.20.3.6.2. Type
ENUM

#### 1.20.3.6.3. Is Required
True

#### 1.20.3.6.4. Constraints

- Active
- Cancelled
- PastDue
- Trial

#### 1.20.3.6.5. Default Value
'Trial'

### 1.20.3.7. billingCycle
#### 1.20.3.7.2. Type
ENUM

#### 1.20.3.7.3. Is Required
True

#### 1.20.3.7.4. Constraints

- Monthly
- Annual

### 1.20.3.8. createdAt
#### 1.20.3.8.2. Type
DATETIMEOFFSET

#### 1.20.3.8.3. Is Required
True

#### 1.20.3.8.4. Default Value
CURRENT_TIMESTAMP

### 1.20.3.9. updatedAt
#### 1.20.3.9.2. Type
DATETIMEOFFSET

#### 1.20.3.9.3. Is Required
True

#### 1.20.3.9.4. Default Value
CURRENT_TIMESTAMP


### 1.20.4. Primary Keys

- id

### 1.20.5. Unique Constraints

### 1.20.5.1. uq_subscription_merchant_active
Ensure only one active subscription per merchant (requires careful management, potentially partial index)

#### 1.20.5.1.2. Columns

- merchantId
- status

#### 1.20.5.1.3. Filter
status = 'Active'


### 1.20.6. Indexes

### 1.20.6.1. idx_subscription_merchantid
#### 1.20.6.1.2. Columns

- merchantId

### 1.20.6.2. idx_subscription_status_enddate
#### 1.20.6.2.2. Columns

- status
- endDate


## 1.21. SubscriptionPlan
Defines available subscription plans and their features/limits.

### 1.21.3. Attributes

### 1.21.3.1. id
#### 1.21.3.1.2. Type
UUID

#### 1.21.3.1.3. Is Required
True

#### 1.21.3.1.4. Is Primary Key
True

### 1.21.3.2. name
#### 1.21.3.2.2. Type
VARCHAR

#### 1.21.3.2.3. Is Required
True

#### 1.21.3.2.4. Size
50

#### 1.21.3.2.5. Is Unique
True

### 1.21.3.3. description
#### 1.21.3.3.2. Type
TEXT

#### 1.21.3.3.3. Is Required
True

### 1.21.3.4. monthlyPrice
#### 1.21.3.4.2. Type
DECIMAL

#### 1.21.3.4.3. Is Required
True

#### 1.21.3.4.4. Precision
10

#### 1.21.3.4.5. Scale
2

### 1.21.3.5. annualPrice
#### 1.21.3.5.2. Type
DECIMAL

#### 1.21.3.5.3. Is Required
True

#### 1.21.3.5.4. Precision
10

#### 1.21.3.5.5. Scale
2

### 1.21.3.6. features
JSON document listing features included in the plan (e.g., max campaigns, users, access to premium reports)

#### 1.21.3.6.2. Type
JSON

#### 1.21.3.6.3. Is Required
True

### 1.21.3.7. createdAt
#### 1.21.3.7.2. Type
DATETIMEOFFSET

#### 1.21.3.7.3. Is Required
True

#### 1.21.3.7.4. Default Value
CURRENT_TIMESTAMP

### 1.21.3.8. updatedAt
#### 1.21.3.8.2. Type
DATETIMEOFFSET

#### 1.21.3.8.3. Is Required
True

#### 1.21.3.8.4. Default Value
CURRENT_TIMESTAMP


### 1.21.4. Primary Keys

- id

### 1.21.5. Unique Constraints

### 1.21.5.1. uq_subscriptionplan_name
#### 1.21.5.1.2. Columns

- name


### 1.21.6. Indexes


## 1.22. Invoice
Stores billing invoices for merchants.

### 1.22.3. Attributes

### 1.22.3.1. id
#### 1.22.3.1.2. Type
UUID

#### 1.22.3.1.3. Is Required
True

#### 1.22.3.1.4. Is Primary Key
True

### 1.22.3.2. merchantId
#### 1.22.3.2.2. Type
UUID

#### 1.22.3.2.3. Is Required
True

#### 1.22.3.2.4. Is Foreign Key
True

### 1.22.3.3. subscriptionId
#### 1.22.3.3.2. Type
UUID

#### 1.22.3.3.3. Is Required
True

#### 1.22.3.3.4. Is Foreign Key
True

### 1.22.3.4. issueDate
#### 1.22.3.4.2. Type
DATE

#### 1.22.3.4.3. Is Required
True

### 1.22.3.5. dueDate
#### 1.22.3.5.2. Type
DATE

#### 1.22.3.5.3. Is Required
True

### 1.22.3.6. paymentDate
#### 1.22.3.6.2. Type
DATETIME

#### 1.22.3.6.3. Is Required
False

### 1.22.3.7. amount
#### 1.22.3.7.2. Type
DECIMAL

#### 1.22.3.7.3. Is Required
True

#### 1.22.3.7.4. Precision
15

#### 1.22.3.7.5. Scale
2

### 1.22.3.8. status
#### 1.22.3.8.2. Type
ENUM

#### 1.22.3.8.3. Is Required
True

#### 1.22.3.8.4. Constraints

- Issued
- Paid
- PastDue
- Voided

### 1.22.3.9. details
JSON document with line items (e.g., plan fee, ad spend credit, transaction fees)

#### 1.22.3.9.2. Type
JSON

#### 1.22.3.9.3. Is Required
False

### 1.22.3.10. createdAt
#### 1.22.3.10.2. Type
DATETIMEOFFSET

#### 1.22.3.10.3. Is Required
True

#### 1.22.3.10.4. Default Value
CURRENT_TIMESTAMP


### 1.22.4. Primary Keys

- id

### 1.22.5. Unique Constraints


### 1.22.6. Indexes

### 1.22.6.1. idx_invoice_merchantid
#### 1.22.6.1.2. Columns

- merchantId

### 1.22.6.2. idx_invoice_status_duedate
#### 1.22.6.2.2. Columns

- status
- dueDate


## 1.23. Payment
Records payment transactions associated with invoices.

### 1.23.3. Attributes

### 1.23.3.1. id
#### 1.23.3.1.2. Type
UUID

#### 1.23.3.1.3. Is Required
True

#### 1.23.3.1.4. Is Primary Key
True

### 1.23.3.2. invoiceId
#### 1.23.3.2.2. Type
UUID

#### 1.23.3.2.3. Is Required
True

#### 1.23.3.2.4. Is Foreign Key
True

### 1.23.3.3. merchantId
#### 1.23.3.3.2. Type
UUID

#### 1.23.3.3.3. Is Required
True

#### 1.23.3.3.4. Is Foreign Key
True

### 1.23.3.4. gatewayTransactionId
Transaction ID from the payment gateway

#### 1.23.3.4.2. Type
VARCHAR

#### 1.23.3.4.3. Is Required
True

#### 1.23.3.4.4. Size
255

### 1.23.3.5. amount
#### 1.23.3.5.2. Type
DECIMAL

#### 1.23.3.5.3. Is Required
True

#### 1.23.3.5.4. Precision
15

#### 1.23.3.5.5. Scale
2

### 1.23.3.6. currency
#### 1.23.3.6.2. Type
VARCHAR

#### 1.23.3.6.3. Is Required
True

#### 1.23.3.6.4. Size
3

### 1.23.3.7. status
#### 1.23.3.7.2. Type
ENUM

#### 1.23.3.7.3. Is Required
True

#### 1.23.3.7.4. Constraints

- Pending
- Successful
- Failed
- Refunded

### 1.23.3.8. paymentMethod
Payment method used (e.g., 'Mada', 'STCPay', 'Visa')

#### 1.23.3.8.2. Type
VARCHAR

#### 1.23.3.8.3. Is Required
True

#### 1.23.3.8.4. Size
50

### 1.23.3.9. timestamp
#### 1.23.3.9.2. Type
DATETIMEOFFSET

#### 1.23.3.9.3. Is Required
True

### 1.23.3.10. details
Raw response or relevant details from the payment gateway

#### 1.23.3.10.2. Type
JSON

#### 1.23.3.10.3. Is Required
False

### 1.23.3.11. createdAt
#### 1.23.3.11.2. Type
DATETIMEOFFSET

#### 1.23.3.11.3. Is Required
True

#### 1.23.3.11.4. Default Value
CURRENT_TIMESTAMP


### 1.23.4. Primary Keys

- id

### 1.23.5. Unique Constraints


### 1.23.6. Indexes

### 1.23.6.1. idx_payment_invoiceid
#### 1.23.6.1.2. Columns

- invoiceId

### 1.23.6.2. idx_payment_merchantid
#### 1.23.6.2.2. Columns

- merchantId

### 1.23.6.3. idx_payment_gatewaytransactionid
#### 1.23.6.3.2. Columns

- gatewayTransactionId

#### 1.23.6.3.3. Is Unique
True


## 1.24. AffiliateProgram
Configuration for a merchant's affiliate marketing program. Includes soft delete.

### 1.24.3. Attributes

### 1.24.3.1. id
#### 1.24.3.1.2. Type
UUID

#### 1.24.3.1.3. Is Required
True

#### 1.24.3.1.4. Is Primary Key
True

### 1.24.3.2. merchantId
One program per merchant

#### 1.24.3.2.2. Type
UUID

#### 1.24.3.2.3. Is Required
True

#### 1.24.3.2.4. Is Foreign Key
True

#### 1.24.3.2.5. Is Unique
True

### 1.24.3.3. name
#### 1.24.3.3.2. Type
VARCHAR

#### 1.24.3.3.3. Is Required
True

#### 1.24.3.3.4. Size
255

### 1.24.3.4. status
#### 1.24.3.4.2. Type
ENUM

#### 1.24.3.4.3. Is Required
True

#### 1.24.3.4.4. Constraints

- Active
- Inactive

#### 1.24.3.4.5. Default Value
'Inactive'

### 1.24.3.5. commissionStructure
JSON defining commission rates (e.g., %, flat fee) and rules (per product, category, etc.)

#### 1.24.3.5.2. Type
JSON

#### 1.24.3.5.3. Is Required
True

### 1.24.3.6. approvalWorkflow
#### 1.24.3.6.2. Type
ENUM

#### 1.24.3.6.3. Is Required
True

#### 1.24.3.6.4. Constraints

- Manual
- Automatic

#### 1.24.3.6.5. Default Value
'Manual'

### 1.24.3.7. minPayoutThreshold
#### 1.24.3.7.2. Type
DECIMAL

#### 1.24.3.7.3. Is Required
True

#### 1.24.3.7.4. Precision
10

#### 1.24.3.7.5. Scale
2

### 1.24.3.8. payoutSchedule
#### 1.24.3.8.2. Type
ENUM

#### 1.24.3.8.3. Is Required
True

#### 1.24.3.8.4. Constraints

- Weekly
- BiWeekly
- Monthly
- Quarterly

#### 1.24.3.8.5. Default Value
'Monthly'

### 1.24.3.9. cookieWindowDays
Duration in days for the attribution cookie

#### 1.24.3.9.2. Type
INT

#### 1.24.3.9.3. Is Required
True

#### 1.24.3.9.4. Default Value
30

### 1.24.3.10. termsAndConditions
#### 1.24.3.10.2. Type
TEXT

#### 1.24.3.10.3. Is Required
False

### 1.24.3.11. createdAt
#### 1.24.3.11.2. Type
DATETIMEOFFSET

#### 1.24.3.11.3. Is Required
True

#### 1.24.3.11.4. Default Value
CURRENT_TIMESTAMP

### 1.24.3.12. updatedAt
#### 1.24.3.12.2. Type
DATETIMEOFFSET

#### 1.24.3.12.3. Is Required
True

#### 1.24.3.12.4. Default Value
CURRENT_TIMESTAMP

### 1.24.3.13. deletedAt
#### 1.24.3.13.2. Type
DATETIMEOFFSET

#### 1.24.3.13.3. Is Required
False


### 1.24.4. Primary Keys

- id

### 1.24.5. Unique Constraints

### 1.24.5.1. uq_affiliateprogram_merchantid
#### 1.24.5.1.2. Columns

- merchantId

#### 1.24.5.1.3. Is Unique
True


### 1.24.6. Indexes

### 1.24.6.1. idx_affiliateprogram_deletedat
#### 1.24.6.1.2. Columns

- deletedAt


## 1.25. Affiliate
Represents an individual affiliate user registered for a merchant's program. Links to the core platform user. Includes soft delete.

### 1.25.3. Attributes

### 1.25.3.1. id
#### 1.25.3.1.2. Type
UUID

#### 1.25.3.1.3. Is Required
True

#### 1.25.3.1.4. Is Primary Key
True

### 1.25.3.2. affiliateProgramId
#### 1.25.3.2.2. Type
UUID

#### 1.25.3.2.3. Is Required
True

#### 1.25.3.2.4. Is Foreign Key
True

### 1.25.3.3. coreUserId
ID from the core platform's user database representing the affiliate user

#### 1.25.3.3.2. Type
UUID

#### 1.25.3.3.3. Is Required
True

### 1.25.3.4. status
#### 1.25.3.4.2. Type
ENUM

#### 1.25.3.4.3. Is Required
True

#### 1.25.3.4.4. Constraints

- Pending
- Approved
- Rejected
- Active
- Suspended

#### 1.25.3.4.5. Default Value
'Pending'

### 1.25.3.5. trackingCode
Unique code for generating tracking links

#### 1.25.3.5.2. Type
VARCHAR

#### 1.25.3.5.3. Is Required
True

#### 1.25.3.5.4. Size
50

#### 1.25.3.5.5. Is Unique
True

### 1.25.3.6. payoutDetails
JSON document storing payout method details (e.g., bank info, PayPal email - encrypted or tokenized)

#### 1.25.3.6.2. Type
JSON

#### 1.25.3.6.3. Is Required
False

### 1.25.3.7. createdAt
#### 1.25.3.7.2. Type
DATETIMEOFFSET

#### 1.25.3.7.3. Is Required
True

#### 1.25.3.7.4. Default Value
CURRENT_TIMESTAMP

### 1.25.3.8. updatedAt
#### 1.25.3.8.2. Type
DATETIMEOFFSET

#### 1.25.3.8.3. Is Required
True

#### 1.25.3.8.4. Default Value
CURRENT_TIMESTAMP

### 1.25.3.9. deletedAt
#### 1.25.3.9.2. Type
DATETIMEOFFSET

#### 1.25.3.9.3. Is Required
False


### 1.25.4. Primary Keys

- id

### 1.25.5. Unique Constraints

### 1.25.5.1. uq_affiliate_trackingcode
#### 1.25.5.1.2. Columns

- trackingCode

#### 1.25.5.1.3. Is Unique
True

### 1.25.5.2. uq_affiliate_program_coreuser
A core user can be an affiliate for a program only once.

#### 1.25.5.2.2. Columns

- affiliateProgramId
- coreUserId


### 1.25.6. Indexes

### 1.25.6.1. idx_affiliate_programid
#### 1.25.6.1.2. Columns

- affiliateProgramId

### 1.25.6.2. idx_affiliate_coreuserid
#### 1.25.6.2.2. Columns

- coreUserId

### 1.25.6.3. idx_affiliate_deletedat
#### 1.25.6.3.2. Columns

- deletedAt


## 1.26. AffiliateConversion
Records sales/conversions attributed to affiliates. Links to core platform orders.

### 1.26.3. Attributes

### 1.26.3.1. id
#### 1.26.3.1.2. Type
UUID

#### 1.26.3.1.3. Is Required
True

#### 1.26.3.1.4. Is Primary Key
True

### 1.26.3.2. affiliateId
#### 1.26.3.2.2. Type
UUID

#### 1.26.3.2.3. Is Required
True

#### 1.26.3.2.4. Is Foreign Key
True

### 1.26.3.3. affiliateProgramId
#### 1.26.3.3.2. Type
UUID

#### 1.26.3.3.3. Is Required
True

#### 1.26.3.3.4. Is Foreign Key
True

### 1.26.3.4. merchantId
#### 1.26.3.4.2. Type
UUID

#### 1.26.3.4.3. Is Required
True

#### 1.26.3.4.4. Is Foreign Key
True

### 1.26.3.5. coreOrderId
ID from the core platform's order database

#### 1.26.3.5.2. Type
UUID

#### 1.26.3.5.3. Is Required
True

### 1.26.3.6. conversionTimestamp
#### 1.26.3.6.2. Type
DATETIMEOFFSET

#### 1.26.3.6.3. Is Required
True

### 1.26.3.7. orderTotalAmount
#### 1.26.3.7.2. Type
DECIMAL

#### 1.26.3.7.3. Is Required
True

#### 1.26.3.7.4. Precision
15

#### 1.26.3.7.5. Scale
2

### 1.26.3.8. commissionAmount
#### 1.26.3.8.2. Type
DECIMAL

#### 1.26.3.8.3. Is Required
True

#### 1.26.3.8.4. Precision
10

#### 1.26.3.8.5. Scale
2

### 1.26.3.9. status
#### 1.26.3.9.2. Type
ENUM

#### 1.26.3.9.3. Is Required
True

#### 1.26.3.9.4. Constraints

- Pending
- Approved
- Rejected
- Paid

#### 1.26.3.9.5. Default Value
'Pending'

### 1.26.3.10. attributionDetails
JSON document detailing attribution method (e.g., tracking link click, coupon code), timestamp, IP, etc.

#### 1.26.3.10.2. Type
JSON

#### 1.26.3.10.3. Is Required
False

### 1.26.3.11. notes
Reason for rejection or other notes

#### 1.26.3.11.2. Type
TEXT

#### 1.26.3.11.3. Is Required
False

### 1.26.3.12. createdAt
#### 1.26.3.12.2. Type
DATETIMEOFFSET

#### 1.26.3.12.3. Is Required
True

#### 1.26.3.12.4. Default Value
CURRENT_TIMESTAMP


### 1.26.4. Primary Keys

- id

### 1.26.5. Unique Constraints

### 1.26.5.1. uq_affiliateconversion_orderid
An order can be attributed to at most one affiliate conversion.

#### 1.26.5.1.2. Columns

- coreOrderId

#### 1.26.5.1.3. Is Unique
True


### 1.26.6. Indexes

### 1.26.6.1. idx_affiliateconversion_affiliate_date
#### 1.26.6.1.2. Columns

- affiliateId
- conversionTimestamp

### 1.26.6.2. idx_affiliateconversion_merchant_date
#### 1.26.6.2.2. Columns

- merchantId
- conversionTimestamp

### 1.26.6.3. idx_affiliateconversion_status
#### 1.26.6.3.2. Columns

- status


## 1.27. AffiliatePayout
Records payouts made to affiliates.

### 1.27.3. Attributes

### 1.27.3.1. id
#### 1.27.3.1.2. Type
UUID

#### 1.27.3.1.3. Is Required
True

#### 1.27.3.1.4. Is Primary Key
True

### 1.27.3.2. affiliateId
#### 1.27.3.2.2. Type
UUID

#### 1.27.3.2.3. Is Required
True

#### 1.27.3.2.4. Is Foreign Key
True

### 1.27.3.3. affiliateProgramId
#### 1.27.3.3.2. Type
UUID

#### 1.27.3.3.3. Is Required
True

#### 1.27.3.3.4. Is Foreign Key
True

### 1.27.3.4. merchantId
#### 1.27.3.4.2. Type
UUID

#### 1.27.3.4.3. Is Required
True

#### 1.27.3.4.4. Is Foreign Key
True

### 1.27.3.5. periodStartDate
#### 1.27.3.5.2. Type
DATE

#### 1.27.3.5.3. Is Required
True

### 1.27.3.6. periodEndDate
#### 1.27.3.6.2. Type
DATE

#### 1.27.3.6.3. Is Required
True

### 1.27.3.7. amount
Total amount paid in this payout

#### 1.27.3.7.2. Type
DECIMAL

#### 1.27.3.7.3. Is Required
True

#### 1.27.3.7.4. Precision
15

#### 1.27.3.7.5. Scale
2

### 1.27.3.8. status
#### 1.27.3.8.2. Type
ENUM

#### 1.27.3.8.3. Is Required
True

#### 1.27.3.8.4. Constraints

- Pending
- Processing
- Paid
- Failed

#### 1.27.3.8.5. Default Value
'Pending'

### 1.27.3.9. paymentTransactionId
Reference ID for the payment transaction (if applicable)

#### 1.27.3.9.2. Type
VARCHAR

#### 1.27.3.9.3. Is Required
False

#### 1.27.3.9.4. Size
255

### 1.27.3.10. payoutDate
#### 1.27.3.10.2. Type
DATETIME

#### 1.27.3.10.3. Is Required
False

### 1.27.3.11. conversionIds
JSON array of AffiliateConversion IDs included in this payout

#### 1.27.3.11.2. Type
JSON

#### 1.27.3.11.3. Is Required
True

### 1.27.3.12. createdAt
#### 1.27.3.12.2. Type
DATETIMEOFFSET

#### 1.27.3.12.3. Is Required
True

#### 1.27.3.12.4. Default Value
CURRENT_TIMESTAMP


### 1.27.4. Primary Keys

- id

### 1.27.5. Unique Constraints


### 1.27.6. Indexes

### 1.27.6.1. idx_affiliatepayout_affiliate_period
#### 1.27.6.1.2. Columns

- affiliateId
- periodEndDate

### 1.27.6.2. idx_affiliatepayout_merchant_period
#### 1.27.6.2.2. Columns

- merchantId
- periodEndDate

### 1.27.6.3. idx_affiliatepayout_status
#### 1.27.6.3.2. Columns

- status


## 1.28. GiftOption
Configuration for merchant gift options promoted via ads. Includes soft delete.

### 1.28.3. Attributes

### 1.28.3.1. id
#### 1.28.3.1.2. Type
UUID

#### 1.28.3.1.3. Is Required
True

#### 1.28.3.1.4. Is Primary Key
True

### 1.28.3.2. merchantId
#### 1.28.3.2.2. Type
UUID

#### 1.28.3.2.3. Is Required
True

#### 1.28.3.2.4. Is Foreign Key
True

### 1.28.3.3. name
#### 1.28.3.3.2. Type
VARCHAR

#### 1.28.3.3.3. Is Required
True

#### 1.28.3.3.4. Size
255

### 1.28.3.4. type
#### 1.28.3.4.2. Type
ENUM

#### 1.28.3.4.3. Is Required
True

#### 1.28.3.4.4. Constraints

- CustomNote
- BrandedCard

### 1.28.3.5. configuration
JSON defining option details (e.g., card design, message limits, extra cost)

#### 1.28.3.5.2. Type
JSON

#### 1.28.3.5.3. Is Required
True

### 1.28.3.6. isActive
#### 1.28.3.6.2. Type
BOOLEAN

#### 1.28.3.6.3. Is Required
True

#### 1.28.3.6.4. Default Value
True

### 1.28.3.7. createdAt
#### 1.28.3.7.2. Type
DATETIMEOFFSET

#### 1.28.3.7.3. Is Required
True

#### 1.28.3.7.4. Default Value
CURRENT_TIMESTAMP

### 1.28.3.8. updatedAt
#### 1.28.3.8.2. Type
DATETIMEOFFSET

#### 1.28.3.8.3. Is Required
True

#### 1.28.3.8.4. Default Value
CURRENT_TIMESTAMP

### 1.28.3.9. deletedAt
#### 1.28.3.9.2. Type
DATETIMEOFFSET

#### 1.28.3.9.3. Is Required
False


### 1.28.4. Primary Keys

- id

### 1.28.5. Unique Constraints


### 1.28.6. Indexes

### 1.28.6.1. idx_giftoption_merchantid_active
#### 1.28.6.1.2. Columns

- merchantId
- isActive

### 1.28.6.2. idx_giftoption_deletedat
#### 1.28.6.2.2. Columns

- deletedAt


## 1.29. SeoSetting
Stores SEO configurations for merchant content (product pages, blog, landing pages). Includes soft delete.

### 1.29.3. Attributes

### 1.29.3.1. id
#### 1.29.3.1.2. Type
UUID

#### 1.29.3.1.3. Is Required
True

#### 1.29.3.1.4. Is Primary Key
True

### 1.29.3.2. merchantId
#### 1.29.3.2.2. Type
UUID

#### 1.29.3.2.3. Is Required
True

#### 1.29.3.2.4. Is Foreign Key
True

### 1.29.3.3. pageType
#### 1.29.3.3.2. Type
ENUM

#### 1.29.3.3.3. Is Required
True

#### 1.29.3.3.4. Constraints

- ProductPage
- BlogPage
- LandingPage
- Homepage
- CollectionPage

### 1.29.3.4. coreEntityId
ID of the core entity (e.g., core Product ID, core Collection ID, Ad Manager Landing Page ID) this setting applies to (null for Homepage)

#### 1.29.3.4.2. Type
UUID

#### 1.29.3.4.3. Is Required
False

### 1.29.3.5. configuration
JSON defining SEO parameters (meta title, meta description, keywords, schema markup, canonical URL)

#### 1.29.3.5.2. Type
JSON

#### 1.29.3.5.3. Is Required
True

### 1.29.3.6. createdAt
#### 1.29.3.6.2. Type
DATETIMEOFFSET

#### 1.29.3.6.3. Is Required
True

#### 1.29.3.6.4. Default Value
CURRENT_TIMESTAMP

### 1.29.3.7. updatedAt
#### 1.29.3.7.2. Type
DATETIMEOFFSET

#### 1.29.3.7.3. Is Required
True

#### 1.29.3.7.4. Default Value
CURRENT_TIMESTAMP

### 1.29.3.8. deletedAt
#### 1.29.3.8.2. Type
DATETIMEOFFSET

#### 1.29.3.8.3. Is Required
False


### 1.29.4. Primary Keys

- id

### 1.29.5. Unique Constraints

### 1.29.5.1. uq_seosetting_merchant_pagetype_entity
Unique setting per merchant, page type, and specific entity (if applicable).

#### 1.29.5.1.2. Columns

- merchantId
- pageType
- coreEntityId


### 1.29.6. Indexes

### 1.29.6.1. idx_seosetting_merchant_pagetype
#### 1.29.6.1.2. Columns

- merchantId
- pageType

### 1.29.6.2. idx_seosetting_deletedat
#### 1.29.6.2.2. Columns

- deletedAt




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

