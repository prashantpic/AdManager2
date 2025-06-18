import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import GlobalLoader from './GlobalLoader';
import { UIState } from '../core/state/slices/uiSlice';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // For Backdrop styling

const mockStore = configureStore<Partial<{ui: UIState}>>();
const theme = createTheme();

describe('GlobalLoader', () => {
  let store: any;

  const renderWithProviders = (isLoading: boolean) => {
    const initialState = {
      ui: {
        globalLoading: isLoading,
        // Provide other necessary ui state properties
        themeMode: 'light',
        notifications: [],
      } as UIState,
    };
    store = mockStore(initialState);

    return render(
      <Provider store={store}>
        <ThemeProvider theme={theme}> {/* MUI components might need ThemeProvider */}
            <GlobalLoader />
        </ThemeProvider>
      </Provider>
    );
  };

  it('renders nothing when globalLoading is false', () => {
    renderWithProviders(false);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    // Backdrop itself might not have a specific role unless open.
    // Check for absence or a specific data-testid if added.
  });

  it('renders Backdrop and CircularProgress when globalLoading is true', () => {
    renderWithProviders(true);
    const progressbar = screen.getByRole('progressbar', { name: /loading content/i });
    expect(progressbar).toBeInTheDocument();
    expect(progressbar.closest('.MuiBackdrop-root')).toBeInTheDocument(); // Check if CircularProgress is within a Backdrop
  });

  it('Backdrop has correct ARIA attributes when visible', () => {
    renderWithProviders(true);
    const backdropElement = screen.getByRole('progressbar').closest('.MuiBackdrop-root');
    expect(backdropElement).toHaveAttribute('aria-busy', 'true');
    // aria-live="polite" is on the Backdrop component itself, not easily queryable via role.
    // However, we can check if it's rendered.
    expect(backdropElement).toBeVisible();
  });
});