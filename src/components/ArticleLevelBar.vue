<template>
  <span
    class="inline-flex items-center gap-0.5"
    :title="title"
    :aria-label="title"
  >
    <span
      v-for="i in 3"
      :key="i"
      class="inline-block w-1.5 h-3.5 rounded-sm transition-colors"
      :class="i <= filled ? filledClass : emptyClass"
    />
  </span>
</template>

<script setup lang="ts">
import type { ArticleLevel } from '../data/articles'
import { getLevelOrder, getLevelLabelI18nKey } from '../utils/articleTranslations'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    level: ArticleLevel
    /** 'default' = gray empty, yellow filled. 'light' = white/transparent empty, yellow filled (e.g. on dark hero) */
    variant?: 'default' | 'light'
  }>(),
  { variant: 'default' }
)

const { t } = useI18n()
const filled = getLevelOrder(props.level)
const title = t(`articles.${getLevelLabelI18nKey(props.level)}`) + ` (${filled}/3)`

const filledClass = props.variant === 'light'
  ? 'bg-primary-400'
  : 'bg-primary-500'
const emptyClass = props.variant === 'light'
  ? 'bg-white/30'
  : 'bg-gray-300'
</script>
