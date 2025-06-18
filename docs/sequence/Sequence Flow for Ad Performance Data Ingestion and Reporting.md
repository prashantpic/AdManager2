# Specification

# 1. Sequence Design Overview

- **Sequence_Diagram:**
  ### . Ad Performance Data Ingestion and Reporting
  Details the flow of fetching ad performance metrics from ad networks, processing them, storing them, and making them available for merchant reports and dashboards.

  #### .4. Purpose
  To provide merchants with insights into their advertising campaign performance (ROAS, CPA, CTR, etc.).

  #### .5. Type
  DataFlow

  #### .6. Participant Repository Ids
  
  - ad-network-integration-service-003
  - ExternalAdNetworkGenericAPI
  - ad-events-topic-021
  - analytics-reporting-service-012
  - ad-manager-dynamodb-tables-023
  - ad-manager-postgresql-db-022
  - merchant-ad-manager-portal-spa-018
  - ad-manager-api-gateway-019
  
  #### .7. Key Interactions
  
  - AdNetworkIntegrationService periodically fetches performance reports from ExternalAdNetworkGenericAPI.
  - AdNetworkIntegrationService publishes 'AdPerformanceDataIngestedEvent' with raw metrics to AdEventsTopic (SNS).
  - AnalyticsReportingService (subscribing via SQS queue) consumes the event.
  - AnalyticsReportingService processes raw metrics: normalizes data, calculates derived metrics (ROAS, CPA if order data available), and stores detailed performance logs in AdManagerDynamoDBTables.
  - AnalyticsReportingService aggregates data into summary tables in AdManagerPostgreSQLDB (e.g., DailyCampaignPerformanceSummary).
  - MerchantAdManagerPortal requests report data via AdManagerAPIGateway from AnalyticsReportingService.
  - AnalyticsReportingService queries data stores and returns formatted report data.
  
  #### .8. Related Feature Ids
  
  - 3.1.1 (Reporting and Analytics - Advertising Specific)
  - 3.3.2.2 (Ad Networks - metrics retrieval)
  - REQ-ARP-001
  - REQ-ARP-005
  - REQ-ARP-007
  
  #### .9. Domain
  Analytics & Reporting

  #### .10. Metadata
  
  - **Complexity:** High
  - **Priority:** Critical
  - **Frequency:** Periodic
  


---

# 2. Sequence Diagram Details

- **Success:** True
- **Cache_Created:** True
- **Status:** refreshed
- **Cache_Id:** g0on4tnykdp5phwtzuf1gmzgpkwzak8z58l6rbgh
- **Cache_Name:** cachedContents/g0on4tnykdp5phwtzuf1gmzgpkwzak8z58l6rbgh
- **Cache_Display_Name:** repositories
- **Cache_Status_Verified:** True
- **Model:** models/gemini-2.5-pro-preview-03-25
- **Workflow_Id:** I9v2neJ0O4zJsz8J
- **Execution_Id:** 8929
- **Project_Id:** 16
- **Record_Id:** 21
- **Cache_Type:** repositories


---

