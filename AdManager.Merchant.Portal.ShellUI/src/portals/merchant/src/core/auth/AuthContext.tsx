import React from 'react';
import { UserProfile, LoginCredentials, AuthResponse } from './auth.types';

/**
 * Defines the state and actions available in the AuthContext.
 * @interface AuthContextState
 * @property {UserProfile | null} currentUser - The currently authenticated user's profile, or null if not authenticated.
 * @property {string | null} token - The JWT access token, or null if not authenticated.
 * @property {boolean} isAuthenticated - True if the user is authenticated, false otherwise.
 * @property {boolean} isLoading - True if an authentication operation (login, logout, session check) is in progress.
 * @property {string | null} error - An error message string if an authentication operation failed, null otherwise.
 * @property {(credentials: LoginCredentials) => Promise<void>} login - Function to attempt user login.
 * @property {() => Promise<void>} logout - Function to log out the current user.
 * @property {() => Promise<string | null>} [refreshToken] - Optional function to refresh the authentication token.
 */
export interface AuthContextState {
  currentUser: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken?: () => Promise<string | null>;
}

/**
 * React Context for managing authentication state.
 * This context provides access to the current user's authentication status, profile,
 * and methods for logging in and out.
 *
 * @example
 * ```tsx
 * import { useAuth } from './useAuth';
 *
 * const MyComponent = () => {
 *   const { currentUser, isAuthenticated, login } = useAuth();
 *   // ...
 * };
 * ```
 */
const AuthContext = React.createContext<AuthContextState | undefined>(undefined);

export default AuthContext;