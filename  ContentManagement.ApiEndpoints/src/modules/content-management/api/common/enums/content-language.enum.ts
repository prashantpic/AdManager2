/**
 * @file content-language.enum.ts
 * @description Defines an enumeration for supported content languages.
 * @requirement REQ-6-012
 * @namespace AdManager.ContentManagement.Api.V1.Common.Enums
 */

/**
 * Enumeration representing the supported languages for content items.
 * The system should be designed to easily add more languages.
 */
export enum ContentLanguage {
  /**
   * English
   */
  EN = 'en',

  /**
   * Arabic (Saudi Arabia)
   */
  AR_SA = 'ar-SA',
}