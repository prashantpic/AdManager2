import React from 'react';
import { render } from '@testing-library/react';
import AuthContext, { AuthContextState } from './AuthContext';
import { UserProfile, LoginCredentials } from './auth.types';

/**
 * Mock user profile for testing.
 */
const mockUserProfile: UserProfile = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  merchantId: 'merchant-456',
  roles: ['merchant_admin'],
  permissions: ['view_dashboard', 'manage_campaigns'],
};

/**
 * Mock login credentials for testing.
 */
const mockLoginCredentials: LoginCredentials = {
  email: 'test@example.com',
  password: 'password123',
};

describe('AuthContext', () => {
  it('should have undefined as default value when not wrapped in a Provider', () => {
    let contextValue;
    const TestComponent = () => {
      contextValue = React.useContext(AuthContext);
      return null;
    };
    render(<TestComponent />);
    expect(contextValue).toBeUndefined();
  });

  it('should provide the correct context value when wrapped in a Provider', () => {
    const mockContextValue: AuthContextState = {
      currentUser: mockUserProfile,
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: jest.fn(async (_credentials: LoginCredentials) => {}),
      logout: jest.fn(async () => {}),
      refreshToken: jest.fn(async () => 'mock-refreshed-token'),
    };

    let receivedContextValue;
    const TestComponent = () => {
      receivedContextValue = React.useContext(AuthContext);
      return <div data-testid="user-name">{receivedContextValue?.currentUser?.name}</div>;
    };

    const { getByTestId } = render(
      <AuthContext.Provider value={mockContextValue}>
        <TestComponent />
      </AuthContext.Provider>
    );

    expect(receivedContextValue).toEqual(mockContextValue);
    expect(getByTestId('user-name').textContent).toBe(mockUserProfile.name);
  });
});