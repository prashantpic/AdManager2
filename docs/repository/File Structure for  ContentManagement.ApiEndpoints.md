# Specification

# 1. Files

- **Path:** src/modules/content-management/api/package.json  
**Description:** Defines NPM dependencies for the Content Management API module, including NestJS framework, class-validator, class-transformer, @nestjs/swagger, and any other specific libraries required for this module's functionality. Also includes scripts for building and running this module if it were standalone (though likely part of a monorepo).  
**Template:** NestJS Module Package JSON  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** package.json  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Management
    
**Requirement Ids:**
    
    
**Purpose:** Manages Node.js package dependencies and scripts for the content management API.  
**Logic Description:** Standard package.json file listing dependencies like @nestjs/common, @nestjs/core, class-validator, class-transformer, @nestjs/swagger, reflect-metadata, rxjs.  
**Documentation:**
    
    - **Summary:** NPM package file for the content management API endpoints, specifying its dependencies and project metadata.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** src/modules/content-management/api/tsconfig.json  
**Description:** TypeScript compiler configuration for the Content Management API module. Specifies compiler options like target ECMAScript version, module system, decorators, and paths.  
**Template:** NestJS Module tsconfig.json  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** tsconfig.json  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript Compilation Configuration
    
**Requirement Ids:**
    
    
**Purpose:** Configures TypeScript compilation settings for the content management API module.  
**Logic Description:** Standard tsconfig.json inheriting from a base config, enabling decorators, esModuleInterop, strict null checks, and defining outDir and baseUrl.  
**Documentation:**
    
    - **Summary:** TypeScript configuration file for the content management API module, defining how TypeScript code is compiled to JavaScript.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** src/modules/content-management/api/content-management-api.module.ts  
**Description:** Root NestJS module for the Content Management API. Imports and configures specific feature modules like BlogModule and LandingPageModule, and may provide shared services or configurations for content management.  
**Template:** NestJS Module  
**Dependancy Level:** 2  
**Name:** ContentManagementApiModule  
**Type:** Module  
**Relative Path:** content-management-api.module.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - Module
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module Aggregation for Content Management
    
**Requirement Ids:**
    
    - REQ-6-001
    - REQ-6-006
    
**Purpose:** Orchestrates and aggregates all content-related modules (Blog, LandingPage) for the API.  
**Logic Description:** Imports BlogModule and LandingPageModule. May also import a shared ConfigModule if applicable. Exports services or controllers if needed at a higher level.  
**Documentation:**
    
    - **Summary:** The main NestJS module consolidating all features related to content management (blogs, landing pages).
    
**Namespace:** AdManager.ContentManagement.Api.V1  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/content-management/api/common/enums/publication-status.enum.ts  
**Description:** Defines an enumeration for the publication status of content items (e.g., Blog Posts, Landing Pages).  
**Template:** TypeScript Enum  
**Dependancy Level:** 0  
**Name:** PublicationStatus  
**Type:** Enum  
**Relative Path:** common/enums/publication-status.enum.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** DRAFT  
**Type:** string  
**Attributes:**   
    - **Name:** PUBLISHED  
**Type:** string  
**Attributes:**   
    - **Name:** SCHEDULED  
**Type:** string  
**Attributes:**   
    - **Name:** UNPUBLISHED  
**Type:** string  
**Attributes:**   
    - **Name:** ARCHIVED  
**Type:** string  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - Content Status Management
    
**Requirement Ids:**
    
    - REQ-6-005
    - REQ-6-010
    
**Purpose:** Provides standardized publication statuses for content entities.  
**Logic Description:** TypeScript enum with values: DRAFT = 'draft', PUBLISHED = 'published', SCHEDULED = 'scheduled', UNPUBLISHED = 'unpublished', ARCHIVED = 'archived'.  
**Documentation:**
    
    - **Summary:** Enumeration representing the possible publication states of a content item.
    
**Namespace:** AdManager.ContentManagement.Api.V1.Common.Enums  
**Metadata:**
    
    - **Category:** Domain
    
- **Path:** src/modules/content-management/api/common/enums/content-language.enum.ts  
**Description:** Defines an enumeration for supported content languages.  
**Template:** TypeScript Enum  
**Dependancy Level:** 0  
**Name:** ContentLanguage  
**Type:** Enum  
**Relative Path:** common/enums/content-language.enum.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** EN  
**Type:** string  
**Attributes:**   
    - **Name:** AR_SA  
**Type:** string  
**Attributes:**   
    
**Methods:**
    
    
**Implemented Features:**
    
    - Content Localization
    
**Requirement Ids:**
    
    - REQ-6-012
    
**Purpose:** Provides standardized language codes for content localization.  
**Logic Description:** TypeScript enum with values: EN = 'en', AR_SA = 'ar-SA'. Additional languages can be added here.  
**Documentation:**
    
    - **Summary:** Enumeration representing the supported languages for content items.
    
**Namespace:** AdManager.ContentManagement.Api.V1.Common.Enums  
**Metadata:**
    
    - **Category:** Domain
    
- **Path:** src/modules/content-management/api/common/dto/seo-meta.dto.ts  
**Description:** Data Transfer Object for SEO metadata common to blogs and landing pages.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** SeoMetaDto  
**Type:** DTO  
**Relative Path:** common/dto/seo-meta.dto.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** metaTitle  
**Type:** string  
**Attributes:** public  
    - **Name:** metaDescription  
**Type:** string  
**Attributes:** public  
    - **Name:** slug  
**Type:** string  
**Attributes:** public  
    - **Name:** canonicalUrl  
**Type:** string  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - SEO Meta Data Management
    
**Requirement Ids:**
    
    - REQ-6-003
    - REQ-7-007
    
**Purpose:** Defines the structure for SEO related information for content items.  
**Logic Description:** Class decorated with @nestjs/swagger ApiProperty and class-validator decorators for each field. Slug should be URL-friendly. Meta title and description have length constraints.  
**Documentation:**
    
    - **Summary:** DTO representing common SEO metadata fields like meta title, description, slug, and canonical URL.
    
**Namespace:** AdManager.ContentManagement.Api.V1.Common.Dto  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/content-management/api/common/dto/pagination-query.dto.ts  
**Description:** Data Transfer Object for common pagination query parameters.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** PaginationQueryDto  
**Type:** DTO  
**Relative Path:** common/dto/pagination-query.dto.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** page  
**Type:** number  
**Attributes:** public|optional  
    - **Name:** limit  
**Type:** number  
**Attributes:** public|optional  
    - **Name:** sortBy  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** sortOrder  
**Type:** 'ASC' | 'DESC'  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Pagination Support
    
**Requirement Ids:**
    
    - REQ-6-001
    - REQ-6-006
    
**Purpose:** Defines standardized query parameters for paginated list endpoints.  
**Logic Description:** Class with optional page, limit, sortBy, and sortOrder fields. Decorated with class-validator (e.g., @IsOptional(), @IsNumber(), @Min(1)) and @nestjs/swagger ApiProperty decorators. Default values for page and limit handled in services.  
**Documentation:**
    
    - **Summary:** DTO representing common query parameters for paginating lists of resources.
    
**Namespace:** AdManager.ContentManagement.Api.V1.Common.Dto  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/content-management/api/common/dto/paginated-response.dto.ts  
**Description:** Generic Data Transfer Object for paginated API responses.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** PaginatedResponseDto<T>  
**Type:** DTO  
**Relative Path:** common/dto/paginated-response.dto.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** data  
**Type:** T[]  
**Attributes:** public  
    - **Name:** total  
**Type:** number  
**Attributes:** public  
    - **Name:** page  
**Type:** number  
**Attributes:** public  
    - **Name:** limit  
**Type:** number  
**Attributes:** public  
    - **Name:** totalPages  
**Type:** number  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Pagination Support
    
**Requirement Ids:**
    
    - REQ-6-001
    - REQ-6-006
    
**Purpose:** Defines a standardized structure for API responses that return paginated data.  
**Logic Description:** Generic class PaginatedResponseDto<T>. Constructor takes data array and pagination metadata. Decorated with @nestjs/swagger ApiProperty decorators.  
**Documentation:**
    
    - **Summary:** Generic DTO representing a paginated list of resources, including data and pagination metadata.
    
**Namespace:** AdManager.ContentManagement.Api.V1.Common.Dto  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/content-management/api/common/guards/jwt-auth.guard.ts  
**Description:** NestJS guard for protecting routes using JWT authentication.  
**Template:** NestJS Guard  
**Dependancy Level:** 1  
**Name:** JwtAuthGuard  
**Type:** Guard  
**Relative Path:** common/guards/jwt-auth.guard.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - Guard
    
**Members:**
    
    
**Methods:**
    
    - **Name:** canActivate  
**Parameters:**
    
    - context: ExecutionContext
    
**Return Type:** boolean | Promise<boolean> | Observable<boolean>  
**Attributes:** public  
    
**Implemented Features:**
    
    - API Authentication
    
**Requirement Ids:**
    
    
**Purpose:** Ensures that API endpoints are accessed only by authenticated users with valid JWTs.  
**Logic Description:** Extends AuthGuard('jwt') from @nestjs/passport. Handles token validation and user extraction from the request. Throws UnauthorizedException if authentication fails.  
**Documentation:**
    
    - **Summary:** An authentication guard that uses JWT strategy to protect API endpoints, ensuring only authenticated requests proceed.
    
**Namespace:** AdManager.ContentManagement.Api.V1.Common.Guards  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/modules/content-management/api/blog/blog.module.ts  
**Description:** NestJS module for blog-related functionalities.  
**Template:** NestJS Module  
**Dependancy Level:** 2  
**Name:** BlogModule  
**Type:** Module  
**Relative Path:** blog/blog.module.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - Module
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Blog Management Feature Module
    
**Requirement Ids:**
    
    - REQ-6-001
    - REQ-6-002
    - REQ-6-003
    - REQ-6-005
    - REQ-6-012
    
**Purpose:** Encapsulates all components related to blog post management.  
**Logic Description:** Declares BlogController and BlogService. Imports any necessary shared modules (e.g., for database access if not handled by service itself, or common configuration).  
**Documentation:**
    
    - **Summary:** NestJS module for managing blog posts, including controllers, services, and DTOs.
    
**Namespace:** AdManager.ContentManagement.Api.V1.Blog  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/content-management/api/blog/dto/create-blog-post.req.dto.ts  
**Description:** DTO for creating a new blog post.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** CreateBlogPostReqDto  
**Type:** DTO  
**Relative Path:** blog/dto/create-blog-post.req.dto.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** title  
**Type:** string  
**Attributes:** public  
    - **Name:** content  
**Type:** string  
**Attributes:** public  
    - **Name:** language  
**Type:** string  
**Attributes:** public  
    - **Name:** locale  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** authorId  
**Type:** string  
**Attributes:** public  
    - **Name:** seoMeta  
**Type:** SeoMetaDto  
**Attributes:** public|optional  
    - **Name:** tags  
**Type:** string[]  
**Attributes:** public|optional  
    - **Name:** status  
**Type:** PublicationStatus  
**Attributes:** public|optional  
    - **Name:** publishDate  
**Type:** Date  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Blog Post Creation
    - Localization
    - SEO
    
**Requirement Ids:**
    
    - REQ-6-001
    - REQ-6-002
    - REQ-6-003
    - REQ-6-005
    - REQ-6-012
    - REQ-7-007
    
**Purpose:** Defines the request payload structure for creating a blog post.  
**Logic Description:** Class decorated with @nestjs/swagger ApiProperty and class-validator (e.g., @IsNotEmpty(), @IsString(), @IsEnum(PublicationStatus), @IsOptional(), @ValidateNested()). Imports SeoMetaDto and PublicationStatus enum. Content field allows rich text / HTML.  
**Documentation:**
    
    - **Summary:** Request DTO for creating new blog posts, including title, content, language, SEO metadata, and publication status.
    
**Namespace:** AdManager.ContentManagement.Api.V1.Blog.Dto  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/content-management/api/blog/dto/update-blog-post.req.dto.ts  
**Description:** DTO for updating an existing blog post.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** UpdateBlogPostReqDto  
**Type:** DTO  
**Relative Path:** blog/dto/update-blog-post.req.dto.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** title  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** content  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** language  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** locale  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** seoMeta  
**Type:** SeoMetaDto  
**Attributes:** public|optional  
    - **Name:** tags  
**Type:** string[]  
**Attributes:** public|optional  
    - **Name:** status  
**Type:** PublicationStatus  
**Attributes:** public|optional  
    - **Name:** publishDate  
**Type:** Date  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Blog Post Update
    - Localization
    - SEO
    
**Requirement Ids:**
    
    - REQ-6-002
    - REQ-6-003
    - REQ-6-005
    - REQ-6-012
    - REQ-7-007
    
**Purpose:** Defines the request payload structure for updating a blog post. All fields are optional.  
**Logic Description:** Class decorated with @nestjs/swagger ApiProperty and class-validator (e.g., @IsOptional(), @IsString(), @ValidateNested()). Imports SeoMetaDto and PublicationStatus enum. Allows partial updates.  
**Documentation:**
    
    - **Summary:** Request DTO for updating existing blog posts. All fields are optional to allow partial updates.
    
**Namespace:** AdManager.ContentManagement.Api.V1.Blog.Dto  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/content-management/api/blog/dto/blog-post.res.dto.ts  
**Description:** DTO for representing a blog post in API responses.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** BlogPostResDto  
**Type:** DTO  
**Relative Path:** blog/dto/blog-post.res.dto.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public  
    - **Name:** title  
**Type:** string  
**Attributes:** public  
    - **Name:** content  
**Type:** string  
**Attributes:** public  
    - **Name:** language  
**Type:** string  
**Attributes:** public  
    - **Name:** locale  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** authorId  
**Type:** string  
**Attributes:** public  
    - **Name:** seoMeta  
**Type:** SeoMetaDto  
**Attributes:** public  
    - **Name:** tags  
**Type:** string[]  
**Attributes:** public  
    - **Name:** status  
**Type:** PublicationStatus  
**Attributes:** public  
    - **Name:** publishDate  
**Type:** Date  
**Attributes:** public|optional  
    - **Name:** createdAt  
**Type:** Date  
**Attributes:** public  
    - **Name:** updatedAt  
**Type:** Date  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Blog Post Representation
    
**Requirement Ids:**
    
    - REQ-6-001
    - REQ-6-002
    - REQ-6-003
    - REQ-6-005
    - REQ-6-012
    - REQ-7-007
    
**Purpose:** Defines the response payload structure for a single blog post.  
**Logic Description:** Class representing a blog post. Decorated with @nestjs/swagger ApiProperty. Includes all relevant fields for display and consumption by frontends (including SSR/SSG).  
**Documentation:**
    
    - **Summary:** Response DTO representing a blog post, including its content, metadata, SEO information, and status.
    
**Namespace:** AdManager.ContentManagement.Api.V1.Blog.Dto  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/content-management/api/blog/blog.controller.ts  
**Description:** NestJS controller for handling HTTP requests related to blog posts.  
**Template:** NestJS Controller  
**Dependancy Level:** 3  
**Name:** BlogController  
**Type:** Controller  
**Relative Path:** blog/blog.controller.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - MVC (Controller part)
    
**Members:**
    
    - **Name:** blogService  
**Type:** BlogService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** create  
**Parameters:**
    
    - createBlogPostDto: CreateBlogPostReqDto
    - req: Request
    
**Return Type:** Promise<BlogPostResDto>  
**Attributes:** public|async  
    - **Name:** findAll  
**Parameters:**
    
    - query: PaginationQueryDto
    
**Return Type:** Promise<PaginatedResponseDto<BlogPostResDto>>  
**Attributes:** public|async  
    - **Name:** findOne  
**Parameters:**
    
    - id: string
    - language: string
    
**Return Type:** Promise<BlogPostResDto>  
**Attributes:** public|async  
    - **Name:** findBySlug  
**Parameters:**
    
    - slug: string
    - language: string
    
**Return Type:** Promise<BlogPostResDto>  
**Attributes:** public|async  
    - **Name:** update  
**Parameters:**
    
    - id: string
    - updateBlogPostDto: UpdateBlogPostReqDto
    - language: string
    
**Return Type:** Promise<BlogPostResDto>  
**Attributes:** public|async  
    - **Name:** remove  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<void>  
**Attributes:** public|async  
    - **Name:** changeStatus  
**Parameters:**
    
    - id: string
    - status: PublicationStatus
    - publishDate?: Date
    
**Return Type:** Promise<BlogPostResDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Blog CRUD Operations
    - Blog Status Management
    - SEO-friendly URL retrieval
    - Localization Support
    
**Requirement Ids:**
    
    - REQ-6-001
    - REQ-6-002
    - REQ-6-003
    - REQ-6-005
    - REQ-6-012
    - REQ-7-007
    
**Purpose:** Exposes API endpoints for creating, reading, updating, deleting, and managing blog posts.  
**Logic Description:** Class decorated with @Controller('content/blog'), @ApiTags('Blog'), @UseGuards(JwtAuthGuard). Injects BlogService. Methods for POST, GET (list and by ID/slug), PATCH/PUT, DELETE. Uses DTOs for request/response. Implements endpoints for status changes (publish, unpublish, schedule). Considers language/locale parameters or headers for localized content.  
**Documentation:**
    
    - **Summary:** Controller handling all API requests for blog post management, including CRUD operations, status changes, and retrieval by slug or ID.
    
**Namespace:** AdManager.ContentManagement.Api.V1.Blog  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/content-management/api/blog/blog.service.ts  
**Description:** NestJS service providing business logic for blog post management.  
**Template:** NestJS Service  
**Dependancy Level:** 2  
**Name:** BlogService  
**Type:** Service  
**Relative Path:** blog/blog.service.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - Service Layer
    
**Members:**
    
    
**Methods:**
    
    - **Name:** create  
**Parameters:**
    
    - createBlogPostDto: CreateBlogPostReqDto
    - userId: string
    
**Return Type:** Promise<BlogPostResDto>  
**Attributes:** public|async  
    - **Name:** findAll  
**Parameters:**
    
    - query: PaginationQueryDto
    
**Return Type:** Promise<PaginatedResponseDto<BlogPostResDto>>  
**Attributes:** public|async  
    - **Name:** findOne  
**Parameters:**
    
    - id: string
    - language?: string
    
**Return Type:** Promise<BlogPostResDto>  
**Attributes:** public|async  
    - **Name:** findBySlug  
**Parameters:**
    
    - slug: string
    - language?: string
    
**Return Type:** Promise<BlogPostResDto>  
**Attributes:** public|async  
    - **Name:** update  
**Parameters:**
    
    - id: string
    - updateBlogPostDto: UpdateBlogPostReqDto
    - language?: string
    
**Return Type:** Promise<BlogPostResDto>  
**Attributes:** public|async  
    - **Name:** remove  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<void>  
**Attributes:** public|async  
    - **Name:** changeStatus  
**Parameters:**
    
    - id: string
    - status: PublicationStatus
    - publishDate?: Date
    
**Return Type:** Promise<BlogPostResDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Blog Business Logic
    - Data Validation
    - Interaction with Data Layer
    - Localization Logic
    
**Requirement Ids:**
    
    - REQ-6-001
    - REQ-6-002
    - REQ-6-003
    - REQ-6-005
    - REQ-6-012
    - REQ-7-007
    
**Purpose:** Handles the core business logic for managing blog posts, including data persistence and retrieval.  
**Logic Description:** Class decorated with @Injectable(). Interacts with a data persistence layer (e.g., database repository, not defined here but assumed). Implements CRUD operations, slug generation/validation, status transitions (draft, publish, schedule, unpublish), and handles localization (storing/retrieving content based on language). Ensures SEO fields are correctly managed. Validates internal links if applicable. Handles publishDate for scheduled posts.  
**Documentation:**
    
    - **Summary:** Service class containing the business logic for blog post operations, data manipulation, and interaction with the persistence layer.
    
**Namespace:** AdManager.ContentManagement.Api.V1.Blog  
**Metadata:**
    
    - **Category:** BusinessLogic
    
- **Path:** src/modules/content-management/api/landing-page/landing-page.module.ts  
**Description:** NestJS module for landing page-related functionalities.  
**Template:** NestJS Module  
**Dependancy Level:** 2  
**Name:** LandingPageModule  
**Type:** Module  
**Relative Path:** landing-page/landing-page.module.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - Module
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Landing Page Management Feature Module
    
**Requirement Ids:**
    
    - REQ-6-006
    - REQ-6-007
    - REQ-6-008
    - REQ-6-010
    - REQ-6-012
    
**Purpose:** Encapsulates all components related to landing page management.  
**Logic Description:** Declares LandingPageController and LandingPageService. Imports necessary shared modules.  
**Documentation:**
    
    - **Summary:** NestJS module for managing landing pages, including their controllers, services, and DTOs.
    
**Namespace:** AdManager.ContentManagement.Api.V1.LandingPage  
**Metadata:**
    
    - **Category:** Application
    
- **Path:** src/modules/content-management/api/landing-page/dto/cta-button.dto.ts  
**Description:** DTO for Call-to-Action button configuration on landing pages.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** CtaButtonDto  
**Type:** DTO  
**Relative Path:** landing-page/dto/cta-button.dto.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** text  
**Type:** string  
**Attributes:** public  
    - **Name:** link  
**Type:** string  
**Attributes:** public  
    - **Name:** appearance  
**Type:** string  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Landing Page CTA Configuration
    
**Requirement Ids:**
    
    - REQ-6-007
    - REQ-6-008
    
**Purpose:** Defines the structure for a Call-to-Action button element on a landing page.  
**Logic Description:** Class with text, link (can be external, internal product link, or Direct Order link), and optional appearance properties. Decorated with @nestjs/swagger and class-validator.  
**Documentation:**
    
    - **Summary:** DTO representing a customizable Call-to-Action button for landing pages.
    
**Namespace:** AdManager.ContentManagement.Api.V1.LandingPage.Dto  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/content-management/api/landing-page/dto/countdown-timer.dto.ts  
**Description:** DTO for countdown timer configuration on landing pages.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** CountdownTimerDto  
**Type:** DTO  
**Relative Path:** landing-page/dto/countdown-timer.dto.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** endDate  
**Type:** Date  
**Attributes:** public  
    - **Name:** displayText  
**Type:** string  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Landing Page Countdown Timer Configuration
    
**Requirement Ids:**
    
    - REQ-6-007
    
**Purpose:** Defines the structure for a countdown timer element on a landing page.  
**Logic Description:** Class with endDate and optional displayText. Decorated with @nestjs/swagger and class-validator.  
**Documentation:**
    
    - **Summary:** DTO representing a configurable countdown timer for landing pages.
    
**Namespace:** AdManager.ContentManagement.Api.V1.LandingPage.Dto  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/content-management/api/landing-page/dto/promotional-banner.dto.ts  
**Description:** DTO for promotional banner configuration on landing pages.  
**Template:** NestJS DTO  
**Dependancy Level:** 0  
**Name:** PromotionalBannerDto  
**Type:** DTO  
**Relative Path:** landing-page/dto/promotional-banner.dto.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** imageUrl  
**Type:** string  
**Attributes:** public  
    - **Name:** altText  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** linkUrl  
**Type:** string  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Landing Page Promotional Banner Configuration
    
**Requirement Ids:**
    
    - REQ-6-007
    
**Purpose:** Defines the structure for a promotional banner element on a landing page.  
**Logic Description:** Class with imageUrl, altText, and optional linkUrl. Decorated with @nestjs/swagger and class-validator.  
**Documentation:**
    
    - **Summary:** DTO representing a configurable promotional banner for landing pages.
    
**Namespace:** AdManager.ContentManagement.Api.V1.LandingPage.Dto  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/content-management/api/landing-page/dto/create-landing-page.req.dto.ts  
**Description:** DTO for creating a new landing page.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** CreateLandingPageReqDto  
**Type:** DTO  
**Relative Path:** landing-page/dto/create-landing-page.req.dto.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** title  
**Type:** string  
**Attributes:** public  
    - **Name:** contentStructure  
**Type:** any  
**Attributes:** public  
    - **Name:** language  
**Type:** string  
**Attributes:** public  
    - **Name:** locale  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** seoMeta  
**Type:** SeoMetaDto  
**Attributes:** public|optional  
    - **Name:** status  
**Type:** PublicationStatus  
**Attributes:** public|optional  
    - **Name:** campaignId  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** promotionalBanners  
**Type:** PromotionalBannerDto[]  
**Attributes:** public|optional  
    - **Name:** countdownTimers  
**Type:** CountdownTimerDto[]  
**Attributes:** public|optional  
    - **Name:** ctaButtons  
**Type:** CtaButtonDto[]  
**Attributes:** public|optional  
    - **Name:** multimediaContent  
**Type:** any[]  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Landing Page Creation
    - Interactive Elements
    - SEO
    - Campaign Association
    
**Requirement Ids:**
    
    - REQ-6-006
    - REQ-6-007
    - REQ-6-008
    - REQ-6-010
    - REQ-6-012
    - REQ-7-007
    
**Purpose:** Defines the request payload structure for creating a new landing page.  
**Logic Description:** Class decorated with @nestjs/swagger and class-validator. Imports SeoMetaDto, PublicationStatus, and interactive element DTOs. `contentStructure` can be a JSON object representing the page layout and content sections.  
**Documentation:**
    
    - **Summary:** Request DTO for creating new landing pages, including title, content structure, interactive elements, SEO metadata, and campaign association.
    
**Namespace:** AdManager.ContentManagement.Api.V1.LandingPage.Dto  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/content-management/api/landing-page/dto/update-landing-page.req.dto.ts  
**Description:** DTO for updating an existing landing page.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** UpdateLandingPageReqDto  
**Type:** DTO  
**Relative Path:** landing-page/dto/update-landing-page.req.dto.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** title  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** contentStructure  
**Type:** any  
**Attributes:** public|optional  
    - **Name:** language  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** locale  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** seoMeta  
**Type:** SeoMetaDto  
**Attributes:** public|optional  
    - **Name:** status  
**Type:** PublicationStatus  
**Attributes:** public|optional  
    - **Name:** campaignId  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** promotionalBanners  
**Type:** PromotionalBannerDto[]  
**Attributes:** public|optional  
    - **Name:** countdownTimers  
**Type:** CountdownTimerDto[]  
**Attributes:** public|optional  
    - **Name:** ctaButtons  
**Type:** CtaButtonDto[]  
**Attributes:** public|optional  
    - **Name:** multimediaContent  
**Type:** any[]  
**Attributes:** public|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Landing Page Update
    - Interactive Elements
    - SEO
    - Campaign Association
    
**Requirement Ids:**
    
    - REQ-6-007
    - REQ-6-008
    - REQ-6-010
    - REQ-6-012
    - REQ-7-007
    
**Purpose:** Defines the request payload structure for updating a landing page. All fields are optional.  
**Logic Description:** Class decorated with @nestjs/swagger and class-validator. All fields are optional for partial updates.  
**Documentation:**
    
    - **Summary:** Request DTO for updating existing landing pages. All fields are optional to allow partial updates.
    
**Namespace:** AdManager.ContentManagement.Api.V1.LandingPage.Dto  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/content-management/api/landing-page/dto/landing-page.res.dto.ts  
**Description:** DTO for representing a landing page in API responses.  
**Template:** NestJS DTO  
**Dependancy Level:** 1  
**Name:** LandingPageResDto  
**Type:** DTO  
**Relative Path:** landing-page/dto/landing-page.res.dto.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - DTO
    
**Members:**
    
    - **Name:** id  
**Type:** string  
**Attributes:** public  
    - **Name:** title  
**Type:** string  
**Attributes:** public  
    - **Name:** contentStructure  
**Type:** any  
**Attributes:** public  
    - **Name:** language  
**Type:** string  
**Attributes:** public  
    - **Name:** locale  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** seoMeta  
**Type:** SeoMetaDto  
**Attributes:** public  
    - **Name:** status  
**Type:** PublicationStatus  
**Attributes:** public  
    - **Name:** campaignId  
**Type:** string  
**Attributes:** public|optional  
    - **Name:** promotionalBanners  
**Type:** PromotionalBannerDto[]  
**Attributes:** public  
    - **Name:** countdownTimers  
**Type:** CountdownTimerDto[]  
**Attributes:** public  
    - **Name:** ctaButtons  
**Type:** CtaButtonDto[]  
**Attributes:** public  
    - **Name:** multimediaContent  
**Type:** any[]  
**Attributes:** public  
    - **Name:** createdAt  
**Type:** Date  
**Attributes:** public  
    - **Name:** updatedAt  
**Type:** Date  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Landing Page Representation
    
**Requirement Ids:**
    
    - REQ-6-006
    - REQ-6-007
    - REQ-6-008
    - REQ-6-010
    - REQ-6-012
    - REQ-7-007
    
**Purpose:** Defines the response payload structure for a single landing page.  
**Logic Description:** Class representing a landing page for API responses. Includes all relevant fields for consumption by SSR/SSG frontends.  
**Documentation:**
    
    - **Summary:** Response DTO representing a landing page, including its structure, interactive elements, SEO metadata, and status.
    
**Namespace:** AdManager.ContentManagement.Api.V1.LandingPage.Dto  
**Metadata:**
    
    - **Category:** Contract
    
- **Path:** src/modules/content-management/api/landing-page/landing-page.controller.ts  
**Description:** NestJS controller for handling HTTP requests related to landing pages.  
**Template:** NestJS Controller  
**Dependancy Level:** 3  
**Name:** LandingPageController  
**Type:** Controller  
**Relative Path:** landing-page/landing-page.controller.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - MVC (Controller part)
    
**Members:**
    
    - **Name:** landingPageService  
**Type:** LandingPageService  
**Attributes:** private|readonly  
    
**Methods:**
    
    - **Name:** create  
**Parameters:**
    
    - createLandingPageDto: CreateLandingPageReqDto
    - req: Request
    
**Return Type:** Promise<LandingPageResDto>  
**Attributes:** public|async  
    - **Name:** findAll  
**Parameters:**
    
    - query: PaginationQueryDto
    
**Return Type:** Promise<PaginatedResponseDto<LandingPageResDto>>  
**Attributes:** public|async  
    - **Name:** findOne  
**Parameters:**
    
    - id: string
    - language: string
    
**Return Type:** Promise<LandingPageResDto>  
**Attributes:** public|async  
    - **Name:** findBySlug  
**Parameters:**
    
    - slug: string
    - language: string
    
**Return Type:** Promise<LandingPageResDto>  
**Attributes:** public|async  
    - **Name:** update  
**Parameters:**
    
    - id: string
    - updateLandingPageDto: UpdateLandingPageReqDto
    - language: string
    
**Return Type:** Promise<LandingPageResDto>  
**Attributes:** public|async  
    - **Name:** remove  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<void>  
**Attributes:** public|async  
    - **Name:** duplicate  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<LandingPageResDto>  
**Attributes:** public|async  
    - **Name:** changeStatus  
**Parameters:**
    
    - id: string
    - status: PublicationStatus
    
**Return Type:** Promise<LandingPageResDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Landing Page CRUD
    - Status Management
    - Duplication
    - SEO-friendly URL retrieval
    - Localization Support
    
**Requirement Ids:**
    
    - REQ-6-006
    - REQ-6-007
    - REQ-6-008
    - REQ-6-010
    - REQ-6-012
    - REQ-7-007
    
**Purpose:** Exposes API endpoints for creating, reading, updating, deleting, and managing landing pages.  
**Logic Description:** Class decorated with @Controller('content/landing-pages'), @ApiTags('Landing Pages'), @UseGuards(JwtAuthGuard). Injects LandingPageService. Methods for CRUD, duplication, status changes. Uses DTOs. Considers language/locale.  
**Documentation:**
    
    - **Summary:** Controller handling all API requests for landing page management, including CRUD, duplication, and status changes.
    
**Namespace:** AdManager.ContentManagement.Api.V1.LandingPage  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/modules/content-management/api/landing-page/landing-page.service.ts  
**Description:** NestJS service providing business logic for landing page management.  
**Template:** NestJS Service  
**Dependancy Level:** 2  
**Name:** LandingPageService  
**Type:** Service  
**Relative Path:** landing-page/landing-page.service.ts  
**Repository Id:** REPO-CONTENT-007  
**Pattern Ids:**
    
    - Service Layer
    
**Members:**
    
    
**Methods:**
    
    - **Name:** create  
**Parameters:**
    
    - createLandingPageDto: CreateLandingPageReqDto
    - userId: string
    
**Return Type:** Promise<LandingPageResDto>  
**Attributes:** public|async  
    - **Name:** findAll  
**Parameters:**
    
    - query: PaginationQueryDto
    
**Return Type:** Promise<PaginatedResponseDto<LandingPageResDto>>  
**Attributes:** public|async  
    - **Name:** findOne  
**Parameters:**
    
    - id: string
    - language?: string
    
**Return Type:** Promise<LandingPageResDto>  
**Attributes:** public|async  
    - **Name:** findBySlug  
**Parameters:**
    
    - slug: string
    - language?: string
    
**Return Type:** Promise<LandingPageResDto>  
**Attributes:** public|async  
    - **Name:** update  
**Parameters:**
    
    - id: string
    - updateLandingPageDto: UpdateLandingPageReqDto
    - language?: string
    
**Return Type:** Promise<LandingPageResDto>  
**Attributes:** public|async  
    - **Name:** remove  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<void>  
**Attributes:** public|async  
    - **Name:** duplicate  
**Parameters:**
    
    - id: string
    - userId: string
    
**Return Type:** Promise<LandingPageResDto>  
**Attributes:** public|async  
    - **Name:** changeStatus  
**Parameters:**
    
    - id: string
    - status: PublicationStatus
    
**Return Type:** Promise<LandingPageResDto>  
**Attributes:** public|async  
    
**Implemented Features:**
    
    - Landing Page Business Logic
    - Data Validation
    - Interaction with Data Layer
    - Localization Logic
    - Campaign Association
    
**Requirement Ids:**
    
    - REQ-6-006
    - REQ-6-007
    - REQ-6-008
    - REQ-6-010
    - REQ-6-012
    - REQ-7-007
    
**Purpose:** Handles the core business logic for managing landing pages, including data persistence and retrieval.  
**Logic Description:** Class decorated with @Injectable(). Interacts with data persistence. Implements CRUD, duplication, status changes, campaign association, SEO field management, and localization. Manages storage and retrieval of interactive elements (banners, timers, CTAs).  
**Documentation:**
    
    - **Summary:** Service class containing the business logic for landing page operations, data manipulation, and persistence.
    
**Namespace:** AdManager.ContentManagement.Api.V1.LandingPage  
**Metadata:**
    
    - **Category:** BusinessLogic
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableAdvancedLandingPageElements
  - enableBlogScheduling
  
- **Database Configs:**
  
  - CONTENT_DB_CONNECTION_STRING
  


---

