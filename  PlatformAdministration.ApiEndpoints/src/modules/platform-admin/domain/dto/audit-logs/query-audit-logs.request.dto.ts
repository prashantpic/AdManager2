import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class QueryAuditLogsRequestDto {
  @ApiProperty({
    required: false,
    description: 'Filter logs by user ID.',
    example: 'user-abc-123',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    required: false,
    description: 'Filter logs by action type.',
    example: 'USER_LOGIN',
  })
  @IsString()
  @IsOptional()
  action?: string;

  @ApiProperty({
    required: false,
    type: String,
    format: 'date-time',
    description: 'Filter logs from this start date (ISO 8601).',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    required: false,
    type: String,
    format: 'date-time',
    description: 'Filter logs up to this end date (ISO 8601).',
    example: '2023-01-31T23:59:59.999Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    required: false,
    type: Number,
    minimum: 1,
    default: 1,
    description: 'Page number for pagination.',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    required: false,
    type: Number,
    minimum: 1,
    maximum: 100,
    default: 10,
    description: 'Number of items per page.',
    example: 10,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}