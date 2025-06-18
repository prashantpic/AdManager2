sequenceDiagram
    participant "Merchant Ad Manager Portal" as merchantadmanagerportalspa018
    participant "Ad Manager API Gateway" as admanagerapigateway019
    participant "Affiliate Marketing Service" as affiliatemarketingservice005
    participant "Ad Manager PostgreSQL DB" as admanagerpostgresqldb022
    activate merchantadmanagerportalspa018
    note over merchantadmanagerportalspa018: Merchant defines the approval criteria for affiliate applications (e.g., manual review, minimum audience size) and commission structures (e.g., percentage of sale, flat fee per conversion) as part of programDetails.
    merchantadmanagerportalspa018-merchantadmanagerportalspa018: 1. Merchant inputs affiliate program settings (name, commission rules, approval criteria)
    merchantadmanagerportalspa018-admanagerapigateway019: 2. POST /v1/affiliate-programs (programDetails)
    activate admanagerapigateway019
    note right of admanagerapigateway019: API Gateway handles authentication and forwards the request.
    admanagerapigateway019-affiliatemarketingservice005: 2.1. CreateAffiliateProgram(programDetails, merchantAuthToken)
    activate affiliatemarketingservice005
    note right of affiliatemarketingservice005: Validation includes checking for valid commission rules and required fields.
    affiliatemarketingservice005-affiliatemarketingservice005: 2.1.1. Validate programDetails (commission rules, approval criteria)
    alt Validation Fails
        affiliatemarketingservice005--admanagerapigateway019: 2.1.2. Return 400 Bad Request (validationErrors)
    else Validation Succeeds
        affiliatemarketingservice005-admanagerpostgresqldb022: 2.1.3. INSERT INTO AffiliatePrograms (validatedProgramDetails)
        activate admanagerpostgresqldb022
        admanagerpostgresqldb022--affiliatemarketingservice005: 2.1.4. Return programId
        deactivate admanagerpostgresqldb022
        affiliatemarketingservice005-affiliatemarketingservice005: 2.1.5. Prepare tools/data for affiliate management (links, approval workflows)
        note right of affiliatemarketingservice005: The confirmation implies that tools for managing affiliates (approvals, link generation) are now active/available for this newly created program.
        affiliatemarketingservice005--admanagerapigateway019: 3. Return 201 Created (programId, confirmationMessage)
    end
    deactivate affiliatemarketingservice005
    admanagerapigateway019--merchantadmanagerportalspa018: 4. Return 201 Created (programId, confirmationMessage)
    deactivate admanagerapigateway019
    merchantadmanagerportalspa018-merchantadmanagerportalspa018: 5. Display success message (Affiliate Program Created) and provide access to management tools for this program
    deactivate merchantadmanagerportalspa018