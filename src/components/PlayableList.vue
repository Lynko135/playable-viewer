<script setup lang="ts">
import type { Playable } from '../types'

defineProps<{
  items: Playable[]
  selectedId: number | null
}>()

const emit = defineEmits<{ select: [item: Playable] }>()
</script>

<template>
  <aside class="list">
    <div v-if="!items.length" class="hint">
      Empty. Add entries to <code>playables.json</code> and files to <code>public/playables/</code>.
    </div>
    <div v-else class="grid">
      <button
        v-for="item in items"
        :key="item.id"
        class="card"
        :class="{ active: item.id === selectedId }"
        @click="emit('select', item)"
      >
        <img class="icon" :src="item.icon" :alt="item.name" loading="lazy" draggable="false" />
        <span class="name">{{ item.name }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.list {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-panel);
  border-right: 1px solid var(--border);
  overflow: hidden;
}
.hint {
  padding: 16px;
  color: var(--text-dim);
  font-size: 14px;
  line-height: 1.5;
}
.hint code {
  background: var(--bg-elev);
  padding: 1px 5px;
  border-radius: 4px;
}
.grid {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  grid-auto-rows: min-content;
  gap: 16px;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: var(--radius);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.card:hover {
  background: var(--bg-elev);
}
.card.active {
  background: var(--accent-dim);
  border-color: var(--accent);
}
.icon {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 20px;
  object-fit: cover;
  background: var(--bg-elev);
  transition: transform 0.15s ease;
  -webkit-user-drag: none;
  user-select: none;
  -webkit-touch-callout: none;
}
.card:active .icon {
  transform: scale(0.9);
}
.name {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  overflow-wrap: anywhere;
}
</style>
