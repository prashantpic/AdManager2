import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { SecurityScanStageProps } from '../interfaces/pipeline-props';

export class DastScanStage extends Construct {
    public readonly codeBuildProject: codebuild.PipelineProject;
    public readonly action: codepipeline_actions.CodeBuildAction;
    public readonly dastReportOutputArtifact?: codepipeline.Artifact;

    constructor(scope: Construct, id: string, props: SecurityScanStageProps) {
        super(scope, id);

        const dastEnvVars: { [name: string]: codebuild.BuildEnvironmentVariable } = {
            ...(props.dastTargetUrl && { DAST_TARGET_URL: { value: props.dastTargetUrl } }),
            ...props.environmentVariables,
        };

        const outputs: codepipeline.Artifact[] = [];
        if (props.outputArtifactName) {
            this.dastReportOutputArtifact = new codepipeline.Artifact(props.outputArtifactName);
            outputs.push(this.dastReportOutputArtifact);
        } else {
             // Default output artifact for DAST reports if not specified
            this.dastReportOutputArtifact = new codepipeline.Artifact(`${props.projectSourceName}DastReportOutput`);
            outputs.push(this.dastReportOutputArtifact);
        }


        this.codeBuildProject = new codebuild.PipelineProject(this, `${props.projectSourceName}DastScanCodeBuildProject`, {
            projectName: `${props.projectSourceName}-DastScanProject-${cdk.Stack.of(this).stackName}`,
            buildSpec: codebuild.BuildSpec.fromSourceFilename(props.buildSpecPath || 'assets/buildspecs/dast-zap-scan.yml'),
            environment: {
                buildImage: props.buildImage || codebuild.LinuxBuildImage.STANDARD_7_0, // OWASP ZAP runs in Docker, so host needs Docker
                privileged: true, // Required for Docker-in-Docker or running Docker commands
                computeType: codebuild.ComputeType.SMALL, // Adjust if ZAP needs more resources
            },
            environmentVariables: dastEnvVars,
            role: props.serviceRole,
        });

        // DAST scan buildspec (dast-zap-scan.yml) defines artifacts to be produced.
        // CodeBuild will package these into the output artifact.

        this.action = new codepipeline_actions.CodeBuildAction({
            actionName: `DAST_Scan_${props.projectSourceName}`,
            project: this.codeBuildProject,
            // DAST scan might not always need the source artifact, but it's part of SecurityScanStageProps.
            // It could contain test configurations or scripts.
            input: props.inputArtifact,
            outputs: outputs,
        });
    }
}