export interface TranslatedText {
  en: string
  pl: string
}

export interface ArticleImage {
  src: string
  alt?: TranslatedText
  caption?: TranslatedText
}

/**
 * Article metadata for list/cards. Body content is loaded from Markdown when the article is opened.
 */
export interface ArticleMeta {
  id: string
  title: TranslatedText
  date?: Date
  author?: string
  /** Hero/card image and optional extra images for layout */
  images?: ArticleImage[]
  /** Short summary for list and card previews */
  summary?: TranslatedText
}

// Article metadata index – add new entries here when you add a new .md file under public/articles/
export const articles: ArticleMeta[] = [
  {
    id: 'grpc-takes-load-to-beat-http2',
    title: {
      en: 'gRPC takes load to beat HTTP/2',
      pl: 'gRPC potrzebuje ruchu, by pokazać swoją przewagę nad HTTP/2',
    },
    date: new Date('2026-02-24'),
    author: 'Michał Wroński',
    summary: {
      en: 'Is gRPC always better than HTTP/2? Sometimes you need a bigger load to spot the difference.',
      pl: 'Czy gRPC zawsze jest lepszy od HTTP/2? Czasem potrzebujesz większego obciążenia, aby zauważyć różnicę.',
    },
    images: [
      {
        src: '/images/grpc-vs-http2/header.jpg',
        alt: {
          en: 'gRPC vs HTTP/2',
          pl: 'gRPC a HTTP/2',
        },
        caption: {
          en: '',
          pl: '',
        },
      },
    ],
  },
]
