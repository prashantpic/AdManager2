import { ApiProperty } from '@nestjs/swagger';
import { SystemComponentHealthDto } from './system-component-health.dto';
import { KpiMetricDto } from './kpi-metric.dto';
import { ActiveAlertDto } from './active-alert.dto';

export class SystemHealthDashboardResponseDto {
  @ApiProperty({
    enum: ['Healthy', 'Warning', 'Critical'],
    example: 'Healthy',
    description: 'Overall health status of the system.',
  })
  overallStatus: 'Healthy' | 'Warning' | 'Critical';

  @ApiProperty({
    type: () => [SystemComponentHealthDto],
    description: 'Health status of individual system components.',
  })
  components: SystemComponentHealthDto[];

  @ApiProperty({
    type: () => [KpiMetricDto],
    description: 'Key Performance Indicators for the system.',
  })
  keyPerformanceIndicators: KpiMetricDto[];

  @ApiProperty({
    type: () => [ActiveAlertDto],
    description: 'List of currently active alerts in the system.',
  })
  activeAlerts: ActiveAlertDto[];

  @ApiProperty({
    description: 'Timestamp of the last update for the dashboard data.',
    example: '2023-10-27T10:00:00.000Z',
  })
  lastUpdatedAt: Date;
}