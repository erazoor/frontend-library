import { createRouter, createWebHistory } from 'vue-router'
import { getEffectRoutes } from '@/utils/effects-registry'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue'),
    },
    ...getEffectRoutes(),
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})
