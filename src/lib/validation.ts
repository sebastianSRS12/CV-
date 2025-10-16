/**
 * Validation utilities for environment variables and API keys.
 * Provides regex patterns and helper functions for common keys.
 */

/**
 * Regex pattern for Google API keys.
 * Google API keys typically start with "AIza" followed by 35 alphanumeric characters,
 * dashes or underscores.
 */
export const GOOGLE_API_KEY_REGEX = /^AIza[0-9A-Za-z\-_]{35}$/;

/**
 * Validate a Google API key.
 * @param key - The API key string to validate.
 * @returns true if the key matches the expected pattern, false otherwise.
 */
export function isValidGoogleApiKey(key: string): boolean {
  return GOOGLE_API_KEY_REGEX.test(key);
}

/**
 * Generic validator for required environment variables.
 * Returns true if the value is a non-empty string.
 * @param value - The environment variable value.
 */
export function isNonEmptyString(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}