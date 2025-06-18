import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Logger, HttpCode, HttpStatus, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { WebhookSubscriptionService } from '../services/webhook-subscription.service';
import { CreateWebhookSubscriptionDto } from '../dto/create-webhook-subscription.dto';
import { UpdateWebhookSubscriptionDto } from '../dto/update-webhook-subscription.dto';
import { WebhookSubscriptionResponseDto } from '../dto/webhook-subscription-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ScopesGuard } from '../../auth/guards/scopes.guard';
import { CurrentApp } from '../../common/decorators/current-app.decorator'; // Custom decorator
import { RegisteredApp } from '../../common/models/registered-app.model'; // Placeholder for app model from JWT
import { Scopes } from '../../common/decorators/scopes.decorator'; // Custom decorator for scopes

/**
 * API controller for third-party applications to manage their webhook subscriptions.
 * Requires app authentication via OAuth JWT.
 */
@ApiTags('Webhooks')
@Controller('webhooks/subscriptions')
@UseGuards(JwtAuthGuard, ScopesGuard)
@ApiBearerAuth('jwt')
export class WebhookSubscriptionController {
  private readonly logger = new Logger(WebhookSubscriptionController.name);

  constructor(private readonly webhookSubscriptionService: WebhookSubscriptionService) {}

  /**
   * Creates a new webhook subscription for the authenticated app.
   * @param createDto - Data for creating the webhook subscription.
   * @param app - The authenticated application.
   * @returns The created webhook subscription.
   */
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @Scopes('webhooks:manage', 'webhooks:write') // Example scopes
  @ApiOperation({ summary: 'Create a new webhook subscription' })
  @ApiBody({ type: CreateWebhookSubscriptionDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Webhook subscription created successfully.', type: WebhookSubscriptionResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid subscription data.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient scope or app not permitted.' })
  async create(
    @Body() createDto: CreateWebhookSubscriptionDto,
    @CurrentApp() app: RegisteredApp,
  ): Promise<WebhookSubscriptionResponseDto> {
    this.logger.log(`App ${app.clientId} creating webhook subscription for target: ${createDto.targetUrl}`);
    if (!app || !app.id) {
        this.logger.warn(`Attempt to create webhook subscription without authenticated app context.`);
        throw new ForbiddenException('Authenticated application context is required.');
    }
    return this.webhookSubscriptionService.createSubscription(app.id, createDto);
  }

  /**
   * Lists all webhook subscriptions for the authenticated app.
   * @param app - The authenticated application.
   * @returns A list of webhook subscriptions.
   */
  @Get('/')
  @Scopes('webhooks:manage', 'webhooks:read') // Example scopes
  @ApiOperation({ summary: 'List all webhook subscriptions for the app' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Subscriptions listed successfully.', type: [WebhookSubscriptionResponseDto] })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient scope or app not permitted.' })
  async findAll(
    @CurrentApp() app: RegisteredApp,
  ): Promise<WebhookSubscriptionResponseDto[]> {
    this.logger.log(`App ${app.clientId} listing its webhook subscriptions.`);
     if (!app || !app.id) {
        this.logger.warn(`Attempt to list webhook subscriptions without authenticated app context.`);
        throw new ForbiddenException('Authenticated application context is required.');
    }
    return this.webhookSubscriptionService.listSubscriptions(app.id);
  }
  
  /**
   * Retrieves a specific webhook subscription for the authenticated app.
   * @param id - The ID of the webhook subscription.
   * @param app - The authenticated application.
   * @returns The webhook subscription details.
   */
  @Get('/:subscriptionId')
  @Scopes('webhooks:manage', 'webhooks:read')
  @ApiOperation({ summary: 'Get a specific webhook subscription' })
  @ApiParam({ name: 'subscriptionId', description: 'The ID of the webhook subscription', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Subscription details retrieved.', type: WebhookSubscriptionResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscription not found.'})
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient scope or app not permitted.' })
  async findOne(
    @Param('subscriptionId') id: string,
    @CurrentApp() app: RegisteredApp,
  ): Promise<WebhookSubscriptionResponseDto> {
    this.logger.log(`App ${app.clientId} retrieving webhook subscription ${id}.`);
    if (!app || !app.id) {
        this.logger.warn(`Attempt to get webhook subscription ${id} without authenticated app context.`);
        throw new ForbiddenException('Authenticated application context is required.');
    }
    const subscription = await this.webhookSubscriptionService.getSubscriptionById(id, app.id);
    if (!subscription) {
        throw new NotFoundException(`Webhook subscription with ID ${id} not found or not accessible by app ${app.clientId}.`);
    }
    return subscription;
  }


  /**
   * Updates an existing webhook subscription for the authenticated app.
   * @param id - The ID of the webhook subscription to update.
   * @param updateDto - Data to update the subscription with.
   * @param app - The authenticated application.
   * @returns The updated webhook subscription.
   */
  @Put('/:subscriptionId')
  @Scopes('webhooks:manage', 'webhooks:write') // Example scopes
  @ApiOperation({ summary: 'Update an existing webhook subscription' })
  @ApiParam({ name: 'subscriptionId', description: 'The ID of the webhook subscription', type: String })
  @ApiBody({ type: UpdateWebhookSubscriptionDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Subscription updated successfully.', type: WebhookSubscriptionResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid update data.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscription not found.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient scope or app not permitted.' })
  async update(
    @Param('subscriptionId') id: string,
    @Body() updateDto: UpdateWebhookSubscriptionDto,
    @CurrentApp() app: RegisteredApp,
  ): Promise<WebhookSubscriptionResponseDto> {
    this.logger.log(`App ${app.clientId} updating webhook subscription ${id}.`);
    if (!app || !app.id) {
        this.logger.warn(`Attempt to update webhook subscription ${id} without authenticated app context.`);
        throw new ForbiddenException('Authenticated application context is required.');
    }
    return this.webhookSubscriptionService.updateSubscription(id, app.id, updateDto);
  }

  /**
   * Deletes a webhook subscription for the authenticated app.
   * @param id - The ID of the webhook subscription to delete.
   * @param app - The authenticated application.
   */
  @Delete('/:subscriptionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Scopes('webhooks:manage', 'webhooks:delete') // Example scopes
  @ApiOperation({ summary: 'Delete a webhook subscription' })
  @ApiParam({ name: 'subscriptionId', description: 'The ID of the webhook subscription', type: String })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Subscription deleted successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscription not found.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Insufficient scope or app not permitted.' })
  async remove(
    @Param('subscriptionId') id: string,
    @CurrentApp() app: RegisteredApp,
  ): Promise<void> {
    this.logger.log(`App ${app.clientId} deleting webhook subscription ${id}.`);
    if (!app || !app.id) {
        this.logger.warn(`Attempt to delete webhook subscription ${id} without authenticated app context.`);
        throw new ForbiddenException('Authenticated application context is required.');
    }
    await this.webhookSubscriptionService.deleteSubscription(id, app.id);
  }
}