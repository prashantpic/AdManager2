import React from 'react';
import { Container, Typography, Button, Paper, Box } from '@mui/material';
import { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router'; // For "Go Home" navigation

/**
 * `ErrorFallback` is a component displayed by a `react-error-boundary`
 * when an unhandled JavaScript error occurs within its scope.
 * It provides a user-friendly message, an option to retry the action (if applicable),
 * or navigate home, and logs the error.
 *
 * @param {FallbackProps} props - Props provided by `react-error-boundary`.
 * @param {Error} props.error - The error that was caught.
 * @param {() => void} props.resetErrorBoundary - A function to reset the error boundary's state and retry rendering.
 * @returns {React.ReactElement} The error fallback UI.
 * @see {@link REQ-6-011} - Accessibility: Ensure error messages are clear and actions are keyboard accessible.
 */
const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const { t } = useTranslation(['shell', 'common']);
  const router = useRouter();

  // Log the error to the console or an external error tracking service
  // In a real app, you might use Sentry, LogRocket, etc.
  React.useEffect(() => {
    console.error("Uncaught error:", error);
    // Example: Sentry.captureException(error);
  }, [error]);

  const handleGoHome = () => {
    router.push('/'); // Navigate to the homepage
    // Optionally, reset the error boundary if navigation itself should clear the error state
    // resetErrorBoundary(); // This might not be needed if navigating away
  };

  return (
    <Container
      component={Paper}
      elevation={3}
      sx={{
        mt: 8,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
      role="alert" // Make it an alert region for screen readers
      aria-live="assertive" // Announce assertively as it's a critical error
    >
      <Typography variant="h4" component="h1" gutterBottom color="error">
        {t('errorFallback.title', 'Oops! Something Went Wrong')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {t('errorFallback.message', 'We encountered an unexpected error. Please try again, or contact support if the problem persists.')}
      </Typography>

      {/* Optionally display error details in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          sx={{
            mt: 2,
            mb: 2,
            p: 2,
            border: '1px dashed grey',
            maxHeight: '200px',
            overflowY: 'auto',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <Typography variant="caption" display="block" gutterBottom>
            <strong>{t('errorFallback.devErrorDetails', 'Error Details (Development Mode):')}</strong>
          </Typography>
          <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {error.message}
            {error.stack && `\n\nStack Trace:\n${error.stack}`}
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={resetErrorBoundary} color="primary">
          {t('errorFallback.tryAgain', 'Try Again')}
        </Button>
        <Button variant="outlined" onClick={handleGoHome} color="secondary">
          {t('errorFallback.goHome', 'Go Home')}
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorFallback;