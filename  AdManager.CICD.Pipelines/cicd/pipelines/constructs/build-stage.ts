import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { BuildStageProps } from '../interfaces/pipeline-props';

export class BuildStage extends Construct {
    public readonly buildOutput: codepipeline.Artifact;
    public readonly codeBuildProject: codebuild.PipelineProject;
    public readonly action: codepipeline_actions.CodeBuildAction;

    constructor(scope: Construct, id: string, props: BuildStageProps) {
        super(scope, id);

        this.buildOutput = new codepipeline.Artifact(props.outputArtifactName || `${props.projectSourceName}BuildOutput`);

        this.codeBuildProject = new codebuild.PipelineProject(this, `${props.projectSourceName}CodeBuildProject`, {
            projectName: `${props.projectSourceName}-BuildProject-${cdk.Stack.of(this).stackName}`,
            buildSpec: codebuild.BuildSpec.fromSourceFilename(props.buildSpecPath),
            environment: {
                buildImage: props.buildImage || codebuild.LinuxBuildImage.STANDARD_7_0, // Corresponds to Node.js 20, Java 21, etc.
                privileged: true, // Often needed for Docker operations
                computeType: codebuild.ComputeType.SMALL, // Default, can be configured
            },
            environmentVariables: props.environmentVariables,
            role: props.serviceRole, // If undefined, a new role is created by CDK
            // cache: codebuild.Cache.local(codebuild.LocalCacheMode.SOURCE, codebuild.LocalCacheMode.DOCKER_LAYER, codebuild.LocalCacheMode.CUSTOM), // Optional build caching
        });

        // Example: Grant ECR push permissions if not handled by a predefined role or ECR resource policy
        // This is a common requirement for backend services.
        // Ensure the ECR repository ARN is correctly specified.
        // if (props.serviceRole === undefined) { // Only add if role is auto-created
        //     this.codeBuildProject.addToRolePolicy(new iam.PolicyStatement({
        //         actions: ["ecr:GetAuthorizationToken"],
        //         resources: ["*"],
        //     }));
        //     this.codeBuildProject.addToRolePolicy(new iam.PolicyStatement({
        //         actions: [
        //             "ecr:BatchCheckLayerAvailability",
        //             "ecr:GetDownloadUrlForLayer",
        //             "ecr:BatchGetImage",
        //             "ecr:InitiateLayerUpload",
        //             "ecr:UploadLayerPart",
        //             "ecr:CompleteLayerUpload",
        //             "ecr:PutImage"
        //         ],
        //         // Replace with specific ECR repository ARN if known, e.g. from serviceConfig
        //         resources: [`arn:aws:ecr:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:repository/${props.projectSourceName.toLowerCase()}*`],
        //     }));
        // }


        this.action = new codepipeline_actions.CodeBuildAction({
            actionName: `Build_${props.projectSourceName}`,
            project: this.codeBuildProject,
            input: props.inputArtifact,
            outputs: [this.buildOutput],
        });
    }
}