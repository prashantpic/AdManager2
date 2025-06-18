import React, { Suspense } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { routeConfigs, RouteConfig } from '../../config/routes';
import AuthGuard from './guards/AuthGuard';
import MainLayout from '../layout/MainLayout';
import GlobalLoader from '../../components/GlobalLoader';

/**
 * @file Manages application-level routing using react-router.
 * @summary Dynamically loads page components or feature modules based on route definitions.
 * @description Uses `Routes` and `Route` components from `react-router-dom`.
 * Maps route definitions from `config/routes.ts` to components.
 * Implements lazy loading for page components using `React.lazy` (already applied in routeConfigs) and `Suspense`.
 * Integrates `AuthGuard` for protected routes.
 * Wraps routes with `MainLayout` or other specified layouts.
 */

/**
 * A simple Not Found page component.
 * @returns {JSX.Element} The 404 Not Found page.
 */
const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('shell'); // Assuming 'shell' namespace or common keys
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
      <h1>404 - {t('common.pageNotFound', 'Page Not Found')}</h1>
      <p>{t('common.pageNotFoundMessage', 'Sorry, the page you are looking for does not exist.')}</p>
      <Link to="/dashboard">{t('common.goToDashboard', 'Go to Dashboard')}</Link>
    </div>
  );
};


/**
 * AppRouter component.
 * Sets up all application routes based on the route configuration.
 * @returns {JSX.Element} The router component with all defined routes.
 */
const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <Routes>
        {routeConfigs.map((route: RouteConfig, index: number) => {
          const PageComponent = route.element;
          let pageElement = <PageComponent />;

          if (route.isProtected) {
            pageElement = <AuthGuard>{pageElement}</AuthGuard>;
          }

          // Determine layout:
          // 1. If route.layout is explicitly null, no layout wrapper.
          // 2. If route.layout is a component, use that.
          // 3. If route.layout is undefined (not specified), use MainLayout as default.
          //    (Login/public routes should explicitly set layout to null or a specific public layout)
          const LayoutComponent = route.layout === undefined ? MainLayout : route.layout;

          if (LayoutComponent) {
            pageElement = <LayoutComponent>{pageElement}</LayoutComponent>;
          }
          
          return <Route key={index} path={route.path} element={pageElement} />;
        })}
        <Route path="*" element={<Navigate to="/dashboard" replace />} /> 
        {/* Or use a dedicated NotFoundPage, e.g. <Route path="*" element={<NotFoundPage />} /> 
            SDS 3.6.1 mentions: Defines a catch-all route (path="*") for a "Not Found" page.
            Let's use NotFoundPage if MainLayout is not applied to it, or wrap it for consistency.
            For now, redirecting to dashboard might be simpler until NotFoundPage has a proper layout.
            Let's use a specific NotFoundPage route.
        */}
         {/* <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />  // If NotFoundPage should also have MainLayout */}
         {/* A more flexible approach for NotFoundPage: */}
         <Route path="/404" element={<MainLayout><NotFoundPage /></MainLayout>} />
         <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;