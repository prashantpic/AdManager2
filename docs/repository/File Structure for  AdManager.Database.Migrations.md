# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project dependencies and scripts for managing the database migrations repository. Includes TypeORM, PostgreSQL driver, TypeScript, and related tools.  
**Template:** Node.js PackageManifest  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** package.json  
**Repository Id:** REPO-DBMIG-002  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - DependencyManagement
    - ScriptExecution
    
**Requirement Ids:**
    
    - 3.2.7 (DB migrations part)
    
**Purpose:** To manage project dependencies and provide scripts for common tasks like running migrations.  
**Logic Description:** Contains dependencies like typeorm, pg, typescript, ts-node. Scripts section includes commands for typeorm migration:run, migration:generate, migration:revert, etc. Ensures TypeORM CLI commands are configured for migration management.  
**Documentation:**
    
    - **Summary:** Standard package.json file for a Node.js/TypeScript project, configured for TypeORM database migrations for PostgreSQL_AdManagerDB.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** tsconfig.json  
**Description:** TypeScript compiler configuration for the database migrations project. Specifies options for compiling TypeScript migration files to JavaScript.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** tsconfig.json  
**Repository Id:** REPO-DBMIG-002  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScriptCompilation
    
**Requirement Ids:**
    
    - 3.2.7 (DB migrations part)
    
**Purpose:** To configure the TypeScript compiler for the project.  
**Logic Description:** Standard tsconfig.json with settings suitable for a TypeORM project, including 'target': 'ES2021', 'module': 'commonjs', 'outDir': './dist', 'rootDir': './', 'strict': true, 'esModuleInterop': true, 'experimentalDecorators': true, 'emitDecoratorMetadata': true. Specifies 'include' for 'database/migrations/**/*.ts' and 'data-source.ts'.  
**Documentation:**
    
    - **Summary:** Configuration file for the TypeScript compiler, ensuring migration scripts are correctly processed and compatible with TypeORM.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** data-source.ts  
**Description:** TypeORM data source configuration. Defines the connection to the PostgreSQL database (PostgreSQL_AdManagerDB), specifies entities (if any for CLI context), and points to migration script locations. Used by TypeORM CLI.  
**Template:** TypeORM DataSource Configuration  
**Dependancy Level:** 0  
**Name:** data-source  
**Type:** Configuration  
**Relative Path:** data-source.ts  
**Repository Id:** REPO-DBMIG-002  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** AppDataSource  
**Type:** DataSource  
**Attributes:** export const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - DatabaseConnectionConfiguration
    - MigrationPathConfiguration
    
**Requirement Ids:**
    
    - 3.2.7 (DB migrations part)
    - 3.4.1 (DB migrations part)
    
**Purpose:** To provide TypeORM with database connection details and paths to migration files for PostgreSQL_AdManagerDB.  
**Logic Description:** Imports 'DataSource' from 'typeorm' and 'dotenv/config'. Initializes a new DataSource instance with type 'postgres', host, port, username, password, database name (sourced from environment variables like process.env.DB_HOST). Sets 'synchronize': false (critical for migrations), 'logging': true (for development), 'migrations': ['database/migrations/**/*.ts'], 'migrationsTableName': 'custom_migrations_table'. Exports the DataSource instance.  
**Documentation:**
    
    - **Summary:** Configures and exports the TypeORM DataSource, essential for CLI operations and connecting to the PostgreSQL_AdManagerDB.
    
**Namespace:** AdManager.Database  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** database/migrations/1000000000000-CreateBaseInfrastructureTables.ts  
**Description:** Initial schema migration to create foundational tables for PostgreSQL_AdManagerDB: Merchants, UserRoles, and AdManagerUsers.  
**Template:** TypeORM Migration  
**Dependancy Level:** 1  
**Name:** 1000000000000-CreateBaseInfrastructureTables  
**Type:** MigrationScript  
**Relative Path:** migrations/1000000000000-CreateBaseInfrastructureTables.ts  
**Repository Id:** REPO-DBMIG-002  
**Pattern Ids:**
    
    - DatabaseMigration
    
**Members:**
    
    
**Methods:**
    
    - **Name:** up  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** down  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - SchemaMigration
    - TableCreation: Merchant
    - TableCreation: UserRole
    - TableCreation: AdManagerUser
    
**Requirement Ids:**
    
    - 3.2.7 (DB migrations part)
    - 3.4.1 (DB migrations part)
    
**Purpose:** To establish the initial tables for merchants and user management within PostgreSQL_AdManagerDB.  
**Logic Description:** The 'up' method uses queryRunner.createTable for 'Merchant' (id UUID PK), 'UserRole' (id UUID PK, name VARCHAR UK), and 'AdManagerUser' (id UUID PK, coreUserId UUID UK, roleId UUID FK to UserRole, merchantId UUID FK to Merchant). Defines columns, primary keys, foreign keys, and unique constraints. The 'down' method uses queryRunner.dropTable for these tables in reverse order.  
**Documentation:**
    
    - **Summary:** Creates core tables for merchant identity and user roles/accounts. 'up' creates tables, 'down' drops them.
    
**Namespace:** AdManager.Database.Migrations  
**Metadata:**
    
    - **Category:** DataAccess
    
- **Path:** database/migrations/1000000000001-CreateCampaignManagementTables.ts  
**Description:** Migration script to create tables related to campaign management in PostgreSQL_AdManagerDB: Campaign, AdNetwork, CampaignAdNetwork, AdSet, AdCreative, Ad.  
**Template:** TypeORM Migration  
**Dependancy Level:** 1  
**Name:** 1000000000001-CreateCampaignManagementTables  
**Type:** MigrationScript  
**Relative Path:** migrations/1000000000001-CreateCampaignManagementTables.ts  
**Repository Id:** REPO-DBMIG-002  
**Pattern Ids:**
    
    - DatabaseMigration
    
**Members:**
    
    
**Methods:**
    
    - **Name:** up  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** down  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - SchemaMigration
    - TableCreation: Campaign
    - TableCreation: AdNetwork
    - TableCreation: CampaignAdNetwork
    - TableCreation: AdSet
    - TableCreation: AdCreative
    - TableCreation: Ad
    
**Requirement Ids:**
    
    - 3.2.7 (DB migrations part)
    - 3.4.1 (DB migrations part)
    
**Purpose:** To define the schema for core advertising campaign entities in PostgreSQL_AdManagerDB.  
**Logic Description:** The 'up' method uses queryRunner.createTable for 'Campaign' (FK to Merchant), 'AdNetwork', 'CampaignAdNetwork' (join table for Campaign and AdNetwork), 'AdSet' (FK to Campaign, AdNetwork), 'AdCreative' (FK to Merchant, AdNetwork), 'Ad' (FK to AdSet, AdCreative, Promotion). Defines columns, types, PKs, FKs, and constraints. The 'down' method drops these tables in reverse order.  
**Documentation:**
    
    - **Summary:** Creates tables for managing advertising campaigns, ad networks, ad sets, creatives, and ads. 'up' creates tables, 'down' drops them.
    
**Namespace:** AdManager.Database.Migrations  
**Metadata:**
    
    - **Category:** DataAccess
    
- **Path:** database/migrations/1000000000002-CreateProductCatalogTables.ts  
**Description:** Migration script for creating product catalog related tables in PostgreSQL_AdManagerDB: ProductCatalog, Product.  
**Template:** TypeORM Migration  
**Dependancy Level:** 1  
**Name:** 1000000000002-CreateProductCatalogTables  
**Type:** MigrationScript  
**Relative Path:** migrations/1000000000002-CreateProductCatalogTables.ts  
**Repository Id:** REPO-DBMIG-002  
**Pattern Ids:**
    
    - DatabaseMigration
    
**Members:**
    
    
**Methods:**
    
    - **Name:** up  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** down  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - SchemaMigration
    - TableCreation: ProductCatalog
    - TableCreation: Product
    
**Requirement Ids:**
    
    - 3.2.7 (DB migrations part)
    - 3.4.1 (DB migrations part)
    
**Purpose:** To establish the schema for managing product catalogs and individual products for advertising in PostgreSQL_AdManagerDB.  
**Logic Description:** The 'up' method uses queryRunner.createTable for 'ProductCatalog' (FK to Merchant) and 'Product' (FK to ProductCatalog, Merchant). 'Product' includes fields for ad-specific overrides (e.g., adTitle) and a reference to core platform product ID. The 'down' method drops these tables.  
**Documentation:**
    
    - **Summary:** Creates tables for product catalogs and their associated products. 'up' creates tables, 'down' drops them.
    
**Namespace:** AdManager.Database.Migrations  
**Metadata:**
    
    - **Category:** DataAccess
    
- **Path:** database/migrations/1000000000003-CreatePromotionTables.ts  
**Description:** Migration script for creating promotion related tables in PostgreSQL_AdManagerDB: Promotion, DiscountCode.  
**Template:** TypeORM Migration  
**Dependancy Level:** 1  
**Name:** 1000000000003-CreatePromotionTables  
**Type:** MigrationScript  
**Relative Path:** migrations/1000000000003-CreatePromotionTables.ts  
**Repository Id:** REPO-DBMIG-002  
**Pattern Ids:**
    
    - DatabaseMigration
    
**Members:**
    
    
**Methods:**
    
    - **Name:** up  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** down  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - SchemaMigration
    - TableCreation: Promotion
    - TableCreation: DiscountCode
    
**Requirement Ids:**
    
    - 3.2.7 (DB migrations part)
    - 3.4.1 (DB migrations part)
    
**Purpose:** To set up the database schema for promotions and discount codes in PostgreSQL_AdManagerDB.  
**Logic Description:** The 'up' method uses queryRunner.createTable for 'Promotion' (FK to Merchant) and 'DiscountCode' (FK to Promotion, Merchant, with unique code VARCHAR). These tables will store details about different types of promotions. The 'down' method drops these tables.  
**Documentation:**
    
    - **Summary:** Creates tables for managing promotions and discount codes. 'up' creates tables, 'down' drops them.
    
**Namespace:** AdManager.Database.Migrations  
**Metadata:**
    
    - **Category:** DataAccess
    
- **Path:** database/migrations/1000000000004-CreateABTestingTables.ts  
**Description:** Migration script for creating A/B testing related tables in PostgreSQL_AdManagerDB: ABTest. Note: Detailed event logs are in DynamoDB.  
**Template:** TypeORM Migration  
**Dependancy Level:** 1  
**Name:** 1000000000004-CreateABTestingTables  
**Type:** MigrationScript  
**Relative Path:** migrations/1000000000004-CreateABTestingTables.ts  
**Repository Id:** REPO-DBMIG-002  
**Pattern Ids:**
    
    - DatabaseMigration
    
**Members:**
    
    
**Methods:**
    
    - **Name:** up  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** down  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - SchemaMigration
    - TableCreation: ABTest
    
**Requirement Ids:**
    
    - 3.2.7 (DB migrations part)
    - 3.4.1 (DB migrations part)
    
**Purpose:** To establish the schema for managing A/B test configurations within campaigns in PostgreSQL_AdManagerDB.  
**Logic Description:** The 'up' method uses queryRunner.createTable for 'ABTest' (FK to Campaign, Merchant). It stores test name, type, start/end dates. The 'down' method drops the table.  
**Documentation:**
    
    - **Summary:** Creates table for A/B test configurations. 'up' creates the table, 'down' drops it.
    
**Namespace:** AdManager.Database.Migrations  
**Metadata:**
    
    - **Category:** DataAccess
    
- **Path:** database/migrations/1000000000005-CreateAudienceAndContentTables.ts  
**Description:** Migration script for creating tables related to audiences, landing pages, and SEO settings in PostgreSQL_AdManagerDB: Audience, LandingPage, SeoSetting.  
**Template:** TypeORM Migration  
**Dependancy Level:** 1  
**Name:** 1000000000005-CreateAudienceAndContentTables  
**Type:** MigrationScript  
**Relative Path:** migrations/1000000000005-CreateAudienceAndContentTables.ts  
**Repository Id:** REPO-DBMIG-002  
**Pattern Ids:**
    
    - DatabaseMigration
    
**Members:**
    
    
**Methods:**
    
    - **Name:** up  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** down  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - SchemaMigration
    - TableCreation: Audience
    - TableCreation: LandingPage
    - TableCreation: SeoSetting
    
**Requirement Ids:**
    
    - 3.2.7 (DB migrations part)
    - 3.4.1 (DB migrations part)
    
**Purpose:** To define the schema for managing audiences, custom landing pages, and SEO configurations in PostgreSQL_AdManagerDB.  
**Logic Description:** The 'up' method uses queryRunner.createTable for 'Audience' (FK to Merchant), 'LandingPage' (FK to Merchant, optionally Campaign, unique URL slug), and 'SeoSetting' (FK to Merchant, composite UK on pageType and coreEntityId). The 'down' method drops these tables.  
**Documentation:**
    
    - **Summary:** Creates tables for audiences, landing pages, and SEO settings. 'up' creates tables, 'down' drops them.
    
**Namespace:** AdManager.Database.Migrations  
**Metadata:**
    
    - **Category:** DataAccess
    
- **Path:** database/migrations/1000000000006-CreatePerformanceAndAffiliateTables.ts  
**Description:** Migration for performance summaries and affiliate marketing tables in PostgreSQL_AdManagerDB: DailyCampaignPerformanceSummary, AffiliateProgram, Affiliate, AffiliateConversion, AffiliatePayout.  
**Template:** TypeORM Migration  
**Dependancy Level:** 1  
**Name:** 1000000000006-CreatePerformanceAndAffiliateTables  
**Type:** MigrationScript  
**Relative Path:** migrations/1000000000006-CreatePerformanceAndAffiliateTables.ts  
**Repository Id:** REPO-DBMIG-002  
**Pattern Ids:**
    
    - DatabaseMigration
    
**Members:**
    
    
**Methods:**
    
    - **Name:** up  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** down  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - SchemaMigration
    - TableCreation: DailyCampaignPerformanceSummary
    - TableCreation: AffiliateProgram
    - TableCreation: Affiliate
    - TableCreation: AffiliateConversion
    - TableCreation: AffiliatePayout
    
**Requirement Ids:**
    
    - 3.2.7 (DB migrations part)
    - 3.4.1 (DB migrations part)
    
**Purpose:** To establish schemas for aggregated performance data and affiliate marketing features in PostgreSQL_AdManagerDB.  
**Logic Description:** The 'up' method creates tables: 'DailyCampaignPerformanceSummary' (composite PK: date, campaignId, adNetworkId, merchantId), 'AffiliateProgram' (FK Merchant), 'Affiliate' (FK AffiliateProgram, coreUserId), 'AffiliateConversion' (FK Affiliate, unique coreOrderId), 'AffiliatePayout' (FK Affiliate). Defines relevant columns and constraints. The 'down' method drops these tables.  
**Documentation:**
    
    - **Summary:** Creates tables for daily performance summaries and affiliate program management. 'up' creates tables, 'down' drops them.
    
**Namespace:** AdManager.Database.Migrations  
**Metadata:**
    
    - **Category:** DataAccess
    
- **Path:** database/migrations/1000000000007-CreateBillingAndPlatformTables.ts  
**Description:** Migration script for billing, platform configuration, and audit tables in PostgreSQL_AdManagerDB: SubscriptionPlan, Subscription, Invoice, Payment, GiftOption, IntegrationConfig, AuditLog, ConfigurationSetting.  
**Template:** TypeORM Migration  
**Dependancy Level:** 1  
**Name:** 1000000000007-CreateBillingAndPlatformTables  
**Type:** MigrationScript  
**Relative Path:** migrations/1000000000007-CreateBillingAndPlatformTables.ts  
**Repository Id:** REPO-DBMIG-002  
**Pattern Ids:**
    
    - DatabaseMigration
    
**Members:**
    
    
**Methods:**
    
    - **Name:** up  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    - **Name:** down  
**Parameters:**
    
    - queryRunner: QueryRunner
    
**Return Type:** Promise<void>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - SchemaMigration
    - TableCreation: SubscriptionPlan
    - TableCreation: Subscription
    - TableCreation: Invoice
    - TableCreation: Payment
    - TableCreation: GiftOption
    - TableCreation: IntegrationConfig
    - TableCreation: AuditLog
    - TableCreation: ConfigurationSetting
    
**Requirement Ids:**
    
    - 3.2.7 (DB migrations part)
    - 3.4.1 (DB migrations part)
    
**Purpose:** To define schemas for subscription billing, platform settings, and general operational tables in PostgreSQL_AdManagerDB.  
**Logic Description:** The 'up' method creates tables: 'SubscriptionPlan', 'Subscription' (FK Merchant, Plan), 'Invoice' (FK Merchant, Subscription), 'Payment' (FK Invoice, Merchant), 'GiftOption' (FK Merchant), 'IntegrationConfig' (FK Merchant, unique type per merchant), 'AuditLog' (FK User, Merchant), and 'ConfigurationSetting' (unique key, optional FK Merchant for overrides). The 'down' method drops these tables.  
**Documentation:**
    
    - **Summary:** Creates tables for billing, platform configuration, and audit logging. 'up' creates tables, 'down' drops them.
    
**Namespace:** AdManager.Database.Migrations  
**Metadata:**
    
    - **Category:** DataAccess
    
- **Path:** database/seeds/01-UserRoles.seed.ts  
**Description:** Seed script to populate the UserRole table with initial roles (e.g., Merchant Admin, Campaign Manager, Platform Administrator) in PostgreSQL_AdManagerDB.  
**Template:** TypeORM Seeder (Custom or using a library)  
**Dependancy Level:** 1  
**Name:** 01-UserRoles.seed  
**Type:** SeedScript  
**Relative Path:** seeds/01-UserRoles.seed.ts  
**Repository Id:** REPO-DBMIG-002  
**Pattern Ids:**
    
    - DatabaseSeeding
    
**Members:**
    
    
**Methods:**
    
    - **Name:** run  
**Parameters:**
    
    - dataSource: DataSource
    - factory: SeederFactory
    
**Return Type:** Promise<any>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - DataSeeding: UserRole
    
**Requirement Ids:**
    
    - 3.4.1 (DB migrations part)
    
**Purpose:** To insert predefined user roles into the database after schema creation for PostgreSQL_AdManagerDB.  
**Logic Description:** The 'run' method uses the dataSource to get the repository for 'UserRole'. It then inserts records for 'Merchant Admin', 'Campaign Manager', and 'Platform Administrator' if they do not already exist, ensuring foundational roles are available.  
**Documentation:**
    
    - **Summary:** Populates the UserRole table with essential system roles. This script is typically run after migrations that create the UserRole table.
    
**Namespace:** AdManager.Database.Seeds  
**Metadata:**
    
    - **Category:** DataAccess
    
- **Path:** database/seeds/02-InitialSubscriptionPlans.seed.ts  
**Description:** Seed script to populate the SubscriptionPlan table with initial plan offerings (e.g., Basic, Pro, Plus) in PostgreSQL_AdManagerDB.  
**Template:** TypeORM Seeder (Custom or using a library)  
**Dependancy Level:** 1  
**Name:** 02-InitialSubscriptionPlans.seed  
**Type:** SeedScript  
**Relative Path:** seeds/02-InitialSubscriptionPlans.seed.ts  
**Repository Id:** REPO-DBMIG-002  
**Pattern Ids:**
    
    - DatabaseSeeding
    
**Members:**
    
    
**Methods:**
    
    - **Name:** run  
**Parameters:**
    
    - dataSource: DataSource
    - factory: SeederFactory
    
**Return Type:** Promise<any>  
**Attributes:** public async  
    
**Implemented Features:**
    
    - DataSeeding: SubscriptionPlan
    
**Requirement Ids:**
    
    - 3.4.1 (DB migrations part)
    
**Purpose:** To insert predefined subscription plans into the database for PostgreSQL_AdManagerDB.  
**Logic Description:** The 'run' method uses the dataSource to get the repository for 'SubscriptionPlan'. It then inserts records for 'Basic', 'Pro', and 'Plus' subscription plans, including their names, features, and prices, if they do not already exist.  
**Documentation:**
    
    - **Summary:** Populates the SubscriptionPlan table with initial available plans. This script is run after migrations creating the SubscriptionPlan table.
    
**Namespace:** AdManager.Database.Seeds  
**Metadata:**
    
    - **Category:** DataAccess
    


---

# 2. Configuration

- **Feature Toggles:**
  
  
- **Database Configs:**
  
  - DB_TYPE
  - DB_HOST
  - DB_PORT
  - DB_USERNAME
  - DB_PASSWORD
  - DB_DATABASE_NAME
  - DB_SYNCHRONIZE_SCHEMA
  - DB_LOGGING_LEVEL
  - DB_MIGRATIONS_PATH
  - DB_MIGRATIONS_TABLE_NAME
  - DB_ENTITIES_PATH
  


---

