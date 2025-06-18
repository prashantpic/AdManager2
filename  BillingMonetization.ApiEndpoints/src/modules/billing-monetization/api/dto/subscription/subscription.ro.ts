import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsEnum,
  IsDate,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlanRO } from '../plan/plan.ro';
import { ProrationDetailsRO } from './proration-details.ro';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PENDING_DOWNGRADE = 'pending_downgrade',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  IN_GRACE_PERIOD = 'in_grace_period',
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  ANNUAL = 'annual',
}

export class SubscriptionRO {
  @ApiProperty({
    description: 'The unique identifier of the subscription.',
    example: 'd0f0440a-6f0c-4c7e-9f8d-3b7d3b7d3b7d',
  })
  @IsUUID()
  readonly id: string;

  @ApiProperty({
    description: 'The unique identifier of the merchant.',
    example: 'e1g0551a-7g1c-5c8e-0g9d-4c8d4c8d4c8d',
  })
  @IsUUID()
  readonly merchantId: string;

  @ApiProperty({
    description: 'Details of the subscribed plan.',
    type: () => PlanRO,
  })
  @ValidateNested()
  @Type(() => PlanRO)
  readonly plan: PlanRO;

  @ApiProperty({
    description: 'The current status of the subscription.',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  @IsEnum(SubscriptionStatus)
  readonly status: SubscriptionStatus;

  @ApiProperty({
    description: 'The billing cycle for the subscription.',
    enum: BillingCycle,
    example: BillingCycle.MONTHLY,
  })
  @IsEnum(BillingCycle)
  readonly billingCycle: BillingCycle;

  @ApiProperty({
    description: 'The date when the subscription started.',
    type: Date,
    example: '2023-01-15T10:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  readonly startDate: Date;

  @ApiPropertyOptional({
    description: 'The date when the subscription is scheduled to end or has ended.',
    type: Date,
    example: '2024-01-15T10:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly endDate?: Date;

  @ApiProperty({
    description: 'The date of the next billing attempt.',
    type: Date,
    example: '2023-02-15T10:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  readonly nextBillingDate: Date;
  
  @ApiProperty({
    description: 'The start date of the current billing period.',
    type: Date,
    example: '2023-01-15T10:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  readonly currentPeriodStart: Date;

  @ApiProperty({
    description: 'The end date of the current billing period.',
    type: Date,
    example: '2023-02-15T10:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  readonly currentPeriodEnd: Date;

  @ApiPropertyOptional({
    description: 'Details of any proration applied, typically upon upgrade.',
    type: () => ProrationDetailsRO,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProrationDetailsRO)
  readonly prorationDetails?: ProrationDetailsRO;
}