import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AffiliateMarketingService } from '../../services/affiliate-marketing.service';
import { ProcessPayoutsDto } from '../../dto/merchant/payouts/process-payouts.dto';
import { PayoutResponseDto } from '../../dto/merchant/payouts/payout.response.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';

interface AuthenticatedUser {
  userId: string;
  merchantId: string;
  roles: string[];
}

@ApiTags('Merchant - Affiliate Payouts')
@ApiBearerAuth('JWT')
@Controller('affiliate-marketing/merchant/payouts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AffiliatePayoutsMerchantController {
  constructor(
    private readonly affiliateMarketingService: AffiliateMarketingService,
  ) {}

  @Get('pending')
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'List pending affiliate payouts for the merchant (REQ-AMP-005)' })
  @ApiQuery({ name: 'programId', description: 'Optional: Filter by program ID', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved list of pending payouts.',
    type: [PayoutResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async getPendingPayouts(
    @AuthUser() user: AuthenticatedUser,
    @Query('programId') programId?: string,
  ): Promise<PayoutResponseDto[]> {
    return this.affiliateMarketingService.getPendingPayoutsForMerchant(
      user.merchantId,
      programId,
    );
  }

  @Post('process')
  @Roles('MerchantAdmin')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Process (initiate/mark as paid) affiliate payouts (REQ-AMP-005)' })
  @ApiBody({ type: ProcessPayoutsDto })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Payout processing initiated successfully.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async processPayouts(
    @AuthUser() user: AuthenticatedUser,
    @Body() processPayoutsDto: ProcessPayoutsDto,
  ): Promise<void> {
    return this.affiliateMarketingService.processAffiliatePayouts(
      user.merchantId,
      processPayoutsDto,
    );
  }

  @Get('history')
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Get payout history for affiliates (REQ-AMP-005)' })
  @ApiQuery({ name: 'affiliateId', description: 'Optional: Filter by affiliate ID', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved payout history.',
    type: [PayoutResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async getPayoutHistory(
    @AuthUser() user: AuthenticatedUser,
    @Query('affiliateId') affiliateId?: string,
  ): Promise<PayoutResponseDto[]> {
    // Note: The SDS mentions a service method to be added: `getPayoutHistoryForMerchant(merchantId, affiliateId?)`
    // This will call a conceptual method as per SDS.
    // For now, let's assume it exists on the service or adjust if the service method is different.
    if (typeof (this.affiliateMarketingService as any).getPayoutHistoryForMerchant === 'function') {
         return (this.affiliateMarketingService as any).getPayoutHistoryForMerchant(user.merchantId, affiliateId);
    }
    throw new Error('getPayoutHistoryForMerchant method not implemented in service as per current spec for generation');
  }
}