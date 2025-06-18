export const CAMPAIGN_PUBLISHING_SAGA_CONSTANTS = {
  // Message Attribute Names
  MESSAGE_ATTRIBUTE_EVENT_TYPE: 'EventType',
  MESSAGE_ATTRIBUTE_CORRELATION_ID: 'CorrelationId',
  MESSAGE_ATTRIBUTE_REPLY_QUEUE_URL: 'ReplyQueueUrl',
  MESSAGE_ATTRIBUTE_COMMAND_TYPE: 'CommandType',

  // Adapter Injection Tokens
  BILLING_ADAPTER_TOKEN: 'IBillingAdapter',
  PRODUCT_CATALOG_ADAPTER_TOKEN: 'IProductCatalogAdapter',
  AD_NETWORK_ADAPTER_TOKEN: 'IAdNetworkIntegrationAdapter',
  CAMPAIGN_MANAGEMENT_ADAPTER_TOKEN: 'ICampaignManagementAdapter',

  // Potentially other constants like specific event or command names if not derived from class names
  // SAGA_STATE_PENDING_VALIDATION: 'SAGA_STATE_PENDING_VALIDATION', // Example, if SagaState enum is not always imported
  // EVENT_CAMPAIGN_CREATION_REQUESTED: 'CampaignCreationRequestedEvent', // Example, if needed as string literal
};