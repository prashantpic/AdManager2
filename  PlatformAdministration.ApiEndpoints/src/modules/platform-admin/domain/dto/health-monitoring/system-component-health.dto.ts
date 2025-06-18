import { ApiProperty } from '@nestjs/swagger';

export enum SystemComponentStatus {
  Healthy = 'Healthy',
  Warning = 'Warning',
  Critical = 'Critical',
  Unknown = 'Unknown',
}

export class SystemComponentHealthDto {
  @ApiProperty({
    example: 'DatabaseService',
    description: 'Name of the system component.',
  })
  name: string;

  @ApiProperty({
    enum: SystemComponentStatus,
    example: SystemComponentStatus.Healthy,
    description: 'Status of the system component.',
  })
  status: SystemComponentStatus;

  @ApiProperty({
    example: 'Response time > 500ms',
    required: false,
    description: 'Additional details about the component health.',
  })
  details?: string;
}