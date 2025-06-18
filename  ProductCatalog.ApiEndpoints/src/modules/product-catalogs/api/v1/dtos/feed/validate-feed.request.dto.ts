// src/modules/product-catalogs/api/v1/dtos/feed/validate-feed.request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

const supportedAdNetworksForValidation = ['Google', 'Instagram', 'TikTok', 'Snapchat', 'Facebook Ads', 'Google Shopping'];

/**
 * DTO for requesting product feed validation.
 * Defines parameters for requesting validation of a product catalog feed against a specific ad network's specifications.
 */
export class ValidateFeedRequestDto {
  /**
   * The ad network specification against which the feed should be validated.
   * The feed to be validated is typically implied by the catalog context of the API call.
   * @example "Google Shopping"
   */
  @ApiProperty({
    description: 'The ad network specification against which the feed should be validated.',
    enum: supportedAdNetworksForValidation,
    example: 'Google Shopping',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(supportedAdNetworksForValidation)
  adNetwork: string;
}