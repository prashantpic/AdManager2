# Specification

# 1. Sequence Design Overview

- **Sequence_Diagram:**
  ### . Merchant User Authentication via Core Platform SSO
  Describes the sequence of interactions when a merchant user logs into the Ad Manager Platform using Single Sign-On (SSO) with the [PlatformName] core e-commerce platform.

  #### .4. Purpose
  To authenticate a merchant user and establish a secure session within the Ad Manager Platform, leveraging existing core platform credentials.

  #### .5. Type
  AuthenticationFlow

  #### .6. Participant Repository Ids
  
  - merchant-ad-manager-portal-spa-018
  - ad-manager-api-gateway-019
  - security-layer-authentication-delegator-026
  - user-access-management-service-009
  - ExternalCorePlatformAuthAPI
  - ad-manager-cache-024
  
  #### .7. Key Interactions
  
  - User initiates login from MerchantAdManagerPortal.
  - MerchantAdManagerPortal redirects/requests authentication via AdManagerAPIGateway to AuthenticationDelegator.
  - AuthenticationDelegator interacts with ExternalCorePlatformAuthAPI for credential validation (e.g., OAuth flow).
  - ExternalCorePlatformAuthAPI validates and returns user identity.
  - AuthenticationDelegator generates/validates JWT for Ad Manager session.
  - UserAccessManagementService fetches Ad Manager roles/permissions for the user, potentially caching them.
  - JWT and user profile (with permissions) returned to MerchantAdManagerPortal.
  
  #### .8. Related Feature Ids
  
  - 3.2.4
  - 4.2.9
  - REQ-IAM-006
  - REQ-IAM-007
  - REQ-CPSI-003
  
  #### .9. Domain
  User Authentication

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

