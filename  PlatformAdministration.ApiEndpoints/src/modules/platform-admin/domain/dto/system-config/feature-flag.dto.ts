import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsDate } from 'class-validator';

export class FeatureFlagDto {
  @ApiProperty({
    example: 'new_dashboard_feature',
    description: 'Unique key for the feature flag.',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: true, description: 'Whether the feature is enabled.' })
  @IsBoolean()
  isEnabled: boolean;

  @ApiProperty({
    example: 'Enables the new experimental dashboard view.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '2023-10-27T10:00:00.000Z',
    required: false,
    type: Date,
  })
  @IsDate()
  @IsOptional()
  lastModifiedAt?: Date;
}