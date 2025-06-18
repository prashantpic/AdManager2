#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MonitoringStack, MonitoringStackProps } from '../lib/monitoring-stack';
import * as notificationConfigurations from '../lib/config/notification-configurations';
import * as alarmConfigurations from '../lib/config/alarm-configurations';
import { ComparisonOperator } from 'aws-cdk-lib/aws-cloudwatch';
import { ApplicationMetricAlarmConfig } from '../lib/interfaces/alarm-props.interface'; // Assuming this will be defined

const app = new cdk.App();

// Example configurations for the MonitoringStack
// In a real-world scenario, these might come from environment variables,
// CDK context, or a dedicated configuration management system.

const customMetricAlarmConfigs: ApplicationMetricAlarmConfig[] = [
  {
    alarmName: 'OrderProcessingFailuresHigh',
    metricName: 'OrderProcessingFailures',
    namespace: 'AdManager/Application', // Example namespace from MonitoringStackProps
    dimensionsMap: { Service: 'Orders', Operation: 'ProcessOrder' }, // Example dimensions
    threshold: alarmConfigurations.ORDER_PROCESSING_FAILURE_THRESHOLD,
    evaluationPeriods: alarmConfigurations.DEFAULT_EVALUATION_PERIODS,
    periodInSeconds: alarmConfigurations.CRITICAL_ALARM_PERIOD_SECONDS, // This is already a cdk.Duration
    comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    statistic: 'Sum',
    severity: 'critical',
  },
  // Add more custom alarm configurations as needed
];

const stackProps: MonitoringStackProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT || '123456789012', // Replace with your AWS account ID
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',   // Replace with your AWS region
  },
  featureToggles: {
    enablePagerDutyIntegrationHighSeverity: true, // Example feature toggle
    enableDetailedLambdaAlarms: true,
    enableCustomBusinessMetricDashboardSection: true,
  },
  apiGatewayName: 'AdManagerApi', // Example API Gateway name
  lambdaFunctionNames: ['AdManagerProcessOrderLambda', 'AdManagerUserAuthLambda'], // Example Lambda function names
  rdsInstanceIdentifier: 'admanager-rds-instance', // Example RDS instance identifier
  dynamoDbTableNames: ['AdManagerOrdersTable', 'AdManagerInventoryTable'], // Example DynamoDB table names
  customMetricAlarmConfigs: customMetricAlarmConfigs,
  criticalAlertsEmail: notificationConfigurations.CRITICAL_ALERTS_EMAIL_ENDPOINT,
  warningAlertsEmail: notificationConfigurations.WARNING_ALERTS_EMAIL_ENDPOINT,
  infoAlertsEmail: notificationConfigurations.INFO_ALERTS_EMAIL_ENDPOINT,
  pagerDutyIntegrationArn: notificationConfigurations.PAGERDUTY_INTEGRATION_SNS_TOPIC_ARN, // ARN for PagerDuty integration
  opsgenieIntegrationLambdaArn: notificationConfigurations.OPSGENIE_INTEGRATION_LAMBDA_ARN, // ARN for OpsGenie integration (optional)
  // customMetricsNamespace: 'AdManager/Application', // This was replaced by customMetricAlarmConfigs
};

new MonitoringStack(app, 'AdManagerMonitoringStack', stackProps);

app.synth();