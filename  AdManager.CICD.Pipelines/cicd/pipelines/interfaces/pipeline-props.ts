import * as cdk from 'aws-cdk-lib';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import { PipelineEnvironmentConfig } from '../config/pipeline-environments';
import { SourceType, BackendServiceConfig, FrontendAppConfig } from '../config/service-definitions';

export interface MainPipelineStackProps extends cdk.StackProps, PipelineEnvironmentConfig {
  // notificationSnsTopicArn for global notifications can be part of PipelineEnvironmentConfig
  // or created within the MainPipelineStack and passed down.
  // For simplicity, if it's a shared topic for all pipelines in this stack, it can be created in MainPipelineStack.
}

export interface SourceStageProps {
  readonly pipelineNamePrefix: string; // e.g., "CampaignService-prod"
  readonly repositoryName: string;
  readonly branchName: string;
  readonly sourceType: SourceType;
  readonly connectionArn?: string; // For GitHub, GitHub Enterprise Server, Bitbucket Cloud
  readonly triggerOnPush?: boolean;
  readonly outputArtifactName?: string; // e.g., 'SourceOutput'
}

export interface BuildStageProps {
  readonly pipelineNamePrefix: string;
  readonly projectSourceName: string; // For naming CodeBuild project, e.g. "CampaignServiceBuild"
  readonly inputArtifact: codepipeline.Artifact;
  readonly outputArtifactName?: string; // e.g., 'BuildOutput'
  readonly buildSpecPath: string; // Path to buildspec in source repo
  readonly environmentVariables?: { [name: string]: codebuild.BuildEnvironmentVariable };
  readonly buildImage?: codebuild.IBuildImage; // Default: aws-linux-corretto-node-20
  readonly serviceRole?: iam.IRole; // Optional: custom role for CodeBuild
  readonly secondaryArtifacts?: codepipeline.Artifact[]; // For buildspecs producing multiple artifacts
  readonly secondarySources?: codepipeline_actions.ActionSource[];
}

export interface TestStageProps extends BuildStageProps {
  // Similar to BuildStageProps, but specific for test execution
  // May include test reporting configurations. Output artifact might not always be needed or could be reports.
  // If tests are part of the main buildspec, a separate TestStageProps might not be fully distinct
  // This can be specialized if tests run in a very different environment or produce specific artifacts.
  readonly reportGroupName?: string; // For CodeBuild Test Reporting
}

export interface SecurityScanStageProps extends BuildStageProps {
  // SAST Specific (SonarQube)
  readonly sonarqubeServerUrl?: string;
  readonly sonarqubeTokenSecretArn?: string; // ARN of Secrets Manager secret (key should be 'sonarToken' or similar)
  readonly sonarqubeProjectKey: string; // e.g. 'CampaignService_main'
  readonly sonarqubeOrganization?: string; // For SonarCloud

  // DAST Specific (OWASP ZAP)
  readonly dastTargetUrl?: string; // URL of the deployed application for DAST scan
}

export interface DeployStageProps {
  readonly pipelineNamePrefix: string;
  readonly projectSourceName: string; // For naming CodeBuild project if S3 deploy, or for context
  readonly inputArtifact: codepipeline.Artifact;
  readonly serviceConfig: BackendServiceConfig | FrontendAppConfig; // To get deployment specifics
  readonly environmentName: 'dev' | 'staging' | 'prod';
  readonly deploymentRole?: iam.IRole; // For CodeDeploy or S3 deployment CodeBuild
  readonly s3DeploymentBucket?: s3.IBucket; // For S3 deployments (target bucket, passed if FE)
  readonly cloudfrontDistributionId?: string; // For S3/CloudFront invalidation (passed if FE with CF)
  readonly ecsClusterName?: string; // Passed if ECS deployment
  readonly ecsServiceName?: string; // Passed if ECS deployment
  readonly taskDefinitionArnArtifact?: codepipeline.Artifact; // For ECS Blue/Green, if taskdef.json is in artifact
  readonly appSpecArtifact?: codepipeline.Artifact; // For ECS Blue/Green, if appspec.json is in artifact
}

export interface ApprovalStageProps {
  readonly stageName?: string; // Default: 'ManualApproval'
  readonly notificationSnsTopic?: sns.ITopic; // SNS Topic for approval notifications
  readonly approverEmails?: string[]; // List of email addresses for notification
  readonly comments?: string; // Comments for the approval action
}

export interface NotificationStageProps {
  readonly pipeline: codepipeline.IPipeline;
  readonly pipelineName: string; // For identifying the pipeline in notifications
  readonly notificationSnsTopic: sns.ITopic; // Central SNS topic for all pipeline notifications
  readonly slackChannelConfigurationArn?: string; // ARN for AWS Chatbot Slack channel configuration
}