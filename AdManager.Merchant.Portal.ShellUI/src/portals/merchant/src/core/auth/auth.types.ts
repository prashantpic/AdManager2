/**
 * @file auth.types.ts
 * @summary TypeScript type definitions related to authentication.
 * @description This file contains interfaces for user profiles, login credentials,
 * authentication responses, and token responses, ensuring type safety
 * throughout the authentication flows.
 */

/**
 * @interface UserProfile
 * @description Defines the structure of a user's profile information.
 * @property {string} id - The unique identifier for the user.
 * @property {string} email - The user's email address.
 * @property {string} name - The user's full name or display name.
 * @property {string} merchantId - The identifier for the merchant account associated with the user.
 * @property {string[]} roles - An array of roles assigned to the user (e.g., 'admin', 'editor').
 * @property {string[]} [permissions] - (Optional) An array of specific permissions granted to the user.
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  merchantId: string;
  roles: string[];
  permissions?: string[];
}

/**
 * @interface LoginCredentials
 * @description Defines the structure for user login credentials.
 * @property {string} email - The user's email address for login.
 * @property {string} password - The user's password for login.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * @interface AuthResponse
 * @description Defines the structure of the response received after successful authentication.
 * @property {string} accessToken - The JSON Web Token (JWT) for accessing protected resources.
 * @property {string} [refreshToken] - (Optional) A token used to obtain a new access token without re-authentication.
 * @property {UserProfile} user - The profile information of the authenticated user.
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserProfile;
}

/**
 * @interface TokenResponse
 * @description Defines the structure of the response received when refreshing an access token.
 * @property {string} accessToken - The new JSON Web Token (JWT).
 * @property {string} [refreshToken] - (Optional) A new refresh token, if the refresh token is also rotated.
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}