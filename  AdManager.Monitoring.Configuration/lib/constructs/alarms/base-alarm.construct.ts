import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';

/**
 * Utility class for creating CloudWatch Alarms actions.
 * Provides reusable logic for creating CloudWatch Alarm SNS actions.
 */
export class BaseAlarmUtils {
  /**
   * Creates an SNS action for a CloudWatch Alarm.
   * @param topic The SNS topic to which the alarm action will publish.
   * @returns A new SnsAction instance.
   */
  public static createSnsAlarmAction(topic: sns.ITopic): cloudwatch.actions.SnsAction {
    return new cloudwatch.actions.SnsAction(topic);
  }
}