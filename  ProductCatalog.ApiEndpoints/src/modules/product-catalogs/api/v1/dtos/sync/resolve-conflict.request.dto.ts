// src/modules/product-catalogs/api/v1/dtos/sync/resolve-conflict.request.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

const resolutionChoices = ['KeepPlatformNameValue', 'KeepAdManagerOverride', 'ManualMerge'];

/**
 * DTO for resolving a specific data conflict.
 * Defines the payload for a merchant to resolve an identified data conflict.
 */
export class ResolveConflictRequestDto {
  /**
   * The chosen method for resolving the conflict.
   * - 'KeepPlatformNameValue': Discard Ad Manager override and use the value from the core [PlatformName] platform.
   * - 'KeepAdManagerOverride': Keep the Ad Manager specific override, overwriting the platform value for this catalog.
   * - 'ManualMerge': Provide a new value that manually merges or reconciles the conflicting data.
   * @example "KeepAdManagerOverride"
   */
  @ApiProperty({
    description: 'The chosen method for resolving the conflict.',
    enum: resolutionChoices,
    example: 'KeepAdManagerOverride',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(resolutionChoices)
  resolutionChoice: 'KeepPlatformNameValue' | 'KeepAdManagerOverride' | 'ManualMerge';

  /**
   * The manually merged value, to be provided if `resolutionChoice` is 'ManualMerge'.
   * The structure of this value should correspond to the type of the `conflictingField`.
   * This field is required and validated only when `resolutionChoice` is 'ManualMerge'.
   * @example "Manually Merged Product Title"
   */
  @ApiPropertyOptional({
    description: "The manually merged value, required if resolutionChoice is 'ManualMerge'. Its structure depends on the conflicting field's type.",
    example: 'Manually Merged Product Title',
  })
  @IsOptional()
  @ValidateIf(o => o.resolutionChoice === 'ManualMerge')
  @IsNotEmpty({ message: 'mergedValue is required when resolutionChoice is ManualMerge' })
  // No specific type validation here as `mergedValue` can be `any`.
  // The service layer should handle type validation based on `conflictingField`.
  mergedValue?: any;
}