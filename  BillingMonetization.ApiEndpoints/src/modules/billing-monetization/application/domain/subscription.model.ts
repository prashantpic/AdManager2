/**
 * Represents the status of a subscription.
 * - `active`: The subscription is current and paid.
 * - `pending_downgrade`: A downgrade has been requested and will apply at the end of the current billing cycle.
 * - `past_due`: Payment has failed, and the subscription is overdue.
 * - `canceled`: The subscription has been canceled.
 * - `in_grace_period`: Payment has failed, but the subscription is temporarily active during a grace period.
 */
export enum SubscriptionStatusType {
  ACTIVE = 'active',
  PENDING_DOWNGRADE = 'pending_downgrade',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  IN_GRACE_PERIOD = 'in_grace_period',
}

/**
 * Represents the billing cycle for a subscription.
 * - `monthly`: Billed every month.
 * - `annual`: Billed every year.
 */
export enum BillingCycleType {
  MONTHLY = 'monthly',
  ANNUAL = 'annual',
}

/**
 * Domain model representing a merchant's subscription.
 * Encapsulates the state and behavior of a subscription.
 */
export class SubscriptionModel {
  public readonly id: string;
  public readonly merchantId: string;
  public planId: string;
  public status: SubscriptionStatusType;
  public billingCycle: BillingCycleType;
  public startDate: Date;
  public endDate?: Date; // End date of the subscription (if canceled or ends)
  public nextBillingDate: Date;
  public currentPeriodStart: Date;
  public currentPeriodEnd: Date;
  public paymentGatewayCustomerId?: string; // ID of the customer in the payment gateway (e.g., Stripe Customer ID)

  constructor(
    id: string,
    merchantId: string,
    planId: string,
    status: SubscriptionStatusType,
    billingCycle: BillingCycleType,
    startDate: Date,
    nextBillingDate: Date,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    paymentGatewayCustomerId?: string,
    endDate?: Date,
  ) {
    this.id = id;
    this.merchantId = merchantId;
    this.planId = planId;
    this.status = status;
    this.billingCycle = billingCycle;
    this.startDate = startDate;
    this.nextBillingDate = nextBillingDate;
    this.currentPeriodStart = currentPeriodStart;
    this.currentPeriodEnd = currentPeriodEnd;
    this.paymentGatewayCustomerId = paymentGatewayCustomerId;
    this.endDate = endDate;
  }

  /**
   * Activates the subscription.
   * Typically called after successful payment.
   */
  public activate(): void {
    if (this.status === SubscriptionStatusType.CANCELED) {
      throw new Error('Cannot activate a canceled subscription. Create a new one.');
    }
    this.status = SubscriptionStatusType.ACTIVE;
    // Potentially reset end date if it was set due to a previous cancellation schedule
    // This logic might be more complex depending on reactivation policies
  }

  /**
   * Cancels the subscription.
   * @param effectiveDate The date when the cancellation becomes effective.
   *                      For immediate cancellation, this would be now.
   *                      For cancellation at period end, this would be currentPeriodEnd.
   */
  public cancel(effectiveDate: Date): void {
    if (this.status === SubscriptionStatusType.CANCELED && this.endDate && this.endDate <= new Date()) {
        // Already canceled and past effective date
        return;
    }
    this.status = SubscriptionStatusType.CANCELED;
    this.endDate = effectiveDate;
    // Further logic might be needed, e.g., to stop auto-renewal in the payment gateway
  }

  /**
   * Schedules a plan change (upgrade or downgrade).
   * @param newPlanId The ID of the new plan.
   * @param newBillingCycle The new billing cycle.
   */
  public changePlan(newPlanId: string, newBillingCycle: BillingCycleType): void {
    // Business logic for plan change (e.g., proration, effective date)
    // would typically be handled by the service layer coordinating this model.
    // This method primarily updates the model's state.
    this.planId = newPlanId;
    this.billingCycle = newBillingCycle;

    // If it's a downgrade, status might change to PENDING_DOWNGRADE
    // If it's an immediate upgrade, status remains ACTIVE, and billing dates might change
    // For simplicity, this model method just updates planId and billingCycle.
    // The service layer will manage status and dates based on proration/policy.
  }

  /**
   * Checks if the subscription is currently within its grace period.
   * This is a simplified check; actual grace period calculation might involve
   * comparing `currentPeriodEnd` or `nextBillingDate` with the current date
   * and the `gracePeriodDays` configuration.
   * @param gracePeriodDays The number of days allowed for the grace period.
   * @returns True if the subscription is considered to be in a grace period, false otherwise.
   */
  public isInGracePeriod(gracePeriodDays: number): boolean {
    if (this.status !== SubscriptionStatusType.PAST_DUE && this.status !== SubscriptionStatusType.IN_GRACE_PERIOD) {
      return false;
    }
    // A more robust check:
    // const gracePeriodEndDate = new Date(this.currentPeriodEnd.getTime() + gracePeriodDays * 24 * 60 * 60 * 1000);
    // return new Date() <= gracePeriodEndDate;
    return this.status === SubscriptionStatusType.IN_GRACE_PERIOD; // Status should be explicitly set by service
  }

  /**
   * Updates billing period dates.
   * @param currentPeriodStart New start of the current billing period.
   * @param currentPeriodEnd New end of the current billing period.
   * @param nextBillingDate New date for the next billing attempt.
   */
  public updateBillingDates(currentPeriodStart: Date, currentPeriodEnd: Date, nextBillingDate: Date): void {
    this.currentPeriodStart = currentPeriodStart;
    this.currentPeriodEnd = currentPeriodEnd;
    this.nextBillingDate = nextBillingDate;
  }
}