import { ConfigFactory } from '@nestjs/config';

/**
 * @description Configuration interface for application settings.
 * Reflects the structure of the configuration object returned by the factory.
 */
export interface AppConfiguration {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  appStoreUrl: string;
  oauth: {
    issuerUrl: string;
    authorizationCodeTtlSeconds: number;
    accessTokenTtlSeconds: number;
    refreshTokenTtlSeconds: number;
  };
  jwt: {
    secret: string;
    publicKey?: string;
    privateKey?: string;
    algorithm: string;
  };
  thirdPartyConnectivityServiceUrl: string;
  webhooks: {
    retryAttempts: number;
    retryDelayMs: number;
  };
  featureFlags: {
    enableGraphQLDataExchange: boolean;
    enableWebhookSignatureVerification: boolean; // Note: SDS mentions this, actual use might be in subscriber verification or if this service dispatches.
  };
}

/**
 * @description Loads and provides access to application configuration from environment variables.
 * This factory is intended to be used with `@nestjs/config`.
 * Environment variable validation (e.g., using Joi or class-validator) should be configured
 * in the `ConfigModule.forRootAsync` options (e.g., `validationSchema`).
 *
 * @returns {AppConfiguration} The application configuration object.
 */
const configuration: ConfigFactory<AppConfiguration> = () => {
  const port = parseInt(process.env.PORT, 10) || 3000;
  const oauthAuthorizationCodeTtlSeconds = parseInt(process.env.OAUTH_AUTHORIZATION_CODE_TTL_SECONDS, 10) || 600; // 10 minutes
  const oauthAccessTokenTtlSeconds = parseInt(process.env.OAUTH_ACCESS_TOKEN_TTL_SECONDS, 10) || 3600; // 1 hour
  const oauthRefreshTokenTtlSeconds = parseInt(process.env.OAUTH_REFRESH_TOKEN_TTL_SECONDS, 10) || 2592000; // 30 days
  const webhookRetryAttempts = parseInt(process.env.WEBHOOK_RETRY_ATTEMPTS, 10) || 5;
  const webhookRetryDelayMs = parseInt(process.env.WEBHOOK_RETRY_DELAY_MS, 10) || 60000; // 1 minute

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port,
    apiPrefix: process.env.API_PREFIX || '/api',
    appStoreUrl: process.env.APP_STORE_URL || 'https://apps.defaultplatformdomain.sa/en',
    oauth: {
      issuerUrl: process.env.OAUTH_ISSUER_URL || `http://localhost:${port}`,
      authorizationCodeTtlSeconds: oauthAuthorizationCodeTtlSeconds,
      accessTokenTtlSeconds: oauthAccessTokenTtlSeconds,
      refreshTokenTtlSeconds: oauthRefreshTokenTtlSeconds,
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'default-jwt-secret-key-please-change', // Should be a strong, unique secret
      publicKey: process.env.JWT_PUBLIC_KEY, // For RS256, etc.
      privateKey: process.env.JWT_PRIVATE_KEY, // For RS256, etc.
      algorithm: process.env.JWT_ALGORITHM || 'HS256', // e.g., HS256, RS256
    },
    thirdPartyConnectivityServiceUrl: process.env.THIRDPARTY_CONNECTIVITY_SERVICE_URL || 'http://localhost:3001/api/internal', // Example URL
    webhooks: {
      retryAttempts: webhookRetryAttempts,
      retryDelayMs: webhookRetryDelayMs,
    },
    featureFlags: {
      enableGraphQLDataExchange: process.env.ENABLE_GRAPHQL_DATA_EXCHANGE === 'true',
      enableWebhookSignatureVerification: process.env.ENABLE_WEBHOOK_SIGNATURE_VERIFICATION === 'true',
    },
  };
};

export default configuration;