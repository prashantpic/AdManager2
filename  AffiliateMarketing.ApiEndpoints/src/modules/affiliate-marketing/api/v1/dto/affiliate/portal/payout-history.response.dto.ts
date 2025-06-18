import { ApiProperty } from '@nestjs/swagger';
import { PayoutResponseDto } from '../../merchant/payouts/payout.response.dto'; // Reusing for consistency
import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';

export class PayoutHistoryResponseDto {
  @ApiProperty({
    description: 'A list of payout records for the affiliate.',
    type: () => [PayoutResponseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PayoutResponseDto)
  payouts: PayoutResponseDto[];
}