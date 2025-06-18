/**
 * Standardized string constants for user role names.
 * This helps avoid magic strings in the codebase and ensures consistency.
 * (Covers REQ-IAM-001, 2.3 from SDS)
 */

export const MERCHANT_ADMIN_ROLE = 'MerchantAdmin';
export const CAMPAIGN_MANAGER_ROLE = 'CampaignManager';
export const PLATFORM_ADMIN_ROLE = 'PlatformAdministrator';

/**
 * An enumeration-like object for Ad Manager roles.
 * Useful for DTO validation with `@IsEnum` and for easier programmatic access to role names.
 */
export const AdManagerRoles = {
    MERCHANT_ADMIN: MERCHANT_ADMIN_ROLE,
    CAMPAIGN_MANAGER: CAMPAIGN_MANAGER_ROLE,
    PLATFORM_ADMIN: PLATFORM_ADMIN_ROLE,
};