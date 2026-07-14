<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { usePlayablesStore } from '../stores/playables'
import { publicUrl } from '../lib/supabase'
import { defaultDevice, type Device, type Orientation } from '../data/devices'
import type { Playable } from '../types'
import PlayableList from '../components/PlayableList.vue'
import PhoneFrame from '../components/PhoneFrame.vue'
import DeviceSelector from '../components/DeviceSelector.vue'

const store = usePlayablesStore()

const selected = ref<Playable | null>(null)
const device = ref<Device>(defaultDevice)
const orientation = ref<Orientation>('portrait')
const reloadToken = ref(0)

const selectedUrl = computed(() => (selected.value ? publicUrl(selected.value.storage_path) : null))

function select(item: Playable) {
  selected.value = item
  reloadToken.value++
}

onMounted(async () => {
  if (!store.items.length) await store.fetchAll()
})
</script>

<template>
  <!-- Десктоп: список слева + телефон справа -->
  <div class="split">
    <PlayableList
      class="pane-list"
      :items="store.items"
      :selected-id="selected?.id ?? null"
      :loading="store.loading"
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

  <!-- Мобильный: только текстовый список, открытие на новой странице -->
  <div class="mobile">
    <h1 class="mobile-title">Плейблы</h1>
    <p v-if="store.loading" class="hint">Загрузка…</p>
    <p v-else-if="!store.items.length" class="hint">Пока пусто</p>
    <ul v-else class="mobile-items">
      <li v-for="item in store.items" :key="item.id">
        <RouterLink :to="{ name: 'play', params: { id: item.id } }" class="mobile-item">
          {{ item.name }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.split {
  display: grid;
  grid-template-columns: 300px 1fr;
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
  gap: 8px;
}
.mobile-item {
  display: block;
  padding: 14px 16px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  font-size: 16px;
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
