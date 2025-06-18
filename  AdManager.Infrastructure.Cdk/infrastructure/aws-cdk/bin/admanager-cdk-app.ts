#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/stacks/network.stack';
import { IamSecurityStack } from '../lib/stacks/iam-security.stack';
import { DatabaseStack } from '../lib/stacks/database.stack';
import { ApplicationComputeStack } from '../lib/stacks/application-compute.stack';
import { CoreServicesStack } from '../lib/stacks/core-services.stack';
import { CdnWafStack } from '../lib/stacks/cdn-waf.stack';

import { IEnvironmentConfig, EnvironmentName } from '../lib/config/app-config.interface';
import { devConfig } from '../lib/config/dev.config';
import { stagingConfig } from '../lib/config/staging.config';
import { prodConfig } from '../lib/config/prod.config';

/**
 * Loads the environment-specific configuration.
 * @param environment The target environment identifier (e.g., 'dev', 'staging', 'prod').
 * @returns The configuration object for the specified environment.
 */
function getConfig(environmentIdentifier: string): IEnvironmentConfig {
  switch (environmentIdentifier.toLowerCase()) {
    case EnvironmentName.DEV:
      return devConfig;
    case EnvironmentName.STAGING:
      return stagingConfig;
    case EnvironmentName.PROD:
      return prodConfig;
    default:
      console.warn(`Warning: Environment '${environmentIdentifier}' not recognized. Defaulting to 'dev' configuration.`);
      return devConfig;
  }
}

const app = new cdk.App();

const envIdentifier = app.node.tryGetContext('env') || process.env.CDK_ENV || EnvironmentName.DEV;
const appConfig = getConfig(envIdentifier as string);

const env = {
  account: appConfig.awsAccountId || process.env.CDK_DEFAULT_ACCOUNT,
  region: appConfig.awsRegion || process.env.CDK_DEFAULT_REGION,
};

// Core Network Infrastructure
const networkStack = new NetworkStack(app, `${appConfig.appName}-NetworkStack-${appConfig.envName}`, {
  env,
  appConfig,
});

// IAM Roles, Policies, and KMS Keys
const iamSecurityStack = new IamSecurityStack(app, `${appConfig.appName}-IamSecurityStack-${appConfig.envName}`, {
  env,
  appConfig,
});

// Database Stack (RDS, DynamoDB etc.)
const databaseStack = new DatabaseStack(app, `${appConfig.appName}-DatabaseStack-${appConfig.envName}`, {
  env,
  appConfig,
  vpc: networkStack.vpc,
  appKmsKey: iamSecurityStack.appKmsKey,
});

// Application Compute Stack (ECS Fargate Services, API Gateways)
const applicationComputeStack = new ApplicationComputeStack(app, `${appConfig.appName}-ApplicationComputeStack-${appConfig.envName}`, {
  env,
  appConfig,
  vpc: networkStack.vpc,
  ecsTaskRole: iamSecurityStack.ecsTaskRole,
  ecsTaskExecutionRole: iamSecurityStack.ecsTaskExecutionRole,
  lambdaExecutionRole: iamSecurityStack.lambdaExecutionRole,
  appKmsKey: iamSecurityStack.appKmsKey,
  // Assuming DatabaseStack exposes these as per SDS 4.2.1 example for ApplicationComputeStack props
  // and RdsInstanceConstruct (SDS 4.4.3.2) outputs are mapped to these names in DatabaseStack
  dbInstanceEndpoint: databaseStack.postgresInstance?.dbInstanceEndpointAddress, // Use optional chaining if postgresInstance might not exist
  dbSecret: databaseStack.postgresInstanceSecret, // Use optional chaining if postgresInstanceSecret might not exist
});

// Core Services Stack (SQS, SNS, S3, ElastiCache)
const coreServicesStack = new CoreServicesStack(app, `${appConfig.appName}-CoreServicesStack-${appConfig.envName}`, {
  env,
  appConfig,
  vpc: networkStack.vpc,
  appKmsKey: iamSecurityStack.appKmsKey,
  // Pass other necessary outputs, e.g., roles for accessing these services from iamSecurityStack if needed
});

// CDN and WAF Stack (CloudFront, WAF Rules)
const cdnWafStack = new CdnWafStack(app, `${appConfig.appName}-CdnWafStack-${appConfig.envName}`, {
  env,
  appConfig,
  // This stack would likely consume outputs from ApplicationComputeStack (e.g., ALB ARN or HttpApi endpoint)
  // and CoreServicesStack (e.g., S3 bucket for static assets).
  // Example:
  // webAppLoadBalancer: applicationComputeStack.loadBalancer, (if ApplicationComputeStack exposes it)
  // webAssetsBucket: coreServicesStack.webAssetsBucket, (if CoreServicesStack exposes it)
});


// Apply common tags to all stacks and resources within the app
cdk.Tags.of(app).add('Application', appConfig.appName);
cdk.Tags.of(app).add('Environment', appConfig.envName);

app.synth();