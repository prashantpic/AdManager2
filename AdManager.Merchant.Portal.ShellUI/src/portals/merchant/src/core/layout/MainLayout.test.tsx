import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MainLayout from './MainLayout';

// Mock child components
jest.mock('./Header', () => () => <div data-testid="mock-header">Header</div>);
jest.mock('./Sidebar', () => () => <div data-testid="mock-sidebar">Sidebar</div>);
jest.mock('./Footer', () => () => <div data-testid="mock-footer">Footer</div>);
jest.mock('./NotificationCenter', () => () => <div data-testid="mock-notification-center">NotificationCenter</div>);
jest.mock('../../components/GlobalLoader', () => () => <div data-testid="mock-global-loader">GlobalLoader</div>);

// Mock Redux store
const mockStore = configureStore([]);
const initialState = {
  ui: { themeMode: 'light', globalLoading: false, notifications: [] },
  merchantContext: { profile: null, isLoading: false, error: null },
  // Add other slices if MainLayout or its children depend on them
};

const theme = createTheme();

describe('MainLayout', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {ui}
        </ThemeProvider>
      </Provider>
    );
  };

  it('renders Header, Sidebar, Footer, NotificationCenter, and GlobalLoader', () => {
    renderWithProviders(<MainLayout><div>Child Content</div></MainLayout>);

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-notification-center')).toBeInTheDocument();
    expect(screen.getByTestId('mock-global-loader')).toBeInTheDocument();
  });

  it('renders children content', () => {
    const childText = 'This is the main content';
    renderWithProviders(<MainLayout><div>{childText}</div></MainLayout>);

    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  // Placeholder for testing sidebar toggle functionality if directly managed or exposed
  // This might involve mocking Header's onDrawerToggle prop and checking Sidebar's open prop
  it('should handle sidebar toggle (conceptual test)', () => {
    // This test would be more involved, requiring deeper mocking of Header/Sidebar interaction
    // For now, it's a placeholder acknowledging the feature.
    // Example:
    // const { rerender } = renderWithProviders(<MainLayout>Content</MainLayout>);
    // Simulate toggle action (e.g., via a mocked Header prop call)
    // Check if Sidebar receives updated 'open' prop
    expect(true).toBe(true); // Placeholder
  });

  it('applies main content area styling (conceptual)', () => {
    // This would involve checking applied CSS classes or styles,
    // which can be complex with JSS/Styled Components.
    // For now, this is a conceptual placeholder.
    renderWithProviders(<MainLayout><div>Child Content</div></MainLayout>);
    const mainElement = screen.getByRole('main'); // The Box component with role="main"
    expect(mainElement).toBeInTheDocument();
    // Further checks could involve:
    // expect(mainElement).toHaveStyle('flex-grow: 1');
    // expect(mainElement).toHaveStyle(`padding-top: ${theme.mixins.toolbar.minHeight}px`);
  });
});