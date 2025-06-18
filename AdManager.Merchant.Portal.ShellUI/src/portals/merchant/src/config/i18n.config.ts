import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

/**
 * @file Configures the i18next library for internationalization.
 * @summary Core i18next library setup for localization and internationalization.
 * Implements REQ-6-012.
 */

/**
 * Supported languages.
 * @type {string[]}
 */
export const supportedLngs = ['en', 'ar'];

/**
 * Default namespace for translations.
 * @type {string}
 */
export const defaultNS = 'shell';

/**
 * List of namespaces used in the application.
 * The shell namespace is primary for the ShellUI.
 * Other namespaces can be added for feature modules or shared translations.
 * @type {string[]}
 */
export const namespaces = ['shell', 'common', 'validation', 'campaigns', 'products'];

i18n
  .use(HttpBackend) // Loads translations from a backend (e.g., /public/locales)
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    /**
     * Array of supported languages.
     * @see {@link supportedLngs}
     */
    supportedLngs,
    /**
     * Language to use if translations in user language are not available.
     */
    fallbackLng: 'en',
    /**
     * Default namespace to load.
     * @see {@link defaultNS}
     */
    defaultNS,
    /**
     * Array of namespaces to load.
     * @see {@link namespaces}
     */
    ns: namespaces,
    /**
     * Configuration for the HttpBackend.
     * Defines the path where translation files are located.
     * Assumes translation files are in `public/locales/[language]/[namespace].json`.
     */
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    /**
     * Interpolation settings.
     * `escapeValue: false` is needed because React already escapes by default.
     */
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    /**
     * Configuration for the LanguageDetector.
     * Defines the order of detection methods and caching options.
     */
    detection: {
      order: ['localStorage', 'navigator'], // Order to detect language
      caches: ['localStorage'], // Cache the detected language in localStorage
    },
    /**
     * React-i18next specific options.
     */
    react: {
      useSuspense: true, // Recommended for loading translations
    },
    debug: process.env.NODE_ENV === 'development', // Enable debug output in development
  });

export default i18n;