<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <textarea
      :id="id"
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      class="input-field resize-none"
      :rows="rows"
    />
  </div>
</template>

<script setup lang="ts">
let counter = 0
const id = `textarea-${++counter}-${Math.random().toString(36).slice(2, 7)}`
withDefaults(defineProps<{ modelValue?: string; label?: string; rows?: number }>(), { rows: 4 })
defineEmits(['update:modelValue'])
</script>
