<template>
  <div class="text-center">
    <p class="text-sm text-gray-500 uppercase tracking-wide font-medium">Tempo de Atendimento</p>
    <p class="text-4xl font-mono font-bold text-gray-900 mt-1">{{ timer.formatted.value }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ startedAt: string }>()
const timer = useTimer(props.startedAt)
</script>
