import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Assuming RootState is exported from your store

/**
 * Payload for adding a new notification.
 * @interface NotificationPayload
 * @property {string} [id] - Optional unique ID for the notification. If not provided, one will be generated.
 * @property {string} message - The message content of the notification.
 * @property {'success' | 'error' | 'warning' | 'info'} type - The type of notification, determining its appearance.
 * @property {number} [autoHideDuration] - Optional duration in milliseconds after which the notification auto-hides.
 */
export interface NotificationPayload {
  id?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  autoHideDuration?: number;
}

/**
 * Defines the structure of the UI state.
 * @interface UIState
 * @property {'light' | 'dark'} themeMode - The current theme mode (light or dark).
 * @property {boolean} globalLoading - Flag indicating if a global loading indicator should be shown.
 * @property {NotificationPayload[]} notifications - An array of active notifications.
 */
export interface UIState {
  themeMode: 'light' | 'dark';
  globalLoading: boolean;
  notifications: NotificationPayload[];
}

/**
 * Initial state for the UI slice.
 */
const initialState: UIState = {
  themeMode: 'light', // Default theme mode
  globalLoading: false,
  notifications: [],
};

/**
 * Redux slice for managing global UI state such as theme mode,
 * global loading indicators, and notifications.
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Sets the theme mode (light or dark).
     * @param {UIState} state - The current UI state.
     * @param {PayloadAction<'light' | 'dark'>} action - Action containing the new theme mode.
     */
    setThemeMode(state, action: PayloadAction<'light' | 'dark'>) {
      state.themeMode = action.payload;
      // Optionally, persist theme mode to localStorage here
      if (typeof window !== 'undefined') {
        localStorage.setItem('themeMode', action.payload);
      }
    },
    /**
     * Sets the global loading state.
     * @param {UIState} state - The current UI state.
     * @param {PayloadAction<boolean>} action - Action containing the new global loading state.
     */
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
    /**
     * Adds a new notification to the list.
     * Generates an ID if one is not provided.
     * @param {UIState} state - The current UI state.
     * @param {PayloadAction<NotificationPayload>} action - Action containing the notification payload.
     */
    addNotification(state, action: PayloadAction<NotificationPayload>) {
      state.notifications.push({
        ...action.payload,
        id: action.payload.id || `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      });
    },
    /**
     * Removes a notification from the list by its ID.
     * @param {UIState} state - The current UI state.
     * @param {PayloadAction<string>} action - Action containing the ID of the notification to remove.
     */
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    /**
     * Initializes the theme mode from localStorage if available.
     * @param {UIState} state - The current UI state.
     */
    initializeTheme(state) {
      if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('themeMode') as 'light' | 'dark' | null;
        if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
          state.themeMode = storedTheme;
        } else {
           // Check for system preference if no theme is stored
          const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          state.themeMode = prefersDark ? 'dark' : 'light';
          localStorage.setItem('themeMode', state.themeMode);
        }
      }
    },
  },
});

export const {
  setThemeMode,
  setGlobalLoading,
  addNotification,
  removeNotification,
  initializeTheme,
} = uiSlice.actions;

/**
 * Selector to get the current theme mode from the UI state.
 * @param {RootState} state - The root Redux state.
 * @returns {'light' | 'dark'} The current theme mode.
 */
export const selectThemeMode = (state: RootState): 'light' | 'dark' => state.ui.themeMode;

/**
 * Selector to get the global loading state.
 * @param {RootState} state - The root Redux state.
 * @returns {boolean} True if global loading is active, false otherwise.
 */
export const selectGlobalLoading = (state: RootState): boolean => state.ui.globalLoading;

/**
 * Selector to get the list of active notifications.
 * @param {RootState} state - The root Redux state.
 * @returns {NotificationPayload[]} The array of active notifications.
 */
export const selectNotifications = (state: RootState): NotificationPayload[] => state.ui.notifications;

export default uiSlice.reducer;