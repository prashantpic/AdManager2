/**
 * @fileoverview DTO for returning internal links of a blog post.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Response
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { InternalLinkDto } from '../common/internal-link.dto';

/**
 * Defines the structure of the response containing internal links
 * for a specific blog post.
 */
export class BlogInternalLinksResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the blog post.',
    example: 'blog-post-abc-123',
  })
  @IsString()
  blogPostId: string;

  @ApiProperty({
    type: () => [InternalLinkDto],
    description: 'List of internal links within the blog post.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InternalLinkDto)
  internalLinks: InternalLinkDto[];
}