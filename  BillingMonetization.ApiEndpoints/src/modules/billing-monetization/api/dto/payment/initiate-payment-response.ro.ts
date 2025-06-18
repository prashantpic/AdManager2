import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class InitiatePaymentResponseRO {
  @ApiProperty({
    description: 'The ID of the payment intent created by the payment gateway (e.g., Stripe PaymentIntent ID).',
    example: 'pi_3OyA0ZLkdIwHu7ix1aBcDefG',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentIntentId?: string;

  @ApiProperty({
    description: "The client secret for the payment intent, used by client-side SDKs (e.g., Stripe.js) to confirm the payment. This should be handled securely by the client and not logged server-side unnecessarily.",
    example: 'pi_3OyA0ZLkdIwHu7ix1aBcDefG_secret_XyZ123',
    required: false,
  })
  @IsOptional()
  @IsString()
  clientSecret?: string;

  @ApiProperty({
    description: 'A URL to redirect the user to for completing the payment (e.g., for 3D Secure authentication or off-site payment pages).',
    example: 'https://checkout.stripe.com/pay/cs_test_a1B2c3D4e5F6g7H8i9J0kL',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  redirectUrl?: string;

  @ApiProperty({
    description: "The current status of the payment initiation (e.g., 'requires_action', 'succeeded', 'requires_payment_method').",
    example: 'requires_action',
  })
  @IsString()
  status: string;
}