import type { TranslatedText } from '../data/articles'

/**
 * Get translated text based on current locale
 */
export function getTranslatedText(text: TranslatedText, locale: string): string {
  return locale === 'pl' ? text.pl : text.en
}
