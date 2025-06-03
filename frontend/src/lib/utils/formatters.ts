import { format, formatDistanceToNowStrict, parseISO, isValid } from 'date-fns';

/**
 * Formats a date string or Date object into a specified string format.
 * Defaults to 'PPP' (e.g., Sep 20, 2023).
 * @param date The date to format (string or Date object).
 * @param formatString The desired date format string (e.g., 'MM/dd/yyyy', 'PPP').
 * @returns The formatted date string, or an empty string if the date is invalid.
 */
export const formatDate = (date: string | Date | undefined | null, formatString: string = 'PPP'): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? format(dateObj, formatString) : '';
};

/**
 * Formats a date string or Date object into a relative time string (e.g., "2 hours ago").
 * @param date The date to format (string or Date object).
 * @returns The formatted relative time string, or an empty string if the date is invalid.
 */
export const formatRelativeTime = (date: string | Date | undefined | null): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? formatDistanceToNowStrict(dateObj, { addSuffix: true }) : '';
};

/**
 * Formats a number as currency, defaulting to INR (Indian Rupees).
 * @param amount The number to format.
 * @param currency The currency code (e.g., 'INR', 'USD'). Defaults to 'INR'.
 * @param locale The locale for formatting. Defaults to 'en-IN'.
 * @returns The formatted currency string.
 */
export const formatCurrency = (amount: number | undefined | null, currency: string = 'INR', locale: string = 'en-IN'): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return ''; // Or return a default like '₹0.00'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Truncates a string to a specified maximum length, adding an ellipsis if truncated.
 * @param text The string to truncate.
 * @param maxLength The maximum length of the string.
 * @returns The truncated string with an ellipsis, or the original string if shorter than maxLength.
 */
export const truncateText = (text: string | undefined | null, maxLength: number = 50): string => {
  if (!text) return '';
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalizes the first letter of each word in a string.
 * @param text The string to capitalize.
 * @returns The capitalized string.
 */
export const capitalizeWords = (text: string | undefined | null): string => {
  if (!text) return '';
  return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Generates a placeholder string if the input value is empty or null.
 * @param value The value to check.
 * @param placeholder The placeholder string to return if value is empty. Defaults to 'N/A'.
 * @returns The original value or the placeholder string.
 */
export const displayOrPlaceholder = (value: string | number | null | undefined, placeholder: string = 'N/A'): string | number => {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return placeholder;
  }
  return value;
};
