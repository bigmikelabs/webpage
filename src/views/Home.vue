<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="pt-20 pb-16 lg:pt-28 lg:pb-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div class="mb-12 lg:mb-0">
            <h1
              class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-slide-up"
            >
              {{ $t('hero.title') }}
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"
              >
                {{ $t('hero.titleHighlight') }}
              </span>
            </h1>
            <p class="text-xl text-gray-600 mb-8 leading-relaxed animate-slide-up">
              {{ $t('hero.subtitle') }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 animate-slide-up">
              <button
                @click="$router.push('/startit')"
                class="bg-primary-400 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {{ $t('hero.startLearning') }}
              </button>
              <button
                @click="scrollToElement('courses')"
                class="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-primary-500 hover:text-primary-500 transition-colors"
              >
                {{ $t('hero.viewCourses') }}
              </button>
            </div>
            <div class="mt-8 flex items-center space-x-6 text-sm text-gray-500">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ $t('hero.instructors') }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ $t('hero.jobReady') }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ $t('hero.satisfaction') }}</span>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="relative z-10 animate-float">
              <div
                class="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 shadow-2xl"
              >
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white rounded-lg p-4 shadow-md">
                    <div
                      class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mb-3"
                    >
                      <svg class="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1">
                      {{ $t('courseCards.aiBasics') }}
                    </h3>
                    <p class="text-sm text-gray-600">{{ $t('courseCards.aiDescription') }}</p>
                  </div>
                  <div class="bg-white rounded-lg p-4 shadow-md">
                    <div
                      class="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center mb-3"
                    >
                      <svg class="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                        />
                      </svg>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1">
                      {{ $t('courseCards.programming') }}
                    </h3>
                    <p class="text-sm text-gray-600">
                      {{ $t('courseCards.programmingDescription') }}
                    </p>
                  </div>
                  <div class="bg-white rounded-lg p-4 shadow-md">
                    <div
                      class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-3"
                    >
                      <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1">{{ $t('courseCards.os') }}</h3>
                    <p class="text-sm text-gray-600">{{ $t('courseCards.osDescription') }}</p>
                  </div>
                  <div class="bg-white rounded-lg p-4 shadow-md">
                    <div
                      class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-3"
                    >
                      <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-1">
                      {{ $t('courseCards.itSkills') }}
                    </h3>
                    <p class="text-sm text-gray-600">{{ $t('courseCards.itDescription') }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="absolute -bottom-4 -right-4 w-72 h-72 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-20 animate-pulse"
            ></div>
            <div
              class="absolute -top-4 -left-4 w-48 h-48 bg-gradient-to-br from-success-200 to-success-300 rounded-full opacity-20 animate-pulse"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="courses" class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('features.title') }}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ $t('features.subtitle') }}
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ $t('features.beginnerFriendly.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('features.beginnerFriendly.description') }}
            </p>
          </div>

          <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ $t('features.handsOn.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('features.handsOn.description') }}
            </p>
          </div>

          <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              {{ $t('features.expertSupport.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('features.expertSupport.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Courses Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('courses.title') }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ $t('courses.subtitle') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- <router-link
            to="/courses/ai-fundamentals"
            class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group block"
          > 
            <div
              class="h-48 bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center"
            >
              <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                {{ $t('courses.aiFundamentals.title') }}
              </h3>
              <p class="text-gray-600 mb-4">{{ $t('courses.aiFundamentals.description') }}</p>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-primary-500"></span>
                <span class="text-sm text-gray-500">{{
                  $t('courses.aiFundamentals.duration')
                }}</span>
              </div>
            </div>
          </router-link> -->

          <div
            class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group relative"
          >
            <!-- Preparation Badge -->
            <div class="absolute top-4 right-4 z-10">
              <span
                class="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                {{ $t('courses.status.inPreparation') }}
              </span>
            </div>
            <div
              class="h-48 bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center relative"
            >
              <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <!-- Overlay for preparation status -->
              <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                {{ $t('courses.aiFundamentals.title') }}
              </h3>
              <p class="text-gray-600 mb-4">{{ $t('courses.aiFundamentals.description') }}</p>
              <div class="mb-4">
                <p class="text-sm text-orange-600 font-medium">
                  {{ $t('courses.status.comingSoon') }}
                </p>
              </div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-2xl font-bold text-gray-400">{{ $t('courses.status.tba') }}</span>
                <span class="text-sm text-gray-500">{{
                  $t('courses.aiFundamentals.duration')
                }}</span>
              </div>
              <button
                class="w-full bg-primary-400 text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-primary-500 transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                  />
                </svg>
                {{ $t('courses.status.notifyButton') }}
              </button>
            </div>
          </div>

          <div
            class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group relative"
          >
            <!-- Preparation Badge -->
            <div class="absolute top-4 right-4 z-10">
              <span
                class="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                {{ $t('courses.status.inPreparation') }}
              </span>
            </div>
            <div
              class="h-48 bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center relative"
            >
              <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <!-- Overlay for preparation status -->
              <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                {{ $t('courses.codingBasics.title') }}
              </h3>
              <p class="text-gray-600 mb-4">{{ $t('courses.codingBasics.description') }}</p>
              <div class="mb-4">
                <p class="text-sm text-orange-600 font-medium">
                  {{ $t('courses.status.comingSoon') }}
                </p>
              </div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-2xl font-bold text-gray-400">{{ $t('courses.status.tba') }}</span>
                <span class="text-sm text-gray-500">{{ $t('courses.codingBasics.duration') }}</span>
              </div>
              <button
                class="w-full bg-primary-400 text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-primary-500 transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                  />
                </svg>
                {{ $t('courses.status.notifyButton') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Prelectures Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('prelectures.title') }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ $t('prelectures.subtitle') }}
          </p>
        </div>

        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(video, index) in videos"
              :key="index"
              class="flex flex-col gap-4"
            >
              <div class="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg group">
                <iframe
                  width="100%"
                  height="100%"
                  :src="getEmbedUrl(video.videoLink)"
                  :title="video.videoTitle"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  class="border-0"
                ></iframe>
                <a
                  :href="video.videoLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="absolute bottom-4 right-4 flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-slate-900 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="h-5 w-5"
                  >
                    <path
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    />
                  </svg>
                  <span>Watch on YouTube</span>
                </a>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ video.videoTitle }}
                </h3>
                <p class="mt-1 text-sm text-gray-600">
                  {{ video.videoDescription }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import en from '../locales/en.json'
import pl from '../locales/pl.json'

// Home page content - extracted from main App.vue

interface Video {
  videoTitle: string
  videoDescription: string
  videoLink: string
}

const { t, locale } = useI18n()

const videos = computed<Video[]>(() => {
  const currentLocale = locale.value
  const messages = currentLocale === 'pl' ? pl : en
  const videoArray = (messages as any).prelectures?.movies
  return Array.isArray(videoArray) ? videoArray : []
})

const scrollToElement = (elementID: string) => {
  const featuresSection = document.getElementById(elementID)
  if (featuresSection) {
    featuresSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

const getEmbedUrl = (videoLink: string): string => {
  // Extract video ID from YouTube URL
  const videoIdMatch = videoLink.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  const videoId = videoIdMatch ? videoIdMatch[1] : ''
  return `https://www.youtube.com/embed/${videoId}`
}
</script>
