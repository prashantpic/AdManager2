/**
 * @file Defines an enumeration for various webhook event types that third-party applications can subscribe to.
 * @namespace AdManager.AppStoreIntegration.Api.V1.Common.Enums
 */

/**
 * Enumeration of supported webhook event types.
 * These are used for webhook subscriptions and event payloads.
 */
export enum WebhookEventType {
  /**
   * Event triggered when a new campaign is created.
   */
  CAMPAIGN_CREATED = 'CAMPAIGN_CREATED',

  /**
   * Event triggered when an existing campaign is updated.
   */
  CAMPAIGN_UPDATED = 'CAMPAIGN_UPDATED',

  /**
   * Event triggered when a product is updated.
   */
  PRODUCT_UPDATED = 'PRODUCT_UPDATED',

  /**
   * Event triggered when a merchant grants data access to an application.
   */
  MERCHANT_DATA_ACCESS_GRANTED = 'MERCHANT_DATA_ACCESS_GRANTED',

  /**
   * Event triggered when a merchant revokes data access from an application.
   */
  MERCHANT_DATA_ACCESS_REVOKED = 'MERCHANT_DATA_ACCESS_REVOKED',

  /**
   * A sample event type for testing or demonstration purposes.
   */
  SAMPLE_EVENT_TRIGGERED = 'SAMPLE_EVENT_TRIGGERED',
}