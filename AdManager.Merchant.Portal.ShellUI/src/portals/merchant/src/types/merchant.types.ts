/**
 * @file merchant.types.ts
 * @summary Global TypeScript type definitions for merchant-related data used within the shell.
 * @description This file exports interfaces that define the structure of merchant profiles,
 * subscription plans, permissions, and other merchant-specific data. These types are
 * primarily used by the `merchantContextSlice` in Redux and components that display
 * or interact with merchant-specific information.
 */

/**
 * @enum SubscriptionPlanType
 * @description Defines the possible types of subscription plans a merchant can have.
 */
export enum SubscriptionPlanType {
  BASIC = 'basic',
  PRO = 'pro',
  PLUS = 'plus',
  ENTERPRISE = 'enterprise', // Example of adding more plans
  FREE_TRIAL = 'free_trial',
}

/**
 * @interface MerchantProfile
 * @description Defines the structure for a merchant's profile information.
 * This data is typically fetched after authentication and stored in the merchant context.
 * @property {string} id - The unique identifier for the merchant.
 * @property {string} companyName - The legal name of the merchant's company.
 * @property {string} contactEmail - The primary contact email for the merchant.
 * @property {string} [contactPhone] - (Optional) The primary contact phone number for the merchant.
 * @property {SubscriptionPlanType} activeSubscriptionPlan - The merchant's current active subscription plan.
 * @property {string} [subscriptionStatus] - (Optional) Detailed status of the subscription (e.g., 'active', 'past_due', 'canceled').
 * @property {string} [registrationDate] - (Optional) ISO date string of when the merchant registered.
 * @property {string} [logoUrl] - (Optional) URL to the merchant's company logo.
 * @property {string} [industry] - (Optional) The industry the merchant operates in.
 * @property {object} [address] - (Optional) The merchant's business address.
 * @property {string} [address.street]
 * @property {string} [address.city]
 * @property {string} [address.state]
 * @property {string} [address.postalCode]
 * @property {string} [address.country]
 * @property {Record<string, any>} [customFields] - (Optional) For any additional merchant-specific custom data.
 */
export interface MerchantProfile {
  id: string;
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  activeSubscriptionPlan: SubscriptionPlanType;
  subscriptionStatus?: 'active' | 'past_due' | 'canceled' | 'trialing';
  registrationDate?: string; // ISO Date string
  logoUrl?: string;
  industry?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string; // ISO 3166-1 alpha-2 country code
  };
  customFields?: Record<string, any>;
}

/**
 * @interface MerchantPermissions
 * @description Defines the structure for representing a merchant's permissions.
 * This could be a set of boolean flags or an array of permission strings,
 * depending on how permissions are managed by the backend.
 * This interface is an example; the actual structure might vary based on `UserProfile.permissions`.
 * If `UserProfile.permissions` (array of strings) is used, this interface might not be strictly needed,
 * or it could be a more structured representation derived from that array.
 *
 * @example
 * // If permissions are boolean flags:
 * // {
 * //   canManageCampaigns: true,
 * //   canAccessBilling: false,
 * //   canPublishLandingPages: true
 * // }
 * // If permissions are an array of strings, UserProfile.permissions is used directly.
 */
export interface MerchantPermissions {
  // Example structure if permissions are granular boolean flags:
  canManageCampaigns?: boolean;
  canCreateCampaigns?: boolean;
  canViewCampaigns?: boolean;
  canAccessBilling?: boolean;
  canManageUsers?: boolean;
  canPublishLandingPages?: boolean;
  canManageBlogPosts?: boolean;
  // ... other specific permissions
  [key: string]: boolean | undefined; // Allows for dynamic permission keys
}

/**
 * @interface MerchantContextState
 * @description Defines the state structure for the merchant context in Redux.
 * @property {MerchantProfile | null} profile - The profile of the currently authenticated merchant.
 * @property {string[]} [permissions] - Permissions of the current user for this merchant (often part of UserProfile).
 * @property {boolean} isLoading - Flag indicating if merchant context data is being loaded.
 * @property {string | null} error - Error message if loading merchant context data failed.
 */
export interface MerchantContextState {
  profile: MerchantProfile | null;
  // Permissions are typically part of UserProfile and accessed via AuthContext/auth state.
  // If merchant-level permissions (distinct from user permissions within that merchant) are needed,
  // they could be part of MerchantProfile or fetched separately.
  // For simplicity, assuming user's permissions related to the merchant are in UserProfile.
  isLoading: boolean;
  error: string | null;
}