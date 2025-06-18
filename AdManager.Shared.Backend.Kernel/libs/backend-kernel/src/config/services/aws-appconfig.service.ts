import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import {
  SSMClient,
  GetParametersByPathCommand,
  Parameter,
} from '@aws-sdk/client-ssm';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { IConfigService } from '@config/interfaces/config.service.interface';
import { Maybe } from '@common/types/maybe.type';
import { ILoggerService } from '@logging/interfaces/logger.service.interface';
import { LOGGER_SERVICE_TOKEN } from '@logging/constants/logging.constants';

@Injectable()
export class AwsParameterStoreConfigService implements IConfigService, OnModuleInit {
  private readonly ssmClient: SSMClient;
  private readonly secretsManagerClient: SecretsManagerClient;
  private readonly config: Record<string, string> = {};
  private isInitialized = false;

  private readonly ssmPath: string;
  private readonly secretNames: string[];

  constructor(
    @Inject(LOGGER_SERVICE_TOKEN) private readonly logger: ILoggerService,
  ) {
    const region = process.env.AWS_REGION || 'us-east-1';
    this.ssmPath = process.env.CONFIG_SSM_PATH || '/admanager/shared/';
    const secretNamesEnv = process.env.CONFIG_SECRET_NAMES;
    this.secretNames = secretNamesEnv ? secretNamesEnv.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];

    this.ssmClient = new SSMClient({ region });
    this.secretsManagerClient = new SecretsManagerClient({ region });

    // Load process.env into config as a base layer and for fallback
    for (const key in process.env) {
      if (Object.prototype.hasOwnProperty.call(process.env, key) && process.env[key] !== undefined) {
        this.config[key.toUpperCase()] = process.env[key] as string;
      }
    }
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.loadConfigFromSsm();
      await this.loadSecrets();
      this.isInitialized = true;
      this.logger.log('Configuration loaded from AWS Parameter Store and Secrets Manager.', AwsParameterStoreConfigService.name);
    } catch (error) {
        this.logger.error('Failed to initialize configuration from AWS services.', error instanceof Error ? error.stack : String(error), AwsParameterStoreConfigService.name);
        // Depending on policy, might re-throw or operate with ENV vars only
    }
  }

  private async loadConfigFromSsm(): Promise<void> {
    if (!this.ssmPath.startsWith('/')) {
        this.logger.warn(`SSM Path "${this.ssmPath}" does not start with '/'. No parameters will be loaded from SSM.`, AwsParameterStoreConfigService.name);
        return;
    }
    try {
      let nextToken: string | undefined;
      do {
        const command = new GetParametersByPathCommand({
          Path: this.ssmPath,
          Recursive: true,
          WithDecryption: true,
          NextToken: nextToken,
        });
        const output = await this.ssmClient.send(command);
        if (output.Parameters) {
          output.Parameters.forEach((param: Parameter) => {
            if (param.Name && param.Value) {
              const key = param.Name.replace(this.ssmPath, '').toUpperCase();
              this.config[key] = param.Value;
            }
          });
        }
        nextToken = output.NextToken;
      } while (nextToken);
    } catch (error) {
      this.logger.error('Failed to load config from SSM Parameter Store.', error instanceof Error ? error.stack : String(error), AwsParameterStoreConfigService.name);
    }
  }

  private async loadSecrets(): Promise<void> {
    for (const secretName of this.secretNames) {
      try {
        const command = new GetSecretValueCommand({ SecretId: secretName });
        const output = await this.secretsManagerClient.send(command);
        if (output.SecretString) {
          const secretValues = JSON.parse(output.SecretString);
          for (const key in secretValues) {
            if (Object.prototype.hasOwnProperty.call(secretValues, key) && secretValues[key] !== undefined) {
                 this.config[key.toUpperCase()] = String(secretValues[key]);
            }
          }
        }
      } catch (error) {
        this.logger.error(`Failed to load secret: ${secretName}`, error instanceof Error ? error.stack : String(error), AwsParameterStoreConfigService.name);
      }
    }
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      this.logger.warn('ConfigService accessed before full initialization from AWS. Using environment variables and defaults only.', AwsParameterStoreConfigService.name);
    }
  }

  get<T = string>(key: string): Maybe<T> {
    this.ensureInitialized();
    const value = this.config[key.toUpperCase()];
    return value as unknown as Maybe<T>;
  }

  getOrThrow<T = string>(key: string, defaultValue?: T): T {
    this.ensureInitialized();
    const upperKey = key.toUpperCase();
    const value = this.config[upperKey];
    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Configuration key "${key}" (resolved as "${upperKey}") not found and no default value provided.`);
    }
    return value as unknown as T;
  }

  getNumber(key: string): Maybe<number> {
    this.ensureInitialized();
    const value = this.config[key.toUpperCase()];
    if (value === undefined) return undefined;
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  }

  getNumberOrThrow(key: string, defaultValue?: number): number {
    this.ensureInitialized();
    const upperKey = key.toUpperCase();
    const value = this.config[upperKey];
    if (value === undefined) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Configuration key "${key}" (resolved as "${upperKey}") for number not found and no default value.`);
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Configuration key "${key}" (resolved as "${upperKey}") is not a valid number: ${value}`);
    }
    return num;
  }

  getBoolean(key: string, defaultValue: boolean = false): boolean {
    this.ensureInitialized();
    const value = this.config[key.toUpperCase()];
    if (value === undefined) return defaultValue;
    const lowerValue = value.toLowerCase();
    return lowerValue === 'true' || lowerValue === '1';
  }

  isProduction(): boolean {
    return this.getNodeEnv() === 'production';
  }

  isDevelopment(): boolean {
    return this.getNodeEnv() === 'development';
  }

  getNodeEnv(): string {
    // NODE_ENV is critical, ensure it's loaded from process.env if not elsewhere
    return this.getOrThrow<string>('NODE_ENV', 'development');
  }
}