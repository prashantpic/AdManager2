// src/modules/product-catalogs/api/v1/dtos/feed/feed.response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

/**
 * DTO representing a generated product feed or its reference.
 * Provides details about a generated product feed, including its ID, status, and download link.
 */
export class FeedResponseDto {
  /**
   * Unique identifier for the generated feed job.
   * @example "b79a515e-ff1a-4f8a-8f6b-8a8d7e9c0b1a"
   */
  @ApiProperty({ description: 'Unique identifier for the generated feed job.', example: 'b79a515e-ff1a-4f8a-8f6b-8a8d7e9c0b1a', format: 'uuid' })
  @IsUUID()
  feedId: string;

  /**
   * Identifier of the catalog from which the feed was generated.
   * @example "f47ac10b-58cc-4372-a567-0e02b2c3d479"
   */
  @ApiProperty({ description: 'Identifier of the catalog from which the feed was generated.', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', format: 'uuid' })
  @IsUUID()
  catalogId: string;

  /**
   * The ad network for which the feed was generated.
   * @example "Google Shopping"
   */
  @ApiProperty({ description: 'The ad network for which the feed was generated.', example: 'Google Shopping' })
  @IsString()
  adNetwork: string;

  /**
   * Current status of the feed generation process.
   * Common statuses: 'Pending', 'Processing', 'Completed', 'Failed'.
   * @example "Processing"
   */
  @ApiProperty({ description: 'Current status of the feed generation process.', example: 'Processing' })
  @IsString()
  status: string; // Could be an enum if predefined statuses exist

  /**
   * URL to download the generated feed file.
   * This is typically available only when the status is 'Completed'.
   * @example "https://storage.example.com/feeds/b79a515e-feed.csv"
   */
  @ApiPropertyOptional({ description: 'URL to download the generated feed file (available if status is "Completed").', example: 'https://storage.example.com/feeds/b79a515e-feed.csv', format: 'url' })
  @IsOptional()
  @IsUrl()
  downloadUrl?: string;

  /**
   * Timestamp of when the feed generation was initiated.
   */
  @ApiProperty({ description: 'Timestamp of when the feed generation was initiated.', type: Date })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  /**
   * Timestamp indicating when the download URL for the feed might expire, if applicable.
   */
  @ApiPropertyOptional({ description: 'Timestamp indicating when the download URL for the feed might expire, if applicable.', type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date;
}