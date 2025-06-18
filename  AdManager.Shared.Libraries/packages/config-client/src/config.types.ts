// This should define the overall structure of configuration expected by applications
// It can be composed of smaller, more specific config interfaces.
import { LogLevel } from '@admanager/logger'; // Example dependency

export interface DatabaseConfig {
  url: string;
  // other db params
}

export interface AwsConfig {
  region: string;
  accessKeyId?: string; // Optional if using IAM roles
  secretAccessKey?: string; // Optional if using IAM roles
}

export interface SqsConfig {
    auditLogQueueUrl: string;
    // other queues
}

export interface AppConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  SERVICE_NAME: string;
  
  LOG_LEVEL: LogLevel;

  DATABASE_CONFIG: DatabaseConfig;
  AWS_CONFIG: AwsConfig;
  SQS_CONFIG?: SqsConfig; // Optional depending on service

  // Example for a specific service's needs
  AD_NETWORK_API_KEY_GOOGLE?: string;
  AD_NETWORK_TIMEOUT_MS?: number;

  // Configuration for AWS Parameter Store / Secrets Manager paths
  AWS_SSM_PATH_PREFIX?: string;
  AWS_SECRETS_MANAGER_PREFIX?: string;
}

export enum ConfigSources {
    ENVIRONMENT = 'ENVIRONMENT',
    AWS_SSM = 'AWS_SSM',
    AWS_SECRETS_MANAGER = 'AWS_SECRETS_MANAGER',
    // FILE = 'FILE' // For local .env files perhaps
}

export interface ConfigClientOptions {
    sourcesPriority?: ConfigSources[]; // Order in which to look for config
    ssmPathPrefix?: string;
    secretsManagerPrefix?: string;
    // schema?: Joi.ObjectSchema<AppConfig>; // Optional: Joi schema for validation
}