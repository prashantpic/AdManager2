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
  Patch, // Assuming update might use PATCH
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
import { ConfigureRetentionPolicyDto } from '../dtos/data-retention/configure-retention-policy.dto';
import { RetentionPolicyDto } from '../dtos/data-retention/retention-policy.dto';
import { DataLifecycleActionDto } from '../dtos/data-retention/data-lifecycle-action.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PlatformAdminGuard } from '../guards/platform-admin.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';

interface AuthenticatedUser { id: string; roles?: string[]; [key: string]: any; } // Placeholder

@ApiBearerAuth()
@ApiTags('Data Retention Policy Management')
@Controller('data-retention') // Base path: /api/v1/data-governance/data-retention
@UseGuards(JwtAuthGuard)
export class DataRetentionController {
  constructor(
    @Inject('IDataGovernanceComplianceService')
    private readonly dataGovernanceService: IDataGovernanceComplianceService,
  ) {}

  @Post('policies')
  @UseGuards(PlatformAdminGuard)
  @ApiOperation({ summary: 'Configure Retention Policy (Admin) (REQ-MDGC-005)' })
  @ApiBody({ type: ConfigureRetentionPolicyDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Retention policy created successfully.', type: RetentionPolicyDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retention policy updated successfully.', type: RetentionPolicyDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: Not a Platform Administrator.' })
  async configureRetentionPolicy(
    @Body() policyData: ConfigureRetentionPolicyDto,
    @User() adminUser: AuthenticatedUser,
  ): Promise<RetentionPolicyDto> {
    // Service method should determine if it's a create or update.
    // SDS says "201 Created or 200 OK"
    // For simplicity, a single method. The service can return the appropriate status or the controller can infer.
    // Let's assume the service returns the DTO and the status code will depend on creation vs update.
    // NestJS defaults to 201 for POST. If an update happens and we want 200, the service or controller needs to manage this.
    // For now, let service handle logic and return DTO. We can set HttpCode explicitly if needed.
    return this.dataGovernanceService.configureRetentionPolicy(adminUser.id, policyData);
  }

  @Get('policies/:policyType')
  @UseGuards(RolesGuard)
  @Roles('PlatformAdministrator')
  @ApiOperation({ summary: 'Get Retention Policy (REQ-MDGC-005)' })
  @ApiParam({ name: 'policyType', type: 'string', description: 'Identifier for the data type or policy name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Retention policy details retrieved.', type: RetentionPolicyDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Retention policy not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  async getRetentionPolicy(
    @Param('policyType') policyType: string,
  ): Promise<RetentionPolicyDto> {
    return this.dataGovernanceService.getRetentionPolicy(policyType);
  }

  @Post('actions')
  @UseGuards(PlatformAdminGuard)
  @HttpCode(HttpStatus.ACCEPTED) // As per SDS "202 Accepted (for asynchronous actions) or 204 No Content"
  @ApiOperation({ summary: 'Trigger Data Lifecycle Action (Admin) (REQ-MDGC-005)' })
  @ApiBody({ type: DataLifecycleActionDto })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Data lifecycle action accepted for processing.' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Data lifecycle action completed synchronously (if applicable).' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid action or criteria.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: Not a Platform Administrator.' })
  async triggerDataLifecycleAction(
    @Body() actionData: DataLifecycleActionDto,
    @User() adminUser: AuthenticatedUser,
  ): Promise<void> { // Return type is Promise<void> for 202/204
    await this.dataGovernanceService.triggerDataLifecycleAction(adminUser.id, actionData);
    // The service implementation would determine if it's async.
    // If it can be synchronous and return 204, the controller might need to change HttpCode based on service response.
    // For now, defaulting to 202.
  }

  @Get('defaults/:dataType')
  @UseGuards(RolesGuard)
  @Roles('PlatformAdministrator')
  @ApiOperation({ summary: 'Get Default Retention Settings (REQ-MDGC-001)' })
  @ApiParam({ name: 'dataType', type: 'string', description: 'e.g., \'audit_logs\', \'pii_closed_accounts\'' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Default retention settings retrieved.', type: Object }) // Using Object for 'any'
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Default settings not found for data type.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  async getDefaultRetentionSettings(
    @Param('dataType') dataType: string,
  ): Promise<any> { // SDS specifies 'any' (structure like RetentionPolicyDto but marked as default)
    return this.dataGovernanceService.getDefaultRetentionSettings(dataType);
  }
}