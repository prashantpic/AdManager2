import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Ad Manager Platform Documentation',
  tagline: 'Comprehensive guides and resources for Ad Manager',
  favicon: 'img/logo.png', // This assumes logo.png is in static/img/

  // Set the production url of your site here
  url: 'https://docs.[ActualPlatformDomain].sa',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: '[YourOrganizationName]', // Usually your GitHub org/user name.
  projectName: 'ad-manager-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    // Future consideration: add 'ar' for Arabic support if needed.
    // localeConfigs: {
    //   ar: {
    //     direction: 'rtl',
    //   },
    // },
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Optional: Please change this to your repo.
          // Remove this to remove the "Edit this page" links.
          // editUrl: 'https://github.com/[YourOrganizationName]/[YourRepoName]/tree/main/',
        },
        blog: false, // Disable the blog plugin as per SDS 4.1.2
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/admanager-social-card.jpg', // Assumes admanager-social-card.jpg is in static/img/
      navbar: {
        title: 'Ad Manager Platform',
        logo: {
          alt: 'Ad Manager Logo',
          src: 'img/logo.png', // Assumes logo.png is in static/img/
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'userGuideSidebar',
            position: 'left',
            label: 'User Guides',
          },
          {
            type: 'docSidebar',
            sidebarId: 'technicalDocSidebar',
            position: 'left',
            label: 'Technical Docs',
          },
          {
            type: 'docSidebar',
            sidebarId: 'adminDocSidebar',
            position: 'left',
            label: 'Admin Docs',
          },
          {
            type: 'docSidebar',
            sidebarId: 'trainingSidebar',
            position: 'left',
            label: 'Training',
          },
          // Optional: Version dropdown can be added here if versioning is implemented
          // {
          //   type: 'docsVersionDropdown',
          //   position: 'right',
          // },
          // Optional: Language dropdown can be added here if i18n is expanded
          // {
          //   type: 'localeDropdown',
          //   position: 'right',
          // },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          // Footer links can be configured here. Example:
          // {
          //   title: 'Docs',
          //   items: [
          //     {
          //       label: 'Introduction',
          //       to: '/docs/intro',
          //     },
          //   ],
          // },
          // {
          //   title: 'Community',
          //   items: [
          //     {
          //       label: 'Stack Overflow',
          //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
          //     },
          //   ],
          // },
          // {
          //   title: 'More',
          //   items: [
          //     {
          //       label: 'GitHub',
          //       href: 'https://github.com/[YourOrganizationName]/ad-manager-docs', // Replace with actual repo
          //     },
          //   ],
          // },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} [YourOrganizationName]. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),

  plugins: [
    // Configure plugins here.
    // Example for local search (install 'docusaurus-plugin-search-local' first):
    // [
    //   require.resolve('docusaurus-plugin-search-local'),
    //   {
    //     hashed: true,
    //     // other options
    //   },
    // ],
  ],
};

export default config;