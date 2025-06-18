import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { PromotionBaseResponseDto } from '../common/promotion-base-response.dto';
import { BogoItemConditionDto } from './bogo-item-condition.dto';
import { BogoRewardDto } from './bogo-reward.dto';
import { BogoApplicationLogic } from '../../constants/promotion.enums';

export class BogoPromotionResponseDto extends PromotionBaseResponseDto {
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
    description: 'Logic for applying the BOGO discount if multiple items qualify.',
  })
  @IsEnum(BogoApplicationLogic)
  @IsOptional()
  applicationLogic?: BogoApplicationLogic;
}