<template>
  <div class="min-h-screen bg-white">
    <!-- Yellow Bar Header -->
    <div class="pt-16">
      <div class="h-2 bg-primary-400"></div>
    </div>

    <!-- Articles List -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <router-link
            v-for="article in articles"
            :key="article.id"
            :to="`/articles/${article.id}`"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col group"
          >
            <!-- Article Image -->
            <div v-if="article.images && article.images.length > 0" class="relative h-48 overflow-hidden">
              <img
                :src="article.images[0].src"
                :alt="getImageAlt(article.images[0]) || getArticleTitle(article)"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <!-- Placeholder if no image -->
            <div v-else class="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <svg class="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <!-- Article Content -->
            <div class="p-6 flex-1 flex flex-col">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-gray-500 mb-3">
                <span v-if="article.date">{{ formatArticleDate(article.date) }}</span>
                <span v-if="article.author">{{ article.author }}</span>
                <span v-if="article.readingDurationMinutes">
                  {{ $t('articles.readingTime', { n: article.readingDurationMinutes }) }}
                </span>
                <span v-if="article.level" class="inline-flex items-center gap-1.5">
                  {{ $t('articles.level') }} <ArticleLevelBar :level="article.level" />
                </span>
                <template v-if="article.tags && article.tags.length">
                  <span
                    v-for="tag in article.tags.slice(0, 4)"
                    :key="tag"
                    class="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {{ tag }}
                  </span>
                </template>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-500 transition-colors">
                {{ getArticleTitle(article) }}
              </h3>
              <p class="text-gray-600 mb-4 flex-1 line-clamp-3">
                {{ getArticleSummary(article) }}
              </p>
              <div class="text-primary-500 group-hover:text-primary-600 font-medium inline-flex items-center">
                {{ $t('articles.readMore') }}
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </router-link>

          <!-- Empty State -->
          <div v-if="articles.length === 0" class="col-span-full text-center py-12">
            <p class="text-gray-500 text-lg">{{ $t('articles.emptyState') }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { articles, type ArticleMeta } from '../data/articles'
import { useI18n } from 'vue-i18n'
import { formatDate } from '../utils/dateFormatter'
import ArticleLevelBar from '../components/ArticleLevelBar.vue'
import { getTranslatedText } from '../utils/articleTranslations'

const { locale } = useI18n()

// Format article date based on current locale
const formatArticleDate = (date: Date): string => {
  return formatDate(date, locale.value)
}

// Get translated article title
const getArticleTitle = (article: ArticleMeta): string => {
  return getTranslatedText(article.title, locale.value)
}

// Get translated summary for card preview
const getArticleSummary = (article: ArticleMeta): string => {
  if (article.summary) return getTranslatedText(article.summary, locale.value)
  return ''
}

// Get translated image alt text
const getImageAlt = (image: NonNullable<ArticleMeta['images']>[number]): string | undefined => {
  if (!image.alt) return undefined
  return getTranslatedText(image.alt, locale.value)
}
</script>
