import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class UpdateSettingRequestDto {
  @ApiProperty({
    example: 'System will be back online shortly.',
    description: 'New value for the setting.',
  })
  @IsDefined()
  value: any;
}