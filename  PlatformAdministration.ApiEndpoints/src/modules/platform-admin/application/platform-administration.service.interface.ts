import { GetAllSettingsResponseDto } from '../domain/dto/system-config/get-all-settings.response.dto';
import { UpdateSettingRequestDto } from '../domain/dto/system-config/update-setting.request.dto';
import { GlobalSettingDto } from '../domain/dto/system-config/global-setting.dto';
import { GetAllFeatureFlagsResponseDto } from '../domain/dto/system-config/get-all-feature-flags.response.dto';
import { UpdateFeatureFlagRequestDto } from '../domain/dto/system-config/update-feature-flag.request.dto';
import { FeatureFlagDto } from '../domain/dto/system-config/feature-flag.dto';
import { SystemHealthDashboardResponseDto } from '../domain/dto/health-monitoring/system-health-dashboard.response.dto';
import { QueryAuditLogsRequestDto } from '../domain/dto/audit-logs/query-audit-logs.request.dto';
import { PagedAuditLogResponseDto } from '../domain/dto/audit-logs/paged-audit-log.response.dto';
import { MaintenanceWindowDto } from '../domain/dto/maintenance/maintenance-window.dto';
import { CreateMaintenanceWindowRequestDto } from '../domain/dto/maintenance/create-maintenance-window.request.dto';
import { UpdateMaintenanceWindowRequestDto } from '../domain/dto/maintenance/update-maintenance-window.request.dto';
import { TriggerMaintenanceTaskRequestDto } from '../domain/dto/maintenance/trigger-maintenance-task.request.dto';
import { MaintenanceTaskStatusResponseDto } from '../domain/dto/maintenance/maintenance-task-status.response.dto';
import { PlatformAdministratorDto } from '../domain/dto/platform-users/platform-administrator.dto';
import { CreatePlatformAdministratorRequestDto } from '../domain/dto/platform-users/create-platform-administrator.request.dto';
import { UpdatePlatformAdministratorRequestDto } from '../domain/dto/platform-users/update-platform-administrator.request.dto';

export interface IPlatformAdministrationService {
  getSystemConfigurations(): Promise<GetAllSettingsResponseDto>;
  updateSystemConfiguration(key: string, dto: UpdateSettingRequestDto): Promise<GlobalSettingDto>;
  getFeatureFlags(): Promise<GetAllFeatureFlagsResponseDto>;
  updateFeatureFlag(key: string, dto: UpdateFeatureFlagRequestDto): Promise<FeatureFlagDto>;
  getSystemHealthDashboard(): Promise<SystemHealthDashboardResponseDto>;
  queryAuditLogs(queryDto: QueryAuditLogsRequestDto): Promise<PagedAuditLogResponseDto>;
  getMaintenanceWindows(): Promise<MaintenanceWindowDto[]>;
  createMaintenanceWindow(dto: CreateMaintenanceWindowRequestDto): Promise<MaintenanceWindowDto>;
  updateMaintenanceWindow(id: string, dto: UpdateMaintenanceWindowRequestDto): Promise<MaintenanceWindowDto>;
  deleteMaintenanceWindow(id: string): Promise<void>;
  triggerMaintenanceTask(dto: TriggerMaintenanceTaskRequestDto): Promise<MaintenanceTaskStatusResponseDto>;
  getPlatformAdministrators(): Promise<PlatformAdministratorDto[]>;
  createPlatformAdministrator(dto: CreatePlatformAdministratorRequestDto): Promise<PlatformAdministratorDto>;
  getPlatformAdministratorById(id: string): Promise<PlatformAdministratorDto>;
  updatePlatformAdministrator(id: string, dto: UpdatePlatformAdministratorRequestDto): Promise<PlatformAdministratorDto>;
  deletePlatformAdministrator(id: string): Promise<void>;
}