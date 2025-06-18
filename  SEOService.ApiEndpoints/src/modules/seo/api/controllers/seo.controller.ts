import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Inject,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SEO_SERVICE_TOKEN } from '../constants/seo.constants';
import { ISeoService } from '../interfaces/seo-service.interface';

// Request DTOs
import { SetPageKeywordsRequestDto } from '../dtos/request/set-page-keywords-request.dto';
import { KeywordSuggestionRequestDto } from '../dtos/request/keyword-suggestion-request.dto';
import { UpdateSchemaMarkupRequestDto } from '../dtos/request/update-schema-markup-request.dto';
import { UpdatePageMetaTagsRequestDto } from '../dtos/request/update-page-meta-tags-request.dto';
import { UpdateImageAltTextRequestDto } from '../dtos/request/update-image-alt-text-request.dto';
import { RobotsTxtSuggestionRequestDto } from '../dtos/request/robots-txt-suggestion-request.dto';
import { UpdateBlogInternalLinksRequestDto } from '../dtos/request/update-blog-internal-links-request.dto';
import { InternalLinkSuggestionRequestDto } from '../dtos/request/internal-link-suggestion-request.dto';

// Response DTOs
import { PageKeywordsResponseDto } from '../dtos/response/page-keywords-response.dto';
import { KeywordSuggestionResponseDto } from '../dtos/response/keyword-suggestion-response.dto';
import { SchemaMarkupResponseDto } from '../dtos/response/schema-markup-response.dto';
import { PageMetaTagsResponseDto } from '../dtos/response/page-meta-tags-response.dto';
import { ImageAltTextResponseDto } from '../dtos/response/image-alt-text-response.dto';
import { SitemapUrlResponseDto } from '../dtos/response/sitemap-url-response.dto';
import { RobotsTxtResponseDto } from '../dtos/response/robots-txt-response.dto';
import { RobotsTxtSuggestionResponseDto } from '../dtos/response/robots-txt-suggestion-response.dto';
import { BlogInternalLinksResponseDto } from '../dtos/response/blog-internal-links-response.dto';
import { InternalLinkSuggestionResponseDto } from '../dtos/response/internal-link-suggestion-response.dto';

// Assume JwtAuthGuard is provided globally or from a shared module
// import { JwtAuthGuard } from '../../../../auth/jwt-auth.guard'; // Example path, adjust as per actual project structure

@ApiTags('SEO Management')
@ApiBearerAuth() // Indicates that Bearer token authentication is used for these endpoints
@Controller('api/v1/seo')
// @UseGuards(JwtAuthGuard) // Apply JWT guard to all routes in this controller if not applied globally
export class SeoController {
  constructor(
    @Inject(SEO_SERVICE_TOKEN) private readonly seoService: ISeoService,
  ) {}

  @Post('keywords/:pageType/:pageId')
  @HttpCode(HttpStatus.OK) // Typically POST returns 201 Created, but here it updates and returns data, so 200 is also fine.
  @ApiOperation({ summary: 'Set or update keywords for a specific page' })
  @ApiParam({ name: 'pageType', description: "Type of page (e.g., 'product', 'blog', 'collection')" })
  @ApiParam({ name: 'pageId', description: 'Unique identifier of the page' })
  @ApiBody({ type: SetPageKeywordsRequestDto })
  @ApiResponse({ status: 200, description: 'Successfully set/updated page keywords.', type: PageKeywordsResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request payload.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  async setPageKeywords(
    @Param('pageType') pageType: string,
    @Param('pageId') pageId: string,
    @Body() dto: SetPageKeywordsRequestDto,
    @Request() req: any,
  ): Promise<PageKeywordsResponseDto> {
    const merchantId = req.user.merchantId; // Assumed to be populated by auth guard
    return this.seoService.setPageKeywords(pageType, pageId, merchantId, dto);
  }

  @Get('keywords/:pageType/:pageId')
  @ApiOperation({ summary: 'Get keywords for a specific page' })
  @ApiParam({ name: 'pageType', description: "Type of page (e.g., 'product', 'blog', 'collection')" })
  @ApiParam({ name: 'pageId', description: 'Unique identifier of the page' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved page keywords.', type: PageKeywordsResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  async getPageKeywords(
    @Param('pageType') pageType: string,
    @Param('pageId') pageId: string,
    @Request() req: any,
  ): Promise<PageKeywordsResponseDto> {
    const merchantId = req.user.merchantId;
    return this.seoService.getPageKeywords(pageType, pageId, merchantId);
  }

  @Post('keywords/suggestions')
  @ApiOperation({ summary: 'Get keyword suggestions based on a topic' })
  @ApiBody({ type: KeywordSuggestionRequestDto })
  @ApiResponse({ status: 200, description: 'Successfully retrieved keyword suggestions.', type: KeywordSuggestionResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request payload.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getKeywordSuggestions(
    @Body() dto: KeywordSuggestionRequestDto,
    @Request() req: any,
  ): Promise<KeywordSuggestionResponseDto> {
    const merchantId = req.user.merchantId;
    return this.seoService.getKeywordSuggestions(merchantId, dto);
  }

  @Put('schema/:pageType/:pageId')
  @ApiOperation({ summary: 'Update schema markup for a specific page' })
  @ApiParam({ name: 'pageType', description: "Type of page (e.g., 'product', 'blog', 'article')" })
  @ApiParam({ name: 'pageId', description: 'Unique identifier of the page' })
  @ApiBody({ type: UpdateSchemaMarkupRequestDto })
  @ApiResponse({ status: 200, description: 'Successfully updated schema markup.', type: SchemaMarkupResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request payload.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  async updateSchemaMarkup(
    @Param('pageType') pageType: string,
    @Param('pageId') pageId: string,
    @Body() dto: UpdateSchemaMarkupRequestDto,
    @Request() req: any,
  ): Promise<SchemaMarkupResponseDto> {
    const merchantId = req.user.merchantId;
    return this.seoService.updateSchemaMarkup(pageType, pageId, merchantId, dto);
  }

  @Get('schema/:pageType/:pageId')
  @ApiOperation({ summary: 'Get schema markup for a specific page' })
  @ApiParam({ name: 'pageType', description: "Type of page (e.g., 'product', 'blog', 'article')" })
  @ApiParam({ name: 'pageId', description: 'Unique identifier of the page' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved schema markup.', type: SchemaMarkupResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Page or schema markup not found.' })
  async getSchemaMarkup(
    @Param('pageType') pageType: string,
    @Param('pageId') pageId: string,
    @Request() req: any,
  ): Promise<SchemaMarkupResponseDto> {
    const merchantId = req.user.merchantId;
    return this.seoService.getSchemaMarkup(pageType, pageId, merchantId);
  }

  @Put('meta-tags/:pageType/:pageId')
  @ApiOperation({ summary: 'Update meta tags for a specific page' })
  @ApiParam({ name: 'pageType', description: "Type of page (e.g., 'product', 'blog', 'collection')" })
  @ApiParam({ name: 'pageId', description: 'Unique identifier of the page' })
  @ApiBody({ type: UpdatePageMetaTagsRequestDto })
  @ApiResponse({ status: 200, description: 'Successfully updated page meta tags.', type: PageMetaTagsResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request payload.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Page not found.' })
  async updatePageMetaTags(
    @Param('pageType') pageType: string,
    @Param('pageId') pageId: string,
    @Body() dto: UpdatePageMetaTagsRequestDto,
    @Request() req: any,
  ): Promise<PageMetaTagsResponseDto> {
    const merchantId = req.user.merchantId;
    return this.seoService.updatePageMetaTags(pageType, pageId, merchantId, dto);
  }

  @Get('meta-tags/:pageType/:pageId')
  @ApiOperation({ summary: 'Get meta tags for a specific page' })
  @ApiParam({ name: 'pageType', description: "Type of page (e.g., 'product', 'blog', 'collection')" })
  @ApiParam({ name: 'pageId', description: 'Unique identifier of the page' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved page meta tags.', type: PageMetaTagsResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Page or meta tags not found.' })
  async getPageMetaTags(
    @Param('pageType') pageType: string,
    @Param('pageId') pageId: string,
    @Request() req: any,
  ): Promise<PageMetaTagsResponseDto> {
    const merchantId = req.user.merchantId;
    return this.seoService.getPageMetaTags(pageType, pageId, merchantId);
  }

  @Put('alt-text/:pageType/:pageId/:imageId')
  @ApiOperation({ summary: 'Update ALT text for a specific image on a page' })
  @ApiParam({ name: 'pageType', description: "Type of page context for the image (e.g., 'product', 'blog')" })
  @ApiParam({ name: 'pageId', description: 'Unique identifier of the page containing the image' })
  @ApiParam({ name: 'imageId', description: 'Unique identifier of the image' })
  @ApiBody({ type: UpdateImageAltTextRequestDto })
  @ApiResponse({ status: 200, description: 'Successfully updated image ALT text.', type: ImageAltTextResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request payload.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Page or image not found.' })
  async updateImageAltText(
    @Param('pageType') pageType: string,
    @Param('pageId') pageId: string,
    @Param('imageId') imageId: string,
    @Body() dto: UpdateImageAltTextRequestDto,
    @Request() req: any,
  ): Promise<ImageAltTextResponseDto> {
    const merchantId = req.user.merchantId;
    return this.seoService.updateImageAltText(pageType, pageId, imageId, merchantId, dto);
  }

  @Get('alt-text/:pageType/:pageId/:imageId')
  @ApiOperation({ summary: 'Get ALT text for a specific image on a page' })
  @ApiParam({ name: 'pageType', description: "Type of page context for the image (e.g., 'product', 'blog')" })
  @ApiParam({ name: 'pageId', description: 'Unique identifier of the page containing the image' })
  @ApiParam({ name: 'imageId', description: 'Unique identifier of the image' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved image ALT text.', type: ImageAltTextResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Page, image, or ALT text not found.' })
  async getImageAltText(
    @Param('pageType') pageType: string,
    @Param('pageId') pageId: string,
    @Param('imageId') imageId: string,
    @Request() req: any,
  ): Promise<ImageAltTextResponseDto> {
    const merchantId = req.user.merchantId;
    return this.seoService.getImageAltText(pageType, pageId, imageId, merchantId);
  }

  @Get('sitemap-url')
  @ApiOperation({ summary: "Get the merchant's sitemap URL" })
  @ApiResponse({ status: 200, description: 'Successfully retrieved sitemap URL.', type: SitemapUrlResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Sitemap URL not found for merchant.' })
  async getSitemapUrl(@Request() req: any): Promise<SitemapUrlResponseDto> {
    const merchantId = req.user.merchantId;
    return this.seoService.getSitemapUrl(merchantId);
  }

  @Get('robots-txt')
  @ApiOperation({ summary: "Get the merchant's current robots.txt content" })
  @ApiResponse({ status: 200, description: 'Successfully retrieved robots.txt content.', type: RobotsTxtResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Robots.txt content not found for merchant.' })
  async getRobotsTxt(@Request() req: any): Promise<RobotsTxtResponseDto> {
    const merchantId = req.user.merchantId;
    return this.seoService.getRobotsTxt(merchantId);
  }

  @Post('robots-txt/suggestions')
  @ApiOperation({ summary: 'Get suggestions for robots.txt content' })
  @ApiBody({ type: RobotsTxtSuggestionRequestDto })
  @ApiResponse({ status: 200, description: 'Successfully retrieved robots.txt suggestions.', type: RobotsTxtSuggestionResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request payload.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getRobotsTxtSuggestions(
    @Body() dto: RobotsTxtSuggestionRequestDto,
    @Request() req: any,
  ): Promise<RobotsTxtSuggestionResponseDto> {
    const merchantId = req.user.merchantId;
    return this.seoService.getRobotsTxtSuggestions(merchantId, dto);
  }

  @Put('internal-links/blog/:blogPostId')
  @ApiOperation({ summary: 'Update internal links for a specific blog post' })
  @ApiParam({ name: 'blogPostId', description: 'Unique identifier of the blog post' })
  @ApiBody({ type: UpdateBlogInternalLinksRequestDto })
  @ApiResponse({ status: 200, description: 'Successfully updated blog internal links.', type: BlogInternalLinksResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request payload.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async updateBlogInternalLinks(
    @Param('blogPostId') blogPostId: string,
    @Body() dto: UpdateBlogInternalLinksRequestDto,
    @Request() req: any,
  ): Promise<BlogInternalLinksResponseDto> {
    const merchantId = req.user.merchantId;
    return this.seoService.updateBlogInternalLinks(blogPostId, merchantId, dto);
  }

  @Get('internal-links/blog/:blogPostId')
  @ApiOperation({ summary: 'Get internal links for a specific blog post' })
  @ApiParam({ name: 'blogPostId', description: 'Unique identifier of the blog post' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved blog internal links.', type: BlogInternalLinksResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Blog post or internal links not found.' })
  async getBlogInternalLinks(
    @Param('blogPostId') blogPostId: string,
    @Request() req: any,
  ): Promise<BlogInternalLinksResponseDto> {
    const merchantId = req.user.merchantId;
    return this.seoService.getBlogInternalLinks(blogPostId, merchantId);
  }

  @Post('internal-links/suggestions/blog/:blogPostId')
  @ApiOperation({ summary: 'Get internal link suggestions for a specific blog post' })
  @ApiParam({ name: 'blogPostId', description: 'Unique identifier of the blog post for context' })
  @ApiBody({ type: InternalLinkSuggestionRequestDto })
  @ApiResponse({ status: 200, description: 'Successfully retrieved internal link suggestions.', type: InternalLinkSuggestionResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request payload.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  async getInternalLinkSuggestionsForBlog(
    @Param('blogPostId') blogPostId: string,
    @Body() dto: InternalLinkSuggestionRequestDto,
    @Request() req: any,
  ): Promise<InternalLinkSuggestionResponseDto> {
    const merchantId = req.user.merchantId;
    return this.seoService.getInternalLinkSuggestionsForBlog(blogPostId, merchantId, dto);
  }
}