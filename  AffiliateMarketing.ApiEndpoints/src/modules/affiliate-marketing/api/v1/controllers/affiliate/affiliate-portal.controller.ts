import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AffiliateMarketingService } from '../../services/affiliate-marketing.service';
import { AffiliatePerformanceResponseDto } from '../../dto/affiliate/portal/affiliate-performance.response.dto';
import { TrackingLinkResponseDto } from '../../dto/affiliate/portal/tracking-link.response.dto';
import { PayoutHistoryResponseDto } from '../../dto/affiliate/portal/payout-history.response.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';

interface AuthenticatedAffiliateUser {
  userId: string;
  affiliateId: string;
  roles: string[];
}

@ApiTags('Affiliate Portal')
@ApiBearerAuth('JWT')
@Controller('affiliate-marketing/portal')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AffiliatePortalController {
  constructor(
    private readonly affiliateMarketingService: AffiliateMarketingService,
  ) {}

  @Get('performance')
  @Roles('Affiliate')
  @ApiOperation({ summary: 'Get my affiliate performance metrics (REQ-AMP-006)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved affiliate performance metrics.',
    type: AffiliatePerformanceResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async getMyPerformance(
    @AuthUser() affiliate: AuthenticatedAffiliateUser,
  ): Promise<AffiliatePerformanceResponseDto> {
    return this.affiliateMarketingService.getAffiliatePerformance(affiliate.affiliateId);
  }

  @Get('tracking-links')
  @Roles('Affiliate')
  @ApiOperation({ summary: 'Get my tracking links (REQ-AMP-006)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved affiliate tracking links.',
    type: [TrackingLinkResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async getMyTrackingLinks(
    @AuthUser() affiliate: AuthenticatedAffiliateUser,
  ): Promise<TrackingLinkResponseDto[]> {
    return this.affiliateMarketingService.getAffiliateTrackingLinks(affiliate.affiliateId);
  }

  @Get('payouts')
  @Roles('Affiliate')
  @ApiOperation({ summary: 'Get my payout history (REQ-AMP-006)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved affiliate payout history.',
    type: PayoutHistoryResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async getMyPayoutHistory(
    @AuthUser() affiliate: AuthenticatedAffiliateUser,
  ): Promise<PayoutHistoryResponseDto> {
    return this.affiliateMarketingService.getAffiliatePayoutHistory(affiliate.affiliateId);
  }
}