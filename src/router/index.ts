import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    {
      path: '/play/:id',
      name: 'play',
      component: () => import('../views/PlayView.vue'),
    },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAdmin: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAdmin) return true
  const auth = useAuthStore()
  await auth.whenReady()
  if (!auth.isAdmin) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
