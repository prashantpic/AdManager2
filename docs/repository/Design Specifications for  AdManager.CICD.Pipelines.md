# Software Design Specification: AdManager.CICD.Pipelines

## 1. Introduction

This document outlines the software design for the `AdManager.CICD.Pipelines` repository. This repository is responsible for defining, managing, and orchestrating the Continuous Integration and Continuous Deployment (CI/CD) pipelines for all backend microservices (NestJS) and frontend applications (React/Next.js) of the Ad Manager Platform.

The pipelines will be defined using the AWS Cloud Development Kit (CDK) in TypeScript, leveraging AWS CodePipeline, AWS CodeBuild, and AWS CodeDeploy. The design emphasizes automation for building, comprehensive testing (unit, integration, E2E, SAST, DAST), and deploying applications across various environments (development, staging, production).

**Key Requirements Addressed:**
*   `REQ-POA-005`: Platform Administrators visibility into CI/CD pipeline status and control over deployments, including rollbacks.
*   `SRS 5.2`: Utilization of AWS CodePipeline, CodeBuild, and CodeDeploy for CI/CD.
*   `SRS 5.8`: Integration of automated testing (unit, integration, E2E).
*   `SRS 3.2.4`: Integration of SAST (SonarQube) and DAST (OWASP ZAP) security scans.

## 2. Design Goals

*   **Automation:** Fully automate the build, test, and deployment lifecycle.
*   **Consistency:** Provide standardized pipeline structures for different service types.
*   **Reliability:** Ensure robust and repeatable deployments.
*   **Speed:** Enable rapid delivery of features and fixes.
*   **Security:** Integrate security scanning (SAST/DAST) into the pipelines.
*   **Testability:** Enforce comprehensive automated testing at various levels.
*   **Maintainability:** Define pipelines declaratively using AWS CDK for easier management and versioning.
*   **Visibility:** Provide clear status and notification for pipeline executions.
*   **Configurability:** Allow environment-specific and service-specific configurations.

## 3. Pipeline Architecture Overview

A multi-pipeline strategy will be adopted:
*   A dedicated CodePipeline instance will be created for each backend microservice and frontend application.
*   Pipelines will be structured with distinct stages: Source, Build, Test (Unit/Integration), Security Scan (SAST), Deploy (to a test/staging environment), Test (E2E, DAST), Approval (manual, for production), Deploy (to production), and Notifications.
*   The `MainPipelineStack` CDK stack will be responsible for orchestrating the creation of these individual pipelines based on service definitions.

### 3.1. Standard Pipeline Stages

Each application pipeline will generally consist of the following stages:

1.  **Source Stage:** Fetches the latest source code from the designated repository (e.g., AWS CodeCommit, GitHub).
2.  **Build Stage:** Compiles the application, installs dependencies, and packages build artifacts.
3.  **Unit & Integration Test Stage:** Executes unit and integration tests. Pipeline proceeds only if tests pass.
4.  **SAST Scan Stage:** Performs Static Application Security Testing on the source code.
5.  **Deploy to Staging/Test Environment:** Deploys the application to a non-production environment.
6.  **E2E & DAST Scan Stage:** Executes End-to-End tests and Dynamic Application Security Testing against the deployed application in the staging/test environment.
7.  **Manual Approval Stage (for Production):** Pauses the pipeline for manual approval before deploying to the production environment.
8.  **Deploy to Production:** Deploys the application to the production environment upon approval.
9.  **Notification Stage:** Sends notifications regarding pipeline status (success/failure) to relevant stakeholders.

## 4. AWS CDK Application Structure (`AdManager.CICD` Namespace)

The CI/CD infrastructure will be defined as an AWS CDK application written in TypeScript.

### 4.1. Core Configuration Files

*   **`package.json`**:
    *   **Purpose:** Manages Node.js project dependencies (e.g., `aws-cdk-lib`, `constructs`, `typescript`, `@types/node`) and scripts (e.g., `cdk deploy`, `cdk synth`, `build`, `test`).
    *   **Key Dependencies:**
        *   `aws-cdk-lib`: Core CDK library.
        *   `constructs`: CDK programming model.
        *   `typescript`: For CDK code.
        *   `ts-node`: To run TypeScript CDK code.
        *   `@aws-cdk/aws-codepipeline`, `@aws-cdk/aws-codepipeline-actions`, `@aws-cdk/aws-codebuild`, `@aws-cdk/aws-codedeploy`, `@aws-cdk/aws-s3`, `@aws-cdk/aws-iam`, `@aws-cdk/aws-sns`, `@aws-cdk/aws-chatbot`, `@aws-cdk/aws-codestarnotifications`.
    *   **Key Scripts:**
        *   `build`: `tsc`
        *   `watch`: `tsc -w`
        *   `test`: `jest` (if CDK app has tests)
        *   `cdk`: `cdk`
        *   `deploy`: `cdk deploy`
        *   `synth`: `cdk synth`

*   **`tsconfig.json`**:
    *   **Purpose:** Configures the TypeScript compiler for the CDK project.
    *   **Key Settings:** `target: "ES2020"`, `module: "commonjs"`, `strict: true`, `esModuleInterop: true`, `outDir: "dist"`, `rootDir: "."`.

*   **`cdk.json`**:
    *   **Purpose:** AWS CDK toolkit configuration.
    *   **Key Settings:**
        *   `app`: `"npx ts-node --prefer-ts-exts app.ts"`
        *   `context`: May include context variables or feature flags for CDK.

### 4.2. CDK Application Entry Point

*   **`app.ts`** (`AdManager.CICD` Namespace)
    *   **Purpose:** Main entry point for the CDK application.
    *   **Logic:**
        1.  Import necessary CDK core libraries (`cdk.App`).
        2.  Import `MainPipelineStack` from `cicd/pipelines/main-pipeline-stack.ts`.
        3.  Import environment configurations from `cicd/pipelines/config/pipeline-environments.ts`.
        4.  Instantiate `cdk.App`.
        5.  Instantiate `MainPipelineStack` for each target environment (e.g., dev, staging, prod), passing appropriate environment configurations. Example:
            typescript
            import * as cdk from 'aws-cdk-lib';
            import { MainPipelineStack } from './cicd/pipelines/main-pipeline-stack';
            import { devEnvironment, stagingEnvironment, prodEnvironment } from './cicd/pipelines/config/pipeline-environments';

            const app = new cdk.App();

            new MainPipelineStack(app, 'AdManager-Dev-Pipelines', {
                env: { account: devEnvironment.awsAccountId, region: devEnvironment.awsRegion },
                environmentName: 'dev',
                ...devEnvironment // Pass other environment-specific props
            });

            new MainPipelineStack(app, 'AdManager-Staging-Pipelines', {
                env: { account: stagingEnvironment.awsAccountId, region: stagingEnvironment.awsRegion },
                environmentName: 'staging',
                ...stagingEnvironment
            });

            // Potentially conditional instantiation for prod or separate stack
            new MainPipelineStack(app, 'AdManager-Prod-Pipelines', {
                env: { account: prodEnvironment.awsAccountId, region: prodEnvironment.awsRegion },
                environmentName: 'prod',
                ...prodEnvironment
            });

            app.synth();
            

### 4.3. Configuration Files (`AdManager.CICD.Config` Namespace)

*   **`cicd/pipelines/config/pipeline-environments.ts`**:
    *   **Purpose:** Provides strongly-typed configuration for different deployment environments.
    *   **Structure:**
        typescript
        export interface PipelineEnvironmentConfig {
            readonly awsAccountId: string;
            readonly awsRegion: string;
            readonly environmentName: 'dev' | 'staging' | 'prod';
            // Add other common env-specific props:
            // e.g., vpcId?: string;
            // e.g., notificationEmail?: string;
            // e.g., ecrRepositoryUriPrefix?: string;
        }

        export const devEnvironment: PipelineEnvironmentConfig = { /* ... */ };
        export const stagingEnvironment: PipelineEnvironmentConfig = { /* ... */ };
        export const prodEnvironment: PipelineEnvironmentConfig = { /* ... */ };
        
    *   Each environment object will contain AWS account ID, region, and potentially other environment-specific details like ECR repository names, S3 bucket names for frontend deployments, ECS cluster names, etc.

*   **`cicd/pipelines/config/service-definitions.ts`**:
    *   **Purpose:** Centralized metadata for each service/application requiring a CI/CD pipeline.
    *   **Structure:**
        typescript
        export enum SourceType {
            CODECOMMIT = 'CodeCommit',
            GITHUB = 'GitHub',
            S3 = 'S3',
        }

        export enum DeploymentTargetType {
            ECS = 'ECS',
            S3_CLOUDFRONT = 'S3_CLOUDFRONT',
            LAMBDA = 'Lambda', // Example for future
        }

        export interface BaseServiceConfig {
            readonly serviceName: string; // Unique identifier
            readonly sourceType: SourceType;
            readonly sourceRepositoryName: string; // e.g., 'AdManager.CampaignService' or 'github-owner/repo-name'
            readonly sourceBranch: string; // e.g., 'main', 'develop'
            readonly githubConnectionArn?: string; // Required if sourceType is GITHUB
            readonly buildspecPath?: string; // Relative path within the service repo, defaults will be used if not provided
            readonly deploymentTargetType: DeploymentTargetType;
        }

        export interface BackendServiceConfig extends BaseServiceConfig {
            readonly deploymentTargetType: DeploymentTargetType.ECS;
            readonly ecsClusterName: string;
            readonly ecsServiceName: string;
            readonly ecsTaskDefinitionFamily: string; // Family name for the task definition
            readonly ecsContainerName: string;
            readonly ecsContainerPort: number;
            readonly appspecPath?: string; // Relative path within the service repo
            // Potentially add health check paths, memory/cpu reservations etc.
        }

        export interface FrontendAppConfig extends BaseServiceConfig {
            readonly deploymentTargetType: DeploymentTargetType.S3_CLOUDFRONT;
            readonly s3BucketName: string;
            readonly cloudfrontDistributionId?: string; // For cache invalidation
            // Potentially add custom domain, ACM cert ARN etc.
        }

        export const backendServices: BackendServiceConfig[] = [
            // Example:
            // {
            //   serviceName: 'CampaignService',
            //   sourceType: SourceType.CODECOMMIT,
            //   sourceRepositoryName: 'AdManager-CampaignService',
            //   sourceBranch: 'main',
            //   buildspecPath: 'buildspec.yml',
            //   deploymentTargetType: DeploymentTargetType.ECS,
            //   ecsClusterName: 'AdManager-Cluster',
            //   ecsServiceName: 'CampaignService-ECS-Service',
            //   ecsTaskDefinitionFamily: 'CampaignServiceTaskDef',
            //   ecsContainerName: 'campaign-service-container',
            //   ecsContainerPort: 3000,
            //   appspecPath: 'appspec.yml'
            // },
            // ... other backend services
        ];

        export const frontendApps: FrontendAppConfig[] = [
            // Example:
            // {
            //   appName: 'MerchantPortal',
            //   sourceType: SourceType.GITHUB,
            //   sourceRepositoryName: 'your-org/admanager-merchant-portal',
            //   sourceBranch: 'main',
            //   githubConnectionArn: 'arn:aws:codestar-connections:...',
            //   buildspecPath: 'buildspec.yml',
            //   deploymentTargetType: DeploymentTargetType.S3_CLOUDFRONT,
            //   s3BucketName: 'admanager-merchant-portal-bucket',
            //   cloudfrontDistributionId: 'ABC123XYZ789'
            // },
            // ... other frontend apps
        ];
        

### 4.4. Interface Definitions (`AdManager.CICD.Interfaces` Namespace)

*   **`cicd/pipelines/interfaces/pipeline-props.ts`**:
    *   **Purpose:** Type safety and clear contracts for CDK constructs and stacks.
    *   **Structure:**
        typescript
        import * as cdk from 'aws-cdk-lib';
        import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
        import * as codebuild from 'aws-cdk-lib/aws-codebuild';
        import * as s3 from 'aws-cdk-lib/aws-s3';
        import * as iam from 'aws-cdk-lib/aws-iam';
        import { PipelineEnvironmentConfig, BaseServiceConfig } from '../config/pipeline-environments'; // Adjust path

        export interface MainPipelineStackProps extends cdk.StackProps, PipelineEnvironmentConfig {}

        export interface SourceStageProps {
            readonly repositoryName: string;
            readonly branchName: string;
            readonly sourceType: SourceType; // From service-definitions
            readonly connectionArn?: string; // For GitHub
            readonly triggerOnPush?: boolean;
            readonly outputArtifactName?: string;
        }

        export interface BuildStageProps {
            readonly projectSourceName: string; // For naming CodeBuild project
            readonly inputArtifact: codepipeline.Artifact;
            readonly outputArtifactName?: string;
            readonly buildSpecPath: string; // Path to buildspec in source repo
            readonly environmentVariables?: { [name: string]: codebuild.BuildEnvironmentVariable };
            readonly buildImage?: codebuild.IBuildImage;
            readonly serviceRole?: iam.IRole;
        }

        export interface TestStageProps extends BuildStageProps {
            // Similar to BuildStageProps, but specific for test execution
            // May include test reporting configurations
        }

        export interface SecurityScanStageProps extends BuildStageProps {
            readonly sonarqubeServerUrl?: string; // For SAST
            readonly sonarqubeTokenSecretArn?: string; // For SAST
            readonly sonarqubeProjectKey?: string; // For SAST
            readonly dastTargetUrl?: string; // For DAST
        }

        export interface DeployStageProps {
            readonly projectSourceName: string;
            readonly inputArtifact: codepipeline.Artifact;
            readonly serviceConfig: BackendServiceConfig | FrontendAppConfig; // To get deployment specifics
            readonly environmentName: 'dev' | 'staging' | 'prod';
            readonly serviceRole?: iam.IRole; // For CodeDeploy
            readonly s3DeploymentBucket?: s3.IBucket; // For S3 deployments
            readonly cloudfrontDistributionId?: string; // For S3/CloudFront
        }

        export interface ApprovalStageProps {
            readonly stageName: string;
            readonly notificationSnsTopicArn?: string;
            readonly approverEmails?: string[];
        }

        export interface NotificationStageProps {
            readonly pipeline: codepipeline.IPipeline;
            readonly pipelineName: string;
            readonly notificationSnsTopicArn: string;
            readonly slackChannelConfigurationArn?: string; // For AWS Chatbot integration
        }
        

### 4.5. Main Pipeline Stack (`AdManager.CICD.Stacks` Namespace)

*   **`cicd/pipelines/main-pipeline-stack.ts`**:
    *   **Purpose:** Defines and provisions all CI/CD pipelines.
    *   **Key Members:**
        *   `scope: Construct`, `id: string`, `props: MainPipelineStackProps`
    *   **`constructor(scope: Construct, id: string, props: MainPipelineStackProps)`:**
        1.  Initialize the stack.
        2.  Retrieve `backendServices` and `frontendApps` from `service-definitions.ts`.
        3.  Create a shared SNS topic for pipeline notifications within this environment stack.
        4.  Loop through `backendServices`:
            *   Call `this.createBackendServicePipeline(service, props, notificationSnsTopic)`.
        5.  Loop through `frontendApps`:
            *   Call `this.createFrontendAppPipeline(app, props, notificationSnsTopic)`.
    *   **`private createBackendServicePipeline(serviceConfig: BackendServiceConfig, stackProps: MainPipelineStackProps, notificationTopic: sns.ITopic): codepipeline.Pipeline`**:
        1.  Create an S3 artifact bucket for this pipeline if one doesn't exist per pipeline.
        2.  Instantiate `SourceStage` (pass `serviceConfig.sourceRepositoryName`, `serviceConfig.sourceBranch`, etc.).
        3.  Instantiate `BuildStage` (pass source artifact, `serviceConfig.buildspecPath` or default `assets/buildspecs/backend-service-build.yml`).
        4.  Instantiate `UnitTestStage` (pass source artifact, buildspec with test commands).
        5.  Instantiate `SastScanStage` (pass source artifact, buildspec `assets/buildspecs/sast-sonarqube-scan.yml`, SonarQube env vars from stack props or secrets).
        6.  **Staging Deployment:**
            *   Instantiate `DeployStage` for staging (pass build artifact, `serviceConfig` for ECS details, `environmentName: 'staging'`).
        7.  **Staging Tests:**
            *   Instantiate `E2eTestStage` for staging (pass buildspec `assets/buildspecs/e2e-tests-run.yml`, staging environment URL).
            *   Instantiate `DastScanStage` for staging (pass buildspec `assets/buildspecs/dast-zap-scan.yml`, staging environment URL).
        8.  **Production Path (if not dev pipeline):**
            *   If `stackProps.environmentName` is 'staging' or 'prod' (for a prod pipeline triggered from staging promotion):
                *   Instantiate `ApprovalStage` if `stackProps.environmentName === 'prod'`.
                *   Instantiate `DeployStage` for production.
        9.  Create `codepipeline.Pipeline` adding all stages in sequence.
        10. Instantiate `NotificationStage` for this pipeline and the `notificationTopic`.
        11. Return the pipeline.
    *   **`private createFrontendAppPipeline(appConfig: FrontendAppConfig, stackProps: MainPipelineStackProps, notificationTopic: sns.ITopic): codepipeline.Pipeline`**:
        1.  Similar structure to `createBackendServicePipeline` but:
            *   Default buildspec: `assets/buildspecs/frontend-app-build.yml`.
            *   `DeployStage` will use S3 sync and CloudFront invalidation logic (likely via a CodeBuild project action or Lambda). `serviceConfig` will be `FrontendAppConfig`.
            *   E2E/DAST tests target the deployed S3/CloudFront URL.
        2.  Return the pipeline.

### 4.6. Reusable CDK Constructs (`AdManager.CICD.Constructs` Namespace)

Each construct will encapsulate the logic for creating a specific pipeline stage.

*   **`cicd/pipelines/constructs/source-stage.ts` (`SourceStage`)**:
    *   **Input Props:** `SourceStageProps`.
    *   **Logic:**
        *   Creates `codepipeline_actions.CodeCommitSourceAction`, `codepipeline_actions.GitHubSourceAction` (using `CodeStarConnectionsSourceAction`), or `codepipeline_actions.S3SourceAction` based on `props.sourceType`.
        *   Configures branch, trigger, output artifact (`this.sourceOutput`).
*   **`cicd/pipelines/constructs/build-stage.ts` (`BuildStage`)**:
    *   **Input Props:** `BuildStageProps`.
    *   **Logic:**
        *   Creates `codebuild.PipelineProject` with appropriate build image (e.g., `aws-linux-corretto-node-20`), environment variables, IAM role (permissions for ECR push, S3 access if needed).
        *   Uses `codebuild.BuildSpec.fromSourceFilename(props.buildSpecPath)`.
        *   Creates `codepipeline_actions.CodeBuildAction` using the project and input/output artifacts (`this.buildOutput`, `this.codeBuildProject`).
*   **`cicd/pipelines/constructs/unit-test-stage.ts` (`UnitTestStage`)**:
    *   **Input Props:** `TestStageProps`.
    *   **Logic:** Similar to `BuildStage`, but CodeBuild project configured for test execution.
        *   Buildspec typically includes commands to run tests and generate reports (e.g., JUnit XML).
        *   CodeBuild can be configured to report test results directly.
*   **`cicd/pipelines/constructs/sast-scan-stage.ts` (`SastScanStage`)**:
    *   **Input Props:** `SecurityScanStageProps`.
    *   **Logic:** Similar to `BuildStage`.
        *   CodeBuild project configured to run SonarScanner.
        *   Environment variables for `SONAR_HOST_URL`, `SONAR_LOGIN` (from Secrets Manager via `props.sonarqubeTokenSecretArn`), `SONAR_PROJECT_KEY`.
        *   Buildspec: `assets/buildspecs/sast-sonarqube-scan.yml`.
        *   Option to fail pipeline based on SonarQube Quality Gate status (might require custom script in buildspec or Lambda).
*   **`cicd/pipelines/constructs/dast-scan-stage.ts` (`DastScanStage`)**:
    *   **Input Props:** `SecurityScanStageProps`.
    *   **Logic:** Similar to `BuildStage`.
        *   CodeBuild project configured to run OWASP ZAP (e.g., using ZAP Docker image).
        *   Environment variable for `DAST_TARGET_URL`.
        *   Buildspec: `assets/buildspecs/dast-zap-scan.yml`.
        *   Mechanism to report/fail based on DAST findings.
*   **`cicd/pipelines/constructs/e2e-test-stage.ts` (`E2eTestStage`)**:
    *   **Input Props:** `TestStageProps`.
    *   **Logic:** Similar to `BuildStage`.
        *   CodeBuild project configured to run E2E test framework (e.g., Cypress, Playwright).
        *   Environment variable for `E2E_TARGET_URL`.
        *   Buildspec: `assets/buildspecs/e2e-tests-run.yml`.
*   **`cicd/pipelines/constructs/deploy-stage.ts` (`DeployStage`)**:
    *   **Input Props:** `DeployStageProps`.
    *   **Logic:**
        *   **For ECS (Backend):**
            *   Retrieves or creates `codedeploy.EcsApplication` and `codedeploy.EcsDeploymentGroup`.
            *   Configures deployment style (e.g., Blue/Green via `codedeploy.EcsDeploymentConfig.ALL_AT_ONCE` with traffic shifting, or standard rolling).
            *   Creates `codepipeline_actions.CodeDeployEcsDeployAction`. `appspecPath` is used internally by CodeDeploy from the artifact.
            *   Automated rollback configuration: `props.serviceConfig` can inform this.
        *   **For S3/CloudFront (Frontend):**
            *   Creates a `codebuild.PipelineProject` to perform S3 sync and CloudFront invalidation.
                *   Buildspec for this project will contain AWS CLI commands:
                    *   `aws s3 sync <inputArtifactPath> s3://<props.s3DeploymentBucket.bucketName>/ --delete`
                    *   `aws cloudfront create-invalidation --distribution-id <props.cloudfrontDistributionId> --paths "/*"` (if distribution ID is provided).
            *   Creates `codepipeline_actions.CodeBuildAction` using this project.
*   **`cicd/pipelines/constructs/approval-stage.ts` (`ApprovalStage`)**:
    *   **Input Props:** `ApprovalStageProps`.
    *   **Logic:**
        *   Creates `codepipeline_actions.ManualApprovalAction`.
        *   Optionally configures SNS topic for notifications using `props.notificationSnsTopicArn` or `props.approverEmails` (which would require creating an SNS topic and subscriptions within the construct).
*   **`cicd/pipelines/constructs/notification-stage.ts` (`NotificationStage`)**:
    *   **Input Props:** `NotificationStageProps`.
    *   **Logic:**
        *   Creates `codestarnotifications.NotificationRule` targeting the `props.pipeline`.
        *   Specifies events (e.g., `PIPELINE_EXECUTION_SUCCEEDED`, `PIPELINE_EXECUTION_FAILED`, `ACTION_EXECUTION_FAILED`).
        *   Target is an SNS topic (`props.notificationSnsTopicArn`).
        *   If `props.slackChannelConfigurationArn` is provided, it can also target AWS Chatbot for Slack notifications via the SNS topic.

## 5. Build and Deployment Specifications (`assets/`)

### 5.1. Buildspecs (`assets/buildspecs/*.yml`)

These YAML files define commands for CodeBuild projects.

*   **`backend-service-build.yml`**:
    yaml
    version: 0.2
    phases:
      install:
        runtime-versions:
          nodejs: 20 # Or as per project requirements
        commands:
          - echo Installing dependencies...
          - npm ci # Or yarn install
      pre_build:
        commands:
          - echo Running linters...
          - npm run lint # Or yarn lint
      build:
        commands:
          - echo Running tests...
          - npm run test # For unit & integration tests
          - echo Building service...
          - npm run build
      post_build:
        commands:
          - echo Packaging artifacts...
          # Example: copy dist, node_modules (if needed), package.json, appspec.yml to an artifact dir
          # This step depends on how deployment artifact is structured for ECS
          - mkdir artifact_output
          - cp -R dist/* artifact_output/
          - if [ -f appspec.yml ]; then cp appspec.yml artifact_output/; fi
          - if [ -f Procfile ]; then cp Procfile artifact_output/; fi # If using Procfile for ECS startup
          # Add other necessary files for deployment
    artifacts:
      files:
        - '**/*' # Or specific files/folders
      base-directory: 'artifact_output' # Or the root build output directory
    reports: # For CodeBuild test reporting
      TestReportGroup: # Name of the report group
        files:
          - 'junit.xml' # Or other supported formats like Cucumber JSON
        file-format: 'JUNITXML' # Or CUCUMBERJSON etc.
        base-directory: 'test-results' # Directory where test reports are generated
    

*   **`frontend-app-build.yml`**:
    yaml
    version: 0.2
    phases:
      install:
        runtime-versions:
          nodejs: 20
        commands:
          - echo Installing dependencies...
          - npm ci
      pre_build:
        commands:
          - echo Running linters...
          - npm run lint
      build:
        commands:
          - echo Running tests...
          - npm run test
          - echo Building application...
          - npm run build # Or next build
      post_build:
        commands:
          - echo Frontend build completed. Artifacts in 'build' or '.next' directory.
    artifacts:
      files:
        - '**/*'
      base-directory: 'build' # Or '.next' for Next.js, or other output dir
    reports:
      TestReportGroupFrontend:
        files:
          - 'junit.xml'
        file-format: 'JUNITXML'
        base-directory: 'test-results'
    

*   **`sast-sonarqube-scan.yml`**:
    yaml
    version: 0.2
    env:
      variables:
        SONAR_SCANNER_VERSION: "5.0.1.3006" # Example, use latest appropriate
        # SONAR_HOST_URL, SONAR_PROJECT_KEY, SONAR_ORGANIZATION will be passed as env vars to CodeBuild
      secrets-manager:
        SONAR_TOKEN: "<SONARQUBE_TOKEN_SECRET_ARN>:sonarToken" # ARN of Secrets Manager secret and JSON key
    phases:
      install:
        commands:
          - echo "Downloading SonarScanner CLI..."
          - apt-get update && apt-get install -y unzip
          - curl -sSLo sonar-scanner.zip "https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux.zip"
          - unzip sonar-scanner.zip
          - export PATH=$PATH:$(pwd)/sonar-scanner-${SONAR_SCANNER_VERSION}-linux/bin
      build:
        commands:
          - echo "Running SonarQube scan..."
          - sonar-scanner \
              -Dsonar.host.url=$SONAR_HOST_URL \
              -Dsonar.login=$SONAR_TOKEN \
              -Dsonar.projectKey=$SONAR_PROJECT_KEY \
              -Dsonar.organization=$SONAR_ORGANIZATION \
              -Dsonar.sources=. \
              -Dsonar.scm.provider=git \
              # Add other SonarQube parameters as needed (e.g., exclusions, coverage reports)
      # Optional: Add post_build to check quality gate if SonarQube API allows easy check
    # No artifacts produced by this stage usually, results are on SonarQube server
    

*   **`dast-zap-scan.yml`**:
    yaml
    version: 0.2
    env:
      variables:
        # DAST_TARGET_URL will be passed as env var to CodeBuild
        ZAP_IMAGE: "owasp/zap2docker-stable" # Or specific version
        REPORT_FILE_NAME: "zap_dast_report.html"
    phases:
      install:
        commands:
          - echo "Pulling OWASP ZAP Docker image..."
          - docker pull $ZAP_IMAGE
      build:
        commands:
          - echo "Starting DAST scan with OWASP ZAP against $DAST_TARGET_URL..."
          # Example: ZAP Baseline Scan
          - docker run --rm -v $(pwd):/zap/wrk/:rw $ZAP_IMAGE zap-baseline.py \
              -t $DAST_TARGET_URL \
              -g gen.conf \
              -r $REPORT_FILE_NAME \
              -w warn.md \
              -J json_report.json \
              -x xml_report.xml || true # Allow to continue even if ZAP finds issues to upload report
          # For more advanced scans, ZAP Automation Framework can be used.
          # Check ZAP exit codes to determine pass/fail:
          #   0: Pass
          #   1: WARN (configurable)
          #   2: FAIL (configurable)
          #   3: ZAP Error
          # Example: exit_code=$(docker inspect zap-container-name --format='{{.State.ExitCode}}')
          # if [ $exit_code -gt 1 ]; then exit 1; fi # Fail build if ZAP exit code indicates failure
      post_build:
        commands:
          - echo "DAST scan completed. Report generated."
    artifacts:
      files:
        - $REPORT_FILE_NAME
        - warn.md
        - json_report.json
        - xml_report.xml
      # base-directory: '.' # If reports are in the root
    

*   **`e2e-tests-run.yml`**:
    yaml
    version: 0.2
    env:
      variables:
        # E2E_TARGET_URL will be passed as env var to CodeBuild
        # CYPRESS_INSTALL_BINARY: 0 # If Cypress binary is cached or pre-installed
    phases:
      install:
        runtime-versions:
          nodejs: 20
        commands:
          - echo Installing E2E test dependencies...
          - npm ci # Or yarn install, assuming E2E tests are part of the service repo
          # If using Cypress, may need to install system dependencies for browsers
          # Example for Cypress: apt-get update && apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
      pre_build:
        commands:
          - echo Starting Xvfb for headless browser tests if needed...
          # Example for Cypress: Xvfb :99 -screen 0 1280x1024x24 > /dev/null 2>&1 &
          # export DISPLAY=:99
      build:
        commands:
          - echo Running E2E tests...
          # Example for Cypress:
          - npm run e2e:run -- --config baseUrl=$E2E_TARGET_URL # Assuming an npm script "e2e:run"
          # Or direct command: npx cypress run --config baseUrl=$E2E_TARGET_URL
      post_build:
        commands:
          - echo E2E tests completed.
    artifacts: # Upload E2E test reports, videos, screenshots
      files:
        - 'cypress/reports/**/*'
        - 'cypress/videos/**/*'
        - 'cypress/screenshots/**/*'
      # base-directory: '.' # Adjust if reports are elsewhere
    reports:
      E2EReportGroup:
        files:
          - 'cypress/reports/junit/**/*.xml' # Example for JUnit reports from Cypress
        file-format: 'JUNITXML'
        base-directory: '.'
    

### 5.2. AppSpecs (`assets/appspecs/*.yml`)

*   **`ecs-service-deploy.yml`**: (To be included in the build artifact of backend services)
    yaml
    version: 0.0
    Resources:
      - TargetService:
          Type: AWS::ECS::Service
          Properties:
            TaskDefinition: "<TASK_DEFINITION_ARN_PLACEHOLDER>" # This will be replaced by CodeDeploy
            LoadBalancerInfo:
              ContainerName: "<YOUR_ECS_CONTAINER_NAME>" # e.g., campaign-service-container
              ContainerPort: <YOUR_ECS_CONTAINER_PORT>   # e.g., 3000
            # Optional: Platform version, NetworkConfiguration for Fargate
    Hooks:
      # - BeforeInstall:
      #     LambdaFunctionName: "MyPreInstallHookLambda"
      #     Timeout: 180
      - AfterInstall: # Download new task definition, update service
          LambdaFunctionName: "MyPostInstallHookLambda" # Example hook for validation
          Timeout: 180
      - AfterAllowTestTraffic: # Run smoke tests or integration tests
          LambdaFunctionName: "MyTestTrafficHookLambda"
          Timeout: 180
      # - BeforeAllowTraffic: # Optional hook before shifting all traffic
      # - AfterAllowTraffic: # Shift all traffic to new version
    # Optional: Deployment lifecycle event hooks for custom actions
    
    *   **Note:** The `<TASK_DEFINITION_ARN_PLACEHOLDER>` is dynamically replaced by AWS CodeDeploy with the ARN of the new task definition version referenced in the `taskdef.json` (which should also be part of the build artifact). The `taskdef.json` itself contains the image URI pointing to the newly built Docker image in ECR.

*   **`s3-cloudfront-deploy.yml` (Conceptual - Implemented in CodeBuild/Lambda)**:
    *   As noted in the file structure, this isn't a direct CodeDeploy AppSpec. The logic is:
        1.  **CodeBuild Stage Action:**
            *   **Input:** Build artifact from the frontend build stage.
            *   **Buildspec Commands:**
                *   `aws s3 sync ./<build_output_folder> s3://<TARGET_S3_BUCKET_NAME>/ --delete --acl public-read` (Adjust ACL as needed, or manage via bucket policy).
                *   If CloudFront is used: `aws cloudfront create-invalidation --distribution-id <CLOUDFRONT_DISTRIBUTION_ID> --paths "/*"`
    *   This can be a dedicated CodeBuild project within a CodePipeline stage.

## 6. Security Considerations

*   **IAM Roles & Permissions:** All CodePipeline, CodeBuild, and CodeDeploy roles will adhere to the principle of least privilege.
    *   CodeBuild projects will have specific IAM roles allowing them to fetch secrets (e.g., SonarQube token), push to ECR, write to S3 (for artifacts), interact with test services, and report test results.
    *   CodeDeploy roles will have permissions to update ECS services, S3 buckets, and interact with load balancers.
*   **Secrets Management:** Sensitive information like SonarQube tokens, GitHub personal access tokens (if not using CodeStar Connections), or other API keys will be stored in AWS Secrets Manager and accessed by CodeBuild projects via IAM permissions.
*   **Network Security:** Build environments for CodeBuild can be configured to run within a VPC for enhanced security if needed (e.g., to access internal resources like a private SonarQube server).
*   **Artifact Security:** Build artifacts stored in S3 will be encrypted.
*   **SAST/DAST Integration:**
    *   **SAST (SonarQube):** Integrated via `SastScanStage` using `sast-sonarqube-scan.yml`.
    *   **DAST (OWASP ZAP):** Integrated via `DastScanStage` using `dast-zap-scan.yml`, targeting deployed staging/test environments.
    *   Pipeline can be configured to fail if critical vulnerabilities are found or quality gates are not met.

## 7. Testing Strategy within Pipelines

*   **Unit & Integration Tests:** Executed in `UnitTestStage` via CodeBuild using service-specific buildspecs (e.g., `backend-service-build.yml`). Test results will be reported.
*   **End-to-End (E2E) Tests:** Executed in `E2eTestStage` via CodeBuild using `e2e-tests-run.yml`, targeting a deployed staging/test environment.
*   Pipelines will fail if any mandatory test stage fails.

## 8. Deployment Strategies

*   **Backend Services (ECS):**
    *   The `DeployStage` construct for ECS will support configurations for Blue/Green deployments or rolling updates via AWS CodeDeploy.
    *   Automated rollbacks on deployment failure will be configured in CodeDeploy.
*   **Frontend Applications (S3/CloudFront):**
    *   Deployment involves syncing new static assets to S3 and invalidating the CloudFront cache. Versioning strategies (e.g., content-hashed filenames) should be used by the frontend build process to ensure cache busting.
    *   Blue/Green for S3/CloudFront can be achieved by deploying to a new S3 prefix and then updating the CloudFront origin, or using CloudFront Functions/Lambda@Edge for routing. The initial implementation will focus on direct sync and invalidation.

## 9. Notifications and Visibility (REQ-POA-005)

*   The `NotificationStage` construct will be used for each pipeline.
*   It will leverage AWS CodeStar Notifications to send pipeline state changes (SUCCEEDED, FAILED, CANCELED, ACTION_EXECUTION_FAILED) to a configured SNS topic.
*   This SNS topic can then be subscribed to by:
    *   Email endpoints.
    *   AWS Chatbot for Slack/Chime notifications.
    *   Lambda functions for custom notification logic.
*   Platform Administrators can view pipeline status directly in the AWS CodePipeline console.

## 10. Scalability and Maintainability

*   **CDK for IaC:** Defining pipelines as code ensures version control, repeatability, and easier updates.
*   **Reusable Constructs:** Standardized stage constructs (`SourceStage`, `BuildStage`, etc.) promote consistency and reduce boilerplate.
*   **Configuration-Driven:** `service-definitions.ts` allows easy onboarding of new services/apps to CI/CD without modifying core pipeline logic.
*   **Independent Pipelines:** Each service/app having its own pipeline allows for independent release cadences and reduces the blast radius of a single pipeline failure.

## 11. Future Considerations

*   **Canary Deployments:** Extend `DeployStage` to support canary deployments for ECS and S3/CloudFront (potentially using Lambda@Edge or CloudFront continuous deployment features).
*   **Infrastructure Pipelines:** Separate CDK stacks/pipelines for managing core infrastructure (VPCs, EKS/ECS clusters, Databases) if not already handled by `REPO-INFRA-001`.
*   **Dynamic Environment Provisioning:** For feature branch testing, dynamically spin up and tear down environments.
*   **Cost Optimization for Builds:** Investigate CodeBuild reserved capacity or compute type optimization.
*   **Advanced Quality Gates:** More sophisticated quality gate checks post-SAST/DAST scans.