// cypress/utils/testDataHelper.ts

/**
 * Generates a unique string with a given prefix.
 * Appends a timestamp and a short random alphanumeric string.
 * @param prefix - The prefix for the string (default: 'test').
 * @returns A unique string.
 * @example generateUniqueString('item-') // "item-1678886400000-ab12c"
 */
export const generateUniqueString = (prefix: string = 'test'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
};

/**
 * Generates a unique campaign name with a given prefix.
 * Uses generateUniqueString internally.
 * @param prefix - The prefix for the campaign name (default: 'Campaign').
 * @returns A unique campaign name.
 * @example generateUniqueCampaignName('MyNew') // "MyNew-1678886400000-de3f4"
 */
export const generateUniqueCampaignName = (prefix: string = 'Campaign'): string => {
  return generateUniqueString(prefix);
};

/**
 * Generates a random email address with a unique local part and a specified domain.
 * @param domain - The domain for the email address (default: 'e2etest.com').
 * @returns A random email address.
 * @example getRandomEmail('example.org') // "user-1678886400000-gh5i6@example.org"
 */
export const getRandomEmail = (domain: string = 'e2etest.com'): string => {
  return `${generateUniqueString('user')}@${domain}`;
};

/**
 * Formats a JavaScript Date object into a 'YYYY-MM-DD' string.
 * @param date - The Date object to format.
 * @returns A string representing the date in 'YYYY-MM-DD' format.
 * @example formatDateForApi(new Date(2024, 0, 15)) // "2024-01-15"
 */
export const formatDateForApi = (date: Date): string => {
  // Ensures month and day are two digits
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculates a future date by adding a specified number of days to the current date.
 * @param days - The number of days to add to the current date.
 * @returns A Date object representing the future date.
 * @example getFutureDate(7) // A Date object 7 days from now
 */
export const getFutureDate = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

/**
 * Calculates a past date by subtracting a specified number of days from the current date.
 * @param days - The number of days to subtract from the current date.
 * @returns A Date object representing the past date.
 * @example getPastDate(7) // A Date object 7 days ago
 */
export const getPastDate = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};