import { ApiProperty } from '@nestjs/swagger';
import { GlobalSettingDto } from './global-setting.dto';

export class GetAllSettingsResponseDto {
  @ApiProperty({
    type: () => [GlobalSettingDto],
    description: 'List of all global system settings.',
  })
  settings: GlobalSettingDto[];
}