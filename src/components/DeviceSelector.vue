<script setup lang="ts">
import { devices, type Device, type Orientation } from '../data/devices'

defineProps<{
  device: Device
  orientation: Orientation
}>()

const emit = defineEmits<{
  'update:device': [device: Device]
  'update:orientation': [orientation: Orientation]
  reload: []
}>()

function onDeviceChange(e: Event) {
  const id = (e.target as HTMLSelectElement).value
  const found = devices.find((d) => d.id === id)
  if (found) emit('update:device', found)
}

function toggleOrientation(current: Orientation) {
  emit('update:orientation', current === 'portrait' ? 'landscape' : 'portrait')
}
</script>

<template>
  <div class="toolbar">
    <select :value="device.id" @change="onDeviceChange">
      <option v-for="d in devices" :key="d.id" :value="d.id">
        {{ d.name }} · {{ d.width }}×{{ d.height }}
      </option>
    </select>
    <button class="btn" title="Повернуть" @click="toggleOrientation(orientation)">
      {{ orientation === 'portrait' ? '⇅ Портрет' : '⇄ Ландшафт' }}
    </button>
    <button class="btn" title="Перезапустить плейбл" @click="emit('reload')">
      ↻ Перезапустить
    </button>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}
</style>
