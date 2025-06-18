import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { DeployStageProps } from '../interfaces/pipeline-props';
import { DeploymentTargetType, BackendServiceConfig, FrontendAppConfig } from '../config/service-definitions';

export class DeployStage extends Construct {
    public readonly action: codepipeline.IAction;
    public readonly ecsDeploymentGroup?: codedeploy.IEcsDeploymentGroup;
    public readonly s3DeploymentBucket?: s3.IBucket;

    constructor(scope: Construct, id: string, props: DeployStageProps) {
        super(scope, id);

        switch (props.serviceConfig.deploymentTargetType) {
            case DeploymentTargetType.ECS:
                const backendConfig = props.serviceConfig as BackendServiceConfig;

                const application = new codedeploy.EcsApplication(this, `EcsApplication-${props.projectSourceName}-${props.environmentName}`, {
                    applicationName: `${props.projectSourceName}-App-${props.environmentName}`, // Unique application name
                });

                // Look up existing ECS Cluster and Service
                const cluster = ecs.Cluster.fromClusterAttributes(this, `EcsCluster-${props.projectSourceName}`, {
                    clusterName: backendConfig.ecsClusterName,
                    vpc: cdk.aws_ec2.Vpc.fromLookup(this, 'VpcForEcsCluster', { vpcId: '<YOUR_VPC_ID_PLACEHOLDER>' }) // Replace with actual VPC lookup or import
                });
                
                const ecsService = ecs.BaseService.fromServiceArnWithCluster(this, `EcsService-${props.projectSourceName}`, 
                    `arn:aws:ecs:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:service/${backendConfig.ecsClusterName}/${backendConfig.ecsServiceName}`
                );


                this.ecsDeploymentGroup = new codedeploy.EcsDeploymentGroup(this, `EcsDeploymentGroup-${props.projectSourceName}`, {
                    application: application,
                    service: ecsService,
                    deploymentGroupName: `${props.projectSourceName}-DG-${props.environmentName}`,
                    deploymentConfig: codedeploy.EcsDeploymentConfig.ALL_AT_ONCE, // Or other configs like CANARY_10PERCENT_5MINUTES etc.
                    autoRollback: {
                        failedDeployment: true, // Rollback on failed deployment
                        // stoppedDeployment: true, // Rollback if deployment is manually stopped (optional)
                        // deploymentInAlarm: true, // Rollback if CloudWatch alarms trigger (optional)
                    },
                    role: props.serviceRole, // Optional: if not provided, a role is created.
                });

                // The AppSpec and TaskDefinition files are expected to be in the inputArtifact.
                // Their paths within the artifact are used by CodeDeploy.
                const appSpecPath = backendConfig.appspecPath || 'appspec.yml';
                // Task definition usually named taskdef.json. Assuming it's in the root of input artifact.
                const taskDefPath = 'taskdef.json';

                this.action = new codepipeline_actions.CodeDeployEcsDeployAction({
                    actionName: `Deploy_ECS_${props.projectSourceName}`,
                    deploymentGroup: this.ecsDeploymentGroup,
                    taskDefinitionTemplateFile: props.inputArtifact.atPath(taskDefPath),
                    appSpecTemplateFile: props.inputArtifact.atPath(appSpecPath),
                    // If your taskdef.json uses a placeholder for the image URI, and your build stage
                    // produces an imageDetail.json, you can use containerImageInputs.
                    // Example:
                    // containerImageInputs: [{
                    //     input: props.inputArtifact, // Assuming imageDetail.json is here
                    //     taskDefinitionPlaceholder: 'IMAGE_NAME_PLACEHOLDER_IN_TASKDEF', // Placeholder in taskdef.json
                    // }],
                });
                break;

            case DeploymentTargetType.S3_CLOUDFRONT:
                const frontendConfig = props.serviceConfig as FrontendAppConfig;

                if (props.s3DeploymentBucket) {
                    this.s3DeploymentBucket = props.s3DeploymentBucket;
                } else {
                     this.s3DeploymentBucket = s3.Bucket.fromBucketName(this, 'FrontendDeploymentBucket', frontendConfig.s3BucketName);
                }

                const s3DeployBuildSpec: { [key: string]: any } = {
                    version: '0.2',
                    phases: {
                        build: {
                            commands: [
                                `aws s3 sync ./ s3://${frontendConfig.s3BucketName}/ --delete ${props.environmentName === 'prod' ? '--acl public-read' : ''}`, // ACL for prod only, or manage via bucket policy
                            ],
                        },
                    },
                };

                if (frontendConfig.cloudfrontDistributionId) {
                    s3DeployBuildSpec.phases.build.commands.push(
                        `aws cloudfront create-invalidation --distribution-id ${frontendConfig.cloudfrontDistributionId} --paths "/*"`
                    );
                }

                const s3DeployProject = new codebuild.PipelineProject(this, `${props.projectSourceName}S3DeployProject`, {
                    projectName: `${props.projectSourceName}-S3DeployProject-${cdk.Stack.of(this).stackName}`,
                    buildSpec: codebuild.BuildSpec.fromObject(s3DeployBuildSpec),
                    environment: {
                        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
                        computeType: codebuild.ComputeType.SMALL,
                    },
                    role: props.serviceRole, // If undefined, a role is created.
                });

                // Add permissions to the CodeBuild role for S3 and CloudFront
                const s3Policy = new iam.PolicyStatement({
                    actions: ['s3:ListBucket', 's3:GetObject', 's3:PutObject', 's3:DeleteObject'],
                    resources: [this.s3DeploymentBucket.bucketArn, `${this.s3DeploymentBucket.bucketArn}/*`],
                });
                
                if (props.serviceRole) {
                    props.serviceRole.addToPrincipalPolicy(s3Policy);
                } else {
                     s3DeployProject.addToRolePolicy(s3Policy);
                }


                if (frontendConfig.cloudfrontDistributionId) {
                    const cfPolicy = new iam.PolicyStatement({
                        actions: ['cloudfront:CreateInvalidation'],
                        resources: [`arn:aws:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/${frontendConfig.cloudfrontDistributionId}`],
                    });
                     if (props.serviceRole) {
                        props.serviceRole.addToPrincipalPolicy(cfPolicy);
                    } else {
                         s3DeployProject.addToRolePolicy(cfPolicy);
                    }
                }

                this.action = new codepipeline_actions.CodeBuildAction({
                    actionName: `Deploy_S3_CloudFront_${props.projectSourceName}`,
                    project: s3DeployProject,
                    input: props.inputArtifact, // Contains the built frontend assets
                });
                break;

            default:
                throw new Error(`Unsupported deployment target type: ${props.serviceConfig.deploymentTargetType}`);
        }
    }
}