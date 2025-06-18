// src/modules/product-catalogs/api/v1/dtos/feed/generate-feed.request.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

const supportedAdNetworks = ['Google', 'Instagram', 'TikTok', 'Snapchat', 'Facebook Ads', 'Google Shopping']; // Added from AI plan and general knowledge
const supportedFeedFormats = ['CSV', 'XML', 'JSON', 'TSV']; // Added from AI plan and general knowledge

/**
 * DTO for requesting product feed generation.
 * Defines parameters for requesting the generation of a product feed for a specific ad network.
 */
export class GenerateFeedRequestDto {
  /**
   * The ad network for which the feed is to be generated.
   * @example "Google Shopping"
   */
  @ApiProperty({
    description: 'The ad network for which the feed is to be generated.',
    enum: supportedAdNetworks,
    example: 'Google Shopping',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(supportedAdNetworks)
  adNetwork: string;

  /**
   * Optional desired format for the product feed.
   * If not specified, a default format for the ad network may be used.
   * @example "CSV"
   */
  @ApiPropertyOptional({
    description: 'Optional desired format for the product feed.',
    enum: supportedFeedFormats,
    example: 'CSV',
  })
  @IsOptional()
  @IsString()
  @IsIn(supportedFeedFormats)
  feedFormat?: string;
}