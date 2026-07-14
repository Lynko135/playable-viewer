<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import AppHeader from './components/AppHeader.vue'
import { isConfigured } from './lib/supabase'

const route = useRoute()
// На странице полноэкранного проигрывания шапку не показываем.
const showHeader = computed(() => route.name !== 'play')
</script>

<template>
  <div class="app">
    <div v-if="!isConfigured" class="config-warn">
      ⚠️ Supabase не настроен: задай <code>VITE_SUPABASE_URL</code> и
      <code>VITE_SUPABASE_ANON_KEY</code> (см. README).
    </div>
    <AppHeader v-if="showHeader" />
    <main class="app-main" :class="{ 'no-header': !showHeader }">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.app-main {
  flex: 1;
  min-height: 0;
}
.config-warn {
  background: #4a2e00;
  color: #ffd78a;
  font-size: 13px;
  padding: 8px 16px;
  text-align: center;
  flex-shrink: 0;
}
.config-warn code {
  background: rgba(0, 0, 0, 0.3);
  padding: 1px 5px;
  border-radius: 4px;
}
</style>
