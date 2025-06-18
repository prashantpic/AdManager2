import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateFeatureFlagRequestDto {
  @ApiProperty({
    example: false,
    description: 'New enabled status for the feature flag.',
  })
  @IsBoolean()
  isEnabled: boolean;
}