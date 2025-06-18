# Specification

# 1. Sequence Design Overview

- **Sequence_Diagram:**
  ### . Affiliate Conversion Tracking and Commission Calculation
  Illustrates how a conversion driven by an affiliate is tracked and how commission is calculated.

  #### .4. Purpose
  To accurately attribute sales to affiliates and calculate their earnings.

  #### .5. Type
  DataFlow

  #### .6. Participant Repository Ids
  
  - ExternalCorePlatformOrderAPI
  - core-platform-integration-service-013
  - affiliate-marketing-service-005
  - ad-manager-postgresql-db-022
  - analytics-reporting-service-012
  
  #### .7. Key Interactions
  
  - Customer makes a purchase on [PlatformName] core platform, potentially with affiliate tracking cookie/code.
  - ExternalCorePlatformOrderAPI processes order; CorePlatformIntegrationService receives order data (possibly via webhook or polling).
  - CorePlatformIntegrationService (or AffiliateMarketingService directly, if it has access) checks for affiliate attribution (REQ-AMP-004).
  - If attributed, AffiliateMarketingService records the conversion event in AdManagerPostgreSQLDB.
  - AffiliateMarketingService calculates commission based on program rules.
  - Data is made available to AnalyticsReportingService for affiliate performance dashboards.
  
  #### .8. Related Feature Ids
  
  - 3.1.1 (Affiliate Marketing)
  - REQ-AMP-004
  - REQ-CPSI-007
  
  #### .9. Domain
  Affiliate Marketing

  #### .10. Metadata
  
  - **Complexity:** High
  - **Priority:** Critical
  - **Frequency:** AsNeeded
  


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

