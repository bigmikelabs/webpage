import type { TranslatedText } from './articles'

export interface PublicationImage {
  src: string
  alt?: TranslatedText
}

/**
 * Publication metadata for list/cards. Body content is loaded from Markdown when opened.
 */
export interface PublicationMeta {
  id: string
  title: TranslatedText
  /** Short description for list and card previews */
  description: TranslatedText
  /** Hero/card image */
  images?: PublicationImage[]
  /** Tags for filtering/display (e.g. pl, ai) */
  tags?: string[]
  /** External URL where the publication can be purchased */
  url: string
}

export const publications: PublicationMeta[] = [
  {
    id: 'math-for-ai-ml',
    title: {
      en: 'Mathematics for AI and Machine Learning',
      pl: 'Matematyka dla AI i Machine Learning',
    },
    description: {
      en: 'A practical, fast-track guide to the core mathematics behind AI and machine learning. Instead of abstract theory, you learn the ideas that actually power modern models — vectors, embeddings, and self-attention — explained in an intuitive way. Perfect if you want to finally understand what is happening under the hood and start using AI more effectively in practice.',
      pl: 'Praktyczny, szybki przewodnik po matematycznych fundamentach AI i machine learning. Zamiast abstrakcyjnej teorii dostajesz zrozumienie tego, co naprawdę napędza nowoczesne modele — wektory, embeddingi i self-attention — wyjaśnione w intuicyjny sposób. Idealne, jeśli chcesz w końcu zrozumieć co dzieje się „pod maską” i zacząć świadomie używać AI w praktyce.',
    },
    tags: ['pl', 'ai', 'ml', 'math'],
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

export function getPublicationById(id: string): PublicationMeta | undefined {
  return publications.find((p) => p.id === id)
}
