import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SourceStageProps } from '../interfaces/pipeline-props';
import { SourceType } from '../config/service-definitions'; // Assuming SourceType is here

export class SourceStage extends Construct {
    public readonly sourceOutput: codepipeline.Artifact;
    public readonly action: codepipeline_actions.Action;

    constructor(scope: Construct, id: string, props: SourceStageProps) {
        super(scope, id);

        this.sourceOutput = new codepipeline.Artifact(props.outputArtifactName || `${props.repositoryName}SourceOutput`);

        let sourceAction: codepipeline_actions.Action;

        const triggerAction = props.triggerOnPush === false ? 
                              codepipeline_actions.CodeCommitTrigger.NONE : 
                              codepipeline_actions.CodeCommitTrigger.POLL; // Default for CodeCommit, GitHub uses webhook

        switch (props.sourceType) {
            case SourceType.CODECOMMIT:
                const codeCommitRepo = codecommit.Repository.fromRepositoryName(
                    this,
                    `${props.repositoryName}-Repo`,
                    props.repositoryName
                );
                sourceAction = new codepipeline_actions.CodeCommitSourceAction({
                    actionName: `CodeCommit_Source_${props.repositoryName}`,
                    repository: codeCommitRepo,
                    branch: props.branchName,
                    output: this.sourceOutput,
                    trigger: triggerAction,
                });
                break;

            case SourceType.GITHUB:
                if (!props.connectionArn) {
                    throw new Error('connectionArn is required for GitHub source type');
                }
                sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
                    actionName: `GitHub_Source_${props.repositoryName.replace('/', '_')}`,
                    owner: props.repositoryName.split('/')[0],
                    repo: props.repositoryName.split('/')[1],
                    branch: props.branchName,
                    connectionArn: props.connectionArn,
                    output: this.sourceOutput,
                    triggerOnPush: props.triggerOnPush !== false, // Defaults to true
                });
                break;

            case SourceType.S3:
                 const bucket = s3.Bucket.fromBucketName(this, 'S3SourceBucket', props.repositoryName);
                 sourceAction = new codepipeline_actions.S3SourceAction({
                    actionName: `S3_Source_${props.repositoryName}`,
                    bucket: bucket,
                    bucketKey: props.branchName, // branchName is used as objectKey for S3
                    output: this.sourceOutput,
                    trigger: props.triggerOnPush !== false ? codepipeline_actions.S3Trigger.POLL : codepipeline_actions.S3Trigger.NONE,
                 });
                break;

            default:
                throw new Error(`Unsupported source type: ${props.sourceType}`);
        }
        this.action = sourceAction;
    }
}