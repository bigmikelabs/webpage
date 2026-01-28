export interface TranslatedText {
  en: string
  pl: string
}

export interface ArticleImage {
  src: string
  alt?: TranslatedText
  caption?: TranslatedText
}

export interface Article {
  id: string
  title: TranslatedText
  date?: Date
  author?: string
  content: {
    en: string[]
    pl: string[]
  }
  images?: ArticleImage[]
}

// Static articles array - shared across components
export const articles: Article[] = [
  {
    id: 'welcome-to-our-blog',
    title: {
      en: 'Welcome to Our Blog',
      pl: 'Witamy na Naszym Blogu',
    },
    date: new Date('2026-01-28'),
    author: 'Michał Wroński',
    content: {
      en: [
        'This is your first article. You can add more articles to this array.',
        'Each article can contain multiple paragraphs of text and several images.',
        'Simply add new objects to the articles array to publish more content.',
      ],
      pl: [
        'To jest Twój pierwszy artykuł. Możesz dodać więcej artykułów do tej tablicy.',
        'Każdy artykuł może zawierać wiele akapitów tekstu i kilka obrazów.',
        'Po prostu dodaj nowe obiekty do tablicy artykułów, aby publikować więcej treści.',
      ],
    },
    images: [
      {
        src: '/images/michal-wronski.jpg',
        alt: {
          en: 'Sample image',
          pl: 'Przykładowy obraz',
        },
        caption: {
          en: 'This is a sample image caption',
          pl: 'To jest przykładowy podpis obrazu',
        },
      },
    ],
  },
]
