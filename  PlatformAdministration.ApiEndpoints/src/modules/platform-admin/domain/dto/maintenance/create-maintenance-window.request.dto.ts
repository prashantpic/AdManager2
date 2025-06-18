import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateMaintenanceWindowRequestDto {
  @ApiProperty({
    description: 'Start time of the maintenance window (ISO 8601 format).',
    example: '2024-08-01T02:00:00.000Z',
  })
  @IsDateString()
  startTime: Date;

  @ApiProperty({
    description: 'End time of the maintenance window (ISO 8601 format).',
    example: '2024-08-01T04:00:00.000Z',
  })
  @IsDateString()
  endTime: Date;

  @ApiProperty({
    description: 'Detailed description of the maintenance window and its purpose.',
    example: 'Scheduled database upgrade for performance improvements.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Optional list of components or services affected.',
    example: ['DatabaseClusterA', 'ReportingService'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  componentsAffected?: string[];
}