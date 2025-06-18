sequenceDiagram
    actor "Merchant AdManager Portal (UI)" as merchantadmanagerportalspa018
    participant "API Gateway" as admanagerapigateway019
    participant "Campaign Mgmt Service" as campaignmanagementservice001
    participant "Product Catalog Service" as productcatalogservice002
    participant "Promotions Service" as promotionsoffersservice004
    participant "Audience Mgmt Service" as audiencemanagementservice017
    participant "AdManager DB" as admanagerpostgresqldb022
    participant "AdEvents Queue" as adeventsqueue020
    participant "Ad Network Integration Service" as adnetworkintegrationservice003
    participant "External Ad Network API" as externaladnetworkapi

    note over merchantadmanagerportalspa018: Merchant defines campaign details (name, budget, schedule, networks, catalog, promo, audience) in the UI.

    merchantadmanagerportalspa018-admanagerapigateway019: 1. POST /v1/campaigns (CreateCampaignDTO: name, budget, schedule, networks, catalogIds, promoIds, audienceIds)
    activate admanagerapigateway019

    admanagerapigateway019-campaignmanagementservice001: 2. createCampaign(CreateCampaignDTO)
    activate campaignmanagementservice001

    campaignmanagementservice001-campaignmanagementservice001: 2.1. Validate CreateCampaignDTO (budget  0, dates valid, etc.)

    note over campaignmanagementservice001: Initial campaign data is stored, and associations are made transactionally.
    campaignmanagementservice001-admanagerpostgresqldb022: 2.2. START TRANSACTION
    activate admanagerpostgresqldb022

    campaignmanagementservice001-admanagerpostgresqldb022: 2.3. INSERT INTO Campaign (name, budget, startDate, endDate, status='PendingSync', ...)
    admanagerpostgresqldb022--campaignmanagementservice001: campaignId

    loop 2.4 For each catalogId
        campaignmanagementservice001-productcatalogservice002: validateCatalogForCampaign(campaignId, catalogId)
        activate productcatalogservice002
        productcatalogservice002--campaignmanagementservice001: 2.5 Return validation results
        deactivate productcatalogservice002
        campaignmanagementservice001-admanagerpostgresqldb022: 2.4.1. INSERT INTO CampaignProductCatalog (campaignId, catalogId)
    end

    loop 2.6 For each promoId
        campaignmanagementservice001-promotionsoffersservice004: validatePromotionForCampaign(campaignId, promoId)
        activate promotionsoffersservice004
        promotionsoffersservice004--campaignmanagementservice001: 2.7 Return validation results
        deactivate promotionsoffersservice004
        campaignmanagementservice001-admanagerpostgresqldb022: 2.6.1. INSERT INTO CampaignPromotion (campaignId, promotionId)
    end

    loop 2.8 For each audienceId
        campaignmanagementservice001-audiencemanagementservice017: validateAudienceForCampaign(campaignId, audienceId)
        activate audiencemanagementservice017
        audiencemanagementservice017--campaignmanagementservice001: 2.9 Return validation results
        deactivate audiencemanagementservice017
        campaignmanagementservice001-admanagerpostgresqldb022: 2.8.1. INSERT INTO CampaignAudience (campaignId, audienceId)
    end

    campaignmanagementservice001-admanagerpostgresqldb022: 2.10. COMMIT TRANSACTION
    deactivate admanagerpostgresqldb022

    note over adeventsqueue020: Asynchronous event published to decouple campaign creation from ad network synchronization.
    campaignmanagementservice001-adeventsqueue020: 2.11. Publish CampaignStateChangeRequestedEvent { campaignId, requestedState: 'Create', adNetworkIds }

    campaignmanagementservice001--admanagerapigateway019: 3. Return 201 Created { campaignId, status: 'PendingSync' }
    deactivate campaignmanagementservice001

    admanagerapigateway019--merchantadmanagerportalspa018: 4. Return 201 Created { campaignId, status: 'PendingSync' }
    deactivate admanagerapigateway019

    merchantadmanagerportalspa018-merchantadmanagerportalspa018: 5. Display success message, update UI (campaign status: Pending Sync)

    note over adnetworkintegrationservice003: Ad Network Integration Service processes the event asynchronously to sync with each selected ad network.
    adeventsqueue020-adnetworkintegrationservice003: 6. Consume CampaignStateChangeRequestedEvent { campaignId, adNetworkIds }
    activate adnetworkintegrationservice003

    adnetworkintegrationservice003-campaignmanagementservice001: 6.1. getCampaignDetailsForSync(campaignId)
    activate campaignmanagementservice001
    campaignmanagementservice001--adnetworkintegrationservice003: Full campaign details, associated catalog/promo/audience info
    deactivate campaignmanagementservice001

    loop 6.2 For each adNetworkId in event
        adnetworkintegrationservice003-adnetworkintegrationservice003: 6.2.1. Prepare Ad Network specific payload (using fetched details)
        note over externaladnetworkapi: Error handling, retries, and circuit breakers are employed for external API calls. Detailed error paths not shown for brevity in this main success flow.
        adnetworkintegrationservice003-externaladnetworkapi: 6.2.2. createCampaignOnNetwork(networkSpecificPayload)
        activate externaladnetworkapi
        externaladnetworkapi--adnetworkintegrationservice003: Success/Failure, networkCampaignId
        deactivate externaladnetworkapi
        adnetworkintegrationservice003-admanagerpostgresqldb022: 6.2.3. UPDATE CampaignNetworkSyncStatus or Campaign status
    end

    adnetworkintegrationservice003-adeventsqueue020: 6.3. Acknowledge/Delete message from queue
    deactivate adnetworkintegrationservice003
