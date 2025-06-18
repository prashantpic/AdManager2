import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PaymentMethodUpdateDto {
  @ApiProperty({
    description: "A token representing the payment method, obtained from the client-side payment gateway SDK (e.g., Stripe's PaymentMethod ID `pm_...` or a legacy Token ID `tok_...`). This token is short-lived and should be used promptly.",
    example: 'pm_1Oy9XxLkdIwHu7ix0gQnZ6fA',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethodToken: string;

  @ApiProperty({
    description: 'Whether this payment method should be set as the default for future charges. If multiple payment methods exist, only one can be the default.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}