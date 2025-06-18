import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { SecurityScanStageProps } from '../interfaces/pipeline-props';

export class SastScanStage extends Construct {
    public readonly codeBuildProject: codebuild.PipelineProject;
    public readonly action: codepipeline_actions.CodeBuildAction;

    constructor(scope: Construct, id: string, props: SecurityScanStageProps) {
        super(scope, id);

        const sonarQubeEnvVars: { [name: string]: codebuild.BuildEnvironmentVariable } = {
            ...(props.sonarqubeServerUrl && { SONAR_HOST_URL: { value: props.sonarqubeServerUrl } }),
            ...(props.sonarqubeProjectKey && { SONAR_PROJECT_KEY: { value: props.sonarqubeProjectKey } }),
            // SONAR_TOKEN is typically sourced via secrets-manager in the buildspec
            // SONAR_ORGANIZATION might be needed depending on SonarQube setup
            SONAR_ORGANIZATION: { value: props.environmentVariables?.SONAR_ORGANIZATION?.value || '<YOUR_SONAR_ORGANIZATION_PLACEHOLDER>' },
            ...props.environmentVariables, // Allow overrides and additional variables
        };

        this.codeBuildProject = new codebuild.PipelineProject(this, `${props.projectSourceName}SastScanCodeBuildProject`, {
            projectName: `${props.projectSourceName}-SastScanProject-${cdk.Stack.of(this).stackName}`,
            buildSpec: codebuild.BuildSpec.fromSourceFilename(props.buildSpecPath || 'assets/buildspecs/sast-sonarqube-scan.yml'),
            environment: {
                buildImage: props.buildImage || codebuild.LinuxBuildImage.STANDARD_7_0,
                computeType: codebuild.ComputeType.SMALL,
            },
            environmentVariables: sonarQubeEnvVars,
            role: props.serviceRole,
        });

        // Grant permission to access SonarQube token from Secrets Manager if specified
        // The buildspec 'sast-sonarqube-scan.yml' uses `env.secrets-manager`
        // So the CodeBuild role needs permission to the secret referenced there.
        if (props.sonarqubeTokenSecretArn) {
            const secretAccessPolicy = new iam.PolicyStatement({
                actions: ['secretsmanager:GetSecretValue'],
                resources: [props.sonarqubeTokenSecretArn],
            });
            if (props.serviceRole) {
                props.serviceRole.addToPrincipalPolicy(secretAccessPolicy);
            } else {
                this.codeBuildProject.addToRolePolicy(secretAccessPolicy);
            }
        }

        this.action = new codepipeline_actions.CodeBuildAction({
            actionName: `SAST_Scan_${props.projectSourceName}`,
            project: this.codeBuildProject,
            input: props.inputArtifact,
            // SAST scans typically don't produce a pipeline artifact but report to SonarQube server
        });
    }
}