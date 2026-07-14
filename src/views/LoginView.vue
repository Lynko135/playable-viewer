<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const busy = ref(false)

async function submit() {
  error.value = null
  busy.value = true
  try {
    await auth.login(email.value, password.value)
    const redirect = (route.query.redirect as string) || '/admin'
    router.push(redirect)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Не удалось войти'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="wrap">
    <form class="card" @submit.prevent="submit">
      <h1>Вход админа</h1>
      <label>
        Email
        <input v-model="email" type="email" autocomplete="username" required />
      </label>
      <label>
        Пароль
        <input v-model="password" type="password" autocomplete="current-password" required />
      </label>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn btn-primary" type="submit" :disabled="busy">
        {{ busy ? 'Вход…' : 'Войти' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.wrap {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.card {
  width: 100%;
  max-width: 340px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
h1 {
  margin: 0 0 4px;
  font-size: 20px;
}
label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--text-dim);
}
.error {
  color: var(--danger);
  font-size: 13px;
  margin: 0;
}
</style>
