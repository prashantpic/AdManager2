export const EventTopics = {
  CAMPAIGN_EVENTS: 'admanager-campaign-events-topic', // For general campaign lifecycle events
  PRODUCT_CATALOG_EVENTS: 'admanager-product-catalog-events-topic',
  USER_EVENTS: 'admanager-user-events-topic',
  BILLING_EVENTS: 'admanager-billing-events-topic',
  // Add more topics as needed
} as const; // 'as const' for stricter typing

export type EventTopic = typeof EventTopics[keyof typeof EventTopics];