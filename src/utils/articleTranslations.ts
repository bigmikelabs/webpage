import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Article, TranslatedText, ArticleImage } from '../data/articles'

/**
 * Get translated text based on current locale
 */
export function getTranslatedText(text: TranslatedText, locale: string): string {
  return locale === 'pl' ? text.pl : text.en
}

/**
 * Get translated content for an article based on current locale
 */
export function useArticleTranslations(article: Article) {
  const { locale } = useI18n()

  const title = computed(() => getTranslatedText(article.title, locale.value))
  const content = computed(() => {
    return locale.value === 'pl' ? article.content.pl : article.content.en
  })

  const getImageAlt = (image: ArticleImage): string | undefined => {
    if (!image.alt) return undefined
    return getTranslatedText(image.alt, locale.value)
  }

  const getImageCaption = (image: ArticleImage): string | undefined => {
    if (!image.caption) return undefined
    return getTranslatedText(image.caption, locale.value)
  }

  return {
    title,
    content,
    getImageAlt,
    getImageCaption,
  }
}
