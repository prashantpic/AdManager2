import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsUUID,
  IsOptional,
  IsDateString,
  IsString,
} from 'class-validator';

export class ProcessPayoutsDto {
  @ApiPropertyOptional({
    description: 'Array of affiliate IDs to process payouts for. If not provided, all eligible affiliates will be processed.',
    example: ['a1b2c3d4-e5f6-7890-1234-567890abcdef', 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7'],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  affiliateIds?: string[];

  @ApiProperty({
    description: 'The date on which the payment is made or recorded.',
    example: '2023-07-01T00:00:00.000Z',
  })
  @IsDateString()
  paymentDate: Date;

  @ApiPropertyOptional({
    description: 'Optional notes regarding this payout batch.',
    example: 'Q2 Payouts for top performers.',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Details about the payment method used.',
    example: 'Manual Bank Transfer Ref: Payout_Q2_2023_Batch1',
  })
  @IsString()
  @IsOptional()
  paymentMethodDetails?: string;
}