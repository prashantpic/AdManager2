/**
 * @file src/modules/third-party-connectivity/zapier/v1/zapier.constants.ts
 * @namespace AdManager.ThirdPartyConnectivity.Zapier.V1
 * @description Contains static constant values for the Zapier V1 module.
 * This improves maintainability and reduces magic strings.
 * Supports configuration and path definitions for Zapier webhooks as per REQ-TCE-006.
 */

/**
 * Key to fetch the actual Zapier webhook secret from ConfigService.
 */
export const ZAPIER_WEBHOOK_SECRET_CONFIG_KEY = 'ZAPIER_WEBHOOK_SECRET';

/**
 * Path segment for the Google Ads lead webhook endpoint.
 */
export const GOOGLE_ADS_LEAD_WEBHOOK_PATH = 'google-ads/leads';

/**
 * Path segment for the Google Ads performance webhook endpoint.
 */
export const GOOGLE_ADS_PERFORMANCE_WEBHOOK_PATH = 'google-ads/performance';

/**
 * HTTP Header name used by Zapier to send a signature for webhook validation.
 * The actual header name might vary based on Zapier's specific implementation for custom webhooks.
 */
export const ZAPIER_SIGNATURE_HEADER = 'X-Zapier-Signature';

/**
 * Timeout in milliseconds for outbound HTTP requests made to Zapier webhook URLs.
 */
export const ZAPIER_OUTBOUND_REQUEST_TIMEOUT_MS = 5000;