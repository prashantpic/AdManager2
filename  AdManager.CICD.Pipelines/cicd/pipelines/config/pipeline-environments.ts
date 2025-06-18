export interface PipelineEnvironmentConfig {
  readonly awsAccountId: string;
  readonly awsRegion: string;
  readonly environmentName: 'dev' | 'staging' | 'prod';
  // Add other common env-specific props:
  // e.g., vpcId?: string;
  // e.g., notificationEmail?: string;
  // e.g., ecrRepositoryUriPrefix?: string;
  // e.g., sonarqubeServerUrl?: string; // For SAST
  // e.g., sonarqubeTokenSecretArn?: string; // For SAST
  // e.g., slackChannelConfigurationArn?: string; // For AWS Chatbot integration
}

export const devEnvironment: PipelineEnvironmentConfig = {
  awsAccountId: '<DEV_ACCOUNT_ID_PLACEHOLDER>',
  awsRegion: '<AWS_REGION_PLACEHOLDER>', // e.g., 'us-east-1'
  environmentName: 'dev',
  // notificationEmail: 'dev-alerts@example.com',
  // ecrRepositoryUriPrefix: '<DEV_ACCOUNT_ID_PLACEHOLDER>.dkr.ecr.<AWS_REGION_PLACEHOLDER>.amazonaws.com'
};

export const stagingEnvironment: PipelineEnvironmentConfig = {
  awsAccountId: '<STAGING_ACCOUNT_ID_PLACEHOLDER>',
  awsRegion: '<AWS_REGION_PLACEHOLDER>',
  environmentName: 'staging',
  // notificationEmail: 'staging-alerts@example.com',
  // ecrRepositoryUriPrefix: '<STAGING_ACCOUNT_ID_PLACEHOLDER>.dkr.ecr.<AWS_REGION_PLACEHOLDER>.amazonaws.com',
  // sonarqubeServerUrl: 'https://sonarqube.example.com',
  // sonarqubeTokenSecretArn: 'arn:aws:secretsmanager:<AWS_REGION_PLACEHOLDER>:<STAGING_ACCOUNT_ID_PLACEHOLDER>:secret:sonarqube-token-xxxxxx',
  // slackChannelConfigurationArn: 'arn:aws:chatbot::<STAGING_ACCOUNT_ID_PLACEHOLDER>:chat-configuration/slack-channel/cicd-alerts-staging'
};

export const prodEnvironment: PipelineEnvironmentConfig = {
  awsAccountId: '<PROD_ACCOUNT_ID_PLACEHOLDER>',
  awsRegion: '<AWS_REGION_PLACEHOLDER>',
  environmentName: 'prod',
  // notificationEmail: 'prod-alerts@example.com',
  // ecrRepositoryUriPrefix: '<PROD_ACCOUNT_ID_PLACEHOLDER>.dkr.ecr.<AWS_REGION_PLACEHOLDER>.amazonaws.com',
  // sonarqubeServerUrl: 'https://sonarqube.example.com', // Potentially same SonarQube, different project keys
  // sonarqubeTokenSecretArn: 'arn:aws:secretsmanager:<AWS_REGION_PLACEHOLDER>:<PROD_ACCOUNT_ID_PLACEHOLDER>:secret:sonarqube-token-yyyyyy',
  // slackChannelConfigurationArn: 'arn:aws:chatbot::<PROD_ACCOUNT_ID_PLACEHOLDER>:chat-configuration/slack-channel/cicd-alerts-prod'
};