import type { ComponentType, LazyExoticComponent } from 'react';

/**
 * @file routes.ts
 * @summary Defines the metadata for application routes.
 * @description This file exports an array of `RouteConfig` objects. In a Next.js `pages` router application,
 * the actual routing is file-system based. This configuration is used for *metadata* associated with those
 * routes, such as protection status, layout, required permissions, and internationalization keys for titles.
 * It helps in centralizing route-related information that isn't directly handled by the file system.
 * The `element` or `componentPath` property is illustrative of how one might link this metadata
 * to the actual Next.js page components, but Next.js itself resolves components based on file paths.
 */

/**
 * @interface LayoutProps
 * @description Props for layout components.
 * @property {React.ReactNode} children - The child components to be rendered within the layout.
 */
export interface LayoutProps {
  children: React.ReactNode;
}

/**
 * @interface RouteConfig
 * @description Defines the structure for a route's metadata.
 * @property {string} path - The URL path for the route (e.g., '/dashboard').
 * @property {string} componentPath - Illustrative path to the Next.js page component (e.g., 'pages/dashboard.tsx'). Next.js handles actual component resolution.
 * @property {boolean} [isProtected] - Whether the route requires authentication. Defaults to `false`.
 * @property {string} [layout] - Identifier for the layout component to be used (e.g., 'MainLayout', 'AuthLayout'). Logic in `_app.tsx` or page components would apply this.
 * @property {string[]} [requiredPermissions] - Array of permission strings required to access this route.
 * @property {string} [titleKey] - Translation key for the page title (e.g., 'navigation.dashboard').
 * @property {RouteConfig[]} [children] - For nested route metadata, if applicable (less common for page metadata in Next.js pages router).
 */
export interface RouteConfig {
  path: string;
  componentPath?: string; // Illustrative, Next.js uses file system.
  isProtected?: boolean;
  layout?: string; // Identifier for layout type
  requiredPermissions?: string[];
  titleKey?: string;
  children?: RouteConfig[]; // For structured metadata
}

/**
 * @constant routeConfigs
 * @description Array of route configurations for the Merchant Portal.
 * This metadata can be used by `AuthGuard`, layout selectors, breadcrumbs, and page title utilities.
 *
 * Paths like `/campaigns/*` correspond to Next.js dynamic routes, e.g., `/pages/campaigns/[...slug].tsx`.
 * The `path` property here should match the base of such dynamic routes for metadata lookup.
 * @type {RouteConfig[]}
 */
export const routeConfigs: RouteConfig[] = [
  {
    path: '/login',
    componentPath: 'pages/login.tsx',
    isProtected: false,
    layout: 'AuthLayout', // Assuming a different layout for login
    titleKey: 'login.title',
  },
  {
    path: '/dashboard',
    componentPath: 'pages/DashboardPage.tsx', // SDS uses DashboardPage.tsx
    isProtected: true,
    layout: 'MainLayout',
    requiredPermissions: ['view_dashboard'],
    titleKey: 'navigation.dashboard',
  },
  {
    path: '/content',
    componentPath: 'pages/ContentPage.tsx', // SDS uses ContentPage.tsx
    isProtected: true,
    layout: 'MainLayout',
    requiredPermissions: ['manage_content'],
    titleKey: 'navigation.content',
    // Sub-routes or tabs within ContentPage would be handled by ContentPage.tsx itself
  },
  {
    path: '/campaigns', // Base path for /campaigns/* or /campaigns/[...slug].tsx
    componentPath: 'pages/campaigns/[...slug].tsx',
    isProtected: true,
    layout: 'MainLayout',
    requiredPermissions: ['manage_campaigns'],
    titleKey: 'navigation.campaigns',
  },
  {
    path: '/products', // Base path for /products/*
    componentPath: 'pages/products/[...slug].tsx',
    isProtected: true,
    layout: 'MainLayout',
    requiredPermissions: ['manage_products'], // Example permission
    titleKey: 'navigation.products',
  },
  {
    path: '/promotions', // Base path for /promotions/*
    componentPath: 'pages/promotions/[...slug].tsx',
    isProtected: true,
    layout: 'MainLayout',
    requiredPermissions: ['manage_promotions'], // Example permission
    titleKey: 'navigation.promotions',
  },
  {
    path: '/analytics', // Base path for /analytics/*
    componentPath: 'pages/analytics/[...slug].tsx',
    isProtected: true,
    layout: 'MainLayout',
    requiredPermissions: ['view_analytics'], // Example permission
    titleKey: 'navigation.analytics',
  },
  {
    path: '/affiliates', // Base path for /affiliates/*
    componentPath: 'pages/affiliates/[...slug].tsx',
    isProtected: true,
    layout: 'MainLayout',
    requiredPermissions: ['manage_affiliates'], // Example permission
    titleKey: 'navigation.affiliates',
  },
  {
    path: '/settings', // Base path for /settings/*
    componentPath: 'pages/settings/[...slug].tsx',
    isProtected: true,
    layout: 'MainLayout',
    requiredPermissions: ['manage_settings'], // Example permission
    titleKey: 'navigation.settings',
  },
  {
    path: '/billing', // Base path for /billing/*
    componentPath: 'pages/billing/[...slug].tsx',
    isProtected: true,
    layout: 'MainLayout',
    requiredPermissions: ['manage_billing'], // Example permission
    titleKey: 'navigation.billing',
  },
  // Add auth-callback route if needed, e.g., for OAuth flows
  // {
  //   path: '/auth-callback',
  //   componentPath: 'pages/auth-callback.tsx',
  //   isProtected: false,
  //   layout: 'AuthLayout',
  //   titleKey: 'authCallback.title',
  // },
];

/**
 * Helper function to find route configuration by path.
 * @param {string} path - The path to search for.
 * @returns {RouteConfig | undefined} The found route configuration or undefined.
 */
export const getRouteConfigByPath = (path: string): RouteConfig | undefined => {
  // Simple match, for dynamic routes a more complex matching logic might be needed
  return routeConfigs.find(route => {
    if (route.path.includes('*') || route.path.includes(':')) { // Basic dynamic route check
      const baseRoute = route.path.split('*')[0].split(':')[0];
      return path.startsWith(baseRoute);
    }
    return route.path === path;
  });
};