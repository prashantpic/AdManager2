import { Injectable, Logger } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { IBillingAdapter } from '../interfaces/billing.adapter.interface';
import { CheckCampaignBudgetCommand } from '../../messages/commands/check-campaign-budget.command';
import { ReleaseReservedBudgetCommand } from '../../messages/commands/release-reserved-budget.command';
import { CampaignPublishingSagaConfig } from '../../config/campaign-publishing.config';
import { CAMPAIGN_PUBLISHING_SAGA_CONSTANTS } from '../../campaign-publishing-saga.constants';

@Injectable()
export class BillingAdapter implements IBillingAdapter {
  private readonly logger = new Logger(BillingAdapter.name);
  private readonly sqs: SQS;
  private readonly billingCommandQueueUrl: string;
  private readonly sagaReplyQueueUrl: string;

  constructor(private readonly configService: ConfigService<CampaignPublishingSagaConfig, true>) {
    const awsRegion = this.configService.get('AWS_REGION', { infer: true });
    this.sqs = new SQS({ region: awsRegion });
    this.billingCommandQueueUrl = this.configService.get('BILLING_COMMAND_QUEUE_URL', { infer: true });
    this.sagaReplyQueueUrl = this.configService.get('SAGA_REPLY_QUEUE_URL', { infer: true });

    if (!this.billingCommandQueueUrl) {
        this.logger.error('BILLING_COMMAND_QUEUE_URL is not configured.');
        throw new Error('BillingAdapter: BILLING_COMMAND_QUEUE_URL is missing in configuration.');
    }
    if (!this.sagaReplyQueueUrl) {
        this.logger.error('SAGA_REPLY_QUEUE_URL is not configured.');
        throw new Error('BillingAdapter: SAGA_REPLY_QUEUE_URL is missing in configuration.');
    }
  }

  async checkCampaignBudget(command: CheckCampaignBudgetCommand): Promise<void> {
    this.logger.log(`Sending CheckCampaignBudgetCommand for campaign ${command.campaignId} (correlation: ${command.correlationId}) to queue ${this.billingCommandQueueUrl}`);
    try {
      await this.sqs.sendMessage({
        QueueUrl: this.billingCommandQueueUrl,
        MessageBody: JSON.stringify(command),
        MessageAttributes: {
          [CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.MESSAGE_ATTRIBUTE_CORRELATION_ID]: { DataType: 'String', StringValue: command.correlationId },
          [CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.MESSAGE_ATTRIBUTE_REPLY_QUEUE_URL]: { DataType: 'String', StringValue: this.sagaReplyQueueUrl },
          [CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.MESSAGE_ATTRIBUTE_COMMAND_TYPE]: { DataType: 'String', StringValue: CheckCampaignBudgetCommand.name },
        }
      }).promise();
      this.logger.log(`Successfully sent CheckCampaignBudgetCommand for campaign ${command.campaignId}`);
    } catch (error) {
      this.logger.error(`Failed to send CheckCampaignBudgetCommand for campaign ${command.campaignId}. Error: ${error.message}`, error.stack);
      throw error; // Re-throw to allow saga to handle failure
    }
  }

  async releaseReservedBudget(command: ReleaseReservedBudgetCommand): Promise<void> {
    this.logger.log(`Sending ReleaseReservedBudgetCommand for campaign ${command.campaignId} (correlation: ${command.correlationId}) to queue ${this.billingCommandQueueUrl}`);
    try {
      await this.sqs.sendMessage({
        QueueUrl: this.billingCommandQueueUrl,
        MessageBody: JSON.stringify(command),
        MessageAttributes: {
          [CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.MESSAGE_ATTRIBUTE_CORRELATION_ID]: { DataType: 'String', StringValue: command.correlationId },
          // ReplyQueueUrl might not be strictly necessary for a compensation command if no reply is expected or handled
          // However, including it can be useful for tracing or if the compensated service *does* send an ack/nack
          [CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.MESSAGE_ATTRIBUTE_REPLY_QUEUE_URL]: { DataType: 'String', StringValue: this.sagaReplyQueueUrl },
          [CAMPAIGN_PUBLISHING_SAGA_CONSTANTS.MESSAGE_ATTRIBUTE_COMMAND_TYPE]: { DataType: 'String', StringValue: ReleaseReservedBudgetCommand.name },
        }
      }).promise();
      this.logger.log(`Successfully sent ReleaseReservedBudgetCommand for campaign ${command.campaignId}`);
    } catch (error) {
      this.logger.error(`Failed to send ReleaseReservedBudgetCommand for campaign ${command.campaignId}. Error: ${error.message}`, error.stack);
      // Compensation command failures are critical. Saga might need to log this and potentially enter a manual recovery state.
      throw error;
    }
  }
}