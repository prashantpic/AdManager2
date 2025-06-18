# Software Design Specification: AdManager.Monitoring.Configuration

## 1. Introduction

### 1.1 Purpose
This document outlines the software design specifications for the `AdManager.Monitoring.Configuration` repository. The primary purpose of this repository is to define, configure, and manage monitoring, alerting, and dashboarding resources for the Ad Manager Platform as Infrastructure as Code (IaC) using the AWS Cloud Development Kit (CDK). This includes setting up CloudWatch Alarms for critical metrics, CloudWatch Dashboards for operational visibility, and SNS topics for alert notifications.

### 1.2 Scope
The scope of this repository includes:
*   Definition of SNS topics for alert notifications.
*   Configuration of subscriptions to these SNS topics (e.g., email, PagerDuty/OpsGenie integrations).
*   Definition of CloudWatch Alarms for:
    *   API Gateway metrics (e.g., error rates, latency).
    *   AWS Lambda function metrics (e.g., errors, throttles, duration).
    *   Database metrics (e.g., RDS CPU utilization, DynamoDB throttles).
    *   Custom application-specific metrics.
*   Definition of a consolidated System Health CloudWatch Dashboard.
*   Centralized configuration for alarm thresholds and notification endpoints.
*   The CDK application structure for deploying these resources.

This repository does *not* include the implementation of the services being monitored, nor the agent-side custom metric publishing logic.

### 1.3 Key Technologies
*   **AWS Cloud Development Kit (CDK) v2.127.0**: For defining cloud infrastructure in code.
*   **TypeScript v5.3.3**: The programming language for writing CDK constructs.
*   **Node.js v20.11.1 LTS**: The runtime environment for CDK.
*   **Amazon CloudWatch**: For alarms and dashboards.
*   **Amazon Simple Notification Service (SNS)**: For alert notifications.

## 2. System Overview
The `AdManager.Monitoring.Configuration` system uses AWS CDK to provision a comprehensive monitoring and alerting setup. The core components are:

1.  **CDK Application (`monitoring-stack-app.ts`)**: The entry point that initializes and deploys the `MonitoringStack`.
2.  **Monitoring Stack (`monitoring-stack.ts`)**: The main CDK stack that orchestrates the creation of all monitoring resources. It instantiates various constructs for notifications, alarms, and dashboards.
3.  **Notification Constructs**:
    *   `SnsTopicsConstruct`: Creates categorized SNS topics (e.g., critical, warning).
    *   `AlertSubscriptionsConstruct`: Subscribes various endpoints (email, Lambda for PagerDuty) to these SNS topics.
4.  **Alarm Constructs**: A set of specialized constructs (e.g., `ApiGatewayAlarmsConstruct`, `LambdaAlarmsConstruct`) that define specific CloudWatch Alarms based on metrics from different AWS services or custom application metrics. These alarms, when triggered, publish messages to the configured SNS topics.
5.  **Dashboard Constructs**:
    *   `SystemHealthDashboardConstruct`: Creates a centralized CloudWatch Dashboard displaying key performance indicators (KPIs), critical component statuses, and active alerts.
    *   `DashboardWidgetFactory`: A utility to create standardized dashboard widgets.
6.  **Configuration Files**:
    *   `alarm-configurations.ts`: Stores constants for alarm thresholds, periods, and metric details.
    *   `notification-configurations.ts`: Stores constants for notification endpoints.

The flow is as follows: AWS services and custom applications emit metrics to CloudWatch. CloudWatch Alarms, defined by this repository, monitor these metrics. If a threshold is breached, an alarm triggers an action, sending a notification to an SNS topic. Subscribers to this SNS topic (e.g., email addresses, PagerDuty integration Lambda) then receive the alert. The System Health Dashboard provides a visual overview of these metrics and alarm statuses.

This setup directly addresses REQ-POA-003 (configure CloudWatch Alarms), section 5.1 of SRS (Monitoring, Logging, and Alerting - Set alarms, Create custom dashboards), and REQ-POA-015 (consolidated System Health Dashboard).

## 3. Detailed Design

### 3.1 Core CDK Application Files

#### 3.1.1 `package.json`
*   **Path**: `monitoring/configuration/package.json`
*   **Description**: Defines NPM dependencies for the AWS CDK project.
*   **Purpose**: To manage project dependencies and scripts for the CDK application.
*   **Key Dependencies**:
    *   `aws-cdk-lib`: Core CDK library.
    *   `constructs`: Base class for CDK constructs.
    *   `@aws-cdk/aws-cloudwatch` (or `aws-cdk-lib/aws-cloudwatch` in v2): For CloudWatch resources.
    *   `@aws-cdk/aws-sns` (or `aws-cdk-lib/aws-sns`): For SNS topics.
    *   `@aws-cdk/aws-sns-subscriptions` (or `aws-cdk-lib/aws-sns-subscriptions`): For SNS subscriptions.
    *   `@aws-cdk/aws-lambda` (or `aws-cdk-lib/aws-lambda`): If Lambda functions are used for alert integrations (e.g., PagerDuty).
    *   `typescript`: TypeScript compiler.
    *   `@types/node`: Node.js type definitions.
    *   `ts-node`: To run TypeScript files directly.
*   **Scripts**:
    *   `build`: `tsc`
    *   `watch`: `tsc -w`
    *   `cdk`: `cdk`
    *   `deploy`: `cdk deploy`
    *   `synth`: `cdk synth`
    *   `diff`: `cdk diff`

#### 3.1.2 `cdk.json`
*   **Path**: `monitoring/configuration/cdk.json`
*   **Description**: AWS CDK toolkit configuration file.
*   **Purpose**: To configure the AWS CDK toolkit for synthesizing and deploying the monitoring stack.
*   **Key Configuration**:
    *   `app`: `npx ts-node --prefer-ts-exts bin/monitoring-stack-app.ts` (Entry point for CDK execution).
    *   Context variables (optional): e.g., environment names, feature flags from `configuration.json_data.FeatureToggles`.

#### 3.1.3 `tsconfig.json`
*   **Path**: `monitoring/configuration/tsconfig.json`
*   **Description**: TypeScript compiler configuration for the AWS CDK project.
*   **Purpose**: To configure the TypeScript compiler for transpiling CDK application code.
*   **Key Compiler Options**:
    *   `target`: `ES2020` or higher.
    *   `module`: `commonjs`.
    *   `strict`: `true`.
    *   `esModuleInterop`: `true`.
    *   `experimentalDecorators`: `true` (if decorators are used, common in NestJS but less so in pure CDK).
    *   `emitDecoratorMetadata`: `true`.
    *   `outDir`: `dist`.
    *   `rootDir`: `.` (or `lib` and `bin`).

#### 3.1.4 `bin/monitoring-stack-app.ts`
*   **Path**: `monitoring/configuration/bin/monitoring-stack-app.ts`
*   **Description**: The entry point for the AWS CDK application.
*   **Purpose**: To initialize and define the CDK application, creating instances of the monitoring stack(s).
*   **Logic**:
    1.  Import `cdk` from `aws-cdk-lib`.
    2.  Import `MonitoringStack` from `../lib/monitoring-stack`.
    3.  Import configurations if necessary (e.g., environment-specific settings, feature flags).
    4.  Create an instance of `cdk.App`.
    5.  Instantiate `MonitoringStack`, passing:
        *   The `app` instance.
        *   A unique stack ID (e.g., `AdManagerMonitoringStack`).
        *   Stack props, including `env` (AWS account and region, possibly from environment variables or CDK context).
        *   Any top-level configurations or feature flags.

typescript
// Example Structure for bin/monitoring-stack-app.ts
import * as cdk from 'aws-cdk-lib';
import { MonitoringStack } from '../lib/monitoring-stack';
// Potentially import environment configuration or feature toggles
// import { environment, featureToggles } from '../lib/config/deployment-config'; // Example

const app = new cdk.App();

new MonitoringStack(app, 'AdManagerMonitoringStack', {
  /* If you need to customize the name of the stack, uncomment the following line. */
  // stackName: 'MyMonitoringStack',
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT, // Or specific account
    region: process.env.CDK_DEFAULT_REGION,   // Or specific region
  },
  // Pass any global configurations or feature toggles
  // featureToggles: featureToggles,
});

app.synth();


### 3.2 Main Stack Definition

#### 3.2.1 `lib/monitoring-stack.ts`
*   **Path**: `monitoring/configuration/lib/monitoring-stack.ts`
*   **Description**: Defines the main AWS CDK stack for monitoring resources.
*   **Purpose**: To define and provision all monitoring and alerting resources as a single CloudFormation stack using AWS CDK.
*   **Class**: `MonitoringStack` extends `cdk.Stack`
    *   **Constructor**: `(scope: Construct, id: string, props?: MonitoringStackProps)`
        *   `MonitoringStackProps` interface (defined locally or in `interfaces`) might include:
            *   `stackName?`: `string`
            *   `env?`: `cdk.Environment`
            *   `featureToggles?`: `Record<string, boolean>` (from `configuration.json_data.FeatureToggles`)
            *   `apiGatewayId?`: `string` (if monitoring a specific API Gateway)
            *   `lambdaFunctionNames?`: `string[]` (list of critical lambdas to monitor)
            *   `rdsInstanceIdentifier?`: `string`
            *   `dynamoDbTableNames?`: `string[]`
            *   `customMetricsNamespace?`: `string`
            *   `criticalAlertsEmail`: `string` (from `notification-configurations.ts`)
            *   `warningAlertsEmail`: `string` (from `notification-configurations.ts`)
            *   `pagerDutyIntegrationArn?`: `string` (ARN for Lambda/SNS for PagerDuty, from `notification-configurations.ts`)
    *   **Logic**:
        1.  Call `super(scope, id, props)`.
        2.  **Instantiate Notification Constructs**:
            *   `SnsTopicsConstruct`: Create critical, warning, and info SNS topics.
                typescript
                const snsTopics = new SnsTopicsConstruct(this, 'AlertTopics');
                
            *   `AlertSubscriptionsConstruct`: Subscribe configured endpoints to the SNS topics.
                typescript
                new AlertSubscriptionsConstruct(this, 'AlertEmailSubscriptions', {
                  criticalAlertsTopic: snsTopics.criticalAlertsTopic,
                  warningAlertsTopic: snsTopics.warningAlertsTopic,
                  infoAlertsTopic: snsTopics.infoAlertsTopic,
                  criticalEmailAddress: props.criticalAlertsEmail, // From config
                  warningEmailAddress: props.warningAlertsEmail,   // From config
                  // pagerDutyIntegrationArn: props.pagerDutyIntegrationArn, // If PagerDuty is enabled via feature toggle
                });
                
        3.  **Instantiate Alarm Constructs** (passing appropriate SNS topics for actions):
            *   `ApiGatewayAlarmsConstruct`: If `props.apiGatewayId` is provided.
                typescript
                // Example: Assuming apiGatewayName is passed or derived
                if (props.apiGatewayName) {
                  new ApiGatewayAlarmsConstruct(this, 'ApiGatewayAlarms', {
                    apiGatewayName: props.apiGatewayName, // or RestApi object if available
                    criticalAlertsTopic: snsTopics.criticalAlertsTopic,
                    warningAlertsTopic: snsTopics.warningAlertsTopic,
                  });
                }
                
            *   `LambdaAlarmsConstruct`: For each Lambda in `props.lambdaFunctionNames`. Loop or pass the array.
                typescript
                if (props.lambdaFunctionNames && props.lambdaFunctionNames.length > 0) {
                  new LambdaAlarmsConstruct(this, 'AppLambdaAlarms', {
                    functionNames: props.lambdaFunctionNames, // Can be ARNs or names
                    criticalAlertsTopic: snsTopics.criticalAlertsTopic,
                    warningAlertsTopic: snsTopics.warningAlertsTopic,
                    // Potentially use featureToggles.enableDetailedLambdaAlarms
                  });
                }
                
            *   `DatabaseAlarmsConstruct`: For RDS and DynamoDB instances if identifiers are provided.
                typescript
                if (props.rdsInstanceIdentifier || (props.dynamoDbTableNames && props.dynamoDbTableNames.length > 0)) {
                  new DatabaseAlarmsConstruct(this, 'DatabaseAlarms', {
                    rdsInstanceIdentifier: props.rdsInstanceIdentifier,
                    dynamoDbTableNames: props.dynamoDbTableNames,
                    criticalAlertsTopic: snsTopics.criticalAlertsTopic,
                    warningAlertsTopic: snsTopics.warningAlertsTopic,
                  });
                }
                
            *   `ApplicationMetricAlarmsConstruct`: If `props.customMetricsNamespace` and relevant metric details are provided.
                typescript
                // Example: Defining a custom alarm for 'OrderProcessingFailures'
                if (props.customMetricsNamespace) {
                     new ApplicationMetricAlarmsConstruct(this, 'OrderProcessingFailuresAlarm', {
                        alarmName: 'OrderProcessingFailuresHigh',
                        metricName: 'OrderProcessingFailures',
                        namespace: props.customMetricsNamespace, // e.g., 'AdManager/Application'
                        threshold: alarmConfigurations.ORDER_PROCESSING_FAILURE_THRESHOLD, // From alarm-configurations.ts
                        evaluationPeriods: alarmConfigurations.DEFAULT_EVALUATION_PERIODS,
                        periodInSeconds: alarmConfigurations.CRITICAL_ALARM_PERIOD_SECONDS,
                        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
                        statistic: 'Sum',
                        alarmActionsSnsTopics: [snsTopics.criticalAlertsTopic],
                    });
                }
                
        4.  **Instantiate Dashboard Construct**:
            *   `SystemHealthDashboardConstruct`:
                typescript
                new SystemHealthDashboardConstruct(this, 'SystemDashboard', {
                  dashboardName: 'AdManager-SystemHealth',
                  // Pass references to critical alarms created above, or metric objects
                  // e.g. criticalAlarms: [apiGwAlarms.highErrorRateAlarm, lambdaAlarms.highErrorAlarm],
                  // keyPerformanceIndicators: [ { title: 'API Latency', metrics: [apiGwAlarms.p99LatencyMetric] } ]
                });
                

### 3.3 Notification Constructs

#### 3.3.1 `lib/constructs/notifications/sns-topics.construct.ts`
*   **Path**: `monitoring/configuration/lib/constructs/notifications/sns-topics.construct.ts`
*   **Description**: AWS CDK construct for creating and configuring SNS topics.
*   **Purpose**: To define SNS topics for alert distribution.
*   **Class**: `SnsTopicsConstruct` extends `Construct`
    *   **Properties**:
        *   `criticalAlertsTopic: sns.ITopic` (public readonly)
        *   `warningAlertsTopic: sns.ITopic` (public readonly)
        *   `infoAlertsTopic: sns.ITopic` (public readonly)
    *   **Constructor**: `(scope: Construct, id: string, props?: SnsTopicsProps)`
        *   `SnsTopicsProps` (optional, if any custom config like KMS keys needed).
    *   **Logic**:
        1.  Create `sns.Topic` for critical alerts (e.g., `AdManagerCriticalAlerts`).
        2.  Create `sns.Topic` for warning alerts (e.g., `AdManagerWarningAlerts`).
        3.  Create `sns.Topic` for informational alerts (e.g., `AdManagerInfoAlerts`).
        4.  Assign these to the public readonly properties.
        5.  Optionally apply encryption (`masterKey`) or access policies.

#### 3.3.2 `lib/constructs/notifications/alert-subscriptions.construct.ts`
*   **Path**: `monitoring/configuration/lib/constructs/notifications/alert-subscriptions.construct.ts`
*   **Description**: AWS CDK construct for creating subscriptions to SNS topics.
*   **Purpose**: To configure how alerts are delivered.
*   **Class**: `AlertSubscriptionsConstruct` extends `Construct`
    *   **Constructor**: `(scope: Construct, id: string, props: AlertSubscriptionsProps)`
        *   `AlertSubscriptionsProps` interface (defined in `interfaces`):
            *   `criticalAlertsTopic: sns.ITopic`
            *   `warningAlertsTopic: sns.ITopic`
            *   `infoAlertsTopic: sns.ITopic`
            *   `criticalEmailAddress?: string` (from `notification-configurations.ts`)
            *   `warningEmailAddress?: string` (from `notification-configurations.ts`)
            *   `infoEmailAddress?: string` (from `notification-configurations.ts`)
            *   `pagerDutyIntegrationArn?: string` (Lambda/SNS ARN for PagerDuty from `notification-configurations.ts`, conditionally used based on `featureToggles.enablePagerDutyIntegrationHighSeverity`)
    *   **Logic**:
        1.  If `props.criticalEmailAddress` is provided, add an `sns_subscriptions.EmailSubscription` to `props.criticalAlertsTopic`.
        2.  If `props.warningEmailAddress` is provided, add an `sns_subscriptions.EmailSubscription` to `props.warningAlertsTopic`.
        3.  If `props.infoEmailAddress` is provided, add an `sns_subscriptions.EmailSubscription` to `props.infoAlertsTopic`.
        4.  If `props.pagerDutyIntegrationArn` and relevant feature toggle is enabled:
            *   Determine if it's a Lambda ARN or SNS Topic ARN.
            *   If Lambda ARN, add an `sns_subscriptions.LambdaSubscription` to `props.criticalAlertsTopic`.
            *   If SNS Topic ARN (for PagerDuty's direct SNS integration), could involve cross-stack references or importing the topic.

### 3.4 Alarm Constructs

#### 3.4.1 `lib/constructs/alarms/base-alarm.construct.ts`
*   **Path**: `monitoring/configuration/lib/constructs/alarms/base-alarm.construct.ts`
*   **Description**: Utility class for creating CloudWatch Alarms actions.
*   **Purpose**: To provide reusable logic for creating CloudWatch Alarm SNS actions.
*   **Class**: `BaseAlarmUtils` (or similar, can be static methods)
    *   **Static Method**: `createSnsAlarmAction(topic: sns.ITopic): cloudwatch.actions.SnsAction`
        *   **Logic**: Creates and returns a new `cloudwatch.actions.SnsAction(topic)`.
    *   **Note**: This could also be an abstract base class `BaseAlarmConstruct` if common properties or constructor logic for alarms is extensive. For simplicity, a utility class with static methods is often sufficient.

#### 3.4.2 `lib/constructs/alarms/api-gateway-alarms.construct.ts`
*   **Path**: `monitoring/configuration/lib/constructs/alarms/api-gateway-alarms.construct.ts`
*   **Description**: Defines CloudWatch Alarms for API Gateway metrics.
*   **Purpose**: To monitor API Gateway health and performance.
*   **Class**: `ApiGatewayAlarmsConstruct` extends `Construct`
    *   **Constructor**: `(scope: Construct, id: string, props: ApiGatewayAlarmsProps)`
        *   `ApiGatewayAlarmsProps` interface (from `interfaces`):
            *   `apiGatewayName: string` (The name of the API Gateway or `restApi: apigateway.IRestApi` object).
            *   `criticalAlertsTopic: sns.ITopic`
            *   `warningAlertsTopic: sns.ITopic`
            *   `config?`: `ApiGatewayAlarmConfig` (optional, specific thresholds from `alarm-configurations.ts`)
                *   `errorRateThresholdPercentage`: `number` (e.g., `alarmConfigurations.API_GATEWAY_5XX_ERROR_THRESHOLD`)
                *   `latencyP99ThresholdMs`: `number` (e.g., `alarmConfigurations.API_GATEWAY_LATENCY_P99_THRESHOLD_MS`)
                *   `evaluationPeriods`: `number`
                *   `periodInSeconds`: `number`
    *   **Logic**:
        1.  Retrieve API Gateway metrics using `new cloudwatch.Metric(...)` or by referencing `api.metric*()` methods if an `IRestApi` object is passed.
            *   `5XXError` rate (as a percentage or count).
            *   `Latency` (P90, P95, P99).
            *   `Count` (total requests).
        2.  Create `cloudwatch.Alarm` for high 5XX error rate:
            *   Metric: 5XXError (potentially calculated as `(5XXError / Count) * 100` using `MathExpression`).
            *   Threshold, period, evaluationPeriods from `props.config` or defaults from `alarm-configurations.ts`.
            *   ComparisonOperator: `GREATER_THAN_OR_EQUAL_TO_THRESHOLD`.
            *   Actions: `BaseAlarmUtils.createSnsAlarmAction(props.criticalAlertsTopic)`.
        3.  Create `cloudwatch.Alarm` for high Latency (e.g., P99):
            *   Metric: Latency (P99).
            *   Threshold from `props.config`.
            *   Actions: `BaseAlarmUtils.createSnsAlarmAction(props.warningAlertsTopic)`.
        4.  (Optional) Create alarms for low request count or high request count if relevant.

#### 3.4.3 `lib/constructs/alarms/lambda-alarms.construct.ts`
*   **Path**: `monitoring/configuration/lib/constructs/alarms/lambda-alarms.construct.ts`
*   **Description**: Defines CloudWatch Alarms for Lambda function metrics.
*   **Purpose**: To monitor Lambda health and performance.
*   **Class**: `LambdaAlarmsConstruct` extends `Construct`
    *   **Constructor**: `(scope: Construct, id: string, props: LambdaAlarmsProps)`
        *   `LambdaAlarmsProps` interface (from `interfaces`):
            *   `functionNames: string[]` (Names or ARNs of Lambda functions).
            *   `criticalAlertsTopic: sns.ITopic`
            *   `warningAlertsTopic: sns.ITopic`
            *   `config?`: `LambdaAlarmConfig`
                *   `errorRateThresholdPercentage`: `number` (e.g., `alarmConfigurations.LAMBDA_ERROR_RATE_THRESHOLD_PERCENT`)
                *   `throttleThresholdCount`: `number`
                *   `durationP95ThresholdMs`: `number`
                *   `evaluationPeriods`: `number`
                *   `periodInSeconds`: `number`
    *   **Logic**:
        1.  Iterate through `props.functionNames`. For each function:
            *   Retrieve metrics: `Errors`, `Throttles`, `Duration`, `Invocations` (e.g., using `lambda.Function.metricErrors({ functionName })`).
            *   Create `cloudwatch.Alarm` for high error rate (Errors / Invocations).
                *   Actions: `BaseAlarmUtils.createSnsAlarmAction(props.criticalAlertsTopic)`.
            *   Create `cloudwatch.Alarm` for high throttles.
                *   Actions: `BaseAlarmUtils.createSnsAlarmAction(props.warningAlertsTopic)`.
            *   Create `cloudwatch.Alarm` for high duration (e.g., P95).
                *   Actions: `BaseAlarmUtils.createSnsAlarmAction(props.warningAlertsTopic)`.
            *   Use thresholds and configurations from `props.config` or `alarm-configurations.ts`.

#### 3.4.4 `lib/constructs/alarms/database-alarms.construct.ts`
*   **Path**: `monitoring/configuration/lib/constructs/alarms/database-alarms.construct.ts`
*   **Description**: Defines CloudWatch Alarms for database metrics.
*   **Purpose**: To monitor database health and performance.
*   **Class**: `DatabaseAlarmsConstruct` extends `Construct`
    *   **Constructor**: `(scope: Construct, id: string, props: DatabaseAlarmsProps)`
        *   `DatabaseAlarmsProps` interface (from `interfaces`):
            *   `rdsInstanceIdentifier?: string`
            *   `dynamoDbTableNames?: string[]`
            *   `criticalAlertsTopic: sns.ITopic`
            *   `warningAlertsTopic: sns.ITopic`
            *   `config?`: `DatabaseAlarmConfig`
                *   `rdsCpuThresholdPercentage`: `number`
                *   `rdsConnectionsThresholdCount`: `number`
                *   `rdsFreeStorageThresholdGb`: `number`
                *   `dynamoDbThrottleThresholdCount`: `number`
                *   `evaluationPeriods`: `number`
                *   `periodInSeconds`: `number`
    *   **Logic**:
        1.  If `props.rdsInstanceIdentifier` is provided:
            *   Create alarms for RDS metrics: `CPUUtilization`, `DatabaseConnections`, `FreeStorageSpace`.
            *   Use thresholds from `props.config` or `alarm-configurations.ts`.
            *   Actions: `BaseAlarmUtils.createSnsAlarmAction(props.criticalAlertsTopic)` or `props.warningAlertsTopic` based on severity.
        2.  If `props.dynamoDbTableNames` are provided, iterate through them:
            *   Create alarms for DynamoDB metrics: `ReadThrottleEvents`, `WriteThrottleEvents`, `ConsumedReadCapacityUnits` (if provisioned), `ConsumedWriteCapacityUnits` (if provisioned).
            *   Actions: `BaseAlarmUtils.createSnsAlarmAction(props.warningAlertsTopic)`.

#### 3.4.5 `lib/constructs/alarms/application-metric-alarms.construct.ts`
*   **Path**: `monitoring/configuration/lib/constructs/alarms/application-metric-alarms.construct.ts`
*   **Description**: Defines CloudWatch Alarms for custom application metrics.
*   **Purpose**: To monitor key custom business or application performance indicators.
*   **Class**: `ApplicationMetricAlarmsConstruct` extends `Construct`
    *   **Constructor**: `(scope: Construct, id: string, props: ApplicationMetricAlarmProps)`
        *   `ApplicationMetricAlarmProps` interface (can be a generic one or part of `AlarmProps` from `interfaces`):
            *   `alarmName: string` (Unique name for the alarm construct ID and description)
            *   `metricName: string`
            *   `namespace: string`
            *   `dimensionsMap?: { [key: string]: string }`
            *   `threshold: number`
            *   `evaluationPeriods: number`
            *   `periodInSeconds: number`
            *   `comparisonOperator: cloudwatch.ComparisonOperator`
            *   `statistic?: string` (e.g., 'Sum', 'Average', 'p99')
            *   `alarmActionsSnsTopics: sns.ITopic[]`
    *   **Logic**:
        1.  Create `cloudwatch.Metric` instance using `props.namespace`, `props.metricName`, `props.dimensionsMap`, `props.statistic`, `props.periodInSeconds`.
        2.  Create `cloudwatch.Alarm`:
            *   Metric: The created metric.
            *   Threshold, period, evaluationPeriods, comparisonOperator from `props`.
            *   Actions: `props.alarmActionsSnsTopics.map(topic => BaseAlarmUtils.createSnsAlarmAction(topic))`.
        *   **Usage Note**: This construct would be instantiated multiple times in `monitoring-stack.ts` for different custom metrics as needed.

### 3.5 Dashboard Constructs

#### 3.5.1 `lib/constructs/dashboards/system-health-dashboard.construct.ts`
*   **Path**: `monitoring/configuration/lib/constructs/dashboards/system-health-dashboard.construct.ts`
*   **Description**: Creates the consolidated System Health Dashboard.
*   **Purpose**: To provide a single pane of glass for real-time system health. (REQ-POA-015)
*   **Class**: `SystemHealthDashboardConstruct` extends `Construct`
    *   **Properties**:
        *   `dashboard: cloudwatch.Dashboard` (public readonly)
    *   **Constructor**: `(scope: Construct, id: string, props: SystemHealthDashboardProps)`
        *   `SystemHealthDashboardProps` interface (from `interfaces`):
            *   `dashboardName: string`
            *   `criticalAlarms?: cloudwatch.IAlarm[]` (Array of critical alarm objects to display status for)
            *   `keyPerformanceIndicators?: Array<{title: string, metrics: cloudwatch.IMetric[], widgetType?: 'Graph' | 'SingleValue'}>`
            *   `apiGatewayName?: string` // To fetch API GW metrics
            *   `lambdaFunctionNames?: string[]` // To fetch Lambda metrics
            *   `rdsInstanceIdentifier?: string` // To fetch RDS metrics
            *   `dynamoDbTableNames?: string[]` // To fetch DDB metrics
            *   `customMetrics?: Array<{title: string, namespace: string, metricName: string, dimensions?: {[key:string]:string}, statistic?: string, period?: cdk.Duration}>`
    *   **Logic**:
        1.  Create `cloudwatch.Dashboard` instance with `props.dashboardName`.
        2.  Add `TextWidget` for section titles.
        3.  If `props.criticalAlarms` are provided, add `AlarmStatusWidget` using `DashboardWidgetFactory.createAlarmStatusWidget`.
        4.  If `props.keyPerformanceIndicators` are provided, iterate and add `GraphWidget` or `SingleValueWidget` for each KPI using `DashboardWidgetFactory`.
        5.  Fetch and display key metrics for core services (API Gateway, Lambdas, RDS, DynamoDB) based on identifiers passed in `props`.
            *   Example: API Gateway 5XX errors, P99 Latency.
            *   Example: Aggregate Lambda errors, throttles.
            *   Example: RDS CPU Utilization, DB Connections.
        6.  If `props.customMetrics` and `featureToggles.enableCustomBusinessMetricDashboardSection` are provided/true, add widgets for these custom metrics.
        7.  The dashboard layout should be organized logically (e.g., by service, by criticality).

#### 3.5.2 `lib/constructs/dashboards/dashboard-widget-factory.ts`
*   **Path**: `monitoring/configuration/lib/constructs/dashboards/dashboard-widget-factory.ts`
*   **Description**: Utility for creating common CloudWatch Dashboard widgets.
*   **Purpose**: To simplify and standardize widget creation.
*   **Class**: `DashboardWidgetFactory` (consists of static methods)
    *   **Static Method**: `createGraphWidget(title: string, metrics: cloudwatch.IMetric[], options?: cloudwatch.GraphWidgetProps): cloudwatch.GraphWidget`
        *   **Logic**: Creates a `cloudwatch.GraphWidget` with the given title, metrics, and applies default or provided options (e.g., `width`, `height`, `period`).
    *   **Static Method**: `createAlarmStatusWidget(title: string, alarms: cloudwatch.IAlarm[], options?: cloudwatch.AlarmStatusWidgetProps): cloudwatch.AlarmStatusWidget`
        *   **Logic**: Creates an `cloudwatch.AlarmStatusWidget`.
    *   **Static Method**: `createSingleValueWidget(title: string, metrics: cloudwatch.IMetric[], options?: cloudwatch.SingleValueWidgetProps): cloudwatch.SingleValueWidget`
        *   **Logic**: Creates a `cloudwatch.SingleValueWidget`.
    *   **Static Method**: `createTextWidget(markdown: string, options?: cloudwatch.TextWidgetProps): cloudwatch.TextWidget`
        *   **Logic**: Creates a `cloudwatch.TextWidget`.

### 3.6 Interface Definitions

#### 3.6.1 `lib/interfaces/alarm-props.interface.ts`
*   **Path**: `monitoring/configuration/lib/interfaces/alarm-props.interface.ts`
*   **Description**: Defines properties for alarm constructs.
*   **Purpose**: Typed contracts for alarm creation.
*   **Interfaces**:
    *   `BaseAlarmProps`:
        *   `alarmNamePrefix`: `string`
        *   `evaluationPeriods`: `number`
        *   `periodInSeconds`: `number`
        *   `alarmActionsSnsTopics`: `sns.ITopic[]`
        *   `treatMissingData?`: `cloudwatch.TreatMissingData`
    *   `MetricAlarmProps` extends `BaseAlarmProps`:
        *   `metricName: string`
        *   `namespace: string`
        *   `dimensionsMap?: { [key: string]: string }`
        *   `threshold: number`
        *   `comparisonOperator: cloudwatch.ComparisonOperator`
        *   `statistic?: string` (e.g., 'Average', 'Sum', 'p90')
    *   `ApiGatewayAlarmsProps`:
        *   `apiGatewayName: string` // or `restApi: apigateway.IRestApi`
        *   `criticalAlertsTopic: sns.ITopic`
        *   `warningAlertsTopic: sns.ITopic`
        *   `config?`: (specific thresholds for 5XX, latency etc.)
    *   `LambdaAlarmsProps`:
        *   `functionNames: string[]`
        *   `criticalAlertsTopic: sns.ITopic`
        *   `warningAlertsTopic: sns.ITopic`
        *   `config?`: (specific thresholds for errors, throttles, duration)
    *   `DatabaseAlarmsProps`:
        *   `rdsInstanceIdentifier?: string`
        *   `dynamoDbTableNames?: string[]`
        *   `criticalAlertsTopic: sns.ITopic`
        *   `warningAlertsTopic: sns.ITopic`
        *   `config?`: (specific thresholds for CPU, connections, storage, throttles)
    *   `ApplicationMetricAlarmProps` (as defined for the construct, similar to `MetricAlarmProps` but potentially more specific for ease of use if this construct is highly reused for various app metrics).

#### 3.6.2 `lib/interfaces/dashboard-props.interface.ts`
*   **Path**: `monitoring/configuration/lib/interfaces/dashboard-props.interface.ts`
*   **Description**: Defines properties for dashboard constructs.
*   **Purpose**: Typed contracts for dashboard creation.
*   **Interface**: `SystemHealthDashboardProps`
    *   `dashboardName: string`
    *   `criticalAlarms?: cloudwatch.IAlarm[]`
    *   `keyPerformanceIndicators?: Array<{title: string, metrics: cloudwatch.IMetric[], widgetType?: 'Graph' | 'SingleValue', period?: cdk.Duration, statistic?: string}>`
    *   `apiGatewayName?: string`
    *   `lambdaFunctionNames?: string[]`
    *   `rdsInstanceIdentifier?: string`
    *   `dynamoDbTableNames?: string[]`
    *   `customBusinessMetrics?: Array<{title: string, namespace: string, metricName: string, dimensions?: {[key:string]:string}, statistic?: string, period?: cdk.Duration}>` (align with `configuration.json_data.FeatureToggles.enableCustomBusinessMetricDashboardSection`)

### 3.7 Configuration Files

#### 3.7.1 `lib/config/alarm-configurations.ts`
*   **Path**: `monitoring/configuration/lib/config/alarm-configurations.ts`
*   **Description**: Centralized constants for alarm thresholds, periods, etc.
*   **Purpose**: Easy management and tuning of alarm sensitivity.
*   **Content**: Exported constants for:
    *   API Gateway: `API_GATEWAY_5XX_ERROR_THRESHOLD_PERCENTAGE`, `API_GATEWAY_LATENCY_P99_THRESHOLD_MS`, `API_GATEWAY_REQUEST_COUNT_LOW_THRESHOLD`.
    *   Lambda: `LAMBDA_ERROR_RATE_THRESHOLD_PERCENTAGE`, `LAMBDA_THROTTLE_THRESHOLD_COUNT`, `LAMBDA_DURATION_P95_THRESHOLD_MS`.
    *   RDS: `RDS_CPU_UTILIZATION_THRESHOLD_PERCENTAGE`, `RDS_DB_CONNECTIONS_THRESHOLD_COUNT`, `RDS_FREE_STORAGE_THRESHOLD_GB`.
    *   DynamoDB: `DYNAMODB_THROTTLE_EVENTS_THRESHOLD_COUNT`.
    *   Custom Metrics: e.g., `ORDER_PROCESSING_FAILURE_THRESHOLD`.
    *   Common: `DEFAULT_EVALUATION_PERIODS` (e.g., 3), `CRITICAL_ALARM_PERIOD_SECONDS` (e.g., 300 for 5 min), `WARNING_ALARM_PERIOD_SECONDS` (e.g., 600 for 10 min).

#### 3.7.2 `lib/config/notification-configurations.ts`
*   **Path**: `monitoring/configuration/lib/config/notification-configurations.ts`
*   **Description**: Centralized constants for notification endpoints.
*   **Purpose**: Easy management of alert recipients.
*   **Content**: Exported string constants:
    *   `CRITICAL_ALERTS_EMAIL_ENDPOINT`: `string`
    *   `WARNING_ALERTS_EMAIL_ENDPOINT`: `string`
    *   `INFO_ALERTS_EMAIL_ENDPOINT`: `string`
    *   `PAGERDUTY_INTEGRATION_SNS_TOPIC_ARN?`: `string` (used if `featureToggles.enablePagerDutyIntegrationHighSeverity` is true)
    *   `OPSGENIE_INTEGRATION_LAMBDA_ARN?`: `string`

## 4. Configuration Management
*   **Alarm Thresholds and Parameters**: Managed centrally in `lib/config/alarm-configurations.ts`. Changes to these constants will be picked up during the next CDK deployment.
*   **Notification Endpoints**: Managed centrally in `lib/config/notification-configurations.ts`.
*   **Feature Toggles**: Defined in `configuration.json_data.FeatureToggles` and passed down to relevant constructs (e.g., `MonitoringStackProps`, then to individual constructs) to enable/disable specific monitoring features (e.g., PagerDuty integration, detailed alarms for certain services).
    *   Example Toggle: `enablePagerDutyIntegrationHighSeverity: boolean`
    *   Example Toggle: `enableDetailedLambdaAlarms: boolean`
    *   Example Toggle: `enableCustomBusinessMetricDashboardSection: boolean`

## 5. Deployment
The monitoring infrastructure is deployed using AWS CDK.
1.  Prerequisites: AWS CLI configured, Node.js and NPM installed.
2.  Install dependencies: `npm install`.
3.  Bootstrap CDK (if first time in account/region): `cdk bootstrap aws://ACCOUNT-NUMBER/REGION`.
4.  Synthesize CloudFormation template: `npm run synth` or `cdk synth`.
5.  Review changes: `npm run diff` or `cdk diff`.
6.  Deploy stack: `npm run deploy` or `cdk deploy`.

Changes to TypeScript files (constructs, configurations) will result in updates to the CloudFormation stack upon redeployment.

## 6. Non-Functional Requirements Addressed
*   **REQ-POA-003 (Configure CloudWatch Alarms)**: Addressed by the various alarm constructs (`api-gateway-alarms.construct.ts`, `lambda-alarms.construct.ts`, etc.) which create and configure alarms with SNS actions.
*   **SRS 5.1 (Monitoring, Logging, and Alerting - Set alarms, Create custom dashboards)**:
    *   Setting alarms is the core function of the alarm constructs.
    *   Creating custom dashboards is addressed by `system-health-dashboard.construct.ts`.
*   **REQ-POA-015 (Consolidated System Health Dashboard)**: Directly implemented by `lib/constructs/dashboards/system-health-dashboard.construct.ts`.
*   **REQ-POA-016 (Configure, manage, and monitor Amazon SES for transactional emails and Amazon SNS for event notifications)**: This repository configures SNS for alert notifications (`sns-topics.construct.ts`, `alert-subscriptions.construct.ts`). While it doesn't manage SES for general transactional emails, it uses SES (via EmailSubscription) for alert delivery. Monitoring of SES/SNS deliverability itself would typically be part of broader AWS account monitoring or handled by the team managing those services directly, though some basic SNS delivery failure alarms could be added if required.

This SDS provides a detailed plan for implementing the monitoring and alerting configuration for the Ad Manager platform using AWS CDK.
