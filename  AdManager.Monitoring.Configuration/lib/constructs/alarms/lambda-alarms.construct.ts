import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import { LambdaAlarmsProps } from '../../interfaces/alarm-props.interface';
import { BaseAlarmUtils } from './base-alarm.construct';
import * as alarmConfigurations from '../../../config/alarm-configurations';

/**
 * Defines CloudWatch Alarms for AWS Lambda function metrics.
 * This construct monitors Lambda health and performance, such as errors,
 * throttles, and duration.
 */
export class LambdaAlarmsConstruct extends Construct {
  constructor(scope: Construct, id: string, props: LambdaAlarmsProps) {
    super(scope, id);

    const criticalPeriod = props.config?.periodInSeconds ?? alarmConfigurations.CRITICAL_ALARM_PERIOD_SECONDS;
    const warningPeriod = props.config?.periodInSeconds ?? alarmConfigurations.WARNING_ALARM_PERIOD_SECONDS;
    const evaluationPeriods = props.config?.evaluationPeriods ?? alarmConfigurations.DEFAULT_EVALUATION_PERIODS;

    props.functionNames.forEach(functionName => {
      const sanitizedFunctionName = functionName.replace(/[^a-zA-Z0-9-_]/g, ''); // Sanitize for use in construct IDs

      // Metric for Errors
      const errorsMetric = new cloudwatch.Metric({
        namespace: 'AWS/Lambda',
        metricName: 'Errors',
        dimensionsMap: { FunctionName: functionName },
        statistic: 'Sum',
        period: criticalPeriod,
      });

      // Metric for Invocations
      const invocationsMetric = new cloudwatch.Metric({
        namespace: 'AWS/Lambda',
        metricName: 'Invocations',
        dimensionsMap: { FunctionName: functionName },
        statistic: 'Sum',
        period: criticalPeriod,
      });

      // Math expression for Error Rate
      const errorRateExpression = new cloudwatch.MathExpression({
        expression: "IF(mInvocations > 0, (mErrors / mInvocations) * 100, 0)",
        usingMetrics: {
          mErrors: errorsMetric,
          mInvocations: invocationsMetric,
        },
        period: criticalPeriod,
        label: `${functionName} Error Rate (%)`,
      });

      // Alarm for high Error Rate
      const highErrorRateAlarm = new cloudwatch.Alarm(this, `HighErrorRateAlarm-${sanitizedFunctionName}`, {
        alarmName: `${functionName}-HighErrorRate`,
        alarmDescription: `High error rate for Lambda function ${functionName}`,
        metric: errorRateExpression,
        threshold: props.config?.errorRateThresholdPercentage ?? alarmConfigurations.LAMBDA_ERROR_RATE_THRESHOLD_PERCENTAGE,
        evaluationPeriods: evaluationPeriods,
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      });
      highErrorRateAlarm.addAlarmAction(BaseAlarmUtils.createSnsAlarmAction(props.criticalAlertsTopic));

      // Metric for Throttles
      const throttlesMetric = new cloudwatch.Metric({
        namespace: 'AWS/Lambda',
        metricName: 'Throttles',
        dimensionsMap: { FunctionName: functionName },
        statistic: 'Sum',
        period: warningPeriod,
      });

      // Alarm for high Throttles
      const highThrottlesAlarm = new cloudwatch.Alarm(this, `HighThrottlesAlarm-${sanitizedFunctionName}`, {
        alarmName: `${functionName}-HighThrottles`,
        alarmDescription: `High throttle count for Lambda function ${functionName}`,
        metric: throttlesMetric,
        threshold: props.config?.throttleThresholdCount ?? alarmConfigurations.LAMBDA_THROTTLE_THRESHOLD_COUNT,
        evaluationPeriods: evaluationPeriods,
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      });
      highThrottlesAlarm.addAlarmAction(BaseAlarmUtils.createSnsAlarmAction(props.warningAlertsTopic));

      // Metric for Duration (P95)
      const durationP95Metric = new cloudwatch.Metric({
        namespace: 'AWS/Lambda',
        metricName: 'Duration',
        dimensionsMap: { FunctionName: functionName },
        statistic: 'p95',
        period: warningPeriod,
      });

      // Alarm for high Duration (P95)
      const highDurationAlarm = new cloudwatch.Alarm(this, `HighDurationAlarm-${sanitizedFunctionName}`, {
        alarmName: `${functionName}-HighP95Duration`,
        alarmDescription: `High P95 duration for Lambda function ${functionName}`,
        metric: durationP95Metric,
        threshold: props.config?.durationP95ThresholdMs ?? alarmConfigurations.LAMBDA_DURATION_P95_THRESHOLD_MS,
        evaluationPeriods: evaluationPeriods,
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      });
      highDurationAlarm.addAlarmAction(BaseAlarmUtils.createSnsAlarmAction(props.warningAlertsTopic));
    });
  }
}