import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SeoMetaDto } from '../../common/dto/seo-meta.dto';
import { PublicationStatus } from '../../common/enums/publication-status.enum';
import { ContentLanguage } from '../../common/enums/content-language.enum';
import { PromotionalBannerDto } from './promotional-banner.dto';
import { CountdownTimerDto } from './countdown-timer.dto';
import { CtaButtonDto } from './cta-button.dto';

/**
 * @file landing-page.res.dto.ts
 * @description DTO for representing a landing page in API responses.
 * @Requirement REQ-6-006, REQ-6-007, REQ-6-008, REQ-6-010, REQ-6-012, REQ-7-007
 */
export class LandingPageResDto {
  @ApiProperty({
    description: 'Unique identifier of the landing page.',
    example: 'clx0kfeep0001qxtsabcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the landing page.',
    example: 'Summer Sale Landing Page',
  })
  title: string;

  @ApiProperty({
    description: 'JSON object describing the layout and content elements of the page.',
    example: { version: '1.0', blocks: [{ type: 'hero', title: 'Welcome!' }] },
    type: 'object',
  })
  contentStructure: any;

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
    description: 'SEO related metadata.',
    type: () => SeoMetaDto,
  })
  @Type(() => SeoMetaDto)
  seoMeta: SeoMetaDto;

  @ApiProperty({
    description: 'Publication status of the landing page.',
    enum: PublicationStatus,
    example: PublicationStatus.PUBLISHED,
  })
  status: PublicationStatus;

  @ApiPropertyOptional({
    description: 'ID of an associated advertising campaign.',
    example: 'campaign-uuid-67890',
  })
  campaignId?: string;

  @ApiProperty({
    description: 'Array of promotional banners.',
    type: [PromotionalBannerDto],
  })
  @Type(() => PromotionalBannerDto)
  @ValidateNested({ each: true }) // Though this is a response DTO, it's good practice for consistency if it's ever used as input or for internal validation
  promotionalBanners: PromotionalBannerDto[];

  @ApiProperty({
    description: 'Array of countdown timers.',
    type: [CountdownTimerDto],
  })
  @Type(() => CountdownTimerDto)
  @ValidateNested({ each: true })
  countdownTimers: CountdownTimerDto[];

  @ApiProperty({
    description: 'Array of Call-to-Action buttons.',
    type: [CtaButtonDto],
  })
  @Type(() => CtaButtonDto)
  @ValidateNested({ each: true })
  ctaButtons: CtaButtonDto[];

  @ApiProperty({
    description: 'Array for embedding other multimedia.',
    type: 'array',
    items: { type: 'object' },
    example: [{ type: 'video', url: 'https://youtube.com/watch?v=123' }],
  })
  multimediaContent: any[];

  @ApiProperty({
    description: 'Timestamp of creation. ISO 8601 format.',
    example: '2024-07-29T12:00:00.000Z',
    type: Date,
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of last update. ISO 8601 format.',
    example: '2024-07-29T13:00:00.000Z',
    type: Date,
  })
  @Type(() => Date)
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Publicly accessible URL for the landing page (derived).',
    example: 'https://example.com/lp/summer-sale',
  })
  publicUrl?: string;
}