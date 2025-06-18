import { configureStore, Middleware } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
// import { logger } from 'redux-logger'; // Example: redux-logger, install if needed

/**
 * @file Configures and exports the Redux Toolkit store.
 * @summary Redux store setup for the Merchant Portal Shell UI.
 * This file initializes the global Redux store, combining all reducers and setting up middleware.
 */

/**
 * Array of Redux middleware.
 * Includes default middleware from Redux Toolkit (e.g., thunk).
 * Additional middleware like `redux-logger` can be added for development.
 * @type {Middleware[]}
 */
const middlewares: Middleware[] = [];

if (process.env.NODE_ENV === 'development') {
  // Example: Add redux-logger in development mode
  // To use, install `redux-logger` and `@types/redux-logger`
  // import logger from 'redux-logger';
  // middlewares.push(logger);
}

/**
 * The configured Redux store.
 * It uses `configureStore` from Redux Toolkit, which automatically sets up:
 * - The Redux DevTools Extension.
 * - Default middleware (like redux-thunk for async logic).
 * - Immutability checks in development.
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
  devTools: process.env.NODE_ENV !== 'production', // Enable DevTools only in non-production environments
});

/**
 * Type representing the root state of the Redux store.
 * Inferred from the `rootReducer`.
 * @example
 * import { RootState } from '@/core/state/store';
 * const selectSomeData = (state: RootState) => state.someSlice.data;
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type representing the dispatch function of the Redux store.
 * Useful for typing thunks or when dispatching actions directly.
 * @example
 * import { AppDispatch } from '@/core/state/store';
 * import { someAsyncAction } from './slices/someSlice';
 * const dispatch: AppDispatch = useAppDispatch(); // or store.dispatch
 * dispatch(someAsyncAction());
 */
export type AppDispatch = typeof store.dispatch;