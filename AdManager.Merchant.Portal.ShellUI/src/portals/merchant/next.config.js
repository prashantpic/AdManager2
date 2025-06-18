/**
 * @type {import('next').NextConfig}
 * @summary Next.js configuration for the Merchant Portal Shell UI.
 * @description This file configures Next.js specific settings including internationalization (i18n) routing,
 * build options, and other customizations.
 * It ensures that the application supports English and Arabic languages with appropriate routing.
 * The `i18n` configuration enables locale detection and path-based localization (e.g., /en/dashboard, /ar/dashboard).
 * `i18next-http-backend` is configured separately (in `src/config/i18n.config.ts`) to load translation JSON files,
 * typically from the `/public/locales` directory. This configuration ensures that Next.js's i18n routing
 * works in tandem with `react-i18next` for translation management.
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  /**
   * @property {object} i18n - Internationalization configuration.
   * @property {string[]} i18n.locales - A list of all locales supported by the application.
   * @property {string} i18n.defaultLocale - The default locale to be used when a locale is not detected.
   * @property {boolean} [i18n.localeDetection=true] - Whether to automatically detect the user's preferred locale.
   * @see {@link https://nextjs.org/docs/advanced-features/i18n-routing}
   */
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: true, // Recommended to keep true for auto-detection
  },
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   // Example: SVGR configuration
  //   // config.module.rules.push({
  //   //   test: /\.svg$/,
  //   //   use: ['@svgr/webpack'],
  //   // });
  //   return config;
  // },
  // basePath: '/merchant-portal', // If the app is not at the domain root
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.example.com' : undefined, // For CDN
};

module.exports = nextConfig;