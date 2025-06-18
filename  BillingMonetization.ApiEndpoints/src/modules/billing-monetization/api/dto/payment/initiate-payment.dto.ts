import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty({
    description: 'The amount to be charged.',
    example: 49.99,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'The currency of the payment (ISO 4217 code).',
    example: 'SAR',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  currency: string;

  @ApiProperty({
    description: 'A description for the payment.',
    example: 'Payment for Pro Plan Subscription - March 2024',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'ID of a saved payment method to be used for this payment.',
    example: 'pm_1Oy9XxLkdIwHu7ix0gQnZ6fA',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @ApiProperty({
    description: "Specific payment gateway to use (e.g., 'stripe', 'paypal', 'mada', 'stcpay'). If omitted, the service may use a default or configured gateway.",
    example: 'stripe',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentGateway?: string;

  @ApiProperty({
    description: 'Additional metadata to associate with the payment, useful for linking to internal resources.',
    example: { subscriptionId: 'sub_12345', invoiceId: 'inv_67890', customerId: 'cus_abcde' },
    type: 'object',
    additionalProperties: true,
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}