import { renderHook, act } from '@testing-library/react-hooks';
import React, { ReactNode } from 'react';
import AuthProvider from './AuthProvider'; // To provide the context
import useAuth from './useAuth';
import AuthContext, { AuthContextState } from './AuthContext';
import { UserProfile, LoginCredentials } from './auth.types';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';


// Mock Next.js router for AuthProvider dependency
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
  }),
}));

// Mock authService for AuthProvider dependency
jest.mock('./authService', () => ({
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  fetchUserProfile: jest.fn(),
  apiClient: { // Add this mock for apiClient
    defaults: { headers: { common: {} } },
  },
}));

const mockStore = configureStore([]);
const initialState = {
  merchantContext: { profile: null, isLoading: false, error: null },
  ui: { themeMode: 'light', globalLoading: false, notifications: [] }
};


describe('useAuth', () => {
  it('should throw an error if used outside of AuthProvider', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.error).toEqual(Error('useAuth must be used within an AuthProvider'));
  });

  it('should return the auth context when used within AuthProvider', () => {
    const store = mockStore(initialState);
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>
        <AuthProvider>{children}</AuthProvider>
      </Provider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false); // Default initial state from AuthProvider
    expect(result.current.currentUser).toBeNull();
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('should reflect updated auth context values', async () => {
    const mockUser: UserProfile = { id: '1', email: 'test@example.com', name: 'Test User', merchantId: 'm1', roles: [] };
    const mockLogin = jest.fn(async (_credentials: LoginCredentials) => {});
    const mockLogout = jest.fn(async () => {});

    const mockContextValue: AuthContextState = {
      currentUser: mockUser,
      token: 'test-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: mockLogin,
      logout: mockLogout,
    };
    
    const store = mockStore(initialState);

    // Custom wrapper that uses a predefined AuthContext value
    // This bypasses AuthProvider's internal logic for this specific test
    // to focus on useAuth correctly consuming what AuthContext.Provider provides.
    const WrapperWithPredefinedContext = ({ children }: { children: React.ReactNode }) => (
       <Provider store={store}> {/* Still need Redux Provider if AuthProvider uses useDispatch */}
        <AuthContext.Provider value={mockContextValue}>
            {children}
        </AuthContext.Provider>
       </Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper: WrapperWithPredefinedContext });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.currentUser).toEqual(mockUser);
    expect(result.current.token).toBe('test-token');

    // Example of testing a function call via the hook
    await act(async () => {
      await result.current.login({ email: 'test', password: 'pwd' });
    });
    expect(mockLogin).toHaveBeenCalled();
  });
});