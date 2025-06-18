sequenceDiagram
    actor "Merchant Ad Manager Portal" as merchantadmanagerportalspa018
    participant "Ad Manager API Gateway" as admanagerapigateway019
    participant "Promotions & Offers Service" as promotionsoffersservice004
    participant "Ad Manager Database" as admanagerpostgresqldb022

    merchantadmanagerportalspa018--admanagerapigateway019: 1. Request: Create Discount Code Promotion (params: {name, pattern, type, value, rules, expiryDate, quantity, merchantId})
    activate merchantadmanagerportalspa018
    activate admanagerapigateway019
    note over merchantadmanagerportalspa018: Merchant defines discount code parameters (name, pattern, type, value, rules like min purchase, expiry, single/multi-use, eligibility) in the UI. (REQ-PROMO-001)

    admanagerapigateway019--promotionsoffersservice004: 2. Invoke: createDiscountCodePromotion(params)
    activate promotionsoffersservice004

    alt Validation Successful
        promotionsoffersservice004-promotionsoffersservice004: 3.1.1. Internal: Validate input parameters & rules (e.g., uniqueness per merchant REQ-PROMO-002, expiry, etc.)
        note over promotionsoffersservice004: Service validates rules, including code uniqueness per merchant if specific codes are provided or generated pattern conflicts (REQ-PROMO-002).
        promotionsoffersservice004-promotionsoffersservice004: 3.1.2. Internal: Generate discount codes (if pattern provided and quantity  0)
        note over promotionsoffersservice004: If a pattern is used (e.g., HOLIDAY{####}), codes are generated based on quantity. The service ensures high volume discount code creation is supported (REQ-PROMO-002).
        promotionsoffersservice004--admanagerpostgresqldb022: 3.1.3. Store Discount Code Promotion Definition & Codes
        activate admanagerpostgresqldb022
        note over admanagerpostgresqldb022: Database handles efficient indexing for discount codes (REQ-PROMO-002).
        admanagerpostgresqldb022--promotionsoffersservice004: 3.1.4. Return: DB Operation Successful (promotionId)
        deactivate admanagerpostgresqldb022
    else Validation Failed
        promotionsoffersservice004-promotionsoffersservice004: 3.2.1. Internal: Validate input parameters & rules
    end

    promotionsoffersservice004--admanagerapigateway019: 4. Return: Discount Code Promotion Created (ID: promotionId) / Validation Error (errorDetails)
    deactivate promotionsoffersservice004

    admanagerapigateway019--merchantadmanagerportalspa018: 5. Return: API Response (201 Created with promotion details / 400 Bad Request with error details)
    deactivate admanagerapigateway019

    merchantadmanagerportalspa018-merchantadmanagerportalspa018: 6. UI: Display success message and new promotion / Display error message
    deactivate merchantadmanagerportalspa018
