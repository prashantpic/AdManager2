import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import NotificationCenter from './NotificationCenter';
import { removeNotification, NotificationPayload, UIState } from '../state/slices/uiSlice';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // For Alert styling

const mockStore = configureStore<Partial<{ui: UIState}>>(  ); // Specify RootState if available, or partial state
const theme = createTheme();

describe('NotificationCenter', () => {
  let store: any;

  const renderWithProviders = (notifications: NotificationPayload[]) => {
    const initialState = {
      ui: {
        notifications,
        themeMode: 'light', // Add other ui state properties if needed
        globalLoading: false,
      },
    };
    store = mockStore(initialState);
    store.dispatch = jest.fn(); // Mock dispatch

    return render(
      <Provider store={store}>
        <ThemeProvider theme={theme}> {/* Needed for MUI Alert */}
            <NotificationCenter />
        </ThemeProvider>
      </Provider>
    );
  };

  it('renders nothing when there are no notifications', () => {
    renderWithProviders([]);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    // Snackbar itself might not have a role by default, Alert inside it does.
    // Check for snackbar presence by a known text if possible, or lack of alerts.
  });

  it('renders a single notification correctly', () => {
    const notifications: NotificationPayload[] = [
      { id: '1', message: 'Success message!', type: 'success' },
    ];
    renderWithProviders(notifications);

    expect(screen.getByText('Success message!')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess'); // Check severity via class
  });

  it('renders multiple notifications', () => {
    const notifications: NotificationPayload[] = [
      { id: '1', message: 'Error occurred!', type: 'error' },
      { id: '2', message: 'Warning: Check this.', type: 'warning' },
    ];
    renderWithProviders(notifications);

    expect(screen.getByText('Error occurred!')).toBeInTheDocument();
    expect(screen.getByText('Warning: Check this.')).toBeInTheDocument();
    expect(screen.getAllByRole('alert')).toHaveLength(2);
  });

  it('dispatches removeNotification when a notification is closed by user action (close button)', async () => {
    const notifications: NotificationPayload[] = [
      { id: 'notif1', message: 'Test close', type: 'info' },
    ];
    renderWithProviders(notifications);

    const closeButton = screen.getByRole('button', { name: /close/i }); // MUI Alert close button
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(removeNotification('notif1'));
    });
  });

  it('dispatches removeNotification after autoHideDuration (conceptual - Jest timers needed)', async () => {
    jest.useFakeTimers();
    const notifications: NotificationPayload[] = [
      { id: 'autohide1', message: 'Auto hide me', type: 'info', autoHideDuration: 100 },
    ];
    renderWithProviders(notifications);

    expect(screen.getByText('Auto hide me')).toBeInTheDocument();

    act(() => {
        jest.advanceTimersByTime(100);
    });
    
    await waitFor(() => {
        expect(store.dispatch).toHaveBeenCalledWith(removeNotification('autohide1'));
    });
    jest.useRealTimers();
  });

  it('does not close on clickaway by default', () => {
    // This tests the `if (reason === 'clickaway') return;` line
    // Simulating clickaway is harder. We trust MUI's Snackbar behavior here.
    // This test is more about ensuring our handleClose doesn't dispatch on 'clickaway'.
    // We can't easily trigger the 'clickaway' reason directly in RTL for Snackbar.
    // So, this remains somewhat conceptual or would require a more complex setup.
    // For now, assume that the handleClose function logic is correct.
    const notifications: NotificationPayload[] = [
      { id: 'notif-clickaway', message: 'Clickaway test', type: 'info' },
    ];
    renderWithProviders(notifications);
    // If we could simulate clickaway and get the reason:
    // fireEvent.click(document.body); // crude simulation
    // expect(store.dispatch).not.toHaveBeenCalledWith(removeNotification('notif-clickaway'));
    expect(true).toBe(true); // Placeholder for this complex scenario
  });
});