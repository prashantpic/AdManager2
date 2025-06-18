/**
 * @file Interface defining the structure for API versioning and lifecycle policy information.
 * @namespace AdManager.AppStoreIntegration.Api.V1.Common.Interfaces
 */

/**
 * Defines the contract for API versioning information.
 * Specifies fields like current version, status (e.g., active, deprecated),
 * planned deprecation date, and sunset date for an API version.
 */
export interface ApiVersionPolicy {
  /**
   * The version identifier of the API (e.g., "v1", "v2.1").
   * @readonly
   */
  readonly version: string;

  /**
   * The current status of this API version.
   * Examples: "active", "beta", "deprecated", "sunset".
   * @readonly
   */
  readonly status: 'active' | 'beta' | 'deprecated' | 'sunset' | string;

  /**
   * The date when this API version is scheduled to be deprecated.
   * After this date, new integrations should not use this version,
   * and existing integrations should plan for migration.
   * Null if not applicable or not yet determined.
   * @readonly
   */
  readonly deprecationDate: Date | null;

  /**
   * The date when this API version will no longer be available.
   * After this date, requests to this version may fail.
   * Null if not applicable or not yet determined.
   * @readonly
   */
  readonly sunsetDate: Date | null;

  /**
   * A URL pointing to documentation or release notes for this API version.
   * @optional
   * @readonly
   */
  readonly documentationUrl?: string;

  /**
   * A URL pointing to migration guides if transitioning from a previous version
   * or to a newer version.
   * @optional
   * @readonly
   */
  readonly migrationGuideUrl?: string;
}