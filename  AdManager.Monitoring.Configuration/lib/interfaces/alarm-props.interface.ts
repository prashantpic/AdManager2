import * as sns from 'aws-cdk-lib/aws-sns';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cdk from 'aws-cdk-lib';
// import * as apigateway from 'aws-cdk-lib/aws-apigateway'; // Uncomment if IRestApi is used

/**
 * Base properties for all alarm constructs.
 */
export interface BaseAlarmProps {
  readonly alarmNamePrefix: string;
  readonly evaluationPeriods: number;
  readonly periodInSeconds: cdk.Duration;
  readonly alarmActionsSnsTopics: sns.ITopic[];
  readonly treatMissingData?: cloudwatch.TreatMissingData;
}

/**
 * Properties for alarms based on a single CloudWatch metric.
 */
export interface MetricAlarmProps extends BaseAlarmProps {
  readonly metricName: string;
  readonly namespace: string;
  readonly dimensionsMap?: { [key: string]: string };
  readonly threshold: number;
  readonly comparisonOperator: cloudwatch.ComparisonOperator;
  readonly statistic?: string; // e.g., 'Average', 'Sum', 'p90'
}

/**
 * Configuration for API Gateway specific alarms.
 */
export interface ApiGatewayAlarmConfig {
  readonly errorRateThresholdPercentage: number;
  readonly latencyP99ThresholdMs: number;
  readonly evaluationPeriods?: number;
  readonly periodInSeconds?: cdk.Duration;
}

/**
 * Properties for the ApiGatewayAlarmsConstruct.
 */
export interface ApiGatewayAlarmsProps {
  readonly apiGatewayName: string; // Could also be restApi: apigateway.IRestApi
  readonly criticalAlertsTopic: sns.ITopic;
  readonly warningAlertsTopic: sns.ITopic;
  readonly config?: ApiGatewayAlarmConfig;
}

/**
 * Configuration for Lambda specific alarms.
 */
export interface LambdaAlarmConfig {
  readonly errorRateThresholdPercentage: number;
  readonly throttleThresholdCount: number;
  readonly durationP95ThresholdMs: number;
  readonly evaluationPeriods?: number;
  readonly periodInSeconds?: cdk.Duration;
}

/**
 * Properties for the LambdaAlarmsConstruct.
 */
export interface LambdaAlarmsProps {
  readonly functionNames: string[];
  readonly criticalAlertsTopic: sns.ITopic;
  readonly warningAlertsTopic: sns.ITopic;
  readonly config?: LambdaAlarmConfig;
}

/**
 * Configuration for Database specific alarms.
 */
export interface DatabaseAlarmConfig {
  readonly rdsCpuThresholdPercentage: number;
  readonly rdsConnectionsThresholdCount: number;
  readonly rdsFreeStorageThresholdGb: number;
  readonly dynamoDbThrottleThresholdCount: number;
  readonly evaluationPeriods?: number;
  readonly periodInSeconds?: cdk.Duration;
}

/**
 * Properties for the DatabaseAlarmsConstruct.
 */
export interface DatabaseAlarmsProps {
  readonly rdsInstanceIdentifier?: string;
  readonly dynamoDbTableNames?: string[];
  readonly criticalAlertsTopic: sns.ITopic;
  readonly warningAlertsTopic: sns.ITopic;
  readonly config?: DatabaseAlarmConfig;
}

/**
 * Properties for the ApplicationMetricAlarmsConstruct.
 * This is used directly by the construct.
 */
export interface ApplicationMetricAlarmProps {
  readonly alarmName: string;
  readonly metricName: string;
  readonly namespace: string;
  readonly dimensionsMap?: { [key: string]: string };
  readonly threshold: number;
  readonly evaluationPeriods: number;
  readonly periodInSeconds: cdk.Duration;
  readonly comparisonOperator: cloudwatch.ComparisonOperator;
  readonly statistic?: string; // e.g., 'Sum', 'Average', 'p99'
  readonly alarmActionsSnsTopics: sns.ITopic[];
  readonly treatMissingData?: cloudwatch.TreatMissingData;
}

/**
 * Configuration for custom application metric alarms, used as input to the MonitoringStack.
 * The stack will then use this configuration to instantiate ApplicationMetricAlarmsConstruct,
 * adding the appropriate SNS topics based on severity.
 */
export interface ApplicationMetricAlarmConfig {
    readonly alarmName: string;
    readonly metricName: string;
    readonly namespace: string;
    readonly dimensionsMap?: { [key: string]: string };
    readonly threshold: number;
    readonly evaluationPeriods: number;
    readonly periodInSeconds: cdk.Duration;
    readonly comparisonOperator: cloudwatch.ComparisonOperator;
    readonly statistic?: string;
    readonly severity: 'critical' | 'warning' | 'info';
    readonly treatMissingData?: cloudwatch.TreatMissingData;
}