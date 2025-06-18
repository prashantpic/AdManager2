import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sns_subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { ApprovalStageProps } from '../interfaces/pipeline-props';

export class ApprovalStage extends Construct {
    public readonly action: codepipeline_actions.ManualApprovalAction;

    constructor(scope: Construct, id: string, props: ApprovalStageProps) {
        super(scope, id);

        let notificationTopic: sns.ITopic | undefined = undefined;
        let notifyEmails: string[] | undefined = undefined;

        if (props.notificationSnsTopicArn) {
            notificationTopic = sns.Topic.fromTopicArn(this, `${props.stageName}ApprovalNotificationTopicImport`, props.notificationSnsTopicArn);
        } else if (props.approverEmails && props.approverEmails.length > 0) {
            // If specific emails are given and no topic ARN, create a new topic for them.
            // However, ManualApprovalAction can take `notifyEmails` directly.
            // Let's prefer direct emails if topic ARN is not provided.
            notifyEmails = props.approverEmails;
        }

        // If both notificationSnsTopicArn and approverEmails are provided, ManualApprovalAction will use the topic.
        // If only approverEmails, it will use them directly.

        this.action = new codepipeline_actions.ManualApprovalAction({
            actionName: props.stageName || 'Manual_Approval',
            notificationTopic: notificationTopic,
            notifyEmails: notifyEmails && !notificationTopic ? notifyEmails : undefined, // Only use notifyEmails if topic is not set
            // externalEntityLink: 'Optional link to review page',
            // runOrder: 1, // If multiple actions in a stage
        });
    }
}