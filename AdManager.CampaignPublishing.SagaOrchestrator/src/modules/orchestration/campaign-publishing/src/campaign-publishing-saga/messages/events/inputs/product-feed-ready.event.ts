import { IsUUID, IsObject, ValidateNested, IsBoolean, IsString, IsOptional, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class FeedComplianceDetail {
  @IsBoolean()
  compliant: boolean;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsUrl()
  feedUrl?: string;
}

export class ProductFeedReadyEvent {
  @IsUUID()
  readonly correlationId: string;

  @IsUUID()
  readonly campaignId: string;

  @IsUUID()
  readonly productCatalogId: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => FeedComplianceDetailMapEntry) // Helper for map validation
  readonly feedComplianceStatus: Record<string, FeedComplianceDetail>;
}

// Helper class for validating map values with @ValidateNested
// This approach is a common workaround for validating map values.
// We effectively treat each key-value pair as an entry object.
// However, class-validator doesn't directly support Record<string, Class> validation elegantly for keys.
// A simpler approach for `feedComplianceStatus` might be to accept `any` and do manual validation if this becomes too complex
// or if the keys also need specific validation. For now, this validates the `FeedComplianceDetail` values.
class FeedComplianceDetailMapEntry {
    @IsString() // Represents the key of the map, not explicitly part of FeedComplianceDetail
    key: string; // Not part of the actual DTO structure, but required for @Type with maps

    @ValidateNested()
    @Type(() => FeedComplianceDetail)
    value: FeedComplianceDetail;
}