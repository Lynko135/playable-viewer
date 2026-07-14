import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BUCKET, supabase } from '../lib/supabase'
import type { Playable } from '../types'

/** Лимит бесплатного Storage в Supabase (1 ГБ). */
export const STORAGE_LIMIT_BYTES = 1024 * 1024 * 1024

export const usePlayablesStore = defineStore('playables', () => {
  const items = ref<Playable[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('playables')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) error.value = err.message
    else items.value = data as Playable[]
    loading.value = false
  }

  /** Загрузка нового плейбла: файл в Storage + запись в таблицу. */
  async function add(name: string, file: File) {
    const id = crypto.randomUUID()
    const storagePath = `${id}.html`

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, {
        contentType: 'text/html',
        upsert: false,
      })
    if (uploadErr) throw uploadErr

    const { data, error: insertErr } = await supabase
      .from('playables')
      .insert({ id, name, storage_path: storagePath, file_size: file.size })
      .select()
      .single()

    if (insertErr) {
      // откат: убираем загруженный файл, чтобы не копить мусор
      await supabase.storage.from(BUCKET).remove([storagePath])
      throw insertErr
    }

    items.value.unshift(data as Playable)
  }

  async function remove(item: Playable) {
    const { error: delErr } = await supabase.from('playables').delete().eq('id', item.id)
    if (delErr) throw delErr
    await supabase.storage.from(BUCKET).remove([item.storage_path])
    items.value = items.value.filter((p) => p.id !== item.id)
  }

  function getById(id: string) {
    return items.value.find((p) => p.id === id) ?? null
  }

  const totalBytes = computed(() => items.value.reduce((sum, p) => sum + (p.file_size || 0), 0))
  const usedFraction = computed(() => Math.min(1, totalBytes.value / STORAGE_LIMIT_BYTES))

  return {
    items,
    loading,
    error,
    fetchAll,
    add,
    remove,
    getById,
    totalBytes,
    usedFraction,
  }
})
