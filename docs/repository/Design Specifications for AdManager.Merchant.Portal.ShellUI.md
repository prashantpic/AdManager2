# Software Design Specification: AdManager.Merchant.Portal.ShellUI

## 1. Introduction

### 1.1 Purpose
This document outlines the software design for the `AdManager.Merchant.Portal.ShellUI` repository. This repository serves as the master coordinator and UI shell for the entire merchant-facing Ad Manager Portal, a Single Page Application (SPA). It is responsible for providing the main application frame, managing global UI state, handling top-level navigation, orchestrating feature modules, and ensuring a consistent user experience.

### 1.2 Scope
The scope of this document is limited to the `AdManager.Merchant.Portal.ShellUI` repository. This includes:
-   Core application structure and bootstrapping.
-   Global state management (authentication, UI preferences, merchant context).
-   Global theming and internationalization setup.
-   Top-level routing and navigation.
-   Layout components (Header, Sidebar, Footer).
-   Integration mechanisms for feature modules (microfrontends or lazy-loaded modules).
-   Global components like notification systems and error boundaries.
-   Configuration management for the shell application.
-   Implementation of specific shell-managed features like the Landing Page Builder and Blogging Platform shells, which further orchestrate their respective sub-components.

This document does *not* cover the detailed design of individual feature modules (e.g., Campaign Management UI, Product Catalog UI), which will reside in their respective repositories. However, it defines the integration points and contracts for these modules.

### 1.3 Definitions, Acronyms, and Abbreviations
-   **SPA**: Single Page Application
-   **UI**: User Interface
-   **UX**: User Experience
-   **JWT**: JSON Web Token
-   **API**: Application Programming Interface
-   **MUI**: Material-UI (React component library)
-   **i18n**: Internationalization
-   **l10n**: Localization
-   **RTL**: Right-to-Left (text direction)
-   **WCAG**: Web Content Accessibility Guidelines
-   **SDK**: Software Development Kit
-   **CSR**: Client-Side Rendering
-   **SSR**: Server-Side Rendering (Next.js capability for shell)
-   **SSG**: Static Site Generation (Next.js capability for shell)
-   **MFE**: Microfrontend

### 1.4 Overview
The Merchant Portal Shell UI is a React-based application, potentially leveraging Next.js for its shell structure to benefit from SSR/SSG for initial load performance and SEO where applicable for public-facing entry points if any. It uses TypeScript for type safety, Redux Toolkit for state management, Material-UI for the component library, react-router-dom for client-side routing, and react-i18next for internationalization. The architecture supports integrating various feature modules, which might be developed as separate microfrontends or lazy-loaded React components.

## 2. System Architecture

### 2.1 Architectural Style
The ShellUI adopts a **Modular Monolith** approach for the shell itself, with a strong emphasis on enabling a **Microfrontend** architecture for the integrated feature modules. The shell provides the core chrome, global services, and routing, while feature modules are loaded into designated areas. Next.js can be used as the host framework for the shell, providing routing and rendering capabilities.

### 2.2 High-Level Diagram
mermaid
graph TD
    Browser -->|HTTP Request| NextJS_Server[Next.js Server (ShellUI Host)];
    NextJS_Server --> Shell_App[Shell Application (React)];
    Shell_App --> AppRouter[AppRouter (react-router-dom)];

    subgraph Shell_App
        direction LR
        GlobalProviders[Global Providers (Theme, Redux, Auth, i18n)]
        MainLayout[MainLayout (Header, Sidebar, Footer)]
        AppRouter
    end

    AppRouter --> Page_Dashboard[DashboardPage];
    AppRouter --> Page_Content[ContentPage];
    AppRouter --> ModuleLoaders[Feature Module Loaders];

    Page_Dashboard --> AnalyticsModuleLoader --> AnalyticsUI_Module["AnalyticsUI Module (External/Lazy)"];
    Page_Content --> LandingPageBuilderShell[LandingPageBuilderShell];
    Page_Content --> BloggingPlatformShell[BloggingPlatformShell];

    ModuleLoaders --> CampaignModuleLoader --> CampaignUI_Module["CampaignUI Module (External/Lazy)"];
    ModuleLoaders --> ProductCatalogModuleLoader --> ProductCatalogUI_Module["ProductCatalogUI Module (External/Lazy)"];
    ModuleLoaders --> PromotionsModuleLoader --> PromotionsUI_Module["PromotionsUI Module (External/Lazy)"];
    ModuleLoaders --> AccountSettingsModuleLoader --> AccountSettingsUI_Module["AccountSettingsUI Module (External/Lazy)"];
    ModuleLoaders --> BillingModuleLoader --> BillingUI_Module["BillingUI Module (External/Lazy)"];
    ModuleLoaders --> AffiliateProgramModuleLoader --> AffiliateProgramUI_Module["AffiliateProgramUI Module (External/Lazy)"];


    Shell_App --> GlobalState[Global State (Redux Toolkit)];
    Shell_App --> APIService[API Service (axios)];
    APIService --> Backend_APIs[Backend APIs (via API Gateway)];

    GlobalProviders --> Shell_App;
    MainLayout --> Shell_App;
    GlobalState --> Shell_App;
    SharedUI_Components["Shared UI Components (REPO-SHARED-UI-001)"] --> MainLayout;
    SharedUI_Components --> LandingPageBuilderShell;
    SharedUI_Components --> BloggingPlatformShell;


### 2.3 Component Overview
The ShellUI is composed of several key parts:
-   **Core Application Setup**: Bootstraps the application, sets up global contexts and providers.
-   **Layout Components**: Define the visual structure (Header, Sidebar, Main Content, Footer).
-   **Routing System**: Manages navigation between different views and feature modules.
-   **Global State Management**: Handles application-wide state like authentication, user context, and UI preferences.
-   **Core Services**: Encapsulate logic for API communication, notifications, etc.
-   **Feature Module Integration**: Mechanisms to load and display feature-specific UIs.
-   **Shell-Managed Features**: Features like Landing Page Builder and Blogging Platform whose primary UI orchestration resides within the shell.
-   **Configuration**: Manages environment settings, feature flags, i18n, and theming.

## 3. Detailed Design

### 3.1 Core Application Setup & Configuration

#### 3.1.1 `package.json`
-   **LogicDescription**: Standard NPM package file. Dependencies will include `react`, `react-dom`, `next` (if Next.js is used for shell), `@reduxjs/toolkit`, `react-redux`, `@mui/material`, `@emotion/react`, `@emotion/styled`, `react-router-dom`, `i18next`, `react-i18next`, `axios`, `typescript`, and relevant types. Scripts for `dev`, `build`, `start`, `lint`, `test`.
-   **ImplementedFeatures**: ProjectSetup, DependencyManagement.

#### 3.1.2 `tsconfig.json`
-   **LogicDescription**: Configures TypeScript compiler with options like `target: "es6"`, `lib: ["dom", "dom.iterable", "esnext"]`, `allowJs: true`, `skipLibCheck: true`, `strict: true`, `forceConsistentCasingInFileNames: true`, `noEmit: true` (if Next.js handles build), `esModuleInterop: true`, `module: "esnext"`, `moduleResolution: "node"`, `resolveJsonModule: true`, `isolatedModules: true`, `jsx: "preserve"` (for Next.js) or `"react-jsx"` (for Vite), `baseUrl: "."`, `paths` for module aliases (e.g., `@/*: ["src/*"]`).
-   **ImplementedFeatures**: TypeScriptCompilation.

#### 3.1.3 `vite.config.ts` (or `next.config.js` if using Next.js)
-   **Vite LogicDescription**: If Vite is used: Imports `react` plugin from `@vitejs/plugin-react`. Defines plugins array. Sets up `server` options (port, proxy for API calls to backend during development). Defines `build` options (output directory, sourcemaps). Sets up `resolve.alias` for path mappings.
-   **Next.js LogicDescription**: If Next.js is used: Exports a configuration object. May include settings for `reactStrictMode`, `swcMinify`, custom webpack configurations (e.g., for SVGR), environment variable handling, internationalization routing (`i18n` object with `locales`, `defaultLocale`), and `basePath` or `assetPrefix` if needed.
-   **ImplementedFeatures**: BuildProcess, DevServer, ModuleFederationSupport (if MFE strategy requires it).

#### 3.1.4 `public/index.html` (if Vite) or `src/pages/_document.tsx` (if Next.js)
-   **`index.html` (Vite) LogicDescription**: Basic HTML structure with `<div id="root"></div>` for React app mount point. Links to main JS/CSS bundles will be injected by Vite. Includes meta tags for viewport, title.
-   **`_document.tsx` (Next.js) LogicDescription**: Custom Next.js Document to augment `<html>` and `<body>` tags. Used for setting lang/dir attributes, injecting custom fonts, or integrating CSS-in-JS library server-side rendering.
-   **ImplementedFeatures**: ApplicationRoot.

#### 3.1.5 `src/index.tsx` (if Vite) or `src/pages/_app.tsx` (if Next.js)
-   **`index.tsx` (Vite) LogicDescription**: Imports `React`, `ReactDOM/client`, and the root `App` component. Uses `ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);` to mount the application.
-   **`_app.tsx` (Next.js) LogicDescription**: This is the Next.js equivalent of the root `App` component. It receives `Component` and `pageProps` as props. This is where global providers (Theme, Redux, Auth, i18n, ErrorBoundary) will wrap the `Component`.
-   **ImplementedFeatures**: ApplicationBootstrapping.

#### 3.1.6 `src/App.tsx` (Vite specific, or logic incorporated into `src/pages/_app.tsx` for Next.js)
-   **LogicDescription**:
    -   Sets up `BrowserRouter` from `react-router-dom` (if not handled by Next.js router).
    -   Wraps children with `Provider` from `react-redux` (passing the configured Redux `store`).
    -   Wraps children with `ThemeProvider` from `@mui/material` (passing the configured `theme`).
    -   Wraps children with `I18nextProvider` from `react-i18next` (passing the `i18n` instance).
    -   Implements a global `ErrorBoundary` component (e.g., using `react-error-boundary`) to catch unhandled errors and display `ErrorFallback`.
    -   Renders `AppRouter` (or `Component` prop in Next.js `_app.tsx`) which contains the main layout and page routes.
    -   May include initialization for `AuthProvider` if it's a top-level provider.
-   **ImplementedFeatures**: GlobalContextSetup, CoreUILayout.
-   **RequirementIds**: `REQ-6-011` (Accessibility considerations for layout), `REQ-6-012` (i18n provider).

#### 3.1.7 `src/config/env.ts`
-   **LogicDescription**:
    -   Exports an object, e.g., `AppConfig`.
    -   Reads environment variables using `process.env.VITE_VAR_NAME` (for Vite) or `process.env.NEXT_PUBLIC_VAR_NAME` (for Next.js).
    -   Provides default values for development if variables are not set.
    -   Example variables: `API_BASE_URL`, `AUTH_SERVICE_URL`, `FEATURE_FLAG_SERVICE_URL`.
    -   Type definitions for the config object.
-   **ImplementedFeatures**: EnvironmentConfiguration.

#### 3.1.8 `src/config/routes.ts`
-   **LogicDescription**:
    -   Exports an array of `RouteConfig` objects.
    -   `RouteConfig` interface: `{ path: string; element: React.LazyExoticComponent<any> | React.FC; isProtected?: boolean; layout?: React.FC<LayoutProps>; requiredPermissions?: string[]; titleKey?: string; }`.
    -   Uses `React.lazy()` for page components to enable code splitting and lazy loading.
    -   Defines routes for:
        -   `/dashboard` -> `DashboardPage`
        -   `/content` -> `ContentPage` (which might have sub-routes for landing pages, blog)
        -   `/campaigns/*` -> `CampaignManagementModuleLoader`
        -   `/products/*` -> `ProductCatalogModuleLoader`
        -   `/promotions/*` -> `PromotionsModuleLoader`
        -   `/analytics/*` -> `AnalyticsDashboardModuleLoader`
        -   `/affiliates/*` -> `AffiliateProgramModuleLoader`
        -   `/settings/*` -> `AccountSettingsModuleLoader`
        -   `/billing/*` -> `BillingModuleLoader`
        -   `/login`, `/auth-callback` (if applicable)
-   **ImplementedFeatures**: RoutingConfiguration.

#### 3.1.9 `src/config/featureFlags.ts`
-   **LogicDescription**:
    -   Exports a `featureFlags` object or a `useFeatureFlag` hook/service.
    -   Flags are defined, e.g., `enableNewDashboardWidgets: process.env.VITE_FF_NEW_DASHBOARD === 'true'`.
    -   Can be extended to fetch flags from a remote service or based on merchant context.
    -   Provides type definitions for available flags.
    -   **Configuration**: `enableNewDashboardWidgets`, `enableAdvancedLandingPageElements`, `enableBlogAiAssistant`, `useNewNavigationLayout`.
-   **ImplementedFeatures**: FeatureToggleManagement.

#### 3.1.10 `src/config/i18n.config.ts`
-   **LogicDescription**:
    -   Imports `i18n` from `i18next`.
    -   Imports `initReactI18next` from `react-i18next`.
    -   Imports `HttpBackend` from `i18next-http-backend` (for loading translations from `/locales`).
    -   Imports `LanguageDetector` from `i18next-browser-languagedetector` (to detect browser language).
    -   Calls `i18n.use(HttpBackend).use(LanguageDetector).use(initReactI18next).init({...})`.
    -   Configuration:
        -   `supportedLngs: ['en', 'ar']`
        -   `fallbackLng: 'en'`
        -   `defaultNS: 'shell'` (and other common namespaces)
        -   `ns: ['shell', 'common', 'validation', 'campaigns', 'products', ...]` (namespaces used by shell and potentially shared)
        -   `backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' }`
        -   `interpolation: { escapeValue: false }`
        -   `detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] }`
    -   Exports the configured `i18n` instance.
-   **ImplementedFeatures**: I18nSetup.
-   **RequirementIds**: `REQ-6-012`.

#### 3.1.11 `src/config/theme.config.ts`
-   **LogicDescription**:
    -   Imports `createTheme` from `@mui/material/styles`.
    -   Defines `lightPalette` and `darkPalette` objects.
    -   Defines base `typography` settings (font family, default sizes).
    -   Defines `spacing`.
    -   Defines `breakpoints`.
    -   Defines `componentOverrides` for common MUI components to match brand guidelines.
    -   Exports a function `getAppTheme(mode: 'light' | 'dark', direction: 'ltr' | 'rtl')` that returns a theme created with `createTheme`.
    -   The `direction` property of the theme will be set based on the current language.
    -   The UI slice in Redux will manage the current `mode` (light/dark).
-   **ImplementedFeatures**: Theming, RTLVisualSupport.
-   **RequirementIds**: `REQ-6-011`, `REQ-6-012`.

### 3.2 Authentication & Authorization

#### 3.2.1 `src/core/auth/AuthContext.tsx`
-   **LogicDescription**:
    -   Defines `AuthContextState` interface: `currentUser: UserProfile | null; token: string | null; isAuthenticated: boolean; isLoading: boolean; error: string | null; login: (credentials: LoginCredentials) => Promise<void>; logout: () => Promise<void>; refreshToken?: () => Promise<string | null>;`.
    -   Creates context: `const AuthContext = React.createContext<AuthContextState | undefined>(undefined);`.
    -   Exports `AuthContext`.
-   **ImplementedFeatures**: GlobalAuthState.

#### 3.2.2 `src/core/auth/AuthProvider.tsx`
-   **LogicDescription**:
    -   Component takes `children` as prop.
    -   Uses `useState` for `currentUser`, `token`, `isLoading`, `error`.
    -   Uses `useEffect` on mount to check for existing tokens (e.g., from localStorage or an HttpOnly cookie managed by backend) and validate session, potentially fetching user profile.
    -   `login` method:
        -   Sets `isLoading` true.
        -   Calls `authService.loginUser(credentials)`.
        -   On success: stores token, sets `currentUser`, `isAuthenticated`, clears error, sets `isLoading` false.
        -   On failure: sets error, sets `isLoading` false.
    -   `logout` method:
        -   Sets `isLoading` true.
        -   Calls `authService.logoutUser()`.
        -   Clears token, `currentUser`, sets `isAuthenticated` to false.
        -   Redirects to login page.
    -   `refreshToken` method (optional, if client-managed refresh):
        -   Calls `authService.refreshToken()`.
        -   Updates stored token.
    -   Provides context value: `{ currentUser, token, isAuthenticated, isLoading, error, login, logout, refreshToken }`.
    -   Renders `<AuthContext.Provider value={...}>{children}</AuthContext.Provider>`.
-   **ImplementedFeatures**: AuthLogic, TokenManagement.

#### 3.2.3 `src/core/auth/useAuth.ts`
-   **LogicDescription**:
    -   `const context = useContext(AuthContext);`
    -   `if (context === undefined) { throw new Error('useAuth must be used within an AuthProvider'); }`
    -   `return context;`
-   **ImplementedFeatures**: AuthContextConsumption.

#### 3.2.4 `src/core/auth/authService.ts`
-   **LogicDescription**:
    -   Imports `apiClient` from `../services/apiClient.ts`.
    -   Imports `LoginCredentials`, `AuthResponse`, `TokenResponse`, `UserProfile` types from `auth.types.ts`.
    -   `loginUser(credentials: LoginCredentials): Promise<AuthResponse>`:
        -   Makes POST request to `AUTH_LOGIN_ENDPOINT` with credentials.
        -   Returns `response.data`.
    -   `logoutUser(): Promise<void>`:
        -   Makes POST request to `AUTH_LOGOUT_ENDPOINT`.
    -   `refreshToken(currentToken: string): Promise<TokenResponse>` (if applicable):
        -   Makes POST request to `AUTH_REFRESH_TOKEN_ENDPOINT` with current refresh token.
        -   Returns `response.data`.
    -   `fetchUserProfile(): Promise<UserProfile>`:
        -   Makes GET request to `USER_PROFILE_ENDPOINT`.
        -   Returns `response.data`.
-   **ImplementedFeatures**: AuthApiIntegration.

#### 3.2.5 `src/core/auth/auth.types.ts`
-   **LogicDescription**:
    -   `interface UserProfile { id: string; email: string; name: string; merchantId: string; roles: string[]; permissions?: string[]; }`
    -   `interface LoginCredentials { email: string; password: string; }`
    -   `interface AuthResponse { accessToken: string; refreshToken?: string; user: UserProfile; }`
    -   `interface TokenResponse { accessToken: string; refreshToken?: string; }`
-   **ImplementedFeatures**: AuthDataTyping.

#### 3.2.6 `src/core/navigation/guards/AuthGuard.tsx`
-   **LogicDescription**:
    -   Takes `children?: React.ReactNode` as prop (or uses `<Outlet />`).
    -   `const { isAuthenticated, isLoading } = useAuth();`
    -   `const location = useLocation();`
    -   If `isLoading`, render a global loader or null.
    -   If not `isAuthenticated` and not `isLoading`, return `<Navigate to="/login" state={{ from: location }} replace />`.
    -   Otherwise, render `children` or `<Outlet />`.
-   **ImplementedFeatures**: ProtectedRoutes.

### 3.3 Internationalization (i18n)

#### 3.3.1 `src/core/i18n/i18n.ts`
-   **LogicDescription**:
    -   Imports `i18n` instance from `../../config/i18n.config.ts`.
    -   Exports `i18n`.
-   **ImplementedFeatures**: I18nInstanceProvider.
-   **RequirementIds**: `REQ-6-012`.

#### 3.3.2 `src/core/i18n/locales/en/shell.json`
-   **LogicDescription**: JSON object containing key-value pairs for English translations.
    json
    {
      "navigation.dashboard": "Dashboard",
      "navigation.campaigns": "Campaigns",
      "navigation.content": "Content Hub",
      "header.profile": "Profile",
      "header.logout": "Logout",
      "common.loading": "Loading...",
      "common.error": "An error occurred. Please try again."
    }
    
-   **ImplementedFeatures**: EnglishTranslations.
-   **RequirementIds**: `REQ-6-012`.

#### 3.3.3 `src/core/i18n/locales/ar/shell.json`
-   **LogicDescription**: JSON object containing key-value pairs for Arabic translations.
    json
    {
      "navigation.dashboard": "لوحة التحكم",
      "navigation.campaigns": "الحملات",
      "navigation.content": "مركز المحتوى",
      "header.profile": "الملف الشخصي",
      "header.logout": "تسجيل الخروج",
      "common.loading": "جار التحميل...",
      "common.error": "حدث خطأ. يرجى المحاولة مرة أخرى."
    }
    
-   **ImplementedFeatures**: ArabicTranslations, RTLContent (text itself is RTL).
-   **RequirementIds**: `REQ-6-012`.

#### 3.3.4 `src/core/i18n/LanguageSwitcher.tsx`
-   **LogicDescription**:
    -   Uses `useTranslation()` hook to get `i18n` instance.
    -   Renders a MUI `Select` or `Menu` component with language options (`en`, `ar`).
    -   `onChange` handler calls `i18n.changeLanguage(selectedLang)`.
    -   Updates `document.documentElement.lang` and `document.documentElement.dir` attributes based on the selected language.
    -   Example:
        tsx
        const { i18n } = useTranslation();
        const currentLanguage = i18n.language;

        const handleLanguageChange = (event: SelectChangeEvent<string>) => {
          const newLang = event.target.value;
          i18n.changeLanguage(newLang);
          document.documentElement.lang = newLang;
          document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        };

        return (
          <Select value={currentLanguage} onChange={handleLanguageChange}>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ar">العربية</MenuItem>
          </Select>
        );
        
-   **ImplementedFeatures**: LanguageSelectionUI.
-   **RequirementIds**: `REQ-6-012`.

### 3.4 State Management (Redux Toolkit)

#### 3.4.1 `src/core/state/store.ts`
-   **LogicDescription**:
    -   Imports `configureStore` from `@reduxjs/toolkit`.
    -   Imports `rootReducer` from `./rootReducer`.
    -   `export const store = configureStore({ reducer: rootReducer, middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware) /* if needed */ });`
    -   `export type RootState = ReturnType<typeof store.getState>;`
    -   `export type AppDispatch = typeof store.dispatch;`
    -   Potentially add middleware like `redux-logger` in development.
-   **ImplementedFeatures**: GlobalStateSetup.

#### 3.4.2 `src/core/state/rootReducer.ts`
-   **LogicDescription**:
    -   Imports `combineReducers` from `@reduxjs/toolkit` or relies on slice reducers being passed directly to `configureStore`.
    -   Imports `uiReducer` from `./slices/uiSlice`.
    -   Imports `merchantContextReducer` from `./slices/merchantContextSlice`.
    -   (Future) May import reducers from feature modules if they need to register global state.
    -   `const rootReducer = combineReducers({ ui: uiReducer, merchantContext: merchantContextReducer });`
    -   `export default rootReducer;`
-   **ImplementedFeatures**: ReducerCombination.

#### 3.4.3 `src/core/state/slices/uiSlice.ts`
-   **LogicDescription**:
    -   Imports `createSlice`, `PayloadAction` from `@reduxjs/toolkit`.
    -   Defines `NotificationPayload` interface: `{ id?: string; message: string; type: 'success' | 'error' | 'warning' | 'info'; autoHideDuration?: number; }`.
    -   Defines `UIState` interface: `{ themeMode: 'light' | 'dark'; globalLoading: boolean; notifications: NotificationPayload[]; }`.
    -   `initialState: UIState = { themeMode: 'light', globalLoading: false, notifications: [] };`
    -   Uses `createSlice` with:
        -   `name: 'ui'`
        -   `initialState`
        -   `reducers`:
            -   `setThemeMode(state, action: PayloadAction<'light' | 'dark'>) { state.themeMode = action.payload; }`
            -   `setGlobalLoading(state, action: PayloadAction<boolean>) { state.globalLoading = action.payload; }`
            -   `addNotification(state, action: PayloadAction<NotificationPayload>) { state.notifications.push({ ...action.payload, id: action.payload.id || Date.now().toString() }); }`
            -   `removeNotification(state, action: PayloadAction<string>) { state.notifications = state.notifications.filter(n => n.id !== action.payload); }`
    -   Exports actions and reducer.
-   **ImplementedFeatures**: GlobalUIState.
-   **RequirementIds**: `REQ-6-011`.

#### 3.4.4 `src/core/state/slices/merchantContextSlice.ts`
-   **LogicDescription**:
    -   Imports `createSlice`, `PayloadAction` from `@reduxjs/toolkit`.
    -   Imports `UserProfile` type (can be from `auth.types.ts` or a dedicated `merchant.types.ts`).
    -   Defines `MerchantContextState` interface: `{ profile: UserProfile | null; isLoading: boolean; error: string | null; }`.
    -   `initialState: MerchantContextState = { profile: null, isLoading: false, error: null };`
    -   Uses `createSlice` with:
        -   `name: 'merchantContext'`
        -   `initialState`
        -   `reducers`:
            -   `setMerchantContext(state, action: PayloadAction<UserProfile>) { state.profile = action.payload; state.isLoading = false; state.error = null; }`
            -   `clearMerchantContext(state) { state.profile = null; }`
            -   `setMerchantContextLoading(state, action: PayloadAction<boolean>) { state.isLoading = action.payload; }`
            -   `setMerchantContextError(state, action: PayloadAction<string | null>) { state.error = action.payload; state.isLoading = false; }`
    -   Exports actions and reducer. This slice would typically be updated by `AuthProvider` or related async thunks after successful login/profile fetch.
-   **ImplementedFeatures**: MerchantSessionState.

### 3.5 Layout Components

#### 3.5.1 `src/core/layout/MainLayout.tsx`
-   **LogicDescription**:
    -   Uses MUI `Box` for the main container with `display: 'flex'`.
    -   Renders `Header` component (MUI `AppBar`).
    -   Renders `Sidebar` component (MUI `Drawer`).
    -   Renders a main content `Box` component with `flexGrow: 1`, padding, and potentially background color from the theme.
        -   This content `Box` will render `<Outlet />` from `react-router-dom` to display the matched route's component.
    -   Renders `Footer` component.
    -   Manages sidebar open/close state (e.g., using local state or Redux `uiSlice`). Header might have a toggle button.
    -   Ensures content area adjusts for `Header` and `Sidebar` dimensions.
    -   Renders `NotificationCenter` and `GlobalLoader` components.
-   **ImplementedFeatures**: PortalLayoutStructure, ConsistentUX.
-   **RequirementIds**: `REQ-6-011`.

#### 3.5.2 `src/core/layout/Header.tsx`
-   **LogicDescription**:
    -   Uses MUI `AppBar`, `Toolbar`, `Typography` (for Logo/App Name), `IconButton`, `Avatar`, `Menu`, `MenuItem`.
    -   Displays application logo/name.
    -   Includes a `LanguageSwitcher` component.
    -   Includes a notification icon (e.g., `Badge` with `NotificationsIcon`) that could open a dropdown or navigate to a notifications page.
    -   Displays user avatar/name (from `useAuth` or Redux `merchantContextSlice`).
    -   Clicking user avatar opens a `Menu` with "Profile" (links to settings/profile page) and "Logout" options.
    -   `handleLogout` function calls `auth.logout()`.
    -   Includes a menu button for toggling the sidebar on smaller screens.
-   **ImplementedFeatures**: TopNavigation, UserActionsMenu, LanguageSelectionAccess.
-   **RequirementIds**: `REQ-6-011`, `REQ-6-012`.

#### 3.5.3 `src/core/layout/Sidebar.tsx`
-   **LogicDescription**:
    -   Uses MUI `Drawer` (permanent or persistent based on screen size, responsive).
    -   Uses `List`, `ListItemButton`, `ListItemIcon`, `ListItemText`.
    -   Imports `navConfig` from `../navigation/navConfig.ts`.
    -   Fetches merchant permissions/roles from `useAuth` or Redux `merchantContextSlice`.
    -   Filters `navConfig` items based on `requiredPermissions` against the merchant's permissions.
    -   Maps filtered `navConfig` items to `ListItemButton` components.
    -   Uses `NavLink` from `react-router-dom` for navigation and active link styling.
    -   Displays icons alongside text.
    -   Supports nested navigation if defined in `navConfig`.
-   **ImplementedFeatures**: PrimaryNavigation, RoleBasedNavigation.
-   **RequirementIds**: `REQ-6-011`.

#### 3.5.4 `src/core/layout/Footer.tsx`
-   **LogicDescription**:
    -   Uses MUI `Box`, `Container`, `Typography`, `Link`.
    -   Displays copyright information (e.g., `© {new Date().getFullYear()} Ad Manager Platform`).
    -   Includes links to "Terms of Service", "Privacy Policy" (these might be static links or route to internal pages).
    -   Uses `useTranslation` for any translatable footer text.
-   **ImplementedFeatures**: StaticFooterContent.
-   **RequirementIds**: `REQ-6-011`.

#### 3.5.5 `src/core/layout/NotificationCenter.tsx`
-   **LogicDescription**:
    -   Subscribes to `notifications` array from Redux `uiSlice` using `useSelector`.
    -   Uses `useDispatch` to dispatch `removeNotification` action.
    -   Maps through the `notifications` array and renders an MUI `Snackbar` for each active notification (or manages a single `Snackbar` displaying messages sequentially).
    -   Each `Snackbar` contains an MUI `Alert` component with appropriate `severity` (success, error, etc.) and message.
    -   Handles `onClose` for `Snackbar` to dispatch `removeNotification` (if user closes it) or auto-hides based on `autoHideDuration`.
-   **ImplementedFeatures**: GlobalNotificationsUI.
-   **RequirementIds**: `REQ-6-011`.

### 3.6 Routing & Navigation

#### 3.6.1 `src/core/navigation/AppRouter.tsx`
-   **LogicDescription**:
    -   Uses `Routes` and `Route` from `react-router-dom`.
    -   Imports `routeConfigs` from `../../config/routes.ts`.
    -   Maps through `routeConfigs` to generate `<Route>` elements.
    -   Each `<Route>`:
        -   `path` from config.
        -   `element`:
            -   Wraps the page component with `React.Suspense` (with a fallback loader like `<GlobalLoader />`) if it's lazy-loaded.
            -   If `isProtected` is true, wraps the element with `<AuthGuard>`.
            -   If a specific `layout` is defined in config, wraps with that layout; otherwise, defaults to `<MainLayout>`.
    -   Defines a catch-all route (`path="*"`) for a "Not Found" page.
    -   Defines routes for unauthenticated users (e.g., Login, Forgot Password) outside `AuthGuard` and potentially with a different layout.
-   **ImplementedFeatures**: ClientSideRouting, LazyLoadingModules, RouteGuards.

#### 3.6.2 `src/core/navigation/navConfig.ts`
-   **LogicDescription**:
    -   Exports `NavItem` interface: `{ id: string; labelKey: string; // for i18n path: string; icon?: React.ElementType; // MUI Icon component requiredPermissions?: string[]; // IDs of permissions children?: NavItem[]; }`.
    -   Exports an array of `NavItem` objects defining the primary navigation structure.
    -   Example:
        typescript
        export const navConfig: NavItem[] = [
          { id: 'dashboard', labelKey: 'navigation.dashboard', path: '/dashboard', icon: DashboardIcon, requiredPermissions: ['view_dashboard'] },
          { id: 'campaigns', labelKey: 'navigation.campaigns', path: '/campaigns', icon: CampaignIcon, requiredPermissions: ['manage_campaigns'] },
          { id: 'content', labelKey: 'navigation.content', path: '/content', icon: ContentIcon, requiredPermissions: ['manage_content'],
            children: [
                { id: 'landingPages', labelKey: 'navigation.landingPages', path: '/content/landing-pages', icon: WebIcon, requiredPermissions: ['manage_landing_pages'] },
                { id: 'blogPosts', labelKey: 'navigation.blogPosts', path: '/content/blog', icon: ArticleIcon, requiredPermissions: ['manage_blog_posts'] },
            ]
          },
          // ... other modules like products, promotions, analytics, settings, billing
        ];
        
-   **ImplementedFeatures**: NavigationMenuDefinition.

### 3.7 Global Components

#### 3.7.1 `src/components/GlobalLoader.tsx`
-   **LogicDescription**:
    -   Subscribes to `globalLoading` state from Redux `uiSlice` using `useSelector`.
    -   If `globalLoading` is true, renders an MUI `Backdrop` component with an MUI `CircularProgress` inside. This provides an overlay effect.
    -   Alternatively, can be a simpler non-overlay loader if preferred for certain contexts.
    -   The component should be efficient and not cause performance issues when frequently toggled.
-   **ImplementedFeatures**: GlobalLoadingIndicator.
-   **RequirementIds**: `REQ-6-011`.

#### 3.7.2 `src/components/ErrorFallback.tsx`
-   **Props**: `error: Error`, `resetErrorBoundary: () => void`.
-   **LogicDescription**:
    -   Uses MUI `Container`, `Typography`, `Button`.
    -   Displays a user-friendly error message (e.g., "Oops! Something went wrong.").
    -   Optionally, displays error details (`error.message`) in development mode.
    -   Provides a "Try Again" or "Go Home" button that calls `resetErrorBoundary` or navigates to the dashboard.
    -   Logs the `error` object to a console or an external error tracking service (e.g., Sentry) via a utility function.
    -   Styled to be clear and reassuring.
-   **ImplementedFeatures**: GlobalErrorDisplay.
-   **RequirementIds**: `REQ-6-011`.

### 3.8 Core Services

#### 3.8.1 `src/core/services/apiClient.ts`
-   **LogicDescription**:
    -   Imports `axios` and `AppConfig` from `../../config/env.ts`.
    -   `const apiClient = axios.create({ baseURL: AppConfig.API_BASE_URL, headers: { 'Content-Type': 'application/json' } });`
    -   **Request Interceptor**:
        -   Gets the auth token (e.g., from `localStorage` or Redux state, though accessing Redux store directly in service is an anti-pattern, better to pass token or have AuthProvider set it).
        -   If token exists, adds `Authorization: Bearer ${token}` to request headers.
    -   **Response Interceptor**:
        -   Handles successful responses (e.g., unwrapping `response.data`).
        -   Handles API errors:
            -   `401 Unauthorized`: Could trigger logout or token refresh mechanism.
            -   `403 Forbidden`: Notify user of insufficient permissions.
            -   `5xx Server Errors`: Display a generic error notification.
            -   Other errors: Parse error messages from backend response if available.
    -   Exports `apiClient`.
-   **ImplementedFeatures**: CentralizedApiCommunication, RequestInterception, ResponseInterception.

#### 3.8.2 `src/core/services/notificationService.ts`
-   **LogicDescription**:
    -   Imports `store` (Redux store instance) and `addNotification` action from `uiSlice`.
    -   `showSuccess(message: string, autoHideDuration?: number)`: Dispatches `addNotification({ message, type: 'success', autoHideDuration })`.
    -   `showError(message: string, autoHideDuration?: number)`: Dispatches `addNotification({ message, type: 'error', autoHideDuration })`.
    -   `showWarning(message: string, autoHideDuration?: number)`: Dispatches `addNotification({ message, type: 'warning', autoHideDuration })`.
    -   `showInfo(message: string, autoHideDuration?: number)`: Dispatches `addNotification({ message, type: 'info', autoHideDuration })`.
    -   Methods can accept an optional ID if specific control over the notification is needed.
-   **ImplementedFeatures**: GlobalNotificationDispatch.

### 3.9 Feature Module Integration

#### 3.9.1 `src/features/module-integrations/CampaignManagementModuleLoader.tsx` (Example)
-   **LogicDescription**:
    -   Uses `React.lazy(() => import('@admanager/campaign-management-ui'));` (assuming the module is available as a separate package or via module federation).
    -   Renders the lazy-loaded component within `<React.Suspense fallback={<GlobalLoader />}>`.
    -   **Module Federation**: If using Webpack Module Federation, this component would use utilities provided by MF to load the remote module's exposed component.
    -   **Props/Context**: Passes any necessary global context or props from the shell to the loaded module (e.g., `merchantId`, `apiClient` instance if not globally available to the module, shared theme context).
    -   Error handling for module load failures (e.g., display an error message if the module cannot be fetched).
    -   This pattern is replicated for other external/lazy-loaded UI modules (`ProductCatalogModuleLoader`, `PromotionsModuleLoader`, etc.).
-   **ImplementedFeatures**: CampaignModuleIntegration (and similar for other modules).
-   **Purpose**: Dynamically loads and renders the Campaign Management feature module.

### 3.10 Shell-Managed Features

These are features whose primary UI orchestration and services might reside within the ShellUI, even if they use shared components.

#### 3.10.1 Landing Page Builder
-   **`src/features/landing-page-builder/LandingPageBuilderShell.tsx`**:
    -   **LogicDescription**: Main UI for the landing page builder. Could use a library like `react-grid-layout` or a custom drag-and-drop interface.
        -   Displays a list of existing landing pages.
        -   Allows creation of new landing pages.
        -   When editing/creating:
            -   Provides a canvas area for page construction.
            -   A palette of draggable UI elements (Text, Image, Button, Video, Countdown Timer, Promotional Banner, CTA).
            -   A properties panel to configure selected elements (text content, image URL, button link, timer end date, etc.).
            -   Handles state for the current landing page design (JSON structure).
            -   "Save Draft", "Publish", "Preview" actions calling `landingPageService`.
            -   SEO settings (meta title, description, slug).
    -   **ImplementedFeatures**: LandingPageCreationToolUI.
    -   **RequirementIds**: `REQ-6-006` (Tool to design/publish), `REQ-6-011` (Usability/Accessibility), `REQ-6-012` (i18n for tool UI).
-   **`src/features/landing-page-builder/services/landingPageService.ts`**:
    -   **LogicDescription**:
        -   `createLandingPage(data: LandingPageData): Promise<LandingPage>`: POST to `LANDING_PAGES_API_ENDPOINT`.
        -   `getLandingPage(id: string): Promise<LandingPage>`: GET from `LANDING_PAGES_API_ENDPOINT /${id}`.
        -   `updateLandingPage(id: string, data: Partial<LandingPageData>): Promise<LandingPage>`: PUT to `LANDING_PAGES_API_ENDPOINT /${id}`.
        -   `publishLandingPage(id: string): Promise<LandingPage>`: POST to `LANDING_PAGES_API_ENDPOINT /${id}/publish`.
        -   `deleteLandingPage(id: string): Promise<void>`: DELETE `LANDING_PAGES_API_ENDPOINT /${id}`.
        -   `listLandingPages(params?: ListParams): Promise<PaginatedResponse<LandingPage>>`: GET from `LANDING_PAGES_API_ENDPOINT`.
    -   **ImplementedFeatures**: LandingPageApiIntegration.
    -   **RequirementIds**: `REQ-6-006`.
-   **`src/features/landing-page-builder/landingPage.types.ts`**:
    -   **LogicDescription**:
        -   `interface LandingPageElement { id: string; type: 'text' | 'image' | 'button' | 'video' | 'countdown' | 'banner' | 'cta'; props: any; // Element-specific properties styles: React.CSSProperties; content?: string | LandingPageElement[]; }`
        -   `interface LandingPageSeo { title: string; description: string; slug: string; }`
        -   `interface LandingPage { id: string; merchantId: string; name: string; elements: LandingPageElement[]; seo: LandingPageSeo; status: 'draft' | 'published'; createdAt: string; updatedAt: string; }`
        -   `type LandingPageData = Omit<LandingPage, 'id' | 'merchantId' | 'createdAt' | 'updatedAt'>;`
    -   **ImplementedFeatures**: LandingPageDataTyping.
    -   **RequirementIds**: `REQ-6-006`.

#### 3.10.2 Blogging Platform
-   **`src/features/blogging-platform/BloggingPlatformShell.tsx`**:
    -   **LogicDescription**: Main UI for managing blog posts.
        -   Displays a list of existing blog posts with options to filter/search.
        -   "Create New Post" button navigates to the `PostEditor`.
        -   Actions on list items: Edit, Delete, View Published.
        -   Integrates `PostEditor` for creating/editing.
    -   **ImplementedFeatures**: BloggingToolUI, SEOContentManagement.
    -   **RequirementIds**: `REQ-3395` (Integrated blogging platform), `REQ-6-011`, `REQ-6-012`.
-   **`src/features/blogging-platform/components/PostEditor.tsx`**:
    -   **LogicDescription**:
        -   Integrates a rich text editor (e.g., Tiptap, Editor.js, or a custom solution built on Draft.js/Slate.js) with formatting options (headings, bold, italic, lists, links, image upload/embedding, video embedding).
        -   Input fields for: Post Title, URL Slug (auto-generated from title, editable), Meta Title, Meta Description, Tags/Categories.
        -   Functionality for inserting internal links to products/collections (requires integration with product data).
        -   "Save Draft", "Publish", "Schedule Publication" actions calling `blogService`.
        -   Preview functionality.
    -   **ImplementedFeatures**: RichTextEditing, BlogPostSEOSettings.
    -   **RequirementIds**: `REQ-3395`.
-   **`src/features/blogging-platform/services/blogService.ts`**:
    -   **LogicDescription**:
        -   `createBlogPost(data: BlogPostData): Promise<BlogPost>`: POST to `BLOG_POSTS_API_ENDPOINT`.
        -   `getBlogPost(id: string): Promise<BlogPost>`: GET from `BLOG_POSTS_API_ENDPOINT /${id}`.
        -   `updateBlogPost(id: string, data: Partial<BlogPostData>): Promise<BlogPost>`: PUT to `BLOG_POSTS_API_ENDPOINT /${id}`.
        -   `publishBlogPost(id: string): Promise<BlogPost>`: POST to `BLOG_POSTS_API_ENDPOINT /${id}/publish`.
        -   `deleteBlogPost(id: string): Promise<void>`: DELETE `BLOG_POSTS_API_ENDPOINT /${id}`.
        -   `listBlogPosts(params?: ListParams): Promise<PaginatedResponse<BlogPost>>`: GET from `BLOG_POSTS_API_ENDPOINT`.
    -   **ImplementedFeatures**: BlogPostApiIntegration.
    -   **RequirementIds**: `REQ-3395`.
-   **`src/features/blogging-platform/blog.types.ts`**:
    -   **LogicDescription**:
        -   `interface BlogPostSeo { metaTitle: string; metaDescription: string; slug: string; keywords?: string[]; }`
        -   `interface BlogPost { id: string; merchantId: string; title: string; content: any; // JSON structure from rich text editor excerpt?: string; featuredImageUrl?: string; status: 'draft' | 'published' | 'scheduled'; seo: BlogPostSeo; authorId: string; publishDate?: string; createdAt: string; updatedAt: string; tags?: string[]; categories?: string[]; }`
        -   `type BlogPostData = Omit<BlogPost, 'id' | 'merchantId' | 'authorId' | 'createdAt' | 'updatedAt'>;`
    -   **ImplementedFeatures**: BlogPostDataTyping.
    -   **RequirementIds**: `REQ-3395`.

### 3.11 Pages

#### 3.11.1 `src/pages/DashboardPage.tsx`
-   **LogicDescription**:
    -   Sets page title using a utility or context.
    -   Primarily acts as a container for the `AnalyticsDashboardModuleLoader` which will lazy-load the actual analytics dashboard UI module.
    -   May include some shell-specific welcome messages or quick links.
-   **ImplementedFeatures**: DashboardView.
-   **RequirementIds**: `3.3.1 (User Interface - merchant-facing Ad Manager dashboard)`.

#### 3.11.2 `src/pages/ContentPage.tsx`
-   **LogicDescription**:
    -   This page acts as a higher-level container for content creation tools.
    -   Uses MUI `Tabs` or a similar navigation mechanism to switch between:
        -   Landing Page Builder (`LandingPageBuilderShell.tsx`)
        -   Blogging Platform (`BloggingPlatformShell.tsx`)
    -   Manages the active tab state.
    -   Sets page title dynamically based on the active content tool.
-   **ImplementedFeatures**: ContentToolsAccessPoint.
-   **RequirementIds**: `REQ-6-006`, `REQ-3395`.

### 3.12 Accessibility

#### 3.12.1 `src/core/accessibility/ScreenReaderUtils.ts`
-   **LogicDescription**:
    -   `focusElement(elementId: string)`: Finds element by ID and calls `.focus()`. Useful for managing focus after route changes or modal dialogs.
    -   `announceMessage(message: string)`: Uses an ARIA live region (a visually hidden `div` with `aria-live="polite"` or `aria-live="assertive"`) to announce dynamic updates to screen readers. The message is set as the content of this div.
    -   General guidelines:
        -   Ensure all interactive elements are keyboard accessible.
        -   Use semantic HTML.
        -   Provide appropriate ARIA attributes where native semantics are insufficient.
        -   Ensure sufficient color contrast (handled by theme).
        -   Provide text alternatives for non-text content (alt text for images).
-   **ImplementedFeatures**: AccessibilityEnhancements.
-   **RequirementIds**: `REQ-6-011` (WCAG 2.1 AA).

### 3.13 Type Definitions

#### 3.13.1 `src/types/index.ts`
-   **LogicDescription**: Barrel file.
    -   `export * from './merchant.types';`
    -   `export * from '../core/auth/auth.types';` // (or move UserProfile here if truly global)
    -   `export * from '../core/state/slices/uiSlice'; // (for NotificationPayload if used widely)`
    -   `// Add other global types as needed`
-   **ImplementedFeatures**: GlobalTypeExports.

#### 3.13.2 `src/types/merchant.types.ts`
-   **LogicDescription**:
    -   `export interface MerchantProfile { id: string; companyName: string; contactEmail: string; activeSubscriptionPlan: 'basic' | 'pro' | 'plus'; // ... other merchant specific details }`
    -   `export interface MerchantPermissions { // Define structure for permissions, e.g., canManageCampaigns: boolean; canAccessBilling: boolean; }`
    -   These types are used by `merchantContextSlice` and other components displaying merchant-specific info.
-   **ImplementedFeatures**: MerchantDataTyping.

## 4. Data Model
The ShellUI itself does not directly manage a complex data model for persistence. It primarily consumes data from backend APIs and manages transient UI state. Key data structures it handles client-side include:
-   `UserProfile` / `MerchantProfile` (from auth and merchant context)
-   `NotificationPayload` (for UI notifications)
-   `ThemeMode` (`light` or `dark`)
-   `RouteConfig`, `NavItem` (for navigation)
-   `LandingPage`, `BlogPost` (for shell-managed features, structure defined in their respective `.types.ts` files)

Data persistence is handled by backend services.

## 5. API Interaction
The ShellUI interacts with backend APIs via the centralized `apiClient` (Axios instance). Key API endpoints it will consume (defined in `src/config/env.ts` and used by services):
-   `AUTH_LOGIN_ENDPOINT`
-   `AUTH_LOGOUT_ENDPOINT`
-   `AUTH_REFRESH_TOKEN_ENDPOINT`
-   `USER_PROFILE_ENDPOINT`
-   `NOTIFICATIONS_ENDPOINT` (if notifications are fetched/managed via API)
-   `LANDING_PAGES_API_ENDPOINT` (for CRUD operations on landing pages)
-   `BLOG_POSTS_API_ENDPOINT` (for CRUD operations on blog posts)
-   `FEATURE_MODULE_CONFIG_API_ENDPOINT` (potentially for fetching configuration for lazy-loaded modules)

All API calls include JWT tokens for authentication and handle responses/errors through interceptors.

## 6. Non-Functional Requirements

### 6.1 Performance
-   Lazy loading of feature modules and page components is critical.
-   Efficient state management with Redux Toolkit, using selectors to prevent unnecessary re-renders.
-   Optimized rendering of lists and complex UI elements.
-   Code splitting via Vite/Next.js.
-   Next.js shell can leverage SSR/SSG for faster initial perceived performance.

### 6.2 Scalability
-   The shell is client-side, so scalability primarily relates to efficiently handling a large number of routes, navigation items, and integrating diverse feature modules without performance degradation.
-   State management should be structured to scale with application complexity.

### 6.3 Security
-   Authentication tokens (JWTs) handled securely. If stored in `localStorage`, XSS risks must be mitigated. HttpOnly cookies managed by the backend are preferred for access tokens if possible, with the frontend handling refresh tokens.
-   Route guards (`AuthGuard`) protect authenticated routes.
-   Input validation for any forms managed by the shell (though most forms will be in feature modules).
-   Regular dependency updates to patch security vulnerabilities.

### 6.4 Maintainability
-   Modular design with clear separation of concerns (core, features, services, state, config).
-   Consistent coding style enforced by linters (ESLint) and formatters (Prettier).
-   TypeScript for type safety.
-   Comprehensive JSDoc comments for components, hooks, services, and types.
-   Well-structured Redux slices.

### 6.5 Usability & Accessibility
-   Adherence to WCAG 2.1 Level AA (`REQ-6-011`).
-   Intuitive navigation and layout.
-   Responsive design for various screen sizes.
-   Keyboard navigation support.
-   Screen reader compatibility (semantic HTML, ARIA attributes where necessary, using `ScreenReaderUtils`).
-   Clear visual hierarchy and feedback mechanisms.

### 6.6 Localization & Internationalization
-   Full support for English (`en`) and Arabic (`ar`) (`REQ-6-012`).
-   RTL layout for Arabic, handled by MUI theme and `dir` attribute.
-   All user-facing strings externalized into JSON translation files.
-   Language switcher component.
-   Date, number, and currency formatting should be locale-aware if displayed by the shell (though mostly handled by feature modules).

## 7. Deployment
-   Built using Vite or Next.js build commands.
-   Static assets (HTML, JS, CSS, images, locales) deployed to a CDN (e.g., Amazon CloudFront) for optimal delivery.
-   Next.js applications can be deployed to Vercel, AWS Amplify, or custom Node.js server environments (e.g., ECS, EKS).
-   Environment variables configured per deployment environment (dev, staging, prod).

## 8. Testing Strategy
-   **Unit Tests**: Jest / Vitest + React Testing Library for individual components, hooks, utility functions, Redux reducers/actions. Mocking services and external dependencies.
-   **Integration Tests**: Testing interactions between components, Redux state, and services within the shell.
-   **End-to-End Tests**: (Potentially in a separate E2E testing project) Using tools like Cypress or Playwright to test user flows through the deployed application, including navigation, authentication, and basic interaction with module placeholders.
-   **Accessibility Tests**: Using tools like `axe-core` integrated into testing pipelines or browser extensions.
-   **Linting/Formatting**: ESLint, Prettier enforced in CI.

This SDS provides a comprehensive blueprint for developing the `AdManager.Merchant.Portal.ShellUI`. Each file described will contribute to the overall functionality and architecture outlined.