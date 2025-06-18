# Specification

# 1. Files

- **Path:** src/modules/orchestration/campaign-publishing/package.json  
**Description:** Defines project metadata, dependencies (NestJS modules, TypeORM, AWS SDK for SQS/SNS, class-validator, potential saga libraries), and scripts for the Campaign Publishing Saga Orchestrator microservice.  
**Template:** NestJS Package JSON  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** package.json  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Management
    - Project Scripts
    
**Requirement Ids:**
    
    
**Purpose:** Manages project dependencies and provides scripts for building, running, and testing the orchestrator service.  
**Logic Description:** Standard package.json for a NestJS TypeScript application. Include dependencies like @nestjs/core, @nestjs/common, @nestjs/config, @nestjs/typeorm, typeorm, pg (if PostgreSQL for saga state), aws-sdk, class-validator, class-transformer. Potentially 'nestjs-sagas' or a similar library. Scripts for 'start', 'build', 'test', 'lint'.  
**Documentation:**
    
    - **Summary:** NPM package configuration file.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/orchestration/campaign-publishing/tsconfig.json  
**Description:** TypeScript compiler options for the Campaign Publishing Saga Orchestrator project.  
**Template:** NestJS tsconfig.json  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** tsconfig.json  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript Compilation Configuration
    
**Requirement Ids:**
    
    
**Purpose:** Configures the TypeScript compiler for the project, including paths, target version, and decorators.  
**Logic Description:** Standard tsconfig.json for a NestJS project, enabling decorators, emitDecoratorMetadata, experimentalDecorators, module resolution, and specifying output directory.  
**Documentation:**
    
    - **Summary:** TypeScript compiler configuration.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/orchestration/campaign-publishing/src/main.ts  
**Description:** Main entry point for the Campaign Publishing Saga Orchestrator NestJS application. Initializes and bootstraps the AppModule.  
**Template:** NestJS main.ts  
**Dependancy Level:** 3  
**Name:** main  
**Type:** ApplicationEntry  
**Relative Path:** src/main.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** bootstrap  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** async  
    
**Implemented Features:**
    
    - Application Bootstrap
    
**Requirement Ids:**
    
    
**Purpose:** Initializes the NestJS application, sets up global middleware, and starts listening for incoming requests or messages.  
**Logic Description:** Import NestFactory and AppModule. Create application instance using NestFactory.create. Configure port, global pipes (e.g., ValidationPipe), and exception filters if needed. Start the application listener.  
**Documentation:**
    
    - **Summary:** Application bootstrap file.
    
**Namespace:** AdManager.Orchestration.Campaigns  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/orchestration/campaign-publishing/src/app.module.ts  
**Description:** Root application module for the Campaign Publishing Saga Orchestrator. Imports core NestJS modules and the main CampaignPublishingSagaModule.  
**Template:** NestJS AppModule  
**Dependancy Level:** 2  
**Name:** AppModule  
**Type:** Module  
**Relative Path:** src/app.module.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module Aggregation
    
**Requirement Ids:**
    
    
**Purpose:** Root module that ties together all parts of the orchestrator application.  
**Logic Description:** Import ConfigModule (for environment variables), TypeOrmModule (if using DB for saga state), and the CampaignPublishingSagaModule. Configure global settings if necessary.  
**Documentation:**
    
    - **Summary:** Main application module.
    
**Namespace:** AdManager.Orchestration.Campaigns  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/campaign-publishing-saga.module.ts  
**Description:** NestJS module for the Campaign Publishing Saga. Encapsulates all components related to this specific saga orchestration.  
**Template:** NestJS Module  
**Dependancy Level:** 3  
**Name:** CampaignPublishingSagaModule  
**Type:** Module  
**Relative Path:** src/campaign-publishing-saga/campaign-publishing-saga.module.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    - Saga
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Saga Orchestration Management
    
**Requirement Ids:**
    
    - 3.1.1 (Product Catalogs - Facilitate promotion)
    - 3.3.2.2 (Ad Networks - Campaign creation, editing, status management)
    - 4.1 (Architectural Approach - Event-driven communication)
    - REQ-CMO-001
    - REQ-03-001
    - REQ-PC-006
    
**Purpose:** Registers providers (sagas, repositories, service adapters, listeners) and configures dependencies for the campaign publishing workflow.  
**Logic Description:** Imports TypeOrmModule.forFeature for saga state entities. Declares and exports CampaignPublishingSaga. Providers include saga state repositories, service adapters (for billing, campaign management, product catalog, ad network integration, analytics), and event listeners. May configure SQS/SNS clients.  
**Documentation:**
    
    - **Summary:** Module for managing the campaign publishing saga.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/sagas/campaign-publishing.saga.ts  
**Description:** Core implementation of the Campaign Publishing Saga. Defines the steps, event handling, command dispatching, and compensation logic for publishing a campaign.  
**Template:** NestJS Service/Saga  
**Dependancy Level:** 2  
**Name:** CampaignPublishingSaga  
**Type:** SagaOrchestrator  
**Relative Path:** src/campaign-publishing-saga/sagas/campaign-publishing.saga.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    - Saga
    - EventDrivenArchitecture
    
**Members:**
    
    - **Name:** sagaInstanceRepository  
**Type:** CampaignPublishingSagaInstanceRepository  
**Attributes:** private|readonly  
    - **Name:** billingAdapter  
**Type:** IBillingAdapter  
**Attributes:** private|readonly  
    - **Name:** productCatalogAdapter  
**Type:** IProductCatalogAdapter  
**Attributes:** private|readonly  
    - **Name:** adNetworkAdapter  
**Type:** IAdNetworkIntegrationAdapter  
**Attributes:** private|readonly  
    - **Name:** campaignMgmtAdapter  
**Type:** ICampaignManagementAdapter  
**Attributes:** private|readonly  
    - **Name:** eventEmitter  
**Type:** EventEmitter2  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** startSaga  
**Parameters:**
    
    - data: CampaignCreationRequestedEvent
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** handleBillingCheckResponse  
**Parameters:**
    
    - instanceId: string
    - response: BillingCheckSuccessfulEvent | BillingCheckFailedEvent
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** handleProductFeedResponse  
**Parameters:**
    
    - instanceId: string
    - response: ProductFeedReadyEvent | ProductFeedPreparationFailedEvent
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** handleAdNetworkPublishResponse  
**Parameters:**
    
    - instanceId: string
    - response: AdNetworkPublishSuccessfulEvent | AdNetworkPublishFailedEvent
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** handleCampaignStatusUpdateResponse  
**Parameters:**
    
    - instanceId: string
    - response: CampaignStatusUpdateSuccessfulEvent
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** compensateBillingCheck  
**Parameters:**
    
    - instanceId: string
    - context: any
    
**Return Type:** Promise<void>  
**Attributes:** private  
    - **Name:** compensateProductFeedPrep  
**Parameters:**
    
    - instanceId: string
    - context: any
    
**Return Type:** Promise<void>  
**Attributes:** private  
    - **Name:** compensateAdNetworkPublish  
**Parameters:**
    
    - instanceId: string
    - networkId: string
    - context: any
    
**Return Type:** Promise<void>  
**Attributes:** private  
    
**Implemented Features:**
    
    - Campaign Publishing Workflow
    - Saga State Management
    - Compensating Transactions
    - Event-driven Saga Steps
    
**Requirement Ids:**
    
    - 3.1.1 (Product Catalogs - Facilitate promotion)
    - 3.3.2.2 (Ad Networks - Campaign creation, editing, status management)
    - 4.1 (Architectural Approach - Event-driven communication)
    - REQ-CMO-001
    - REQ-03-001
    - REQ-PC-006
    
**Purpose:** Orchestrates the distributed transaction of publishing a new advertising campaign across multiple services.  
**Logic Description:** Implements a state machine for the saga. Each state transition triggers commands/events to participant services (Billing, ProductCatalog, AdNetworkIntegration, CampaignManagement). Listens for reply events to progress the saga. Implements compensating logic for each step in case of failures. Uses sagaInstanceRepository to persist and retrieve saga state.  
**Documentation:**
    
    - **Summary:** Manages the distributed campaign publishing process using the Saga pattern.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/state/entities/campaign-publishing-saga-instance.entity.ts  
**Description:** TypeORM entity representing the state of a single Campaign Publishing Saga instance.  
**Template:** TypeORM Entity  
**Dependancy Level:** 0  
**Name:** CampaignPublishingSagaInstance  
**Type:** Entity  
**Relative Path:** src/campaign-publishing-saga/state/entities/campaign-publishing-saga-instance.entity.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    - Saga
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public|PrimaryGeneratedColumn  
    - **Name:** campaignId  
**Type:** string  
**Attributes:** public|Column  
    - **Name:** merchantId  
**Type:** string  
**Attributes:** public|Column  
    - **Name:** currentState  
**Type:** string  
**Attributes:** public|Column  
    - **Name:** payload  
**Type:** object  
**Attributes:** public|Column_type_jsonb  
    - **Name:** correlationId  
**Type:** string  
**Attributes:** public|Column_unique  
    - **Name:** isCompensating  
**Type:** boolean  
**Attributes:** public|Column_default_false  
    - **Name:** adNetworkPublishStatus  
**Type:** object  
**Attributes:** public|Column_type_jsonb_nullable  
    - **Name:** createdAt  
**Type:** Date  
**Attributes:** public|CreateDateColumn  
    - **Name:** updatedAt  
**Type:** Date  
**Attributes:** public|UpdateDateColumn  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Saga State Persistence
    
**Requirement Ids:**
    
    - 4.1 (Architectural Approach - Event-driven communication)
    
**Purpose:** Defines the schema for storing the state and context of each running campaign publishing saga.  
**Logic Description:** Includes fields for saga ID, correlation ID, current step/state, original campaign data, status of individual ad network publications, and compensation flags. Uses TypeORM decorators for ORM mapping.  
**Documentation:**
    
    - **Summary:** Entity for persisting saga instance state.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga.State  
**Metadata:**
    
    - **Category:** DataAccess
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/state/repositories/campaign-publishing-saga-instance.repository.ts  
**Description:** Repository for managing CRUD operations and custom queries for CampaignPublishingSagaInstance entities.  
**Template:** NestJS Repository/TypeORM  
**Dependancy Level:** 1  
**Name:** CampaignPublishingSagaInstanceRepository  
**Type:** Repository  
**Relative Path:** src/campaign-publishing-saga/state/repositories/campaign-publishing-saga-instance.repository.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    - RepositoryPattern
    - Saga
    
**Members:**
    
    - **Name:** repository  
**Type:** Repository<CampaignPublishingSagaInstance>  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** createInstance  
**Parameters:**
    
    - data: Partial<CampaignPublishingSagaInstance>
    
**Return Type:** Promise<CampaignPublishingSagaInstance>  
**Attributes:** public  
    - **Name:** findById  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<CampaignPublishingSagaInstance | null>  
**Attributes:** public  
    - **Name:** findByCorrelationId  
**Parameters:**
    
    - correlationId: string
    
**Return Type:** Promise<CampaignPublishingSagaInstance | null>  
**Attributes:** public  
    - **Name:** updateState  
**Parameters:**
    
    - id: string
    - newState: string
    - updatedPayload?: any
    
**Return Type:** Promise<void>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Saga State CRUD
    
**Requirement Ids:**
    
    - 4.1 (Architectural Approach - Event-driven communication)
    
**Purpose:** Provides an abstraction layer for database operations related to saga state.  
**Logic Description:** Uses TypeORM's Repository API or custom query builder methods to interact with the saga instances table. Injected into the CampaignPublishingSaga.  
**Documentation:**
    
    - **Summary:** Data access layer for saga instance state.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga.State  
**Metadata:**
    
    - **Category:** DataAccess
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/messages/events/inputs/campaign-creation-requested.event.ts  
**Description:** DTO for the CampaignCreationRequested event that can trigger the saga.  
**Template:** TypeScript DTO/Event  
**Dependancy Level:** 0  
**Name:** CampaignCreationRequestedEvent  
**Type:** DTO  
**Relative Path:** src/campaign-publishing-saga/messages/events/inputs/campaign-creation-requested.event.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** campaignId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** merchantId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** targetAdNetworkIds  
**Type:** string[]  
**Attributes:** public|readonly  
    - **Name:** productCatalogId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** budgetDetails  
**Type:** any  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Event Data Contract
    
**Requirement Ids:**
    
    - REQ-CMO-001
    
**Purpose:** Defines the data structure for an event indicating a new campaign is ready for publishing.  
**Logic Description:** Contains essential campaign details needed to start the publishing saga. Uses class-validator decorators for basic validation if consumed via HTTP, otherwise just a data structure.  
**Documentation:**
    
    - **Summary:** Payload for campaign creation requested event.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga.Messages.Events.Inputs  
**Metadata:**
    
    - **Category:** DataContract
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/messages/events/inputs/billing-check-successful.event.ts  
**Description:** DTO for the BillingCheckSuccessful event, received as a reply from Billing.Service.  
**Template:** TypeScript DTO/Event  
**Dependancy Level:** 0  
**Name:** BillingCheckSuccessfulEvent  
**Type:** DTO  
**Relative Path:** src/campaign-publishing-saga/messages/events/inputs/billing-check-successful.event.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** correlationId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** campaignId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** message  
**Type:** string  
**Attributes:** public|readonly|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Event Data Contract
    
**Requirement Ids:**
    
    
**Purpose:** Represents a successful budget/billing validation for the campaign.  
**Logic Description:** Contains correlation ID to link back to the saga instance.  
**Documentation:**
    
    - **Summary:** Payload for successful billing check event.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga.Messages.Events.Inputs  
**Metadata:**
    
    - **Category:** DataContract
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/messages/events/inputs/product-feed-ready.event.ts  
**Description:** DTO for the ProductFeedReady event, received as a reply from ProductCatalog.Service.  
**Template:** TypeScript DTO/Event  
**Dependancy Level:** 0  
**Name:** ProductFeedReadyEvent  
**Type:** DTO  
**Relative Path:** src/campaign-publishing-saga/messages/events/inputs/product-feed-ready.event.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** correlationId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** campaignId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** productCatalogId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** feedComplianceStatus  
**Type:** Record<string, boolean>  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Event Data Contract
    
**Requirement Ids:**
    
    - REQ-PC-006
    
**Purpose:** Indicates the product feed for the campaign is prepared and compliant for target networks.  
**Logic Description:** Contains correlation ID, campaign ID, and compliance status per ad network.  
**Documentation:**
    
    - **Summary:** Payload for product feed ready event.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga.Messages.Events.Inputs  
**Metadata:**
    
    - **Category:** DataContract
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/messages/events/inputs/ad-network-publish-successful.event.ts  
**Description:** DTO for AdNetworkPublishSuccessful event, received as a reply from AdNetworkIntegration.Service.  
**Template:** TypeScript DTO/Event  
**Dependancy Level:** 0  
**Name:** AdNetworkPublishSuccessfulEvent  
**Type:** DTO  
**Relative Path:** src/campaign-publishing-saga/messages/events/inputs/ad-network-publish-successful.event.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** correlationId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** campaignId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** adNetworkId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** externalCampaignId  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Event Data Contract
    
**Requirement Ids:**
    
    - REQ-03-001
    
**Purpose:** Signals successful campaign publication on a specific ad network.  
**Logic Description:** Contains correlation ID, campaign ID, ad network ID, and the ID assigned by the external ad network.  
**Documentation:**
    
    - **Summary:** Payload for successful ad network publish event.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga.Messages.Events.Inputs  
**Metadata:**
    
    - **Category:** DataContract
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/messages/events/outputs/campaign-publishing-completed.event.ts  
**Description:** DTO for the CampaignPublishingCompleted event, published by the saga upon successful completion.  
**Template:** TypeScript DTO/Event  
**Dependancy Level:** 0  
**Name:** CampaignPublishingCompletedEvent  
**Type:** DTO  
**Relative Path:** src/campaign-publishing-saga/messages/events/outputs/campaign-publishing-completed.event.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** sagaInstanceId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** campaignId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** merchantId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** finalStatus  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** publishedAdNetworks  
**Type:** Array<{adNetworkId: string, externalCampaignId: string}>  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Event Data Contract
    
**Requirement Ids:**
    
    - 4.1 (Architectural Approach - Event-driven communication)
    
**Purpose:** Notifies other services (e.g., Analytics) that the campaign publishing process has successfully finished.  
**Logic Description:** Includes saga ID, campaign ID, merchant ID, final status, and details of successful publications.  
**Documentation:**
    
    - **Summary:** Payload for campaign publishing completed event.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga.Messages.Events.Outputs  
**Metadata:**
    
    - **Category:** DataContract
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/messages/commands/check-campaign-budget.command.ts  
**Description:** DTO for the command sent to Billing.Service to validate campaign budget.  
**Template:** TypeScript DTO/Command  
**Dependancy Level:** 0  
**Name:** CheckCampaignBudgetCommand  
**Type:** DTO  
**Relative Path:** src/campaign-publishing-saga/messages/commands/check-campaign-budget.command.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** correlationId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** campaignId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** merchantId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** budgetAmount  
**Type:** number  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Command Data Contract
    
**Requirement Ids:**
    
    
**Purpose:** Defines the data structure for requesting a budget check from the billing service.  
**Logic Description:** Includes correlation ID for tracking, campaign ID, merchant ID, and budget details.  
**Documentation:**
    
    - **Summary:** Payload for check campaign budget command.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga.Messages.Commands  
**Metadata:**
    
    - **Category:** DataContract
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/services/interfaces/billing.adapter.interface.ts  
**Description:** Interface defining the contract for interacting with the Billing.Service.  
**Template:** TypeScript Interface  
**Dependancy Level:** 1  
**Name:** IBillingAdapter  
**Type:** Interface  
**Relative Path:** src/campaign-publishing-saga/services/interfaces/billing.adapter.interface.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    - DependencyInversionPrinciple
    
**Members:**
    
    
**Methods:**
    
    - **Name:** checkCampaignBudget  
**Parameters:**
    
    - command: CheckCampaignBudgetCommand
    
**Return Type:** Promise<void>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Billing Service Abstraction
    
**Requirement Ids:**
    
    
**Purpose:** Abstracts the communication details for sending commands/events to the Billing.Service.  
**Logic Description:** Defines methods for interactions like initiating a budget check. Implementations will handle actual SQS/SNS publishing.  
**Documentation:**
    
    - **Summary:** Contract for billing service interactions.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga.Services  
**Metadata:**
    
    - **Category:** Interface
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/services/adapters/billing.adapter.ts  
**Description:** Implementation of IBillingAdapter for communicating with Billing.Service via SQS/SNS.  
**Template:** NestJS Service/Adapter  
**Dependancy Level:** 2  
**Name:** BillingAdapter  
**Type:** Adapter  
**Relative Path:** src/campaign-publishing-saga/services/adapters/billing.adapter.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    - AdapterPattern
    
**Members:**
    
    - **Name:** sqsClient  
**Type:** AWS.SQS  
**Attributes:** private|readonly  
    - **Name:** snsClient  
**Type:** AWS.SNS  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** checkCampaignBudget  
**Parameters:**
    
    - command: CheckCampaignBudgetCommand
    
**Return Type:** Promise<void>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Billing Service Communication
    
**Requirement Ids:**
    
    
**Purpose:** Sends commands/events to the Billing.Service using the configured messaging system.  
**Logic Description:** Implements the IBillingAdapter interface. Uses AWS SDK to publish messages to the appropriate SQS queue or SNS topic for the Billing.Service.  
**Documentation:**
    
    - **Summary:** Adapter for communicating with the Billing Service.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga.Services.Adapters  
**Metadata:**
    
    - **Category:** InfrastructureAdapter
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/listeners/sqs-event.listener.ts  
**Description:** NestJS service or controller that listens to SQS queues for reply events from participant microservices.  
**Template:** NestJS Controller/Service  
**Dependancy Level:** 2  
**Name:** SqsEventListener  
**Type:** EventListener  
**Relative Path:** src/campaign-publishing-saga/listeners/sqs-event.listener.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    - EventDrivenArchitecture
    
**Members:**
    
    - **Name:** campaignPublishingSaga  
**Type:** CampaignPublishingSaga  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** handleBillingServiceReply  
**Parameters:**
    
    - message: AWS.SQS.Message
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** handleProductCatalogServiceReply  
**Parameters:**
    
    - message: AWS.SQS.Message
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** handleAdNetworkIntegrationServiceReply  
**Parameters:**
    
    - message: AWS.SQS.Message
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** handleCampaignManagementServiceReply  
**Parameters:**
    
    - message: AWS.SQS.Message
    
**Return Type:** Promise<void>  
**Attributes:** public  
    
**Implemented Features:**
    
    - Asynchronous Event Consumption
    - Saga Progression
    
**Requirement Ids:**
    
    - 4.1 (Architectural Approach - Event-driven communication)
    
**Purpose:** Consumes messages from SQS queues, deserializes them, and routes them to the appropriate CampaignPublishingSaga methods.  
**Logic Description:** Uses NestJS mechanisms or AWS SDK directly to poll SQS queues. Parses event messages and calls saga methods (e.g., handleBillingCheckResponse) with the event payload and correlation ID.  
**Documentation:**
    
    - **Summary:** Listens for and processes incoming SQS messages for the saga.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga.Listeners  
**Metadata:**
    
    - **Category:** InfrastructureAdapter
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/config/campaign-publishing.config.ts  
**Description:** Configuration settings for the Campaign Publishing Saga, such as queue names, SNS topic ARNs, and retry policies.  
**Template:** NestJS ConfigService  
**Dependancy Level:** 0  
**Name:** CampaignPublishingConfig  
**Type:** Configuration  
**Relative Path:** src/campaign-publishing-saga/config/campaign-publishing.config.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** billingCommandQueueUrl  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** productCatalogCommandQueueUrl  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** adNetworkCommandQueueUrl  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** campaignManagementCommandQueueUrl  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** sagaReplyQueueUrl  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** campaignPublishedTopicArn  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Saga Configuration Management
    
**Requirement Ids:**
    
    
**Purpose:** Provides access to environment-specific configurations for the saga orchestrator.  
**Logic Description:** Uses NestJS ConfigModule to load configurations from environment variables or .env files. Defines getters for specific configuration values.  
**Documentation:**
    
    - **Summary:** Configuration provider for saga related settings.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/exceptions/saga-execution.exception.ts  
**Description:** Custom exception for errors occurring during saga execution.  
**Template:** TypeScript Exception  
**Dependancy Level:** 0  
**Name:** SagaExecutionException  
**Type:** Exception  
**Relative Path:** src/campaign-publishing-saga/exceptions/saga-execution.exception.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** sagaInstanceId  
**Type:** string  
**Attributes:** public|readonly  
    - **Name:** step  
**Type:** string  
**Attributes:** public|readonly  
    
**Methods:**
    
    - **Name:** constructor  
**Parameters:**
    
    - message: string
    - sagaInstanceId: string
    - step: string
    - cause?: Error
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - Custom Error Handling
    
**Requirement Ids:**
    
    
**Purpose:** Provides a specific error type for issues encountered within the saga lifecycle.  
**Logic Description:** Extends NestJS HttpException or a base custom exception. Includes context like saga instance ID and the step where the error occurred.  
**Documentation:**
    
    - **Summary:** Custom exception for saga processing failures.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga.Exceptions  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** src/modules/orchestration/campaign-publishing/src/campaign-publishing-saga/campaign-publishing-saga.constants.ts  
**Description:** Defines constants used within the campaign publishing saga module, such as event names, state names, or service tokens.  
**Template:** TypeScript Constants  
**Dependancy Level:** 0  
**Name:** CampaignPublishingSagaConstants  
**Type:** Constants  
**Relative Path:** src/campaign-publishing-saga/campaign-publishing-saga.constants.ts  
**Repository Id:** REPO-MASTER-SVC-ORCH-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** SAGA_STATE_PENDING_VALIDATION  
**Type:** string  
**Attributes:** public|const  
    - **Name:** SAGA_STATE_PENDING_PRODUCT_FEED_PREP  
**Type:** string  
**Attributes:** public|const  
    - **Name:** EVENT_CAMPAIGN_CREATION_REQUESTED  
**Type:** string  
**Attributes:** public|const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Centralized Constants
    
**Requirement Ids:**
    
    
**Purpose:** Provides a single source of truth for constants to avoid magic strings and improve maintainability.  
**Logic Description:** Exports various string constants for saga states, event names, queue/topic identifiers, etc.  
**Documentation:**
    
    - **Summary:** Collection of constants for the campaign publishing saga.
    
**Namespace:** AdManager.Orchestration.Campaigns.Saga  
**Metadata:**
    
    - **Category:** Utility
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableDetailedSagaLogging
  - enableAutomaticCompensationRetries
  
- **Database Configs:**
  
  - SAGA_STATE_DB_HOST
  - SAGA_STATE_DB_PORT
  - SAGA_STATE_DB_USER
  - SAGA_STATE_DB_PASSWORD
  - SAGA_STATE_DB_NAME
  
- **Message Queue Configs:**
  
  - AWS_REGION
  - SAGA_REPLY_QUEUE_URL
  - BILLING_COMMAND_QUEUE_URL
  - PRODUCT_CATALOG_COMMAND_QUEUE_URL
  - AD_NETWORK_COMMAND_QUEUE_URL
  - CAMPAIGN_MANAGEMENT_COMMAND_QUEUE_URL
  
- **Snstopic Configs:**
  
  - CAMPAIGN_PUBLISHED_TOPIC_ARN
  - CAMPAIGN_PUBLISH_FAILED_TOPIC_ARN
  


---

