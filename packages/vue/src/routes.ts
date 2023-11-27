import type { RouteRecordRaw } from 'vue-router'

export const basePath = '/vue'

export const paths = {
  home: basePath,
  counter: basePath + '/counter'
}

export const routes: RouteRecordRaw[] = [
  {
    path: paths.home,
    component: () => import('./pages/home.vue')
  },
  {
    path: paths.counter,
    component: () => import('./pages/counter.vue')
  }
]
