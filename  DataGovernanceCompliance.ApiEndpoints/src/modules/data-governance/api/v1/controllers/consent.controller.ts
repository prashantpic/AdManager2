import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Inject,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IDataGovernanceComplianceService } from '../interfaces/data-governance-compliance.service.interface';
import { ManageConsentDto } from '../dtos/consent/manage-consent.dto';
import { ConsentRecordDto } from '../dtos/consent/consent-record.dto';
import { ConsentReportQueryDto } from '../dtos/consent/consent-report-query.dto';
import { PagedResponseDto } from '../dtos/common/paged-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
// import { User } from '../decorators/user.decorator'; // Assuming @User decorator is defined
// interface AuthenticatedUser { id: string; roles?: string[]; [key: string]: any; } // Placeholder

@ApiBearerAuth()
@ApiTags('Consent Management')
@Controller('consent') // Base path: /api/v1/data-governance/consent
@UseGuards(JwtAuthGuard)
export class ConsentController {
  constructor(
    @Inject('IDataGovernanceComplianceService')
    private readonly dataGovernanceService: IDataGovernanceComplianceService,
  ) {}

  @Post('merchants/:merchantId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Manage Consent Preferences (REQ-MDGC-003)' })
  @ApiParam({ name: 'merchantId', type: 'string', format: 'uuid', description: 'Merchant ID' })
  @ApiBody({ type: ManageConsentDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Consent preferences managed successfully.', type: ConsentRecordDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  @UseGuards(RolesGuard)
  @Roles('MerchantAdmin', 'CampaignManager') // Example roles
  async manageConsentPreferences(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Body() consentData: ManageConsentDto,
    // @User() user: AuthenticatedUser, // Assuming user object is available via @User
  ): Promise<ConsentRecordDto> {
    // The service method should handle authorization based on user and merchantId if needed
    return this.dataGovernanceService.manageMerchantConsent(merchantId, consentData);
  }

  @Get('merchants/:merchantId/records')
  @ApiOperation({ summary: 'Get Consent Records (REQ-MDGC-003)' })
  @ApiParam({ name: 'merchantId', type: 'string', format: 'uuid', description: 'Merchant ID' })
  @ApiQuery({ type: ConsentReportQueryDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Paginated consent records retrieved.', type: PagedResponseDto<ConsentRecordDto> })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid query parameters.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  @UseGuards(RolesGuard)
  @Roles('MerchantAdmin', 'PlatformAdministrator') // Example roles
  async getConsentRecords(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Query() query: ConsentReportQueryDto,
    // @User() user: AuthenticatedUser, // Assuming user object is available via @User
  ): Promise<PagedResponseDto<ConsentRecordDto>> {
    // The service method should handle authorization based on user and merchantId if needed
    return this.dataGovernanceService.getMerchantConsentRecords(merchantId, query);
  }

  @Get('features/:feature/default-settings')
  @ApiOperation({ summary: 'Get Default Consent Settings (REQ-MDGC-001)' })
  @ApiParam({ name: 'feature', type: 'string', description: 'Identifier for the platform feature' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Default privacy/consent settings retrieved.', type: Object }) // Response type is 'any' as per SDS, using Object for swagger
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  // @UseGuards(RolesGuard) // SDS: "Potentially open or restricted to internal roles" - assuming authenticated for now
  // @Roles('SomeInternalRole') // Example if restricted
  async getDefaultConsentSettings(
    @Param('feature') feature: string,
  ): Promise<any> {
    return this.dataGovernanceService.getDefaultPrivacySettings(feature);
  }
}