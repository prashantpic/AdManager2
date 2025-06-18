import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StackableCombinationDto } from './stackable-combination.dto';
import { PromotionPrecedenceRuleDto } from './promotion-precedence-rule.dto';

/**
 * @namespace AdManager.PromotionsOffers.Api.V1.Dto.PromotionInteraction
 */

/**
 * DTO for defining global or merchant-level promotion interaction rules.
 * Allows merchants to define overarching rules for how different promotions interact,
 * such as default stacking behavior and precedence.
 * @REQ_PROMO_006
 */
export class SetPromotionInteractionRulesDto {
  @ApiProperty({
    description:
      "Default behavior for stacking promotions. 'NONE' means no stacking unless explicitly allowed. 'ALL_ALLOWED' means all promotions stack unless explicitly excluded.",
    enum: ['NONE', 'ALL_ALLOWED'],
    default: 'NONE',
    example: 'NONE',
  })
  @IsIn(['NONE', 'ALL_ALLOWED'])
  defaultStackingBehavior: 'NONE' | 'ALL_ALLOWED';

  @ApiPropertyOptional({
    description:
      'List of specific combinations of promotions that are allowed to stack. This overrides default behavior for these pairs.',
    type: () => [StackableCombinationDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StackableCombinationDto)
  explicitlyStackableCombinations?: StackableCombinationDto[];

  @ApiPropertyOptional({
    description:
      'List of rules defining precedence between promotions or promotion types when they conflict.',
    type: () => [PromotionPrecedenceRuleDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionPrecedenceRuleDto)
  precedenceRules?: PromotionPrecedenceRuleDto[];
}