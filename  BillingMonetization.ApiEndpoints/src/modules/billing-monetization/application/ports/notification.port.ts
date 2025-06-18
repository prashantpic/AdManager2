// Using 'any' for details, but in a real system, these would be structured DTOs/models
export interface InvoiceDetailsForNotification {
  invoiceNumber: string;
  amountDue: number;
  currency: string;
  dueDate: Date;
  downloadUrl?: string;
}

export interface PaymentDetailsForNotification {
    amountPaid: number;
    currency: string;
    paymentDate: Date;
    invoiceNumber?: string;
}

export interface SubscriptionDetailsForNotification {
    planName: string;
    nextBillingDate?: Date;
    status: string;
}


export interface INotificationPort {
  sendPaymentSuccessNotification(
    merchantId: string,
    paymentDetails: PaymentDetailsForNotification,
    invoiceDetails?: InvoiceDetailsForNotification,
  ): Promise<void>;

  sendPaymentFailedNotification(
    merchantId: string,
    reason: string,
    attemptedAmount?: number,
    currency?: string,
    invoiceNumber?: string,
  ): Promise<void>;

  sendSubscriptionActivatedNotification(
    merchantId: string,
    subscriptionDetails: SubscriptionDetailsForNotification,
    invoiceDetails?: InvoiceDetailsForNotification,
  ): Promise<void>;
  
  sendSubscriptionUpdatedNotification(
    merchantId: string,
    subscriptionDetails: SubscriptionDetailsForNotification,
    prorationDetails?: { amount: number; description: string; currency: string },
  ): Promise<void>;

  sendSubscriptionRenewalSuccessNotification(
    merchantId: string,
    subscriptionDetails: SubscriptionDetailsForNotification,
    invoiceDetails: InvoiceDetailsForNotification,
  ): Promise<void>;
  
  sendSubscriptionRenewalFailedNotification(
    merchantId: string,
    subscriptionDetails: SubscriptionDetailsForNotification,
    reason: string,
  ): Promise<void>;

  sendSubscriptionCanceledNotification(
    merchantId: string,
    subscriptionDetails: SubscriptionDetailsForNotification,
    effectiveDate: Date,
  ): Promise<void>;

  sendSubscriptionSuspendedNotification(
    merchantId: string,
    subscriptionDetails: SubscriptionDetailsForNotification,
    reason: string,
  ): Promise<void>;

  sendUpcomingRenewalReminder(
    merchantId: string,
    subscriptionDetails: SubscriptionDetailsForNotification,
    renewalDate: Date,
    amountDue: number,
    currency: string,
  ): Promise<void>;

  sendInvoiceCreatedNotification(
    merchantId: string,
    invoiceDetails: InvoiceDetailsForNotification,
  ): Promise<void>;

  // Add more specific notification methods as needed
}

export const INotificationPort = Symbol('INotificationPort');