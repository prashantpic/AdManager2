import { combineReducers } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import merchantContextReducer from './slices/merchantContextSlice';
// Placeholder for feature-specific reducers if they contribute to global state
// import someFeatureReducer from '@/features/someFeature/someFeatureSlice';

/**
 * @file Combines all Redux reducers (slices) for the global store.
 * @summary Root reducer for the application's Redux store.
 * This file aggregates all feature and core state slices into a single root reducer.
 * The `combineReducers` utility is used to create the shape of the global state object.
 */

/**
 * The root reducer for the application.
 * It combines reducers from different slices, defining the structure of the Redux state.
 * Each key in the `combineReducers` object corresponds to a slice of the state.
 *
 * @example
 * // Accessing state in a selector:
 * // const themeMode = (state: RootState) => state.ui.themeMode;
 * // const merchantProfile = (state: RootState) => state.merchantContext.profile;
 */
const rootReducer = combineReducers({
  /**
   * Reducer for global UI state (theme, loading, notifications).
   * @see {@link import('./slices/uiSlice').uiSlice}
   */
  ui: uiReducer,
  /**
   * Reducer for merchant-specific context (profile, permissions).
   * @see {@link import('./slices/merchantContextSlice').merchantContextSlice}
   */
  merchantContext: merchantContextReducer,
  // Add other reducers here as the application grows
  // someFeature: someFeatureReducer,
});

export default rootReducer;