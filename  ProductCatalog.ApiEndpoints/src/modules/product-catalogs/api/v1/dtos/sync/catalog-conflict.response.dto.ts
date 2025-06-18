// src/modules/product-catalogs/api/v1/dtos/sync/catalog-conflict.response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsString, IsUUID } from 'class-validator';

const conflictStatuses = ['Unresolved', 'Resolved'];

/**
 * DTO representing a data conflict identified in a catalog.
 * Defines the structure for representing a single data conflict that needs resolution.
 */
export class CatalogConflictResponseDto {
  /**
   * Unique identifier for the conflict record.
   * @example "conf_a1b2c3d4e5f6"
   */
  @ApiProperty({ description: 'Unique identifier for the conflict record.', example: 'conf_a1b2c3d4e5f6', format: 'uuid' })
  @IsUUID()
  conflictId: string;

  /**
   * Identifier of the product involved in the conflict.
   * This typically refers to the `coreProductId`.
   * @example "prod_1234567890"
   */
  @ApiProperty({ description: 'Identifier of the product involved in the conflict.', example: 'prod_1234567890' })
  @IsString() // Or IsUUID if product IDs are UUIDs
  productId: string;

  /**
   * The specific field name where the data conflict occurred (e.g., 'title', 'price', 'customAttributes.color').
   * @example "title"
   */
  @ApiProperty({ description: 'The specific field name where the data conflict occurred.', example: 'title' })
  @IsString()
  conflictingField: string;

  /**
   * The value of the conflicting field from the core [PlatformName] platform.
   * The type of this value can vary depending on the field.
   * @example "Original Product Title"
   */
  @ApiProperty({ description: 'The value of the conflicting field from the core [PlatformName] platform.', example: 'Original Product Title' })
  platformNameValue: any; // Using `any` as the type can vary. Be more specific if possible.

  /**
   * The value of the conflicting field from the Ad Manager overrides.
   * The type of this value can vary depending on the field.
   * @example "Ad-Specific Overridden Title"
   */
  @ApiProperty({ description: 'The value of the conflicting field from the Ad Manager overrides.', example: 'Ad-Specific Overridden Title' })
  adManagerOverrideValue: any; // Using `any` as the type can vary.

  /**
   * Current status of the conflict.
   * - 'Unresolved': The conflict requires attention and resolution.
   * - 'Resolved': The conflict has been addressed.
   * @example "Unresolved"
   */
  @ApiProperty({
    description: 'Current status of the conflict.',
    enum: conflictStatuses,
    example: 'Unresolved',
  })
  @IsString()
  @IsIn(conflictStatuses)
  status: 'Unresolved' | 'Resolved';

  /**
   * Timestamp of when the conflict was detected.
   */
  @ApiProperty({ description: 'Timestamp of when the conflict was detected.', type: Date })
  @Type(() => Date)
  @IsDate()
  detectedAt: Date;
}