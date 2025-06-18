import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';

export class UpdateMaintenanceWindowRequestDto {
  @ApiProperty({
    required: false,
    description: 'New start time for the maintenance window (ISO 8601 format).',
    example: '2024-08-01T02:30:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  startTime?: Date;

  @ApiProperty({
    required: false,
    description: 'New end time for the maintenance window (ISO 8601 format).',
    example: '2024-08-01T04:30:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  endTime?: Date;

  @ApiProperty({
    required: false,
    description: 'Updated description for the maintenance window.',
    example: 'Extended database upgrade for performance and security patches.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Updated list of components or services affected.',
    example: ['DatabaseClusterA', 'ReportingService', 'NotificationService'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  componentsAffected?: string[];
}