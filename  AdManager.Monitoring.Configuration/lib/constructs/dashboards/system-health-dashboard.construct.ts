import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { SystemHealthDashboardProps } from '../../interfaces/dashboard-props.interface';
import { DashboardWidgetFactory } from './dashboard-widget-factory';

/**
 * Creates the consolidated System Health Dashboard.
 * This dashboard provides a single pane of glass for real-time system health,
 * displaying critical component statuses, KPIs, and active alerts.
 */
export class SystemHealthDashboardConstruct extends Construct {
  public readonly dashboard: cloudwatch.Dashboard;

  constructor(scope: Construct, id: string, props: SystemHealthDashboardProps) {
    super(scope, id);

    this.dashboard = new cloudwatch.Dashboard(this, 'SystemHealthDashboard', {
      dashboardName: props.dashboardName,
    });

    const widgets: cloudwatch.IWidget[] = [];

    // Dashboard Title
    widgets.push(DashboardWidgetFactory.createTextWidget(
        `# ${props.dashboardName} - System Overview`,
        { width: 24, height: 1 }
    ));
    widgets.push(DashboardWidgetFactory.createTextWidget(
        `Last Refreshed: ${new Date().toISOString()}`, // Static at synth time, CW dashboard updates dynamically
        { width: 24, height: 1 }
    ));


    // Critical Alarms Status
    if (props.criticalAlarms && props.criticalAlarms.length > 0) {
      widgets.push(DashboardWidgetFactory.createTextWidget('## Critical Alarm Status', { width: 24, height: 1 }));
      widgets.push(DashboardWidgetFactory.createAlarmStatusWidget(
        'Critical Alarms',
        props.criticalAlarms,
        { width: 24, height: 6 }
      ));
    }

    // Key Performance Indicators
    if (props.keyPerformanceIndicators && props.keyPerformanceIndicators.length > 0) {
      widgets.push(DashboardWidgetFactory.createTextWidget('## Key Performance Indicators (KPIs)', { width: 24, height: 1 }));
      props.keyPerformanceIndicators.forEach(kpi => {
        if (kpi.widgetType === 'SingleValue') {
          widgets.push(DashboardWidgetFactory.createSingleValueWidget(
            kpi.title,
            kpi.metrics,
            { width: 8, height: 3, period: kpi.period, setPeriodToTimeRange: true}
          ));
        } else { // Default to GraphWidget
          widgets.push(DashboardWidgetFactory.createGraphWidget(
            kpi.title,
            kpi.metrics,
            { width: 12, height: 6, period: kpi.period, statistic: kpi.statistic }
          ));
        }
      });
    }

    const defaultPeriod = cdk.Duration.minutes(5);

    // API Gateway Metrics
    if (props.apiGatewayName) {
      widgets.push(DashboardWidgetFactory.createTextWidget(`## API Gateway: ${props.apiGatewayName}`, { width: 24, height: 1 }));
      const apiGwMetrics = [
        new cloudwatch.Metric({ namespace: 'AWS/ApiGateway', metricName: '5XXError', dimensionsMap: { ApiName: props.apiGatewayName }, statistic: 'Sum', period: defaultPeriod, label: '5XX Errors' }),
        new cloudwatch.Metric({ namespace: 'AWS/ApiGateway', metricName: 'Latency', dimensionsMap: { ApiName: props.apiGatewayName }, statistic: 'p99', period: defaultPeriod, label: 'P99 Latency (ms)' }),
        new cloudwatch.Metric({ namespace: 'AWS/ApiGateway', metricName: 'Latency', dimensionsMap: { ApiName: props.apiGatewayName }, statistic: 'p95', period: defaultPeriod, label: 'P95 Latency (ms)' }),
        new cloudwatch.Metric({ namespace: 'AWS/ApiGateway', metricName: 'Count', dimensionsMap: { ApiName: props.apiGatewayName }, statistic: 'Sum', period: defaultPeriod, label: 'Request Count' }),
      ];
      widgets.push(DashboardWidgetFactory.createGraphWidget('API Gateway Key Metrics', apiGwMetrics, { width: 24, height: 6 }));
    }

    // Lambda Function Metrics (Aggregate examples)
    if (props.lambdaFunctionNames && props.lambdaFunctionNames.length > 0) {
      widgets.push(DashboardWidgetFactory.createTextWidget('## Lambda Functions Overview', { width: 24, height: 1 }));
      // Aggregate Errors
      const aggLambdaErrors: cloudwatch.IMetric[] = props.lambdaFunctionNames.map(name =>
        new cloudwatch.Metric({ namespace: 'AWS/Lambda', metricName: 'Errors', dimensionsMap: { FunctionName: name }, statistic: 'Sum', period: defaultPeriod, label: `${name} Errors` })
      );
       widgets.push(DashboardWidgetFactory.createGraphWidget('Aggregate Lambda Errors', aggLambdaErrors, { width: 12, height: 6 }));

      // Aggregate Throttles
      const aggLambdaThrottles: cloudwatch.IMetric[] = props.lambdaFunctionNames.map(name =>
        new cloudwatch.Metric({ namespace: 'AWS/Lambda', metricName: 'Throttles', dimensionsMap: { FunctionName: name }, statistic: 'Sum', period: defaultPeriod, label: `${name} Throttles` })
      );
      widgets.push(DashboardWidgetFactory.createGraphWidget('Aggregate Lambda Throttles', aggLambdaThrottles, { width: 12, height: 6 }));
    }

    // RDS Metrics
    if (props.rdsInstanceIdentifier) {
      widgets.push(DashboardWidgetFactory.createTextWidget(`## RDS Instance: ${props.rdsInstanceIdentifier}`, { width: 24, height: 1 }));
      const rdsMetrics = [
        new cloudwatch.Metric({ namespace: 'AWS/RDS', metricName: 'CPUUtilization', dimensionsMap: { DBInstanceIdentifier: props.rdsInstanceIdentifier }, statistic: 'Average', period: defaultPeriod, label: 'CPU Utilization (%)' }),
        new cloudwatch.Metric({ namespace: 'AWS/RDS', metricName: 'DatabaseConnections', dimensionsMap: { DBInstanceIdentifier: props.rdsInstanceIdentifier }, statistic: 'Average', period: defaultPeriod, label: 'DB Connections' }),
      ];
      widgets.push(DashboardWidgetFactory.createGraphWidget('RDS Key Metrics', rdsMetrics, { width: 12, height: 6 }));
      widgets.push(DashboardWidgetFactory.createSingleValueWidget(
        'RDS Free Storage Space (GB)',
        [new cloudwatch.Metric({ namespace: 'AWS/RDS', metricName: 'FreeStorageSpace', dimensionsMap: { DBInstanceIdentifier: props.rdsInstanceIdentifier }, statistic: 'Minimum', period: defaultPeriod, unit: cloudwatch.Unit.GIGABYTES, label: 'Free Storage (GB)' })], // Note: metric is in Bytes, conversion needed if displaying directly or adjust unit if possible
        { width: 12, height: 3, setPeriodToTimeRange: false }
      ));
    }

    // DynamoDB Metrics (Aggregate examples)
    if (props.dynamoDbTableNames && props.dynamoDbTableNames.length > 0) {
      widgets.push(DashboardWidgetFactory.createTextWidget('## DynamoDB Tables Overview', { width: 24, height: 1 }));
       const aggDDBReadThrottles: cloudwatch.IMetric[] = props.dynamoDbTableNames.map(name =>
        new cloudwatch.Metric({ namespace: 'AWS/DynamoDB', metricName: 'ReadThrottleEvents', dimensionsMap: { TableName: name }, statistic: 'Sum', period: defaultPeriod, label: `${name} Read Throttles` })
      );
      widgets.push(DashboardWidgetFactory.createGraphWidget('DynamoDB Read Throttles', aggDDBReadThrottles, { width: 12, height: 6 }));

      const aggDDBWriteThrottles: cloudwatch.IMetric[] = props.dynamoDbTableNames.map(name =>
        new cloudwatch.Metric({ namespace: 'AWS/DynamoDB', metricName: 'WriteThrottleEvents', dimensionsMap: { TableName: name }, statistic: 'Sum', period: defaultPeriod, label: `${name} Write Throttles` })
      );
      widgets.push(DashboardWidgetFactory.createGraphWidget('DynamoDB Write Throttles', aggDDBWriteThrottles, { width: 12, height: 6 }));
    }

    // Custom Business Metrics
    if (props.customBusinessMetrics && props.customBusinessMetrics.length > 0) {
      widgets.push(DashboardWidgetFactory.createTextWidget('## Custom Business Metrics', { width: 24, height: 1 }));
      props.customBusinessMetrics.forEach(customMetric => {
        const metric = new cloudwatch.Metric({
          namespace: customMetric.namespace,
          metricName: customMetric.metricName,
          dimensionsMap: customMetric.dimensions,
          statistic: customMetric.statistic ?? 'Sum',
          period: customMetric.period ?? defaultPeriod,
          label: customMetric.title
        });
        widgets.push(DashboardWidgetFactory.createGraphWidget(
          customMetric.title,
          [metric],
          { width: 12, height: 6 }
        ));
      });
    }

    // Add all widgets to the dashboard
    // The dashboard will arrange them in rows automatically.
    // For more complex layouts, use multiple addWidgets calls with explicit row/column positioning
    // or use Column and Row layout widgets. For simplicity, adding all in one go.
    this.dashboard.addWidgets(...widgets);
  }
}