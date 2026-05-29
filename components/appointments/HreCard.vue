<template>
  <div
    class="relative rounded-3xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer select-none transition-all duration-300 overflow-hidden"
    :class="isActive ? 'bg-green-500 shadow-lg shadow-green-200' : 'bg-green-600'"
    :style="{ minHeight: '120px' }"
    @touchstart.prevent="onPressStart"
    @touchend.prevent="onPressEnd"
    @mousedown="onPressStart"
    @mouseup="onPressEnd"
    @mouseleave="onPressEnd"
  >
    <div v-if="pressing" class="absolute inset-0 flex items-center justify-center">
      <svg class="w-full h-full absolute inset-0 opacity-20" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="white"
          stroke-width="4"
          stroke-dasharray="301.6"
          :stroke-dashoffset="301.6 - (progress / 100) * 301.6"
          stroke-linecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
    </div>

    <span class="text-white font-black text-5xl tracking-tight relative z-10">HRE</span>
    <span class="text-green-100 text-sm font-medium relative z-10 text-center">Happy, Relaxed &amp; Engaged</span>
    <span v-if="!pressing" class="text-green-200 text-xs mt-1 relative z-10">Pressione por 2 segundos</span>
    <span v-else class="text-white text-sm font-semibold relative z-10">Aguarde...</span>

    <div v-if="isActive" class="absolute inset-0 rounded-3xl bg-green-400 animate-ping opacity-30" />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ register: [] }>()

const pressing = ref(false)
const progress = ref(0)
const isActive = ref(false)
let pressTimer: ReturnType<typeof setInterval> | null = null
let startTime: number | null = null
const PRESS_DURATION = 2000

function clearPressTimer() {
  if (pressTimer) {
    clearInterval(pressTimer)
    pressTimer = null
  }
}

function onPressStart() {
  if (pressing.value) return

  pressing.value = true
  progress.value = 0
  startTime = Date.now()

  pressTimer = setInterval(() => {
    const elapsed = Date.now() - (startTime || 0)
    progress.value = Math.min((elapsed / PRESS_DURATION) * 100, 100)

    if (elapsed >= PRESS_DURATION) {
      clearPressTimer()
      pressing.value = false
      isActive.value = true
      emit('register')
      setTimeout(() => {
        isActive.value = false
      }, 3000)
    }
  }, 50)
}

function onPressEnd() {
  if (!pressing.value) return
  pressing.value = false
  progress.value = 0
  clearPressTimer()
}

onUnmounted(clearPressTimer)
</script>
