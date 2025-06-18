import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cdk from 'aws-cdk-lib';

/**
 * Properties for the SystemHealthDashboardConstruct.
 * Defines the necessary inputs to create a system health dashboard.
 */
export interface SystemHealthDashboardProps {
  /**
   * The name of the CloudWatch dashboard.
   */
  readonly dashboardName: string;

  /**
   * Optional array of critical CloudWatch Alarms to display their status on the dashboard.
   */
  readonly criticalAlarms?: cloudwatch.IAlarm[];

  /**
   * Optional array of Key Performance Indicators (KPIs) to display.
   * Each KPI includes a title, metrics, and optionally widget type, period, and statistic.
   */
  readonly keyPerformanceIndicators?: Array<{
    title: string;
    metrics: cloudwatch.IMetric[];
    widgetType?: 'Graph' | 'SingleValue';
    period?: cdk.Duration;
    statistic?: string;
  }>;

  /**
   * Optional name of the API Gateway to fetch metrics for.
   * If provided, standard API Gateway metrics will be added to the dashboard.
   */
  readonly apiGatewayName?: string;

  /**
   * Optional array of Lambda function names to fetch metrics for.
   * If provided, standard Lambda metrics will be added to the dashboard.
   */
  readonly lambdaFunctionNames?: string[];

  /**
   * Optional RDS instance identifier to fetch metrics for.
   * If provided, standard RDS metrics will be added to the dashboard.
   */
  readonly rdsInstanceIdentifier?: string;

  /**
   * Optional array of DynamoDB table names to fetch metrics for.
   * If provided, standard DynamoDB metrics will be added to the dashboard.
   */
  readonly dynamoDbTableNames?: string[];

  /**
   * Optional array of custom business metrics to display on the dashboard.
   * Aligns with featureToggles.enableCustomBusinessMetricDashboardSection.
   */
  readonly customBusinessMetrics?: Array<{
    title: string;
    namespace: string;
    metricName: string;
    dimensions?: { [key: string]: string };
    statistic?: string;
    period?: cdk.Duration;
  }>;
}