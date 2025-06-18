import {
  Controller,
  Get,
  Query,
  Inject,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IDataGovernanceComplianceService } from '../../interfaces/data-governance-compliance.service.interface';
import { UserAccessReportQueryDto } from '../../dtos/admin/compliance/user-access-report-query.dto';
import { UserAccessReportDto } from '../../dtos/admin/compliance/user-access-report.dto';
import { ChangeManagementReportQueryDto } from '../../dtos/admin/compliance/change-management-report-query.dto';
import { ChangeManagementReportDto } from '../../dtos/admin/compliance/change-management-report.dto';
import { SecurityIncidentReportQueryDto } from '../../dtos/admin/compliance/security-incident-report-query.dto';
import { SecurityIncidentReportDto } from '../../dtos/admin/compliance/security-incident-report.dto';
import { GdprCcpaExtractQueryDto } from '../../dtos/admin/compliance/gdpr-ccpa-extract-query.dto';
import { GdprCcpaExtractDto } from '../../dtos/admin/compliance/gdpr-ccpa-extract.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { PlatformAdminGuard } from '../../guards/platform-admin.guard';
import { User } from '../../decorators/user.decorator';

interface AuthenticatedUser { id: string; roles?: string[]; [key: string]: any; } // Placeholder

@ApiBearerAuth()
@ApiTags('Platform Administrator Compliance Reporting')
@Controller('admin/compliance') // Base path: /api/v1/data-governance/admin/compliance
@UseGuards(JwtAuthGuard, PlatformAdminGuard)
export class AdminComplianceController {
  constructor(
    @Inject('IDataGovernanceComplianceService')
    private readonly dataGovernanceService: IDataGovernanceComplianceService,
  ) {}

  @Get('reports/user-access')
  @ApiOperation({ summary: 'Generate User Access Report (REQ-POA-013)' })
  @ApiQuery({ type: UserAccessReportQueryDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'User access report generated.', type: UserAccessReportDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid query parameters.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: Not a Platform Administrator.' })
  async generateUserAccessReport(
    @Query() query: UserAccessReportQueryDto,
    @User() adminUser: AuthenticatedUser,
  ): Promise<UserAccessReportDto> {
    return this.dataGovernanceService.generatePlatformComplianceReport(adminUser.id, 'user-access', query);
  }

  @Get('reports/change-management')
  @ApiOperation({ summary: 'Generate Change Management Report (REQ-POA-013)' })
  @ApiQuery({ type: ChangeManagementReportQueryDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Change management report generated.', type: ChangeManagementReportDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid query parameters.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: Not a Platform Administrator.' })
  async generateChangeManagementReport(
    @Query() query: ChangeManagementReportQueryDto,
    @User() adminUser: AuthenticatedUser,
  ): Promise<ChangeManagementReportDto> {
    return this.dataGovernanceService.generatePlatformComplianceReport(adminUser.id, 'change-management', query);
  }

  @Get('reports/security-incidents')
  @ApiOperation({ summary: 'Generate Security Incident Report (REQ-POA-013)' })
  @ApiQuery({ type: SecurityIncidentReportQueryDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Security incident report generated.', type: SecurityIncidentReportDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid query parameters.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: Not a Platform Administrator.' })
  async generateSecurityIncidentReport(
    @Query() query: SecurityIncidentReportQueryDto,
    @User() adminUser: AuthenticatedUser,
  ): Promise<SecurityIncidentReportDto> {
    return this.dataGovernanceService.generatePlatformComplianceReport(adminUser.id, 'security-incidents', query);
  }

  @Get('reports/data-extracts')
  @ApiOperation({ summary: 'Generate GDPR/CCPA Data Extract (REQ-POA-013)' })
  @ApiQuery({ type: GdprCcpaExtractQueryDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'GDPR/CCPA data extract generated.', type: GdprCcpaExtractDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid query parameters.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: Not a Platform Administrator.' })
  async generateGdprCcpaDataExtract(
    @Query() query: GdprCcpaExtractQueryDto,
    @User() adminUser: AuthenticatedUser,
  ): Promise<GdprCcpaExtractDto> {
    return this.dataGovernanceService.generatePlatformComplianceReport(adminUser.id, 'gdpr-ccpa-extract', query);
  }
}