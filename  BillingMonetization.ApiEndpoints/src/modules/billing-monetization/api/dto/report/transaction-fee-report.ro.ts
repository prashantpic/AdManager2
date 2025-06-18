import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
// Assuming TransactionFeeDetailRO will be in a separate file as per SDS structure.
// For the purpose of this generation, we'll assume it will be available.
import { TransactionFeeDetailRO } from './transaction-fee-detail.ro';


export class TransactionFeeReportRO {
  @ApiProperty({
    description: 'The unique identifier of the merchant for whom the report is generated.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  merchantId: string;

  @ApiProperty({
    description: 'The start date of the reporting period.',
    example: '2024-03-01T00:00:00.000Z',
    type: Date,
  })
  @IsDate()
  periodStartDate: Date;

  @ApiProperty({
    description: 'The end date of the reporting period.',
    example: '2024-03-31T23:59:59.999Z',
    type: Date,
  })
  @IsDate()
  periodEndDate: Date;

  @ApiProperty({
    description: 'The total sales amount processed during the reporting period that was subject to transaction fees.',
    example: 15000.75,
  })
  @IsNumber()
  totalSalesAmount: number;

  @ApiProperty({
    description: 'The total amount of transaction fees incurred by the merchant during the reporting period.',
    example: 75.25,
  })
  @IsNumber()
  totalTransactionFees: number;

  @ApiProperty({
    description: 'A detailed breakdown of individual transactions and their associated fees.',
    type: () => [TransactionFeeDetailRO],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionFeeDetailRO)
  feeDetails: TransactionFeeDetailRO[];
}