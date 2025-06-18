import { SubscriptionStatusType } from '../domain/subscription.model';

export const DEFAULT_GRACE_PERIOD_DAYS = 7;

export const SUBSCRIPTION_STATUS: { [key in SubscriptionStatusType]: SubscriptionStatusType } = {
  [SubscriptionStatusType.ACTIVE]: SubscriptionStatusType.ACTIVE,
  [SubscriptionStatusType.PENDING_DOWNGRADE]: SubscriptionStatusType.PENDING_DOWNGRADE,
  [SubscriptionStatusType.PAST_DUE]: SubscriptionStatusType.PAST_DUE,
  [SubscriptionStatusType.CANCELED]: SubscriptionStatusType.CANCELED,
  [SubscriptionStatusType.IN_GRACE_PERIOD]: SubscriptionStatusType.IN_GRACE_PERIOD,
};

export const PAYMENT_GATEWAY_EVENTS = {
  // Example Stripe Events (actual values are gateway-specific)
  STRIPE: {
    PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
    PAYMENT_INTENT_PAYMENT_FAILED: 'payment_intent.payment_failed',
    INVOICE_PAID: 'invoice.paid',
    INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
    CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
    CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
    // ... other relevant events
  },
  // Example PayPal Events
  PAYPAL: {
    PAYMENT_CAPTURE_COMPLETED: 'PAYMENT.CAPTURE.COMPLETED',
    BILLING_SUBSCRIPTION_ACTIVATED: 'BILLING.SUBSCRIPTION.ACTIVATED',
    BILLING_SUBSCRIPTION_CANCELLED: 'BILLING.SUBSCRIPTION.CANCELLED',
    // ... other relevant events
  },
  // Add other gateways as needed
};

export const BILLING_CYCLE = {
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
} as const;

export const TRANSACTION_FEE_TYPE = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
} as const;