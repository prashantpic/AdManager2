/**
 * @file featureFlags.ts
 * @summary Configuration for application feature flags.
 * @description This file exports a `featureFlags` object that reads flag states from
 * environment variables prefixed with `NEXT_PUBLIC_FF_`. It provides type definitions
 * for available flags and allows for easy toggling of features.
 * These flags can be used throughout the application to conditionally render components
 * or enable/disable functionality.
 */

/**
 * @interface FeatureFlagsType
 * @description Defines the structure for available feature flags.
 * @property {boolean} enableNewDashboardWidgets - Flag to enable/disable new dashboard widgets.
 * @property {boolean} enableAdvancedLandingPageElements - Flag to enable/disable advanced elements in the landing page builder.
 * @property {boolean} enableBlogAiAssistant - Flag to enable/disable AI assistant features in the blogging platform.
 * @property {boolean} useNewNavigationLayout - Flag to toggle between old and new navigation layouts.
 */
export interface FeatureFlagsType {
  enableNewDashboardWidgets: boolean;
  enableAdvancedLandingPageElements: boolean;
  enableBlogAiAssistant: boolean;
  useNewNavigationLayout: boolean;
}

/**
 * @constant featureFlags
 * @description An object containing the current state of all feature flags.
 * Reads from environment variables (e.g., `NEXT_PUBLIC_FF_NEW_DASHBOARD_WIDGETS`).
 * Defaults to `false` if the environment variable is not set or not 'true'.
 * @type {FeatureFlagsType}
 */
export const featureFlags: FeatureFlagsType = {
  enableNewDashboardWidgets: process.env.NEXT_PUBLIC_FF_NEW_DASHBOARD_WIDGETS === 'true',
  enableAdvancedLandingPageElements: process.env.NEXT_PUBLIC_FF_ADVANCED_LP_ELEMENTS === 'true',
  enableBlogAiAssistant: process.env.NEXT_PUBLIC_FF_BLOG_AI_ASSISTANT === 'true',
  useNewNavigationLayout: process.env.NEXT_PUBLIC_FF_USE_NEW_NAV_LAYOUT === 'true',
};

/**
 * @function useFeatureFlag
 * @deprecated This is a simple object export. For dynamic flags or a hook-based approach,
 * consider a more complex implementation or a feature flag service.
 * @param {keyof FeatureFlagsType} flagName - The name of the feature flag to check.
 * @returns {boolean} The state of the specified feature flag.
 * @description A utility function to check the state of a specific feature flag.
 */
export const getFeatureFlag = (flagName: keyof FeatureFlagsType): boolean => {
  return featureFlags[flagName] || false;
};