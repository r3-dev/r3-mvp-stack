<script setup lang="ts">
import { useCounter } from '../composables/use-counter'
import { paths } from '../routes'

const counter = useCounter()
</script>

<template>
  <p class="text-red-600">{{ counter.count }}</p>
  <button @click="counter.increment">Increment</button>
  <router-link v-bind:to="paths.home">Home</router-link>
</template>
