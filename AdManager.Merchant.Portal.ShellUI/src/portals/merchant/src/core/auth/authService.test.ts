import apiClient from '../services/apiClient';
import { loginUser, logoutUser, refreshToken, fetchUserProfile } from './authService';
import { LoginCredentials, AuthResponse, TokenResponse, UserProfile } from './auth.types';
import { AppConfig } from '../../config/env';

// Mock the apiClient
jest.mock('../services/apiClient');

const mockApiClientPost = apiClient.post as jest.Mock;
const mockApiClientGet = apiClient.get as jest.Mock;

describe('authService', () => {
  const mockLoginCredentials: LoginCredentials = { email: 'test@example.com', password: 'password123' };
  const mockUserProfile: UserProfile = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    merchantId: 'merchant-456',
    roles: ['merchant_admin'],
    permissions: ['view_dashboard'],
  };
  const mockAuthResponse: AuthResponse = {
    accessToken: 'mock-access-token',
    user: mockUserProfile,
    refreshToken: 'mock-refresh-token',
  };
  const mockTokenResponse: TokenResponse = {
    accessToken: 'new-mock-access-token',
    refreshToken: 'new-mock-refresh-token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should call apiClient.post with correct endpoint and credentials, and return auth response', async () => {
      mockApiClientPost.mockResolvedValue({ data: mockAuthResponse });

      const result = await loginUser(mockLoginCredentials);

      expect(mockApiClientPost).toHaveBeenCalledWith(AppConfig.AUTH_LOGIN_ENDPOINT || '/api/auth/login', mockLoginCredentials);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw an error if apiClient.post rejects', async () => {
      const error = new Error('Login failed');
      mockApiClientPost.mockRejectedValue(error);

      await expect(loginUser(mockLoginCredentials)).rejects.toThrow('Login failed');
    });
  });

  describe('logoutUser', () => {
    it('should call apiClient.post with correct endpoint', async () => {
      mockApiClientPost.mockResolvedValue({}); // Simulate successful logout

      await logoutUser();

      expect(mockApiClientPost).toHaveBeenCalledWith(AppConfig.AUTH_LOGOUT_ENDPOINT || '/api/auth/logout');
    });

    it('should throw an error if apiClient.post rejects for logout', async () => {
      const error = new Error('Logout failed');
      mockApiClientPost.mockRejectedValue(error);

      await expect(logoutUser()).rejects.toThrow('Logout failed');
    });
  });

  describe('refreshToken', () => {
    it('should call apiClient.post with correct endpoint and refresh token, and return token response', async () => {
      mockApiClientPost.mockResolvedValue({ data: mockTokenResponse });
      const currentRefreshToken = 'some-refresh-token';

      const result = await refreshToken(currentRefreshToken);

      expect(mockApiClientPost).toHaveBeenCalledWith(AppConfig.AUTH_REFRESH_TOKEN_ENDPOINT || '/api/auth/refresh', { refreshToken: currentRefreshToken });
      expect(result).toEqual(mockTokenResponse);
    });
     it('should call apiClient.post with correct endpoint and empty payload if no refresh token provided', async () => {
      mockApiClientPost.mockResolvedValue({ data: mockTokenResponse });

      const result = await refreshToken(); // No token passed

      expect(mockApiClientPost).toHaveBeenCalledWith(AppConfig.AUTH_REFRESH_TOKEN_ENDPOINT || '/api/auth/refresh', {});
      expect(result).toEqual(mockTokenResponse);
    });


    it('should throw an error if apiClient.post rejects for refreshToken', async () => {
      const error = new Error('Token refresh failed');
      mockApiClientPost.mockRejectedValue(error);

      await expect(refreshToken('some-refresh-token')).rejects.toThrow('Token refresh failed');
    });
  });

  describe('fetchUserProfile', () => {
    it('should call apiClient.get with correct endpoint and return user profile', async () => {
      mockApiClientGet.mockResolvedValue({ data: mockUserProfile });

      const result = await fetchUserProfile();

      expect(mockApiClientGet).toHaveBeenCalledWith(AppConfig.USER_PROFILE_ENDPOINT || '/api/users/me');
      expect(result).toEqual(mockUserProfile);
    });

    it('should throw an error if apiClient.get rejects for fetchUserProfile', async () => {
      const error = new Error('Fetch profile failed');
      mockApiClientGet.mockRejectedValue(error);

      await expect(fetchUserProfile()).rejects.toThrow('Fetch profile failed');
    });
  });
});