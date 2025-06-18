import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { Message } from '@aws-sdk/client-sqs'; // AWS SDK v3 style as per SDS 4.5
import { CampaignPublishingSaga } from '../sagas/campaign-publishing.saga';
import { BillingCheckSuccessfulEvent } from '../messages/events/inputs/billing-check-successful.event';
import { BillingCheckFailedEvent } from '../messages/events/inputs/billing-check-failed.event';
import { ProductFeedReadyEvent } from '../messages/events/inputs/product-feed-ready.event';
import { ProductFeedPreparationFailedEvent } from '../messages/events/inputs/product-feed-preparation-failed.event';
import { AdNetworkPublishSuccessfulEvent } from '../messages/events/inputs/ad-network-publish-successful.event';
import { AdNetworkPublishFailedEvent } from '../messages/events/inputs/ad-network-publish-failed.event';
import { CampaignStatusUpdateSuccessfulEvent } from '../messages/events/inputs/campaign-status-update-successful.event';
import { CampaignStatusUpdateFailedEvent } from '../messages/events/inputs/campaign-status-update-failed.event';
import { CAMPAIGN_PUBLISHING_SAGA_CONSTANTS } from '../campaign-publishing-saga.constants';
import { ConfigService } from '@nestjs/config';
import { CampaignPublishingSagaConfig } from '../config/campaign-publishing.config';


@Injectable()
export class SqsReplyListener {
  private readonly logger = new Logger(SqsReplyListener.name);
  private readonly sagaReplyQueueName: string;

  constructor(
    private readonly campaignPublishingSaga: CampaignPublishingSaga,
    configService: ConfigService<CampaignPublishingSagaConfig, true> // Inject to get queue name if needed dynamically
  ) {
    // process.env.SAGA_REPLY_QUEUE_NAME is used directly in decorator per SDS,
    // but can be fetched from configService if preferred for consistency.
    this.sagaReplyQueueName = configService.get('SAGA_REPLY_QUEUE_NAME', { infer: true }) || 'saga-reply-queue';
  }

  // The queue name for the decorator should match the one defined in SqsModule configuration (app.module.ts)
  // SDS specifies `process.env.SAGA_REPLY_QUEUE_NAME || 'saga-reply-queue'`
  @SqsMessageHandler(process.env.SAGA_REPLY_QUEUE_NAME || 'saga-reply-queue', false /* autoDelete = false */)
  async handleMessage(message: Message) { // Type from @aws-sdk/client-sqs
    this.logger.log(`Received SQS message: ${message.MessageId} on queue ${this.sagaReplyQueueName}`);

    const correlationIdAttr = message.MessageAttributes?.[CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.MESSAGE_ATTRIBUTE_CORRELATION_ID];
    const eventTypeAttr = message.MessageAttributes?.[CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.MESSAGE_ATTRIBUTE_EVENT_TYPE];

    if (!message.Body || !correlationIdAttr?.StringValue || !eventTypeAttr?.StringValue) {
      this.logger.error(
        `Invalid SQS message structure. Missing Body, CorrelationId, or EventType. MessageId: ${message.MessageId}`,
        { attributes: message.MessageAttributes }
      );
      // Do not throw here if we want to acknowledge and DLQ manually via SQS console based on logs.
      // Re-throwing will make @ssut/nestjs-sqs not delete it, leading to retries and eventually DLQ if configured.
      // This is generally the desired behavior.
      throw new Error('Invalid SQS message structure: Missing Body, CorrelationId, or EventType.');
    }

    const correlationId = correlationIdAttr.StringValue;
    const eventType = eventTypeAttr.StringValue;
    let eventPayload: any;

    try {
      eventPayload = JSON.parse(message.Body);
    } catch (error) {
      this.logger.error(`Failed to parse SQS message body for correlationId ${correlationId}, eventType ${eventType}. MessageId: ${message.MessageId}`, error.stack);
      throw error; // Let SQS handle retry/DLQ
    }

    this.logger.log(`Processing event type: ${eventType} for correlationId: ${correlationId}. MessageId: ${message.MessageId}`);

    try {
      switch (eventType) {
        case BillingCheckSuccessfulEvent.name:
          await this.campaignPublishingSaga.handleBillingCheckResponse(correlationId, eventPayload as BillingCheckSuccessfulEvent);
          break;
        case BillingCheckFailedEvent.name:
          await this.campaignPublishingSaga.handleBillingCheckResponse(correlationId, eventPayload as BillingCheckFailedEvent);
          break;
        case ProductFeedReadyEvent.name:
          await this.campaignPublishingSaga.handleProductFeedResponse(correlationId, eventPayload as ProductFeedReadyEvent);
          break;
        case ProductFeedPreparationFailedEvent.name:
          await this.campaignPublishingSaga.handleProductFeedResponse(correlationId, eventPayload as ProductFeedPreparationFailedEvent);
          break;
        case AdNetworkPublishSuccessfulEvent.name:
          await this.campaignPublishingSaga.handleAdNetworkPublishResponse(correlationId, eventPayload as AdNetworkPublishSuccessfulEvent);
          break;
        case AdNetworkPublishFailedEvent.name:
          await this.campaignPublishingSaga.handleAdNetworkPublishResponse(correlationId, eventPayload as AdNetworkPublishFailedEvent);
          break;
        case CampaignStatusUpdateSuccessfulEvent.name:
          await this.campaignPublishingSaga.handleCampaignStatusUpdateResponse(correlationId, eventPayload as CampaignStatusUpdateSuccessfulEvent);
          break;
        case CampaignStatusUpdateFailedEvent.name:
          await this.campaignPublishingSaga.handleCampaignStatusUpdateResponse(correlationId, eventPayload as CampaignStatusUpdateFailedEvent);
          break;
        default:
          this.logger.warn(`Unknown event type received: ${eventType} for correlationId: ${correlationId}. MessageId: ${message.MessageId}`);
          // Depending on policy, might throw to DLQ or just log and acknowledge.
          // Throwing is safer to ensure unknown messages are investigated.
          throw new Error(`Unknown event type: ${eventType}`);
      }
      this.logger.log(`Successfully processed event ${eventType} for correlationId ${correlationId}. MessageId: ${message.MessageId}`);
      // If no error is thrown, @ssut/nestjs-sqs will auto-delete the message from the queue.
    } catch (error) {
      this.logger.error(`Error processing event ${eventType} for correlationId ${correlationId}. MessageId: ${message.MessageId}:`, error.stack);
      // Re-throw to ensure message is not deleted and goes to DLQ after retries.
      throw error;
    }
  }
}