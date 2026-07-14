<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { STORAGE_LIMIT_BYTES, usePlayablesStore } from '../stores/playables'
import type { Playable } from '../types'

const store = usePlayablesStore()

const name = ref('')
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const busy = ref(false)
const error = ref<string | null>(null)

function onFile(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0] ?? null
  file.value = f
  if (f && !name.value) name.value = f.name.replace(/\.html?$/i, '')
}

async function submit() {
  if (!file.value || !name.value.trim()) return
  error.value = null
  busy.value = true
  try {
    await store.add(name.value.trim(), file.value)
    name.value = ''
    file.value = null
    if (fileInput.value) fileInput.value.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка загрузки'
  } finally {
    busy.value = false
  }
}

async function remove(item: Playable) {
  if (!confirm(`Удалить «${item.name}»?`)) return
  try {
    await store.remove(item)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка удаления'
  }
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} КБ`
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`
}

const usedPct = computed(() => (store.usedFraction * 100).toFixed(1))
const limitLabel = computed(() => fmtSize(STORAGE_LIMIT_BYTES))

onMounted(() => {
  if (!store.items.length) store.fetchAll()
})
</script>

<template>
  <div class="admin">
    <h1>Админ-панель</h1>

    <!-- Счётчик места -->
    <section class="card">
      <div class="usage-head">
        <span>Занято хранилища</span>
        <span class="usage-nums">{{ fmtSize(store.totalBytes) }} / {{ limitLabel }} ({{ usedPct }}%)</span>
      </div>
      <div class="bar">
        <div
          class="bar-fill"
          :class="{ warn: store.usedFraction > 0.8 }"
          :style="{ width: usedPct + '%' }"
        />
      </div>
    </section>

    <!-- Форма загрузки -->
    <section class="card">
      <h2>Добавить плейбл</h2>
      <form class="form" @submit.prevent="submit">
        <label>
          Имя
          <input v-model="name" type="text" placeholder="Название плейбла" required />
        </label>
        <label>
          HTML-файл
          <input ref="fileInput" type="file" accept=".html,text/html" @change="onFile" required />
        </label>
        <button class="btn btn-primary" type="submit" :disabled="busy || !file || !name.trim()">
          {{ busy ? 'Загрузка…' : 'Загрузить' }}
        </button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </section>

    <!-- Список -->
    <section class="card">
      <h2>Все плейблы ({{ store.items.length }})</h2>
      <p v-if="store.loading" class="hint">Загрузка…</p>
      <p v-else-if="!store.items.length" class="hint">Пока пусто</p>
      <table v-else class="tbl">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Размер</th>
            <th>Дата</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in store.items" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ fmtSize(item.file_size) }}</td>
            <td>{{ new Date(item.created_at).toLocaleDateString('ru-RU') }}</td>
            <td class="right">
              <button class="btn btn-danger" @click="remove(item)">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.admin {
  max-width: 820px;
  margin: 0 auto;
  padding: 24px 20px 48px;
  overflow-y: auto;
  height: 100%;
}
h1 {
  font-size: 22px;
  margin: 0 0 20px;
}
h2 {
  font-size: 16px;
  margin: 0 0 14px;
}
.card {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  margin-bottom: 18px;
}
.usage-head {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 10px;
}
.usage-nums {
  color: var(--text-dim);
}
.bar {
  height: 10px;
  background: var(--bg-elev);
  border-radius: 6px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.3s;
}
.bar-fill.warn {
  background: var(--danger);
}
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 420px;
}
label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--text-dim);
}
.error {
  color: var(--danger);
  font-size: 13px;
}
.hint {
  color: var(--text-dim);
}
.tbl {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.tbl th,
.tbl td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid var(--border);
}
.tbl th {
  color: var(--text-dim);
  font-weight: 500;
  font-size: 12px;
}
.right {
  text-align: right;
}
</style>
