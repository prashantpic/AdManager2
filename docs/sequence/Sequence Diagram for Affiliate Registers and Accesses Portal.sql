sequenceDiagram
    actor "Affiliate Portal SPA" as affiliateportalsspa038
    participant "API Gateway" as admanagerapigateway019
    participant "Affiliate Marketing Service" as affiliatemarketingservice005
    participant "User Access Mgt Service" as useraccessmanagementservice009
    participant "External Core Auth API" as ExternalCorePlatformAuthAPI
    participant "Ad Manager DB (PostgreSQL)" as admanagerpostgresqldb022
    participant "Analytics Reporting Service" as analyticsreportingservice012

    activate affiliateportalsspa038
    affiliateportalsspa038-affiliateportalsspa038: 1. Affiliate initiates registration
    affiliateportalsspa038-admanagerapigateway019: 2. POST /v1/affiliates/register (registrationData)
    activate admanagerapigateway019
    admanagerapigateway019-affiliatemarketingservice005: 2.1. handleAffiliateRegistration(registrationData)
    activate affiliatemarketingservice005
    affiliatemarketingservice005-useraccessmanagementservice009: 2.1.1. findOrCreateUserForAffiliate(email, name)
    activate useraccessmanagementservice009
    useraccessmanagementservice009-ExternalCorePlatformAuthAPI: 2.1.1.1. checkUserExists(email)
    activate ExternalCorePlatformAuthAPI
    ExternalCorePlatformAuthAPI--useraccessmanagementservice009: coreUserId / null
    deactivate ExternalCorePlatformAuthAPI
    useraccessmanagementservice009-admanagerpostgresqldb022: 2.1.1.2. CREATE/UPDATE AdManagerUser (email, coreUserId?, status='Pending')
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--useraccessmanagementservice009: adManagerUserId
    deactivate admanagerpostgresqldb022
    useraccessmanagementservice009--affiliatemarketingservice005: adManagerUserId / error
    deactivate useraccessmanagementservice009
    affiliatemarketingservice005-admanagerpostgresqldb022: 2.1.2. CREATE AffiliateApplication (adManagerUserId, merchantProgramId, status='PendingApproval', applicationData)
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--affiliatemarketingservice005: applicationId
    deactivate admanagerpostgresqldb022
    affiliatemarketingservice005-affiliatemarketingservice005: 2.1.3. Note: Merchant approval workflow (REQ-AMP-002) is triggered asynchronously.
    note over affiliatemarketingservice005: REQ-AMP-002: Affiliate registration includes a merchant approval workflow. This diagram shows the initial application. Approval is an asynchronous process handled by the merchant.
    affiliatemarketingservice005--admanagerapigateway019: applicationId / error
    deactivate affiliatemarketingservice005
    admanagerapigateway019--affiliateportalsspa038: HTTP 201 Registration Submitted / HTTP 4xx Error
    deactivate admanagerapigateway019

    affiliateportalsspa038-affiliateportalsspa038: 3. Affiliate attempts to login (after approval)
    affiliateportalsspa038-admanagerapigateway019: 4. POST /v1/auth/login (credentials)
    activate admanagerapigateway019
    admanagerapigateway019-useraccessmanagementservice009: 4.1. authenticateAffiliate(credentials)
    activate useraccessmanagementservice009
    note over useraccessmanagementservice009: REQ-IAM-006: UserAccessManagementService integrates with the core platform's authentication system via ExternalCorePlatformAuthAPI.
    useraccessmanagementservice009-ExternalCorePlatformAuthAPI: 4.1.1. validateCredentials(email, password)
    activate ExternalCorePlatformAuthAPI
    ExternalCorePlatformAuthAPI--useraccessmanagementservice009: coreUserId / authFailed
    deactivate ExternalCorePlatformAuthAPI
    alt 4.1.2. Authentication Successful
        useraccessmanagementservice009-admanagerpostgresqldb022: 4.1.2.1. GET AdManagerUser by coreUserId, role='Affiliate'
        activate admanagerpostgresqldb022
        admanagerpostgresqldb022--useraccessmanagementservice009: adManagerUserDetails / notFound
        deactivate admanagerpostgresqldb022
        useraccessmanagementservice009-affiliatemarketingservice005: 4.1.2.2. checkAffiliateStatus(adManagerUserId)
        activate affiliatemarketingservice005
        affiliatemarketingservice005--useraccessmanagementservice009: affiliateId, status='Approved' / 'Pending' or 'Rejected'
        deactivate affiliatemarketingservice005
        opt 4.1.2.3. Affiliate Approved
            useraccessmanagementservice009-useraccessmanagementservice009: 4.1.2.3.1. generateJwtToken(adManagerUserId, affiliateId, role='Affiliate')
        end
    end
    useraccessmanagementservice009--admanagerapigateway019: jwtToken, affiliateId / error
    deactivate useraccessmanagementservice009
    admanagerapigateway019--affiliateportalsspa038: HTTP 200 OK (JWT, affiliateDetails) / HTTP 401 Unauthorized
    deactivate admanagerapigateway019
    deactivate affiliateportalsspa038

    activate affiliateportalsspa038
    note over affiliateportalsspa038: REQ-AMP-006: Affiliate accesses portal to view performance and get tracking links. This part of the flow assumes the affiliate has already been approved and successfully authenticated.
    affiliateportalsspa038-affiliateportalsspa038: 5. Affiliate (logged in) requests tracking links and assets (REQ-AMP-006)
    affiliateportalsspa038-admanagerapigateway019: 6. GET /v1/affiliates/me/tracking-info (Authorization: Bearer JWT)
    activate admanagerapigateway019
    admanagerapigateway019-useraccessmanagementservice009: 6.1. authorizeRequest(JWT, requiredPermission='affiliate.tracking.read')
    activate useraccessmanagementservice009
    useraccessmanagementservice009--admanagerapigateway019: authorized / unauthorized
    deactivate useraccessmanagementservice009
    admanagerapigateway019-affiliatemarketingservice005: 6.2. getAffiliateTrackingInfo(affiliateIdfromjwt)
    activate affiliatemarketingservice005
    affiliatemarketingservice005-admanagerpostgresqldb022: 6.2.1. SELECT TrackingLinks, Assets FOR affiliateId
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--affiliatemarketingservice005: data
    deactivate admanagerpostgresqldb022
    affiliatemarketingservice005--admanagerapigateway019: trackingLinks, assetUrls
    deactivate affiliatemarketingservice005
    admanagerapigateway019--affiliateportalsspa038: HTTP 200 OK (trackingInfoData)
    deactivate admanagerapigateway019
    affiliateportalsspa038-affiliateportalsspa038: 7. Displays tracking links and assets to affiliate

    affiliateportalsspa038-affiliateportalsspa038: 8. Affiliate (logged in) requests performance data (REQ-AMP-006)
    affiliateportalsspa038-admanagerapigateway019: 9. GET /v1/affiliates/me/performance (Authorization: Bearer JWT, queryParams: dateRange)
    activate admanagerapigateway019
    admanagerapigateway019-useraccessmanagementservice009: 9.1. authorizeRequest(JWT, requiredPermission='affiliate.performance.read')
    activate useraccessmanagementservice009
    useraccessmanagementservice009--admanagerapigateway019: authorized / unauthorized
    deactivate useraccessmanagementservice009
    admanagerapigateway019-analyticsreportingservice012: 9.2. getAffiliatePerformanceReport(affiliateIdfromjwt, dateRange)
    activate analyticsreportingservice012
    analyticsreportingservice012-admanagerpostgresqldb022: 9.2.1. SELECT PerformanceData (AffiliateConversions, etc.) FOR affiliateId, dateRange
    activate admanagerpostgresqldb022
    admanagerpostgresqldb022--analyticsreportingservice012: data
    deactivate admanagerpostgresqldb022
    analyticsreportingservice012--admanagerapigateway019: conversions, earnings, clicks
    deactivate analyticsreportingservice012
    admanagerapigateway019--affiliateportalsspa038: HTTP 200 OK (performanceData)
    deactivate admanagerapigateway019
    affiliateportalsspa038-affiliateportalsspa038: 10. Displays performance data to affiliate
    deactivate affiliateportalsspa038
