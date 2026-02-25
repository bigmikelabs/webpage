<template>
  <div class="min-h-screen bg-white pt-20 pb-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ $t('page.notFound') }}</h1>
      <p class="text-gray-600 mb-8">{{ $t('page.notFoundDescription') }}</p>
      <router-link
        to="/"
        class="inline-flex items-center bg-primary-400 text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-primary-500 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        {{ $t('page.backHome') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
