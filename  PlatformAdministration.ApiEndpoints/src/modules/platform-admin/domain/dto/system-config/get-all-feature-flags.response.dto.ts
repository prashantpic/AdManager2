import { ApiProperty } from '@nestjs/swagger';
import { FeatureFlagDto } from './feature-flag.dto';

export class GetAllFeatureFlagsResponseDto {
  @ApiProperty({
    type: () => [FeatureFlagDto],
    description: 'List of all feature flags.',
  })
  featureFlags: FeatureFlagDto[];
}