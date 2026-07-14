<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Device, Orientation } from '../data/devices'

const props = defineProps<{
  device: Device
  orientation: Orientation
  url: string | null
  /** Меняется извне (кнопка «Перезапустить») → пересоздаёт iframe. */
  reloadToken: number
}>()

const w = computed(() => (props.orientation === 'portrait' ? props.device.width : props.device.height))
const h = computed(() => (props.orientation === 'portrait' ? props.device.height : props.device.width))

// Толщина рамки телефона.
const BEZEL = 14

const stage = ref<HTMLElement | null>(null)
const scale = ref(1)

function recompute() {
  const el = stage.value
  if (!el) return
  const availW = el.clientWidth - 24
  const availH = el.clientHeight - 24
  const frameW = w.value + BEZEL * 2
  const frameH = h.value + BEZEL * 2
  scale.value = Math.min(1, availW / frameW, availH / frameH)
}

let ro: ResizeObserver | null = null
onMounted(() => {
  recompute()
  ro = new ResizeObserver(recompute)
  if (stage.value) ro.observe(stage.value)
})
onBeforeUnmount(() => ro?.disconnect())
watch([w, h], recompute)
</script>

<template>
  <div ref="stage" class="stage">
    <div
      class="phone"
      :style="{
        width: w + BEZEL * 2 + 'px',
        height: h + BEZEL * 2 + 'px',
        padding: BEZEL + 'px',
        transform: `scale(${scale})`,
      }"
    >
      <div class="screen" :style="{ width: w + 'px', height: h + 'px' }">
        <iframe
          v-if="url"
          :key="`${url}-${reloadToken}`"
          :src="url"
          class="frame"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups"
          referrerpolicy="no-referrer"
        />
        <div v-else class="placeholder">Выбери плейбл слева</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stage {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.phone {
  flex-shrink: 0;
  background: #000;
  border-radius: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  transform-origin: center center;
}
.screen {
  background: #fff;
  border-radius: 26px;
  overflow: hidden;
  position: relative;
}
.frame {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 14px;
}
</style>
