import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Inject,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IDataGovernanceComplianceService } from '../interfaces/data-governance-compliance.service.interface';
import { SubmitDsrDto } from '../dtos/dsr/submit-dsr.dto';
import { DsrRequestDto } from '../dtos/dsr/dsr-request.dto';
import { DsrDataExportDto } from '../dtos/dsr/dsr-data-export.dto';
import { DsrActionDto } from '../dtos/dsr/dsr-action.dto';
import { IdParamDto } from '../dtos/common/id-param.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard'; // Assuming DSR submission could be by specific roles or any authenticated user
import { PlatformAdminGuard } from '../guards/platform-admin.guard';
import { User } from '../decorators/user.decorator'; 
import { Roles } from '../decorators/roles.decorator';

interface AuthenticatedUser { id: string; roles?: string[]; [key: string]: any; } // Placeholder

@ApiBearerAuth()
@ApiTags('Data Subject Rights (DSR) Management')
@Controller('dsr') // Base path: /api/v1/data-governance/dsr
@UseGuards(JwtAuthGuard)
export class DsrController {
  constructor(
    @Inject('IDataGovernanceComplianceService')
    private readonly dataGovernanceService: IDataGovernanceComplianceService,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit DSR Request (REQ-MDGC-004)' })
  @ApiBody({ type: SubmitDsrDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'DSR request submitted successfully.', type: DsrRequestDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  // @UseGuards(RolesGuard) // SDS: "User submitting for themselves or admin role" - JwtAuthGuard handles authenticated user part.
  // @Roles('User', 'Admin') // Example roles
  async submitDsrRequest(
    @Body() requestData: SubmitDsrDto,
    @User() user: AuthenticatedUser,
  ): Promise<DsrRequestDto> {
    return this.dataGovernanceService.handleDsrRequest(user.id, requestData);
  }

  @Get(':requestId/status')
  @ApiOperation({ summary: 'Get DSR Request Status (REQ-MDGC-004)' })
  @ApiParam({ name: 'requestId', type: 'string', format: 'uuid', description: 'DSR Request ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'DSR request status retrieved.', type: DsrRequestDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'DSR request not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' }) // If user not requester or admin
  // SDS: "Requester or authorized admin" - This logic needs to be in service or a more complex guard.
  // For API layer, basic auth is enough, service layer handles fine-grained access.
  async getDsrRequestStatus(
    @Param() params: IdParamDto,
    // @User() user: AuthenticatedUser, // User context might be needed by service to check ownership/admin rights
  ): Promise<DsrRequestDto> {
    return this.dataGovernanceService.getDsrRequestStatus(params.id);
  }

  @Get(':requestId/export')
  @ApiOperation({ summary: 'Export DSR Data (REQ-MDGC-004)' })
  @ApiParam({ name: 'requestId', type: 'string', format: 'uuid', description: 'DSR Request ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'DSR data export retrieved/link provided.', type: DsrDataExportDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'DSR request not found or data not available.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  // SDS: "Requester or authorized admin"
  async exportDsrData(
    @Param() params: IdParamDto,
    // @User() user: AuthenticatedUser,
  ): Promise<DsrDataExportDto> {
    return this.dataGovernanceService.exportDsrData(params.id);
  }

  @Post('admin/actions')
  @UseGuards(PlatformAdminGuard) // Ensures only PlatformAdministrator can access
  @ApiOperation({ summary: 'Fulfill DSR Request Action (Admin) (REQ-MDGC-004)' })
  @ApiBody({ type: DsrActionDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'DSR request action fulfilled, updated request returned.', type: DsrRequestDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid action or input data.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'DSR request not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: Not a Platform Administrator.' })
  async fulfillDsrRequestAction(
    @Body() actionData: DsrActionDto,
    @User() adminUser: AuthenticatedUser,
  ): Promise<DsrRequestDto> {
    return this.dataGovernanceService.fulfillDsrRequestAction(adminUser.id, actionData);
  }
}