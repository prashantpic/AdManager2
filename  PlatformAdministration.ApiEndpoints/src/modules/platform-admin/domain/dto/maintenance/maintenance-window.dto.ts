import { ApiProperty } from '@nestjs/swagger';

export class MaintenanceWindowDto {
  @ApiProperty({ description: 'Unique ID of the maintenance window.' })
  id: string;

  @ApiProperty({ description: 'Start time of the maintenance window.', type: Date })
  startTime: Date;

  @ApiProperty({ description: 'End time of the maintenance window.', type: Date })
  endTime: Date;

  @ApiProperty({ description: 'Description of the maintenance window.' })
  description: string;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'List of components or services affected by this maintenance.',
    example: ['OrderService', 'PaymentAPI'],
  })
  componentsAffected?: string[];
}