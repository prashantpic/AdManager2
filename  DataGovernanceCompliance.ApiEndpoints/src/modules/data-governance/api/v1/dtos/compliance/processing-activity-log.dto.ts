import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsArray, ValidateNested, IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ProcessingActivityLogQueryDto } from './processing-activity-log-query.dto';
import { ProcessingActivityEntryDto } from './processing-activity-entry.dto'; // Assumed to be generated in a future step or available

export class ProcessingActivityLogDto {
  @ApiProperty({
    description: 'List of data processing activity log entries.',
    type: () => [ProcessingActivityEntryDto], // For Swagger array type
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcessingActivityEntryDto)
  readonly logEntries: ProcessingActivityEntryDto[];

  @ApiProperty({
    description: 'Timestamp when the log was generated.',
    type: Date,
    example: '2023-02-01T10:00:00.000Z',
  })
  @IsDate()
  readonly generatedAt: Date;

  @ApiProperty({
    description: 'Identifier of the merchant for whom the log was generated.',
    example: 'merchant-uuid-abc',
  })
  @IsString() // Or IsUUID if merchantId is always UUID
  @IsNotEmpty()
  readonly merchantId: string;

  @ApiProperty({
    description: 'Query parameters used to generate this log.',
    type: () => ProcessingActivityLogQueryDto,
  })
  @ValidateNested()
  @Type(() => ProcessingActivityLogQueryDto)
  readonly queryParameters: ProcessingActivityLogQueryDto;
}