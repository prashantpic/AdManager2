sequenceDiagram
    participant "Merchant Ad Manager Portal" as Portal
    participant "Ad Manager API Gateway" as Gateway
    participant "Product Catalog Service" as Service
    participant "Ad Manager DB (PostgreSQL)" as DB

    activate Portal
    Portal-Portal: 1. Merchant selects product, enters ad-specific overrides and clicks 'Save'.

    Portal-Gateway: 2. Submit Product Customizations (e.g., HTTP PUT /catalogs/{catalogId}/products/{coreProductId}/overrides)
    activate Gateway

    Gateway-Gateway: 2.1. Authenticate & Authorize Request (JWT)

    Gateway-Service: 2.2. invoke: customizeProductAttributes(catalogId, coreProductId, overridesData)
    activate Service

    Service-Service: 2.2.1. Validate customization data (lengths, formats, existence of core product reference)

    alt 2.2.2. Input data is invalid
        Service--Gateway: 2.2.2.1. Return Validation Error (400 Bad Request)
    else 2.2.3. Input data is valid
        Service-DB: 2.2.3.1. Save/Update Product Overrides (INSERT/UPDATE ProductCatalogOverrides table)
        activate DB
        note right of Service: REQ-PC-008 & 3.4.1 (Data Model): ProductCatalogOverrides entity in PostgreSQL (AdManagerPostgreSQLDB) is used for storing these attribute-level customizations.

        alt 2.2.3.1.1. Database operation fails
            DB--Service: 2.2.3.1.1.1. Return DB Error
            Service--Gateway: 2.2.3.1.1.2. Return Server Error (500 Internal Server Error)
        else 2.2.3.1.2. Database operation succeeds
            DB--Service: 2.2.3.1.2.1. Return Save Confirmation
            Service--Gateway: 2.2.3.1.2.2. Return Success Response (e.g., 200 OK with customized product data)
        end
        deactivate DB
    end
    deactivate Service

    Gateway--Portal: 3. Return Final API Response (reflects outcome from Product Catalog Service)
    deactivate Gateway

    Portal-Portal: 4. Process API response: Update UI with saved customizations and show success message, or display error message to merchant.
    deactivate Portal

    note over Portal, DB: REQ-PC-003: Merchant customizes product attributes. Customizations are stored as an Ad Manager-specific layer, distinct from core product data.