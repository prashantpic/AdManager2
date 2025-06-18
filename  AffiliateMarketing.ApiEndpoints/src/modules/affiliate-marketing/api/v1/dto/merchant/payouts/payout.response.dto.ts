import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PayoutResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the payout record.',
    example: 'pay_123abc456def',
  })
  payoutId: string;

  @ApiProperty({
    description: 'Identifier of the affiliate who received the payout.',
    example: 'aff_a1b2c3d4e5',
  })
  affiliateId: string;

  @ApiProperty({
    description: 'Name of the affiliate.',
    example: 'Jane Doe',
  })
  affiliateName: string;

  @ApiProperty({
    description: 'The amount of the payout.',
    example: 150.75,
  })
  amount: number;

  @ApiProperty({
    description: 'Currency of the payout amount.',
    example: 'SAR',
  })
  currency: string;

  @ApiProperty({
    description: 'Date the payout was made.',
    example: '2023-07-15T10:00:00.000Z',
  })
  paymentDate: Date;

  @ApiProperty({
    description: 'Status of the payout.',
    example: 'Paid',
    enum: ['Pending', 'Processing', 'Paid', 'Failed'],
  })
  status: string; // e.g., 'Pending', 'Processing', 'Paid', 'Failed'

  @ApiProperty({
    description: 'Start date of the period for which this payout is made.',
    example: '2023-06-01T00:00:00.000Z',
  })
  periodStartDate: Date;

  @ApiProperty({
    description: 'End date of the period for which this payout is made.',
    example: '2023-06-30T23:59:59.999Z',
  })
  periodEndDate: Date;

  @ApiPropertyOptional({
    description: 'Optional notes related to this payout.',
    example: 'Bonus included for high performance.',
  })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Details of the payment method used.',
    example: 'Bank Transfer to Account XXXX-1234',
  })
  paymentMethodDetails?: string;
}