import { Controller, Get, Inject, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard'; // Assuming path
import { PlanRO } from '../dto/plan/plan.ro';
import { TransactionFeeConfigRO } from '../dto/plan/transaction-fee-config.ro';
import { IBillingMonetizationService } from '../../application/interfaces/billing-monetization-service.interface';

@ApiTags('Plans')
@Controller('/v1/billing/plans')
@UseGuards(JwtAuthGuard)
export class PlanController {
  constructor(
    @Inject('BillingMonetizationService') // Using token for injection as service is an interface
    private readonly billingMonetizationService: IBillingMonetizationService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'List Available Plans', description: 'Retrieves a list of all available Ad Manager subscription plans and their details.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved plans.', type: [PlanRO] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAllPlans(): Promise<PlanRO[]> {
    return this.billingMonetizationService.getAvailablePlans();
  }

  @Get('/:planId/transaction-fees')
  @ApiOperation({ summary: 'Get Plan Transaction Fees', description: 'Retrieves the transaction fee configuration for a specific subscription plan.' })
  @ApiParam({ name: 'planId', type: 'string', format: 'uuid', description: 'The ID of the plan.' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved plan transaction fee configuration.', type: TransactionFeeConfigRO })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Plan not found.' })
  async getPlanTransactionFees(@Param('planId', ParseUUIDPipe) planId: string): Promise<TransactionFeeConfigRO> {
    return this.billingMonetizationService.getPlanTransactionFeeConfig(planId);
  }
}