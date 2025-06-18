import apiClient from '../services/apiClient';
import { LoginCredentials, AuthResponse, TokenResponse, UserProfile } from './auth.types';
import { AppConfig } from '../../config/env';

/**
 * Service for handling authentication-related API calls.
 * It uses the global `apiClient` for making HTTP requests.
 */

/**
 * Logs in a user with the provided credentials.
 * @param {LoginCredentials} credentials - The user's email and password.
 * @returns {Promise<AuthResponse>} A promise that resolves with the authentication response,
 * including the access token and user profile.
 * @throws {Error} If the login request fails.
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(AppConfig.AUTH_LOGIN_ENDPOINT || '/api/auth/login', credentials);
  return response.data;
};

/**
 * Logs out the currently authenticated user.
 * This typically involves invalidating the session/token on the server-side.
 * @returns {Promise<void>} A promise that resolves when the logout operation is complete.
 * @throws {Error} If the logout request fails.
 */
export const logoutUser = async (): Promise<void> => {
  // Assuming the backend has an endpoint to invalidate the session/token.
  // If not, this can be an empty function or just handle client-side cleanup.
  await apiClient.post(AppConfig.AUTH_LOGOUT_ENDPOINT || '/api/auth/logout');
};

/**
 * Refreshes an expired access token using a refresh token.
 * Note: The actual implementation depends heavily on the backend's refresh token strategy.
 * This is a placeholder and might require a refresh token to be passed or stored securely.
 * @param {string} [refreshTokenValue] - The current refresh token. If not provided,
 *                                    it might be retrieved from secure storage if applicable.
 * @returns {Promise<TokenResponse>} A promise that resolves with the new token response
 * (new access token, potentially new refresh token).
 * @throws {Error} If the token refresh request fails.
 */
export const refreshToken = async (refreshTokenValue?: string): Promise<TokenResponse> => {
  // The actual refresh token might be sent as HttpOnly cookie by backend,
  // or stored (less securely) in localStorage by frontend.
  // This example assumes it's passed or the API client handles it.
  const payload = refreshTokenValue ? { refreshToken: refreshTokenValue } : {};
  const response = await apiClient.post<TokenResponse>(AppConfig.AUTH_REFRESH_TOKEN_ENDPOINT || '/api/auth/refresh', payload);
  return response.data;
};

/**
 * Fetches the profile of the currently authenticated user.
 * Requires the `apiClient` to have the Authorization header set (usually by an interceptor or AuthProvider).
 * @returns {Promise<UserProfile>} A promise that resolves with the user's profile information.
 * @throws {Error} If fetching the user profile fails.
 */
export const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>(AppConfig.USER_PROFILE_ENDPOINT || '/api/users/me');
  return response.data;
};

export { apiClient };