# Software Design Specification: AdManager.Infrastructure.Cdk

## 1. Introduction

### 1.1 Purpose
This document provides the detailed software design specification for the `AdManager.Infrastructure.Cdk` repository. This repository is responsible for defining, provisioning, and managing all AWS cloud infrastructure resources required by the Ad Manager Platform using the AWS Cloud Development Kit (CDK) in TypeScript. It implements Infrastructure as Code (IaC) principles to ensure repeatable, version-controlled, and automated infrastructure deployments.

### 1.2 Scope
The scope of this SDS covers:
- The overall structure of the CDK application.
- Definition of reusable CDK constructs for common infrastructure patterns (VPC, ECS Fargate services, RDS databases).
- Definition of CDK stacks that compose these constructs to build the complete platform infrastructure.
- Configuration management for different deployment environments (Dev, Staging, Prod).
- Adherence to specified non-functional requirements like Multi-AZ deployment for disaster recovery and security best practices.
- Provisioning of AWS services including, but not limited to: VPCs, IAM roles, EKS/ECS clusters and Fargate configurations, API Gateways, RDS, DynamoDB, SQS, SNS, S3, ElastiCache, WAF, KMS, and CloudFront.

### 1.3 Definitions, Acronyms, and Abbreviations
- **AWS**: Amazon Web Services
- **CDK**: AWS Cloud Development Kit
- **IaC**: Infrastructure as Code
- **VPC**: Virtual Private Cloud
- **IAM**: Identity and Access Management
- **ECS**: Elastic Container Service
- **Fargate**: Serverless compute engine for containers
- **RDS**: Relational Database Service
- **API Gateway**: Amazon API Gateway
- **SQS**: Simple Queue Service
- **SNS**: Simple Notification Service
- **S3**: Simple Storage Service
- **KMS**: Key Management Service
- **WAF**: Web Application Firewall
- **AZ**: Availability Zone
- **DR**: Disaster Recovery
- **TS**: TypeScript
- **ALB**: Application Load Balancer
- **ECR**: Elastic Container Registry

## 2. System Overview
The `AdManager.Infrastructure.Cdk` project is a TypeScript-based AWS CDK application. It programmatically defines the cloud infrastructure for the Ad Manager Platform. The application is structured into logical stacks and reusable constructs, allowing for modularity and environment-specific configurations. It will provision all necessary AWS resources, including networking, compute, databases, messaging queues, storage, and security components. This approach facilitates automated, consistent, and auditable infrastructure management.

Key requirements directly addressed or supported by this repository include:
- **REQ-POA-008**: Use of IaC for infrastructure provisioning and updates. All infrastructure is defined using AWS CDK.
- **Requirement 4.4.3 (IaC)**: The entire repository adheres to IaC principles.
- **Requirement 5.3 (DR)**: Critical components such as VPCs (subnets), RDS instances, and ECS services are designed for Multi-AZ deployment.
- **Requirement 2.4 (General Constraints - IaC)**: The infrastructure is managed as code, enabling versioning and automation.
- **Requirement 4.4.1 (Containerization and Orchestration)**: The infrastructure supports ECS with Fargate for deploying containerized applications.

## 3. Architectural Design

### 3.1 CDK Application Structure
The CDK application follows a standard structure:
- **`bin/`**: Contains the main application entry point (`admanager-cdk-app.ts`) which instantiates the CDK App and various infrastructure stacks.
- **`lib/`**: Contains the core logic for defining infrastructure:
    - **`stacks/`**: Defines the deployable units (CDK Stacks) like `NetworkStack`, `ApplicationComputeStack`, `IamSecurityStack`, `DatabaseStack`, `CoreServicesStack`, `CdnWafStack`. Each stack groups related resources.
    - **`constructs/`**: Defines reusable infrastructure components (CDK Constructs) like `VpcConstruct`, `FargateServiceConstruct`, `RdsInstanceConstruct`. These encapsulate common patterns.
    - **`config/`**: Manages environment-specific configurations (`dev.config.ts`, `staging.config.ts`, `prod.config.ts`), configuration interfaces (`app-config.interface.ts`), and enums (`environment.enum.ts`).
    - **`utils/`**: Contains helper utilities, primarily for resource naming (`name-generator.ts`).
- **Root Directory**: Contains project configuration files such as `package.json`, `tsconfig.json`, and `cdk.json`.

### 3.2 Key Design Principles
- **Infrastructure as Code (IaC)**: All infrastructure components are defined programmatically in TypeScript using AWS CDK. This allows for version control, peer reviews, automated testing of infrastructure definitions, and repeatable deployments.
- **Modularity and Reusability**: Common infrastructure patterns are encapsulated within custom CDK constructs. This promotes code reuse, consistency, and simplifies stack definitions.
- **Environment Parameterization**: The CDK application is designed to support multiple deployment environments (e.g., Dev, Staging, Prod). Configurations are externalized and loaded based on the target environment, allowing for differences in resource sizing, scaling parameters, and feature flags.
- **High Availability and Disaster Recovery (Multi-AZ)**: Critical infrastructure components (VPCs, RDS instances, ECS Fargate services) are explicitly configured for deployment across multiple Availability Zones to meet the requirements of REQ 5.3.
- **Security by Design**:
    - **Least Privilege**: IAM roles and policies are crafted to grant only the minimum necessary permissions for each AWS service and application component.
    - **Network Segmentation**: VPCs with public and private subnets isolate resources. Security Groups and Network ACLs control traffic flow.
    - **Data Encryption**: KMS is utilized for encrypting data at rest (e.g., S3 buckets, RDS instances, DynamoDB tables) and for managing encryption keys. Secrets are managed via AWS Secrets Manager.
- **Scalability**: Resources are designed with scalability in mind, leveraging auto-scaling capabilities of services like ECS Fargate and appropriate sizing for RDS and DynamoDB.

### 3.3 Configuration Management
- **Typed Configurations**: TypeScript interfaces (e.g., `IAppConfig`, `IEnvironmentConfig` in `lib/config/app-config.interface.ts`) are used to define the structure of configuration objects. This provides strong typing and improves maintainability.
- **Environment-Specific Configuration Files**: Separate TypeScript files (e.g., `lib/config/dev.config.ts`) store the specific configuration values for each environment (Dev, Staging, Prod). These files implement the defined configuration interfaces.
- **Environment Enum**: `lib/config/environment.enum.ts` defines an enumeration for environment names, ensuring consistency.
- **CDK Context / Environment Variables**: The main application entry point (`bin/admanager-cdk-app.ts`) will determine the target environment (e.g., via an environment variable or CDK context parameter like `--context env=dev`) and load the corresponding configuration.

### 3.4 Naming Conventions
- A utility function, `generateResourceName`, located in `lib/utils/name-generator.ts`, is used to create consistent and predictable names for all AWS resources.
- Resource names typically follow a pattern: `<appName>-<envName>-<resourceIdentifier>-<suffix?>`. For example, `admanager-dev-app-vpc` or `admanager-prod-main-db`.
- This aids in resource identification, tagging, and cost management.

## 4. Detailed Design

This section provides a detailed design for the key files, constructs, and stacks within the `AdManager.Infrastructure.Cdk` repository.

### 4.1 Project Setup and Configuration Files

#### 4.1.1 `infrastructure/aws-cdk/package.json`
- **Purpose**: Defines Node.js project metadata, manages dependencies, and lists NPM scripts for building, testing, and deploying the CDK application.
- **Key Dependencies**:
    - `aws-cdk-lib`: Core AWS CDK library for defining AWS resources.
    - `constructs`: The base programming model for CDK.
    - `typescript`: The language used for writing CDK code.
    - `@types/node`, `@types/jest`: TypeScript definitions for Node.js and Jest.
    - `ts-node`: For running TypeScript files directly.
    - `jest`: Testing framework.
- **Key Scripts**:
    - `build`: `tsc` (Compiles TypeScript to JavaScript).
    - `watch`: `tsc -w` (Watches for file changes and recompiles).
    - `test`: `jest` (Runs tests).
    - `cdk`: `cdk` (Main CDK CLI command, e.g., `cdk synth`, `cdk deploy`, `cdk diff`).
- **Requirement Mapping**: REQ-POA-008, 4.4.3.

#### 4.1.2 `infrastructure/aws-cdk/tsconfig.json`
- **Purpose**: Configures the TypeScript compiler (tsc) options for the project.
- **Key Compiler Options**:
    - `target`: `ES2020` (or a recent ECMAScript version).
    - `module`: `commonjs`.
    - `strict`: `true` (Enables all strict type-checking options).
    - `esModuleInterop`: `true` (Allows default imports from CommonJS modules).
    - `experimentalDecorators`: `true` (If decorators are used, though less common in pure IaC).
    - `emitDecoratorMetadata`: `true` (If decorators are used).
    - `outDir`: `dist` (Specifies the output directory for compiled JavaScript).
    - `rootDir`: `.` (Specifies the root directory of input TypeScript files).
    - `skipLibCheck`: `true` (Skips type checking of declaration files).
- **Requirement Mapping**: REQ-POA-008, 4.4.3.

#### 4.1.3 `infrastructure/aws-cdk/cdk.json`
- **Purpose**: AWS CDK toolkit configuration file. Specifies the entry point for the CDK application and can define context variables or feature flags.
- **Key Settings**:
    - `app`: `"npx ts-node --prefer-ts-exts bin/admanager-cdk-app.ts"` (Command to execute the CDK app).
    - `context`: Can hold environment-agnostic context values or CDK feature flags.
      Example:
      json
      {
        "app": "npx ts-node --prefer-ts-exts bin/admanager-cdk-app.ts",
        "watch": {
          "include": [
            "**"
          ],
          "exclude": [
            "README.md",
            "cdk*.json",
            "tsconfig.json",
            "package*.json",
            "yarn.lock",
            "node_modules",
            "dist"
          ]
        },
        "context": {
          "@aws-cdk/aws-ecr-assets:dockerIgnoreSupport": true,
          "@aws-cdk/aws-iam:minimizePolicies": true
        }
      }
      
- **Requirement Mapping**: REQ-POA-008, 4.4.3.

### 4.2 Application Entry Point

#### 4.2.1 `infrastructure/aws-cdk/bin/admanager-cdk-app.ts`
- **Purpose**: This is the main executable file for the CDK application. It initializes the CDK `App` object and instantiates all the defined infrastructure stacks, applying environment-specific configurations.
- **Logic Description**:
    1.  Import necessary CDK modules (`cdk.App`).
    2.  Import stack definitions from `../lib/stacks/` (e.g., `NetworkStack`, `IamSecurityStack`, `DatabaseStack`, `CoreServicesStack`, `ApplicationComputeStack`, `CdnWafStack`).
    3.  Import configuration loading utilities and environment enum from `../lib/config/`.
    4.  Create an instance of `cdk.App()`.
    5.  Determine the target deployment environment (e.g., from `CDK_ENV` environment variable or CDK context `-c env=dev`).
    6.  Load the appropriate environment configuration (e.g., `devConfig`, `stagingConfig`, `prodConfig`).
    7.  Instantiate each stack, passing the `app` instance, a unique stack ID, and stack properties. Stack properties will include:
        -   `env`: The AWS account and region `{ account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }` or from loaded config.
        -   The loaded environment-specific configuration object (`IEnvironmentConfig`).
        -   Outputs from dependent stacks (e.g., the `vpc` object from `NetworkStack` is passed to stacks that need it).
    8.  Apply common tags to all stacks for organization and cost tracking (e.g., `Application: AdManagerPlatform`, `Environment: <envName>`).
- **Example Instantiation Flow**:
    typescript
    #!/usr/bin/env node
    import 'source-map-support/register';
    import * as cdk from 'aws-cdk-lib';
    import { NetworkStack } from '../lib/stacks/network.stack';
    import { IamSecurityStack } from '../lib/stacks/iam-security.stack';
    import { DatabaseStack } from '../lib/stacks/database.stack'; // Assuming this stack exists
    import { ApplicationComputeStack } from '../lib/stacks/application-compute.stack';
    // ... other stack imports

    import { getConfig } from '../lib/config/config-loader'; // Hypothetical config loader

    const app = new cdk.App();
    const envIdentifier = app.node.tryGetContext('env') || process.env.CDK_ENV || 'dev';
    const appConfig = getConfig(envIdentifier); // Load config for the environment

    const env = {
      account: appConfig.awsAccountId || process.env.CDK_DEFAULT_ACCOUNT,
      region: appConfig.awsRegion || process.env.CDK_DEFAULT_REGION,
    };

    const networkStack = new NetworkStack(app, `${appConfig.appName}-NetworkStack-${appConfig.envName}`, {
      env,
      appConfig,
    });

    const iamSecurityStack = new IamSecurityStack(app, `${appConfig.appName}-IamSecurityStack-${appConfig.envName}`, {
      env,
      appConfig,
    });

    const databaseStack = new DatabaseStack(app, `${appConfig.appName}-DatabaseStack-${appConfig.envName}`, {
      env,
      appConfig,
      vpc: networkStack.vpc,
      appKmsKey: iamSecurityStack.appKmsKey, // Example dependency
    });

    const applicationComputeStack = new ApplicationComputeStack(app, `${appConfig.appName}-ApplicationComputeStack-${appConfig.envName}`, {
      env,
      appConfig,
      vpc: networkStack.vpc,
      ecsTaskRole: iamSecurityStack.ecsTaskRole,
      ecsTaskExecutionRole: iamSecurityStack.ecsTaskExecutionRole,
      // Pass DB details from databaseStack, etc.
      dbInstanceEndpoint: databaseStack.postgresInstance.dbInstanceEndpointAddress,
      dbSecret: databaseStack.postgresInstanceSecret,
    });

    // Tag all resources in the app
    cdk.Tags.of(app).add('Application', appConfig.appName);
    cdk.Tags.of(app).add('Environment', appConfig.envName);
    
- **Requirement Mapping**: REQ-POA-008, 4.4.3, 5.3, 2.4, 4.4.1.

### 4.3 Configuration Management (`lib/config/`)

#### 4.3.1 `infrastructure/aws-cdk/lib/config/app-config.interface.ts`
- **Purpose**: Defines TypeScript interfaces for application-wide and environment-specific configurations, ensuring type safety and consistency.
- **Key Interfaces**:
    - `IAppConfig`: Contains common properties.
        - `readonly envName: EnvironmentName;`
        - `readonly awsRegion: string;`
        - `readonly awsAccountId: string;`
        - `readonly appName: string;` (e.g., "AdManager")
    - `IEnvironmentConfig extends IAppConfig`: Extends `IAppConfig` with environment-specific settings.
        - `readonly vpcCidr: string;`
        - `readonly rdsInstanceClass: string;` (e.g., `ec2.InstanceClass.BURSTABLE3_SMALL` represented as string for config, converted to enum in construct)
        - `readonly rdsPostgresVersionString: string;` (e.g., "15.5")
        - `readonly fargateCpu: number;`
        - `readonly fargateMemoryLimitMiB: number;`
        - `readonly apiGatewayStageName: string;`
        - `readonly dynamoDbBillingModeString: string;` (e.g., "PAY_PER_REQUEST")
        - `readonly s3BucketNames: { productFeeds: string; performanceLogs: string; webAssets: string; backups: string };`
        - `readonly multiAzEnabled: boolean;` (Specifically for REQ 5.3)
        - `readonly elastiCacheNodeType?: string;`
        - `readonly elastiCacheNumNodes?: number;`
- **Requirement Mapping**: REQ-POA-008, 4.4.3.

#### 4.3.2 `infrastructure/aws-cdk/lib/config/environment.enum.ts`
- **Purpose**: Provides a type-safe enumeration for different deployment environments.
- **Enum Definition**:
    typescript
    export enum EnvironmentName {
      DEV = 'dev',
      STAGING = 'staging',
      PROD = 'prod',
    }
    
- **Requirement Mapping**: REQ-POA-008, 4.4.3.

#### 4.3.3 `infrastructure/aws-cdk/lib/config/dev.config.ts` (and similar for `staging.config.ts`, `prod.config.ts`)
- **Purpose**: Provides concrete configuration values for a specific deployment environment, implementing `IEnvironmentConfig`.
- **Logic Description**: Exports a constant object of type `IEnvironmentConfig` initialized with values appropriate for the environment.
    typescript
    // Example: dev.config.ts
    import { IEnvironmentConfig, EnvironmentName } from './app-config.interface';

    export const devConfig: IEnvironmentConfig = {
      envName: EnvironmentName.DEV,
      awsRegion: 'us-east-1', // Example
      awsAccountId: 'YOUR_DEV_ACCOUNT_ID_HERE', // Placeholder
      appName: 'AdManager',
      vpcCidr: '10.1.0.0/16',
      rdsInstanceClass: 'db.t3.micro',
      rdsPostgresVersionString: '15.5',
      fargateCpu: 256,
      fargateMemoryLimitMiB: 512,
      apiGatewayStageName: 'dev',
      dynamoDbBillingModeString: 'PAY_PER_REQUEST',
      s3BucketNames: {
        productFeeds: 'admanager-dev-product-feeds',
        performanceLogs: 'admanager-dev-performance-logs',
        webAssets: 'admanager-dev-web-assets',
        backups: 'admanager-dev-backups',
      },
      multiAzEnabled: false, // Typically false for dev to save costs
    };
    
- **Requirement Mapping**: REQ-POA-008, 4.4.3.

### 4.4 Reusable Constructs (`lib/constructs/`)

#### 4.4.1 Network Constructs

##### 4.4.1.1 `infrastructure/aws-cdk/lib/constructs/network/vpc.props.interface.ts`
- **Purpose**: Defines the input properties for the `VpcConstruct`.
- **Interface `VpcProps`**:
    - `readonly vpcCidr: string;`
    - `readonly maxAzs: number;` (e.g., 2 for Dev/Staging, 3 for Prod for REQ 5.3)
    - `readonly natGatewaysCount?: number;` (Number of NAT gateways, can be 0 for dev if no outbound private access needed, or 1 per AZ for prod)
    - `readonly envName: EnvironmentName;`
    - `readonly appName: string;`
    - `readonly subnetConfiguration?: cdk.aws_ec2.SubnetConfiguration[];` (Allows overriding default subnet setup)
- **Requirement Mapping**: REQ-POA-008, 4.4.3.

##### 4.4.1.2 `infrastructure/aws-cdk/lib/constructs/network/vpc.construct.ts`
- **Purpose**: Creates a standard AWS Virtual Private Cloud (VPC) with public and private subnets distributed across multiple Availability Zones for high availability and disaster recovery (REQ 5.3).
- **Class `VpcConstruct extends Construct`**:
    - **Public Property**: `public readonly vpc: cdk.aws_ec2.Vpc;`
    - **Constructor `(scope: Construct, id: string, props: VpcProps)`**:
        1.  Use `generateResourceName` from `name-generator.ts` for the VPC logical ID and name tag.
        2.  Instantiate `new cdk.aws_ec2.Vpc(this, resourceName, { ... })` with:
            -   `cidr: props.vpcCidr`
            -   `maxAzs: props.maxAzs` (Critical for REQ 5.3).
            -   `natGateways: props.natGatewaysCount ?? (props.envName === EnvironmentName.PROD ? props.maxAzs : 1)` (Example: 1 per AZ in Prod).
            -   `subnetConfiguration`: If `props.subnetConfiguration` is provided, use it. Otherwise, define default:
                -   Public Subnets: `name: 'Public', subnetType: cdk.aws_ec2.SubnetType.PUBLIC, cidrMask: 24`
                -   Private Subnets with NAT: `name: 'PrivateApp', subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS, cidrMask: 24` (for application tiers)
                -   Private Isolated Subnets: `name: 'PrivateDb', subnetType: cdk.aws_ec2.SubnetType.PRIVATE_ISOLATED, cidrMask: 28` (for databases)
            -   `enableDnsHostnames: true`
            -   `enableDnsSupport: true`
        3.  Apply standard tags (appName, envName) to the VPC and its subnets.
- **Requirement Mapping**: REQ-POA-008, 4.4.3, 5.3.

#### 4.4.2 Compute Constructs

##### 4.4.2.1 `infrastructure/aws-cdk/lib/constructs/compute/fargate-service.props.interface.ts`
- **Purpose**: Defines input properties for the `FargateServiceConstruct`.
- **Interface `FargateServiceProps`**:
    - `readonly cluster: cdk.aws_ecs.ICluster;`
    - `readonly vpc: cdk.aws_ec2.IVpc;`
    - `readonly taskImageOptions: cdk.aws_ecs_patterns.ApplicationLoadBalancedTaskImageOptions | cdk.aws_ecs_patterns.NetworkLoadBalancedTaskImageOptions;` (Allowing for either ALB or NLB based Fargate services) - for ALB, this includes:
        - `image: cdk.aws_ecs.ContainerImage;` (e.g., `ecs.ContainerImage.fromEcrRepository(...)`)
        - `containerPort?: number;`
        - `environment?: { [key: string]: string };`
        - `secrets?: { [key: string]: cdk.aws_ecs.Secret };` (For integrating with AWS Secrets Manager)
        - `taskRole?: cdk.aws_iam.IRole;`
        - `executionRole?: cdk.aws_iam.IRole;`
        - `logDriver?: cdk.aws_ecs.LogDriver;` (e.g., `new ecs.AwsLogDriver(...)`)
    - `readonly cpu?: number;` (e.g., 256, 512, 1024)
    - `readonly memoryLimitMiB?: number;` (e.g., 512, 1024, 2048)
    - `readonly desiredCount?: number;` (Default 1 for dev, 2+ for prod for REQ 5.3)
    - `readonly serviceName: string;`
    - `readonly loadBalancerType: 'ALB' | 'NLB';`
    - `readonly publicLoadBalancer?: boolean;` (Default true for ALB)
    - `readonly healthCheckPath?: string;` (For ALB health check)
    - `readonly healthCheckGracePeriod?: cdk.Duration;`
    - `readonly minScalingCapacity?: number;`
    - `readonly maxScalingCapacity?: number;`
    - `readonly cpuScalingTargetUtilizationPercent?: number;`
    - `readonly memoryScalingTargetUtilizationPercent?: number;`
    - `readonly vpcSubnets?: cdk.aws_ec2.SubnetSelection;` (Default to private subnets for tasks)
    - `readonly assignPublicIp?: boolean;` (Default false for tasks, true for public NLB)
    - `readonly envName: EnvironmentName;`
    - `readonly appName: string;`
- **Requirement Mapping**: REQ-POA-008, 4.4.3, 4.4.1.

##### 4.4.2.2 `infrastructure/aws-cdk/lib/constructs/compute/fargate-service.construct.ts`
- **Purpose**: Deploys a containerized application as an AWS ECS Fargate service, potentially with a load balancer (ALB or NLB), supporting auto-scaling and multi-AZ deployment (REQ 4.4.1, REQ 5.3).
- **Class `FargateServiceConstruct extends Construct`**:
    - **Public Properties**:
        - `public readonly service: cdk.aws_ecs.FargateService;`
        - `public readonly loadBalancer?: cdk.aws_elasticloadbalancingv2.IApplicationLoadBalancer | cdk.aws_elasticloadbalancingv2.INetworkLoadBalancer;`
        - `public readonly listener?: cdk.aws_elasticloadbalancingv2.IApplicationListener | cdk.aws_elasticloadbalancingv2.INetworkListener;`
    - **Constructor `(scope: Construct, id: string, props: FargateServiceProps)`**:
        1.  Use `generateResourceName`.
        2.  Based on `props.loadBalancerType`:
            -   If `'ALB'`: Instantiate `new cdk.aws_ecs_patterns.ApplicationLoadBalancedFargateService(this, resourceName, { ... })`.
                -   `cluster: props.cluster`, `vpc: props.vpc`
                -   `taskImageOptions: props.taskImageOptions as ApplicationLoadBalancedTaskImageOptions`
                -   `cpu: props.cpu`, `memoryLimitMiB: props.memoryLimitMiB`
                -   `desiredCount: props.desiredCount`
                -   `serviceName: generateResourceName(...)`
                -   `publicLoadBalancer: props.publicLoadBalancer ?? true`
                -   `taskSubnets: props.vpcSubnets ?? { subnetType: cdk.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS }`
                -   `healthCheckGracePeriod: props.healthCheckGracePeriod`
                -   `circuitBreaker: { rollback: true }` (Enable ECS deployment circuit breaker)
            -   If `'NLB'`: Instantiate `new cdk.aws_ecs_patterns.NetworkLoadBalancedFargateService(this, resourceName, { ... })`.
                -   Similar properties, adapting `taskImageOptions`.
        3.  Store the created Fargate service and load balancer (if applicable).
        4.  Configure auto-scaling if `minScalingCapacity`, `maxScalingCapacity`, and scaling metrics are provided.
            typescript
            if (props.minScalingCapacity && props.maxScalingCapacity) {
              const scalableTarget = this.service.autoScaleTaskCount({
                minCapacity: props.minScalingCapacity,
                maxCapacity: props.maxScalingCapacity,
              });
              if (props.cpuScalingTargetUtilizationPercent) {
                scalableTarget.scaleOnCpuUtilization('CpuScaling', {
                  targetUtilizationPercent: props.cpuScalingTargetUtilizationPercent,
                });
              }
              if (props.memoryScalingTargetUtilizationPercent) {
                scalableTarget.scaleOnMemoryUtilization('MemoryScaling', {
                  targetUtilizationPercent: props.memoryScalingTargetUtilizationPercent,
                });
              }
            }
            
        5.  Apply standard tags.
- **Requirement Mapping**: REQ-POA-008, 4.4.3, 4.4.1, 5.3.

#### 4.4.3 Database Constructs

##### 4.4.3.1 `infrastructure/aws-cdk/lib/constructs/database/rds-instance.props.interface.ts`
- **Purpose**: Defines input properties for the `RdsInstanceConstruct`.
- **Interface `RdsInstanceProps`**:
    - `readonly vpc: cdk.aws_ec2.IVpc;`
    - `readonly engineVersionString: string;` (e.g., "15.5" for PostgreSQL)
    - `readonly instanceType: cdk.aws_ec2.InstanceType;`
    - `readonly databaseName: string;`
    - `readonly masterUsername: string;`
    - `readonly masterUserPasswordSecretName?: string;` (If password stored in Secrets Manager, otherwise a new secret is generated)
    - `readonly multiAz?: boolean;` (Default true for Prod, crucial for REQ 5.3)
    - `readonly allocatedStorage?: number;` (in GB)
    - `readonly backupRetention?: cdk.Duration;` (e.g., `cdk.Duration.days(7)`)
    - `readonly vpcSubnets?: cdk.aws_ec2.SubnetSelection;` (Default to private isolated subnets)
    - `readonly securityGroups?: cdk.aws_ec2.ISecurityGroup[];`
    - `readonly deletionProtection?: boolean;` (Default true for Prod)
    - `readonly storageEncrypted?: boolean;` (Default true)
    - `readonly kmsKey?: cdk.aws_kms.IKey;` (For custom KMS encryption)
    - `readonly envName: EnvironmentName;`
    - `readonly appName: string;`
- **Requirement Mapping**: REQ-POA-008, 4.4.3, 5.3.

##### 4.4.3.2 `infrastructure/aws-cdk/lib/constructs/database/rds-instance.construct.ts`
- **Purpose**: Provisions an Amazon RDS database instance (e.g., PostgreSQL) with configurations for high availability (Multi-AZ for REQ 5.3), backups, and security.
- **Class `RdsInstanceConstruct extends Construct`**:
    - **Public Properties**:
        - `public readonly dbInstance: cdk.aws_rds.DatabaseInstance;`
        - `public readonly dbCredentialsSecret: cdk.aws_secretsmanager.ISecret;`
    - **Constructor `(scope: Construct, id: string, props: RdsInstanceProps)`**:
        1.  Use `generateResourceName`.
        2.  Create or retrieve master user password secret:
            typescript
            this.dbCredentialsSecret = new cdk.aws_secretsmanager.Secret(this, `${resourceName}-CredentialsSecret`, {
              secretName: props.masterUserPasswordSecretName || generateResourceName(props.appName, `${props.databaseName}-master-secret`, props.envName),
              generateSecretString: {
                secretStringTemplate: JSON.stringify({ username: props.masterUsername }),
                excludePunctuation: true,
                includeSpace: false,
                generateStringKey: 'password',
                passwordLength: 16,
              },
            });
            
        3.  Determine PostgreSQL engine version: `cdk.aws_rds.PostgresEngineVersion.of(props.engineVersionString, props.engineVersionString.split('.')[0])`.
        4.  Instantiate `new cdk.aws_rds.DatabaseInstance(this, resourceName, { ... })`:
            -   `vpc: props.vpc`
            -   `engine: cdk.aws_rds.DatabaseInstanceEngine.postgres({ version: postgresEngineVersion })`
            -   `instanceType: props.instanceType`
            -   `databaseName: props.databaseName`
            -   `credentials: cdk.aws_rds.Credentials.fromSecret(this.dbCredentialsSecret)`
            -   `multiAz: props.multiAz ?? (props.envName === EnvironmentName.PROD)` (Key for REQ 5.3).
            -   `allocatedStorage: props.allocatedStorage ?? 20`
            -   `backupRetention: props.backupRetention ?? cdk.Duration.days(props.envName === EnvironmentName.PROD ? 30 : 7)`
            -   `vpcSubnets: props.vpcSubnets ?? { subnetType: cdk.aws_ec2.SubnetType.PRIVATE_ISOLATED }`
            -   `securityGroups: props.securityGroups`
            -   `deletionProtection: props.deletionProtection ?? (props.envName === EnvironmentName.PROD)`
            -   `storageEncrypted: props.storageEncrypted ?? true`
            -   `kmsKey: props.kmsKey` (if custom key is used)
            -   `autoMinorVersionUpgrade: true`
            -   `cloudwatchLogsExports: ['postgresql']` (Enable logs export)
        5.  Apply standard tags.
- **Requirement Mapping**: REQ-POA-008, 4.4.3, 5.3.

*(Additional constructs for DynamoDB, SQS, SNS, S3 buckets, ElastiCache, API Gateway, WAF, KMS keys would be defined similarly, with specific properties and resource instantiations relevant to each service.)*

### 4.5 Core Stacks (`lib/stacks/`)

#### 4.5.1 `infrastructure/aws-cdk/lib/stacks/network.stack.ts`
- **Purpose**: Defines and deploys the core networking infrastructure for the Ad Manager platform, including the VPC, subnets, route tables, and foundational security groups.
- **Class `NetworkStack extends cdk.Stack`**:
    - **Public Property**: `public readonly vpc: cdk.aws_ec2.IVpc;`
    - **Constructor `(scope: Construct, id: string, props: NetworkStackProps)`**:
        1.  Call `super(scope, id, props)`.
        2.  Instantiate `VpcConstruct` using configurations from `props.appConfig`.
            typescript
            const vpcConstruct = new VpcConstruct(this, 'PlatformVpc', {
              vpcCidr: props.appConfig.vpcCidr,
              maxAzs: props.appConfig.multiAzEnabled ? (props.appConfig.envName === EnvironmentName.PROD ? 3 : 2) : 1,
              natGatewaysCount: props.appConfig.multiAzEnabled ? (props.appConfig.envName === EnvironmentName.PROD ? 3 : 1) : (props.appConfig.envName !== EnvironmentName.DEV ? 1 : 0),
              envName: props.appConfig.envName,
              appName: props.appConfig.appName,
            });
            this.vpc = vpcConstruct.vpc;
            
        3.  Optionally define common security groups (e.g., a default SG allowing internal VPC traffic) or export the VPC for other stacks to define their own SGs.
        4.  Output VPC ID and subnet IDs using `cdk.CfnOutput`.
- **Interface `NetworkStackProps extends cdk.StackProps`**:
    - `readonly appConfig: IEnvironmentConfig;`
- **Requirement Mapping**: REQ-POA-008, 4.4.3, 5.3.

#### 4.5.2 `infrastructure/aws-cdk/lib/stacks/iam-security.stack.ts`
- **Purpose**: Responsible for creating all IAM roles, policies, KMS keys for encryption, and other central security-related configurations.
- **Class `IamSecurityStack extends cdk.Stack`**:
    - **Public Properties**:
        - `public readonly ecsTaskRole: cdk.aws_iam.IRole;`
        - `public readonly ecsTaskExecutionRole: cdk.aws_iam.IRole;`
        - `public readonly lambdaExecutionRole: cdk.aws_iam.IRole;`
        - `public readonly appKmsKey: cdk.aws_kms.IKey;`
    - **Constructor `(scope: Construct, id: string, props: IamSecurityStackProps)`**:
        1.  Create `appKmsKey` using `new cdk.aws_kms.Key(...)` with rotation enabled.
        2.  Create `ecsTaskExecutionRole`: Assumed by `ecs-tasks.amazonaws.com`. Attach managed policies like `AmazonECSTaskExecutionRolePolicy` and policies for ECR image pull access and CloudWatch Logs.
        3.  Create `ecsTaskRole`: Assumed by `ecs-tasks.amazonaws.com`. Grant permissions to access other AWS services (DynamoDB, S3, SQS, SNS, RDS Data API or Secrets Manager for DB creds) based on the principle of least privilege. Grant permission to use `appKmsKey`.
        4.  Create `lambdaExecutionRole`: Assumed by `lambda.amazonaws.com`. Attach `AWSLambdaBasicExecutionRole`, `AWSLambdaVPCAccessExecutionRole` (if Lambdas run in VPC). Add inline policies for specific Lambda function needs.
- **Interface `IamSecurityStackProps extends cdk.StackProps`**:
    - `readonly appConfig: IEnvironmentConfig;`
- **Requirement Mapping**: REQ-POA-008, 4.4.3.

#### 4.5.3 `infrastructure/aws-cdk/lib/stacks/application-compute.stack.ts`
- **Purpose**: Deploys application compute resources, primarily ECS Fargate services for various microservices, and related API Gateways.
- **Class `ApplicationComputeStack extends cdk.Stack`**:
    - **Constructor `(scope: Construct, id: string, props: ApplicationComputeStackProps)`**:
        1.  Create an ECS Cluster: `new cdk.aws_ecs.Cluster(this, 'AppCluster', { vpc: props.vpc, ... })`.
        2.  For each microservice (e.g., CampaignManagement, ProductCatalog, AnalyticsReporting):
            -   Define ECR repository if not pre-existing or use `ecs.ContainerImage.fromEcrRepository`.
            -   Instantiate `FargateServiceConstruct`, passing the cluster, VPC, image, CPU/memory from `props.appConfig`, `taskRole: props.ecsTaskRole`, `executionRole: props.ecsTaskExecutionRole`.
            -   Inject environment variables: database connection details (from `props.dbInstanceEndpoint`, `props.dbSecret.secretArn`), SQS queue URLs, SNS topic ARNs, other service endpoints.
            -   Configure the ALB/NLB target groups and listeners.
        3.  Provision API Gateways (e.g., `cdk.aws_apigateway.RestApi` or `HttpApi`):
            -   Define resources and methods.
            -   Integrate with Fargate service ALBs (VPC Link integration) or Lambda functions.
            -   Configure request/response transformations, authorizers (JWT, Lambda authorizers).
- **Interface `ApplicationComputeStackProps extends cdk.StackProps`**:
    - `readonly appConfig: IEnvironmentConfig;`
    - `readonly vpc: cdk.aws_ec2.IVpc;`
    - `readonly ecsTaskRole: cdk.aws_iam.IRole;`
    - `readonly ecsTaskExecutionRole: cdk.aws_iam.IRole;`
    - `readonly lambdaExecutionRole: cdk.aws_iam.IRole;` // If Lambdas are used for some compute
    - `readonly dbInstanceEndpoint?: string;` // From DatabaseStack
    - `readonly dbSecret?: cdk.aws_secretsmanager.ISecret;` // From DatabaseStack
    - `readonly appKmsKey: cdk.aws_kms.IKey;` // From IamSecurityStack
    // ... other dependencies like SQS Queue URLs, SNS Topic ARNs
- **Requirement Mapping**: REQ-POA-008, 4.4.3, 4.4.1, 5.3 (ensuring Fargate services are deployed across AZs by using appropriate VPC subnets).

*(Additional stacks like `DatabaseStack`, `CoreServicesStack` (for SQS, SNS, S3, ElastiCache), and `CdnWafStack` (for CloudFront, WAF) would be defined, each responsible for a logical grouping of resources and utilizing relevant constructs.)*

### 4.6 Utilities (`lib/utils/`)

#### 4.6.1 `infrastructure/aws-cdk/lib/utils/name-generator.ts`
- **Purpose**: Provides utility functions to generate consistent and standardized names for AWS resources based on environment, application name, and resource type.
- **Function `generateResourceName(params: { appName: string; envName: EnvironmentName; resourceIdentifier: string; maxLength?: number; separator?: string; }): string`**:
    -   Constructs a name like `${params.appName}${separator}${params.envName}${separator}${params.resourceIdentifier}`.
    -   Handles `maxLength` constraints if provided (e.g., for S3 bucket names).
    -   Converts to lowercase and uses hyphens as default separators.
- **Requirement Mapping**: REQ-POA-008.

## 5. Deployment Strategy
- The infrastructure defined by this CDK application will be deployed via AWS CDK CLI commands (`cdk deploy`, `cdk synth`, `cdk diff`).
- Deployments will be managed on a per-environment basis (Dev, Staging, Prod), driven by separate configurations.
- Automation of deployments will be handled by CI/CD pipelines (e.g., AWS CodePipeline, GitHub Actions, Jenkins) which execute the CDK commands. This is in line with REQ-POA-005, though the pipeline setup itself might be in a separate IaC definition or managed manually initially. This repository provides the "what" to deploy.
- Changes to infrastructure will be version-controlled in Git, reviewed, and then deployed through the pipeline.

## 6. Security Considerations (IaC Specific)
- **IAM Roles and Policies**: All IAM roles are defined with the principle of least privilege. Specific permissions are granted only for necessary actions on required resources. `IamSecurityStack` centralizes key role definitions.
- **KMS for Encryption**: `IamSecurityStack` provisions a customer-managed KMS key (`appKmsKey`) used by default for encrypting data at rest in RDS, S3, DynamoDB, and other services where applicable.
- **Network Security**:
    - VPCs utilize private subnets for application and database tiers, limiting direct public access.
    - Security Groups are defined granularly to control traffic between Fargate services, RDS instances, ElastiCache, and other components.
    - NAT Gateways provide controlled outbound internet access for resources in private subnets.
- **Secrets Management**: Sensitive information like database passwords and API keys are stored in AWS Secrets Manager. IAM roles for compute services are granted permission to retrieve these secrets.
- **WAF and Shield**: A `CdnWafStack` (if created) would provision AWS WAF with rules to protect public-facing API Gateways and CloudFront distributions from common web exploits. AWS Shield Standard provides DDoS protection by default.
- **Infrastructure Immutability**: While not strictly immutable, IaC promotes replacing rather than modifying resources where feasible, reducing configuration drift.
- **Regular IaC Audits**: The CDK code itself should be subject to security reviews and static analysis scans.

## 7. Testing (IaC Specific)
- **CDK Synth Tests**: Standard `jest` tests will be written to ensure that each stack synthesizes to a CloudFormation template without errors.
    - `expect(app.synth().getStackByName('MyStackName')).not.toThrow();`
- **Snapshot Tests**: Synthesized CloudFormation templates will be compared against stored snapshots to detect unintended changes.
    - `expect(Template.fromStack(myStack).toJSON()).toMatchSnapshot();`
- **Fine-grained Assertions**: The `aws-cdk-lib/assertions` module will be used to write tests that verify specific properties of the generated resources.
    - Example: Verifying an S3 bucket has versioning enabled:
      typescript
      const template = Template.fromStack(myS3Stack);
      template.hasResourceProperties('AWS::S3::Bucket', {
        VersioningConfiguration: { Status: 'Enabled' }
      });
      
    - Example: Verifying an RDS instance has Multi-AZ enabled for production:
      typescript
      if (appConfig.envName === EnvironmentName.PROD) {
        template.hasResourceProperties('AWS::RDS::DBInstance', {
          MultiAZ: true,
        });
      }
      
- **Unit Tests for Custom Constructs**: Each reusable construct (e.g., `VpcConstruct`, `FargateServiceConstruct`) will have its own set of unit tests to ensure it correctly provisions resources based on input props and adheres to design principles like Multi-AZ.
- **Linting**: ESLint with appropriate plugins will be used for code style and quality checks.