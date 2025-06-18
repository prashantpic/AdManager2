import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WidgetConfigDto } from './widget-config.dto'; // Assuming widget-config.dto.ts will be created

export class CustomDashboardConfigDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @ApiProperty({ example: 'My Q1 Performance Dashboard' })
  dashboardName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WidgetConfigDto)
  @ArrayMinSize(0) // As per SDS 6.3.1.4 allow 0 widgets
  @ApiProperty({ type: [WidgetConfigDto] })
  widgets: WidgetConfigDto[];
}