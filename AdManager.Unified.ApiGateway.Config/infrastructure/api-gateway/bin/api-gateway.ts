#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiGatewayStack, ApiGatewayStackProps } from '../lib/api-gateway-stack';
import { gatewayDefaultSettings, GatewayConfig } from '../lib/config/gateway-settings';
import { ILambdaAuthorizerProps } from '../lib/interfaces/lambda-authorizer-props';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || app.node.tryGetContext('awsAccountId'),
  region: process.env.CDK_DEFAULT_REGION || app.node.tryGetContext('awsRegion') || 'us-east-1',
};

// Retrieve stage-specific config from CDK context or environment variables
const stage = app.node.tryGetContext('stage') || process.env.STAGE || 'dev';

// Validate essential stage context
if (!stage) {
    throw new Error("Stage context variable (e.g., -c stage=dev) or STAGE environment variable must be provided.");
}

const customDomainName = app.node.tryGetContext(`${stage}:customDomainName`) || process.env.CUSTOM_DOMAIN_NAME;
const certificateArn = app.node.tryGetContext(`${stage}:certificateArn`) || process.env.CERTIFICATE_ARN;
const hostedZoneId = app.node.tryGetContext(`${stage}:hostedZoneId`) || process.env.HOSTED_ZONE_ID;

const jwksUri = app.node.tryGetContext(`${stage}:jwksUri`) || process.env.JWKS_URI;
const jwtIssuer = app.node.tryGetContext(`${stage}:jwtIssuer`) || process.env.JWT_ISSUER;
const jwtAudienceCombined = app.node.tryGetContext(`${stage}:jwtAudience`) || process.env.JWT_AUDIENCE;

if (!jwksUri) {
    throw new Error(`JWKS URI must be provided for stage '${stage}' via CDK context ('${stage}:jwksUri') or environment variable (JWKS_URI).`);
}
if (!jwtIssuer) {
    throw new Error(`JWT Issuer must be provided for stage '${stage}' via CDK context ('${stage}:jwtIssuer') or environment variable (JWT_ISSUER).`);
}
if (!jwtAudienceCombined) {
    throw new Error(`JWT Audience must be provided for stage '${stage}' via CDK context ('${stage}:jwtAudience') or environment variable (JWT_AUDIENCE) as a comma-separated string.`);
}

const jwtAudience = jwtAudienceCombined.split(',').map((aud: string) => aud.trim()).filter((aud: string) => aud.length > 0);

if (jwtAudience.length === 0) {
    throw new Error(`JWT Audience for stage '${stage}' resulted in an empty list. Please provide a valid comma-separated string.`);
}

const gatewayConfig: GatewayConfig = {
  ...gatewayDefaultSettings, // Spread default settings first
  stageName: stage, // Set the stageName
  customDomain: customDomainName ? {
    domainName: customDomainName,
    certificateArn: certificateArn!, // Assert non-null as it's required if customDomainName is set
    hostedZoneId: hostedZoneId!,   // Assert non-null
  } : undefined,
  // Override other default settings if needed for the specific stage from context
  defaultRateLimit: app.node.tryGetContext(`${stage}:defaultRateLimit`) || gatewayDefaultSettings.defaultRateLimit,
  defaultBurstLimit: app.node.tryGetContext(`${stage}:defaultBurstLimit`) || gatewayDefaultSettings.defaultBurstLimit,
};

if (gatewayConfig.customDomain && (!certificateArn || !hostedZoneId)) {
    throw new Error(`If customDomainName is provided for stage '${stage}', then certificateArn and hostedZoneId must also be provided.`);
}


const authorizerConfig: ILambdaAuthorizerProps = {
  jwksUri,
  jwtIssuer,
  jwtAudience,
  authorizerName: `JwtAuthorizer-${stage}`,
};

// Example backend service endpoints - these should come from a secure and dynamic source in a real setup
// e.g., SSM Parameter Store, Secrets Manager, or outputs from other CDK stacks.
const campaignServiceEndpoint = app.node.tryGetContext(`${stage}:campaignServiceEndpoint`) || `https://campaign-service.${stage}.example.com`;
const productCatalogServiceEndpoint = app.node.tryGetContext(`${stage}:productCatalogServiceEndpoint`) || `https://product-catalog-service.${stage}.example.com`;
const adminServiceEndpoint = app.node.tryGetContext(`${stage}:adminServiceEndpoint`) || `https://admin-service.${stage}.example.com`;
const affiliateServiceEndpoint = app.node.tryGetContext(`${stage}:affiliateServiceEndpoint`) || `https://affiliate-service.${stage}.example.com`;
const thirdPartyAppServiceEndpoint = app.node.tryGetContext(`${stage}:thirdPartyAppServiceEndpoint`) || `https://third-party-app-service.${stage}.example.com`;
const analyticsServiceIntegrationEndpoint = app.node.tryGetContext(`${stage}:analyticsServiceEndpoint`) || `https://analytics-service.${stage}.example.com`;


const stackProps: ApiGatewayStackProps = {
  env,
  stackName: `AdManagerApiGateway-${stage}`,
  description: `API Gateway for Ad Manager Platform (${stage}) (REQ-POA-017, REQ-TCE-008)`,
  stage,
  gatewayConfig,
  authorizerConfig,
  campaignServiceEndpoint: campaignServiceEndpoint,
  productCatalogServiceEndpoint: productCatalogServiceEndpoint,
  adminServiceEndpoint: adminServiceEndpoint,
  affiliateServiceEndpoint: affiliateServiceEndpoint,
  thirdPartyAppServiceEndpoint: thirdPartyAppServiceEndpoint,
  analyticsServiceEndpoint: analyticsServiceIntegrationEndpoint, // Added based on merchant routes example
};

new ApiGatewayStack(app, `AdManagerApiGatewayStack-${stage}`, stackProps);

app.synth();