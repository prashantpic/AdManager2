import DashboardIcon from '@mui/icons-material/Dashboard';
import CampaignIcon from '@mui/icons-material/Campaign';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WebIcon from '@mui/icons-material/Web';
import ArticleIcon from '@mui/icons-material/Article';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentsIcon from '@mui/icons-material/Payments';
import { SvgIconComponent } from '@mui/icons-material'; // For type safety

/**
 * @file navConfig.ts
 * @summary Configuration for navigation items in the Merchant Portal.
 * @description This file exports an array of `NavItem` objects that define the
 * structure and properties of the primary navigation menu, typically used in the sidebar.
 * Each item includes an ID, a translation key for its label, a path for routing,
 * an optional icon, required permissions for access control, and optional children for nested menus.
 */

/**
 * @interface NavItem
 * @description Defines the structure for a navigation item.
 * @property {string} id - A unique identifier for the navigation item.
 * @property {string} labelKey - The translation key for the item's display label (used by react-i18next).
 * @property {string} path - The route path the item navigates to.
 * @property {SvgIconComponent} [icon] - (Optional) The MUI SvgIcon component to display next to the label.
 * @property {string[]} [requiredPermissions] - (Optional) An array of permission strings required to view/access this item.
 * @property {NavItem[]} [children] - (Optional) An array of `NavItem` objects for creating nested/collapsible sub-menus.
 */
export interface NavItem {
  id: string;
  labelKey: string;
  path: string;
  icon?: SvgIconComponent; // Using SvgIconComponent for type safety with MUI icons
  requiredPermissions?: string[];
  children?: NavItem[];
}

/**
 * @constant navConfig
 * @description Array of `NavItem` objects defining the primary navigation structure for the portal.
 * This configuration is used by layout components like the Sidebar to render navigation links.
 * Permissions are checked against the authenticated user's context to conditionally display items.
 * @type {NavItem[]}
 */
export const navConfig: NavItem[] = [
  {
    id: 'dashboard',
    labelKey: 'navigation.dashboard',
    path: '/dashboard',
    icon: DashboardIcon,
    requiredPermissions: ['view_dashboard'],
  },
  {
    id: 'campaigns',
    labelKey: 'navigation.campaigns',
    path: '/campaigns',
    icon: CampaignIcon,
    requiredPermissions: ['manage_campaigns'],
  },
  {
    id: 'content',
    labelKey: 'navigation.content',
    path: '/content', // Main path for content hub
    icon: ContentCopyIcon,
    requiredPermissions: ['manage_content'],
    children: [
      {
        id: 'landingPages',
        labelKey: 'navigation.landingPages',
        path: '/content/landing-pages', // Specific path if ContentPage uses internal routing/tabs
        icon: WebIcon,
        requiredPermissions: ['manage_landing_pages'],
      },
      {
        id: 'blogPosts',
        labelKey: 'navigation.blogPosts',
        path: '/content/blog', // Specific path if ContentPage uses internal routing/tabs
        icon: ArticleIcon,
        requiredPermissions: ['manage_blog_posts'],
      },
    ],
  },
  {
    id: 'products',
    labelKey: 'navigation.products',
    path: '/products',
    icon: StorefrontIcon,
    requiredPermissions: ['manage_products'],
  },
  {
    id: 'promotions',
    labelKey: 'navigation.promotions',
    path: '/promotions',
    icon: LocalOfferIcon,
    requiredPermissions: ['manage_promotions'],
  },
  {
    id: 'analytics',
    labelKey: 'navigation.analytics',
    path: '/analytics',
    icon: AnalyticsIcon,
    requiredPermissions: ['view_analytics'],
  },
  {
    id: 'affiliates',
    labelKey: 'navigation.affiliates',
    path: '/affiliates',
    icon: GroupIcon,
    requiredPermissions: ['manage_affiliates'],
  },
  {
    id: 'settings',
    labelKey: 'navigation.settings',
    path: '/settings',
    icon: SettingsIcon,
    requiredPermissions: ['manage_settings'],
  },
  {
    id: 'billing',
    labelKey: 'navigation.billing',
    path: '/billing',
    icon: PaymentsIcon,
    requiredPermissions: ['manage_billing'],
  },
];