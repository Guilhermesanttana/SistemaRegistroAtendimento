<template>
  <div class="bg-white border-t border-gray-100 p-3">
    <div class="flex gap-2 items-end">
      <div class="flex-1">
        <textarea
          v-model="noteText"
          placeholder="Observação rápida..."
          rows="2"
          class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          @keydown.enter.ctrl="submit"
        />
      </div>
      <button type="button" class="p-3 bg-gray-100 rounded-xl text-gray-400 flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>
      <button
        type="button"
        @click="submit"
        :disabled="!noteText.trim() || loading"
        class="p-3 bg-green-600 rounded-xl text-white flex-shrink-0 disabled:opacity-40 active:bg-green-700"
      >
        <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <LoadingSpinner v-else size="sm" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ save: [string] }>()
const noteText = ref('')
const loading = ref(false)

async function submit() {
  if (!noteText.value.trim()) return

  loading.value = true

  try {
    emit('save', noteText.value.trim())
    noteText.value = ''
  } finally {
    loading.value = false
  }
}
</script>
