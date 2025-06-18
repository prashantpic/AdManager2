import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';

export class GlobalSettingDto {
  @ApiProperty({
    example: 'maintenance_mode_message',
    description: 'Unique key for the setting.',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    example: 'System is currently down for maintenance.',
    description: 'Value of the setting.',
  })
  value: any;

  @ApiProperty({
    example: 'Message displayed when system is in maintenance mode.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '2023-10-27T10:00:00.000Z',
    required: false,
    type: Date,
  })
  @IsDate()
  @IsOptional()
  lastModifiedAt?: Date;
}