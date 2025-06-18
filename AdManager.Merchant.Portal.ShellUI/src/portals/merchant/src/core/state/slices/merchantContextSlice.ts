import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../../auth/auth.types'; // Assuming UserProfile is the correct type for merchant profile
import { RootState } from '../store';

/**
 * Defines the structure of the merchant context state.
 * This state stores information about the currently authenticated merchant.
 * @interface MerchantContextState
 * @property {UserProfile | null} profile - The profile of the authenticated merchant, or null if not loaded/authenticated.
 * @property {boolean} isLoading - True if the merchant context (e.g., profile) is currently being loaded.
 * @property {string | null} error - An error message string if loading the merchant context failed, null otherwise.
 */
export interface MerchantContextState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial state for the merchant context slice.
 */
const initialState: MerchantContextState = {
  profile: null,
  isLoading: false,
  error: null,
};

/**
 * Redux slice for managing the authenticated merchant's context information,
 * such as their profile, permissions, and other session-specific data.
 * This slice is typically updated after a successful login or when the user's
 * session data is fetched.
 */
const merchantContextSlice = createSlice({
  name: 'merchantContext',
  initialState,
  reducers: {
    /**
     * Sets the merchant's profile information.
     * Called upon successful login or profile fetch.
     * Resets loading state and clears any previous errors.
     * @param {MerchantContextState} state - The current merchant context state.
     * @param {PayloadAction<UserProfile>} action - Action containing the merchant's user profile.
     */
    setMerchantContext(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    /**
     * Clears the merchant's profile information.
     * Called upon logout or session invalidation.
     * @param {MerchantContextState} state - The current merchant context state.
     */
    clearMerchantContext(state) {
      state.profile = null;
      state.isLoading = false;
      state.error = null;
    },
    /**
     * Sets the loading state for the merchant context.
     * Useful when initiating a fetch for merchant profile data.
     * @param {MerchantContextState} state - The current merchant context state.
     * @param {PayloadAction<boolean>} action - Action containing the new loading state.
     */
    setMerchantContextLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      if (action.payload) { // Clear error when starting to load
        state.error = null;
      }
    },
    /**
     * Sets an error message for the merchant context.
     * Called if fetching merchant profile data fails.
     * Sets loading to false.
     * @param {MerchantContextState} state - The current merchant context state.
     * @param {PayloadAction<string | null>} action - Action containing the error message, or null to clear.
     */
    setMerchantContextError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setMerchantContext,
  clearMerchantContext,
  setMerchantContextLoading,
  setMerchantContextError,
} = merchantContextSlice.actions;

/**
 * Selector to get the current merchant's profile.
 * @param {RootState} state - The root Redux state.
 * @returns {UserProfile | null} The merchant's profile or null.
 */
export const selectMerchantProfile = (state: RootState): UserProfile | null => state.merchantContext.profile;

/**
 * Selector to get the loading state of the merchant context.
 * @param {RootState} state - The root Redux state.
 * @returns {boolean} True if loading, false otherwise.
 */
export const selectMerchantContextIsLoading = (state: RootState): boolean => state.merchantContext.isLoading;

/**
 * Selector to get any error related to the merchant context.
 * @param {RootState} state - The root Redux state.
 * @returns {string | null} The error message or null.
 */
export const selectMerchantContextError = (state: RootState): string | null => state.merchantContext.error;


export default merchantContextSlice.reducer;