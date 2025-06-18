# Software Design Specification: ContentManagement.ApiEndpoints

## 1. Introduction

### 1.1. Purpose
This document provides the detailed software design specification for the `ContentManagement.ApiEndpoints` repository. This repository is responsible for providing RESTful API endpoints for managing content within the Ad Manager Platform, specifically interactive landing pages and blog posts. It supports operations such as creation, editing, publishing, status management, localization, and SEO optimization for this content. The content served through these APIs is intended for consumption by frontend applications, including those employing Server-Side Rendering (SSR) or Static Site Generation (SSG) techniques.

### 1.2. Scope
The scope of this SDS covers the design of the API endpoints, data transfer objects (DTOs), controllers, and services within the `ContentManagement.ApiEndpoints` repository. It includes:
*   API endpoint definitions for blog posts and landing pages.
*   Request and response DTOs for all operations.
*   Service layer logic for handling business rules related to content management.
*   Integration points for authentication, localization, and SEO.
*   Adherence to specified requirements, including REQ-6-001, REQ-6-002, REQ-6-003, REQ-6-005, REQ-6-006, REQ-6-007, REQ-6-008, REQ-6-010, REQ-6-012, and REQ-7-007.

This document does not cover:
*   The underlying data persistence implementation (database schemas, ORM/ODM details). Services will interact with an abstracted data access layer.
*   Frontend application implementation (SPA, SSR/SSG).
*   Deployment infrastructure details beyond technology stack mentions.

### 1.3. Definitions, Acronyms, and Abbreviations
*   **API**: Application Programming Interface
*   **REST**: Representational State Transfer
*   **JSON**: JavaScript Object Notation
*   **JWT**: JSON Web Token
*   **DTO**: Data Transfer Object
*   **SSR**: Server-Side Rendering
*   **SSG**: Static Site Generation
*   **CRUD**: Create, Read, Update, Delete
*   **SEO**: Search Engine Optimization
*   **i18n**: Internationalization
*   **CTA**: Call to Action
*   **SDS**: Software Design Specification
*   **NPM**: Node Package Manager
*   **HTTP**: Hypertext Transfer Protocol
*   **WCAG**: Web Content Accessibility Guidelines
*   **UK**: Unique Key
*   **FK**: Foreign Key
*   **PK**: Primary Key

### 1.4. References
*   Project Requirements Document (specifically sections REQ-6-xxx and REQ-7-xxx as mapped)
*   System Architecture Document
*   `ContentManagement.ApiEndpoints` Repository Definition
*   NestJS Documentation (nestjs.com)
*   OpenAPI Specification (OAS)

### 1.5. Overview
The `ContentManagement.ApiEndpoints` repository exposes a set of NestJS-based RESTful APIs. It is structured into modules for Blogs and Landing Pages, each with its own controllers, services, and DTOs. Common utilities like enums, shared DTOs, and authentication guards are also included. The API is designed to be consumed by the API Gateway Layer and subsequently by various frontend applications.

## 2. System Architecture

### 2.1. Architectural Style
The `ContentManagement.ApiEndpoints` repository is a component within a larger **Microservices** architecture. It functions as a dedicated service responsible for content management functionalities. It interacts with other parts of the system via the API Gateway and potentially through an internal messaging layer or direct service calls for data persistence (abstracted).

### 2.2. High-Level Component Diagram (Conceptual)

mermaid
graph TD
    APIGateway[API Gateway Layer] -->|Requests V1| ContentApi(ContentManagement.ApiEndpoints);

    subgraph ContentManagement.ApiEndpoints
        direction LR
        ContentMgmtModule[ContentManagementApiModule] --> BlogMod[BlogModule];
        ContentMgmtModule --> LandingPageMod[LandingPageModule];

        BlogMod --> BlogCtrl[BlogController];
        BlogCtrl --> BlogSvc[BlogService];

        LandingPageMod --> LandingPageCtrl[LandingPageController];
        LandingPageCtrl --> LandingPageSvc[LandingPageService];

        BlogSvc --> DataPersistenceAbstracted[(Data Persistence Layer)];
        LandingPageSvc --> DataPersistenceAbstracted;
    end

    ContentApi -->|Responses| APIGateway;
    FrontendApps[Frontend Applications Layer] --> APIGateway;


### 2.3. Technology Stack
*   **Language**: TypeScript 5.4.5
*   **Framework**: NestJS 10.3.9
*   **Runtime**: Node.js 20.15.0 (LTS)
*   **API Style**: RESTful
*   **Data Format**: JSON
*   **Authentication**: JWT
*   **API Documentation**: OpenAPI 3.1.0 (via `@nestjs/swagger`)
*   **Key Libraries**:
    *   `class-validator`: For DTO validation.
    *   `class-transformer`: For transforming plain objects to class instances and vice-versa.
    *   `@nestjs/swagger`: For API documentation generation.
    *   `@nestjs/passport`, `passport-jwt`: For JWT authentication.
    *   `reflect-metadata`
    *   `rxjs`

## 3. API Design

### 3.1. General Principles

#### 3.1.1. RESTful Design
The API adheres to REST principles, utilizing standard HTTP methods for operations:
*   `GET`: Retrieve resources.
*   `POST`: Create new resources.
*   `PATCH` / `PUT`: Update existing resources (PATCH for partial updates, PUT for full replacement if semantically appropriate).
*   `DELETE`: Remove resources.

Resource URLs will be noun-based and hierarchical (e.g., `/api/v1/content/blog/posts`, `/api/v1/content/landing-pages`).

#### 3.1.2. Idempotency
`GET`, `PUT`, and `DELETE` operations will be idempotent. `POST` operations are typically not idempotent. `PATCH` operations should be designed to be idempotent where possible.

#### 3.1.3. Statelessness
All API requests will be stateless. Each request from a client to the server must contain all the information needed to understand the request, and cannot take advantage of any stored context on the server. Session state relies on JWTs passed with each request.

#### 3.1.4. Data Formats (JSON)
Request and response bodies will primarily use `application/json` content type.

#### 3.1.5. Versioning
API versioning will be implemented through the URL path. The initial version will be `v1`.
Example: `https://<api-gateway-domain>/api/v1/content/...`

### 3.2. Authentication and Authorization

#### 3.2.1. Authentication (JWT)
Endpoints requiring authentication will be protected by the `JwtAuthGuard`. Clients must include a valid JWT in the `Authorization` header as a Bearer token. The JWT will contain user identity information (e.g., `userId`, `merchantId`, roles).

#### 3.2.2. Authorization (Role-Based)
While specific role definitions and enforcement logic might reside in a dedicated IAM service or the core platform, this API will respect authorization rules based on the user's role extracted from the JWT. For example, only users with appropriate permissions (e.g., "MerchantAdmin", "CampaignManager") can create or modify content. This is implicitly handled by the `JwtAuthGuard` and the calling service context.

### 3.3. Error Handling

#### 3.3.1. HTTP Status Codes
Standard HTTP status codes will be used to indicate the outcome of API requests:
*   `200 OK`: Successful GET, PUT, PATCH.
*   `201 Created`: Successful POST.
*   `204 No Content`: Successful DELETE.
*   `400 Bad Request`: Client-side error (e.g., invalid DTO, missing parameters).
*   `401 Unauthorized`: Authentication failure.
*   `403 Forbidden`: Authorization failure (authenticated user lacks permissions).
*   `404 Not Found`: Resource not found.
*   `409 Conflict`: Resource creation conflict (e.g., duplicate slug).
*   `422 Unprocessable Entity`: Semantically incorrect request (e.g., validation error not caught by DTO validation).
*   `500 Internal Server Error`: Unexpected server-side error.

#### 3.3.2. Error Response Format
Error responses will follow a consistent JSON format:
json
{
  "statusCode": number, // HTTP status code
  "message": string | string[], // Human-readable error message(s)
  "error": string, // Short error description (e.g., "Bad Request")
  "timestamp": "string (ISO 8601 date-time)",
  "path": "string (request path)"
}

For validation errors (400 Bad Request from `class-validator`), NestJS's default behavior provides an array of messages.

### 3.4. Pagination and Sorting

#### 3.4.1. `PaginationQueryDto` (`common/dto/pagination-query.dto.ts`)
For list endpoints, pagination and sorting will be supported via query parameters:
*   `page` (number, optional, default: 1): The page number to retrieve.
*   `limit` (number, optional, default: 10): The number of items per page.
*   `sortBy` (string, optional): The field to sort by.
*   `sortOrder` ('ASC' | 'DESC', optional, default: 'ASC'): The sort order.

#### 3.4.2. `PaginatedResponseDto<T>` (`common/dto/paginated-response.dto.ts`)
Responses for paginated lists will use a standardized format:
json
{
  "data": T[], // Array of resource items
  "total": number, // Total number of items available
  "page": number, // Current page number
  "limit": number, // Items per page
  "totalPages": number // Total number of pages
}


### 3.5. Localization (i18n)
Requirement: REQ-6-012

#### 3.5.1. Language Parameter
Content creation and updates will accept a `language` parameter (e.g., `en`, `ar-SA`) to specify the language of the content being submitted.
When retrieving content, a `language` query parameter can be used to request a specific language version. If not provided, a default language (e.g., `en`) or the merchant's primary language might be assumed by the service.

#### 3.5.2. Locale Parameter
A `locale` parameter (e.g., `en-US`, `ar-SA`) might be used in conjunction with language for more specific regional variations if needed, though `language` (e.g. `ar-SA`) is the primary field for REQ-6-012. DTOs include an optional `locale` field.

## 4. Common Data Structures and Enums

### 4.1. Enums

#### 4.1.1. `PublicationStatus` (`common/enums/publication-status.enum.ts`)
Requirement: REQ-6-005, REQ-6-010
*   `DRAFT`: Content is a draft, not publicly visible.
*   `PUBLISHED`: Content is live and publicly visible.
*   `SCHEDULED`: Content is scheduled for future publication.
*   `UNPUBLISHED`: Content was previously published but is now hidden.
*   `ARCHIVED`: Content is no longer active but kept for records.

#### 4.1.2. `ContentLanguage` (`common/enums/content-language.enum.ts`)
Requirement: REQ-6-012
*   `EN`: English.
*   `AR_SA`: Arabic (Saudi Arabia).
    *   Note: The system should be designed to easily add more languages.

### 4.2. Common DTOs

#### 4.2.1. `SeoMetaDto` (`common/dto/seo-meta.dto.ts`)
Requirements: REQ-6-003 (for slug part), REQ-7-007
*   `metaTitle` (string): The title tag content for SEO.
*   `metaDescription` (string): The meta description content for SEO.
*   `slug` (string): URL-friendly identifier for the content item. Must be unique per language within its content type (blog/landing page) for a merchant.
*   `canonicalUrl` (string, optional): The preferred URL for the content if duplicate content exists.

## 5. Modules and Endpoints

### 5.1. `ContentManagementApiModule` (`content-management-api.module.ts`)
This is the root module for the Content Management API.
*   **Imports**: `BlogModule`, `LandingPageModule`. May import shared modules like `AuthModule` (if JWT strategy is configured here) or a `ConfigModule`.
*   **Controllers**: None directly.
*   **Providers**: None directly.
*   **Exports**: None directly.

### 5.2. Blog Module (`blog/`)
Manages blog post content.

#### 5.2.1. `BlogModule` (`blog.module.ts`)
*   **Imports**: Potentially a shared `DatabaseModule` or `TypeOrmModule.forFeature([...])` if data access is handled directly. For this SDS, it's assumed services call other services or repositories.
*   **Controllers**: `[BlogController]`
*   **Providers**: `[BlogService]`
*   **Exports**: `[BlogService]` (if needed by other modules, though unlikely in this microservice).

#### 5.2.2. DTOs

##### 5.2.2.1. `CreateBlogPostReqDto` (`dto/create-blog-post.req.dto.ts`)
*   `title` (string, required): Title of the blog post.
*   `content` (string, required): Main content (HTML/Markdown supported by frontend, stored as string).
*   `language` (string, required, enum: `ContentLanguage`): Language of the content (e.g., 'en', 'ar-SA'). REQ-6-012.
*   `locale` (string, optional): Specific locale (e.g., 'en-US').
*   `authorId` (string, required): Identifier for the author (usually the `userId` of the merchant user).
*   `seoMeta` (`SeoMetaDto`, optional): SEO related metadata. REQ-6-003, REQ-7-007.
*   `tags` (string[], optional): Array of tags associated with the post.
*   `status` (`PublicationStatus`, optional, default: `DRAFT`): Initial status. REQ-6-005.
*   `publishDate` (Date, optional): Date for scheduled publication if `status` is `SCHEDULED`. REQ-6-005.
*   Validations: `@IsNotEmpty()`, `@IsString()`, `@IsEnum(ContentLanguage)`, `@IsOptional()`, `@ValidateNested()`, `@IsArray()`, `@IsDate()`.

##### 5.2.2.2. `UpdateBlogPostReqDto` (`dto/update-blog-post.req.dto.ts`)
All fields are optional, allowing partial updates.
*   `title` (string, optional)
*   `content` (string, optional)
*   `language` (string, optional, enum: `ContentLanguage`): Note: Changing language of an existing post might imply creating a new translation or updating a specific language version. This needs clarification in service logic. REQ-6-012.
*   `locale` (string, optional)
*   `seoMeta` (`SeoMetaDto`, optional). REQ-6-003, REQ-7-007.
*   `tags` (string[], optional)
*   `status` (`PublicationStatus`, optional). REQ-6-005.
*   `publishDate` (Date, optional). REQ-6-005.
*   Validations: `@IsOptional()` for all fields, plus specific type validations.

##### 5.2.2.3. `BlogPostResDto` (`dto/blog-post.res.dto.ts`)
*   `id` (string): Unique identifier of the blog post.
*   `title` (string)
*   `content` (string)
*   `language` (string, enum: `ContentLanguage`). REQ-6-012.
*   `locale` (string, optional)
*   `authorId` (string)
*   `seoMeta` (`SeoMetaDto`). REQ-6-003, REQ-7-007.
*   `tags` (string[])
*   `status` (`PublicationStatus`). REQ-6-005.
*   `publishDate` (Date, optional). REQ-6-005.
*   `createdAt` (Date): Timestamp of creation.
*   `updatedAt` (Date): Timestamp of last update.
*   `publicUrl` (string, optional, derived): Publicly accessible URL for SSR/SSG.

#### 5.2.3. `BlogController` (`blog.controller.ts`)
Base Path: `/api/v1/content/blog/posts`
Authentication: `JwtAuthGuard` applied to all routes unless specified.
Tag: `@ApiTags('Blog Posts')`

*   **Create Blog Post** (REQ-6-001, REQ-6-002, REQ-6-012, REQ-7-007)
    *   Method: `POST /`
    *   Description: Creates a new blog post.
    *   Request Body: `CreateBlogPostReqDto`
    *   Response: `201 Created` with `BlogPostResDto`
    *   Auth: Required. `userId` from JWT used as `authorId`.
*   **Get All Blog Posts (Paginated)** (REQ-6-001)
    *   Method: `GET /`
    *   Description: Retrieves a paginated list of blog posts for the authenticated merchant, optionally filtered by language.
    *   Query Parameters: `PaginationQueryDto`, `language?: ContentLanguage`.
    *   Response: `200 OK` with `PaginatedResponseDto<BlogPostResDto>`
    *   Auth: Required.
*   **Get Blog Post by ID** (REQ-6-001)
    *   Method: `GET /:id`
    *   Description: Retrieves a specific blog post by its ID. `language` query param can specify preferred language version.
    *   Path Parameters: `id` (string)
    *   Query Parameters: `language?: ContentLanguage` (REQ-6-012)
    *   Response: `200 OK` with `BlogPostResDto` or `404 Not Found`.
    *   Auth: Required (for merchant backend), or Public (if this endpoint is also used by SSR/SSG frontend directly via gateway - needs clarification on access pattern). Assume required for now.
*   **Get Blog Post by Slug** (REQ-6-003, REQ-7-007)
    *   Method: `GET /slug/:slug`
    *   Description: Retrieves a specific blog post by its slug. `language` query param for specific language version.
    *   Path Parameters: `slug` (string)
    *   Query Parameters: `language?: ContentLanguage` (REQ-6-012)
    *   Response: `200 OK` with `BlogPostResDto` or `404 Not Found`.
    *   Auth: Public (typically for SSR/SSG frontends).
*   **Update Blog Post** (REQ-6-005, REQ-6-002, REQ-6-012, REQ-7-007)
    *   Method: `PATCH /:id`
    *   Description: Updates an existing blog post. `language` query param specifies which language version to update if the post has multiple.
    *   Path Parameters: `id` (string)
    *   Query Parameters: `language?: ContentLanguage` (REQ-6-012)
    *   Request Body: `UpdateBlogPostReqDto`
    *   Response: `200 OK` with `BlogPostResDto` or `404 Not Found`.
    *   Auth: Required.
*   **Delete Blog Post** (REQ-6-005)
    *   Method: `DELETE /:id`
    *   Description: Deletes a blog post.
    *   Path Parameters: `id` (string)
    *   Response: `204 No Content` or `404 Not Found`.
    *   Auth: Required.
*   **Change Blog Post Status** (REQ-6-005)
    *   Method: `PATCH /:id/status`
    *   Description: Changes the publication status of a blog post (e.g., publish, unpublish, schedule).
    *   Path Parameters: `id` (string)
    *   Request Body: `{ status: PublicationStatus, publishDate?: Date }` (DTO for this)
    *   Response: `200 OK` with `BlogPostResDto` or `404 Not Found`.
    *   Auth: Required.

#### 5.2.4. `BlogService` (`blog.service.ts`)
*   `async create(createBlogPostDto: CreateBlogPostReqDto, merchantId: string, userId: string): Promise<BlogPostResDto>`
    *   Logic: Validates DTO. Generates a unique slug if not provided or to ensure uniqueness (based on title and language). Handles `authorId` (from `userId`). Persists the blog post. Returns the created post. REQ-6-001, REQ-6-002, REQ-6-012, REQ-7-007.
*   `async findAll(query: PaginationQueryDto, merchantId: string, language?: ContentLanguage): Promise<PaginatedResponseDto<BlogPostResDto>>`
    *   Logic: Fetches blog posts for the merchant, applying pagination, sorting, and language filtering. REQ-6-001, REQ-6-012.
*   `async findOne(id: string, merchantId: string, language?: ContentLanguage): Promise<BlogPostResDto>`
    *   Logic: Fetches a single blog post by ID for the merchant, considering language. Throws `NotFoundException` if not found. REQ-6-001, REQ-6-012.
*   `async findBySlug(slug: string, merchantId: string, language?: ContentLanguage): Promise<BlogPostResDto>` (Potentially `merchantId` is not needed for public access, or it uses a different service method for public access)
    *   Logic: Fetches a single blog post by slug for the merchant, considering language. Throws `NotFoundException`. REQ-6-003, REQ-7-007, REQ-6-012.
*   `async update(id: string, updateBlogPostDto: UpdateBlogPostReqDto, merchantId: string, language?: ContentLanguage): Promise<BlogPostResDto>`
    *   Logic: Finds post. Applies updates. If slug-related fields change, may regenerate/validate slug. Persists changes. Returns updated post. REQ-6-005, REQ-6-002, REQ-6-012, REQ-7-007.
*   `async remove(id: string, merchantId: string): Promise<void>`
    *   Logic: Deletes the blog post. REQ-6-005.
*   `async changeStatus(id: string, status: PublicationStatus, merchantId: string, publishDate?: Date): Promise<BlogPostResDto>`
    *   Logic: Updates the status. If `SCHEDULED`, validates `publishDate`. Handles transitions (e.g., unpublishing). REQ-6-005.
*   Internal linking (REQ-6-003): The `content` field will store HTML/Markdown. The service doesn't actively manage these links beyond storing the content but should ensure that when `seoMeta.slug` is generated, it's URL-safe. Validation of internal links correctness is likely a frontend/editor concern, or a separate SEO tool concern.

### 5.3. Landing Page Module (`landing-page/`)
Manages interactive landing page content.

#### 5.3.1. `LandingPageModule` (`landing-page.module.ts`)
*   **Controllers**: `[LandingPageController]`
*   **Providers**: `[LandingPageService]`

#### 5.3.2. DTOs

##### 5.3.2.1. `CtaButtonDto` (`dto/cta-button.dto.ts`)
Requirement: REQ-6-007, REQ-6-008
*   `text` (string, required): Button display text.
*   `link` (string, required): URL (external, internal page, product, or Direct Order deep-link).
*   `appearance` (string, optional): Style identifier (e.g., 'primary', 'secondary').
*   Validations: `@IsNotEmpty()`, `@IsString()`, `@IsUrl()` (for link, potentially custom validation for internal/Direct Order links).

##### 5.3.2.2. `CountdownTimerDto` (`dto/countdown-timer.dto.ts`)
Requirement: REQ-6-007
*   `endDate` (Date, required): Target date and time for the countdown.
*   `displayText` (string, optional): Text to display alongside/after the timer (e.g., "Sale Ends!").
*   Validations: `@IsNotEmpty()`, `@IsDate()`.

##### 5.3.2.3. `PromotionalBannerDto` (`dto/promotional-banner.dto.ts`)
Requirement: REQ-6-007
*   `imageUrl` (string, required): URL of the banner image.
*   `altText` (string, optional): Alt text for the image.
*   `linkUrl` (string, optional): URL the banner links to.
*   Validations: `@IsNotEmpty()`, `@IsUrl()`, `@IsString()`.

##### 5.3.2.4. `CreateLandingPageReqDto` (`dto/create-landing-page.req.dto.ts`)
*   `title` (string, required): Title of the landing page.
*   `contentStructure` (any, required): JSON object describing the layout and content elements of the page. Frontend builder defines this structure.
*   `language` (string, required, enum: `ContentLanguage`): Language of the content. REQ-6-012.
*   `locale` (string, optional): Specific locale.
*   `seoMeta` (`SeoMetaDto`, optional). REQ-7-007.
*   `status` (`PublicationStatus`, optional, default: `DRAFT`). REQ-6-010.
*   `campaignId` (string, optional): ID of an associated advertising campaign. REQ-6-008.
*   `promotionalBanners` (`PromotionalBannerDto[]`, optional). REQ-6-007.
*   `countdownTimers` (`CountdownTimerDto[]`, optional). REQ-6-007.
*   `ctaButtons` (`CtaButtonDto[]`, optional). REQ-6-007.
*   `multimediaContent` (any[], optional): Array for embedding other multimedia (e.g., video URLs, structured data for embeds). REQ-6-007.
*   Validations: As per individual fields and nested DTOs.

##### 5.3.2.5. `UpdateLandingPageReqDto` (`dto/update-landing-page.req.dto.ts`)
All fields are optional, allowing partial updates.
*   `title` (string, optional)
*   `contentStructure` (any, optional)
*   `language` (string, optional, enum: `ContentLanguage`). REQ-6-012.
*   `locale` (string, optional)
*   `seoMeta` (`SeoMetaDto`, optional). REQ-7-007.
*   `status` (`PublicationStatus`, optional). REQ-6-010.
*   `campaignId` (string, optional). REQ-6-008.
*   `promotionalBanners` (`PromotionalBannerDto[]`, optional). REQ-6-007.
*   `countdownTimers` (`CountdownTimerDto[]`, optional). REQ-6-007.
*   `ctaButtons` (`CtaButtonDto[]`, optional). REQ-6-007.
*   `multimediaContent` (any[], optional). REQ-6-007.
*   Validations: `@IsOptional()` for all fields.

##### 5.3.2.6. `LandingPageResDto` (`dto/landing-page.res.dto.ts`)
*   `id` (string)
*   `title` (string)
*   `contentStructure` (any)
*   `language` (string, enum: `ContentLanguage`). REQ-6-012.
*   `locale` (string, optional)
*   `seoMeta` (`SeoMetaDto`). REQ-7-007.
*   `status` (`PublicationStatus`). REQ-6-010.
*   `campaignId` (string, optional). REQ-6-008.
*   `promotionalBanners` (`PromotionalBannerDto[]`). REQ-6-007.
*   `countdownTimers` (`CountdownTimerDto[]`). REQ-6-007.
*   `ctaButtons` (`CtaButtonDto[]`). REQ-6-007.
*   `multimediaContent` (any[]). REQ-6-007.
*   `createdAt` (Date)
*   `updatedAt` (Date)
*   `publicUrl` (string, optional, derived): Publicly accessible URL for SSR/SSG.

#### 5.3.3. `LandingPageController` (`landing-page.controller.ts`)
Base Path: `/api/v1/content/landing-pages`
Authentication: `JwtAuthGuard` applied to all routes unless specified.
Tag: `@ApiTags('Landing Pages')`

*   **Create Landing Page** (REQ-6-006, REQ-6-007, REQ-6-008, REQ-6-012, REQ-7-007)
    *   Method: `POST /`
    *   Description: Creates a new landing page.
    *   Request Body: `CreateLandingPageReqDto`
    *   Response: `201 Created` with `LandingPageResDto`
    *   Auth: Required.
*   **Get All Landing Pages (Paginated)** (REQ-6-006)
    *   Method: `GET /`
    *   Description: Retrieves a paginated list of landing pages for the merchant.
    *   Query Parameters: `PaginationQueryDto`, `language?: ContentLanguage`.
    *   Response: `200 OK` with `PaginatedResponseDto<LandingPageResDto>`
    *   Auth: Required.
*   **Get Landing Page by ID** (REQ-6-006)
    *   Method: `GET /:id`
    *   Description: Retrieves a specific landing page by ID.
    *   Path Parameters: `id` (string)
    *   Query Parameters: `language?: ContentLanguage` (REQ-6-012)
    *   Response: `200 OK` with `LandingPageResDto` or `404 Not Found`.
    *   Auth: Required (for merchant backend), or Public (if used by SSR/SSG). Assume required.
*   **Get Landing Page by Slug** (REQ-7-007)
    *   Method: `GET /slug/:slug`
    *   Description: Retrieves a specific landing page by its slug.
    *   Path Parameters: `slug` (string)
    *   Query Parameters: `language?: ContentLanguage` (REQ-6-012)
    *   Response: `200 OK` with `LandingPageResDto` or `404 Not Found`.
    *   Auth: Public.
*   **Update Landing Page** (REQ-6-010, REQ-6-007, REQ-6-008, REQ-6-012, REQ-7-007)
    *   Method: `PATCH /:id`
    *   Description: Updates an existing landing page.
    *   Path Parameters: `id` (string)
    *   Query Parameters: `language?: ContentLanguage` (REQ-6-012)
    *   Request Body: `UpdateLandingPageReqDto`
    *   Response: `200 OK` with `LandingPageResDto` or `404 Not Found`.
    *   Auth: Required.
*   **Delete Landing Page** (REQ-6-010)
    *   Method: `DELETE /:id`
    *   Description: Deletes a landing page.
    *   Path Parameters: `id` (string)
    *   Response: `204 No Content` or `404 Not Found`.
    *   Auth: Required.
*   **Duplicate Landing Page** (REQ-6-010)
    *   Method: `POST /:id/duplicate`
    *   Description: Creates a copy of an existing landing page.
    *   Path Parameters: `id` (string)
    *   Response: `201 Created` with `LandingPageResDto` (the new duplicated page).
    *   Auth: Required.
*   **Change Landing Page Status** (REQ-6-010)
    *   Method: `PATCH /:id/status`
    *   Description: Changes the publication status of a landing page.
    *   Path Parameters: `id` (string)
    *   Request Body: `{ status: PublicationStatus }` (DTO for this)
    *   Response: `200 OK` with `LandingPageResDto` or `404 Not Found`.
    *   Auth: Required.

#### 5.3.4. `LandingPageService` (`landing-page.service.ts`)
*   `async create(createLPDto: CreateLandingPageReqDto, merchantId: string, userId: string): Promise<LandingPageResDto>`
    *   Logic: Validates DTO. Generates unique slug. Persists landing page data including `contentStructure` and interactive elements. Associates with `campaignId` if provided. REQ-6-006, REQ-6-007, REQ-6-008, REQ-6-012, REQ-7-007.
*   `async findAll(query: PaginationQueryDto, merchantId: string, language?: ContentLanguage): Promise<PaginatedResponseDto<LandingPageResDto>>`
    *   Logic: Fetches landing pages for the merchant with pagination, sorting, language filter. REQ-6-006, REQ-6-012.
*   `async findOne(id: string, merchantId: string, language?: ContentLanguage): Promise<LandingPageResDto>`
    *   Logic: Fetches a single landing page by ID. REQ-6-006, REQ-6-012.
*   `async findBySlug(slug: string, merchantId: string, language?: ContentLanguage): Promise<LandingPageResDto>`
    *   Logic: Fetches a single landing page by slug. REQ-7-007, REQ-6-012.
*   `async update(id: string, updateLPDto: UpdateLandingPageReqDto, merchantId: string, language?: ContentLanguage): Promise<LandingPageResDto>`
    *   Logic: Updates landing page details. REQ-6-010, REQ-6-007, REQ-6-008, REQ-6-012, REQ-7-007.
*   `async remove(id: string, merchantId: string): Promise<void>`
    *   Logic: Deletes the landing page. REQ-6-010.
*   `async duplicate(id: string, merchantId: string, userId: string): Promise<LandingPageResDto>`
    *   Logic: Creates a deep copy of the landing page with a new ID and slug, possibly resetting status to DRAFT. REQ-6-010.
*   `async changeStatus(id: string, status: PublicationStatus, merchantId: string): Promise<LandingPageResDto>`
    *   Logic: Updates publication status. REQ-6-010.
*   REQ-6-008 (Deep-linking for Direct Order): The `CtaButtonDto.link` field can store these deep-links. The service is responsible for storing this value. Generation of the Direct Order link itself might be a utility or a call to another service/core platform.
*   REQ-7-007 (SSR/SSG Support): The service ensures all necessary data (content, SEO meta) is stored and retrieved correctly for the API responses, making it consumable by SSR/SSG frontends. Performance of the API itself is also a factor.

## 6. Data Persistence (Conceptual)
The `BlogService` and `LandingPageService` will interact with an abstracted data persistence layer. This layer is responsible for CRUD operations on blog posts, landing pages, and their associated metadata (SEO, interactive elements, localization versions). The choice of database (e.g., PostgreSQL for structured data, DynamoDB for flexible content structures) and its schema are outside the scope of this API repository's direct implementation but are crucial for the services to function. Services will expect repository-like interfaces for data access.

The `CONTENT_DB_CONNECTION_STRING` from repository configuration would be used by this underlying persistence layer.

## 7. Configuration

### 7.1. Environment Variables
*   `JWT_SECRET`: Secret key for JWT signing and verification.
*   `API_BASE_PATH`: e.g., `/api/v1/content`
*   `DEFAULT_PAGE_LIMIT`: Default number of items for paginated responses.
*   `CONTENT_DB_CONNECTION_STRING`: (As per repository config) Connection string for the database storing content.
*   Possibly other configurations related to downstream services.

### 7.2. Feature Toggles
(As per repository configuration)
*   `enableAdvancedLandingPageElements` (boolean): Controls availability of complex interactive elements in landing pages. The API should check this toggle before allowing creation/update of such elements.
*   `enableBlogScheduling` (boolean): Controls if the 'SCHEDULED' status and `publishDate` for blog posts are active features.

## 8. Security Considerations
*   **Input Validation**: All incoming DTOs are validated using `class-validator` to prevent common injection vulnerabilities and ensure data integrity.
*   **JWT Protection**: All mutation endpoints and sensitive read endpoints are protected by `JwtAuthGuard`.
*   **Sanitization**: While content like blog posts and landing page structures can be rich (HTML/JSON), the services should ensure that any user-provided content intended for direct rendering is appropriately sanitized if not handled by a secure frontend rendering mechanism, to prevent XSS. This is typically a concern for the rendering layer, but API should be mindful of the data it stores.
*   **Rate Limiting**: Assumed to be handled at the API Gateway layer.
*   **Data Access Control**: Services ensure that users can only access/modify content belonging to their `merchantId`.

## 9. API Documentation (Swagger/OpenAPI)
*   `@nestjs/swagger` decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiProperty`, `@ApiParam`, `@ApiQuery`, `@ApiBearerAuth`) will be used extensively in controllers and DTOs to generate comprehensive OpenAPI 3.1.0 documentation.
*   The Swagger UI will be accessible at a designated endpoint (e.g., `/api/v1/content/docs`) in development/staging environments.

## 10. Logging and Monitoring
*   NestJS's built-in `LoggerService` or a custom logging solution will be used for structured logging (requests, errors, important business events).
*   Logs should be easily ingestible by a centralized logging platform (e.g., CloudWatch Logs).
*   Key metrics (request latency, error rates, endpoint usage) should be exposed for monitoring (e.g., via CloudWatch Metrics).

## 11. Testing Strategy
*   **Unit Tests**: Jest will be used for unit testing services, controllers (mocking dependencies), DTO validations, and utility functions. Aim for high code coverage.
*   **Integration Tests**: Test interactions between controllers and services within the module, potentially with a test database instance.
*   **E2E Tests**: Use tools like Supertest with NestJS testing utilities to test API endpoints from an external perspective, validating request/response cycles, authentication, and error handling.

## 12. Dependencies
Key NPM packages as defined in `package.json` (conceptual, based on file structure descriptions):
*   `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
*   `@nestjs/swagger`
*   `@nestjs/passport`, `passport`, `passport-jwt`
*   `class-validator`, `class-transformer`
*   `reflect-metadata`
*   `rxjs`
*   Any database client/ORM if data access were in scope (e.g., `pg`, `typeorm`).
