/**
 * @file env.ts
 * @summary Environment configuration for the Merchant Portal Shell UI.
 * @description This file exports an `AppConfig` object that reads environment variables
 * prefixed with `NEXT_PUBLIC_`. It provides default values for development if
 * the variables are not set. This ensures a centralized way to access
 * environment-specific settings with type safety.
 */

/**
 * @interface AppConfigType
 * @description Defines the structure for application configuration variables.
 * @property {string} API_BASE_URL - The base URL for the main backend API.
 * @property {string} AUTH_SERVICE_URL - The URL for the authentication service (could be same as API_BASE_URL or different).
 * @property {string} FEATURE_FLAG_SERVICE_URL - (Optional) URL for a remote feature flag service.
 * @property {string} AUTH_LOGIN_ENDPOINT - API endpoint for user login.
 * @property {string} AUTH_LOGOUT_ENDPOINT - API endpoint for user logout.
 * @property {string} AUTH_REFRESH_TOKEN_ENDPOINT - API endpoint for refreshing authentication tokens.
 * @property {string} USER_PROFILE_ENDPOINT - API endpoint for fetching user profile data.
 * @property {string} LANDING_PAGES_API_ENDPOINT - API endpoint for landing page CRUD operations.
 * @property {string} BLOG_POSTS_API_ENDPOINT - API endpoint for blog post CRUD operations.
 */
interface AppConfigType {
  API_BASE_URL: string;
  AUTH_SERVICE_URL: string;
  FEATURE_FLAG_SERVICE_URL?: string;
  AUTH_LOGIN_ENDPOINT: string;
  AUTH_LOGOUT_ENDPOINT: string;
  AUTH_REFRESH_TOKEN_ENDPOINT: string;
  USER_PROFILE_ENDPOINT: string;
  LANDING_PAGES_API_ENDPOINT: string;
  BLOG_POSTS_API_ENDPOINT: string;
}

/**
 * @constant AppConfig
 * @description Application configuration object, populated from environment variables.
 * Provides default values for development.
 * @type {AppConfigType}
 */
export const AppConfig: AppConfigType = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api') + '/auth',
  FEATURE_FLAG_SERVICE_URL: process.env.NEXT_PUBLIC_FEATURE_FLAG_SERVICE_URL,

  // Specific API Endpoints (can be relative to API_BASE_URL or absolute)
  AUTH_LOGIN_ENDPOINT: process.env.NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT || '/auth/login',
  AUTH_LOGOUT_ENDPOINT: process.env.NEXT_PUBLIC_AUTH_LOGOUT_ENDPOINT || '/auth/logout',
  AUTH_REFRESH_TOKEN_ENDPOINT: process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_ENDPOINT || '/auth/refresh-token',
  USER_PROFILE_ENDPOINT: process.env.NEXT_PUBLIC_USER_PROFILE_ENDPOINT || '/users/me',
  LANDING_PAGES_API_ENDPOINT: process.env.NEXT_PUBLIC_LANDING_PAGES_API_ENDPOINT || '/content/landing-pages',
  BLOG_POSTS_API_ENDPOINT: process.env.NEXT_PUBLIC_BLOG_POSTS_API_ENDPOINT || '/content/blog-posts',
};

/**
 * JSDoc comment for documentation generation.
 * This ensures that environment variable handling is well-documented.
 */