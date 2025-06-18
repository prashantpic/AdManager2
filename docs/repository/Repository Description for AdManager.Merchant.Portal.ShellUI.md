# Repository Specification

# 1. Name
AdManager.Merchant.Portal.ShellUI


---

# 2. Description
This repository serves as the master coordinator for the entire merchant-facing Ad Manager Portal, a Single Page Application (SPA). It is responsible for integrating and orchestrating numerous specialized UI modules and feature-specific components, such as those for campaign management, product catalog interactions, promotional offer setups, analytics dashboards, user settings, and billing information. The ShellUI provides the main application frame, manages global UI state (e.g., authenticated merchant context, theme settings, notifications), handles top-level navigation and routing between different sections of the portal. It ensures a consistent user experience and visual identity across all integrated features by leveraging shared UI components and design system principles. Furthermore, it defines the overall layout structure, lazy-loads feature modules for optimized performance, and coordinates communication between disparate UI parts. This repository is pivotal for presenting a cohesive and unified Ad Manager platform to merchants, abstracting the complexity of underlying micro-frontends or modular UI sections. It also handles initial application bootstrapping, authentication flows for the UI, and internationalization context setup. The development here focuses on the overall portal structure, integration points for feature modules, and shared UI services rather than specific feature UIs themselves, which reside in their respective dependent UI module repositories.


---

# 3. Type
WebFrontend


---

# 4. Namespace
AdManager.Merchant.UI


---

# 5. Output Path
src/portals/merchant


---

# 6. Framework
React


---

# 7. Language
TypeScript


---

# 8. Technology
React, Next.js (potentially for shell), Redux Toolkit, Material-UI, Vite/Webpack, react-router, react-i18next


---

# 9. Thirdparty Libraries

- @mui/material
- redux-toolkit
- react-router-dom
- react-i18next
- axios


---

# 10. Dependencies

- [ID_CampaignManagementUI_Module]
- [ID_ProductCatalogUI_Module]
- [ID_PromotionsUI_Module]
- [ID_AnalyticsDashboardUI_Module]
- [ID_AffiliateProgramUI_Module]
- [ID_AccountSettingsUI_Module]
- [ID_BillingUI_Module]
- REPO-SHARED-UI-001


---

# 11. Layer Ids

- frontend-apps-layer


---

# 12. Requirements

- **Requirement Id:** 3.3.1 (User Interface - merchant-facing Ad Manager dashboard)  
- **Requirement Id:** 3.2.5 (Usability)  
- **Requirement Id:** 3.2.6 (Accessibility - WCAG)  
- **Requirement Id:** 3.2.9 (Localization and Internationalization - UI part)  


---

# 13. Generate Tests
True


---

# 14. Generate Documentation
True


---

# 15. Architecture Style
MicroFrontends


---

# 16. Id
REPO-MASTER-UI-001


---

# 17. Architecture_Map

- frontend-apps-layer


---

# 18. Components_Map

- MerchantAdManagerPortal (SPA)


---

# 19. Requirements_Map

- REQ-6-006
- REQ-3395
- REQ-6-011
- REQ-6-012


---

