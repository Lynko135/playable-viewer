import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const ready = ref(false)
  let initPromise: Promise<void> | null = null

  /** Запускается один раз при старте приложения (fire-and-forget). */
  function init() {
    if (initPromise) return initPromise
    initPromise = (async () => {
      try {
        const { data } = await supabase.auth.getSession()
        user.value = data.session?.user ?? null
      } catch (e) {
        console.warn('[auth] getSession failed', e)
      }
      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null
      })
      ready.value = true
    })()
    return initPromise
  }

  /** Дождаться завершения инициализации сессии (для guard роутера). */
  function whenReady() {
    return initPromise ?? init()
  }

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  const isAdmin = computed(() => user.value !== null)

  return { user, ready, isAdmin, init, whenReady, login, logout }
})
