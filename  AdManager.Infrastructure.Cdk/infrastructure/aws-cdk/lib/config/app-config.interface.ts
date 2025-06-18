import { EnvironmentName } from './environment.enum';

/**
 * Interface for application-wide configurations that are common across environments.
 */
export interface IAppConfig {
  readonly envName: EnvironmentName;
  readonly awsRegion: string;
  readonly awsAccountId: string;
  readonly appName: string; // e.g., "AdManager"
}

/**
 * Interface for environment-specific configurations, extending common app configurations.
 */
export interface IEnvironmentConfig extends IAppConfig {
  readonly vpcCidr: string;
  readonly rdsInstanceClass: string; // e.g., "db.t3.micro" (corresponds to ec2.InstanceClass and ec2.InstanceSize)
  readonly rdsPostgresVersionString: string; // e.g., "15.5"
  readonly fargateCpu: number; // Fargate CPU units (e.g., 256, 512)
  readonly fargateMemoryLimitMiB: number; // Fargate memory in MiB (e.g., 512, 1024)
  readonly apiGatewayStageName: string;
  readonly dynamoDbBillingModeString: string; // e.g., "PAY_PER_REQUEST" or "PROVISIONED"
  readonly s3BucketNames: {
    readonly productFeeds: string;
    readonly performanceLogs: string;
    readonly webAssets: string;
    readonly backups: string;
  };
  readonly multiAzEnabled: boolean; // For services like RDS, VPC NAT Gateways, ECS services
  readonly elastiCacheNodeType?: string; // e.g., "cache.t3.micro"
  readonly elastiCacheNumNodes?: number;
  readonly rdsDeletionProtection?: boolean;
}