import { Injectable, Logger, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CampaignPublishingSagaInstanceRepository } from '../state/repositories/campaign-publishing-saga-instance.repository';
import { SagaState, CampaignPublishingSagaInstance, AdNetworkPublicationDetail } from '../state/entities/campaign-publishing-saga-instance.entity';
import { CampaignCreationRequestedEvent } from '../messages/events/inputs/campaign-creation-requested.event';
import { BillingCheckSuccessfulEvent } from '../messages/events/inputs/billing-check-successful.event';
import { BillingCheckFailedEvent } from '../messages/events/inputs/billing-check-failed.event';
import { ProductFeedReadyEvent } from '../messages/events/inputs/product-feed-ready.event';
import { ProductFeedPreparationFailedEvent } from '../messages/events/inputs/product-feed-preparation-failed.event';
import { AdNetworkPublishSuccessfulEvent } from '../messages/events/inputs/ad-network-publish-successful.event';
import { AdNetworkPublishFailedEvent } from '../messages/events/inputs/ad-network-publish-failed.event';
import { CampaignStatusUpdateSuccessfulEvent } from '../messages/events/inputs/campaign-status-update-successful.event';
import { CampaignStatusUpdateFailedEvent } from '../messages/events/inputs/campaign-status-update-failed.event';
import { CampaignPublishingCompletedEvent } from '../messages/events/outputs/campaign-publishing-completed.event';
import { CampaignPublishingFailedEvent } from '../messages/events/outputs/campaign-publishing-failed.event';
import { CheckCampaignBudgetCommand } from '../messages/commands/check-campaign-budget.command';
import { PrepareProductFeedCommand } from '../messages/commands/prepare-product-feed.command';
import { PublishCampaignToAdNetworkCommand } from '../messages/commands/publish-campaign-to-ad-network.command';
import { UpdateCampaignOverallStatusCommand } from '../messages/commands/update-campaign-overall-status.command';
import { ReleaseReservedBudgetCommand } from '../messages/commands/release-reserved-budget.command';
import { CleanUpProductFeedResourcesCommand } from '../messages/commands/clean-up-product-feed-resources.command';
import { DeleteCampaignFromAdNetworkCommand } from '../messages/commands/delete-campaign-from-ad-network.command';
import { IBillingAdapter } from '../services/interfaces/billing.adapter.interface';
import { IProductCatalogAdapter } from '../services/interfaces/product-catalog.adapter.interface';
import { IAdNetworkIntegrationAdapter } from '../services/interfaces/ad-network.adapter.interface';
import { ICampaignManagementAdapter } from '../services/interfaces/campaign-management.adapter.interface';
import { CAMPAIGN_PUBLISHING_SAGA_CONSTANTS } from '../campaign-publishing-saga.constants';
import { SagaExecutionException } from '../exceptions/saga-execution.exception';
import { v4 as uuidv4 } from 'uuid'; // For correlationId if not provided

@Injectable()
export class CampaignPublishingSaga {
  private readonly logger = new Logger(CampaignPublishingSaga.name);

  constructor(
    private readonly sagaInstanceRepository: CampaignPublishingSagaInstanceRepository,
    private readonly eventEmitter: EventEmitter2,
    @Inject(CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.BILLING_ADAPTER_TOKEN)
    private readonly billingAdapter: IBillingAdapter,
    @Inject(CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.PRODUCT_CATALOG_ADAPTER_TOKEN)
    private readonly productCatalogAdapter: IProductCatalogAdapter,
    @Inject(CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.AD_NETWORK_ADAPTER_TOKEN)
    private readonly adNetworkAdapter: IAdNetworkIntegrationAdapter,
    @Inject(CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.CAMPAIGN_MANAGEMENT_ADAPTER_TOKEN)
    private readonly campaignMgmtAdapter: ICampaignManagementAdapter,
  ) {}

  async startSaga(data: CampaignCreationRequestedEvent): Promise<void> {
    const correlationId = data.campaignId || uuidv4(); // Use campaignId as correlationId or generate new
    this.logger.log(`Starting Campaign Publishing Saga for campaign ${data.campaignId}, correlationId: ${correlationId}`);

    let instance: CampaignPublishingSagaInstance;
    try {
      instance = await this.sagaInstanceRepository.createInstance({
        campaignId: data.campaignId,
        merchantId: data.merchantId,
        correlationId,
        initialPayload: data,
      });
    } catch (error) {
        this.logger.error(`Failed to create saga instance for campaign ${data.campaignId}, correlationId: ${correlationId}`, error.stack);
        // Depending on requirements, could throw or emit a specific failure event immediately
        throw new SagaExecutionException('Failed to initialize saga state', correlationId, 'SAGA_INIT', 'DB_ERROR', error);
    }


    try {
      await this.sagaInstanceRepository.updateState(instance.id, SagaState.PENDING_BILLING_CHECK);
      this.logger.log(`[${correlationId}] Saga state updated to PENDING_BILLING_CHECK.`);

      const command = new CheckCampaignBudgetCommand();
      command.correlationId = correlationId;
      command.campaignId = data.campaignId;
      command.merchantId = data.merchantId;
      // Assuming budgetDetails contains amount and currency as per CheckCampaignBudgetCommand definition
      command.budgetAmount = data.budgetDetails?.amount;
      command.currency = data.budgetDetails?.currency;

      await this.billingAdapter.checkCampaignBudget(command);
      this.logger.log(`[${correlationId}] Dispatched CheckCampaignBudgetCommand.`);
    } catch (error) {
      this.logger.error(`[${correlationId}] Error in startSaga during PENDING_BILLING_CHECK: ${error.message}`, error.stack);
      await this.handleSagaFailure(instance, SagaState.PENDING_BILLING_CHECK, error.message);
    }
  }

  async handleBillingCheckResponse(correlationId: string, response: BillingCheckSuccessfulEvent | BillingCheckFailedEvent): Promise<void> {
    this.logger.log(`[${correlationId}] Received billing check response. Event: ${response.constructor.name}`);
    const instance = await this.loadSagaInstance(correlationId, 'handleBillingCheckResponse');
    if (!instance) return;

    if (instance.currentState !== SagaState.PENDING_BILLING_CHECK) {
        this.logger.warn(`[${correlationId}] Received billing check response for saga not in PENDING_BILLING_CHECK state. Current state: ${instance.currentState}. Ignoring.`);
        return;
    }

    try {
      if (response instanceof BillingCheckSuccessfulEvent) {
        await this.sagaInstanceRepository.updateState(instance.id, SagaState.PENDING_PRODUCT_FEED_PREP);
        this.logger.log(`[${correlationId}] Billing check successful. Saga state updated to PENDING_PRODUCT_FEED_PREP.`);

        const initialRequest = instance.payload.initialRequest as CampaignCreationRequestedEvent;
        const command = new PrepareProductFeedCommand();
        command.correlationId = correlationId;
        command.campaignId = instance.campaignId;
        command.merchantId = instance.merchantId;
        command.productCatalogId = initialRequest.productCatalogId;
        command.targetAdNetworkIds = initialRequest.targetAdNetworkIds;

        await this.productCatalogAdapter.prepareProductFeed(command);
        this.logger.log(`[${correlationId}] Dispatched PrepareProductFeedCommand.`);
      } else if (response instanceof BillingCheckFailedEvent) {
        this.logger.error(`[${correlationId}] Billing check failed. Reason: ${response.reason}`);
        await this.handleSagaFailure(instance, SagaState.PENDING_BILLING_CHECK, response.reason);
      }
    } catch (error) {
      this.logger.error(`[${correlationId}] Error processing billing check response: ${error.message}`, error.stack);
      await this.handleSagaFailure(instance, instance.currentState, error.message); // Use current state as failed step
    }
  }

  async handleProductFeedResponse(correlationId: string, response: ProductFeedReadyEvent | ProductFeedPreparationFailedEvent): Promise<void> {
    this.logger.log(`[${correlationId}] Received product feed response. Event: ${response.constructor.name}`);
    const instance = await this.loadSagaInstance(correlationId, 'handleProductFeedResponse');
    if (!instance) return;

    if (instance.currentState !== SagaState.PENDING_PRODUCT_FEED_PREP) {
        this.logger.warn(`[${correlationId}] Received product feed response for saga not in PENDING_PRODUCT_FEED_PREP state. Current state: ${instance.currentState}. Ignoring.`);
        return;
    }

    try {
      if (response instanceof ProductFeedReadyEvent) {
        this.logger.log(`[${correlationId}] Product feed ready. Compliance status: ${JSON.stringify(response.feedComplianceStatus)}`);
        
        const initialRequest = instance.payload.initialRequest as CampaignCreationRequestedEvent;
        const compliantAdNetworks = initialRequest.targetAdNetworkIds.filter(
          networkId => response.feedComplianceStatus[networkId]?.compliant
        );

        if (compliantAdNetworks.length === 0) {
          this.logger.error(`[${correlationId}] No compliant ad networks for product feed. Failing saga.`);
          await this.compensateBillingCheck(instance, 'No compliant ad networks');
          await this.handleSagaFailure(instance, SagaState.PENDING_PRODUCT_FEED_PREP, 'Product feed not compliant for any target network.');
          return;
        }

        const updatedPayload = { ...instance.payload, compliantAdNetworks, feedComplianceStatus: response.feedComplianceStatus };
        await this.sagaInstanceRepository.updateState(instance.id, SagaState.PENDING_AD_NETWORK_PUBLISH, updatedPayload);
        this.logger.log(`[${correlationId}] Saga state updated to PENDING_AD_NETWORK_PUBLISH. Compliant networks: ${compliantAdNetworks.join(', ')}`);

        // Initialize adNetworkPublishStatus
        const adNetworkPublishStatus: Record<string, AdNetworkPublicationDetail> = {};
        compliantAdNetworks.forEach(networkId => {
            adNetworkPublishStatus[networkId] = { status: 'PENDING', timestamp: new Date() };
        });
        instance.adNetworkPublishStatus = adNetworkPublishStatus; // For local check
        await this.sagaInstanceRepository.updateAdNetworkStatus(instance.id, null, adNetworkPublishStatus as any); // Saves the whole object

        for (const adNetworkId of compliantAdNetworks) {
          const command = new PublishCampaignToAdNetworkCommand();
          command.correlationId = correlationId;
          command.campaignId = instance.campaignId;
          command.merchantId = instance.merchantId;
          command.adNetworkId = adNetworkId;
          command.campaignDetails = initialRequest.campaignDetails;
          // command.creativeDetails = initialRequest.creativeDetails; // Assuming creativeDetails is part of campaignDetails or initialRequest
          command.productFeedUrl = response.feedComplianceStatus[adNetworkId]?.feedUrl;

          await this.adNetworkAdapter.publishCampaign(command);
          this.logger.log(`[${correlationId}] Dispatched PublishCampaignToAdNetworkCommand for network ${adNetworkId}.`);
        }

      } else if (response instanceof ProductFeedPreparationFailedEvent) {
        this.logger.error(`[${correlationId}] Product feed preparation failed. Reason: ${response.reason}`);
        await this.sagaInstanceRepository.updateState(instance.id, SagaState.COMPENSATING);
        await this.compensateBillingCheck(instance, response.reason);
        // Assuming compensation for billing is synchronous or fire-and-forget for this flow
        await this.handleSagaFailure(instance, SagaState.PENDING_PRODUCT_FEED_PREP, response.reason);
      }
    } catch (error) {
      this.logger.error(`[${correlationId}] Error processing product feed response: ${error.message}`, error.stack);
       await this.sagaInstanceRepository.updateState(instance.id, SagaState.COMPENSATING);
       await this.compensateBillingCheck(instance, `Error after product feed prep: ${error.message}`);
       await this.handleSagaFailure(instance, SagaState.PENDING_PRODUCT_FEED_PREP, error.message);
    }
  }

  async handleAdNetworkPublishResponse(correlationId: string, response: AdNetworkPublishSuccessfulEvent | AdNetworkPublishFailedEvent): Promise<void> {
    this.logger.log(`[${correlationId}] Received ad network publish response for network ${response.adNetworkId}. Event: ${response.constructor.name}`);
    const instance = await this.loadSagaInstance(correlationId, 'handleAdNetworkPublishResponse');
    if (!instance) return;

    if (instance.currentState !== SagaState.PENDING_AD_NETWORK_PUBLISH) {
        this.logger.warn(`[${correlationId}] Received ad network publish response for saga not in PENDING_AD_NETWORK_PUBLISH state. Current state: ${instance.currentState}. Ignoring.`);
        return;
    }

    try {
      const adNetworkDetail: AdNetworkPublicationDetail = {
        status: response instanceof AdNetworkPublishSuccessfulEvent ? 'SUCCESS' : 'FAILURE',
        timestamp: new Date(),
      };
      if (response instanceof AdNetworkPublishSuccessfulEvent) {
        adNetworkDetail.externalCampaignId = response.externalCampaignId;
      } else if (response instanceof AdNetworkPublishFailedEvent) {
        adNetworkDetail.failureReason = response.reason;
      }
      await this.sagaInstanceRepository.updateAdNetworkStatus(instance.id, response.adNetworkId, adNetworkDetail);
      // Reload instance to get the latest adNetworkPublishStatus
      const updatedInstance = await this.sagaInstanceRepository.findByCorrelationId(correlationId);
      if(!updatedInstance) {
        this.logger.error(`[${correlationId}] Saga instance disappeared after ad network status update. Critical error.`);
        throw new SagaExecutionException('Saga instance not found after update', correlationId, 'HANDLE_AD_NETWORK_RESPONSE');
      }


      const compliantAdNetworks = updatedInstance.payload.compliantAdNetworks as string[];
      const allResponded = compliantAdNetworks.every(
        networkId => updatedInstance.adNetworkPublishStatus && updatedInstance.adNetworkPublishStatus[networkId]?.status !== 'PENDING'
      );

      if (allResponded) {
        this.logger.log(`[${correlationId}] All targeted ad networks have responded.`);
        const successfulPublications = compliantAdNetworks.filter(
          networkId => updatedInstance.adNetworkPublishStatus[networkId]?.status === 'SUCCESS'
        );

        if (successfulPublications.length > 0) {
          await this.sagaInstanceRepository.updateState(updatedInstance.id, SagaState.PENDING_CAMPAIGN_STATUS_UPDATE);
          this.logger.log(`[${correlationId}] At least one ad network publish successful. Saga state updated to PENDING_CAMPAIGN_STATUS_UPDATE.`);

          const command = new UpdateCampaignOverallStatusCommand();
          command.correlationId = correlationId;
          command.campaignId = updatedInstance.campaignId;
          command.newStatus = successfulPublications.length === compliantAdNetworks.length ? 'ACTIVE' : 'PARTIALLY_PUBLISHED';
          command.publishedNetworkDetails = compliantAdNetworks.map(networkId => ({
            adNetworkId: networkId,
            externalCampaignId: updatedInstance.adNetworkPublishStatus[networkId]?.externalCampaignId,
            status: updatedInstance.adNetworkPublishStatus[networkId]?.status,
            message: updatedInstance.adNetworkPublishStatus[networkId]?.failureReason,
          }));
          await this.campaignMgmtAdapter.updateCampaignStatus(command);
          this.logger.log(`[${correlationId}] Dispatched UpdateCampaignOverallStatusCommand with status ${command.newStatus}.`);

        } else {
          this.logger.error(`[${correlationId}] All ad network publications failed.`);
          await this.sagaInstanceRepository.updateState(updatedInstance.id, SagaState.COMPENSATING);
          await this.compensateProductFeedPrep(updatedInstance, 'All ad network publications failed');
          await this.compensateBillingCheck(updatedInstance, 'All ad network publications failed');
          await this.handleSagaFailure(updatedInstance, SagaState.PENDING_AD_NETWORK_PUBLISH, 'All ad network publications failed.');
        }
      } else {
         this.logger.log(`[${correlationId}] Waiting for more ad network responses. Current status: ${JSON.stringify(updatedInstance.adNetworkPublishStatus)}`);
      }
    } catch (error) {
      this.logger.error(`[${correlationId}] Error processing ad network publish response: ${error.message}`, error.stack);
      const currentInstance = await this.loadSagaInstance(correlationId, 'handleAdNetworkPublishResponse_error');
      if (currentInstance) {
        await this.sagaInstanceRepository.updateState(currentInstance.id, SagaState.COMPENSATING);
        // Attempt full compensation on error
        await this.compensateAdNetworkPublishInternal(currentInstance, 'Error processing ad network response'); // Compensate already published
        await this.compensateProductFeedPrep(currentInstance, `Error during ad network publish: ${error.message}`);
        await this.compensateBillingCheck(currentInstance, `Error during ad network publish: ${error.message}`);
        await this.handleSagaFailure(currentInstance, SagaState.PENDING_AD_NETWORK_PUBLISH, error.message);
      }
    }
  }

  async handleCampaignStatusUpdateResponse(correlationId: string, response: CampaignStatusUpdateSuccessfulEvent | CampaignStatusUpdateFailedEvent): Promise<void> {
    this.logger.log(`[${correlationId}] Received campaign status update response. Event: ${response.constructor.name}`);
    const instance = await this.loadSagaInstance(correlationId, 'handleCampaignStatusUpdateResponse');
    if (!instance) return;

    if (instance.currentState !== SagaState.PENDING_CAMPAIGN_STATUS_UPDATE) {
        this.logger.warn(`[${correlationId}] Received campaign status update response for saga not in PENDING_CAMPAIGN_STATUS_UPDATE state. Current state: ${instance.currentState}. Ignoring.`);
        return;
    }

    try {
      if (response instanceof CampaignStatusUpdateSuccessfulEvent) {
        await this.sagaInstanceRepository.updateState(instance.id, SagaState.COMPLETED);
        this.logger.log(`[${correlationId}] Campaign status update successful. Saga COMPLETED.`);
        
        const event = new CampaignPublishingCompletedEvent();
        event.sagaInstanceId = instance.id;
        event.campaignId = instance.campaignId;
        event.merchantId = instance.merchantId;
        // Determine finalStatus based on adNetworkPublishStatus
        const compliantAdNetworks = instance.payload.compliantAdNetworks as string[];
        const successfulPublications = compliantAdNetworks.filter(
            networkId => instance.adNetworkPublishStatus[networkId]?.status === 'SUCCESS'
        );
        event.finalStatus = successfulPublications.length === compliantAdNetworks.length ? SagaState.COMPLETED : 'PARTIALLY_COMPLETED' as any; // Cast as string literal type is fine
        event.publishedAdNetworks = compliantAdNetworks.map(adNetworkId => ({
            adNetworkId,
            externalCampaignId: instance.adNetworkPublishStatus[adNetworkId]?.externalCampaignId,
            status: instance.adNetworkPublishStatus[adNetworkId]?.status as 'SUCCESS' | 'FAILURE',
            reason: instance.adNetworkPublishStatus[adNetworkId]?.failureReason,
        }));
        this.eventEmitter.emit(CampaignPublishingCompletedEvent.name, event);
        this.logger.log(`[${correlationId}] Emitted CampaignPublishingCompletedEvent.`);

      } else if (response instanceof CampaignStatusUpdateFailedEvent) {
        this.logger.error(`[${correlationId}] Campaign status update failed. Reason: ${response.reason}. Saga enters FAILED_FINALIZATION.`);
        // This is a critical failure. The campaign might be published but its status not reflected.
        // Compensation at this stage is complex and might require manual intervention.
        // For now, mark as a special failed state.
        await this.sagaInstanceRepository.updateState(instance.id, SagaState.FAILED_FINALIZATION, instance.payload, response.reason);
        // Emit a specific event or alert for this critical situation
        const failEvent = new CampaignPublishingFailedEvent();
        failEvent.sagaInstanceId = instance.id;
        failEvent.campaignId = instance.campaignId;
        failEvent.merchantId = instance.merchantId;
        failEvent.reason = `Campaign status update failed: ${response.reason}`;
        failEvent.failedStep = SagaState.PENDING_CAMPAIGN_STATUS_UPDATE;
        this.eventEmitter.emit(CampaignPublishingFailedEvent.name, failEvent);
        this.logger.log(`[${correlationId}] Emitted CampaignPublishingFailedEvent due to FAILED_FINALIZATION.`);
      }
    } catch (error) {
      this.logger.error(`[${correlationId}] Error processing campaign status update response: ${error.message}`, error.stack);
      // Even if this fails, the saga is likely in a terminal state (COMPLETED or FAILED_FINALIZATION attempt)
      // Log extensively. Further compensation is unlikely if the previous step was already terminal.
      await this.sagaInstanceRepository.updateState(instance.id, SagaState.FAILED_FINALIZATION, instance.payload, `Critical error during finalization: ${error.message}`);
    }
  }

  private async compensateBillingCheck(instance: CampaignPublishingSagaInstance, reason: string): Promise<void> {
    this.logger.log(`[${instance.correlationId}] Initiating compensation for Billing Check due to: ${reason}`);
    await this.sagaInstanceRepository.setCompensating(instance.id, true);
    // Assuming budget check might involve reservation.
    // Check if initial request indicates budget was reserved. For now, assume a release command is always safe if applicable.
    // This is a simplified compensation.
    if (instance.payload.initialRequest?.budgetDetails) { // Or a flag in saga state if budget was actually reserved
        try {
            const command = new ReleaseReservedBudgetCommand();
            command.correlationId = instance.correlationId;
            command.campaignId = instance.campaignId;
            command.merchantId = instance.merchantId;
            // Add budget details if needed by the command
            // command.budgetAmount = instance.payload.initialRequest.budgetDetails.amount;
            // command.currency = instance.payload.initialRequest.budgetDetails.currency;
            await this.billingAdapter.releaseReservedBudget(command);
            this.logger.log(`[${instance.correlationId}] Dispatched ReleaseReservedBudgetCommand for compensation.`);
        } catch (error) {
            this.logger.error(`[${instance.correlationId}] Failed to dispatch ReleaseReservedBudgetCommand during compensation: ${error.message}`, error.stack);
            // Mark compensation as failed for this step? Saga will still be marked FAILED overall.
        }
    } else {
        this.logger.log(`[${instance.correlationId}] No specific billing compensation action defined or required.`);
    }
  }

  private async compensateProductFeedPrep(instance: CampaignPublishingSagaInstance, reason: string): Promise<void> {
    this.logger.log(`[${instance.correlationId}] Initiating compensation for Product Feed Preparation due to: ${reason}`);
    await this.sagaInstanceRepository.setCompensating(instance.id, true);
    // If product feed preparation created temporary resources.
    // This is a simplified compensation.
    try {
        const command = new CleanUpProductFeedResourcesCommand();
        command.correlationId = instance.correlationId;
        command.campaignId = instance.campaignId;
        command.merchantId = instance.merchantId;
        command.productCatalogId = instance.payload.initialRequest.productCatalogId;
        command.targetAdNetworkIds = instance.payload.initialRequest.targetAdNetworkIds;
        await this.productCatalogAdapter.cleanUpProductFeedResources(command);
        this.logger.log(`[${instance.correlationId}] Dispatched CleanUpProductFeedResourcesCommand for compensation.`);
    } catch (error) {
        this.logger.error(`[${instance.correlationId}] Failed to dispatch CleanUpProductFeedResourcesCommand during compensation: ${error.message}`, error.stack);
    }
  }

  // Called by specific step failure that requires compensating ad network publications
  public async compensateAdNetworkPublish(instanceId: string, networkId: string, context: any): Promise<void> {
    const instance = await this.loadSagaInstance(instanceId, 'compensateAdNetworkPublish_public');
    if (!instance) return;
    this.logger.log(`[${instance.correlationId}] Initiating compensation for Ad Network Publish on network ${networkId} due to: ${JSON.stringify(context)}`);
    await this.sagaInstanceRepository.setCompensating(instance.id, true);
    await this.deleteFromAdNetwork(instance, networkId, context?.reason || 'Generic compensation trigger');
  }
  
  // Internal helper for broader ad network compensation
  private async compensateAdNetworkPublishInternal(instance: CampaignPublishingSagaInstance, reason: string): Promise<void> {
    this.logger.log(`[${instance.correlationId}] Initiating compensation for all successful Ad Network Publications due to: ${reason}`);
    await this.sagaInstanceRepository.setCompensating(instance.id, true);

    if (instance.adNetworkPublishStatus) {
      for (const networkId in instance.adNetworkPublishStatus) {
        if (instance.adNetworkPublishStatus[networkId].status === 'SUCCESS') {
          await this.deleteFromAdNetwork(instance, networkId, reason);
        }
      }
    }
  }

  private async deleteFromAdNetwork(instance: CampaignPublishingSagaInstance, networkId: string, reason: string): Promise<void> {
    const externalCampaignId = instance.adNetworkPublishStatus?.[networkId]?.externalCampaignId;
    if (!externalCampaignId) {
      this.logger.warn(`[${instance.correlationId}] No externalCampaignId found for network ${networkId} to compensate. Skipping deletion.`);
      return;
    }
    try {
      const command = new DeleteCampaignFromAdNetworkCommand();
      command.correlationId = instance.correlationId;
      command.campaignId = instance.campaignId;
      command.merchantId = instance.merchantId;
      command.adNetworkId = networkId;
      command.externalCampaignId = externalCampaignId;
      await this.adNetworkAdapter.deleteCampaign(command);
      this.logger.log(`[${instance.correlationId}] Dispatched DeleteCampaignFromAdNetworkCommand for network ${networkId} (extId: ${externalCampaignId}) for compensation.`);
    } catch (error) {
      this.logger.error(`[${instance.correlationId}] Failed to dispatch DeleteCampaignFromAdNetworkCommand for network ${networkId} during compensation: ${error.message}`, error.stack);
    }
  }


  private async loadSagaInstance(correlationId: string, contextMethod: string): Promise<CampaignPublishingSagaInstance | null> {
    const instance = await this.sagaInstanceRepository.findByCorrelationId(correlationId);
    if (!instance) {
      this.logger.error(`[${correlationId}] Saga instance not found in ${contextMethod}. This should not happen if saga started correctly.`);
      // Potentially throw to allow SQS to DLQ the message if this is from an SQS listener.
      // For now, log and return null, expecting caller to handle.
      throw new SagaExecutionException('Saga instance not found', correlationId, contextMethod, 'INSTANCE_NOT_FOUND');
    }
    return instance;
  }

  private async handleSagaFailure(instance: CampaignPublishingSagaInstance, failedStep: SagaState, reason: string): Promise<void> {
    this.logger.error(`[${instance.correlationId}] Saga failed at step ${failedStep}. Reason: ${reason}`);
    
    // Check if already compensating to avoid re-triggering certain compensations if failure occurs during compensation
    let finalState = SagaState.FAILED;
    if (instance.isCompensating) {
        this.logger.warn(`[${instance.correlationId}] Saga failure occurred during an ongoing compensation. Marking as FAILED.`);
        finalState = SagaState.FAILED; // Or a more specific "COMPENSATION_FAILED" state if needed
    } else {
        // If not already compensating, set to compensating and then failed/compensated.
        // If compensation logic is complex and involves waiting for ack, this would be different.
        // For simplicity now: dispatch compensation, then mark as FAILED (or COMPENSATED if all compensations were acked successfully - not modeled here)
        await this.sagaInstanceRepository.updateState(instance.id, SagaState.COMPENSATING, undefined, reason);
        // Based on failedStep, call appropriate compensation chain
        // Example: if failedStep === SagaState.PENDING_AD_NETWORK_PUBLISH, then compensate ad networks, then product feed, then billing.
        // This is a simplified approach assuming compensations are fire-and-forget or handled before this point.
        // The individual handlers (e.g., handleProductFeedResponse for failure) already call compensation.
        // This method is more of a finalizer.
        finalState = SagaState.FAILED; // If compensations were dispatched and we don't wait for ack, mark as FAILED.
                                   // If we did wait and they all succeeded, it would be COMPENSATED.
    }

    await this.sagaInstanceRepository.updateState(instance.id, finalState, undefined, reason);
    await this.sagaInstanceRepository.setCompensating(instance.id, false); // Reset compensating flag after attempting

    const event = new CampaignPublishingFailedEvent();
    event.sagaInstanceId = instance.id;
    event.campaignId = instance.campaignId;
    event.merchantId = instance.merchantId;
    event.reason = reason;
    event.failedStep = failedStep;
    this.eventEmitter.emit(CampaignPublishingFailedEvent.name, event);
    this.logger.log(`[${instance.correlationId}] Emitted CampaignPublishingFailedEvent. Final saga state: ${finalState}`);
  }
}