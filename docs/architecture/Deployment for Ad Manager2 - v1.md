# Specification

# 1. Scaling Policies Analysis

- **System Overview:**
  
  - **Analysis Date:** 2024-07-26
  - **Technology Stack:**
    
    - NestJS (TypeScript, Node.js)
    - React (Next.js/Remix for SSR/SSG, Vite for CSR)
    - AWS (EC2, Fargate, Lambda, API Gateway, RDS PostgreSQL, DynamoDB, SQS, SNS, S3, ElastiCache Redis, CloudFront, WAF, KMS)
    
  - **Architecture Patterns:**
    
    - Modular Monolith evolving to Microservices (NestJS Modules)
    - API-First
    - Event-Driven (SQS/SNS)
    - Serverless (Lambda, Fargate)
    
  - **Resource Needs:**
    
    - Support for [e.g., Y million] active product listings (SRS 3.2.2 placeholder, e.g., 5 million)
    - Support for [e.g., Z thousand] concurrent merchant users (SRS 3.2.2 placeholder, e.g., 10 thousand)
    - Handling [e.g., N impressions/second] for ad impression processing (SRS 3.2.1 placeholder, e.g., 1000/sec)
    
  - **Performance Expectations:** API P99 latency <500ms, average <200ms (SRS 3.2.1). Landing pages Google PageSpeed Insights score >=80 (SRS 3.2.1).
  - **Data Processing Volumes:** High volume for ad impressions, product catalog syncs, analytics data ingestion. Batch operations for report generation.
  
- **Workload Characterization:**
  
  - **Processing Resource Consumption:**
    
    - **Operation:** Backend API Services (NestJS on ECS/Fargate)  
**Cpu Pattern:** bursty  
**Cpu Utilization:**
    
    - **Baseline:** 10-20%
    - **Peak:** 60-80%
    - **Average:** 30-40%
    
**Memory Pattern:** steady  
**Memory Requirements:**
    
    - **Baseline:** Determined per service, e.g., 512MB
    - **Peak:** Determined per service, e.g., 2GB
    - **Growth:** Gradual with increased load
    
**Io Characteristics:**
    
    - **Disk Iops:** Low for Fargate, Moderate for RDS/DynamoDB
    - **Network Throughput:** High for API traffic and inter-service communication
    - **Io Pattern:** mixed
    
    - **Operation:** Asynchronous Workers (AWS Lambda/ECS Fargate on SQS)  
**Cpu Pattern:** event-driven  
**Cpu Utilization:**
    
    - **Baseline:** 0% (scales to zero)
    - **Peak:** 50-70% during processing
    - **Average:** Low (averaged over time)
    
**Memory Pattern:** fluctuating  
**Memory Requirements:**
    
    - **Baseline:** Determined per function/task, e.g., 256MB
    - **Peak:** Determined per function/task, e.g., 1GB
    - **Growth:** N/A (scales out)
    
**Io Characteristics:**
    
    - **Disk Iops:** Low for Lambda, Moderate for S3/DB interactions
    - **Network Throughput:** Moderate to High during processing bursts
    - **Io Pattern:** mixed
    
    
  - **Concurrency Requirements:**
    
    - **Operation:** Merchant API Access  
**Max Concurrent Jobs:** 10000  
**Thread Pool Size:** 0  
**Connection Pool Size:** 200  
**Queue Depth:** 0  
    - **Operation:** SQS Message Processing (e.g., Catalog Sync, Report Gen)  
**Max Concurrent Jobs:** 1000  
**Thread Pool Size:** 0  
**Connection Pool Size:** 0  
**Queue Depth:** 10000  
    
  - **Database Access Patterns:**
    
    - **Access Type:** mixed  
**Connection Requirements:** RDS PostgreSQL: Up to 200 connections, connection pooling. DynamoDB: SDK-based connections.  
**Query Complexity:** mixed  
**Transaction Volume:** High for analytics, moderate for transactional data  
**Cache Hit Ratio:** Target >80% for ElastiCache Redis (SRS 4.2.6 indicates caching for DB query results)  
    
  - **Frontend Resource Demands:**
    
    - **Component:** Merchant Ad Manager Dashboard (CSR)  
**Rendering Load:** moderate  
**Static Content Size:** 2-5MB (initial load)  
**Dynamic Content Volume:** High (API driven)  
**User Concurrency:** [e.g., Z thousand] concurrent users  
    - **Component:** Public Landing Pages/Blogs (SSR/SSG)  
**Rendering Load:** light (post-render/hydration)  
**Static Content Size:** 0.5-2MB  
**Dynamic Content Volume:** Low to Moderate  
**User Concurrency:** Variable, potentially high during campaigns  
    
  - **Load Patterns:**
    
    - **Pattern:** peak-trough  
**Description:** Daily usage patterns with peaks during business hours, and significant surges during major sales events like Black Friday (SRS 3.2.2).  
**Frequency:** Daily, Seasonal  
**Magnitude:** Up to 5-10x baseline during peak events  
**Predictability:** medium  
    
  
- **Scaling Strategy Design:**
  
  - **Scaling Approaches:**
    
    - **Component:** NestJS Backend Services (ECS/Fargate)  
**Primary Strategy:** horizontal  
**Justification:** Stateless nature of services allows adding/removing instances based on load. (SRS 3.2.2, 4.5)  
**Limitations:**
    
    - Database connection limits
    - External API rate limits
    
**Implementation:** AWS ECS Service Auto Scaling with Fargate launch type.  
    - **Component:** AWS Lambda Functions  
**Primary Strategy:** horizontal  
**Justification:** Inherently scalable by AWS based on event triggers. (SRS 4.5)  
**Limitations:**
    
    - Concurrency limits (configurable)
    - Cold starts
    
**Implementation:** Managed by AWS Lambda service.  
    - **Component:** Amazon RDS PostgreSQL  
**Primary Strategy:** hybrid  
**Justification:** Vertical scaling (instance type) for primary write capacity. Horizontal scaling (read replicas) for read-heavy workloads. (SRS 3.2.2)  
**Limitations:**
    
    - Write operations limited to primary instance
    - Scaling read replicas can have lag
    
**Implementation:** Manual or scheduled vertical scaling; manual addition/removal of read replicas.  
    - **Component:** Amazon DynamoDB  
**Primary Strategy:** horizontal  
**Justification:** Inherently horizontally scalable. Use on-demand or provisioned with auto-scaling. (SRS 3.2.2, 4.2.5)  
**Limitations:**
    
    - Hot partitions if not designed well (though on-demand helps)
    
**Implementation:** AWS managed scaling via on-demand capacity or auto-scaling policies for provisioned capacity.  
    - **Component:** Amazon ElastiCache Redis  
**Primary Strategy:** hybrid  
**Justification:** Vertical scaling (node type). Horizontal scaling via sharding (cluster mode) or read replicas.  
**Limitations:**
    
    - Data distribution for sharding adds complexity
    
**Implementation:** AWS managed scaling features.  
    
  - **Instance Specifications:**
    
    - **Workload Type:** Backend API Service (NestJS)  
**Instance Family:** N/A (Fargate - CPU/Memory defined)  
**Instance Size:** N/A (Fargate)  
**V Cpus:** 0  
**Memory Gb:** 0  
**Storage Type:** N/A (Fargate)  
**Network Performance:** Moderate to High  
**Optimization:** balanced  
    - **Workload Type:** Relational Database (PostgreSQL)  
**Instance Family:** db.m5 or db.r5 (General Purpose or Memory Optimized)  
**Instance Size:** Varies (e.g., .large, .xlarge)  
**V Cpus:** 0  
**Memory Gb:** 0  
**Storage Type:** gp3 or io1 (Provisioned IOPS)  
**Network Performance:** High  
**Optimization:** memory  
    
  - **Multithreading Considerations:**
    
    - **Component:** NestJS Backend Services  
**Threading Model:** single (event loop) with worker pool for async I/O  
**Optimal Threads:** 0  
**Scaling Characteristics:** Scales with number of instances/tasks  
**Bottlenecks:**
    
    - CPU-bound tasks can block event loop if not offloaded
    
    
  - **Specialized Hardware:**
    
    
  - **Storage Scaling:**
    
    - **Storage Type:** database (RDS PostgreSQL)  
**Scaling Method:** vertical (instance storage), provisioned IOPS scaling  
**Performance:** High IOPS, Low Latency  
**Consistency:** Strong  
    - **Storage Type:** database (DynamoDB)  
**Scaling Method:** horizontal (managed by AWS)  
**Performance:** Low Latency, High Throughput  
**Consistency:** Eventual (default) or Strong (configurable)  
    - **Storage Type:** object (S3)  
**Scaling Method:** horizontal (managed by AWS)  
**Performance:** High Throughput  
**Consistency:** Strong (for new objects)  
    
  - **Licensing Implications:**
    
    
  
- **Auto Scaling Trigger Metrics:**
  
  - **Cpu Utilization Triggers:**
    
    - **Component:** NestJS Backend Services (ECS/Fargate)  
**Scale Up Threshold:** 70  
**Scale Down Threshold:** 30  
**Evaluation Periods:** 2  
**Data Points:** 1  
**Justification:** Standard metric for scaling stateless compute based on load.  
    
  - **Memory Consumption Triggers:**
    
    - **Component:** NestJS Backend Services (ECS/Fargate)  
**Scale Up Threshold:** 75  
**Scale Down Threshold:** 40  
**Evaluation Periods:** 2  
**Trigger Condition:** used  
**Justification:** Scales based on memory pressure, important for Node.js applications.  
    
  - **Database Connection Triggers:**
    
    
  - **Queue Length Triggers:**
    
    - **Queue Type:** message (SQS driving Lambda/ECS)  
**Scale Up Threshold:** 100  
**Scale Down Threshold:** 10  
**Age Threshold:** 300s  
**Priority:** medium  
    
  - **Response Time Triggers:**
    
    
  - **Custom Metric Triggers:**
    
    
  - **Disk Iotriggers:**
    
    
  
- **Scaling Limits And Safeguards:**
  
  - **Instance Limits:**
    
    - **Component:** NestJS Backend Services (ECS/Fargate)  
**Min Instances:** 2  
**Max Instances:** 20  
**Justification:** Ensures high availability and handles peak loads while preventing runaway scaling.  
**Cost Implication:** Defines min/max spend on compute for this component.  
    
  - **Cooldown Periods:**
    
    - **Action:** scale-up  
**Duration:** 300s  
**Reasoning:** Allow new instances to stabilize and take load before further scaling.  
**Component:** NestJS Backend Services (ECS/Fargate)  
    - **Action:** scale-down  
**Duration:** 600s  
**Reasoning:** Prevent thrashing by scaling down too quickly if load fluctuates.  
**Component:** NestJS Backend Services (ECS/Fargate)  
    
  - **Scaling Step Sizes:**
    
    - **Component:** NestJS Backend Services (ECS/Fargate)  
**Scale Up Step:** 2  
**Scale Down Step:** 1  
**Step Type:** fixed  
**Rationale:** Moderate scaling steps to adapt to load changes effectively.  
    
  - **Runaway Protection:**
    
    
  - **Graceful Degradation:**
    
    
  - **Resource Quotas:**
    
    
  - **Workload Prioritization:**
    
    
  
- **Cost Optimization Strategy:**
  
  - **Instance Right Sizing:**
    
    - **Component:** NestJS Backend Services (Fargate Tasks)  
**Current Size:** To be determined post-load testing  
**Recommended Size:** To be determined post-load testing  
**Utilization Target:** CPU: 50-60%, Memory: 60-70%  
**Cost Savings:** Potentially significant by avoiding over-provisioning.  
    
  - **Time Based Scaling:**
    
    
  - **Instance Termination Policies:**
    
    - **Policy:** Default (balanced across AZs, then oldest instance)  
**Component:** NestJS Backend Services (ECS/Fargate)  
**Implementation:** AWS ECS default termination policy.  
**Stateful Considerations:**
    
    - Services are designed to be stateless.
    
    
  - **Spot Instance Strategies:**
    
    
  - **Reserved Instance Planning:**
    
    - **Instance Type:** Fargate Compute (vCPU/Memory)  
**Reservation Term:** 1-year  
**Utilization Forecast:** Baseline load determined after initial operational period.  
**Baseline Instances:** 0  
**Payment Option:** partial-upfront  
    - **Instance Type:** RDS PostgreSQL instances  
**Reservation Term:** 1-year  
**Utilization Forecast:** Baseline load determined after initial operational period.  
**Baseline Instances:** 0  
**Payment Option:** partial-upfront  
    
  - **Resource Tracking:**
    
    - **Tracking Method:** tags  
**Granularity:** daily  
**Optimization:** Identify underutilized resources, track spend per component.  
**Alerting:** True  
    
  - **Cleanup Policies:**
    
    - **Resource Type:** orphaned-snapshots  
**Retention Period:** 30d  
**Automation Level:** automated  
    - **Resource Type:** old-images (ECR)  
**Retention Period:** Keep last 5 versions  
**Automation Level:** automated  
    
  
- **Load Testing And Validation:**
  
  - **Baseline Metrics:**
    
    - **Metric:** API P99 Latency  
**Baseline Value:** <500ms  
**Acceptable Variation:** 10%  
**Measurement Method:** CloudWatch Metrics, Load Testing Tools  
    - **Metric:** ECS Service CPU Utilization (Avg)  
**Baseline Value:** 30-50%  
**Acceptable Variation:** 20%  
**Measurement Method:** CloudWatch Metrics  
    
  - **Validation Procedures:**
    
    - **Procedure:** Simulate peak load (e.g., Black Friday traffic) against staging environment.  
**Frequency:** Pre-major release, Annually  
**Success Criteria:**
    
    - System remains stable.
    - Performance metrics (latency, error rates) within SLOs.
    - Auto-scaling functions as expected.
    
**Failure Actions:**
    
    - Identify bottlenecks.
    - Tune scaling policies.
    - Optimize code/infrastructure.
    
    
  - **Synthetic Load Scenarios:**
    
    - **Scenario:** Concurrent Merchant API Usage  
**Load Pattern:** ramp-up  
**Duration:** 1 hour  
**Target Metrics:**
    
    - API Gateway Latency
    - ECS Service CPU/Memory
    - RDS CPU/Connections
    
**Expected Behavior:** Services scale out to meet demand while maintaining performance SLOs.  
    
  - **Scaling Event Monitoring:**
    
    - **Event Type:** scale-up  
**Monitoring Metrics:**
    
    - ECS Service Desired/Running Tasks
    - CPU/Memory Utilization post-scale
    
**Alerting Thresholds:**
    
    - Scaling event fails to complete.
    - Performance does not improve post-scale.
    
**Logging Level:** info  
    
  - **Policy Refinement:**
    
    - **Refinement Trigger:** Sustained high utilization despite max instances.  
**Analysis Method:** Review CloudWatch metrics, application logs, X-Ray traces.  
**Adjustment Type:** maxInstances, instance size, code optimization  
**Validation Required:** True  
    
  - **Effectiveness Kpis:**
    
    - **Kpi:** Cost per X (e.g., per 1000 active users, per 1M API calls)  
**Measurement:** Monthly AWS cost / Monthly KPI volume  
**Target:** Downward trend or stable within budget  
**Frequency:** Monthly  
    - **Kpi:** Scaling Event Success Rate  
**Measurement:** (Successful Scaling Events / Total Scaling Events) * 100  
**Target:** >99%  
**Frequency:** Weekly  
    
  - **Feedback Mechanisms:**
    
    - **Mechanism:** manual-review  
**Implementation:** Quarterly review of scaling performance and costs by DevOps/Platform team.  
**Frequency:** Quarterly  
**Decision Criteria:**
    
    - Cost trends
    - Performance SLO adherence
    - Frequency of scaling events
    
    
  
- **Project Specific Scaling Policies:**
  
  - **Policies:**
    
    - **Id:** ecs-fargate-backend-services  
**Type:** Auto  
**Component:** NestJS Backend Services on ECS/Fargate  
**Rules:**
    
    - **Metric:** CPUUtilization  
**Threshold:** 70  
**Operator:** GREATER_THAN_OR_EQUAL  
**Scale Change:** 1  
**Cooldown:**
    
    - **Scale Up Seconds:** 300
    - **Scale Down Seconds:** 600
    
**Evaluation Periods:** 2  
**Data Points To Alarm:** 1  
    - **Metric:** MemoryUtilization  
**Threshold:** 75  
**Operator:** GREATER_THAN_OR_EQUAL  
**Scale Change:** 1  
**Cooldown:**
    
    - **Scale Up Seconds:** 300
    - **Scale Down Seconds:** 600
    
**Evaluation Periods:** 2  
**Data Points To Alarm:** 1  
    
**Safeguards:**
    
    - **Min Instances:** 2
    - **Max Instances:** 20
    - **Max Scaling Rate:** Default
    - **Cost Threshold:** N/A
    
**Schedule:**
    
    - **Enabled:** False
    - **Timezone:** UTC
    - **Rules:**
      
      
    
    - **Id:** lambda-sqs-consumers  
**Type:** Auto  
**Component:** AWS Lambda functions triggered by SQS  
**Rules:**
    
    - **Metric:** ApproximateNumberOfMessagesVisible (SQS)  
**Threshold:** 100  
**Operator:** GREATER_THAN_OR_EQUAL  
**Scale Change:** 0  
**Cooldown:**
    
    - **Scale Up Seconds:** 60
    - **Scale Down Seconds:** 300
    
**Evaluation Periods:** 1  
**Data Points To Alarm:** 1  
    
**Safeguards:**
    
    - **Min Instances:** 0
    - **Max Instances:** 1000
    - **Max Scaling Rate:** Default
    - **Cost Threshold:** N/A
    
**Schedule:**
    
    - **Enabled:** False
    - **Timezone:** UTC
    - **Rules:**
      
      
    
    
  - **Configuration:**
    
    - **Min Instances:** 2 (for ECS services)
    - **Max Instances:** 20 (for ECS services, adjustable)
    - **Default Timeout:** 30s (ALB timeout)
    - **Region:** Primary AWS Region (e.g., me-south-1)
    - **Resource Group:** AdManagerPlatformResources
    - **Notification Endpoint:** DevOps SNS Topic ARN
    - **Logging Level:** INFO
    - **Vpc Id:** Dedicated AdManager VPC ID
    - **Instance Type:** Fargate (CPU/Memory units), RDS (e.g., db.m5.large)
    - **Enable Detailed Monitoring:** true (for CloudWatch)
    - **Scaling Mode:** reactive
    - **Cost Optimization:**
      
      - **Spot Instances Enabled:** False
      - **Spot Percentage:** 0
      - **Reserved Instances Planned:** True
      
    - **Performance Targets:**
      
      - **Response Time:** <500ms P99 for APIs
      - **Throughput:** Handle [Z thousand] concurrent users and [N impressions/sec]
      - **Availability:** 99.9% for critical services
      
    
  - **Environment Specific Policies:**
    
    - **Environment:** production  
**Scaling Enabled:** True  
**Aggressiveness:** moderate  
**Cost Priority:** balanced  
    - **Environment:** staging  
**Scaling Enabled:** True  
**Aggressiveness:** conservative  
**Cost Priority:** cost-optimized  
    - **Environment:** development  
**Scaling Enabled:** False  
**Aggressiveness:** conservative  
**Cost Priority:** cost-optimized  
    
  
- **Implementation Priority:**
  
  - **Component:** NestJS Backend Services (ECS/Fargate) Auto Scaling  
**Priority:** high  
**Dependencies:**
    
    - Containerized application deployment
    - ECS Cluster and Service setup
    - CloudWatch metrics configured
    
**Estimated Effort:** Medium  
**Risk Level:** low  
  - **Component:** AWS Lambda Scaling for SQS Consumers  
**Priority:** high  
**Dependencies:**
    
    - Lambda function deployment
    - SQS queue setup
    - Event source mapping
    
**Estimated Effort:** Low  
**Risk Level:** low  
  - **Component:** Amazon RDS PostgreSQL Read Replica Strategy  
**Priority:** medium  
**Dependencies:**
    
    - RDS instance setup
    - Monitoring of read load
    
**Estimated Effort:** Medium  
**Risk Level:** low  
  - **Component:** Amazon DynamoDB Auto Scaling/On-Demand Configuration  
**Priority:** medium  
**Dependencies:**
    
    - DynamoDB table creation
    
**Estimated Effort:** Low  
**Risk Level:** low  
  
- **Risk Assessment:**
  
  - **Risk:** Misconfigured auto-scaling thresholds leading to over/under provisioning.  
**Impact:** medium  
**Probability:** medium  
**Mitigation:** Thorough load testing, continuous monitoring, and iterative tuning of scaling policies. Start with conservative thresholds.  
**Contingency Plan:** Manual scaling overrides. Alerting on sustained high/low utilization or performance degradation.  
  - **Risk:** Scaling limits (AWS account limits, database connections, external API rate limits) hit during peak load.  
**Impact:** high  
**Probability:** low  
**Mitigation:** Monitor resource usage against limits. Request limit increases proactively. Implement circuit breakers and retries for external APIs.  
**Contingency Plan:** Throttle requests. Graceful degradation of non-critical features.  
  - **Risk:** Runaway scaling leading to unexpected high costs.  
**Impact:** high  
**Probability:** low  
**Mitigation:** Set sensible max instance limits for auto-scaling groups. Implement budget alerts.  
**Contingency Plan:** Manual intervention to cap scaling. Investigate root cause (e.g., DDoS, bug).  
  - **Risk:** Cold starts for AWS Lambda impacting performance for latency-sensitive operations.  
**Impact:** medium  
**Probability:** medium  
**Mitigation:** Provisioned concurrency for critical Lambda functions. Optimize function startup time.  
**Contingency Plan:** Accept occasional higher latency for less critical functions.  
  
- **Recommendations:**
  
  - **Category:** Monitoring & Alerting  
**Recommendation:** Implement comprehensive monitoring for key scaling metrics (CPU, memory, queue length, latency) and configure actionable alerts for scaling events, limits, and performance degradation.  
**Justification:** Ensures visibility into scaling behavior and allows for proactive issue resolution.  
**Priority:** high  
**Implementation Notes:** Utilize CloudWatch Metrics, Alarms, and Dashboards.  
  - **Category:** Testing & Validation  
**Recommendation:** Conduct regular load testing to validate scaling policies, identify bottlenecks, and ensure performance SLOs are met under various load conditions.  
**Justification:** Provides confidence in the system's ability to handle expected and peak loads effectively.  
**Priority:** high  
**Implementation Notes:** Use a dedicated staging environment that mirrors production as closely as possible.  
  - **Category:** Cost Optimization  
**Recommendation:** Continuously monitor resource utilization and costs. Regularly review and right-size instances/tasks. Leverage reserved instances/savings plans for baseline capacity.  
**Justification:** Ensures efficient use of cloud resources and manages operational expenditure.  
**Priority:** medium  
**Implementation Notes:** Utilize AWS Cost Explorer, Trusted Advisor, and tagging for cost allocation and analysis.  
  - **Category:** Database Scaling  
**Recommendation:** For RDS PostgreSQL, start with vertical scaling and implement read replicas for read-heavy workloads. Monitor query performance closely and optimize indexes. For DynamoDB, leverage on-demand capacity or fine-tune auto-scaling for provisioned capacity based on observed traffic patterns.  
**Justification:** Ensures database performance and scalability, which are often critical bottlenecks.  
**Priority:** high  
**Implementation Notes:** Use RDS Performance Insights and DynamoDB CloudWatch metrics for monitoring.  
  


---

