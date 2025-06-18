import i18nInstance from '../../config/i18n.config';

/**
 * @file Exports the configured i18next instance.
 * @summary This module re-exports the i18next instance initialized in `src/config/i18n.config.ts`.
 * This provides a consistent import path for accessing the i18n instance throughout the application.
 * Implements REQ-6-012.
 */

/**
 * The configured i18next instance for internationalization.
 * Use this instance for translation functions (e.g., `i18n.t('key')`) or
 * with the `useTranslation` hook from `react-i18next`.
 *
 * @example
 * import i18n from '@/core/i18n/i18n';
 * console.log(i18n.t('welcomeMessage'));
 *
 * @example
 * // In a React component
 * import { useTranslation } from 'react-i18next';
 * import '@/core/i18n/i18n'; // Ensure i18n is initialized
 *
 * function MyComponent() {
 *   const { t } = useTranslation();
 *   return <p>{t('greeting')}</p>;
 * }
 */
const i18n = i18nInstance;

export default i18n;