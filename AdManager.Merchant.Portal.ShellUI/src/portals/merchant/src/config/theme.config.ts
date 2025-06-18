import { createTheme, ThemeOptions, PaletteMode, Direction } from '@mui/material/styles';
import { common } from '@mui/material/colors';

/**
 * @file Material-UI theme configuration.
 * @summary Centralized Material-UI theme definition for the Merchant Portal.
 * Implements REQ-6-011 (Accessibility: Color contrast, typography for readability)
 * Implements REQ-6-012 (RTL support: theme direction)
 */

/**
 * Base typography settings.
 * These can be customized further based on branding guidelines.
 */
const typography: ThemeOptions['typography'] = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontSize: '2.5rem', fontWeight: 500 },
  h2: { fontSize: '2rem', fontWeight: 500 },
  h3: { fontSize: '1.75rem', fontWeight: 500 },
  h4: { fontSize: '1.5rem', fontWeight: 500 },
  h5: { fontSize: '1.25rem', fontWeight: 500 },
  h6: { fontSize: '1rem', fontWeight: 500 },
  // Ensure sufficient contrast and legibility for body text
  body1: { fontSize: '1rem', lineHeight: 1.6 },
  body2: { fontSize: '0.875rem', lineHeight: 1.5 },
  button: { textTransform: 'none', fontWeight: 500 }, // Keep button text case as defined
};

/**
 * Spacing configuration. MUI default is 8px.
 */
const spacing: ThemeOptions['spacing'] = 8;

/**
 * Breakpoints configuration.
 */
const breakpoints: ThemeOptions['breakpoints'] = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

/**
 * Light theme palette options.
 * Colors should ensure WCAG AA contrast ratios.
 */
const lightPalette: ThemeOptions['palette'] = {
  mode: 'light',
  primary: {
    main: '#1976d2', // Example: Blue
    contrastText: common.white,
  },
  secondary: {
    main: '#dc004e', // Example: Pink
    contrastText: common.white,
  },
  background: {
    default: '#f4f6f8',
    paper: common.white,
  },
  text: {
    primary: '#212121', // Dark grey for primary text
    secondary: '#757575', // Lighter grey for secondary text
  },
  error: {
    main: '#d32f2f', // Standard error red
  },
  warning: {
    main: '#ed6c02', // Standard warning orange
  },
  info: {
    main: '#0288d1', // Standard info blue
  },
  success: {
    main: '#2e7d32', // Standard success green
  },
};

/**
 * Dark theme palette options.
 * Colors should ensure WCAG AA contrast ratios.
 */
const darkPalette: ThemeOptions['palette'] = {
  mode: 'dark',
  primary: {
    main: '#90caf9', // Example: Lighter blue for dark mode
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  secondary: {
    main: '#f48fb1', // Example: Lighter pink for dark mode
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  background: {
    default: '#121212', // Standard dark background
    paper: '#1e1e1e', // Slightly lighter dark for paper elements
  },
  text: {
    primary: common.white,
    secondary: 'rgba(255, 255, 255, 0.7)',
  },
  error: {
    main: '#ef5350', // Lighter error red for dark mode
  },
  warning: {
    main: '#ffa726', // Lighter warning orange
  },
  info: {
    main: '#29b6f6', // Lighter info blue
  },
  success: {
    main: '#66bb6a', // Lighter success green
  },
};

/**
 * Common component overrides.
 * This is where you can customize the default styles of MUI components.
 */
const componentOverrides = (direction: Direction): ThemeOptions['components'] => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8, // Example: Rounded buttons
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        // Example: elevation based on mode
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        // Example: custom drawer width or background
      },
    },
  },
  // Ensure form inputs have clear focus indicators and labels for accessibility
  MuiTextField: {
    defaultProps: {
      variant: 'outlined', // Consistent text field style
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        // Ensure labels are associated with inputs
        // This is typically handled by MUI, but specific styles can be added
      },
    },
  },
  // Add other component overrides as needed
});

/**
 * Generates the application theme based on the selected mode and direction.
 * @param {PaletteMode} mode - The color palette mode ('light' or 'dark').
 * @param {Direction} direction - The text direction ('ltr' or 'rtl').
 * @returns {ThemeOptions} The configured MUI theme.
 */
export const getAppTheme = (mode: PaletteMode, direction: Direction): ThemeOptions => ({
  palette: mode === 'light' ? lightPalette : darkPalette,
  typography,
  spacing,
  breakpoints,
  components: componentOverrides(direction),
  direction, // Set text direction for RTL support
  // Custom theme variables can be added here
  custom: {
    // Example: custom variables accessible via theme.custom
  },
});

// Augment the Theme interface to include custom properties
declare module '@mui/material/styles' {
  interface Theme {
    custom?: {
      [key: string]: any;
    };
  }
  interface ThemeOptions {
    custom?: {
      [key: string]: any;
    };
  }
}

/**
 * Default light theme instance.
 * @deprecated Prefer using `getAppTheme` with dynamic mode and direction.
 */
export const defaultLightTheme = createTheme(getAppTheme('light', 'ltr'));

/**
 * Default dark theme instance.
 * @deprecated Prefer using `getAppTheme` with dynamic mode and direction.
 */
export const defaultDarkTheme = createTheme(getAppTheme('dark', 'ltr'));