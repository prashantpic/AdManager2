import { ApiProperty } from '@nestjs/swagger';

export enum AlertSeverity {
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  P4 = 'P4',
}

export class ActiveAlertDto {
  @ApiProperty({ example: 'alert-123xyz', description: 'Unique ID of the alert.' })
  alertId: string;

  @ApiProperty({
    enum: AlertSeverity,
    example: AlertSeverity.P1,
    description: 'Severity of the alert.',
  })
  severity: AlertSeverity;

  @ApiProperty({
    example: 'High CPU utilization on payment-service-node-1',
    description: 'Message describing the alert.',
  })
  message: string;

  @ApiProperty({
    example: '2023-10-27T10:30:00.000Z',
    description: 'Timestamp when the alert occurred.',
    type: Date,
  })
  timestamp: Date;

  @ApiProperty({
    example: 'CloudWatch',
    required: false,
    description: 'Source of the alert.',
  })
  source?: string;
}