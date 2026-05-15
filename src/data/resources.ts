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

export const resources: ResourceMeta[] = [
  {
    id: 'math-for-ai-ml',
    title: {
      en: 'Mathematics for AI and Machine Learning',
      pl: 'Matematyka dla AI i Machine Learning',
    },
    description: {
      en: 'A practical, fast-track guide to the core mathematics behind AI and machine learning. Instead of abstract theory, you learn the ideas that actually power modern models — vectors, embeddings, and self-attention — explained in an intuitive way with examples. Perfect if you want to finally understand what is happening under the hood and start using AI more effectively in practice.',
      pl: 'Praktyczny, szybki przewodnik po matematycznych fundamentach AI i machine learning. Zamiast abstrakcyjnej teorii dostajesz zrozumienie tego, co naprawdę napędza nowoczesne modele — wektory, embeddingi i self-attention — wyjaśnione w intuicyjny sposób na przykładach. Idealne, jeśli chcesz w końcu zrozumieć co dzieje się „pod maską” i zacząć świadomie używać AI w praktyce.',
    },
    lang: 'pl',
    tags: ['ai', 'ml', 'math'],
    url: 'https://bigmikesolutions.gumroad.com/l/math4ai',
    images: [
      {
        src: '/images/math4ai.jpg',
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
