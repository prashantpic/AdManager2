sequenceDiagram
    actor "Merchant Ad Manager Portal" as merchantadmanagerportalspa018
    participant "Ad Manager API Gateway" as admanagerapigateway019
    participant "Campaign Management Service" as campaignmanagementservice001
    participant "Ad Network Integration Service" as adnetworkintegrationservice003
    participant "Ad Manager PostgreSQL DB" as admanagerpostgresqldb022
    participant "Analytics Reporting Service" as analyticsreportingservice012
    participant "Ad Manager DynamoDB Tables" as admanagerdynamodbtables023

    activate merchantadmanagerportalspa018
    merchantadmanagerportalspa018-merchantadmanagerportalspa018: 1. Merchant defines A/B Test parameters (element, variations, metrics, allocation)
    
    merchantadmanagerportalspa018-admanagerapigateway019: 2. POST /abtests (ABTestSetupRequest)
    activate admanagerapigateway019
    admanagerapigateway019-campaignmanagementservice001: 2.1. createABTest(ABTestSetupRequest)
    activate campaignmanagementservice001
    
    campaignmanagementservice001-campaignmanagementservice001: 2.1.1. Validate A/B Test Parameters
    
    campaignmanagementservice001-admanagerpostgresqldb022: 2.1.2. INSERT INTO ABTests (metadata, variations)
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--campaignmanagementservice001: 2.1.2. ABTestMetadata (ID, ack)
    deactivate admanagerpostgresqldb022
    
    alt 2.1.3. If AdNetworkSyncRequired (e.g., new creatives for variations)
        campaignmanagementservice001-adnetworkintegrationservice003: 2.1.3.1. setupVariationsOnNetwork(ABTestDetails, Variations)
        activate adnetworkintegrationservice003
        adnetworkintegrationservice003-adnetworkintegrationservice003: 2.1.3.1.1. [External] Call Ad Network API to create/update variations (Loop if needed)
        adnetworkintegrationservice003--campaignmanagementservice001: 2.1.3.1. AdNetworkSetupStatus (Success/Failure)
        deactivate adnetworkintegrationservice003

        alt 2.1.3.2. If AdNetworkSetupStatus is Failure
            campaignmanagementservice001-campaignmanagementservice001: 2.1.3.2.1. Log error, update A/B Test status to 'SetupFailed'
        end
    end
    
    campaignmanagementservice001--admanagerapigateway019: 2.1. ABTestCreationResponse
    deactivate campaignmanagementservice001
    
    admanagerapigateway019--merchantadmanagerportalspa018: 2. ABTestCreationResponse
    deactivate admanagerapigateway019
    
    merchantadmanagerportalspa018-merchantadmanagerportalspa018: 3. Display A/B Test Created Confirmation / Error
    deactivate merchantadmanagerportalspa018

    note over analyticsreportingservice012: Performance data for A/B test variations (impressions, clicks, conversions) is continuously collected by AdNetworkIntegrationService, processed by AnalyticsReportingService, and stored in AdManagerDynamoDBTables in the background. This collected data is queried when results are viewed.

    activate merchantadmanagerportalspa018
    merchantadmanagerportalspa018-merchantadmanagerportalspa018: 4. Merchant requests to view A/B Test Results (for specific testId)
    
    merchantadmanagerportalspa018-admanagerapigateway019: 5. GET /abtests/{testId}/results
    activate admanagerapigateway019
    admanagerapigateway019-analyticsreportingservice012: 5.1. getABTestResults(testId)
    activate analyticsreportingservice012
    
    analyticsreportingservice012-admanagerpostgresqldb022: 5.1.1. SELECT * FROM ABTests WHERE id = testId (Get test metadata, goals)
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--analyticsreportingservice012: 5.1.1. ABTestMetadata
    deactivate admanagerpostgresqldb022
    
    analyticsreportingservice012-admanagerdynamodbtables023: 5.1.2. QUERY VariationPerformanceData WHERE abTestId = testId
    activate admanagerdynamodbtables023
    admanagerdynamodbtables023--analyticsreportingservice012: 5.1.2. PerformanceDataForVariations
    deactivate admanagerdynamodbtables023
    
    analyticsreportingservice012-analyticsreportingservice012: 5.1.3. Calculate Statistical Significance, Determine Winner, Format Results
    
    analyticsreportingservice012--admanagerapigateway019: 5.1. ABTestResultsResponse
    deactivate analyticsreportingservice012
    
    admanagerapigateway019--merchantadmanagerportalspa018: 5. ABTestResultsResponse
    deactivate admanagerapigateway019
    
    merchantadmanagerportalspa018-merchantadmanagerportalspa018: 6. Display A/B Test Results (Winner, Metrics, Significance)
    deactivate merchantadmanagerportalspa018