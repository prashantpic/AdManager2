import {
  Controller,
  Get,
  Post,
  Param,
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
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IDataGovernanceComplianceService } from '../interfaces/data-governance-compliance.service.interface';
import { DpaDto } from '../dtos/compliance/dpa.dto';
import { ProcessingActivityLogQueryDto } from '../dtos/compliance/processing-activity-log-query.dto';
import { ProcessingActivityLogDto } from '../dtos/compliance/processing-activity-log.dto';
import { AuditTrailQueryDto } from '../dtos/compliance/audit-trail-query.dto';
import { AuditTrailEntryDto } from '../dtos/compliance/audit-trail-entry.dto';
import { PagedResponseDto } from '../dtos/common/paged-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';

interface AuthenticatedUser { id: string; roles?: string[]; merchantId?: string; [key: string]: any; } // Placeholder, merchantId might be part of user token

@ApiBearerAuth()
@ApiTags('Merchant Compliance')
@Controller('compliance') // Base path: /api/v1/data-governance/compliance
@UseGuards(JwtAuthGuard, RolesGuard) // RolesGuard applied at controller level, specific roles at method level
export class ComplianceController {
  constructor(
    @Inject('IDataGovernanceComplianceService')
    private readonly dataGovernanceService: IDataGovernanceComplianceService,
  ) {}

  @Get('merchants/:merchantId/dpa')
  @Roles('MerchantAdmin') // Example role, SDS: "ensuring user is associated with merchantId"
  @ApiOperation({ summary: 'Get DPA Status (REQ-MDGC-007)' })
  @ApiParam({ name: 'merchantId', type: 'string', format: 'uuid', description: 'Merchant ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'DPA status retrieved.', type: DpaDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Merchant DPA status not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  async getDpaStatus(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    // @User() user: AuthenticatedUser, // Service will need to verify user's association with merchantId
  ): Promise<DpaDto> {
    // TODO: Add fine-grained authorization in service: ensure user is associated with merchantId
    return this.dataGovernanceService.getDpaStatusForMerchant(merchantId);
  }

  @Post('merchants/:merchantId/dpa/acknowledge')
  @Roles('MerchantAdmin') // Example role
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Acknowledge DPA (REQ-MDGC-007)' })
  @ApiParam({ name: 'merchantId', type: 'string', format: 'uuid', description: 'Merchant ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'DPA acknowledged successfully, updated status returned.', type: DpaDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Merchant or DPA not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'DPA already acknowledged or invalid state.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  async acknowledgeDpa(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @User() user: AuthenticatedUser,
  ): Promise<DpaDto> {
    // TODO: Add fine-grained authorization in service: ensure user is associated with merchantId
    return this.dataGovernanceService.acknowledgeDpaForMerchant(merchantId, user.id);
  }

  @Get('merchants/:merchantId/processing-logs')
  @Roles('MerchantAdmin') // Example role
  @ApiOperation({ summary: 'Generate Data Processing Activity Log (REQ-MDGC-007)' })
  @ApiParam({ name: 'merchantId', type: 'string', format: 'uuid', description: 'Merchant ID' })
  @ApiQuery({ type: ProcessingActivityLogQueryDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Data processing activity log generated.', type: ProcessingActivityLogDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid query parameters.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  async generateDataProcessingActivityLog(
    @Param('merchantId', ParseUUIDPipe) merchantId: string,
    @Query() query: ProcessingActivityLogQueryDto,
    // @User() user: AuthenticatedUser, // Service will need to verify user's association with merchantId
  ): Promise<ProcessingActivityLogDto> {
    // TODO: Add fine-grained authorization in service: ensure user is associated with merchantId
    return this.dataGovernanceService.generateDataProcessingActivityLog(merchantId, query);
  }

  @Get('merchants/:merchantId/audit-trail')
  @Roles('MerchantAdmin') // Example role
  @ApiOperation({ summary: 'Get Merchant Audit Trail (REQ-MDGC-008)' })
  @ApiParam({ name: 'merchantId', type: 'string', format: 'uuid', description: 'Merchant ID' })
  @ApiQuery({ type: AuditTrailQueryDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Paginated merchant audit trail entries retrieved.', type: PagedResponseDto<AuditTrailEntryDto> })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid query parameters.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  async getMerchantAuditTrail(
    @Param('merchantId', ParseUUIDPipe) merchantId: string, // This merchantId should be used by service to scope results
    @Query() query: AuditTrailQueryDto,
    // @User() user: AuthenticatedUser, // Service will need to verify user's association with merchantId
  ): Promise<PagedResponseDto<AuditTrailEntryDto>> {
    // The service method needs to scope by merchantId.
    // The query DTO itself doesn't have merchantId, it's a path param.
    // Modify service call or AuditTrailQueryDto if needed.
    // Assuming service.getAuditTrailEntries can take merchantId as a separate scoping parameter,
    // or the service implicitly uses the merchantId based on the authenticated user if this is for the user's own merchant.
    // For now, passing query as is. Service implementation detail.
    // The SDS says: dataGovernanceService.getAuditTrailEntries(query) (Service needs to scope by merchantId)
    // This implies the service might use the authenticated user's merchant scope or another mechanism.
    // If the merchantId path param is the explicit scope, the service method signature should reflect that.
    // Let's assume the service method `getAuditTrailEntries` can accept an additional `merchantId` parameter for scoping.
    // Or, the service internally uses the authenticated user's merchant context.
    // To be explicit, it's better if the service method takes merchantId.
    // For now, as per SDS file_structure_json service method signature, it only takes `query`.
    // This needs clarification or assume service handles it. For placeholder, let's call as in SDS.
    // The service `getAuditTrailEntries` would need to be adapted to filter by this `merchantId`
    // or the `AuditTrailQueryDto` should include `merchantId` and be populated here.
    // Let's assume the service method `getAuditTrailEntries` will be enhanced or the query is shaped before calling.
    // For this API layer, we pass what we have.
    
    const scopedQuery = { ...query, merchantId_scope: merchantId }; // Example of how it might be passed
    return this.dataGovernanceService.getAuditTrailEntries(scopedQuery as AuditTrailQueryDto); // Type assertion if modifying query
  }
}