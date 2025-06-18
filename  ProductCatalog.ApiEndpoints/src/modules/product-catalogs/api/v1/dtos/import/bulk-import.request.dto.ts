// src/modules/product-catalogs/api/v1/dtos/import/bulk-import.request.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

const supportedFileFormats = ['CSV', 'XML'];
const supportedConflictModes = ['Overwrite', 'Skip', 'Merge'];

/**
 * DTO for bulk importing product data.
 * Defines parameters accompanying a bulk product data file upload, such as file format and conflict resolution strategy.
 * Note: The actual file is handled as `Express.Multer.File` in the controller.
 */
export class BulkImportRequestDto {
  /**
   * Format of the uploaded product data file.
   * @example "CSV"
   */
  @ApiProperty({
    description: 'Format of the uploaded product data file.',
    enum: supportedFileFormats,
    example: 'CSV',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(supportedFileFormats)
  fileFormat: 'CSV' | 'XML';

  /**
   * Optional strategy to handle conflicts when imported product data matches existing data.
   * - 'Overwrite': Replace existing data with imported data.
   * - 'Skip': Keep existing data and ignore conflicting imported data.
   * - 'Merge': Attempt to intelligently merge existing and imported data (service-defined logic).
   * If not specified, a default strategy (e.g., 'Overwrite' or 'Skip') will be applied by the service.
   * @example "Overwrite"
   */
  @ApiPropertyOptional({
    description: 'Optional strategy to handle conflicts with existing product data.',
    enum: supportedConflictModes,
    example: 'Overwrite',
  })
  @IsOptional()
  @IsString()
  @IsIn(supportedConflictModes)
  conflictResolutionMode?: 'Overwrite' | 'Skip' | 'Merge';
}