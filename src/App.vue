<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="fixed w-full top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-2">
            <div
              class="w-8 h-8 bg-gradient-to-br from-primary-300 to-primary-500 rounded-lg flex items-center justify-center"
            >
              <span class="text-sm font-bold text-slate-900 leading-none">BML</span>
            </div>
            <router-link
              to="/"
              class="text-xl font-bold text-gray-900 hover:text-primary-500 transition-colors"
            >
              BigMikeLabs
            </router-link>
          </div>
          <div class="hidden md:flex items-center space-x-8">
            <router-link
              to="/startit"
              class="text-gray-600 hover:text-primary-500 font-medium transition-colors relative"
            >
              {{ $t('nav.startit') }}
              <span
                class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"
              ></span>
            </router-link>
            <router-link
              to="/about"
              class="text-gray-600 hover:text-primary-500 font-medium transition-colors"
              >{{ $t('nav.about') }}</router-link
            >
            <a
              :href="`mailto:${config.contact.email}?subject=Contact from BigMikeLabs website`"
              class="text-gray-600 hover:text-primary-500 font-medium transition-colors cursor-pointer"
              >{{ $t('nav.contact') }}</a
            >

            <!-- Language Switcher -->
            <div class="relative" ref="languageMenu">
              <button
                @click="languageMenuOpen = !languageMenuOpen"
                class="flex items-center space-x-1 text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 12.236 11.618 14z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ currentLocale.toUpperCase() }}</span>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <div
                v-if="languageMenuOpen"
                class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <div class="py-1">
                  <button
                    @click="changeLanguage('pl')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-primary-50 text-primary-500': currentLocale === 'pl' }"
                  >
                    🇵🇱 Polski
                  </button>
                  <button
                    @click="changeLanguage('en')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-primary-50 text-primary-500': currentLocale === 'en' }"
                  >
                    🇺🇸 English
                  </button>
                </div>
              </div>
            </div>

            <button
              @click="navigateToStartIT"
              class="bg-primary-400 text-slate-900 px-6 py-2 rounded-lg font-medium hover:bg-primary-500 transition-colors"
            >
              {{ $t('nav.getStarted') }}
            </button>
          </div>
          <button class="md:hidden p-2" @click="mobileMenuOpen = !mobileMenuOpen">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-100">
        <div class="px-4 py-2 space-y-2">
          <router-link
            to="/startit"
            class="block px-3 py-2 text-gray-600 hover:text-primary-600 font-medium flex items-center"
          >
            {{ $t('nav.startit') }}
            <span class="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </router-link>
          <router-link
            to="/about"
            class="block px-3 py-2 text-gray-600 hover:text-primary-600 font-medium"
            >{{ $t('nav.about') }}</router-link
          >
          <a
            :href="`mailto:${config.contact.email}?subject=Contact from BigMikeLabs website`"
            class="block px-3 py-2 text-gray-600 hover:text-primary-600 font-medium"
            >{{ $t('nav.contact') }}</a
          >
          <div class="border-t border-gray-200 pt-2">
            <button
              @click="changeLanguage('pl')"
              class="block w-full text-left px-3 py-2 text-gray-600 hover:text-primary-600 font-medium"
              :class="{ 'text-primary-500': currentLocale === 'pl' }"
            >
              🇵🇱 Polski
            </button>
            <button
              @click="changeLanguage('en')"
              class="block w-full text-left px-3 py-2 text-gray-600 hover:text-primary-600 font-medium"
              :class="{ 'text-primary-500': currentLocale === 'en' }"
            >
              🇺🇸 English
            </button>
          </div>
          <button
            @click="navigateToStartIT"
            class="w-full mt-2 bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            {{ $t('nav.getStarted') }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <router-view />

    <!-- Footer -->
    <footer id="contact" class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div class="col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <div
                class="w-8 h-8 bg-gradient-to-br from-primary-300 to-primary-500 rounded-lg flex items-center justify-center"
              >
                <span class="text-sm font-bold text-slate-900 leading-none">BML</span>
              </div>
              <span class="text-xl font-bold">BigMikeLabs</span>
            </div>
            <p class="text-gray-400 mb-4 max-w-md">
              {{ $t('footer.description') }}
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
              </a>
              <a
                href="https://github.com/bigmikelabs"
                class="text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 class="font-semibold mb-4">{{ $t('footer.courses') }}</h3>
            <ul class="space-y-2 text-gray-400">
              <li>
                <!-- <router-link
                  to="/courses/ai-fundamentals"
                  class="hover:text-white transition-colors"
                  > -->
                {{ $t('courses.aiFundamentals.title') }}
                <!-- </router-link -->
              </li>
              <li>
                <!-- <a href="#" class="hover:text-white transition-colors"> -->
                {{ $t('courses.codingBasics.title') }}
                <!-- </a> -->
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold mb-4">{{ $t('footer.company') }}</h3>
            <ul class="space-y-2 text-gray-400">
              <li>
                <router-link to="/about" class="hover:text-white transition-colors">
                  {{ $t('footer.aboutUs') }}
                </router-link>
              </li>
              <li>
                <router-link
                  to="/startit"
                  class="hover:text-white transition-colors flex items-center"
                >
                  {{ $t('nav.startit') }}
                  <span class="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </router-link>
              </li>
              <li>
                <router-link to="/instructors" class="hover:text-white transition-colors">{{
                  $t('footer.instructors')
                }}</router-link>
              </li>
              <li>
                <a
                  :href="`mailto:${config.contact.email}?subject=Contact from BigMikeLabs website`"
                  class="hover:text-white transition-colors text-left w-full"
                  >{{ $t('nav.contact') }}</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {{ $t('footer.copyright') }}</p>
          <div class="mt-4 flex items-center justify-center gap-2">
            <span class="text-sm">Powered by</span>
            <a
              href="https://bigmikesolutions.pl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <img src="/bigmikesolutions-favicon.svg" alt="BigMikeSolutions" class="w-5 h-5" />
              <span class="text-sm font-medium">BigMikeSolutions</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import config from './config'

const { locale, t } = useI18n()
const router = useRouter()

const mobileMenuOpen = ref(false)
const languageMenuOpen = ref(false)
const languageMenu = ref<HTMLElement | null>(null)

const currentLocale = computed(() => locale.value)

const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
  languageMenuOpen.value = false
}

const navigateToStartIT = () => {
  router.push('/startit')
}

// Close language menu when clicking outside
const handleClickOutside = (event: Event) => {
  if (languageMenu.value && !languageMenu.value.contains(event.target as Node)) {
    languageMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
