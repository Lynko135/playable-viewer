<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function logout() {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <header class="header">
    <RouterLink to="/" class="brand">🎮 Playable Viewer</RouterLink>
    <nav class="nav">
      <template v-if="auth.isAdmin">
        <RouterLink to="/admin" class="btn">Админка</RouterLink>
        <button class="btn" @click="logout">Выйти</button>
      </template>
      <RouterLink v-else to="/login" class="btn btn-primary">Войти</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.header {
  height: var(--header-h);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-panel);
}
.brand {
  color: var(--text);
  font-weight: 600;
  font-size: 16px;
}
.nav {
  display: flex;
  gap: 10px;
}
</style>
