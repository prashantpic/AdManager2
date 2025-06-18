import { Controller, Get, Query, UseGuards, Inject } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { PlatformAdminGuard } from '../../infrastructure/guards/platform-admin.guard.ts';
import { IPlatformAdministrationService } from '../../application/platform-administration.service.interface.ts';
import { QueryAuditLogsRequestDto } from '../../domain/dto/audit-logs/query-audit-logs.request.dto.ts';
import { PagedAuditLogResponseDto } from '../../domain/dto/audit-logs/paged-audit-log.response.dto.ts';

@ApiTags('Platform Administration')
@UseGuards(PlatformAdminGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(
    @Inject('IPlatformAdministrationService')
    private readonly platformAdminService: IPlatformAdministrationService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Query audit logs' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'action', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved audit logs.',
    type: PagedAuditLogResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  async queryAuditLogs(
    @Query() queryDto: QueryAuditLogsRequestDto,
  ): Promise<PagedAuditLogResponseDto> {
    return this.platformAdminService.queryAuditLogs(queryDto);
  }
}