import { Controller, Post, Body, UseGuards, Inject, HttpCode, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiHeader } from '@nestjs/swagger';
import { IZapierService } from '../interfaces/zapier-service.interface';
import { ReceiveGoogleAdsLeadDto } from '../dto/receive-google-ads-lead.dto';
import { ReceiveGoogleAdsPerformanceDto } from '../dto/receive-google-ads-performance.dto';
import { ZapierWebhookGuard } from '../guards/zapier-webhook.guard';
import { GOOGLE_ADS_LEAD_WEBHOOK_PATH, GOOGLE_ADS_PERFORMANCE_WEBHOOK_PATH, ZAPIER_SIGNATURE_HEADER } from '../zapier.constants';

/**
 * @fileoverview Controller for handling incoming webhook requests from Zapier.
 * @namespace AdManager.ThirdPartyConnectivity.Zapier.V1
 */
@ApiTags('Zapier Webhooks (v1)')
@Controller('zapier/v1/webhooks/merchants/:merchantId') // Assuming merchant-specific webhook URLs
@ApiHeader({ // For documentation purposes, the guard will actually check this
    name: ZAPIER_SIGNATURE_HEADER, // Or 'x-zapier-secret'
    description: 'Zapier Webhook Signature or Shared Secret for validation.',
    required: true,
})
export class ZapierController {
  /**
   * Constructs an instance of ZapierController.
   * @param zapierService - The Zapier service instance injected via DI.
   */
  constructor(
    @Inject(IZapierService) private readonly zapierService: IZapierService,
  ) {}

  /**
   * Handles incoming Google Ads lead data from Zapier.
   * This endpoint is secured by the ZapierWebhookGuard.
   * @param merchantId - The unique identifier of the merchant.
   * @param payload - The DTO containing the Google Ads lead data.
   * @returns A promise that resolves to an object with a success message.
   */
  @Post(GOOGLE_ADS_LEAD_WEBHOOK_PATH)
  @UseGuards(ZapierWebhookGuard)
  @HttpCode(HttpStatus.ACCEPTED) // Use 202 Accepted if processing is asynchronous
  @ApiOperation({ summary: 'Receive Google Ads lead data from Zapier' })
  @ApiParam({ name: 'merchantId', type: 'string', format: 'uuid', description: 'Merchant Identifier' })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Lead data received and queued for processing.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid payload.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Webhook authentication failed.' })
  async handleGoogleAdsLeadWebhook(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Body() payload: ReceiveGoogleAdsLeadDto,
  ): Promise<{ message: string }> {
    // The guard will run first. If it passes, this method is executed.
    await this.zapierService.processIncomingGoogleAdsLead(merchantId, payload);
    return { message: 'Google Ads lead data received successfully.' };
  }

  /**
   * Handles incoming Google Ads performance data from Zapier.
   * This endpoint is secured by the ZapierWebhookGuard.
   * @param merchantId - The unique identifier of the merchant.
   * @param payload - The DTO containing the Google Ads performance data.
   * @returns A promise that resolves to an object with a success message.
   */
  @Post(GOOGLE_ADS_PERFORMANCE_WEBHOOK_PATH)
  @UseGuards(ZapierWebhookGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Receive Google Ads performance data from Zapier' })
  @ApiParam({ name: 'merchantId', type: 'string', format: 'uuid', description: 'Merchant Identifier' })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Performance data received and queued for processing.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid payload.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Webhook authentication failed.' })
  async handleGoogleAdsPerformanceWebhook(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Body() payload: ReceiveGoogleAdsPerformanceDto,
  ): Promise<{ message: string }> {
    await this.zapierService.processIncomingGoogleAdsPerformance(merchantId, payload);
    return { message: 'Google Ads performance data received successfully.' };
  }

  // Potentially, add endpoints here if Ad Manager needs to *trigger* Zaps
  // based on internal Ad Manager events. This would involve this controller
  // calling methods on ZapierService like triggerZapForLeadManagement.
  // However, REQ-TCE-006 focuses on Zapier sending data *to* Ad Manager.
  // Outbound triggers would typically be initiated by other domain services within Ad Manager.
}