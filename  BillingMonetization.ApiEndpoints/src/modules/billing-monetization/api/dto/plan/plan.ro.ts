import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class PlanRO {
  @ApiProperty({
    description: 'The unique identifier of the plan.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The name of the plan.',
    example: 'Basic Plan',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A detailed description of the plan.',
    example: 'Includes basic features for small businesses.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The monthly price of the plan.',
    example: 29.99,
  })
  @IsNumber()
  @Min(0)
  monthlyPrice: number;

  @ApiProperty({
    description: 'The annual price of the plan.',
    example: 299.99,
  })
  @IsNumber()
  @Min(0)
  annualPrice: number;

  @ApiProperty({
    description: 'A list of features included in the plan.',
    example: ['Feature A', 'Feature B', '10 Campaigns'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiProperty({
    description: 'Usage limits associated with the plan.',
    example: { campaigns: 10, users: 1, adSpendLimit: 1000 },
    type: 'object',
    additionalProperties: true,
  })
  @IsObject()
  usageLimits: Record<string, any>;

  @ApiProperty({
    description: 'The transaction fee rate applicable to this plan (if any).',
    example: 0.05, // 5%
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  transactionFeeRate?: number;
}