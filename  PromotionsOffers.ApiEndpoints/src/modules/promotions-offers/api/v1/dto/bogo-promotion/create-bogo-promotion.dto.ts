import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PromotionBaseDto } from '../common/promotion-base.dto';
import { BogoItemConditionDto } from './bogo-item-condition.dto';
import { BogoRewardDto } from './bogo-reward.dto';
import { BogoApplicationLogic } from '../../constants/promotion.enums';

export class CreateBogoPromotionDto extends PromotionBaseDto {
  @ApiProperty({ type: () => BogoItemConditionDto, description: 'Condition for triggering the BOGO offer.' })
  @ValidateNested()
  @Type(() => BogoItemConditionDto)
  buyCondition: BogoItemConditionDto;

  @ApiProperty({ type: () => BogoRewardDto, description: 'Reward granted when BOGO conditions are met.' })
  @ValidateNested()
  @Type(() => BogoRewardDto)
  getReward: BogoRewardDto;

  @ApiPropertyOptional({
    enum: BogoApplicationLogic,
    default: BogoApplicationLogic.LOWEST_PRICE_ELIGIBLE,
    description: 'Logic for applying the BOGO discount if multiple items qualify.',
  })
  @IsEnum(BogoApplicationLogic)
  @IsOptional()
  applicationLogic?: BogoApplicationLogic = BogoApplicationLogic.LOWEST_PRICE_ELIGIBLE;
}