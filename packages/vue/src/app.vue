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
  console.log(pb.pocketbase?.authStore)
})
</script>

<template>
  <router-view />
</template>
