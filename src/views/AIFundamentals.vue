<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="pt-20 pb-16 lg:pt-28 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-400 to-primary-600"
    >
      <div class="max-w-7xl mx-auto">
        <div class="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div class="mb-12 lg:mb-0">
            <div class="mb-4">
              <span
                class="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full"
              >
                {{ $t('aiFundamentals.badge') }}
              </span>
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {{ $t('aiFundamentals.hero.title') }}
            </h1>
            <p class="text-xl text-primary-100 mb-8 leading-relaxed">
              {{ $t('aiFundamentals.hero.subtitle') }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                class="bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                {{ $t('aiFundamentals.hero.enrollButton') }}
              </button>
              <button
                class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-500 transition-colors"
              >
                {{ $t('aiFundamentals.hero.learnMoreButton') }}
              </button>
            </div>
          </div>
          <div class="relative">
            <div class="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white/20 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-white mb-1">8</div>
                  <div class="text-xs text-primary-100">{{ $t('aiFundamentals.stats.weeks') }}</div>
                </div>
                <div class="bg-white/20 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-white mb-1">24</div>
                  <div class="text-xs text-primary-100">
                    {{ $t('aiFundamentals.stats.lessons') }}
                  </div>
                </div>
                <div class="bg-white/20 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-white mb-1">5</div>
                  <div class="text-xs text-primary-100">
                    {{ $t('aiFundamentals.stats.projects') }}
                  </div>
                </div>
                <div class="bg-white/20 rounded-lg p-4 text-center">
                  <div class="text-2xl font-bold text-white mb-1">∞</div>
                  <div class="text-xs text-primary-100">
                    {{ $t('aiFundamentals.stats.access') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Course Overview -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('aiFundamentals.overview.title') }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ $t('aiFundamentals.overview.description') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white rounded-xl p-6 shadow-lg border-l-4 border-primary-400">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              {{ $t('aiFundamentals.features.foundation.title') }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ $t('aiFundamentals.features.foundation.description') }}
            </p>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-lg border-l-4 border-success-500">
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              {{ $t('aiFundamentals.features.practical.title') }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ $t('aiFundamentals.features.practical.description') }}
            </p>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              {{ $t('aiFundamentals.features.mentorship.title') }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ $t('aiFundamentals.features.mentorship.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Curriculum -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {{ $t('aiFundamentals.curriculum.title') }}
            </h2>
            <p class="text-xl text-gray-600">
              {{ $t('aiFundamentals.curriculum.subtitle') }}
            </p>
          </div>

          <div class="space-y-8">
            <!-- Module 1 -->
            <div class="bg-white rounded-xl p-8 shadow-lg">
              <div class="flex items-start space-x-4">
                <div
                  class="w-10 h-10 bg-primary-400 text-slate-900 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                >
                  1
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">
                    {{ $t('aiFundamentals.modules.module1.title') }}
                  </h3>
                  <p class="text-gray-600 mb-4">
                    {{ $t('aiFundamentals.modules.module1.description') }}
                  </p>
                  <ul class="space-y-2">
                    <li class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="text-sm text-gray-600">{{
                        $t('aiFundamentals.modules.module1.lesson1')
                      }}</span>
                    </li>
                    <li class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="text-sm text-gray-600">{{
                        $t('aiFundamentals.modules.module1.lesson2')
                      }}</span>
                    </li>
                    <li class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="text-sm text-gray-600">{{
                        $t('aiFundamentals.modules.module1.lesson3')
                      }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Module 2 -->
            <div class="bg-white rounded-xl p-8 shadow-lg">
              <div class="flex items-start space-x-4">
                <div
                  class="w-10 h-10 bg-success-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0"
                >
                  2
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">
                    {{ $t('aiFundamentals.modules.module2.title') }}
                  </h3>
                  <p class="text-gray-600 mb-4">
                    {{ $t('aiFundamentals.modules.module2.description') }}
                  </p>
                  <ul class="space-y-2">
                    <li class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="text-sm text-gray-600">{{
                        $t('aiFundamentals.modules.module2.lesson1')
                      }}</span>
                    </li>
                    <li class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="text-sm text-gray-600">{{
                        $t('aiFundamentals.modules.module2.lesson2')
                      }}</span>
                    </li>
                    <li class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="text-sm text-gray-600">{{
                        $t('aiFundamentals.modules.module2.lesson3')
                      }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Module 3 -->
            <div class="bg-white rounded-xl p-8 shadow-lg">
              <div class="flex items-start space-x-4">
                <div
                  class="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0"
                >
                  3
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">
                    {{ $t('aiFundamentals.modules.module3.title') }}
                  </h3>
                  <p class="text-gray-600 mb-4">
                    {{ $t('aiFundamentals.modules.module3.description') }}
                  </p>
                  <ul class="space-y-2">
                    <li class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="text-sm text-gray-600">{{
                        $t('aiFundamentals.modules.module3.lesson1')
                      }}</span>
                    </li>
                    <li class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="text-sm text-gray-600">{{
                        $t('aiFundamentals.modules.module3.lesson2')
                      }}</span>
                    </li>
                    <li class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="text-sm text-gray-600">{{
                        $t('aiFundamentals.modules.module3.lesson3')
                      }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Instructor Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {{ $t('aiFundamentals.instructor.title') }}
            </h2>
          </div>

          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="lg:grid lg:grid-cols-3 lg:gap-8 items-center">
              <div class="text-center lg:text-left">
                <div class="w-32 h-32 rounded-full mx-auto lg:mx-0 mb-4 overflow-hidden">
                  <img
                    src="/images/michal-wronski.jpg"
                    alt="Michał Wroński"
                    class="w-full h-full object-cover object-center"
                  />
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Michał Wroński</h3>
                <p class="text-primary-500 font-semibold">
                  {{ $t('aiFundamentals.instructor.role') }}
                </p>
              </div>
              <div class="lg:col-span-2 mt-6 lg:mt-0">
                <p class="text-gray-600 leading-relaxed mb-4">
                  {{ $t('aiFundamentals.instructor.bio') }}
                </p>
                <router-link
                  to="/instructors"
                  class="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium"
                >
                  {{ $t('aiFundamentals.instructor.learnMore') }}
                  <svg class="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enrollment CTA -->
    <section class="py-16 bg-gradient-to-br from-primary-400 to-primary-600">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          {{ $t('aiFundamentals.enrollment.title') }}
        </h2>
        <p class="text-xl text-primary-100 mb-8">
          {{ $t('aiFundamentals.enrollment.subtitle') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            class="bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-lg"
          >
            {{ $t('aiFundamentals.enrollment.enrollButton') }}
          </button>
          <router-link
            to="/startit"
            class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-500 transition-colors"
          >
            {{ $t('aiFundamentals.enrollment.webinarButton') }}
          </router-link>
        </div>
        <p class="text-sm text-primary-100 mt-6">
          {{ $t('aiFundamentals.enrollment.note') }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// AI Fundamentals course page component
</script>
