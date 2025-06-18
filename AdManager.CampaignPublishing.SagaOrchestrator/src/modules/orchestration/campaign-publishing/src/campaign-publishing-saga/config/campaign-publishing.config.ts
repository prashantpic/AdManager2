import { registerAs } from '@nestjs/config';

export interface CampaignPublishingSagaConfig {
  AWS_REGION: string;
  SAGA_STATE_DB_HOST?: string;
  SAGA_STATE_DB_PORT?: number;
  SAGA_STATE_DB_USER?: string;
  SAGA_STATE_DB_PASSWORD?: string;
  SAGA_STATE_DB_NAME?: string;
  SAGA_REPLY_QUEUE_URL: string;
  SAGA_REPLY_QUEUE_NAME?: string;
  BILLING_COMMAND_QUEUE_URL: string;
  PRODUCT_CATALOG_COMMAND_QUEUE_URL: string;
  AD_NETWORK_COMMAND_QUEUE_URL: string;
  CAMPAIGN_MANAGEMENT_COMMAND_QUEUE_URL: string;
  CAMPAIGN_PUBLISHED_TOPIC_ARN: string;
  CAMPAIGN_PUBLISH_FAILED_TOPIC_ARN: string;
}

export default registerAs('campaignPublishingSaga', (): CampaignPublishingSagaConfig => {
  const sagaStateDbPort = process.env.SAGA_STATE_DB_PORT ? parseInt(process.env.SAGA_STATE_DB_PORT, 10) : undefined;

  if (process.env.SAGA_STATE_DB_PORT && isNaN(sagaStateDbPort)) {
    throw new Error('SAGA_STATE_DB_PORT must be a valid number.');
  }
  if (!process.env.SAGA_REPLY_QUEUE_URL) {
    throw new Error('SAGA_REPLY_QUEUE_URL is a required environment variable.');
  }
  if (!process.env.BILLING_COMMAND_QUEUE_URL) {
    throw new Error('BILLING_COMMAND_QUEUE_URL is a required environment variable.');
  }
  if (!process.env.PRODUCT_CATALOG_COMMAND_QUEUE_URL) {
    throw new Error('PRODUCT_CATALOG_COMMAND_QUEUE_URL is a required environment variable.');
  }
  if (!process.env.AD_NETWORK_COMMAND_QUEUE_URL) {
    throw new Error('AD_NETWORK_COMMAND_QUEUE_URL is a required environment variable.');
  }
  if (!process.env.CAMPAIGN_MANAGEMENT_COMMAND_QUEUE_URL) {
    throw new Error('CAMPAIGN_MANAGEMENT_COMMAND_QUEUE_URL is a required environment variable.');
  }
  if (!process.env.CAMPAIGN_PUBLISHED_TOPIC_ARN) {
    throw new Error('CAMPAIGN_PUBLISHED_TOPIC_ARN is a required environment variable.');
  }
  if (!process.env.CAMPAIGN_PUBLISH_FAILED_TOPIC_ARN) {
    throw new Error('CAMPAIGN_PUBLISH_FAILED_TOPIC_ARN is a required environment variable.');
  }


  return {
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    SAGA_STATE_DB_HOST: process.env.SAGA_STATE_DB_HOST,
    SAGA_STATE_DB_PORT: sagaStateDbPort,
    SAGA_STATE_DB_USER: process.env.SAGA_STATE_DB_USER,
    SAGA_STATE_DB_PASSWORD: process.env.SAGA_STATE_DB_PASSWORD,
    SAGA_STATE_DB_NAME: process.env.SAGA_STATE_DB_NAME,
    SAGA_REPLY_QUEUE_URL: process.env.SAGA_REPLY_QUEUE_URL,
    SAGA_REPLY_QUEUE_NAME: process.env.SAGA_REPLY_QUEUE_NAME, // Used by @ssut/nestjs-sqs if provided
    BILLING_COMMAND_QUEUE_URL: process.env.BILLING_COMMAND_QUEUE_URL,
    PRODUCT_CATALOG_COMMAND_QUEUE_URL: process.env.PRODUCT_CATALOG_COMMAND_QUEUE_URL,
    AD_NETWORK_COMMAND_QUEUE_URL: process.env.AD_NETWORK_COMMAND_QUEUE_URL,
    CAMPAIGN_MANAGEMENT_COMMAND_QUEUE_URL: process.env.CAMPAIGN_MANAGEMENT_COMMAND_QUEUE_URL,
    CAMPAIGN_PUBLISHED_TOPIC_ARN: process.env.CAMPAIGN_PUBLISHED_TOPIC_ARN,
    CAMPAIGN_PUBLISH_FAILED_TOPIC_ARN: process.env.CAMPAIGN_PUBLISH_FAILED_TOPIC_ARN,
  };
});