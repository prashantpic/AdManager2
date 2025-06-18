# Specification

# 1. Ci Cd Pipeline Analysis

- **System Overview:**
  
  - **Analysis Date:** 2024-07-15
  - **Technology Stack:**
    
    - NestJS (TypeScript, Node.js) for Backend
    - React (TypeScript) for Frontend
    - Vite for Frontend CSR Dashboard build
    - Next.js/Remix for Frontend SSR/SSG Pages build
    - Docker for containerization
    - AWS ECR for Docker image registry
    - AWS S3 for static frontend asset storage
    - AWS CloudFront for CDN
    - AWS ECS/EKS (Fargate recommended) for container orchestration
    - AWS CodePipeline, CodeBuild, CodeDeploy for CI/CD automation
    - PostgreSQL (Amazon RDS) for relational database
    - Jest for unit testing
    - Supertest for backend integration testing
    - Cypress/Playwright for E2E testing
    - SonarQube for SAST
    - OWASP ZAP for DAST
    - AWS Secrets Manager, Systems Manager Parameter Store for configuration
    
  - **Srs Reference:** SRS Document ID 21 (Ad Manager Platform)
  - **Key Ci Cd Requirements:**
    
    - Automated build, test, and deployment (SRS 5.2)
    - Unit, integration, E2E testing with high coverage (SRS 3.2.7, 5.8)
    - Static code analysis (SonarQube) (SRS 3.2.4)
    - Dependency vulnerability scanning (SRS 3.2.4)
    - Container image scanning (SRS 3.2.4, 4.4.1)
    - Dynamic application security testing (OWASP ZAP) (SRS 3.2.4)
    - Deployment strategies: Blue/Green or Canary for Production (SRS 5.2)
    - Automated rollbacks for failed deployments (SRS 5.2)
    - Infrastructure as Code (IaC) managed separately but influences deployment targets (SRS 4.4.3)
    - Multiple environments: Test/QA, Staging, Production (SRS 5.8)
    - Quality gates based on test results and security scans (SRS 5.8)
    - Manual approvals for promotion to Staging and Production (implied by UAT and phased rollout)
    - Database migrations management (TypeORM migrations) (SRS 3.2.7)
    
  
- **Essential Pipelines:**
  
  - **Pipeline Id:** BE_SVC_001  
**Pipeline Name:** Backend Service CI/CD Pipeline (NestJS)  
**Description:** Handles CI/CD for NestJS backend services, deployed as Docker containers to AWS ECS/Fargate.  
**Trigger:**
    
    - **Type:** CodeCommit
    - **Branch Pattern:** main, release/*, feature/*
    
**Stages:**
    
    - **Stage Name:** Source & Initial Checks  
**Steps:**
    
    - **Step Name:** Checkout Source Code  
**Tool:** AWS CodePipeline (Source Action)  
**Details:** Fetches latest code from specified branch.  
    - **Step Name:** Lint Code  
**Tool:** ESLint  
**Details:** Enforces coding standards (SRS 3.2.7).  
    
    - **Stage Name:** Build & Unit Test  
**Steps:**
    
    - **Step Name:** Install Dependencies  
**Tool:** npm  
**Details:** Installs project dependencies.  
    - **Step Name:** Compile TypeScript  
**Tool:** NestJS CLI (tsc)  
**Details:** Transpiles TypeScript to JavaScript.  
    - **Step Name:** Run Unit Tests  
**Tool:** Jest  
**Details:** Executes unit tests. Generates coverage report (SRS 3.2.7, 5.8).  
    - **Step Name:** Static Code Analysis (SAST)  
**Tool:** SonarQube  
**Details:** Scans code for quality and security vulnerabilities (SRS 3.2.4).  
    - **Step Name:** Dependency Vulnerability Scan  
**Tool:** npm audit / Snyk / Trivy  
**Details:** Checks for known vulnerabilities in dependencies (SRS 3.2.4).  
    - **Step Name:** Build Docker Image  
**Tool:** Docker  
**Details:** Builds a Docker image for the service (SRS 4.4.1).  
    - **Step Name:** Scan Docker Image  
**Tool:** AWS ECR Scanning / Trivy  
**Details:** Scans Docker image for vulnerabilities (SRS 4.4.1).  
    - **Step Name:** Push Docker Image to ECR  
**Tool:** Docker CLI / AWS CLI  
**Details:** Pushes versioned image to Amazon ECR.  
    
**Quality Gates:**
    
    - **Gate Name:** Unit Test Pass Rate  
**Criteria:** 100% pass rate.  
    - **Gate Name:** Code Coverage  
**Criteria:** >= 80% (configurable threshold).  
    - **Gate Name:** SAST Scan Results  
**Criteria:** No new critical/high severity vulnerabilities.  
    - **Gate Name:** Dependency Scan Results  
**Criteria:** No new critical/high severity vulnerabilities.  
    - **Gate Name:** Image Scan Results  
**Criteria:** No new critical/high severity vulnerabilities.  
    
    - **Stage Name:** Deploy to Test/QA Environment  
**Steps:**
    
    - **Step Name:** Fetch Configurations  
**Tool:** AWS Systems Manager Parameter Store / Secrets Manager  
**Details:** Retrieves environment-specific configurations (SRS 4.4.2).  
    - **Step Name:** Deploy to ECS/Fargate (Test/QA)  
**Tool:** AWS CodeDeploy / CDK Custom Script  
**Details:** Deploys the Docker image to the Test/QA environment (rolling update).  
    - **Step Name:** Run Database Migrations  
**Tool:** TypeORM CLI (or custom script)  
**Details:** Applies database schema changes (SRS 3.2.7).  
    - **Step Name:** Run Backend Integration Tests  
**Tool:** Supertest / Jest  
**Details:** Executes integration tests against the deployed service and test database (SRS 3.2.7).  
    - **Step Name:** Run E2E Tests (API Focused)  
**Tool:** Cypress/Playwright (API testing mode) or Postman/Newman  
**Details:** Executes E2E tests focusing on API contracts and core flows (SRS 3.2.7).  
    - **Step Name:** Dynamic Application Security Testing (DAST)  
**Tool:** OWASP ZAP  
**Details:** Performs DAST on the deployed application in Test/QA (SRS 3.2.4).  
    
**Quality Gates:**
    
    - **Gate Name:** Integration Test Pass Rate  
**Criteria:** 100% pass rate.  
    - **Gate Name:** E2E Test Pass Rate  
**Criteria:** 100% pass rate for critical flows.  
    - **Gate Name:** DAST Scan Results  
**Criteria:** No new critical/high severity vulnerabilities.  
    
    - **Stage Name:** Approval for Staging  
**Steps:**
    
    - **Step Name:** Manual Approval  
**Tool:** AWS CodePipeline (Manual Approval Action)  
**Details:** Requires manual approval from QA Lead or Product Owner to proceed to Staging.  
    
    - **Stage Name:** Deploy to Staging Environment  
**Steps:**
    
    - **Step Name:** Fetch Configurations  
**Tool:** AWS Systems Manager Parameter Store / Secrets Manager  
**Details:** Retrieves Staging environment-specific configurations.  
    - **Step Name:** Deploy to ECS/Fargate (Staging)  
**Tool:** AWS CodeDeploy / CDK Custom Script  
**Details:** Deploys the Docker image to the Staging environment (rolling update).  
    - **Step Name:** Run Database Migrations  
**Tool:** TypeORM CLI (or custom script)  
**Details:** Applies database schema changes.  
    - **Step Name:** Run Smoke Tests (E2E)  
**Tool:** Cypress/Playwright  
**Details:** Executes a subset of E2E tests to verify critical functionality.  
    - **Step Name:** User Acceptance Testing (UAT)  
**Tool:** Manual / Test Management Tool  
**Details:** UAT is performed on the Staging environment by stakeholders (SRS 7.6).  
    
**Quality Gates:**
    
    - **Gate Name:** Smoke Test Pass Rate  
**Criteria:** 100% pass rate.  
    - **Gate Name:** UAT Sign-off  
**Criteria:** Formal sign-off based on UAT results (SRS 7.6.4).  
    
    - **Stage Name:** Approval for Production  
**Steps:**
    
    - **Step Name:** Manual Approval  
**Tool:** AWS CodePipeline (Manual Approval Action)  
**Details:** Requires manual approval from Product Owner / Release Manager to proceed to Production.  
    
    - **Stage Name:** Deploy to Production Environment  
**Steps:**
    
    - **Step Name:** Fetch Configurations  
**Tool:** AWS Systems Manager Parameter Store / Secrets Manager  
**Details:** Retrieves Production environment-specific configurations.  
    - **Step Name:** Deploy to ECS/Fargate (Production)  
**Tool:** AWS CodeDeploy (Blue/Green or Canary)  
**Details:** Deploys the Docker image to Production using a safe deployment strategy (SRS 5.2).  
    - **Step Name:** Run Database Migrations  
**Tool:** TypeORM CLI (or custom script)  
**Details:** Applies database schema changes carefully.  
    - **Step Name:** Run Smoke Tests (E2E)  
**Tool:** Cypress/Playwright  
**Details:** Executes critical E2E smoke tests post-deployment.  
    - **Step Name:** Monitor Post-Deployment  
**Tool:** Amazon CloudWatch Alarms  
**Details:** Monitors key application and system metrics for anomalies. Trigger automated rollback if critical alarms are hit (SRS 5.2).  
    
**Quality Gates:**
    
    - **Gate Name:** Production Smoke Test Pass Rate  
**Criteria:** 100% pass rate.  
    - **Gate Name:** No Critical Alarms Post-Deployment  
**Criteria:** Monitoring period (e.g., 15-30 mins) without critical issues.  
    
    
**Rollback Strategy:**
    
    - **Method:** Automated Re-deploy Previous Stable Version
    - **Triggers:**
      
      - Failed deployment stage
      - Critical CloudWatch alarms post-deployment
      
    - **Database Rollback:** Manual review for complex migrations; TypeORM down scripts for simple ones. Restore from backup for critical failures.
    
**Artifact Management:**
    
    - **Repository:** Amazon ECR
    - **Versioning:** Semantic Versioning + Git Commit SHA for Docker image tags
    - **Retention:** Keep last 10 images per service, delete images older than 90 days unless tagged as 'release'.
    
  - **Pipeline Id:** FE_CSR_001  
**Pipeline Name:** Frontend CSR Dashboard CI/CD Pipeline (React/Vite)  
**Description:** Handles CI/CD for the React CSR dashboard, built with Vite and deployed as static assets to AWS S3/CloudFront.  
**Trigger:**
    
    - **Type:** CodeCommit
    - **Branch Pattern:** main, release/*, feature/* (for dashboard repository)
    
**Stages:**
    
    - **Stage Name:** Source & Initial Checks  
**Steps:**
    
    - **Step Name:** Checkout Source Code  
**Tool:** AWS CodePipeline (Source Action)  
**Details:** Fetches latest code from specified branch.  
    - **Step Name:** Lint Code  
**Tool:** ESLint  
**Details:** Enforces coding standards (SRS 3.2.7).  
    
    - **Stage Name:** Build & Unit Test  
**Steps:**
    
    - **Step Name:** Install Dependencies  
**Tool:** npm / yarn  
**Details:** Installs project dependencies.  
    - **Step Name:** Run Unit Tests  
**Tool:** Jest / React Testing Library  
**Details:** Executes unit tests. Generates coverage report (SRS 3.2.7, 5.8).  
    - **Step Name:** Static Code Analysis (SAST)  
**Tool:** SonarQube  
**Details:** Scans code for quality and security vulnerabilities (SRS 3.2.4).  
    - **Step Name:** Dependency Vulnerability Scan  
**Tool:** npm audit / Snyk  
**Details:** Checks for known vulnerabilities in dependencies (SRS 3.2.4).  
    - **Step Name:** Build Static Assets  
**Tool:** Vite  
**Details:** Builds optimized static assets (JS, CSS, HTML) (SRS 3.3.1).  
    - **Step Name:** Archive Build Artifacts  
**Tool:** AWS CodeBuild  
**Details:** Packages static assets into a deployable archive.  
    
**Quality Gates:**
    
    - **Gate Name:** Unit Test Pass Rate  
**Criteria:** 100% pass rate.  
    - **Gate Name:** Code Coverage  
**Criteria:** >= 80% (configurable threshold).  
    - **Gate Name:** SAST Scan Results  
**Criteria:** No new critical/high severity vulnerabilities.  
    - **Gate Name:** Dependency Scan Results  
**Criteria:** No new critical/high severity vulnerabilities.  
    
    - **Stage Name:** Deploy to Test/QA Environment  
**Steps:**
    
    - **Step Name:** Deploy Static Assets to S3 (Test/QA)  
**Tool:** AWS CLI S3 Sync / AWS CodeDeploy  
**Details:** Uploads static assets to Test/QA S3 bucket (SRS 3.3.1).  
    - **Step Name:** Invalidate CloudFront Cache (Test/QA)  
**Tool:** AWS CLI CloudFront  
**Details:** Invalidates CloudFront cache for the Test/QA distribution.  
    - **Step Name:** Run E2E Tests (UI Focused)  
**Tool:** Cypress/Playwright  
**Details:** Executes E2E tests against the deployed Test/QA frontend (SRS 3.2.7).  
    - **Step Name:** Dynamic Application Security Testing (DAST)  
**Tool:** OWASP ZAP (configured for SPAs)  
**Details:** Performs DAST on the deployed application in Test/QA (SRS 3.2.4).  
    
**Quality Gates:**
    
    - **Gate Name:** E2E Test Pass Rate  
**Criteria:** 100% pass rate for critical flows.  
    - **Gate Name:** DAST Scan Results  
**Criteria:** No new critical/high severity vulnerabilities.  
    
    - **Stage Name:** Approval for Staging  
**Steps:**
    
    - **Step Name:** Manual Approval  
**Tool:** AWS CodePipeline (Manual Approval Action)  
**Details:** Requires manual approval from QA Lead or Product Owner.  
    
    - **Stage Name:** Deploy to Staging Environment  
**Steps:**
    
    - **Step Name:** Deploy Static Assets to S3 (Staging)  
**Tool:** AWS CLI S3 Sync / AWS CodeDeploy  
**Details:** Uploads static assets to Staging S3 bucket.  
    - **Step Name:** Invalidate CloudFront Cache (Staging)  
**Tool:** AWS CLI CloudFront  
**Details:** Invalidates CloudFront cache for the Staging distribution.  
    - **Step Name:** Run Smoke Tests (E2E)  
**Tool:** Cypress/Playwright  
**Details:** Executes critical E2E smoke tests.  
    - **Step Name:** User Acceptance Testing (UAT)  
**Tool:** Manual / Test Management Tool  
**Details:** UAT is performed on the Staging environment (SRS 7.6).  
    
**Quality Gates:**
    
    - **Gate Name:** Smoke Test Pass Rate  
**Criteria:** 100% pass rate.  
    - **Gate Name:** UAT Sign-off  
**Criteria:** Formal sign-off based on UAT results.  
    
    - **Stage Name:** Approval for Production  
**Steps:**
    
    - **Step Name:** Manual Approval  
**Tool:** AWS CodePipeline (Manual Approval Action)  
**Details:** Requires manual approval from Product Owner / Release Manager.  
    
    - **Stage Name:** Deploy to Production Environment  
**Steps:**
    
    - **Step Name:** Deploy Static Assets to S3 (Production)  
**Tool:** AWS CLI S3 Sync / AWS CodeDeploy  
**Details:** Uploads static assets to Production S3 bucket.  
    - **Step Name:** Invalidate CloudFront Cache (Production)  
**Tool:** AWS CLI CloudFront  
**Details:** Invalidates CloudFront cache for the Production distribution.  
    - **Step Name:** Run Smoke Tests (E2E)  
**Tool:** Cypress/Playwright  
**Details:** Executes critical E2E smoke tests post-deployment.  
    - **Step Name:** Monitor Post-Deployment  
**Tool:** Amazon CloudWatch (Synthetics, RUM if configured)  
**Details:** Monitors frontend availability and core web vitals.  
    
**Quality Gates:**
    
    - **Gate Name:** Production Smoke Test Pass Rate  
**Criteria:** 100% pass rate.  
    
    
**Rollback Strategy:**
    
    - **Method:** Re-deploy Previous Stable Version from S3 Versioning
    - **Triggers:**
      
      - Failed deployment stage
      - Critical errors reported by monitoring post-deployment
      
    - **Database Rollback:** N/A for static frontend assets.
    
**Artifact Management:**
    
    - **Repository:** AWS S3 (versioned bucket)
    - **Versioning:** Build timestamp or Git Commit SHA for S3 object prefixes/tags
    - **Retention:** Keep last 10 versions, delete versions older than 180 days.
    
  - **Pipeline Id:** FE_SSGSSR_001  
**Pipeline Name:** Frontend SSG/SSR Public Pages CI/CD Pipeline (React/Next.js)  
**Description:** Handles CI/CD for React SSG/SSR public-facing pages (e.g., landing pages, blog), built with Next.js/Remix and deployed as Docker containers to AWS ECS/Fargate (or Amplify/S3+Lambda@Edge depending on final hosting choice in SRS 3.3.1 - assuming ECS/Fargate for this essential design).  
**Trigger:**
    
    - **Type:** CodeCommit
    - **Branch Pattern:** main, release/*, feature/* (for public pages repository)
    
**Stages:**
    
    - **Stage Name:** Source & Initial Checks  
**Steps:**
    
    - **Step Name:** Checkout Source Code  
**Tool:** AWS CodePipeline (Source Action)  
**Details:** Fetches latest code.  
    - **Step Name:** Lint Code  
**Tool:** ESLint  
**Details:** Enforces coding standards.  
    
    - **Stage Name:** Build & Unit Test  
**Steps:**
    
    - **Step Name:** Install Dependencies  
**Tool:** npm / yarn  
**Details:** Installs dependencies.  
    - **Step Name:** Run Unit Tests  
**Tool:** Jest / React Testing Library  
**Details:** Executes unit tests and coverage (SRS 3.2.7, 5.8).  
    - **Step Name:** Static Code Analysis (SAST)  
**Tool:** SonarQube  
**Details:** Scans code (SRS 3.2.4).  
    - **Step Name:** Dependency Vulnerability Scan  
**Tool:** npm audit / Snyk  
**Details:** Checks dependencies (SRS 3.2.4).  
    - **Step Name:** Build Next.js/Remix Application  
**Tool:** Next.js CLI / Remix CLI  
**Details:** Builds the application for SSR/SSG (SRS 3.3.1).  
    - **Step Name:** Build Docker Image  
**Tool:** Docker  
**Details:** Builds a Docker image (if deploying to ECS/Fargate).  
    - **Step Name:** Scan Docker Image  
**Tool:** AWS ECR Scanning / Trivy  
**Details:** Scans Docker image (if applicable).  
    - **Step Name:** Push Docker Image to ECR  
**Tool:** Docker CLI / AWS CLI  
**Details:** Pushes image to ECR (if applicable).  
    
**Quality Gates:**
    
    - **Gate Name:** Unit Test Pass Rate  
**Criteria:** 100% pass rate.  
    - **Gate Name:** Code Coverage  
**Criteria:** >= 70% (public content pages might have different coverage profile).  
    - **Gate Name:** SAST Scan Results  
**Criteria:** No new critical/high severity vulnerabilities.  
    - **Gate Name:** Dependency Scan Results  
**Criteria:** No new critical/high severity vulnerabilities.  
    - **Gate Name:** Image Scan Results (if applicable)  
**Criteria:** No new critical/high severity vulnerabilities.  
    
    - **Stage Name:** Deploy to Test/QA Environment  
**Steps:**
    
    - **Step Name:** Fetch Configurations  
**Tool:** AWS Systems Manager Parameter Store / Secrets Manager  
**Details:** Retrieves Test/QA configurations.  
    - **Step Name:** Deploy to ECS/Fargate or Amplify (Test/QA)  
**Tool:** AWS CodeDeploy / CDK / Amplify CLI  
**Details:** Deploys application to Test/QA.  
    - **Step Name:** Run E2E Tests (UI Focused)  
**Tool:** Cypress/Playwright  
**Details:** Executes E2E tests (SRS 3.2.7).  
    - **Step Name:** Check PageSpeed Insights Score  
**Tool:** Google PageSpeed Insights API / Lighthouse CLI  
**Details:** Validates performance score (SRS 3.2.1, REQ-6-009).  
    
**Quality Gates:**
    
    - **Gate Name:** E2E Test Pass Rate  
**Criteria:** 100% pass rate for critical pages.  
    - **Gate Name:** PageSpeed Score  
**Criteria:** >= 80 for mobile and desktop on key pages.  
    
    - **Stage Name:** Approval for Staging  
**Steps:**
    
    - **Step Name:** Manual Approval  
**Tool:** AWS CodePipeline (Manual Approval Action)  
**Details:** Requires manual approval.  
    
    - **Stage Name:** Deploy to Staging Environment  
**Steps:**
    
    - **Step Name:** Fetch Configurations  
**Tool:** AWS Systems Manager Parameter Store / Secrets Manager  
**Details:** Retrieves Staging configurations.  
    - **Step Name:** Deploy to ECS/Fargate or Amplify (Staging)  
**Tool:** AWS CodeDeploy / CDK / Amplify CLI  
**Details:** Deploys application to Staging.  
    - **Step Name:** Run Smoke Tests (E2E)  
**Tool:** Cypress/Playwright  
**Details:** Executes critical E2E smoke tests.  
    - **Step Name:** User Acceptance Testing (UAT)  
**Tool:** Manual / Test Management Tool  
**Details:** UAT on Staging (SRS 7.6).  
    
**Quality Gates:**
    
    - **Gate Name:** Smoke Test Pass Rate  
**Criteria:** 100% pass rate.  
    - **Gate Name:** UAT Sign-off  
**Criteria:** Formal sign-off.  
    
    - **Stage Name:** Approval for Production  
**Steps:**
    
    - **Step Name:** Manual Approval  
**Tool:** AWS CodePipeline (Manual Approval Action)  
**Details:** Requires final approval.  
    
    - **Stage Name:** Deploy to Production Environment  
**Steps:**
    
    - **Step Name:** Fetch Configurations  
**Tool:** AWS Systems Manager Parameter Store / Secrets Manager  
**Details:** Retrieves Production configurations.  
    - **Step Name:** Deploy to ECS/Fargate or Amplify (Production)  
**Tool:** AWS CodeDeploy (Blue/Green or Canary) / CDK / Amplify CLI  
**Details:** Deploys to Production (SRS 5.2).  
    - **Step Name:** Run Smoke Tests (E2E)  
**Tool:** Cypress/Playwright  
**Details:** Executes critical E2E smoke tests.  
    - **Step Name:** Monitor Post-Deployment  
**Tool:** Amazon CloudWatch (Synthetics, RUM)  
**Details:** Monitors availability and performance.  
    
**Quality Gates:**
    
    - **Gate Name:** Production Smoke Test Pass Rate  
**Criteria:** 100% pass rate.  
    
    
**Rollback Strategy:**
    
    - **Method:** Automated Re-deploy Previous Stable Version
    - **Triggers:**
      
      - Failed deployment stage
      - Critical errors post-deployment
      
    - **Database Rollback:** N/A unless content is DB-driven and schema changes occur, then similar to backend.
    
**Artifact Management:**
    
    - **Repository:** Amazon ECR (if Dockerized) / AWS S3 (if build artifacts for Amplify/Lambda@Edge)
    - **Versioning:** Semantic Versioning + Git Commit SHA for image tags or S3 prefixes
    - **Retention:** Keep last 10 versions/images, delete older than 90 days unless tagged 'release'.
    
  


---

