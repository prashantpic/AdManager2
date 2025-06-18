import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
// Assuming InvoiceLineItemRO will be in a separate file as per SDS structure
// If it's not generated in this batch, this import will cause an error until it exists.
// For the purpose of this generation, we'll assume it will be available.
import { InvoiceLineItemRO } from './invoice-line-item.ro';

export enum InvoiceStatusEnum {
  DRAFT = 'draft',
  OPEN = 'open',
  PAID = 'paid',
  VOID = 'void',
  UNCOLLECTIBLE = 'uncollectible',
}

export class InvoiceRO {
  @ApiProperty({
    description: 'The unique identifier of the invoice.',
    example: 'b8e9f5a0-9b1c-4e7d-8f2g-3h4i5j6k7l8m',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'A human-readable invoice number.',
    example: 'INV-2024-00123',
  })
  @IsString()
  invoiceNumber: string;

  @ApiProperty({
    description: 'The date when the invoice was issued.',
    example: '2024-03-20T10:00:00.000Z',
    type: Date,
  })
  @IsDate()
  issueDate: Date;

  @ApiProperty({
    description: 'The date when the payment for this invoice is due.',
    example: '2024-04-01T10:00:00.000Z',
    type: Date,
  })
  @IsDate()
  dueDate: Date;

  @ApiProperty({
    description: 'The total amount due for this invoice.',
    example: 99.99,
  })
  @IsNumber()
  amountDue: number;

  @ApiProperty({
    description: 'The total amount paid towards this invoice.',
    example: 0.0,
  })
  @IsNumber()
  amountPaid: number;

  @ApiProperty({
    description: 'The current status of the invoice.',
    enum: InvoiceStatusEnum,
    example: InvoiceStatusEnum.OPEN,
  })
  @IsEnum(InvoiceStatusEnum)
  status: InvoiceStatusEnum;

  @ApiProperty({
    description: 'The currency of the invoice amounts (ISO 4217 code).',
    example: 'SAR',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @Length(3, 3)
  currency: string;

  @ApiProperty({
    description: 'An array of line items included in this invoice.',
    type: () => [InvoiceLineItemRO],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineItemRO)
  lineItems: InvoiceLineItemRO[];

  @ApiProperty({
    description: 'A URL from which a PDF version of the invoice can be downloaded, if available.',
    example: 'https://api.example.com/invoices/b8e9f5a0/pdf',
    required: false,
  })
  @IsOptional()
  @IsString() // Should be @IsUrl once fully implemented
  downloadUrl?: string;
}