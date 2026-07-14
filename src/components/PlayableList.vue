<script setup lang="ts">
import type { Playable } from '../types'

defineProps<{
  items: Playable[]
  selectedId: string | null
  loading: boolean
}>()

const emit = defineEmits<{ select: [item: Playable] }>()

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>

<template>
  <aside class="list">
    <div class="list-head">Плейблы <span class="count">{{ items.length }}</span></div>
    <div v-if="loading" class="hint">Загрузка…</div>
    <div v-else-if="!items.length" class="hint">Пока пусто</div>
    <ul v-else class="items">
      <li
        v-for="item in items"
        :key="item.id"
        class="item"
        :class="{ active: item.id === selectedId }"
        @click="emit('select', item)"
      >
        <span class="name">{{ item.name }}</span>
        <span class="date">{{ fmtDate(item.created_at) }}</span>
      </li>
    </ul>
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
.list-head {
  padding: 16px;
  font-weight: 600;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
}
.count {
  color: var(--text-dim);
  font-weight: 400;
  font-size: 13px;
}
.hint {
  padding: 16px;
  color: var(--text-dim);
  font-size: 14px;
}
.items {
  list-style: none;
  margin: 0;
  padding: 8px;
  overflow-y: auto;
  flex: 1;
}
.item {
  padding: 10px 12px;
  border-radius: var(--radius);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.item:hover {
  background: var(--bg-elev);
}
.item.active {
  background: var(--accent-dim);
}
.name {
  font-size: 14px;
}
.date {
  font-size: 12px;
  color: var(--text-dim);
}
</style>
