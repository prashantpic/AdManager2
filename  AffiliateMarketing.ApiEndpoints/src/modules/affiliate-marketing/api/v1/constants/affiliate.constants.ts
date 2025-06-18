```typescript
/**
 * @fileoverview Defines constant values used across the affiliate marketing API module.
 * This ensures consistency and avoids magic strings/numbers.
 * Namespace: AdManager.AffiliateMarketing.Api.V1.Constants
 */

/**
 * Default number of days a tracking cookie remains valid.
 * REQ-AMP-004
 */
export const DEFAULT_COOKIE_WINDOW_DAYS: number = 30;

/**
 * Commission type identifier for percentage-based commissions.
 * REQ-AMP-003
 */
export const COMMISSION_TYPE_PERCENTAGE: string = 'percentage';

/**
 * Commission type identifier for flat fee-based commissions.
 * REQ-AMP-003
 */
export const COMMISSION_TYPE_FLAT_FEE: string = 'flat_fee';

// Potential future constants (values to be defined as needed)

/**
 * Enum for Payout Statuses.
 * Example:
 * export enum PayoutStatus {
 *   PENDING = 'Pending',
 *   PROCESSING = 'Processing',
 *   PAID = 'Paid',
 *   FAILED = 'Failed',
 * }
 */

/**
 * Enum for Affiliate Application Statuses.
 * Example:
 * export enum ApplicationStatus {
 *   PENDING = 'Pending',
 *   APPROVED = 'Approved',
 *   REJECTED = 'Rejected',
 * }
 */

/**
 * Enum for Conversion Statuses.
 * Example:
 * export enum ConversionStatus {
 *  TRACKED = 'Tracked',
 *  VERIFIED = 'Verified',
 *  PENDING_PAYOUT = 'PendingPayout',
 *  PAID = 'Paid',
 *  REJECTED = 'Rejected',
 * }
 */

/**
 * Enum for Attribution Types.
 * Example:
 * export enum AttributionType {
 *  LAST_CLICK = 'LastClick',
 *  COUPON = 'Coupon',
 * }
 */
```