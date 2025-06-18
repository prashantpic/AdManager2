/**
 * @file Utility functions to enhance accessibility for screen reader users.
 * @summary Helper utilities for improving accessibility and screen reader support.
 * Implements REQ-6-011.
 */

/**
 * A visually hidden div used as an ARIA live region to announce messages.
 * This element is created once and reused.
 * @type {HTMLDivElement | null}
 */
let liveRegion: HTMLDivElement | null = null;

/**
 * Creates and appends the ARIA live region to the document body if it doesn't exist.
 * This ensures that messages can be announced to screen readers.
 * The region is polite, meaning screen readers will announce changes at the next graceful opportunity.
 */
function ensureLiveRegionExists(): void {
  if (typeof document === 'undefined' || liveRegion) {
    return;
  }

  liveRegion = document.createElement('div');
  liveRegion.id = 'aria-live-region'; // Optional ID for debugging
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true'); // Announce the entire region text
  // Visually hide the element but keep it accessible to screen readers
  liveRegion.style.position = 'absolute';
  liveRegion.style.width = '1px';
  liveRegion.style.height = '1px';
  liveRegion.style.margin = '-1px';
  liveRegion.style.padding = '0';
  liveRegion.style.overflow = 'hidden';
  liveRegion.style.clip = 'rect(0, 0, 0, 0)';
  liveRegion.style.whiteSpace = 'nowrap'; // Prevent line breaks from affecting announcement
  liveRegion.style.border = '0';

  document.body.appendChild(liveRegion);
}

/**
 * Programmatically sets focus to a DOM element specified by its ID.
 * This is useful for managing focus after route changes, modal dialogs,
 * or other dynamic UI updates to guide screen reader users.
 *
 * @param {string} elementId - The ID of the element to focus.
 * @example
 * // After a modal opens, focus its title
 * focusElement('modal-title-id');
 */
export function focusElement(elementId: string): void {
  if (typeof document !== 'undefined') {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[ScreenReaderUtils] Element with ID "${elementId}" not found for focus.`);
      }
    }
  }
}

/**
 * Announces a message to screen readers using an ARIA live region.
 * This is useful for providing feedback on dynamic content changes,
 * asynchronous operations, or other important updates that might not
 * be obvious to visually impaired users.
 *
 * Ensure this function is called on the client-side where `document` is available.
 *
 * @param {string} message - The message to be announced.
 * @param {'polite' | 'assertive'} [politeness='polite'] - The politeness level for the announcement.
 *        'polite': Announces at the next graceful opportunity.
 *        'assertive': Interrupts the screen reader to announce immediately. Use with caution.
 * @example
 * // After a form submission succeeds
 * announceMessage('Your form has been submitted successfully.');
 *
 * // For an urgent error message
 * announceMessage('Error: Invalid input detected.', 'assertive');
 */
export function announceMessage(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
  if (typeof document === 'undefined') {
    if (process.env.NODE_ENV === 'development') {
        console.warn('[ScreenReaderUtils] announceMessage called in a non-browser environment. Message:', message);
      }
    return;
  }

  ensureLiveRegionExists();

  if (liveRegion) {
    liveRegion.setAttribute('aria-live', politeness);
    // Clear previous message before setting new one to ensure it's re-announced
    // Some screen readers might not re-announce if the text content is identical.
    // A common trick is to temporarily empty it.
    liveRegion.textContent = '';
    
    // Slight delay can sometimes help ensure the change is picked up
    setTimeout(() => {
        if (liveRegion) { // Check again in case it was removed
            liveRegion.textContent = message;
        }
    }, 100); // 100ms delay, adjust as needed or remove if not necessary
  } else {
    if (process.env.NODE_ENV === 'development') {
        console.error('[ScreenReaderUtils] ARIA live region could not be created or found.');
    }
  }
}

// Initialize live region on script load if in a browser environment
if (typeof document !== 'undefined') {
  ensureLiveRegionExists();
}