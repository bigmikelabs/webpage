import type { TranslatedText } from './articles'

export interface ResourceImage {
  src: string
  alt?: TranslatedText
}

/** Resource content language (matches site locales) */
export type ResourceLang = 'en' | 'pl'

/**
 * Resource metadata for list/cards. Body content is loaded from Markdown when opened.
 */
export interface ResourceMeta {
  id: string
  title: TranslatedText
  /** Short description for list and card previews */
  description: TranslatedText
  /** Hero/card image */
  images?: ResourceImage[]
  /** Resource content language */
  lang: ResourceLang
  /** Tags for filtering/display (e.g. ai, ml) */
  tags?: string[]
  /** External URL where the resource can be purchased */
  url: string
}

// Resource metadata index – add new entries here when you add .md files under public/resources/
export const resources: ResourceMeta[] = [
  {
    id: 'math-for-ai-ml',
    title: {
      en: 'Mathematics for AI and Machine Learning',
      pl: 'Matematyka dla AI i Machine Learning',
    },
    description: {
      en: 'AI stops being magic when you understand the fundamentals. This material shows you step by step how modern AI models work — from embeddings to self-attention — using simple math, intuition, and practical examples instead of complex theory.',
      pl: 'AI przestaje być magią, gdy rozumiesz fundamenty. Ten materiał pokazuje krok po kroku, jak działają nowoczesne modele AI — od embeddingów po self-attention — używając prostej matematyki, intuicji i praktycznych przykładów zamiast skomplikowanej teorii.',
    },
    lang: 'pl',
    tags: ['ai', 'ml', 'math'],
    url: 'https://bigmikesolutions.gumroad.com/l/math4ai',
    images: [
      {
        src: '/resources/images/math4ai.jpg',
        alt: {
          en: 'Mathematics for AI and Machine Learning',
          pl: 'Matematyka dla AI i Machine Learning',
        },
      },
    ],
  },
]

export function getResourceById(id: string): ResourceMeta | undefined {
  return resources.find((r) => r.id === id)
}
