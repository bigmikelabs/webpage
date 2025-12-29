<template>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {{ $t(`${titlePrefix}.title`) }}
        </h2>
        <p class="text-xl text-gray-600">
          {{ $t(`${titlePrefix}.subtitle`) }}
        </p>
      </div>

      <div class="flex flex-col lg:flex-row items-center gap-12 max-w-5xl mx-auto">
        <!-- Profile Image -->
        <div class="lg:w-1/3 flex-shrink-0">
          <div class="relative">
            <div class="w-64 h-64 rounded-full mx-auto shadow-2xl overflow-hidden bg-gray-100">
              <img
                src="/images/michal-wronski.jpg"
                :alt="$t(`${translationPrefix}.name`)"
                class="w-full h-full object-cover object-center"
                @error="handleImageError"
              />
              <!-- Fallback SVG (hidden by default, shown if image fails) -->
              <div
                v-if="showFallback"
                class="absolute inset-0 bg-gradient-to-br from-primary-300 to-primary-500 rounded-full flex items-center justify-center"
              >
                <svg class="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <!-- Social Badges -->
            <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <a
                href="https://www.linkedin.com/in/michal-wronski-b389a988/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
                <span>LinkedIn</span>
              </a>
              <a
                v-if="showBmsBadge"
                href="https://bigmikesolutions.pl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center space-x-2 bg-white border border-gray-300 pl-3 pr-5 py-2 rounded-full text-sm font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fe4383f33e8de4068b08ee337c7303d25%2F97b518cdac394b759f8550b40197d25a?format=webp&width=800"
                  alt="BMS"
                  class="w-4 h-4 rounded"
                />
                <span class="text-gray-800">BMS</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Profile Information -->
        <div class="lg:w-2/3 text-center lg:text-left">
          <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {{ $t(`${translationPrefix}.name`) }}
          </h3>
          <p class="text-lg text-primary-500 font-semibold mb-4">
            {{ $t(`${translationPrefix}.role`) }}
          </p>
          <p class="text-gray-600 leading-relaxed mb-6" :class="{ 'text-lg': showBmsBadge }">
            {{ $t(`${translationPrefix}.bio`) }}
          </p>

          <!-- Expertise Tags -->
          <div class="flex flex-wrap justify-center lg:justify-start gap-3 mb-4 lg:mb-6">
            <span
              class="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full"
            >
              {{ $t(`${translationPrefix}.experience`) }}
            </span>
            <span
              class="inline-block bg-success-100 text-success-800 text-sm font-medium px-3 py-1 rounded-full"
            >
              {{ $t(`${translationPrefix}.expertise1`) }}
            </span>
            <span
              class="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full"
            >
              {{ $t(`${translationPrefix}.expertise2`) }}
            </span>
          </div>

          <!-- Social Links for larger screens -->
          <div class="hidden lg:flex gap-6">
            <a
              href="https://www.linkedin.com/in/michal-wronski-b389a988/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
              <span>{{ $t(`${translationPrefix}.viewProfile`) }}</span>
            </a>
            <a
              v-if="showBmsBadge"
              href="https://bigmikesolutions.pl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fe4383f33e8de4068b08ee337c7303d25%2F97b518cdac394b759f8550b40197d25a?format=webp&width=800"
                alt="BMS"
                class="w-5 h-5 rounded"
              />
              <span>Big Mike Solutions</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  translationPrefix: string
  titlePrefix?: string
  showBmsBadge?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  titlePrefix: undefined,
  showBmsBadge: true,
})

const titlePrefix = computed(() => props.titlePrefix || props.translationPrefix)

// Profile image error handling
const showFallback = ref(false)

const handleImageError = () => {
  showFallback.value = true
}
</script>

