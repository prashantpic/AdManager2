# Software Design Specification: AdManager.Shared.UI.ComponentLibrary

## 1. Introduction

### 1.1 Purpose
This document outlines the software design specifications for the `AdManager.Shared.UI.ComponentLibrary`. This library will provide a centralized, reusable set of UI components for the Ad Manager Platform, ensuring visual consistency, accessibility, and internationalization across all frontend applications (Merchant Portal, Admin Portal, Affiliate Portal).

### 1.2 Scope
The scope includes the design and implementation of:
*   Core UI components (e.g., Button, CountdownTimer, PromotionalBanner, and others as per general description though not detailed in file structure for this SDS pass).
*   A comprehensive theming system based on Material-UI.
*   Internationalization (i18n) setup supporting English and Arabic (including RTL).
*   Accessibility features compliant with WCAG 2.1 Level AA.
*   Utility functions and custom hooks supporting UI development.
*   Storybook integration for component development, documentation, and visualization.
*   Build and bundling configurations for library distribution.

### 1.3 Definitions, Acronyms, and Abbreviations
*   **UI**: User Interface
*   **WCAG**: Web Content Accessibility Guidelines
*   **i18n**: Internationalization
*   **RTL**: Right-to-Left (text direction)
*   **SPA**: Single Page Application
*   **SSR**: Server-Side Rendering
*   **SSG**: Static Site Generation
*   **MUI**: Material-UI (Assumed base UI framework)
*   **CSF**: Component Story Format (for Storybook)
*   **SDS**: Software Design Specification
*   **DTO**: Data Transfer Object
*   **SDK**: Software Development Kit

## 2. Design Goals and Principles
*   **Reusability**: Components should be generic and reusable across different parts of the Ad Manager platform.
*   **Consistency**: Ensure a consistent look, feel, and behavior for UI elements across all applications.
*   **Accessibility**: All components must adhere to WCAG 2.1 Level AA standards (REQ-6-011).
*   **Internationalization**: Components must support multiple languages, initially English and Arabic, including RTL layout for Arabic (REQ-6-012).
*   **Maintainability**: Code should be well-structured, documented, and easy to maintain and update.
*   **Performance**: Components should be optimized for performance.
*   **Developer Experience**: Provide a smooth development experience with tools like Storybook and clear documentation.
*   **Themeable**: Components should be easily themeable to match Ad Manager branding.

## 3. Core Technologies & Libraries
*   **React**: v18.2.0 (Core UI library)
*   **TypeScript**: v5.3.3 (Static typing)
*   **Material-UI (MUI)**: (Assumed v5+) As the base component and styling framework.
*   **Storybook**: v8.1.8 (Component development and documentation)
*   **Styled-Components/Emotion**: (MUI's default is Emotion) For custom styling if needed beyond MUI's capabilities.
*   **Jest**: v29.7.0 (Testing framework)
*   **React Testing Library**: For testing React components.
*   **Vite**: v5.2.11 (Potentially for Storybook build/dev server or library build if Rollup is replaced)
*   **Rollup**: For bundling the library (as per `rollup.config.js` in file structure).
*   **i18next & react-i18next**: For internationalization.

## 4. System Architecture
This repository follows a **Design System** architecture style. It produces a distributable UI component library that is consumed by other frontend applications.

### 4.1 Directory Structure
The library will follow a standard structure for React/TypeScript projects. Key directories:
*   `libs/ui-component-library/`
    *   `.storybook/`: Storybook configuration files.
    *   `dist/`: Bundled output of the library.
    *   `locales/`: JSON files for i18n translations.
    *   `src/`: Source code.
        *   `components/`: Individual UI components, each in its own sub-directory.
            *   `Button/`
                *   `Button.tsx`
                *   `Button.types.ts`
                *   `Button.stories.tsx`
                *   `Button.test.tsx` (Implicitly required for testing)
                *   `index.ts`
            *   `CountdownTimer/`
                *   `CountdownTimer.tsx`
                *   `CountdownTimer.types.ts`
                *   `CountdownTimer.stories.tsx`
                *   `CountdownTimer.test.tsx`
                *   `index.ts`
            *   `PromotionalBanner/`
                *   `PromotionalBanner.tsx`
                *   `PromotionalBanner.types.ts`
                *   `PromotionalBanner.stories.tsx`
                *   `PromotionalBanner.test.tsx`
                *   `index.ts`
            *   `index.ts` (Barrel file for all components)
        *   `hooks/`: Custom React hooks.
            *   `useDirection.ts`
            *   `index.ts`
        *   `theme/`: Theming configuration.
            *   `theme.ts`
            *   `palette.ts`
            *   `typography.ts`
            *   `GlobalStyles.tsx`
            *   `index.ts`
        *   `utils/`: Utility functions.
            *   `accessibilityUtils.ts`
            *   `index.ts`
        *   `i18n.ts`: i18n setup file.
        *   `index.ts`: Main library export file.
    *   `package.json`
    *   `tsconfig.json`
    *   `rollup.config.js` (or `vite.config.js` if Vite is used for library bundling)
    *   `jest.config.js` (Implicitly required)

## 5. Detailed Design

### 5.1 Configuration Files

#### 5.1.1 `package.json`
*   **Purpose**: Defines project metadata, dependencies, and scripts.
*   **Key Scripts**:
    *   `storybook`: Starts Storybook development server.
    *   `build-storybook`: Builds static Storybook for deployment.
    *   `build`: Bundles the library using Rollup/Vite.
    *   `lint`: Runs ESLint and Prettier.
    *   `test`: Runs Jest tests.
    *   `test:watch`: Runs Jest in watch mode.
*   **Dependencies**: `react`, `react-dom`, `@mui/material`, `@mui/icons-material`, `i18next`, `react-i18next`, `styled-components` (or `@emotion/react`, `@emotion/styled`).
*   **DevDependencies**: `typescript`, `@types/react`, `@types/jest`, `storybook`, `@storybook/react-vite` (or `@storybook/react-webpack5`), relevant Storybook addons (`@storybook/addon-essentials`, `@storybook/addon-interactions`, `@storybook/addon-a11y`, `@storybook/addon-links`), `jest`, `react-testing-library`, `rollup` (and its plugins if used), `vite` (if used for library build), ESLint, Prettier.
*   **PeerDependencies**: `react`, `react-dom`, `@mui/material` (or chosen base framework).
*   **`main`**, **`module`**, **`types`**: Point to the respective files in the `dist` directory.

#### 5.1.2 `tsconfig.json`
*   **Purpose**: Configures the TypeScript compiler.
*   **`compilerOptions`**:
    *   `target`: `ES2019` or newer.
    *   `module`: `ESNext`.
    *   `jsx`: `react-jsx`.
    *   `declaration`: `true`.
    *   `declarationDir`: `./dist/types`.
    *   `outDir`: `./dist`. (if Rollup/Vite doesn't handle this fully for intermediate files)
    *   `rootDir`: `./src`.
    *   `strict`: `true`.
    *   `esModuleInterop`: `true`.
    *   `skipLibCheck`: `true`.
    *   `baseUrl`: `./src`.
    *   `paths`: Configure for cleaner imports if needed (e.g., `@components/*`).
    *   `lib`: `["dom", "dom.iterable", "esnext"]`.
    *   `allowSyntheticDefaultImports`: `true`.
*   **`include`**: `["src/**/*.ts", "src/**/*.tsx"]`.
*   **`exclude`**: `["node_modules", "dist", "**/*.stories.tsx", "**/*.test.tsx"]`. (Test and story files are typically handled by their respective tools' configs but may need to be included for type checking during dev).

#### 5.1.3 `rollup.config.js` (or `vite.config.js` if Vite is primary bundler for library)
*   **Purpose**: Bundles the library into distributable formats (ESM, CJS).
*   **Input**: `src/index.ts`.
*   **Output**:
    *   ESM bundle (e.g., `dist/esm/index.js`).
    *   CJS bundle (e.g., `dist/cjs/index.js`).
*   **Plugins**:
    *   `@rollup/plugin-typescript`: To transpile TypeScript.
    *   `@rollup/plugin-node-resolve`: To resolve Node modules.
    *   `@rollup/plugin-commonjs`: To convert CommonJS modules to ESM.
    *   `rollup-plugin-terser` (or equivalent like `rollup-plugin-swc` for minification).
    *   `rollup-plugin-peer-deps-external`: To externalize peer dependencies.
*   **External**: `react`, `react-dom`, `@mui/material`, `@mui/icons-material`, `i18next`, `react-i18next`.

#### 5.1.4 `.storybook/main.ts`
*   **Purpose**: Main Storybook configuration.
*   **`stories`**: `['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)']`.
*   **`addons`**:
    *   `@storybook/addon-links`
    *   `@storybook/addon-essentials` (includes Controls, Actions, Viewport, Backgrounds, Toolbars, Measure, Outline)
    *   `@storybook/addon-interactions` (for play functions)
    *   `@storybook/addon-a11y` (for accessibility testing)
*   **`framework`**:
    typescript
    framework: {
      name: '@storybook/react-vite', // or '@storybook/react-webpack5'
      options: {},
    },
    
*   **`typescript`**:
    typescript
    typescript: {
      check: true, // Enable type checking
    },
    
*   **`docs`**:
    typescript
    docs: {
      autodocs: 'tag', // Enable autodocs for all stories with 'autodocs' tag
    },
    

#### 5.1.5 `.storybook/preview.tsx`
*   **Purpose**: Storybook preview configuration for global decorators and parameters.
*   **`parameters`**:
    *   `actions: { argTypesRegex: '^on[A-Z].*' }`
    *   `controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } }`
    *   `backgrounds`: Define default backgrounds if necessary.
    *   `viewport`: Configure common viewports.
*   **`decorators`**:
    *   A `ThemeProvider` from `@mui/material/styles` wrapping all stories, using the `adManagerTheme` from `src/theme/theme.ts`.
    *   An `I18nextProvider` from `react-i18next` wrapping all stories, using the `i18n` instance from `src/i18n.ts`.
    *   A decorator to dynamically set `dir="rtl"` or `dir="ltr"` on a wrapper element or `document.body` based on the selected Storybook locale (if using a locale switcher addon) or `useDirection` hook's value.

### 5.2 Theming System (`src/theme/`)

#### 5.2.1 `palette.ts`
*   **Purpose**: Defines the application's color scheme.
*   **Implementation**:
    typescript
    import { PaletteOptions } from '@mui/material/styles';

    export const palette: PaletteOptions = {
      primary: {
        main: '#1976d2', // Example Blue
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#9c27b0', // Example Purple
        light: '#ba68c8',
        dark: '#7b1fa2',
        contrastText: '#ffffff',
      },
      error: {
        main: '#d32f2f',
        // ... light, dark, contrastText
      },
      warning: {
        main: '#ed6c02',
        // ...
      },
      info: {
        main: '#0288d1',
        // ...
      },
      success: {
        main: '#2e7d32',
        // ...
      },
      text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)',
        disabled: 'rgba(0, 0, 0, 0.38)',
      },
      background: {
        default: '#fafafa',
        paper: '#ffffff',
      },
      // Potentially custom colors
      // custom: {
      //   lightGrey: '#f0f0f0',
      // }
    };
    

#### 5.2.2 `typography.ts`
*   **Purpose**: Defines typography settings.
*   **Implementation**:
    typescript
    import { TypographyOptions } from '@mui/material/styles/createTypography';

    // Define font families ensuring support for English and Arabic
    const primaryFontFamily = ['"Roboto"', '"Helvetica"', '"Arial"', 'sans-serif'].join(',');
    const arabicFontFamily = ['"Noto Sans Arabic"', '"Tahoma"', 'sans-serif'].join(','); // Example

    export const typography: TypographyOptions = {
      fontFamily: primaryFontFamily, // Default font
      h1: { fontSize: '2.5rem', fontWeight: 300, /* ... other properties */ },
      h2: { fontSize: '2rem', fontWeight: 400, /* ... */ },
      // ... other variants (h3-h6, subtitle1, subtitle2, body1, body2, button, caption, overline)
      // Example for specific Arabic font application if needed directly (though MUI handles LTR/RTL well)
      // body1: {
      //   fontFamily: currentLang === 'ar' ? arabicFontFamily : primaryFontFamily,
      // },
      // MUI typically handles RTL direction at a higher level, but specific font needs can be defined here.
    };

    // Function to adapt typography based on language/direction might be useful
    // export const getTypographyOptions = (direction: 'ltr' | 'rtl'): TypographyOptions => ({
    //   fontFamily: direction === 'rtl' ? arabicFontFamily : primaryFontFamily,
    //    ... (rest of typography, potentially adjusting specific variant font families)
    // });
    
    *Note: MUI's theme can handle RTL directionality, and fonts supporting both scripts are often preferred. Explicit font family switching per component based on language can be complex; it's better handled at the theme or global style level if truly necessary.*

#### 5.2.3 `theme.ts`
*   **Purpose**: Creates and exports the main MUI theme object.
*   **Implementation**:
    typescript
    import { createTheme, ThemeOptions, Theme } from '@mui/material/styles';
    import { palette } from './palette';
    import { typography } from './typography';
    // import { componentsOverrides } from './componentOverrides'; // Optional

    const themeOptions: ThemeOptions = {
      palette: palette,
      typography: typography,
      // spacing: 8, // Example: default spacing unit
      // breakpoints: { ... }, // Default or custom breakpoints
      // components: componentsOverrides, // Optional global overrides for MUI components
      direction: 'ltr', // Default direction, can be overridden by ThemeProvider
    };

    export const adManagerTheme: Theme = createTheme(themeOptions);

    // It's also useful to create an RTL version of the theme
    export const adManagerThemeRTL: Theme = createTheme({
      ...themeOptions,
      direction: 'rtl',
    });
    

#### 5.2.4 `GlobalStyles.tsx`
*   **Purpose**: Applies global CSS resets and base styles.
*   **Implementation**:
    typescript
    import React from 'react';
    import { GlobalStyles as MuiGlobalStyles } from '@mui/material';
    import { useTheme } from '@mui/material/styles';

    const GlobalStyles: React.FC = () => {
      const theme = useTheme();
      return (
        <MuiGlobalStyles
          styles={{
            '*': {
              boxSizing: 'border-box',
            },
            html: {
              '-webkit-font-smoothing': 'antialiased',
              '-moz-osx-font-smoothing': 'grayscale',
              height: '100%',
              width: '100%',
            },
            body: {
              height: '100%',
              width: '100%',
              margin: 0,
              padding: 0,
              fontFamily: theme.typography.fontFamily, // Ensure body font matches theme
              // Apply global RTL styles if needed, though MUI's ThemeProvider handles much of this
              ...(theme.direction === 'rtl' && {
                // e.g., specific global adjustments for RTL
              }),
            },
            // Add other global resets or base styles here
          }}
        />
      );
    };

    export default GlobalStyles;
    

### 5.3 Core Components (`src/components/`)

General principles for all components:
*   **Props**: Clearly defined in `*.types.ts` file.
*   **Accessibility (REQ-6-011)**:
    *   Use semantic HTML.
    *   Provide ARIA attributes where necessary (e.g., `aria-label`, `aria-disabled`, `aria-live`, role attributes).
    *   Ensure keyboard navigability and focus visibility.
    *   Test with screen readers and accessibility audit tools.
*   **Internationalization (REQ-6-012)**:
    *   All user-facing strings not passed via props must be translated using `react-i18next`'s `t()` function or `useTranslation` hook.
    *   Components must render correctly in LTR and RTL layouts. Use the `useDirection` hook if specific style adjustments are needed.
*   **Styling**: Use MUI's `sx` prop or `styled()` API for component-specific styles, ensuring they are responsive and theme-aware.
*   **Ref Forwarding**: Forward refs to the underlying root DOM element where appropriate (e.g., for focus management, integration with other libraries).
*   **Storybook**: Each component will have `*.stories.tsx` demonstrating various props, states, and use cases, including controls for interactive props and accessibility checks.
*   **Testing**: Each component will have `*.test.tsx` with unit and integration tests covering rendering, prop handling, user interactions, and accessibility (e.g., using `jest-axe`).

#### 5.3.1 Button (`src/components/Button/`)

*   **`Button.types.ts`**:
    typescript
    import { ButtonProps as MuiButtonProps } from '@mui/material/Button';
    import React from 'react';

    export interface ButtonProps extends Omit<MuiButtonProps, 'color'> {
      /**
       * The content of the button.
       */
      children?: React.ReactNode;
      /**
       * If `true`, the button will be in a loading state.
       * @default false
       */
      loading?: boolean;
      /**
       * The color of the component. It supports both theme palette colors and custom colors.
       */
      color?: MuiButtonProps['color'] | 'inherit'; // Allow standard MUI colors
      // Add any other custom props if needed
    }
    
*   **`Button.tsx`**:
    *   Import `ButtonProps`.
    *   Import `CircularProgress` and `Button` from `@mui/material`.
    *   Implement logic for `loading` state:
        *   If `loading` is true, disable the button and show `CircularProgress` as `startIcon` or `endIcon` (or replace children), making sure the button's width doesn't jump.
    *   Forward `ref` to the MUI Button.
    *   Ensure `type="button"` is default if not specified.
    *   If `href` is provided, render as an `<a>` tag (MUI Button handles this with `component="a"` or if `href` is passed).
    *   Accessibility:
        *   If the button contains only an icon (no visible text children), `aria-label` must be provided.
        *   `aria-disabled={disabled || loading}`.
*   **`Button.stories.tsx`**:
    *   Stories for different `variant`, `color`, `size`.
    *   Story for `disabled` state.
    *   Story for `loading` state.
    *   Stories with `startIcon` and `endIcon`.
    *   Story as a link (`href` prop).
*   **`Button.test.tsx`**:
    *   Test rendering with children, various props.
    *   Test `onClick` handler invocation.
    *   Test `disabled` and `loading` states (interaction and appearance).
    *   Accessibility tests using `axe`.

#### 5.3.2 CountdownTimer (`src/components/CountdownTimer/`) (REQ-6-007)

*   **`CountdownTimer.types.ts`**:
    typescript
    export interface TimeLeft {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    }

    export interface CountdownTimerProps {
      /**
       * The target date and time for the countdown.
       * Can be a Date object, a timestamp number, or a date string.
       */
      targetDate: Date | string | number;
      /**
       * Callback function to be executed when the countdown completes.
       */
      onComplete?: () => void;
      /**
       * Optional class name for custom styling.
       */
      className?: string;
      /**
       * Format string for displaying time parts, e.g., "DD HH MM SS".
       * If not provided, a default sensible format will be used.
       * Individual parts can be omitted.
       */
      displayFormat?: {
        days?: boolean;
        hours?: boolean;
        minutes?: boolean;
        seconds?: boolean;
        separator?: string; // e.g. ':'
      };
    }
    
*   **`CountdownTimer.tsx`**:
    *   Use `useState` for `timeLeft`.
    *   Use `useEffect` to set up an interval (`setInterval`) that calls `calculateTimeLeft` every second. Clear interval on unmount.
    *   `calculateTimeLeft` function:
        *   Calculates difference between `targetDate` and current time.
        *   Returns an object `{ days, hours, minutes, seconds }`.
        *   If difference is zero or negative, clear interval, call `onComplete`, and set `timeLeft` to all zeros.
    *   Render the `timeLeft` parts (days, hours, minutes, seconds) with appropriate labels (e.g., "Days", "Hours").
    *   Labels must be internationalized using `useTranslation()` (REQ-6-012). Example: `t('countdown.days')`.
    *   Apply `displayFormat` prop to customize output.
    *   Accessibility (REQ-6-011):
        *   Wrap the timer in an element with `aria-live="polite"` or `aria-live="assertive"` if updates should be announced.
        *   Provide a clear, human-readable label for the timer (e.g., via `aria-label` or visually hidden text) if its purpose isn't obvious from context.
        *   Ensure numbers and units are clearly distinguishable.
*   **`CountdownTimer.stories.tsx`**:
    *   Story with a future `targetDate`.
    *   Story with a `targetDate` very soon to demonstrate `onComplete`.
    *   Story with custom `displayFormat`.
*   **`CountdownTimer.test.tsx`**:
    *   Test initial rendering and time calculation.
    *   Test time updates over intervals.
    *   Test `onComplete` callback.
    *   Test different `displayFormat` options.
    *   Accessibility tests.

#### 5.3.3 PromotionalBanner (`src/components/PromotionalBanner/`) (REQ-6-007)

*   **`PromotionalBanner.types.ts`**:
    typescript
    import React from 'react';

    export interface PromotionalBannerProps {
      /**
       * The main title of the banner.
       */
      title: string;
      /**
       * Optional descriptive text for the banner.
       */
      description?: string;
      /**
       * Text for the call-to-action button. If not provided, no button is rendered.
       */
      ctaText?: string;
      /**
       * Link for the call-to-action button. Used if onCtaClick is not provided.
       */
      ctaLink?: string;
      /**
       * Callback function for the call-to-action button click.
       * Takes precedence over ctaLink if both are provided.
       */
      onCtaClick?: () => void;
      /**
       * URL for the background image of the banner.
       */
      backgroundImage?: string;
      /**
       * Background color for the banner. Used if backgroundImage is not provided or as a fallback.
       * Can be a theme color string or any valid CSS color.
       */
      backgroundColor?: string;
      /**
       * Optional class name for custom styling.
       */
      className?: string;
      /**
       * Custom content for the call to action area, overrides ctaText, ctaLink, onCtaClick for the button
       */
      ctaContent?: React.ReactNode;
       /**
       * Text alignment for banner content
       * @default 'left'
       */
      textAlign?: 'left' | 'center' | 'right';
    }
    
*   **`PromotionalBanner.tsx`**:
    *   Use MUI `Paper` or `Box` as the main container.
    *   Apply `backgroundImage` or `backgroundColor` to the container.
    *   Use MUI `Typography` for `title` and `description`.
    *   If `ctaText` or `ctaContent` is provided, render a `Button` component (from this library).
        *   If `ctaContent`, render it.
        *   Else if `ctaText`, configure the button with `ctaText`.
        *   If `onCtaClick` is provided, use it for the button's `onClick`.
        *   Else if `ctaLink` is provided, use it for the button's `href`.
    *   Internationalization (REQ-6-012): `title`, `description`, `ctaText` are passed as props, so consumers handle i18n for these. Component itself doesn't have fixed strings needing translation, unless there are default accessibility labels.
    *   Accessibility (REQ-6-011):
        *   Use appropriate heading levels for `title`.
        *   Ensure sufficient color contrast between text and background.
        *   The banner itself can be a `<section>` or `<aside>` with an `aria-labelledby` pointing to the title.
        *   If it's a significant region, use `role="region"` or `role="complementary"`.
*   **`PromotionalBanner.stories.tsx`**:
    *   Story with title, description, and CTA button.
    *   Story with background image.
    *   Story with background color.
    *   Story with only title.
    *   Story with different `textAlign` options.
*   **`PromotionalBanner.test.tsx`**:
    *   Test rendering with different prop combinations.
    *   Test CTA button click/link.
    *   Test background styling application.
    *   Accessibility tests.

### 5.4 Internationalization (i18n) (`src/i18n.ts`, `src/locales/`) (REQ-6-012)

#### 5.4.1 `src/i18n.ts`
*   **Purpose**: Initialize and configure `i18next`.
*   **Implementation**:
    typescript
    import i18n from 'i18next';
    import { initReactI18next } from 'react-i18next';
    import LanguageDetector from 'i18next-browser-languagedetector'; // Optional: for detecting user's language

    import enTranslation from './locales/en.json';
    import arTranslation from './locales/ar.json';

    const resources = {
      en: {
        translation: enTranslation.translation, // Assuming structure from file_structure_json
      },
      ar: {
        translation: arTranslation.translation,
      },
    };

    i18n
      .use(LanguageDetector) // Optional
      .use(initReactI18next)
      .init({
        resources,
        lng: 'en', // Default language
        fallbackLng: 'en', // Fallback language if selected one is not available
        interpolation: {
          escapeValue: false, // React already safes from xss
        },
        detection: { // Options for LanguageDetector
          order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
          caches: ['localStorage', 'cookie'],
        },
        // debug: process.env.NODE_ENV === 'development', // Enable debug logs in dev
      });

    export default i18n;
    

#### 5.4.2 `src/locales/en.json` & `src/locales/ar.json`
*   **Purpose**: Store language strings.
*   **`en.json` Example**:
    json
    {
      "translation": {
        "button.submit": "Submit",
        "button.cancel": "Cancel",
        "countdown.days": "Days",
        "countdown.hours": "Hours",
        "countdown.minutes": "Minutes",
        "countdown.seconds": "Seconds"
      }
    }
    
*   **`ar.json` Example**:
    json
    {
      "translation": {
        "button.submit": "إرسال",
        "button.cancel": "إلغاء",
        "countdown.days": "أيام",
        "countdown.hours": "ساعات",
        "countdown.minutes": "دقائق",
        "countdown.seconds": "ثواني"
      }
    }
    

### 5.5 Utility Functions (`src/utils/`)

#### 5.5.1 `accessibilityUtils.ts` (REQ-6-011)
*   **Purpose**: Provide helper functions for accessibility.
*   **`generateUniqueId(prefix?: string): string`**:
    *   Logic: Generates a unique ID string, e.g., `prefix_ + Math.random().toString(36).substring(2, 9)`. Ensure it's sufficiently unique for DOM IDs.
*   **`focusElement(element: HTMLElement | null): void`**:
    *   Logic: Checks if `element` exists and is focusable, then calls `element.focus()`.

### 5.6 Custom Hooks (`src/hooks/`)

#### 5.6.1 `useDirection.ts` (REQ-6-012)
*   **Purpose**: Determine current text direction (LTR/RTL).
*   **Implementation**:
    typescript
    import { useTranslation } from 'react-i18next';

    export type TextDirection = 'ltr' | 'rtl';

    export function useDirection(): TextDirection {
      const { i18n } = useTranslation();
      // MUI theme direction might also be a source: const theme = useTheme(); return theme.direction;
      // However, i18n.dir is more directly tied to language.
      // Ensure i18next is configured to update `i18n.dir()` or check `i18n.language`.
      if (i18n.dir) { // i18next can provide dir based on language
          return i18n.dir() as TextDirection;
      }
      // Fallback based on language code if dir is not set by i18next
      return i18n.language === 'ar' ? 'rtl' : 'ltr';
    }
    

### 5.7 Library Entry Point (`src/index.ts`)
*   **Purpose**: Aggregate and export all public parts of the library.
*   **Implementation**:
    *   Export all components from `./components`.
    *   Export theme-related exports: `adManagerTheme`, `adManagerThemeRTL`, `GlobalStyles` from `./theme`.
    *   Export custom hooks like `useDirection` from `./hooks`.
    *   Export utility functions like `generateUniqueId` from `./utils`.
    *   Export relevant types.
    *   Example:
        typescript
        // Theme
        export * from './theme/theme';
        export { default as GlobalStyles } from './theme/GlobalStyles';
        // Components
        export * from './components/Button';
        export * from './components/CountdownTimer';
        export * from './components/PromotionalBanner';
        // Hooks
        export * from './hooks/useDirection';
        // Utils
        export * from './utils/accessibilityUtils';
        // i18n instance if needed by consumers directly, though usually handled by Provider
        // export { default as i18nInstance } from './i18n';
        

## 6. Testing Strategy
*   **Unit Tests**: Jest + React Testing Library for individual component logic, prop validation, event handling, and small utility functions/hooks.
*   **Integration Tests**: For components composed of other smaller components, or those with complex interactions.
*   **Accessibility Tests**: Use `jest-axe` within Jest tests to catch automated accessibility violations. Manual testing with screen readers and keyboard navigation is also essential.
*   **Storybook Interaction Tests**: Use Storybook's `play` functions and `@storybook/addon-interactions` to simulate user behavior and assert component states.
*   **Visual Regression Tests**: (Optional, but recommended for mature libraries) Tools like Chromatic (integrates with Storybook) or Percy to catch unintended visual changes.
*   **Coverage**: Aim for high test coverage (e.g., >80%) for critical components and logic.

## 7. Build and Deployment
*   **Build**: `npm run build` (or `yarn build`) will trigger Rollup/Vite to bundle the library into `dist/` folder, creating ESM and CJS formats, and TypeScript declaration files.
*   **Deployment**: The `dist/` folder will be published to a package registry (e.g., NPM, GitHub Packages, or an internal Salla registry).
*   **Storybook Deployment**: `npm run build-storybook` will generate a static version of Storybook, which can be hosted for documentation and component showcase.

## 8. Documentation
*   **Storybook**: Primary source of component documentation, showcasing usage, props (via `autodocs`), and interactive examples.
*   **README.md**: High-level overview, setup instructions, contribution guidelines.
*   **Type Definitions**: TypeScript types serve as API contracts.
*   **JSDoc/TSDoc**: Comments in code for functions, props, and complex logic.

## 9. Future Considerations / Extensibility
*   **Additional Components**: The library is designed to be easily extensible with new components (Forms, Tables, Modals, Charts, Navigation, Layouts, etc.) following the established patterns.
*   **Theming Enhancements**: More advanced theming capabilities, dark mode support.
*   **Performance Optimizations**: Continuous monitoring and optimization.
*   **Broader i18n Support**: Adding more languages.
*   **Animation Library**: Integration with a library like `framer-motion` for richer interactions.
*   **Advanced Utility Functions**: More UI-related helpers.
*   **Test Coverage**: Gradually increasing test coverage and types of tests (e.g., performance tests).