import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/core/auth/useAuth';
// Assuming GlobalLoader is available, or use a simpler loader
// import GlobalLoader from '@/components/GlobalLoader';

/**
 * Props for the AuthGuard component.
 * @interface AuthGuardProps
 */
interface AuthGuardProps {
  /**
   * The content to render if the user is authenticated.
   * @type {React.ReactNode}
   */
  children: React.ReactNode;
}

/**
 * An AuthGuard component that protects routes requiring authentication.
 * It checks the authentication status using the `useAuth` hook.
 * If the user is loading authentication state, it displays a loading indicator.
 * If the user is not authenticated, it redirects them to the login page,
 * appending the current path as a redirect query parameter.
 * If the user is authenticated, it renders the child components.
 *
 * @param {AuthGuardProps} props - The props for the component.
 * @returns {React.ReactElement | null} The child components if authenticated,
 * a loader while checking auth, or null if redirecting.
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    // Replace with a proper GlobalLoader or a more styled loader
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    // Return null or a minimal component while redirecting
    // The useEffect above handles the actual redirection.
    return null; 
  }

  return <>{children}</>;
};

export default AuthGuard;