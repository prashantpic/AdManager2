// src/modules/product-catalogs/api/v1/dtos/feed/feed-validation-result.response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

/**
 * DTO for product feed validation results.
 * Defines the structure for returning the results of a product feed validation.
 */
export class FeedValidationResultResponseDto {
  /**
   * Indicates whether the feed is valid according to the specified ad network's rules.
   * @example true
   */
  @ApiProperty({ description: 'Indicates whether the feed is valid according to the specified ad network\'s rules.', example: true, type: Boolean })
  @IsBoolean()
  isValid: boolean;

  /**
   * An array of error messages found during validation.
   * Present if `isValid` is false or if there are critical issues.
   * @example ["Missing required attribute: 'g:price'", "Invalid value for 'g:availability': 'soon'"]
   */
  @ApiPropertyOptional({
    description: 'An array of error messages found during validation.',
    type: [String],
    example: ["Missing required attribute: 'g:price'", "Invalid value for 'g:availability': 'soon'"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  errors?: string[];

  /**
   * An array of warning messages found during validation.
   * These are typically non-critical issues that might affect feed performance but don't render it invalid.
   * @example ["Recommended attribute 'g:material' is missing.", "Image URL is not HTTPS."]
   */
  @ApiPropertyOptional({
    description: 'An array of warning messages found during validation.',
    type: [String],
    example: ["Recommended attribute 'g:material' is missing.", "Image URL is not HTTPS."],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  warnings?: string[];

  /**
   * Timestamp of when the validation was performed.
   */
  @ApiProperty({ description: 'Timestamp of when the validation was performed.', type: Date })
  @Type(() => Date)
  @IsDate()
  validatedAt: Date;
}