// Placeholder interfaces for types not fully defined in SDS for this layer
// These would typically be more detailed domain/DTO types.
export interface PaymentInitiationDetails {
  amount: number;
  currency: string;
  description: string;
  merchantId: string; // ID of the merchant initiating payment
  paymentMethodId?: string; // Optional pre-selected payment method
  customerId?: string; // Optional gateway customer ID
  metadata?: Record<string, any>; // For subscriptionId, invoiceId, etc.
  returnUrl?: string; // For redirect flows
  paymentGatewayName?: string; // e.g. 'stripe', 'paypal'
}

export interface PaymentInitiationResult {
  paymentIntentId?: string; // e.g., Stripe PaymentIntent ID
  clientSecret?: string; // For client-side confirmation (Stripe)
  redirectUrl?: string; // URL for user redirection (e.g., 3DS, PayPal checkout)
  status: string; // e.g., 'requires_action', 'succeeded', 'pending'
  providerRawResponse?: any; // Raw response from the gateway
}

export interface PaymentChargeResult {
  transactionId: string; // Gateway's transaction ID
  status: 'succeeded' | 'failed' | 'pending';
  amountCharged: number;
  currency: string;
  failureCode?: string;
  failureMessage?: string;
  providerRawResponse?: any;
}

export interface CustomerDetails {
  email: string;
  name?: string;
  merchantId: string; // Internal merchant ID
  metadata?: Record<string, any>;
}

export interface GatewayCustomer {
  id: string; // Gateway's customer ID
  email: string;
  name?: string;
  merchantId?: string; // Internal merchant ID if stored in gateway metadata
  providerRawResponse?: any;
}

export interface WebhookEvent<T = any> {
  id: string; // Event ID from the gateway
  type: string; // Event type (e.g., 'payment_intent.succeeded')
  data: T; // Parsed event data object
  apiVersion?: string;
  createdAt: Date; // Timestamp of the event from gateway
  providerRawPayload?: any; // The raw payload for reference
}


export interface IPaymentGatewayPort {
  /**
   * Initiates a payment process with the payment gateway.
   * This could involve creating a payment intent, setting up a transaction,
   * and returning details needed for client-side actions (like a client secret or redirect URL).
   */
  initiatePayment(details: PaymentInitiationDetails): Promise<PaymentInitiationResult>;

  /**
   * Directly charges a previously saved payment method.
   * Useful for recurring billing or server-initiated payments.
   */
  chargePaymentMethod(
    paymentMethodId: string,
    amount: number,
    currency: string,
    description: string,
    merchantId: string, // Internal merchant ID
    customerId?: string, // Gateway customer ID
    metadata?: Record<string, any>,
  ): Promise<PaymentChargeResult>;

  /**
   * Creates a customer record in the payment gateway.
   * Useful for saving payment methods and managing recurring subscriptions.
   */
  createCustomer(customerDetails: CustomerDetails): Promise<GatewayCustomer>;

  /**
   * Attaches a payment method to an existing customer in the payment gateway.
   */
  attachPaymentMethodToCustomer(
    customerId: string, // Gateway customer ID
    paymentMethodId: string, // Gateway payment method ID
    isDefault?: boolean
  ): Promise<void>;

  /**
   * Verifies the signature of an incoming webhook request to ensure its authenticity.
   * @param rawPayload The raw request body (Buffer or string).
   * @param signature The signature string from the request headers (e.g., 'Stripe-Signature').
   * @param secret The webhook signing secret provided by the gateway.
   * @returns True if the signature is valid, false otherwise.
   */
  verifyWebhookSignature(
    rawPayload: string | Buffer,
    signature: string,
    secret: string,
  ): Promise<boolean>; // Changed to Promise as some SDKs might be async

  /**
   * Parses the raw webhook payload into a structured event object.
   * This method might also perform initial validation or event type recognition.
   * @param rawPayload The raw request body, potentially already verified.
   * @param signature Optional signature for combined parsing and verification if supported by SDK.
   * @param secret Optional secret for combined parsing and verification.
   * @returns A structured WebhookEvent object.
   */
  parseWebhookEvent<T = any>(
    rawPayload: string | Buffer,
    signature?: string, // If SDK supports constructEvent directly
    secret?: string    // If SDK supports constructEvent directly
  ): Promise<WebhookEvent<T>>;
}

export const IPaymentGatewayPort = Symbol('IPaymentGatewayPort');