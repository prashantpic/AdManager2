import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { TestStageProps } from '../interfaces/pipeline-props';

export class UnitTestStage extends Construct {
    public readonly codeBuildProject: codebuild.PipelineProject;
    public readonly action: codepipeline_actions.CodeBuildAction;
    public readonly testReportsOutputArtifact?: codepipeline.Artifact;

    constructor(scope: Construct, id: string, props: TestStageProps) {
        super(scope, id);

        const outputs: codepipeline.Artifact[] = [];
        if (props.outputArtifactName) {
            this.testReportsOutputArtifact = new codepipeline.Artifact(props.outputArtifactName);
            outputs.push(this.testReportsOutputArtifact);
        }

        this.codeBuildProject = new codebuild.PipelineProject(this, `${props.projectSourceName}UnitTestCodeBuildProject`, {
            projectName: `${props.projectSourceName}-UnitTestProject-${cdk.Stack.of(this).stackName}`,
            buildSpec: codebuild.BuildSpec.fromSourceFilename(props.buildSpecPath),
            environment: {
                buildImage: props.buildImage || codebuild.LinuxBuildImage.STANDARD_7_0,
                computeType: codebuild.ComputeType.SMALL,
            },
            environmentVariables: props.environmentVariables,
            role: props.serviceRole,
        });

        // The buildspec YAML (e.g., backend-service-build.yml) should define the 'reports' section
        // for CodeBuild to automatically pick up and report test results.
        // Example:
        // reports:
        //   TestReportGroup: # Logical name for the report group in the buildspec
        //     files:
        //       - 'junit.xml'
        //     file-format: 'JUNITXML'
        //     base-directory: 'test-results'

        this.action = new codepipeline_actions.CodeBuildAction({
            actionName: `Unit_Integration_Test_${props.projectSourceName}`,
            project: this.codeBuildProject,
            input: props.inputArtifact,
            outputs: outputs.length > 0 ? outputs : undefined,
        });
    }
}