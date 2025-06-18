# Specification

# 1. Monitoring Components

## 1.1. Centralized Logging & Auditing
Centralized collection, storage, and analysis of logs from all application services, infrastructure components, and security events. Provides immutable audit trails for compliance and operational insight, as per REQ-POA-002, REQ-IAM-009, REQ-MDGC-008, REQ-POA-012.

### 1.1.3. Type
LogAggregation

### 1.1.5. Provider
Amazon CloudWatch Logs

### 1.1.6. Features

- Structured JSON logging (REQ-POA-002)
- Log stream and log group organization
- Log querying and analysis (CloudWatch Logs Insights - REQ-POA-002)
- Configurable log retention and S3 archival (REQ-POA-002, REQ-ARP-006, REQ-POA-018)
- Immutable audit trail storage for security and administrative actions (REQ-IAM-009, REQ-MDGC-008, REQ-POA-012)
- Integration with AWS IAM for access control to logs

### 1.1.7. Configuration

- **Default Log Retention Days:** 90 (active), then S3 archival as per policy (REQ-POA-002)
- **Structured Log Format:** JSON
- **Audit Log Categories:**
  
  - UserAccess
  - AdminActions
  - SecurityEvents
  - DataModifications
  - DSR_Actions
  - ConsentChanges
  
- **Access Control:** Via AWS IAM roles for Platform Administrators (REQ-POA-002)

## 1.2. Application Performance & Infrastructure Metrics
Comprehensive monitoring of application performance, business metrics, and operational metrics for all AWS resources and custom application components, as per REQ-POA-002 and REQ-POA-015.

### 1.2.3. Type
ApplicationPerformanceMonitoring, InfrastructureMonitoring

### 1.2.5. Provider
Amazon CloudWatch Metrics

### 1.2.6. Features

- Standard AWS service metrics (API Gateway, EKS/ECS, Lambda, RDS, DynamoDB, SQS, SNS, ElastiCache)
- Custom application metrics from NestJS services (e.g., request latency, error rates, queue processing times - REQ-POA-002, REQ-ARP-005)
- Container and orchestration metrics (EKS/ECS CPU, memory, disk, network, pod/task counts)
- Database performance metrics (RDS CPU, memory, connections, IOPS, query latency; DynamoDB RCU/WCU, latency, errors - REQ-POA-015)
- API Gateway metrics (request count, latency, 4xx/5xx errors)
- SQS/SNS queue metrics (queue depth, message age, publish/delivery rates - REQ-POA-015)
- Dashboarding capabilities for visualizing metrics (REQ-POA-002, REQ-POA-015)
- Metric aggregation and filtering

### 1.2.7. Configuration

- **Default Metric Namespace:** AdManagerPlatform
- **High Resolution Metrics:** Enabled for critical performance indicators (e.g., API latency, analytics ingestion)
- **Key Dashboards:**
  
  - SystemHealth (REQ-POA-015)
  - APIPerformance
  - DatabasePerformance
  - QueuePerformance
  - AnalyticsPipelineHealth (REQ-ARP-005)
  

## 1.3. Distributed Tracing
End-to-end tracing of requests across microservices and AWS Lambda functions to identify performance bottlenecks and debug issues, as per REQ-POA-004.

### 1.3.3. Type
DistributedTracing

### 1.3.5. Provider
AWS X-Ray

### 1.3.6. Features

- Trace collection from NestJS services and Lambda functions (REQ-POA-004)
- Service map generation for visualizing dependencies
- Latency analysis per segment/service
- Error and fault analysis within traces
- Annotation and metadata support for custom trace data
- Integration with CloudWatch Logs for correlated log viewing

### 1.3.7. Configuration

- **Sampling Rules:** Configured to balance trace volume and visibility, potentially dynamic based on traffic.
- **Instrumentation:** AWS X-Ray SDK for Node.js integrated into NestJS services and Lambda functions.

## 1.4. Alerting System
Configuration of alarms for critical operational thresholds and anomalies, with integrated notifications, as per REQ-POA-003.

### 1.4.3. Type
Alerting

### 1.4.5. Provider
Amazon CloudWatch Alarms, Amazon SNS, Amazon SES

### 1.4.6. Features

- Metric-based alarms on CloudWatch Metrics (REQ-POA-003)
- Composite alarms for complex conditions
- Anomaly detection capabilities (if configured by Platform Admins)
- Integration with SNS for alert notifications (email via SES, SMS, PagerDuty/OpsGenie hooks - REQ-POA-003, REQ-POA-016)
- Configurable alarm severity levels (P1-P4) and escalation procedures (REQ-POA-003)
- Alert history and auditability of alarm configuration changes

### 1.4.7. Configuration

- **Critical Alarm Targets:**
  
  - High API error rates
  - High API latency
  - Low database connections
  - High SQS queue depth/age
  - Analytics ingestion pipeline failures (REQ-ARP-005)
  - Circuit breaker open events (REQ-03-007)
  - Security alerts from AWS WAF/GuardDuty
  
- **Notification Channels:** Email (SES), SMS (SNS), PagerDuty/OpsGenie (SNS Webhook) based on severity (REQ-POA-016).

## 1.5. Service Health Probes & Monitoring
Monitoring the health and availability of individual microservices using liveness and readiness probes, integrated with orchestration and higher-level monitoring. Supports REQ-POA-015 (System Health Dashboard).

### 1.5.3. Type
ServiceHealthMonitoring

### 1.5.5. Provider
EKS/ECS Health Checks, Amazon CloudWatch Synthetics (for API Gateway)

### 1.5.6. Features

- Liveness and readiness probes for NestJS microservices in EKS/ECS (e.g., /live, /ready endpoints)
- Automated service restarts by EKS/ECS based on probe failures
- API endpoint health monitoring via CloudWatch Synthetics canaries for public APIs (API Gateway)
- Aggregation of health status for display on System Health Dashboard (REQ-POA-015)

### 1.5.7. Configuration

- **Probe Intervals:** Configured per service based on criticality and recovery time objectives.
- **Synthetic Canary Frequency:** e.g., Every 5 minutes for critical API Gateway endpoints.

## 1.6. Frontend Landing Page Performance Monitoring
Monitoring performance of public-facing interactive landing pages to meet Google PageSpeed Insights targets, as per REQ-6-009.

### 1.6.3. Type
UserExperienceMonitoring

### 1.6.5. Provider
Google PageSpeed Insights (via API or manual checks integrated into CI/CD)

### 1.6.6. Features

- Tracking of PageSpeed Insights scores (Mobile & Desktop)
- Monitoring Core Web Vitals (LCP, FID, CLS)
- Identification of performance bottlenecks and optimization opportunities for landing pages

### 1.6.7. Configuration

- **Target Score:** 80 for Mobile and Desktop (REQ-6-009)
- **Monitoring Frequency:** Periodically, especially after deployments affecting landing pages.

## 1.7. Analytics Data Pipeline Monitoring
Monitoring the health, performance, and data quality of the analytics data ingestion and processing pipeline. This ensures timely and accurate data for merchant-facing reports, as per REQ-ARP-005 and REQ-POA-021.

### 1.7.3. Type
BusinessProcessMonitoring

### 1.7.5. Provider
Amazon CloudWatch Metrics & Alarms, Custom Application Metrics

### 1.7.6. Features

- Monitoring ad impression processing throughput (N impressions/second target from REQ-ARP-005)
- Tracking end-to-end data ingestion latency (batch Y seconds/minutes, real-time Z ms targets from REQ-ARP-005)
- Error rate monitoring for data ingestion and transformation jobs
- Data validation checks within the pipeline (e.g., completeness, schema adherence)
- Queue length and processing time for data processing stages (e.g., SQS queues feeding analytics processing)
- Alerts for pipeline failures or significant data quality issues (REQ-POA-021)

### 1.7.7. Configuration

- **Latency Thresholds:** Defined as per REQ-ARP-005 (Y and Z values).
- **Data Quality Metrics:** Completeness, accuracy, timeliness for critical data elements (REQ-POA-021).
- **Alerting:** Configured for pipeline failures, high error rates, or critical data quality deviations.



---

