<script setup lang="ts">
import { paths } from '../routes';
import { useCounter } from '../composables/use-counter'
const counter = useCounter()
</script>

<template>
  <p class="text-red-600">{{ counter.count }}</p>
  <button @click="counter.increment">Increment</button>
  <router-link v-bind:to="paths.home">Home</router-link>
</template>
