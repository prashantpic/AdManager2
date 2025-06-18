# Specification

# 1. Sequence Design Overview

- **Sequence_Diagram:**
  ### . Merchant Admin Assigns Role to Ad Manager User
  Illustrates a Merchant Admin assigning an existing Ad Manager role (e.g., 'Campaign Manager') to another user within their merchant account.

  #### .4. Purpose
  To delegate specific Ad Manager responsibilities to team members.

  #### .5. Type
  UserJourney

  #### .6. Participant Repository Ids
  
  - merchant-ad-manager-portal-spa-018
  - ad-manager-api-gateway-019
  - user-access-management-service-009
  - ad-manager-postgresql-db-022
  - shared-audit-log-client-036
  
  #### .7. Key Interactions
  
  - Merchant Admin selects a user and assigns a role in MerchantAdManagerPortal.
  - Request sent via AdManagerAPIGateway to UserAccessManagementService.
  - UserAccessManagementService validates (e.g., if user exists, if role is assignable by Merchant Admin) and updates user's role assignment in AdManagerPostgreSQLDB.
  - Action is logged by SharedAuditLogClient.
  - Confirmation sent to MerchantAdManagerPortal.
  
  #### .8. Related Feature Ids
  
  - 3.1.5 (RBAC)
  - 2.3 (User Roles - Merchant Admin)
  - REQ-IAM-003
  - REQ-IAM-004
  
  #### .9. Domain
  User Access Management

  #### .10. Metadata
  
  - **Complexity:** Medium
  - **Priority:** Medium
  - **Frequency:** Occasional
  


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

