import { IConfigClient } from './config.client.interface';
import { AppConfig, ConfigClientOptions, DatabaseConfig, AwsConfig, SqsConfig } from './config.types';
import { InternalServerError } from '@admanager/errors';
import { ErrorCodes } from '@admanager/errors';
import { LogLevel } from '@admanager/logger'; // Assuming LogLevel is exported from logger
import * as dotenv from 'dotenv';

// Load .env file for local development if present
dotenv.config();

export class ConfigClientService implements IConfigClient {
  private readonly config: Partial<AppConfig> = {};

  constructor(options?: ConfigClientOptions) {
    // In a full implementation, options.sourcesPriority would determine loading order
    // from ENV, AWS SSM, AWS Secrets Manager, etc.
    // This simplified version focuses on environment variables.
    this.loadFromEnv();

    // Placeholder for AWS SSM loading logic based on options
    // if (options?.sourcesPriority?.includes(ConfigSources.AWS_SSM) && options.ssmPathPrefix) {
    //   this.loadFromAwsSsm(options.ssmPathPrefix).catch(err => console.error("Failed to load config from SSM", err));
    // }

    // Placeholder for AWS Secrets Manager loading logic
    // if (options?.sourcesPriority?.includes(ConfigSources.AWS_SECRETS_MANAGER) && options.secretsManagerPrefix) {
    //   this.loadFromAwsSecretsManager(options.secretsManagerPrefix).catch(err => console.error("Failed to load config from Secrets Manager", err));
    // }
    
    // Optional: Validate the loaded configuration against a schema (e.g., AppConfig structure or Joi schema)
    // this.validateConfig();
  }

  private loadFromEnv(): void {
    this.config.NODE_ENV = (process.env.NODE_ENV as AppConfig['NODE_ENV']) || 'development';
    this.config.PORT = parseInt(process.env.PORT || '3000', 10);
    this.config.SERVICE_NAME = process.env.SERVICE_NAME || 'unknown-service';
    this.config.LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;

    this.config.DATABASE_CONFIG = {
      url: process.env.DATABASE_URL || '',
      // other db params from env
    } as DatabaseConfig;

    this.config.AWS_CONFIG = {
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    } as AwsConfig;
    
    if (process.env.SQS_AUDIT_LOG_QUEUE_URL) {
        this.config.SQS_CONFIG = {
            auditLogQueueUrl: process.env.SQS_AUDIT_LOG_QUEUE_URL,
        } as SqsConfig;
    }

    this.config.AD_NETWORK_API_KEY_GOOGLE = process.env.AD_NETWORK_API_KEY_GOOGLE;
    this.config.AD_NETWORK_TIMEOUT_MS = parseInt(process.env.AD_NETWORK_TIMEOUT_MS || '30000', 10);
    
    this.config.AWS_SSM_PATH_PREFIX = process.env.AWS_SSM_PATH_PREFIX;
    this.config.AWS_SECRETS_MANAGER_PREFIX = process.env.AWS_SECRETS_MANAGER_PREFIX;

    // It's good practice to load all known AppConfig keys, even if undefined,
    // to make `get` more predictable.
    // For a more robust solution, iterate over AppConfig definition or use a schema.
  }

  // private async loadFromAwsSsm(prefix: string): Promise<void> {
  //   // Implementation using @aws-sdk/client-ssm
  //   // const ssmClient = new SSMClient({ region: this.get('AWS_CONFIG')?.region });
  //   // const command = new GetParametersByPathCommand({ Path: prefix, Recursive: true, WithDecryption: true });
  //   // const output = await ssmClient.send(command);
  //   // output.Parameters?.forEach(param => { /* map to this.config */ });
  //   this.config_AWS_SSM_LOADED = true; // Example flag
  //   console.log(`Placeholder: Would load from AWS SSM with prefix ${prefix}`);
  // }

  // private async loadFromAwsSecretsManager(prefix: string): Promise<void> {
  //   // Implementation using @aws-sdk/client-secrets-manager
  //   // const secretsClient = new SecretsManagerClient({ region: this.get('AWS_CONFIG')?.region });
  //   // const command = new ListSecretsCommand({ Filters: [{ Key: 'name', Values: [`${prefix}*`] }] });
  //   // const secretsList = await secretsClient.send(command);
  //   // for (const secretEntry of secretsList.SecretList || []) {
  //   //    if (secretEntry.Name) {
  //   //        const secretValue = await secretsClient.send(new GetSecretValueCommand({ SecretId: secretEntry.Name }));
  //   //        // map secretValue.SecretString to this.config
  //   //    }
  //   // }
  //   this.config_AWS_SECRETS_LOADED = true; // Example flag
  //   console.log(`Placeholder: Would load from AWS Secrets Manager with prefix ${prefix}`);
  // }

  // private validateConfig(): void {
  //    // Example: Check if required configs are present
  //    if (!this.config.DATABASE_CONFIG?.url) {
  //        throw new InternalServerError('DATABASE_URL is not configured.', ErrorCodes.CONFIG_VALUE_MISSING);
  //    }
  // }

  get<T = any>(key: keyof AppConfig | string): T | undefined {
    return this.config[key as keyof AppConfig] as T | undefined;
  }

  getOrThrow<T = any>(key: keyof AppConfig | string, defaultValue?: T): T {
    const value = this.get<T>(key);
    if (value !== undefined && value !== null) { // Check for null as well, as some configs might be explicitly null
      return value;
    }
    if (defaultValue !== undefined) {
        return defaultValue;
    }
    throw new InternalServerError(
        `Configuration error: Missing required key "${String(key)}" and no default value provided.`, 
        ErrorCodes.CONFIG_VALUE_MISSING,
        { key }
    );
  }

  isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }
}