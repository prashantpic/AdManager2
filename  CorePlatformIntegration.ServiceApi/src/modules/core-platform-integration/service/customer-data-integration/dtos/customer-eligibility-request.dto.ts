import { IsObject, IsDefined, IsString } from 'class-validator';

export class CustomerEligibilityRequestDto {
  @IsString()
  @IsDefined()
  readonly customerId: string;

  @IsString()
  @IsDefined()
  readonly promotionId: string;

  @IsObject() // Represents a JSON object structure for criteria
  @IsDefined()
  readonly eligibilityCriteria: object; // e.g., {"isNewCustomer": true, "segment": "VIP"}
}