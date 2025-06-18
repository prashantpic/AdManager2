import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import *as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as apigwv2_integrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { IEnvironmentConfig, EnvironmentName } from '../config/app-config.interface';
import { FargateServiceConstruct } from '../constructs/compute/fargate-service.construct';
import { generateResourceName } from '../utils/name-generator'; // Assuming this utility exists

export interface ApplicationComputeStackProps extends cdk.StackProps {
  readonly appConfig: IEnvironmentConfig;
  readonly vpc: ec2.IVpc;
  readonly ecsTaskRole: iam.IRole;
  readonly ecsTaskExecutionRole: iam.IRole;
  readonly lambdaExecutionRole: iam.IRole; // Placeholder if Lambdas are used for some compute
  readonly dbInstanceEndpoint?: string; // From DatabaseStack
  readonly dbSecret?: secretsmanager.ISecret; // From DatabaseStack
  readonly appKmsKey: kms.IKey; // From IamSecurityStack
  // Add other dependencies like SQS Queue URLs, SNS Topic ARNs as needed
}

/**
 * Deploys application compute resources, primarily ECS Fargate services
 * for various microservices, and related API Gateways.
 */
export class ApplicationComputeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationComputeStackProps) {
    super(scope, id, props);

    const { appConfig, vpc, ecsTaskRole, ecsTaskExecutionRole, dbSecret, dbInstanceEndpoint, appKmsKey } = props;

    // Create an ECS Cluster
    const cluster = new ecs.Cluster(this, generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'AppCluster'}), {
      vpc: vpc,
      clusterName: generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'AppCluster'}),
      containerInsights: true,
    });
    new cdk.CfnOutput(this, 'EcsClusterName', {
        value: cluster.clusterName,
        description: 'Name of the ECS Cluster',
        exportName: `${appConfig.appName}-${appConfig.envName}-EcsClusterName`,
    });

    // --- Example Microservice: Product Catalog Service ---
    // In a real scenario, you would repeat this block for each microservice
    // with its specific ECR image, environment variables, etc.

    const productServiceDesiredCount = appConfig.envName === EnvironmentName.PROD && appConfig.multiAzEnabled ? 2 : 1;
    const productServiceMinScaling = appConfig.envName === EnvironmentName.PROD && appConfig.multiAzEnabled ? 2 : 1;
    const productServiceMaxScaling = appConfig.envName === EnvironmentName.PROD ? 4 : 2;
    
    // Environment variables for the Product service
    const productServiceEnv: { [key: string]: string } = {
        APP_ENV: appConfig.envName,
        AWS_REGION: appConfig.awsRegion,
        // Add other common environment variables
    };
    if (dbInstanceEndpoint) {
        productServiceEnv.DB_HOST = dbInstanceEndpoint;
    }

    // Secrets for the Product service (e.g., database credentials)
    const productServiceSecrets: { [key: string]: ecs.Secret } = {};
    if (dbSecret) {
        productServiceSecrets.DB_CREDENTIALS_SECRET_ARN = ecs.Secret.fromSecretsManager(dbSecret);
        // Grant the ECS task role permission to read the database secret
        dbSecret.grantRead(ecsTaskRole);
    }
    
    // Allow Task Role to use KMS key for decrypting secrets (if secrets are KMS encrypted)
    appKmsKey.grantDecrypt(ecsTaskRole);


    const productCatalogService = new FargateServiceConstruct(this, generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'ProductCatalogService'}), {
      cluster,
      vpc,
      appName: appConfig.appName,
      envName: appConfig.envName,
      serviceName: 'ProductCatalog', // This will be part of the resource name generation in the construct
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'), // Replace with actual ECR image
        containerPort: 80, // Example port
        taskRole: ecsTaskRole,
        executionRole: ecsTaskExecutionRole,
        environment: productServiceEnv,
        secrets: productServiceSecrets,
        logDriver: new ecs.AwsLogDriver({ // Configure CloudWatch Logs
            streamPrefix: generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'product-catalog'}),
            logRetention: appConfig.envName === EnvironmentName.PROD ? cdk.aws_logs.RetentionDays.ONE_MONTH : cdk.aws_logs.RetentionDays.ONE_WEEK,
        }),
      },
      cpu: appConfig.fargateCpu,
      memoryLimitMiB: appConfig.fargateMemoryLimitMiB,
      desiredCount: productServiceDesiredCount,
      loadBalancerType: 'ALB',
      publicLoadBalancer: true, // Assuming public-facing for now
      healthCheckPath: '/health', // Example health check path
      minScalingCapacity: productServiceMinScaling,
      maxScalingCapacity: productServiceMaxScaling,
      cpuScalingTargetUtilizationPercent: 70,
      memoryScalingTargetUtilizationPercent: 70,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      assignPublicIp: false, // Tasks run in private subnets, ALB is public
    });
    
    new cdk.CfnOutput(this, 'ProductCatalogServiceUrl', {
        value: productCatalogService.loadBalancer?.loadBalancerDnsName ? `http://${productCatalogService.loadBalancer.loadBalancerDnsName}` : 'N/A',
        description: 'URL of the Product Catalog Service Load Balancer',
    });


    // --- API Gateway for the Product Catalog Service ---
    if (productCatalogService.loadBalancer && productCatalogService.listener) {
      const httpApi = new apigwv2.HttpApi(this, generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'AppHttpApi'}), {
        apiName: generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'AppHttpApi'}),
        description: `HTTP API for ${appConfig.appName} in ${appConfig.envName}`,
        corsPreflight: { // Basic CORS configuration, adjust as needed
          allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
          allowMethods: [apigwv2.CorsHttpMethod.GET, apigwv2.CorsHttpMethod.POST, apigwv2.CorsHttpMethod.PUT, apigwv2.CorsHttpMethod.DELETE, apigwv2.CorsHttpMethod.OPTIONS],
          allowOrigins: ['*'], // Restrict in production
        },
        createDefaultStage: true,
        defaultStageOptions: {
            stageName: appConfig.apiGatewayStageName,
            autoDeploy: true,
        }
      });

      const albIntegration = new apigwv2_integrations.HttpAlbIntegration(
        generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'ProductServiceAlbIntegration'}),
        productCatalogService.listener as cdk.aws_elasticloadbalancingv2.IApplicationListener, {
        method: apigwv2.HttpMethod.ANY, // Or specific methods
        vpcLink: undefined, // Not needed for public ALBs with HTTP API direct integration
      });

      httpApi.addRoutes({
        path: '/products/{proxy+}', // Example path, adjust as needed
        methods: [apigwv2.HttpMethod.ANY],
        integration: albIntegration,
      });
      httpApi.addRoutes({
        path: '/products', // Example path, adjust as needed
        methods: [apigwv2.HttpMethod.ANY],
        integration: albIntegration,
      });

      new cdk.CfnOutput(this, 'HttpApiEndpoint', {
        value: httpApi.url!,
        description: 'Endpoint URL for the HTTP API',
        exportName: `${appConfig.appName}-${appConfig.envName}-HttpApiEndpoint`,
      });
    }

    // Placeholder for other microservices (CampaignManagement, AnalyticsReporting, etc.)
    // Each would follow a similar pattern:
    // 1. Define environment variables and secrets.
    // 2. Instantiate FargateServiceConstruct.
    // 3. (Optional) Integrate with API Gateway.
  }
}