/**
 * @file blog.types.ts
 * @summary TypeScript type definitions for the Blogging Platform feature.
 * @description Contains interfaces defining the structure of blog posts,
 * their SEO settings, content, and related data transfer objects.
 * These types ensure consistency and type safety within the blogging platform module.
 * @requires REQ-3395
 */

/**
 * @interface BlogPostSeo
 * @description Defines the SEO (Search Engine Optimization) settings for a blog post.
 * @property {string} metaTitle - The meta title of the blog post.
 * @property {string} metaDescription - The meta description of the blog post.
 * @property {string} slug - The URL-friendly slug for the blog post.
 * @property {string[]} [keywords] - (Optional) Array of keywords or tags for SEO.
 * @property {string} [canonicalUrl] - (Optional) Canonical URL if the content is duplicated.
 * @property {string} [ogImageUrl] - (Optional) Open Graph image URL for social sharing.
 */
export interface BlogPostSeo {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImageUrl?: string;
}

/**
 * @interface BlogAuthor
 * @description Defines the structure for a blog post author.
 * @property {string} id - Unique identifier for the author.
 * @property {string} name - Display name of the author.
 * @property {string} [avatarUrl] - (Optional) URL to the author's avatar image.
 */
export interface BlogAuthor {
  id: string; // Corresponds to UserProfile.id
  name: string;
  avatarUrl?: string;
}

/**
 * @interface BlogCategory
 * @description Defines the structure for a blog category.
 * @property {string} id - Unique identifier for the category.
 * @property {string} name - Name of the category.
 * @property {string} slug - URL-friendly slug for the category.
 */
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

/**
 * @interface BlogPost
 * @description Defines the complete structure of a blog post.
 * @property {string} id - Unique identifier for the blog post.
 * @property {string} merchantId - Identifier of the merchant who owns this blog post.
 * @property {string} title - The title of the blog post.
 * @property {any} content - The main content of the blog post, typically a JSON structure from a rich text editor (e.g., TipTap, Editor.js).
 * @property {string} [excerpt] - (Optional) A short summary or excerpt of the blog post.
 * @property {string} [featuredImageUrl] - (Optional) URL of the main image associated with the blog post.
 * @property {'draft' | 'published' | 'scheduled' | 'archived'} status - The current status of the blog post.
 * @property {BlogPostSeo} seo - SEO settings for the blog post.
 * @property {string} authorId - Identifier of the user who authored the post.
 * @property {BlogAuthor} [author] - (Optional, populated on fetch) Author details.
 * @property {string} [publishDate] - (Optional) ISO date string of when the post is scheduled to be or was published.
 * @property {string} createdAt - ISO date string of when the post was created.
 * @property {string} updatedAt - ISO date string of when the post was last updated.
 * @property {string[]} [tags] - (Optional) Array of tags associated with the post.
 * @property {string[]} [categoryIds] - (Optional) Array of category IDs associated with the post.
 * @property {BlogCategory[]} [categories] - (Optional, populated on fetch) Category details.
 * @property {number} [viewCount] - (Optional) Number of views the post has received.
 */
export interface BlogPost {
  id: string;
  merchantId: string;
  title: string;
  content: any; // Could be a specific JSON structure like EditorJS.OutputData or TipTap JSON
  excerpt?: string;
  featuredImageUrl?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  seo: BlogPostSeo;
  authorId: string; // Should link to a User or Author entity
  author?: BlogAuthor; // Denormalized author info for display
  publishDate?: string; // ISO Date string
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  tags?: string[];
  categoryIds?: string[];
  categories?: BlogCategory[]; // Denormalized category info for display
  viewCount?: number;
}

/**
 * @type BlogPostData
 * @description Represents the data required to create or update a blog post.
 * Omits server-generated fields like `id`, `merchantId`, `authorId` (usually set by backend based on authenticated user),
 * `createdAt`, `updatedAt`, and potentially denormalized fields like `author` and `categories`.
 */
export type BlogPostData = Omit<BlogPost, 'id' | 'merchantId' | 'authorId' | 'author' | 'createdAt' | 'updatedAt' | 'categories' | 'viewCount'>;


/**
 * @interface BlogListParams
 * @description Parameters for listing blog posts.
 * @property {number} [page] - Page number for pagination.
 * @property {number} [limit] - Number of items per page.
 * @property {string} [sortBy] - Field to sort by (e.g., 'createdAt', 'publishDate', 'title').
 * @property {'asc' | 'desc'} [sortOrder] - Sort order.
 * @property {string} [search] - Search term for titles or content.
 * @property {string} [authorId] - Filter by author.
 * @property {string} [tag] - Filter by tag.
 * @property {string} [categoryId] - Filter by category.
 * @property {'draft' | 'published' | 'scheduled' | 'archived'} [status] - Filter by status.
 */
export interface BlogListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  authorId?: string;
  tag?: string;
  categoryId?: string;
  status?: 'draft' | 'published' | 'scheduled' | 'archived';
}

// Re-using PaginatedResponse from landingPage.types.ts if available globally,
// otherwise define it here or import. For this file, assuming it might be re-defined or imported.
// If it's intended to be shared, it should be in a common types file.
// For now, let's assume it can be imported or is defined elsewhere (e.g. src/types/index.ts)
// import { PaginatedResponse } from '@/types'; // Example import