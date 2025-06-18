# Specification

# 1. Sequence Design Overview

- **Sequence_Diagram:**
  ### . Merchant Creates Discount Code Promotion
  Shows the process of a merchant creating a new set of discount codes with specific rules and configurations.

  #### .4. Purpose
  To enable merchants to offer incentives and track their effectiveness in advertising campaigns.

  #### .5. Type
  UserJourney

  #### .6. Participant Repository Ids
  
  - merchant-ad-manager-portal-spa-018
  - ad-manager-api-gateway-019
  - promotions-offers-service-004
  - ad-manager-postgresql-db-022
  
  #### .7. Key Interactions
  
  - Merchant defines discount code parameters (pattern, type, value, rules, expiry) in MerchantAdManagerPortal.
  - Request sent via AdManagerAPIGateway to PromotionsOffersService.
  - PromotionsOffersService validates input (e.g., uniqueness of codes per merchant, REQ-PROMO-002), generates codes if applicable.
  - PromotionsOffersService stores discount code definitions and rules in AdManagerPostgreSQLDB.
  - Confirmation is sent back to the MerchantAdManagerPortal.
  
  #### .8. Related Feature Ids
  
  - 3.1.3 (Discount Codes)
  - REQ-PROMO-001
  - REQ-PROMO-002
  
  #### .9. Domain
  Promotion Management

  #### .10. Metadata
  
  - **Complexity:** Medium
  - **Priority:** High
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

