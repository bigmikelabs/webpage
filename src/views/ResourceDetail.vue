<template>
  <div class="min-h-screen bg-white">
    <article v-if="resource" class="pt-20 pb-16">
      <div
        v-if="resource.images && resource.images.length > 0"
        class="relative h-96 overflow-hidden"
      >
        <img
          :src="resource.images[0].src"
          :alt="imageAlt"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl sm:text-5xl font-bold mb-4">{{ title }}</h1>
            <div class="flex flex-wrap gap-2 mt-3">
              <span
                class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/30 text-white"
              >
                {{ $t(`resources.lang.${resource.lang}`) }}
              </span>
              <span
                v-for="tag in resource.tags"
                :key="tag"
                class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        :class="resource.images?.length ? 'mt-12' : ''"
      >
        <div v-if="!resource.images?.length" class="mb-8">
          <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">{{ title }}</h1>
          <p class="text-xl text-gray-600 mb-4">{{ description }}</p>
          <div class="flex flex-wrap gap-2 mt-3">
            <span
              class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-300 text-gray-800"
            >
              {{ $t(`resources.lang.${resource.lang}`) }}
            </span>
            <span
              v-for="tag in resource.tags"
              :key="tag"
              class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <p v-else class="text-xl text-gray-600 mb-8">
          {{ description }}
        </p>

        <div v-if="loading" class="prose prose-lg max-w-none text-gray-500">
          {{ $t('resources.loading') }}
        </div>
        <div v-else-if="loadError" class="prose prose-lg max-w-none text-red-600">
          {{ $t('resources.loadError') }}
        </div>
        <div v-else-if="htmlContent" class="prose prose-lg max-w-none" v-html="htmlContent" />

        <div class="mt-8">
          <a
            :href="resource.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-primary-400 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-lg hover:shadow-xl"
          >
            {{ $t('resources.buyResource') }}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        <div class="mt-12 pt-8 border-t border-gray-200">
          <router-link
            to="/#resources"
            class="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            {{ $t('resources.backToHome') }}
          </router-link>
        </div>
      </div>
    </article>

    <div v-else class="pt-20 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ $t('resources.notFound') }}</h1>
        <p class="text-gray-600 mb-8">{{ $t('resources.notFoundDescription') }}</p>
        <router-link
          to="/"
          class="inline-flex items-center bg-primary-400 text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-primary-500 transition-colors"
        >
          {{ $t('resources.backToHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getResourceById, type ResourceMeta } from '../data/resources'
import { getTranslatedText } from '../utils/articleTranslations'
import { fetchLocaleMarkdownHtml } from '../utils/loadLocaleMarkdown'

const route = useRoute()
const { locale } = useI18n()

const htmlContent = ref<string | null>(null)
const loading = ref(false)
const loadError = ref(false)

const resource = computed<ResourceMeta | undefined>(() => {
  const id = route.params.id as string
  return getResourceById(id)
})

const title = computed(() =>
  resource.value ? getTranslatedText(resource.value.title, locale.value) : ''
)
const description = computed(() =>
  resource.value ? getTranslatedText(resource.value.description, locale.value) : ''
)
const imageAlt = computed(() => {
  const image = resource.value?.images?.[0]
  if (!image?.alt) return title.value
  return getTranslatedText(image.alt, locale.value)
})

async function loadMarkdown(id: string, lang: string) {
  htmlContent.value = null
  loadError.value = false
  loading.value = true
  try {
    htmlContent.value = await fetchLocaleMarkdownHtml('resources', id, lang)
  } catch {
    loadError.value = true
  } finally {
    loading.value = false
  }
}

watch(
  [() => route.params.id, () => locale.value, resource],
  ([id, lang]) => {
    if (id && resource.value && typeof lang === 'string') {
      loadMarkdown(id as string, lang)
    } else {
      htmlContent.value = null
      loading.value = false
      loadError.value = false
    }
  },
  { immediate: true }
)
</script>
