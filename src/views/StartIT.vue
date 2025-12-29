<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="pt-20 pb-16 lg:pt-28 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-primary-200"
    >
      <div class="max-w-7xl mx-auto text-center">
        <div class="mb-8">
          <span
            class="inline-block bg-primary-200 text-slate-900 text-sm font-semibold px-4 py-2 rounded-full mb-4"
          >
            🎯 {{ $t('startit.badge') }}
          </span>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
            {{ $t('startit.title') }}
          </h1>
          <p class="text-xl text-slate-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            {{ $t('startit.subtitle') }}
          </p>
        </div>

        <!-- Webinar Info Card -->
        <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto mb-8">
          <!-- Countdown Timer -->
          <div class="text-center mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              {{ $t('startit.countdown.title') }}
            </h3>
            <div class="grid grid-cols-4 gap-4 max-w-md mx-auto">
              <div
                class="bg-gradient-to-br from-primary-300 to-primary-500 rounded-lg p-4 text-slate-900"
              >
                <div class="text-2xl font-bold">{{ timeLeft.days }}</div>
                <div class="text-xs uppercase tracking-wide">
                  {{ $t('startit.countdown.days') }}
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-success-500 to-success-600 rounded-lg p-4 text-white"
              >
                <div class="text-2xl font-bold">{{ timeLeft.hours }}</div>
                <div class="text-xs uppercase tracking-wide">
                  {{ $t('startit.countdown.hours') }}
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white"
              >
                <div class="text-2xl font-bold">{{ timeLeft.minutes }}</div>
                <div class="text-xs uppercase tracking-wide">
                  {{ $t('startit.countdown.minutes') }}
                </div>
              </div>
              <div
                class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white"
              >
                <div class="text-2xl font-bold">{{ timeLeft.seconds }}</div>
                <div class="text-xs uppercase tracking-wide">
                  {{ $t('startit.countdown.seconds') }}
                </div>
              </div>
            </div>
            <div class="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-primary-400">
              <h4 class="text-lg font-semibold text-gray-900 mb-1">
                {{ $t('startit.date.title') }}
              </h4>
              <p class="text-xl font-bold text-primary-500">{{ webinarDate }}</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <!-- Duration Card -->
            <div class="p-4 bg-gray-50 rounded-lg border-l-4 border-success-500">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <svg class="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-1">
                    {{ $t('startit.duration.title') }}
                  </h4>
                  <p class="text-xl font-bold text-success-600">
                    {{ $t('startit.duration.value') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Format Card -->
            <div class="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900 mb-1">
                    {{ $t('startit.format.title') }}
                  </h4>
                  <p class="text-xl font-bold text-purple-600">{{ $t('startit.format.value') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Registration CTA -->
          <div class="text-center">
            <button
              @click="scrollToSubscription"
              class="bg-primary-400 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
            >
              {{ $t('startit.registerButton') }}
            </button>
            <p class="text-sm text-gray-500 mt-3">{{ $t('startit.freeEvent') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- What You'll Learn Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('startit.whatYoullLearn.title') }}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ $t('startit.whatYoullLearn.subtitle') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Job Search Module -->
          <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <IconGear class="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">
                  {{ $t('startit.modules.jobSearch.title') }}
                </h3>
                <ul class="space-y-2 text-gray-600">
                  <li class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ $t('startit.modules.jobSearch.point1') }}</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ $t('startit.modules.jobSearch.point2') }}</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ $t('startit.modules.jobSearch.point3') }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Recruites Module -->
          <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <IconPerson class="w-6 h-6 text-success-600" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">
                  {{ $t('startit.modules.recruiters.title') }}
                </h3>
                <ul class="space-y-2 text-gray-600">
                  <li class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ $t('startit.modules.recruiters.point1') }}</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ $t('startit.modules.recruiters.point2') }}</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ $t('startit.modules.recruiters.point3') }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Tooling Module -->
          <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <IconTooling class="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">
                  {{ $t('startit.modules.tooling.title') }}
                </h3>
                <ul class="space-y-2 text-gray-600">
                  <li class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ $t('startit.modules.tooling.point1') }}</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ $t('startit.modules.tooling.point2') }}</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ $t('startit.modules.tooling.point3') }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- AI Learning Module -->
          <div class="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <IconAI class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">
                  {{ $t('startit.modules.aiLearning.title') }}
                </h3>
                <ul class="space-y-2 text-gray-600">
                  <li class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ $t('startit.modules.aiLearning.point1') }}</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ $t('startit.modules.aiLearning.point2') }}</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>{{ $t('startit.modules.aiLearning.point3') }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Speaker Section -->
    <SpeakerProfile translation-prefix="about.team.expert" title-prefix="about.team" />

    <!-- Final CTA Section -->
    <section class="py-16 bg-gradient-to-br from-primary-50 to-primary-200">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          {{ $t('startit.finalCta.title') }}
        </h2>
        <p class="text-xl text-slate-700 mb-8">
          {{ $t('startit.finalCta.subtitle') }}
        </p>
        <!-- MailerLite Subscription Button -->
        <div class="max-w-md mx-auto" id="subscription-form">
          <button
            class="ml-onclick-form bg-white text-primary-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-lg w-full"
            @click="goToMailerPage"
          >
            {{ $t('startit.finalCta.subscribeButton') }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import config from '../config'
import SpeakerProfile from '@/components/SpeakerProfile.vue'
import IconTooling from '@/components/icons/IconTooling.vue'
import IconPerson from '@/components/icons/IconPerson.vue'
import IconGear from '@/components/icons/IconGear.vue'
import IconAI from '@/components/icons/IconAI.vue'

const { t, locale } = useI18n()

const getWebinarTargetDate = (): Date => {
  const configDate = new Date(config.webinar.targetDate)
  if (!isNaN(configDate.getTime())) {
    return configDate
  }
  return new Date()
}

const webinarTargetDate = getWebinarTargetDate()

const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

let countdownInterval: number | null = null

const updateCountdown = () => {
  const now = new Date().getTime()
  const target = webinarTargetDate.getTime()
  const difference = target - now

  if (difference > 0) {
    timeLeft.value = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    }
  } else {
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    if (countdownInterval) {
      clearInterval(countdownInterval)
    }
  }
}

const webinarDate = computed(() => {
  const date = webinarTargetDate.toLocaleDateString(locale.value === 'pl' ? 'pl-PL' : 'en-US', {
    weekday: 'short',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  return date
})

const scrollToSubscription = () => {
  const subscriptionForm = document.getElementById('subscription-form')
  if (subscriptionForm) {
    subscriptionForm.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToMailerPage = () => {
  const currentLang = locale.value
  const mailerUrl = `/mailer.html?lang=${currentLang}`
  window.location.href = mailerUrl
}

onMounted(() => {
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

