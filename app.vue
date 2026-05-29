<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
await authStore.initialize()
</script>
