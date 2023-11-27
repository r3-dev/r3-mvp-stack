import Pocketbase from '@r3-dev/pocketbase'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BaseAuthStore } from '@r3-dev/pocketbase'
import type { TypedPocketBase } from '@r3-dev/pocketbase/types'

export const usePocketbase = defineStore('pocketbase', () => {
  const pocketbase = ref<TypedPocketBase | null>(null)

  function connect(url: string, authStore: BaseAuthStore): void {
    pocketbase.value = new Pocketbase(url, authStore) as TypedPocketBase
  }

  return {
    pocketbase,
    connect
  }
})
