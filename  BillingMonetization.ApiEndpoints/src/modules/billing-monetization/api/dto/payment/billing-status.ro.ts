import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum MerchantBillingStatusEnum {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  IN_GRACE_PERIOD = 'in_grace_period',
  SUSPENDED = 'suspended',
  ERROR = 'error', // General error state
}

export class BillingStatusRO {
  @ApiProperty({
    description: "The merchant's current billing status.",
    enum: MerchantBillingStatusEnum,
    example: MerchantBillingStatusEnum.ACTIVE,
  })
  @IsEnum(MerchantBillingStatusEnum)
  status: MerchantBillingStatusEnum;

  @ApiProperty({
    description: 'If the status is "in_grace_period", this indicates when the grace period ends. After this date, the account might be suspended if payment is not resolved.',
    example: '2024-04-15T10:00:00.000Z',
    required: false,
    type: Date,
  })
  @IsOptional()
  @IsDate()
  gracePeriodEndsAt?: Date;

  @ApiProperty({
    description: 'Indicates if the last payment attempt for the merchant failed.',
    example: false,
  })
  @IsBoolean()
  lastPaymentAttemptFailed: boolean;

  @ApiProperty({
    description: 'The amount expected for the next payment, if applicable.',
    example: 49.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  nextPaymentAmount?: number;

  @ApiProperty({
    description: 'The date of the next scheduled payment, if applicable.',
    example: '2024-05-01T00:00:00.000Z',
    required: false,
    type: Date,
  })
  @IsOptional()
  @IsDate()
  nextPaymentDate?: Date;
}