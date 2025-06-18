import { useContext } from 'react';
import AuthContext, { AuthContextState } from './AuthContext';

/**
 * Custom hook to consume the `AuthContext`.
 * This hook provides an easy way to access authentication state (currentUser, isAuthenticated, etc.)
 * and authentication methods (login, logout) from any functional component within the `AuthProvider`.
 *
 * @throws {Error} If used outside of an `AuthProvider`.
 * @returns {AuthContextState} The authentication context state and methods.
 * @example
 * ```tsx
 * import { useAuth } from './useAuth';
 *
 * const UserProfileDisplay = () => {
 *   const { currentUser, logout } = useAuth();
 *
 *   if (!currentUser) return <p>Not logged in.</p>;
 *
 *   return (
 *     <div>
 *       <p>Welcome, {currentUser.name}!</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * };
 * ```
 */
const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;