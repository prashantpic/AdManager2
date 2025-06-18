import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AffiliateMarketingService } from '../../services/affiliate-marketing.service';
import { DashboardMetricsResponseDto } from '../../dto/merchant/dashboard/dashboard-metrics.response.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';

interface AuthenticatedUser {
  userId: string;
  merchantId: string;
  roles: string[];
}

@ApiTags('Merchant - Affiliate Dashboard')
@ApiBearerAuth('JWT')
@Controller('affiliate-marketing/merchant/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AffiliateDashboardMerchantController {
  constructor(
    private readonly affiliateMarketingService: AffiliateMarketingService,
  ) {}

  @Get()
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Get metrics for the merchant affiliate dashboard (REQ-AMP-001)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved dashboard metrics.',
    type: DashboardMetricsResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async getDashboardMetrics(
    @AuthUser() user: AuthenticatedUser,
  ): Promise<DashboardMetricsResponseDto> {
    return this.affiliateMarketingService.getMerchantDashboardMetrics(user.merchantId);
  }
}