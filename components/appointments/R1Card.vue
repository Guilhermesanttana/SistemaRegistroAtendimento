<template>
  <div
    class="rounded-3xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer select-none relative overflow-hidden transition-all duration-200"
    :class="[swiped ? 'bg-red-600 scale-95' : 'bg-red-500']"
    style="min-height: 110px; touch-action: pan-y;"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div
      class="absolute inset-0 flex items-center justify-start pl-6 transition-opacity duration-200"
      :style="{ opacity: swipeProgress > 0.3 ? swipeProgress : 0 }"
    >
      <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </div>

    <span class="text-white font-black text-4xl tracking-tight relative z-10">R1</span>
    <span class="text-red-100 text-sm font-medium relative z-10">Crise Severa</span>
    <span class="text-red-200 text-xs mt-1 relative z-10">Deslize para esquerda →</span>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ register: [] }>()
const swiped = ref(false)
const swipeProgress = ref(0)
let startX = 0
const SWIPE_THRESHOLD = 80

function onTouchStart(event: TouchEvent) {
  startX = event.touches[0].clientX
  swipeProgress.value = 0
}

function onTouchMove(event: TouchEvent) {
  const diff = startX - event.touches[0].clientX
  if (diff > 0) {
    swipeProgress.value = Math.min(diff / SWIPE_THRESHOLD, 1)
  }
}

function onTouchEnd(event: TouchEvent) {
  const diff = startX - event.changedTouches[0].clientX
  if (diff >= SWIPE_THRESHOLD) {
    swiped.value = true
    emit('register')
    setTimeout(() => {
      swiped.value = false
      swipeProgress.value = 0
    }, 500)
  } else {
    swipeProgress.value = 0
  }
}
</script>
