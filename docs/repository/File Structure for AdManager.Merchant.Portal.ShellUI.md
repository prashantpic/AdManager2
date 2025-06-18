# Specification

# 1. Files

- **Path:** src/portals/merchant/package.json  
**Description:** Defines project metadata, dependencies (React, Redux Toolkit, Material-UI, react-router-dom, react-i18next, axios, etc.), and scripts for building, testing, and running the Merchant Portal Shell UI.  
**Template:** React TypeScript Package JSON  
**Dependancy Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** package.json  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - ProjectSetup
    - DependencyManagement
    
**Requirement Ids:**
    
    
**Purpose:** Manages project dependencies and provides scripts for development workflows.  
**Logic Description:** Lists all production and development dependencies. Includes scripts for start, build, test, lint. Specifies main entry point and module type.  
**Documentation:**
    
    - **Summary:** Standard NPM package file for the Merchant Portal Shell UI.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/portals/merchant/tsconfig.json  
**Description:** TypeScript compiler configuration for the Merchant Portal Shell UI. Defines compiler options, target ECMAScript version, JSX settings, module resolution, and path aliases.  
**Template:** React TypeScript tsconfig  
**Dependancy Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** tsconfig.json  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScriptCompilation
    
**Requirement Ids:**
    
    
**Purpose:** Configures the TypeScript compiler for the project, ensuring type safety and modern JavaScript features.  
**Logic Description:** Specifies 'compilerOptions' like 'target', 'lib', 'jsx', 'module', 'rootDir', 'outDir', 'strict', 'esModuleInterop', 'baseUrl', 'paths'. Includes 'src' directory.  
**Documentation:**
    
    - **Summary:** TypeScript configuration ensuring code quality and compatibility.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/portals/merchant/vite.config.ts  
**Description:** Vite build tool configuration. Defines build settings, plugins (e.g., for React, SVGR), development server options, and module federation setup if applicable for microfrontends.  
**Template:** Vite Configuration  
**Dependancy Level:** 0  
**Name:** vite.config  
**Type:** Configuration  
**Relative Path:** vite.config.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - BuildProcess
    - DevServer
    - ModuleFederationSupport
    
**Requirement Ids:**
    
    
**Purpose:** Configures the Vite build system for efficient development and optimized production builds.  
**Logic Description:** Imports necessary Vite plugins. Defines 'plugins', 'server' options (port, proxy), 'build' options (outDir, sourcemap), and potentially 'resolve.alias' for path mapping. If using module federation, relevant plugin configuration would be here.  
**Documentation:**
    
    - **Summary:** Vite configuration for the Merchant Portal Shell UI.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Build
    
- **Path:** src/portals/merchant/public/index.html  
**Description:** Main HTML file for the Single Page Application. Contains the root element where the React application will be mounted.  
**Template:** HTML Shell  
**Dependancy Level:** 0  
**Name:** index  
**Type:** StaticAsset  
**Relative Path:** public/index.html  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - ApplicationRoot
    
**Requirement Ids:**
    
    
**Purpose:** Serves as the entry point for the SPA, providing the basic HTML structure.  
**Logic Description:** Contains standard HTML5 boilerplate, a 'div' with id 'root', and links to bundled CSS/JS files (handled by Vite).  
**Documentation:**
    
    - **Summary:** The root HTML document for the Merchant Portal SPA.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** StaticContent
    
- **Path:** src/portals/merchant/src/index.tsx  
**Description:** Main entry point for the React application. Renders the root App component into the DOM.  
**Template:** React Entry Point  
**Dependancy Level:** 5  
**Name:** index  
**Type:** ApplicationEntry  
**Relative Path:** index.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - ApplicationBootstrapping
    
**Requirement Ids:**
    
    
**Purpose:** Initializes and mounts the main React application component.  
**Logic Description:** Imports React, ReactDOM, and the main 'App' component. Uses ReactDOM.createRoot().render() to attach the App component to the HTML DOM element (e.g., 'root'). Initializes any global pre-render setup if needed.  
**Documentation:**
    
    - **Summary:** Bootstraps the Merchant Portal Shell UI.
    
**Namespace:** AdManager.Merchant.UI  
**Metadata:**
    
    - **Category:** Bootstrapping
    
- **Path:** src/portals/merchant/src/App.tsx  
**Description:** Root component of the Merchant Portal Shell UI. Sets up global providers like Theme, Redux Store, Router, Internationalization, and Error Boundaries. Orchestrates the main layout and routing.  
**Template:** React Root Component  
**Dependancy Level:** 4  
**Name:** App  
**Type:** Component  
**Relative Path:** App.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    - ProviderPattern
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - GlobalContextSetup
    - CoreUILayout
    
**Requirement Ids:**
    
    - REQ-6-011
    - REQ-6-012
    
**Purpose:** Central component establishing the application's foundational structure and global contexts.  
**Logic Description:** Wraps the 'AppRouter' or main layout components with 'ThemeProvider' (Material-UI), 'Provider' (Redux), 'BrowserRouter' (react-router-dom), 'I18nextProvider', and a global 'ErrorBoundary' component. May include initial setup for authentication state listeners.  
**Documentation:**
    
    - **Summary:** The main application shell component providing global context and structure.
    
**Namespace:** AdManager.Merchant.UI  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/portals/merchant/src/config/env.ts  
**Description:** Manages environment-specific configurations, such as API base URLs, feature flags sourced from environment variables.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** env  
**Type:** Configuration  
**Relative Path:** config/env.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - EnvironmentConfiguration
    
**Requirement Ids:**
    
    
**Purpose:** Provides a centralized way to access environment variables within the application.  
**Logic Description:** Exports an object or individual constants that read from 'process.env' (e.g., 'VITE_API_BASE_URL') with defaults for development. Ensures type safety for environment variables.  
**Documentation:**
    
    - **Summary:** Handles environment-specific settings for the application.
    
**Namespace:** AdManager.Merchant.UI.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/portals/merchant/src/config/routes.ts  
**Description:** Defines the main application routes, including paths, associated page components, and any layout or guard requirements. Used by AppRouter.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** routes  
**Type:** Configuration  
**Relative Path:** config/routes.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - RoutingConfiguration
    
**Requirement Ids:**
    
    
**Purpose:** Centralized definition of application routes for navigation and module loading.  
**Logic Description:** Exports an array of route objects, each defining properties like 'path', 'element' (React component), 'isProtected' (boolean), 'layout' (optional), 'lazyLoad' (function for dynamic import of page/module components). Includes routes for dashboard, feature modules, settings, etc.  
**Documentation:**
    
    - **Summary:** Defines the navigation structure of the Merchant Portal.
    
**Namespace:** AdManager.Merchant.UI.Config  
**Metadata:**
    
    - **Category:** Navigation
    
- **Path:** src/portals/merchant/src/config/featureFlags.ts  
**Description:** Configuration for feature flags, allowing enabling/disabling features dynamically, potentially based on environment or merchant settings.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** featureFlags  
**Type:** Configuration  
**Relative Path:** config/featureFlags.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - FeatureToggleManagement
    
**Requirement Ids:**
    
    
**Purpose:** Manages feature toggles for phased rollouts or conditional feature availability.  
**Logic Description:** Exports an object or a service to check feature flag status. Flags could be sourced from environment variables, a remote config service, or merchant-specific settings fetched via API.  
**Documentation:**
    
    - **Summary:** Centralized configuration for application feature flags.
    
**Namespace:** AdManager.Merchant.UI.Config  
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** src/portals/merchant/src/config/i18n.config.ts  
**Description:** Configuration for the react-i18next library, including backend settings, default language, supported languages, and interpolation options.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 1  
**Name:** i18n.config  
**Type:** Configuration  
**Relative Path:** config/i18n.config.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - I18nSetup
    
**Requirement Ids:**
    
    - REQ-6-012
    
**Purpose:** Initializes and configures the internationalization library (i18next).  
**Logic Description:** Imports i18next and plugins (e.g., 'HttpBackend', 'LanguageDetector'). Configures options like 'lng', 'fallbackLng', 'supportedLngs' (['en', 'ar']), 'ns' (namespaces), 'backend' (for loading translation files), 'interpolation'. Sets up RTL handling based on language.  
**Documentation:**
    
    - **Summary:** Core i18next library setup for localization and internationalization.
    
**Namespace:** AdManager.Merchant.UI.Config  
**Metadata:**
    
    - **Category:** Internationalization
    
- **Path:** src/portals/merchant/src/config/theme.config.ts  
**Description:** Material-UI theme configuration. Defines palette, typography, spacing, breakpoints, and component overrides to ensure a consistent visual identity. Supports light/dark modes and RTL adjustments.  
**Template:** Material-UI Theme  
**Dependancy Level:** 1  
**Name:** theme.config  
**Type:** Configuration  
**Relative Path:** config/theme.config.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Theming
    - RTLVisualSupport
    
**Requirement Ids:**
    
    - REQ-6-011
    - REQ-6-012
    
**Purpose:** Defines the application's visual theme using Material-UI.  
**Logic Description:** Uses Material-UI's 'createTheme' function. Defines 'palette' (primary, secondary colors), 'typography' (font families, sizes), 'spacing', 'breakpoints'. Includes logic to adjust 'direction' based on selected language (e.g., 'rtl' for Arabic) and potentially theme mode (light/dark).  
**Documentation:**
    
    - **Summary:** Centralized Material-UI theme definition for the Merchant Portal.
    
**Namespace:** AdManager.Merchant.UI.Config  
**Metadata:**
    
    - **Category:** Styling
    
- **Path:** src/portals/merchant/src/core/auth/AuthContext.tsx  
**Description:** React Context for managing authentication state (user, token, loading status, errors) across the application.  
**Template:** React Context  
**Dependancy Level:** 2  
**Name:** AuthContext  
**Type:** Context  
**Relative Path:** core/auth/AuthContext.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    - ContextAPI
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - GlobalAuthState
    
**Requirement Ids:**
    
    
**Purpose:** Provides a global authentication context for easy access to user state and auth functions.  
**Logic Description:** Defines the shape of the authentication context (e.g., 'currentUser', 'isAuthenticated', 'token', 'login()', 'logout()', 'isLoading'). Exports the 'AuthContext' created with 'React.createContext'.  
**Documentation:**
    
    - **Summary:** React Context for sharing authentication status and methods.
    
**Namespace:** AdManager.Merchant.UI.Core.Auth  
**Metadata:**
    
    - **Category:** Authentication
    
- **Path:** src/portals/merchant/src/core/auth/AuthProvider.tsx  
**Description:** React component that provides the AuthContext to its children. Manages authentication logic, token handling, and interactions with the authService.  
**Template:** React Provider Component  
**Dependancy Level:** 2  
**Name:** AuthProvider  
**Type:** Component  
**Relative Path:** core/auth/AuthProvider.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    - ProviderPattern
    
**Members:**
    
    
**Methods:**
    
    - **Name:** login  
**Parameters:**
    
    - credentials
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** logout  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** handleTokenRefresh  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** private  
    
**Implemented Features:**
    
    - AuthLogic
    - TokenManagement
    
**Requirement Ids:**
    
    
**Purpose:** Manages and provides authentication state and operations to the application.  
**Logic Description:** Uses 'useState' and 'useEffect' to manage auth state. Implements login, logout, token refresh logic by calling 'authService'. Stores tokens securely (e.g., localStorage or HttpOnly cookies via backend). Provides the context value to 'AuthContext.Provider'.  
**Documentation:**
    
    - **Summary:** Provider component for the AuthContext, handling authentication lifecycle.
    
**Namespace:** AdManager.Merchant.UI.Core.Auth  
**Metadata:**
    
    - **Category:** Authentication
    
- **Path:** src/portals/merchant/src/core/auth/useAuth.ts  
**Description:** Custom React hook to easily consume the AuthContext within components.  
**Template:** React Custom Hook  
**Dependancy Level:** 2  
**Name:** useAuth  
**Type:** Hook  
**Relative Path:** core/auth/useAuth.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - AuthContextConsumption
    
**Requirement Ids:**
    
    
**Purpose:** Simplifies access to authentication state and methods.  
**Logic Description:** Imports 'useContext' from React and 'AuthContext'. Returns 'useContext(AuthContext)'. Includes error handling if used outside an 'AuthProvider'.  
**Documentation:**
    
    - **Summary:** Custom hook for accessing the global authentication context.
    
**Namespace:** AdManager.Merchant.UI.Core.Auth  
**Metadata:**
    
    - **Category:** Authentication
    
- **Path:** src/portals/merchant/src/core/auth/authService.ts  
**Description:** Service for making API calls related to authentication (login, logout, refresh token, fetch user profile). Uses the global apiClient.  
**Template:** TypeScript Service  
**Dependancy Level:** 2  
**Name:** authService  
**Type:** Service  
**Relative Path:** core/auth/authService.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** loginUser  
**Parameters:**
    
    - credentials: LoginCredentials
    
**Return Type:** Promise<AuthResponse>  
**Attributes:** public  
    - **Name:** logoutUser  
**Parameters:**
    
    
**Return Type:** Promise<void>  
**Attributes:** public  
    - **Name:** refreshToken  
**Parameters:**
    
    - token: string
    
**Return Type:** Promise<TokenResponse>  
**Attributes:** public  
    - **Name:** fetchUserProfile  
**Parameters:**
    
    
**Return Type:** Promise<UserProfile>  
**Attributes:** public  
    
**Implemented Features:**
    
    - AuthApiIntegration
    
**Requirement Ids:**
    
    
**Purpose:** Handles all HTTP requests to the backend authentication service.  
**Logic Description:** Imports the configured 'apiClient'. Implements functions for login, logout, token refresh, fetching user profile, etc., by making POST/GET requests to appropriate backend auth endpoints. Handles API responses and errors.  
**Documentation:**
    
    - **Summary:** Manages communication with the authentication API.
    
**Namespace:** AdManager.Merchant.UI.Core.Auth  
**Metadata:**
    
    - **Category:** Service
    
- **Path:** src/portals/merchant/src/core/auth/auth.types.ts  
**Description:** TypeScript type definitions related to authentication (e.g., UserProfile, AuthCredentials, TokenResponse).  
**Template:** TypeScript Types  
**Dependancy Level:** 0  
**Name:** auth.types  
**Type:** Types  
**Relative Path:** core/auth/auth.types.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - AuthDataTyping
    
**Requirement Ids:**
    
    
**Purpose:** Defines data structures for authentication-related information.  
**Logic Description:** Exports interfaces or types for 'UserProfile', 'LoginCredentials', 'AuthResponse', 'TokenData', etc., ensuring type safety in authentication flows.  
**Documentation:**
    
    - **Summary:** Contains TypeScript types and interfaces for authentication.
    
**Namespace:** AdManager.Merchant.UI.Core.Auth.Types  
**Metadata:**
    
    - **Category:** Types
    
- **Path:** src/portals/merchant/src/core/i18n/i18n.ts  
**Description:** Initializes and exports the i18next instance. This is typically a re-export of the instance configured in `config/i18n.config.ts`.  
**Template:** TypeScript Module  
**Dependancy Level:** 1  
**Name:** i18n  
**Type:** Module  
**Relative Path:** core/i18n/i18n.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - I18nInstanceProvider
    
**Requirement Ids:**
    
    - REQ-6-012
    
**Purpose:** Provides the configured i18next instance for use throughout the application.  
**Logic Description:** Imports the i18next instance configured in `../../config/i18n.config.ts` and exports it. This file might be redundant if the config file exports it directly and is imported where needed, but often used for cleaner imports.  
**Documentation:**
    
    - **Summary:** Exports the configured i18next instance.
    
**Namespace:** AdManager.Merchant.UI.Core.I18n  
**Metadata:**
    
    - **Category:** Internationalization
    
- **Path:** src/portals/merchant/src/core/i18n/locales/en/shell.json  
**Description:** English translation strings specifically for the Shell UI (e.g., navigation items, global messages).  
**Template:** JSON Locale File  
**Dependancy Level:** 0  
**Name:** shell.en  
**Type:** LocaleData  
**Relative Path:** core/i18n/locales/en/shell.json  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - EnglishTranslations
    
**Requirement Ids:**
    
    - REQ-6-012
    
**Purpose:** Contains English localization strings for the main application shell.  
**Logic Description:** A JSON object with key-value pairs, where keys are translation IDs and values are the English strings.  
**Documentation:**
    
    - **Summary:** English translations for shell-specific UI elements.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Internationalization
    
- **Path:** src/portals/merchant/src/core/i18n/locales/ar/shell.json  
**Description:** Arabic translation strings specifically for the Shell UI. Includes RTL considerations.  
**Template:** JSON Locale File  
**Dependancy Level:** 0  
**Name:** shell.ar  
**Type:** LocaleData  
**Relative Path:** core/i18n/locales/ar/shell.json  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - ArabicTranslations
    - RTLContent
    
**Requirement Ids:**
    
    - REQ-6-012
    
**Purpose:** Contains Arabic localization strings for the main application shell.  
**Logic Description:** A JSON object with key-value pairs, where keys are translation IDs and values are the Arabic strings. Text direction is handled by theme/CSS.  
**Documentation:**
    
    - **Summary:** Arabic translations for shell-specific UI elements.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Internationalization
    
- **Path:** src/portals/merchant/src/core/i18n/LanguageSwitcher.tsx  
**Description:** A React component allowing users to switch the application language.  
**Template:** React Component  
**Dependancy Level:** 2  
**Name:** LanguageSwitcher  
**Type:** Component  
**Relative Path:** core/i18n/LanguageSwitcher.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** handleLanguageChange  
**Parameters:**
    
    - language: string
    
**Return Type:** void  
**Attributes:** private  
    
**Implemented Features:**
    
    - LanguageSelectionUI
    
**Requirement Ids:**
    
    - REQ-6-012
    
**Purpose:** Provides UI for users to change the displayed language of the portal.  
**Logic Description:** Uses the 'useTranslation' hook from 'react-i18next' to get the current language and 'i18n.changeLanguage' function. Renders a dropdown or list of supported languages. Updates HTML 'lang' and 'dir' attributes upon language change for accessibility and RTL.  
**Documentation:**
    
    - **Summary:** Component for selecting the application language.
    
**Namespace:** AdManager.Merchant.UI.Core.I18n  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/portals/merchant/src/core/state/store.ts  
**Description:** Configures and exports the Redux Toolkit store, including middleware (e.g., thunk, logger).  
**Template:** Redux Store Configuration  
**Dependancy Level:** 1  
**Name:** store  
**Type:** StateManagement  
**Relative Path:** core/state/store.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    - Flux
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - GlobalStateSetup
    
**Requirement Ids:**
    
    
**Purpose:** Initializes the global Redux store for application state management.  
**Logic Description:** Uses 'configureStore' from '@reduxjs/toolkit'. Combines 'rootReducer'. Configures middleware like 'thunk' for async actions and potentially a logger for development. Exports the configured store, 'RootState', and 'AppDispatch' types.  
**Documentation:**
    
    - **Summary:** Redux store setup for the Merchant Portal Shell UI.
    
**Namespace:** AdManager.Merchant.UI.Core.State  
**Metadata:**
    
    - **Category:** StateManagement
    
- **Path:** src/portals/merchant/src/core/state/rootReducer.ts  
**Description:** Combines all Redux reducers (slices) for the global store.  
**Template:** Redux Reducer  
**Dependancy Level:** 1  
**Name:** rootReducer  
**Type:** StateManagement  
**Relative Path:** core/state/rootReducer.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - ReducerCombination
    
**Requirement Ids:**
    
    
**Purpose:** Aggregates all feature and core state slices into a single root reducer.  
**Logic Description:** Uses 'combineReducers' from '@reduxjs/toolkit' (or directly if slices are structured for it). Imports reducers from various slices (e.g., 'uiSlice', 'merchantContextSlice', feature-specific slices if any are managed globally by the shell).  
**Documentation:**
    
    - **Summary:** Root reducer for the application's Redux store.
    
**Namespace:** AdManager.Merchant.UI.Core.State  
**Metadata:**
    
    - **Category:** StateManagement
    
- **Path:** src/portals/merchant/src/core/state/slices/uiSlice.ts  
**Description:** Redux slice for managing global UI state, such as theme (light/dark), global loading indicators, and notifications.  
**Template:** Redux Slice  
**Dependancy Level:** 2  
**Name:** uiSlice  
**Type:** StateManagement  
**Relative Path:** core/state/slices/uiSlice.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** setTheme  
**Parameters:**
    
    - theme: 'light' | 'dark'
    
**Return Type:** void  
**Attributes:** action  
    - **Name:** setGlobalLoading  
**Parameters:**
    
    - isLoading: boolean
    
**Return Type:** void  
**Attributes:** action  
    - **Name:** addNotification  
**Parameters:**
    
    - notification: NotificationPayload
    
**Return Type:** void  
**Attributes:** action  
    
**Implemented Features:**
    
    - GlobalUIState
    
**Requirement Ids:**
    
    - REQ-6-011
    
**Purpose:** Manages common UI-related state like theme, loading status, and global notifications.  
**Logic Description:** Uses 'createSlice' from '@reduxjs/toolkit'. Defines 'initialState', 'reducers' for actions like setting theme, toggling global loader, adding/removing notifications. Exports actions and the reducer.  
**Documentation:**
    
    - **Summary:** Redux slice for managing global UI state elements.
    
**Namespace:** AdManager.Merchant.UI.Core.State.Slices  
**Metadata:**
    
    - **Category:** StateManagement
    
- **Path:** src/portals/merchant/src/core/state/slices/merchantContextSlice.ts  
**Description:** Redux slice for managing the authenticated merchant's context information (ID, name, plan, permissions retrieved post-login).  
**Template:** Redux Slice  
**Dependancy Level:** 2  
**Name:** merchantContextSlice  
**Type:** StateManagement  
**Relative Path:** core/state/slices/merchantContextSlice.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** setMerchantContext  
**Parameters:**
    
    - context: MerchantContext
    
**Return Type:** void  
**Attributes:** action  
    - **Name:** clearMerchantContext  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** action  
    
**Implemented Features:**
    
    - MerchantSessionState
    
**Requirement Ids:**
    
    
**Purpose:** Stores and manages authenticated merchant's profile and session data.  
**Logic Description:** Uses 'createSlice'. Defines 'initialState' for merchant data (e.g., 'id', 'name', 'activePlan', 'permissions'). Includes reducers to set and clear merchant context, typically called after successful login or logout. Exports actions and reducer.  
**Documentation:**
    
    - **Summary:** Redux slice holding information about the currently authenticated merchant.
    
**Namespace:** AdManager.Merchant.UI.Core.State.Slices  
**Metadata:**
    
    - **Category:** StateManagement
    
- **Path:** src/portals/merchant/src/core/layout/MainLayout.tsx  
**Description:** Defines the main structure of the portal (Header, Sidebar, Main Content Area, Footer). Renders child routes or components within the main content area.  
**Template:** React Component  
**Dependancy Level:** 2  
**Name:** MainLayout  
**Type:** Component  
**Relative Path:** core/layout/MainLayout.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - PortalLayoutStructure
    - ConsistentUX
    
**Requirement Ids:**
    
    - REQ-6-011
    
**Purpose:** Provides the consistent visual structure for all pages within the merchant portal.  
**Logic Description:** Uses Material-UI components (e.g., 'AppBar', 'Drawer', 'Box', 'Container') to create the layout. Includes 'Header', 'Sidebar', and 'Footer' components. Renders the 'Outlet' component from 'react-router-dom' or children for the main content. Manages sidebar open/close state.  
**Documentation:**
    
    - **Summary:** Main layout component establishing the header, sidebar, and content area.
    
**Namespace:** AdManager.Merchant.UI.Core.Layout  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/portals/merchant/src/core/layout/Header.tsx  
**Description:** Application header component. Contains logo, merchant information, language switcher, notification icon, user menu (profile, logout).  
**Template:** React Component  
**Dependancy Level:** 2  
**Name:** Header  
**Type:** Component  
**Relative Path:** core/layout/Header.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** handleLogout  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** private  
    
**Implemented Features:**
    
    - TopNavigation
    - UserActionsMenu
    - LanguageSelectionAccess
    
**Requirement Ids:**
    
    - REQ-6-011
    - REQ-6-012
    
**Purpose:** Displays the main application header with navigation and user-specific controls.  
**Logic Description:** Uses Material-UI 'AppBar', 'Toolbar', 'IconButton', 'Menu'. Displays merchant name (from Redux/AuthContext), 'LanguageSwitcher', notification bell, and a user avatar/menu with options like 'Profile' and 'Logout'. Logout triggers auth service.  
**Documentation:**
    
    - **Summary:** The main header bar of the Merchant Portal.
    
**Namespace:** AdManager.Merchant.UI.Core.Layout  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/portals/merchant/src/core/layout/Sidebar.tsx  
**Description:** Application sidebar component. Provides main navigation links to different sections/modules of the portal based on `navConfig.ts` and merchant permissions.  
**Template:** React Component  
**Dependancy Level:** 2  
**Name:** Sidebar  
**Type:** Component  
**Relative Path:** core/layout/Sidebar.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - PrimaryNavigation
    - RoleBasedNavigation
    
**Requirement Ids:**
    
    - REQ-6-011
    
**Purpose:** Offers primary navigation through the portal's features and modules.  
**Logic Description:** Uses Material-UI 'Drawer', 'List', 'ListItem', 'ListItemIcon', 'ListItemText'. Renders navigation items based on configuration in 'navConfig.ts', filtering items based on merchant's role/permissions (from Redux/AuthContext). Uses 'NavLink' from 'react-router-dom' for active state highlighting.  
**Documentation:**
    
    - **Summary:** The main navigation sidebar for the Merchant Portal.
    
**Namespace:** AdManager.Merchant.UI.Core.Layout  
**Metadata:**
    
    - **Category:** Navigation
    
- **Path:** src/portals/merchant/src/core/layout/Footer.tsx  
**Description:** Application footer component. Contains copyright information, links to terms of service, privacy policy.  
**Template:** React Component  
**Dependancy Level:** 2  
**Name:** Footer  
**Type:** Component  
**Relative Path:** core/layout/Footer.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - StaticFooterContent
    
**Requirement Ids:**
    
    - REQ-6-011
    
**Purpose:** Displays standard footer information.  
**Logic Description:** Uses Material-UI components (e.g., 'Box', 'Typography', 'Link'). Displays copyright text and links to legal pages. Content is generally static or uses i18n for translations.  
**Documentation:**
    
    - **Summary:** The application footer.
    
**Namespace:** AdManager.Merchant.UI.Core.Layout  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/portals/merchant/src/core/layout/NotificationCenter.tsx  
**Description:** Component to display global notifications/alerts to the user (e.g., success messages, errors, warnings) using a snackbar or toast system.  
**Template:** React Component  
**Dependancy Level:** 2  
**Name:** NotificationCenter  
**Type:** Component  
**Relative Path:** core/layout/NotificationCenter.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - GlobalNotificationsUI
    
**Requirement Ids:**
    
    - REQ-6-011
    
**Purpose:** Manages the display of in-app notifications and alerts.  
**Logic Description:** Subscribes to notification state (e.g., from 'uiSlice' in Redux). Uses Material-UI 'Snackbar' and 'Alert' components to display notifications. Handles auto-hide and close actions. Manages a queue of notifications if multiple can appear.  
**Documentation:**
    
    - **Summary:** Displays system-wide notifications to the merchant.
    
**Namespace:** AdManager.Merchant.UI.Core.Layout  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/portals/merchant/src/core/navigation/AppRouter.tsx  
**Description:** Manages application-level routing using react-router. Dynamically loads page components or feature modules based on route definitions.  
**Template:** React Router Configuration  
**Dependancy Level:** 4  
**Name:** AppRouter  
**Type:** Routing  
**Relative Path:** core/navigation/AppRouter.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - ClientSideRouting
    - LazyLoadingModules
    - RouteGuards
    
**Requirement Ids:**
    
    
**Purpose:** Handles all client-side navigation and orchestrates the loading of views.  
**Logic Description:** Uses 'Routes' and 'Route' components from 'react-router-dom'. Maps route definitions from 'config/routes.ts' to components. Implements lazy loading for page components using 'React.lazy' and 'Suspense'. Integrates 'AuthGuard' for protected routes. Wraps routes with 'MainLayout' or other specified layouts.  
**Documentation:**
    
    - **Summary:** Central routing component for the Merchant Portal SPA.
    
**Namespace:** AdManager.Merchant.UI.Core.Navigation  
**Metadata:**
    
    - **Category:** Navigation
    
- **Path:** src/portals/merchant/src/core/navigation/navConfig.ts  
**Description:** Configuration for navigation items displayed in the Sidebar and potentially Header. Includes labels, icons, paths, and required permissions.  
**Template:** TypeScript Configuration  
**Dependancy Level:** 0  
**Name:** navConfig  
**Type:** Configuration  
**Relative Path:** core/navigation/navConfig.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - NavigationMenuDefinition
    
**Requirement Ids:**
    
    
**Purpose:** Defines the structure and content of the main navigation menus.  
**Logic Description:** Exports an array of navigation item objects. Each object contains 'labelKey' (for i18n), 'icon', 'path', 'requiredPermissions' (array of strings), and potentially 'children' for nested menus. Used by 'Sidebar.tsx'.  
**Documentation:**
    
    - **Summary:** Configuration data for the portal's navigation elements.
    
**Namespace:** AdManager.Merchant.UI.Core.Navigation  
**Metadata:**
    
    - **Category:** Navigation
    
- **Path:** src/portals/merchant/src/core/navigation/guards/AuthGuard.tsx  
**Description:** React component to protect routes that require authentication. Redirects to login page if user is not authenticated.  
**Template:** React Route Guard  
**Dependancy Level:** 3  
**Name:** AuthGuard  
**Type:** Component  
**Relative Path:** core/navigation/guards/AuthGuard.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - ProtectedRoutes
    
**Requirement Ids:**
    
    
**Purpose:** Ensures that only authenticated users can access certain parts of the application.  
**Logic Description:** Uses 'useAuth' hook to check authentication status. If user is not authenticated, redirects to the login route using 'Navigate' from 'react-router-dom'. Otherwise, renders the 'Outlet' or children components.  
**Documentation:**
    
    - **Summary:** A route guard component that restricts access to authenticated users only.
    
**Namespace:** AdManager.Merchant.UI.Core.Navigation.Guards  
**Metadata:**
    
    - **Category:** Security
    
- **Path:** src/portals/merchant/src/core/services/apiClient.ts  
**Description:** Centralized Axios instance setup for making API calls. Includes interceptors for adding auth tokens, handling global API errors, and request/response logging.  
**Template:** Axios Client Configuration  
**Dependancy Level:** 1  
**Name:** apiClient  
**Type:** Service  
**Relative Path:** core/services/apiClient.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    - Interceptor
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - CentralizedApiCommunication
    - RequestInterception
    - ResponseInterception
    
**Requirement Ids:**
    
    
**Purpose:** Provides a pre-configured Axios instance for all backend API communication.  
**Logic Description:** Creates an Axios instance with 'baseURL' from 'env.config'. Adds request interceptors to include Authorization header (JWT token from AuthContext/localStorage). Adds response interceptors to handle global errors (e.g., 401 Unauthorized for token refresh/logout, 5xx errors for global notifications) and potentially transform responses.  
**Documentation:**
    
    - **Summary:** Configured Axios instance for making HTTP requests to backend APIs.
    
**Namespace:** AdManager.Merchant.UI.Core.Services  
**Metadata:**
    
    - **Category:** Service
    
- **Path:** src/portals/merchant/src/core/services/notificationService.ts  
**Description:** Service to manage and dispatch global UI notifications. Integrates with Redux uiSlice or a dedicated notification context.  
**Template:** TypeScript Service  
**Dependancy Level:** 2  
**Name:** notificationService  
**Type:** Service  
**Relative Path:** core/services/notificationService.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** showSuccess  
**Parameters:**
    
    - message: string
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** showError  
**Parameters:**
    
    - message: string
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** showWarning  
**Parameters:**
    
    - message: string
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - GlobalNotificationDispatch
    
**Requirement Ids:**
    
    
**Purpose:** Provides a programmatic way to display global notifications (success, error, warning).  
**Logic Description:** Provides methods like 'showSuccess', 'showError', 'showInfo', 'showWarning'. These methods dispatch actions to the Redux 'uiSlice' or update a notification context to trigger the display of notifications via 'NotificationCenter.tsx'.  
**Documentation:**
    
    - **Summary:** Service for triggering and managing UI notifications.
    
**Namespace:** AdManager.Merchant.UI.Core.Services  
**Metadata:**
    
    - **Category:** Service
    
- **Path:** src/portals/merchant/src/components/GlobalLoader.tsx  
**Description:** A global loading indicator component displayed during page transitions or when global data is being fetched.  
**Template:** React Component  
**Dependancy Level:** 2  
**Name:** GlobalLoader  
**Type:** Component  
**Relative Path:** components/GlobalLoader.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - GlobalLoadingIndicator
    
**Requirement Ids:**
    
    - REQ-6-011
    
**Purpose:** Indicates to the user that a global background operation is in progress.  
**Logic Description:** Subscribes to global loading state (e.g., from 'uiSlice' in Redux). Renders a Material-UI 'CircularProgress' or a custom loading animation when 'isLoading' is true. Often displayed as an overlay or in a prominent position.  
**Documentation:**
    
    - **Summary:** Displays a loading indicator for application-wide loading states.
    
**Namespace:** AdManager.Merchant.UI.Components  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/portals/merchant/src/components/ErrorFallback.tsx  
**Description:** A fallback UI component displayed by global Error Boundaries when an unhandled error occurs in the application.  
**Template:** React Component  
**Dependancy Level:** 2  
**Name:** ErrorFallback  
**Type:** Component  
**Relative Path:** components/ErrorFallback.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** error  
**Type:** Error  
**Attributes:** public  
    - **Name:** resetErrorBoundary  
**Type:** () => void  
**Attributes:** public  
    
**Methods:**
    
    
**Implemented Features:**
    
    - GlobalErrorDisplay
    
**Requirement Ids:**
    
    - REQ-6-011
    
**Purpose:** Provides a user-friendly message when a critical error occurs, preventing a blank screen.  
**Logic Description:** Receives 'error' and 'resetErrorBoundary' props from 'react-error-boundary'. Displays a generic error message and a button to try reloading or resetting the application state. Logs the error to a monitoring service.  
**Documentation:**
    
    - **Summary:** UI component shown when a JavaScript error is caught by an ErrorBoundary.
    
**Namespace:** AdManager.Merchant.UI.Components  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/portals/merchant/src/features/module-integrations/CampaignManagementModuleLoader.tsx  
**Description:** Component responsible for loading and integrating the Campaign Management UI module/microfrontend into the shell.  
**Template:** React Component  
**Dependancy Level:** 3  
**Name:** CampaignManagementModuleLoader  
**Type:** MicroFrontendLoader  
**Relative Path:** features/module-integrations/CampaignManagementModuleLoader.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    - MicroFrontends
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - CampaignModuleIntegration
    
**Requirement Ids:**
    
    
**Purpose:** Dynamically loads and renders the Campaign Management feature module.  
**Logic Description:** Uses 'React.lazy' for dynamic import of the Campaign Management module's entry component. Wraps with 'Suspense' for loading state. May use Module Federation techniques or a custom microfrontend loading mechanism. Passes necessary props/context from shell to the module.  
**Documentation:**
    
    - **Summary:** Handles the integration of the external Campaign Management UI module.
    
**Namespace:** AdManager.Merchant.UI.Features.ModuleIntegrations  
**Metadata:**
    
    - **Category:** Integration
    
- **Path:** src/portals/merchant/src/features/landing-page-builder/LandingPageBuilderShell.tsx  
**Description:** Main shell component for the Landing Page Builder feature. Orchestrates the UI for designing and publishing landing pages.  
**Template:** React Component  
**Dependancy Level:** 3  
**Name:** LandingPageBuilderShell  
**Type:** FeatureShell  
**Relative Path:** features/landing-page-builder/LandingPageBuilderShell.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - LandingPageCreationToolUI
    
**Requirement Ids:**
    
    - REQ-6-006
    - REQ-6-011
    - REQ-6-012
    
**Purpose:** Provides the main user interface for the landing page design and publishing tools.  
**Logic Description:** Composes various sub-components like Canvas, ElementPalette, PropertiesPanel. Manages the state of the landing page being edited (potentially via its own Redux slice or local state). Handles save, publish actions by calling 'landingPageService'.  
**Documentation:**
    
    - **Summary:** Entry component and main UI orchestrator for the Landing Page Builder feature.
    
**Namespace:** AdManager.Merchant.UI.Features.LandingPageBuilder  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/portals/merchant/src/features/landing-page-builder/services/landingPageService.ts  
**Description:** Service for API calls related to landing pages (create, save, publish, fetch, delete).  
**Template:** TypeScript Service  
**Dependancy Level:** 2  
**Name:** landingPageService  
**Type:** Service  
**Relative Path:** features/landing-page-builder/services/landingPageService.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** createLandingPage  
**Parameters:**
    
    - data: LandingPageData
    
**Return Type:** Promise<LandingPage>  
**Attributes:** public  
    - **Name:** getLandingPage  
**Parameters:**
    
    - id: string
    
**Return Type:** Promise<LandingPage>  
**Attributes:** public  
    
**Implemented Features:**
    
    - LandingPageApiIntegration
    
**Requirement Ids:**
    
    - REQ-6-006
    
**Purpose:** Handles communication with the backend for landing page operations.  
**Logic Description:** Uses the global 'apiClient'. Implements functions to interact with landing page related backend endpoints. Handles request data formatting and response parsing.  
**Documentation:**
    
    - **Summary:** Service for managing landing page data via API calls.
    
**Namespace:** AdManager.Merchant.UI.Features.LandingPageBuilder.Services  
**Metadata:**
    
    - **Category:** Service
    
- **Path:** src/portals/merchant/src/features/landing-page-builder/landingPage.types.ts  
**Description:** TypeScript types and interfaces for the Landing Page Builder feature (e.g., LandingPage, PageElement, ElementProperties).  
**Template:** TypeScript Types  
**Dependancy Level:** 0  
**Name:** landingPage.types  
**Type:** Types  
**Relative Path:** features/landing-page-builder/landingPage.types.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - LandingPageDataTyping
    
**Requirement Ids:**
    
    - REQ-6-006
    
**Purpose:** Defines data structures for the landing page builder feature.  
**Logic Description:** Exports interfaces for 'LandingPage' (metadata, content structure), 'PageElement' (type, props, content), 'ElementStyle', etc. Ensures type safety within the landing page builder feature.  
**Documentation:**
    
    - **Summary:** Type definitions specific to the Landing Page Builder.
    
**Namespace:** AdManager.Merchant.UI.Features.LandingPageBuilder.Types  
**Metadata:**
    
    - **Category:** Types
    
- **Path:** src/portals/merchant/src/features/blogging-platform/BloggingPlatformShell.tsx  
**Description:** Main shell component for the Blogging Platform feature. Orchestrates UI for creating, editing, and managing blog posts.  
**Template:** React Component  
**Dependancy Level:** 3  
**Name:** BloggingPlatformShell  
**Type:** FeatureShell  
**Relative Path:** features/blogging-platform/BloggingPlatformShell.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - BloggingToolUI
    - SEOContentManagement
    
**Requirement Ids:**
    
    - REQ-3395
    - REQ-6-011
    - REQ-6-012
    
**Purpose:** Provides the main user interface for the integrated blogging platform tools.  
**Logic Description:** Manages the overall blogging workflow, including listing posts, navigating to the post editor. Integrates 'PostEditor' and 'PostList' components. Handles actions like creating new post, deleting posts by calling 'blogService'.  
**Documentation:**
    
    - **Summary:** Entry component and main UI orchestrator for the Blogging Platform feature.
    
**Namespace:** AdManager.Merchant.UI.Features.BloggingPlatform  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/portals/merchant/src/features/blogging-platform/components/PostEditor.tsx  
**Description:** Rich text editor component for creating and editing blog post content. Includes SEO settings fields.  
**Template:** React Component  
**Dependancy Level:** 3  
**Name:** PostEditor  
**Type:** Component  
**Relative Path:** features/blogging-platform/components/PostEditor.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** handleSavePost  
**Parameters:**
    
    
**Return Type:** void  
**Attributes:** private  
    
**Implemented Features:**
    
    - RichTextEditing
    - BlogPostSEOSettings
    
**Requirement Ids:**
    
    - REQ-3395
    - REQ-6-011
    
**Purpose:** Allows merchants to write, format, and configure SEO for blog posts.  
**Logic Description:** Integrates a rich text editor library (e.g., Quill, Slate.js, or a Material-UI compatible one). Provides fields for title, slug, meta description, tags. Handles content saving and updates. Provides options for image embedding and internal linking.  
**Documentation:**
    
    - **Summary:** Component for blog post creation and editing with rich text capabilities.
    
**Namespace:** AdManager.Merchant.UI.Features.BloggingPlatform.Components  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/portals/merchant/src/features/blogging-platform/services/blogService.ts  
**Description:** Service for API calls related to blog posts (create, save, publish, fetch, delete).  
**Template:** TypeScript Service  
**Dependancy Level:** 2  
**Name:** blogService  
**Type:** Service  
**Relative Path:** features/blogging-platform/services/blogService.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** createBlogPost  
**Parameters:**
    
    - data: BlogPostData
    
**Return Type:** Promise<BlogPost>  
**Attributes:** public  
    - **Name:** getBlogPosts  
**Parameters:**
    
    - params: ListParams
    
**Return Type:** Promise<PaginatedResponse<BlogPost>>  
**Attributes:** public  
    
**Implemented Features:**
    
    - BlogPostApiIntegration
    
**Requirement Ids:**
    
    - REQ-3395
    
**Purpose:** Handles communication with the backend for blog post operations.  
**Logic Description:** Uses the global 'apiClient'. Implements functions to interact with blog post related backend endpoints. Handles data for creating, updating, fetching lists, and individual posts.  
**Documentation:**
    
    - **Summary:** Service for managing blog post data via API calls.
    
**Namespace:** AdManager.Merchant.UI.Features.BloggingPlatform.Services  
**Metadata:**
    
    - **Category:** Service
    
- **Path:** src/portals/merchant/src/features/blogging-platform/blog.types.ts  
**Description:** TypeScript types and interfaces for the Blogging Platform feature (e.g., BlogPost, PostContent, SeoData).  
**Template:** TypeScript Types  
**Dependancy Level:** 0  
**Name:** blog.types  
**Type:** Types  
**Relative Path:** features/blogging-platform/blog.types.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - BlogPostDataTyping
    
**Requirement Ids:**
    
    - REQ-3395
    
**Purpose:** Defines data structures for the blogging platform feature.  
**Logic Description:** Exports interfaces for 'BlogPost' (id, title, content, author, status, publishDate, seoMeta), 'Comment', 'Category', etc. Ensures type safety within the blogging feature.  
**Documentation:**
    
    - **Summary:** Type definitions specific to the Blogging Platform.
    
**Namespace:** AdManager.Merchant.UI.Features.BloggingPlatform.Types  
**Metadata:**
    
    - **Category:** Types
    
- **Path:** src/portals/merchant/src/pages/DashboardPage.tsx  
**Description:** Page component for the main merchant dashboard. Likely acts as a container to load and display the AnalyticsDashboardUI_Module or other summary widgets.  
**Template:** React Page Component  
**Dependancy Level:** 3  
**Name:** DashboardPage  
**Type:** Page  
**Relative Path:** pages/DashboardPage.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - DashboardView
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - merchant-facing Ad Manager dashboard)
    
**Purpose:** Displays the main overview dashboard for the merchant.  
**Logic Description:** May fetch summary data or primarily act as a layout host for the AnalyticsDashboardUI_Module loaded via 'AnalyticsDashboardModuleLoader.tsx'. Sets page title and breadcrumbs.  
**Documentation:**
    
    - **Summary:** The main dashboard page shown after merchant login.
    
**Namespace:** AdManager.Merchant.UI.Pages  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/portals/merchant/src/pages/ContentPage.tsx  
**Description:** Page component that serves as an entry point or container for content creation tools like Landing Page Builder and Blogging Platform.  
**Template:** React Page Component  
**Dependancy Level:** 3  
**Name:** ContentPage  
**Type:** Page  
**Relative Path:** pages/ContentPage.tsx  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - ContentToolsAccessPoint
    
**Requirement Ids:**
    
    - REQ-6-006
    - REQ-3395
    
**Purpose:** Provides access to content creation features like Landing Pages and Blog.  
**Logic Description:** Uses nested routing or tabs to switch between the Landing Page Builder UI ('LandingPageBuilderShell.tsx') and the Blogging Platform UI ('BloggingPlatformShell.tsx'). Sets appropriate page titles.  
**Documentation:**
    
    - **Summary:** Page providing access to content management tools (Landing Pages, Blog).
    
**Namespace:** AdManager.Merchant.UI.Pages  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** src/portals/merchant/src/core/accessibility/ScreenReaderUtils.ts  
**Description:** Utility functions to enhance accessibility, such as managing focus for screen reader users or announcing dynamic content changes.  
**Template:** TypeScript Utilities  
**Dependancy Level:** 1  
**Name:** ScreenReaderUtils  
**Type:** Utility  
**Relative Path:** core/accessibility/ScreenReaderUtils.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** focusElement  
**Parameters:**
    
    - elementId: string
    
**Return Type:** void  
**Attributes:** public  
    - **Name:** announceMessage  
**Parameters:**
    
    - message: string
    
**Return Type:** void  
**Attributes:** public  
    
**Implemented Features:**
    
    - AccessibilityEnhancements
    
**Requirement Ids:**
    
    - REQ-6-011
    
**Purpose:** Provides helper functions to improve screen reader compatibility and overall accessibility.  
**Logic Description:** Implements functions to programmatically set focus on elements, or use ARIA live regions to announce updates to screen readers. These utilities are used by various components to meet WCAG standards.  
**Documentation:**
    
    - **Summary:** Helper utilities for improving accessibility and screen reader support.
    
**Namespace:** AdManager.Merchant.UI.Core.Accessibility  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** src/portals/merchant/src/types/index.ts  
**Description:** Barrel file re-exporting common global TypeScript types and interfaces for easier imports.  
**Template:** TypeScript Barrel File  
**Dependancy Level:** 0  
**Name:** types.index  
**Type:** Types  
**Relative Path:** types/index.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - GlobalTypeExports
    
**Requirement Ids:**
    
    
**Purpose:** Centralizes exports of shared type definitions for the shell application.  
**Logic Description:** Exports types from 'merchant.types.ts', 'ui.types.ts', 'api.types.ts', etc. Example: export * from './merchant.types';  
**Documentation:**
    
    - **Summary:** Aggregates and re-exports common type definitions.
    
**Namespace:** AdManager.Merchant.UI.Types  
**Metadata:**
    
    - **Category:** Types
    
- **Path:** src/portals/merchant/src/types/merchant.types.ts  
**Description:** Global TypeScript type definitions for merchant-related data used within the shell.  
**Template:** TypeScript Types  
**Dependancy Level:** 0  
**Name:** merchant.types  
**Type:** Types  
**Relative Path:** types/merchant.types.ts  
**Repository Id:** REPO-MASTER-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - MerchantDataTyping
    
**Requirement Ids:**
    
    
**Purpose:** Defines the structure of merchant context data.  
**Logic Description:** Exports interfaces like 'MerchantProfile', 'MerchantSubscriptionPlan', 'MerchantPermissions'. Used by 'merchantContextSlice' and auth-related components.  
**Documentation:**
    
    - **Summary:** TypeScript types for merchant-specific data structures.
    
**Namespace:** AdManager.Merchant.UI.Types  
**Metadata:**
    
    - **Category:** Types
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableNewDashboardWidgets
  - enableAdvancedLandingPageElements
  - enableBlogAiAssistant
  - useNewNavigationLayout
  
- **Database Configs:**
  
  
- **Api Endpoints:**
  
  - API_BASE_URL
  - AUTH_LOGIN_ENDPOINT
  - AUTH_LOGOUT_ENDPOINT
  - AUTH_REFRESH_TOKEN_ENDPOINT
  - USER_PROFILE_ENDPOINT
  - NOTIFICATIONS_ENDPOINT
  - LANDING_PAGES_API_ENDPOINT
  - BLOG_POSTS_API_ENDPOINT
  - FEATURE_MODULE_CONFIG_API_ENDPOINT
  


---

