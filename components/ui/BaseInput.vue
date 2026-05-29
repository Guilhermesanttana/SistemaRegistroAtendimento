<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <input
      :id="id"
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="input-field"
      :class="{ 'border-red-400 focus:ring-red-500': error }"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

let counter = 0
const id = `input-${++counter}-${Math.random().toString(36).slice(2, 7)}`
defineProps<{ modelValue?: string; label?: string; error?: string }>()
defineEmits(['update:modelValue'])
</script>
