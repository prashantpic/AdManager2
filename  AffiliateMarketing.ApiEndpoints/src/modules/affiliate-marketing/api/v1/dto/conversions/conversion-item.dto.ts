import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, IsNumber } from 'class-validator';

export class ConversionItemDto {
  @ApiProperty({
    description: 'Identifier of the product in the conversion.',
    example: 'PROD_XYZ789',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product sold.',
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Unit price of the product at the time of conversion.',
    example: 49.99,
  })
  @IsNumber()
  @Min(0)
  unitPrice: number;
}