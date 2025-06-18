import { Controller, Post, Body, Get, Param, Query, Headers, Req, UseGuards, Inject, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard'; // Assuming path
import { User } from '../../../../auth/decorators/user.decorator'; // Assuming path
import { InitiatePaymentDto } from '../dto/payment/initiate-payment.dto';
import { InitiatePaymentResponseRO } from '../dto/payment/initiate-payment-response.ro';
import { PaymentWebhookPayloadDto } from '../dto/payment/payment-webhook-payload.dto';
import { BillingStatusRO } from '../dto/payment/billing-status.ro';
import { PaymentMethodUpdateDto } from '../dto/payment/payment-method-update.dto';
import { PaginationOptionsDto } from '../dto/common/pagination-options.dto';
import { PaginatedResponseRO } from '../dto/common/paginated-response.ro';
import { InvoiceRO } from '../dto/payment/invoice.ro';
import { IBillingMonetizationService } from '../../application/interfaces/billing-monetization-service.interface';
import { RawBodyRequest } from '@nestjs/common'; // For req.rawBody
import { Request } from 'express'; // For RawBodyRequest<Request>

@ApiTags('Payments')
@Controller('/v1/billing/payments')
export class PaymentController {
  constructor(
    @Inject('BillingMonetizationService')
    private readonly billingMonetizationService: IBillingMonetizationService,
  ) {}

  @Post('/initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate Payment', description: 'Initiates a payment process for a subscription or other billable service.' })
  @ApiBody({ type: InitiatePaymentDto })
  @ApiResponse({ status: 200, description: 'Payment initiated successfully.', type: InitiatePaymentResponseRO })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async initiatePayment(
    @Body() initiatePaymentDto: InitiatePaymentDto,
    @User('merchantId') merchantId: string,
  ): Promise<InitiatePaymentResponseRO> {
    return this.billingMonetizationService.initiatePayment(initiatePaymentDto, merchantId);
  }

  @Post('/webhooks/:gateway')
  @HttpCode(HttpStatus.OK) // Respond 200 OK on successful processing, or let service throw error
  @ApiOperation({ summary: 'Handle Payment Gateway Webhook', description: 'Receives and processes asynchronous webhook notifications from payment gateways.' })
  @ApiParam({ name: 'gateway', type: 'string', description: 'Payment gateway identifier (e.g., stripe, paypal).' })
  @ApiBody({ description: 'Webhook payload from the payment gateway.', type: PaymentWebhookPayloadDto }) // Type is generic
  @ApiHeader({ name: 'stripe-signature', description: 'Stripe signature for webhook verification (if gateway is Stripe).', required: false })
  // Add other gateway-specific signature headers as needed with @ApiHeader
  @ApiResponse({ status: 200, description: 'Webhook processed successfully.' })
  @ApiResponse({ status: 204, description: 'Webhook processed successfully (no content).' }) // Alternative success
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., invalid signature, malformed payload).' })
  async handlePaymentWebhook(
    @Param('gateway') gateway: string,
    @Body() payload: PaymentWebhookPayloadDto, // NestJS will parse if content-type is JSON and rawBody middleware re-parses it.
    @Headers('stripe-signature') stripeSignature?: string,
    // Add other gateway-specific signature headers here if needed
    // e.g. @Headers('paypal-transmission-sig') payPalSignature?: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<void> {
    // The rawBody should be populated by the middleware configured in main.ts
    // Signature verification and processing logic is in the service.
    // Pass relevant signature header to the service. For now, passing stripeSignature.
    // The service might need to determine which signature to use based on the 'gateway' param.
    await this.billingMonetizationService.processPaymentWebhook(gateway, payload, stripeSignature, req.rawBody);
  }

  @Get('/status/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Merchant Billing Status', description: 'Retrieves the current billing status for the authenticated merchant.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved billing status.', type: BillingStatusRO })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getBillingStatus(@User('merchantId') merchantId: string): Promise<BillingStatusRO> {
    return this.billingMonetizationService.getMerchantBillingStatus(merchantId);
  }

  @Post('/methods/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK) // Can be 200 or 204
  @ApiOperation({ summary: 'Update Merchant Payment Method', description: 'Allows a merchant to add or update their default payment method.' })
  @ApiBody({ type: PaymentMethodUpdateDto })
  @ApiResponse({ status: 200, description: 'Payment method updated successfully.'})
  @ApiResponse({ status: 204, description: 'Payment method updated successfully (no content).'})
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updatePaymentMethod(
    @Body() paymentMethodUpdateDto: PaymentMethodUpdateDto,
    @User('merchantId') merchantId: string,
  ): Promise<void> {
    await this.billingMonetizationService.updateMerchantPaymentMethod(paymentMethodUpdateDto, merchantId);
  }

  @Get('/invoices/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List Merchant Invoices', description: 'Retrieves a paginated list of invoices for the authenticated merchant.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page.' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by.' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order (ASC or DESC).' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved invoices.', type: PaginatedResponseRO<InvoiceRO> }) // Swagger needs generic
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getInvoices(
    @User('merchantId') merchantId: string,
    @Query() paginationOptions: PaginationOptionsDto,
  ): Promise<PaginatedResponseRO<InvoiceRO>> {
    return this.billingMonetizationService.getMerchantInvoices(merchantId, paginationOptions);
  }

  @Get('/invoices/me/:invoiceId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Merchant Invoice by ID', description: 'Retrieves a specific invoice by ID for the authenticated merchant.' })
  @ApiParam({ name: 'invoiceId', type: 'string', format: 'uuid', description: 'The ID of the invoice.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved invoice.', type: InvoiceRO })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  async getInvoiceById(
    @User('merchantId') merchantId: string,
    @Param('invoiceId', ParseUUIDPipe) invoiceId: string,
  ): Promise<InvoiceRO | null> {
    return this.billingMonetizationService.getMerchantInvoiceById(merchantId, invoiceId);
  }
}