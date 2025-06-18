import { Injectable, Inject, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { IThirdPartyConnectivityService, WebhookSubscription } from '../../common/interfaces/ithird-party-connectivity.service';
import { CreateWebhookSubscriptionDto } from '../dto/create-webhook-subscription.dto';
import { WebhookSubscriptionResponseDto, UpdateWebhookSubscriptionDto } from '../dto/webhook-subscription-response.dto'; // Assuming DTOs exist
import { WebhookEventType } from '../../common/enums/webhook-event-type.enum';

/**
 * @class WebhookSubscriptionService
 * @description Service for managing webhook subscriptions for third-party applications.
 */
@Injectable()
export class WebhookSubscriptionService {
  private readonly logger = new Logger(WebhookSubscriptionService.name);

  constructor(
    @Inject('IThirdPartyConnectivityService')
    private readonly thirdPartyConnectivityService: IThirdPartyConnectivityService,
  ) {}

  /**
   * Creates a new webhook subscription for an application.
   * @param appId The ID of the application creating the subscription.
   * @param createDto DTO containing webhook subscription details.
   * @returns WebhookSubscriptionResponseDto for the created subscription.
   */
  async createSubscription(appId: string, createDto: CreateWebhookSubscriptionDto): Promise<WebhookSubscriptionResponseDto> {
    this.logger.log(`Creating webhook subscription for app ${appId}, target URL: ${createDto.targetUrl}`);

    if (!createDto.targetUrl.startsWith('https://')) {
      throw new HttpException('Target URL must use HTTPS.', HttpStatus.BAD_REQUEST);
    }

    // Validate event types against the enum
    const validEventTypes = Object.values(WebhookEventType);
    for (const eventType of createDto.eventTypes) {
      if (!validEventTypes.includes(eventType as WebhookEventType)) {
        throw new HttpException(`Invalid event type: ${eventType}`, HttpStatus.BAD_REQUEST);
      }
    }
    
    const subscriptionData: Omit<WebhookSubscription, 'id' | 'createdAt' | 'updatedAt'> = {
        appId: appId,
        targetUrl: createDto.targetUrl,
        eventTypes: createDto.eventTypes,
        isActive: true, // Default to active
    };

    if (createDto.secret) {
        // The ThirdPartyConnectivityService should handle secure storage of the secret (e.g., encryption)
        subscriptionData.secret = await this.thirdPartyConnectivityService.encryptWebhookSecret(createDto.secret);
    }

    const createdSubscription = await this.thirdPartyConnectivityService.createWebhookSubscription(subscriptionData);
    
    if(!createdSubscription) {
        this.logger.error(`Failed to create webhook subscription for app ${appId}`);
        throw new HttpException('Could not create webhook subscription.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    this.logger.log(`Webhook subscription created with ID ${createdSubscription.id} for app ${appId}`);
    return {
      id: createdSubscription.id,
      appId: createdSubscription.appId,
      targetUrl: createdSubscription.targetUrl,
      eventTypes: createdSubscription.eventTypes,
      isActive: createdSubscription.isActive,
      createdAt: createdSubscription.createdAt,
      updatedAt: createdSubscription.updatedAt,
    };
  }

  /**
   * Lists all webhook subscriptions for a given application.
   * @param appId The ID of the application.
   * @returns An array of WebhookSubscriptionResponseDto.
   */
  async listSubscriptions(appId: string): Promise<WebhookSubscriptionResponseDto[]> {
    this.logger.debug(`Listing webhook subscriptions for app ID: ${appId}`);
    const subscriptions = await this.thirdPartyConnectivityService.findWebhookSubscriptionsByAppId(appId);
    return subscriptions.map(sub => ({
      id: sub.id,
      appId: sub.appId,
      targetUrl: sub.targetUrl,
      eventTypes: sub.eventTypes,
      isActive: sub.isActive,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt,
    }));
  }

  /**
   * Updates an existing webhook subscription.
   * @param subscriptionId The ID of the subscription to update.
   * @param appId The ID of the application owning the subscription (for authorization).
   * @param updateDto DTO containing fields to update.
   * @returns The updated WebhookSubscriptionResponseDto.
   */
  async updateSubscription(subscriptionId: string, appId: string, updateDto: UpdateWebhookSubscriptionDto): Promise<WebhookSubscriptionResponseDto> {
    this.logger.log(`Updating webhook subscription ID: ${subscriptionId} for app ID: ${appId}`);
    const existingSubscription = await this.thirdPartyConnectivityService.findWebhookSubscriptionByIdAndAppId(subscriptionId, appId);

    if (!existingSubscription) {
      this.logger.warn(`Webhook subscription ${subscriptionId} not found or app ${appId} not authorized.`);
      throw new HttpException('Webhook subscription not found or access denied.', HttpStatus.NOT_FOUND);
    }

    const updateData: Partial<Omit<WebhookSubscription, 'id'|'appId'|'createdAt'|'updatedAt'>> = {};

    if (updateDto.targetUrl !== undefined) {
      if (!updateDto.targetUrl.startsWith('https://')) {
        throw new HttpException('Target URL must use HTTPS.', HttpStatus.BAD_REQUEST);
      }
      updateData.targetUrl = updateDto.targetUrl;
    }
    if (updateDto.eventTypes !== undefined) {
        const validEventTypes = Object.values(WebhookEventType);
        for (const eventType of updateDto.eventTypes) {
            if (!validEventTypes.includes(eventType as WebhookEventType)) {
            throw new HttpException(`Invalid event type: ${eventType}`, HttpStatus.BAD_REQUEST);
            }
        }
        updateData.eventTypes = updateDto.eventTypes;
    }
    if (updateDto.secret !== undefined) { // Allow updating or removing secret
        updateData.secret = updateDto.secret ? await this.thirdPartyConnectivityService.encryptWebhookSecret(updateDto.secret) : null;
    }
    if (updateDto.isActive !== undefined) {
        updateData.isActive = updateDto.isActive;
    }

    if (Object.keys(updateData).length === 0) {
        throw new HttpException('No update data provided.', HttpStatus.BAD_REQUEST);
    }

    const updatedSubscription = await this.thirdPartyConnectivityService.updateWebhookSubscription(subscriptionId, appId, updateData);

    if(!updatedSubscription) {
        this.logger.error(`Failed to update webhook subscription ${subscriptionId} for app ${appId}`);
        throw new HttpException('Could not update webhook subscription.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.logger.log(`Webhook subscription ID: ${subscriptionId} updated successfully.`);
    return {
      id: updatedSubscription.id,
      appId: updatedSubscription.appId,
      targetUrl: updatedSubscription.targetUrl,
      eventTypes: updatedSubscription.eventTypes,
      isActive: updatedSubscription.isActive,
      createdAt: updatedSubscription.createdAt,
      updatedAt: updatedSubscription.updatedAt,
    };
  }

  /**
   * Deletes a webhook subscription.
   * @param subscriptionId The ID of the subscription to delete.
   * @param appId The ID of the application owning the subscription (for authorization).
   */
  async deleteSubscription(subscriptionId: string, appId: string): Promise<void> {
    this.logger.log(`Deleting webhook subscription ID: ${subscriptionId} for app ID: ${appId}`);
    const existingSubscription = await this.thirdPartyConnectivityService.findWebhookSubscriptionByIdAndAppId(subscriptionId, appId);

    if (!existingSubscription) {
      this.logger.warn(`Webhook subscription ${subscriptionId} not found or app ${appId} not authorized for deletion.`);
      throw new HttpException('Webhook subscription not found or access denied.', HttpStatus.NOT_FOUND);
    }

    await this.thirdPartyConnectivityService.deleteWebhookSubscription(subscriptionId, appId);
    this.logger.log(`Webhook subscription ID: ${subscriptionId} deleted successfully.`);
  }
}