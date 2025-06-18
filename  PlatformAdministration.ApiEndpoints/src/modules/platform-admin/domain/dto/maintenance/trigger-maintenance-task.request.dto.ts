import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class TriggerMaintenanceTaskRequestDto {
  @ApiProperty({
    example: 'ClearCache',
    description: 'Name of the maintenance task to trigger.',
  })
  @IsString()
  @IsNotEmpty()
  taskName: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    required: false,
    description: 'Optional parameters for the maintenance task.',
    example: { cacheKeyPrefix: 'product_data:', targetRegion: 'all' },
  })
  @IsObject()
  @IsOptional()
  parameters?: Record<string, any>;
}