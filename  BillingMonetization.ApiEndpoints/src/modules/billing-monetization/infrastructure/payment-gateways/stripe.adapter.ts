import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  IPaymentGatewayPort,
  PaymentInitiationDetails,
  PaymentInitiationResult,
  PaymentChargeResult,
  CustomerDetails,
  GatewayCustomer,
  WebhookEvent, // Though parseWebhookEvent is not implemented here, port requires it
} from '../../application/ports/payment-gateway.port';

@Injectable()
export class StripeAdapter implements IPaymentGatewayPort {
  private readonly stripeClient: Stripe;
  private readonly logger = new Logger(StripeAdapter.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!apiKey) {
      throw new Error('Stripe API key is not configured.');
    }
    this.stripeClient = new Stripe(apiKey, {
      apiVersion: '2024-04-10', // Specify a fixed API version
    });
  }

  /**
   * Initiates a payment with Stripe.
   * This typically involves creating a PaymentIntent.
   * @param details - PaymentInitiationDetails containing amount, currency, etc.
   * @returns Promise<PaymentInitiationResult> containing client_secret or other details.
   */
  async initiatePayment(details: PaymentInitiationDetails): Promise<PaymentInitiationResult> {
    this.logger.log(`Initiating Stripe payment for amount: ${details.amount} ${details.currency}`);
    try {
      const params: Stripe.PaymentIntentCreateParams = {
        amount: Math.round(details.amount * 100), // Stripe expects amount in cents
        currency: details.currency.toLowerCase(),
        description: details.description,
        payment_method: details.paymentMethodId,
        customer: details.customerId,
        confirm: !!details.paymentMethodId, // Confirm immediately if payment_method is provided
        confirmation_method: details.paymentMethodId ? 'automatic' : 'manual',
        metadata: details.metadata,
        // usage: details.subscriptionId ? 'off_session' : 'on_session', // if for subscription renewal
        // off_session: details.subscriptionId ? true : undefined, // if for subscription renewal
        // return_url: details.returnUrl, // For payments requiring redirection
      };

      // If paymentMethodId is not provided, client needs to confirm on frontend with client_secret
      // If it is provided, we might attempt to confirm it server-side.
      if (details.paymentMethodId && !params.confirm) {
        params.confirm = true;
      }
      if(details.returnUrl){
        params.return_url = details.returnUrl;
      }


      const paymentIntent = await this.stripeClient.paymentIntents.create(params);

      return {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
        requiresAction: ['requires_action', 'requires_source_action'].includes(paymentIntent.status),
        // redirectUrl: paymentIntent.next_action?.redirect_to_url?.url, // if applicable
      };
    } catch (error)
    {
      this.logger.error(`Stripe initiatePayment failed: ${error.message}`, error.stack);
      // It's good practice to map Stripe errors to custom domain errors or throw a generic payment error
      throw new Error(`Stripe payment initiation failed: ${error.message}`);
    }
  }

  /**
   * Charges a specific payment method.
   * This might be used for one-off charges or if a PaymentIntent is not preferred.
   * @param paymentMethodId - The ID of the Stripe PaymentMethod.
   * @param amount - Amount to charge.
   * @param currency - Currency code.
   * @param description - Description of the charge.
   * @param customerId - Optional Stripe Customer ID.
   * @returns Promise<PaymentChargeResult>
   */
  async chargePaymentMethod(
    paymentMethodId: string,
    amount: number,
    currency: string,
    description: string,
    customerId?: string,
  ): Promise<PaymentChargeResult> {
    this.logger.log(`Charging Stripe payment method ${paymentMethodId} for amount: ${amount} ${currency}`);
    try {
      const charge = await this.stripeClient.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        payment_method: paymentMethodId,
        customer: customerId,
        confirm: true,
        description: description,
        // off_session: !!customerId, // Assume off-session if customerId is provided (for saved cards)
      });

      if (charge.status === 'succeeded') {
        return {
          transactionId: charge.id,
          status: 'succeeded',
          amountCaptured: charge.amount_received / 100,
        };
      } else if (['requires_action', 'requires_source_action', 'requires_payment_method', 'requires_confirmation'].includes(charge.status)) {
         return {
            transactionId: charge.id,
            status: charge.status,
            clientSecret: charge.client_secret, // Important for SCA
            requiresAction: true,
         };
      }
       else {
        this.logger.warn(`Stripe charge for ${paymentMethodId} resulted in status: ${charge.status}`);
        return {
          transactionId: charge.id,
          status: charge.status,
          failureReason: charge.last_payment_error?.message || 'Unknown reason',
        };
      }
    } catch (error) {
      this.logger.error(`Stripe chargePaymentMethod failed: ${error.message}`, error.stack);
      throw new Error(`Stripe charge failed: ${error.message}`);
    }
  }

  /**
   * Creates a customer in Stripe.
   * @param customerDetails - Details like email, name, payment_method to attach.
   * @returns Promise<GatewayCustomer> containing the Stripe Customer ID.
   */
  async createCustomer(customerDetails: CustomerDetails): Promise<GatewayCustomer> {
    this.logger.log(`Creating Stripe customer for email: ${customerDetails.email}`);
    try {
      const customer = await this.stripeClient.customers.create({
        email: customerDetails.email,
        name: customerDetails.name,
        payment_method: customerDetails.paymentMethodId, // Optionally attach a payment method
        invoice_settings: customerDetails.paymentMethodId ? { default_payment_method: customerDetails.paymentMethodId } : undefined,
        metadata: customerDetails.metadata,
      });
      return {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      };
    } catch (error) {
      this.logger.error(`Stripe createCustomer failed: ${error.message}`, error.stack);
      throw new Error(`Stripe customer creation failed: ${error.message}`);
    }
  }

  /**
   * Verifies a webhook signature from Stripe.
   * @param payload - The raw request body (Buffer or string).
   * @param signature - The 'Stripe-Signature' header value.
   * @param secret - The webhook signing secret from Stripe dashboard.
   * @returns boolean - True if signature is valid, false otherwise.
   */
  verifyWebhookSignature(payload: string | Buffer, signature: string, secret: string): boolean {
    this.logger.log('Verifying Stripe webhook signature.');
    try {
      this.stripeClient.webhooks.constructEvent(
        payload,
        signature,
        secret,
      );
      this.logger.log('Stripe webhook signature verified successfully.');
      return true;
    } catch (err) {
      this.logger.warn(`Stripe webhook signature verification failed: ${err.message}`);
      return false;
    }
  }

  // The IPaymentGatewayPort defines these methods.
  // For this iteration, we are only implementing methods defined in the StripeAdapter's file definition.
  // These would need to be implemented for full port compliance.

  async attachPaymentMethodToCustomer(customerId: string, paymentMethodId: string): Promise<void> {
    this.logger.log(`Attaching payment method ${paymentMethodId} to customer ${customerId}`);
    try {
        await this.stripeClient.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        });
        // Optionally, set it as default payment method for subscriptions
        await this.stripeClient.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });
        this.logger.log(`Payment method ${paymentMethodId} attached and set as default for customer ${customerId}`);
    } catch (error) {
        this.logger.error(`Stripe attachPaymentMethodToCustomer failed: ${error.message}`, error.stack);
        throw new Error(`Stripe attach payment method failed: ${error.message}`);
    }
  }

  async parseWebhookEvent(payload: any): Promise<WebhookEvent> {
    this.logger.log('Parsing Stripe webhook event (raw payload).');
    // The actual event construction (if signature is verified) happens before this,
    // or this method assumes `payload` is the already verified Stripe.Event object.
    // If `payload` is the raw body, signature verification should happen first.
    // For this adapter, assuming `payload` is already a Stripe.Event object passed from service after verification.
    if (typeof payload === 'object' && payload.id && payload.type) {
        return {
            id: payload.id,
            type: payload.type,
            data: payload.data.object, // Or payload.data directly depending on needs
            rawData: payload, // The full event object
            source: 'stripe',
        };
    }
    this.logger.error('Invalid Stripe event object passed to parseWebhookEvent.');
    throw new Error('Invalid Stripe event object.');
  }
}