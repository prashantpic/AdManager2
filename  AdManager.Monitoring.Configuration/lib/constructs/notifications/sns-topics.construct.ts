import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';

/**
 * Props for SnsTopicsConstruct.
 * Currently, no custom properties are defined, but it's kept for future extensibility.
 */
export interface SnsTopicsProps {}

/**
 * AWS CDK construct for creating and configuring SNS topics.
 * This construct defines SNS topics for critical, warning, and informational alerts.
 */
export class SnsTopicsConstruct extends Construct {
  /**
   * SNS topic for critical alerts.
   */
  public readonly criticalAlertsTopic: sns.ITopic;

  /**
   * SNS topic for warning alerts.
   */
  public readonly warningAlertsTopic: sns.ITopic;

  /**
   * SNS topic for informational alerts.
   */
  public readonly infoAlertsTopic: sns.ITopic;

  /**
   * Creates an instance of SnsTopicsConstruct.
   * @param scope The scope in which to define this construct.
   * @param id The scoped construct ID.
   * @param props The properties for this construct (optional).
   */
  constructor(scope: Construct, id: string, props?: SnsTopicsProps) {
    super(scope, id);

    this.criticalAlertsTopic = new sns.Topic(this, 'AdManagerCriticalAlertsTopic', {
      displayName: 'AdManager Critical Alerts',
    });

    this.warningAlertsTopic = new sns.Topic(this, 'AdManagerWarningAlertsTopic', {
      displayName: 'AdManager Warning Alerts',
    });

    this.infoAlertsTopic = new sns.Topic(this, 'AdManagerInfoAlertsTopic', {
      displayName: 'AdManager Info Alerts',
    });
  }
}