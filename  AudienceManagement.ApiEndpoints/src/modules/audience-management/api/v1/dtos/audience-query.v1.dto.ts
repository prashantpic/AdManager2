import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, Max, IsOptional, IsString, IsIn } from 'class-validator';

export class AudienceQueryDto {
  @ApiPropertyOptional({ description: 'Page number for pagination.', default: 1, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page.', default: 10, maximum: 100, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by audience name (partial match).' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: ['CUSTOM', 'LOOKALIKE'], description: 'Filter by audience type.' })
  @IsIn(['CUSTOM', 'LOOKALIKE'])
  @IsOptional()
  type?: 'CUSTOM' | 'LOOKALIKE';

  @ApiPropertyOptional({ description: 'Filter by audiences configured or synced with a specific ad network ID.' })
  @IsString()
  @IsOptional()
  adNetworkId?: string;
}