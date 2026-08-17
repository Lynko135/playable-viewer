<script setup lang="ts">
import { computed, ref } from 'vue'
import { playables } from '../data/playables'
import { defaultDevice, type Device, type Orientation } from '../data/devices'
import type { Playable } from '../types'
import PlayableList from './PlayableList.vue'
import PhoneFrame from './PhoneFrame.vue'
import DeviceSelector from './DeviceSelector.vue'

const items = playables

const selected = ref<Playable | null>(null)
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

  <!-- Мобильный: грид карточек, открытие плейбла в новой вкладке -->
  <div class="mobile">
    <p v-if="!items.length" class="hint">Nothing here yet</p>
    <div v-else class="mobile-grid">
      <a
        v-for="item in items"
        :key="item.id"
        class="mobile-item"
        :href="item.html"
        target="_blank"
        rel="noopener"
      >
        <img class="mobile-icon" :src="item.icon" :alt="item.name" loading="lazy" draggable="false" />
        <span class="mobile-name">{{ item.name }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* Строка ограничена высотой контейнера и не растёт под layout-бокс телефона
     (transform: scale уменьшает его лишь визуально), иначе появляется скролл. */
  grid-template-rows: minmax(0, 1fr);
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
  /* Отступ сверху с учётом «чёлки» / Dynamic Island на устройствах с вырезом. */
  padding-top: calc(16px + env(safe-area-inset-top));
}
.mobile-grid {
  display: grid;
  /* Адаптивные колонки: ~3 в портрете, больше в альбомном режиме. */
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 14px;
}
.mobile-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text);
}
.mobile-icon {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 18px;
  object-fit: cover;
  background: var(--bg-elev);
  transition: transform 0.15s ease;
  -webkit-user-drag: none;
  user-select: none;
  -webkit-touch-callout: none;
}
.mobile-item:active .mobile-icon {
  transform: scale(0.9);
}
.mobile-name {
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  overflow-wrap: anywhere;
}
.hint {
  color: var(--text-dim);
}

/* Мобильный вид: узкий экран ИЛИ тач-устройство (телефон в любой ориентации,
   включая альбомную, где ширина > 720px). */
@media (max-width: 720px), (hover: none) and (pointer: coarse) {
  .split {
    display: none;
  }
  .mobile {
    display: block;
  }
}
</style>
