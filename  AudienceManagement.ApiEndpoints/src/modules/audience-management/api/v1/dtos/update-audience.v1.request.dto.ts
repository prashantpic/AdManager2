import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNullable } from 'class-validator';

export class UpdateAudienceRequestDto {
  @ApiPropertyOptional({ description: 'New name for the audience.' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'New description for the audience. Can be set to null to clear existing description.', nullable: true })
  @IsString()
  @IsOptional()
  @IsNullable()
  description?: string | null;
}