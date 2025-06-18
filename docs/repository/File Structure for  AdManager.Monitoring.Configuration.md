# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines NPM dependencies for the AWS CDK project, including aws-cdk-lib, specific AWS service modules for CloudWatch, SNS, etc., and TypeScript related packages.  
**Template:** Node.js Package Manifest  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../package.json  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Project dependency management
    
**Requirement Ids:**
    
    
**Purpose:** To manage project dependencies and scripts for the CDK application.  
**Logic Description:** Specifies dependencies such as 'aws-cdk-lib', '@aws-cdk/aws-cloudwatch', '@aws-cdk/aws-sns', '@aws-cdk/aws-sns-subscriptions', '@aws-cdk/aws-lambda' (if needed for integrations), 'typescript', '@types/node'. Includes scripts for 'cdk synth', 'cdk deploy', 'cdk diff'.  
**Documentation:**
    
    - **Summary:** NPM package manifest file for the monitoring configuration CDK project.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** cdk.json  
**Description:** AWS CDK toolkit configuration file. Specifies the entry point for the CDK application (e.g., 'npx ts-node --prefer-ts-exts bin/monitoring-stack-app.ts') and other context values for CDK operations.  
**Template:** AWS CDK Configuration  
**Dependancy Level:** 0  
**Name:** cdk  
**Type:** Configuration  
**Relative Path:** ../cdk.json  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - CDK application configuration
    
**Requirement Ids:**
    
    
**Purpose:** To configure the AWS CDK toolkit for synthesizing and deploying the monitoring stack.  
**Logic Description:** Contains JSON configuration for the CDK CLI, primarily defining the 'app' command to execute the CDK application entry point. May also include feature flags or context variables for CDK behavior.  
**Documentation:**
    
    - **Summary:** Configuration file for the AWS CDK toolkit.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** tsconfig.json  
**Description:** TypeScript compiler configuration for the AWS CDK project. Defines compiler options such as target ECMAScript version, module system, strict type checking, and paths.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ../tsconfig.json  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript compilation settings
    
**Requirement Ids:**
    
    
**Purpose:** To configure the TypeScript compiler for transpiling CDK application code.  
**Logic Description:** Standard TypeScript configuration file with options like 'target', 'module', 'strict', 'esModuleInterop', 'outDir', and 'rootDir' set appropriately for a CDK project written in TypeScript.  
**Documentation:**
    
    - **Summary:** TypeScript compiler options for the project.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** bin/monitoring-stack-app.ts  
**Description:** The entry point for the AWS CDK application. This script instantiates the main monitoring stack.  
**Template:** AWS CDK App Entry Point  
**Dependancy Level:** 1  
**Name:** monitoring-stack-app  
**Type:** Application  
**Relative Path:** bin/monitoring-stack-app.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - CDK application initialization
    
**Requirement Ids:**
    
    - 5.1
    
**Purpose:** To initialize and define the CDK application, creating instances of the monitoring stack(s).  
**Logic Description:** Imports the 'aws-cdk-lib' and the main stack definition (e.g., 'MonitoringStack'). Creates a new CDK App instance. Instantiates 'MonitoringStack', passing necessary environment configurations (account, region).  
**Documentation:**
    
    - **Summary:** Main executable for the CDK monitoring application.
    
**Namespace:** AdManager.Monitoring.App  
**Metadata:**
    
    - **Category:** InfrastructureAsCode
    
- **Path:** lib/monitoring-stack.ts  
**Description:** Defines the main AWS CDK stack for monitoring resources. This stack will compose various constructs for alarms, dashboards, and notifications.  
**Template:** AWS CDK Stack  
**Dependancy Level:** 2  
**Name:** monitoring-stack  
**Type:** Stack  
**Relative Path:** lib/monitoring-stack.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props?: cdk.StackProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Resource aggregation for monitoring
    - Stack definition
    
**Requirement Ids:**
    
    - 5.1
    - REQ-POA-003
    - REQ-POA-015
    
**Purpose:** To define and provision all monitoring and alerting resources as a single CloudFormation stack using AWS CDK.  
**Logic Description:** Extends 'cdk.Stack'. The constructor instantiates various monitoring constructs: SNS topics for alerts, specific alarm constructs (API Gateway, Lambda, RDS, etc.), and the system health dashboard construct. Passes configurations and dependencies (like SNS topic ARNs) to these constructs.  
**Documentation:**
    
    - **Summary:** Main CDK stack definition orchestrating the creation of all monitoring resources.
    
**Namespace:** AdManager.Monitoring.Stacks  
**Metadata:**
    
    - **Category:** InfrastructureAsCode
    
- **Path:** lib/constructs/notifications/sns-topics.construct.ts  
**Description:** AWS CDK construct for creating and configuring SNS topics used for alert notifications, potentially categorized by severity or service.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 3  
**Name:** sns-topics.construct  
**Type:** Construct  
**Relative Path:** lib/constructs/notifications/sns-topics.construct.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** criticalAlertsTopic  
**Type:** sns.ITopic  
**Attributes:** public|readonly  
    - **Name:** warningAlertsTopic  
**Type:** sns.ITopic  
**Attributes:** public|readonly  
    - **Name:** infoAlertsTopic  
**Type:** sns.ITopic  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props?: SnsTopicsProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - SNS topic creation
    - Alert categorization by topic
    
**Requirement Ids:**
    
    - REQ-POA-003
    
**Purpose:** To define SNS topics that will receive notifications from CloudWatch Alarms and distribute them to subscribers.  
**Logic Description:** Extends 'Construct'. Defines one or more SNS topics (e.g., for P1/Critical, P2/Warning, P3/Info alerts). Exposes these topics as public readonly properties for other constructs (alarms, subscriptions) to reference. May apply encryption or access policies to topics.  
**Documentation:**
    
    - **Summary:** Creates SNS topics for different alert severity levels or categories.
    
**Namespace:** AdManager.Monitoring.Constructs.Notifications  
**Metadata:**
    
    - **Category:** InfrastructureAsCode
    
- **Path:** lib/constructs/notifications/alert-subscriptions.construct.ts  
**Description:** AWS CDK construct for creating subscriptions to SNS topics, such as email (SES), SMS, or Lambda functions for PagerDuty/OpsGenie integration.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 4  
**Name:** alert-subscriptions.construct  
**Type:** Construct  
**Relative Path:** lib/constructs/notifications/alert-subscriptions.construct.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: AlertSubscriptionsProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - SNS topic subscriptions
    - Notification channel setup
    
**Requirement Ids:**
    
    - REQ-POA-003
    
**Purpose:** To configure how alerts published to SNS topics are delivered to operational teams or systems.  
**Logic Description:** Extends 'Construct'. Takes SNS topic(s) and subscriber endpoint configurations (e.g., email addresses, Lambda ARN for PagerDuty) as props. Creates 'sns.Subscription' resources for each endpoint to the respective topics. For example, uses 'sns_subscriptions.EmailSubscription' or 'sns_subscriptions.LambdaSubscription'.  
**Documentation:**
    
    - **Summary:** Configures subscriptions (email, Lambda for PagerDuty/OpsGenie) to the alert SNS topics.
    
**Namespace:** AdManager.Monitoring.Constructs.Notifications  
**Metadata:**
    
    - **Category:** InfrastructureAsCode
    
- **Path:** lib/constructs/alarms/base-alarm.construct.ts  
**Description:** An abstract base class or a utility class providing common functionality or configuration for creating CloudWatch Alarms.  
**Template:** AWS CDK Construct (Utility/Base)  
**Dependancy Level:** 3  
**Name:** base-alarm.construct  
**Type:** Construct  
**Relative Path:** lib/constructs/alarms/base-alarm.construct.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** createSnsAlarmAction  
**Parameters:**
    
    - topic: sns.ITopic
    
**Return Type:** cloudwatch.actions.SnsAction  
**Attributes:** protected|static  
    
**Implemented Features:**
    
    - Common alarm configuration logic
    - Alarm action creation
    
**Requirement Ids:**
    
    - REQ-POA-003
    
**Purpose:** To provide reusable logic for creating CloudWatch Alarms, such as standardizing alarm names or setting common properties.  
**Logic Description:** This class might not be directly instantiated but inherited by specific alarm constructs or provide static helper methods. For example, a method to create an SNS action for alarms based on a given topic. This helps in maintaining consistency across different alarm definitions.  
**Documentation:**
    
    - **Summary:** Provides base functionality or helper methods for creating CloudWatch Alarms.
    
**Namespace:** AdManager.Monitoring.Constructs.Alarms  
**Metadata:**
    
    - **Category:** InfrastructureAsCode
    
- **Path:** lib/constructs/alarms/api-gateway-alarms.construct.ts  
**Description:** AWS CDK construct for defining CloudWatch Alarms specific to API Gateway metrics (e.g., 5XX errors, latency, request count).  
**Template:** AWS CDK Construct  
**Dependancy Level:** 4  
**Name:** api-gateway-alarms.construct  
**Type:** Construct  
**Relative Path:** lib/constructs/alarms/api-gateway-alarms.construct.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: ApiGatewayAlarmsProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - API Gateway 5XX error alarms
    - API Gateway latency alarms
    - API Gateway request count alarms
    
**Requirement Ids:**
    
    - REQ-POA-003
    - 5.1
    
**Purpose:** To monitor the health and performance of API Gateways and alert on critical issues.  
**Logic Description:** Extends 'Construct' or 'BaseAlarmConstruct'. Creates 'cloudwatch.Alarm' resources for key API Gateway metrics such as '5XXError', 'Latency', 'Count'. Configures thresholds, periods, evaluation periods, and datapoints to alarm. Associates alarms with SNS actions (topics passed in props).  
**Documentation:**
    
    - **Summary:** Defines CloudWatch alarms for API Gateway metrics like error rates and latency.
    
**Namespace:** AdManager.Monitoring.Constructs.Alarms  
**Metadata:**
    
    - **Category:** InfrastructureAsCode
    
- **Path:** lib/constructs/alarms/lambda-alarms.construct.ts  
**Description:** AWS CDK construct for defining CloudWatch Alarms specific to Lambda function metrics (e.g., errors, throttles, duration).  
**Template:** AWS CDK Construct  
**Dependancy Level:** 4  
**Name:** lambda-alarms.construct  
**Type:** Construct  
**Relative Path:** lib/constructs/alarms/lambda-alarms.construct.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: LambdaAlarmsProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Lambda error alarms
    - Lambda throttle alarms
    - Lambda duration alarms
    
**Requirement Ids:**
    
    - REQ-POA-003
    - 5.1
    
**Purpose:** To monitor the health and performance of critical Lambda functions and alert on issues.  
**Logic Description:** Extends 'Construct'. Creates 'cloudwatch.Alarm' resources for key Lambda metrics such as 'Errors', 'Throttles', 'Duration', 'Invocations'. Props will specify Lambda function names/ARNs, thresholds, and SNS topics. Can create alarms per function or for a group of functions.  
**Documentation:**
    
    - **Summary:** Defines CloudWatch alarms for Lambda function metrics like errors, throttles, and invocation duration.
    
**Namespace:** AdManager.Monitoring.Constructs.Alarms  
**Metadata:**
    
    - **Category:** InfrastructureAsCode
    
- **Path:** lib/constructs/alarms/database-alarms.construct.ts  
**Description:** AWS CDK construct for defining CloudWatch Alarms specific to database metrics (e.g., RDS CPUUtilization, DBConnections; DynamoDB Read/WriteThrottleEvents).  
**Template:** AWS CDK Construct  
**Dependancy Level:** 4  
**Name:** database-alarms.construct  
**Type:** Construct  
**Relative Path:** lib/constructs/alarms/database-alarms.construct.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: DatabaseAlarmsProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - RDS CPU utilization alarms
    - RDS DB connection alarms
    - DynamoDB throttle alarms
    
**Requirement Ids:**
    
    - REQ-POA-003
    - 5.1
    
**Purpose:** To monitor the health and performance of database resources (RDS, DynamoDB) and alert on critical issues.  
**Logic Description:** Extends 'Construct'. Creates alarms for RDS metrics like 'CPUUtilization', 'DatabaseConnections', 'FreeStorageSpace'. Creates alarms for DynamoDB metrics like 'ReadThrottleEvents', 'WriteThrottleEvents', 'ConsumedReadCapacityUnits', 'ConsumedWriteCapacityUnits'. Props specify database identifiers, thresholds, and SNS topics.  
**Documentation:**
    
    - **Summary:** Defines CloudWatch alarms for database metrics (RDS and DynamoDB).
    
**Namespace:** AdManager.Monitoring.Constructs.Alarms  
**Metadata:**
    
    - **Category:** InfrastructureAsCode
    
- **Path:** lib/constructs/alarms/application-metric-alarms.construct.ts  
**Description:** AWS CDK construct for defining CloudWatch Alarms based on custom application-specific metrics published by services (e.g., specific business process failures, queue processing delays).  
**Template:** AWS CDK Construct  
**Dependancy Level:** 4  
**Name:** application-metric-alarms.construct  
**Type:** Construct  
**Relative Path:** lib/constructs/alarms/application-metric-alarms.construct.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: ApplicationMetricAlarmsProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Custom application metric alarms
    
**Requirement Ids:**
    
    - REQ-POA-003
    - 5.1
    
**Purpose:** To monitor key custom business or application performance indicators and alert on deviations.  
**Logic Description:** Extends 'Construct'. Creates 'cloudwatch.Alarm' resources based on custom metrics published to CloudWatch by various application services. Props will include metric names, namespaces, dimensions, thresholds, and SNS topics. Useful for monitoring business KPIs or specific error conditions not covered by standard AWS metrics.  
**Documentation:**
    
    - **Summary:** Defines CloudWatch alarms for custom application-level metrics.
    
**Namespace:** AdManager.Monitoring.Constructs.Alarms  
**Metadata:**
    
    - **Category:** InfrastructureAsCode
    
- **Path:** lib/constructs/dashboards/system-health-dashboard.construct.ts  
**Description:** AWS CDK construct for creating the consolidated System Health Dashboard. This dashboard will display critical system component statuses, KPIs, and active alerts.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 4  
**Name:** system-health-dashboard.construct  
**Type:** Construct  
**Relative Path:** lib/constructs/dashboards/system-health-dashboard.construct.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** dashboard  
**Type:** cloudwatch.Dashboard  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: SystemHealthDashboardProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - System health dashboard creation
    - KPI visualization
    - Active alert display
    
**Requirement Ids:**
    
    - REQ-POA-015
    - 5.1
    
**Purpose:** To provide Platform Administrators with a single pane of glass for real-time system health monitoring.  
**Logic Description:** Extends 'Construct'. Creates a 'cloudwatch.Dashboard' resource. Adds various widgets to the dashboard: 'GraphWidget' for KPIs (API latency, error rates, CPU/memory), 'AlarmWidget' to show status of critical alarms, 'TextWidget' for titles or static info. Props might include lists of alarms to display, metric definitions, and service identifiers.  
**Documentation:**
    
    - **Summary:** Creates the main System Health CloudWatch Dashboard with key metrics and alarm statuses.
    
**Namespace:** AdManager.Monitoring.Constructs.Dashboards  
**Metadata:**
    
    - **Category:** InfrastructureAsCode
    
- **Path:** lib/constructs/dashboards/dashboard-widget-factory.ts  
**Description:** A utility class or set of functions to help create common types of CloudWatch Dashboard widgets with consistent styling and configurations.  
**Template:** TypeScript Utility  
**Dependancy Level:** 3  
**Name:** dashboard-widget-factory  
**Type:** Utility  
**Relative Path:** lib/constructs/dashboards/dashboard-widget-factory.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    - FactoryMethod
    
**Members:**
    
    
**Methods:**
    
    - **Name:** createGraphWidget  
**Parameters:**
    
    - title: string
    - metrics: cloudwatch.IMetric[]
    - options?: cloudwatch.GraphWidgetProps
    
**Return Type:** cloudwatch.GraphWidget  
**Attributes:** public|static  
    - **Name:** createAlarmStatusWidget  
**Parameters:**
    
    - title: string
    - alarms: cloudwatch.IAlarm[]
    - options?: cloudwatch.AlarmStatusWidgetProps
    
**Return Type:** cloudwatch.AlarmStatusWidget  
**Attributes:** public|static  
    - **Name:** createSingleValueWidget  
**Parameters:**
    
    - title: string
    - metrics: cloudwatch.IMetric[]
    - options?: cloudwatch.SingleValueWidgetProps
    
**Return Type:** cloudwatch.SingleValueWidget  
**Attributes:** public|static  
    
**Implemented Features:**
    
    - Reusable dashboard widget creation
    
**Requirement Ids:**
    
    - REQ-POA-015
    
**Purpose:** To simplify and standardize the creation of widgets for CloudWatch Dashboards.  
**Logic Description:** Provides static methods or a factory class to generate common CloudWatch dashboard widgets like graph widgets, alarm status widgets, and single value widgets. These methods encapsulate common configurations (e.g., width, height, default period) and ensure consistency across dashboards.  
**Documentation:**
    
    - **Summary:** Factory for creating standardized CloudWatch Dashboard widgets.
    
**Namespace:** AdManager.Monitoring.Constructs.Dashboards.Utils  
**Metadata:**
    
    - **Category:** InfrastructureAsCode
    
- **Path:** lib/interfaces/alarm-props.interface.ts  
**Description:** TypeScript interface defining the properties for various alarm constructs, including thresholds, metric names, dimensions, and SNS topic ARNs.  
**Template:** TypeScript Interface  
**Dependancy Level:** 3  
**Name:** alarm-props.interface  
**Type:** Interface  
**Relative Path:** lib/interfaces/alarm-props.interface.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** metricName  
**Type:** string  
**Attributes:** readonly  
    - **Name:** namespace  
**Type:** string  
**Attributes:** readonly  
    - **Name:** dimensionsMap?  
**Type:** { [key: string]: string }  
**Attributes:** readonly  
    - **Name:** threshold  
**Type:** number  
**Attributes:** readonly  
    - **Name:** evaluationPeriods  
**Type:** number  
**Attributes:** readonly  
    - **Name:** periodInSeconds  
**Type:** number  
**Attributes:** readonly  
    - **Name:** comparisonOperator  
**Type:** cloudwatch.ComparisonOperator  
**Attributes:** readonly  
    - **Name:** statistic?  
**Type:** string  
**Attributes:** readonly  
    - **Name:** alarmActionsSnsTopics  
**Type:** sns.ITopic[]  
**Attributes:** readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Alarm property definition
    
**Requirement Ids:**
    
    - REQ-POA-003
    
**Purpose:** To provide a typed contract for properties passed to alarm creation constructs.  
**Logic Description:** Defines interfaces like 'SpecificAlarmProps' (e.g., 'ApiGatewayAlarmProps', 'LambdaAlarmProps') which extend a base 'AlarmProps'. These interfaces specify necessary parameters like metric details, thresholds, evaluation criteria, and the SNS topics to notify.  
**Documentation:**
    
    - **Summary:** Type definitions for properties required by alarm constructs.
    
**Namespace:** AdManager.Monitoring.Interfaces  
**Metadata:**
    
    - **Category:** Typing
    
- **Path:** lib/interfaces/dashboard-props.interface.ts  
**Description:** TypeScript interface defining the properties for dashboard constructs, such as lists of metrics or alarms to include.  
**Template:** TypeScript Interface  
**Dependancy Level:** 3  
**Name:** dashboard-props.interface  
**Type:** Interface  
**Relative Path:** lib/interfaces/dashboard-props.interface.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** dashboardName  
**Type:** string  
**Attributes:** readonly  
    - **Name:** criticalAlarms?  
**Type:** cloudwatch.IAlarm[]  
**Attributes:** readonly  
    - **Name:** keyPerformanceIndicators?  
**Type:** Array<{title: string, metrics: cloudwatch.IMetric[]}>  
**Attributes:** readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dashboard property definition
    
**Requirement Ids:**
    
    - REQ-POA-015
    
**Purpose:** To provide a typed contract for properties passed to dashboard creation constructs.  
**Logic Description:** Defines interfaces like 'SystemHealthDashboardProps' specifying the data needed to build the dashboard, such as references to important alarms, lists of metrics for various KPIs, and service identifiers.  
**Documentation:**
    
    - **Summary:** Type definitions for properties required by dashboard constructs.
    
**Namespace:** AdManager.Monitoring.Interfaces  
**Metadata:**
    
    - **Category:** Typing
    
- **Path:** lib/config/alarm-configurations.ts  
**Description:** Contains constants and configurations for alarm thresholds, periods, evaluation periods, namespaces, and metric names used across different alarm constructs.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 2  
**Name:** alarm-configurations  
**Type:** Configuration  
**Relative Path:** lib/config/alarm-configurations.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** API_GATEWAY_5XX_ERROR_THRESHOLD  
**Type:** number  
**Attributes:** export|const  
    - **Name:** API_GATEWAY_LATENCY_P99_THRESHOLD_MS  
**Type:** number  
**Attributes:** export|const  
    - **Name:** LAMBDA_ERROR_RATE_THRESHOLD_PERCENT  
**Type:** number  
**Attributes:** export|const  
    - **Name:** DEFAULT_EVALUATION_PERIODS  
**Type:** number  
**Attributes:** export|const  
    - **Name:** CRITICAL_ALARM_PERIOD_SECONDS  
**Type:** number  
**Attributes:** export|const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Centralized alarm thresholds
    - Metric configuration constants
    
**Requirement Ids:**
    
    - REQ-POA-003
    - 5.1
    
**Purpose:** To centralize and manage the specific values used for configuring CloudWatch Alarms.  
**Logic Description:** Exports various constant values for thresholds (e.g., API error rate > 5%), periods (e.g., 5 minutes), evaluation counts (e.g., 3 out of 5 datapoints), and metric/namespace details. This allows for easier tuning and maintenance of alarm sensitivity.  
**Documentation:**
    
    - **Summary:** Stores and exports configuration constants for alarm definitions.
    
**Namespace:** AdManager.Monitoring.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** lib/config/notification-configurations.ts  
**Description:** Contains configuration for notification endpoints, such as email addresses for different alert severities, or ARNs for PagerDuty/OpsGenie integration Lambdas/SNS topics.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 2  
**Name:** notification-configurations  
**Type:** Configuration  
**Relative Path:** lib/config/notification-configurations.ts  
**Repository Id:** REPO-MONITORCONF-004  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** CRITICAL_ALERTS_EMAIL_ENDPOINT  
**Type:** string  
**Attributes:** export|const  
    - **Name:** WARNING_ALERTS_EMAIL_ENDPOINT  
**Type:** string  
**Attributes:** export|const  
    - **Name:** PAGERDUTY_INTEGRATION_SNS_TOPIC_ARN_OR_LAMBDA_ARN?  
**Type:** string  
**Attributes:** export|const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Notification endpoint configuration
    
**Requirement Ids:**
    
    - REQ-POA-003
    
**Purpose:** To centralize the configuration of where alert notifications are sent.  
**Logic Description:** Exports string constants for email addresses, SNS topic ARNs for specific integrations (like PagerDuty), or other notification channel identifiers. This allows for easy updates to notification recipients without changing CDK construct code.  
**Documentation:**
    
    - **Summary:** Stores and exports configuration constants for notification endpoints.
    
**Namespace:** AdManager.Monitoring.Config  
**Metadata:**
    
    - **Category:** Configuration
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableDetailedLambdaAlarms
  - enablePagerDutyIntegrationHighSeverity
  - enableCustomBusinessMetricDashboardSection
  
- **Database Configs:**
  
  


---

