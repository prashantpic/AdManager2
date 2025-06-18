import { Controller, Get, Post, Put, Body, Inject, UseGuards, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard'; // Assuming path
import { User } from '../../../../auth/decorators/user.decorator'; // Assuming path
import { CreateSubscriptionDto } from '../dto/subscription/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dto/subscription/update-subscription.dto';
import { SubscriptionRO } from '../dto/subscription/subscription.ro';
import { IBillingMonetizationService } from '../../application/interfaces/billing-monetization-service.interface';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@Controller('/v1/billing/subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(
    @Inject('BillingMonetizationService')
    private readonly billingMonetizationService: IBillingMonetizationService,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Create Subscription', description: 'Creates a new subscription for the authenticated merchant.' })
  @ApiBody({ type: CreateSubscriptionDto })
  @ApiResponse({ status: 201, description: 'Subscription created successfully.', type: SubscriptionRO })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Plan not found.' })
  @ApiResponse({ status: 409, description: 'Merchant already has an active subscription.' })
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @User('merchantId') merchantId: string,
  ): Promise<SubscriptionRO> {
    return this.billingMonetizationService.createSubscription(createSubscriptionDto, merchantId);
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get Current Merchant Subscription', description: 'Retrieves the current active subscription details for the authenticated merchant.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved current subscription.', type: SubscriptionRO, nullable: true })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getCurrentSubscription(@User('merchantId') merchantId: string): Promise<SubscriptionRO | null> {
    return this.billingMonetizationService.getCurrentSubscription(merchantId);
  }

  @Put('/me')
  @ApiOperation({ summary: 'Update Subscription (Upgrade/Downgrade)', description: 'Allows a merchant to upgrade or downgrade their current subscription.' })
  @ApiBody({ type: UpdateSubscriptionDto })
  @ApiResponse({ status: 200, description: 'Subscription update request processed successfully.', type: SubscriptionRO })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Current subscription or new plan not found.' })
  async updateSubscription(
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @User('merchantId') merchantId: string,
  ): Promise<SubscriptionRO> {
    return this.billingMonetizationService.updateSubscription(updateSubscriptionDto, merchantId);
  }
}