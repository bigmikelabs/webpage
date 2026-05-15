<template>
  <router-link
    :to="`/publications/${publication.id}`"
    class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group relative block"
  >
    <div
      v-if="publication.images && publication.images.length > 0"
      class="h-48 relative overflow-hidden"
    >
      <img
        :src="publication.images[0].src"
        :alt="imageAlt"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div
      v-else
      class="h-48 bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center"
    >
      <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <div class="p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
        {{ title }}
      </h3>
      <p class="text-gray-600 mb-4">{{ description }}</p>
      <div v-if="publication.tags?.length" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in publication.tags"
          :key="tag"
          class="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
        >
          {{ tag }}
        </span>
      </div>
      <a
        :href="publication.url"
        target="_blank"
        rel="noopener noreferrer"
        class="w-full bg-primary-400 text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-primary-500 transition-colors flex items-center justify-center gap-2"
        @click.stop
      >
        {{ $t('publications.buyPublication') }}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PublicationMeta } from '../data/publications'
import { getTranslatedText } from '../utils/articleTranslations'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  publication: PublicationMeta
}>()

const { locale } = useI18n()

const title = computed(() => getTranslatedText(props.publication.title, locale.value))
const description = computed(() =>
  getTranslatedText(props.publication.description, locale.value)
)
const imageAlt = computed(() => {
  const image = props.publication.images?.[0]
  if (!image?.alt) return title.value
  return getTranslatedText(image.alt, locale.value)
})
</script>
