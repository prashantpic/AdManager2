import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Inject,
  UseGuards,
  HttpCode,
  NotFoundException,
  Req,
  ParseUUIDPipe,
  HttpStatus,
  SetMetadata,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express'; // Assuming Express.js platform

import { IAudienceManagementService } from '../../services/audience-management.service.interface';
import { AUDIENCE_MANAGEMENT_SERVICE_TOKEN } from '../../constants/audience.constants';

import { CreateCustomAudienceRequestDto } from './dtos/create-custom-audience.v1.dto';
import { CreateLookalikeAudienceRequestDto } from './dtos/create-lookalike-audience.v1.dto';
import { AudienceResponseDto } from './dtos/audience.v1.response.dto';
import { AudienceListResponseDto } from './dtos/audience-list.v1.response.dto';
import { AudienceQueryDto } from './dtos/audience-query.v1.dto';
import { UpdateAudienceRequestDto } from './dtos/update-audience.v1.request.dto';
import { SyncAudienceRequestDto } from './dtos/sync-audience.v1.request.dto';
import { AudienceSyncStatusResponseDto } from './dtos/audience-sync-status.v1.response.dto';

// --- Placeholder Guards and Decorators (Assume these are in a shared auth module as per SDS) ---
// Note: In a real application, these would be imported from a shared authentication module.
// For the purpose of this file generation, minimal mock implementations are provided
// to make the controller code syntactically correct and demonstrate usage.

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

interface AuthenticatedUser {
  merchantId: string;
  roles: string[];
  // other user properties
}

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    // This is a mock guard. In a real scenario, it would validate JWT
    // and populate req.user. For this example, we assume req.user is populated.
    // If not populated by an upstream middleware/guard, this would typically throw UnauthorizedException.
    if (request.user && request.user.merchantId && request.user.roles) {
        return true;
    }
    // Fallback for testing if user is not pre-set (e.g. e2e tests might set it)
    // To make it pass for any call for this isolated generation:
    request.user = { merchantId: 'mock-merchant-id', roles: ['MerchantAdmin', 'CampaignManager'] };
    return true; 
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    
    if (!user || !user.roles) {
        return false; // Or throw ForbiddenException
    }
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
// --- End Placeholder Guards and Decorators ---

@ApiBearerAuth('jwt') // Matches the name used in main.ts addBearerAuth
@ApiTags('Audiences')
@Controller('v1/audiences') // Global prefix 'api' is set in main.ts
export class AudienceV1Controller {
  constructor(
    @Inject(AUDIENCE_MANAGEMENT_SERVICE_TOKEN)
    private readonly audienceService: IAudienceManagementService,
  ) {}

  @Post('custom')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Create a new custom audience' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Custom audience created successfully.', type: AudienceResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request payload.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  async createCustomAudience(
    @Req() req: AuthenticatedRequest,
    @Body() createCustomAudienceDto: CreateCustomAudienceRequestDto,
  ): Promise<AudienceResponseDto> {
    const { merchantId } = req.user;
    return this.audienceService.createCustomAudience(merchantId, createCustomAudienceDto);
  }

  @Post('lookalike')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Create a new lookalike audience' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Lookalike audience created successfully.', type: AudienceResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request payload or source audience not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  async createLookalikeAudience(
    @Req() req: AuthenticatedRequest,
    @Body() createLookalikeAudienceDto: CreateLookalikeAudienceRequestDto,
  ): Promise<AudienceResponseDto> {
    const { merchantId } = req.user;
    return this.audienceService.createLookalikeAudience(merchantId, createLookalikeAudienceDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'List audiences for the merchant' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of audiences retrieved successfully.', type: AudienceListResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  async listAudiences(
    @Req() req: AuthenticatedRequest,
    @Query() query: AudienceQueryDto,
  ): Promise<AudienceListResponseDto> {
    const { merchantId } = req.user;
    return this.audienceService.listAudiences(merchantId, query);
  }

  @Get(':audienceId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Get audience details by ID' })
  @ApiParam({ name: 'audienceId', type: 'string', format: 'uuid', description: 'Audience UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Audience details retrieved successfully.', type: AudienceResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Audience not found.' })
  async getAudienceById(
    @Req() req: AuthenticatedRequest,
    @Param('audienceId', ParseUUIDPipe) audienceId: string,
  ): Promise<AudienceResponseDto> {
    const { merchantId } = req.user;
    const audience = await this.audienceService.getAudienceById(merchantId, audienceId);
    if (!audience) {
      throw new NotFoundException(`Audience with ID ${audienceId} not found.`);
    }
    return audience;
  }

  @Put(':audienceId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Update audience metadata' })
  @ApiParam({ name: 'audienceId', type: 'string', format: 'uuid', description: 'Audience UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Audience updated successfully.', type: AudienceResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request payload.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Audience not found.' })
  async updateAudience(
    @Req() req: AuthenticatedRequest,
    @Param('audienceId', ParseUUIDPipe) audienceId: string,
    @Body() updateAudienceDto: UpdateAudienceRequestDto,
  ): Promise<AudienceResponseDto> {
    const { merchantId } = req.user;
    // Assuming the service will throw a NotFoundException or similar
    // if the audienceId does not exist for the merchant,
    // which will be handled by global exception filters or is already a NotFoundException.
    return this.audienceService.updateAudience(merchantId, audienceId, updateAudienceDto);
  }

  @Delete(':audienceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Delete an audience' })
  @ApiParam({ name: 'audienceId', type: 'string', format: 'uuid', description: 'Audience UUID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Audience deleted successfully.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Audience not found.' })
  async deleteAudience(
    @Req() req: AuthenticatedRequest,
    @Param('audienceId', ParseUUIDPipe) audienceId: string,
  ): Promise<void> {
    const { merchantId } = req.user;
    // Assuming the service will throw a NotFoundException or similar
    // if the audienceId does not exist for the merchant.
    await this.audienceService.deleteAudience(merchantId, audienceId);
  }

  @Post(':audienceId/sync')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Synchronize an audience with specified ad networks' })
  @ApiParam({ name: 'audienceId', type: 'string', format: 'uuid', description: 'Audience UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Audience synchronization process initiated.', type: [AudienceSyncStatusResponseDto] })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request payload or audience/network not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Audience not found.' })
  async synchronizeAudienceWithNetworks(
    @Req() req: AuthenticatedRequest,
    @Param('audienceId', ParseUUIDPipe) audienceId: string,
    @Body() syncRequestDto: SyncAudienceRequestDto,
  ): Promise<AudienceSyncStatusResponseDto[]> {
    const { merchantId } = req.user;
    return this.audienceService.synchronizeAudience(merchantId, audienceId, syncRequestDto);
  }

  @Get(':audienceId/sync/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MerchantAdmin', 'CampaignManager')
  @ApiOperation({ summary: 'Get audience synchronization status' })
  @ApiParam({ name: 'audienceId', type: 'string', format: 'uuid', description: 'Audience UUID' })
  @ApiQuery({ name: 'adNetworkId', type: 'string', required: false, description: 'Optional Ad Network ID to filter status for a specific network.'})
  @ApiResponse({ status: HttpStatus.OK, description: 'Synchronization status retrieved.', type: [AudienceSyncStatusResponseDto] })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden resource.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Audience not found.' })
  async getAudienceSyncStatus(
    @Req() req: AuthenticatedRequest,
    @Param('audienceId', ParseUUIDPipe) audienceId: string,
    @Query('adNetworkId') adNetworkId?: string,
  ): Promise<AudienceSyncStatusResponseDto[]> {
    const { merchantId } = req.user;
    return this.audienceService.getAudienceSynchronizationStatus(merchantId, audienceId, adNetworkId);
  }
}