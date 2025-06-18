# Specification

# 1. Alerting And Incident Response Analysis

- **System Overview:**
  
  - **Analysis Date:** 2025-06-18
  - **Technology Stack:**
    
    - Node.js/NestJS
    - React/Next.js
    - TypeScript
    - Amazon API Gateway
    - Amazon EKS/ECS
    - AWS Lambda
    - Amazon SQS
    - Amazon SNS
    - Amazon RDS (PostgreSQL)
    - Amazon DynamoDB
    - Amazon ElastiCache (Redis)
    - Amazon CloudWatch (Logs, Metrics, Alarms)
    - AWS X-Ray
    - AWS WAF
    - AWS KMS
    - AWS Secrets Manager
    - AWS CI/CD (CodePipeline, CodeBuild, CodeDeploy)
    - AWS CDK
    
  - **Metrics Configuration:**
    
    - Amazon CloudWatch Metrics (standard AWS service metrics, custom application metrics from NestJS services)
    - AWS X-Ray traces for distributed tracing
    - Application Logs (structured JSON in CloudWatch Logs from NestJS services)
    - Google PageSpeed Insights (for landing pages)
    
  - **Monitoring Needs:**
    
    - High Availability of all platform services and integrations.
    - Performance monitoring for APIs, databases, asynchronous jobs, and frontend applications (especially landing pages).
    - Scalability monitoring for key services and data stores under load.
    - Security event monitoring and incident detection.
    - Data integrity and consistency across services and integrations.
    - Compliance with data protection and ad network policies.
    - Operational health of CI/CD pipelines, backup processes, and data retention jobs.
    
  - **Environment:** production
  
- **Alert Condition And Threshold Design:**
  
  - **Critical Metrics Alerts:**
    
    - **Metric:** API Gateway 5XX Error Rate (Overall)  
**Condition:** SUM(ServerErrors) / SUM(Requests) > 0.05 (5%)  
**Threshold Type:** static  
**Value:** EvaluationPeriod: 5 minutes, DatapointsToAlarm: 3  
**Justification:** REQ-POA-015. High server-side error rate indicates systemic issues impacting user experience.  
**Business Impact:** Service unavailability, degraded user experience, failed operations.  
    - **Metric:** API Gateway P99 Latency (Overall)  
**Condition:** Latency > 2000  
**Threshold Type:** static  
**Value:** Unit: Milliseconds, EvaluationPeriod: 5 minutes, DatapointsToAlarm: 3  
**Justification:** REQ-POA-015. Sustained high latency leads to poor user experience and potential timeouts.  
**Business Impact:** Degraded user experience, increased bounce rates, potential lost conversions.  
    - **Metric:** Amazon RDS CPUUtilization (Primary Instance)  
**Condition:** CPUUtilization > 85  
**Threshold Type:** static  
**Value:** Unit: Percent, EvaluationPeriod: 15 minutes, DatapointsToAlarm: 3  
**Justification:** REQ-POA-015, REQ-PC-008. Sustained high CPU can lead to database slowdown or unavailability.  
**Business Impact:** Slow platform performance, data operation failures, potential data inconsistencies.  
    - **Metric:** Amazon DynamoDB ThrottledRequests (Critical Tables: PerformanceMetric, ProductCatalogFeeds)  
**Condition:** SUM(ThrottledRequests) > 100  
**Threshold Type:** static  
**Value:** EvaluationPeriod: 5 minutes, DatapointsToAlarm: 2  
**Justification:** REQ-POA-015, REQ-ARP-007, REQ-PC-008. Throttling indicates insufficient provisioned capacity, leading to data loss or processing delays for analytics/feeds.  
**Business Impact:** Stale analytics, delayed ad updates, inconsistent product feeds.  
    - **Metric:** Amazon SQS ApproximateAgeOfOldestMessage (Critical Queues: CampaignEventsQueue, ProductSyncEventsQueue, AdPerformanceProcessingQueue)  
**Condition:** Age > 3600  
**Threshold Type:** static  
**Value:** Unit: Seconds, EvaluationPeriod: 10 minutes, DatapointsToAlarm: 1  
**Justification:** REQ-POA-015. Messages are not being processed, indicating consumer failure or significant backlog.  
**Business Impact:** Delayed campaign updates, stale product catalogs, outdated performance reports.  
    - **Metric:** Amazon SQS ApproximateNumberOfMessagesVisible (DLQ for Critical Queues)  
**Condition:** Messages > 0  
**Threshold Type:** static  
**Value:** EvaluationPeriod: 5 minutes, DatapointsToAlarm: 1  
**Justification:** Error Handling section in Data Transformation Analysis. Messages are permanently failing processing, requiring investigation.  
**Business Impact:** Lost updates, potential data inconsistencies, feature malfunction.  
    - **Metric:** EKS/ECS Service Unhealthy Task Count (Critical Services: CampaignManagementService, AdNetworkIntegrationService, CorePlatformIntegrationService, AnalyticsReportingService)  
**Condition:** UnhealthyTaskCount > 1  
**Threshold Type:** static  
**Value:** EvaluationPeriod: 5 minutes, DatapointsToAlarm: 2  
**Justification:** REQ-POA-015. Service instances are failing health checks, reducing capacity or causing partial/full outage of features.  
**Business Impact:** Feature unavailability, performance degradation, failed user operations.  
    - **Metric:** Ad Network API Error Rate (Custom Metric per AdNetworkIntegrationService, per network)  
**Condition:** ErrorRate > 0.10 (10%) OR CircuitBreakerTripped > 0  
**Threshold Type:** static  
**Value:** EvaluationPeriod: 15 minutes, DatapointsToAlarm: 2  
**Justification:** REQ-03-007, REQ-TCE-002. Indicates persistent problems communicating with a specific ad network.  
**Business Impact:** Inability to manage campaigns or fetch performance data for a specific ad network.  
    - **Metric:** Core Platform API Error Rate (Custom Metric from CorePlatformIntegrationService)  
**Condition:** ErrorRate > 0.05 (5%) OR CircuitBreakerTripped > 0  
**Threshold Type:** static  
**Value:** EvaluationPeriod: 15 minutes, DatapointsToAlarm: 2  
**Justification:** REQ-CPSI-006. Indicates persistent problems communicating with the core `[PlatformName]` platform.  
**Business Impact:** Failure to sync products, authenticate users, retrieve order data, impacting multiple Ad Manager features.  
    - **Metric:** Analytics Data Ingestion Latency (Custom Metric from AnalyticsReportingService)  
**Condition:** BatchProcessingTime > Y_MINUTES_THRESHOLD OR RealtimeStreamLatency > Z_SECONDS_THRESHOLD  
**Threshold Type:** static  
**Value:** EvaluationPeriod: 1 hour (for batch), 5 minutes (for stream). Thresholds TBD based on NFRs.  
**Justification:** REQ-ARP-005. Analytics data is not available in reports within defined SLOs.  
**Business Impact:** Merchants receive stale data, hindering timely campaign optimization decisions.  
    - **Metric:** Subscription Payment Failure Rate (Custom Metric from BillingMonetizationService)  
**Condition:** DailyPaymentFailureRate > 0.15 (15%)  
**Threshold Type:** static  
**Value:** EvaluationPeriod: 24 hours, DatapointsToAlarm: 1  
**Justification:** REQ-15-004 implies monitoring. High failure rate may indicate payment gateway issues or platform billing problems.  
**Business Impact:** Revenue loss, merchant churn, negative impact on platform reputation.  
    - **Metric:** CI/CD Pipeline Failure (AWS CodePipeline StateChange Event)  
**Condition:** PipelineExecutionStatus = 'Failed' AND PipelineName CONTAINS 'Production'  
**Threshold Type:** static  
**Value:** Event-based  
**Justification:** REQ-POA-005. Prevents new features/fixes from reaching production.  
**Business Impact:** Delayed feature releases, inability to deploy hotfixes, prolonged incident resolution.  
    - **Metric:** Backup Job Failure (AWS Backup Event or CloudWatch Log for custom scripts)  
**Condition:** BackupJobStatus = 'FAILED'  
**Threshold Type:** static  
**Value:** Event-based  
**Justification:** REQ-POA-007. Failure to backup critical data increases risk of data loss.  
**Business Impact:** Potential data loss in DR scenario, RPO violation, compliance issues.  
    - **Metric:** Data Retention/Purge Job Failure (CloudWatch Log for custom scripts)  
**Condition:** JobStatus = 'FAILED' AND JobType = 'DataRetention'  
**Threshold Type:** static  
**Value:** Event-based  
**Justification:** REQ-MDGC-005, REQ-POA-018. Failure to execute data retention policies.  
**Business Impact:** Compliance violations (GDPR, CCPA), unnecessary storage costs, data privacy risks.  
    - **Metric:** High Severity AWS WAF Blocked Requests (Metric from WAF)  
**Condition:** SUM(BlockedRequests) > 50 AND RuleGroup CONTAINS 'CriticalRules'  
**Threshold Type:** static  
**Value:** EvaluationPeriod: 5 minutes, DatapointsToAlarm: 1  
**Justification:** REQ-POA-017. Indicates a potential targeted attack (e.g., SQLi, XSS) against the platform.  
**Business Impact:** Security risk, potential service disruption if attack is successful, data breach.  
    
  - **Threshold Strategies:**
    
    - **Strategy:** static  
**Applicable Metrics:**
    
    - API Gateway 5XX Error Rate
    - API Gateway P99 Latency
    - RDS CPUUtilization
    - DynamoDB ThrottledRequests
    - SQS ApproximateAgeOfOldestMessage
    - SQS ApproximateNumberOfMessagesVisible (DLQ)
    - EKS/ECS Service Unhealthy Task Count
    - Ad Network API Error Rate
    - Core Platform API Error Rate
    - Analytics Data Ingestion Latency
    - Subscription Payment Failure Rate
    - Landing Page Google PageSpeed Score (deviation from target)
    - High Severity AWS WAF Blocked Requests
    
**Implementation:** Fixed values configured in CloudWatch Alarms based on NFRs, SLOs, and operational experience.  
**Advantages:**
    
    - Simple to configure and understand.
    - Predictable alerting behavior for well-understood metrics.
    
    - **Strategy:** static  
**Applicable Metrics:**
    
    - CI/CD Pipeline Failure
    - Backup Job Failure
    - Data Retention/Purge Job Failure
    
**Implementation:** Event-based alarming; any failure event triggers an alert.  
**Advantages:**
    
    - Immediate notification for critical operational failures.
    
    
  - **Baseline Deviation Alerts:**
    
    
  - **Predictive Alerts:**
    
    
  - **Compound Conditions:**
    
    - **Name:** CriticalQueueBacklogAndConsumerFailure  
**Conditions:**
    
    - SQS ApproximateAgeOfOldestMessage (Critical Queue) > 3600 seconds
    - EKS/ECS Service Unhealthy Task Count (Associated Consumer Service) > 0
    
**Logic:** AND  
**Time Window:** 5 minutes  
**Justification:** Identifies situations where a critical queue is backing up AND its primary consumer service is unhealthy, indicating a direct cause for the backlog.  
    
  
- **Severity Level Classification:**
  
  - **Severity Definitions:**
    
    - **Level:** Critical  
**Criteria:** System-wide outage, major data loss/corruption risk, active security breach, complete failure of core business process (e.g., campaign creation/sync for all, billing, core platform auth), critical compliance failure. SLOs severely impacted.  
**Business Impact:** Very High: Significant revenue loss, major customer impact, severe reputational damage, legal/regulatory penalties.  
**Customer Impact:** All/Majority of users unable to use critical features or entire platform.  
**Response Time:** Immediate (within 5-15 minutes)  
**Escalation Required:** True  
    - **Level:** High  
**Criteria:** Significant feature impairment affecting many users, failure of a critical component (e.g., one ad network integration, core product sync), high risk of imminent SLO violation, repeated critical path failures. Circuit breaker tripped for critical dependency.  
**Business Impact:** High: Measurable revenue loss, significant customer dissatisfaction, reputational damage.  
**Customer Impact:** Many users impacted, critical feature(s) partially or fully unavailable.  
**Response Time:** Urgent (within 30-60 minutes)  
**Escalation Required:** True  
    - **Level:** Medium  
**Criteria:** Performance degradation noticeably affecting user experience, non-critical feature failure, high rate of transient errors for a specific component, warning of resource exhaustion (e.g., high CPU/memory not yet critical but sustained), DLQ messages for non-critical queues.  
**Business Impact:** Medium: Minor revenue impact, moderate customer inconvenience, potential for escalation if unresolved.  
**Customer Impact:** Some users experience slow performance or non-critical feature issues.  
**Response Time:** Within business hours (2-4 hours)  
**Escalation Required:** True  
    - **Level:** Warning  
**Criteria:** Minor issues, isolated errors, informational alerts suggesting investigation for optimization, early warnings of potential problems not yet impacting users, CI/CD build failures (non-production blocking).  
**Business Impact:** Low: Minimal to no direct revenue impact, minor internal operational impact.  
**Customer Impact:** Minimal to no direct customer impact.  
**Response Time:** Within 1-2 business days  
**Escalation Required:** False  
    
  - **Business Impact Matrix:**
    
    
  - **Customer Impact Criteria:**
    
    
  - **Sla Violation Severity:**
    
    
  - **System Health Severity:**
    
    
  
- **Notification Channel Strategy:**
  
  - **Channel Configuration:**
    
    - **Channel:** pagerduty  
**Purpose:** Primary on-call alerting for Critical and High severity incidents.  
**Applicable Severities:**
    
    - Critical
    - High
    
**Time Constraints:** 24/7  
**Configuration:**
    
    - **Integration Key:** env_specific_pagerduty_key
    - **Service Name:** AdManagerPlatform_Production
    
    - **Channel:** email  
**Purpose:** General alerting, reports, and non-urgent notifications.  
**Applicable Severities:**
    
    - Critical
    - High
    - Medium
    - Warning
    
**Time Constraints:** 24/7  
**Configuration:**
    
    - **Recipient Lists:**
      
      - **Critical:** ops-critical@example.com, eng-leads@example.com
      - **High:** ops-team@example.com, eng-team@example.com
      - **Medium:** dev-team-alerts@example.com
      - **Warning:** dev-digest@example.com
      
    - **Sender:** alerts-admanager@example.com
    
    - **Channel:** slack  
**Purpose:** Real-time team communication and awareness for High and Medium severity alerts.  
**Applicable Severities:**
    
    - High
    - Medium
    
**Time Constraints:** Business Hours preference for Medium, 24/7 for High  
**Configuration:**
    
    - **Webhook Url:** env_specific_slack_webhook
    - **Channels:**
      
      - **High:** #admanager-ops-high
      - **Medium:** #admanager-alerts-medium
      
    
    - **Channel:** sms  
**Purpose:** Secondary notification for PagerDuty escalation for Critical incidents if primary contact fails.  
**Applicable Severities:**
    
    - Critical
    
**Time Constraints:** 24/7  
**Configuration:**
    
    - **Target Phone Numbers:** Configured in PagerDuty escalation policy
    
    
  - **Routing Rules:**
    
    - **Condition:** Alert Severity = Critical  
**Severity:** Critical  
**Alert Type:** Any  
**Channels:**
    
    - pagerduty
    - email
    - sms
    
**Priority:** 1  
    - **Condition:** Alert Severity = High  
**Severity:** High  
**Alert Type:** Any  
**Channels:**
    
    - pagerduty
    - email
    - slack
    
**Priority:** 2  
    - **Condition:** Alert Severity = Medium  
**Severity:** Medium  
**Alert Type:** Any  
**Channels:**
    
    - email
    - slack
    
**Priority:** 3  
    - **Condition:** Alert Severity = Warning AND AlertSource = CI/CD  
**Severity:** Warning  
**Alert Type:** BuildFailure  
**Channels:**
    
    - slack
    
**Priority:** 4  
    - **Condition:** Alert Severity = Warning  
**Severity:** Warning  
**Alert Type:** Any  
**Channels:**
    
    - email
    
**Priority:** 5  
    
  - **Time Based Routing:**
    
    
  - **Ticketing Integration:**
    
    - **System:** jira  
**Trigger Conditions:**
    
    - Alert Severity = Critical AND PagerDutyIncidentCreated
    
**Ticket Priority:** Highest  
**Auto Assignment:** True  
    
  - **Emergency Notifications:**
    
    
  - **Chat Platform Integration:**
    
    - **Platform:** slack  
**Channels:**
    
    - #admanager-ops-high
    - #admanager-alerts-medium
    - #admanager-cicd-prod
    
**Bot Integration:** True  
**Thread Management:** Create new thread for each distinct alert event, update existing thread for correlated alerts.  
    
  
- **Alert Correlation Implementation:**
  
  - **Grouping Requirements:**
    
    - **Grouping Criteria:** SameAlertName AND SameResourceIdentifier (e.g., ServiceName, RDSInstanceID)  
**Time Window:** 5 minutes  
**Max Group Size:** 10  
**Suppression Strategy:** Group and notify once with count, then update with new occurrences.  
    
  - **Parent Child Relationships:**
    
    
  - **Topology Based Correlation:**
    
    
  - **Time Window Correlation:**
    
    
  - **Causal Relationship Detection:**
    
    
  - **Maintenance Window Suppression:**
    
    - **Maintenance Type:** ScheduledPlatformMaintenance  
**Suppression Scope:**
    
    - AllPlatformAlerts
    - SpecificServiceAlerts
    
**Automatic Detection:** False  
**Manual Override:** True  
    
  
- **False Positive Mitigation:**
  
  - **Noise Reduction Strategies:**
    
    - **Strategy:** Alert Deduplication  
**Implementation:** Using unique alert fingerprints based on alert name, resource, and key parameters. Implemented in CloudWatch Alarms or notification aggregation layer.  
**Applicable Alerts:**
    
    - All
    
**Effectiveness:** High  
    - **Strategy:** Confirmation Counts / Datapoints to Alarm  
**Implementation:** CloudWatch Alarms configuration: require multiple breaching datapoints before triggering.  
**Applicable Alerts:**
    
    - Most threshold-based alerts
    
**Effectiveness:** Medium  
    
  - **Confirmation Counts:**
    
    - **Alert Type:** CPUUtilizationHigh  
**Confirmation Threshold:** 3  
**Confirmation Window:** 15 minutes (3x 5-min periods)  
**Reset Condition:** Metric below threshold for 1 period  
    - **Alert Type:** APIGateway5XXHigh  
**Confirmation Threshold:** 3  
**Confirmation Window:** 5 minutes (3x 1-min periods, assuming 1-min metric)  
**Reset Condition:** Metric below threshold for 1 period  
    
  - **Dampening And Flapping:**
    
    - **Metric:** EKS/ECS Service Unhealthy Task Count  
**Dampening Period:** 10 minutes  
**Flapping Threshold:** 3  
**Suppression Duration:** 30 minutes  
    
  - **Alert Validation:**
    
    
  - **Smart Filtering:**
    
    
  - **Quorum Based Alerting:**
    
    
  
- **On Call Management Integration:**
  
  - **Escalation Paths:**
    
    - **Severity:** Critical  
**Escalation Levels:**
    
    - **Level:** 1  
**Recipients:**
    
    - PrimaryOnCallEngineer_AdManager
    
**Escalation Time:** 0 minutes  
**Requires Acknowledgment:** True  
    - **Level:** 2  
**Recipients:**
    
    - SecondaryOnCallEngineer_AdManager
    - EngineeringLead_AdManager
    
**Escalation Time:** 15 minutes  
**Requires Acknowledgment:** True  
    - **Level:** 3  
**Recipients:**
    
    - EngineeringManager_AdManager
    
**Escalation Time:** 30 minutes  
**Requires Acknowledgment:** False  
    
**Ultimate Escalation:** HeadOfEngineering  
    - **Severity:** High  
**Escalation Levels:**
    
    - **Level:** 1  
**Recipients:**
    
    - PrimaryOnCallEngineer_AdManager
    
**Escalation Time:** 0 minutes  
**Requires Acknowledgment:** True  
    - **Level:** 2  
**Recipients:**
    
    - EngineeringLead_AdManager
    
**Escalation Time:** 30 minutes  
**Requires Acknowledgment:** True  
    
**Ultimate Escalation:** EngineeringManager_AdManager  
    
  - **Escalation Timeframes:**
    
    - **Severity:** Critical  
**Initial Response:** 15 minutes (acknowledge)  
**Escalation Interval:** 15 minutes  
**Max Escalations:** 3  
    - **Severity:** High  
**Initial Response:** 30 minutes (acknowledge)  
**Escalation Interval:** 30 minutes  
**Max Escalations:** 2  
    
  - **On Call Rotation:**
    
    - **Team:** AdManagerPlatform_Ops  
**Rotation Type:** weekly  
**Handoff Time:** Monday 09:00 UTC  
**Backup Escalation:** SecondaryOnCallEngineer_AdManager  
    
  - **Acknowledgment Requirements:**
    
    - **Severity:** Critical  
**Acknowledgment Timeout:** 15 minutes  
**Auto Escalation:** True  
**Requires Comment:** False  
    - **Severity:** High  
**Acknowledgment Timeout:** 30 minutes  
**Auto Escalation:** True  
**Requires Comment:** False  
    
  - **Incident Ownership:**
    
    - **Assignment Criteria:** Assigned by PagerDuty to current on-call engineer.  
**Ownership Transfer:** Formal handoff procedure in PagerDuty/Slack.  
**Tracking Mechanism:** PagerDuty incident tracking, JIRA ticket for post-mortem.  
    
  - **Follow The Sun Support:**
    
    
  
- **Project Specific Alerts Config:**
  
  - **Alerts:**
    
    - **Name:** APIGateway_5XXErrorRate_Critical  
**Description:** API Gateway 5XX error rate exceeds 5% for 3 consecutive 5-minute periods.  
**Condition:** Metric: AWS/ApiGateway, ServerError (5XX), Statistic: Average, Threshold: > 0.05, Period: 300s, EvaluationPeriods: 3, ComparisonOperator: GreaterThanThreshold  
**Threshold:** 5%  
**Severity:** Critical  
**Channels:**
    
    - pagerduty
    - email
    - sms
    
**Correlation:**
    
    - **Group Id:** APIGateway_Failures
    - **Suppression Rules:**
      
      - If EKS_AllServices_Unhealthy is active, correlate.
      
    
**Escalation:**
    
    - **Enabled:** True
    - **Escalation Time:** 15 minutes
    - **Escalation Path:**
      
      - PrimaryOnCall
      - SecondaryOnCall
      - EngLead
      
    
**Suppression:**
    
    - **Maintenance Window:** True
    - **Dependency Failure:** False
    - **Manual Override:** True
    
**Validation:**
    
    - **Confirmation Count:** 3
    - **Confirmation Window:** 5 minutes
    
**Remediation:**
    
    - **Automated Actions:**
      
      
    - **Runbook Url:** https://internal.wiki/admanager/runbooks/api-gateway-5xx
    - **Troubleshooting Steps:**
      
      - Check CloudWatch Logs for API Gateway and backend services (EKS/ECS, Lambda).
      - Inspect EKS/ECS service health and resource utilization.
      - Review recent deployments for potential bad code.
      
    
    - **Name:** RDS_CPU_High_Critical  
**Description:** Primary RDS instance CPU utilization exceeds 85% for 15 minutes.  
**Condition:** Metric: AWS/RDS, CPUUtilization, Dimension: DBInstanceIdentifier=primary-admanager-db, Statistic: Average, Threshold: > 85, Period: 300s, EvaluationPeriods: 3, ComparisonOperator: GreaterThanThreshold  
**Threshold:** 85%  
**Severity:** Critical  
**Channels:**
    
    - pagerduty
    - email
    
**Correlation:**
    
    - **Group Id:** Database_Performance
    - **Suppression Rules:**
      
      
    
**Escalation:**
    
    - **Enabled:** True
    - **Escalation Time:** 15 minutes
    - **Escalation Path:**
      
      - PrimaryOnCall_DBA
      - PrimaryOnCall_Ops
      
    
**Suppression:**
    
    - **Maintenance Window:** True
    - **Dependency Failure:** False
    - **Manual Override:** True
    
**Validation:**
    
    - **Confirmation Count:** 3
    - **Confirmation Window:** 15 minutes
    
**Remediation:**
    
    - **Automated Actions:**
      
      
    - **Runbook Url:** https://internal.wiki/admanager/runbooks/rds-cpu-high
    - **Troubleshooting Steps:**
      
      - Check RDS Performance Insights for long-running queries or bottlenecks.
      - Analyze application logs for increased database load.
      - Consider scaling RDS instance if load is legitimate and sustained.
      
    
    - **Name:** CriticalQueue_DLQ_Messages_High  
**Description:** Messages present in the DLQ for a critical SQS queue (e.g., CampaignEventsDLQ).  
**Condition:** Metric: AWS/SQS, ApproximateNumberOfMessagesVisible, Dimension: QueueName=CampaignEventsDLQ, Statistic: Maximum, Threshold: > 0, Period: 300s, EvaluationPeriods: 1, ComparisonOperator: GreaterThanThreshold  
**Threshold:** >0 messages  
**Severity:** High  
**Channels:**
    
    - email
    - slack
    
**Correlation:**
    
    - **Group Id:** Queue_Processing_Failures
    - **Suppression Rules:**
      
      
    
**Escalation:**
    
    - **Enabled:** True
    - **Escalation Time:** 30 minutes
    - **Escalation Path:**
      
      - PrimaryOnCall_DevTeam_Campaigns
      - EngLead_Campaigns
      
    
**Suppression:**
    
    - **Maintenance Window:** True
    - **Dependency Failure:** False
    - **Manual Override:** True
    
**Validation:**
    
    - **Confirmation Count:** 1
    - **Confirmation Window:** 5 minutes
    
**Remediation:**
    
    - **Automated Actions:**
      
      
    - **Runbook Url:** https://internal.wiki/admanager/runbooks/dlq-investigation
    - **Troubleshooting Steps:**
      
      - Examine messages in the DLQ for error patterns.
      - Check consumer service logs (e.g., AdNetworkIntegrationService) for processing errors.
      - Identify root cause (e.g., bad data, bug in consumer, downstream service failure).
      
    
    - **Name:** AdNetworkIntegration_CircuitBreaker_Open_High  
**Description:** Circuit breaker for a specific Ad Network API integration has tripped.  
**Condition:** CustomMetric: AdManager/AdNetworkIntegrationService, CircuitBreakerTripped, Dimension: AdNetworkName=[SpecificNetwork], Statistic: Sum, Threshold: > 0, Period: 60s, EvaluationPeriods: 1, ComparisonOperator: GreaterThanThreshold  
**Threshold:** >0 events  
**Severity:** High  
**Channels:**
    
    - email
    - slack
    
**Correlation:**
    
    - **Group Id:** AdNetwork_Connectivity
    - **Suppression Rules:**
      
      
    
**Escalation:**
    
    - **Enabled:** True
    - **Escalation Time:** 30 minutes
    - **Escalation Path:**
      
      - PrimaryOnCall_DevTeam_Integrations
      - EngLead_Integrations
      
    
**Suppression:**
    
    - **Maintenance Window:** True
    - **Dependency Failure:** False
    - **Manual Override:** True
    
**Validation:**
    
    - **Confirmation Count:** 1
    - **Confirmation Window:** 1 minute
    
**Remediation:**
    
    - **Automated Actions:**
      
      
    - **Runbook Url:** https://internal.wiki/admanager/runbooks/adnetwork-cb-open
    - **Troubleshooting Steps:**
      
      - Check Ad Network status page for outages.
      - Verify API credentials and quotas for the affected network.
      - Review AdNetworkIntegrationService logs for specific error messages from the network.
      
    
    - **Name:** Production_CICD_PipelineFailure_High  
**Description:** CI/CD pipeline deployment to production environment has failed.  
**Condition:** EventPattern: AWS CodePipeline, StateChange, Detail.state=FAILED, Detail.pipelineName CONTAINS 'Production'  
**Threshold:** Event-based  
**Severity:** High  
**Channels:**
    
    - slack
    - email
    
**Correlation:**
    
    - **Group Id:** Deployment_Failures
    - **Suppression Rules:**
      
      
    
**Escalation:**
    
    - **Enabled:** False
    - **Escalation Time:** 
    - **Escalation Path:**
      
      
    
**Suppression:**
    
    - **Maintenance Window:** False
    - **Dependency Failure:** False
    - **Manual Override:** False
    
**Validation:**
    
    - **Confirmation Count:** 1
    - **Confirmation Window:** N/A
    
**Remediation:**
    
    - **Automated Actions:**
      
      - Attempt automated rollback if configured.
      
    - **Runbook Url:** https://internal.wiki/admanager/runbooks/cicd-failure
    - **Troubleshooting Steps:**
      
      - Review CodePipeline, CodeBuild, and CodeDeploy logs for failure reason.
      - Identify problematic commit or configuration change.
      - Manually trigger rollback if automated rollback failed or not configured.
      
    
    
  - **Alert Groups:**
    
    - **Group Id:** APIGateway_Failures  
**Name:** API Gateway Performance and Availability Issues  
**Alerts:**
    
    - APIGateway_5XXErrorRate_Critical
    - APIGateway_P99Latency_High
    
**Suppression Strategy:** If multiple alerts trigger, consolidate notifications.  
**Escalation Override:**   
    - **Group Id:** Database_Performance  
**Name:** Database Performance Issues  
**Alerts:**
    
    - RDS_CPU_High_Critical
    - DynamoDB_Throttling_High
    
**Suppression Strategy:** Group by database type.  
**Escalation Override:**   
    
  - **Notification Templates:**
    
    - **Template Id:** DefaultCriticalAlertEmail  
**Channel:** email  
**Format:** HTML  
**Variables:**
    
    - AlertName
    - Severity
    - Timestamp
    - Description
    - MetricDetails
    - Threshold
    - AffectedResource
    - RunbookLink
    
    - **Template Id:** DefaultPagerDutyPayload  
**Channel:** pagerduty  
**Format:** JSON  
**Variables:**
    
    - AlertName
    - Severity
    - Description
    - AffectedResource
    - CloudWatchAlarmLink
    - CustomDetailsJSON
    
    
  
- **Implementation Priority:**
  
  - **Component:** Core CloudWatch Metric Alarms (API GW, RDS, SQS, EKS/ECS Health)  
**Priority:** high  
**Dependencies:**
    
    - CloudWatch Setup
    - Basic Service Deployment
    
**Estimated Effort:** Medium  
**Risk Level:** low  
  - **Component:** DLQ Alerting & Critical Queue Monitoring  
**Priority:** high  
**Dependencies:**
    
    - SQS Queue Setup
    
**Estimated Effort:** Low  
**Risk Level:** low  
  - **Component:** PagerDuty Integration for Critical/High Alerts  
**Priority:** high  
**Dependencies:**
    
    - CloudWatch Alarms Setup
    - PagerDuty Account
    
**Estimated Effort:** Low  
**Risk Level:** low  
  - **Component:** Custom Application Metric Alerting (Ad Network Errors, Core Platform Errors, Analytics Latency)  
**Priority:** medium  
**Dependencies:**
    
    - Application Instrumentation for Custom Metrics
    
**Estimated Effort:** High  
**Risk Level:** medium  
  - **Component:** CI/CD and Backup Failure Alerting  
**Priority:** medium  
**Dependencies:**
    
    - CI/CD Pipeline Setup
    - Backup Solution Setup
    
**Estimated Effort:** Medium  
**Risk Level:** low  
  - **Component:** Maintenance Window Suppression Logic  
**Priority:** medium  
**Dependencies:**
    
    - Alerting System
    - Admin Interface for Maintenance Windows (REQ-POA-011)
    
**Estimated Effort:** Medium  
**Risk Level:** medium  
  
- **Risk Assessment:**
  
  - **Risk:** Alert Fatigue due to too many non-actionable or low-priority alerts.  
**Impact:** high  
**Probability:** medium  
**Mitigation:** Strictly define essential alerts. Implement effective severity classification and notification routing. Regularly review and tune alerts. Implement robust false positive mitigation.  
**Contingency Plan:** Temporary suppression of noisy alerts, rapid tuning exercise.  
  - **Risk:** Misconfigured alert thresholds leading to missed incidents or excessive false positives.  
**Impact:** high  
**Probability:** medium  
**Mitigation:** Start with conservative thresholds, monitor, and adjust based on operational data. Use 'DatapointsToAlarm' to avoid alerts on transient spikes. Test alerts in staging.  
**Contingency Plan:** Rapid threshold adjustment. Manual monitoring during tuning period.  
  - **Risk:** Failure of notification channels (e.g., PagerDuty, Email service).  
**Impact:** high  
**Probability:** low  
**Mitigation:** Use redundant notification channels for critical alerts (e.g., PagerDuty + SMS as backup). Monitor health of notification services themselves.  
**Contingency Plan:** Manual escalation procedures. Fallback to direct team communication.  
  - **Risk:** Lack of clear runbooks or remediation steps for alerts.  
**Impact:** medium  
**Probability:** medium  
**Mitigation:** Ensure every critical/high alert has an associated runbook with clear troubleshooting and remediation steps. Keep runbooks updated.  
**Contingency Plan:** SME investigation required, longer MTTR.  
  - **Risk:** Alerts not suppressed during planned maintenance windows.  
**Impact:** medium  
**Probability:** low  
**Mitigation:** Robust implementation and testing of maintenance window suppression logic (REQ-POA-011). Clear process for scheduling maintenance in the system.  
**Contingency Plan:** Manual suppression of alerts by on-call engineer.  
  
- **Recommendations:**
  
  - **Category:** Threshold Management  
**Recommendation:** Implement a phased approach for alert threshold tuning: Start with conservative (potentially wider) thresholds for new alerts, monitor their behavior in production, and then progressively tighten them based on observed metric patterns and business impact. Consider using CloudWatch Anomaly Detection for metrics with high variability once sufficient baseline data is collected.  
**Justification:** Minimizes initial alert noise and allows for data-driven threshold refinement, reducing false positives and alert fatigue over time.  
**Priority:** high  
**Implementation Notes:** Schedule regular (e.g., monthly or quarterly) reviews of alert performance and threshold accuracy.  
  - **Category:** Runbook & Remediation Automation  
**Recommendation:** For frequently occurring, well-understood alerts with predictable remediation steps, incrementally introduce automated remediation actions where safe and feasible (e.g., restarting a service task, clearing a cache). Link all alerts, especially Critical and High, to detailed, up-to-date runbooks.  
**Justification:** Reduces Mean Time To Resolution (MTTR) for common issues and frees up on-call engineers for more complex problems. Ensures consistent response to incidents.  
**Priority:** medium  
**Implementation Notes:** Use AWS Systems Manager Automation documents or Lambda functions for automated actions. Runbooks should be version-controlled and easily accessible from alert notifications.  
  - **Category:** Alert Review & Optimization Process  
**Recommendation:** Establish a regular (e.g., bi-weekly or monthly) cross-functional alert review meeting involving Ops, Engineering, and relevant stakeholders. Analyze triggered alerts, false positives, MTTA/MTTR, and incident post-mortems to continuously refine alert conditions, severities, and notification strategies.  
**Justification:** Ensures the alerting system remains effective, relevant, and aligned with evolving system behavior and business priorities. Helps combat alert fatigue.  
**Priority:** high  
**Implementation Notes:** Track key alerting KPIs (e.g., number of alerts per severity, false positive rate, incident resolution times) to guide optimization efforts.  
  - **Category:** Business Metric Alerting  
**Recommendation:** Expand alerting to cover key business metrics beyond just technical health, such as a sudden drop in campaign creation rates, significant deviation in ROAS for high-spend campaigns, or failure in core monetization processes (e.g., subscription processing REQ-15-001).  
**Justification:** Provides early warnings of issues that directly impact business outcomes, even if underlying technical metrics appear normal.  
**Priority:** medium  
**Implementation Notes:** Requires defining custom metrics in CloudWatch based on business logic in services like CampaignManagementService, AnalyticsReportingService, BillingMonetizationService.  
  - **Category:** Security Alerting Enhancement  
**Recommendation:** Integrate more sophisticated security monitoring tools if not already fully covered by WAF alerts (e.g., AWS GuardDuty for threat detection, AWS Security Hub for centralized security posture management) and configure alerts for high-severity findings from these services.  
**Justification:** Enhances the platform's ability to detect and respond to a broader range of security threats beyond basic web attacks (REQ-POA-017 implies broader security ops).  
**Priority:** medium  
**Implementation Notes:** Route security alerts to a dedicated security operations channel/team if available, or to general Ops with clear escalation to security SMEs.  
  


---

