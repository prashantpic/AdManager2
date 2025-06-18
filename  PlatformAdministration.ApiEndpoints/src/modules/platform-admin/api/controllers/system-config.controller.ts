import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Inject,
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
import { GetAllSettingsResponseDto } from '../../domain/dto/system-config/get-all-settings.response.dto.ts';
import { UpdateSettingRequestDto } from '../../domain/dto/system-config/update-setting.request.dto.ts';
import { GlobalSettingDto } from '../../domain/dto/system-config/global-setting.dto.ts';
import { GetAllFeatureFlagsResponseDto } from '../../domain/dto/system-config/get-all-feature-flags.response.dto.ts';
import { UpdateFeatureFlagRequestDto } from '../../domain/dto/system-config/update-feature-flag.request.dto.ts';
import { FeatureFlagDto } from '../../domain/dto/system-config/feature-flag.dto.ts';

@ApiTags('Platform Administration')
@UseGuards(PlatformAdminGuard)
@Controller('system-config')
export class SystemConfigController {
  constructor(
    @Inject('IPlatformAdministrationService')
    private readonly platformAdminService: IPlatformAdministrationService,
  ) {}

  @Get('settings')
  @ApiOperation({ summary: 'Get all system configurations' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved system configurations.',
    type: GetAllSettingsResponseDto,
  })
  async getSystemConfigurations(): Promise<GetAllSettingsResponseDto> {
    return this.platformAdminService.getSystemConfigurations();
  }

  @Put('settings/:key')
  @ApiOperation({ summary: 'Update a system configuration by key' })
  @ApiParam({ name: 'key', description: 'The key of the setting to update' })
  @ApiBody({ type: UpdateSettingRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated system configuration.',
    type: GlobalSettingDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Setting key not found.' })
  async updateSystemConfiguration(
    @Param('key') key: string,
    @Body() dto: UpdateSettingRequestDto,
  ): Promise<GlobalSettingDto> {
    return this.platformAdminService.updateSystemConfiguration(key, dto);
  }

  @Get('feature-flags')
  @ApiOperation({ summary: 'Get all feature flags' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved feature flags.',
    type: GetAllFeatureFlagsResponseDto,
  })
  async getFeatureFlags(): Promise<GetAllFeatureFlagsResponseDto> {
    return this.platformAdminService.getFeatureFlags();
  }

  @Put('feature-flags/:key')
  @ApiOperation({ summary: 'Update a feature flag by key' })
  @ApiParam({
    name: 'key',
    description: 'The key of the feature flag to update',
  })
  @ApiBody({ type: UpdateFeatureFlagRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated feature flag.',
    type: FeatureFlagDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Feature flag key not found.' })
  async updateFeatureFlag(
    @Param('key') key: string,
    @Body() dto: UpdateFeatureFlagRequestDto,
  ): Promise<FeatureFlagDto> {
    return this.platformAdminService.updateFeatureFlag(key, dto);
  }
}