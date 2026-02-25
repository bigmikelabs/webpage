import type { TranslatedText, ArticleLevel } from '../data/articles'

/**
 * Get translated text based on current locale
 */
export function getTranslatedText(text: TranslatedText, locale: string): string {
  return locale === 'pl' ? text.pl : text.en
}

/** i18n key suffix for article level (e.g. "levelBeginner") */
export function getLevelLabelI18nKey(level: ArticleLevel): string {
  const key: Record<ArticleLevel, string> = {
    beginner: 'levelBeginner',
    medium: 'levelMedium',
    advanced: 'levelAdvanced',
  }
  return key[level]
}

/** Display order 1/3, 2/3, 3/3 for beginner, medium, advanced */
export function getLevelOrder(level: ArticleLevel): number {
  const order: Record<ArticleLevel, number> = {
    beginner: 1,
    medium: 2,
    advanced: 3,
  }
  return order[level]
}
