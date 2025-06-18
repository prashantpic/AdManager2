import React, { Suspense } from 'react';
import GlobalLoader from '@/components/GlobalLoader'; // Assuming GlobalLoader exists
import ErrorFallback from '@/components/ErrorFallback'; // Assuming ErrorFallback exists
import { ErrorBoundary } from 'react-error-boundary';

// Placeholder for the actual Campaign Management UI module
// In a real scenario, this would import the remote module or a local lazy-loaded component.
// e.g., const CampaignManagementUI = React.lazy(() => import('@admanager/campaign-management-ui'));
const CampaignManagementUI = React.lazy(
  () =>
    new Promise<{ default: React.ComponentType<any> }>((resolve) =>
      setTimeout(
        () =>
          resolve({
            default: () => (
              <div style={{ padding: '20px', border: '1px dashed #ccc' }}>
                <h2>Campaign Management Module Placeholder</h2>
                <p>This is where the Campaign Management UI would be rendered.</p>
              </div>
            ),
          }),
        1000,
      ),
    ),
);

/**
 * Props for the CampaignManagementModuleLoader.
 * These would typically include any context or configuration the loaded module needs from the shell.
 * @interface CampaignManagementModuleLoaderProps
 */
interface CampaignManagementModuleLoaderProps {
  /**
   * Example prop: Merchant ID to be passed to the module.
   * @type {string}
   * @optional
   */
  merchantId?: string;
  // Add other props like apiClient, shared theme context if needed by the module
}

/**
 * CampaignManagementModuleLoader is a component responsible for lazy-loading and
 * rendering the Campaign Management feature module.
 * It uses React.Suspense to show a loading fallback (GlobalLoader) while the module is being loaded.
 * It also wraps the module in an ErrorBoundary to catch any loading or runtime errors within the module.
 *
 * @param {CampaignManagementModuleLoaderProps} props - Props to pass down to the loaded module.
 * @returns {React.ReactElement} The Campaign Management module or a fallback.
 */
const CampaignManagementModuleLoader: React.FC<CampaignManagementModuleLoaderProps> = (props) => {
  return (
    <ErrorBoundary
      FallbackComponent={(errorProps) => (
        <ErrorFallback
          error={errorProps.error}
          resetErrorBoundary={errorProps.resetErrorBoundary}
        />
      )}
      onReset={() => {
        // Potentially refetch module or clear state
        console.log('Error boundary reset for CampaignManagementModuleLoader');
      }}
    >
      <Suspense fallback={<GlobalLoader />}>
        <CampaignManagementUI {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default CampaignManagementModuleLoader;