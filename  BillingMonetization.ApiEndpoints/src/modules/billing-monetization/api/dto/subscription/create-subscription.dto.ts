import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export enum BillingCycleEnum {
  MONTHLY = 'monthly',
  ANNUAL = 'annual',
}

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'The unique identifier of the plan to subscribe to.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({
    description: 'The chosen billing cycle for the subscription.',
    enum: BillingCycleEnum,
    example: BillingCycleEnum.MONTHLY,
  })
  @IsEnum(BillingCycleEnum)
  @IsNotEmpty()
  billingCycle: BillingCycleEnum;

  @ApiProperty({
    description: 'ID of a pre-existing payment method from the gateway. If not provided, the merchant might be prompted to add one or use a default.',
    example: 'pm_1Oy9XxLkdIwHu7ix0gQnZ6fA',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;
}