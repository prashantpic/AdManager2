import {
  Controller,
  Get,
  Post,
  Param,
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
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AffiliateMarketingService } from '../../services/affiliate-marketing.service';
import { ApproveAffiliateDto } from '../../dto/merchant/applications/approve-affiliate.dto';
import { ApplicationResponseDto } from '../../dto/merchant/applications/application.response.dto';
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

@ApiTags('Merchant - Affiliate Applications')
@ApiBearerAuth('JWT')
@Controller('affiliate-marketing/merchant/applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AffiliateApplicationsMerchantController {
  constructor(
    private readonly affiliateMarketingService: AffiliateMarketingService,
  ) {}

  @Get()
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'List pending affiliate applications (REQ-AMP-002)' })
  @ApiQuery({ name: 'programId', description: 'Optional: Filter by program ID', required: false, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved list of pending applications.',
    type: [ApplicationResponseDto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async getPendingApplications(
    @AuthUser() user: AuthenticatedUser,
    @Query('programId') programId?: string,
  ): Promise<ApplicationResponseDto[]> {
    return this.affiliateMarketingService.getPendingApplications(user.merchantId, programId);
  }

  @Post(':applicationId/approve')
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Approve an affiliate application (REQ-AMP-002)' })
  @ApiParam({ name: 'applicationId', description: 'ID of the application to approve', type: String })
  @ApiBody({ type: ApproveAffiliateDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Affiliate application approved successfully.',
    type: AffiliateResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Application not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async approveApplication(
    @AuthUser() user: AuthenticatedUser,
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
    @Body() approvalDto: ApproveAffiliateDto,
  ): Promise<AffiliateResponseDto> {
    return this.affiliateMarketingService.approveAffiliateApplication(
      user.merchantId,
      applicationId,
      approvalDto,
    );
  }

  @Post(':applicationId/reject')
  @Roles('MerchantAdmin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reject an affiliate application (REQ-AMP-002)' })
  @ApiParam({ name: 'applicationId', description: 'ID of the application to reject', type: String })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Affiliate application rejected successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Application not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async rejectApplication(
    @AuthUser() user: AuthenticatedUser,
    @Param('applicationId', ParseUUIDPipe) applicationId: string,
  ): Promise<void> {
    return this.affiliateMarketingService.rejectAffiliateApplication(
      user.merchantId,
      applicationId,
    );
  }
}