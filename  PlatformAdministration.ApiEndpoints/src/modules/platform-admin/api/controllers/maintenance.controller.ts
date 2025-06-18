import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Inject,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PlatformAdminGuard } from '../../infrastructure/guards/platform-admin.guard.ts';
import { IPlatformAdministrationService } from '../../application/platform-administration.service.interface.ts';
import { MaintenanceWindowDto } from '../../domain/dto/maintenance/maintenance-window.dto.ts';
import { CreateMaintenanceWindowRequestDto } from '../../domain/dto/maintenance/create-maintenance-window.request.dto.ts';
import { UpdateMaintenanceWindowRequestDto } from '../../domain/dto/maintenance/update-maintenance-window.request.dto.ts';
import { TriggerMaintenanceTaskRequestDto } from '../../domain/dto/maintenance/trigger-maintenance-task.request.dto.ts';
import { MaintenanceTaskStatusResponseDto } from '../../domain/dto/maintenance/maintenance-task-status.response.dto.ts';

@ApiTags('Platform Administration')
@UseGuards(PlatformAdminGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(
    @Inject('IPlatformAdministrationService')
    private readonly platformAdminService: IPlatformAdministrationService,
  ) {}

  @Get('windows')
  @ApiOperation({ summary: 'Get all maintenance windows' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved maintenance windows.',
    type: [MaintenanceWindowDto],
  })
  async getMaintenanceWindows(): Promise<MaintenanceWindowDto[]> {
    return this.platformAdminService.getMaintenanceWindows();
  }

  @Post('windows')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new maintenance window' })
  @ApiBody({ type: CreateMaintenanceWindowRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully created maintenance window.',
    type: MaintenanceWindowDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async createMaintenanceWindow(
    @Body() dto: CreateMaintenanceWindowRequestDto,
  ): Promise<MaintenanceWindowDto> {
    return this.platformAdminService.createMaintenanceWindow(dto);
  }

  @Put('windows/:id')
  @ApiOperation({ summary: 'Update an existing maintenance window' })
  @ApiParam({ name: 'id', description: 'ID of the maintenance window to update' })
  @ApiBody({ type: UpdateMaintenanceWindowRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated maintenance window.',
    type: MaintenanceWindowDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Maintenance window not found.' })
  async updateMaintenanceWindow(
    @Param('id') id: string,
    @Body() dto: UpdateMaintenanceWindowRequestDto,
  ): Promise<MaintenanceWindowDto> {
    return this.platformAdminService.updateMaintenanceWindow(id, dto);
  }

  @Delete('windows/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a maintenance window' })
  @ApiParam({ name: 'id', description: 'ID of the maintenance window to delete' })
  @ApiResponse({
    status: 204,
    description: 'Successfully deleted maintenance window.',
  })
  @ApiResponse({ status: 404, description: 'Maintenance window not found.' })
  async deleteMaintenanceWindow(@Param('id') id: string): Promise<void> {
    return this.platformAdminService.deleteMaintenanceWindow(id);
  }

  @Post('tasks/trigger')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Trigger a maintenance task' })
  @ApiBody({ type: TriggerMaintenanceTaskRequestDto })
  @ApiResponse({
    status: 202,
    description: 'Maintenance task successfully triggered.',
    type: MaintenanceTaskStatusResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid task name or parameters.',
  })
  @ApiResponse({ status: 404, description: 'Maintenance task not found.' })
  async triggerMaintenanceTask(
    @Body() dto: TriggerMaintenanceTaskRequestDto,
  ): Promise<MaintenanceTaskStatusResponseDto> {
    return this.platformAdminService.triggerMaintenanceTask(dto);
  }
}