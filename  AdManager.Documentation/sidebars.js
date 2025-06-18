// sidebars.js
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  userGuideSidebar: [
    { type: 'doc', id: 'intro', label: 'Introduction' },
    { type: 'doc', id: 'glossary', label: 'Glossary' },
    { type: 'doc', id: 'user-guides/index', label: 'Overview' },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        /* 'user-guides/getting-started/account-setup', etc. */
      ],
    },
    {
      type: 'category',
      label: 'Campaign Management',
      items: [
        'user-guides/campaign-management/creating-campaigns',
        /* other campaign docs, e.g., 'user-guides/campaign-management/troubleshooting-delivery' */
      ],
    },
    /*
    {
      type: 'category',
      label: 'Product Catalog Management',
      items: [ 'user-guides/product-catalogs/index', ... ],
    },
    {
      type: 'category',
      label: 'Promotions & Offers',
      items: [ 'user-guides/promotions/index', ... ],
    },
    {
      type: 'category',
      label: 'A/B Testing',
      items: [ 'user-guides/ab-testing/index', ... ],
    },
    {
      type: 'category',
      label: 'Analytics & Reporting',
      items: [ 'user-guides/analytics/index', ... ],
    },
    */
    { type: 'doc', id: 'user-guides/faq', label: 'FAQ' },
  ],
  technicalDocSidebar: [
    { type: 'doc', id: 'intro', label: 'Introduction' },
    { type: 'doc', id: 'glossary', label: 'Glossary' },
    { type: 'doc', id: 'technical/index', label: 'Overview' },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'technical/architecture/system-overview',
        /* other architecture docs */
      ],
    },
    {
      type: 'category',
      label: 'API Specifications',
      items: [
        'technical/api-specifications/index',
        /* links or pages for specific APIs */
      ],
    },
    /*
    {
      type: 'category',
      label: 'Data Models',
      items: [ 'technical/data-models/index', ... ],
    },
    {
      type: 'category',
      label: 'Deployment & Operations',
      items: [ 'technical/deployment/index', ... ],
    },
    {
      type: 'category',
      label: 'Security Design',
      items: [ 'technical/security/index', ... ],
    },
    */
  ],
  adminDocSidebar: [
    { type: 'doc', id: 'intro', label: 'Introduction' },
    { type: 'doc', id: 'glossary', label: 'Glossary' },
    { type: 'doc', id: 'administrative/index', label: 'Overview' },
    {
      type: 'category',
      label: 'Platform Management',
      items: [
        'administrative/platform-management/system-configuration',
        /* 'administrative/platform-management/health-monitoring', */
        /* 'administrative/platform-management/user-role-management', */
      ],
    },
    /*
    {
      type: 'category',
      label: 'Billing Configuration',
      items: [ 'administrative/billing/index', ... ],
    },
    {
      type: 'category',
      label: 'Maintenance Procedures',
      items: [ 'administrative/maintenance/index', ... ],
    },
    */
  ],
  trainingSidebar: [
    { type: 'doc', id: 'intro', label: 'Introduction' },
    { type: 'doc', id: 'glossary', label: 'Glossary' },
    { type: 'doc', id: 'training/index', label: 'Overview' },
    {
      type: 'category',
      label: 'Merchant Admin Training',
      items: [
        'training/merchant-admin-training/module-1-platform-overview',
        /* other modules for merchant admin */
      ],
    },
    /*
    {
      type: 'category',
      label: 'Campaign Manager Training',
      items: [ ... ],
    },
    {
      type: 'category',
      label: 'Platform Administrator Training',
      items: [ ... ],
    },
    */
  ],
};