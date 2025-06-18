```typescript
import {
  AdNetworkType,
  CampaignStatus,
} from '../../common/enums';
import {
  IsEnum,
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

/**
 * Data Transfer Object for creating a new advertising campaign.
 * This DTO is typically used by the AdNetworkIntegrationService.
 * It mirrors the structure of the gRPC CreateCampaignRequest message.
 */
export class CreateCampaignRequestDto {
  @IsEnum(AdNetworkType)
  @IsNotEmpty()
  adNetwork: AdNetworkType;

  @IsString()
  @IsNotEmpty()
  merchantId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  budget: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string; // ISO 8601 format "YYYY-MM-DD"

  @IsDateString()
  @IsNotEmpty()
  endDate: string; // ISO 8601 format "YYYY-MM-DD"

  @IsEnum(CampaignStatus)
  @IsNotEmpty()
  initialStatus: CampaignStatus;

  // Example of other campaign parameters if needed, align with proto
  // @IsOptional()
  // @IsString()
  // targetingCriteria?: string;
}
```