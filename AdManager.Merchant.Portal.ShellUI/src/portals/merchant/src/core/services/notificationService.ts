import { store } from '../state/store'; // Direct store import for service
import { addNotification, NotificationPayload } from '../state/slices/uiSlice';

/**
 * Provides utility functions to dispatch global UI notifications.
 * These functions interact directly with the Redux store to add notifications
 * which are then displayed by the `NotificationCenter` component.
 *
 * It's generally preferred to dispatch actions from React components using `useDispatch`.
 * However, for services that operate outside the React component lifecycle (e.g., API error handlers),
 * direct store dispatch can be a pragmatic approach, provided it's used judiciously and documented.
 */
const notificationService = {
  /**
   * Displays a success notification.
   * @param {string} message - The message to display.
   * @param {number} [autoHideDuration=6000] - Optional duration in milliseconds after which the notification auto-hides.
   * @param {string} [id] - Optional custom ID for the notification.
   */
  showSuccess: (message: string, autoHideDuration?: number, id?: string): void => {
    const payload: NotificationPayload = {
      id,
      message,
      type: 'success',
      autoHideDuration: autoHideDuration ?? 6000,
    };
    store.dispatch(addNotification(payload));
  },

  /**
   * Displays an error notification.
   * @param {string} message - The message to display.
   * @param {number} [autoHideDuration=8000] - Optional duration in milliseconds after which the notification auto-hides.
   * @param {string} [id] - Optional custom ID for the notification.
   */
  showError: (message: string, autoHideDuration?: number, id?: string): void => {
    const payload: NotificationPayload = {
      id,
      message,
      type: 'error',
      autoHideDuration: autoHideDuration ?? 8000,
    };
    store.dispatch(addNotification(payload));
  },

  /**
   * Displays a warning notification.
   * @param {string} message - The message to display.
   * @param {number} [autoHideDuration=7000] - Optional duration in milliseconds after which the notification auto-hides.
   * @param {string} [id] - Optional custom ID for the notification.
   */
  showWarning: (message: string, autoHideDuration?: number, id?: string): void => {
    const payload: NotificationPayload = {
      id,
      message,
      type: 'warning',
      autoHideDuration: autoHideDuration ?? 7000,
    };
    store.dispatch(addNotification(payload));
  },

  /**
   * Displays an informational notification.
   * @param {string} message - The message to display.
   * @param {number} [autoHideDuration=5000] - Optional duration in milliseconds after which the notification auto-hides.
   * @param {string} [id] - Optional custom ID for the notification.
   */
  showInfo: (message: string, autoHideDuration?: number, id?: string): void => {
    const payload: NotificationPayload = {
      id,
      message,
      type: 'info',
      autoHideDuration: autoHideDuration ?? 5000,
    };
    store.dispatch(addNotification(payload));
  },
};

export default notificationService;