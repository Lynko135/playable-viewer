<script setup lang="ts">
import Viewer from './components/Viewer.vue'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <span class="brand">🎮 Playable Viewer</span>
    </header>
    <main class="app-main">
      <Viewer />
    </main>
  </div>
</template>

<style scoped>
.app {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.app-header {
  height: var(--header-h);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-panel);
}
.brand {
  font-weight: 700;
  font-size: 17px;
}
.app-main {
  flex: 1;
  min-height: 0;
}
</style>
