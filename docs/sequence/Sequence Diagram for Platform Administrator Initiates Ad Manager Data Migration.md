sequenceDiagram
    actor "PlatformAdminPortal" as platformadminportalspa037
    participant "APIGateway" as admanagerapigateway019
    participant "PlatformAdminService" as platformadministrationservice010
    participant "AdEventsQueue" as adeventsqueue020
    participant "DataGovernanceService" as datagovernancecomplianceservice011
    participant "CampaignMgmtService" as campaignmanagementservice001
    participant "ProductCatalogService" as productcatalogservice002
    participant "PostgreSQLDB" as admanagerpostgresqldb022
    participant "DynamoDBTables" as admanagerdynamodbtables023

    note over platformadminportalspa037: Platform Administrator initiates migration. Job configuration includes source details, data scope (e.g., specific merchants, campaign data, catalog data), and source credentials/location if applicable.

    platformadminportalspa037-admanagerapigateway019: 1. POST /admin/data-migration/jobs (jobConfig: source, merchants, scope)
    activate admanagerapigateway019

    admanagerapigateway019-platformadministrationservice010: 2. initiateDataMigration(jobConfig)
    activate platformadministrationservice010

    platformadministrationservice010-admanagerpostgresqldb022: 2.1. INSERT MigrationJob (jobId, status: Submitted, config)
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--platformadministrationservice010: 2.1. Success
    deactivate admanagerpostgresqldb022

    platformadministrationservice010-adeventsqueue020: 2.2. Publish[StartDataMigrationJob(jobId, jobConfig)]

    platformadministrationservice010--admanagerapigateway019: 2. 202 Accepted (jobId)
    deactivate platformadministrationservice010

    admanagerapigateway019--platformadminportalspa037: 1. 202 Accepted (jobId)
    deactivate admanagerapigateway019

    platformadminportalspa037-platformadminportalspa037: 3. [Display Job Submitted (jobId)]

    adeventsqueue020-datagovernancecomplianceservice011: 4. Consume[StartDataMigrationJob(jobId, jobConfig)]
    activate datagovernancecomplianceservice011
    note right of datagovernancecomplianceservice011: REQ-DOMS-005 (ETL Procedures) is implemented by DataGovernanceService.

    datagovernancecomplianceservice011-platformadministrationservice010: 4.1. PUT /internal/migration-jobs/{jobId}/status (status: InProgress:Extracting)
    activate platformadministrationservice010
    platformadministrationservice010-admanagerpostgresqldb022: 4.1.1. UPDATE MigrationJob SET status = 'InProgress:Extracting'
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--platformadministrationservice010: 4.1.1. Success
    deactivate admanagerpostgresqldb022
    platformadministrationservice010--datagovernancecomplianceservice011: 4.1. Success
    deactivate platformadministrationservice010

    datagovernancecomplianceservice011-datagovernancecomplianceservice011: 4.2. [Perform Data Extraction from Source System (Loop for batches/sources)]
    note right of datagovernancecomplianceservice011: DataGovernanceService handles the complex ETL (Extract, Transform, Load) logic. Extraction, Transformation phases are shown as internal steps. Error handling and retry mechanisms are assumed within these steps.

    datagovernancecomplianceservice011-platformadministrationservice010: 4.3. PUT /internal/migration-jobs/{jobId}/status (status: InProgress:Transforming)
    activate platformadministrationservice010
    platformadministrationservice010-admanagerpostgresqldb022: 4.3.1. UPDATE MigrationJob SET status = 'InProgress:Transforming'
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--platformadministrationservice010: 4.3.1. Success
    deactivate admanagerpostgresqldb022
    platformadministrationservice010--datagovernancecomplianceservice011: 4.3. Success
    deactivate platformadministrationservice010

    datagovernancecomplianceservice011-datagovernancecomplianceservice011: 4.4. [Perform Data Transformation (Loop for batches)]

    datagovernancecomplianceservice011-platformadministrationservice010: 4.5. PUT /internal/migration-jobs/{jobId}/status (status: InProgress:Loading)
    activate platformadministrationservice010
    platformadministrationservice010-admanagerpostgresqldb022: 4.5.1. UPDATE MigrationJob SET status = 'InProgress:Loading'
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--platformadministrationservice010: 4.5.1. Success
    deactivate admanagerpostgresqldb022
    platformadministrationservice010--datagovernancecomplianceservice011: 4.5. Success
    deactivate platformadministrationservice010

    loop 4.6 For each batch of transformed data
        alt 4.6.1 if datatype is 'CampaignData'
            datagovernancecomplianceservice011-campaignmanagementservice001: 4.6.1.1. POST /internal/migrations/campaigns (batchData)
            activate campaignmanagementservice001
            note right of campaignmanagementservice001: Loading data into target services (CampaignMgmtService, ProductCatalogService) is done in batches. These services are responsible for validating and persisting their respective domain data.
            campaignmanagementservice001-campaignmanagementservice001: 4.6.1.1.1. [Validate & Store Campaign Batch]
            campaignmanagementservice001-admanagerpostgresqldb022: 4.6.1.1.1.1. INSERT/UPDATE CampaignMetadata
            activate admanagerpostgresqldb022
            admanagerpostgresqldb022--campaignmanagementservice001: 4.6.1.1.1.1. DBSuccess/Failure
            deactivate admanagerpostgresqldb022
            campaignmanagementservice001-admanagerdynamodbtables023: 4.6.1.1.1.2. INSERT/UPDATE CampaignPerformanceLogs (if applicable)
            activate admanagerdynamodbtables023
            admanagerdynamodbtables023--campaignmanagementservice001: 4.6.1.1.1.2. DBSuccess/Failure
            deactivate admanagerdynamodbtables023
            campaignmanagementservice001--datagovernancecomplianceservice011: 4.6.1.1. Response (batchstatus, errors)
            deactivate campaignmanagementservice001
        else 4.6.2 if datatype is 'ProductCatalogData'
            datagovernancecomplianceservice011-productcatalogservice002: 4.6.2.1. POST /internal/migrations/product-catalogs (batchData)
            activate productcatalogservice002
            productcatalogservice002-productcatalogservice002: 4.6.2.1.1. [Validate & Store Catalog Batch]
            productcatalogservice002-admanagerpostgresqldb022: 4.6.2.1.1.1. INSERT/UPDATE CatalogMetadata
            activate admanagerpostgresqldb022
            admanagerpostgresqldb022--productcatalogservice002: 4.6.2.1.1.1. DBSuccess/Failure
            deactivate admanagerpostgresqldb022
            productcatalogservice002-admanagerdynamodbtables023: 4.6.2.1.1.2. INSERT/UPDATE ProductFeeds (if applicable)
            activate admanagerdynamodbtables023
            admanagerdynamodbtables023--productcatalogservice002: 4.6.2.1.1.2. DBSuccess/Failure
            deactivate admanagerdynamodbtables023
            productcatalogservice002--datagovernancecomplianceservice011: 4.6.2.1. Response (batchstatus, errors)
            deactivate productcatalogservice002
        end
        datagovernancecomplianceservice011-datagovernancecomplianceservice011: 4.6.3. [Aggregate batch loading results, log progress]
    end

    datagovernancecomplianceservice011-platformadministrationservice010: 4.7. PUT /internal/migration-jobs/{jobId}/status (status: InProgress:Validating)
    activate platformadministrationservice010
    platformadministrationservice010-admanagerpostgresqldb022: 4.7.1. UPDATE MigrationJob SET status = 'InProgress:Validating'
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--platformadministrationservice010: 4.7.1. Success
    deactivate admanagerpostgresqldb022
    platformadministrationservice010--datagovernancecomplianceservice011: 4.7. Success
    deactivate platformadministrationservice010

    datagovernancecomplianceservice011-datagovernancecomplianceservice011: 4.8. [Perform Post-Load Validation (Query CMS, PCS, PGDB, DDB for checks)]

    datagovernancecomplianceservice011-platformadministrationservice010: 4.9. PUT /internal/migration-jobs/{jobId}/complete (finalStatus, validationReportUrl)
    activate platformadministrationservice010
    platformadministrationservice010-admanagerpostgresqldb022: 4.9.1. UPDATE MigrationJob SET status=finalStatus, reportUrl=validationReportUrl
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--platformadministrationservice010: 4.9.1. Success
    deactivate admanagerpostgresqldb022
    platformadministrationservice010--datagovernancecomplianceservice011: 4.9. Success
    deactivate platformadministrationservice010

    deactivate datagovernancecomplianceservice011

    platformadminportalspa037-admanagerapigateway019: 5. GET /admin/data-migration/jobs/{jobId}
    activate admanagerapigateway019

    admanagerapigateway019-platformadministrationservice010: 6. getMigrationJobDetails(jobId)
    activate platformadministrationservice010
    note over platformadministrationservice010: Final validation report might include record counts, error summaries, and links to detailed logs.
    platformadministrationservice010-admanagerpostgresqldb022: 6.1. SELECT * FROM MigrationJob WHERE id = jobId
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--platformadministrationservice010: 6.1. JobDetails
    deactivate admanagerpostgresqldb022
    platformadministrationservice010--admanagerapigateway019: 6. JobDetails (status, progress, validationReportUrl)
    deactivate platformadministrationservice010

    admanagerapigateway019--platformadminportalspa037: 5. JobDetails (status, progress, validationReportUrl)
    deactivate admanagerapigateway019

    platformadminportalspa037-platformadminportalspa037: 7. [Display Migration Job Status and Report]
