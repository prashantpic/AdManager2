import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
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
 * @file create-blog-post.req.dto.ts
 * @description DTO for creating a new blog post.
 * @Requirement REQ-6-001, REQ-6-002, REQ-6-003, REQ-6-005, REQ-6-012, REQ-7-007
 */
export class CreateBlogPostReqDto {
  @ApiProperty({
    description: 'Title of the blog post.',
    example: 'My First Blog Post',
    minLength: 3,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Main content of the blog post (HTML/Markdown).',
    example: '<p>This is the content of my first blog post.</p>',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Language of the content.',
    enum: ContentLanguage,
    example: ContentLanguage.EN,
  })
  @IsNotEmpty()
  @IsEnum(ContentLanguage)
  language: ContentLanguage;

  @ApiPropertyOptional({
    description: 'Specific locale (e.g., en-US).',
    example: 'en-US',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  locale?: string;

  @ApiProperty({
    description: 'Identifier for the author (usually the userId of the merchant user).',
    example: 'user-uuid-12345',
  })
  @IsNotEmpty()
  @IsString() // As per SDS, if UUID, use @IsUUID()
  authorId: string;

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
    example: ['nestjs', 'typescript', 'blog'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Initial status of the blog post.',
    enum: PublicationStatus,
    default: PublicationStatus.DRAFT,
    example: PublicationStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(PublicationStatus)
  status?: PublicationStatus = PublicationStatus.DRAFT;

  @ApiPropertyOptional({
    description: 'Date for scheduled publication if status is SCHEDULED. ISO 8601 format.',
    example: '2024-12-31T10:00:00.000Z',
    type: Date,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publishDate?: Date;
}