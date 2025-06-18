import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import { ApplicationMetricAlarmProps } from '../../interfaces/alarm-props.interface'; // Corrected path assumption
import { BaseAlarmUtils } from './base-alarm.construct';

/**
 * Defines CloudWatch Alarms for custom application metrics.
 * This construct is used to monitor key custom business or application
 * performance indicators published to CloudWatch.
 */
export class ApplicationMetricAlarmsConstruct extends Construct {
  public readonly alarm: cloudwatch.Alarm;

  constructor(scope: Construct, id: string, props: ApplicationMetricAlarmProps) {
    super(scope, id);

    const metric = new cloudwatch.Metric({
      namespace: props.namespace,
      metricName: props.metricName,
      dimensionsMap: props.dimensionsMap,
      statistic: props.statistic ?? 'Average', // Default to Average if not specified
      period: props.periodInSeconds, // This is cdk.Duration as per interface
    });

    this.alarm = new cloudwatch.Alarm(this, `${props.alarmName.replace(/[^a-zA-Z0-9-]/g, '')}Alarm`, { // Sanitize id
      alarmName: props.alarmName,
      alarmDescription: `Alarm for custom metric ${props.namespace}/${props.metricName}`,
      metric: metric,
      threshold: props.threshold,
      evaluationPeriods: props.evaluationPeriods,
      comparisonOperator: props.comparisonOperator,
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING, // Default behavior
    });

    props.alarmActionsSnsTopics.forEach(topic => {
      this.alarm.addAlarmAction(BaseAlarmUtils.createSnsAlarmAction(topic));
    });
  }
}