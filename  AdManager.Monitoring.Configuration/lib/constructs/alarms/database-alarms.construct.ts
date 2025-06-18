import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import { DatabaseAlarmsProps } from '../../interfaces/alarm-props.interface';
import { BaseAlarmUtils } from './base-alarm.construct';
import * as alarmConfigurations from '../../../config/alarm-configurations';

/**
 * Defines CloudWatch Alarms for database metrics (RDS and DynamoDB).
 * This construct monitors database health and performance.
 */
export class DatabaseAlarmsConstruct extends Construct {
  constructor(scope: Construct, id: string, props: DatabaseAlarmsProps) {
    super(scope, id);

    const criticalPeriod = props.config?.periodInSeconds ?? alarmConfigurations.CRITICAL_ALARM_PERIOD_SECONDS;
    const warningPeriod = props.config?.periodInSeconds ?? alarmConfigurations.WARNING_ALARM_PERIOD_SECONDS;
    const evaluationPeriods = props.config?.evaluationPeriods ?? alarmConfigurations.DEFAULT_EVALUATION_PERIODS;

    // RDS Alarms
    if (props.rdsInstanceIdentifier) {
      const rdsId = props.rdsInstanceIdentifier;

      // Metric for CPUUtilization
      const cpuUtilizationMetric = new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: 'CPUUtilization',
        dimensionsMap: { DBInstanceIdentifier: rdsId },
        statistic: 'Average',
        period: warningPeriod,
      });
      const highCpuAlarm = new cloudwatch.Alarm(this, `RDS-HighCPU-${rdsId}`, {
        alarmName: `${rdsId}-HighCPUUtilization`,
        alarmDescription: `High CPU utilization for RDS instance ${rdsId}`,
        metric: cpuUtilizationMetric,
        threshold: props.config?.rdsCpuThresholdPercentage ?? alarmConfigurations.RDS_CPU_UTILIZATION_THRESHOLD_PERCENTAGE,
        evaluationPeriods: evaluationPeriods,
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      });
      highCpuAlarm.addAlarmAction(BaseAlarmUtils.createSnsAlarmAction(props.warningAlertsTopic));

      // Metric for DatabaseConnections
      const dbConnectionsMetric = new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: 'DatabaseConnections',
        dimensionsMap: { DBInstanceIdentifier: rdsId },
        statistic: 'Sum', // Or Average, depending on desired alert behavior
        period: warningPeriod,
      });
      const highDbConnectionsAlarm = new cloudwatch.Alarm(this, `RDS-HighDBConnections-${rdsId}`, {
        alarmName: `${rdsId}-HighDBConnections`,
        alarmDescription: `High database connections for RDS instance ${rdsId}`,
        metric: dbConnectionsMetric,
        threshold: props.config?.rdsConnectionsThresholdCount ?? alarmConfigurations.RDS_DB_CONNECTIONS_THRESHOLD_COUNT,
        evaluationPeriods: evaluationPeriods,
        comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      });
      highDbConnectionsAlarm.addAlarmAction(BaseAlarmUtils.createSnsAlarmAction(props.warningAlertsTopic));

      // Metric for FreeStorageSpace (in Bytes)
      const freeStorageSpaceMetric = new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: 'FreeStorageSpace',
        dimensionsMap: { DBInstanceIdentifier: rdsId },
        statistic: 'Minimum',
        period: criticalPeriod, // Critical as running out of storage is severe
      });
      // Convert GB threshold to Bytes
      const freeStorageThresholdGb = props.config?.rdsFreeStorageThresholdGb ?? alarmConfigurations.RDS_FREE_STORAGE_THRESHOLD_GB;
      const freeStorageThresholdBytes = freeStorageThresholdGb * 1024 * 1024 * 1024;

      const lowFreeStorageAlarm = new cloudwatch.Alarm(this, `RDS-LowFreeStorage-${rdsId}`, {
        alarmName: `${rdsId}-LowFreeStorageSpace`,
        alarmDescription: `Low free storage space for RDS instance ${rdsId}`,
        metric: freeStorageSpaceMetric,
        threshold: freeStorageThresholdBytes,
        evaluationPeriods: evaluationPeriods,
        comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
        treatMissingData: cloudwatch.TreatMissingData.BREACHING, // If metric is missing, assume problem
      });
      lowFreeStorageAlarm.addAlarmAction(BaseAlarmUtils.createSnsAlarmAction(props.criticalAlertsTopic));
    }

    // DynamoDB Alarms
    if (props.dynamoDbTableNames && props.dynamoDbTableNames.length > 0) {
      props.dynamoDbTableNames.forEach(tableName => {
        const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9-_]/g, '');

        // Metric for ReadThrottleEvents
        const readThrottleMetric = new cloudwatch.Metric({
          namespace: 'AWS/DynamoDB',
          metricName: 'ReadThrottleEvents',
          dimensionsMap: { TableName: tableName },
          statistic: 'Sum',
          period: warningPeriod,
        });
        const highReadThrottleAlarm = new cloudwatch.Alarm(this, `DDB-HighReadThrottles-${sanitizedTableName}`, {
          alarmName: `${tableName}-HighReadThrottleEvents`,
          alarmDescription: `High read throttle events for DynamoDB table ${tableName}`,
          metric: readThrottleMetric,
          threshold: props.config?.dynamoDbThrottleThresholdCount ?? alarmConfigurations.DYNAMODB_THROTTLE_EVENTS_THRESHOLD_COUNT,
          evaluationPeriods: evaluationPeriods,
          comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
          treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        });
        highReadThrottleAlarm.addAlarmAction(BaseAlarmUtils.createSnsAlarmAction(props.warningAlertsTopic));

        // Metric for WriteThrottleEvents
        const writeThrottleMetric = new cloudwatch.Metric({
          namespace: 'AWS/DynamoDB',
          metricName: 'WriteThrottleEvents',
          dimensionsMap: { TableName: tableName },
          statistic: 'Sum',
          period: warningPeriod,
        });
        const highWriteThrottleAlarm = new cloudwatch.Alarm(this, `DDB-HighWriteThrottles-${sanitizedTableName}`, {
          alarmName: `${tableName}-HighWriteThrottleEvents`,
          alarmDescription: `High write throttle events for DynamoDB table ${tableName}`,
          metric: writeThrottleMetric,
          threshold: props.config?.dynamoDbThrottleThresholdCount ?? alarmConfigurations.DYNAMODB_THROTTLE_EVENTS_THRESHOLD_COUNT,
          evaluationPeriods: evaluationPeriods,
          comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
          treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        });
        highWriteThrottleAlarm.addAlarmAction(BaseAlarmUtils.createSnsAlarmAction(props.warningAlertsTopic));
      });
    }
  }
}