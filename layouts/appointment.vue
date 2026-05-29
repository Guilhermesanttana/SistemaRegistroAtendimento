<template>
  <div class="min-h-screen flex flex-col transition-colors duration-500" :class="bgClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
const eventsStore = useEventsStore()

const bgClass = computed(() => {
  if (eventsStore.activeCrisis) return 'bg-red-50'
  if (eventsStore.hreActive) return 'bg-green-50'
  return 'bg-gray-50'
})
</script>
