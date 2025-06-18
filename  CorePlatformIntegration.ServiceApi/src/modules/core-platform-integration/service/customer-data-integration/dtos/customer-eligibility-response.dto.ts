import { IsBoolean, IsDefined, IsString } from 'class-validator';

export class CustomerEligibilityResponseDto {
  @IsString()
  @IsDefined()
  readonly customerId: string;

  @IsString()
  @IsDefined()
  readonly promotionId: string;

  @IsBoolean()
  @IsDefined()
  readonly isEligible: boolean;
}