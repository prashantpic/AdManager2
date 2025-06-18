sequenceDiagram
    actor "Platform Admin Portal" as platformadminportalspa037
    participant "API Gateway" as admanagerapigateway019
    participant "User Access Mgt Service" as useraccessmanagementservice009
    participant "PostgreSQL DB" as admanagerpostgresqldb022
    participant "Audit Logging System" as sharedauditlogclient036

    note over platformadminportalspa037: Platform Administrator defines new role name and selects permissions through the Platform Admin Portal UI.
    platformadminportalspa037-admanagerapigateway019: 1. POST /v1/admin/roles (DefineRoleRequest: {name, permissions})
    activate admanagerapigateway019

    admanagerapigateway019-useraccessmanagementservice009: 2. defineNewRole(DefineRoleRequest: {name, permissions})
    activate useraccessmanagementservice009

    note right of useraccessmanagementservice009: UAM Service validates role name (e.g., uniqueness, length) and ensures selected permissions are valid system permissions.
    useraccessmanagementservice009-useraccessmanagementservice009: 3. validateRoleDefinition(name, permissions)

    alt Validation Succeeded
        note right of admanagerpostgresqldb022: If database save fails (e.g., unique constraint violation, DB error), UAM Service would return an appropriate error (e.g., 409 Conflict, 500 Internal Server Error) to API Gateway.
        useraccessmanagementservice009-admanagerpostgresqldb022: 4.1. INSERT UserRole {name, permissions_jsonb}
        activate admanagerpostgresqldb022
        admanagerpostgresqldb022--useraccessmanagementservice009: RoleSaveConfirmation {roleId}
        deactivate admanagerpostgresqldb022

        note right of sharedauditlogclient036: The Audit Logging System call (REQ-IAM-009) ensures the action is recorded for compliance and security monitoring. This call could be asynchronous in a real implementation to improve performance.
        useraccessmanagementservice009-sharedauditlogclient036: 4.2. logEvent(action: 'Define Role', details: {roleName, permissions}) (REQ-IAM-009)
        activate sharedauditlogclient036
        sharedauditlogclient036--useraccessmanagementservice009: LogConfirmation
        deactivate sharedauditlogclient036
    else Validation Failed
    end

    note left of admanagerapigateway019: The response to the API Gateway depends on the outcome of the validation and subsequent operations (DB save, audit logging).
    useraccessmanagementservice009--admanagerapigateway019: 5. Response: RoleCreationResponse {roleId,...} OR ErrorResponse {400, 'Validation Failed', details}
    deactivate useraccessmanagementservice009

    admanagerapigateway019--platformadminportalspa037: 6. HTTP 201 Created {roleDetails} OR HTTP 400 {errorDetails}
    deactivate admanagerapigateway019