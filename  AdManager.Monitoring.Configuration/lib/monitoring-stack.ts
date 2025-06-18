import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

// Import custom constructs
import { SnsTopicsConstruct } from './constructs/notifications/sns-topics.construct';
import { AlertSubscriptionsConstruct } from './constructs/notifications/alert-subscriptions.construct';
import { ApiGatewayAlarmsConstruct } from './constructs/alarms/api-gateway-alarms.construct';
import { LambdaAlarmsConstruct } from './constructs/alarms/lambda-alarms.construct';
import { DatabaseAlarmsConstruct } from './constructs/alarms/database-alarms.construct';
import { ApplicationMetricAlarmsConstruct } from './constructs/alarms/application-metric-alarms.construct';
import { SystemHealthDashboardConstruct } from './constructs/dashboards/system-health-dashboard.construct';

// Import configurations
import * as alarmConfigs from './config/alarm-configurations';
import * as notificationConfigs from './config/notification-configurations';

// Interfaces that would typically be in lib/interfaces/* but defined here for clarity as per generation scope
// This interface would be part of lib/interfaces/alarm-props.interface.ts
interface ApplicationMetricAlarmConfig {
  alarmName: string;
  metricName: string;
  namespace: string;
  dimensionsMap?: { [key: string]: string };
  threshold: number;
  evaluationPeriods: number;
  periodInSeconds: cdk.Duration; // Matches the type used in ApplicationMetricAlarmsConstruct props
  comparisonOperator: cloudwatch.ComparisonOperator;
  statistic?: string;
  severity: 'critical' | 'warning' | 'info';
  treatMissingData?: cloudwatch.TreatMissingData;
}

// Props for the MonitoringStack
export interface MonitoringStackProps extends cdk.StackProps {
  featureToggles?: {
    enablePagerDutyIntegrationHighSeverity?: boolean;
    enableOpsGenieIntegration?: boolean; // Example, not explicitly in SDS but common
    enableDetailedLambdaAlarms?: boolean;
    enableCustomBusinessMetricDashboardSection?: boolean;
    [key: string]: boolean | undefined;
  };
  apiGatewayName?: string;
  lambdaFunctionNames?: string[];
  rdsInstanceIdentifier?: string;
  dynamoDbTableNames?: string[];
  customMetricsNamespace?: string; // As per SDS 3.2.1 example for ApplicationMetricAlarmsConstruct
  customMetricAlarmConfigs?: ApplicationMetricAlarmConfig[];
  criticalAlertsEmail?: string;
  warningAlertsEmail?: string;
  infoAlertsEmail?: string;
  pagerDutyIntegrationArn?: string;
  opsgenieIntegrationLambdaArn?: string;
}

export class MonitoringStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MonitoringStackProps) {
    super(scope, id, props);

    // 1. Instantiate Notification Constructs
    const snsTopics = new SnsTopicsConstruct(this, 'AlertTopics');

    new AlertSubscriptionsConstruct(this, 'AlertSubscriptions', {
      criticalAlertsTopic: snsTopics.criticalAlertsTopic,
      warningAlertsTopic: snsTopics.warningAlertsTopic,
      infoAlertsTopic: snsTopics.infoAlertsTopic,
      criticalEmailAddress: props.criticalAlertsEmail || notificationConfigs.CRITICAL_ALERTS_EMAIL_ENDPOINT,
      warningEmailAddress: props.warningAlertsEmail || notificationConfigs.WARNING_ALERTS_EMAIL_ENDPOINT,
      infoEmailAddress: props.infoAlertsEmail || notificationConfigs.INFO_ALERTS_EMAIL_ENDPOINT,
      pagerDutyIntegrationArn: (props.featureToggles?.enablePagerDutyIntegrationHighSeverity && (props.pagerDutyIntegrationArn || notificationConfigs.PAGERDUTY_INTEGRATION_SNS_TOPIC_ARN))
        ? (props.pagerDutyIntegrationArn || notificationConfigs.PAGERDUTY_INTEGRATION_SNS_TOPIC_ARN)
        : undefined,
      // OpsGenie example, assuming a similar toggle and ARN prop/config
      opsGenieIntegrationLambdaArn: (props.featureToggles?.enableOpsGenieIntegration && props.opsgenieIntegrationLambdaArn)
        ? props.opsgenieIntegrationLambdaArn
        : undefined,
    });

    // Array to hold critical alarms for the dashboard
    const criticalAlarms: cloudwatch.IAlarm[] = [];
    const warningAlarms: cloudwatch.IAlarm[] = []; // Collect warning alarms too if needed for dashboard

    // 2. Instantiate Alarm Constructs
    if (props.apiGatewayName) {
      const apiGwAlarms = new ApiGatewayAlarmsConstruct(this, 'ApiGatewayAlarms', {
        apiGatewayName: props.apiGatewayName,
        criticalAlertsTopic: snsTopics.criticalAlertsTopic,
        warningAlertsTopic: snsTopics.warningAlertsTopic,
        // Config can be passed here to override defaults in the construct
        config: {
            errorRateThresholdPercentage: alarmConfigs.API_GATEWAY_5XX_ERROR_THRESHOLD_PERCENTAGE,
            latencyP99ThresholdMs: alarmConfigs.API_GATEWAY_LATENCY_P99_THRESHOLD_MS,
            evaluationPeriods: alarmConfigs.DEFAULT_EVALUATION_PERIODS,
            periodInSeconds: alarmConfigs.CRITICAL_ALARM_PERIOD_SECONDS.toSeconds() // Construct expects number
        }
      });
      // Assuming ApiGatewayAlarmsConstruct exposes its created alarms or we reference them if needed.
      // For simplicity, we'll collect alarms if the construct returns them or has properties for them.
      // This part might need adjustment based on how individual alarm constructs expose their alarms.
      // Example: if (apiGwAlarms.highErrorRateAlarm) criticalAlarms.push(apiGwAlarms.highErrorRateAlarm);
    }

    if (props.lambdaFunctionNames && props.lambdaFunctionNames.length > 0) {
      const lambdaAlarms = new LambdaAlarmsConstruct(this, 'AppLambdaAlarms', {
        functionNames: props.lambdaFunctionNames,
        criticalAlertsTopic: snsTopics.criticalAlertsTopic,
        warningAlertsTopic: snsTopics.warningAlertsTopic,
        config: {
            errorRateThresholdPercentage: alarmConfigs.LAMBDA_ERROR_RATE_THRESHOLD_PERCENTAGE,
            throttleThresholdCount: alarmConfigs.LAMBDA_THROTTLE_THRESHOLD_COUNT,
            durationP95ThresholdMs: alarmConfigs.LAMBDA_DURATION_P95_THRESHOLD_MS,
            evaluationPeriods: alarmConfigs.DEFAULT_EVALUATION_PERIODS,
            periodInSeconds: alarmConfigs.CRITICAL_ALARM_PERIOD_SECONDS.toSeconds()
        }
      });
      // Example: if (lambdaAlarms.criticalErrorAlarm) criticalAlarms.push(lambdaAlarms.criticalErrorAlarm);
    }

    if (props.rdsInstanceIdentifier || (props.dynamoDbTableNames && props.dynamoDbTableNames.length > 0)) {
      const dbAlarms = new DatabaseAlarmsConstruct(this, 'DatabaseAlarms', {
        rdsInstanceIdentifier: props.rdsInstanceIdentifier,
        dynamoDbTableNames: props.dynamoDbTableNames,
        criticalAlertsTopic: snsTopics.criticalAlertsTopic,
        warningAlertsTopic: snsTopics.warningAlertsTopic,
        config: {
            rdsCpuThresholdPercentage: alarmConfigs.RDS_CPU_UTILIZATION_THRESHOLD_PERCENTAGE,
            rdsConnectionsThresholdCount: alarmConfigs.RDS_DB_CONNECTIONS_THRESHOLD_COUNT,
            rdsFreeStorageThresholdGb: alarmConfigs.RDS_FREE_STORAGE_THRESHOLD_GB,
            dynamoDbThrottleThresholdCount: alarmConfigs.DYNAMODB_THROTTLE_EVENTS_THRESHOLD_COUNT,
            evaluationPeriods: alarmConfigs.DEFAULT_EVALUATION_PERIODS,
            periodInSeconds: alarmConfigs.CRITICAL_ALARM_PERIOD_SECONDS.toSeconds() // General period
        }
      });
      // Example: if (dbAlarms.rdsLowStorageAlarm) criticalAlarms.push(dbAlarms.rdsLowStorageAlarm);
    }

    if (props.customMetricAlarmConfigs && props.customMetricAlarmConfigs.length > 0) {
      props.customMetricAlarmConfigs.forEach((config, index) => {
        let topicsForAlarm: sns.ITopic[];
        switch (config.severity) {
          case 'critical':
            topicsForAlarm = [snsTopics.criticalAlertsTopic];
            break;
          case 'warning':
            topicsForAlarm = [snsTopics.warningAlertsTopic];
            break;
          case 'info':
            topicsForAlarm = [snsTopics.infoAlertsTopic];
            break;
          default:
            topicsForAlarm = [snsTopics.warningAlertsTopic]; // Default to warning
        }

        const appMetricAlarm = new ApplicationMetricAlarmsConstruct(this, `CustomAlarm-${config.alarmName.replace(/\s/g, '')}-${index}`, {
          alarmName: config.alarmName,
          metricName: config.metricName,
          namespace: config.namespace, // Use specific namespace from config
          dimensionsMap: config.dimensionsMap,
          threshold: config.threshold,
          evaluationPeriods: config.evaluationPeriods,
          // ApplicationMetricAlarmsConstruct expects periodInSeconds as a number of seconds.
          periodInSeconds: config.periodInSeconds.toSeconds(),
          comparisonOperator: config.comparisonOperator,
          statistic: config.statistic,
          alarmActionsSnsTopics: topicsForAlarm,
          treatMissingData: config.treatMissingData,
        });

        if (config.severity === 'critical' && appMetricAlarm.alarm) { // Assuming the construct exposes 'alarm'
          criticalAlarms.push(appMetricAlarm.alarm);
        } else if (config.severity === 'warning' && appMetricAlarm.alarm) {
          warningAlarms.push(appMetricAlarm.alarm);
        }
      });
    } else if (props.customMetricsNamespace) { // Fallback to SDS 3.2.1 example if customMetricAlarmConfigs is not used
        const orderProcessingFailureAlarm = new ApplicationMetricAlarmsConstruct(this, 'OrderProcessingFailuresAlarm', {
            alarmName: 'OrderProcessingFailuresHigh',
            metricName: 'OrderProcessingFailures',
            namespace: props.customMetricsNamespace,
            threshold: alarmConfigs.ORDER_PROCESSING_FAILURE_THRESHOLD,
            evaluationPeriods: alarmConfigs.DEFAULT_EVALUATION_PERIODS,
            periodInSeconds: alarmConfigs.CRITICAL_ALARM_PERIOD_SECONDS.toSeconds(),
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
            statistic: 'Sum',
            alarmActionsSnsTopics: [snsTopics.criticalAlertsTopic],
        });
        if (orderProcessingFailureAlarm.alarm) criticalAlarms.push(orderProcessingFailureAlarm.alarm);
    }


    // 3. Instantiate Dashboard Construct
    // The dashboard construct might need references to specific metrics or alarms created by other constructs.
    // For now, passing identifiers and the criticalAlarms array.
    // The SystemHealthDashboardConstruct will need to handle fetching/creating metrics for display.
    new SystemHealthDashboardConstruct(this, 'SystemDashboard', {
      dashboardName: 'AdManager-SystemHealth',
      criticalAlarms: criticalAlarms, // Pass collected critical alarms
      // Pass other identifiers for the dashboard to fetch metrics
      apiGatewayName: props.apiGatewayName,
      lambdaFunctionNames: props.lambdaFunctionNames,
      rdsInstanceIdentifier: props.rdsInstanceIdentifier,
      dynamoDbTableNames: props.dynamoDbTableNames,
      // Custom business metrics for dashboard could be derived from customMetricAlarmConfigs or another prop
      // For now, let's assume if feature toggle is on, it might use the customMetricsNamespace
      customBusinessMetrics: (props.featureToggles?.enableCustomBusinessMetricDashboardSection && props.customMetricAlarmConfigs)
        ? props.customMetricAlarmConfigs.map(cm => ({
            title: cm.alarmName,
            namespace: cm.namespace,
            metricName: cm.metricName,
            dimensions: cm.dimensionsMap,
            statistic: cm.statistic || 'Sum',
            period: cm.periodInSeconds,
          }))
        : undefined,
    });
  }
}