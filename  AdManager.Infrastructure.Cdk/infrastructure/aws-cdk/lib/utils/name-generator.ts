import { EnvironmentName } from '../config/environment.enum';

interface GenerateResourceNameParams {
  appName: string;
  envName: EnvironmentName | string; // Allow string for flexibility if enum not directly available
  resourceIdentifier: string;
  maxLength?: number;
  separator?: string;
}

/**
 * Generates a standardized AWS resource name.
 *
 * @param params Parameters for generating the name.
 * @returns A standardized resource name string.
 *
 * Example:
 * generateResourceName({ appName: "AdManager", envName: EnvironmentName.DEV, resourceIdentifier: "app-vpc" })
 * // => "admanager-dev-app-vpc"
 *
 * generateResourceName({ appName: "MyAPP", envName: "prod", resourceIdentifier: "MainDB", maxLength: 30, separator: "_" })
 * // => "myapp_prod_maindb" (if length allows, otherwise truncated)
 */
export function generateResourceName(params: GenerateResourceNameParams): string {
  const {
    appName,
    envName,
    resourceIdentifier,
    maxLength,
    separator = '-',
  } = params;

  let nameParts = [
    appName.toLowerCase(),
    (typeof envName === 'string' ? envName : envName.toString()).toLowerCase(),
    resourceIdentifier.toLowerCase(),
  ];

  // Filter out any empty parts that might occur if a component is an empty string
  nameParts = nameParts.filter(part => part && part.length > 0);

  let fullName = nameParts.join(separator);

  // Replace any characters not allowed in typical AWS resource names (alphanumeric and hyphens)
  // This is a basic sanitization. Specific services might have stricter rules.
  fullName = fullName.replace(/[^a-z0-9-]/gi, '-');

  // Ensure it doesn't start or end with a hyphen, or have consecutive hyphens
  fullName = fullName.replace(/^-+|-+$/g, '').replace(/-+/g, '-');


  if (maxLength && fullName.length > maxLength) {
    // Basic truncation strategy: try to keep prefix and suffix if possible
    // A more sophisticated strategy might involve hashing or more intelligent truncation.
    const charsToCut = fullName.length - maxLength;
    const midPoint = Math.floor(resourceIdentifier.length / 2);
    // Truncate from the middle of the resourceIdentifier part to preserve appName and envName
    const resIdCutStart = appName.length + envName.length + (separator.length * 2) + midPoint - Math.floor(charsToCut / 2);
    
    // Fallback to simple truncation if smart truncation is complex or results in invalid cuts
    if (resIdCutStart > (appName.length + envName.length + (separator.length * 2)) && (resIdCutStart + charsToCut) < fullName.length ) {
        const firstPart = fullName.substring(0, resIdCutStart);
        const lastPart = fullName.substring(resIdCutStart + charsToCut);
        fullName = `${firstPart}${lastPart}`;
    } else {
        fullName = fullName.substring(0, maxLength);
    }
    
    // Re-check for trailing hyphen after truncation
    fullName = fullName.replace(/-+$/, '');
  }

  return fullName;
}