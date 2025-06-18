import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { TestStageProps } from '../interfaces/pipeline-props';

export class E2eTestStage extends Construct {
    public readonly codeBuildProject: codebuild.PipelineProject;
    public readonly action: codepipeline_actions.CodeBuildAction;
    public readonly e2eReportOutputArtifact?: codepipeline.Artifact;

    constructor(scope: Construct, id: string, props: TestStageProps) {
        super(scope, id);

        // E2E_TARGET_URL should be passed via props.environmentVariables
        // e.g. E2E_TARGET_URL: { value: 'https://staging.example.com' }
        if (!props.environmentVariables?.E2E_TARGET_URL) {
            cdk.Annotations.of(this).addWarning('E2E_TARGET_URL is not defined in environmentVariables for E2eTestStage. This is usually required.');
        }

        const outputs: codepipeline.Artifact[] = [];
        if (props.outputArtifactName) {
            this.e2eReportOutputArtifact = new codepipeline.Artifact(props.outputArtifactName);
            outputs.push(this.e2eReportOutputArtifact);
        } else {
            // Default output artifact for E2E reports if not specified
            this.e2eReportOutputArtifact = new codepipeline.Artifact(`${props.projectSourceName}E2EReportOutput`);
            outputs.push(this.e2eReportOutputArtifact);
        }

        this.codeBuildProject = new codebuild.PipelineProject(this, `${props.projectSourceName}E2eTestCodeBuildProject`, {
            projectName: `${props.projectSourceName}-E2eTestProject-${cdk.Stack.of(this).stackName}`,
            buildSpec: codebuild.BuildSpec.fromSourceFilename(props.buildSpecPath || 'assets/buildspecs/e2e-tests-run.yml'),
            environment: {
                buildImage: props.buildImage || codebuild.LinuxBuildImage.STANDARD_7_0, // Ensure it has browsers or tools for E2E framework
                privileged: true, // May be needed for browser automation or Xvfb
                computeType: codebuild.ComputeType.MEDIUM, // E2E tests can be resource-intensive
            },
            environmentVariables: props.environmentVariables,
            role: props.serviceRole,
        });

        // The buildspec e2e-tests-run.yml should define 'reports' and 'artifacts' (screenshots, videos)
        // CodeBuild will package these into the output artifact.

        this.action = new codepipeline_actions.CodeBuildAction({
            actionName: `E2E_Test_${props.projectSourceName}`,
            project: this.codeBuildProject,
            input: props.inputArtifact, // Contains test scripts
            outputs: outputs,
        });
    }
}