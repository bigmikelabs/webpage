export interface TranslatedText {
  en: string
  pl: string
}

export interface ArticleImage {
  src: string
  alt?: TranslatedText
  caption?: TranslatedText
}

export interface ContentImage {
  type: 'image'
  src: string
  title: TranslatedText
  description: TranslatedText
  alt?: TranslatedText
  caption?: TranslatedText
}

export type ContentItem = string | ContentImage

export interface Article {
  id: string
  title: TranslatedText
  date?: Date
  author?: string
  content: {
    en: ContentItem[]
    pl: ContentItem[]
  }
  images?: ArticleImage[]
}

// Import individual articles
import { welcomeToOurBlog } from './articles/welcome-to-our-blog'

// Static articles array - shared across components
// Add new articles by importing them above and adding them to this array
export const articles: Article[] = [
  welcomeToOurBlog,
  // Add more articles here as you create them
]
