import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ProrationDetailsRO {
  @ApiProperty({
    description: 'The prorated amount charged or credited due to a subscription change.',
    example: 15.50,
  })
  @IsNumber()
  proratedAmountCharged: number;

  @ApiProperty({
    description: 'A description of the proration calculation.',
    example: 'Prorated charge for upgrade from Basic to Premium plan.',
  })
  @IsString()
  description: string;
}