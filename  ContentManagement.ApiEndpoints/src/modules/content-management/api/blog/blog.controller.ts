```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogPostReqDto } from './dto/create-blog-post.req.dto';
import { UpdateBlogPostReqDto } from './dto/update-blog-post.req.dto';
import { BlogPostResDto } from './dto/blog-post.res.dto';
import { UpdateBlogStatusReqDto } from './dto/update-blog-status.req.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { ContentLanguage } from '../common/enums/content-language.enum';
import { Request } from 'express';

@ApiTags('Blog Posts')
@Controller('blog/posts')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiBody({ type: CreateBlogPostReqDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The blog post has been successfully created.',
    type: BlogPostResDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict (e.g. slug already exists).' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBlogPostDto: CreateBlogPostReqDto,
    @Req() req: Request,
  ): Promise<BlogPostResDto> {
    const { userId, merchantId } = req.user as { userId: string; merchantId: string };
    // The DTO contains authorId, which client should set.
    // Service create method also takes userId (creator) and merchantId.
    return this.blogService.create(createBlogPostDto, merchantId, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all blog posts for the merchant (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page.' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by.' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order (ASC or DESC).' })
  @ApiQuery({ name: 'language', required: false, enum: ContentLanguage, description: 'Filter by content language.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved blog posts.',
    type: PaginatedResponseDto<BlogPostResDto>,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
    @Query('language') language?: ContentLanguage,
    @Req() req?: Request,
  ): Promise<PaginatedResponseDto<BlogPostResDto>> {
    const { merchantId } = req.user as { merchantId: string };
    return this.blogService.findAll(paginationQueryDto, merchantId, language);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a blog post by its slug (public)' })
  @ApiParam({ name: 'slug', type: String, description: 'Blog post slug.' })
  @ApiQuery({ name: 'language', required: false, enum: ContentLanguage, description: 'Preferred language version.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the blog post.',
    type: BlogPostResDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Blog post not found.' })
  async findBySlugPublic(
    @Param('slug') slug: string,
    @Query('language') language?: ContentLanguage,
  ): Promise<BlogPostResDto> {
    return this.blogService.findPublicBySlug(slug, language);
  }
  
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Blog post ID.' })
  @ApiQuery({ name: 'language', required: false, enum: ContentLanguage, description: 'Preferred language version.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the blog post.',
    type: BlogPostResDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Blog post not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findOne(
    @Param('id') id: string,
    @Query('language') language?: ContentLanguage,
    @Req() req?: Request,
  ): Promise<BlogPostResDto> {
    const { merchantId } = req.user as { merchantId: string };
    return this.blogService.findOne(id, merchantId, language);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiParam({ name: 'id', type: String, description: 'Blog post ID to update.' })
  @ApiQuery({ name: 'language', required: false, enum: ContentLanguage, description: 'Language version to update.' })
  @ApiBody({ type: UpdateBlogPostReqDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The blog post has been successfully updated.',
    type: BlogPostResDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Blog post not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict (e.g. slug already exists for another post).' })
  async update(
    @Param('id') id: string,
    @Body() updateBlogPostDto: UpdateBlogPostReqDto,
    @Query('language') language?: ContentLanguage,
    @Req() req?: Request,
  ): Promise<BlogPostResDto> {
    const { merchantId } = req.user as { merchantId: string };
    return this.blogService.update(id, updateBlogPostDto, merchantId, language);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiParam({ name: 'id', type: String, description: 'Blog post ID to delete.' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The blog post has been successfully deleted.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Blog post not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const { merchantId } = req.user as { merchantId: string };
    return this.blogService.remove(id, merchantId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Change the status of a blog post' })
  @ApiParam({ name: 'id', type: String, description: 'Blog post ID.' })
  @ApiBody({ type: UpdateBlogStatusReqDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The blog post status has been successfully updated.',
    type: BlogPostResDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Blog post not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async changeStatus(
    @Param('id') id: string,
    @Body() updateBlogStatusDto: UpdateBlogStatusReqDto,
    @Req() req: Request,
  ): Promise<BlogPostResDto> {
    const { merchantId } = req.user as { merchantId: string };
    return this.blogService.changeStatus(
      id,
      updateBlogStatusDto.status,
      merchantId,
      updateBlogStatusDto.publishDate,
    );
  }
}
```