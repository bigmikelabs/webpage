export interface ArticleImage {
  src: string
  alt?: string
  caption?: string
}

export interface Article {
  id: string
  title: string
  date?: Date
  author?: string
  content: string[]
  images?: ArticleImage[]
}

// Static articles array - shared across components
export const articles: Article[] = [
  {
    id: 'welcome-to-our-blog',
    title: 'Welcome to Our Blog',
    date: new Date('2026-01-28'),
    author: 'Michał Wroński',
    content: [
      'This is your first article. You can add more articles to this array.',
      'Each article can contain multiple paragraphs of text and several images.',
      'Simply add new objects to the articles array to publish more content.',
    ],
    images: [
      {
        src: '/images/michal-wronski.jpg',
        alt: 'Sample image',
        caption: 'This is a sample image caption',
      },
    ],
  },
]
