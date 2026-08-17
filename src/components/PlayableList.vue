<script setup lang="ts">
import type { Playable } from '../types'

defineProps<{
  items: Playable[]
  selectedId: string | null
}>()

const emit = defineEmits<{ select: [item: Playable] }>()
</script>

<template>
  <aside class="list">
    <div class="list-head">Плейблы <span class="count">{{ items.length }}</span></div>
    <div v-if="!items.length" class="hint">
      Пусто. Добавь записи в <code>playables.json</code> и файлы в <code>public/playables/</code>.
    </div>
    <ul v-else class="items">
      <li
        v-for="item in items"
        :key="item.id"
        class="item"
        :class="{ active: item.id === selectedId }"
        @click="emit('select', item)"
      >
        <img class="icon" :src="item.icon" :alt="item.name" loading="lazy" />
        <span class="name">{{ item.name }}</span>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.list {
  --icon-size: 88px;
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
  line-height: 1.5;
}
.hint code {
  background: var(--bg-elev);
  padding: 1px 5px;
  border-radius: 4px;
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
  align-items: center;
  gap: 14px;
}
.item:hover {
  background: var(--bg-elev);
}
.item.active {
  background: var(--accent-dim);
}
.icon {
  width: var(--icon-size);
  height: var(--icon-size);
  border-radius: 18px;
  object-fit: cover;
  flex-shrink: 0;
  background: var(--bg-elev);
}
.name {
  font-size: 15px;
  font-weight: 500;
  overflow-wrap: anywhere;
}
</style>
