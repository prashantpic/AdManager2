/**
 * @fileoverview Common DTO representing a suggested internal link.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Common
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsOptional, IsIn } from 'class-validator';

/**
 * Represents a single suggested internal link, including the relevant text
 * from content, suggested anchor, target URL, and type.
 */
export class SuggestedLinkDto {
  @ApiProperty({
    description: 'Text in content identified as relevant for linking.',
    example: 'eco-friendly products',
  })
  @IsString()
  @IsNotEmpty()
  relevantText: string;

  @ApiProperty({
    required: false,
    description: 'Suggested anchor text for the link.',
    example: 'our new eco-friendly line',
  })
  @IsString()
  @IsOptional()
  suggestedAnchorText?: string;

  @ApiProperty({
    description: 'Suggested target URL.',
    example: 'https://mystore.com/collections/eco-friendly',
    format: 'url',
  })
  @IsUrl()
  suggestedTargetUrl: string;

  @ApiProperty({
    description: "Type of target (e.g., 'product', 'blog', 'collection', 'custom').",
    enum: ['product', 'blog', 'collection', 'custom'],
    example: 'collection',
  })
  @IsString()
  @IsIn(['product', 'blog', 'collection', 'custom'])
  targetType: string;

  @ApiProperty({
    required: false,
    description: 'Reason for the suggestion.',
    example: 'Relevant to current content topic and links to a key collection.',
  })
  @IsString()
  @IsOptional()
  reason?: string;
}