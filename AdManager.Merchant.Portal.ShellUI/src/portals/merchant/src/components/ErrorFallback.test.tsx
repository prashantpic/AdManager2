import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FallbackProps } from 'react-error-boundary';
import ErrorFallback from './ErrorFallback';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next'; // Your actual i18n instance or a mock
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';

// Mock i18next
jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key.split('.').pop() || key,
    i18n: { language: 'en', changeLanguage: jest.fn() },
  }),
}));

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
const mockUseRouter = useRouter as jest.Mock;
const mockRouterPush = jest.fn();


const theme = createTheme();

describe('ErrorFallback', () => {
  const mockError = new Error('Test error message');
  mockError.stack = 'Test stack trace';
  const mockResetErrorBoundary = jest.fn();

  const defaultProps: FallbackProps = {
    error: mockError,
    resetErrorBoundary: mockResetErrorBoundary,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockRouterPush });
    // Mock console.error to prevent test output pollution
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  const renderErrorFallback = (props: Partial<FallbackProps> = {}) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <ErrorFallback {...defaultProps} {...props} />
        </ThemeProvider>
      </I18nextProvider>
    );
  };

  it('renders the title and user-friendly message', () => {
    renderErrorFallback();
    expect(screen.getByText('Oops! Something Went Wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
  });

  it('calls resetErrorBoundary when "Try Again" button is clicked', () => {
    renderErrorFallback();
    fireEvent.click(screen.getByText('Try Again'));
    expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1);
  });

  it('calls router.push("/") when "Go Home" button is clicked', () => {
    renderErrorFallback();
    fireEvent.click(screen.getByText('Go Home'));
    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  it('logs the error to the console', () => {
    renderErrorFallback();
    expect(console.error).toHaveBeenCalledWith("Uncaught error:", mockError);
  });

  describe('Development mode error details', () => {
    const originalEnv = process.env.NODE_ENV;

    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('displays error message and stack trace in development mode', () => {
      renderErrorFallback();
      expect(screen.getByText('Error Details (Development Mode):')).toBeInTheDocument();
      expect(screen.getByText(mockError.message)).toBeInTheDocument();
      // Stack trace text might be split across elements or within a <pre>
      expect(screen.getByText(/Test stack trace/)).toBeInTheDocument();
    });
  });

  describe('Production mode error details', () => {
    const originalEnv = process.env.NODE_ENV;

    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('does not display error details in production mode', () => {
      renderErrorFallback();
      expect(screen.queryByText('Error Details (Development Mode):')).not.toBeInTheDocument();
      expect(screen.queryByText(mockError.message)).not.toBeInTheDocument();
    });
  });

  it('has correct ARIA roles for accessibility', () => {
    renderErrorFallback();
    const alertBox = screen.getByRole('alert');
    expect(alertBox).toBeInTheDocument();
    expect(alertBox).toHaveAttribute('aria-live', 'assertive');
  });
});