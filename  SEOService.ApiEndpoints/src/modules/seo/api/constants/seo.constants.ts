/**
 * @fileoverview Defines constants for the SEO module, such as injection tokens for services.
 * @namespace AdManager.SEOService.Api.V1.Constants
 */

/**
 * Injection token for the ISeoService.
 * This symbol is used to inject the SEO service implementation into controllers or other services.
 */
export const SEO_SERVICE_TOKEN = Symbol('ISeoService');