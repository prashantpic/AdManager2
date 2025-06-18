import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { ILambdaAuthorizerProps } from '../../interfaces/lambda-authorizer-props';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

export class JwtLambdaAuthorizerConstruct extends Construct {
  public readonly authorizer: apigateway.TokenAuthorizer; // Or RequestAuthorizer if more complex input is needed

  constructor(scope: Construct, id: string, props: ILambdaAuthorizerProps) {
    super(scope, id);

    const authorizerFn = new lambdaNodeJs.NodejsFunction(this, 'JwtValidatorLambda', {
      entry: path.join(__dirname, '../../../lambda-authorizers/jwt-validator/index.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64, // Or X86_64
      memorySize: 256, // Adjust as needed
      timeout: cdk.Duration.seconds(10), // Adjust as needed
      logRetention: RetentionDays.ONE_MONTH, // Example log retention
      environment: {
        JWKS_URI: props.jwksUri,
        JWT_ISSUER: props.jwtIssuer,
        JWT_AUDIENCE: props.jwtAudience.join(','), // Pass as comma-separated string
        // NODE_OPTIONS: '--enable-source-maps', // Already enabled by default with esbuild sourceMap: true
      },
      bundling: {
        minify: true,
        sourceMap: true, // Enable source maps for easier debugging
        externalModules: [
            // 'aws-sdk' is available in Lambda runtime, but for v3 modular SDK, it's better to bundle.
            // For this example, if lambda-authorizer code uses aws-sdk v2 (global), it's external.
            // If it uses aws-sdk v3 clients, they should be bundled or added as layers.
            // The provided lambda uses 'jsonwebtoken' and 'jwks-rsa', which will be bundled.
        ],
        // Example: Force esbuild to use a specific target if needed
        // target: 'es2020',
      },
      // Optionally, configure X-Ray tracing
      // tracing: lambda.Tracing.ACTIVE,
    });

    this.authorizer = new apigateway.TokenAuthorizer(this, props.authorizerName, {
      handler: authorizerFn,
      identitySource: apigateway.IdentitySource.header('Authorization'), // Expects "Bearer <token>"
      resultsCacheTtl: cdk.Duration.minutes(5), // Cache policy results to reduce Lambda invocations
      authorizerName: props.authorizerName,
      // For RequestAuthorizer, you'd specify more identity sources:
      // identitySource: 'method.request.header.Authorization, method.request.querystring.paramName'
    });
  }
}