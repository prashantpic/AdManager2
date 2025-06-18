import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class PaymentWebhookPayloadDto {
  @ApiProperty({
    description: 'The type of event received from the payment gateway (e.g., "payment_intent.succeeded", "invoice.paid"). This is gateway-specific.',
    example: 'payment_intent.succeeded',
  })
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @ApiProperty({
    description: 'The actual data object associated with the event. The structure of this object is highly dependent on the payment gateway and the eventType.',
    example: { id: 'pi_3OyA0ZLkdIwHu7ix1aBcDefG', object: 'payment_intent', amount: 4999, currency: 'sar' },
    type: 'object',
    additionalProperties: true,
  })
  @IsObject() // Basic validation; deeper validation happens in the service based on eventType and gateway.
  data: any;

  // Note: For actual implementation, consider using discriminated unions based on `eventType`
  // or more specific DTOs per gateway event if strict typing is required at the controller level.
  // However, often the raw payload is processed directly in the service layer after signature verification.
}