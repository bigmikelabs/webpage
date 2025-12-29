import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import StartIT from '../views/StartIT.vue'
import About from '../views/About.vue'
import Instructors from '../views/Instructors.vue'
import AIFundamentals from '../views/AIFundamentals.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/enterit',
    name: 'StartIT',
    component: StartIT,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/instructors',
    name: 'Instructors',
    component: Instructors,
  }
  // {
  //   path: '/courses/ai-fundamentals',
  //   name: 'AIFundamentals',
  //   component: AIFundamentals,
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router
