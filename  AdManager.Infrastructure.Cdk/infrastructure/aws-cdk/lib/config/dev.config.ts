import { IEnvironmentConfig } from './app-config.interface';
import { EnvironmentName } from './environment.enum';

/**
 * Configuration settings for the Development (DEV) environment.
 */
export const devConfig: IEnvironmentConfig = {
  envName: EnvironmentName.DEV,
  awsRegion: 'us-east-1', // Example region, should be configured per deployment
  awsAccountId: process.env.CDK_DEFAULT_ACCOUNT || 'YOUR_DEV_ACCOUNT_ID_PLACEHOLDER', // Placeholder, ensure this is set via environment or context
  appName: 'AdManager',
  vpcCidr: '10.1.0.0/16',
  rdsInstanceClass: 'db.t3.micro', // Corresponds to ec2.InstanceClass.T3 and ec2.InstanceSize.MICRO
  rdsPostgresVersionString: '15.5',
  fargateCpu: 256, // vCPU units
  fargateMemoryLimitMiB: 512, // MiB
  apiGatewayStageName: 'dev',
  dynamoDbBillingModeString: 'PAY_PER_REQUEST',
  s3BucketNames: {
    productFeeds: 'admanager-dev-product-feeds-unique', // Add unique suffix or manage globally
    performanceLogs: 'admanager-dev-performance-logs-unique',
    webAssets: 'admanager-dev-web-assets-unique',
    backups: 'admanager-dev-backups-unique',
  },
  multiAzEnabled: false, // Typically false for dev to save costs
  elastiCacheNodeType: 'cache.t3.micro',
  elastiCacheNumNodes: 1,
  rdsDeletionProtection: false,
};