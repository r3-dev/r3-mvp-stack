<script setup lang="ts">
import { onMounted } from 'vue'
import type { BaseAuthStore } from '@r3-dev/pocketbase'

import { usePocketbase } from './composables/use-pocketbase'

const pb = usePocketbase()
const props = defineProps<{
  url: string
  authStore: BaseAuthStore
}>()

onMounted(() => {
  pb.connect(props.url, props.authStore)

  if (import.meta.env.DEV) {
    console.log('Vue pocketbase', pb.pocketbase)
  }
})
</script>

<template>
  <router-view />
</template>
