import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsUUID } from 'class-validator';

export class ABTestReportQueryDto {
  @IsUUID('4')
  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // Example from SDS
    description: 'A/B Test ID',
  })
  testId: string;

  @IsISO8601()
  @IsOptional()
  @ApiPropertyOptional({ example: '2023-01-01', description: 'Start date in YYYY-MM-DD format' })
  startDate?: string;

  @IsISO8601()
  @IsOptional()
  @ApiPropertyOptional({ example: '2023-01-31', description: 'End date in YYYY-MM-DD format' })
  endDate?: string;
}