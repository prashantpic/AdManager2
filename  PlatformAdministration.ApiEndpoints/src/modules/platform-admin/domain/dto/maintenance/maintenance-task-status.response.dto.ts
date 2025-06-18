import { ApiProperty } from '@nestjs/swagger';

export enum MaintenanceTaskStatusEnum {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Failed = 'Failed',
}

export class MaintenanceTaskStatusResponseDto {
  @ApiProperty({ description: 'Unique ID of the triggered task.' })
  taskId: string;

  @ApiProperty({ description: 'Name of the maintenance task.' })
  taskName: string;

  @ApiProperty({
    enum: MaintenanceTaskStatusEnum,
    description: 'Current status of the maintenance task.',
  })
  status: MaintenanceTaskStatusEnum;

  @ApiProperty({
    required: false,
    description: 'Optional message providing more details about the task status.',
  })
  message?: string;

  @ApiProperty({
    required: false,
    description: 'Timestamp when the task started processing.',
    type: Date,
  })
  startTime?: Date;

  @ApiProperty({
    required: false,
    description: 'Timestamp when the task finished processing.',
    type: Date,
  })
  endTime?: Date;
}