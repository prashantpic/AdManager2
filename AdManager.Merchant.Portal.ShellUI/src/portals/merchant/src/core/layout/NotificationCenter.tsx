import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { selectNotifications, removeNotification, NotificationPayload } from '../state/slices/uiSlice';
import { AppDispatch } from '../state/store';

/**
 * `NotificationCenter` is responsible for displaying global notifications (snackbars/alerts)
 * to the user. It subscribes to the `notifications` array in the Redux `uiSlice`
 * and renders a `Snackbar` with an `Alert` for each notification.
 *
 * @returns {React.ReactElement} A container for displaying notifications.
 * @see {@link REQ-6-011} - Accessibility: Ensure notifications are announced to screen readers.
 *                         MUI Snackbar/Alert have ARIA roles built-in.
 */
const NotificationCenter: React.FC = () => {
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch<AppDispatch>();

  /**
   * Handles the close event for a Snackbar.
   * Dispatches an action to remove the notification from the Redux store.
   * @param {NotificationPayload} notification - The notification object to be closed.
   * @param {React.SyntheticEvent | Event} [event] - The event that triggered the close.
   * @param {string} [reason] - The reason for closing (e.g., 'timeout', 'clickaway').
   */
  const handleClose = (notification: NotificationPayload) => (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    if (notification.id) {
      dispatch(removeNotification(notification.id));
    }
  };

  if (!notifications || notifications.length === 0) {
    return null;
  }

  // Display one notification at a time. The first one in the queue.
  // For multiple simultaneous snackbars, this logic would need to change.
  // The current SDS describes "renders an MUI Snackbar for each active notification (or manages a single Snackbar displaying messages sequentially)".
  // This implementation shows the first one. To show all, map through notifications.
  // For simplicity and common UX, showing one at a time is often preferred.
  // Let's show all stacked, as per "renders an MUI Snackbar for each active notification"

  return (
    <>
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id || `notification-${index}`}
          open={true} // Each notification in the array is considered "open" until removed
          autoHideDuration={notification.autoHideDuration || 6000}
          onClose={handleClose(notification)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          // To stack Snackbars, we might need custom positioning or a library.
          // MUI Snackbars by default will overlay. This provides basic stacking by rendering multiple.
          // For true stacking, CSS adjustments or a different approach may be needed.
          // This example will render them potentially overlapping.
          // A common pattern is to show one at a time, or use a notification manager library.
          // Given SDS: "renders an MUI Snackbar for each active notification", this implies multiple.
          // For better stacking, consider `react-toastify` or `notistack`.
          // For now, let's render them and they will appear sequentially if autoHideDuration works,
          // or overlap if durations are long / manual close.
          // To achieve visual stacking, we might need to adjust the `bottom` style dynamically.
          // This simple version will have them appear at the same spot.
          style={{ bottom: `${20 + index * 70}px` }} // Basic vertical stacking
        >
          <Alert
            onClose={handleClose(notification)}
            severity={notification.type as AlertColor} // 'success' | 'error' | 'warning' | 'info'
            variant="filled"
            sx={{ width: '100%' }}
            aria-live={notification.type === 'error' || notification.type === 'warning' ? 'assertive' : 'polite'}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationCenter;