import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import { ApiGatewayAlarmsProps } from '../../interfaces/alarm-props.interface';
import { BaseAlarmUtils } from './base-alarm.construct';
import * as alarmConfigurations from '../../../config/alarm-configurations';

/**
 * Defines CloudWatch Alarms for API Gateway metrics.
 * This construct monitors API Gateway health and performance,
 * such as 5XX error rates and latency.
 */
export class ApiGatewayAlarmsConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayAlarmsProps) {
    super(scope, id);

    const period = props.config?.periodInSeconds ?? alarmConfigurations.CRITICAL_ALARM_PERIOD_SECONDS;
    const evaluationPeriods = props.config?.evaluationPeriods ?? alarmConfigurations.DEFAULT_EVALUATION_PERIODS;

    // Metric for 5XX Errors
    const serverErrorMetric = new cloudwatch.Metric({
      namespace: 'AWS/ApiGateway',
      metricName: '5XXError',
      dimensionsMap: { ApiName: props.apiGatewayName },
      statistic: 'Sum',
      period: period,
    });

    // Metric for total request count
    const countMetric = new cloudwatch.Metric({
      namespace: 'AWS/ApiGateway',
      metricName: 'Count',
      dimensionsMap: { ApiName: props.apiGatewayName },
      statistic: 'Sum',
      period: period,
    });

    // Math expression for 5XX Error Rate
    // (m5XX / mCount) * 100
    // FILL(mCount, 0) - if count is 0, treat as 0 to avoid division by zero in expression leading to alarm
    // IF(mCount > 0, (m5XX/mCount)*100, 0) - More robust expression to prevent alarms when no traffic
    const errorRateExpression = new cloudwatch.MathExpression({
      expression: "IF(mCount > 0, (m5XX / mCount) * 100, 0)",
      usingMetrics: {
        m5XX: serverErrorMetric,
        mCount: countMetric,
      },
      period: period,
      label: '5XX Error Rate (%)',
    });

    // Alarm for high 5XX Error Rate
    const highErrorRateAlarm = new cloudwatch.Alarm(this, 'High5xxErrorRateAlarm', {
      alarmName: `${props.apiGatewayName}-High5xxErrorRate`,
      alarmDescription: `High 5XX error rate for API Gateway ${props.apiGatewayName}`,
      metric: errorRateExpression,
      threshold: props.config?.errorRateThresholdPercentage ?? alarmConfigurations.API_GATEWAY_5XX_ERROR_THRESHOLD_PERCENTAGE,
      evaluationPeriods: evaluationPeriods,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING, // No data means no errors to alarm on
    });
    highErrorRateAlarm.addAlarmAction(BaseAlarmUtils.createSnsAlarmAction(props.criticalAlertsTopic));

    // Metric for P99 Latency
    const p99LatencyMetric = new cloudwatch.Metric({
      namespace: 'AWS/ApiGateway',
      metricName: 'Latency',
      dimensionsMap: { ApiName: props.apiGatewayName },
      statistic: 'p99',
      period: period,
    });

    // Alarm for high P99 Latency
    const highP99LatencyAlarm = new cloudwatch.Alarm(this, 'HighP99LatencyAlarm', {
      alarmName: `${props.apiGatewayName}-HighP99Latency`,
      alarmDescription: `High P99 latency for API Gateway ${props.apiGatewayName}`,
      metric: p99LatencyMetric,
      threshold: props.config?.latencyP99ThresholdMs ?? alarmConfigurations.API_GATEWAY_LATENCY_P99_THRESHOLD_MS,
      evaluationPeriods: evaluationPeriods,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    highP99LatencyAlarm.addAlarmAction(BaseAlarmUtils.createSnsAlarmAction(props.warningAlertsTopic));

    // Optional: Alarm for low request count if API_GATEWAY_REQUEST_COUNT_LOW_THRESHOLD is defined
    if (alarmConfigurations.API_GATEWAY_REQUEST_COUNT_LOW_THRESHOLD !== undefined &&
        alarmConfigurations.API_GATEWAY_REQUEST_COUNT_LOW_THRESHOLD >=0) { // Check if it's a valid number
      const lowRequestCountAlarm = new cloudwatch.Alarm(this, 'LowRequestCountAlarm', {
        alarmName: `${props.apiGatewayName}-LowRequestCount`,
        alarmDescription: `Low request count for API Gateway ${props.apiGatewayName}, potentially indicating an issue.`,
        metric: countMetric,
        threshold: alarmConfigurations.API_GATEWAY_REQUEST_COUNT_LOW_THRESHOLD,
        evaluationPeriods: evaluationPeriods, // Consider a longer evaluation period for low count
        comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
        treatMissingData: cloudwatch.TreatMissingData.BREACHING, // If API is down, count will be 0/missing
      });
      lowRequestCountAlarm.addAlarmAction(BaseAlarmUtils.createSnsAlarmAction(props.warningAlertsTopic));
    }
  }
}