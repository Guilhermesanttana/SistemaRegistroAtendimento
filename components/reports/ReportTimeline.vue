<template>
  <div class="space-y-2">
    <h3 class="section-title px-1">Timeline</h3>
    <div class="card divide-y divide-gray-50">
      <div
        v-for="item in timelineItems"
        :key="item.id"
        class="p-3 flex items-start gap-3"
      >
        <div class="flex-shrink-0 mt-0.5">
          <span :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', item.style.bg, item.style.text]">
            {{ item.style.label }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <span :class="['text-sm font-semibold', item.style.text]">{{ item.title }}</span>
            <span class="text-xs text-gray-400 flex-shrink-0">{{ formatTime(item.date) }}</span>
          </div>
          <p v-if="item.description" class="text-xs text-gray-600 mt-0.5 whitespace-pre-line">{{ item.description }}</p>
          <div v-if="item.behaviors?.length" class="flex flex-wrap gap-1 mt-1">
            <span
              v-for="behavior in item.behaviors"
              :key="behavior.id"
              class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
            >
              {{ behavior.behavior_type?.nome }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="timelineItems.length === 0" class="p-6 text-center text-sm text-gray-500">
        Nenhum evento registrado.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppointmentEvent, AppointmentNote } from '~/types'

const props = defineProps<{
  events: AppointmentEvent[]
  notes: AppointmentNote[]
}>()

const timelineItems = computed(() => {
  const eventItems = props.events.map((event) => ({
    id: `event-${event.id}`,
    date: event.occurred_at,
    title: eventLabel(event.event_type),
    description: event.notes,
    behaviors: event.behaviors,
    style: eventStyle(event.event_type)
  }))

  const noteItems = props.notes.map((note) => ({
    id: `note-${note.id}`,
    date: note.noted_at,
    title: 'Observação',
    description: note.content,
    behaviors: [],
    style: eventStyle('NOTE')
  }))

  return [...eventItems, ...noteItems].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

function eventStyle(type: string) {
  return {
    HRE: { bg: 'bg-green-100', text: 'text-green-700', label: 'H' },
    R1_START: { bg: 'bg-red-100', text: 'text-red-700', label: 'R1' },
    R1_END: { bg: 'bg-red-50', text: 'text-red-400', label: '↓' },
    R2: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'R2' },
    NOTE: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'N' },
  }[type] || { bg: 'bg-gray-100', text: 'text-gray-700', label: '?' }
}

function eventLabel(type: string) {
  return {
    HRE: 'HRE - Engajado',
    R1_START: 'Crise R1 - Início',
    R1_END: 'Crise R1 - Fim',
    R2: 'Comportamento R2',
    NOTE: 'Observação',
  }[type] || type
}
</script>
