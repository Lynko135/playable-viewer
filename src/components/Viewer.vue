<script setup lang="ts">
import { computed, ref } from 'vue'
import { playables } from '../data/playables'
import { defaultDevice, type Device, type Orientation } from '../data/devices'
import type { Playable } from '../types'
import PlayableList from './PlayableList.vue'
import PhoneFrame from './PhoneFrame.vue'
import DeviceSelector from './DeviceSelector.vue'

const items = playables

const selected = ref<Playable | null>(items[0] ?? null)
const device = ref<Device>(defaultDevice)
const orientation = ref<Orientation>('portrait')
const reloadToken = ref(0)

const selectedUrl = computed(() => selected.value?.html ?? null)

function select(item: Playable) {
  selected.value = item
  reloadToken.value++
}
</script>

<template>
  <!-- Десктоп: список слева + телефон справа -->
  <div class="split">
    <PlayableList
      class="pane-list"
      :items="items"
      :selected-id="selected?.id ?? null"
      @select="select"
    />
    <section class="pane-view">
      <div class="viewer-toolbar">
        <DeviceSelector
          v-model:device="device"
          v-model:orientation="orientation"
          @reload="reloadToken++"
        />
      </div>
      <PhoneFrame
        class="phone-area"
        :device="device"
        :orientation="orientation"
        :url="selectedUrl"
        :reload-token="reloadToken"
      />
    </section>
  </div>

  <!-- Мобильный: текстовый список, открытие плейбла в новой вкладке -->
  <div class="mobile">
    <h1 class="mobile-title">Плейблы</h1>
    <p v-if="!items.length" class="hint">Пока пусто</p>
    <ul v-else class="mobile-items">
      <li v-for="item in items" :key="item.id">
        <a class="mobile-item" :href="item.html" target="_blank" rel="noopener">
          <img class="mobile-icon" :src="item.icon" :alt="item.name" loading="lazy" />
          <span class="mobile-name">{{ item.name }}</span>
          <span class="mobile-arrow">↗</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.split {
  display: grid;
  grid-template-columns: 320px 1fr;
  height: 100%;
}
.pane-list {
  min-height: 0;
}
.pane-view {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.viewer-toolbar {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-panel);
}
.phone-area {
  flex: 1;
  min-height: 0;
  background: radial-gradient(circle at center, #14171e, #0d0f13);
}

.mobile {
  display: none;
  padding: 16px;
}
.mobile-title {
  font-size: 20px;
  margin: 4px 0 16px;
}
.mobile-items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.mobile-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
}
.mobile-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  object-fit: cover;
  flex-shrink: 0;
  background: var(--bg-elev);
}
.mobile-name {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
}
.mobile-arrow {
  color: var(--text-dim);
}
.hint {
  color: var(--text-dim);
}

@media (max-width: 720px) {
  .split {
    display: none;
  }
  .mobile {
    display: block;
  }
}
</style>
