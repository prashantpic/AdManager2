# Specification

# 1. Files

- **Path:** package.json  
**Description:** Defines project dependencies for Docusaurus, scripts for running, building, and deploying the documentation site. Specifies Docusaurus version and any plugins.  
**Template:** Node.js Package Manifest  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** package.json  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - DocsAsCode
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Management for Documentation Site
    - Build Scripts for Documentation
    
**Requirement Ids:**
    
    - 5.9
    
**Purpose:** To manage Docusaurus installation, plugins, and provide scripts for development and build processes of the documentation portal.  
**Logic Description:** Contains 'dependencies' for Docusaurus core and plugins (e.g., docusaurus-plugin-search-local). Includes 'scripts' like 'start', 'build', 'serve', 'deploy'.  
**Documentation:**
    
    - **Summary:** Standard NPM package file to manage the Docusaurus project, its dependencies, and lifecycle scripts.
    
**Namespace:** AdManager.Docs.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** docusaurus.config.js  
**Description:** Main Docusaurus configuration file. Defines site metadata (title, tagline, URL, base URL), theme configuration, presets, plugins, navbar, and footer.  
**Template:** Docusaurus Configuration  
**Dependancy Level:** 0  
**Name:** docusaurus.config  
**Type:** Configuration  
**Relative Path:** docusaurus.config.js  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - DocsAsCode
    - StaticSiteGeneration
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Site-wide Documentation Configuration
    - Theme and Plugin Setup
    - Navigation Structure (Navbar/Footer)
    - SEO Defaults
    
**Requirement Ids:**
    
    - 5.9
    - 3.2.5 (Documentation part)
    
**Purpose:** To configure the Docusaurus static site generator, defining the overall structure, appearance, and behavior of the documentation portal.  
**Logic Description:** Exports a configuration object. Key fields include 'title', 'tagline', 'url', 'baseUrl', 'organizationName', 'projectName', 'onBrokenLinks', 'onBrokenMarkdownLinks', 'favicon', 'themeConfig' (navbar, footer, prism theme, colorMode), 'presets' (e.g., @docusaurus/preset-classic with docs, blog, theme settings), 'plugins'.  
**Documentation:**
    
    - **Summary:** Central configuration for the Docusaurus documentation site, controlling metadata, styling, navigation, and plugin integrations.
    
**Namespace:** AdManager.Docs.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** sidebars.js  
**Description:** Defines the structure of the sidebar navigation for the documentation section. Maps document IDs or paths to sidebar items, categories, and links.  
**Template:** Docusaurus Sidebar Configuration  
**Dependancy Level:** 1  
**Name:** sidebars  
**Type:** Configuration  
**Relative Path:** sidebars.js  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - InformationArchitecture
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Documentation Sidebar Navigation Structure
    - Content Organization for Docs
    
**Requirement Ids:**
    
    - 5.9
    - 3.2.5 (Documentation part)
    
**Purpose:** To define the navigation hierarchy for the main documentation content, enabling users to easily browse through different sections and topics.  
**Logic Description:** Exports an object where keys are sidebar IDs and values are arrays of items. Items can be document IDs, category objects (with 'type: category', 'label', 'items', 'link'), or links. This file will structure user guides, technical docs, admin docs, and training materials.  
**Documentation:**
    
    - **Summary:** Controls the sidebar layout for the 'docs' section, organizing all documentation pages into a navigable structure.
    
**Namespace:** AdManager.Docs.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** docs/intro.md  
**Description:** Introduction page for the Ad Manager Platform documentation. Provides an overview of the platform and how to navigate the documentation.  
**Template:** Markdown Document  
**Dependancy Level:** 1  
**Name:** intro  
**Type:** DocumentationContent  
**Relative Path:** docs/intro.md  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - DocsAsCode
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Documentation Portal Welcome Page
    - Platform Overview
    
**Requirement Ids:**
    
    - 5.9
    - 3.2.5 (Documentation part)
    
**Purpose:** To provide a starting point for users visiting the documentation portal, explaining the Ad Manager platform's purpose and guiding them to relevant sections.  
**Logic Description:** Contains a welcome message, a brief explanation of the Ad Manager Platform, and links to major documentation sections like User Guides, Technical Documentation, and Administrative Guides.  
**Documentation:**
    
    - **Summary:** The main landing page within the 'docs' section, offering an overview of the Ad Manager Platform and its documentation structure.
    
**Namespace:** AdManager.Docs  
**Metadata:**
    
    - **Category:** GeneralDocumentation
    
- **Path:** docs/user-guides/index.md  
**Description:** Overview page for User Guides, targeted at merchants (Merchant Admins, Campaign Managers). Introduces the topics covered in this section.  
**Template:** Markdown Document  
**Dependancy Level:** 2  
**Name:** index  
**Type:** DocumentationContent  
**Relative Path:** docs/user-guides/index.md  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - DocsAsCode
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - User Guides Section Overview
    
**Requirement Ids:**
    
    - REQ-SUD-001
    - 5.9 (User Documentation)
    - 3.2.5 (Documentation part)
    
**Purpose:** To serve as the entry point for the User Guides section, outlining the available guides and tutorials for merchants.  
**Logic Description:** Provides a brief introduction to the User Guides section. Lists key areas covered such as Getting Started, Campaign Management, Product Catalogs, Promotions, Analytics, etc., with links to respective sub-sections or pages.  
**Documentation:**
    
    - **Summary:** Landing page for all user-facing guides and tutorials, helping merchants understand and use Ad Manager features.
    
**Namespace:** AdManager.Docs.UserGuides  
**Metadata:**
    
    - **Category:** UserDocumentation
    
- **Path:** docs/user-guides/campaign-management/creating-campaigns.md  
**Description:** Step-by-step guide for merchants on how to create new advertising campaigns using the Ad Manager platform.  
**Template:** Markdown Document  
**Dependancy Level:** 3  
**Name:** creating-campaigns  
**Type:** DocumentationContent  
**Relative Path:** docs/user-guides/campaign-management/creating-campaigns.md  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - DocsAsCode
    - TutorialStyle
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - User Guide: Campaign Creation Tutorial
    
**Requirement Ids:**
    
    - REQ-SUD-001
    - 5.9 (User Documentation)
    - 3.2.5 (Documentation part)
    - 7.3 (Training Material)
    
**Purpose:** To enable merchants to independently create advertising campaigns by following detailed instructions.  
**Logic Description:** Covers prerequisites, navigating to the campaign creation UI, defining campaign objectives, name, target ad networks, budget, schedule, initial status, and associating product catalogs or promotions if applicable. Includes screenshots and explanations of fields.  
**Documentation:**
    
    - **Summary:** A tutorial guiding merchants through the process of creating a new advertising campaign from start to finish.
    
**Namespace:** AdManager.Docs.UserGuides.CampaignManagement  
**Metadata:**
    
    - **Category:** UserDocumentation
    
- **Path:** docs/user-guides/faq.md  
**Description:** Frequently Asked Questions (FAQs) for merchants regarding the Ad Manager Platform features and common issues.  
**Template:** Markdown Document  
**Dependancy Level:** 2  
**Name:** faq  
**Type:** DocumentationContent  
**Relative Path:** docs/user-guides/faq.md  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - DocsAsCode
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - User FAQs
    
**Requirement Ids:**
    
    - REQ-SUD-001
    - 5.9 (User Documentation)
    - 3.2.5 (Documentation part)
    - 7.3 (Training Material)
    
**Purpose:** To provide quick answers to common questions merchants may have about using the Ad Manager Platform.  
**Logic Description:** Contains a list of questions and answers categorized by feature or topic (e.g., Campaigns, Billing, Product Catalogs). Answers should be concise and link to more detailed documentation where necessary.  
**Documentation:**
    
    - **Summary:** A collection of frequently asked questions and their answers to assist merchants with common queries and troubleshooting.
    
**Namespace:** AdManager.Docs.UserGuides  
**Metadata:**
    
    - **Category:** UserDocumentation
    
- **Path:** docs/technical/index.md  
**Description:** Overview page for Technical Documentation, targeted at developers and system architects. Introduces the topics covered.  
**Template:** Markdown Document  
**Dependancy Level:** 2  
**Name:** index  
**Type:** DocumentationContent  
**Relative Path:** docs/technical/index.md  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - DocsAsCode
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Technical Documentation Section Overview
    
**Requirement Ids:**
    
    - REQ-SUD-002
    - 5.9 (Technical Documentation)
    
**Purpose:** To serve as the entry point for the Technical Documentation section, guiding developers and architects to relevant information.  
**Logic Description:** Provides an introduction to the technical aspects of the Ad Manager Platform. Lists key areas such as Architecture, Data Models, API Specifications, Deployment, Operations, and Security, with links to respective sub-sections.  
**Documentation:**
    
    - **Summary:** Landing page for all technical documentation related to the Ad Manager Platform's design, implementation, and operation.
    
**Namespace:** AdManager.Docs.Technical  
**Metadata:**
    
    - **Category:** TechnicalDocumentation
    
- **Path:** docs/technical/architecture/system-overview.md  
**Description:** Provides a high-level overview of the Ad Manager Platform's system architecture, including key components and their interactions.  
**Template:** Markdown Document  
**Dependancy Level:** 3  
**Name:** system-overview  
**Type:** DocumentationContent  
**Relative Path:** docs/technical/architecture/system-overview.md  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - DocsAsCode
    - ArchitecturalViews
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - System Architecture Overview
    - Logical Architecture Diagram
    - Physical Architecture Diagram (Conceptual)
    
**Requirement Ids:**
    
    - REQ-SUD-002
    - 5.9 (Technical Documentation)
    
**Purpose:** To explain the overall architecture of the Ad Manager Platform to technical stakeholders.  
**Logic Description:** Describes the microservices architecture, key technology choices, interaction patterns (API Gateway, EDA), and data flow. Includes embedded Mermaid diagrams for logical and physical architecture representations. Discusses architectural quality attributes.  
**Documentation:**
    
    - **Summary:** A document detailing the high-level system architecture, components, technology stack, and key design decisions of the Ad Manager Platform.
    
**Namespace:** AdManager.Docs.Technical.Architecture  
**Metadata:**
    
    - **Category:** TechnicalDocumentation
    
- **Path:** docs/technical/api-specifications/index.md  
**Description:** Central page for API specifications, linking to detailed OpenAPI/Swagger definitions for different platform APIs.  
**Template:** Markdown Document  
**Dependancy Level:** 3  
**Name:** index  
**Type:** DocumentationContent  
**Relative Path:** docs/technical/api-specifications/index.md  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - DocsAsCode
    - APIDocumentation
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - API Specifications Hub
    
**Requirement Ids:**
    
    - REQ-SUD-002
    - 5.9 (Technical Documentation)
    
**Purpose:** To provide developers with access to detailed specifications for all Ad Manager Platform APIs.  
**Logic Description:** Lists available APIs (e.g., Merchant API, Admin API, Third-Party Integration API). For each API, provides a brief description and links to its OpenAPI/Swagger documentation (which could be hosted or generated elsewhere and linked, or embedded if supported by Docusaurus plugins).  
**Documentation:**
    
    - **Summary:** An index page providing links and descriptions for the various API specifications of the Ad Manager Platform.
    
**Namespace:** AdManager.Docs.Technical.APISpecifications  
**Metadata:**
    
    - **Category:** TechnicalDocumentation
    
- **Path:** docs/administrative/index.md  
**Description:** Overview page for Administrative Documentation, targeted at Platform Administrators. Introduces the topics covered in this section.  
**Template:** Markdown Document  
**Dependancy Level:** 2  
**Name:** index  
**Type:** DocumentationContent  
**Relative Path:** docs/administrative/index.md  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - DocsAsCode
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Administrative Documentation Section Overview
    
**Requirement Ids:**
    
    - REQ-SUD-003
    - 5.9 (Administrative Documentation)
    
**Purpose:** To serve as the entry point for the Administrative Documentation section, guiding Platform Administrators to relevant operational guides.  
**Logic Description:** Provides an introduction to administrative tasks for the Ad Manager Platform. Lists key areas such as System Management, Health Monitoring, User & Role Management, Billing Configuration, and Maintenance Procedures, with links to respective sub-sections.  
**Documentation:**
    
    - **Summary:** Landing page for documentation specifically aimed at Platform Administrators managing the Ad Manager system.
    
**Namespace:** AdManager.Docs.Administrative  
**Metadata:**
    
    - **Category:** AdministrativeDocumentation
    
- **Path:** docs/administrative/platform-management/system-configuration.md  
**Description:** Guide for Platform Administrators on managing global system configurations of the Ad Manager Platform.  
**Template:** Markdown Document  
**Dependancy Level:** 3  
**Name:** system-configuration  
**Type:** DocumentationContent  
**Relative Path:** docs/administrative/platform-management/system-configuration.md  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - DocsAsCode
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Admin Guide: System Configuration Management
    
**Requirement Ids:**
    
    - REQ-SUD-003
    - 5.9 (Administrative Documentation)
    
**Purpose:** To instruct Platform Administrators on how to view and modify platform-wide configuration settings.  
**Logic Description:** Details procedures for accessing the admin interface for configuration, explains key global settings (e.g., default values, feature flags, integration endpoints for core services), and outlines how to manage these settings using AWS Systems Manager Parameter Store or AWS Secrets Manager where applicable. Includes precautions and best practices.  
**Documentation:**
    
    - **Summary:** A guide for administrators on managing global configurations that affect the entire Ad Manager Platform.
    
**Namespace:** AdManager.Docs.Administrative.PlatformManagement  
**Metadata:**
    
    - **Category:** AdministrativeDocumentation
    
- **Path:** docs/training/index.md  
**Description:** Overview of all available training materials and programs for different Ad Manager Platform user roles.  
**Template:** Markdown Document  
**Dependancy Level:** 2  
**Name:** index  
**Type:** DocumentationContent  
**Relative Path:** docs/training/index.md  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - DocsAsCode
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Training Materials Hub
    - Training Program Overview
    
**Requirement Ids:**
    
    - 7.3 (Training Requirements - Materials)
    
**Purpose:** To provide a central access point for all training resources, helping users find materials relevant to their roles and learning needs.  
**Logic Description:** Introduces the training section. Lists available training programs for Merchant Admins, Campaign Managers, Support Staff, and Platform Administrators. May include links to self-paced modules, video playlists, webinar schedules, and best practice guides.  
**Documentation:**
    
    - **Summary:** Central landing page for all Ad Manager Platform training materials, organized by target audience and learning objectives.
    
**Namespace:** AdManager.Docs.Training  
**Metadata:**
    
    - **Category:** TrainingMaterial
    
- **Path:** docs/training/merchant-admin-training/module-1-platform-overview.md  
**Description:** Training module for Merchant Admins providing an overview of the Ad Manager Platform and its core capabilities.  
**Template:** Markdown Document  
**Dependancy Level:** 3  
**Name:** module-1-platform-overview  
**Type:** DocumentationContent  
**Relative Path:** docs/training/merchant-admin-training/module-1-platform-overview.md  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - DocsAsCode
    - InstructionalDesign
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Training Module: Merchant Admin Platform Overview
    
**Requirement Ids:**
    
    - 7.3 (Training Requirements - Materials)
    - REQ-SUD-001
    
**Purpose:** To onboard Merchant Admins by familiarizing them with the Ad Manager Platform's features, benefits, and user interface.  
**Logic Description:** This module will cover: Introduction to Ad Manager, key terminology, navigating the Merchant Admin Portal, overview of major features (Campaigns, Catalogs, Promotions, Analytics), and where to find help. May include learning objectives, key takeaways, and links to relevant user guides or short video tutorials.  
**Documentation:**
    
    - **Summary:** An introductory training module for Merchant Admins covering the fundamentals of the Ad Manager Platform.
    
**Namespace:** AdManager.Docs.Training.MerchantAdmin  
**Metadata:**
    
    - **Category:** TrainingMaterial
    
- **Path:** docs/glossary.md  
**Description:** A glossary of common terms, acronyms, and domain-specific language used within the Ad Manager Platform and its documentation.  
**Template:** Markdown Document  
**Dependancy Level:** 1  
**Name:** glossary  
**Type:** DocumentationContent  
**Relative Path:** docs/glossary.md  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    - DocsAsCode
    - UbiquitousLanguage
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Platform Glossary
    - Ubiquitous Language Reference
    
**Requirement Ids:**
    
    - 5.9
    - 3.2.5 (Documentation part)
    
**Purpose:** To ensure consistent understanding of terminology across all users and stakeholders of the Ad Manager Platform.  
**Logic Description:** Contains an alphabetized list of terms with clear, concise definitions. Terms will cover advertising concepts (ROAS, CPA, CTR), platform-specific features, and technical jargon where necessary for developer or admin audiences.  
**Documentation:**
    
    - **Summary:** A comprehensive glossary defining key terms and acronyms related to the Ad Manager Platform to foster clear communication.
    
**Namespace:** AdManager.Docs  
**Metadata:**
    
    - **Category:** GeneralDocumentation
    
- **Path:** src/css/custom.css  
**Description:** Custom CSS file for overriding or extending Docusaurus default styles to match Ad Manager branding or improve usability.  
**Template:** CSS Stylesheet  
**Dependancy Level:** 1  
**Name:** custom  
**Type:** Styling  
**Relative Path:** src/css/custom.css  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Custom Styling for Documentation Site
    
**Requirement Ids:**
    
    - 3.2.5 (Documentation part)
    
**Purpose:** To apply custom visual styles and branding elements to the Docusaurus-generated documentation site.  
**Logic Description:** Contains CSS rules to modify the appearance of various Docusaurus components, such as headers, fonts, colors, and layout elements, ensuring the documentation site aligns with Ad Manager's visual identity.  
**Documentation:**
    
    - **Summary:** Stylesheet for custom CSS overrides, allowing for unique branding and appearance adjustments of the documentation portal.
    
**Namespace:** AdManager.Docs.Theme  
**Metadata:**
    
    - **Category:** Styling
    
- **Path:** static/img/logo.png  
**Description:** Ad Manager Platform logo image file used in the documentation site's navbar, footer, or within content.  
**Template:** Image Asset  
**Dependancy Level:** 0  
**Name:** logo  
**Type:** StaticAsset  
**Relative Path:** static/img/logo.png  
**Repository Id:** REPO-DOCS-008  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Platform Logo Asset
    
**Requirement Ids:**
    
    - 3.2.5 (Documentation part)
    
**Purpose:** To provide the official logo for use within the documentation portal, reinforcing brand identity.  
**Logic Description:** This is a static image file (PNG format). It will be referenced in docusaurus.config.js for the navbar/footer logo and can be embedded in Markdown files.  
**Documentation:**
    
    - **Summary:** The primary logo image for the Ad Manager Platform, used for branding the documentation site.
    
**Namespace:** AdManager.Docs.Assets  
**Metadata:**
    
    - **Category:** Asset
    


---

# 2. Configuration

- **Feature Toggles:**
  
  
- **Database Configs:**
  
  


---

