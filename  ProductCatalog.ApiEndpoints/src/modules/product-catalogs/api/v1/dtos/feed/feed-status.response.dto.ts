// src/modules/product-catalogs/api/v1/dtos/feed/feed-status.response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';

const feedStatuses = ['Pending', 'Processing', 'Completed', 'Failed', 'Validated'];

/**
 * DTO for product feed status responses.
 * Defines the structure for reporting the status of a product feed generation or validation process.
 */
export class FeedStatusResponseDto {
  /**
   * Unique identifier of the feed job.
   * @example "b79a515e-ff1a-4f8a-8f6b-8a8d7e9c0b1a"
   */
  @ApiProperty({ description: 'Unique identifier of the feed job.', example: 'b79a515e-ff1a-4f8a-8f6b-8a8d7e9c0b1a', format: 'uuid' })
  @IsUUID()
  feedId: string;

  /**
   * Current status of the feed job.
   * @example "Completed"
   */
  @ApiProperty({
    description: 'Current status of the feed job.',
    enum: feedStatuses,
    example: 'Completed',
  })
  @IsString()
  @IsIn(feedStatuses)
  status: string;

  /**
   * Optional message providing additional details about the status, especially in case of failure.
   * @example "Feed generation completed successfully."
   */
  @ApiPropertyOptional({ description: 'Optional message providing additional details about the status.', example: 'Feed generation completed successfully.' })
  @IsOptional()
  @IsString()
  message?: string;

  /**
   * Timestamp of when this status was last checked or updated.
   */
  @ApiProperty({ description: 'Timestamp of when this status was last checked or updated.', type: Date })
  @Type(() => Date)
  @IsDate()
  lastCheckedAt: Date;

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