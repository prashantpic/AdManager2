import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/router';
import AuthContext, { AuthContextState } from './AuthContext';
import * as authService from './authService';
import { UserProfile, LoginCredentials, AuthResponse } from './auth.types';
import { AppConfig } from '../../config/env';
import { useDispatch } from 'react-redex'; // Corrected: react-redux
import { setMerchantContext, clearMerchantContext, setMerchantContextLoading, setMerchantContextError } from '../state/slices/merchantContextSlice';


const TOKEN_STORAGE_KEY = 'authToken';
const USER_STORAGE_KEY = 'authUser';


/**
 * Props for the AuthProvider component.
 * @interface AuthProviderProps
 * @property {ReactNode} children - The child components that will have access to the AuthContext.
 */
export interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provides authentication state and logic to the application.
 * Manages user session, token storage, login, and logout operations.
 * It interacts with `authService` for API calls and updates the `AuthContext`.
 * @param {AuthProviderProps} props - The props for the component.
 */
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();


  const storeTokenAndUser = (accessToken: string, user: UserProfile) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    setToken(accessToken);
    setCurrentUser(user);
    dispatch(setMerchantContext(user));
  };

  const clearTokenAndUser = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setCurrentUser(null);
    dispatch(clearMerchantContext());
  };

  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    dispatch(setMerchantContextLoading(true));
    try {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUserString = localStorage.getItem(USER_STORAGE_KEY);

      if (storedToken && storedUserString) {
        const storedUser = JSON.parse(storedUserString) as UserProfile;
        // Optional: Validate token with backend here if needed, or rely on API calls to fail if token is invalid
        // For this example, we'll assume the stored token is valid if present.
        // A more robust solution might involve an API call to /me or /validate-token
        setToken(storedToken);
        setCurrentUser(storedUser);
        dispatch(setMerchantContext(storedUser));
        // Example: verify token validity, then fetch fresh profile
        // authService.apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        // const userProfile = await authService.fetchUserProfile();
        // setCurrentUser(userProfile);
        // dispatch(setMerchantContext(userProfile));

      } else {
        clearTokenAndUser();
      }
    } catch (e: any) {
      console.error('Auth initialization error:', e);
      clearTokenAndUser();
      dispatch(setMerchantContextError(e.message || 'Failed to initialize session'));
    } finally {
      setIsLoading(false);
      dispatch(setMerchantContextLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);
    dispatch(setMerchantContextLoading(true));
    try {
      const authResponse: AuthResponse = await authService.loginUser(credentials);
      storeTokenAndUser(authResponse.accessToken, authResponse.user);
      // Set token for apiClient for subsequent requests in this session
      authService.apiClient.defaults.headers.common['Authorization'] = `Bearer ${authResponse.accessToken}`;
      // Redirect to dashboard or intended page
      const returnUrl = (router.query.returnUrl as string) || AppConfig.DEFAULT_LOGGED_IN_REDIRECT_PATH || '/dashboard';
      await router.push(returnUrl);
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || e.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      dispatch(setMerchantContextError(errorMessage));
      clearTokenAndUser(); // Ensure inconsistent state is cleared
      throw new Error(errorMessage); // Re-throw for form error handling
    } finally {
      setIsLoading(false);
      dispatch(setMerchantContextLoading(false));
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    dispatch(setMerchantContextLoading(true));
    try {
      // Call API to invalidate token on server side if endpoint exists
      // await authService.logoutUser(); // Assuming logoutUser invalidates server session
    } catch (e: any) {
      // Log error but proceed with client-side logout
      console.error('Logout API call failed:', e);
    } finally {
      clearTokenAndUser();
      // Remove token from apiClient
      delete authService.apiClient.defaults.headers.common['Authorization'];
      setIsLoading(false);
      dispatch(setMerchantContextLoading(false));
      await router.push(AppConfig.LOGIN_PATH || '/login');
    }
  };

  // refreshToken function (optional, client-managed refresh)
  // This is a simplified example. Robust refresh token logic can be complex.
  const refreshToken = async (): Promise<string | null> => {
    // This part is highly dependent on your backend's refresh token strategy.
    // For HttpOnly refresh cookies, this might not be needed client-side,
    // or apiClient's interceptor would handle it.
    // If client stores refresh token (e.g., in localStorage, less secure):
    // const currentRefreshToken = localStorage.getItem('refreshToken');
    // if (!currentRefreshToken) return null;
    setIsLoading(true);
    try {
      // const response = await authService.refreshToken(currentRefreshToken);
      // storeTokenAndUser(response.accessToken, currentUser); // Potentially re-fetch user profile
      // localStorage.setItem('refreshToken', response.refreshToken); // if new refresh token is issued
      // return response.accessToken;
      // For this example, let's assume refresh is handled by backend or not implemented client-side explicitly
      console.warn('Client-side refreshToken not fully implemented in this example.');
      return null;
    } catch (e: any) {
      console.error('Token refresh failed:', e);
      await logout(); // If refresh fails, log out user
      return null;
    } finally {
      setIsLoading(false);
    }
  };


  const contextValue: AuthContextState = {
    currentUser,
    token,
    isAuthenticated: !!token && !!currentUser,
    isLoading,
    error,
    login,
    logout,
    // refreshToken: refreshToken, // Uncomment if implementing client-side refresh
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;