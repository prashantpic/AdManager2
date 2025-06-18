# Specification

# 1. Sequence Design Overview

- **Sequence_Diagram:**
  ### . Platform Administrator Defines Ad Manager User Role
  Shows a Platform Administrator defining a new user role (e.g., 'Limited Campaign Viewer') with specific permissions within the Ad Manager.

  #### .4. Purpose
  To allow granular control over access to Ad Manager features and data based on user responsibilities.

  #### .5. Type
  Administrative

  #### .6. Participant Repository Ids
  
  - platform-admin-portal-spa-037
  - ad-manager-api-gateway-019
  - user-access-management-service-009
  - ad-manager-postgresql-db-022
  - shared-audit-log-client-036
  
  #### .7. Key Interactions
  
  - Platform Administrator defines role name and selects permissions in PlatformAdminPortal.
  - Request sent via AdManagerAPIGateway to UserAccessManagementService.
  - UserAccessManagementService validates and stores the new role definition in AdManagerPostgreSQLDB.
  - Action is logged by SharedAuditLogClient (REQ-IAM-009).
  - Confirmation sent to PlatformAdminPortal.
  
  #### .8. Related Feature Ids
  
  - 3.1.5 (RBAC)
  - 2.3 (User Roles - Platform Administrator)
  - REQ-IAM-001
  - REQ-IAM-005
  
  #### .9. Domain
  User Access Management

  #### .10. Metadata
  
  - **Complexity:** Medium
  - **Priority:** High
  - **Frequency:** Rare
  


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

