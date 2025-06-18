import React from 'react';
import { useSelector } from 'react-redux';
import { Backdrop, CircularProgress, Box } from '@mui/material';
import { selectGlobalLoading } from '../core/state/slices/uiSlice';
import { RootState } from '../core/state/store';

/**
 * `GlobalLoader` is a component that displays a global loading indicator (spinner)
 * when the `globalLoading` state in the Redux `uiSlice` is true.
 * It uses an MUI `Backdrop` to provide an overlay effect, indicating to the user
 * that a significant background operation is in progress.
 *
 * @returns {React.ReactElement | null} The GlobalLoader component or null if not loading.
 * @see {@link REQ-6-011} - Accessibility: Ensure the loading state is announced to screen readers.
 *                         MUI `CircularProgress` has `role="progressbar"`. The `Backdrop` can trap focus if needed.
 */
const GlobalLoader: React.FC = () => {
  const isLoading = useSelector((state: RootState) => selectGlobalLoading(state));

  if (!isLoading) {
    return null;
  }

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 100, // Ensure it's above most other elements
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
      open={isLoading}
      aria-busy="true"
      aria-live="polite" // Announce appearance and disappearance to screen readers
    >
      <CircularProgress color="inherit" aria-label="Loading content" />
      {/* Optional: Add a loading message, ensure it's translated if static */}
      {/* <Typography variant="h6" component="div" color="inherit">
        Loading...
      </Typography> */}
    </Backdrop>
  );
};

export default GlobalLoader;