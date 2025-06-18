/**
 * @fileoverview Interface defining the contract for the SEO service.
 * API controllers will depend on this abstraction for SEO functionalities.
 * @namespace AdManager.SEOService.Api.V1.Interfaces
 */

import { SetPageKeywordsRequestDto } from '../dtos/request/set-page-keywords-request.dto';
import { PageKeywordsResponseDto } from '../dtos/response/page-keywords-response.dto';
import { KeywordSuggestionRequestDto } from '../dtos/request/keyword-suggestion-request.dto';
import { KeywordSuggestionResponseDto } from '../dtos/response/keyword-suggestion-response.dto';
import { UpdateSchemaMarkupRequestDto } from '../dtos/request/update-schema-markup-request.dto';
import { SchemaMarkupResponseDto } from '../dtos/response/schema-markup-response.dto';
import { UpdatePageMetaTagsRequestDto } from '../dtos/request/update-page-meta-tags-request.dto';
import { PageMetaTagsResponseDto } from '../dtos/response/page-meta-tags-response.dto';
import { UpdateImageAltTextRequestDto } from '../dtos/request/update-image-alt-text-request.dto';
import { ImageAltTextResponseDto } from '../dtos/response/image-alt-text-response.dto';
import { SitemapUrlResponseDto } from '../dtos/response/sitemap-url-response.dto';
import { RobotsTxtResponseDto } from '../dtos/response/robots-txt-response.dto';
import { RobotsTxtSuggestionRequestDto } from '../dtos/request/robots-txt-suggestion-request.dto';
import { RobotsTxtSuggestionResponseDto } from '../dtos/response/robots-txt-suggestion-response.dto';
import { UpdateBlogInternalLinksRequestDto } from '../dtos/request/update-blog-internal-links-request.dto';
import { BlogInternalLinksResponseDto } from '../dtos/response/blog-internal-links-response.dto';
import { InternalLinkSuggestionRequestDto } from '../dtos/request/internal-link-suggestion-request.dto';
import { InternalLinkSuggestionResponseDto } from '../dtos/response/internal-link-suggestion-response.dto';

/**
 * Defines the contract for the SEO service that implements the core business logic.
 * The SeoController depends on this interface.
 */
export interface ISeoService {
  /**
   * Retrieves keywords for a specific page.
   * @param pageType - Type of the page (e.g., 'product', 'blog').
   * @param pageId - Unique identifier of the page.
   * @param merchantId - Unique identifier of the merchant.
   * @returns A promise resolving to PageKeywordsResponseDto.
   */
  getPageKeywords(pageType: string, pageId: string, merchantId: string): Promise<PageKeywordsResponseDto>;

  /**
   * Sets or updates keywords for a specific page.
   * @param pageType - Type of the page.
   * @param pageId - Unique identifier of the page.
   * @param merchantId - Unique identifier of the merchant.
   * @param dto - Data transfer object containing the keywords.
   * @returns A promise resolving to PageKeywordsResponseDto.
   */
  setPageKeywords(pageType: string, pageId: string, merchantId: string, dto: SetPageKeywordsRequestDto): Promise<PageKeywordsResponseDto>;

  /**
   * Retrieves keyword suggestions based on a topic and current keywords.
   * @param merchantId - Unique identifier of the merchant.
   * @param dto - Data transfer object containing the topic and optional current keywords.
   * @returns A promise resolving to KeywordSuggestionResponseDto.
   */
  getKeywordSuggestions(merchantId: string, dto: KeywordSuggestionRequestDto): Promise<KeywordSuggestionResponseDto>;

  /**
   * Retrieves schema markup for a specific page.
   * @param pageType - Type of the page.
   *   @param pageId - Unique identifier of the page.
   * @param merchantId - Unique identifier of the merchant.
   * @returns A promise resolving to SchemaMarkupResponseDto.
   */
  getSchemaMarkup(pageType: string, pageId: string, merchantId: string): Promise<SchemaMarkupResponseDto>;

  /**
   * Updates schema markup for a specific page.
   * @param pageType - Type of the page.
   * @param pageId - Unique identifier of the page.
   * @param merchantId - Unique identifier of the merchant.
   * @param dto - Data transfer object containing the schema JSON.
   * @returns A promise resolving to SchemaMarkupResponseDto.
   */
  updateSchemaMarkup(pageType: string, pageId: string, merchantId: string, dto: UpdateSchemaMarkupRequestDto): Promise<SchemaMarkupResponseDto>;

  /**
   * Retrieves meta tags for a specific page.
   * @param pageType - Type of the page.
   * @param pageId - Unique identifier of the page.
   * @param merchantId - Unique identifier of the merchant.
   * @returns A promise resolving to PageMetaTagsResponseDto.
   */
  getPageMetaTags(pageType: string, pageId: string, merchantId: string): Promise<PageMetaTagsResponseDto>;

  /**
   * Updates meta tags for a specific page.
   * @param pageType - Type of the page.
   * @param pageId - Unique identifier of the page.
   * @param merchantId - Unique identifier of the merchant.
   * @param dto - Data transfer object containing the meta tags.
   * @returns A promise resolving to PageMetaTagsResponseDto.
   */
  updatePageMetaTags(pageType: string, pageId: string, merchantId: string, dto: UpdatePageMetaTagsRequestDto): Promise<PageMetaTagsResponseDto>;

  /**
   * Retrieves ALT text for a specific image on a page.
   * @param pageType - Type of the page.
   * @param pageId - Unique identifier of the page.
   * @param imageId - Unique identifier of the image.
   * @param merchantId - Unique identifier of the merchant.
   * @returns A promise resolving to ImageAltTextResponseDto.
   */
  getImageAltText(pageType: string, pageId: string, imageId: string, merchantId: string): Promise<ImageAltTextResponseDto>;

  /**
   * Updates ALT text for a specific image on a page.
   * @param pageType - Type of the page.
   * @param pageId - Unique identifier of the page.
   * @param imageId - Unique identifier of the image.
   * @param merchantId - Unique identifier of the merchant.
   * @param dto - Data transfer object containing the ALT text.
   * @returns A promise resolving to ImageAltTextResponseDto.
   */
  updateImageAltText(pageType: string, pageId: string, imageId: string, merchantId: string, dto: UpdateImageAltTextRequestDto): Promise<ImageAltTextResponseDto>;

  /**
   * Retrieves the sitemap URL for the merchant.
   * @param merchantId - Unique identifier of the merchant.
   * @returns A promise resolving to SitemapUrlResponseDto.
   */
  getSitemapUrl(merchantId: string): Promise<SitemapUrlResponseDto>;

  /**
   * Retrieves the content of the robots.txt file for the merchant.
   * @param merchantId - Unique identifier of the merchant.
   * @returns A promise resolving to RobotsTxtResponseDto.
   */
  getRobotsTxt(merchantId: string): Promise<RobotsTxtResponseDto>;

  /**
   * Retrieves suggestions for the robots.txt file content.
   * @param merchantId - Unique identifier of the merchant.
   * @param dto - Data transfer object containing current content and desired directives.
   * @returns A promise resolving to RobotsTxtSuggestionResponseDto.
   */
  getRobotsTxtSuggestions(merchantId: string, dto: RobotsTxtSuggestionRequestDto): Promise<RobotsTxtSuggestionResponseDto>;

  /**
   * Retrieves internal links for a specific blog post.
   * @param blogPostId - Unique identifier of the blog post.
   * @param merchantId - Unique identifier of the merchant.
   * @returns A promise resolving to BlogInternalLinksResponseDto.
   */
  getBlogInternalLinks(blogPostId: string, merchantId: string): Promise<BlogInternalLinksResponseDto>;

  /**
   * Updates internal links for a specific blog post.
   * @param blogPostId - Unique identifier of the blog post.
   * @param merchantId - Unique identifier of the merchant.
   * @param dto - Data transfer object containing the internal links.
   * @returns A promise resolving to BlogInternalLinksResponseDto.
   */
  updateBlogInternalLinks(blogPostId: string, merchantId: string, dto: UpdateBlogInternalLinksRequestDto): Promise<BlogInternalLinksResponseDto>;

  /**
   * Retrieves internal link suggestions for a blog post based on content sample.
   * @param blogPostId - Unique identifier of the blog post.
   * @param merchantId - Unique identifier of the merchant.
   * @param dto - Data transfer object containing the content sample.
   * @returns A promise resolving to InternalLinkSuggestionResponseDto.
   */
  getInternalLinkSuggestionsForBlog(blogPostId: string, merchantId: string, dto: InternalLinkSuggestionRequestDto): Promise<InternalLinkSuggestionResponseDto>;
}