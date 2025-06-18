import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sns_subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as lambda from 'aws-cdk-lib/aws-lambda';

/**
 * Properties for the AlertSubscriptionsConstruct.
 */
export interface AlertSubscriptionsProps {
  /** The SNS topic for critical alerts. */
  readonly criticalAlertsTopic: sns.ITopic;
  /** The SNS topic for warning alerts. */
  readonly warningAlertsTopic: sns.ITopic;
  /** The SNS topic for informational alerts. */
  readonly infoAlertsTopic: sns.ITopic;
  /** Optional email address for critical alerts. */
  readonly criticalEmailAddress?: string;
  /** Optional email address for warning alerts. */
  readonly warningEmailAddress?: string;
  /** Optional email address for informational alerts. */
  readonly infoEmailAddress?: string;
  /**
   * Optional ARN for PagerDuty integration (Lambda or SNS).
   * This will be used if the corresponding feature toggle is enabled.
   */
  readonly pagerDutyIntegrationArn?: string;
  /**
   * Optional OpsGenie integration Lambda ARN.
   * This will be used if the corresponding feature toggle is enabled.
   */
  readonly opsgenieIntegrationLambdaArn?: string; // As per SDS 3.7.2, passed down via MonitoringStackProps
  /**
   * Feature toggles to enable/disable certain subscriptions.
   * e.g., { enablePagerDutyIntegrationHighSeverity: true, enableOpsgenieIntegration: true }
   */
  readonly featureToggles?: { [key: string]: boolean };
}

/**
 * AWS CDK construct for creating subscriptions to SNS topics.
 * This construct configures how alerts published to SNS topics are delivered
 * to operational teams or systems (e.g., email, PagerDuty, OpsGenie).
 */
export class AlertSubscriptionsConstruct extends Construct {
  constructor(scope: Construct, id: string, props: AlertSubscriptionsProps) {
    super(scope, id);

    // Subscribe email endpoints
    if (props.criticalEmailAddress) {
      props.criticalAlertsTopic.addSubscription(
        new sns_subscriptions.EmailSubscription(props.criticalEmailAddress),
      );
    }

    if (props.warningEmailAddress) {
      props.warningAlertsTopic.addSubscription(
        new sns_subscriptions.EmailSubscription(props.warningEmailAddress),
      );
    }

    if (props.infoEmailAddress) {
      props.infoAlertsTopic.addSubscription(
        new sns_subscriptions.EmailSubscription(props.infoEmailAddress),
      );
    }

    // Subscribe PagerDuty integration if ARN is provided and feature toggle is enabled
    if (
      props.pagerDutyIntegrationArn &&
      props.featureToggles?.enablePagerDutyIntegrationHighSeverity
    ) {
      // Assuming the ARN is for a Lambda function based on common PagerDuty integration patterns
      // If it's an SNS topic ARN for PagerDuty's direct SNS integration,
      // PagerDuty would typically subscribe its HTTPS endpoint to this topic.
      // For Lambda, we create a LambdaSubscription.
      if (props.pagerDutyIntegrationArn.startsWith('arn:aws:lambda')) {
        const pagerDutyLambda = lambda.Function.fromFunctionArn(
          this,
          'PagerDutyLambdaImport',
          props.pagerDutyIntegrationArn,
        );
        props.criticalAlertsTopic.addSubscription(
          new sns_subscriptions.LambdaSubscription(pagerDutyLambda),
        );
      } else if (props.pagerDutyIntegrationArn.startsWith('arn:aws:sns')) {
        // This would mean our topic needs to publish to PagerDuty's SNS topic, which is not standard.
        // More likely, PagerDuty subscribes to *our* topic.
        // If PagerDuty provides an HTTPS endpoint for SNS, a UrlSubscription would be used.
        // For simplicity, we only implement Lambda subscription here as per typical CDK patterns.
        console.warn(`PagerDuty SNS ARN (${props.pagerDutyIntegrationArn}) provided. Manual subscription by PagerDuty to this topic may be required, or use a Lambda integration.`);
      }
    }

    // Subscribe OpsGenie integration Lambda if ARN is provided and feature toggle is enabled
    if (
        props.opsgenieIntegrationLambdaArn &&
        props.featureToggles?.enableOpsgenieIntegration // Assuming a similar toggle name
      ) {
        if (props.opsgenieIntegrationLambdaArn.startsWith('arn:aws:lambda')) {
          const opsgenieLambda = lambda.Function.fromFunctionArn(
            this,
            'OpsgenieLambdaImport',
            props.opsgenieIntegrationLambdaArn,
          );
          // Typically, OpsGenie might subscribe to critical and/or warning topics
          props.criticalAlertsTopic.addSubscription(
            new sns_subscriptions.LambdaSubscription(opsgenieLambda)
          );
          // Optionally, add to warning topic as well if needed
          // props.warningAlertsTopic.addSubscription(
          //   new sns_subscriptions.LambdaSubscription(opsgenieLambda)
          // );
        } else {
            console.warn(`OpsGenie integration ARN (${props.opsgenieIntegrationLambdaArn}) is not a Lambda ARN. Only Lambda ARN integration is implemented.`);
        }
      }
  }
}