import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AffiliateMarketingService } from '../../services/affiliate-marketing.service';
import { AffiliateResponseDto } from '../../dto/common/affiliate.response.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';

interface AuthenticatedUser {
  userId: string;
  merchantId: string;
  roles: string[];
}

@ApiTags('Merchant - Affiliate Management')
@ApiBearerAuth('JWT')
@Controller('affiliate-marketing/merchant/affiliates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AffiliateManagementMerchantController {
  constructor(
    private readonly affiliateMarketingService: AffiliateMarketingService,
  ) {}

  @Get()
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'List affiliates for the merchant (REQ-AMP-001)' })
  @ApiQuery({ name: 'programId', description: 'Optional: Filter by program ID', required: false, type: String })
  @ApiQuery({ name: 'status', description: 'Optional: Filter by affiliate status (e.g., Active, Suspended)', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved list of affiliates.',
    type: [AffiliateResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async listAffiliates(
    @AuthUser() user: AuthenticatedUser,
    @Query('programId') programId?: string,
    @Query('status') status?: string,
  ): Promise<AffiliateResponseDto[]> {
    return this.affiliateMarketingService.listAffiliatesForMerchant(
      user.merchantId,
      programId,
      status,
    );
  }

  @Get(':affiliateId')
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Get details of a specific affiliate (REQ-AMP-001)' })
  @ApiParam({ name: 'affiliateId', description: 'ID of the affiliate', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved affiliate details.',
    type: AffiliateResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Affiliate not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async getAffiliateDetails(
    @AuthUser() user: AuthenticatedUser,
    @Param('affiliateId', ParseUUIDPipe) affiliateId: string,
  ): Promise<AffiliateResponseDto> {
    return this.affiliateMarketingService.getAffiliateDetailsForMerchant(
      user.merchantId,
      affiliateId,
    );
  }

  @Post(':affiliateId/tracking-link')
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Generate a tracking link for an affiliate and program (REQ-AMP-001)' })
  @ApiParam({ name: 'affiliateId', description: 'ID of the affiliate', type: String })
  @ApiQuery({ name: 'programId', description: 'ID of the program', required: true, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully generated tracking link.',
    schema: { type: 'object', properties: { trackingLink: { type: 'string' } } },
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Affiliate or Program not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async generateTrackingLink(
    @AuthUser() user: AuthenticatedUser,
    @Param('affiliateId', ParseUUIDPipe) affiliateId: string,
    @Query('programId', ParseUUIDPipe) programId: string,
  ): Promise<{ trackingLink: string }> {
    const link = await this.affiliateMarketingService.generateTrackingLinkForAffiliate(
      user.merchantId,
      programId,
      affiliateId,
    );
    return { trackingLink: link };
  }

  @Post(':affiliateId/coupon-code')
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Generate a coupon code for an affiliate and program (REQ-AMP-001)' })
  @ApiParam({ name: 'affiliateId', description: 'ID of the affiliate', type: String })
  @ApiQuery({ name: 'programId', description: 'ID of the program', required: true, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully generated coupon code.',
    schema: { type: 'object', properties: { couponCode: { type: 'string' } } },
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Affiliate or Program not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async generateCouponCode(
    @AuthUser() user: AuthenticatedUser,
    @Param('affiliateId', ParseUUIDPipe) affiliateId: string,
    @Query('programId', ParseUUIDPipe) programId: string,
  ): Promise<{ couponCode: string }> {
    const code = await this.affiliateMarketingService.generateCouponForAffiliate(
      user.merchantId,
      programId,
      affiliateId,
    );
    return { couponCode: code };
  }
}