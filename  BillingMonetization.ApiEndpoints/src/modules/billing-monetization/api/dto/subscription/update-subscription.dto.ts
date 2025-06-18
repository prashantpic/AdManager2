import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { BillingCycleEnum } from './create-subscription.dto';

export class UpdateSubscriptionDto {
  @ApiProperty({
    description: 'The unique identifier of the new plan to switch to.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  newPlanId: string;

  @ApiProperty({
    description: 'The new billing cycle, if changing. If omitted, the current billing cycle type is maintained if compatible with the new plan.',
    enum: BillingCycleEnum,
    example: BillingCycleEnum.ANNUAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(BillingCycleEnum)
  newBillingCycle?: BillingCycleEnum;
}