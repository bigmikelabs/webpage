<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="pt-20 pb-16 lg:pt-28 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
          {{ $t('about.hero.title') }}
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {{ $t('about.hero.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div class="mb-12 lg:mb-0">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {{ $t('about.mission.title') }}
            </h2>
            <p class="text-lg text-gray-600 mb-6 leading-relaxed">
              {{ $t('about.mission.description1') }}
            </p>
            <p class="text-lg text-gray-600 leading-relaxed">
              {{ $t('about.mission.description2') }}
            </p>
          </div>
          <div class="relative">
            <div class="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 shadow-xl">
              <div class="grid grid-cols-2 gap-6">
                <div class="text-center">
                  <div class="text-3xl font-bold text-primary-500 mb-2">100+</div>
                  <div class="text-sm text-gray-600">{{ $t('about.stats.students') }}</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-success-600 mb-2">95%</div>
                  <div class="text-sm text-gray-600">{{ $t('about.stats.satisfaction') }}</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-purple-600 mb-2">10+</div>
                  <div class="text-sm text-gray-600">{{ $t('about.stats.companies') }}</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-orange-600 mb-2">15+</div>
                  <div class="text-sm text-gray-600">{{ $t('about.stats.years') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('about.values.title') }}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ $t('about.values.subtitle') }}
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center"
          >
            <div
              class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg class="w-8 h-8 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ $t('about.values.quality.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('about.values.quality.description') }}
            </p>
          </div>

          <div
            class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center"
          >
            <div
              class="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg class="w-8 h-8 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ $t('about.values.community.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('about.values.community.description') }}
            </p>
          </div>

          <div
            class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center"
          >
            <div
              class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ $t('about.values.innovation.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('about.values.innovation.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Team Section -->
    <SpeakerProfile translation-prefix="about.team.expert" title-prefix="about.team" />

    <!-- Story Timeline Section -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('about.story.title') }}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ $t('about.story.subtitle') }}
          </p>
        </div>

        <!-- Timeline -->
        <div class="relative">
          <!-- Timeline line -->
          <div
            class="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-gradient-to-b from-primary-200 via-primary-300 to-primary-500"
          ></div>

          <!-- Timeline Events -->
          <div class="space-y-12">
            <!-- Event 1: Foundation -->
            <div class="relative flex items-center">
              <div class="flex-1 pr-8 text-right">
                <div
                  class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-400 hover:shadow-xl transition-shadow"
                >
                  <div class="text-sm font-semibold text-primary-500 mb-2">
                    {{ $t('about.timeline.event1.year') }}
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 mb-2">
                    {{ $t('about.timeline.event1.title') }}
                  </h3>
                  <p class="text-gray-600">{{ $t('about.timeline.event1.description') }}</p>
                </div>
              </div>
              <div
                class="relative z-10 w-4 h-4 bg-primary-400 rounded-full border-4 border-white shadow-lg"
              ></div>
              <div class="flex-1 pl-8"></div>
            </div>

            <!-- Event 2: First Students -->
            <a href="https://www.youtube.com/watch?v=-ffKVQzri-s" target="_blank">
              <div class="relative flex items-center">
                <div class="flex-1 pr-8"></div>
                <div
                  class="relative z-10 w-4 h-4 bg-success-500 rounded-full border-4 border-white shadow-lg"
                ></div>
                <div class="flex-1 pl-8">
                  <div
                    class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-success-500 hover:shadow-xl transition-shadow"
                  >
                    <div class="text-sm font-semibold text-success-600 mb-2">
                      {{ $t('about.timeline.event2.year') }}
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">
                      {{ $t('about.timeline.event2.title') }}
                    </h3>
                    <p class="text-gray-600">{{ $t('about.timeline.event2.description') }}</p>
                  </div>
                </div>
              </div>
            </a>

            <!-- Event 3: AI Focus -->
            <div class="relative flex items-center">
              <div class="flex-1 pr-8 text-right">
                <div
                  class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow"
                >
                  <div class="text-sm font-semibold text-purple-600 mb-2">
                    {{ $t('about.timeline.event3.year') }}
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 mb-2">
                    {{ $t('about.timeline.event3.title') }}
                  </h3>
                  <p class="text-gray-600">{{ $t('about.timeline.event3.description') }}</p>
                </div>
              </div>
              <div
                class="relative z-10 w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-lg"
              ></div>
              <div class="flex-1 pl-8"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-br from-primary-400 to-primary-600">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          {{ $t('about.cta.title') }}
        </h2>
        <p class="text-xl text-primary-100 mb-8">
          {{ $t('about.cta.subtitle') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/#courses"
            class="bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            {{ $t('about.cta.viewCourses') }}
          </router-link>
          <router-link
            to="/instructors"
            class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-500 transition-colors"
          >
            {{ $t('about.cta.meetInstructors') }}
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import SpeakerProfile from '@/components/SpeakerProfile.vue'
</script>
