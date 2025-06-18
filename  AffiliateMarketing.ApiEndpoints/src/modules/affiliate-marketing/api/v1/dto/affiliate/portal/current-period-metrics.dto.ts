import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CurrentPeriodMetricsDto {
  @ApiProperty({ description: 'Number of clicks generated in the current period.', example: 500 })
  @IsNumber()
  @Min(0)
  clicks: number;

  @ApiProperty({ description: 'Number of conversions achieved in the current period.', example: 20 })
  @IsNumber()
  @Min(0)
  conversions: number;

  @ApiProperty({ description: 'Total commission earned in the current period.', example: 150.75 })
  @IsNumber()
  @Min(0)
  earned: number;
}