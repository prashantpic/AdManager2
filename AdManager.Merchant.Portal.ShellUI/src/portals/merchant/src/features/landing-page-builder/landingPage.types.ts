import type { CSSProperties } from 'react';

/**
 * @file landingPage.types.ts
 * @summary TypeScript type definitions for the Landing Page Builder feature.
 * @description Contains interfaces defining the structure of landing pages,
 * their elements, SEO settings, and data transfer objects.
 * These types ensure consistency and type safety within the landing page builder module.
 * @requires REQ-6-006
 */

/**
 * @interface LandingPageElement
 * @description Defines the structure of an individual element within a landing page.
 * @property {string} id - Unique identifier for the element.
 * @property {'text' | 'image' | 'button' | 'video' | 'countdown' | 'banner' | 'cta' | 'container' | 'spacer' | 'form'} type - The type of the landing page element.
 * @property {Record<string, any>} props - Element-specific properties (e.g., src for image, text for button).
 * @property {CSSProperties} [styles] - (Optional) Custom CSS styles applied to the element.
 * @property {string | LandingPageElement[]} [content] - (Optional) Text content or nested child elements (e.g., for containers).
 */
export interface LandingPageElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'video' | 'countdown' | 'banner' | 'cta' | 'container' | 'spacer' | 'form';
  props: Record<string, any>; // e.g., { text: 'Click me', href: '/path' } for button
  styles?: CSSProperties;
  content?: string | LandingPageElement[]; // For text content or nested elements in a container
}

/**
 * @interface LandingPageSeo
 * @description Defines the SEO (Search Engine Optimization) settings for a landing page.
 * @property {string} title - The meta title of the page.
 * @property {string} description - The meta description of the page.
 * @property {string} slug - The URL-friendly slug for the page.
 * @property {string} [keywords] - (Optional) Comma-separated keywords.
 * @property {string} [ogImageUrl] - (Optional) Open Graph image URL.
 */
export interface LandingPageSeo {
  title: string;
  description: string;
  slug: string;
  keywords?: string;
  ogImageUrl?: string;
}

/**
 * @interface LandingPage
 * @description Defines the complete structure of a landing page.
 * @property {string} id - Unique identifier for the landing page.
 * @property {string} merchantId - Identifier of the merchant who owns this page.
 * @property {string} name - Internal name/label for the landing page.
 * @property {LandingPageElement[]} elements - Array of elements constituting the page content and layout. This represents the page's structure.
 * @property {LandingPageSeo} seo - SEO settings for the page.
 * @property {'draft' | 'published' | 'archived'} status - The current status of the landing page.
 * @property {string} createdAt - ISO date string of when the page was created.
 * @property {string} updatedAt - ISO date string of when the page was last updated.
 * @property {string} [publishedAt] - (Optional) ISO date string of when the page was last published.
 * @property {Record<string, any>} [themeSettings] - (Optional) Page-specific theme overrides (e.g., fonts, colors).
 */
export interface LandingPage {
  id: string;
  merchantId: string;
  name: string;
  elements: LandingPageElement[];
  seo: LandingPageSeo;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  themeSettings?: Record<string, any>;
}

/**
 * @type LandingPageData
 * @description Represents the data required to create or update a landing page.
 * It omits server-generated fields like `id`, `merchantId`, `createdAt`, and `updatedAt`.
 */
export type LandingPageData = Omit<LandingPage, 'id' | 'merchantId' | 'createdAt' | 'updatedAt' | 'publishedAt'>;

/**
 * @interface ListParams
 * @description Generic parameters for listing resources.
 * @property {number} [page] - Page number for pagination.
 * @property {number} [limit] - Number of items per page.
 * @property {string} [sortBy] - Field to sort by.
 * @property {'asc' | 'desc'} [sortOrder] - Sort order.
 * @property {string} [search] - Search term.
 */
export interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: 'draft' | 'published' | 'archived';
}

/**
 * @interface PaginatedResponse<T>
 * @description Generic structure for paginated API responses.
 * @template T - The type of the items in the data array.
 * @property {T[]} data - Array of items for the current page.
 * @property {number} total - Total number of items available.
 * @property {number} page - Current page number.
 * @property {number} limit - Items per page.
 * @property {number} totalPages - Total number of pages.
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}