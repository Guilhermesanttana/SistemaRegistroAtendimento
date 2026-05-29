<template>
  <button
    v-bind="$attrs"
    :disabled="disabled || loading"
    :class="[baseClass, variantClass, sizeClass, { 'opacity-60 cursor-not-allowed': disabled || loading }]"
    class="flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-150 active:scale-95"
  >
    <LoadingSpinner v-if="loading" size="sm" />
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
})

const baseClass = computed(() => props.fullWidth ? 'w-full' : '')

const variantClass = computed(() => ({
  primary: 'bg-green-600 text-white active:bg-green-700',
  secondary: 'bg-gray-100 text-gray-700 active:bg-gray-200',
  danger: 'bg-red-600 text-white active:bg-red-700',
  warning: 'bg-amber-500 text-white active:bg-amber-600',
  ghost: 'bg-transparent text-gray-600 active:bg-gray-100',
}[props.variant]))

const sizeClass = computed(() => ({
  sm: 'py-2 px-4 text-sm',
  md: 'py-4 px-6 text-base',
  lg: 'py-5 px-8 text-lg',
}[props.size]))
</script>
