# Specification

# 1. Telemetry And Metrics Analysis

- **System Overview:**
  
  - **Analysis Date:** 2025-06-18
  - **Technology Stack:**
    
    - Node.js (NestJS Framework)
    - TypeScript
    - Amazon EKS/ECS
    - AWS Lambda
    - Amazon RDS (PostgreSQL)
    - Amazon DynamoDB
    - Amazon API Gateway
    - Amazon SQS
    - Amazon SNS
    - Amazon ElastiCache (Redis)
    - React
    - Next.js (for SSR/SSG)
    
  - **Monitoring Components:**
    
    - Amazon CloudWatch (Logs, Metrics, Alarms)
    - AWS X-Ray
    - EKS/ECS Health Checks
    - Google PageSpeed Insights (external, for REQ-6-009)
    
  - **Requirements:**
    
    - REQ-POA-002 (Comprehensive Monitoring)
    - REQ-POA-015 (System Health Dashboard)
    - REQ-ARP-005 (Analytics Ingestion NFRs: N impressions/sec, Y batch latency, Z real-time latency)
    - REQ-CMO-007, REQ-ARP-001 (Core Advertising Performance Metrics: ROAS, CPA, etc.)
    - REQ-03-007, REQ-TCE-002 (Error Handling & Resilience for Integrations)
    - REQ-PC-010 (Product Catalog Scalability: Y million listings)
    - REQ-PROMO-002 (Promotion DB Performance)
    - REQ-6-009 (Landing Page Performance: PageSpeed Score >= 80)
    - REQ-IAM-009, REQ-MDGC-008, REQ-POA-012 (Audit Trails & Logging)
    
  - **Environment:** production
  
- **Standard System Metrics Selection:**
  
  - **Hardware Utilization Metrics:**
    
    - **Name:** aws.compute.cpu_utilization  
**Type:** gauge  
**Unit:** Percent  
**Description:** CPU utilization for compute resources (EKS/ECS Nodes, RDS, ElastiCache, Lambda).  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchAgentOrServiceIntegration
    
**Thresholds:**
    
    - **Warning:** >70%
    - **Critical:** >85%
    
**Justification:** Essential for capacity planning and detecting performance bottlenecks. (REQ-POA-015)  
    - **Name:** aws.compute.memory_utilization  
**Type:** gauge  
**Unit:** Percent  
**Description:** Memory utilization for compute resources.  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchAgentOrServiceIntegration
    
**Thresholds:**
    
    - **Warning:** >75%
    - **Critical:** >90%
    
**Justification:** Essential for capacity planning and preventing out-of-memory errors. (REQ-POA-015)  
    - **Name:** aws.rds.database_connections  
**Type:** gauge  
**Unit:** Count  
**Description:** Number of active connections to RDS PostgreSQL.  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Thresholds:**
    
    - **Warning:** >80% of max_connections
    - **Critical:** >95% of max_connections
    
**Justification:** Monitors database load and potential connection exhaustion. (REQ-PROMO-002, REQ-POA-015)  
    - **Name:** aws.dynamodb.consumed_read_capacity_units  
**Type:** counter  
**Unit:** Units  
**Description:** Consumed Read Capacity Units for DynamoDB tables.  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Thresholds:**
    
    - **Warning:** Approaching provisioned limit if not on-demand
    - **Critical:** Throttling events occur
    
**Justification:** Monitors DynamoDB usage against provisioned capacity or on-demand limits. (REQ-ARP-007, REQ-PC-008)  
    - **Name:** aws.dynamodb.consumed_write_capacity_units  
**Type:** counter  
**Unit:** Units  
**Description:** Consumed Write Capacity Units for DynamoDB tables.  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Thresholds:**
    
    - **Warning:** Approaching provisioned limit if not on-demand
    - **Critical:** Throttling events occur
    
**Justification:** Monitors DynamoDB usage against provisioned capacity or on-demand limits. (REQ-ARP-007, REQ-PC-008)  
    - **Name:** aws.elasticache.redis.cache_hit_rate  
**Type:** gauge  
**Unit:** Percent  
**Description:** Cache hit rate for ElastiCache Redis.  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Thresholds:**
    
    - **Warning:** <80%
    - **Critical:** <60%
    
**Justification:** Indicates cache effectiveness and potential performance impact on backend services.  
    
  - **Runtime Metrics:**
    
    - **Name:** app.nodejs.event_loop_lag_seconds  
**Type:** gauge  
**Unit:** Seconds  
**Description:** Node.js event loop lag, indicating event loop blocking.  
**Technology:** Node.js  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CustomMetric via APM or CloudWatchAgent
    
**Criticality:** medium  
**Justification:** Identifies potential performance issues in asynchronous operations within NestJS services.  
    - **Name:** app.nodejs.gc_duration_seconds  
**Type:** histogram  
**Unit:** Seconds  
**Description:** Node.js garbage collection pause durations.  
**Technology:** Node.js  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CustomMetric via APM or CloudWatchAgent
    
**Criticality:** low  
**Justification:** Helps diagnose memory-related performance issues.  
    - **Name:** app.db.connection_pool.active_connections  
**Type:** gauge  
**Unit:** Count  
**Description:** Active connections in the database connection pool (e.g., TypeORM for PostgreSQL).  
**Technology:** Node.js  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CustomMetric via Application Code
    
**Criticality:** medium  
**Justification:** Monitors usage of shared database resources by applications.  
    
  - **Request Response Metrics:**
    
    - **Name:** aws.apigateway.latency_p95_milliseconds  
**Type:** gauge  
**Unit:** Milliseconds  
**Description:** 95th percentile latency for API Gateway requests.  
**Dimensions:**
    
    - ApiName
    - Resource
    - Method
    
**Percentiles:**
    
    - P95
    
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Justification:** Key indicator of API performance and user experience. (REQ-POA-015)  
    - **Name:** aws.apigateway.requests_total  
**Type:** counter  
**Unit:** Count  
**Description:** Total number of requests to API Gateway.  
**Dimensions:**
    
    - ApiName
    - Resource
    - Method
    
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Justification:** Tracks API usage and load.  
    - **Name:** aws.apigateway.error_5xx_total  
**Type:** counter  
**Unit:** Count  
**Description:** Total number of 5xx server-side errors from API Gateway.  
**Dimensions:**
    
    - ApiName
    - Resource
    - Method
    
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Justification:** Indicates backend service issues or API Gateway misconfigurations. (REQ-POA-015, REQ-03-007)  
    - **Name:** aws.apigateway.error_4xx_total  
**Type:** counter  
**Unit:** Count  
**Description:** Total number of 4xx client-side errors from API Gateway.  
**Dimensions:**
    
    - ApiName
    - Resource
    - Method
    
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Justification:** Indicates client-side issues (e.g., bad requests, auth failures).  
    
  - **Availability Metrics:**
    
    - **Name:** app.service.availability_percentage  
**Type:** gauge  
**Unit:** Percent  
**Description:** Availability of critical microservices, calculated from health check success rate or successful API responses.  
**Calculation:** (SuccessfulRequests / TotalRequests) * 100 OR (SuccessfulHealthChecks / TotalHealthChecks) * 100  
**Sla Target:** 99.9%  
**Justification:** Directly measures service reliability. (REQ-POA-015)  
    
  - **Scalability Metrics:**
    
    - **Name:** aws.eks_ecs.running_task_pod_count  
**Type:** gauge  
**Unit:** Count  
**Description:** Number of running tasks/pods for each microservice.  
**Capacity Threshold:** Configured HPA/Service Auto Scaling limits  
**Auto Scaling Trigger:** True  
**Justification:** Monitors scaling activity and resource utilization. (REQ-PC-010, REQ-ARP-005)  
    - **Name:** aws.sqs.approximate_number_of_messages_visible  
**Type:** gauge  
**Unit:** Count  
**Description:** Number of messages available for retrieval from SQS queues.  
**Capacity Threshold:** Service-specific, e.g., >1000 indicating backlog  
**Auto Scaling Trigger:** False  
**Justification:** Indicates processing backlogs or consumer issues. (REQ-POA-015)  
    - **Name:** aws.sqs.approximate_age_of_oldest_message_seconds  
**Type:** gauge  
**Unit:** Seconds  
**Description:** Age of the oldest message in SQS queues.  
**Capacity Threshold:** Service-specific, e.g., >3600 seconds indicating stalled processing  
**Auto Scaling Trigger:** False  
**Justification:** Highlights potential message processing delays. (REQ-POA-015)  
    
  
- **Application Specific Metrics Design:**
  
  - **Transaction Metrics:**
    
    - **Name:** app.campaign_management.campaign_operations_total  
**Type:** counter  
**Unit:** Count  
**Description:** Total number of campaign operations (create, update, status_change).  
**Business_Context:** REQ-CMO-001, REQ-CMO-002. Tracks core campaign management activity.  
**Dimensions:**
    
    - operation_type
    - status
    
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CustomMetricPushToCloudWatch
    
**Aggregation:**
    
    - **Functions:**
      
      - sum
      - rate
      
    - **Window:** 1minute
    
    - **Name:** app.product_catalog.feed_generation_duration_seconds  
**Type:** histogram  
**Unit:** Seconds  
**Description:** Duration of product catalog feed generation.  
**Business_Context:** REQ-PC-006, REQ-PC-010. Monitors performance of a critical, potentially long-running task.  
**Dimensions:**
    
    - ad_network
    - catalog_size_bucket
    
**Collection:**
    
    - **Interval:** OnCompletion
    - **Method:** CustomMetricPushToCloudWatch
    
**Aggregation:**
    
    - **Functions:**
      
      - avg
      - p95
      - p99
      
    - **Window:** N/A
    
    - **Name:** app.ad_network_integration.api_call_latency_seconds  
**Type:** histogram  
**Unit:** Seconds  
**Description:** Latency of API calls to external ad networks.  
**Business_Context:** REQ-03-001, REQ-03-002. Monitors performance of critical external dependencies.  
**Dimensions:**
    
    - ad_network_name
    - api_endpoint
    - operation_type
    
**Collection:**
    
    - **Interval:** PerCall
    - **Method:** CustomMetricPushToCloudWatch
    
**Aggregation:**
    
    - **Functions:**
      
      - avg
      - p95
      - p99
      - count
      
    - **Window:** 1minute
    
    - **Name:** app.analytics_reporting.data_ingestion_throughput_events_per_second  
**Type:** gauge  
**Unit:** Events/Second  
**Description:** Throughput of analytics data ingestion pipeline.  
**Business_Context:** REQ-ARP-005. Directly measures NFR for analytics ingestion.  
**Dimensions:**
    
    - data_source_type
    
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CustomMetricPushToCloudWatch
    
**Aggregation:**
    
    - **Functions:**
      
      - avg
      - max
      
    - **Window:** 1minute
    
    - **Name:** app.analytics_reporting.data_ingestion_latency_seconds  
**Type:** histogram  
**Unit:** Seconds  
**Description:** End-to-end latency for analytics data ingestion (batch or real-time).  
**Business_Context:** REQ-ARP-005. Directly measures NFR for analytics ingestion latency.  
**Dimensions:**
    
    - processing_type
    
**Collection:**
    
    - **Interval:** OnCompletion
    - **Method:** CustomMetricPushToCloudWatch
    
**Aggregation:**
    
    - **Functions:**
      
      - avg
      - p95
      - p99
      
    - **Window:** N/A
    
    - **Name:** app.core_platform_integration.api_call_errors_total  
**Type:** counter  
**Unit:** Count  
**Description:** Total errors from API calls to the core [PlatformName] platform.  
**Business_Context:** REQ-CPSI-006. Monitors health of integration with core platform.  
**Dimensions:**
    
    - endpoint
    - error_code
    
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CustomMetricPushToCloudWatch
    
**Aggregation:**
    
    - **Functions:**
      
      - sum
      - rate
      
    - **Window:** 1minute
    
    
  - **Cache Performance Metrics:**
    
    - **Name:** app.cache.hit_ratio  
**Type:** gauge  
**Unit:** Percent  
**Description:** Application-level cache hit ratio (e.g., for Ad Network Specs, User Permissions).  
**Cache Type:** ApplicationSpecificRedis  
**Hit Ratio Target:** >85%  
**Justification:** Measures effectiveness of application-level caching strategies.  
    
  - **External Dependency Metrics:**
    
    - **Name:** app.ad_network_integration.circuit_breaker_state_changes_total  
**Type:** counter  
**Unit:** Count  
**Description:** Number of times circuit breakers for ad network APIs change state (open, half-open, closed).  
**Dependency:** AdNetworkAPIs  
**Circuit Breaker Integration:** True  
**Sla:**
    
    - **Response Time:** Varies by network
    - **Availability:** Varies by network
    
**Justification:** REQ-03-007. Monitors resilience mechanism for external ad network integrations.  
    - **Name:** app.payment_gateway.transaction_status_total  
**Type:** counter  
**Unit:** Count  
**Description:** Total payment transactions processed, by status.  
**Dependency:** PaymentGateways  
**Circuit Breaker Integration:** True  
**Sla:**
    
    - **Response Time:** <3seconds_p95
    - **Availability:** 99.95%
    
**Justification:** REQ-TCE-004. Tracks payment processing success and failures for subscriptions/ad spend.  
    
  - **Error Metrics:**
    
    - **Name:** app.service.application_errors_total  
**Type:** counter  
**Unit:** Count  
**Description:** Total count of unhandled exceptions or significant application errors per service.  
**Error Types:**
    
    - UnhandledException
    - BusinessLogicError
    - DataValidationError
    
**Dimensions:**
    
    - service_name
    - error_class
    - severity
    
**Alert Threshold:** >5_in_5minutes_for_critical_severity  
**Justification:** REQ-POA-003, REQ-03-007. Essential for tracking overall application stability and identifying problematic services.  
    - **Name:** app.ad_network_integration.api_call_errors_total  
**Type:** counter  
**Unit:** Count  
**Description:** Total errors from API calls to external ad networks.  
**Error Types:**
    
    - AuthenticationError
    - RateLimitError
    - InvalidRequestError
    - NetworkError
    
**Dimensions:**
    
    - ad_network_name
    - api_endpoint
    - error_code
    
**Alert Threshold:** Spike_in_errors_for_specific_network  
**Justification:** REQ-03-007, REQ-TCE-002. Critical for monitoring health of ad network integrations.  
    
  - **Throughput And Latency Metrics:**
    
    - **Name:** app.service.request_latency_seconds  
**Type:** histogram  
**Unit:** Seconds  
**Description:** Latency of requests processed by individual microservices (internal, not just API Gateway).  
**Percentiles:**
    
    - P50
    - P90
    - P95
    - P99
    
**Buckets:**
    
    - 0.005
    - 0.01
    - 0.025
    - 0.05
    - 0.1
    - 0.25
    - 0.5
    - 1
    - 2.5
    - 5
    - 10
    
**Sla Targets:**
    
    - **P95:** <1second_for_most_operations
    - **P99:** <3seconds_for_most_operations
    
**Justification:** Measures internal service performance. REQ-POA-015 related.  
    - **Name:** app.service.requests_per_second  
**Type:** gauge  
**Unit:** Requests/Second  
**Description:** Throughput of individual microservices.  
**Percentiles:**
    
    
**Buckets:**
    
    
**Sla Targets:**
    
    
**Justification:** Tracks load on individual services.  
    
  
- **Business Kpi Identification:**
  
  - **Critical Business Metrics:**
    
    - **Name:** biz.campaign.roas  
**Type:** gauge  
**Unit:** Ratio  
**Description:** Return on Ad Spend. (Revenue from Ads / Ad Spend)  
**Business Owner:** Marketing/MerchantSuccess  
**Calculation:** SUM(AttributedSales) / SUM(AdSpend)  
**Reporting Frequency:** Daily/Weekly/Monthly  
**Target:** >X (merchant-defined or platform benchmark)  
**Justification:** REQ-CMO-007, REQ-ARP-001. Core metric for advertising effectiveness.  
    - **Name:** biz.campaign.cpa  
**Type:** gauge  
**Unit:** Currency  
**Description:** Cost Per Acquisition/Conversion. (Ad Spend / Conversions)  
**Business Owner:** Marketing/MerchantSuccess  
**Calculation:** SUM(AdSpend) / SUM(Conversions)  
**Reporting Frequency:** Daily/Weekly/Monthly  
**Target:** <Y (merchant-defined or platform benchmark)  
**Justification:** REQ-CMO-007, REQ-ARP-001. Core metric for advertising efficiency.  
    - **Name:** biz.campaign.conversion_rate  
**Type:** gauge  
**Unit:** Percent  
**Description:** Conversion Rate. (Conversions / Clicks or Impressions) * 100  
**Business Owner:** Marketing/MerchantSuccess  
**Calculation:** (SUM(Conversions) / SUM(Clicks)) * 100  
**Reporting Frequency:** Daily/Weekly/Monthly  
**Target:** >Z% (merchant-defined or platform benchmark)  
**Justification:** REQ-CMO-007, REQ-ARP-001. Measures ad effectiveness in driving desired actions.  
    - **Name:** biz.platform.active_merchants_total  
**Type:** gauge  
**Unit:** Count  
**Description:** Total number of active merchants on the Ad Manager platform.  
**Business Owner:** PlatformManagement  
**Calculation:** Count of merchants with active subscriptions or recent activity.  
**Reporting Frequency:** Daily/Monthly  
**Target:** Growth Trend  
**Justification:** Indicates platform adoption and health.  
    - **Name:** biz.platform.total_ad_spend_managed_usd  
**Type:** gauge  
**Unit:** USD  
**Description:** Total advertising spend managed through the platform across all merchants.  
**Business Owner:** PlatformManagement  
**Calculation:** SUM(merchant_ad_spend) from PerformanceMetric  
**Reporting Frequency:** Daily/Monthly  
**Target:** Growth Trend  
**Justification:** Measures platform scale and merchant trust.  
    
  - **User Engagement Metrics:**
    
    - **Name:** biz.feature.ab_test_adoption_rate_percentage  
**Type:** gauge  
**Unit:** Percent  
**Description:** Percentage of active merchants using the A/B testing feature.  
**Segmentation:**
    
    - merchant_tier
    
**Cohort Analysis:** False  
**Justification:** REQ-CMO-008. Tracks adoption of a key optimization feature.  
    - **Name:** biz.feature.promotion_engine_usage_total  
**Type:** counter  
**Unit:** Count  
**Description:** Number of active promotions created by merchants.  
**Segmentation:**
    
    - promotion_type
    
**Cohort Analysis:** False  
**Justification:** REQ-PROMO-001. Indicates usage of promotional tools.  
    
  - **Conversion Metrics:**
    
    - **Name:** biz.subscription.plan_conversion_rate_percentage  
**Type:** gauge  
**Unit:** Percent  
**Description:** Rate at which merchants convert from Basic to Pro/Plus plans.  
**Funnel Stage:** BasicPlanToPaidPlan  
**Conversion Target:** >X%  
**Justification:** REQ-15-001. Tracks effectiveness of tiered plan offerings.  
    
  - **Operational Efficiency Kpis:**
    
    - **Name:** ops.product_catalog.sync_success_rate_percentage  
**Type:** gauge  
**Unit:** Percent  
**Description:** Success rate of product catalog synchronizations from core platform.  
**Calculation:** (SuccessfulSyncs / TotalSyncAttempts) * 100  
**Benchmark Target:** >99.5%  
**Justification:** REQ-CPSI-001, REQ-PC-002. Measures reliability of a core data pipeline.  
    - **Name:** ops.analytics.data_ingestion_delay_avg_minutes  
**Type:** gauge  
**Unit:** Minutes  
**Description:** Average delay for batch analytics data to become available in reports.  
**Calculation:** AVG(ReportAvailabilityTimestamp - DataReceivedTimestamp)  
**Benchmark Target:** <Y_minutes (as per REQ-ARP-005)  
**Justification:** REQ-ARP-005. Measures timeliness of analytics data.  
    
  - **Revenue And Cost Metrics:**
    
    - **Name:** biz.revenue.subscription_mrr_usd  
**Type:** gauge  
**Unit:** USD  
**Description:** Monthly Recurring Revenue from Ad Manager subscriptions.  
**Frequency:** Monthly  
**Accuracy:** High  
**Justification:** REQ-15-001. Primary revenue indicator.  
    
  - **Customer Satisfaction Indicators:**
    
    - **Name:** ops.support.sla_adherence_rate_percentage  
**Type:** gauge  
**Unit:** Percent  
**Description:** Percentage of support tickets meeting SLA for response/resolution.  
**Data Source:** HelpdeskSystem  
**Update Frequency:** Daily  
**Justification:** REQ-SUD-008. Measures support team effectiveness.  
    
  
- **Collection Interval Optimization:**
  
  - **Sampling Frequencies:**
    
    - **Metric Category:** SystemHardwareUtilization  
**Interval:** 1minute  
**Justification:** Standard for CloudWatch, provides good granularity for operational monitoring.  
**Resource Impact:** low  
    - **Metric Category:** APIGatewayRequestMetrics  
**Interval:** 1minute  
**Justification:** Standard for CloudWatch, essential for near real-time API performance tracking.  
**Resource Impact:** low  
    - **Metric Category:** ApplicationSpecificOperationalCounters  
**Interval:** 1minute  
**Justification:** Provides timely operational insights into application activity.  
**Resource Impact:** low  
    - **Metric Category:** ApplicationSpecificLatencyHistograms  
**Interval:** PerEventOr1MinuteAggregate  
**Justification:** Captures detailed latency distributions for performance analysis.  
**Resource Impact:** medium  
    - **Metric Category:** BusinessKPIsForDashboards  
**Interval:** 5-15minutes  
**Justification:** Sufficient for dashboard refresh rates without excessive computation.  
**Resource Impact:** medium  
    
  - **High Frequency Metrics:**
    
    - **Name:** app.analytics_reporting.data_ingestion_throughput_events_per_second  
**Interval:** SubMinuteIfStreamingElse1Minute  
**Criticality:** High (NFR REQ-ARP-005)  
**Cost Justification:** Essential for meeting performance NFRs for analytics pipeline.  
    - **Name:** aws.apigateway.latency_p95_milliseconds  
**Interval:** 1minute  
**Criticality:** High  
**Cost Justification:** Core API performance indicator.  
    
  - **Cardinality Considerations:**
    
    - **Metric Name:** app.ad_network_integration.api_call_latency_seconds  
**Estimated Cardinality:** High (network * endpoint * operation)  
**Dimension Strategy:** Limit to critical endpoints/operations if cardinality becomes an issue, or use aggregated metrics for less critical ones.  
**Mitigation Approach:** Strategic dimension selection, potential use of high-cardinality backend for metrics if CloudWatch limits are hit (not planned initially).  
    - **Metric Name:** biz.campaign.roas  
**Estimated Cardinality:** Medium (per campaign, per merchant)  
**Dimension Strategy:** Aggregate at merchant level for platform overview, allow drill-down per campaign.  
**Mitigation Approach:** N/A for CloudWatch with reasonable merchant/campaign count.  
    
  - **Aggregation Periods:**
    
    - **Metric Type:** OperationalMetrics  
**Periods:**
    
    - 1minute
    - 5minute
    - 1hour
    
**Retention Strategy:** CloudWatch default retention (1min up to 15 days, 5min up to 63 days, 1hr up to 455 days)  
    - **Metric Type:** BusinessKPIs  
**Periods:**
    
    - 1hour
    - 1day
    - 1week
    - 1month
    
**Retention Strategy:** Custom aggregation into summary tables (e.g., DailyCampaignPerformanceSummary) for long-term storage beyond CloudWatch limits. REQ-ARP-006.  
    
  - **Collection Methods:**
    
    - **Method:** CloudWatchServiceIntegration  
**Applicable Metrics:**
    
    - aws.compute.cpu_utilization
    - aws.rds.database_connections
    - aws.apigateway.latency_p95_milliseconds
    
**Implementation:** Native AWS CloudWatch metrics for AWS services.  
**Performance:** Low overhead, managed by AWS.  
    - **Method:** CustomMetricPushToCloudWatch  
**Applicable Metrics:**
    
    - app.campaign_management.campaign_operations_total
    - biz.campaign.roas
    - app.analytics_reporting.data_ingestion_throughput_events_per_second
    
**Implementation:** Using AWS SDK (PutMetricData API) from NestJS services or Lambda functions.  
**Performance:** Requires careful batching and asynchronous push to minimize application impact.  
    
  
- **Aggregation Method Selection:**
  
  - **Statistical Aggregations:**
    
    - **Metric Name:** aws.apigateway.latency_p95_milliseconds  
**Aggregation Functions:**
    
    - Average
    - Percentile(95)
    
**Windows:**
    
    - 1minute
    - 5minute
    - 1hour
    
**Justification:** Standard for latency monitoring, providing typical and worst-case performance.  
    - **Metric Name:** app.campaign_management.campaign_operations_total  
**Aggregation Functions:**
    
    - Sum
    - Rate
    
**Windows:**
    
    - 1minute
    - 1hour
    - 1day
    
**Justification:** Tracks total activity and rate of change.  
    - **Metric Name:** biz.campaign.roas  
**Aggregation Functions:**
    
    - Average
    - Min
    - Max
    
**Windows:**
    
    - 1day
    - 1week
    
**Justification:** Provides overview of ROAS performance across different timeframes.  
    
  - **Histogram Requirements:**
    
    - **Metric Name:** app.ad_network_integration.api_call_latency_seconds  
**Buckets:**
    
    - 0.05
    - 0.1
    - 0.25
    - 0.5
    - 1
    - 2.5
    - 5
    - 10
    - +Inf
    
**Percentiles:**
    
    - P50
    - P90
    - P95
    - P99
    
**Accuracy:** High for critical dependencies.  
**Justification:** Detailed latency distribution for external API calls.  
    - **Metric Name:** app.analytics_reporting.data_ingestion_latency_seconds  
**Buckets:**
    
    - 0.1
    - 0.5
    - 1
    - 5
    - 10
    - 30
    - 60
    - +Inf
    
**Percentiles:**
    
    - P50
    - P90
    - P95
    - P99
    
**Accuracy:** High due to NFR REQ-ARP-005.  
**Justification:** Monitors analytics pipeline performance against NFRs.  
    
  - **Percentile Calculations:**
    
    - **Metric Name:** aws.apigateway.latency_p95_milliseconds  
**Percentiles:**
    
    - P50
    - P90
    - P95
    - P99
    
**Algorithm:** CloudWatch default (likely t-digest or similar)  
**Accuracy:** Sufficient for operational monitoring.  
**Justification:** Standard for understanding typical and tail latency.  
    
  - **Metric Types:**
    
    - **Name:** aws.apigateway.requests_total  
**Implementation:** counter  
**Reasoning:** Monotonically increasing value representing total requests.  
**Resets Handling:** Handled by CloudWatch; rate calculations use deltas.  
    - **Name:** aws.compute.cpu_utilization  
**Implementation:** gauge  
**Reasoning:** Represents a point-in-time value that can go up or down.  
**Resets Handling:** N/A  
    - **Name:** app.service.request_latency_seconds  
**Implementation:** histogram  
**Reasoning:** Captures distribution of latency values for percentile calculations.  
**Resets Handling:** N/A  
    
  - **Dimensional Aggregation:**
    
    - **Metric Name:** app.ad_network_integration.api_call_errors_total  
**Dimensions:**
    
    - ad_network_name
    - api_endpoint
    - error_code
    
**Aggregation Strategy:** SUM across dimensions for total errors, or filter by specific dimensions.  
**Cardinality Impact:** Medium to High, monitor for cost/performance with CloudWatch.  
**Justification:** Allows drill-down into errors by specific network or endpoint.  
    - **Metric Name:** biz.campaign.roas  
**Dimensions:**
    
    - merchant_id
    - campaign_id
    - ad_network_id
    
**Aggregation Strategy:** Calculated per dimension set. Platform-wide ROAS would be an aggregation over merchants.  
**Cardinality Impact:** Medium  
**Justification:** Enables ROAS tracking at granular levels as per REQ-ARP-001.  
    
  - **Derived Metrics:**
    
    - **Name:** biz.campaign.cpa_derived  
**Calculation:** SUM(app.campaign.spend_total WHERE campaignId=X) / SUM(app.campaign.conversions_total WHERE campaignId=X)  
**Source Metrics:**
    
    - app.campaign.spend_total
    - app.campaign.conversions_total
    
**Update Frequency:** PerAggregationWindow (e.g., 1hour, 1day)  
**Justification:** CPA calculation from base spend and conversion metrics. (REQ-ARP-001)  
    - **Name:** app.service.error_rate_percentage_derived  
**Calculation:** (SUM(app.service.errors_total) / SUM(app.service.requests_total)) * 100  
**Source Metrics:**
    
    - app.service.errors_total
    - app.service.requests_total
    
**Update Frequency:** 1minute  
**Justification:** Provides a normalized error rate for services.  
    
  
- **Storage Requirements Planning:**
  
  - **Retention Periods:**
    
    - **Metric Type:** CloudWatchStandardMetrics (1-min resolution)  
**Retention Period:** 15 days  
**Justification:** CloudWatch default, sufficient for short-term operational troubleshooting.  
**Compliance Requirement:** N/A  
    - **Metric Type:** CloudWatchAggregatedMetrics (1-hour resolution)  
**Retention Period:** 455 days (approx 15 months)  
**Justification:** CloudWatch default, for medium-term trend analysis.  
**Compliance Requirement:** N/A  
    - **Metric Type:** ApplicationPerformanceLogs (DynamoDB for REQ-ARP-007)  
**Retention Period:** 2 years (detailed), then aggregate/anonymize  
**Justification:** REQ-ARP-006 for historical analysis.  
**Compliance Requirement:** GDPR/CCPA implications for PII if present.  
    - **Metric Type:** AnonymizedPerformanceData (Post-aggregation)  
**Retention Period:** Up to 5 years total, then purged  
**Justification:** REQ-ARP-006 for long-term trend analysis.  
**Compliance Requirement:** Must be effectively anonymized.  
    - **Metric Type:** AuditLogs (CloudWatch Logs to S3)  
**Retention Period:** 7 years (configurable)  
**Justification:** REQ-IAM-009, REQ-MDGC-008, REQ-POA-012 for compliance and security investigations.  
**Compliance Requirement:** Varies by regulation (GDPR, CCPA, industry specific).  
    
  - **Data Resolution:**
    
    - **Time Range:** 0-15 days  
**Resolution:** 1 minute (for CloudWatch standard metrics)  
**Query Performance:** High  
**Storage Optimization:** Standard CloudWatch  
    - **Time Range:** 15-63 days  
**Resolution:** 5 minutes (CloudWatch downsampling)  
**Query Performance:** Medium  
**Storage Optimization:** CloudWatch downsampling  
    - **Time Range:** 63-455 days  
**Resolution:** 1 hour (CloudWatch downsampling)  
**Query Performance:** Low to Medium  
**Storage Optimization:** CloudWatch downsampling  
    - **Time Range:** 0-2 years (Detailed Performance Logs in DynamoDB)  
**Resolution:** As granular as ingested (e.g., hourly, daily per ad)  
**Query Performance:** Medium (optimized for specific queries)  
**Storage Optimization:** DynamoDB TTL for eventual purging, partitioning strategy.  
    
  - **Downsampling Strategies:**
    
    - **Source Resolution:** Raw Performance Data (e.g., hourly per ad)  
**Target Resolution:** DailySummary (e.g., DailyCampaignPerformanceSummary table)  
**Aggregation Method:** SUM(impressions, clicks, spend, conversions), AVG(ROAS, CPA)  
**Trigger Condition:** Nightly batch job or on-the-fly for dashboards if feasible.  
**Justification:** Improves query performance for daily reporting, reduces storage for long-term trends (REQ-ARP-001).  
    
  - **Storage Performance:**
    
    - **Write Latency:** <10ms for DynamoDB single item P99 (for performance logs), <50ms for RDS P99.
    - **Query Latency:** <1s for typical dashboard queries (CloudWatch, RDS Summaries), <5s for detailed historical queries (DynamoDB/RDS).
    - **Throughput Requirements:** High for DynamoDB performance log ingestion (REQ-ARP-005 N impressions/sec implies high write rate). Medium for RDS.
    - **Scalability Needs:** DynamoDB designed for high scalability. RDS scalable via instance size and read replicas.
    - **Justification:** Ensures timely data ingestion and responsive dashboards/reports.
    
  - **Query Optimization:**
    
    - **Query Pattern:** Time-series analysis of campaign performance by ad network and date.  
**Optimization Strategy:** DynamoDB: GSI on adNetworkId and date. PostgreSQL: Index on campaignId, adNetworkId, date. Pre-aggregate into DailyCampaignPerformanceSummary.  
**Indexing Requirements:**
    
    - idx_pm_date_campaign_network
    - idx_dcps_merchant_date
    
**Justification:** Common query pattern for REQ-ARP-001.  
    - **Query Pattern:** Drill-down from campaign to ad set to ad performance.  
**Optimization Strategy:** Appropriate GSIs in DynamoDB linking campaign->adset->ad. Proper FKs and indexes in PostgreSQL.  
**Indexing Requirements:**
    
    - idx_pm_campaign_date
    - idx_pm_adset_date
    - idx_pm_ad_date
    
**Justification:** Supports hierarchical reporting needs (REQ-ARP-001).  
    
  - **Cost Optimization:**
    
    - **Strategy:** DynamoDB On-Demand Capacity  
**Implementation:** Configure DynamoDB tables for on-demand capacity for unpredictable workloads.  
**Expected Savings:** Avoids over-provisioning during low traffic, pays for actual usage.  
**Tradeoffs:** Can be more expensive than well-tuned provisioned capacity during sustained high traffic.  
**Justification:** Balances cost and performance for fluctuating analytics ingestion loads (REQ-ARP-005).  
    - **Strategy:** S3 Intelligent-Tiering for Log Archives  
**Implementation:** Export CloudWatch Logs and other long-term archives to S3 with Intelligent-Tiering.  
**Expected Savings:** Automatically moves data to lower-cost storage tiers.  
**Tradeoffs:** Potential retrieval latency for archived tiers.  
**Justification:** Cost-effective long-term storage for audit and compliance data (REQ-POA-012).  
    
  
- **Project Specific Metrics Config:**
  
  - **Standard Metrics:**
    
    - **Name:** aws.apigateway.Count  
**Type:** counter  
**Unit:** Count  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Thresholds:**
    
    - **Warning:** N/A
    - **Critical:** N/A
    
**Dimensions:**
    
    - ApiName
    - Resource
    - Method
    - Stage
    
    - **Name:** aws.apigateway.Latency.P95  
**Type:** gauge  
**Unit:** Milliseconds  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Thresholds:**
    
    - **Warning:** >1000ms
    - **Critical:** >3000ms
    
**Dimensions:**
    
    - ApiName
    - Resource
    - Method
    - Stage
    
    - **Name:** aws.apigateway.5XXError.Sum  
**Type:** counter  
**Unit:** Count  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Thresholds:**
    
    - **Warning:** >1% of total requests
    - **Critical:** >5% of total requests
    
**Dimensions:**
    
    - ApiName
    - Resource
    - Method
    - Stage
    
    - **Name:** aws.rds.CPUUtilization  
**Type:** gauge  
**Unit:** Percent  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Thresholds:**
    
    - **Warning:** >70%
    - **Critical:** >85%
    
**Dimensions:**
    
    - DBInstanceIdentifier
    
    - **Name:** aws.dynamodb.ThrottledWriteRequests  
**Type:** counter  
**Unit:** Count  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Thresholds:**
    
    - **Warning:** >0
    - **Critical:** Sustained >0
    
**Dimensions:**
    
    - TableName
    - Operation
    
    - **Name:** aws.sqs.ApproximateNumberOfMessagesVisible  
**Type:** gauge  
**Unit:** Count  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Thresholds:**
    
    - **Warning:** >1000 (adjust per queue)
    - **Critical:** >5000 (adjust per queue)
    
**Dimensions:**
    
    - QueueName
    
    - **Name:** aws.lambda.Errors.Sum  
**Type:** counter  
**Unit:** Count  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CloudWatchServiceIntegration
    
**Thresholds:**
    
    - **Warning:** >1% of invocations
    - **Critical:** >5% of invocations
    
**Dimensions:**
    
    - FunctionName
    - Resource
    
    
  - **Custom Metrics:**
    
    - **Name:** app.analytics.ingestion.event_rate_per_second  
**Description:** Rate of analytics events being ingested per second, as per REQ-ARP-005.  
**Calculation:** Count of ingestion events / time window  
**Type:** gauge  
**Unit:** Events/Second  
**Business Context:** Monitors analytics pipeline throughput against NFRs.  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CustomMetricPushToCloudWatch
    
**Alerting:**
    
    - **Enabled:** True
    - **Conditions:**
      
      - value < N (N from REQ-ARP-005) for 5 minutes
      
    
    - **Name:** app.analytics.ingestion.batch_latency_seconds  
**Description:** Latency for batch analytics data processing, as per REQ-ARP-005.  
**Calculation:** ProcessingCompletionTime - BatchStartTime  
**Type:** histogram  
**Unit:** Seconds  
**Business Context:** Monitors analytics pipeline latency against NFRs.  
**Collection:**
    
    - **Interval:** OnBatchCompletion
    - **Method:** CustomMetricPushToCloudWatch
    
**Alerting:**
    
    - **Enabled:** True
    - **Conditions:**
      
      - p95 > Y (Y from REQ-ARP-005) for 3 consecutive batches
      
    
    - **Name:** biz.campaign.roas_by_network  
**Description:** Return on Ad Spend, dimensionalized by Ad Network, as per REQ-ARP-001.  
**Calculation:** SUM(AttributedSales_NetworkX) / SUM(AdSpend_NetworkX)  
**Type:** gauge  
**Unit:** Ratio  
**Business Context:** Tracks core advertising effectiveness per network.  
**Collection:**
    
    - **Interval:** 1hour
    - **Method:** CalculatedFromAggregatedDataAndPushedToCloudWatch
    
**Alerting:**
    
    - **Enabled:** False
    - **Conditions:**
      
      
    
    - **Name:** app.ad_network_integration.api_error_rate_percentage  
**Description:** Error rate for API calls to a specific ad network.  
**Calculation:** (FailedAPICalls_NetworkX / TotalAPICalls_NetworkX) * 100  
**Type:** gauge  
**Unit:** Percent  
**Business Context:** Monitors health of ad network integrations (REQ-03-007).  
**Collection:**
    
    - **Interval:** 1minute
    - **Method:** CustomMetricPushToCloudWatch
    
**Alerting:**
    
    - **Enabled:** True
    - **Conditions:**
      
      - value > 5% for 15 minutes
      
    
    - **Name:** app.product_catalog.active_listings_count  
**Description:** Total number of active product listings managed by the platform.  
**Calculation:** Count of active products in ProductCatalog entities.  
**Type:** gauge  
**Unit:** Count  
**Business Context:** Monitors platform scale against NFR REQ-PC-010.  
**Collection:**
    
    - **Interval:** 1hour
    - **Method:** CustomMetricPushToCloudWatch
    
**Alerting:**
    
    - **Enabled:** True
    - **Conditions:**
      
      - value > Y_million (Y from REQ-PC-010) and performance degradation detected
      
    
    
  - **Dashboard Metrics:**
    
    - **Dashboard:** SystemHealthDashboard (REQ-POA-015)  
**Metrics:**
    
    - aws.apigateway.Latency.P95
    - aws.apigateway.5XXError.Sum
    - aws.rds.CPUUtilization
    - aws.dynamodb.ThrottledWriteRequests
    - aws.sqs.ApproximateAgeOfOldestMessage_CriticalQueues
    - aws.lambda.Errors.Sum_CriticalFunctions
    - app.service.availability_percentage_CriticalServices
    - app.ad_network_integration.circuit_breaker_state_changes_total
    
**Refresh Interval:** 1minute  
**Audience:** PlatformAdministrators  
    - **Dashboard:** MerchantCampaignPerformanceDashboard (REQ-ARP-001, REQ-ARP-003)  
**Metrics:**
    
    - biz.campaign.roas_by_network
    - biz.campaign.cpa_by_campaign
    - biz.campaign.conversion_rate_by_ad_set
    - app.campaign.spend_total_by_campaign
    - app.campaign.impressions_total_by_campaign
    - app.campaign.clicks_total_by_campaign
    
**Refresh Interval:** 5minutes  
**Audience:** Merchants (MerchantAdmin, CampaignManager)  
    - **Dashboard:** AnalyticsPipelineDashboard (REQ-ARP-005)  
**Metrics:**
    
    - app.analytics.ingestion.event_rate_per_second
    - app.analytics.ingestion.batch_latency_seconds.P95
    - aws.sqs.ApproximateNumberOfMessagesVisible_AnalyticsQueues
    - app.analytics_reporting.data_ingestion_errors_total
    
**Refresh Interval:** 1minute  
**Audience:** PlatformAdministrators, AnalyticsTeam  
    
  
- **Implementation Priority:**
  
  - **Component:** Standard AWS Service Metrics Collection (CloudWatch)  
**Priority:** high  
**Dependencies:**
    
    
**Estimated Effort:** Low (mostly configuration)  
**Risk Level:** low  
  - **Component:** API Gateway & Core Service (e.g., CampaignManagement) Request/Error/Latency Metrics  
**Priority:** high  
**Dependencies:**
    
    - API Gateway setup
    - Core service deployment
    
**Estimated Effort:** Medium (instrumentation in services)  
**Risk Level:** low  
  - **Component:** Analytics Data Ingestion Performance Metrics (REQ-ARP-005)  
**Priority:** high  
**Dependencies:**
    
    - AnalyticsReportingService development
    
**Estimated Effort:** Medium  
**Risk Level:** medium  
  - **Component:** Ad Network Integration API Call Metrics (Latency, Errors, Circuit Breaker)  
**Priority:** high  
**Dependencies:**
    
    - AdNetworkIntegrationService development
    
**Estimated Effort:** Medium  
**Risk Level:** medium  
  - **Component:** Business KPIs (ROAS, CPA, Conversion Rate)  
**Priority:** high  
**Dependencies:**
    
    - AnalyticsReportingService
    - CorePlatformIntegrationService (for order data)
    
**Estimated Effort:** High (requires full data flow)  
**Risk Level:** medium  
  - **Component:** Database Performance Metrics (RDS, DynamoDB)  
**Priority:** medium  
**Dependencies:**
    
    - Database setup
    
**Estimated Effort:** Low (CloudWatch integration)  
**Risk Level:** low  
  - **Component:** Queue Performance Metrics (SQS)  
**Priority:** medium  
**Dependencies:**
    
    - SQS setup
    
**Estimated Effort:** Low (CloudWatch integration)  
**Risk Level:** low  
  
- **Risk Assessment:**
  
  - **Risk:** Metric Overload / High Cardinality leading to increased CloudWatch costs or performance issues.  
**Impact:** medium  
**Probability:** medium  
**Mitigation:** Careful selection of dimensions. Aggregate metrics where possible. Use high-cardinality monitoring solutions only if CloudWatch becomes limiting (not planned). Regularly review metric usage and costs.  
**Contingency Plan:** Reduce dimensionality of less critical metrics. Adjust collection intervals.  
  - **Risk:** Inaccurate custom metric implementation leading to misleading data.  
**Impact:** high  
**Probability:** medium  
**Mitigation:** Thorough testing and validation of custom metric collection logic. Code reviews for metric instrumentation. Cross-referencing with other data sources where possible.  
**Contingency Plan:** Disable faulty metric, investigate and fix implementation, backfill/recalculate if possible (often hard for metrics).  
  - **Risk:** Alert Fatigue due to poorly tuned thresholds or noisy metrics.  
**Impact:** medium  
**Probability:** high  
**Mitigation:** Iteratively tune alert thresholds based on historical data and operational experience. Use composite alarms for more intelligent alerting. Implement alert silencing during maintenance.  
**Contingency Plan:** Temporarily disable noisy alerts, re-evaluate thresholds and metric relevance.  
  - **Risk:** Monitoring Gaps for critical application flows or dependencies.  
**Impact:** high  
**Probability:** low  
**Mitigation:** Comprehensive review of critical paths against defined metrics. Use distributed tracing (X-Ray) to identify interactions. Regular review of monitoring coverage as system evolves.  
**Contingency Plan:** Rapidly implement missing metrics and alerts based on incident post-mortems.  
  
- **Recommendations:**
  
  - **Category:** Metric Naming and Tagging  
**Recommendation:** Adopt a consistent naming convention for all custom metrics (e.g., app.{service_name}.{metric_group}.{metric_name}_{unit}) and use standardized CloudWatch dimensions (e.g., ServiceName, OperationName, Environment, MerchantTier).  
**Justification:** Improves discoverability, organization, and filterability of metrics in CloudWatch and dashboards.  
**Priority:** high  
**Implementation Notes:** Document naming conventions and enforce via code reviews.  
  - **Category:** Dashboarding Strategy  
**Recommendation:** Create role-based dashboards: System Health (Platform Admins - REQ-POA-015), Merchant Performance (Merchants - REQ-ARP-003), Service-Specific Operational (Dev Teams).  
**Justification:** Provides relevant views for different user personas, improving operational efficiency and merchant value.  
**Priority:** high  
**Implementation Notes:** Iterate on dashboards based on user feedback.  
  - **Category:** Alerting Philosophy  
**Recommendation:** Focus alerts on actionable, symptom-based conditions rather than every possible cause. Ensure alerts include context and links to relevant runbooks or dashboards.  
**Justification:** Reduces alert fatigue and improves incident response times (REQ-POA-003).  
**Priority:** high  
**Implementation Notes:** Regularly review and refine alert thresholds and notification policies.  
  - **Category:** Cost Management  
**Recommendation:** Regularly review CloudWatch costs, especially for custom metrics and high-resolution metrics. Archive or downsample non-critical historical metric data aggressively if not covered by default CloudWatch retention.  
**Justification:** Optimizes monitoring costs without sacrificing essential visibility.  
**Priority:** medium  
**Implementation Notes:** Utilize AWS Cost Explorer and CloudWatch usage metrics for analysis.  
  - **Category:** Integration with Tracing  
**Recommendation:** Ensure correlation between metrics, logs, and traces using common IDs (e.g., traceId, correlationId). Link from metric dashboards/alerts to relevant X-Ray traces or CloudWatch Logs Insights queries.  
**Justification:** Facilitates faster root cause analysis during incidents by providing a holistic view (REQ-POA-004).  
**Priority:** medium  
**Implementation Notes:** Instrument applications to propagate trace/correlation IDs consistently.  
  


---

