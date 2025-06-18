/**
 * Defines the contract for Ad Manager user data.
 * This interface is used throughout the user access management module to ensure
 * consistent user object structures.
 * (Covers REQ-IAM-001 from SDS)
 */
export interface IUser {
  /**
   * Ad Manager User ID (e.g., UUID).
   * This is the primary identifier for the user within the Ad Manager system.
   */
  id: string;

  /**
   * ID from the [PlatformName] core authentication system.
   * This links the Ad Manager user to their corresponding identity in the core platform.
   */
  corePlatformUserId: string;

  /**
   * Associated merchant ID, if applicable.
   * For users scoped to a specific merchant (e.g., MerchantAdmin, CampaignManager).
   * Null or undefined for platform-level users (e.g., PlatformAdministrator).
   */
  merchantId?: string | null;

  /**
   * User's email address.
   */
  email: string;

  /**
   * Array of role names assigned to the user within the Ad Manager.
   * Example: ['MerchantAdmin', 'CampaignManager']
   */
  roles: string[];

  /**
   * Indicates whether the user's account is active or inactive.
   * Inactive users typically cannot log in or perform actions.
   */
  isActive: boolean;

  /**
   * Timestamp of when the user record was created.
   * Optional as it might not always be present on all IUser instances (e.g., JWT payload).
   */
  createdAt?: Date;

  /**
   * Timestamp of when the user record was last updated.
   * Optional.
   */
  updatedAt?: Date;
}