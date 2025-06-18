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
import { LandingPageService } from './landing-page.service';
import { CreateLandingPageReqDto } from './dto/create-landing-page.req.dto';
import { UpdateLandingPageReqDto } from './dto/update-landing-page.req.dto';
import { LandingPageResDto } from './dto/landing-page.res.dto';
import { UpdateLandingPageStatusReqDto } from './dto/update-landing-page-status.req.dto';
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

@ApiTags('Landing Pages')
@Controller('landing-pages')
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Create a new landing page' })
  @ApiBody({ type: CreateLandingPageReqDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The landing page has been successfully created.',
    type: LandingPageResDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict (e.g. slug already exists).' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createLandingPageDto: CreateLandingPageReqDto,
    @Req() req: Request,
  ): Promise<LandingPageResDto> {
    const { userId, merchantId } = req.user as { userId: string; merchantId: string };
    return this.landingPageService.create(createLandingPageDto, merchantId, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all landing pages for the merchant (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page.' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by.' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order (ASC or DESC).' })
  @ApiQuery({ name: 'language', required: false, enum: ContentLanguage, description: 'Filter by content language.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved landing pages.',
    type: PaginatedResponseDto<LandingPageResDto>,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
    @Query('language') language?: ContentLanguage,
    @Req() req?: Request,
  ): Promise<PaginatedResponseDto<LandingPageResDto>> {
    const { merchantId } = req.user as { merchantId: string };
    return this.landingPageService.findAll(paginationQueryDto, merchantId, language);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a landing page by its slug (public)' })
  @ApiParam({ name: 'slug', type: String, description: 'Landing page slug.' })
  @ApiQuery({ name: 'language', required: false, enum: ContentLanguage, description: 'Preferred language version.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the landing page.',
    type: LandingPageResDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Landing page not found.' })
  async findBySlugPublic(
    @Param('slug') slug: string,
    @Query('language') language?: ContentLanguage,
  ): Promise<LandingPageResDto> {
    return this.landingPageService.findPublicBySlug(slug, language);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get a landing page by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Landing page ID.' })
  @ApiQuery({ name: 'language', required: false, enum: ContentLanguage, description: 'Preferred language version.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the landing page.',
    type: LandingPageResDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Landing page not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async findOne(
    @Param('id') id: string,
    @Query('language') language?: ContentLanguage,
    @Req() req?: Request,
  ): Promise<LandingPageResDto> {
    const { merchantId } = req.user as { merchantId: string };
    return this.landingPageService.findOne(id, merchantId, language);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update a landing page' })
  @ApiParam({ name: 'id', type: String, description: 'Landing page ID to update.' })
  @ApiQuery({ name: 'language', required: false, enum: ContentLanguage, description: 'Language version to update.' })
  @ApiBody({ type: UpdateLandingPageReqDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The landing page has been successfully updated.',
    type: LandingPageResDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Landing page not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict (e.g. slug already exists for another page).' })
  async update(
    @Param('id') id: string,
    @Body() updateLandingPageDto: UpdateLandingPageReqDto,
    @Query('language') language?: ContentLanguage,
    @Req() req?: Request,
  ): Promise<LandingPageResDto> {
    const { merchantId } = req.user as { merchantId: string };
    return this.landingPageService.update(id, updateLandingPageDto, merchantId, language);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Delete a landing page' })
  @ApiParam({ name: 'id', type: String, description: 'Landing page ID to delete.' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The landing page has been successfully deleted.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Landing page not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const { merchantId } = req.user as { merchantId: string };
    return this.landingPageService.remove(id, merchantId);
  }

  @Post(':id/duplicate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Duplicate an existing landing page' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the landing page to duplicate.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The landing page has been successfully duplicated.',
    type: LandingPageResDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Original landing page not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @HttpCode(HttpStatus.CREATED)
  async duplicate(@Param('id') id: string, @Req() req: Request): Promise<LandingPageResDto> {
    const { userId, merchantId } = req.user as { userId: string; merchantId: string };
    return this.landingPageService.duplicate(id, merchantId, userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Change the status of a landing page' })
  @ApiParam({ name: 'id', type: String, description: 'Landing page ID.' })
  @ApiBody({ type: UpdateLandingPageStatusReqDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The landing page status has been successfully updated.',
    type: LandingPageResDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Landing page not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  async changeStatus(
    @Param('id') id: string,
    @Body() updateLandingPageStatusDto: UpdateLandingPageStatusReqDto,
    @Req() req: Request,
  ): Promise<LandingPageResDto> {
    const { merchantId } = req.user as { merchantId: string };
    return this.landingPageService.changeStatus(id, updateLandingPageStatusDto.status, merchantId);
  }
}
```