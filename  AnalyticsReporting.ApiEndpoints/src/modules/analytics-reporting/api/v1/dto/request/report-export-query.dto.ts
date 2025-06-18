import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportType } from '../../constants/report-types.enum';
import { PerformanceReportQueryDto } from './performance-report-query.dto';

export class ReportExportQueryDto {
  @IsEnum(ReportType)
  @ApiProperty({
    enum: ReportType,
    example: ReportType.CAMPAIGN_PERFORMANCE,
  })
  reportType: ReportType;

  @IsIn(['csv', 'pdf'])
  @ApiProperty({ enum: ['csv', 'pdf'], example: 'csv' })
  format: 'csv' | 'pdf';

  @ValidateNested()
  @Type(() => PerformanceReportQueryDto)
  @ApiProperty({ type: PerformanceReportQueryDto })
  filters: PerformanceReportQueryDto;
}