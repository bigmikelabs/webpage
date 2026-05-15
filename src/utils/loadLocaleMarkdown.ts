import { marked } from 'marked'

function isHtmlResponse(text: string, contentType: string): boolean {
  if (contentType.includes('text/html')) return true
  const trimmed = text.trimStart().toLowerCase()
  return trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')
}

/**
 * Load locale-specific markdown from public/{directory}/{id}.{lang}.md
 * and return HTML. Falls back to English when the locale file is missing.
 */
export async function fetchLocaleMarkdownHtml(
  directory: 'articles' | 'resources',
  id: string,
  lang: string
): Promise<string> {
  let res = await fetch(`/${directory}/${id}.${lang}.md`)
  if (!res.ok && lang !== 'en') {
    res = await fetch(`/${directory}/${id}.en.md`)
  }
  if (!res.ok) {
    throw new Error('Failed to load markdown')
  }

  const contentType = res.headers.get('content-type') ?? ''
  const text = await res.text()

  if (isHtmlResponse(text, contentType)) {
    throw new Error('Markdown file not found')
  }

  return marked.parse(text) as string
}
