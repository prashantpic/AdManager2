/**
 * @file index.ts
 * @summary Barrel file for re-exporting common global TypeScript types and interfaces.
 * @description This file centralizes the exports of shared type definitions from various
 * type files within the application, making them easier to import across different modules.
 * It promotes cleaner import statements and better organization of global types.
 */

// Export types related to Merchant Profile and Permissions
export * from './merchant.types';

// Export types related to Authentication (UserProfile, Credentials, etc.)
// These are defined in `core/auth/auth.types.ts` and might be re-exported here for broader visibility if needed,
// or components can import directly from their original location.
// For example, if UserProfile is widely used outside auth module:
export type { UserProfile, LoginCredentials, AuthResponse, TokenResponse } from '../core/auth/auth.types';

// Export types related to UI State, like NotificationPayload
// Original location: `core/state/slices/uiSlice.ts`
// Example re-export if NotificationPayload is used widely:
export type { NotificationPayload, UIState } from '../core/state/slices/uiSlice'; // Assuming NotificationPayload is exported from uiSlice.ts

// Export types for shell-managed features if they are considered globally relevant
export type { LandingPage, LandingPageElement, LandingPageSeo, LandingPageData, PaginatedResponse, ListParams as LandingPageListParams } from '../features/landing-page-builder/landingPage.types';
export type { BlogPost, BlogPostSeo, BlogPostData, BlogListParams } from '../features/blogging-platform/blog.types';


// Add other global types or re-exports as the application grows.
// For example, if there are common API response structures or utility types:
// export * from './api.types';
// export * from './utility.types';

/**
 * @interface PaginatedResponse (Generic - if not already defined and exported from feature types)
 * @description Generic structure for paginated API responses.
 * @template T - The type of the items in the data array.
 */
// Ensure PaginatedResponse is defined or re-exported if it's meant to be generic.
// It's defined in landingPage.types.ts, re-exporting it from there is good.

/**
 * @interface AppRoute
 * @description Basic structure for application route objects, often used for navigation links or breadcrumbs.
 * @property {string} path - The URL path of the route.
 * @property {string} labelKey - Translation key for the route's label.
 * @property {React.ElementType} [icon] - Optional icon component for the route.
 * @property {string[]} [permissions] - Optional permissions required to access the route.
 */
// This is an example, real RouteConfig is in `config/routes.ts`
// export interface AppRoute {
//   path: string;
//   labelKey: string;
//   icon?: React.ElementType;
//   permissions?: string[];
// }