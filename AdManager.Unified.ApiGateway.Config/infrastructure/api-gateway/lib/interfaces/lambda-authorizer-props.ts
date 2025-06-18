import * as cdk from 'aws-cdk-lib';

/**
 * Properties for the JWT Lambda Authorizer construct.
 * (3.2.4, REQ-IAM-007)
 */
export interface ILambdaAuthorizerProps {
  /**
   * The URI of the JSON Web Key Set (JWKS) endpoint.
   * This is where the Lambda authorizer will fetch public keys to verify JWT signatures.
   * Example: 'https://your-auth-provider.com/.well-known/jwks.json'
   */
  readonly jwksUri: string;

  /**
   * The expected issuer claim in the JWT.
   * The authorizer will verify that the 'iss' claim in the token matches this value.
   * Example: 'https://your-auth-provider.com/'
   */
  readonly jwtIssuer: string;

  /**
   * A list of expected audience claims in the JWT.
   * The authorizer will verify that the 'aud' claim in the token matches one of these values.
   * Example: ['https://api.your-app.com', 'another-audience']
   */
  readonly jwtAudience: string[];

  /**
   * The name for the API Gateway Authorizer resource.
   * Example: 'MyJwtAuthorizer'
   */
  readonly authorizerName: string;

  /**
   * The source of the token for the API Gateway authorizer.
   * Specifies where API Gateway should find the token to pass to the Lambda authorizer.
   * Default: 'method.request.header.Authorization'
   * @default apigateway.IdentitySource.header('Authorization')
   */
  readonly identitySource?: string;

  /**
   * The TTL for caching authorizer results.
   * If not specified, API Gateway will not cache authorizer responses.
   * Setting this can improve performance and reduce calls to the authorizer Lambda.
   * @default cdk.Duration.minutes(5)
   */
  readonly resultsCacheTtl?: cdk.Duration;
}