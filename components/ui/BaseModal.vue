<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />
        <div class="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col animate-slide-up">
          <div class="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
            <button @click="$emit('update:modelValue', false)" class="p-2 text-gray-400 hover:text-gray-600 rounded-xl active:bg-gray-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="overflow-y-auto flex-1 p-4">
            <slot />
          </div>
          <div v-if="$slots.footer" class="p-4 border-t border-gray-100">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; title: string }>()
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
