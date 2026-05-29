<template>
  <div class="space-y-4">
    <div class="card p-4 grid grid-cols-2 gap-4">
      <div class="text-center">
        <p class="text-2xl font-bold text-gray-900">{{ formattedDuration }}</p>
        <p class="text-xs text-gray-500 mt-1">Duração Total</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-gray-900">{{ totalEvents }}</p>
        <p class="text-xs text-gray-500 mt-1">Eventos Totais</p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-3">
      <div class="bg-red-50 rounded-2xl p-3 text-center">
        <p class="text-3xl font-black text-red-600">{{ r1Count }}</p>
        <p class="text-xs text-red-500 font-medium mt-1">R1</p>
      </div>
      <div class="bg-amber-50 rounded-2xl p-3 text-center">
        <p class="text-3xl font-black text-amber-600">{{ r2Count }}</p>
        <p class="text-xs text-amber-500 font-medium mt-1">R2</p>
      </div>
      <div class="bg-green-50 rounded-2xl p-3 text-center">
        <p class="text-3xl font-black text-green-600">{{ hreCount }}</p>
        <p class="text-xs text-green-500 font-medium mt-1">HRE</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppointmentEvent } from '~/types'

const props = defineProps<{
  durationSeconds: number
  events: AppointmentEvent[]
}>()

const r1Count = computed(() => props.events.filter((event) => event.event_type === 'R1_START').length)
const r2Count = computed(() => props.events.filter((event) => event.event_type === 'R2').length)
const hreCount = computed(() => props.events.filter((event) => event.event_type === 'HRE').length)
const totalEvents = computed(() => r1Count.value + r2Count.value + hreCount.value)

const formattedDuration = computed(() => {
  const h = Math.floor(props.durationSeconds / 3600)
  const m = Math.floor((props.durationSeconds % 3600) / 60)
  const s = props.durationSeconds % 60

  if (h > 0) return `${h}h ${m}m`
  return `${m}m ${s}s`
})
</script>
