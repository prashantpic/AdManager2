import {
  Controller,
  Post,
  Body,
  Get,
  Param,
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
  ApiBody,
} from '@nestjs/swagger';
import { AffiliateMarketingService } from '../../services/affiliate-marketing.service';
import { CreateCommissionRuleDto } from '../../dto/merchant/commissions/create-commission-rule.dto';
import { CommissionRuleResponseDto } from '../../dto/merchant/commissions/commission-rule.response.dto';
import { CommissionStructureResponseDto } from '../../dto/merchant/commissions/commission-structure.response.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { AuthUser } from '../../decorators/user.decorator';

interface AuthenticatedUser {
  userId: string;
  merchantId: string;
  roles: string[];
}

@ApiTags('Merchant - Affiliate Program Commissions')
@ApiBearerAuth('JWT')
@Controller('affiliate-marketing/merchant/programs/:programId/commissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AffiliateCommissionsMerchantController {
  constructor(
    private readonly affiliateMarketingService: AffiliateMarketingService,
  ) {}

  @Post()
  @Roles('MerchantAdmin')
  @ApiOperation({ summary: 'Configure a commission rule for a program (REQ-AMP-003)' })
  @ApiParam({ name: 'programId', description: 'ID of the program to configure commission for', type: String })
  @ApiBody({ type: CreateCommissionRuleDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Commission rule configured successfully.',
    type: CommissionRuleResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Program not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async setProgramCommissionRule(
    @AuthUser() user: AuthenticatedUser,
    @Param('programId', ParseUUIDPipe) programId: string,
    @Body() commissionRuleDto: CreateCommissionRuleDto,
  ): Promise<CommissionRuleResponseDto> {
    return this.affiliateMarketingService.configureCommissionRule(
      user.merchantId,
      programId,
      commissionRuleDto,
    );
  }

  @Get()
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Get the commission structure for a program (REQ-AMP-003)' })
  @ApiParam({ name: 'programId', description: 'ID of the program to get commission structure for', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved commission structure.',
    type: CommissionStructureResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Program not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async getProgramCommissionStructure(
    @AuthUser() user: AuthenticatedUser,
    @Param('programId', ParseUUIDPipe) programId: string,
  ): Promise<CommissionStructureResponseDto> {
    return this.affiliateMarketingService.getCommissionStructure(
      user.merchantId,
      programId,
    );
  }
}