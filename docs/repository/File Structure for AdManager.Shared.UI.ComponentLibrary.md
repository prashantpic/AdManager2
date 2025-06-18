# Specification

# 1. Files

- **Path:** libs/ui-component-library/package.json  
**Description:** Defines project metadata, dependencies (React, TypeScript, Material-UI, Storybook, etc.), and scripts for development, building, linting, and testing the UI component library.  
**Template:** Node Package Manifest  
**Dependency Level:** 0  
**Name:** package  
**Type:** Configuration  
**Relative Path:** ../package.json  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** name  
**Type:** string  
**Attributes:** required  
    - **Name:** version  
**Type:** string  
**Attributes:** required  
    - **Name:** private  
**Type:** boolean  
**Attributes:** optional  
    - **Name:** main  
**Type:** string  
**Attributes:** required|build_output  
    - **Name:** module  
**Type:** string  
**Attributes:** required|build_output  
    - **Name:** types  
**Type:** string  
**Attributes:** required|build_output  
    - **Name:** scripts  
**Type:** object  
**Attributes:** required  
    - **Name:** dependencies  
**Type:** object  
**Attributes:** required  
    - **Name:** devDependencies  
**Type:** object  
**Attributes:** required  
    - **Name:** peerDependencies  
**Type:** object  
**Attributes:** optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Dependency Management
    - Build Scripts
    - Development Scripts
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - UI component library)
    
**Purpose:** Manages project dependencies, scripts, and distribution metadata for the UI component library.  
**Logic Description:** Contains standard package.json fields. Scripts section will include commands for 'start' (storybook), 'build' (rollup/vite), 'lint', 'test'. Dependencies will list 'react', '@mui/material', 'styled-components' or 'emotion'. DevDependencies will list 'typescript', 'storybook', 'jest', 'rollup', etc.  
**Documentation:**
    
    - **Summary:** The root configuration file for the Node.js package, defining how the library is structured, built, and its dependencies.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** libs/ui-component-library/tsconfig.json  
**Description:** TypeScript compiler configuration for the UI component library, specifying options like target ECMAScript version, JSX mode, module system, type checking strictness, and output directories.  
**Template:** TypeScript Configuration  
**Dependency Level:** 0  
**Name:** tsconfig  
**Type:** Configuration  
**Relative Path:** ../tsconfig.json  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** compilerOptions  
**Type:** object  
**Attributes:** required  
    - **Name:** include  
**Type:** string[]  
**Attributes:** required  
    - **Name:** exclude  
**Type:** string[]  
**Attributes:** optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - TypeScript Compilation Configuration
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - UI component library)
    
**Purpose:** Configures the TypeScript compiler for static typing, code quality, and transpilation to JavaScript.  
**Logic Description:** CompilerOptions will set 'target' (e.g. es2019), 'module' (e.g. esnext), 'jsx' (react-jsx), 'declaration' (true), 'outDir' (./dist), 'rootDir' (./src), 'strict' (true), 'esModuleInterop' (true), 'skipLibCheck' (true), 'baseUrl' (./src). Include will specify 'src'.  
**Documentation:**
    
    - **Summary:** Specifies root files and compiler options required to compile the TypeScript project.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Configuration
    
- **Path:** libs/ui-component-library/rollup.config.js  
**Description:** Rollup configuration for bundling the UI component library into distributable formats (e.g., ESM, CJS). Handles transpilation, minification, and externalizing peer dependencies.  
**Template:** JavaScript Module Bundler Configuration  
**Dependency Level:** 0  
**Name:** rollup.config  
**Type:** Configuration  
**Relative Path:** ../rollup.config.js  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** input  
**Type:** string  
**Attributes:** required  
    - **Name:** output  
**Type:** object[]  
**Attributes:** required  
    - **Name:** plugins  
**Type:** object[]  
**Attributes:** required  
    - **Name:** external  
**Type:** string[]  
**Attributes:** required  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Library Bundling
    - Code Optimization
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - UI component library)
    
**Purpose:** Defines the build process for creating optimized, distributable library bundles.  
**Logic Description:** Specifies 'src/index.ts' as input. Defines multiple outputs for ESM and CJS formats, pointing to 'dist' directory. Uses plugins like '@rollup/plugin-typescript', '@rollup/plugin-node-resolve', '@rollup/plugin-commonjs', 'rollup-plugin-terser'. Externalizes 'react', 'react-dom', '@mui/material'.  
**Documentation:**
    
    - **Summary:** Configuration file for Rollup, responsible for compiling TypeScript/JavaScript modules into a distributable library format.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** BuildConfiguration
    
- **Path:** libs/ui-component-library/.storybook/main.ts  
**Description:** Main Storybook configuration file. Specifies story locations, addons (e.g., for accessibility, controls, actions), webpack/Vite customization, and framework options.  
**Template:** Storybook Configuration  
**Dependency Level:** 0  
**Name:** main  
**Type:** Configuration  
**Relative Path:** ../.storybook/main.ts  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** stories  
**Type:** string[]  
**Attributes:** required  
    - **Name:** addons  
**Type:** string[]  
**Attributes:** required  
    - **Name:** framework  
**Type:** object|string  
**Attributes:** required  
    - **Name:** typescript  
**Type:** object  
**Attributes:** optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Storybook Setup
    - Addon Configuration
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - UI component library)
    
**Purpose:** Configures the Storybook development environment for UI components.  
**Logic Description:** Specifies 'stories' to point to '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'. Includes addons like '@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-a11y'. Configures the React framework. Enables TypeScript support.  
**Documentation:**
    
    - **Summary:** Central configuration for Storybook, defining how stories are loaded, addons are registered, and the build process is customized.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** DevelopmentToolConfiguration
    
- **Path:** libs/ui-component-library/.storybook/preview.tsx  
**Description:** Storybook preview configuration. Used for global decorators (e.g., theme provider, router), global parameters, and setting up mock data or contexts for stories.  
**Template:** Storybook Preview Configuration  
**Dependency Level:** 0  
**Name:** preview  
**Type:** Configuration  
**Relative Path:** ../.storybook/preview.tsx  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** parameters  
**Type:** object  
**Attributes:** optional  
    - **Name:** decorators  
**Type:** DecoratorFunction[]  
**Attributes:** optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Global Story Decorators
    - Theme Provision for Stories
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - UI component library)
    
**Purpose:** Customizes the rendering of stories in Storybook, applying global contexts or parameters.  
**Logic Description:** Exports 'parameters' object with 'actions: { argTypesRegex: "^on[A-Z].*" }' and 'controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } }'. Exports 'decorators' array, potentially including a ThemeProvider from Material-UI to wrap all stories, and an i18n provider.  
**Documentation:**
    
    - **Summary:** Configures how stories are rendered in Storybook, allowing for global wrappers and settings.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** DevelopmentToolConfiguration
    
- **Path:** libs/ui-component-library/src/index.ts  
**Description:** Main entry point for the UI component library. Exports all public components, theme utilities, hooks, and types to be consumed by applications.  
**Template:** TypeScript Module Index  
**Dependency Level:** 4  
**Name:** index  
**Type:** ModuleIndex  
**Relative Path:** index.ts  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Library Public API Definition
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - UI component library)
    
**Purpose:** Serves as the public interface of the component library, aggregating and exporting all usable parts.  
**Logic Description:** Contains export statements for all public components from './components', theme configuration from './theme', custom hooks from './hooks', utility functions from './utils', and relevant types.  
**Documentation:**
    
    - **Summary:** The primary export file for the UI component library, making components and utilities available for import by consuming applications.
    
**Namespace:** AdManager.Shared.UI  
**Metadata:**
    
    - **Category:** LibraryEntrypoint
    
- **Path:** libs/ui-component-library/src/theme/theme.ts  
**Description:** Defines the main theme object for the UI component library, typically using Material-UI's `createTheme`. Includes palette, typography, spacing, breakpoints, and component overrides.  
**Template:** TypeScript Theme Configuration  
**Dependency Level:** 1  
**Name:** theme  
**Type:** Configuration  
**Relative Path:** theme/theme.ts  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** adManagerTheme  
**Type:** Theme  
**Attributes:** export const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Application Theming
    - Branding Consistency
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - UI component library)
    
**Purpose:** Provides a centralized theme configuration for consistent styling across all components.  
**Logic Description:** Imports `createTheme` from '@mui/material/styles', and custom palette, typography, spacing configurations from sibling files. Defines a theme object by calling `createTheme` with these configurations and any global component style overrides. Exports the created theme.  
**Documentation:**
    
    - **Summary:** Creates and exports the Material-UI theme object, consolidating branding guidelines like colors, typography, and spacing.
    
**Namespace:** AdManager.Shared.UI.Theme  
**Metadata:**
    
    - **Category:** Styling
    
- **Path:** libs/ui-component-library/src/theme/palette.ts  
**Description:** Defines the color palette for the Ad Manager design system (primary, secondary, error, warning, info, success colors, text colors, background colors).  
**Template:** TypeScript Configuration  
**Dependency Level:** 0  
**Name:** palette  
**Type:** Configuration  
**Relative Path:** theme/palette.ts  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** primary  
**Type:** PaletteColorOptions  
**Attributes:** export const  
    - **Name:** secondary  
**Type:** PaletteColorOptions  
**Attributes:** export const  
    - **Name:** error  
**Type:** PaletteColorOptions  
**Attributes:** export const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Color Palette Definition
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - UI component library)
    
**Purpose:** Centralizes all color definitions used in the application theme.  
**Logic Description:** Exports constant objects for primary, secondary, error, warning, info, and success colors, each with 'main', 'light', 'dark', 'contrastText' properties. Defines text colors (primary, secondary, disabled) and background colors (paper, default).  
**Documentation:**
    
    - **Summary:** Contains definitions for the application's color scheme, used by the main theme object.
    
**Namespace:** AdManager.Shared.UI.Theme  
**Metadata:**
    
    - **Category:** Styling
    
- **Path:** libs/ui-component-library/src/theme/typography.ts  
**Description:** Defines typography settings (font families, font sizes, font weights, line heights) for various text elements like headings, body text, and captions.  
**Template:** TypeScript Configuration  
**Dependency Level:** 0  
**Name:** typography  
**Type:** Configuration  
**Relative Path:** theme/typography.ts  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** typographyOptions  
**Type:** TypographyOptions  
**Attributes:** export const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Typography System Definition
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - UI component library)
    
**Purpose:** Centralizes typography styles and scales for consistent text rendering.  
**Logic Description:** Exports a typography options object defining 'fontFamily', and styles for variants like 'h1', 'h2', 'body1', 'caption', etc., including 'fontSize', 'fontWeight', 'lineHeight'. Ensures font choices support both English and Arabic.  
**Documentation:**
    
    - **Summary:** Specifies font families, sizes, weights, and other typographic properties for the application theme.
    
**Namespace:** AdManager.Shared.UI.Theme  
**Metadata:**
    
    - **Category:** Styling
    
- **Path:** libs/ui-component-library/src/theme/GlobalStyles.tsx  
**Description:** React component applying global CSS resets, base HTML element styling, and any other global styles required for the library, using Material-UI's GlobalStyles or styled-components' createGlobalStyle.  
**Template:** React Component Template  
**Dependency Level:** 1  
**Name:** GlobalStyles  
**Type:** Component  
**Relative Path:** theme/GlobalStyles.tsx  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Global CSS Styling
    - CSS Reset
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - UI component library)
    
**Purpose:** Applies consistent base styling and resets across applications using the component library.  
**Logic Description:** Imports `GlobalStyles` from '@mui/material'. Defines a React component that renders `<GlobalStyles styles={{ ... }} />` with CSS resets (e.g., box-sizing), base font settings for `html` and `body`, and any other global CSS rules. Ensures RTL support for Arabic content at a global level if necessary.  
**Documentation:**
    
    - **Summary:** Component for injecting global CSS styles, ensuring a consistent baseline for all UIs.
    
**Namespace:** AdManager.Shared.UI.Theme  
**Metadata:**
    
    - **Category:** Styling
    
- **Path:** libs/ui-component-library/src/components/Button/Button.tsx  
**Description:** A versatile button component supporting different variants (contained, outlined, text), colors, sizes, states (disabled, loading), and icons. Adheres to WCAG 2.1 AA for accessibility.  
**Template:** React Component Template  
**Dependency Level:** 2  
**Name:** Button  
**Type:** Component  
**Relative Path:** components/Button/Button.tsx  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    - PresentationalComponent
    - AtomicDesignAtom
    
**Members:**
    
    - **Name:** children  
**Type:** React.ReactNode  
**Attributes:** prop  
    - **Name:** variant  
**Type:** 'contained' | 'outlined' | 'text'  
**Attributes:** prop|optional  
    - **Name:** color  
**Type:** 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'  
**Attributes:** prop|optional  
    - **Name:** size  
**Type:** 'small' | 'medium' | 'large'  
**Attributes:** prop|optional  
    - **Name:** disabled  
**Type:** boolean  
**Attributes:** prop|optional  
    - **Name:** loading  
**Type:** boolean  
**Attributes:** prop|optional  
    - **Name:** startIcon  
**Type:** React.ReactNode  
**Attributes:** prop|optional  
    - **Name:** endIcon  
**Type:** React.ReactNode  
**Attributes:** prop|optional  
    - **Name:** onClick  
**Type:** () => void  
**Attributes:** prop|optional  
    - **Name:** href  
**Type:** string  
**Attributes:** prop|optional  
    - **Name:** component  
**Type:** React.ElementType  
**Attributes:** prop|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Clickable Action Trigger
    - Visual Variants
    - Disabled State
    - Loading State
    - Icon Support
    - Accessibility for Buttons
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - UI component library)
    - REQ-6-011
    
**Purpose:** Provides a standardized, accessible, and themeable button for user interactions across the platform.  
**Logic Description:** Uses Material-UI's Button component as a base or implements a custom button with styled-components/Emotion. Manages 'loading' state by potentially showing a spinner. Ensures 'type="button"' by default for non-submit buttons. Applies ARIA attributes like 'aria-disabled', 'aria-label' if only an icon is present. Forwards ref to the underlying button element. Handles i18n for any default text or labels if applicable via props.  
**Documentation:**
    
    - **Summary:** A flexible button component used for triggering actions. Supports various visual styles, sizes, and states, ensuring accessibility standards are met.
    
**Namespace:** AdManager.Shared.UI.Components.Button  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** libs/ui-component-library/src/components/Button/Button.types.ts  
**Description:** TypeScript type definitions for the Button component's props.  
**Template:** TypeScript Type Definition  
**Dependency Level:** 1  
**Name:** Button.types  
**Type:** TypeDefinition  
**Relative Path:** components/Button/Button.types.ts  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** ButtonProps  
**Type:** interface  
**Attributes:** export  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Button Component Prop Typing
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - UI component library)
    
**Purpose:** Defines the contract for Button component properties, ensuring type safety.  
**Logic Description:** Exports an interface `ButtonProps` extending `React.ButtonHTMLAttributes<HTMLButtonElement>` and Material-UI `ButtonProps` (if applicable). Includes props like `variant`, `color`, `size`, `loading`, `startIcon`, `endIcon`, `children`, etc. specified in Button.tsx.  
**Documentation:**
    
    - **Summary:** Contains TypeScript interfaces and types for the props accepted by the Button component.
    
**Namespace:** AdManager.Shared.UI.Components.Button  
**Metadata:**
    
    - **Category:** TypeDefinition
    
- **Path:** libs/ui-component-library/src/components/Button/Button.stories.tsx  
**Description:** Storybook stories for the Button component, showcasing its different variants, states, and usage examples.  
**Template:** Storybook Story File  
**Dependency Level:** 2  
**Name:** Button.stories  
**Type:** Story  
**Relative Path:** components/Button/Button.stories.tsx  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** default  
**Type:** Meta<typeof Button>  
**Attributes:** export  
    - **Name:** Primary  
**Type:** StoryObj<typeof Button>  
**Attributes:** export const  
    - **Name:** Secondary  
**Type:** StoryObj<typeof Button>  
**Attributes:** export const  
    - **Name:** Disabled  
**Type:** StoryObj<typeof Button>  
**Attributes:** export const  
    - **Name:** WithIcon  
**Type:** StoryObj<typeof Button>  
**Attributes:** export const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Component Demonstration
    - Interactive Playground
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - UI component library)
    
**Purpose:** Provides a development and documentation environment for the Button component using Storybook.  
**Logic Description:** Imports the Button component and `Meta`, `StoryObj` from '@storybook/react'. Defines a default export (meta) with 'title', 'component', 'argTypes'. Exports multiple stories (Primary, Secondary, Disabled, WithIcon, Loading) by creating instances of the Button component with different props.  
**Documentation:**
    
    - **Summary:** Showcases various configurations and states of the Button component in an interactive Storybook environment.
    
**Namespace:** AdManager.Shared.UI.Components.Button  
**Metadata:**
    
    - **Category:** Documentation
    
- **Path:** libs/ui-component-library/src/components/Button/index.ts  
**Description:** Barrel file for the Button component, re-exporting the main component and its types.  
**Template:** TypeScript Module Index  
**Dependency Level:** 3  
**Name:** Button.index  
**Type:** ModuleIndex  
**Relative Path:** components/Button/index.ts  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Component Module Export
    
**Requirement Ids:**
    
    - 3.3.1 (User Interface - UI component library)
    
**Purpose:** Simplifies importing the Button component and its related exports.  
**Logic Description:** Exports the `Button` component from './Button' and `ButtonProps` type from './Button.types'. Example- `export { default as Button } from './Button'; export * from './Button.types';`  
**Documentation:**
    
    - **Summary:** Consolidates exports for the Button component module.
    
**Namespace:** AdManager.Shared.UI.Components.Button  
**Metadata:**
    
    - **Category:** ModuleStructure
    
- **Path:** libs/ui-component-library/src/components/CountdownTimer/CountdownTimer.tsx  
**Description:** A component that displays a countdown to a specific future date/time. Used for promotions, flash sales, etc. Ensures accessibility of time information.  
**Template:** React Component Template  
**Dependency Level:** 2  
**Name:** CountdownTimer  
**Type:** Component  
**Relative Path:** components/CountdownTimer/CountdownTimer.tsx  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    - PresentationalComponent
    
**Members:**
    
    - **Name:** targetDate  
**Type:** Date | string | number  
**Attributes:** prop|required  
    - **Name:** onComplete  
**Type:** () => void  
**Attributes:** prop|optional  
    - **Name:** format  
**Type:** string  
**Attributes:** prop|optional|e_g_ DD HH MM SS  
    
**Methods:**
    
    - **Name:** calculateTimeLeft  
**Parameters:**
    
    
**Return Type:** object  
**Attributes:** private  
    
**Implemented Features:**
    
    - Time Countdown Display
    - Completion Callback
    - Customizable Format
    - Accessibility for Time-Sensitive Info
    
**Requirement Ids:**
    
    - REQ-6-007
    - REQ-6-011
    - REQ-6-012
    
**Purpose:** Displays a dynamically updating countdown timer to a specified target date and time.  
**Logic Description:** Accepts a 'targetDate' prop. Uses 'useEffect' and 'setInterval' to update the displayed time remaining (days, hours, minutes, seconds). Calls 'onComplete' callback when the countdown finishes. Formats the output according to the 'format' prop. Ensures that screen readers can announce the time remaining appropriately. Text labels for time units (days, hours etc) should be internationalized using an i18n library based on REQ-6-012.  
**Documentation:**
    
    - **Summary:** A component to render a countdown timer for events like sales or deadlines.
    
**Namespace:** AdManager.Shared.UI.Components.CountdownTimer  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** libs/ui-component-library/src/components/CountdownTimer/CountdownTimer.types.ts  
**Description:** TypeScript type definitions for the CountdownTimer component's props.  
**Template:** TypeScript Type Definition  
**Dependency Level:** 1  
**Name:** CountdownTimer.types  
**Type:** TypeDefinition  
**Relative Path:** components/CountdownTimer/CountdownTimer.types.ts  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** CountdownTimerProps  
**Type:** interface  
**Attributes:** export  
    
**Methods:**
    
    
**Implemented Features:**
    
    - CountdownTimer Prop Typing
    
**Requirement Ids:**
    
    - REQ-6-007
    
**Purpose:** Defines the contract for CountdownTimer component properties.  
**Logic Description:** Exports an interface `CountdownTimerProps` including `targetDate`, `onComplete`, and `format`.  
**Documentation:**
    
    - **Summary:** TypeScript types for the CountdownTimer component.
    
**Namespace:** AdManager.Shared.UI.Components.CountdownTimer  
**Metadata:**
    
    - **Category:** TypeDefinition
    
- **Path:** libs/ui-component-library/src/components/CountdownTimer/CountdownTimer.stories.tsx  
**Description:** Storybook stories for the CountdownTimer component.  
**Template:** Storybook Story File  
**Dependency Level:** 2  
**Name:** CountdownTimer.stories  
**Type:** Story  
**Relative Path:** components/CountdownTimer/CountdownTimer.stories.tsx  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** default  
**Type:** Meta<typeof CountdownTimer>  
**Attributes:** export  
    - **Name:** Default  
**Type:** StoryObj<typeof CountdownTimer>  
**Attributes:** export const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Component Demonstration
    
**Requirement Ids:**
    
    - REQ-6-007
    
**Purpose:** Showcases the CountdownTimer component in Storybook.  
**Logic Description:** Imports CountdownTimer. Defines meta object. Exports stories with different target dates and formats.  
**Documentation:**
    
    - **Summary:** Interactive examples of the CountdownTimer component.
    
**Namespace:** AdManager.Shared.UI.Components.CountdownTimer  
**Metadata:**
    
    - **Category:** Documentation
    
- **Path:** libs/ui-component-library/src/components/CountdownTimer/index.ts  
**Description:** Barrel file for the CountdownTimer component.  
**Template:** TypeScript Module Index  
**Dependency Level:** 3  
**Name:** CountdownTimer.index  
**Type:** ModuleIndex  
**Relative Path:** components/CountdownTimer/index.ts  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Component Module Export
    
**Requirement Ids:**
    
    - REQ-6-007
    
**Purpose:** Simplifies importing the CountdownTimer component.  
**Logic Description:** Exports `CountdownTimer` from './CountdownTimer' and `CountdownTimerProps` from './CountdownTimer.types'.  
**Documentation:**
    
    - **Summary:** Consolidates exports for the CountdownTimer module.
    
**Namespace:** AdManager.Shared.UI.Components.CountdownTimer  
**Metadata:**
    
    - **Category:** ModuleStructure
    
- **Path:** libs/ui-component-library/src/components/PromotionalBanner/PromotionalBanner.tsx  
**Description:** Component for displaying promotional banners with customizable text, background image/color, and a call-to-action button. Accessible and themeable.  
**Template:** React Component Template  
**Dependency Level:** 3  
**Name:** PromotionalBanner  
**Type:** Component  
**Relative Path:** components/PromotionalBanner/PromotionalBanner.tsx  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    - PresentationalComponent
    
**Members:**
    
    - **Name:** title  
**Type:** string  
**Attributes:** prop|required  
    - **Name:** description  
**Type:** string  
**Attributes:** prop|optional  
    - **Name:** ctaText  
**Type:** string  
**Attributes:** prop|optional  
    - **Name:** ctaLink  
**Type:** string  
**Attributes:** prop|optional  
    - **Name:** onCtaClick  
**Type:** () => void  
**Attributes:** prop|optional  
    - **Name:** backgroundImage  
**Type:** string  
**Attributes:** prop|optional  
    - **Name:** backgroundColor  
**Type:** string  
**Attributes:** prop|optional  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Promotional Content Display
    - Customizable CTA
    - Image/Color Background
    - Accessibility for Banners
    
**Requirement Ids:**
    
    - REQ-6-007
    - REQ-6-011
    - REQ-6-012
    
**Purpose:** Provides a reusable component for displaying marketing banners and promotions.  
**Logic Description:** Renders a container with optional background image or color. Displays title and description text. If 'ctaText' is provided, renders a Button component (from this library) with the specified text and link/action. Ensures text content is internationalized if sourced from fixed strings. ARIA roles (e.g. 'region', 'complementary') and appropriate labelling for accessibility.  
**Documentation:**
    
    - **Summary:** A component designed to showcase promotional messages, often with a call to action.
    
**Namespace:** AdManager.Shared.UI.Components.PromotionalBanner  
**Metadata:**
    
    - **Category:** Presentation
    
- **Path:** libs/ui-component-library/src/components/PromotionalBanner/PromotionalBanner.types.ts  
**Description:** TypeScript types for PromotionalBanner props.  
**Template:** TypeScript Type Definition  
**Dependency Level:** 1  
**Name:** PromotionalBanner.types  
**Type:** TypeDefinition  
**Relative Path:** components/PromotionalBanner/PromotionalBanner.types.ts  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** PromotionalBannerProps  
**Type:** interface  
**Attributes:** export  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Prop Typing
    
**Requirement Ids:**
    
    - REQ-6-007
    
**Purpose:** Defines the contract for PromotionalBanner props.  
**Logic Description:** Exports `PromotionalBannerProps` interface with fields like `title`, `description`, `ctaText`, `ctaLink`, `backgroundImage`, etc.  
**Documentation:**
    
    - **Summary:** Type definitions for the PromotionalBanner component's properties.
    
**Namespace:** AdManager.Shared.UI.Components.PromotionalBanner  
**Metadata:**
    
    - **Category:** TypeDefinition
    
- **Path:** libs/ui-component-library/src/components/PromotionalBanner/PromotionalBanner.stories.tsx  
**Description:** Storybook stories for PromotionalBanner.  
**Template:** Storybook Story File  
**Dependency Level:** 3  
**Name:** PromotionalBanner.stories  
**Type:** Story  
**Relative Path:** components/PromotionalBanner/PromotionalBanner.stories.tsx  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** default  
**Type:** Meta<typeof PromotionalBanner>  
**Attributes:** export  
    - **Name:** Default  
**Type:** StoryObj<typeof PromotionalBanner>  
**Attributes:** export const  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Component Showcase
    
**Requirement Ids:**
    
    - REQ-6-007
    
**Purpose:** Demonstrates PromotionalBanner usage in Storybook.  
**Logic Description:** Imports PromotionalBanner. Defines meta. Exports stories with various props for different banner appearances.  
**Documentation:**
    
    - **Summary:** Interactive examples for the PromotionalBanner component.
    
**Namespace:** AdManager.Shared.UI.Components.PromotionalBanner  
**Metadata:**
    
    - **Category:** Documentation
    
- **Path:** libs/ui-component-library/src/components/PromotionalBanner/index.ts  
**Description:** Barrel file for PromotionalBanner.  
**Template:** TypeScript Module Index  
**Dependency Level:** 4  
**Name:** PromotionalBanner.index  
**Type:** ModuleIndex  
**Relative Path:** components/PromotionalBanner/index.ts  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    
**Implemented Features:**
    
    - Module Export
    
**Requirement Ids:**
    
    - REQ-6-007
    
**Purpose:** Simplifies imports for PromotionalBanner.  
**Logic Description:** Exports `PromotionalBanner` and `PromotionalBannerProps`.  
**Documentation:**
    
    - **Summary:** Aggregates exports for the PromotionalBanner module.
    
**Namespace:** AdManager.Shared.UI.Components.PromotionalBanner  
**Metadata:**
    
    - **Category:** ModuleStructure
    
- **Path:** libs/ui-component-library/src/i18n.ts  
**Description:** Internationalization (i18n) setup using a library like i18next. Configures language resources, default language, and exports the i18n instance or related hooks.  
**Template:** TypeScript Configuration  
**Dependency Level:** 1  
**Name:** i18n  
**Type:** Configuration  
**Relative Path:** i18n.ts  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** init  
**Parameters:**
    
    - options: object
    
**Return Type:** Promise<TFunction>  
**Attributes:** export function (from i18next)  
    
**Implemented Features:**
    
    - Internationalization Setup
    - Language Resource Loading
    
**Requirement Ids:**
    
    - REQ-6-012
    - 3.2.9 (Localization and Internationalization - UI components supporting i18n)
    
**Purpose:** Initializes and configures the internationalization framework for the component library.  
**Logic Description:** Imports `i18n` from 'i18next', `initReactI18next` from 'react-i18next', and language resources from './locales'. Initializes i18next with resources for 'en' and 'ar', sets 'lng' (default language), 'fallbackLng', and interpolation options. Exports the configured i18n instance.  
**Documentation:**
    
    - **Summary:** Configuration file for the i18n library, enabling multi-language support in components.
    
**Namespace:** AdManager.Shared.UI.I18n  
**Metadata:**
    
    - **Category:** Internationalization
    
- **Path:** libs/ui-component-library/src/locales/en.json  
**Description:** JSON file containing English translations for UI component strings.  
**Template:** JSON Locale File  
**Dependency Level:** 0  
**Name:** en  
**Type:** Locale  
**Relative Path:** locales/en.json  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** translation  
**Type:** object  
**Attributes:** root_key  
    
**Methods:**
    
    
**Implemented Features:**
    
    - English Language Strings
    
**Requirement Ids:**
    
    - REQ-6-012
    
**Purpose:** Provides English language strings for the component library.  
**Logic Description:** A JSON object where keys are translation IDs (e.g., 'button.submit', 'countdown.days') and values are the English strings. Example `{"translation": {"button.submit": "Submit"}}`  
**Documentation:**
    
    - **Summary:** Contains key-value pairs for English localizations.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Internationalization
    
- **Path:** libs/ui-component-library/src/locales/ar.json  
**Description:** JSON file containing Arabic translations for UI component strings. Supports Right-to-Left (RTL) text direction implicitly through language choice.  
**Template:** JSON Locale File  
**Dependency Level:** 0  
**Name:** ar  
**Type:** Locale  
**Relative Path:** locales/ar.json  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    - **Name:** translation  
**Type:** object  
**Attributes:** root_key  
    
**Methods:**
    
    
**Implemented Features:**
    
    - Arabic Language Strings
    
**Requirement Ids:**
    
    - REQ-6-012
    
**Purpose:** Provides Arabic language strings for the component library, enabling RTL support.  
**Logic Description:** A JSON object similar to en.json, but with Arabic translations. Example `{"translation": {"button.submit": "إرسال"}}`  
**Documentation:**
    
    - **Summary:** Contains key-value pairs for Arabic localizations.
    
**Namespace:**   
**Metadata:**
    
    - **Category:** Internationalization
    
- **Path:** libs/ui-component-library/src/utils/accessibilityUtils.ts  
**Description:** Utility functions related to accessibility, such as generating unique IDs for ARIA attributes or focus management helpers.  
**Template:** TypeScript Utility Module  
**Dependency Level:** 0  
**Name:** accessibilityUtils  
**Type:** Utility  
**Relative Path:** utils/accessibilityUtils.ts  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** generateUniqueId  
**Parameters:**
    
    - prefix?: string
    
**Return Type:** string  
**Attributes:** export function  
    - **Name:** focusElement  
**Parameters:**
    
    - element: HTMLElement | null
    
**Return Type:** void  
**Attributes:** export function  
    
**Implemented Features:**
    
    - ARIA Attribute Helpers
    - Focus Management Utilities
    
**Requirement Ids:**
    
    - REQ-6-011
    
**Purpose:** Provides shared helper functions to improve component accessibility.  
**Logic Description:** `generateUniqueId` creates a unique string suitable for HTML IDs. `focusElement` safely attempts to focus a given DOM element. These utilities assist components in meeting WCAG requirements.  
**Documentation:**
    
    - **Summary:** A collection of utility functions to aid in developing accessible UI components.
    
**Namespace:** AdManager.Shared.UI.Utils  
**Metadata:**
    
    - **Category:** Utility
    
- **Path:** libs/ui-component-library/src/hooks/useDirection.ts  
**Description:** Custom React hook to determine the current text direction (LTR or RTL) based on the active language from the i18n context. Useful for components needing direction-aware styling or logic.  
**Template:** React Hook Template  
**Dependency Level:** 2  
**Name:** useDirection  
**Type:** Hook  
**Relative Path:** hooks/useDirection.ts  
**Repository Id:** REPO-SHARED-UI-001  
**Pattern Ids:**
    
    
**Members:**
    
    
**Methods:**
    
    - **Name:** useDirection  
**Parameters:**
    
    
**Return Type:** 'ltr' | 'rtl'  
**Attributes:** export function  
    
**Implemented Features:**
    
    - Text Direction Detection
    
**Requirement Ids:**
    
    - REQ-6-012
    
**Purpose:** Provides the current text direction (LTR/RTL) to components, facilitating direction-aware rendering.  
**Logic Description:** Imports `useTranslation` from 'react-i18next'. Accesses the current language from `i18n.language`. Returns 'rtl' if the language is Arabic ('ar'), otherwise returns 'ltr'. This helps components adjust styles or layouts for RTL languages.  
**Documentation:**
    
    - **Summary:** A React hook that returns the current language direction ('ltr' or 'rtl').
    
**Namespace:** AdManager.Shared.UI.Hooks  
**Metadata:**
    
    - **Category:** Hook
    


---

# 2. Configuration

- **Feature Toggles:**
  
  - enableAdvancedThemingOptions
  - showExperimentalComponents
  
- **Database Configs:**
  
  


---

