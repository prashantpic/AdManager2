import * as apigateway from 'aws-cdk-lib/aws-apigateway';

/**
 * Configuration for a custom domain name for the API Gateway.
 * (REQ-POA-017: Custom Domain Setup part)
 */
export interface CustomDomainConfig {
  /** The custom domain name, e.g., 'api.example.com'. */
  readonly domainName: string;
  /** The ARN of the ACM certificate for the custom domain. */
  readonly certificateArn: string;
  /** The Route 53 Hosted Zone ID where the domain is managed. */
  readonly hostedZoneId: string;
  /** Optional base path for the API mapping, e.g., 'v1'. Defaults to an empty path. */
  readonly basePath?: string;
  /** Optional: Security policy for the custom domain. Defaults to TLS 1.2. */
  readonly securityPolicy?: apigateway.SecurityPolicy;
}

/**
 * Global configuration for the API Gateway.
 * (3.3.2.1, 4.2.4)
 */
export interface GatewayConfig {
  /** Default rate limit (requests per second) for API Gateway methods. */
  readonly defaultRateLimit?: number;
  /** Default burst limit (concurrent requests) for API Gateway methods. */
  readonly defaultBurstLimit?: number;
  /** Default CORS preflight options. */
  readonly defaultCorsOptions?: apigateway.CorsOptions;
  /** Configuration for a custom domain, if any. */
  readonly customDomain?: CustomDomainConfig;
  /** The deployment stage name, e.g., 'dev', 'prod'. */
  readonly stageName: string;
  // Add other global settings like API key source, global throttling, etc.
}

/**
 * Default settings for the API Gateway. These can be overridden by stage-specific configurations.
 * (3.3.2.1)
 */
export const gatewayDefaultSettings: Omit<GatewayConfig, 'stageName' | 'customDomain'> = {
  defaultRateLimit: 100, // Default requests per second
  defaultBurstLimit: 200, // Default burst capacity
  defaultCorsOptions: {
    allowOrigins: apigateway.Cors.ALL_ORIGINS, // Be more restrictive in production
    allowMethods: apigateway.Cors.ALL_METHODS, // Or specify ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    allowHeaders: [
      'Content-Type',
      'X-Amz-Date',
      'Authorization', // For JWT Bearer token
      'X-Api-Key', // If using API Keys
      'X-Amz-Security-Token',
      'X-Amz-User-Agent',
      'X-Correlation-ID', // For request tracing
      // Add any other custom headers your application might use
    ],
    allowCredentials: true, // If your frontend needs to send cookies or use Authorization header with credentials
    maxAge: cổngDuration.hours(1).toSeconds(), // How long the results of a preflight request can be cached
  },
};