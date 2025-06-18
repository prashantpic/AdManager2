import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsArray,
  IsDate,
  MaxLength,
  MinLength,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SeoMetaDto } from '../../common/dto/seo-meta.dto';
import { PublicationStatus } from '../../common/enums/publication-status.enum';
import { ContentLanguage } from '../../common/enums/content-language.enum';

/**
 * @file update-blog-post.req.dto.ts
 * @description DTO for updating an existing blog post. All fields are optional.
 * @Requirement REQ-6-002, REQ-6-003, REQ-6-005, REQ-6-012, REQ-7-007
 */
export class UpdateBlogPostReqDto {
  @ApiPropertyOptional({
    description: 'Title of the blog post.',
    example: 'My Updated Blog Post',
    minLength: 3,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Main content of the blog post (HTML/Markdown).',
    example: '<p>This is the updated content of my blog post.</p>',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Language of the content. Note: Changing language might imply creating a new translation or updating a specific language version.',
    enum: ContentLanguage,
    example: ContentLanguage.EN,
  })
  @IsOptional()
  @IsEnum(ContentLanguage)
  language?: ContentLanguage;

  @ApiPropertyOptional({
    description: 'Specific locale (e.g., en-US).',
    example: 'en-US',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  locale?: string;

  @ApiPropertyOptional({
    description: 'SEO related metadata.',
    type: () => SeoMetaDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SeoMetaDto)
  @IsObject()
  seoMeta?: SeoMetaDto;

  @ApiPropertyOptional({
    description: 'Array of tags associated with the post.',
    type: [String],
    example: ['update', 'nestjs', 'api'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Publication status of the blog post.',
    enum: PublicationStatus,
    example: PublicationStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(PublicationStatus)
  status?: PublicationStatus;

  @ApiPropertyOptional({
    description: 'Date for scheduled publication if status is SCHEDULED. ISO 8601 format.',
    example: '2025-01-15T10:00:00.000Z',
    type: Date,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publishDate?: Date;
}