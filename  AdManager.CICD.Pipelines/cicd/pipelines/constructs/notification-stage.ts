import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codestarnotifications from 'aws-cdk-lib/aws-codestarnotifications';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as chatbot from 'aws-cdk-lib/aws-chatbot'; // Import chatbot
import { NotificationStageProps } from '../interfaces/pipeline-props';

export class NotificationStage extends Construct {
    public readonly notificationRule: codestarnotifications.NotificationRule;

    constructor(scope: Construct, id: string, props: NotificationStageProps) {
        super(scope, id);

        const targets: codestarnotifications.INotificationRuleTarget[] = [];

        // SNS Topic Target
        const snsTopic = sns.Topic.fromTopicArn(this, `${props.pipelineName}NotificationSnsTopicImport`, props.notificationSnsTopicArn);
        targets.push(snsTopic);

        // AWS Chatbot Target (if Slack channel ARN is provided)
        if (props.slackChannelConfigurationArn) {
            // Note: This assumes the slackChannelConfigurationArn is for a Chatbot configuration
            // that is ALREADY configured to use an SNS topic. If the Chatbot config is general,
            // it's better that Chatbot subscribes to the props.notificationSnsTopicArn.
            // However, NotificationRule can directly target a Chatbot configuration.
            const slackTarget = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(
                this, 
                `${props.pipelineName}SlackChannel`, 
                props.slackChannelConfigurationArn
            );
            targets.push(slackTarget);
        }
        
        this.notificationRule = new codestarnotifications.NotificationRule(this, `${props.pipelineName}NotificationRule`, {
            notificationRuleName: `${props.pipelineName}-PipelineNotifications-${cdk.Stack.of(this).stackName}`,
            source: props.pipeline,
            events: [
                'codepipeline.PipelineExecutionSucceeded',
                'codepipeline.PipelineExecutionFailed',
                'codepipeline.PipelineExecutionCanceled',
                'codepipeline.PipelineExecutionSuperseded',
                'codepipeline.PipelineExecutionResumed',
                'codepipeline.PipelineExecutionStarted',
                'codepipeline.StageExecutionSucceeded',
                'codepipeline.StageExecutionFailed',
                'codepipeline.StageExecutionResumed',
                'codepipeline.StageExecutionCanceled',
                'codepipeline.StageExecutionStarted',
                'codepipeline.ActionExecutionSucceeded',
                'codepipeline.ActionExecutionFailed',
                'codepipeline.ActionExecutionCanceled',
                'codepipeline.ActionExecutionStarted',
                'codepipeline.ManualApprovalNeeded', // For manual approval notifications
                'codepipeline.ManualApprovalSucceeded',
                'codepipeline.ManualApprovalFailed',
            ],
            targets: targets,
            detailType: codestarnotifications.DetailType.FULL, // FULL provides more context in notifications
            // enabled: true, // Default is true
        });
    }
}