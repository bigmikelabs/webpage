<template>
  <div class="min-h-screen bg-white">
    <!-- Article Detail -->
    <article v-if="article" class="pt-20 pb-16">
      <!-- Hero Section with Image -->
      <div v-if="article.images && article.images.length > 0" class="relative h-96 overflow-hidden">
        <img
          :src="article.images[0].src"
          :alt="getImageAlt(article.images[0]) || getArticleTitle(article)"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl sm:text-5xl font-bold mb-4">{{ getArticleTitle(article) }}</h1>
            <div class="flex items-center text-sm text-white/90">
              <span v-if="article.date">{{ formatArticleDate(article.date) }}</span>
              <span v-if="article.author" class="ml-4">{{ article.author }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Article Content -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <!-- Header (if no hero image) -->
        <div v-if="!article.images || article.images.length === 0" class="mb-8">
          <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">{{ getArticleTitle(article) }}</h1>
          <div class="flex items-center text-sm text-gray-500">
            <span v-if="article.date">{{ formatArticleDate(article.date) }}</span>
            <span v-if="article.author" class="ml-4">By {{ article.author }}</span>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="prose prose-lg max-w-none text-gray-500">
          Loading…
        </div>

        <!-- Error state -->
        <div v-else-if="loadError" class="prose prose-lg max-w-none text-red-600">
          Failed to load article content.
        </div>

        <!-- Article Body (Markdown) -->
        <div
          v-else-if="htmlContent"
          class="prose prose-lg max-w-none"
          v-html="htmlContent"
        />

        <!-- Back to Articles Link -->
        <div class="mt-12 pt-8 border-t border-gray-200">
          <router-link
            to="/articles"
            class="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            {{ $t('articles.backToArticles') }}
          </router-link>
        </div>
      </div>
    </article>

    <!-- Article Not Found -->
    <div v-else class="pt-20 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ $t('articles.notFound') }}</h1>
        <p class="text-gray-600 mb-8">{{ $t('articles.notFoundDescription') }}</p>
        <router-link
          to="/articles"
          class="inline-flex items-center bg-primary-400 text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-primary-500 transition-colors"
        >
          {{ $t('articles.backToArticles') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import { articles, type ArticleMeta } from '../data/articles'
import { formatDate } from '../utils/dateFormatter'
import { getTranslatedText } from '../utils/articleTranslations'

const route = useRoute()
const { locale } = useI18n()

const htmlContent = ref<string | null>(null)
const loading = ref(false)
const loadError = ref(false)

// Find article by ID from route params
const article = computed<ArticleMeta | undefined>(() => {
  const articleId = route.params.id as string
  return articles.find((a) => a.id === articleId)
})

const getArticleTitle = (a: ArticleMeta): string => getTranslatedText(a.title, locale.value)
const getImageAlt = (image: NonNullable<ArticleMeta['images']>[number]): string | undefined =>
  image.alt ? getTranslatedText(image.alt, locale.value) : undefined

const formatArticleDate = (date: Date): string => formatDate(date, locale.value)

async function loadMarkdown(id: string) {
  htmlContent.value = null
  loadError.value = false
  loading.value = true
  try {
    const res = await fetch(`/articles/${id}.md`)
    if (!res.ok) throw new Error('Failed to load')
    const text = await res.text()
    htmlContent.value = marked.parse(text) as string
  } catch {
    loadError.value = true
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.id,
  (id) => {
    if (id && article.value) loadMarkdown(id as string)
  },
  { immediate: true }
)
</script>
