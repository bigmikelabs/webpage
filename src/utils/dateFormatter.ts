/**
 * Format a date according to the specified locale
 * @param date - The date to format
 * @param locale - The locale code (e.g., 'en', 'pl')
 * @returns Formatted date string
 */
export function formatDate(date: Date, locale: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-US', options).format(date)
}
