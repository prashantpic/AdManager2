#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MainPipelineStack } from './cicd/pipelines/main-pipeline-stack';
import { devEnvironment, stagingEnvironment, prodEnvironment } from './cicd/pipelines/config/pipeline-environments';

const app = new cdk.App();

// Development Pipelines Stack
new MainPipelineStack(app, 'AdManager-Dev-Pipelines', {
    env: { 
        account: devEnvironment.awsAccountId, 
        region: devEnvironment.awsRegion 
    },
    environmentName: 'dev',
    awsAccountId: devEnvironment.awsAccountId,
    awsRegion: devEnvironment.awsRegion,
    // notificationEmail: devEnvironment.notificationEmail, // Example, if defined in PipelineEnvironmentConfig
    // ecrRepositoryUriPrefix: devEnvironment.ecrRepositoryUriPrefix, // Example
    // ... any other properties from devEnvironment that MainPipelineStackProps expects
});

// Staging Pipelines Stack
new MainPipelineStack(app, 'AdManager-Staging-Pipelines', {
    env: { 
        account: stagingEnvironment.awsAccountId, 
        region: stagingEnvironment.awsRegion 
    },
    environmentName: 'staging',
    awsAccountId: stagingEnvironment.awsAccountId,
    awsRegion: stagingEnvironment.awsRegion,
    // notificationEmail: stagingEnvironment.notificationEmail, // Example
    // ecrRepositoryUriPrefix: stagingEnvironment.ecrRepositoryUriPrefix, // Example
    // ... any other properties from stagingEnvironment
});

// Production Pipelines Stack
// Note: Production deployments might have different approval flows or be triggered
// from staging pipeline promotions rather than direct source changes.
// The instantiation here assumes a similar pattern for creating the production pipeline infrastructure.
new MainPipelineStack(app, 'AdManager-Prod-Pipelines', {
    env: { 
        account: prodEnvironment.awsAccountId, 
        region: prodEnvironment.awsRegion 
    },
    environmentName: 'prod',
    awsAccountId: prodEnvironment.awsAccountId,
    awsRegion: prodEnvironment.awsRegion,
    // notificationEmail: prodEnvironment.notificationEmail, // Example
    // ecrRepositoryUriPrefix: prodEnvironment.ecrRepositoryUriPrefix, // Example
    // ... any other properties from prodEnvironment
});

app.synth();