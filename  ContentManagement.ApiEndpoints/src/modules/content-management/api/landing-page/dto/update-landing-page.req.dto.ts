import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsArray,
  MaxLength,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SeoMetaDto } from '../../common/dto/seo-meta.dto';
import { PublicationStatus } from '../../common/enums/publication-status.enum';
import { ContentLanguage } from '../../common/enums/content-language.enum';
import { PromotionalBannerDto } from './promotional-banner.dto';
import { CountdownTimerDto } from './countdown-timer.dto';
import { CtaButtonDto } from './cta-button.dto';

/**
 * @file update-landing-page.req.dto.ts
 * @description DTO for updating an existing landing page. All fields are optional.
 * @Requirement REQ-6-007, REQ-6-008, REQ-6-010, REQ-6-012, REQ-7-007
 */
export class UpdateLandingPageReqDto {
  @ApiPropertyOptional({
    description: 'Title of the landing page.',
    example: 'Updated Summer Sale Landing Page',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'JSON object describing the layout and content elements of the page.',
    example: { version: '1.1', blocks: [{ type: 'hero', title: 'Welcome Back!' }] },
    type: 'object',
  })
  @IsOptional()
  @IsObject() // Basic validation that it's an object
  contentStructure?: any;

  @ApiPropertyOptional({
    description: 'Language of the content.',
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
    description: 'Publication status of the landing page.',
    enum: PublicationStatus,
    example: PublicationStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(PublicationStatus)
  status?: PublicationStatus;

  @ApiPropertyOptional({
    description: 'ID of an associated advertising campaign.',
    example: 'campaign-uuid-67890',
  })
  @IsOptional()
  @IsString()
  campaignId?: string;

  @ApiPropertyOptional({
    description: 'Array of promotional banners.',
    type: [PromotionalBannerDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionalBannerDto)
  promotionalBanners?: PromotionalBannerDto[];

  @ApiPropertyOptional({
    description: 'Array of countdown timers.',
    type: [CountdownTimerDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CountdownTimerDto)
  countdownTimers?: CountdownTimerDto[];

  @ApiPropertyOptional({
    description: 'Array of Call-to-Action buttons.',
    type: [CtaButtonDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CtaButtonDto)
  ctaButtons?: CtaButtonDto[];

  @ApiPropertyOptional({
    description: 'Array for embedding other multimedia (e.g., video URLs, structured data for embeds).',
    type: 'array',
    items: { type: 'object' },
    example: [{ type: 'video', url: 'https://youtube.com/watch?v=456' }],
  })
  @IsOptional()
  @IsArray()
  multimediaContent?: any[];
}