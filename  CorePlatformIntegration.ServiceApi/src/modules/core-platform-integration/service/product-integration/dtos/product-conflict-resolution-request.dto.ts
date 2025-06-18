import { IsAny, IsDefined, IsString } from 'class-validator';

export class ProductConflictResolutionRequestDto {
  @IsString()
  @IsDefined()
  readonly merchantId: string;

  @IsString()
  @IsDefined()
  readonly productId: string;

  @IsString()
  @IsDefined()
  readonly conflictingField: string;

  @IsAny() // Can be any type, often stringified JSON for complex values
  @IsDefined()
  readonly corePlatformValue: any;

  @IsAny() // Can be any type, often stringified JSON for complex values
  @IsDefined()
  readonly adManagerOverrideValue: any;

  @IsString() // e.g., 'PRIORITIZE_AD_MANAGER', 'PRIORITIZE_CORE_PLATFORM', 'MANUAL_REVIEW_NOTIFICATION'
  @IsDefined()
  readonly resolutionStrategy: string;
}