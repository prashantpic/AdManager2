---
title: System Architecture Overview
sidebar_label: System Overview
---

# System Architecture Overview

This document provides a high-level overview of the Ad Manager Platform's system architecture. The platform is designed to be scalable, reliable, secure, and maintainable, supporting a variety of advertising management functions for multiple tenants (merchants).

## Introduction

The Ad Manager Platform architecture is built upon modern cloud-native principles, primarily leveraging Amazon Web Services (AWS), to ensure flexibility, resilience, and cost-efficiency. It aims to deliver a robust solution for managing advertising campaigns across diverse networks.

## Architectural Style

The platform primarily follows a **Microservices** architectural style. Core functionalities are encapsulated within distinct, independently deployable services that communicate over well-defined APIs and asynchronous messaging queues. This approach promotes modularity, scalability, and fault isolation.

## Key Architectural Patterns

Several architectural patterns are employed throughout the system:

*   **API Gateway:** Amazon API Gateway serves as the single entry point for all external client requests (Merchant Portal, Admin Portal, third-party integrations), handling routing, authentication, authorization, rate limiting, and request/response transformation.
*   **Event-Driven Architecture (EDA):** AWS SNS (Simple Notification Service) and SQS (Simple Queue Service) are used extensively for asynchronous communication between microservices. This decouples services, improves resilience, and allows for scalable event processing.
*   **Domain-Driven Design (DDD):** Services are modeled around specific business domains (e.g., Campaign Management, Product Catalog Management, Billing) to ensure clear boundaries and responsibilities.
*   **Circuit Breaker:** Implemented within services or via libraries (e.g., resilience4j if Java, or similar for Node.js) to prevent cascading failures when communicating with other services or external systems.
*   **CQRS (Command Query Responsibility Segregation):** Applied in specific domains where read and write patterns differ significantly, optimizing data models for each. For instance, campaign performance reporting might use a denormalized read model.
*   **Infrastructure as Code (IaC):** AWS Cloud Development Kit (CDK) or Terraform is used to define and manage all cloud infrastructure resources, ensuring consistent, repeatable, and version-controlled deployments.

## Layers

The system can be conceptually divided into the following layers:

1.  **Presentation Layer (Frontend):**
    *   Merchant Portal (e.g., React, Angular, or Vue.js Single Page Application)
    *   Admin Portal (e.g., React, Angular, or Vue.js Single Page Application)
    *   Hosted on services like AWS Amplify or S3 + CloudFront.
2.  **API Gateway Layer:**
    *   Amazon API Gateway (RESTful and potentially WebSocket APIs).
3.  **Application Services Layer (Backend Microservices):**
    *   Independently deployable services (e.g., Node.js/NestJS, Python/Flask, Java/Spring Boot) running on AWS Fargate/ECS or AWS Lambda.
    *   Examples: Campaign Service, Ad Set Service, Product Catalog Service, User Management Service, Billing Service, Notification Service, Reporting Service.
4.  **Messaging/Event Bus Layer:**
    *   AWS SNS for topic-based publish/subscribe.
    *   AWS SQS for durable message queues.
5.  **Data Persistence Layer:**
    *   **Relational Data:** Amazon RDS (e.g., PostgreSQL) for transactional data requiring strong consistency (e.g., campaign configurations, user accounts).
    *   **NoSQL Data:** Amazon DynamoDB for high-throughput, flexible schema data (e.g., analytics events, product feed items, logs).
    *   **Object Storage:** Amazon S3 for storing large files (e.g., creative assets, product feed files, backups).
    *   **Caching:** Amazon ElastiCache (Redis or Memcached) for improving performance by caching frequently accessed data.
6.  **Integration Layer:**
    *   Connectors/Adapters for communicating with external Ad Networks (e.g., Google Ads API, Facebook Marketing API), Payment Gateways, and other third-party services.
7.  **Monitoring & Logging Layer:**
    *   Amazon CloudWatch for metrics, logs, alarms, and dashboards.
    *   AWS X-Ray for distributed tracing.

## Logical Architecture Diagram

```mermaid
graph TD
    subgraph User Clients
        A[Merchant Portal (Browser)]
        B[Admin Portal (Browser)]
        C[Third-Party Applications]
    end

    subgraph AWS Cloud
        D[API Gateway]

        subgraph Application Services
            E[Campaign Service]
            F[Product Catalog Service]
            G[User Management Service]
            H[Billing Service]
            I[Reporting Service]
            J[Notification Service]
            K[Ad Network Adapters]
        end

        subgraph Data Stores
            L[RDS (PostgreSQL)]
            M[DynamoDB]
            N[S3]
            O[ElastiCache]
        end

        subgraph Messaging
            P[SNS Topics]
            Q[SQS Queues]
        end

        subgraph Monitoring & Ops
            R[CloudWatch (Metrics, Logs, Alarms)]
            S[AWS X-Ray (Tracing)]
        end
    end

    subgraph External Systems
        T[External Ad Networks (Google, Facebook, etc.)]
        U[Payment Gateway]
        V[Email Service (SES)]
    end

    A --> D
    B --> D
    C --> D

    D --> E
    D --> F
    D --> G
    D --> H
    D --> I
    D --> J

    E --> P; E --> Q; E --> L; E --> M; E --> O; E --> K
    F --> P; F --> Q; F --> L; F --> M; F --> N
    G --> L
    H --> L; H --> U
    I --> L; I --> M; I --> N
    J --> P; J --> Q; J --> V

    K --> T

    P --> Q
    Q --> E; Q --> F; Q --> I; Q --> J

    E --> R; E --> S
    F --> R; F --> S
    G --> R; G --> S
    H --> R; H --> S
    I --> R; I --> S
    J --> R; J --> S
    D --> R; D --> S
```
*Figure: High-level Logical Architecture Diagram*

## Physical Architecture Diagram (Conceptual)

```mermaid
graph LR
    User[User/Browser] --> CloudFront[AWS CloudFront]
    CloudFront --> S3FE[S3 Bucket (Frontend Assets)]
    CloudFront --> APIGW[API Gateway]

    APIGW --> Auth[Lambda Authorizer/Cognito]
    APIGW --> FargateServices[ECS Fargate Services]
    FargateServices <--> RDSPostgres[RDS PostgreSQL]
    FargateServices <--> DynamoDB
    FargateServices <--> S3Data[S3 Bucket (Data Lake/Assets)]
    FargateServices <--> ElastiCache
    FargateServices --> SNS
    FargateServices --> SQSLambda[SQS --> Lambda (Async Processing)]
    SNS --> SQSLambda
    SNS --> NotificationLambda[Lambda (Notifications)]
    NotificationLambda --> SES[Amazon SES]
    NotificationLambda --> ExtNotify[External Notification Services]

    FargateServices --> ExtAdAPIs[External Ad Network APIs]
    FargateServices --> ExtPaymentGW[External Payment Gateway]

    %% Monitoring & Logging
    FargateServices --> CloudWatchLogs[CloudWatch Logs]
    FargateServices -- Metrics --> CloudWatchMetrics[CloudWatch Metrics]
    APIGW -- Logs/Metrics --> CloudWatchLogs
    CloudWatchMetrics -- Alarms --> SNSAlerts[SNS (Alerts)]
    SNSAlerts --> OpsTeam[Ops Team Notifications]
    APIGW -- Traces --> XRay[AWS X-Ray]
    FargateServices -- Traces --> XRay
```
*Figure: Conceptual Physical Architecture using AWS Services*

## Technology Stack Overview

*   **Frontend:** React, TypeScript, Redux/Zustand, Vite/Webpack
*   **Backend Microservices:** Node.js with NestJS (TypeScript), or Python with Flask/FastAPI, or Java with Spring Boot
*   **Containerization & Orchestration:** Docker, AWS ECS with Fargate
*   **API Gateway:** Amazon API Gateway
*   **Databases:**
    *   Relational: Amazon RDS for PostgreSQL
    *   NoSQL: Amazon DynamoDB
    *   Caching: Amazon ElastiCache (Redis)
*   **Messaging:** AWS SQS, AWS SNS
*   **Object Storage:** AWS S3
*   **Authentication/Authorization:** Amazon Cognito, JWTs
*   **Monitoring & Logging:** Amazon CloudWatch, AWS X-Ray
*   **Infrastructure as Code (IaC):** AWS CDK (TypeScript/Python) or Terraform
*   **CI/CD:** AWS CodePipeline, AWS CodeBuild, GitHub Actions

## Key Components and Interactions

*   **Campaign Service:** Manages the lifecycle of campaigns, ad sets, and ads. Interacts with Ad Network Adapters for pushing campaign data to external platforms and retrieving performance metrics.
*   **Product Catalog Service:** Handles ingestion, processing, and storage of merchant product feeds. Provides product data to Campaign Service.
*   **User Management Service:** Manages platform users (merchants, admins) and their roles/permissions, integrating with Amazon Cognito.
*   **Billing Service:** Manages merchant subscriptions, invoicing, and payments, integrating with a Payment Gateway.
*   **Reporting Service:** Aggregates performance data from various sources (via Ad Network Adapters, internal event streams) and prepares reports for the Merchant Portal.
*   **Notification Service:** Sends email, SMS, or in-app notifications to users based on system events.
*   **Ad Network Adapters:** Service-specific modules responsible for communicating with each supported external ad network's API.

Interactions are primarily API-driven (synchronous) via the API Gateway or event-driven (asynchronous) via SNS/SQS for background tasks and service decoupling.

## Data Flow Overview

**Example: Campaign Creation & Sync**
1.  Merchant creates a campaign via Merchant Portal.
2.  Request hits API Gateway, which authenticates and authorizes.
3.  API Gateway routes request to Campaign Service.
4.  Campaign Service validates data, stores campaign configuration in RDS.
5.  Campaign Service publishes a `CampaignCreated` event to an SNS topic.
6.  Ad Network Adapter(s) subscribed to this topic receive the event (via SQS queues).
7.  Adapters transform campaign data and push it to the respective external Ad Network APIs.
8.  Adapters update sync status in RDS or DynamoDB.

**Example: Performance Data Ingestion**
1.  Scheduled task (e.g., Lambda triggered by EventBridge) or Ad Network Adapter polls external Ad Network APIs for performance data.
2.  Data is fetched and published to an SQS queue for ingestion.
3.  A processing service (Lambda or Fargate task) consumes messages from SQS, transforms data, and stores it in DynamoDB (raw/aggregated) and/or a data lake in S3.
4.  Reporting Service queries this data to generate reports.

## Quality Attributes

The architecture is designed to achieve:

*   **Scalability:** Microservices can be scaled independently based on demand. Use of serverless (Lambda) and managed services (Fargate, DynamoDB, SQS) supports auto-scaling.
*   **Reliability & Availability:** Redundant deployments across multiple Availability Zones (AZs). Asynchronous communication and circuit breakers enhance fault tolerance. Managed AWS services offer high availability.
*   **Security:** Defense-in-depth approach: VPCs, security groups, IAM roles, encryption at rest and in transit, WAF on API Gateway, Cognito for user authentication. Regular security assessments.
*   **Maintainability:** Well-defined service boundaries, IaC, CI/CD pipelines, comprehensive logging and monitoring facilitate easier updates and troubleshooting.
*   **Performance:** Optimized data access patterns (e.g., caching with ElastiCache), asynchronous processing for long-running tasks, efficient querying of data stores. CDN (CloudFront) for frontend assets.
*   **Cost-Effectiveness:** Pay-as-you-go model of AWS, use of serverless and managed services, right-sizing resources, and monitoring spend.
*   **Operability:** Centralized logging and monitoring (CloudWatch), automated alerting, IaC for deployments.

For detailed information on specific components, refer to their respective technical documentation sections.