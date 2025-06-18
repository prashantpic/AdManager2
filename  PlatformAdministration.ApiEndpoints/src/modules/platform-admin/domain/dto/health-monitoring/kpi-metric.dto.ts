import { ApiProperty } from '@nestjs/swagger';

export enum KpiThresholdStatus {
  Normal = 'Normal',
  Warning = 'Warning',
  Critical = 'Critical',
}

export class KpiMetricDto {
  @ApiProperty({
    example: 'API Error Rate',
    description: 'Name of the Key Performance Indicator.',
  })
  name: string;

  @ApiProperty({
    example: '0.5',
    description: 'Current value of the KPI.',
    oneOf: [{ type: 'string' }, { type: 'number' }],
  })
  value: string | number;

  @ApiProperty({
    example: '%',
    required: false,
    description: 'Unit of the KPI value.',
  })
  unit?: string;

  @ApiProperty({
    enum: KpiThresholdStatus,
    example: KpiThresholdStatus.Normal,
    required: false,
    description: 'Threshold status of the KPI.',
  })
  thresholdStatus?: KpiThresholdStatus;
}