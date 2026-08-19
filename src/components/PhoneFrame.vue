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

const emit = defineEmits<{ reload: [] }>()

const w = computed(() => (props.orientation === 'portrait' ? props.device.width : props.device.height))
const h = computed(() => (props.orientation === 'portrait' ? props.device.height : props.device.width))

// Толщина рамки телефона.
const BEZEL = 14
// Доля от максимального вписывающегося размера (превью занимает 80%).
const FILL = 0.8

const stage = ref<HTMLElement | null>(null)
const scale = ref(1)

function recompute() {
  const el = stage.value
  if (!el) return
  const availW = el.clientWidth - 24
  const availH = el.clientHeight - 24
  const frameW = w.value + BEZEL * 2
  const frameH = h.value + BEZEL * 2
  scale.value = Math.min(1, availW / frameW, availH / frameH) * FILL
}

let ro: ResizeObserver | null = null
onMounted(() => {
  recompute()
  ro = new ResizeObserver(recompute)
  if (stage.value) ro.observe(stage.value)
})
onBeforeUnmount(() => ro?.disconnect())
watch([w, h], recompute)

// --- Детекция редиректа в стор ---
// Уйти со всей страницы плейбл не может: в sandbox нет allow-top-navigation,
// а без allow-popups не откроется и новая вкладка. Но само-навигацию iframe
// (location = storeUrl) запретить нельзя — её можно только поймать.

const frame = ref<HTMLIFrameElement | null>(null)
const redirected = ref(false)
/** Номер текущего инстанса iframe: сигналы от старых игнорируем. */
let gen = 0
/** Сколько раз загрузился текущий инстанс (>1 → фрейм куда-то ушёл). */
let loads = 0

// Смена плейбла или рестарт — сбрасываем состояние.
watch(
  () => [props.url, props.reloadToken],
  () => {
    gen++
    loads = 0
    redirected.value = false
  },
)

function markRedirect(atGen: number) {
  if (atGen === gen) redirected.value = true
}

function onLoad() {
  const myGen = gen
  loads++
  // Повторный load = фрейм ушёл на другую страницу (CTA сработал).
  if (loads > 1) {
    redirected.value = true
    return
  }

  const win = frame.value?.contentWindow
  if (!win) return

  try {
    // window.open (в т.ч. из MRAID-обёрток) — новую вкладку sandbox и так
    // не даст, но так мы узнаём о попытке и показываем сообщение.
    const anyWin = win as unknown as Record<string, unknown>
    anyWin.open = () => {
      markRedirect(myGen)
      return null
    }

    const mraid = anyWin.mraid as { open?: (url: string) => void } | undefined
    if (mraid && typeof mraid.open === 'function') {
      mraid.open = () => markRedirect(myGen)
    }

    // location = ... : ловим момент до ухода страницы.
    win.addEventListener('beforeunload', () => markRedirect(myGen))
    win.addEventListener('pagehide', () => markRedirect(myGen))

    // Клик по ссылке в новую вкладку / на внешний origin.
    win.document.addEventListener(
      'click',
      (e) => {
        const el = e.target as Element | null
        const a = el?.closest?.('a[href]') as HTMLAnchorElement | null
        if (!a) return
        const external = a.target === '_blank' || a.origin !== win.location.origin
        if (external) markRedirect(myGen)
      },
      true,
    )
  } catch {
    // Нет доступа внутрь фрейма — остаётся детекция по повторному load.
  }
}
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
          ref="frame"
          :src="url"
          class="frame"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          referrerpolicy="no-referrer"
          @load="onLoad"
        />
        <div v-else class="placeholder">Select a playable on the left</div>

        <div v-if="url && redirected" class="redirect">
          <div class="redirect-icon">✓</div>
          <div class="redirect-title">Redirect successful</div>
          <div class="redirect-sub">The playable opened the store link</div>
          <button class="redirect-btn" @click="emit('reload')">
            <span class="redirect-btn-icon">↻</span> Restart
          </button>
        </div>
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

.redirect {
  position: absolute;
  inset: 0;
  background: #14171e;
  color: #e6e8ec;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px;
  text-align: center;
}
.redirect-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #1f7a4d;
  color: #fff;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}
.redirect-title {
  font-size: 18px;
  font-weight: 600;
}
.redirect-sub {
  font-size: 13px;
  color: #9aa1ac;
  margin-bottom: 8px;
}
.redirect-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #2a2f3a;
  background: #1f232c;
  color: #e6e8ec;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.redirect-btn:hover {
  border-color: #4f8cff;
}
.redirect-btn-icon {
  font-size: 18px;
  line-height: 1;
}
</style>
