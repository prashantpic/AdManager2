import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class InvoiceLineItemRO {
  @ApiProperty({
    description: 'The unique identifier of the line item.',
    example: 'li_1P9Z2q2eZvKYlo2ChGjX9Y8G',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'A brief description of the line item.',
    example: 'Subscription to Pro Plan (Monthly)',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The quantity of the item.',
    example: 1,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'The unit amount for the item in the smallest currency unit (e.g., cents).',
    example: 4900,
  })
  @IsNumber()
  unitAmount: number;

  @ApiProperty({
    description: 'The total amount for this line item (quantity * unitAmount).',
    example: 4900,
  })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({
    description: 'The start date of the service period this line item covers, if applicable.',
    example: '2024-07-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  periodStartDate?: Date;

  @ApiProperty({
    description: 'The end date of the service period this line item covers, if applicable.',
    example: '2024-08-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  periodEndDate?: Date;
}