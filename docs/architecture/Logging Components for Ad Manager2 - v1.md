# Specification

# 1. Logging And Observability Analysis

- **System Overview:**
  
  - **Analysis Date:** 2025-06-18
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
    - React
    - Next.js
    - Amazon ElastiCache (Redis)
    - AWS WAF
    - AWS KMS
    - AWS Secrets Manager
    - Amazon CloudWatch (Logs, Metrics, Alarms)
    - AWS X-Ray
    
  - **Monitoring Requirements:**
    
    - REQ-POA-002 (Centralized structured JSON logging to CloudWatch, querying, retention)
    - REQ-POA-003 (Alerting on critical thresholds/anomalies)
    - REQ-POA-004 (Distributed tracing with X-Ray, log correlation)
    - REQ-POA-012 (Comprehensive, immutable audit trails with search, export, retention)
    - REQ-POA-015 (System Health Dashboard consuming metrics/logs)
    - REQ-POA-021 (Data quality monitoring and reporting, potentially log-driven)
    - REQ-IAM-009 (Audit trails for user access, admin actions, security events)
    - REQ-MDGC-008 (Audit trails for data governance and compliance activities)
    - REQ-ARP-006 (Specific retention for campaign performance logs, but implies operational logs for analytics pipeline itself need monitoring)
    
  - **System Architecture:** Microservices with Event-Driven aspects on AWS, as detailed in provided architecture documents.
  - **Environment:** production
  
- **Log Level And Category Strategy:**
  
  - **Default Log Level:** INFO
  - **Environment Specific Levels:**
    
    - **Environment:** development  
**Log Level:** DEBUG  
**Justification:** Enable detailed troubleshooting during development.  
    - **Environment:** staging  
**Log Level:** INFO  
**Justification:** Mirror production behavior; can be temporarily elevated to DEBUG for specific pre-release testing.  
    
  - **Component Categories:**
    
    - **Component:** CampaignManagementService  
**Category:** ApplicationLog  
**Log Level:** INFO  
**Verbose Logging:** False  
**Justification:** Standard operational logging.  
    - **Component:** AdNetworkIntegrationService  
**Category:** ApplicationLog  
**Log Level:** INFO  
**Verbose Logging:** False  
**Justification:** Operational logs. DEBUG for specific external API call traces may be enabled temporarily under strict conditions.  
    - **Component:** ProductCatalogService  
**Category:** ApplicationLog  
**Log Level:** INFO  
**Verbose Logging:** False  
**Justification:** Standard operational logging.  
    - **Component:** AnalyticsReportingService  
**Category:** ApplicationLog  
**Log Level:** INFO  
**Verbose Logging:** False  
**Justification:** Logs for data ingestion pipeline health and report generation.  
    - **Component:** UserAccessManagementService  
**Category:** SecurityAuditLog  
**Log Level:** INFO  
**Verbose Logging:** False  
**Justification:** Log successful/failed auth events, role changes (REQ-IAM-009).  
    - **Component:** CorePlatformIntegrationService  
**Category:** ApplicationLog  
**Log Level:** INFO  
**Verbose Logging:** False  
**Justification:** Logs related to communication with the core [PlatformName] platform.  
    - **Component:** APIGatewayComponent  
**Category:** AccessLog  
**Log Level:** INFO  
**Verbose Logging:** False  
**Justification:** Standard access logging for requests, responses, latency.  
    - **Component:** BillingMonetizationService  
**Category:** TransactionAuditLog  
**Log Level:** INFO  
**Verbose Logging:** False  
**Justification:** Log billing events, subscription changes, payment attempts (REQ-15-001 to REQ-15-006 imply auditable events).  
    - **Component:** DataGovernanceComplianceService  
**Category:** ComplianceAuditLog  
**Log Level:** INFO  
**Verbose Logging:** False  
**Justification:** Log DSR actions, consent changes, data retention activities (REQ-MDGC-004, REQ-MDGC-005, REQ-MDGC-008).  
    
  - **Sampling Strategies:**
    
    - **Component:** AllServices  
**Sampling Rate:** 1.0 (No sampling for INFO and above)  
**Condition:** logLevel >= INFO  
**Reason:** Ensure all standard operational, warning, error, and critical logs are captured. Sampling for DEBUG in production would be ad-hoc.  
    
  - **Logging Approach:**
    
    - **Structured:** True
    - **Format:** JSON
    - **Standard Fields:**
      
      - timestamp
      - level
      - serviceName
      - correlationId
      - message
      - exceptionDetails
      - stackTrace
      - threadId
      - userId
      - merchantId
      - operationName
      - sourceIp
      
    - **Custom Fields:**
      
      - campaignId
      - adSetId
      - adId
      - productId
      - catalogId
      - promotionId
      - adNetworkName
      - requestPath
      - httpMethod
      - httpStatusCode
      - durationMs
      
    
  
- **Log Aggregation Architecture:**
  
  - **Collection Mechanism:**
    
    - **Type:** library
    - **Technology:** AWS SDK for JavaScript v3 (CloudWatch Logs Client) integrated via SharedLoggingLibrary (NestJS)
    - **Configuration:**
      
      - **Region:** AWS Region of deployment
      - **Credentials:** Via IAM roles for EKS/ECS/Lambda
      
    - **Justification:** REQ-POA-002 specifies Amazon CloudWatch Logs as the central store. AWS SDK is the standard way for applications running on AWS to send logs to CloudWatch Logs. A shared library ensures consistency.
    
  - **Strategy:**
    
    - **Approach:** centralized
    - **Reasoning:** REQ-POA-002 requires centralized logging in CloudWatch Logs for querying, alerting, and auditing.
    - **Local Retention:** Minimal/None (Logs are streamed to CloudWatch Logs. Local buffering by SDK/Agent is transient.)
    
  - **Shipping Methods:**
    
    - **Protocol:** HTTPS (AWS SDK internal)  
**Destination:** Amazon CloudWatch Logs  
**Reliability:** at-least-once  
**Compression:** False  
    
  - **Buffering And Batching:**
    
    - **Buffer Size:** Default AWS SDK / CloudWatch Agent
    - **Batch Size:** 0
    - **Flush Interval:** Default AWS SDK / CloudWatch Agent (e.g., 5 seconds for SDK)
    - **Backpressure Handling:** Handled by AWS SDK / CloudWatch Agent (retries, potential discards if buffer full and cannot send)
    
  - **Transformation And Enrichment:**
    
    - **Transformation:** Structuring log messages into JSON format with standard and custom fields.  
**Purpose:** REQ-POA-002 requires structured JSON logs. Facilitates querying, analysis, and consistent context.  
**Stage:** collection (within application via SharedLoggingLibrary)  
    - **Transformation:** Addition of correlationId, serviceName, merchantId, userId.  
**Purpose:** Enhance traceability and context for troubleshooting and auditing.  
**Stage:** collection (within application via SharedLoggingLibrary and request context)  
    
  - **High Availability:**
    
    - **Required:** True
    - **Redundancy:** Amazon CloudWatch Logs is a regionally managed service with inherent high availability and multi-AZ redundancy.
    - **Failover Strategy:** Managed by AWS.
    
  
- **Retention Policy Design:**
  
  - **Retention Periods:**
    
    - **Log Type:** ApplicationLogs (Operational)  
**Retention Period:** 90 days active (CloudWatch Logs), then archive to S3 Glacier Flexible Retrieval for 1 year.  
**Justification:** REQ-POA-002 specifies active retention. Extended archival supports longer-term issue investigation and trend analysis.  
**Compliance Requirement:** None specific beyond general operational needs.  
    - **Log Type:** SecurityAuditLogs (IAM events, RBAC changes, security incidents)  
**Retention Period:** 1 year active (CloudWatch Logs), then archive to S3 Glacier Deep Archive for 7 years with S3 Object Lock (WORM).  
**Justification:** REQ-IAM-009, REQ-MDGC-008 require comprehensive, immutable audit trails for compliance and forensic analysis.  
**Compliance Requirement:** GDPR, CCPA, potential industry-specific regulations.  
    - **Log Type:** ComplianceAuditLogs (DSR actions, consent management)  
**Retention Period:** 1 year active (CloudWatch Logs), then archive to S3 Glacier Deep Archive for 7 years with S3 Object Lock (WORM).  
**Justification:** REQ-MDGC-008, facilitates compliance reporting (REQ-POA-013).  
**Compliance Requirement:** GDPR, CCPA.  
    - **Log Type:** APIGatewayAccessLogs  
**Retention Period:** 90 days active (CloudWatch Logs), then archive to S3 Glacier Flexible Retrieval for 1 year.  
**Justification:** Troubleshooting access issues, security monitoring.  
**Compliance Requirement:** None specific, but supports security audits.  
    - **Log Type:** BillingTransactionLogs (logs of billing events, not raw payment data)  
**Retention Period:** 1 year active (CloudWatch Logs), then archive to S3 Glacier Deep Archive for 7 years.  
**Justification:** Financial auditing, dispute resolution. (Implied by REQ-15-001 to REQ-15-006)  
**Compliance Requirement:** Financial regulations, tax laws.  
    
  - **Compliance Requirements:**
    
    - **Regulation:** GDPR  
**Applicable Log Types:**
    
    - SecurityAuditLogs
    - ComplianceAuditLogs
    - ApplicationLogs (if PII present despite masking efforts)
    
**Minimum Retention:** Varies by purpose, DSR fulfillment records may need longer.  
**Special Handling:** Ensure PII is minimized/masked. Support erasure requests for logs if PII cannot be fully disassociated and retention period not legally mandated.  
    - **Regulation:** CCPA  
**Applicable Log Types:**
    
    - SecurityAuditLogs
    - ComplianceAuditLogs
    - ApplicationLogs (if PII present despite masking efforts)
    
**Minimum Retention:** Varies, similar to GDPR.  
**Special Handling:** Similar to GDPR, support consumer rights.  
    
  - **Volume Impact Analysis:**
    
    - **Estimated Daily Volume:** High, particularly from AdNetworkIntegrationService, AnalyticsReportingService, and API Gateway. Exact TB/month TBD based on load.
    - **Storage Cost Projection:** To be monitored via AWS Cost Explorer. CloudWatch Logs ingestion and storage costs, S3 archival costs.
    - **Compression Ratio:** CloudWatch Logs provides compression. S3 objects will be compressed before archival to Glacier.
    
  - **Storage Tiering:**
    
    - **Hot Storage:**
      
      - **Duration:** Up to 1 year (CloudWatch Logs, depending on log type)
      - **Accessibility:** immediate
      - **Cost:** high
      
    - **Warm Storage:**
      
      - **Duration:** Not explicitly defined as a separate tier; S3 Standard can serve this before Glacier transition.
      - **Accessibility:** immediate
      - **Cost:** medium
      
    - **Cold Storage:**
      
      - **Duration:** Up to 7 years post-active retention (S3 Glacier Flexible Retrieval / Deep Archive)
      - **Accessibility:** minutes to hours
      - **Cost:** low
      
    
  - **Compression Strategy:**
    
    - **Algorithm:** Gzip (standard for CloudWatch Agent/SDK payloads, S3 archival)
    - **Compression Level:** Default
    - **Expected Ratio:** Varies (e.g., 3:1 to 10:1 for text-based logs)
    
  - **Anonymization Requirements:**
    
    - **Data Type:** PII (e.g., Usernames, Emails, IP Addresses if captured)  
**Method:** Masking at source (within SharedLoggingLibrary) or exclusion. If long-term analytics on anonymized logs are needed, specific anonymization techniques (e.g., k-anonymity) would apply before archival for that purpose.  
**Timeline:** At time of log generation/collection.  
**Compliance:** GDPR, CCPA (REQ-MDGC-002)  
    
  
- **Search Capability Requirements:**
  
  - **Essential Capabilities:**
    
    - **Capability:** Full-text search on log messages  
**Performance Requirement:** Results within seconds to a few minutes for common queries.  
**Justification:** REQ-POA-002 (querying logs) - essential for troubleshooting.  
    - **Capability:** Filtering by standard fields (timestamp, level, serviceName, correlationId)  
**Performance Requirement:** Results within seconds.  
**Justification:** Standard troubleshooting and log analysis.  
    - **Capability:** Filtering by custom business-relevant fields (merchantId, campaignId, userId)  
**Performance Requirement:** Results within seconds to minutes.  
**Justification:** Contextual troubleshooting for specific merchant or campaign issues.  
    - **Capability:** Search across multiple log groups (cross-service search)  
**Performance Requirement:** Results within minutes.  
**Justification:** Tracing issues across distributed microservices.  
    
  - **Performance Characteristics:**
    
    - **Search Latency:** Expected: < 1 minute for typical queries on recent data (CloudWatch Logs Insights).
    - **Concurrent Users:** 10
    - **Query Complexity:** simple|complex
    - **Indexing Strategy:** CloudWatch Logs Insights automatically indexes recent logs. For archived S3 logs, AWS Athena or OpenSearch might be used if frequent querying is needed (not essential initial config).
    
  - **Indexed Fields:**
    
    - **Field:** timestamp  
**Index Type:** Native (CloudWatch)  
**Search Pattern:** Time range queries  
**Frequency:** high  
    - **Field:** level  
**Index Type:** Native (CloudWatch)  
**Search Pattern:** Filtering by log severity  
**Frequency:** high  
    - **Field:** serviceName  
**Index Type:** Native (CloudWatch)  
**Search Pattern:** Filtering by service  
**Frequency:** high  
    - **Field:** correlationId  
**Index Type:** Native (CloudWatch)  
**Search Pattern:** Tracing specific request flow  
**Frequency:** high  
    - **Field:** merchantId  
**Index Type:** Native (CloudWatch)  
**Search Pattern:** Filtering by merchant  
**Frequency:** medium  
    - **Field:** userId  
**Index Type:** Native (CloudWatch)  
**Search Pattern:** Filtering by user  
**Frequency:** medium  
    - **Field:** errorCode  
**Index Type:** Native (CloudWatch)  
**Search Pattern:** Filtering by specific error codes  
**Frequency:** medium  
    
  - **Full Text Search:**
    
    - **Required:** True
    - **Fields:**
      
      - message
      - exceptionDetails
      
    - **Search Engine:** Amazon CloudWatch Logs Insights
    - **Relevance Scoring:** True
    
  - **Correlation And Tracing:**
    
    - **Correlation Ids:**
      
      - correlationId (auto-generated or propagated from request headers)
      
    - **Trace Id Propagation:** x-amzn-trace-id (AWS X-Ray trace ID, REQ-POA-004)
    - **Span Correlation:** True
    - **Cross Service Tracing:** True
    
  - **Dashboard Requirements:**
    
    - **Dashboard:** SystemHealthDashboard  
**Purpose:** REQ-POA-015: Display real-time status, KPIs, active alerts. Consumes log-based metrics (e.g., error counts).  
**Refresh Interval:** 1 minute  
**Audience:** PlatformAdministrator  
    - **Dashboard:** LogErrorSummaryDashboard  
**Purpose:** Overview of error rates per service, top errors, trends.  
**Refresh Interval:** 5 minutes  
**Audience:** PlatformAdministrator, Developer  
    
  
- **Storage Solution Selection:**
  
  - **Selected Technology:**
    
    - **Primary:** Amazon CloudWatch Logs (for hot storage/active querying)
    - **Reasoning:** REQ-POA-002 mandates CloudWatch Logs. Native AWS integration, scalability, query capabilities (Insights), alerting.
    - **Alternatives:**
      
      - Amazon OpenSearch Service (for more advanced log analytics if Insights becomes limiting - future consideration)
      
    
  - **Scalability Requirements:**
    
    - **Expected Growth Rate:** High, proportional to platform usage and number of services.
    - **Peak Load Handling:** CloudWatch Logs is designed for high ingestion rates.
    - **Horizontal Scaling:** True
    
  - **Cost Performance Analysis:**
    
    - **Solution:** Amazon CloudWatch Logs + S3 Glacier/Deep Archive  
**Cost Per Gb:** Varies (CloudWatch: ingestion + storage; S3: storage + retrieval)  
**Query Performance:** Good for recent data (Insights); S3 requires restoration or Athena/OpenSearch for querying archives.  
**Operational Complexity:** low (managed services)  
    
  - **Backup And Recovery:**
    
    - **Backup Frequency:** CloudWatch Logs data is durable and replicated by AWS. Archival to S3 is the backup for long-term.
    - **Recovery Time Objective:** For CloudWatch Logs (regional service): AWS managed. For S3 archives: Depends on Glacier retrieval speed (minutes to hours).
    - **Recovery Point Objective:** CloudWatch Logs: Near real-time. S3 archives: Depends on archival frequency (e.g., daily/weekly).
    - **Testing Frequency:** Annual DR test including log restoration from S3 archives (REQ-POA-006).
    
  - **Geo Distribution:**
    
    - **Required:** False
    - **Regions:**
      
      - Primary AWS region of deployment
      
    - **Replication Strategy:** CloudWatch Logs is regional. S3 archives can be replicated cross-region if DR requirements mandate it beyond multi-AZ.
    
  - **Data Sovereignty:**
    
    - **Region:** Primary AWS region of deployment (e.g., me-south-1)  
**Requirements:**
    
    - Data must reside within the specified region unless explicitly replicated for DR with compliance considerations.
    
**Compliance Framework:** GDPR, CCPA, local data residency laws if applicable.  
    
  
- **Access Control And Compliance:**
  
  - **Access Control Requirements:**
    
    - **Role:** PlatformAdministrator  
**Permissions:**
    
    - cloudwatch:Describe*
    - cloudwatch:Get*
    - cloudwatch:FilterLogEvents
    - cloudwatch:StartQuery
    - cloudwatch:StopQuery
    - cloudwatch:GetQueryResults
    - logs:*
    
**Log Types:**
    
    - All
    
**Justification:** REQ-POA-001, REQ-POA-002, REQ-POA-012: Full access for system oversight, troubleshooting, audit.  
    - **Role:** DeveloperTeamLead (Broad Access)  
**Permissions:**
    
    - cloudwatch:Describe*
    - cloudwatch:Get*
    - cloudwatch:FilterLogEvents
    - logs:DescribeLogGroups
    - logs:DescribeLogStreams
    - logs:FilterLogEvents
    
**Log Types:**
    
    - ApplicationLogs (All services)
    
**Justification:** Cross-service troubleshooting and monitoring.  
    - **Role:** Developer (Service-Specific)  
**Permissions:**
    
    - cloudwatch:Describe*
    - cloudwatch:Get*
    - cloudwatch:FilterLogEvents (for their_service_log_group)
    
**Log Types:**
    
    - ApplicationLogs (their specific service)
    
**Justification:** Troubleshooting their own service, principle of least privilege.  
    - **Role:** SecurityAnalyst  
**Permissions:**
    
    - cloudwatch:Describe*
    - cloudwatch:Get*
    - cloudwatch:FilterLogEvents
    
**Log Types:**
    
    - SecurityAuditLogs
    - ComplianceAuditLogs
    - APIGatewayAccessLogs
    
**Justification:** Security monitoring and incident response, compliance verification.  
    
  - **Sensitive Data Handling:**
    
    - **Data Type:** PII (e.g., Usernames, Email Addresses, potentially Ad Targeting details if logged verbosely)  
**Handling Strategy:** Masking at source or exclusion from logs. Strict avoidance of logging sensitive PII.  
**Fields:**
    
    - N/A - aim for exclusion. If unavoidable, specific fields to be masked defined during implementation reviews.
    
**Compliance Requirement:** GDPR, CCPA (REQ-MDGC-001, REQ-MDGC-002)  
    - **Data Type:** API Keys / Secrets (Ad Network, Payment Gateway)  
**Handling Strategy:** Exclusion (NEVER LOG SECRETS).  
**Fields:**
    
    - N/A
    
**Compliance Requirement:** Security best practices, PCI-DSS if payment related.  
    
  - **Encryption Requirements:**
    
    - **In Transit:**
      
      - **Required:** True
      - **Protocol:** TLS 1.2+ (AWS SDK default for CloudWatch Logs API)
      - **Certificate Management:** AWS Managed
      
    - **At Rest:**
      
      - **Required:** True
      - **Algorithm:** AES-256 (CloudWatch Logs server-side encryption by default, option for AWS KMS CMK)
      - **Key Management:** AWS KMS (REQ-POA-017 for KMS key management)
      
    
  - **Audit Trail:**
    
    - **Log Access:** True
    - **Retention Period:** As per SecurityAuditLogs retention (1 yr active + 7 yr archive)
    - **Audit Log Location:** AWS CloudTrail (for AWS API calls related to CloudWatch Logs/S3 access), and potentially internal application audit logs for queries via admin tools.
    - **Compliance Reporting:** True
    
  - **Regulatory Compliance:**
    
    - **Regulation:** GDPR  
**Applicable Components:**
    
    - All services generating logs
    - CloudWatch Logs
    - S3 (archives)
    
**Specific Requirements:**
    
    - Data minimization in logs
    - Right to erasure (may require log deletion/anonymization for specific user data if identifiable)
    - Lawful basis for processing (logging)
    - Security of processing
    
**Evidence Collection:** Log access policies, PII handling procedures, DSR fulfillment records related to logs.  
    - **Regulation:** CCPA  
**Applicable Components:**
    
    - All services generating logs
    - CloudWatch Logs
    - S3 (archives)
    
**Specific Requirements:**
    
    - Similar to GDPR: data minimization, consumer rights (access, deletion).
    
**Evidence Collection:** Similar to GDPR.  
    
  - **Data Protection Measures:**
    
    - **Measure:** PII Masking/Exclusion in Logs  
**Implementation:** SharedLoggingLibrary to enforce rules. Code reviews. SAST tool checks.  
**Monitoring Required:** True  
    - **Measure:** Role-Based Access Control (RBAC) for Log Access  
**Implementation:** AWS IAM policies aligned with defined roles.  
**Monitoring Required:** True  
    - **Measure:** Regular Log Review for Anomalies/Security Events  
**Implementation:** Automated alerts (CloudWatch Alarms on log metrics), manual spot checks by security team.  
**Monitoring Required:** True  
    
  
- **Project Specific Logging Config:**
  
  - **Logging Config:**
    
    - **Level:** INFO
    - **Retention:** ApplicationLogs: 90d active CloudWatch + 1yr S3 Glacier FR archive. SecurityAuditLogs: 1yr active CloudWatch + 7yr S3 Glacier Deep Archive (WORM).
    - **Aggregation:** Centralized in Amazon CloudWatch Logs per AWS region.
    - **Storage:** Amazon CloudWatch Logs (hot), Amazon S3 Glacier Flexible Retrieval / Deep Archive (cold).
    - **Configuration:**
      
      - **Shared Library Default Level:** INFO
      - **Cloudwatch Log Group Name Pattern:** /aws/ApplicationInsights/AdManager/{ServiceName}
      - **Cloudwatch Log Stream Name Pattern:** {InstanceId}/{Date}
      
    
  - **Component Configurations:**
    
    - **Component:** CampaignManagementService  
**Log Level:** INFO  
**Output Format:** JSON  
**Destinations:**
    
    - CloudWatchLogs
    
**Sampling:**
    
    - **Enabled:** False
    - **Rate:** 1.0
    
**Custom Fields:**
    
    - merchantId
    - userId
    - campaignId
    - operationName
    
    - **Component:** AdNetworkIntegrationService  
**Log Level:** INFO  
**Output Format:** JSON  
**Destinations:**
    
    - CloudWatchLogs
    
**Sampling:**
    
    - **Enabled:** False
    - **Rate:** 1.0
    
**Custom Fields:**
    
    - merchantId
    - userId
    - adNetworkName
    - correlationId
    - externalApiEndpoint
    - externalApiStatusCode
    
    - **Component:** UserAccessManagementService (Audit)  
**Log Level:** INFO  
**Output Format:** JSON  
**Destinations:**
    
    - CloudWatchLogs (SecurityAuditLogGroup)
    
**Sampling:**
    
    - **Enabled:** False
    - **Rate:** 1.0
    
**Custom Fields:**
    
    - actorUserId
    - targetUserId
    - action
    - resourceAffected
    - previousValue
    - newValue
    
    
  - **Metrics:**
    
    - **Custom Metrics:**
      
      - **Log Error Rate Per Service:**
        
        - **Namespace:** AdManagerPlatform/Application
        - **Metric Name:** LogErrorRate
        - **Dimensions:**
          
          - ServiceName
          
        - **Unit:** Percent
        - **Statistic:** Average
        - **Period:** 60
        - **Source:** CloudWatch Logs Metric Filter on ERROR level logs.
        
      - **Dlqmessage Count:**
        
        - **Namespace:** AWS/SQS
        - **Metric Name:** ApproximateNumberOfMessagesVisible
        - **Dimensions:**
          
          - QueueName (DLQ)
          
        - **Unit:** Count
        - **Statistic:** Maximum
        - **Period:** 300
        - **Source:** Standard SQS metric.
        
      - **Ad Network Api Call Latency_Avg_Network_Operation:**
        
        - **Namespace:** AdManagerPlatform/ExternalAPI
        - **Metric Name:** AdNetworkApiCallLatency
        - **Dimensions:**
          
          - AdNetworkName
          - ApiOperation
          
        - **Unit:** Milliseconds
        - **Statistic:** Average
        - **Period:** 60
        - **Source:** Custom metric published by AdNetworkIntegrationService.
        
      
    
  - **Alert Rules:**
    
    - **Name:** HighErrorRate_CampaignService_5Min  
**Condition:** Metric 'LogErrorRate' for ServiceName='CampaignManagementService' > 5% for 5 minutes  
**Severity:** High  
**Actions:**
    
    - **Type:** SNS  
**Target:** arn:aws:sns:{region}:{accountId}:AdManager_Alerts_HighSeverity  
**Configuration:**
    
    
    
**Suppression Rules:**
    
    - During_Scheduled_Maintenance_Window_Tag
    
**Escalation Path:**
    
    - DevTeam_CampaignService_Tier1
    - PlatformOps_Tier2
    
    - **Name:** DLQ_NotEmpty_CriticalQueue_CampaignEvents  
**Condition:** Metric 'DLQMessageCount' for QueueName='CampaignEvents_DLQ' > 0 for 15 minutes  
**Severity:** Critical  
**Actions:**
    
    - **Type:** SNS  
**Target:** arn:aws:sns:{region}:{accountId}:AdManager_Alerts_CriticalSeverity_PagerDuty  
**Configuration:**
    
    
    
**Suppression Rules:**
    
    
**Escalation Path:**
    
    - OnCall_PlatformOps_Immediate
    - DevTeam_CampaignService_Tier1
    
    - **Name:** SecurityAudit_FailedLoginAttempts_High  
**Condition:** CloudWatch Logs Metric Filter on SecurityAuditLogs for 'FailedLogin' > 10 in 1 minute  
**Severity:** Critical  
**Actions:**
    
    - **Type:** SNS  
**Target:** arn:aws:sns:{region}:{accountId}:AdManager_Alerts_Security_Critical  
**Configuration:**
    
    
    
**Suppression Rules:**
    
    
**Escalation Path:**
    
    - SecurityTeam_Immediate
    - PlatformOps_Tier1
    
    
  
- **Implementation Priority:**
  
  - **Component:** SharedLoggingLibrary (TypeScript for NestJS)  
**Priority:** high  
**Dependencies:**
    
    
**Estimated Effort:** Medium  
**Risk Level:** low  
  - **Component:** Basic CloudWatch Logs Configuration (Log Groups, IAM Permissions)  
**Priority:** high  
**Dependencies:**
    
    
**Estimated Effort:** Low  
**Risk Level:** low  
  - **Component:** Structured Logging Integration in all Microservices  
**Priority:** high  
**Dependencies:**
    
    - SharedLoggingLibrary
    
**Estimated Effort:** High (across all services)  
**Risk Level:** medium  
  - **Component:** Essential Correlation ID Propagation  
**Priority:** high  
**Dependencies:**
    
    - SharedLoggingLibrary
    - APIGatewayComponent config
    
**Estimated Effort:** Medium  
**Risk Level:** low  
  - **Component:** Basic Log-Based Metrics and Alerting for Errors (CloudWatch)  
**Priority:** high  
**Dependencies:**
    
    - Structured Logging Integration
    
**Estimated Effort:** Medium  
**Risk Level:** low  
  - **Component:** Log Retention Policies Implementation (CloudWatch, S3 Lifecycle)  
**Priority:** medium  
**Dependencies:**
    
    - Basic CloudWatch Logs Configuration
    
**Estimated Effort:** Medium  
**Risk Level:** low  
  - **Component:** PII Masking/Exclusion Strategy Implementation in SharedLoggingLibrary  
**Priority:** medium  
**Dependencies:**
    
    - SharedLoggingLibrary
    
**Estimated Effort:** Medium  
**Risk Level:** medium  
  - **Component:** X-Ray Integration for Distributed Tracing (REQ-POA-004)  
**Priority:** medium  
**Dependencies:**
    
    - Structured Logging Integration
    
**Estimated Effort:** Medium  
**Risk Level:** medium  
  
- **Risk Assessment:**
  
  - **Risk:** Excessive logging volume driving up CloudWatch costs.  
**Impact:** medium  
**Probability:** medium  
**Mitigation:** Strict adherence to INFO default level in production. Enable DEBUG only temporarily for specific troubleshooting. Regularly review log volumes and costs.  
**Contingency Plan:** Adjust log levels dynamically for noisy components if identified. Implement more aggressive filtering or sampling if absolutely necessary (though not ideal for essential logs).  
  - **Risk:** Sensitive PII data leakage into logs.  
**Impact:** high  
**Probability:** low  
**Mitigation:** Implement PII masking/exclusion in SharedLoggingLibrary. Developer training on secure logging practices. Code reviews focusing on logging. SAST tools for PII detection.  
**Contingency Plan:** Incident response plan: identify affected logs, assess scope, remediate (e.g., delete specific log streams if possible and legally permissible, or filter view), fix logging code, notify DPO.  
  - **Risk:** Inconsistent log formats or missing critical fields (e.g., correlationId) hindering troubleshooting.  
**Impact:** medium  
**Probability:** medium  
**Mitigation:** Mandate use of SharedLoggingLibrary. Automated linting/tests for log structure. Regular review of log quality.  
**Contingency Plan:** Iteratively improve logging library and enforce updates. Manual log correlation efforts if IDs are missing.  
  - **Risk:** Insufficient log retention for compliance or long-term audit.  
**Impact:** high  
**Probability:** low  
**Mitigation:** Implement defined retention policies using CloudWatch Logs settings and S3 lifecycle policies. Regularly audit retention configurations.  
**Contingency Plan:** If data prematurely deleted and unrecoverable, document incident and impact for compliance bodies. Adjust policies to prevent recurrence.  
  - **Risk:** Alert fatigue due to poorly configured or too many non-actionable alerts.  
**Impact:** medium  
**Probability:** medium  
**Mitigation:** Careful tuning of alert thresholds. Focus alerts on actionable, critical issues. Implement alert suppression rules. Regularly review alert effectiveness.  
**Contingency Plan:** Temporarily disable noisy alerts. Refine alert conditions. Implement tiered alerting.  
  
- **Recommendations:**
  
  - **Category:** Implementation  
**Recommendation:** Develop and enforce the use of a 'SharedLoggingLibrary' across all NestJS microservices. This library should handle structured JSON formatting, inclusion of standard fields (timestamp, level, serviceName, correlationId, etc.), and PII masking/exclusion logic.  
**Justification:** Ensures consistency, reduces boilerplate code in services, centralizes control over log format and sensitive data handling, fulfilling REQ-POA-002 and supporting REQ-MDGC-002.  
**Priority:** high  
**Implementation Notes:** The library should be easily configurable for service-specific context (e.g., serviceName) and integrate with NestJS's built-in logger or a popular logging framework like Winston.  
  - **Category:** Configuration  
**Recommendation:** Strictly enforce 'INFO' as the default logging level for all services in the production environment. DEBUG level should only be enabled dynamically or for very short, targeted troubleshooting sessions under controlled conditions.  
**Justification:** Balances the need for operational visibility with the cost and performance impact of excessive logging. Aligns with standard production practices.  
**Priority:** high  
**Implementation Notes:** Use environment variables or a centralized configuration service (e.g., AWS Systems Manager Parameter Store as per REQ-POA-009) to manage log levels per environment/service.  
  - **Category:** Observability  
**Recommendation:** Ensure 'correlationId' is generated at the edge (API Gateway or first microservice hit) for every incoming request and propagated consistently through all subsequent internal service calls and asynchronous messages (via SQS/SNS message attributes).  
**Justification:** Critical for effective distributed tracing and troubleshooting complex request flows across microservices, supporting REQ-POA-004.  
**Priority:** high  
**Implementation Notes:** Integrate with AWS X-Ray for automated trace ID propagation where possible. For custom propagation, use HTTP headers and message attributes.  
  - **Category:** Compliance & Security  
**Recommendation:** Establish and regularly review PII masking rules within the SharedLoggingLibrary. Focus on excluding sensitive data from logs by default, and only mask if exclusion is impossible and logging the (masked) field is absolutely necessary. Conduct periodic reviews of logs for accidental PII leakage.  
**Justification:** Adherence to REQ-MDGC-001 and REQ-MDGC-002 regarding data protection and PII handling. Minimizes risk of compliance breaches.  
**Priority:** high  
**Implementation Notes:** Define a clear list of PII fields. Use regex or tokenization for masking. Regularly audit logs and masking effectiveness.  
  - **Category:** Operations  
**Recommendation:** Configure CloudWatch Log Metric Filters and Alarms for key error conditions (e.g., high rate of ERROR logs per service, specific critical error codes, DLQ message counts) as per REQ-POA-003.  
**Justification:** Enables proactive detection of issues and timely response, improving system reliability and maintainability.  
**Priority:** high  
**Implementation Notes:** Start with a few critical alerts and iteratively add more based on operational experience. Avoid alert fatigue by ensuring alerts are actionable.  
  


---

