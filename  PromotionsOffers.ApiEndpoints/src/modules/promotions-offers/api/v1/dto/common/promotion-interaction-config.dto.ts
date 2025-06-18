import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

/**
 * @namespace AdManager.PromotionsOffers.Api.V1.Dto.Common
 */

/**
 * DTO for defining how a promotion interacts with others (stacking, exclusion, priority).
 * Captures rules for how a specific promotion can be combined or excluded with other promotions.
 * @REQ_PROMO_006
 */
export class PromotionInteractionConfigDto {
  @ApiProperty({
    description: 'Indicates if this promotion can be stacked with other promotions.',
    example: true,
  })
  @IsBoolean()
  canStackWithOtherPromotions: boolean;

  @ApiPropertyOptional({
    description:
      'Array of promotion UUIDs that this promotion cannot be stacked with. Only relevant if canStackWithOtherPromotions is true, or to define specific exclusions if default stacking is complex.',
    type: [String],
    format: 'uuid',
    example: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', {
    each: true,
    message: 'Each excludedPromotionId must be a valid UUID.',
  })
  excludedPromotionIds?: string[];

  @ApiPropertyOptional({
    description:
      'A numerical priority for stacking. Lower numbers might indicate higher priority. Used to resolve conflicts if multiple stackable promotions apply.',
    example: 10,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stackingPriority?: number;
}