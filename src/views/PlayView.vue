<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayablesStore } from '../stores/playables'
import { publicUrl } from '../lib/supabase'
import type { Playable } from '../types'

const route = useRoute()
const store = usePlayablesStore()
const id = route.params.id as string

const item = ref<Playable | null>(null)
const notFound = ref(false)

const url = computed(() => (item.value ? publicUrl(item.value.storage_path) : null))

onMounted(async () => {
  if (!store.items.length) await store.fetchAll()
  const found = store.getById(id)
  if (found) item.value = found
  else notFound.value = true
})
</script>

<template>
  <div class="play">
    <iframe
      v-if="url"
      :src="url"
      class="frame"
      sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups"
      referrerpolicy="no-referrer"
    />
    <div v-else-if="notFound" class="msg">Плейбл не найден. <RouterLink to="/">На главную</RouterLink></div>
    <div v-else class="msg">Загрузка…</div>
  </div>
</template>

<style scoped>
.play {
  position: fixed;
  inset: 0;
  background: #000;
}
.frame {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
.msg {
  color: #fff;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
