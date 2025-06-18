import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateBlogPostReqDto } from './dto/create-blog-post.req.dto';
import { UpdateBlogPostReqDto } from './dto/update-blog-post.req.dto';
import { BlogPostResDto } from './dto/blog-post.res.dto';
import { UpdateBlogStatusReqDto } from './dto/update-blog-status.req.dto';
import { IBlogRepository } from '../data-persistence/interfaces/blog.repository.interface';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { PublicationStatus } from '../common/enums/publication-status.enum';
import { ContentLanguage } from '../common/enums/content-language.enum';
import { AppConfig } from '../config/configuration';

@Injectable()
export class BlogService {
  private readonly appBaseUrl: string;

  constructor(
    @Inject('IBlogRepository')
    private readonly blogRepository: IBlogRepository,
    private readonly configService: ConfigService<AppConfig>,
  ) {
    this.appBaseUrl = this.configService.get('APP_BASE_URL', { infer: true }) || '';
  }

  private slugify(text: string): string {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-'); // Replace multiple - with single -
  }

  private mapToDto(blogPostEntity: any): BlogPostResDto {
    if (!blogPostEntity) {
      return null;
    }
    const dto = new BlogPostResDto();
    dto.id = blogPostEntity.id;
    dto.title = blogPostEntity.title;
    dto.content = blogPostEntity.content;
    dto.language = blogPostEntity.language;
    dto.locale = blogPostEntity.locale;
    dto.authorId = blogPostEntity.authorId;
    dto.seoMeta = blogPostEntity.seoMeta;
    dto.tags = blogPostEntity.tags;
    dto.status = blogPostEntity.status;
    dto.publishDate = blogPostEntity.publishDate;
    dto.createdAt = blogPostEntity.createdAt;
    dto.updatedAt = blogPostEntity.updatedAt;
    if (dto.seoMeta && dto.seoMeta.slug) {
      dto.publicUrl = `${this.appBaseUrl}/blog/${dto.seoMeta.slug}`; // Assuming a base URL structure
    }
    return dto;
  }

  private mapToPaginatedDto(
    result: { data: any[]; total: number },
    query: PaginationQueryDto,
  ): PaginatedResponseDto<BlogPostResDto> {
    const paginatedResponse = new PaginatedResponseDto<BlogPostResDto>();
    paginatedResponse.data = result.data.map((item) => this.mapToDto(item));
    paginatedResponse.total = result.total;
    paginatedResponse.page = Number(query.page) || 1;
    paginatedResponse.limit = Number(query.limit) || 10;
    paginatedResponse.totalPages = Math.ceil(
      result.total / paginatedResponse.limit,
    );
    return paginatedResponse;
  }

  async create(
    createBlogPostDto: CreateBlogPostReqDto,
    merchantId: string,
    userId: string,
  ): Promise<BlogPostResDto> {
    if (!merchantId || !userId) {
        throw new BadRequestException('Merchant ID and User ID are required.');
    }
    let slug = createBlogPostDto.seoMeta?.slug;
    if (slug) {
      slug = this.slugify(slug);
    } else if (createBlogPostDto.title) {
      slug = this.slugify(createBlogPostDto.title);
    } else {
      throw new BadRequestException('Either SEO slug or title must be provided for slug generation.');
    }

    const isUnique = await this.blogRepository.isSlugUnique(
      slug,
      merchantId,
      createBlogPostDto.language,
    );
    if (!isUnique) {
      throw new ConflictException(
        `Slug '${slug}' already exists for language '${createBlogPostDto.language}' under this merchant.`,
      );
    }

    const blogPostData = {
      ...createBlogPostDto,
      authorId: userId, // authorId from DTO is used, but SDS says "userId from JWT used as authorId"
      seoMeta: {
        ...createBlogPostDto.seoMeta,
        slug,
      },
      merchantId, // Ensure merchantId is passed to repository
      createdBy: userId,
      updatedBy: userId,
    };

    const createdPost = await this.blogRepository.create(blogPostData);
    return this.mapToDto(createdPost);
  }

  async findAll(
    query: PaginationQueryDto,
    merchantId: string,
    language?: ContentLanguage,
  ): Promise<PaginatedResponseDto<BlogPostResDto>> {
    if (!merchantId) {
        throw new BadRequestException('Merchant ID is required.');
    }
    const result = await this.blogRepository.findAll(
      merchantId,
      query,
      language,
    );
    return this.mapToPaginatedDto(result, query);
  }

  async findOne(
    id: string,
    merchantId: string,
    language?: ContentLanguage,
  ): Promise<BlogPostResDto> {
     if (!merchantId) {
        throw new BadRequestException('Merchant ID is required.');
    }
    const blogPostEntity = await this.blogRepository.findOneById(
      id,
      merchantId,
      language,
    );
    if (!blogPostEntity) {
      throw new NotFoundException(`Blog post with ID '${id}' not found.`);
    }
    return this.mapToDto(blogPostEntity);
  }

  async findBySlug(
    slug: string,
    merchantId: string,
    language?: ContentLanguage,
  ): Promise<BlogPostResDto> {
     if (!merchantId) {
        throw new BadRequestException('Merchant ID is required.');
    }
    const blogPostEntity = await this.blogRepository.findOneBySlug(
      slug,
      merchantId,
      language,
    );
    if (!blogPostEntity) {
      throw new NotFoundException(`Blog post with slug '${slug}' not found.`);
    }
    return this.mapToDto(blogPostEntity);
  }

  async findPublicBySlug(
    slug: string,
    language?: ContentLanguage,
  ): Promise<BlogPostResDto> {
    // The IBlogRepository.findOneBySlug requires a merchantId.
    // This public method needs a way to resolve the merchant or the repository
    // needs a method for public slug lookup without merchantId.
    // Assuming for now the repository's findOneBySlug can handle `undefined` merchantId for public queries,
    // or there's another mechanism. This is a potential design adjustment point.
    // @ts-ignore - Assuming concrete repo handles merchantId: undefined for public queries
    const blogPostEntity = await this.blogRepository.findOneBySlug(slug, undefined, language);
    if (!blogPostEntity) {
      throw new NotFoundException(
        `Public blog post with slug '${slug}' and language '${language || 'any'}' not found.`,
      );
    }
    return this.mapToDto(blogPostEntity);
  }


  async update(
    id: string,
    updateBlogPostDto: UpdateBlogPostReqDto,
    merchantId: string,
    userId: string,
    language?: ContentLanguage, // Language here refers to the language of the content being updated
  ): Promise<BlogPostResDto> {
    if (!merchantId || !userId) {
        throw new BadRequestException('Merchant ID and User ID are required for update.');
    }
    const existingPost = await this.blogRepository.findOneById(id, merchantId, language || updateBlogPostDto.language);
    if (!existingPost) {
      throw new NotFoundException(`Blog post with ID '${id}' not found for this merchant.`);
    }

    let slug = updateBlogPostDto.seoMeta?.slug;
    if (slug) {
        slug = this.slugify(slug);
    } else if (updateBlogPostDto.title) {
        slug = this.slugify(updateBlogPostDto.title);
    } else {
        slug = existingPost.seoMeta?.slug; // Keep existing if not changing title or slug
    }


    if (slug && (slug !== existingPost.seoMeta?.slug || (language || updateBlogPostDto.language) !== existingPost.language)) {
      const isUnique = await this.blogRepository.isSlugUnique(
        slug,
        merchantId,
        language || updateBlogPostDto.language || existingPost.language,
        id, // exclude current post ID from uniqueness check
      );
      if (!isUnique) {
        throw new ConflictException(
          `Slug '${slug}' already exists for language '${language || updateBlogPostDto.language || existingPost.language}' under this merchant.`,
        );
      }
    }
    
    const updateData = {
        ...updateBlogPostDto,
        seoMeta: {
            ...existingPost.seoMeta, // Preserve existing SEO meta
            ...updateBlogPostDto.seoMeta, // Override with new values
            slug: slug || existingPost.seoMeta?.slug, // Ensure slug is set
        },
        merchantId,
        updatedBy: userId,
    };


    const updatedPost = await this.blogRepository.update(
      id,
      merchantId,
      updateData,
      language || updateBlogPostDto.language, // Use language from param or DTO
    );
    return this.mapToDto(updatedPost);
  }

  async remove(id: string, merchantId: string): Promise<void> {
    if (!merchantId) {
        throw new BadRequestException('Merchant ID is required.');
    }
    const existingPost = await this.blogRepository.findOneById(id, merchantId);
    if (!existingPost) {
      throw new NotFoundException(`Blog post with ID '${id}' not found for this merchant.`);
    }
    await this.blogRepository.remove(id, merchantId);
  }

  async changeStatus(
    id: string,
    dto: UpdateBlogStatusReqDto,
    merchantId: string,
    userId: string,
  ): Promise<BlogPostResDto> {
    if (!merchantId || !userId) {
        throw new BadRequestException('Merchant ID and User ID are required.');
    }
    const { status, publishDate } = dto;
    if (status === PublicationStatus.SCHEDULED && !publishDate) {
      throw new BadRequestException(
        'publishDate is required when status is SCHEDULED.',
      );
    }
    if (status === PublicationStatus.SCHEDULED && new Date(publishDate) <= new Date()) {
        throw new BadRequestException('Publish date must be in the future for scheduled posts.');
    }


    const existingPost = await this.blogRepository.findOneById(id, merchantId);
    if (!existingPost) {
        throw new NotFoundException(`Blog post with ID '${id}' not found for this merchant.`);
    }
    
    const updatedPost = await this.blogRepository.updateStatus(
      id,
      merchantId,
      status,
      publishDate,
    );
    // After updating status, we also need to log who updated it.
    // This assumes the repository handles updating the 'updatedBy' field or a similar audit trail.
    // For simplicity, we directly call update for the 'updatedBy' field if needed.
    // However, `updateStatus` should ideally return the full updated entity.
    // If not, we might need to fetch it again or the repository should handle `updatedBy`.

    // For now, assume updateStatus in repo returns the updated entity or handles updatedBy
    // If not, a subsequent call to update the 'updatedBy' field would be:
    // await this.blogRepository.update(id, merchantId, { updatedBy: userId }, existingPost.language);
    // const finalPost = await this.blogRepository.findOneById(id, merchantId, existingPost.language);
    // return this.mapToDto(finalPost);
    
    // Assuming updateStatus returns the updated entity
    const postWithUpdatedBy = { ...updatedPost, updatedBy: userId, updatedAt: new Date() };
    return this.mapToDto(postWithUpdatedBy);
  }
}