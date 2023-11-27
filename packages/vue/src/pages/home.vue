<script setup lang="ts">
import { useCounter } from '../composables/use-counter'
import { paths } from '../routes'

const counter = useCounter()
</script>

<template>
  <h1>Home</h1>
  <p>Counter: {{ counter.count }}</p>
  <router-link v-bind:to="paths.counter">Counter</router-link>
</template>
