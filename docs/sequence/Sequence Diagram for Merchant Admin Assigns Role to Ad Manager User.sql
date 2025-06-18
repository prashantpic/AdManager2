sequenceDiagram
    actor "Merchant Portal (SPA)" as merchantadmanagerportalspa018
    participant "API Gateway" as admanagerapigateway019
    participant "User Access Mgt Service" as useraccessmanagementservice009
    participant "Ad Manager DB" as admanagerpostgresqldb022
    participant "Audit Log Client" as sharedauditlogclient036

    merchantadmanagerportalspa018-admanagerapigateway019: 1. POST /users/{targetUserId}/roles (AssignRoleRequest: { roleIdToAssign })
    activate admanagerapigateway019

    admanagerapigateway019-useraccessmanagementservice009: 2. assignRole(targetUserId, roleIdToAssign, merchantAdminId, merchantId)
    note over admanagerapigateway019: API Gateway authenticates Merchant Admin (JWT) and extracts merchantAdminId, merchantId.
    note right of useraccessmanagementservice009: REQ-IAM-003: Merchant Admin can assign roles. REQ-IAM-004: RBAC per merchant context is enforced by UserAccessManagementService.
    activate useraccessmanagementservice009

    useraccessmanagementservice009-useraccessmanagementservice009: 2.1. Validate request (admin permissions, user existence within merchant, role validity)

    alt Validation Fails
        useraccessmanagementservice009--admanagerapigateway019: 2.1.1. HTTP 400/403/404 Error Response (e.g., 'Permission Denied', 'User not found')
        deactivate useraccessmanagementservice009
        admanagerapigateway019--merchantadmanagerportalspa018: 2.1.1.1. Error Response (e.g., 'Permission Denied', 'User not found')
        deactivate admanagerapigateway019
        activate merchantadmanagerportalspa018
        merchantadmanagerportalspa018-merchantadmanagerportalspa018: 2.1.1.2. Display error message to Merchant Admin
        deactivate merchantadmanagerportalspa018
    end

    useraccessmanagementservice009-admanagerpostgresqldb022: 2.2. UPDATE/INSERT UserRoleAssignment (userId={targetUserId}, roleId={roleIdToAssign}, merchantId={merchantId})
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--useraccessmanagementservice009: 2.3. DB Update Confirmation / Error
    deactivate admanagerpostgresqldb022

    alt DB Update Fails
        useraccessmanagementservice009--admanagerapigateway019: 2.3.1. HTTP 500 Error Response
        deactivate useraccessmanagementservice009
        admanagerapigateway019--merchantadmanagerportalspa018: 2.3.1.1. Error Response (e.g., 'Internal Server Error')
        deactivate admanagerapigateway019
    end

    useraccessmanagementservice009-sharedauditlogclient036: 2.4. logAction(actorId: merchantAdminId, action: 'AssignRole', details: {targetUserId, roleIdToAssign, merchantId})
    activate sharedauditlogclient036
    sharedauditlogclient036--useraccessmanagementservice009: 2.5. Audit Log Confirmation
    deactivate sharedauditlogclient036

    useraccessmanagementservice009--admanagerapigateway019: 3. HTTP 200 OK (AssignRoleResponse: { success: true })
    deactivate useraccessmanagementservice009

    admanagerapigateway019--merchantadmanagerportalspa018: 4. AssignRoleResponse: { success: true }
    deactivate admanagerapigateway019

    activate merchantadmanagerportalspa018
    merchantadmanagerportalspa018-merchantadmanagerportalspa018: 5. Display success confirmation to Merchant Admin
    deactivate merchantadmanagerportalspa018

    note over merchantadmanagerportalspa018,sharedauditlogclient036: This diagram assumes the happy path where validation succeeds. Error paths are indicated as alternatives.
