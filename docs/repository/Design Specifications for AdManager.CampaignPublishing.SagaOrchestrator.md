markdown
# Software Design Specification: AdManager.CampaignPublishing.SagaOrchestrator

## 1. Introduction

### 1.1. Purpose
This document provides the detailed software design specification for the `AdManager.CampaignPublishing.SagaOrchestrator` microservice. This service is responsible for orchestrating the complex, multi-step process of publishing advertising campaigns across various external ad networks and internal services. It implements the Saga pattern to ensure data consistency and handle failures gracefully in a distributed environment.

### 1.2. Scope
The scope of this document is limited to the design and implementation of the `AdManager.CampaignPublishing.SagaOrchestrator` service. This includes:
*   The core saga logic for campaign publishing and lifecycle management.
*   State management for saga instances.
*   Communication (event/command-based) with participant microservices:
    *   `CampaignManagement.Service`
    *   `ProductCatalog.Service`
    *   `AdNetworkIntegration.Service`
    *   `Billing.Service` (for budget checks)
    *   `AnalyticsReporting.Service` (for status updates, though primarily listens to events from this saga)
*   Error handling and compensation logic within the saga.
*   Configuration and operational aspects specific to this orchestrator.

This document does not cover the internal design of the participant microservices themselves, only their interaction contracts with this orchestrator.

### 1.3. Definitions, Acronyms, and Abbreviations
*   **Saga:** A sequence of local transactions where each local transaction updates the database and publishes a message or event to trigger the next local transaction in the saga. If a local transaction fails, the saga executes a series of compensating transactions that undo the changes that were made by the preceding local transactions.
*   **Orchestration-based Saga:** A central orchestrator component tells the saga participants what local transactions to execute.
*   **SQS:** Amazon Simple Queue Service.
*   **SNS:** Amazon Simple Notification Service.
*   **TypeORM:** A TypeScript ORM (Object Relational Mapper).
*   **DTO:** Data Transfer Object.
*   **API:** Application Programming Interface.
*   **AWS:** Amazon Web Services.
*   **IAM:** Identity and Access Management.
*   **PK:** Primary Key.
*   **FK:** Foreign Key.
*   **UK:** Unique Key.
*   **ARN:** Amazon Resource Name.
*   **CRUD:** Create, Read, Update, Delete.

## 2. System Overview

The `AdManager.CampaignPublishing.SagaOrchestrator` acts as a central coordinator for the campaign publishing process. When a request to publish a new campaign is initiated (typically via an event like `CampaignCreationRequestedEvent`), this orchestrator starts a new saga instance.

The saga proceeds through a series of defined steps:
1.  **Budget Validation:** Command the `Billing.Service` to check if the merchant has sufficient budget or if the campaign budget is valid.
2.  **Product Feed Preparation & Validation:** Command the `ProductCatalog.Service` to ensure the associated product catalog is ready and compliant for the target ad networks.
3.  **Ad Network Submission:** For each target ad network, command the `AdNetworkIntegration.Service` to submit the campaign details and creatives.
4.  **Campaign Status Update:** Command the `CampaignManagement.Service` to update the campaign's status to reflect the outcome of the publishing process (e.g., 'Active', 'PartiallyPublished', 'Failed').
5.  **Publish Completion/Failure Event:** Emit an event (`CampaignPublishingCompletedEvent` or `CampaignPublishingFailedEvent`) to notify other interested services (e.g., `AnalyticsReporting.Service`, Notification Service).

Each step involves sending a command to a participant service and waiting for a reply event. If a step fails, or if a reply indicates failure, the orchestrator initiates compensating transactions to roll back changes made in previous successful steps. Saga instance state is persisted to allow recovery and handle long-running processes.

## 3. Design Considerations

### 3.1. Architectural Pattern
*   **Saga (Orchestration-based):** The `CampaignPublishingSaga` class will be the central orchestrator. It will explicitly send commands to participant services and react to their reply events.
*   **Event-Driven Architecture (EDA):** Communication between the orchestrator and participant services, as well as the initiation and completion of sagas, will be primarily event-driven using AWS SQS and SNS.

### 3.2. Technology Stack
*   **Language:** TypeScript 5.4.5
*   **Framework:** NestJS 10.3.9
*   **Messaging:** Amazon SQS (for commands and replies), Amazon SNS (for publishing saga completion/failure events).
*   **Saga State Persistence:** TypeORM 0.3.20 with PostgreSQL (or another relational DB supported by TypeORM).
*   **Validation:** `class-validator`, `class-transformer`.
*   **Saga Library (Optional):** While `nestjs-sagas` is listed, the initial design will focus on a custom implementation using NestJS primitives, SQS/SNS, and TypeORM for state. If complexity warrants, a dedicated library can be integrated.

### 3.3. Error Handling & Compensation
*   Each step in the saga that performs an action on a participant service must have a corresponding compensation action.
*   Failures in participant services will be communicated back via failure events.
*   The saga orchestrator will track the progress and, upon failure, trigger compensation actions in reverse order of successful steps.
*   Network errors or timeouts during communication with SQS/SNS or participant services will be handled with retry mechanisms (e.g., SQS redrive policies, application-level retries for command sending).
*   `SagaExecutionException` will be used for internal saga failures.

### 3.4. Idempotency
*   Saga steps and event handlers should be designed to be idempotent where possible. This means processing the same message multiple times should not result in incorrect state or unintended side effects. Correlation IDs and checking saga instance state will be key.
*   Participant services receiving commands from the orchestrator are also expected to handle commands idempotently (e.g., using the `correlationId` or a unique request ID from the saga).

### 3.5. Concurrency and Scalability
*   The service will be stateless (saga instance state is persisted externally). Multiple instances of the orchestrator service can run concurrently to process different saga instances.
*   SQS queues will handle message buffering and allow for scaling of listeners.
*   Database connections for saga state persistence will be managed efficiently by TypeORM.

## 4. Detailed Design

This section details the design of each component as defined in the file structure.

### 4.1. Core Saga Orchestrator (`campaign-publishing-saga/sagas/campaign-publishing.saga.ts`)

The `CampaignPublishingSaga` class orchestrates the campaign publishing workflow.

#### 4.1.1. Saga States
The saga instance can be in one of the following states, managed by the `currentState` property of the `CampaignPublishingSagaInstance` entity:
*   `SAGA_STATE_STARTED`: Initial state when saga begins.
*   `SAGA_STATE_PENDING_BILLING_CHECK`: Waiting for response from Billing.Service.
*   `SAGA_STATE_PENDING_PRODUCT_FEED_PREP`: Waiting for response from ProductCatalog.Service.
*   `SAGA_STATE_PENDING_AD_NETWORK_PUBLISH`: Waiting for responses from AdNetworkIntegration.Service for each network.
*   `SAGA_STATE_PENDING_CAMPAIGN_STATUS_UPDATE`: Waiting for response from CampaignManagement.Service.
*   `SAGA_STATE_COMPLETED`: All steps successful.
*   `SAGA_STATE_FAILED`: A step failed and could not be compensated or compensation completed.
*   `SAGA_STATE_COMPENSATING`: Saga is in the process of rolling back.
*   `SAGA_STATE_COMPENSATED`: All necessary compensations have been successfully executed.

*(Constants for these states will be defined in `campaign-publishing-saga.constants.ts`)*

#### 4.1.2. Saga Steps & Service Interactions

1.  **`startSaga(data: CampaignCreationRequestedEvent): Promise<void>`**
    *   Triggered by an incoming `CampaignCreationRequestedEvent`.
    *   Creates a new `CampaignPublishingSagaInstance` with `SAGA_STATE_STARTED`, persisting the event payload and generating a `correlationId`.
    *   Transitions to `SAGA_STATE_PENDING_BILLING_CHECK`.
    *   Sends a `CheckCampaignBudgetCommand` to `Billing.Service` via `billingAdapter`.
        *   **Payload:** `correlationId`, `campaignId`, `merchantId`, `budgetDetails`.

2.  **`handleBillingCheckResponse(instanceId: string, response: BillingCheckSuccessfulEvent | BillingCheckFailedEvent): Promise<void>`**
    *   Loads saga instance using `instanceId` (which is the `correlationId`).
    *   **If `BillingCheckSuccessfulEvent`:**
        *   Updates saga instance state to `SAGA_STATE_PENDING_PRODUCT_FEED_PREP`.
        *   Sends a `PrepareProductFeedCommand` (to be defined) to `ProductCatalog.Service` via `productCatalogAdapter`.
            *   **Payload:** `correlationId`, `campaignId`, `merchantId`, `productCatalogId`, `targetAdNetworkIds`.
    *   **If `BillingCheckFailedEvent`:**
        *   Updates saga instance state to `SAGA_STATE_FAILED`.
        *   Emits `CampaignPublishingFailedEvent` (to be defined) with failure details.
        *   No compensation needed for this first step usually, but can log the failure.

3.  **`handleProductFeedResponse(instanceId: string, response: ProductFeedReadyEvent | ProductFeedPreparationFailedEvent): Promise<void>`**
    *   Loads saga instance.
    *   **If `ProductFeedReadyEvent`:**
        *   Checks `feedComplianceStatus` for each target ad network.
        *   If any network is non-compliant for which publication was requested, handle as partial success/failure (TBD: precise logic - e.g., proceed with compliant, fail others, or fail all). For now, assume we proceed if at least one is compliant, or fail if a critical network is non-compliant.
        *   Updates saga instance state to `SAGA_STATE_PENDING_AD_NETWORK_PUBLISH`.
        *   Stores which networks are compliant in `sagaInstance.payload.compliantAdNetworks`.
        *   For each compliant `targetAdNetworkId` from `CampaignCreationRequestedEvent`:
            *   Sends a `PublishCampaignToAdNetworkCommand` (to be defined) to `AdNetworkIntegration.Service` via `adNetworkAdapter`.
                *   **Payload:** `correlationId`, `campaignId`, `merchantId`, `adNetworkId`, (campaign details, creative details, product feed info if needed by adapter).
        *   Initializes `sagaInstance.adNetworkPublishStatus` (e.g., `{[networkId]: 'PENDING'}`).
    *   **If `ProductFeedPreparationFailedEvent`:**
        *   Updates saga instance state to `SAGA_STATE_COMPENSATING`.
        *   Calls `compensateBillingCheck(instanceId, response.reason)`.
        *   Once compensation acknowledged (if applicable), updates state to `SAGA_STATE_FAILED`.
        *   Emits `CampaignPublishingFailedEvent`.

4.  **`handleAdNetworkPublishResponse(instanceId: string, response: AdNetworkPublishSuccessfulEvent | AdNetworkPublishFailedEvent): Promise<void>`**
    *   Loads saga instance.
    *   Updates `sagaInstance.adNetworkPublishStatus[response.adNetworkId]` with `'SUCCESS'` or `'FAILURE'`.
    *   **If `AdNetworkPublishSuccessfulEvent`:**
        *   Stores `externalCampaignId` in `adNetworkPublishStatus`.
    *   **If `AdNetworkPublishFailedEvent`:**
        *   Logs failure reason. Compensation for partial ad network failures might be complex. The current approach might be to attempt all, then decide final status. Or, compensate immediately.
        *   For simplicity now: if one fails, the saga will eventually be marked as `PARTIALLY_FAILED` or `FAILED` and compensation for already published networks may be triggered.
    *   Checks if all targeted (and compliant) ad networks have responded.
        *   **If all responded:**
            *   Determine overall publish success (e.g., all success, partial success, all fail).
            *   If at least one network succeeded:
                *   Transitions to `SAGA_STATE_PENDING_CAMPAIGN_STATUS_UPDATE`.
                *   Sends `UpdateCampaignOverallStatusCommand` (to be defined) to `CampaignManagement.Service` via `campaignMgmtAdapter`.
                    *   **Payload:** `correlationId`, `campaignId`, `finalStatusInternal` (e.g., 'Active', 'PartiallyPublished'), `publishedAdNetworkDetails` (from `adNetworkPublishStatus`).
            *   If all networks failed:
                *   Transitions to `SAGA_STATE_COMPENSATING`.
                *   Calls `compensateProductFeedPrep(instanceId, ...)` and then `compensateBillingCheck(instanceId, ...)`.
                *   Once compensations complete, set state to `SAGA_STATE_FAILED`.
                *   Emits `CampaignPublishingFailedEvent`.

5.  **`handleCampaignStatusUpdateResponse(instanceId: string, response: CampaignStatusUpdateSuccessfulEvent | CampaignStatusUpdateFailedEvent): Promise<void>`**
    *   Loads saga instance.
    *   **If `CampaignStatusUpdateSuccessfulEvent`:**
        *   Updates saga instance state to `SAGA_STATE_COMPLETED`.
        *   Emits `CampaignPublishingCompletedEvent`.
    *   **If `CampaignStatusUpdateFailedEvent`:** (Critical failure, as campaign status in core system is vital)
        *   This is a complex recovery scenario. May need manual intervention or retry.
        *   Log error critically. Saga might be stuck in `PENDING_CAMPAIGN_STATUS_UPDATE`.
        *   Potentially emit a specific `CampaignPublishingInconsistentStateEvent`.
        *   For now, update saga instance state to `SAGA_STATE_FAILED_FINALIZATION` (a new state).

#### 4.1.3. Compensation Logic

*   **`compensateBillingCheck(instanceId: string, context: any): Promise<void>`**
    *   Loads saga instance.
    *   Typically, budget checks might not have a direct "undo" if it's just a validation. If it involves reserving budget, then a `ReleaseReservedBudgetCommand` would be sent to `Billing.Service`.
    *   For now, this might just log or update the saga instance.
*   **`compensateProductFeedPrep(instanceId: string, context: any): Promise<void>`**
    *   Loads saga instance.
    *   If product feed preparation involved creating temporary resources, send a `CleanUpProductFeedResourcesCommand` to `ProductCatalog.Service`.
    *   For now, this might just log or update the saga instance.
*   **`compensateAdNetworkPublish(instanceId: string, networkId: string, context: any): Promise<void>`**
    *   Loads saga instance.
    *   For the given `networkId` that was successfully published, send a `DeleteCampaignFromAdNetworkCommand` to `AdNetworkIntegration.Service`.
    *   Requires storing `externalCampaignId` from `AdNetworkPublishSuccessfulEvent`.
*   Compensation methods update the saga instance's state to reflect compensation progress and ultimately to `SAGA_STATE_COMPENSATED` or `SAGA_STATE_FAILED` if compensation also fails.

#### 4.1.4. Dependencies
*   `CampaignPublishingSagaInstanceRepository`: For state persistence.
*   `IBillingAdapter`, `IProductCatalogAdapter`, `IAdNetworkIntegrationAdapter`, `ICampaignManagementAdapter`: For interacting with participant services.
*   `EventEmitter2` (from `@nestjs/event-emitter` or SNS client directly): For publishing final saga events.

### 4.2. Saga State Management

#### 4.2.1. `CampaignPublishingSagaInstance` Entity (`state/entities/campaign-publishing-saga-instance.entity.ts`)
typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum SagaState {
  STARTED = 'STARTED',
  PENDING_BILLING_CHECK = 'PENDING_BILLING_CHECK',
  PENDING_PRODUCT_FEED_PREP = 'PENDING_PRODUCT_FEED_PREP',
  PENDING_AD_NETWORK_PUBLISH = 'PENDING_AD_NETWORK_PUBLISH',
  PENDING_CAMPAIGN_STATUS_UPDATE = 'PENDING_CAMPAIGN_STATUS_UPDATE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
  FAILED_FINALIZATION = 'FAILED_FINALIZATION', // If final status update fails
}

// Structure for adNetworkPublishStatus
export interface AdNetworkPublicationDetail {
  status: 'PENDING' | 'SUCCESS' | 'FAILURE';
  externalCampaignId?: string;
  failureReason?: string;
  timestamp: Date;
}

@Entity('campaign_publishing_saga_instances')
export class CampaignPublishingSagaInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  campaignId: string;

  @Column({ type: 'uuid' })
  @Index()
  merchantId: string;

  @Column({ type: 'enum', enum: SagaState, default: SagaState.STARTED })
  currentState: SagaState;

  // Store initial request and intermediate results/payloads needed for subsequent steps or compensation
  @Column({ type: 'jsonb' })
  payload: any; // e.g., { initialRequest: CampaignCreationRequestedEvent, compliantAdNetworks: string[], ... }

  @Column({ type: 'uuid', unique: true })
  @Index()
  correlationId: string; // Typically same as campaignId or a unique ID for the saga flow

  @Column({ type: 'boolean', default: false })
  isCompensating: boolean;

  // Stores status for each ad network, e.g., { "google-ads-id": { status: "SUCCESS", externalCampaignId: "ext123" }, ... }
  @Column({ type: 'jsonb', nullable: true })
  adNetworkPublishStatus?: Record<string, AdNetworkPublicationDetail>;

  @Column({ type: 'text', nullable: true })
  lastFailureReason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


#### 4.2.2. `CampaignPublishingSagaInstanceRepository` (`state/repositories/campaign-publishing-saga-instance.repository.ts`)
typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignPublishingSagaInstance, SagaState, AdNetworkPublicationDetail } from '../entities/campaign-publishing-saga-instance.entity';

@Injectable()
export class CampaignPublishingSagaInstanceRepository {
  constructor(
    @InjectRepository(CampaignPublishingSagaInstance)
    private readonly repository: Repository<CampaignPublishingSagaInstance>,
  ) {}

  async createInstance(data: {
    campaignId: string;
    merchantId: string;
    correlationId: string;
    initialPayload: any;
  }): Promise<CampaignPublishingSagaInstance> {
    const instance = this.repository.create({
      campaignId: data.campaignId,
      merchantId: data.merchantId,
      correlationId: data.correlationId,
      currentState: SagaState.STARTED,
      payload: { initialRequest: data.initialPayload },
      adNetworkPublishStatus: {},
    });
    return this.repository.save(instance);
  }

  async findById(id: string): Promise<CampaignPublishingSagaInstance | null> {
    return this.repository.findOneBy({ id });
  }

  async findByCorrelationId(correlationId: string): Promise<CampaignPublishingSagaInstance | null> {
    return this.repository.findOneBy({ correlationId });
  }

  async updateState(
    id: string,
    newState: SagaState,
    updatedPayload?: any, // To merge into existing payload
    failureReason?: string,
  ): Promise<CampaignPublishingSagaInstance> {
    const instance = await this.findById(id);
    if (!instance) {
      throw new Error(`Saga instance with id ${id} not found.`);
    }
    instance.currentState = newState;
    if (updatedPayload) {
      instance.payload = { ...instance.payload, ...updatedPayload };
    }
    if (failureReason) {
      instance.lastFailureReason = failureReason;
    }
    return this.repository.save(instance);
  }

  async updateAdNetworkStatus(
    id: string,
    adNetworkId: string,
    statusDetail: AdNetworkPublicationDetail,
  ): Promise<CampaignPublishingSagaInstance> {
    const instance = await this.findById(id);
    if (!instance) {
      throw new Error(`Saga instance with id ${id} not found.`);
    }
    if (!instance.adNetworkPublishStatus) {
      instance.adNetworkPublishStatus = {};
    }
    instance.adNetworkPublishStatus[adNetworkId] = statusDetail;
    return this.repository.save(instance);
  }

  async setCompensating(id: string, compensating: boolean): Promise<CampaignPublishingSagaInstance> {
    const instance = await this.findById(id);
     if (!instance) {
      throw new Error(`Saga instance with id ${id} not found.`);
    }
    instance.isCompensating = compensating;
    return this.repository.save(instance);
  }
}


### 4.3. Messaging Contracts (Events & Commands)

Located in `src/campaign-publishing-saga/messages/`

#### 4.3.1. Input Events (`events/inputs/`)
*   **`CampaignCreationRequestedEvent`**
    *   Properties: `campaignId: string`, `merchantId: string`, `targetAdNetworkIds: string[]`, `productCatalogId: string`, `budgetDetails: any` (specific budget structure TBD by Billing service contract), `campaignDetails: any` (core details like name, schedule, creatives).
    *   Use `class-validator` decorators.
*   **`BillingCheckSuccessfulEvent`**
    *   Properties: `correlationId: string`, `campaignId: string`, `message?: string`.
*   **`BillingCheckFailedEvent`**
    *   Properties: `correlationId: string`, `campaignId: string`, `reason: string`.
*   **`ProductFeedReadyEvent`**
    *   Properties: `correlationId: string`, `campaignId: string`, `productCatalogId: string`, `feedComplianceStatus: Record<string, { compliant: boolean; reason?: string; feedUrl?: string }>` (key is adNetworkId).
*   **`ProductFeedPreparationFailedEvent`**
    *   Properties: `correlationId: string`, `campaignId: string`, `reason: string`.
*   **`AdNetworkPublishSuccessfulEvent`**
    *   Properties: `correlationId: string`, `campaignId: string`, `adNetworkId: string`, `externalCampaignId: string`.
*   **`AdNetworkPublishFailedEvent`**
    *   Properties: `correlationId: string`, `campaignId: string`, `adNetworkId: string`, `reason: string`.
*   **`CampaignStatusUpdateSuccessfulEvent`** (from CampaignManagementService)
    *   Properties: `correlationId: string`, `campaignId: string`.
*   **`CampaignStatusUpdateFailedEvent`** (from CampaignManagementService)
    *   Properties: `correlationId: string`, `campaignId: string`, `reason: string`.

#### 4.3.2. Output Events (`events/outputs/`)
*   **`CampaignPublishingCompletedEvent`**
    *   Properties: `sagaInstanceId: string`, `campaignId: string`, `merchantId: string`, `finalStatus: SagaState.COMPLETED | 'PARTIALLY_COMPLETED'`, `publishedAdNetworks: Array<{adNetworkId: string, externalCampaignId: string, status: 'SUCCESS' | 'FAILURE', reason?: string}>`.
*   **`CampaignPublishingFailedEvent`**
    *   Properties: `sagaInstanceId: string`, `campaignId: string`, `merchantId: string`, `reason: string`, `failedStep: SagaState`.

#### 4.3.3. Commands (`commands/`)
*   **`CheckCampaignBudgetCommand`**
    *   Properties: `correlationId: string`, `campaignId: string`, `merchantId: string`, `budgetAmount: number`, `currency: string`.
*   **`PrepareProductFeedCommand`**
    *   Properties: `correlationId: string`, `campaignId: string`, `merchantId: string`, `productCatalogId: string`, `targetAdNetworkIds: string[]`.
*   **`PublishCampaignToAdNetworkCommand`**
    *   Properties: `correlationId: string`, `campaignId: string`, `merchantId: string`, `adNetworkId: string`, `campaignDetails: any` (name, budget, schedule, targeting), `creativeDetails: any[]`, `productFeedUrl?: string`.
*   **`UpdateCampaignOverallStatusCommand`**
    *   Properties: `correlationId: string`, `campaignId: string`, `newStatus: string` (e.g., 'ACTIVE', 'PUBLISH_FAILED', 'PARTIALLY_PUBLISHED'), `publishedNetworkDetails?: Array<{adNetworkId: string, externalCampaignId?: string, status: string, message?: string}>`.
*   **(Compensating Commands - to be defined as needed)**
    *   `ReleaseReservedBudgetCommand` (to Billing)
    *   `CleanUpProductFeedResourcesCommand` (to Product Catalog)
    *   `DeleteCampaignFromAdNetworkCommand` (to Ad Network Integration)

*All DTOs should use `class-validator` for basic validation if they might be received over network calls, though for internal SQS/SNS messages, strict typing is primary.*

### 4.4. Service Adapters (`services/`)

#### 4.4.1. Interfaces (`interfaces/`)
*   **`IBillingAdapter` (`billing.adapter.interface.ts`)**
    *   `checkCampaignBudget(command: CheckCampaignBudgetCommand): Promise<void>;`
    *   `releaseReservedBudget(command: ReleaseReservedBudgetCommand): Promise<void>;` (if compensation needed)
*   **`IProductCatalogAdapter` (`product-catalog.adapter.interface.ts`)**
    *   `prepareProductFeed(command: PrepareProductFeedCommand): Promise<void>;`
    *   `cleanUpProductFeedResources(command: CleanUpProductFeedResourcesCommand): Promise<void>;` (if compensation needed)
*   **`IAdNetworkIntegrationAdapter` (`ad-network.adapter.interface.ts`)**
    *   `publishCampaign(command: PublishCampaignToAdNetworkCommand): Promise<void>;`
    *   `deleteCampaign(command: DeleteCampaignFromAdNetworkCommand): Promise<void>;`
*   **`ICampaignManagementAdapter` (`campaign-management.adapter.interface.ts`)**
    *   `updateCampaignStatus(command: UpdateCampaignOverallStatusCommand): Promise<void>;`

#### 4.4.2. Implementations (`adapters/`)
Each adapter implementation (e.g., `BillingAdapter.ts`) will:
*   Inject `ConfigService` (from `@nestjs/config`) to get queue URLs/topic ARNs from `CampaignPublishingConfig`.
*   Inject an SQS or SNS client (`AWS.SQS` or `AWS.SNS` instance from `aws-sdk`). This client should be configured globally or within this module.
*   Implement the interface methods by:
    *   Serializing the command/event DTO to a JSON string.
    *   Publishing the message to the appropriate SQS queue (for commands to a specific service) or SNS topic (for broadcasting events).
    *   Including the `correlationId` in the message attributes or payload for replies.
    *   Specifying the `ReplyQueueUrl` (the saga's own reply queue) in message attributes if using a request-reply pattern over SQS.
    *   Logging the dispatch of the command/event.
    *   Handling potential errors during message publishing (e.g., network issues, AWS SDK errors) with appropriate retries or logging.

Example for `BillingAdapter.ts`:
typescript
import { Injectable, Logger } from '@nestjs/common';
import { SQS } from 'aws-sdk'; // Or @aws-sdk/client-sqs
import { ConfigService } from '@nestjs/config';
import { IBillingAdapter } from '../interfaces/billing.adapter.interface';
import { CheckCampaignBudgetCommand } from '../../messages/commands/check-campaign-budget.command';
// import { ReleaseReservedBudgetCommand } from '../../messages/commands/release-reserved-budget.command'; // If needed
import { CampaignPublishingConfig } from '../../config/campaign-publishing.config';

@Injectable()
export class BillingAdapter implements IBillingAdapter {
  private readonly logger = new Logger(BillingAdapter.name);
  private readonly sqs: SQS;
  private readonly billingCommandQueueUrl: string;
  private readonly sagaReplyQueueUrl: string;

  constructor(private readonly configService: ConfigService<CampaignPublishingConfig, true>) {
    this.sqs = new SQS({ region: this.configService.get('AWS_REGION', { infer: true }) });
    this.billingCommandQueueUrl = this.configService.get('BILLING_COMMAND_QUEUE_URL', { infer: true });
    this.sagaReplyQueueUrl = this.configService.get('SAGA_REPLY_QUEUE_URL', { infer: true });
  }

  async checkCampaignBudget(command: CheckCampaignBudgetCommand): Promise<void> {
    this.logger.log(`Sending CheckCampaignBudgetCommand for campaign ${command.campaignId} (correlation: ${command.correlationId})`);
    try {
      await this.sqs.sendMessage({
        QueueUrl: this.billingCommandQueueUrl,
        MessageBody: JSON.stringify(command),
        MessageAttributes: {
          CorrelationId: { DataType: 'String', StringValue: command.correlationId },
          ReplyQueueUrl: { DataType: 'String', StringValue: this.sagaReplyQueueUrl },
          CommandType: { DataType: 'String', StringValue: CheckCampaignBudgetCommand.name },
        }
      }).promise();
    } catch (error) {
      this.logger.error(`Failed to send CheckCampaignBudgetCommand for campaign ${command.campaignId}`, error.stack);
      // Consider rethrowing or specific error handling
      throw error;
    }
  }

  // async releaseReservedBudget(command: ReleaseReservedBudgetCommand): Promise<void> { ... }
}


### 4.5. Event Listeners (`listeners/sqs-event.listener.ts`)

This component will listen to the `SAGA_REPLY_QUEUE_URL` for messages from participant services.

typescript
import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler, SqsConsumerEventHandler } from '@ssut/nestjs-sqs'; // Example, or use direct AWS SDK polling
import { Message } from '@aws-sdk/client-sqs'; // Or from aws-sdk v2
import { CampaignPublishingSaga } from '../sagas/campaign-publishing.saga';
import { BillingCheckSuccessfulEvent, BillingCheckFailedEvent /* ... other reply events */ } from '../messages/events/inputs';
import { CampaignPublishingConfig } from '../config/campaign-publishing.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SqsReplyListener {
  private readonly logger = new Logger(SqsReplyListener.name);
  // private readonly sagaReplyQueueUrl: string; // Used if polling manually

  constructor(
    private readonly campaignPublishingSaga: CampaignPublishingSaga,
    // private readonly configService: ConfigService<CampaignPublishingConfig, true>
  ) {
    // this.sagaReplyQueueUrl = this.configService.get('SAGA_REPLY_QUEUE_URL', { infer: true });
    // If not using a library like @ssut/nestjs-sqs, manual polling setup would go here or in an onModuleInit
  }

  // Example using @ssut/nestjs-sqs decorator.
  // The queue name here would be configured to match SAGA_REPLY_QUEUE_URL's name part.
  @SqsMessageHandler(process.env.SAGA_REPLY_QUEUE_NAME || 'saga-reply-queue', false /* autoDelete = false */)
  async handleMessage(message: Message) {
    this.logger.log(`Received SQS message: ${message.MessageId}`);
    if (!message.Body || !message.MessageAttributes || !message.MessageAttributes.CorrelationId || !message.MessageAttributes.EventType) {
      this.logger.error('Invalid SQS message structure. Missing Body, MessageAttributes, CorrelationId, or EventType.', message);
      // Potentially move to DLQ or log and skip
      return;
    }

    const correlationId = message.MessageAttributes.CorrelationId.StringValue;
    const eventType = message.MessageAttributes.EventType.StringValue;
    let eventPayload: any;

    try {
      eventPayload = JSON.parse(message.Body);
    } catch (error) {
      this.logger.error(`Failed to parse SQS message body for correlationId ${correlationId}`, error.stack);
      return;
    }

    this.logger.log(`Processing event type: ${eventType} for correlationId: ${correlationId}`);

    // Route to appropriate saga handler based on eventType
    // This routing logic might be more sophisticated in a real app (e.g., a map of event types to handlers)
    try {
        switch (eventType) {
            case BillingCheckSuccessfulEvent.name:
                await this.campaignPublishingSaga.handleBillingCheckResponse(correlationId, eventPayload as BillingCheckSuccessfulEvent);
                break;
            case BillingCheckFailedEvent.name:
                await this.campaignPublishingSaga.handleBillingCheckResponse(correlationId, eventPayload as BillingCheckFailedEvent);
                break;
            // ... other cases for ProductFeedReadyEvent, AdNetworkPublishSuccessfulEvent etc.
            // case ProductFeedReadyEvent.name:
            //    await this.campaignPublishingSaga.handleProductFeedResponse(correlationId, eventPayload as ProductFeedReadyEvent);
            //    break;
            // ...
            default:
                this.logger.warn(`Unknown event type received: ${eventType} for correlationId: ${correlationId}`);
        }
        // Message should be deleted from SQS queue upon successful processing.
        // If using @ssut/nestjs-sqs, this is often handled by the library if handler doesn't throw.
        // If polling manually, explicit deletion is needed.
    } catch (error) {
        this.logger.error(`Error processing event ${eventType} for correlationId ${correlationId}:`, error.stack);
        // Do NOT delete message from queue if processing failed, allow SQS redrive policy to handle it.
        throw error; // Re-throw to let @ssut/nestjs-sqs know processing failed
    }
  }

  // If not using @ssut/nestjs-sqs, you'd have methods like:
  // async pollReplyQueue(): Promise<void> { /* AWS SDK SQS.receiveMessage loop */ }
  // And call individual handlers based on message attributes.
}

*Note: The `@ssut/nestjs-sqs` library is an example. A custom polling mechanism using `aws-sdk` directly within a NestJS `Interval` or `Cron` job could also be implemented if a dedicated library is not preferred. Message attributes like `EventType` and `CorrelationId` will be crucial for routing.*

### 4.6. Configuration (`config/campaign-publishing.config.ts`)
This file will leverage NestJS's `ConfigModule` and `ConfigService`. Environment variables will be the source of truth.

typescript
import { registerAs } from '@nestjs/config';

export interface CampaignPublishingSagaConfig {
  AWS_REGION: string;
  SAGA_STATE_DB_HOST?: string; // For TypeORM if saga state is in DB
  SAGA_STATE_DB_PORT?: number;
  SAGA_STATE_DB_USER?: string;
  SAGA_STATE_DB_PASSWORD?: string;
  SAGA_STATE_DB_NAME?: string;
  SAGA_REPLY_QUEUE_URL: string;       // Queue this service listens to for replies
  SAGA_REPLY_QUEUE_NAME?: string;      // Name part of SAGA_REPLY_QUEUE_URL, if using @ssut/nestjs-sqs
  BILLING_COMMAND_QUEUE_URL: string;  // Queue for commands to Billing.Service
  PRODUCT_CATALOG_COMMAND_QUEUE_URL: string; // Queue for commands to ProductCatalog.Service
  AD_NETWORK_COMMAND_QUEUE_URL: string; // Queue for commands to AdNetworkIntegration.Service
  CAMPAIGN_MANAGEMENT_COMMAND_QUEUE_URL: string; // Queue for commands to CampaignManagement.Service
  CAMPAIGN_PUBLISHED_TOPIC_ARN: string; // SNS Topic for success events
  CAMPAIGN_PUBLISH_FAILED_TOPIC_ARN: string; // SNS Topic for failure events
}

export default registerAs('campaignPublishingSaga', (): CampaignPublishingSagaConfig => ({
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  SAGA_STATE_DB_HOST: process.env.SAGA_STATE_DB_HOST,
  SAGA_STATE_DB_PORT: parseInt(process.env.SAGA_STATE_DB_PORT, 10),
  SAGA_STATE_DB_USER: process.env.SAGA_STATE_DB_USER,
  SAGA_STATE_DB_PASSWORD: process.env.SAGA_STATE_DB_PASSWORD,
  SAGA_STATE_DB_NAME: process.env.SAGA_STATE_DB_NAME,
  SAGA_REPLY_QUEUE_URL: process.env.SAGA_REPLY_QUEUE_URL,
  SAGA_REPLY_QUEUE_NAME: process.env.SAGA_REPLY_QUEUE_NAME,
  BILLING_COMMAND_QUEUE_URL: process.env.BILLING_COMMAND_QUEUE_URL,
  PRODUCT_CATALOG_COMMAND_QUEUE_URL: process.env.PRODUCT_CATALOG_COMMAND_QUEUE_URL,
  AD_NETWORK_COMMAND_QUEUE_URL: process.env.AD_NETWORK_COMMAND_QUEUE_URL,
  CAMPAIGN_MANAGEMENT_COMMAND_QUEUE_URL: process.env.CAMPAIGN_MANAGEMENT_COMMAND_QUEUE_URL,
  CAMPAIGN_PUBLISHED_TOPIC_ARN: process.env.CAMPAIGN_PUBLISHED_TOPIC_ARN,
  CAMPAIGN_PUBLISH_FAILED_TOPIC_ARN: process.env.CAMPAIGN_PUBLISH_FAILED_TOPIC_ARN,
}));

// This would be loaded in app.module.ts or campaign-publishing-saga.module.ts
// And accessed via ConfigService<CampaignPublishingSagaConfig, true>

A `.env.example` file should list these variables.

### 4.7. Exception Handling (`exceptions/saga-execution.exception.ts`)
typescript
import { HttpException, HttpStatus } from '@nestjs/common';

export class SagaExecutionException extends HttpException {
  constructor(
    message: string,
    public readonly sagaInstanceId: string,
    public readonly step: string, // e.g., SagaState enum value or descriptive step name
    public readonly internalErrorCode?: string, // Optional internal code
    cause?: Error,
  ) {
    super(
      HttpException.createBody(message, `Saga Execution Error: ${internalErrorCode || 'SAGA_STEP_FAILED'}`, HttpStatus.INTERNAL_SERVER_ERROR),
      HttpStatus.INTERNAL_SERVER_ERROR,
      { cause }
    );
  }
}


### 4.8. Constants (`campaign-publishing-saga.constants.ts`)
typescript
export const CAMPAIGN_PUBLISHING_SAGA_CONSTANTS = {
  // Saga States (already defined in SagaState enum, but could have other constants here)
  // Event Names (can be derived from DTO class names, e.g., CampaignCreationRequestedEvent.name)
  MESSAGE_ATTRIBUTE_EVENT_TYPE: 'EventType',
  MESSAGE_ATTRIBUTE_CORRELATION_ID: 'CorrelationId',
  MESSAGE_ATTRIBUTE_REPLY_QUEUE_URL: 'ReplyQueueUrl',
  MESSAGE_ATTRIBUTE_COMMAND_TYPE: 'CommandType',

  // Service Identifiers or Tokens for Injection (if needed)
  BILLING_ADAPTER_TOKEN: 'IBillingAdapter',
  PRODUCT_CATALOG_ADAPTER_TOKEN: 'IProductCatalogAdapter',
  AD_NETWORK_ADAPTER_TOKEN: 'IAdNetworkIntegrationAdapter',
  CAMPAIGN_MANAGEMENT_ADAPTER_TOKEN: 'ICampaignManagementAdapter',
};


## 5. Module Structure and Dependencies

### 5.1. `AppModule` (`src/app.module.ts`)
typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignPublishingSagaModule } from './campaign-publishing-saga/campaign-publishing-saga.module';
import campaignPublishingSagaConfig, { CampaignPublishingSagaConfig } from './campaign-publishing-saga/config/campaign-publishing.config';
import { CampaignPublishingSagaInstance } from './campaign-publishing-saga/state/entities/campaign-publishing-saga-instance.entity';
// If using @ssut/nestjs-sqs
// import { SqsModule } from '@ssut/nestjs-sqs';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [campaignPublishingSagaConfig],
      // Add validation schema if desired (e.g., using Joi)
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<CampaignPublishingSagaConfig, true>) => ({
        type: 'postgres', // or your chosen DB type
        host: configService.get('SAGA_STATE_DB_HOST', { infer: true }),
        port: configService.get('SAGA_STATE_DB_PORT', { infer: true }),
        username: configService.get('SAGA_STATE_DB_USER', { infer: true }),
        password: configService.get('SAGA_STATE_DB_PASSWORD', { infer: true }),
        database: configService.get('SAGA_STATE_DB_NAME', { infer: true }),
        entities: [CampaignPublishingSagaInstance],
        synchronize: process.env.NODE_ENV !== 'production', // Set to false in production
        autoLoadEntities: true, // Alternative to listing entities explicitly
      }),
    }),
    // If using @ssut/nestjs-sqs for listening to replies
    // SqsModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService<CampaignPublishingSagaConfig, true>) => {
    //     return {
    //       consumers: [
    //         {
    //           name: configService.get('SAGA_REPLY_QUEUE_NAME', { infer: true }) || 'saga-reply-queue', // Queue name
    //           queueUrl: configService.get('SAGA_REPLY_QUEUE_URL', { infer: true }),
    //           region: configService.get('AWS_REGION', { infer: true }),
    //           // batchSize: 10, // optional
    //           // visibilityTimeout: 30, // optional
    //           // authenticationErrorTimeout: 10000, // optional
    //         },
    //       ],
    //       producers: [], // SQS producers can be instantiated directly using AWS SDK
    //     };
    //   },
    // }),
    CampaignPublishingSagaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}


### 5.2. `CampaignPublishingSagaModule` (`src/campaign-publishing-saga/campaign-publishing-saga.module.ts`)
typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter'; // For internal eventing or SNS publishing abstraction
import { CampaignPublishingSaga } from './sagas/campaign-publishing.saga';
import { CampaignPublishingSagaInstance } from './state/entities/campaign-publishing-saga-instance.entity';
import { CampaignPublishingSagaInstanceRepository } from './state/repositories/campaign-publishing-saga-instance.repository';
import { SqsReplyListener } from './listeners/sqs-event.listener'; // Or SnsEventListener if saga is triggered by SNS
import { BillingAdapter } from './services/adapters/billing.adapter';
import { ProductCatalogAdapter } from './services/adapters/product-catalog.adapter';
import { AdNetworkIntegrationAdapter } from './services/adapters/ad-network.adapter';
import { CampaignManagementAdapter } from './services/adapters/campaign-management.adapter';
import { CAMPAIGN_PUBLISHING_SAGA_CONSTANTS } from './campaign-publishing-saga.constants';

// It's good practice to use tokens for adapter interfaces
const adapters = [
  { provide: CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.BILLING_ADAPTER_TOKEN, useClass: BillingAdapter },
  { provide: CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.PRODUCT_CATALOG_ADAPTER_TOKEN, useClass: ProductCatalogAdapter },
  { provide: CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.AD_NETWORK_ADAPTER_TOKEN, useClass: AdNetworkIntegrationAdapter },
  { provide: CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.CAMPAIGN_MANAGEMENT_ADAPTER_TOKEN, useClass: CampaignManagementAdapter },
];


@Module({
  imports: [
    ConfigModule, // Already global, but can be imported if scoped config is needed
    TypeOrmModule.forFeature([CampaignPublishingSagaInstance]),
    EventEmitterModule.forRoot(), // if using NestJS event emitter for local events or as a wrapper for SNS
  ],
  providers: [
    CampaignPublishingSaga,
    CampaignPublishingSagaInstanceRepository,
    SqsReplyListener, // This listener will process incoming SQS messages
    ...adapters,
  ],
  // If CampaignPublishingSaga is triggered by an HTTP endpoint (less common for orchestrators)
  // controllers: [CampaignPublishingController],
  exports: [CampaignPublishingSaga], // If other modules need to interact with it directly (unlikely)
})
export class CampaignPublishingSagaModule {}


## 6. Non-Functional Requirements Integration
*   **Reliability:** Achieved through persistent saga state, SQS/SNS dead-letter queues (DLQs), compensating transactions, and retry mechanisms in adapters.
*   **Scalability:** Stateless saga orchestrator instances can be scaled horizontally. SQS queues decouple services and manage load.
*   **Maintainability:** Clear separation of concerns (saga logic, state, adapters, messages). Typed DTOs and interfaces. Configuration driven.
*   **Observability:** Structured logging within saga steps, adapters, and listeners. Key saga events (start, step completion/failure, compensation, final outcome) should be logged with correlation IDs. CloudWatch metrics for queue lengths, processing times, error rates.

## 7. Data Models
The primary data model managed by this service is `CampaignPublishingSagaInstance`, detailed in section 4.2.1. No other primary data entities are owned by this orchestrator.

## 8. API Design
This service does not expose public HTTP APIs directly for saga operations. It primarily interacts via:
*   **Input:** Consuming events (e.g., `CampaignCreationRequestedEvent`) from an SQS queue or SNS topic that triggers a new saga. Consuming reply events from participant services via a dedicated SQS reply queue.
*   **Output:** Sending commands to participant services via their SQS command queues. Publishing final saga outcome events (`CampaignPublishingCompletedEvent`, `CampaignPublishingFailedEvent`) to SNS topics.

## 9. Deployment Considerations
*   The service will be deployed as a Docker container, managed by Amazon EKS/ECS.
*   Environment variables (as defined in `CampaignPublishingConfig`) must be configured for each deployment environment (dev, staging, prod).
*   IAM roles for the service instances must grant necessary permissions for SQS, SNS, and TypeORM database access (if applicable).
*   SQS Queues (command queues for each participant, one reply queue for the saga) and SNS Topics (for saga outcomes) must be pre-provisioned with appropriate configurations (e.g., visibility timeouts, redrive policies for DLQs).

## 10. Testing Strategy
*   **Unit Tests:**
    *   `CampaignPublishingSaga`: Test state transitions, command dispatch logic, reply event handling, and compensation logic for each step. Mock adapter dependencies and `CampaignPublishingSagaInstanceRepository`.
    *   Adapters: Test message formatting and interaction with SQS/SNS clients (mock AWS SDK).
    *   `CampaignPublishingSagaInstanceRepository`: Test CRUD operations (mock TypeORM `Repository`).
    *   Event Listeners: Test message parsing and routing to saga methods.
*   **Integration Tests:**
    *   Test the full saga flow by running an in-memory version of SQS/SNS (e.g., using `localstack` or similar) and mock implementations of participant services that respond with predefined success/failure events.
    *   Test saga state persistence and retrieval with an in-memory database or a test database instance.
*   **End-to-End Tests (Larger Scope):** While mostly outside this specific service's scope, tests involving this orchestrator interacting with actual deployed participant services in a test environment would be valuable.

## 11. Logging and Monitoring
*   **Logging:**
    *   Use NestJS `Logger` service.
    *   Log entry and exit of all major saga methods with `correlationId` and `campaignId`.
    *   Log dispatch of commands and publication of events with payload summaries.
    *   Log receipt and processing of reply events.
    *   Log initiation and outcome of compensation steps.
    *   Log all errors and exceptions with stack traces and relevant context.
    *   Logs should be structured (JSON) for easier parsing in CloudWatch Logs.
*   **Monitoring (CloudWatch Metrics):**
    *   Number of active saga instances.
    *   Number of sagas started/completed/failed per unit of time.
    *   Duration of saga execution (average, p95, p99).
    *   Error rates for saga steps.
    *   SQS Queue depths (for reply queue and command queues this service sends to).
    *   SNS message publishing rates.
    *   Database query latency for saga state.

