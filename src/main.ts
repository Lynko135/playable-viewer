import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './style.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Запускаем инициализацию сессии в фоне; guard роутера дождётся её сам.
// UI монтируется сразу и не зависит от доступности Supabase.
useAuthStore(pinia).init()

app.mount('#app')
