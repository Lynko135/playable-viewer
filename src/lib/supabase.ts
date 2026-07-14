import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = Boolean(url && anonKey)

if (!isConfigured) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY не заданы. ' +
      'Скопируй .env.example в .env.local и подставь значения.',
  )
}

// Плейсхолдер-URL, если env не заданы: createClient требует валидный URL
// (иначе бросает "Invalid URL" и рушит всё приложение). С плейсхолдером
// интерфейс рендерится, а сетевые вызовы просто завершаются ошибкой.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key',
)

export const BUCKET = 'playables'

/** Публичный URL файла в бакете. */
export function publicUrl(storagePath: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl
}
