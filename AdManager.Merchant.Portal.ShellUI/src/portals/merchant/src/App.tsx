import React, { useMemo } from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import { store, RootState } from './core/state/store';
import { getAppTheme } from './config/theme.config';
import i18nInstance from './config/i18n.config'; // SDS 3.1.10 exports the configured instance
import ErrorFallbackComponent from './components/ErrorFallback';
import { AuthProvider } from './core/auth/AuthProvider';
import AppRouter from './core/navigation/AppRouter';

/**
 * @file Root component of the Merchant Portal Shell UI.
 * @summary Sets up global providers like Theme, Redux Store, Router, Internationalization, and Error Boundaries. Orchestrates the main layout and routing.
 * @description This component establishes the application's foundational structure and global contexts.
 * It wraps the `AppRouter` with `ThemeProvider` (Material-UI), `Provider` (Redux),
 * `BrowserRouter` (react-router-dom), `I18nextProvider`, and a global `ErrorBoundary`.
 * It also initializes the `AuthProvider` for authentication state management.
 * Accessibility (REQ-6-011) is supported through MUI theming and proper component usage.
 * Internationalization (REQ-6-012) is supported via `I18nextProvider` and dynamic theme direction.
 */

/**
 * Logs errors caught by the ErrorBoundary.
 * @param {Error} error - The error that was caught.
 * @param {React.ErrorInfo} info - An object with a `componentStack` key containing information about which component crashed.
 */
const handleErrorBoundaryError = (error: Error, info: React.ErrorInfo) => {
  // TODO: Replace with a proper logging service in production
  console.error('ErrorBoundary caught an error:', error, info);
};

/**
 * A component that consumes Redux state and i18n context to provide the dynamic theme
 * and renders the main application router.
 * This component must be a child of ReduxProvider and I18nextProvider.
 * @returns {JSX.Element} The themed application content.
 */
const ThemedAppContent: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const { i18n } = useTranslation();
  const currentDir = useMemo(() => (i18n.dir() as 'ltr' | 'rtl'), [i18n]);

  const theme = useMemo(
    () => getAppTheme(themeMode, currentDir),
    [themeMode, currentDir]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
};

/**
 * The main App component.
 * It sets up all global providers and renders the ThemedAppContent.
 * @returns {JSX.Element} The root application component.
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallbackComponent as React.ComponentType<FallbackProps>}
      onError={handleErrorBoundaryError}
    >
      <ReduxProvider store={store}>
        <I18nextProvider i18n={i18nInstance}>
          <AuthProvider>
            <BrowserRouter>
              <ThemedAppContent />
            </BrowserRouter>
          </AuthProvider>
        </I18nextProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
};

export default App;