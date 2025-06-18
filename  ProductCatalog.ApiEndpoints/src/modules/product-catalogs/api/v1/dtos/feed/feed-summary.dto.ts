// src/modules/product-catalogs/api/v1/dtos/feed/feed-summary.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID, IsUrl, IsOptional } from 'class-validator';

/**
 * DTO for summarizing a generated product feed, typically used in lists.
 */
export class FeedSummaryDto {
  /**
   * Unique identifier for the generated feed job.
   * @example "b79a515e-ff1a-4f8a-8f6b-8a8d7e9c0b1a"
   */
  @ApiProperty({ description: 'Unique identifier for the generated feed job.', example: 'b79a515e-ff1a-4f8a-8f6b-8a8d7e9c0b1a', format: 'uuid' })
  @IsUUID()
  feedId: string;

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
   * @example "Completed"
   */
  @ApiProperty({ description: 'Current status of the feed generation process.', example: 'Completed' })
  @IsString()
  status: string; // Could be an enum if predefined statuses exist

  /**
   * Timestamp of when the feed generation was initiated.
   */
  @ApiProperty({ description: 'Timestamp of when the feed generation was initiated.', type: Date })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  /**
   * URL to download the generated feed file.
   * This is typically available only when the status is 'Completed'.
   * @example "https://storage.example.com/feeds/b79a515e-feed.csv"
   */
  @ApiPropertyOptional({ description: 'URL to download the generated feed file (available if status is "Completed").', example: 'https://storage.example.com/feeds/b79a515e-feed.csv', format: 'url' })
  @IsOptional()
  @IsUrl()
  downloadUrl?: string;
}