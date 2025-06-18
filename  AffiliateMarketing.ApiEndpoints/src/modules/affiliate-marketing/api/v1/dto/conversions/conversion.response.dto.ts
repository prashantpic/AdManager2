import { ApiProperty } from '@nestjs/swagger';

export class ConversionResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the tracked conversion.',
    example: 'conv_abcdef123456',
  })
  conversionId: string;

  @ApiProperty({
    description: 'Identifier of the affiliate credited for this conversion.',
    example: 'aff_a1b2c3d4e5',
  })
  affiliateId: string;

  @ApiProperty({
    description: 'Identifier of the program this conversion belongs to.',
    example: 'prog_x1y2z3a4b5',
  })
  programId: string;

  @ApiProperty({
    description: "The customer's order ID associated with this conversion.",
    example: 'ORDER_987654321',
  })
  orderId: string;

  @ApiProperty({
    description: 'The calculated commission amount for this conversion.',
    example: 19.99,
  })
  commissionAmount: number;

  @ApiProperty({
    description: 'The currency of the commission amount.',
    example: 'SAR',
  })
  commissionCurrency: string;

  @ApiProperty({
    description: 'Current status of the conversion.',
    example: 'Tracked',
    enum: ['Tracked', 'Verified', 'PendingPayout', 'Paid', 'Rejected'],
  })
  status: string; // e.g., 'Tracked', 'Verified', 'PendingPayout', 'Paid', 'Rejected'

  @ApiProperty({
    description: 'Timestamp when the conversion was recorded.',
    example: '2023-07-20T14:35:10.000Z',
  })
  conversionTimestamp: Date;

  @ApiProperty({
    description: 'Method of attribution for this conversion.',
    example: 'LastClick',
    enum: ['LastClick', 'Coupon', 'FirstClick'], // Example attribution types
  })
  attributionType: string; // e.g., 'LastClick', 'Coupon'
}