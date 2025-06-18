export enum SourceType {
  CODECOMMIT = 'CodeCommit',
  GITHUB = 'GitHub',
  S3 = 'S3',
}

export enum DeploymentTargetType {
  ECS = 'ECS',
  S3_CLOUDFRONT = 'S3_CLOUDFRONT',
  LAMBDA = 'Lambda', // Example for future
}

export interface BaseServiceConfig {
  readonly serviceName: string; // Unique identifier for CDK resources, pipeline names
  readonly sourceType: SourceType;
  readonly sourceRepositoryName: string; // e.g., 'AdManager.CampaignService' or 'github-owner/repo-name'
  readonly sourceBranch: string; // e.g., 'main', 'develop'
  readonly githubConnectionArn?: string; // Required if sourceType is GITHUB
  readonly buildspecPath?: string; // Relative path within the service repo, defaults will be used if not provided
  readonly deploymentTargetType: DeploymentTargetType;
}

export interface BackendServiceConfig extends BaseServiceConfig {
  readonly deploymentTargetType: DeploymentTargetType.ECS;
  readonly ecsClusterName: string; // Name of the ECS Cluster
  readonly ecsServiceName: string; // Name of the ECS Service
  readonly ecsTaskDefinitionFamily: string; // Family name for the task definition
  readonly ecsContainerName: string; // Container name in the task definition
  readonly ecsContainerPort: number; // Port exposed by the container
  readonly appspecPath?: string; // Relative path to appspec.yml within the service repo artifact, defaults to 'appspec.yml'
  // Potentially add health check paths, memory/cpu reservations etc.
  // readonly healthCheckPath?: string;
  // readonly taskMemoryLimitMiB?: number;
  // readonly taskCpuUnits?: number;
}

export interface FrontendAppConfig extends BaseServiceConfig {
  readonly deploymentTargetType: DeploymentTargetType.S3_CLOUDFRONT;
  readonly s3BucketName: string; // Name of the S3 bucket for deployment (without s3:// prefix)
  readonly cloudfrontDistributionId?: string; // For cache invalidation
  // Potentially add custom domain, ACM cert ARN etc.
  // readonly customDomainName?: string;
  // readonly acmCertificateArn?: string;
}

export const backendServices: BackendServiceConfig[] = [
  // Example:
  // {
  //   serviceName: 'CampaignService',
  //   sourceType: SourceType.CODECOMMIT,
  //   sourceRepositoryName: 'AdManager-CampaignService', // CodeCommit repository name
  //   sourceBranch: 'main',
  //   buildspecPath: 'buildspec.yml', // Relative to service's source root
  //   deploymentTargetType: DeploymentTargetType.ECS,
  //   ecsClusterName: 'AdManager-Cluster-prod', // Target ECS cluster
  //   ecsServiceName: 'CampaignService-ECS-Service-prod', // Target ECS service
  //   ecsTaskDefinitionFamily: 'CampaignServiceTaskDef-prod', // Task Definition Family
  //   ecsContainerName: 'campaign-service-container', // Container name in task definition
  //   ecsContainerPort: 3000,
  //   appspecPath: 'appspec.yml' // Relative to service's source root (copied to artifact)
  // },
  // {
  //   serviceName: 'UserService',
  //   sourceType: SourceType.GITHUB,
  //   sourceRepositoryName: 'my-org/admanager-user-service', // GitHub repo: owner/repo
  //   sourceBranch: 'develop',
  //   githubConnectionArn: 'arn:aws:codestar-connections:us-east-1:<ACCOUNT_ID_PLACEHOLDER>:connection/your-github-connection-id',
  //   deploymentTargetType: DeploymentTargetType.ECS,
  //   ecsClusterName: 'AdManager-Cluster-dev',
  //   ecsServiceName: 'UserService-ECS-Service-dev',
  //   ecsTaskDefinitionFamily: 'UserServiceTaskDef-dev',
  //   ecsContainerName: 'user-service-container',
  //   ecsContainerPort: 3001,
  // },
];

export const frontendApps: FrontendAppConfig[] = [
  // Example:
  // {
  //   serviceName: 'MerchantPortal', // Used as appName in SDS, unified to serviceName
  //   sourceType: SourceType.GITHUB,
  //   sourceRepositoryName: 'your-org/admanager-merchant-portal',
  //   sourceBranch: 'main',
  //   githubConnectionArn: 'arn:aws:codestar-connections:us-east-1:<ACCOUNT_ID_PLACEHOLDER>:connection/your-github-connection-id',
  //   buildspecPath: 'buildspec.yml', // Relative to app's source root
  //   deploymentTargetType: DeploymentTargetType.S3_CLOUDFRONT,
  //   s3BucketName: 'admanager-merchant-portal-bucket-prod', // Just bucket name, not ARN or s3://
  //   cloudfrontDistributionId: 'E123ABC456XYZ' // CloudFront Distribution ID for invalidation
  // },
  // {
  //   serviceName: 'AdminConsole',
  //   sourceType: SourceType.CODECOMMIT,
  //   sourceRepositoryName: 'AdManager-AdminConsole',
  //   sourceBranch: 'develop',
  //   deploymentTargetType: DeploymentTargetType.S3_CLOUDFRONT,
  //   s3BucketName: 'admanager-admin-console-bucket-dev',
  //   cloudfrontDistributionId: 'E789DEF012UVW'
  // },
];