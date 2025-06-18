import React from 'react';
import { render, act, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AuthProvider from './AuthProvider';
import AuthContext from './AuthContext';
import * as authService from './authService';
import { LoginCredentials, UserProfile, AuthResponse } from './auth.types';
import { AppConfig } from '../../config/env';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock authService
jest.mock('./authService', () => ({
  loginUser: jest.fn(),
  logoutUser: jest.fn(), // Assuming this exists based on SDS logic description
  fetchUserProfile: jest.fn(),
  refreshToken: jest.fn(),
  apiClient: {
    defaults: { headers: { common: {} } },
  },
}));

// Mock Redux store
const mockStore = configureStore([]);
const initialState = {
  merchantContext: { profile: null, isLoading: false, error: null },
  ui: { themeMode: 'light', globalLoading: false, notifications: [] }
};


const TestConsumerComponent: React.FC = () => {
  const auth = React.useContext(AuthContext);
  if (!auth) return <div>No Auth Context</div>;
  return (
    <div>
      <div data-testid="isAuthenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="isLoading">{auth.isLoading.toString()}</div>
      <div data-testid="currentUserEmail">{auth.currentUser?.email}</div>
      <div data-testid="error">{auth.error}</div>
      <button onClick={() => auth.login({ email: 'test@example.com', password: 'password' })}>Login</button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
};

describe('AuthProvider', () => {
  let store: any;
  let mockRouterPush: jest.Mock;
  let mockRouterQuery: any;

  beforeEach(() => {
    store = mockStore(initialState);
    mockRouterPush = jest.fn();
    mockRouterQuery = {};
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      query: mockRouterQuery,
    });
    localStorage.clear();
    jest.clearAllMocks();
    // Reset apiClient headers for each test
    authService.apiClient.defaults.headers.common['Authorization'] = undefined;
  });

  it('initializes with no user and not authenticated if no token in localStorage', async () => {
    render(
      <Provider store={store}>
        <AuthProvider>
          <TestConsumerComponent />
        </AuthProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
      expect(screen.getByTestId('isLoading').textContent).toBe('false'); // after initial load
      expect(screen.getByTestId('currentUserEmail').textContent).toBe('');
    });
  });

  it('initializes with user and authenticated if token and user in localStorage', async () => {
    const mockUser: UserProfile = { id: '1', email: 'stored@example.com', name: 'Stored User', merchantId: 'm1', roles: [] };
    localStorage.setItem('authToken', 'test-token');
    localStorage.setItem('authUser', JSON.stringify(mockUser));

    render(
      <Provider store={store}>
        <AuthProvider>
          <TestConsumerComponent />
        </AuthProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
      expect(screen.getByTestId('currentUserEmail').textContent).toBe('stored@example.com');
      expect(screen.getByTestId('isLoading').textContent).toBe('false');
    });
    // Check if apiClient header is set (not directly checkable here, but implicit from successful init)
  });


  it('handles successful login', async () => {
    const mockUser: UserProfile = { id: '1', email: 'test@example.com', name: 'Test User', merchantId: 'm1', roles: [] };
    const mockAuthResponse: AuthResponse = { accessToken: 'new-token', user: mockUser };
    (authService.loginUser as jest.Mock).mockResolvedValue(mockAuthResponse);

    render(
      <Provider store={store}>
        <AuthProvider>
          <TestConsumerComponent />
        </AuthProvider>
      </Provider>
    );
    
    await waitFor(() => expect(screen.getByTestId('isLoading').textContent).toBe('false')); // Wait for initial load

    await act(async () => {
      userEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
      expect(screen.getByTestId('currentUserEmail').textContent).toBe('test@example.com');
      expect(localStorage.getItem('authToken')).toBe('new-token');
      expect(JSON.parse(localStorage.getItem('authUser') || '{}').email).toBe('test@example.com');
      expect(mockRouterPush).toHaveBeenCalledWith(AppConfig.DEFAULT_LOGGED_IN_REDIRECT_PATH || '/dashboard');
      expect(authService.apiClient.defaults.headers.common['Authorization']).toBe('Bearer new-token');
    });
  });

  it('handles login failure', async () => {
    (authService.loginUser as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));
    
    render(
      <Provider store={store}>
        <AuthProvider>
          <TestConsumerComponent />
        </AuthProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('isLoading').textContent).toBe('false'));


    await act(async () => {
       // userEvent.click returns a promise, so we await it
      await userEvent.click(screen.getByText('Login'));
    });
    

    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
      expect(screen.getByTestId('error').textContent).toBe('Invalid credentials');
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  it('handles logout', async () => {
     // Setup initial logged-in state
    const mockUser: UserProfile = { id: '1', email: 'test@example.com', name: 'Test User', merchantId: 'm1', roles: [] };
    localStorage.setItem('authToken', 'test-token');
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    authService.apiClient.defaults.headers.common['Authorization'] = 'Bearer test-token';


    render(
      <Provider store={store}>
        <AuthProvider>
          <TestConsumerComponent />
        </AuthProvider>
      </Provider>
    );

    // Wait for component to initialize and reflect logged-in state
    await waitFor(() => expect(screen.getByTestId('isAuthenticated').textContent).toBe('true'));
    
    await act(async () => {
      userEvent.click(screen.getByText('Logout'));
    });

    await waitFor(() => {
      // expect(authService.logoutUser).toHaveBeenCalled(); // if logoutUser makes an API call
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
      expect(screen.getByTestId('currentUserEmail').textContent).toBe('');
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(mockRouterPush).toHaveBeenCalledWith(AppConfig.LOGIN_PATH || '/login');
      expect(authService.apiClient.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });

  it('redirects to returnUrl after login if present in query', async () => {
    mockRouterQuery.returnUrl = '/some-protected-page';
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
      query: mockRouterQuery,
    });
    const mockUser: UserProfile = { id: '1', email: 'test@example.com', name: 'Test User', merchantId: 'm1', roles: [] };
    const mockAuthResponse: AuthResponse = { accessToken: 'new-token', user: mockUser };
    (authService.loginUser as jest.Mock).mockResolvedValue(mockAuthResponse);

    render(
      <Provider store={store}>
        <AuthProvider>
          <TestConsumerComponent />
        </AuthProvider>
      </Provider>
    );
    await waitFor(() => expect(screen.getByTestId('isLoading').textContent).toBe('false'));


    await act(async () => {
      userEvent.click(screen.getByText('Login'));
    });

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/some-protected-page');
    });
  });

});