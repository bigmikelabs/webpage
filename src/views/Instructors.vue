<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="pt-20 pb-16 lg:pt-28 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-primary-100"
    >
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
          {{ $t('instructors.hero.title') }}
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {{ $t('instructors.hero.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Main Instructor Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div class="lg:grid lg:grid-cols-2">
              <!-- Photo Section -->
              <div
                class="bg-gradient-to-br from-primary-300 to-primary-500 p-8 lg:p-12 flex items-center justify-center"
              >
                <div class="text-center">
                  <div
                    class="w-48 h-48 rounded-full mx-auto mb-6 overflow-hidden bg-white/20 shadow-2xl"
                  >
                    <img
                      src="/images/michal-wronski.jpg"
                      alt="Michał Wroński"
                      class="w-full h-full object-cover object-center"
                      @error="handleImageError"
                    />
                    <div
                      v-if="showFallback"
                      class="w-full h-full bg-white/30 flex items-center justify-center"
                    >
                      <svg class="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <a
                    href="https://www.linkedin.com/in/michal-wronski-b389a988/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center space-x-2 bg-white/20 text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                      />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

              <!-- Info Section -->
              <div class="p-8 lg:p-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Michał Wroński</h2>
                <p class="text-xl text-primary-500 font-semibold mb-6">
                  {{ $t('instructors.michal.role') }}
                </p>

                <div class="space-y-4 mb-8">
                  <p class="text-gray-600 leading-relaxed">
                    {{ $t('instructors.michal.bio1') }}
                  </p>
                  <p class="text-gray-600 leading-relaxed">
                    {{ $t('instructors.michal.bio2') }}
                  </p>
                </div>

                <!-- Expertise Tags -->
                <div class="flex flex-wrap gap-2 mb-8">
                  <span
                    class="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {{ $t('instructors.michal.expertise.ai') }}
                  </span>
                  <span
                    class="inline-block bg-success-100 text-success-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {{ $t('instructors.michal.expertise.programming') }}
                  </span>
                  <span
                    class="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {{ $t('instructors.michal.expertise.management') }}
                  </span>
                  <span
                    class="inline-block bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {{ $t('instructors.michal.expertise.mentoring') }}
                  </span>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-primary-500 mb-1">15+</div>
                    <div class="text-sm text-gray-600">
                      {{ $t('instructors.michal.stats.years') }}
                    </div>
                  </div>
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-2xl font-bold text-success-600 mb-1">100+</div>
                    <div class="text-sm text-gray-600">
                      {{ $t('instructors.michal.stats.students') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Teaching Philosophy Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            {{ $t('instructors.philosophy.title') }}
          </h2>

          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white rounded-xl p-6 shadow-lg">
              <div
                class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg class="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">
                {{ $t('instructors.philosophy.practical.title') }}
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ $t('instructors.philosophy.practical.description') }}
              </p>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-lg">
              <div
                class="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg class="w-6 h-6 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">
                {{ $t('instructors.philosophy.personalized.title') }}
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ $t('instructors.philosophy.personalized.description') }}
              </p>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-lg">
              <div
                class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">
                {{ $t('instructors.philosophy.industry.title') }}
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ $t('instructors.philosophy.industry.description') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Join Team Section -->
    <section class="py-16">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {{ $t('instructors.joinTeam.title') }}
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          {{ $t('instructors.joinTeam.subtitle') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/#courses"
            class="bg-primary-400 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-lg"
          >
            {{ $t('instructors.joinTeam.viewCourses') }}
          </router-link>
          <router-link
            to="/startit"
            class="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-primary-500 hover:text-primary-500 transition-colors"
          >
            {{ $t('instructors.joinTeam.joinWebinar') }}
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Profile image error handling
const showFallback = ref(false)

const handleImageError = () => {
  showFallback.value = true
}
</script>
