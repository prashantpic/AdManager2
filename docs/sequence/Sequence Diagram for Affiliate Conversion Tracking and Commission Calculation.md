sequenceDiagram
    actor "Core Platform Order API" as ExternalCorePlatformOrderAPI
    participant "Core Platform Integration Service" as coreplatformintegrationservice013
    participant "Affiliate Marketing Service" as affiliatemarketingservice005
    participant "Ad Manager Database" as admanagerpostgresqldb022
    participant "Analytics Reporting Service" as analyticsreportingservice012

    note over ExternalCorePlatformOrderAPI, analyticsreportingservice012: Precondition: Customer completes a purchase on [PlatformName] core platform. The order may contain affiliate tracking information (e.g., via cookie or applied promo code).

    ExternalCorePlatformOrderAPI-coreplatformintegrationservice013: 1. Notify: New Order Created with Affiliate Context (Webhook) (OrderDetails, AffiliateTrackingInfo)
    activate coreplatformintegrationservice013

    coreplatformintegrationservice013-coreplatformintegrationservice013: 2. Process Order and Extract Attribution Identifiers (Received OrderDetails, AffiliateTrackingInfo)
    activate coreplatformintegrationservice013
    coreplatformintegrationservice013--coreplatformintegrationservice013: ProcessedOrderData, AffiliateIdentifiersList
    deactivate coreplatformintegrationservice013

    note right of coreplatformintegrationservice013: This interaction is asynchronous, likely via an SQS queue. REQ-CPSI-007 (order data retrieval).
    coreplatformintegrationservice013-affiliatemarketingservice005: 3. Submit Order for Affiliate Processing (Async Event/Queue) (ProcessedOrderData, AffiliateIdentifiersList)
    deactivate coreplatformintegrationservice013
    activate affiliatemarketingservice005

    affiliatemarketingservice005-affiliatemarketingservice005: 3.1 Handle OrderForAffiliateProcessingEvent (ProcessedOrderData, AffiliateIdentifiersList)
    activate affiliatemarketingservice005

    loop For each AffiliateIdentifier in AffiliateIdentifiersList
        affiliatemarketingservice005-admanagerpostgresqldb022: 3.1.1.1 Read: Affiliate Program Rules & Affiliate Details (AffiliateIdentifier)
        activate admanagerpostgresqldb022
        note over admanagerpostgresqldb022: Cacheable: Affiliate program rules can be cached to improve performance.
        admanagerpostgresqldb022--affiliatemarketingservice005: AffiliateProgramRules, AffiliateDetails (Status, CommissionStructure, etc.)
        deactivate admanagerpostgresqldb022

        note right of affiliatemarketingservice005: REQ-AMP-004: Attribution logic defines conversion criteria (e.g., last click, cookie window, non-fraudulent).
        affiliatemarketingservice005-affiliatemarketingservice005: 3.1.1.2 Perform Attribution Logic & Validation (REQ-AMP-004) (ProcessedOrderData, AffiliateProgramRules, AffiliateDetails)
        activate affiliatemarketingservice005
        note over affiliatemarketingservice005: Validates affiliate status, tracking code/cookie validity, cookie window, attribution model (e.g., last click), non-fraudulent.
        affiliatemarketingservice005--affiliatemarketingservice005: AttributionResult (isSuccess, AttributedAffiliateId, Reason)
        deactivate affiliatemarketingservice005

        alt AttributionResult.isSuccess == true
            affiliatemarketingservice005-admanagerpostgresqldb022: 3.1.1.3.1.1 Write: Persist AffiliateConversion (Transaction Start) (AttributedOrderDetails, AttributedAffiliateId, ConversionTimestamp)
            activate admanagerpostgresqldb022
            note over admanagerpostgresqldb022: This and subsequent writes for commission should be part of a single transaction.
            admanagerpostgresqldb022--affiliatemarketingservice005: ConversionID
            deactivate admanagerpostgresqldb022

            affiliatemarketingservice005-affiliatemarketingservice005: 3.1.1.3.1.2 Calculate Commission (ConversionID, ProcessedOrderData.OrderValue, AffiliateProgramRules.CommissionStructure)
            activate affiliatemarketingservice005
            note over affiliatemarketingservice005: Transformation: Applies commission rules (e.g., percentage of sale, flat fee) to order value.
            affiliatemarketingservice005--affiliatemarketingservice005: CalculatedCommissionAmount
            deactivate affiliatemarketingservice005

            affiliatemarketingservice005-admanagerpostgresqldb022: 3.1.1.3.1.3 Write: Store CalculatedCommission (Transaction End) (ConversionID, CalculatedCommissionAmount, Status='Pending')
            activate admanagerpostgresqldb022
            admanagerpostgresqldb022--affiliatemarketingservice005: CommissionID
            deactivate admanagerpostgresqldb022

            affiliatemarketingservice005-analyticsreportingservice012: 3.1.1.3.1.4 Publish Affiliate Conversion & Commission Event (Async) (ConversionDetails, CommissionData)
            activate analyticsreportingservice012
            note over analyticsreportingservice012: Likely via an SNS topic for decoupling.
        else Else - Attribution Failed or No Match
            affiliatemarketingservice005-affiliatemarketingservice005: 3.1.1.3.2.1 Log NonAttributedConversionAttempt (Optional) (ProcessedOrderData, AffiliateIdentifier, AttributionResult.Reason)
            activate affiliatemarketingservice005
            deactivate affiliatemarketingservice005
        end
    end
    deactivate affiliatemarketingservice005
    deactivate affiliatemarketingservice005

    note right of analyticsreportingservice012: Triggered by event from Affiliate Marketing Service.
    analyticsreportingservice012-analyticsreportingservice012: 4. Handle AffiliateConversionAndCommissionEvent (ConversionDetails, CommissionData)
    activate analyticsreportingservice012

    analyticsreportingservice012-admanagerpostgresqldb022: 4.1 Write/Update: Ingest And Aggregate Affiliate Performance Data (ConversionDetails, CommissionData)
    activate admanagerpostgresqldb022
    note over admanagerpostgresqldb022: Updates aggregated metrics tables (e.g., daily affiliate performance summaries) for dashboards. Could also write to DynamoDB for detailed event logs.
    admanagerpostgresqldb022--analyticsreportingservice012: Success
    deactivate admanagerpostgresqldb022

    deactivate analyticsreportingservice012
    deactivate analyticsreportingservice012

    note over ExternalCorePlatformOrderAPI, analyticsreportingservice012: Data is now available for affiliate performance dashboards and payout calculations (REQ-AMP-001, REQ-AMP-005, REQ-AMP-006).
