import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { IEnvironmentConfig } from '../config/app-config.interface';
import { generateResourceName } from '../utils/name-generator'; // Assuming this utility exists

export interface IamSecurityStackProps extends cdk.StackProps {
  readonly appConfig: IEnvironmentConfig;
}

/**
 * Responsible for creating all IAM roles, policies, KMS keys for encryption,
 * and other central security-related configurations.
 */
export class IamSecurityStack extends cdk.Stack {
  public readonly ecsTaskRole: iam.IRole;
  public readonly ecsTaskExecutionRole: iam.IRole;
  public readonly lambdaExecutionRole: iam.IRole;
  public readonly appKmsKey: kms.IKey;

  constructor(scope: Construct, id: string, props: IamSecurityStackProps) {
    super(scope, id, props);

    const { appConfig } = props;

    // Application KMS Key for data encryption
    this.appKmsKey = new kms.Key(this, generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'AppKmsKey'}), {
      description: `KMS key for ${appConfig.appName} application data encryption in ${appConfig.envName}`,
      enableKeyRotation: true,
      alias: generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'alias/AppKey'}),
      removalPolicy: appConfig.envName === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });
    new cdk.CfnOutput(this, 'AppKmsKeyArn', {
        value: this.appKmsKey.keyArn,
        description: 'ARN of the Application KMS Key',
        exportName: `${appConfig.appName}-${appConfig.envName}-AppKmsKeyArn`,
    });


    // ECS Task Execution Role
    // This role is used by ECS agent to pull container images and publish container logs to CloudWatch.
    this.ecsTaskExecutionRole = new iam.Role(this, generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'EcsTaskExecutionRole'}), {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      roleName: generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'EcsTaskExecRole', maxLength: 64}),
      description: `ECS Task Execution Role for ${appConfig.appName} in ${appConfig.envName}`,
    });
    this.ecsTaskExecutionRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
    );
    // Grant permission to use the appKmsKey for encrypted ECR images if needed, and for ECS secrets.
    this.appKmsKey.grantDecrypt(this.ecsTaskExecutionRole);


    // ECS Task Role
    // This role is assumed by the Fargate tasks themselves to interact with other AWS services.
    this.ecsTaskRole = new iam.Role(this, generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'EcsTaskRole'}), {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      roleName: generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'EcsTaskRole', maxLength: 64}),
      description: `ECS Task Role for ${appConfig.appName} application services in ${appConfig.envName}`,
    });
    // Grant permission for tasks to use the application KMS key for encryption/decryption operations
    this.appKmsKey.grantEncryptDecrypt(this.ecsTaskRole);
    // Note: Specific permissions to other services (S3, DynamoDB, SQS, SNS, Secrets Manager for DB creds)
    // should be added to this role by the constructs/stacks that require them,
    // or by the ApplicationComputeStack/CoreServicesStack as needed to adhere to least privilege.
    // For example, Secrets Manager read access for DB credentials will be added in ApplicationComputeStack.


    // Lambda Execution Role
    // Base role for Lambda functions.
    this.lambdaExecutionRole = new iam.Role(this, generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'LambdaExecutionRole'}), {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      roleName: generateResourceName({appName: appConfig.appName, envName: appConfig.envName, resourceIdentifier: 'LambdaExecRole', maxLength: 64}),
      description: `Lambda Execution Role for ${appConfig.appName} in ${appConfig.envName}`,
    });
    this.lambdaExecutionRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    );
    this.lambdaExecutionRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole')
    );
    // Grant permission for lambdas to use the application KMS key
    this.appKmsKey.grantEncryptDecrypt(this.lambdaExecutionRole);
    // Note: Add specific inline policies or attach other managed policies as needed by individual Lambda functions.
  }
}