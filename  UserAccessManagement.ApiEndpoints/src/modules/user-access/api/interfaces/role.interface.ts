/**
 * Defines the contract for Ad Manager role data.
 * This interface represents a role within the system, including its name
 * and associated permissions.
 * (Covers REQ-IAM-001, REQ-IAM-002 from SDS)
 */
export interface IRole {
  /**
   * Role ID (e.g., UUID or a predefined string identifier).
   * Uniquely identifies the role.
   */
  id: string;

  /**
   * Role name (e.g., 'MerchantAdmin', 'CampaignManager').
   * This is the human-readable and typically machine-usable name of the role.
   */
  name: string;

  /**
   * Optional array of permission strings/keys associated with this role.
   * Defines what actions a user with this role can perform.
   * The specific format and meaning of permissions would be defined elsewhere.
   */
  permissions?: string[];

  /**
   * Optional description of the role.
   * Provides more context about the purpose or responsibilities of the role.
   */
  description?: string;
}