// src/modules/product-catalogs/api/v1/dtos/import/external-customization-import.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * DTO for importing external product catalog customizations.
 * Defines parameters accompanying a file upload for importing product catalog customizations from an external system.
 * Note: The actual file is handled as `Express.Multer.File` in the controller.
 */
export class ExternalCustomizationImportDto {
  /**
   * Identifier of the external system from which the customizations are being imported.
   * This helps in identifying the source and applying any source-specific logic or mapping.
   * @example "GoogleMerchantCenterFeed"
   */
  @ApiPropertyOptional({
    description: 'Identifier of the external system from which the customizations are being imported.',
    example: 'GoogleMerchantCenterFeed',
  })
  @IsOptional()
  @IsString()
  sourceSystem?: string;

  /**
   * Optional identifier of a pre-defined mapping configuration to be used for this import.
   * This allows for reusable mapping rules if the import format is consistent.
   * @example "e29b1c0a-7ef8-4e5b-9c1d-03b2a1c0d8f6"
   */
  @ApiPropertyOptional({
    description: 'Optional identifier of a pre-defined mapping configuration to be used for this import.',
    example: 'e29b1c0a-7ef8-4e5b-9c1d-03b2a1c0d8f6',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  mappingConfigurationId?: string;
}