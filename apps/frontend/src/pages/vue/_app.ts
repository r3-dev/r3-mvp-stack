import { routes } from '@r3-dev/vue/routes'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import type { App } from 'vue'

export default (app: App) => {
  const history = createWebHistory()
  const router = createRouter({ routes, history })
  app.use(router)

  const pinia = createPinia()
  app.use(pinia)
}
