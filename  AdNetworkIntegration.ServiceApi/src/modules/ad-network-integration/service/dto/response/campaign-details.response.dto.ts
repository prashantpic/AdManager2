```typescript
import {
  AdNetworkType,
  CampaignStatus,
  Status as ServiceStatus,
} from '../../common/enums';

// These interfaces are defined locally for this DTO.
// In a complete system, ErrorDetailDto might come from a shared 'internal-common.dto.ts'
// or be mapped directly from gRPC generated types.

interface ErrorDetailDtoInterface {
  code: number;
  message: string;
  details?: string;
  ad_network_error_code?: string;
}

interface CampaignDtoInterface {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
  adNetwork: AdNetworkType;
  merchantId: string;
}

/**
 * Data Transfer Object for responding with campaign details.
 * This DTO is typically used by the AdNetworkIntegrationService.
 * It mirrors the structure of the gRPC CampaignDetailsResponse message.
 */
export class CampaignDetailsResponseDto {
  campaign: CampaignDtoInterface;
  status: ServiceStatus;
  error?: ErrorDetailDtoInterface;
}
```