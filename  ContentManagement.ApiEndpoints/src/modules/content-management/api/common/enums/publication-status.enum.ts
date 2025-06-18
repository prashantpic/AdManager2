/**
 * @file publication-status.enum.ts
 * @description Defines an enumeration for the publication status of content items (e.g., Blog Posts, Landing Pages).
 * @requirement REQ-6-005, REQ-6-010
 * @namespace AdManager.ContentManagement.Api.V1.Common.Enums
 */

/**
 * Enum representing the possible publication states of a content item.
 */
export enum PublicationStatus {
  /**
   * Content is a draft, not publicly visible.
   */
  DRAFT = 'draft',

  /**
   * Content is live and publicly visible.
   */
  PUBLISHED = 'published',

  /**
   * Content is scheduled for future publication.
   */
  SCHEDULED = 'scheduled',

  /**
   * Content was previously published but is now hidden.
   */
  UNPUBLISHED = 'unpublished',

  /**
   * Content is no longer active but kept for records.
   */
  ARCHIVED = 'archived',
}