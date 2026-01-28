import type { Article } from '../articles'

export const welcomeToOurBlog: Article = {
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
      {
        type: 'image',
        src: '/images/michal-wronski.jpg',
        title: {
          en: 'Sample Image Title',
          pl: 'Przykładowy Tytuł Obrazu',
        },
        description: {
          en: 'This is a sample image description that appears below the image.',
          pl: 'To jest przykładowy opis obrazu, który pojawia się pod obrazem.',
        },
        alt: {
          en: 'Sample image',
          pl: 'Przykładowy obraz',
        },
        caption: {
          en: 'This is a sample image caption',
          pl: 'To jest przykładowy podpis obrazu',
        },
      },
      'Simply add new objects to the articles array to publish more content.',
    ],
    pl: [
      'To jest Twój pierwszy artykuł. Możesz dodać więcej artykułów do tej tablicy.',
      'Każdy artykuł może zawierać wiele akapitów tekstu i kilka obrazów.',
      {
        type: 'image',
        src: '/images/michal-wronski.jpg',
        title: {
          en: 'Sample Image Title',
          pl: 'Przykładowy Tytuł Obrazu',
        },
        description: {
          en: 'This is a sample image description that appears below the image.',
          pl: 'To jest przykładowy opis obrazu, który pojawia się pod obrazem.',
        },
        alt: {
          en: 'Sample image',
          pl: 'Przykładowy obraz',
        },
        caption: {
          en: 'This is a sample image caption',
          pl: 'To jest przykładowy podpis obrazu',
        },
      },
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
}
