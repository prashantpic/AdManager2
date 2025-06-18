# Specification

# 1. Sequence Design Overview

- **Sequence_Diagram:**
  ### . Merchant Creates New Advertising Campaign
  Illustrates the process of a merchant creating a new advertising campaign, including defining settings, associating product catalogs, and initiating synchronization with selected ad networks.

  #### .4. Purpose
  To enable merchants to launch new advertising campaigns through the Ad Manager platform.

  #### .5. Type
  UserJourney

  #### .6. Participant Repository Ids
  
  - merchant-ad-manager-portal-spa-018
  - ad-manager-api-gateway-019
  - campaign-management-service-001
  - product-catalog-service-002
  - promotions-offers-service-004
  - audience-management-service-017
  - ad-network-integration-service-003
  - ad-manager-postgresql-db-022
  - ad-events-queue-020
  
  #### .7. Key Interactions
  
  - Merchant defines campaign details (name, budget, schedule, networks) in MerchantAdManagerPortal.
  - Request sent via AdManagerAPIGateway to CampaignManagementService.
  - CampaignManagementService validates input, stores campaign metadata in AdManagerPostgreSQLDB.
  - CampaignManagementService interacts with ProductCatalogService to associate catalogs, PromotionsOffersService for promotions, AudienceManagementService for audiences.
  - CampaignManagementService publishes 'CampaignStateChangeRequestedEvent' to AdEventsQueue.
  - AdNetworkIntegrationService consumes event, prepares data, and initiates campaign creation on selected ExternalAdNetworkAPIs.
  - Status updates are communicated back and stored.
  
  #### .8. Related Feature Ids
  
  - 3.1.1 (Core Advertising Features)
  - REQ-CMO-001
  - REQ-CMO-005
  - REQ-CMO-011
  - REQ-CMO-012
  
  #### .9. Domain
  Campaign Management

  #### .10. Metadata
  
  - **Complexity:** High
  - **Priority:** Critical
  - **Frequency:** Frequent
  


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

