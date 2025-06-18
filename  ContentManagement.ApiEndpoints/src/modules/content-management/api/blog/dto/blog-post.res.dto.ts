import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SeoMetaDto } from '../../common/dto/seo-meta.dto';
import { PublicationStatus } from '../../common/enums/publication-status.enum';
import { ContentLanguage } from '../../common/enums/content-language.enum';

/**
 * @file blog-post.res.dto.ts
 * @description DTO for representing a blog post in API responses.
 * @Requirement REQ-6-001, REQ-6-002, REQ-6-003, REQ-6-005, REQ-6-012, REQ-7-007
 */
export class BlogPostResDto {
  @ApiProperty({
    description: 'Unique identifier of the blog post.',
    example: 'clx0kdeep0000qxtsf6zt5r2g',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the blog post.',
    example: 'My First Blog Post',
  })
  title: string;

  @ApiProperty({
    description: 'Main content of the blog post (HTML/Markdown).',
    example: '<p>This is the content of my first blog post.</p>',
  })
  content: string;

  @ApiProperty({
    description: 'Language of the content.',
    enum: ContentLanguage,
    example: ContentLanguage.EN,
  })
  language: ContentLanguage;

  @ApiPropertyOptional({
    description: 'Specific locale (e.g., en-US).',
    example: 'en-US',
  })
  locale?: string;

  @ApiProperty({
    description: 'Identifier for the author.',
    example: 'user-uuid-12345',
  })
  authorId: string;

  @ApiProperty({
    description: 'SEO related metadata.',
    type: () => SeoMetaDto,
  })
  @Type(() => SeoMetaDto)
  seoMeta: SeoMetaDto;

  @ApiProperty({
    description: 'Array of tags associated with the post.',
    type: [String],
    example: ['nestjs', 'typescript', 'blog'],
  })
  tags: string[];

  @ApiProperty({
    description: 'Publication status of the blog post.',
    enum: PublicationStatus,
    example: PublicationStatus.PUBLISHED,
  })
  status: PublicationStatus;

  @ApiPropertyOptional({
    description: 'Date of scheduled publication if status was SCHEDULED. ISO 8601 format.',
    example: '2024-12-31T10:00:00.000Z',
    type: Date,
  })
  @Type(() => Date)
  publishDate?: Date;

  @ApiProperty({
    description: 'Timestamp of creation. ISO 8601 format.',
    example: '2024-07-29T10:00:00.000Z',
    type: Date,
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of last update. ISO 8601 format.',
    example: '2024-07-29T11:00:00.000Z',
    type: Date,
  })
  @Type(() => Date)
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Publicly accessible URL for the blog post (derived).',
    example: 'https://example.com/blog/my-first-blog-post',
  })
  publicUrl?: string;
}