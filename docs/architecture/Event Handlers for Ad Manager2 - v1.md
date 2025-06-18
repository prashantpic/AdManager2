# Specification

# 1. Event Driven Architecture Analysis

- **System Overview:**
  
  - **Analysis Date:** 2025-06-18
  - **Architecture Type:** Microservices with Event-Driven aspects
  - **Technology Stack:**
    
    - Node.js (NestJS Framework)
    - TypeScript
    - Amazon SQS
    - Amazon SNS
    - Amazon API Gateway
    - Amazon RDS (PostgreSQL)
    - Amazon DynamoDB
    - Amazon EKS/ECS
    - AWS Lambda
    - Amazon CloudWatch
    - AWS X-Ray
    
  - **Bounded Contexts:**
    
    - Campaign Management
    - Product Catalog Management
    - Ad Network Integration
    - Analytics & Reporting
    - Promotion & Offer Management
    - Affiliate Marketing
    - User Access Management
    - Core Platform Integration
    - Notifications
    
  
- **Project Specific Events:**
  
  - **Event Id:** evt_prod_core_upd_001  
**Event Name:** ProductCoreDataUpdatedEvent  
**Event Type:** integration  
**Category:** Data Synchronization  
**Description:** Notifies Ad Manager services about creates, updates, or deletes in product data originating from the core [PlatformName] platform. Essential for keeping ad catalogs current.  
**Trigger Condition:** Product data change (CRUD) detected in [PlatformName] by CorePlatformIntegrationService.  
**Source Context:** CorePlatformIntegrationService  
**Target Contexts:**
    
    - ProductCatalogService
    - AnalyticsReportingService
    
**Payload:**
    
    - **Schema:**
      
      
    - **Required Fields:**
      
      - productId
      - operationType
      - timestamp
      
    - **Optional Fields:**
      
      - changedAttributes
      
    
**Frequency:** medium  
**Business Criticality:** critical  
**Data Source:**
    
    - **Database:** [PlatformName] Core DB (via API)
    - **Table:** Products
    - **Operation:** update
    
**Routing:**
    
    - **Routing Key:** product.core.updated
    - **Exchange:** 
    - **Queue:** ProductSyncEventsQueue
    
**Consumers:**
    
    - **Service:** ProductCatalogService  
**Handler:** handleProductCoreUpdate  
**Processing Type:** async  
    - **Service:** AnalyticsReportingService  
**Handler:** handleProductDimensionUpdate  
**Processing Type:** async  
    
**Dependencies:**
    
    - REQ-CPSI-001
    - REQ-PC-002
    
**Error Handling:**
    
    - **Retry Strategy:** Exponential backoff with jitter (via SQS redrive policy)
    - **Dead Letter Queue:** ProductSyncEventsDLQ
    - **Timeout Ms:** 30000
    
  - **Event Id:** evt_camp_state_req_001  
**Event Name:** CampaignStateChangeRequestedEvent  
**Event Type:** command  
**Category:** Campaign Lifecycle  
**Description:** Requests a change in a campaign\'s state (e.g., create, update, pause, activate) requiring synchronization with external ad networks. Critical for campaign operations.  
**Trigger Condition:** Merchant action via CampaignManagementService UI/API or automated rule.  
**Source Context:** CampaignManagementService  
**Target Contexts:**
    
    - AdNetworkIntegrationService
    
**Payload:**
    
    - **Schema:**
      
      
    - **Required Fields:**
      
      - campaignId
      - merchantId
      - requestedState
      - adNetworkIds
      - timestamp
      
    - **Optional Fields:**
      
      - campaignParametersForSync
      
    
**Frequency:** medium  
**Business Criticality:** critical  
**Data Source:**
    
    - **Database:** AdManagerDB (PostgreSQL)
    - **Table:** Campaign
    - **Operation:** update
    
**Routing:**
    
    - **Routing Key:** campaign.state.change.requested
    - **Exchange:** 
    - **Queue:** CampaignEventsQueue
    
**Consumers:**
    
    - **Service:** AdNetworkIntegrationService  
**Handler:** synchronizeCampaignStateWithAdNetworks  
**Processing Type:** async  
    
**Dependencies:**
    
    - REQ-CMO-001
    - REQ-CMO-002
    - REQ-03-001
    
**Error Handling:**
    
    - **Retry Strategy:** Exponential backoff with jitter (via SQS redrive policy)
    - **Dead Letter Queue:** CampaignEventsDLQ
    - **Timeout Ms:** 60000
    
  - **Event Id:** evt_ad_perf_ingest_001  
**Event Name:** AdPerformanceDataIngestedEvent  
**Event Type:** domain  
**Category:** Analytics  
**Description:** Announces that new ad performance data has been fetched from an ad network and is ready for aggregation and reporting. Key for analytics accuracy.  
**Trigger Condition:** Successful retrieval of performance metrics by AdNetworkIntegrationService.  
**Source Context:** AdNetworkIntegrationService  
**Target Contexts:**
    
    - AnalyticsReportingService
    
**Payload:**
    
    - **Schema:**
      
      
    - **Required Fields:**
      
      - adNetworkId
      - reportDate
      - metricsPayload
      - timestamp
      
    - **Optional Fields:**
      
      - campaignId
      - adSetId
      - adId
      
    
**Frequency:** high  
**Business Criticality:** critical  
**Data Source:**
    
    - **Database:** Ad Network APIs
    - **Table:** Performance Reports
    - **Operation:** read
    
**Routing:**
    
    - **Routing Key:** ad.performance.data.ingested
    - **Exchange:** PerformanceDataTopic (SNS)
    - **Queue:** AnalyticsPerformanceProcessingQueue (SQS subscriber to SNS)
    
**Consumers:**
    
    - **Service:** AnalyticsReportingService  
**Handler:** processIngestedPerformanceData  
**Processing Type:** async  
    
**Dependencies:**
    
    - REQ-03-002
    - REQ-CMO-007
    - REQ-ARP-001
    - REQ-ARP-005
    
**Error Handling:**
    
    - **Retry Strategy:** Exponential backoff with jitter (SQS redrive from AnalyticsPerformanceProcessingQueue)
    - **Dead Letter Queue:** AnalyticsPerformanceDLQ
    - **Timeout Ms:** 120000
    
  - **Event Id:** evt_notify_dispatch_req_001  
**Event Name:** NotificationDispatchRequestedEvent  
**Event Type:** system  
**Category:** Utility  
**Description:** A generic event requesting the dispatch of a notification (email, SMS, in-app) to a user or system. Centralizes notification logic.  
**Trigger Condition:** Various system actions requiring user notification (e.g., payment failure, campaign approval, maintenance window).  
**Source Context:** Any Service (e.g., BillingMonetizationService, CampaignManagementService, PlatformAdministrationService)  
**Target Contexts:**
    
    - NotificationService
    
**Payload:**
    
    - **Schema:**
      
      
    - **Required Fields:**
      
      - recipientId
      - channel
      - templateId
      - payloadForTemplate
      - timestamp
      
    - **Optional Fields:**
      
      - priority
      
    
**Frequency:** medium  
**Business Criticality:** important  
**Data Source:**
    
    - **Database:** N/A (Triggered by application logic)
    - **Table:** N/A
    - **Operation:** N/A
    
**Routing:**
    
    - **Routing Key:** notification.dispatch.requested
    - **Exchange:** NotificationEventsTopic (SNS)
    - **Queue:** NotificationDispatchQueue (SQS subscriber to SNS)
    
**Consumers:**
    
    - **Service:** NotificationService  
**Handler:** dispatchNotification  
**Processing Type:** async  
    
**Dependencies:**
    
    - REQ-POA-003
    - REQ-POA-016
    - REQ-15-004
    
**Error Handling:**
    
    - **Retry Strategy:** Exponential backoff with jitter (SQS redrive from NotificationDispatchQueue)
    - **Dead Letter Queue:** NotificationDispatchDLQ
    - **Timeout Ms:** 15000
    
  
- **Event Types And Schema Design:**
  
  - **Essential Event Types:**
    
    - **Event Name:** ProductCoreDataUpdatedEvent  
**Category:** integration  
**Description:** Syncs product changes from the core platform.  
**Priority:** high  
    - **Event Name:** CampaignStateChangeRequestedEvent  
**Category:** command  
**Description:** Initiates campaign changes and ad network synchronization.  
**Priority:** high  
    - **Event Name:** AdPerformanceDataIngestedEvent  
**Category:** domain  
**Description:** Distributes fetched ad performance metrics for processing.  
**Priority:** high  
    - **Event Name:** ProductCatalogFeedReadyForSubmissionEvent  
**Category:** domain  
**Description:** Signals a product catalog feed is ready for ad network submission.  
**Priority:** medium  
    - **Event Name:** OrderDataAttributedToAdEvent  
**Category:** integration  
**Description:** Provides order data for ROAS/CPA calculations.  
**Priority:** high  
    - **Event Name:** AudienceSegmentUpdateRequestedEvent  
**Category:** command  
**Description:** Requests synchronization of audience segments with ad networks.  
**Priority:** medium  
    - **Event Name:** NotificationDispatchRequestedEvent  
**Category:** system  
**Description:** Central event for dispatching various notifications.  
**Priority:** medium  
    - **Event Name:** ThirdPartyAppWebhookEvent  
**Category:** integration  
**Description:** Events from Ad Manager to be sent to subscribed third-party apps.  
**Priority:** medium  
    - **Event Name:** AffiliateConversionAttributionRequiredEvent  
**Category:** domain  
**Description:** Triggers affiliate conversion processing.  
**Priority:** medium  
    - **Event Name:** BillingCycleEvent  
**Category:** system  
**Description:** Triggers recurring billing processes.  
**Priority:** high  
    - **Event Name:** DataRetentionJobTriggerEvent  
**Category:** system  
**Description:** Initiates data archival or purging jobs.  
**Priority:** low  
    
  - **Schema Design:**
    
    - **Format:** JSON
    - **Reasoning:** Widely supported, human-readable, and compatible with AWS services (SQS, SNS, Lambda) and NestJS framework. REQ-POA-002 specifies JSON for CloudWatch logs, implying preference.
    - **Consistency Approach:** Standardized header fields (eventId, eventType, eventVersion, timestamp, sourceService, correlationId) and well-defined payloads for each event type.
    
  - **Schema Evolution:**
    
    - **Backward Compatibility:** True
    - **Forward Compatibility:** False
    - **Strategy:** Additive changes (new optional fields) for minor versions. New major versions for breaking changes. Consumers should be tolerant of unknown fields.
    
  - **Event Structure:**
    
    - **Standard Fields:**
      
      - eventId
      - eventType
      - eventVersion
      - timestamp
      - sourceService
      - correlationId
      - merchantId (if applicable)
      
    - **Metadata Requirements:**
      
      - Trace ID for distributed tracing (via X-Ray integration).
      - Authentication context (e.g., userId) if event is triggered by user action and relevant for consumer.
      
    
  
- **Event Routing And Processing:**
  
  - **Routing Mechanisms:**
    
    - **Type:** Amazon SQS (Simple Queue Service)  
**Description:** For point-to-point, durable messaging between services. Used for commands or events requiring processing by a specific service.  
**Use Case:** ProductCoreDataUpdatedEvent, CampaignStateChangeRequestedEvent. Queues like CampaignEventsQueue, ProductSyncEventsQueue are defined in architecture.  
    - **Type:** Amazon SNS (Simple Notification Service)  
**Description:** For fan-out (pub/sub) messaging to multiple subscribers. Used for broadcasting domain events or notifications.  
**Use Case:** AdPerformanceDataIngestedEvent, NotificationDispatchRequestedEvent. Topics like PerformanceDataTopic, NotificationEventsTopic are defined in architecture.  
    
  - **Processing Patterns:**
    
    - **Pattern:** sequential  
**Applicable Scenarios:**
    
    - Processing steps that have strict order dependencies, e.g., ensuring a product exists before an ad referencing it is created.
    
**Implementation:** Single consumer per SQS queue, or careful state management if multiple consumers.  
    - **Pattern:** parallel  
**Applicable Scenarios:**
    
    - Processing independent events, e.g., ingesting performance data for multiple different campaigns; dispatching multiple unrelated notifications.
    
**Implementation:** Multiple concurrent consumers on SQS queues (e.g., Lambda scaling) or multiple subscribers to SNS topics.  
    
  - **Filtering And Subscription:**
    
    - **Filtering Mechanism:** SNS message filtering based on message attributes for topic subscribers. SQS consumers poll specific queues.
    - **Subscription Model:** Services subscribe to SNS topics directly or via SQS queues. Services poll dedicated SQS queues.
    - **Routing Keys:**
      
      - product.core.updated
      - campaign.state.change.requested
      - ad.performance.data.ingested
      - notification.dispatch.requested
      
    
  - **Handler Isolation:**
    
    - **Required:** True
    - **Approach:** Microservices architecture inherently provides handler isolation. Each service is responsible for consuming and processing events relevant to its domain.
    - **Reasoning:** Ensures fault tolerance, independent scalability, and maintainability of event handlers.
    
  - **Delivery Guarantees:**
    
    - **Level:** at-least-once
    - **Justification:** Standard for SQS/SNS. Ensures messages are not lost. Requires idempotent consumers to handle potential duplicates.
    - **Implementation:** Proper SQS visibility timeout configuration, Lambda retry mechanisms, and designing idempotent event handlers within each microservice.
    
  
- **Event Storage And Replay:**
  
  - **Persistence Requirements:**
    
    - **Required:** True
    - **Duration:** Short-term (SQS/SNS default, up to 14 days for SQS) for message processing; Long-term for audit events (CloudWatch Logs, REQ-POA-012).
    - **Reasoning:** Message broker persistence for reliable delivery. Audit logs for compliance and historical analysis.
    
  - **Event Sourcing:**
    
    - **Necessary:** False
    - **Justification:** No explicit requirement for event sourcing to reconstruct entity state. Current needs met by traditional state persistence and audit logging. Would add unnecessary complexity for current scope.
    - **Scope:**
      
      
    
  - **Technology Options:**
    
    - **Technology:** Amazon SQS/SNS DLQs  
**Suitability:** high  
**Reasoning:** Built-in for handling undelivered messages, suitable for short-term storage and retry.  
    - **Technology:** Amazon CloudWatch Logs  
**Suitability:** high  
**Reasoning:** Specified for logging (REQ-POA-002) and suitable for storing immutable audit records of critical system events and user actions (REQ-IAM-009, REQ-MDGC-008).  
    
  - **Replay Capabilities:**
    
    - **Required:** True
    - **Scenarios:**
      
      - Re-processing messages from DLQs after fixing transient issues or consumer logic errors.
      
    - **Implementation:** Manual or semi-automated re-drive from SQS DLQs via AWS console or scripts.
    
  - **Retention Policy:**
    
    - **Strategy:** SQS/SNS message retention configured as per operational needs (e.g., 4-14 days). Audit logs retained as per REQ-POA-012 and REQ-MDGC-005.
    - **Duration:** Variable, based on type (message broker vs. audit log).
    - **Archiving Approach:** CloudWatch Logs can be configured for archival to S3/Glacier for long-term audit log retention.
    
  
- **Dead Letter Queue And Error Handling:**
  
  - **Dead Letter Strategy:**
    
    - **Approach:** Use SQS Dead Letter Queues (DLQs) for each primary processing SQS queue.
    - **Queue Configuration:** Each SQS queue (e.g., ProductSyncEventsQueue, CampaignEventsQueue) will have an associated DLQ (e.g., ProductSyncEventsDLQ).
    - **Processing Logic:** Monitor DLQs via CloudWatch Alarms. Failed messages analyzed manually or by an automated process for root cause. Re-drive possible after issue resolution.
    
  - **Retry Policies:**
    
    - **Error Type:** Transient errors (e.g., network issues, temporary service unavailability, throttling).  
**Max Retries:** 3  
**Backoff Strategy:** exponential  
**Delay Configuration:** SQS redrive policy with configured delay and backoff (REQ-03-007, REQ-TCE-002).  
    
  - **Poison Message Handling:**
    
    - **Detection Mechanism:** Messages that consistently fail processing and land in DLQ after multiple retries.
    - **Handling Strategy:** Isolate in DLQ, alert administrators, investigate manually. Automated analysis for common patterns if feasible.
    - **Alerting Required:** True
    
  - **Error Notification:**
    
    - **Channels:**
      
      - Email (via SES)
      - PagerDuty/OpsGenie (via SNS integration if configured)
      
    - **Severity:** critical
    - **Recipients:**
      
      - PlatformOperationsTeam
      - DevelopmentTeam (for specific errors)
      
    
  - **Recovery Procedures:**
    
    - **Scenario:** Message processing failure due to transient external service issue.  
**Procedure:** Allow automated retries. If issue persists and message lands in DLQ, investigate external service. Re-drive from DLQ once service is stable.  
**Automation Level:** semi-automated  
    - **Scenario:** Message processing failure due to bug in consumer logic.  
**Procedure:** Message lands in DLQ. Alert developers. Deploy fix. Re-drive messages from DLQ.  
**Automation Level:** manual  
    
  
- **Event Versioning Strategy:**
  
  - **Schema Evolution Approach:**
    
    - **Strategy:** Schema-on-read for consumers with tolerance for new optional fields. Major version changes for breaking contract changes.
    - **Versioning Scheme:** Semantic versioning (e.g., MAJOR.MINOR.PATCH) for event schemas.
    - **Migration Strategy:** For breaking changes, deploy new consumer versions first, then introduce new event producer version. Support old event version for a transition period if necessary.
    
  - **Compatibility Requirements:**
    
    - **Backward Compatible:** True
    - **Forward Compatible:** False
    - **Reasoning:** Consumers must be ableto process older versions of events (if still in flight) and gracefully ignore new, unknown optional fields in newer event versions to ensure backward compatibility. Forward compatibility (old consumer processing new event version with breaking changes) is not assumed without specific handling.
    
  - **Version Identification:**
    
    - **Mechanism:** Event schema version included in event metadata.
    - **Location:** payload
    - **Format:** Example: eventVersion: \"1.0.0\"
    
  - **Consumer Upgrade Strategy:**
    
    - **Approach:** Staged rollout for consumer updates. Ensure new consumers can handle existing event versions and new event versions if producers are also updated.
    - **Rollout Strategy:** Blue/green or canary deployments for consumer services.
    - **Rollback Procedure:** Revert to previous stable consumer version if issues arise.
    
  - **Schema Registry:**
    
    - **Required:** False
    - **Technology:** N/A for initial essential configuration. AWS Glue Schema Registry can be considered for future enhancement.
    - **Governance:** Currently based on shared type definitions within code and clear API documentation/contracts (REQ-SUD-015 for internal APIs).
    
  
- **Event Monitoring And Observability:**
  
  - **Monitoring Capabilities:**
    
    - **Capability:** SQS Queue Metrics Monitoring (AgeOfOldestMessage, ApproximateNumberOfMessagesVisible, etc.)  
**Justification:** Essential for understanding queue health, processing backlogs, and potential issues.  
**Implementation:** Amazon CloudWatch Metrics for SQS (REQ-POA-002).  
    - **Capability:** SNS Topic Metrics Monitoring (NumberOfMessagesPublished, NumberOfNotificationsFailed, etc.)  
**Justification:** Essential for tracking event publication success and delivery issues.  
**Implementation:** Amazon CloudWatch Metrics for SNS (REQ-POA-002).  
    - **Capability:** Event Handler Execution Logs (success, failure, latency)  
**Justification:** Critical for debugging event processing and identifying performance bottlenecks in consumers.  
**Implementation:** Structured JSON logs from microservices to Amazon CloudWatch Logs (REQ-POA-002).  
    - **Capability:** DLQ Monitoring (ApproximateNumberOfMessagesVisible)  
**Justification:** To detect and react to persistent message processing failures.  
**Implementation:** Amazon CloudWatch Metrics for SQS DLQs, with Alarms (REQ-POA-003).  
    
  - **Tracing And Correlation:**
    
    - **Tracing Required:** True
    - **Correlation Strategy:** Propagate a unique `correlationId` from the initial request or event through all subsequent events and service calls.
    - **Trace Id Propagation:** Utilize AWS X-Ray for distributed tracing, which handles trace ID propagation across supported AWS services and instrumented applications (REQ-POA-004).
    
  - **Performance Metrics:**
    
    - **Metric:** Event Processing Latency (end-to-end)  
**Threshold:** To be defined per event type based on business requirements (e.g., <5s for high priority).  
**Alerting:** True  
    - **Metric:** Event Handler Error Rate  
**Threshold:** e.g., >1% over 5 minutes  
**Alerting:** True  
    - **Metric:** Queue Depth / Message Age  
**Threshold:** e.g., >1000 messages or age >1 hour  
**Alerting:** True  
    
  - **Event Flow Visualization:**
    
    - **Required:** True
    - **Tooling:** AWS X-Ray Service Map.
    - **Scope:** Visualize interactions between services triggered by events.
    
  - **Alerting Requirements:**
    
    - **Condition:** DLQ message count > 0 for critical queues.  
**Severity:** critical  
**Response Time:** Immediate investigation  
**Escalation Path:**
    
    - On-call engineer
    - Development team lead
    
    - **Condition:** High event processing error rate.  
**Severity:** warning  
**Response Time:** Within 1 hour  
**Escalation Path:**
    
    - Development team
    
    - **Condition:** Significant event processing backlog (high queue depth/age).  
**Severity:** warning  
**Response Time:** Within 4 hours  
**Escalation Path:**
    
    - Operations team
    - Development team
    
    
  
- **Implementation Priority:**
  
  - **Component:** Core Event Infrastructure (SQS Queues, SNS Topics, DLQs)  
**Priority:** high  
**Dependencies:**
    
    
**Estimated Effort:** Medium  
  - **Component:** Idempotent Event Handlers for Critical Events (Product, Campaign, Performance)  
**Priority:** high  
**Dependencies:**
    
    - Core Event Infrastructure
    
**Estimated Effort:** High  
  - **Component:** Basic Monitoring and Alerting for Queues and Handlers  
**Priority:** high  
**Dependencies:**
    
    - Core Event Infrastructure
    - Event Handlers
    
**Estimated Effort:** Medium  
  - **Component:** Distributed Tracing (X-Ray) Integration  
**Priority:** medium  
**Dependencies:**
    
    - Event Handlers
    
**Estimated Effort:** Medium  
  - **Component:** Event Schema Versioning Strategy Implementation  
**Priority:** medium  
**Dependencies:**
    
    
**Estimated Effort:** Low (for basic metadata field)  
  
- **Risk Assessment:**
  
  - **Risk:** Non-idempotent event handlers causing data inconsistencies or unintended side effects on message retry.  
**Impact:** high  
**Probability:** medium  
**Mitigation:** Strict design and testing of all event handlers for idempotency. Use unique identifiers within events to detect duplicates.  
  - **Risk:** Misconfiguration of SQS/SNS (e.g., permissions, DLQ routing) leading to lost messages or processing failures.  
**Impact:** high  
**Probability:** low  
**Mitigation:** Infrastructure as Code (IaC) for provisioning messaging resources, thorough testing, and regular audits of configurations.  
  - **Risk:** Poison messages in a queue blocking legitimate message processing.  
**Impact:** medium  
**Probability:** medium  
**Mitigation:** Effective DLQ strategy, monitoring DLQs, and robust error handling in consumers to isolate problematic messages.  
  - **Risk:** Complexity in debugging and tracing issues across distributed event-driven flows.  
**Impact:** medium  
**Probability:** medium  
**Mitigation:** Comprehensive distributed tracing (X-Ray), correlation IDs, and structured logging.  
  - **Risk:** Eventual consistency challenges leading to stale data views in some parts of the system.  
**Impact:** medium  
**Probability:** medium  
**Mitigation:** Careful system design to manage consistency expectations, clear communication to users where applicable, and minimizing consistency windows.  
  
- **Recommendations:**
  
  - **Category:** Design & Implementation  
**Recommendation:** Ensure all event handlers are designed to be idempotent from the outset to safely handle at-least-once message delivery from SQS/SNS.  
**Justification:** Prevents data corruption or unintended repeated actions upon message retries, which are common in distributed messaging systems.  
**Priority:** high  
  - **Category:** Tooling & Infrastructure  
**Recommendation:** Leverage AWS managed services (SQS, SNS, CloudWatch, X-Ray) as per the architecture, utilizing IaC (e.g., AWS CDK) for their provisioning and configuration.  
**Justification:** Reduces operational overhead, ensures consistent environments, and aligns with existing technology stack and REQ-POA-008.  
**Priority:** high  
  - **Category:** Monitoring & Observability  
**Recommendation:** Implement comprehensive monitoring and alerting for queue depths, message ages, DLQ activity, and event handler error rates using CloudWatch Alarms.  
**Justification:** Early detection of issues in the event processing pipeline is critical for system reliability (REQ-POA-003, REQ-POA-015).  
**Priority:** high  
  - **Category:** Schema Management  
**Recommendation:** Establish clear conventions for event schema naming, versioning (in event metadata), and evolution (prioritizing backward compatibility). Document schemas thoroughly.  
**Justification:** Minimizes integration issues between services as the system evolves, even without a formal schema registry initially.  
**Priority:** medium  
  - **Category:** Testing  
**Recommendation:** Implement integration tests that specifically cover event publishing and consumption scenarios, including failure conditions and retries.  
**Justification:** Ensures the reliability of event-driven workflows and validates error handling mechanisms.  
**Priority:** medium  
  


---

