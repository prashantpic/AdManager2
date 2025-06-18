/**
 * @fileoverview DTO for updating internal links within a blog post.
 * @namespace AdManager.SEOService.Api.V1.Dtos.Request
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { InternalLinkDto } from '../common/internal-link.dto';

/**
 * Defines the structure for updating the set of internal links
 * for a blog post.
 */
export class UpdateBlogInternalLinksRequestDto {
  @ApiProperty({
    type: () => [InternalLinkDto],
    description: 'List of internal links for the blog post.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InternalLinkDto)
  internalLinks: InternalLinkDto[];
}