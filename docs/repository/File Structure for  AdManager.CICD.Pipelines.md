# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project metadata, dependencies (AWS CDK, TypeScript, etc.), and scripts for the CI/CD pipeline CDK application.  
**Template:** Node.js PackageManifest  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** package.json  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - CDK Project Setup
    - Dependency Management
    
**Requirement Ids:**
    
    - 5.2
    
**Purpose:** Manages Node.js project dependencies and scripts for building and deploying the CDK application defining the CI/CD pipelines.  
**Logic Description:** Contains dependencies for aws-cdk-lib, constructs, typescript, and scripts for 'cdk deploy', 'cdk synth', 'build', 'watch'.  
**Documentation:**
    
    - **Summary:** Standard package.json file for a TypeScript AWS CDK project.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** tsconfig.json  
**Description:** TypeScript compiler options for the AWS CDK application.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** tsconfig.json  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript Compilation Configuration
    
**Requirement Ids:**
    
    - 5.2
    
**Purpose:** Configures the TypeScript compiler (tsc) for the CDK project, specifying target ECMAScript version, modules, and other compiler flags.  
**Logic Description:** Defines compiler options like 'target', 'module', 'strict', 'esModuleInterop', 'outDir', 'rootDir'.  
**Documentation:**
    
    - **Summary:** Standard tsconfig.json for compiling TypeScript code in the AWS CDK project.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** cdk.json  
**Description:** AWS CDK toolkit configuration file, specifying the entry point for the CDK application.  
**Template:** AWS CDK Configuration  
**Dependancy Level:** 0  
**Name:** cdk  
**Type:** Configuration  
**Relative Path:** cdk.json  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - CDK Application Configuration
    
**Requirement Ids:**
    
    - 5.2
    
**Purpose:** Instructs the AWS CDK CLI on how to execute the application, typically pointing to the main application entry point script.  
**Logic Description:** Contains settings like 'app' (e.g., 'npx ts-node --prefer-ts-exts app.ts'), context variables, and feature flags for CDK.  
**Documentation:**
    
    - **Summary:** Configuration file for the AWS CDK toolkit.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** app.ts  
**Description:** The main entry point for the AWS CDK application. Initializes and synthesizes CDK stacks defining the CI/CD pipelines.  
**Template:** AWS CDK App EntryPoint  
**Dependancy Level:** 3  
**Name:** app  
**Type:** Application  
**Relative Path:** app.ts  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - CDK Application Initialization
    - Pipeline Stack Instantiation
    
**Requirement Ids:**
    
    - 5.2
    
**Purpose:** Initializes the CDK App and instantiates the main pipeline stack(s) for various environments (dev, staging, prod).  
**Logic Description:** Imports necessary CDK libraries and the main pipeline stack definition. Creates instances of the App and the pipeline stack, passing environment configurations.  
**Documentation:**
    
    - **Summary:** Entry point for the AdManager CI/CD CDK application.
    
**Namespace:** AdManager.CICD  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** cicd/pipelines/main-pipeline-stack.ts  
**Description:** Defines the main AWS CDK Stack that orchestrates the creation of CodePipelines for backend services and frontend applications.  
**Template:** AWS CDK Stack  
**Dependancy Level:** 2  
**Name:** MainPipelineStack  
**Type:** Stack  
**Relative Path:** cicd/pipelines/main-pipeline-stack.ts  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    - CDK
    
**Members:**
    
    - **Name:** scope  
**Type:** Construct  
**Attributes:** private|readonly  
    - **Name:** id  
**Type:** string  
**Attributes:** private|readonly  
    - **Name:** props  
**Type:** StackProps  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props?: StackProps
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** createBackendServicePipeline  
**Parameters:**
    
    - serviceName: string
    - serviceConfig: BackendServiceConfig
    
**Return Type:** codepipeline.Pipeline  
**Attributes:** private  
    - **Name:** createFrontendAppPipeline  
**Parameters:**
    
    - appName: string
    - appConfig: FrontendAppConfig
    
**Return Type:** codepipeline.Pipeline  
**Attributes:** private  
    
**Implemented Features:**
    
    - CI/CD Pipeline Orchestration (CodePipeline)
    - Multi-Service Pipeline Definition
    - Environment-specific Pipeline Configuration
    - Pipeline Status Visibility Configuration
    
**Requirement Ids:**
    
    - REQ-POA-005
    - 5.2
    
**Purpose:** Defines and provisions all CI/CD pipelines for the AdManager platform using AWS CDK.  
**Logic Description:** Iterates over service definitions from configuration. For each service/app, instantiates a CodePipeline using shared stage constructs (Source, Build, Test, Scan, Deploy, Approval, Notifications). Configures environment-specific parameters.  
**Documentation:**
    
    - **Summary:** Central CDK stack for defining AdManager CI/CD pipelines.
    
**Namespace:** AdManager.CICD.Stacks  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** cicd/pipelines/config/pipeline-environments.ts  
**Description:** Contains environment-specific configurations for the CI/CD pipelines (e.g., AWS account IDs, regions, deployment targets for dev, staging, prod).  
**Template:** TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** pipeline-environments  
**Type:** Configuration  
**Relative Path:** cicd/pipelines/config/pipeline-environments.ts  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** devEnvironment  
**Type:** PipelineEnvironmentConfig  
**Attributes:** public|static|readonly  
    - **Name:** stagingEnvironment  
**Type:** PipelineEnvironmentConfig  
**Attributes:** public|static|readonly  
    - **Name:** prodEnvironment  
**Type:** PipelineEnvironmentConfig  
**Attributes:** public|static|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Environment Configuration Management
    
**Requirement Ids:**
    
    - 5.2
    
**Purpose:** Provides strongly-typed configuration objects for different deployment environments.  
**Logic Description:** Exports constants or classes representing configurations for development, staging, and production environments. Includes details like AWS account, region, VPC settings, ECR repository names, S3 bucket names, etc.  
**Documentation:**
    
    - **Summary:** Configuration settings for various pipeline deployment environments.
    
**Namespace:** AdManager.CICD.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** cicd/pipelines/config/service-definitions.ts  
**Description:** Defines metadata for each backend service and frontend application that requires a CI/CD pipeline (e.g., repository source, build commands, deployment type).  
**Template:** TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** service-definitions  
**Type:** Configuration  
**Relative Path:** cicd/pipelines/config/service-definitions.ts  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** backendServices  
**Type:** BackendServiceConfig[]  
**Attributes:** public|static|readonly  
    - **Name:** frontendApps  
**Type:** FrontendAppConfig[]  
**Attributes:** public|static|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Microservice/App Pipeline Configuration
    
**Requirement Ids:**
    
    - 5.2
    
**Purpose:** Provides a centralized list and configuration details for all microservices and frontend applications to be managed by CI/CD.  
**Logic Description:** Exports arrays of configuration objects. Each object details a service/app: name, source repository URL/branch, buildspec path, appspec path, deployment target type (ECS, S3/CloudFront, Lambda), etc.  
**Documentation:**
    
    - **Summary:** Definitions and configurations for services and applications requiring CI/CD pipelines.
    
**Namespace:** AdManager.CICD.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** cicd/pipelines/interfaces/pipeline-props.ts  
**Description:** Defines TypeScript interfaces for properties passed to pipeline stacks and constructs.  
**Template:** TypeScript Interface  
**Dependancy Level:** 0  
**Name:** pipeline-props  
**Type:** Interface  
**Relative Path:** cicd/pipelines/interfaces/pipeline-props.ts  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** environmentName  
**Type:** string  
**Attributes:** readonly  
    - **Name:** awsAccountId  
**Type:** string  
**Attributes:** readonly  
    - **Name:** awsRegion  
**Type:** string  
**Attributes:** readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - CDK Prop Typing
    
**Requirement Ids:**
    
    - 5.2
    
**Purpose:** Provides type safety and clear contracts for CDK constructs and stacks.  
**Logic Description:** Exports interfaces like `PipelineStageProps`, `ServicePipelineProps` extending base CDK `StackProps` or `ConstructProps` with application-specific parameters.  
**Documentation:**
    
    - **Summary:** TypeScript interfaces for CI/CD pipeline configurations.
    
**Namespace:** AdManager.CICD.Interfaces  
**Metadata:**
    
    - **Category:** Typing
    
- **Path:** cicd/pipelines/constructs/source-stage.ts  
**Description:** AWS CDK Construct defining the source stage for a CodePipeline, typically integrating with AWS CodeCommit, GitHub, or S3.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 1  
**Name:** SourceStage  
**Type:** Construct  
**Relative Path:** cicd/pipelines/constructs/source-stage.ts  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    - CDK
    
**Members:**
    
    - **Name:** sourceOutput  
**Type:** codepipeline.Artifact  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: SourceStageProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Pipeline Source Stage Definition (CodeCommit/GitHub/S3)
    
**Requirement Ids:**
    
    - 5.2
    
**Purpose:** Creates a standardized source stage for CI/CD pipelines.  
**Logic Description:** Initializes a CodePipeline source action based on provided properties (e.g., repository name, branch, connection ARN for GitHub). Outputs the source artifact.  
**Documentation:**
    
    - **Summary:** CDK construct for the source acquisition stage of a pipeline.
    
**Namespace:** AdManager.CICD.Constructs  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** cicd/pipelines/constructs/build-stage.ts  
**Description:** AWS CDK Construct defining the build stage using AWS CodeBuild. Takes a buildspec file path and input artifacts.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 1  
**Name:** BuildStage  
**Type:** Construct  
**Relative Path:** cicd/pipelines/constructs/build-stage.ts  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    - CDK
    
**Members:**
    
    - **Name:** buildOutput  
**Type:** codepipeline.Artifact  
**Attributes:** public|readonly  
    - **Name:** codeBuildProject  
**Type:** codebuild.PipelineProject  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: BuildStageProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Pipeline Build Stage Definition (CodeBuild)
    - Buildspec Integration
    
**Requirement Ids:**
    
    - 5.2
    
**Purpose:** Creates a standardized build stage for CI/CD pipelines.  
**Logic Description:** Initializes a CodeBuild project with specified build environment, buildspec, source artifacts, and IAM permissions. Outputs the build artifact.  
**Documentation:**
    
    - **Summary:** CDK construct for the build stage using AWS CodeBuild.
    
**Namespace:** AdManager.CICD.Constructs  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** cicd/pipelines/constructs/unit-test-stage.ts  
**Description:** AWS CDK Construct defining a stage for running unit and integration tests using AWS CodeBuild.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 1  
**Name:** UnitTestStage  
**Type:** Construct  
**Relative Path:** cicd/pipelines/constructs/unit-test-stage.ts  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    - CDK
    
**Members:**
    
    - **Name:** codeBuildProject  
**Type:** codebuild.PipelineProject  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: TestStageProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Automated Unit Testing Integration
    - Automated Integration Testing Integration
    
**Requirement Ids:**
    
    - 5.8
    - 5.2
    
**Purpose:** Creates a standardized stage for running unit and integration tests within a CI/CD pipeline.  
**Logic Description:** Initializes a CodeBuild project configured to run test commands defined in a buildspec (often the same buildspec as the build stage, but can be separate). Reports test results.  
**Documentation:**
    
    - **Summary:** CDK construct for executing unit and integration tests.
    
**Namespace:** AdManager.CICD.Constructs  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** cicd/pipelines/constructs/sast-scan-stage.ts  
**Description:** AWS CDK Construct for integrating SAST (Static Application Security Testing) tools like SonarQube into the pipeline via CodeBuild.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 1  
**Name:** SastScanStage  
**Type:** Construct  
**Relative Path:** cicd/pipelines/constructs/sast-scan-stage.ts  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    - CDK
    
**Members:**
    
    - **Name:** codeBuildProject  
**Type:** codebuild.PipelineProject  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: SecurityScanStageProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - SAST Scan Integration (SonarQube)
    
**Requirement Ids:**
    
    - 3.2.4 (SAST/DAST scans)
    - 5.2
    
**Purpose:** Creates a pipeline stage to perform static application security testing.  
**Logic Description:** Configures a CodeBuild project to execute SAST tools (e.g., SonarScanner). Uses a specific buildspec for SAST. May include quality gate checks.  
**Documentation:**
    
    - **Summary:** CDK construct for SAST scanning stage.
    
**Namespace:** AdManager.CICD.Constructs  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** cicd/pipelines/constructs/dast-scan-stage.ts  
**Description:** AWS CDK Construct for integrating DAST (Dynamic Application Security Testing) tools like OWASP ZAP into the pipeline, typically run against a deployed test environment.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 1  
**Name:** DastScanStage  
**Type:** Construct  
**Relative Path:** cicd/pipelines/constructs/dast-scan-stage.ts  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    - CDK
    
**Members:**
    
    - **Name:** codeBuildProject  
**Type:** codebuild.PipelineProject  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: SecurityScanStageProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - DAST Scan Integration (OWASP ZAP)
    
**Requirement Ids:**
    
    - 3.2.4 (SAST/DAST scans)
    - 5.2
    
**Purpose:** Creates a pipeline stage to perform dynamic application security testing.  
**Logic Description:** Configures a CodeBuild project to execute DAST tools against a specified endpoint. Uses a specific buildspec for DAST. This stage typically runs after a deployment to a test/staging environment.  
**Documentation:**
    
    - **Summary:** CDK construct for DAST scanning stage.
    
**Namespace:** AdManager.CICD.Constructs  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** cicd/pipelines/constructs/e2e-test-stage.ts  
**Description:** AWS CDK Construct for executing End-to-End (E2E) tests, often using CodeBuild and targeting a deployed test environment.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 1  
**Name:** E2eTestStage  
**Type:** Construct  
**Relative Path:** cicd/pipelines/constructs/e2e-test-stage.ts  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    - CDK
    
**Members:**
    
    - **Name:** codeBuildProject  
**Type:** codebuild.PipelineProject  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: TestStageProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Automated E2E Testing Integration
    
**Requirement Ids:**
    
    - 5.8
    - 5.2
    
**Purpose:** Creates a pipeline stage for running end-to-end tests.  
**Logic Description:** Configures a CodeBuild project to run E2E test suites (e.g., Cypress, Selenium, Playwright) against a deployed application environment. Uses a specific buildspec for E2E tests.  
**Documentation:**
    
    - **Summary:** CDK construct for End-to-End testing stage.
    
**Namespace:** AdManager.CICD.Constructs  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** cicd/pipelines/constructs/deploy-stage.ts  
**Description:** AWS CDK Construct defining the deployment stage using AWS CodeDeploy (or other deployment services like S3 sync for frontend). Takes an appspec file path and input artifacts.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 1  
**Name:** DeployStage  
**Type:** Construct  
**Relative Path:** cicd/pipelines/constructs/deploy-stage.ts  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    - CDK
    
**Members:**
    
    - **Name:** deploymentGroup  
**Type:** codedeploy.IDeploymentGroup  
**Attributes:** public|readonly|optional  
    - **Name:** s3DeploymentBucket  
**Type:** s3.IBucket  
**Attributes:** public|readonly|optional  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: DeployStageProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Pipeline Deployment Stage Definition (CodeDeploy/S3)
    - Appspec Integration
    - Automated Rollback Configuration
    
**Requirement Ids:**
    
    - REQ-POA-005
    - 5.2
    
**Purpose:** Creates a standardized deployment stage for CI/CD pipelines.  
**Logic Description:** Initializes a CodeDeploy deployment group or S3 deployment actions based on the application type. Configures deployment strategies (e.g., blue/green, canary if applicable) and automated rollback settings. Uses appspec for CodeDeploy.  
**Documentation:**
    
    - **Summary:** CDK construct for the deployment stage using AWS CodeDeploy or S3 sync.
    
**Namespace:** AdManager.CICD.Constructs  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** cicd/pipelines/constructs/approval-stage.ts  
**Description:** AWS CDK Construct for adding a manual approval stage in CodePipeline.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 1  
**Name:** ApprovalStage  
**Type:** Construct  
**Relative Path:** cicd/pipelines/constructs/approval-stage.ts  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    - CDK
    
**Members:**
    
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: ApprovalStageProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Manual Approval Gate
    
**Requirement Ids:**
    
    - REQ-POA-005
    - 5.2
    
**Purpose:** Creates a manual approval action within a CodePipeline stage.  
**Logic Description:** Adds a manual approval action, optionally configuring SNS notifications to approvers. This allows for controlled promotion to subsequent stages (e.g., production deployment).  
**Documentation:**
    
    - **Summary:** CDK construct for a manual approval stage in CodePipeline.
    
**Namespace:** AdManager.CICD.Constructs  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** cicd/pipelines/constructs/notification-stage.ts  
**Description:** AWS CDK Construct for configuring pipeline notifications (e.g., on success, failure) using AWS SNS and Chatbot.  
**Template:** AWS CDK Construct  
**Dependancy Level:** 1  
**Name:** NotificationStage  
**Type:** Construct  
**Relative Path:** cicd/pipelines/constructs/notification-stage.ts  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    - CDK
    
**Members:**
    
    - **Name:** notificationRule  
**Type:** codestarnotifications.NotificationRule  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - scope: Construct
    - id: string
    - props: NotificationStageProps
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Pipeline Event Notifications (Success/Failure)
    
**Requirement Ids:**
    
    - REQ-POA-005
    - 5.2
    
**Purpose:** Sets up notifications for pipeline events to alert relevant teams.  
**Logic Description:** Creates an SNS topic and a CodeStar Notifications rule that sends messages to this topic (or directly to Chatbot/Slack/Email) upon specified pipeline events (e.g., SUCCEEDED, FAILED).  
**Documentation:**
    
    - **Summary:** CDK construct for configuring pipeline notifications.
    
**Namespace:** AdManager.CICD.Constructs  
**Metadata:**
    
    - **Category:** InfrastructureDefinition
    
- **Path:** assets/buildspecs/backend-service-build.yml  
**Description:** Default AWS CodeBuild buildspec YAML for building NestJS backend services. Includes compilation, dependency installation, unit tests, integration tests, and artifact packaging.  
**Template:** CodeBuild Buildspec YAML  
**Dependancy Level:** 0  
**Name:** backend-service-build  
**Type:** Buildspec  
**Relative Path:** assets/buildspecs/backend-service-build.yml  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Backend Service Compilation
    - Dependency Installation (npm/yarn)
    - Unit Testing Execution (Jest)
    - Integration Testing Execution (Jest)
    - Build Artifact Packaging
    
**Requirement Ids:**
    
    - 5.2
    - 5.8
    
**Purpose:** Defines build and test commands for backend NestJS microservices within CodeBuild.  
**Logic Description:** Phases: install (runtime versions, dependencies), pre_build (linting, env setup), build (compile TypeScript, run unit/integration tests), post_build (package artifacts, e.g., zip). Reports test results.  
**Documentation:**
    
    - **Summary:** Build specification for NestJS backend services.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** BuildConfiguration
    
- **Path:** assets/buildspecs/frontend-app-build.yml  
**Description:** Default AWS CodeBuild buildspec YAML for building React/Next.js frontend applications. Includes compilation, dependency installation, unit tests, and static asset packaging.  
**Template:** CodeBuild Buildspec YAML  
**Dependancy Level:** 0  
**Name:** frontend-app-build  
**Type:** Buildspec  
**Relative Path:** assets/buildspecs/frontend-app-build.yml  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Frontend Application Compilation (React/Next.js)
    - Dependency Installation (npm/yarn)
    - Unit Testing Execution (Jest/RTL)
    - Static Asset Packaging
    
**Requirement Ids:**
    
    - 5.2
    - 5.8
    
**Purpose:** Defines build and test commands for frontend React/Next.js applications within CodeBuild.  
**Logic Description:** Phases: install (Node.js version, dependencies), pre_build (linting), build (run build script e.g., 'npm run build', run unit tests), post_build (package build output e.g., 'build' or '.next' folder).  
**Documentation:**
    
    - **Summary:** Build specification for React/Next.js frontend applications.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** BuildConfiguration
    
- **Path:** assets/buildspecs/sast-sonarqube-scan.yml  
**Description:** AWS CodeBuild buildspec YAML for performing SAST scans using SonarQube (SonarScanner).  
**Template:** CodeBuild Buildspec YAML  
**Dependancy Level:** 0  
**Name:** sast-sonarqube-scan  
**Type:** Buildspec  
**Relative Path:** assets/buildspecs/sast-sonarqube-scan.yml  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - SAST Scan Execution (SonarQube)
    - Security Report Upload (to SonarQube server)
    - Optional Quality Gate Check
    
**Requirement Ids:**
    
    - 3.2.4 (SAST/DAST scans)
    - 5.2
    
**Purpose:** Defines commands to execute SonarScanner for static code analysis and report to SonarQube server.  
**Logic Description:** Phases: install (download SonarScanner), pre_build (configure SonarQube server URL, project key, token), build (run SonarScanner command), post_build (optionally check quality gate status). Requires SonarQube server details passed as environment variables.  
**Documentation:**
    
    - **Summary:** Build specification for SAST scanning with SonarQube.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** SecurityConfiguration
    
- **Path:** assets/buildspecs/dast-zap-scan.yml  
**Description:** AWS CodeBuild buildspec YAML for performing DAST scans using OWASP ZAP against a deployed application endpoint.  
**Template:** CodeBuild Buildspec YAML  
**Dependancy Level:** 0  
**Name:** dast-zap-scan  
**Type:** Buildspec  
**Relative Path:** assets/buildspecs/dast-zap-scan.yml  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - DAST Scan Execution (OWASP ZAP)
    - Security Report Generation/Upload
    
**Requirement Ids:**
    
    - 3.2.4 (SAST/DAST scans)
    - 5.2
    
**Purpose:** Defines commands to execute OWASP ZAP for dynamic security scanning against a target application URL.  
**Logic Description:** Phases: install (install ZAP or use Docker image), pre_build (configure target URL, ZAP options), build (run ZAP scan e.g., baseline scan or full scan), post_build (generate/upload ZAP report). Requires target application URL passed as environment variable.  
**Documentation:**
    
    - **Summary:** Build specification for DAST scanning with OWASP ZAP.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** SecurityConfiguration
    
- **Path:** assets/buildspecs/e2e-tests-run.yml  
**Description:** AWS CodeBuild buildspec YAML for executing End-to-End (E2E) test suites (e.g., Cypress, Playwright, Selenium).  
**Template:** CodeBuild Buildspec YAML  
**Dependancy Level:** 0  
**Name:** e2e-tests-run  
**Type:** Buildspec  
**Relative Path:** assets/buildspecs/e2e-tests-run.yml  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - E2E Test Suite Execution
    - Test Report Generation/Upload
    
**Requirement Ids:**
    
    - 5.8
    - 5.2
    
**Purpose:** Defines commands to run E2E tests against a deployed application environment.  
**Logic Description:** Phases: install (install test framework dependencies, browser drivers if needed), pre_build (configure target application URL, test environment setup), build (execute E2E test runner command), post_build (upload test reports and artifacts). Requires target application URL.  
**Documentation:**
    
    - **Summary:** Build specification for running End-to-End tests.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** TestConfiguration
    
- **Path:** assets/appspecs/ecs-service-deploy.yml  
**Description:** Default AWS CodeDeploy AppSpec YAML for deploying applications to Amazon ECS.  
**Template:** CodeDeploy AppSpec YAML  
**Dependancy Level:** 0  
**Name:** ecs-service-deploy  
**Type:** Appspec  
**Relative Path:** assets/appspecs/ecs-service-deploy.yml  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - ECS Deployment Configuration
    - Task Definition Update
    - Load Balancer Integration Hooks
    - Deployment Lifecycle Hooks
    
**Requirement Ids:**
    
    - REQ-POA-005
    - 5.2
    
**Purpose:** Defines deployment instructions for CodeDeploy to update an ECS service.  
**Logic Description:** Specifies version, resources (ECS task definition, container name, port), and hooks (BeforeInstall, AfterInstall, AfterAllowTestTraffic, BeforeAllowTraffic, AfterAllowTraffic) for managing the deployment lifecycle on ECS. This file is typically part of the build artifact.  
**Documentation:**
    
    - **Summary:** AppSpec file for deploying applications to Amazon ECS via CodeDeploy.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** DeploymentConfiguration
    
- **Path:** assets/appspecs/s3-cloudfront-deploy.yml  
**Description:** Conceptual AppSpec-like YAML (or script logic in buildspec) for deploying static frontend applications to S3 and invalidating CloudFront cache. Note: CodeDeploy doesn't directly use appspec for S3 in the same way as EC2/ECS; this might be handled by buildspec commands or custom Lambda in CodePipeline.  
**Template:** Deployment Script Logic (Conceptual)  
**Dependancy Level:** 0  
**Name:** s3-cloudfront-deploy  
**Type:** Appspec  
**Relative Path:** assets/appspecs/s3-cloudfront-deploy.yml  
**Repository Id:** REPO-CICD-003  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - S3 Static Site Deployment
    - CloudFront Cache Invalidation
    
**Requirement Ids:**
    
    - REQ-POA-005
    - 5.2
    
**Purpose:** Defines steps to deploy static frontend assets to S3 and update CloudFront.  
**Logic Description:** This isn't a standard CodeDeploy appspec. Logic would be: 1. Sync build artifacts to target S3 bucket ('aws s3 sync'). 2. Create CloudFront invalidation for changed paths ('aws cloudfront create-invalidation'). These commands are typically in the post_build phase of a CodeBuild buildspec or a separate CodePipeline action using Lambda.  
**Documentation:**
    
    - **Summary:** Conceptual deployment steps for S3/CloudFront, usually embedded in buildspec or Lambda.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** DeploymentConfiguration
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableDastScansForDev
  - requireManualApprovalForProd
  - enableCanaryDeploymentsForFrontend
  
- **Database Configs:**
  
  


---

