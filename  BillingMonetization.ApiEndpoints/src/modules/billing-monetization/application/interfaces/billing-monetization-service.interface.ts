import { PlanRO, TransactionFeeConfigRO } from '../../api/dto/plan';
import { CreateSubscriptionDto, SubscriptionRO, UpdateSubscriptionDto } from '../../api/dto/subscription';
import {
  InitiatePaymentDto,
  InitiatePaymentResponseRO,
  BillingStatusRO,
  PaymentMethodUpdateDto,
  InvoiceRO,
} from '../../api/dto/payment';
import { AppCommissionReportRO, ReportQueryDto, TransactionFeeReportRO } from '../../api/dto/report';
import { PaginatedResponseRO, PaginationOptionsDto } from '../../api/dto/common';

export const BILLING_MONETIZATION_SERVICE = 'IBillingMonetizationService';

export interface IBillingMonetizationService {
  /**
   * Retrieves a list of all available Ad Manager subscription plans.
   * @returns A promise that resolves to an array of PlanRO objects.
   */
  getAvailablePlans(): Promise<PlanRO[]>;

  /**
   * Retrieves the transaction fee configuration for a specific subscription plan.
   * @param planId The ID of the plan.
   * @returns A promise that resolves to the TransactionFeeConfigRO.
   */
  getPlanTransactionFeeConfig(planId: string): Promise<TransactionFeeConfigRO>;

  /**
   * Creates a new subscription for a merchant.
   * @param dto The data transfer object for creating a subscription.
   * @param merchantId The ID of the merchant.
   * @returns A promise that resolves to the created SubscriptionRO.
   */
  createSubscription(dto: CreateSubscriptionDto, merchantId: string): Promise<SubscriptionRO>;

  /**
   * Retrieves the current active subscription details for a merchant.
   * @param merchantId The ID of the merchant.
   * @returns A promise that resolves to the SubscriptionRO or null if no active subscription.
   */
  getCurrentSubscription(merchantId: string): Promise<SubscriptionRO | null>;

  /**
   * Allows a merchant to upgrade or downgrade their current subscription.
   * @param dto The data transfer object for updating a subscription.
   * @param merchantId The ID of the merchant.
   * @returns A promise that resolves to the updated SubscriptionRO.
   */
  updateSubscription(dto: UpdateSubscriptionDto, merchantId: string): Promise<SubscriptionRO>;

  /**
   * Initiates a payment process for a subscription or other billable service.
   * @param dto The data transfer object for initiating a payment.
   * @param merchantId The ID of the merchant.
   * @returns A promise that resolves to the InitiatePaymentResponseRO.
   */
  initiatePayment(dto: InitiatePaymentDto, merchantId: string): Promise<InitiatePaymentResponseRO>;

  /**
   * Processes asynchronous webhook notifications from payment gateways.
   * @param gateway The identifier of the payment gateway (e.g., 'stripe').
   * @param payload The webhook payload from the gateway.
   * @param signature The signature header for verifying the webhook's authenticity.
   * @param rawBody The raw request body for signature verification.
   * @returns A promise that resolves when processing is complete.
   */
  processPaymentWebhook(gateway: string, payload: any, signature?: string, rawBody?: Buffer | string): Promise<void>;

  /**
   * Retrieves the current billing status for a merchant.
   * @param merchantId The ID of the merchant.
   * @returns A promise that resolves to the BillingStatusRO.
   */
  getMerchantBillingStatus(merchantId: string): Promise<BillingStatusRO>;

  /**
   * Allows a merchant to add or update their default payment method.
   * @param dto The data transfer object for updating a payment method.
   * @param merchantId The ID of the merchant.
   * @returns A promise that resolves when the payment method is updated.
   */
  updateMerchantPaymentMethod(dto: PaymentMethodUpdateDto, merchantId: string): Promise<void>;

  /**
   * Retrieves a paginated list of invoices for a merchant.
   * @param merchantId The ID of the merchant.
   * @param paginationOptions Options for pagination.
   * @returns A promise that resolves to a PaginatedResponseRO of InvoiceRO.
   */
  getMerchantInvoices(merchantId: string, paginationOptions: PaginationOptionsDto): Promise<PaginatedResponseRO<InvoiceRO>>;

  /**
   * Retrieves a specific invoice by ID for a merchant.
   * @param merchantId The ID of the merchant.
   * @param invoiceId The ID of the invoice.
   * @returns A promise that resolves to the InvoiceRO or null if not found.
   */
  getMerchantInvoiceById(merchantId: string, invoiceId: string): Promise<InvoiceRO | null>;

  /**
   * Retrieves a summary of transaction fees incurred by a merchant for a specified period.
   * @param merchantId The ID of the merchant.
   * @param options Query options for the report (e.g., startDate, endDate).
   * @returns A promise that resolves to the TransactionFeeReportRO.
   */
  generateTransactionFeeReport(merchantId: string, options: ReportQueryDto): Promise<TransactionFeeReportRO>;

  /**
   * Retrieves a summary of App Store commissions earned by the platform.
   * @param options Query options for the report (e.g., startDate, endDate).
   * @returns A promise that resolves to the AppCommissionReportRO.
   */
  generateAppCommissionReport(options: ReportQueryDto): Promise<AppCommissionReportRO>;
}