import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';

import { MainPipelineStackProps } from './interfaces/pipeline-props';
import { backendServices, frontendApps, BackendServiceConfig, FrontendAppConfig, SourceType, DeploymentTargetType } from './config/service-definitions';
import { PipelineEnvironmentConfig } from './config/pipeline-environments'; // Assuming this is where PipelineEnvironmentConfig is also defined

// Import Stage Constructs
import { SourceStage } from './constructs/source-stage';
import { BuildStage } from './constructs/build-stage';
import { UnitTestStage } from './constructs/unit-test-stage';
import { SastScanStage } from './constructs/sast-scan-stage';
import { DeployStage } from './constructs/deploy-stage';
import { E2eTestStage } from './constructs/e2e-test-stage';
import { DastScanStage } from './constructs/dast-scan-stage';
import { ApprovalStage } from './constructs/approval-stage';
import { NotificationStage } from './constructs/notification-stage';

export class MainPipelineStack extends cdk.Stack {
    private readonly notificationTopic: sns.ITopic;

    constructor(scope: Construct, id: string, props: MainPipelineStackProps) {
        super(scope, id, props);

        this.notificationTopic = new sns.Topic(this, 'PipelineNotificationsTopic', {
            displayName: `PipelineNotifications-${props.environmentName}`,
        });

        // Add CfnOutput for the SNS Topic ARN
        new cdk.CfnOutput(this, 'PipelineNotificationTopicArn', {
            value: this.notificationTopic.topicArn,
            description: 'ARN of the SNS topic for pipeline notifications in this environment',
        });


        backendServices.forEach(serviceConfig => {
            if (serviceConfig) { // Basic check
                this.createBackendServicePipeline(serviceConfig, props, this.notificationTopic);
            }
        });

        frontendApps.forEach(appConfig => {
            if (appConfig) { // Basic check
                this.createFrontendAppPipeline(appConfig, props, this.notificationTopic);
            }
        });
    }

    private createBackendServicePipeline(serviceConfig: BackendServiceConfig, stackProps: MainPipelineStackProps, notificationTopic: sns.ITopic): codepipeline.Pipeline {
        const pipelineName = `${stackProps.environmentName}-${serviceConfig.serviceName}-Pipeline`;

        const artifactBucket = new s3.Bucket(this, `${serviceConfig.serviceName}ArtifactBucket`, {
            bucketName: `admanager-${stackProps.environmentName}-${serviceConfig.serviceName.toLowerCase()}-artifacts-${this.account}`,
            removalPolicy: stackProps.environmentName === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: stackProps.environmentName !== 'prod',
            versioned: true,
            encryption: s3.BucketEncryption.S3_MANAGED,
        });

        // --- Source Stage ---
        const sourceStageConstruct = new SourceStage(this, `${serviceConfig.serviceName}SourceStage`, {
            repositoryName: serviceConfig.sourceRepositoryName,
            branchName: serviceConfig.sourceBranch,
            sourceType: serviceConfig.sourceType,
            connectionArn: serviceConfig.githubConnectionArn,
            outputArtifactName: 'SourceOutput',
            triggerOnPush: true,
        });
        const sourceOutputArtifact = sourceStageConstruct.sourceOutput;

        // --- Build Stage ---
        // Note: The buildspec (backend-service-build.yml) must handle Docker build, ECR push, and taskdef.json generation.
        const buildStageConstruct = new BuildStage(this, `${serviceConfig.serviceName}BuildStage`, {
            projectSourceName: `${serviceConfig.serviceName}-Build`,
            inputArtifact: sourceOutputArtifact,
            outputArtifactName: 'BuildOutput',
            buildSpecPath: serviceConfig.buildspecPath || 'assets/buildspecs/backend-service-build.yml',
            environmentVariables: {
                AWS_ACCOUNT_ID: { value: this.account },
                AWS_REGION: { value: this.region },
                ECR_REPOSITORY_URI: { value: `<ECR_REPOSITORY_URI_FOR_${serviceConfig.serviceName.toUpperCase()}>`}, // Placeholder: Needs actual ECR URI
                ECS_TASK_DEFINITION_FAMILY: { value: serviceConfig.ecsTaskDefinitionFamily },
                ECS_CONTAINER_NAME: { value: serviceConfig.ecsContainerName },
                APP_SPEC_FILENAME: {value: serviceConfig.appspecPath || 'appspec.yml'}, // To help buildspec find it
                IMAGE_TAG: {value: 'latest'} // Or use CodePipeline execution ID for unique tags
            },
            // BuildStage construct should create a role with ECR push permissions, S3 artifact permissions etc.
        });
        const buildOutputArtifact = buildStageConstruct.buildOutput;

        // --- Unit Test Stage ---
        const unitTestStageConstruct = new UnitTestStage(this, `${serviceConfig.serviceName}UnitTestStage`, {
            projectSourceName: `${serviceConfig.serviceName}-UnitTests`,
            inputArtifact: sourceOutputArtifact, // Tests usually run on source
            buildSpecPath: serviceConfig.buildspecPath || 'assets/buildspecs/backend-service-build.yml', // Assumes buildspec has 'test' script
            // environmentVariables for test stage if any
        });

        // --- SAST Scan Stage ---
        const sastScanStageConstruct = new SastScanStage(this, `${serviceConfig.serviceName}SastScanStage`, {
            projectSourceName: `${serviceConfig.serviceName}-SastScan`,
            inputArtifact: sourceOutputArtifact,
            buildSpecPath: 'assets/buildspecs/sast-sonarqube-scan.yml',
            sonarqubeServerUrl: stackProps.sonarqubeServerUrl || '<SONARQUBE_SERVER_URL_PLACEHOLDER>',
            sonarqubeTokenSecretArn: stackProps.sonarqubeTokenSecretArn || '<SONARQUBE_TOKEN_SECRET_ARN_PLACEHOLDER>',
            sonarqubeProjectKey: `${stackProps.defaultSonarqubeProjectKeyPrefix || 'admanager-'}${serviceConfig.serviceName}`,
            environmentVariables: { // SONAR_ORGANIZATION is expected by buildspec
                SONAR_ORGANIZATION: { value: stackProps.sonarqubeOrganization || '<SONARQUBE_ORGANIZATION_PLACEHOLDER>'},
            },
        });

        // --- Pipeline Stages Definition ---
        const stages: codepipeline.StageProps[] = [];

        stages.push({
            stageName: 'Source',
            actions: [sourceStageConstruct.action],
        });
        stages.push({
            stageName: 'Build',
            actions: [buildStageConstruct.action],
        });
        stages.push({
            stageName: 'UnitAndSastTests', // Run in parallel if desired, or separate stages
            actions: [unitTestStageConstruct.action, sastScanStageConstruct.action],
        });

        // --- Approval Stage (for Prod) ---
        let approvalAction: codepipeline_actions.ManualApprovalAction | undefined;
        if (stackProps.environmentName === 'prod') {
            const approvalStageConstruct = new ApprovalStage(this, `${serviceConfig.serviceName}ProdApproval`, {
                stageName: 'ApproveProductionDeployment',
                notificationSnsTopicArn: notificationTopic.topicArn,
                // approverEmails: stackProps.approverEmails, // Assuming approverEmails is part of MainPipelineStackProps if needed
            });
            approvalAction = approvalStageConstruct.action;
            stages.push({
                stageName: 'ManualApprovalForProd',
                actions: [approvalAction],
            });
        }

        // --- Deploy Stage ---
        const deployStageConstruct = new DeployStage(this, `${serviceConfig.serviceName}DeployStage`, {
            projectSourceName: `${serviceConfig.serviceName}-Deploy-${stackProps.environmentName}`,
            inputArtifact: buildOutputArtifact,
            serviceConfig: serviceConfig,
            environmentName: stackProps.environmentName,
            // serviceRole: IAM role for CodeDeploy if needed, construct might create one
        });
        stages.push({
            stageName: `DeployTo-${stackProps.environmentName}`,
            actions: [deployStageConstruct.action],
        });
        
        // --- E2E Test Stage ---
        // Placeholder for actual service URL
        const serviceUrlForE2E = stackProps.getServiceApiUrl ? stackProps.getServiceApiUrl(serviceConfig.serviceName) : `https://${serviceConfig.serviceName}.${stackProps.environmentName}.example.com`;
        const e2eTestStageConstruct = new E2eTestStage(this, `${serviceConfig.serviceName}E2eTestStage`, {
            projectSourceName: `${serviceConfig.serviceName}-E2ETests-${stackProps.environmentName}`,
            inputArtifact: sourceOutputArtifact, // Assuming E2E test scripts are in source
            buildSpecPath: 'assets/buildspecs/e2e-tests-run.yml',
            environmentVariables: {
                E2E_TARGET_URL: { value: serviceUrlForE2E },
            },
        });

        // --- DAST Scan Stage ---
        const dastScanStageConstruct = new DastScanStage(this, `${serviceConfig.serviceName}DastScanStage`, {
            projectSourceName: `${serviceConfig.serviceName}-DastScan-${stackProps.environmentName}`,
            inputArtifact: sourceOutputArtifact, // DAST might not need an input artifact but CodeBuild action requires one
            buildSpecPath: 'assets/buildspecs/dast-zap-scan.yml',
            dastTargetUrl: serviceUrlForE2E, // DAST usually targets the same URL as E2E
        });

        stages.push({
            stageName: `PostDeploymentTests-${stackProps.environmentName}`,
            actions: [e2eTestStageConstruct.action, dastScanStageConstruct.action],
        });

        // --- Create Pipeline ---
        const pipeline = new codepipeline.Pipeline(this, pipelineName, {
            pipelineName: pipelineName,
            artifactBucket: artifactBucket,
            stages: stages,
            restartExecutionOnUpdate: true,
        });

        // --- Notification Stage ---
        new NotificationStage(this, `${serviceConfig.serviceName}PipelineNotifications`, {
            pipeline: pipeline,
            pipelineName: pipelineName,
            notificationSnsTopicArn: notificationTopic.topicArn,
            slackChannelConfigurationArn: stackProps.slackChannelConfigurationArn,
        });

        return pipeline;
    }

    private createFrontendAppPipeline(appConfig: FrontendAppConfig, stackProps: MainPipelineStackProps, notificationTopic: sns.ITopic): codepipeline.Pipeline {
        const pipelineName = `${stackProps.environmentName}-${appConfig.serviceName}-Pipeline`;

        const artifactBucket = new s3.Bucket(this, `${appConfig.serviceName}ArtifactBucket`, {
            bucketName: `admanager-${stackProps.environmentName}-${appConfig.serviceName.toLowerCase()}-artifacts-${this.account}`,
            removalPolicy: stackProps.environmentName === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: stackProps.environmentName !== 'prod',
            versioned: true,
            encryption: s3.BucketEncryption.S3_MANAGED,
        });

        // --- Source Stage ---
        const sourceStageConstruct = new SourceStage(this, `${appConfig.serviceName}SourceStage`, {
            repositoryName: appConfig.sourceRepositoryName,
            branchName: appConfig.sourceBranch,
            sourceType: appConfig.sourceType,
            connectionArn: appConfig.githubConnectionArn,
            outputArtifactName: 'SourceOutput',
            triggerOnPush: true,
        });
        const sourceOutputArtifact = sourceStageConstruct.sourceOutput;

        // --- Build Stage ---
        const buildStageConstruct = new BuildStage(this, `${appConfig.serviceName}BuildStage`, {
            projectSourceName: `${appConfig.serviceName}-Build`,
            inputArtifact: sourceOutputArtifact,
            outputArtifactName: 'BuildOutput',
            buildSpecPath: appConfig.buildspecPath || 'assets/buildspecs/frontend-app-build.yml',
        });
        const buildOutputArtifact = buildStageConstruct.buildOutput;

        // --- Unit Test Stage ---
        const unitTestStageConstruct = new UnitTestStage(this, `${appConfig.serviceName}UnitTestStage`, {
            projectSourceName: `${appConfig.serviceName}-UnitTests`,
            inputArtifact: sourceOutputArtifact,
            buildSpecPath: appConfig.buildspecPath || 'assets/buildspecs/frontend-app-build.yml', // Assumes buildspec has 'test' script
        });

        // --- SAST Scan Stage ---
        const sastScanStageConstruct = new SastScanStage(this, `${appConfig.serviceName}SastScanStage`, {
            projectSourceName: `${appConfig.serviceName}-SastScan`,
            inputArtifact: sourceOutputArtifact,
            buildSpecPath: 'assets/buildspecs/sast-sonarqube-scan.yml',
            sonarqubeServerUrl: stackProps.sonarqubeServerUrl || '<SONARQUBE_SERVER_URL_PLACEHOLDER>',
            sonarqubeTokenSecretArn: stackProps.sonarqubeTokenSecretArn || '<SONARQUBE_TOKEN_SECRET_ARN_PLACEHOLDER>',
            sonarqubeProjectKey: `${stackProps.defaultSonarqubeProjectKeyPrefix || 'admanager-'}${appConfig.serviceName}`,
            environmentVariables: {
                SONAR_ORGANIZATION: { value: stackProps.sonarqubeOrganization || '<SONARQUBE_ORGANIZATION_PLACEHOLDER>'},
            },
        });

        // --- Pipeline Stages Definition ---
        const stages: codepipeline.StageProps[] = [];
        stages.push({
            stageName: 'Source',
            actions: [sourceStageConstruct.action],
        });
        stages.push({
            stageName: 'Build',
            actions: [buildStageConstruct.action],
        });
        stages.push({
            stageName: 'UnitAndSastTests',
            actions: [unitTestStageConstruct.action, sastScanStageConstruct.action],
        });

        // --- Approval Stage (for Prod) ---
        if (stackProps.environmentName === 'prod') {
            const approvalStageConstruct = new ApprovalStage(this, `${appConfig.serviceName}ProdApproval`, {
                stageName: 'ApproveProductionDeployment',
                notificationSnsTopicArn: notificationTopic.topicArn,
            });
            stages.push({
                stageName: 'ManualApprovalForProd',
                actions: [approvalStageConstruct.action],
            });
        }
        
        // --- Deploy Stage (S3/CloudFront) ---
        const s3DeploymentBucket = s3.Bucket.fromBucketName(this, `${appConfig.serviceName}DeploymentTargetBucket`, appConfig.s3BucketName);

        const deployStageConstruct = new DeployStage(this, `${appConfig.serviceName}DeployStage`, {
            projectSourceName: `${appConfig.serviceName}-Deploy-${stackProps.environmentName}`,
            inputArtifact: buildOutputArtifact,
            serviceConfig: appConfig,
            environmentName: stackProps.environmentName,
            s3DeploymentBucket: s3DeploymentBucket,
            cloudfrontDistributionId: appConfig.cloudfrontDistributionId,
        });
        stages.push({
            stageName: `DeployTo-${stackProps.environmentName}`,
            actions: [deployStageConstruct.action],
        });

        // --- E2E Test Stage ---
        // Placeholder for actual service URL
        const frontendUrlForE2E = stackProps.getServiceFrontendUrl ? stackProps.getServiceFrontendUrl(appConfig.serviceName) : `https://${appConfig.serviceName}.${stackProps.environmentName}.example.com`;
        const e2eTestStageConstruct = new E2eTestStage(this, `${appConfig.serviceName}E2eTestStage`, {
            projectSourceName: `${appConfig.serviceName}-E2ETests-${stackProps.environmentName}`,
            inputArtifact: sourceOutputArtifact, // Assuming E2E test scripts are in source
            buildSpecPath: 'assets/buildspecs/e2e-tests-run.yml',
            environmentVariables: {
                E2E_TARGET_URL: { value: frontendUrlForE2E },
            },
        });

        // --- DAST Scan Stage ---
        const dastScanStageConstruct = new DastScanStage(this, `${appConfig.serviceName}DastScanStage`, {
            projectSourceName: `${appConfig.serviceName}-DastScan-${stackProps.environmentName}`,
            inputArtifact: sourceOutputArtifact,
            buildSpecPath: 'assets/buildspecs/dast-zap-scan.yml',
            dastTargetUrl: frontendUrlForE2E,
        });

        stages.push({
            stageName: `PostDeploymentTests-${stackProps.environmentName}`,
            actions: [e2eTestStageConstruct.action, dastScanStageConstruct.action],
        });

        // --- Create Pipeline ---
        const pipeline = new codepipeline.Pipeline(this, pipelineName, {
            pipelineName: pipelineName,
            artifactBucket: artifactBucket,
            stages: stages,
            restartExecutionOnUpdate: true,
        });

        // --- Notification Stage ---
        new NotificationStage(this, `${appConfig.serviceName}PipelineNotifications`, {
            pipeline: pipeline,
            pipelineName: pipelineName,
            notificationSnsTopicArn: notificationTopic.topicArn,
            slackChannelConfigurationArn: stackProps.slackChannelConfigurationArn,
        });

        return pipeline;
    }
}