/**
 * Parse a date string as local (YYYY-MM-DD always as local, not UTC)
 * @param dateString - The date string to parse
 * @returns Date object
 */
export function parseDateLocal(dateString: string | Date | null | undefined): Date | null {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;
  // If format is YYYY-MM-DD, parse as local
  const match = /^\d{4}-\d{2}-\d{2}$/.exec(dateString);
  if (match) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  // Otherwise, fallback to native Date parsing
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  return d;
}

/**
 * Format a date string to a more readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date): string {
  try {
    const date = parseDateLocal(dateString);
    if (!date) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format date to ISO format YYYY-MM-DD for date inputs
 * @param date - Date object or string
 * @returns ISO formatted date string
 */
export function formatDateForInput(date: Date | string | null): string {
  try {
    if (!date) return '';
    const dateObj = parseDateLocal(date);
    if (!dateObj) return '';
    // Format as YYYY-MM-DD
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
}

/**
 * Check if a date is in the past
 * @param dateString - The date string to check
 * @returns Boolean indicating if date is in the past
 */
export function isDateExpired(dateString: string | Date): boolean {
  try {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day
    
    return date < today;
  } catch (error) {
    console.error('Error checking if date is expired:', error);
    return false;
  }
} 